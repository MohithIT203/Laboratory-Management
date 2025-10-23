const express = require('express');
const Course=require('../Schemas/new_courseSchema');
const Slots=require('../Schemas/new_SlotSchema');
const auth = require("../middlewares/auth");
const router = express.Router();

router.get('/courses',auth,async(req,res)=>{
    try{
        const response=await Course.find({}).select("Course_id Course_name dept experiments");
        if(!response){
            return res.status(404).send({message:"Courses not found"});
        }
        return res.status(200).send(response); 
    }catch(err){
        return res.status(500).send({message:"Error getting Courses"});
    }
})

router.post("/courses", auth,async (req, res) => {

  const { course_code, course_name, department } = req.body;
  if (!course_code || !course_name || !department) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const existing = await Course.findOne({ course_code });
    if (existing) {
      return res.status(409).json({ message: "Course already exists" });
    }

    const newCourse = new Course({
      Course_id:course_code,
      Course_name:course_name,
      dept:department,
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

router.post("/courses/:id/experiments", auth,async (req, res) => {
  const { id } = req.params;
  const { exp_no, exp_name, exp_description } = req.body;
  if (!id || !exp_no || !exp_name || !exp_description) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const course = await Course.findById(id);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const newExperiment = {
      exp_no,
      exp_name,
      exp_description
    };

    // Add at end
    course.experiments.push(newExperiment);

    await course.save();

    res.status(201).json({
      message: "Experiment added successfully",
      Exp: course.experiments
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.put("/:id/experiments/:expid", auth,async (req, res) => {
  const { id, expid } = req.params;
  const { exp_no, exp_name, exp_description } = req.body;
  if (!exp_no || !exp_name || !exp_description) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const course = await Course.findById(id);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Find the experiment by id
    const experiment = course.experiments.id(expid);
    if (!experiment) {
      return res.status(404).json({ message: "Experiment not found" });
    }

    // Update fields
    experiment.exp_no = exp_no;
    experiment.exp_name = exp_name;
    experiment.exp_description = exp_description;

    await course.save();

    res.status(200).json({
      message: "Experiment updated successfully",
      Exp: experiment,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});


router.delete('/courses/:id',auth,async (req,res)=>{
    const {id}=req.params;
    try {
    const staff=await Course.findByIdAndDelete(id);
    if(!staff){
        return res.status(404).send({message:"Course Not found"})
    }
    res
      .status(201)
      .json({ message: "success" });
  } catch(err){
        return res.status(500).send({message:"Error Deleting Data"});
    }
})

router.get('/Admin/all-slots',auth,async(req,res)=>{
  try{
    const response=await Slots.find({});
    if(!response){
       return res.status(404).send({message:"Slots Not found"})
    }
     res
      .status(201)
      .json({ message: "success",slots:response });
  }catch(err){
     return res.status(500).send({message:"Error Deleting Data"});
    
  }
})


module.exports = router;

