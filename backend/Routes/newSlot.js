// routes/slotRoutes.js
const express = require('express');
const mongoose = require('mongoose');
const Slot = require('../Schemas/SlotCreationSchema');
const router = express.Router(); // 


router.post('/api/courses', async (req, res) => {
  try {
    const newSlot = new Slot(req.body);
    const saved = await newSlot.save();
    return res.status(200).send({ message: "New slot created", slot: saved });
  } catch (err) {
    console.error("Error creating slot:", err);
    return res.status(400).send("Error Occurred");
  }
});


router.post('/api/faculty/allSlots', async (req, res) => {
  const { FacultyEmail } = req.body;

  try {
    const slots = await Slot.find({ email: FacultyEmail });

    return res.status(200).json(slots);
  } catch (err) {
    console.error("Error fetching slots:", err);
    return res.status(400).send("Error Occurred");
  }
});

module.exports = router;
