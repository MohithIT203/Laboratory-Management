//addpopup.jsx
import React from 'react';
import './addpopup.css';

export default function AddPopup({ title, onClose, onSave, values, setValues, fields }) {
  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  return (
    <div className="popup-overlay">
      <div className="popup-box">
        <h3>{title}</h3>
        {fields.map((field) => (
          <input
            key={field}
            type="text"
            name={field}
            value={values[field] || ''}
            onChange={handleChange}
            placeholder={field.replace(/_/g, ' ').toUpperCase()}
            className="popup-input"
          />
        ))}
        <div className="popup-buttons">
          <button onClick={onSave} className="popup-save">Save</button>
          <button onClick={onClose} className="popup-close">Cancel</button>
        </div>
      </div>
    </div>
  );
}
