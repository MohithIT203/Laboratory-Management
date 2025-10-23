// routes/slotRoutes.js
const express = require('express');
const mongoose=require('mongoose');
const Slot = require('../Schemas/new_SlotSchema');
const Student=require('../Schemas/studentInfo');
const auth = require("../middlewares/auth");
const router = express.Router();

//BOOK NEW SLOT
router.post("/student/book-slot", auth, async (req, res) => {
  const { Slot_id, Student_id } = req.body;

  try {
   
    const updatedSlot = await Slot.findOneAndUpdate(
      {
        _id: Slot_id,
        $expr: { $lt: ["$total_booked", "$capacity"] },
        "students.studentId": { $ne: Student_id },
      },
      {
        $push: {
          students: { studentId: Student_id, attendance: "absent", marks: 0 },
        },
        $inc: { total_booked: 1 },
      },
      { new: true }
    );

    if (!updatedSlot) {
      return res.status(400).send({
        message: "Slot full or already booked by student.",
      });
    }

    
    await Student.findByIdAndUpdate(Student_id, {
      $push: {
        slots: { slotId: Slot_id, attendance: "absent", marks: 0 },
      },
    });

    return res.status(200).send({
      message: "Slot booked successfully",
      slot: updatedSlot,
    });
  } catch (err) {
    console.error("Error booking slot:", err);
    res.status(500).send({ message: "Error occurred while booking slot" });
  }
});


//VIEW BOOKED SLOTS
router.post('/student/my-bookings', auth,async (req, res) => {
  const { Student_id } = req.body;

  try {
    // Find all slots where students array contains the given Student_id
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const bookedSlots = await Slot.find({
      "students.studentId": Student_id,
      Date: { $gte: today },

    }).sort({ Date: 1 }).select("Staff_name Course experiment Date Time venue pdf_material video_material");

    if (!bookedSlots.length) {
      return res.status(404).json({ message: "No bookings found for this student" });
    }

    res.status(200).json(bookedSlots);
  } catch (err) {
    console.error("Error fetching student's bookings:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


router.post("/slots",auth, async (req, res) => {
  const { dept, Student_id } = req.body;

  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const slots = await Slot.find({
      dept,
      "students.studentId": { $ne: Student_id },
      Date: { $gte: today },
       $expr: { $lt: ["$total_booked", "$capacity"] }
    }).select("Staff_name Course experiment Date Time venue pdf_material video_material");

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

router.post("/history", async (req, res) => {
  const { dept, Student_id } = req.body;

  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const slots = await Slot.find({
      dept,
      "students.studentId": Student_id ,
      Date: { $lt: today },
    }).select("Staff_name Course experiment Date Time venue pdf_material video_material");

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


router.delete("/student/cancel-slot/:slotid/:studentid",auth, async (req, res) => {
  const { slotid, studentid } = req.params;

  try {
    const slot = await Slot.findById(slotid);
    if (!slot) {
      return res.status(404).send({ message: "Slot not found" });
    }


    const student = await Student.findById(studentid);
    if (!student) {
      return res.status(404).send({ message: "Student not found" });
    }


    const alreadyBooked = slot.students.some(
      (s) => s.studentId.toString() === studentid.toString()
    );
    if (!alreadyBooked) {
      return res
        .status(400)
        .send({ message: "Student has not booked this slot" });
    }

    await Slot.findByIdAndUpdate(slotid, {
      $pull: { students: { studentId: studentid } },
      $inc: { total_booked: -1 },
    });

    // Remove slot from student's record
    await Student.findByIdAndUpdate(studentid, {
      $pull: { slots: { slotId: slotid } },
    });

    return res.status(200).send({ message: "Slot booking cancelled successfully" });
  } catch (err) {
    console.error("Error cancelling slot:", err);
    return res
      .status(500)
      .send({ message: "Error occurred while cancelling slot" });
  }
});

//VIEW ATTENDANCE FOR THE SLOTS
router.get("/student/attendance-history/:Student_id", auth,async (req, res) => {
  const { Student_id } = req.params;

  try {
    const student = await Student.findById(Student_id).select("slots");
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Collect slotIds from student's record
    const slotIds = student.slots.map((s) => s.slotId);

    // Fetch slot details
    const slots = await Slot.find({ _id: { $in: slotIds } }).select(
      "Staff_name Course experiment Date Time venue students"
    );

    // Merge attendance + marks into slot details
    const mergedSlots = slots.map((slot) => {
      const studentSlot = student.slots.find(
        (s) => String(s.slotId) === String(slot._id)
      );
     
      return {
        _id: slot._id,
        Staff_name: slot.Staff_name,
        Course: slot.Course,
        experiment: slot.experiment,
        Date: slot.Date,
        Time: slot.Time,
        venue: slot.venue,
        attendance: studentSlot?.attendance || "absent",
        marks: studentSlot?.marks||0,
      };
    });
    
    res.status(200).json({ slots: mergedSlots });
  } catch (err) {
    console.error("Error fetching slots:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
