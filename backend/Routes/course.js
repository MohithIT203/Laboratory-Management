const express = require("express");
const router = express.Router();
const mongoose = require('mongoose');

const Course = require("../Schemas/courseSchema");
const Slot = require("../Schemas/SlotCreationSchema");
const BookedSlot=require("../Schemas/studentSlot");
const auth = require("../middlewares/auth");
//add new course


router.post("/add/course", async (req, res) => {
  

  // console.log(req.body);
  const { Course_id, Course_name, staffs, dept } = req.body;

  if (!Course_id || !Course_name || !staffs || !dept) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const existing = await Course.findOne({ Course_id });
    if (existing) {
      return res.status(409).json({ message: "Course already exists" });
    }

    const newCourse = new Course({
      Course_id,
      Course_name,
      staffs,
      dept,
    });

    await newCourse.save();
    res
      .status(201)
      .json({ message: "Course added successfully", course: newCourse });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/slots", async (req, res) => {
 const { dept, Student_id } = req.body;


  try {
    const booked = await BookedSlot.find({ isBooked: true ,Student_id: Student_id,}).select("Slot_id");
    const bookedSlotIds = booked.map((b) => b.Slot_id.toString());
    console.log(Student_id);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const slots = await Slot.find({
      dept,
      _id: { $nin: bookedSlotIds },
      Date: { $gte: today }
    });

    console.log(slots);
    if (slots.length > 0) {
      res.json(slots);
    } else {
      res.status(404).json({ message: "No available slots found" });
    }
  } catch (err) {
    console.error("Error fetching slots:", err);
    res.status(500).json({ message: "Server error" });
  }
});


module.exports = router;
