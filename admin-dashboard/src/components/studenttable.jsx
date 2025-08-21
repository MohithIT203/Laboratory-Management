//studenttable.jsx
import React from 'react';
import { Pencil, Trash2 } from "lucide-react"; 
import './teachertable.css'; // optional: for styling

export default function StudentTable({ data, onDelete ,onEdit}) {
  return (
    <div className="table-wrapper">
      <table className="teacher-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Reg No</th>
            <th>Email</th>
            <th>Department</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((student, index) => (
            <tr key={index}>
              <td>{student.stu_name}</td>
              <td>{student.reg_no}</td>
              <td>{student.email}</td>
              <td>{student.dept}</td>
              <td>
                <button className="edit-btn" onClick={() => onEdit(student)}>
                <Pencil size={16} strokeWidth={2} />
                </button>
                <button className="delete-btn" onClick={() => onDelete(student.reg_no)}>
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
