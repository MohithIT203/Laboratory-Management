import React, { useState, useEffect } from 'react';
import { teacherSlots, studentBookings } from '../data/dummydata';
import FilterBar from '../components/filterbar';
import TeacherTable from '../components/teachertable';
import StudentTable from '../components/studenttable';
import AddPopup from '../components/addpopup';
import { isToday, isThisWeek } from 'date-fns';
import './adminname.css';

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
  const [searchTeacher, setSearchTeacher] = useState("");
const [searchStudent, setSearchStudent] = useState("");
const [editTeacherId, setEditTeacherId] = useState(null);
const [editStudentId, setEditStudentId] = useState(null);


  useEffect(() => {
    filterData();
  }, [filter]);

  const filterData = () => {
    const filteredTeachers = teacherSlots.filter(slot => {
      const matchFilter = filter === "today"
        ? isToday(new Date(slot.created || new Date()))
        : filter === "week"
        ? isThisWeek(new Date(slot.created || new Date()))
        : true;
      const matchSearch = Object.values(slot).some(value =>
        String(value).toLowerCase().includes(teacherSearch.toLowerCase())
      );
      return matchFilter && matchSearch;
    });

    const filteredStudents = studentBookings.filter(slot => {
      const matchFilter = filter === "today"
        ? isToday(new Date(slot.created || new Date()))
        : filter === "week"
        ? isThisWeek(new Date(slot.created || new Date()))
        : true;
      const matchSearch = Object.values(slot).some(value =>
        String(value).toLowerCase().includes(studentSearch.toLowerCase())
      );
      return matchFilter && matchSearch;
    });

    setTeachers(filteredTeachers);
    setStudents(filteredStudents);
  };

  useEffect(() => {
    filterData();
  }, [teacherSearch, studentSearch]);

  const handleAddTeacher = () => {
  if (editTeacherId !== null) {
    const index = teacherSlots.findIndex(t => t.staff_id === editTeacherId);
    if (index !== -1) {
      teacherSlots[index] = { ...newTeacher, staff_id: editTeacherId };
    }
  } else {
    const newEntry = { ...newTeacher, created: new Date().toISOString() };
    teacherSlots.push(newEntry);
  }
  setNewTeacher({});
  setShowTeacherPopup(false);
  setEditTeacherId(null);
  filterData();
};

const handleAddStudent = () => {
  if (editStudentId !== null) {
    const index = studentBookings.findIndex(s => s.reg_no === editStudentId);
    if (index !== -1) {
      studentBookings[index] = { ...newStudent, reg_no: editStudentId };
    }
  } else {
    const newEntry = { ...newStudent, created: new Date().toISOString() };
    studentBookings.push(newEntry);
  }
  setNewStudent({});
  setShowStudentPopup(false);
  setEditStudentId(null);
  filterData();
};
const handleEditTeacher = (teacher) => {
  setNewTeacher(teacher);
  setEditTeacherId(teacher.staff_id);
  setShowTeacherPopup(true);
};

const handleEditStudent = (student) => {
  setNewStudent(student);
  setEditStudentId(student.reg_no);
  setShowStudentPopup(true);
};


  const handleDeleteTeacher = (id) => {
    const index = teacherSlots.findIndex(t => t.staff_id === id);
    if (index !== -1) {
      teacherSlots.splice(index, 1);
      filterData();
    }
  };

  const handleDeleteStudent = (id) => {
    const index = studentBookings.findIndex(s => s.reg_no === id);
    if (index !== -1) {
      studentBookings.splice(index, 1);
      filterData();
    }
  };

  return (
  <div className="admin-dashboard">
    <div className="dashboard-header">
      <h2>Admin Dashboard</h2>
      <div className="filter-bar">
        <FilterBar setFilter={setFilter} />
      </div>
    </div>

    {/* Teachers Section */}
    <div className="section">
      <div className="section-header">
        <h3>Teachers</h3>
        <button className="add-btn" onClick={() => {
          setEditTeacherId(null);  // Ensure it's not editing
          setNewTeacher({});
          setShowTeacherPopup(true);
        }}>+</button>
      </div>
      <input
        type="text"
        placeholder="Search Teacher..."
        value={teacherSearch}
        onChange={(e) => setTeacherSearch(e.target.value)}
      />
      <TeacherTable
        data={teachers}
        onDelete={handleDeleteTeacher}
        onEdit={handleEditTeacher} // ✅ Added this
      />
    </div>

    {/* Students Section */}
    <div className="section">
      <div className="section-header">
        <h3>Students</h3>
        <button className="add-btn" onClick={() => {
          setEditStudentId(null);  // Ensure it's not editing
          setNewStudent({});
          setShowStudentPopup(true);
        }}>+</button>
      </div>
      <input
        type="text"
        placeholder="Search Student..."
        value={studentSearch}
        onChange={(e) => setStudentSearch(e.target.value)}
      />
      <StudentTable
        data={students}
        onDelete={handleDeleteStudent}
        onEdit={handleEditStudent} // ✅ Added this
      />
    </div>

    {/* Teacher Popup */}
    {showTeacherPopup && (
      <AddPopup
        title={editTeacherId ? "Edit Teacher" : "Add New Teacher"} // Change title dynamically
        onClose={() => setShowTeacherPopup(false)}
        onSave={handleAddTeacher}
        values={newTeacher}
        setValues={setNewTeacher}
        fields={["staff_name", "staff_id", "email", "dept"]}
      />
    )}

    {/* Student Popup */}
    {showStudentPopup && (
      <AddPopup
        title={editStudentId ? "Edit Student" : "Add New Student"} // Change title dynamically
        onClose={() => setShowStudentPopup(false)}
        onSave={handleAddStudent}
        values={newStudent}
        setValues={setNewStudent}
        fields={["stu_name", "reg_no", "email", "dept"]}
      />
    )}
  </div>
);

}
