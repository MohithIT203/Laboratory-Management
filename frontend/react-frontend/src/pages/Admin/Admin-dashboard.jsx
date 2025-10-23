import React, { useState, useEffect } from 'react';
import axios from "axios";
// import FilterBar from '../components/filterbar';
import TeacherTable from '../../components/TeacherTable/TeacherTable'
import StudentTable from '../../components/StudentTable/StudentTable';
import AddPopup from '../../components/AddPopup/AddPopup';
import { isToday, isThisWeek } from 'date-fns';
import { FaSearch } from "react-icons/fa"; 
import './Admin-dashboard.css';
import AdminAppBar from '../../components/Admin_navbar';
import toast from 'react-hot-toast';

export default function AdminMain() {
  const [filter, setFilter] = useState("all");
  const [teachers, setTeachers] = useState([]);
  const [students, setStudents] = useState([]);
  const [showTeacherPopup, setShowTeacherPopup] = useState(false);
  const [showStudentPopup, setShowStudentPopup] = useState(false);
  const [newTeacher, setNewTeacher] = useState({});
  const [newStudent, setNewStudent] = useState({});
  const [teacherSearch, setTeacherSearch] = useState("");
  const [studentSearch, setStudentSearch] = useState("");
  const [editTeacherId, setEditTeacherId] = useState(null);
  const [editStudentId, setEditStudentId] = useState(null);
  const [teacherDeptFilter, setTeacherDeptFilter] = useState("all");
  const [studentDeptFilter, setStudentDeptFilter] = useState("all");

  // Pagination states
  const [teacherPage, setTeacherPage] = useState(1);
  const teachersPerPage = 5;
  const [studentPage, setStudentPage] = useState(1);
  const studentsPerPage = 5;

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_SERVER_APP_URL}/Admin/all-faculties`);
      setTeachers(res.data);
      
    } catch (err) {
      console.error("Error fetching teachers:", err);
    }
  };

  const handleAddTeacher = async () => {
    try {
      if (editTeacherId !== null) {
        await axios.put(`${import.meta.env.VITE_SERVER_APP_URL}/admin/all-faculties/${editTeacherId}`, newTeacher);
      } else {
        await axios.post(`${import.meta.env.VITE_SERVER_APP_URL}/admin/all-faculties`, newTeacher);
      }
      setNewTeacher({});
      setShowTeacherPopup(false);
      setEditTeacherId(null);
      toast.success("Updated Data Successfully!!");
      fetchTeachers();
    } catch (err) {
      console.error("Error saving teacher:", err);
      toast.error("Error Updating Data");
    }
  };

  const handleEditTeacher = (teacher) => {
    setNewTeacher(teacher);
    setEditTeacherId(teacher._id);
    setShowTeacherPopup(true);
  };

  const handleDeleteTeacher = async (id) => {
    try {
      await axios.delete(`${import.meta.env.VITE_SERVER_APP_URL}/admin/all-faculties/${id}`);
      fetchTeachers();
      toast.success("Deleted Successfully!!");
    } catch (err) {
      console.error("Error deleting teacher:", err);
      toast.error("Error Deleting Teacher")
    }
  };

  useEffect(() => setTeacherPage(1), [teacherDeptFilter, teacherSearch]);


  useEffect(() => {
    fetchStudents();
  }, [filter]);

  const fetchStudents = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_SERVER_APP_URL}/admin/all-students`);
      let data = res.data;

      data = data.filter(slot => {
        const matchFilter =
          filter === "today"
            ? isToday(new Date(slot.createdAt || new Date()))
            : filter === "week"
            ? isThisWeek(new Date(slot.createdAt || new Date()))
            : true;

        const matchSearch = Object.values(slot).some(value =>
          String(value).toLowerCase().includes(studentSearch.toLowerCase())
        );

        return matchFilter && matchSearch;
      });

      setStudents(data);
    } catch (err) {
      console.error("Error fetching students:", err);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [studentSearch]);

  const handleAddStudent = async () => {
    try {
      if (editStudentId !== null) {
        await axios.put(`${import.meta.env.VITE_SERVER_APP_URL}/admin/all-students/${editStudentId}`, newStudent);
      } else {
        await axios.post(`${import.meta.env.VITE_SERVER_APP_URL}/admin/all-students`, newStudent);
      }
      setNewStudent({});
      setShowStudentPopup(false);
      setEditStudentId(null);
      toast.success("Updated Data Successfully!!");
      fetchStudents();
    } catch (err) {
      console.error("Error saving student:", err);
      toast.error("Error Saving Data");
    }
  };

  const handleEditStudent = (student) => {
    setNewStudent(student);
    setEditStudentId(student._id);
    setShowStudentPopup(true);
  };

  const handleDeleteStudent = async (id) => {
    try {
      await axios.delete(`${import.meta.env.VITE_SERVER_APP_URL}/Admin/all-students/${id}`);
      toast.success("Deleted Successfully!!");
      fetchStudents();
    } catch (err) {
      console.error("Error deleting student:", err);
      toast.success("Error Deleting Student");
    }
  };

  useEffect(() => setStudentPage(1), [studentDeptFilter, studentSearch]);


  const filteredTeachers = teachers
    .filter(t =>
      (teacherDeptFilter === "all" || t.dept === teacherDeptFilter) &&
      t.Staff_name.toLowerCase().includes(teacherSearch.toLowerCase())
    );
  const paginatedTeachers = filteredTeachers.slice(
    (teacherPage - 1) * teachersPerPage,
    teacherPage * teachersPerPage
  );

  const filteredStudents = students
    .filter(s =>
      (studentDeptFilter === "all" || s.dept === studentDeptFilter) &&
      Object.values(s).some(value =>
        String(value).toLowerCase().includes(studentSearch.toLowerCase())
      )
    );
  const paginatedStudents = filteredStudents.slice(
    (studentPage - 1) * studentsPerPage,
    studentPage * studentsPerPage
  );

  return (
    <>
    <AdminAppBar/>
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h2>Admin Dashboard</h2>
        <div className="filter-bar">
          {/* <FilterBar setFilter={setFilter} /> */}
        </div>
      </div>

      {/* Teachers Section */}
      <div className="section">
        <div className="section-header">
          <h3>Teachers</h3>
          <button
            className="add-btn"
            onClick={() => {
              setEditTeacherId(null);
              setNewTeacher({});
              setShowTeacherPopup(true);
            }}
          >
            +
          </button>
        </div>

        <div className="search-filter">
          <div className="search-wrapper">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search Teacher..."
              value={teacherSearch}
              className="search-bar"
              onChange={(e) => setTeacherSearch(e.target.value)}
            />
          </div>

          <select
            className="dept-filter"
            value={teacherDeptFilter}
            onChange={(e) => setTeacherDeptFilter(e.target.value)}
          >
            <option value="all">All Departments</option>
            <option value="CSE">CSE</option>
            <option value="ECE">ECE</option>
            <option value="MECH">MECH</option>
            <option value="EEE">EEE</option>
            <option value="IT">IT</option>
          </select>
        </div>

        <TeacherTable
          data={paginatedTeachers}
          onDelete={handleDeleteTeacher}
          onEdit={handleEditTeacher}
        />

        {/* Teacher Pagination */}
        <div className="pagination-container">
          <div className="pagination-buttons">
            <button
              className="pagination-btn"
              disabled={teacherPage === 1}
              onClick={() => setTeacherPage(prev => prev - 1)}
            >
              Previous
            </button>
            <span className="page-number">Page {teacherPage}/{Math.ceil(filteredTeachers.length/teachersPerPage)}</span>
            <button
              className="pagination-btn"
              disabled={teacherPage >= Math.ceil(filteredTeachers.length / teachersPerPage)}
              onClick={() => setTeacherPage(prev => prev + 1)}
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Students Section */}
      <div className="section">
        <div className="section-header">
          <h3>Students</h3>
          <button
            className="add-btn"
            onClick={() => {
              setEditStudentId(null);
              setNewStudent({});
              setShowStudentPopup(true);
            }}
          >
            +
          </button>
        </div>

        <div className="search-filter">
          <div className="search-wrapper">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search Student..."
              className="search-bar"
              value={studentSearch}
              onChange={(e) => setStudentSearch(e.target.value)}
            />
          </div>

          <select
            className="dept-filter"
            value={studentDeptFilter}
            onChange={(e) => setStudentDeptFilter(e.target.value)}
          >
            <option value="all">All Departments</option>
            <option value="CSE">CSE</option>
            <option value="ECE">ECE</option>
            <option value="MECH">MECH</option>
            <option value="EEE">EEE</option>
            <option value="EEE">IT</option>
          </select>
        </div>

        <StudentTable
          data={paginatedStudents}
          onDelete={handleDeleteStudent}
          onEdit={handleEditStudent}
        />

        {/* Student Pagination */}
        <div className="pagination-container">
          <div className="pagination-buttons">
            <button
              className="pagination-btn"
              disabled={studentPage === 1}
              onClick={() => setStudentPage(prev => prev - 1)}
            >
              Previous
            </button>
            <span className="page-number">Page {studentPage}/{Math.ceil(filteredStudents.length/studentsPerPage)}</span>
            <button
              className="pagination-btn"
              disabled={studentPage >= Math.ceil(filteredStudents.length / studentsPerPage)}
              onClick={() => setStudentPage(prev => prev + 1)}
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Teacher Popup */}
      <AddPopup
        title={editTeacherId ? "Edit Teacher" : "Add New Teacher"}
        open={showTeacherPopup}
        onClose={() => setShowTeacherPopup(false)}
        onSave={handleAddTeacher}
        values={newTeacher}
        setValues={setNewTeacher}
        fields={["Staff_name", "Staff_id", "email", "dept"]}
      />

      {/* Student Popup */}
      <AddPopup
        title={editStudentId ? "Edit Student" : "Add New Student"}
        open={showStudentPopup}
        onClose={() => setShowStudentPopup(false)}
        onSave={handleAddStudent}
        values={newStudent}
        setValues={setNewStudent}
        fields={["Student_name", "regno", "email", "dept"]}
      />
</div>
</>
);
}
