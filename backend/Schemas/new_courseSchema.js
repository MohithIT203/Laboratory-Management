const mongoose = require('mongoose');
const experiment_schema=new mongoose.Schema({
  exp_no:Number,   
  exp_name:String,
  exp_description:String
});
const newCourseSchema = new mongoose.Schema({
  Course_id: {
    type: String,
    required: true,
    unique: true
  },
  Course_name: {
    type: String,
    required: true
  },
  experiments:[experiment_schema],
  staffs: {               
    type: [String],        
    required: true
  },
  dept: {
    type: String,
    required: true
  }
});

const Course = mongoose.model("newCourses", newCourseSchema); 
module.exports = Course;
