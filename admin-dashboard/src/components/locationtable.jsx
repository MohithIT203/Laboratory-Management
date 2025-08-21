import React from 'react';
import { Pencil, Trash2 } from "lucide-react"; 
import './teachertable.css'; // reuse same css

export default function LocationTable({ data, onDelete, onEdit }) {
  return (
    <div className="table-wrapper">
      <div className="teacher-table">
        <table>
          <thead>
            <tr>
              <th>Lab Name</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map((location, index) => (
              <tr key={index}>
                <td>{location.lab_name}</td>
                <td>
                  
                  <button 
                    className="delete-btn" 
                    onClick={() => onDelete(location.lab_name)}
                  >
                    <Trash2 size={16} strokeWidth={2} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
