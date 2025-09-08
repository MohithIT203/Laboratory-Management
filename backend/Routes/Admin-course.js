const express = require('express');
const Course=require('../Schemas/new_courseSchema');
const Slots=require('../Schemas/new_SlotSchema');
const router = express.Router();

router.get('/courses',async(req,res)=>{
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

router.post("/courses", async (req, res) => {

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

router.post("/courses/:id/experiments", async (req, res) => {
  const { id } = req.params;
  const { exp_no, exp_name, exp_description } = req.body;
  console.log(req.body);
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

router.delete('/courses/:id',async (req,res)=>{
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

router.get('/Admin/all-slots',async(req,res)=>{
  try{
    const response=await Slots.find({});
    // console.log(response);
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

