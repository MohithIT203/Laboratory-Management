import React from 'react';
import { Trash2 } from "lucide-react"; 
import './teachertable.css'; // Reuse same CSS styling

export default function LocationTable({ data, onDelete }) {
  return (
    <div className="table-wrapper">
      <div className="teacher-table">
        <table>
          <thead>
            <tr>
              <th>Lab Name</th>
              {/* <th>Department</th> */}
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.length>0 && data.map((location, index) => (
              <tr key={index}>
                <td>{location.name}</td>
                {/* <td>{location.departmen}</td> */}
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
