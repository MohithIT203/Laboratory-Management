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

    const slot = await Slot.findById(SlotId)
      .select("booked_students students_attendance");
    if (!slot) {
      return res.status(404).json({ message: "No slot found with this ID" });
    }

    if (!slot.booked_students || slot.booked_students.length === 0) {
      return res.status(200).json({
        message: "No students booked this slot",
        students: []
      });
    }

    // Attendance map (key = student_id as string)
    const attendanceMap = {};
    (slot.students_attendance || []).forEach(record => {
      attendanceMap[record.student_id] = {
        attendance: record.attendance || "present",
        marks: record.marks ?? ""
      };
    });

    // Convert string IDs to ObjectId for Student query
    const bookedIdsAsObjectId = slot.booked_students
      .filter(id => mongoose.Types.ObjectId.isValid(id))
      .map(id => new mongoose.Types.ObjectId(id));

    const students = await Student.find({ _id: { $in: bookedIdsAsObjectId } });

    // Merge booked_students array (source of truth) with attendance
    const studentsWithAttendance = slot.booked_students.map(id => {
      const studentDoc = students.find(s => s._id.toString() === id);
      const attData = attendanceMap[id];
      return {
        ...(studentDoc ? studentDoc.toObject() : { _id: id, name: "Unknown" }),
        attendance: attData?.attendance || "absent",
        score: attData?.marks ?? ""
      };
    });

    res.json({
      slotId: SlotId,
      totalStudents: studentsWithAttendance.length,
      students: studentsWithAttendance
    });

  } catch (err) {
    console.error("Error fetching students:", err);
    res.status(500).json({ message: "Server error" });
  }
});


router.get('/faculty/present-students/:SlotId', async (req, res) => {
  try {
    const { SlotId } = req.params;

    const slot = await Slot.findById(SlotId).select("students_attendance");
    if (!slot) {
      return res.status(404).json({ message: "No slot found with this ID" });
    }

    if (!slot.students_attendance || slot.students_attendance.length === 0) {
      return res.status(200).json({ message: "No students booked this slot", students: [] });
    }

    // Extract IDs for the query
    const studentIds = slot.students_attendance.map(s => s.student_id);
    // Fetch student details
    const students = await Student.find({ _id: { $in: studentIds } });
   

    // Merge attendance & marks into student records
    const studentsWithAttendance = students.map(student => {
      const attendanceRecord = slot.students_attendance.find(
        s => s.student_id === student._id.toString()
      );
      return {
        ...student.toObject(),
        attendance: attendanceRecord?.attendance||"absent",
        score: attendanceRecord?.marks ?? ""
      };
    });
    // console.log(studentsWithAttendance);

    res.json({
      slotId: SlotId,
      totalStudents: studentsWithAttendance.length,
      students: studentsWithAttendance
    });

  } catch (err) {
    console.error("Error fetching students:", err);
    res.status(500).json({ message: "Server error" });
  }
});

router.get('/faculty/absent-students/:SlotId', async (req, res) => {
  try {
    const { SlotId } = req.params;

    const slot = await Slot.findById(SlotId).select("booked_students students_attendance");
    if (!slot) {
      return res.status(404).json({ message: "No slot found with this ID" });
    }

    // If no students booked
    if (!slot.booked_students || slot.booked_students.length === 0) {
      return res.status(200).json({ message: "No students booked this slot", students: [] });
    }

    // Fetch all booked student details
    const students = await Student.find({ _id: { $in: slot.booked_students } });

    // ✅ Identify absent students
    const absentStudents = students
      .map(student => {
        const attendanceRecord = slot.students_attendance.find(
          s => s.student_id === student._id.toString()
        );

        // If no attendance record, mark absent
        if (!attendanceRecord) {
          return {
            ...student.toObject(),
            attendance: "absent",
            marks: ""
          };
        }
        return null; // skip present ones
      })
      .filter(s => s !== null);

    res.json({
      slotId: SlotId,
      totalAbsent: absentStudents?.length||0,
      absentStudents
    });

  } catch (err) {
    console.error("Error fetching absent students:", err);
    res.status(500).json({ message: "Server error" });
  }
});


router.put("/faculty/update-scores/:slotId", async (req, res) => {
  try {
    const { slotId } = req.params;
    const { students } = req.body;

    const slot = await Slot.findById(slotId);

    if (!slot) {
      return res.status(404).json({ message: "Slot not found" });
    }

    students.forEach(({ _id, score }) => {
      const stuRecord = slot.students_attendance.find(s => s.student_id.toString() === _id);
      if (stuRecord) {
        stuRecord.marks = score;
      }
    });

    await slot.save();
    res.json({ message: "Scores updated successfully" });
  } catch (err) {
    console.error("Error updating scores:", err);
    res.status(500).json({ message: "Server error" });
  }
});



module.exports = router;
