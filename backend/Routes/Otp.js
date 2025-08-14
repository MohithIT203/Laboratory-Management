const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Otp = require('../Schemas/otpSchema');
const Faculty_Slot=require('../Schemas/new_SlotSchema');

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

        const verify = await Otp.findOne({ otp });
        if (!verify) {
            return res.status(404).json({ message: "Invalid OTP" });
        }

       
        const slot = await Faculty_Slot.findById(verify.Slot_id);
        if (!slot) {
            return res.status(404).json({ message: "Slot not found" });
        }

        
        const isBooked = slot.booked_students.includes(Student_id);
        if (!isBooked) {
            return res.status(403).json({ message: "Student has not booked this slot" });
        }
        
        const isAlreadyPresent = slot.students_attendance.some(
            s => s.student_id === Student_id
        );
        if (isAlreadyPresent) {
            return res.status(400).json({ message: "Attendance already marked" });
        }

       
        slot.students_attendance.push({
            student_id: Student_id,
            attendance: "Present",
            marks: 0
        });
        await slot.save();

        res.json({
            message: "OTP verified and attendance marked",
            isValid: verify.isValid,
            staffId: verify.Staff_id,
            students_attendance: slot.students_attendance
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Error verifying OTP" });
    }
});



module.exports = router;
