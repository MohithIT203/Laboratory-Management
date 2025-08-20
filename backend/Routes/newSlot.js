// routes/slotRoutes.js
const express = require('express');
const mongoose = require('mongoose');
const Slot = require('../Schemas/SlotCreationSchema');
const router = express.Router(); // 


router.post('/api/courses', async (req, res) => {

const existing = await Slot.findOne({ Date: req.body.Date, Time: req.body.Time, venue: req.body.venue });

if (existing) {
  return res.status(409).json({ message: "Slot already exists for this date, time, and venue." });
}

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
    const slots = await Slot.find({ email: FacultyEmail }).select("Course Date capacity Time venue pdf_material video_material Staff_name");;

    return res.status(200).json(slots);
  } catch (err) {
    console.error("Error fetching slots:", err);
    return res.status(400).send("Error Occurred");
  }
});

router.delete('/api/faculty/allSlots/:id',async (req,res)=>{
  const slotId=req.params.id;
  try{
    const DelSlot=await Slot.findByIdAndDelete(slotId);
    if (!DelSlot) {
      return res.status(404).json({ message: "Slot not found" });
    }
    res.json({ message: "Slot deleted successfully", DelSlot });
  } catch (err) {
    res.status(500).json({ message: "Server error" });

  }
});
module.exports = router;
