const express = require("express");
const router = express.Router();
const mongoose = require('mongoose');

const Course = require("../Schemas/new_courseSchema");
const Slot = require("../Schemas/new_SlotSchema");
const Student=require("../Schemas/studentInfo");
const BookedSlot=require("../Schemas/studentSlot");
const auth = require("../middlewares/auth");
//add new course


router.post("/add/course", async (req, res) => {

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
      staffs,
      dept,
      experiments
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


router.post("/slots", async (req, res) => {
  const { dept, Student_id } = req.body;

  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const slots = await Slot.find({
      dept,
      booked_students: { $ne: Student_id },
      Date: { $gte: today }
    });

    if (slots.length > 0) {
      return res.json(slots);
    } else {
      return res.status(404).json({ message: "No available slots found" });
    }
  } catch (err) {
    console.error("Error fetching slots:", err);
    res.status(500).json({ message: "Server error" });
  }
});

router.get('/faculty/my-slots/:FacultyEmail',async (req,res)=>{
  try{
  const {FacultyEmail}=req.params;
  const response=await Slot.find({email:FacultyEmail});
  if(response.length>0){
    res.json(response);
  }
  else{
    return res.status(400).json({message:"No slots with this Email Found!!"})
  }
  }
  catch(err){
    console.error("Error fetching slots",err);
    res.status(500).json({ message: "Server error" });
  }
})


router.get('/faculty/students/:SlotId', async (req, res) => {
  try {
    const { SlotId } = req.params;

    // Find slot by ID and get booked_students array
    const slot = await Slot.findById(SlotId).select("booked_students");

    if (!slot) {
      return res.status(404).json({ message: "No slot found with this ID" });
    }

    // Extract student IDs
    const studentIds = slot.booked_students;

    if (!studentIds || studentIds.length === 0) {
      return res.status(200).json({ message: "No students booked this slot" });
    }

    // Find all students whose IDs are in booked_students
    const students = await Student.find({ _id: { $in: studentIds } });

    res.json({
      slotId: SlotId,
      totalStudents: students.length,
      students
    });

  } catch (err) {
    console.error("Error fetching students:", err);
    res.status(500).json({ message: "Server error" });
  }
});


module.exports = router;
