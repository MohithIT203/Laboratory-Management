const express = require('express');
const router = express.Router();
const Course = require('../Schemas/courseSchema') 
const auth=require('../middlewares/auth')
//add new course
router.post('/add/course',async (req, res) => {
    console.log(req.body);
  const { Course_id, Course_name, staffs, dept } = req.body;

  if (!Course_id || !Course_name || !staffs || !dept) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const existing = await Course.findOne({ Course_id });
    if (existing) {
      return res.status(409).json({ message: 'Course already exists' });
    }

    const newCourse = new Course({
      Course_id,
      Course_name,
      staffs,
      dept
    });

    await newCourse.save();
    res.status(201).json({ message: 'Course added successfully', course: newCourse });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/student/courses/:dept', async (req, res) => {
  const dept = req.params.dept;
  try {
    const courses = await Course.find({ dept }); // use find instead of findOne to get all
    if (courses.length > 0) {
      res.json(courses);
    } else {
      res.status(404).json({ message: 'No courses found' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
