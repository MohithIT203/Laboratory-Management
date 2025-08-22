const express = require("express");
const router = express.Router();
const mongoose = require('mongoose');

const Course = require("../Schemas/new_courseSchema");
const Slot = require("../Schemas/SlotCreationSchema");
const BookedSlot=require("../Schemas/studentSlot");
const auth = require("../middlewares/auth");
//add new course


router.post("/add/new_course", async (req, res) => {

  const { Course_id, Course_name, staffs, dept,experiments } = req.body;

  if (!Course_id || !Course_name || !staffs || !dept ||!experiments) {
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
      experiments,
      staffs,
      dept
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
router.get("/api/courses/:dept", async (req, res) => {
  try {
    const { dept } = req.params;
    const courses = await Course.find({ dept });
    const courseNames = courses.map(c => c.Course_name);
    res.json(courseNames);
  } catch (err) {
    console.error("Error fetching courses:", err);
    res.status(500).json({ error: "Failed to fetch courses" });
  }
});

router.get("/api/exp/:course", async (req, res) => {
  try {
    const { course } = req.params;
    
    // Find a course by name
    const courseData = await Course.findOne({ Course_name: course });

    if (!courseData) {
      return res.status(404).json({ error: "Course not found" });
    }

    // Return experiments of the course
    res.json(courseData.experiments);
  } catch (err) {
    console.error("Error fetching experiments:", err);
    res.status(500).json({ error: "Failed to fetch experiments" });
  }
});


// router.post("/slots", async (req, res) => {
//  const { dept, Student_id } = req.body;


//   try {
//     const booked = await BookedSlot.find({ isBooked: true ,Student_id: Student_id,}).select("Slot_id");
//     const bookedSlotIds = booked.map((b) => b.Slot_id.toString());
//     console.log(Student_id);

//     const today = new Date();
//     today.setHours(0, 0, 0, 0);

//     const slots = await Slot.find({
//       dept,
//       _id: { $nin: bookedSlotIds },
//       Date: { $gte: today }
//     });

//     console.log(slots);
//     if (slots.length > 0) {
//       res.json(slots);
//     } else {
//       res.status(404).json({ message: "No available slots found" });
//     }
//   } catch (err) {
//     console.error("Error fetching slots:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// });


module.exports = router;
