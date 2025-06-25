const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../Schemas/AccessSchema');
const Student = require('../Schemas/studentInfo');
const Faculty = require('../Schemas/facultyInfo');
const Courses=require('../Schemas/courseSchema');
const Course = require('../Schemas/courseSchema');
require('dotenv').config();

// LOGIN ROUTE
router.post('/api/user/login', async (req, res) => {
  const { userEmail } = req.body;

  try {
    const user = await User.findOne({ email: userEmail });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.cookie('token', token, {
      httpOnly: true,
      secure: false,
      sameSite: 'Lax',
      maxAge: 24 * 60 * 60 * 1000,
    });

    if (user.role === 'Student') {
      const student = await Student.findOne({ email: userEmail });
      return res.json({
        message: 'Login successful',
        role: user.role,
        dept: student?.dept || null,
      });
    } else if (user.role === 'faculty') {
      const faculty = await Faculty.findOne({ email: userEmail }); 
      return res.json({
        message: 'Login successful',
        role: user.role,
        email:faculty.email,
        name: faculty?.Staff_name || null,
        dept: faculty?.dept || null,
      });
    }

    return res.json({ message: 'Login successful', role: user.role });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
});


router.get("/api/courses/:dept", async (req, res) => {
  try {
    const { dept } = req.params;
    const courses = await Course.find({ dept });
    const courseNames = courses.map(c => c.Course_name);
    res.json(courseNames); // Send just the names
  } catch (err) {
    console.error("Error fetching courses:", err);
    res.status(500).json({ error: "Failed to fetch courses" });
  }
});

// LOGOUT ROUTE
router.post('/api/user/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Logged out successfully' });
});

module.exports = router;
