// routes/slotRoutes.js
const express = require('express');
const Slot = require('../Schemas/studentSlot');
const router = express.Router();
const Slot_Staff = require('../Schemas/SlotCreationSchema');

router.post('/student/book-slot', async (req, res) => {
  const { Slot_id, Student_id, isBooked } = req.body;

  try {
    const newSlot = new Slot({
      Slot_id,
      Student_id,
      isBooked
    });

    const saved = await newSlot.save();
    return res.status(200).send({ message: "New slot booked", slot: saved });
  } catch (err) {
    console.error("Error creating slot:", err);
    return res.status(400).send("Error occurred while booking slot");
  }
});
router.post('/student/my-bookings', async (req, res) => {
  const { Student_id } = req.body;

  try {
    // 1. Find booked slots for this student
    const booked = await Slot.find({ Student_id, isBooked: true });

    // 2. Extract all Slot_id values
    const bookedSlotIds = booked.map((b) => b.Slot_id);

    // 3. Get metadata of those slots from Slot_Staff collection
    const slots = await Slot_Staff.find({ _id: { $in: bookedSlotIds } });

    res.json(slots);
  } catch (err) {
    console.error("Error fetching student's bookings:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});



module.exports = router;
