const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Otp = require('../Schemas/otpSchema');
const Faculty_Slot=require('../Schemas/new_SlotSchema');
const Student=require('../Schemas/studentInfo');
// Store OTP
router.post('/faculty/otp', async (req, res) => {
    try {
        const { slotId, otp } = req.body;

        await Otp.insertMany({
            Slot_id: slotId,
            otp:otp
        });

        return res.status(200).json({ message: "Otp Added to the Database" });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Error storing Otp" });
    }
});

// Verify OTP
router.post('/verify-otp', async (req, res) => {
  try {
    const { Student_id, otp } = req.body;

    // Step 1: Find OTP
    const verify = await Otp.findOne({ otp });
    if (!verify) {
      return res.status(404).json({ message: "Invalid OTP" });
    }

    // Step 2: Find slot
    const slot = await Faculty_Slot.findById(verify.Slot_id);
    if (!slot) {
      return res.status(404).json({ message: "Slot not found" });
    }

    // Step 3: Check if student already booked
    const studentEntry = slot.students.find(
      (s) => String(s.studentId) === String(Student_id)
    );
    if (!studentEntry) {
      return res.status(403).json({ message: "Student has not booked this slot" });
    }

    // Step 4: Check if already marked
    if (studentEntry.attendance === "present") {
      return res.status(400).json({ message: "Attendance already marked" });
    }

    // Step 5: Update slot side
    studentEntry.attendance = "present";
    studentEntry.marks = 0;
    await slot.save();

    // Step 6: Update student side
    await Student.updateOne(
      { _id: Student_id, "slots.slotId": verify.Slot_id },
      {
        $set: {
          "slots.$.attendance": "present",
          "slots.$.marks": 0,
        },
      }
    );

    res.json({
      message: "OTP verified and attendance marked",
    });
  } catch (err) {
    console.error("Error verifying OTP:", err);
    return res.status(500).json({ message: "Error verifying OTP" });
  }
});



module.exports = router;
