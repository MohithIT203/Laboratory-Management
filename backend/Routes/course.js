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
    const slot = await Slot.findById(SlotId).select("students");

    if (!slot) {
      return res.status(404).json({ message: "No slot found with this ID" });
    }

    if (slot.students.length === 0) {
      return res.status(200).json({
        message: "No students booked this slot",
        students: []
      });
    }
    const studentIds = slot.students.map(s => s.studentId);

    const students = await Student.find({ _id: { $in: studentIds } })
      .select("Student_name regno"); 

    res.status(200).json({
      slotId: SlotId,
      totalStudents: students.length,
      students
    });

  } catch (err) {
    console.error("Error fetching students:", err);
    res.status(500).json({ message: "Server error" });
  }
});



router.get('/faculty/present-students/:SlotId', async (req, res) => {
  try {
    const { SlotId } = req.params;
    const slot = await Slot.findById(SlotId).select("students");

    if (!slot) {
      return res.status(404).json({ message: "No slot found with this ID" });
    }

    const presentIds = slot.students.filter(s => s.attendance === "present").map(s => s.studentId);

    if (presentIds.length === 0) {
      return res.status(200).json({ message: "No students present", students: [] });
    }

    const students = await Student.find({ _id: { $in: presentIds } })
      .select("Student_name regno");

    const merged = students.map(stu => {
      const record = slot.students.find(s => s.studentId === stu._id.toString());
      return {
        _id: stu._id,
        Student_name: stu.Student_name,
        regno: stu.regno,
        attendance: record?.attendance,
        marks: record?.marks || 0
      };
    });

    res.json({
      slotId: SlotId,
      totalPresent: merged.length,
      students: merged
    });

  } catch (err) {
    console.error("Error fetching present students:", err);
    res.status(500).json({ message: "Server error" });
  }
});


router.get('/faculty/absent-students/:SlotId', async (req, res) => {
  try {
    const { SlotId } = req.params;
    const slot = await Slot.findById(SlotId).select("students");

    if (!slot) {
      return res.status(404).json({ message: "No slot found with this ID" });
    }

    const absentIds = slot.students.filter(s => s.attendance === "absent").map(s => s.studentId);

    if (absentIds.length === 0) {
      return res.status(200).json({ message: "No students absent", students: [] });
    }

    const students = await Student.find({ _id: { $in: absentIds } })
      .select("Student_name regno");

    const merged = students.map(stu => {
      const record = slot.students.find(s => s.studentId === stu._id.toString());
      return {
        _id: stu._id,
        Student_name: stu.Student_name,
        regno: stu.regno,
        attendance: record?.attendance,
        marks: record?.marks || 0
      };
    });

    res.json({
      slotId: SlotId,
      totalAbsent: merged.length,
      students: merged
    });

  } catch (err) {
    console.error("Error fetching absent students:", err);
    res.status(500).json({ message: "Server error" });
  }
});



router.put('/faculty/update-scores/:SlotId', async (req, res) => {
  try {
    const { SlotId } = req.params;
    const { students } = req.body; // [{ _id, score }]

    const slot = await Slot.findById(SlotId);
    if (!slot) {
      return res.status(404).json({ message: "Slot not found" });
    }

    // Update scores in both Slot.students[] and Student schema
    for (const { _id, score } of students) {
      // 1. Update inside Slot.students[]
      const stu = slot.students.find(s => s.studentId === _id);
      if (stu) {
        stu.marks = score;
      }

      // 2. Update inside Student collection
      await Student.findByIdAndUpdate(_id, { $set: { marks: score } });
    }

    await slot.save();

    res.json({
      message: "Scores updated successfully",
      students: slot.students
    });

  } catch (err) {
    console.error("Error updating scores:", err);
    res.status(500).json({ message: "Server error" });
  }
});



module.exports = router;
