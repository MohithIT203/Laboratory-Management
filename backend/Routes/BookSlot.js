// routes/slotRoutes.js
const express = require('express');
const Slot = require('../Schemas/studentSlot');
const router = express.Router();

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
    const bookedSlots = await Slot.find({ Student_id,isBooked:true });
    res.json(bookedSlots);
  } catch (err) {
    console.error("Error fetching student's bookings:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


module.exports = router;
