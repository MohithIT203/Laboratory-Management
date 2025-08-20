const mongoose = require('mongoose');

const SlotSchema = new mongoose.Schema({
  Slot_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  Student_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  isBooked: {
    type: Boolean,
    required: true
  }
});

const Slots = mongoose.model("Student_Slot", SlotSchema);
module.exports = Slots;
