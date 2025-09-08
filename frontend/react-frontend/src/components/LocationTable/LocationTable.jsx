import React from 'react';
import { Trash2 } from "lucide-react"; 
import AddPopup from "../AddPopup/AddPopup"; 
import '../TeacherTable/TeacherTable.css'

export default function LocationTable({ data, pagination,onDelete }) {
  return (
    <div className="table-wrapper">
      <div className="teacher-table">
        <table>
          <thead>
            <tr>
              <th>S.No</th>
              <th>Lab Name</th>
              {/* <th>Department</th> */}
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.length>0 && data.map((location, index) => (
              <tr key={index}>
                <td>{(pagination - 1) * 5 + (index + 1)}</td>
                <td>{location.Lab_name}</td>
                {/* <td>{location.departmen}</td> */}
                <td>
                  <button 
                    className="delete-btn" 
                    onClick={() => onDelete(location._id)}
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
