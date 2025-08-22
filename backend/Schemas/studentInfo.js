const mongoose = require("mongoose");

const slot_schema = new mongoose.Schema({
  slotId: { type: String, required: true },
  attendance: { type: String, enum: ["present", "absent"], default: "absent" },
  marks: { type: Number, default: 0 },
});
const Student = new mongoose.Schema({
  email: {
    type: mongoose.Schema.Types.String,
    required: true,
    unique: true,
  },
  Student_name: {
    type: mongoose.Schema.Types.String,
    required: true,
  },
  regno: {
    type: mongoose.Schema.Types.String,
    required: true,
  },
  dept: {
    type: mongoose.Schema.Types.String,
    required: true,
  },
  slots: {
    type: [slot_schema],
    required: false,
    default: [],
  },
});

const StudentSchema = mongoose.model("Student", Student);
module.exports = StudentSchema;
