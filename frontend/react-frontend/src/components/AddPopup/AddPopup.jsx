import React from "react";
import { Modal, Box } from "@mui/material";

export default function AddPopup({
  title,
  open,
  onClose,
  onSave,
  values,
  setValues,
  fields,
}) {
  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave();
  };

  const formatLabel = (text) => {
    const formatted = text.replace(/_/g, " ").toLowerCase();
    return formatted.charAt(0).toUpperCase() + formatted.slice(1);
  };

  const styleModal = {
    position: "absolute",
    display: "flex",
    flexDirection: "column",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: { xs: "90vw", sm: 400 },
    maxHeight: "80vh",
    overflowY: "auto",
    bgcolor: "background.paper",
    border: "0px solid #000",
    boxShadow: 24,
    p: 3,
    borderRadius: "8px",
    fontFamily: "Inter, sans-serif",
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={styleModal}>
        <h2>{title}</h2>
        <form onSubmit={handleSubmit}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "6px",
              fontFamily: "Inter, sans-serif",
            }}
          >
            {fields.map((field) => (
              <label
                key={field}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  maxWidth: "380px",
                }}
              >
                {formatLabel(field)}:
                {formatLabel(field) !== "Exp description" ? (
                  <input
                    type="text"
                    name={field}
                    value={values[field] || ""}
                    onChange={handleChange}
                    style={{
                      padding: "6px 8px",
                      borderRadius: "5px",
                      border: "1px solid #ccc",
                      marginTop: "3px",
                      marginBottom: "3px",
                      height: "20px",
                      fontFamily: "Inter, sans-serif",
                      fontSize: "14px",
                    }}
                    required
                  />
                ) : (
                  <textarea
                    name={field}
                    value={values[field] || ""}
                    onChange={handleChange}
                    style={{
                      padding: "6px 8px",
                      borderRadius: "5px",
                      border: "1px solid #ccc",
                      marginTop: "3px",
                      marginBottom: "3px",
                      minHeight: "60px",
                      maxHeight:"100px",
                      maxWidth:"100%",
                      minWidth:"100%",
                      fontFamily: "Inter, sans-serif",
                      fontSize: "14px",
                    }}
                    required
                  />
                )}
              </label>
            ))}
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "flex-start",
              gap: "10px",
              marginTop: "20px",
            }}
          >
            <button
              type="submit"
              style={{
                width: "100px",
                height: "40px",
                backgroundColor: "#10b981",
                color: "white",
                borderRadius: "5px",
                border: "none",
                cursor: "pointer",
                fontFamily: "Inter, sans-serif",
              }}
            >
              Save
            </button>
            <button
              type="button"
              onClick={onClose}
              style={{
                width: "100px",
                height: "40px",
                backgroundColor: "#ccc",
                color: "#333",
                borderRadius: "5px",
                border: "none",
                cursor: "pointer",
                fontFamily: "Inter, sans-serif",
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      </Box>
    </Modal>
  );
}
