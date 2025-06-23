const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../Schemas/AccessSchema');
const Student=require('../Schemas/studentInfo');
const StudentSchema = require('../Schemas/studentInfo');
const authenticate = require('../middlewares/auth');
require('dotenv').config();
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
      maxAge: 24 * 60 * 60 * 1000
    });
    if(user.role=="Student"){
        const student=await Student.findOne({email:userEmail});
        return res.json({ message: 'Login successful', role: user.role,dept:student.dept });
    }
    return res.json({ message: 'Login successful', role: user.role});
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
});

router.post('/api/user/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Logged out successfully' });
});


module.exports = router;
