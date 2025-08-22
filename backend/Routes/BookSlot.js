// routes/slotRoutes.js
const express = require('express');
const Slot = require('../Schemas/new_SlotSchema');
// const Slot = require('../Schemas/studentSlot');
const router = express.Router();

router.post('/student/book-slot', async (req, res) => {
  const { Slot_id, Student_id } = req.body;

  try {
  
    const selectedSlot = await Slot.findOne({ _id:Slot_id });

    if (!selectedSlot) {
      return res.status(404).send({ message: "Slot not found" });
    }
    if (selectedSlot.booked_students.includes(Student_id)) {
      return res.status(400).send({ message: "Student already booked this slot" });
    }
    selectedSlot.booked_students.push(Student_id);
    const saved = await selectedSlot.save();

    return res.status(200).send({ message: "Slot booked successfully", slot: saved });
  } catch (err) {
    console.error("Error booking slot:", err);
    return res.status(500).send({ message: "Error occurred while booking slot" });
  }
});

router.post('/student/my-bookings', async (req, res) => {
  const { Student_id } = req.body;

  try {
    // Find all slots booked by this student
    const bookedSlots = await Slot.find({ booked_students: Student_id });

    if (!bookedSlots.length) {
      return res.status(404).json({ message: "No bookings found for this student" });
    }
    const bookedSlotIds = bookedSlots.map(slot => slot._id);

    const slots = await Slot.find({ _id: { $in: bookedSlotIds } });

    res.json(slots);
  } catch (err) {
    console.error("Error fetching student's bookings:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});




module.exports = router;
