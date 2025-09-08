// studenttable.jsx
import React from 'react';
import { Pencil, Trash2 } from "lucide-react"; 
import '../TeacherTable/TeacherTable.css'; // reuse styles

export default function StudentTable({ data, onDelete, onEdit }) {
  return (
    <div className="table-wrapper">
      <table className="teacher-table">
        <thead>
          <tr>
            <th>S.No</th>
            <th>Name</th>
            <th>Reg No</th>
            <th>Email</th>
            <th>Department</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((student, index) => (
              <tr key={student._id || index}>
                <td>{index + 1}</td>
                <td>{student.Student_name.toUpperCase()}</td>
                <td>{student.regno}</td>
                <td>{student.email}</td>
                <td>{student.dept}</td>
                <td>
                  <button className="edit-btn" onClick={() => onEdit(student)}>
                    <Pencil size={16} strokeWidth={2} />
                  </button>
                  <button className="delete-btn" onClick={() => onDelete(student._id)}>
                    <Trash2 size={16} strokeWidth={2} />
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" style={{ textAlign: "center", padding: "40px" }}>
                No data found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
