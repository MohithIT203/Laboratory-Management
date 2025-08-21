// src/components/teachertable.jsx
import React from 'react';
import { Pencil, Trash2 } from "lucide-react"; 
import './teachertable.css'; // optional: for styling

export default function TeacherTable({ data, onDelete, onEdit }) {
  return (
    <div className="table-wrapper">
    <table className="teacher-table">
      <thead>
        <tr>
          <th>Name</th>
          <th>ID</th>
          <th>Email</th>
          <th>Department</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {data.map(teacher => (
          <tr key={teacher.staff_id}>
            <td>{teacher.staff_name}</td>
            <td>{teacher.staff_id}</td>
            <td>{teacher.email}</td>
            <td>{teacher.dept}</td>
            <td>
              <button className="edit-btn" onClick={() => onEdit(teacher)}>
              <Pencil size={16} strokeWidth={2} />
              </button>
              <button className="delete-btn" onClick={() => onDelete(teacher.staff_id)}>
              <Trash2 size={16} strokeWidth={2} />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
    </div>
  );
}
