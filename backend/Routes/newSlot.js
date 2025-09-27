const express = require("express");
const mongoose = require("mongoose");
const Slot = require("../Schemas/new_SlotSchema");
const Student = require("../Schemas/studentInfo");
const mailer = require("nodemailer");
require("dotenv").config();
const router = express.Router();

const sender_mail = process.env.MAIL_ID;

const transporter = mailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_ID,
    pass: process.env.MAIL_PASSWORD,
  },
  logger: true,
  debug: true,
});
async function sendMail({ to, subject, text, html = null }) {
  try {
    const mailOptions = {
      from: `"LabSlot Management" <${process.env.MAIL_ID}>`,
      to,
      subject,
      text,
      html,
    };

    let info = await transporter.sendMail(mailOptions);
    console.log("Message sent: %s", info.messageId);
  } catch (error) {
    console.error("Error sending email:", error);
  }
}

//CREATE NEW SLOT
router.post("/api/courses", async (req, res) => {
  const existing = await Slot.findOne({
    Date: req.body.Date,
    Time: req.body.Time,
    venue: req.body.venue,
  });
  const Facultydept = req.body.dept;
  const { Staff_name, Course, Date, Time, venue, experiment } = req.body;
  if (existing) {
    return res
      .status(409)
      .json({ message: "Slot already exists for this date, time, and venue." });
  }

  try {
    const newSlot = new Slot(req.body);
    const saved = await newSlot.save();

    const students = await Student.find({ dept: Facultydept }).select("email");
    const emails = students.map((s) => s.email);
    if (emails.length > 0) {
     
         const textBody = `📢New Lab Slot Created for ${Facultydept} students.

Faculty: ${Staff_name}
Course: ${Course}
Date: ${Date}
Time: ${Time}
Venue: ${venue}
Experiment: ${experiment?.exp_name || "N/A"}

🔗View the slot here: https://laboratory-management-mauve.vercel.app`;

      await sendMail({
        to: emails,
        subject: "LabSlot Management - NEW LAB SLOT CREATED",
        text: textBody,
       
      });
      
    } else {
      console.warn(`No students found in ${Facultydept} department.`);
    }

    return res.status(200).send({ message: "New slot created", slot: saved });
  } catch (err) {
    console.error("Error creating slot:", err);
    return res.status(400).send("Error Occurred");
  }
});

//VIEW ALL SLOTS
router.post("/api/faculty/allSlots", async (req, res) => {
  const { FacultyEmail } = req.body;

  try {
    const slots = await Slot.find({ email: FacultyEmail }).select(
      "Course Date capacity Time venue pdf_material video_material Staff_name experiment total_booked "
    );
    return res.status(200).json(slots);
  } catch (err) {
    console.error("Error fetching slots:", err);
    return res.status(400).send("Error Occurred");
  }
});

//DELETE SLOT
router.delete("/api/faculty/allSlots/:id", async (req, res) => {
  const slotId = req.params.id;
  try {
    const DelSlot = await Slot.findByIdAndDelete(slotId);
    if (!DelSlot) {
      return res.status(404).json({ message: "Slot not found" });
    }
    res.json({ message: "Slot deleted successfully", DelSlot });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
