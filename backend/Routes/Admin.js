const express = require('express');
const Faculty = require('../Schemas/facultyInfo');
const Access=require('../Schemas/AccessSchema');
const Student=require('../Schemas/studentInfo');
const Slot=require('../Schemas/new_SlotSchema');
const router = express.Router();

//Teacher Routes
router.get('/admin/all-faculties',async (req,res)=>{
    try{
        const response=await Faculty.find({});
        return res.status(200).send(response);
    }catch(err){
        return res.status(500).send({"message":"Error fetching Data"});
    }
})

router.post('/admin/all-faculties',async (req,res)=>{
    const {Staff_name,Staff_id,email,dept }=req.body;
    try {
    const existing = await Faculty.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: "Staff already exists" });
    }

    const newStaff = new Faculty({
      Staff_id,
      Staff_name,
      email,
      dept
    });
    const newAccess=new Access({
        email:email,
        password:Staff_id,
        role:"faculty"
    })
    await newStaff.save();
    await newAccess.save();
    res
      .status(201)
      .json({ message: "Staff added successfully", newStaff });
  } catch(err){
        return res.status(500).send({message:"Error fetching Data"});
    }
})

router.put('/admin/all-faculties/:id',async (req,res)=>{
    const {id}=req.params;
    try {
    const staff=await Faculty.findByIdAndUpdate(id,req.body);
    if(!staff){
        return res.status(404).send({message:"User Not found"})
    }
    res
      .status(201)
      .json({ message: "Staff Updated successfully" });
  } catch(err){
        return res.status(500).send({message:"Error Updating Data"});
    }
})

router.delete('/admin/all-faculties/:id',async (req,res)=>{
    const {id}=req.params;
    try {
    const staff=await Faculty.findByIdAndDelete(id);
    if(!staff){
        return res.status(404).send({message:"User Not found"})
    }
    const staffAccess=await Access.deleteOne({email:staff.email});
    res
      .status(201)
      .json({ message: "success" });
  } catch(err){
        return res.status(500).send({message:"Error Deleting Data"});
    }
})

//Student Routes
router.get('/admin/all-students',async (req,res)=>{
    try{
        const response=await Student.find({});
        return res.status(200).send(response);
    }catch(err){
        return res.status(500).send({message:"Error fetching Data"});
    }
})

router.post('/admin/all-students',async (req,res)=>{
    const {Student_name,email,dept,regno }=req.body;
    try {
    const existing = await Student.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: "Student already exists" });
    }

    const newStudent = new Student({
      Student_name,
      regno,
      email,
      dept
    });
     const newAccess=new Access({
        email:email,
        password:regno,
        role:"Student"
    })
    await newStudent.save();
    await newAccess.save();
    res
      .status(201)
      .json({ message: "Student added successfully" });
  } catch(err){
        return res.status(500).send({message:"Error fetching Data"});
    }
})

router.put('/admin/all-students/:id',async (req,res)=>{
    const {id}=req.params;
    try {
    const staff=await Student.findByIdAndUpdate(id,req.body);
    if(!staff){
        return res.status(404).send({message:"User Not found"})
    }
    res
      .status(201)
      .json({ message: "Student Updated successfully" });
  } catch(err){
        return res.status(500).send({message:"Error Updating Data"});
    }
})

router.delete('/Admin/all-students/:id',async (req,res)=>{
    const {id}=req.params;
    console.log(id);
    try {
    const student=await Student.findByIdAndDelete(id);
    if(!student){
        return res.status(404).send({message:"User Not found"})
    }
    const studentAccess=await Access.deleteOne({email:student.email});
    res
      .status(201)
      .json({ message: "success" });
  } catch(err){
        return res.status(500).send({message:"Error Deleting Data"});
    }
})

router.get("/Admin/add-students/:userDept/:id", async (req, res) => {
  const { userDept, id } = req.params;

  try {
    const slot = await Slot.findById(id).select("students");
    if (!slot) {
      return res.status(404).json({ message: "Slot not found" });
    }
    const existingStudentIds = slot.students.map(s => s.studentId);
    const students = await Student.find({
      dept: userDept,
      _id: { $nin: existingStudentIds}
    }).select("regno Student_name");

    return res.json(students);
  } catch (err) {
    console.error(err);
    return res.status(500).send({ message: "Error fetching Data" });
  }
});

router.put("/Admin/add-students/:slotId", async (req, res) => {
  const { students } = req.body;
  const { slotId } = req.params;

  try {
    const slot = await Slot.findById(slotId);
    if (!slot) {
      return res.status(404).send({ message: "Slot Not Found" });
    }

    const existingIds = slot.students.map((s) => s.studentId.toString());

    const newStudents = students.filter((id) => !existingIds.includes(id));
    var total=0;
    if (newStudents.length === 0) {
      return res.status(200).send({ message: "No new students to add" });
    }

    newStudents.forEach((id) => {
      slot.students.push({ studentId: id, attendance: "absent", marks: 0 });
      total++;
    });
    slot.total_booked+=total;
    await slot.save();

    await Student.updateMany(
      { _id: { $in: newStudents } },
      {
        $push: {
          slots: {
            slotId: slotId,
            attendance: "absent",
            marks: 0,
          },
        },
      }
    );

    return res.status(200).send({
      message: "Students added successfully",
      addedCount: newStudents.length,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).send({ message: "Error Adding Data" });
  }
});

module.exports = router;