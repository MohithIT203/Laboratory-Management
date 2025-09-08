import React from 'react';
import { Pencil, Trash2 } from "lucide-react"; 
import '../TeacherTable/TeacherTable.css';

export default function TeacherTable({ data, onDelete, onEdit }) {
  return (
    <div className="table-wrapper">
      <table className="teacher-table">
        <thead>
          <tr>
            <th>S.No</th>
            <th>Name</th>
            <th>Staff ID</th>
            <th>Email</th>
            <th>Department</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((teacher, index) => (
              <tr key={teacher.Staff_id}>
                <td>{index + 1}</td>
                <td>{teacher.Staff_name.toUpperCase()}</td>
                <td>{teacher.Staff_id}</td>
                <td>{teacher.email}</td>
                <td>{teacher.dept}</td>
                <td>
                  <button className="edit-btn" onClick={() => onEdit(teacher)}>
                    <Pencil size={16} strokeWidth={2} />
                  </button>
                  <button className="delete-btn" onClick={() => onDelete(teacher._id)}>
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
