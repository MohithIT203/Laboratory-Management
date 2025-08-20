const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
  Course_id: {
    type: String,
    required: true,
    unique: true
  },
  Course_name: {
    type: String,
    required: true
  },
  staffs: {               
    type: [String],        
    required: true
  },
  experiments:{
    type:[String],
     default: [],
    required:true
  },
  dept: {
    type: String,
    required: true
  }
});


const Course = mongoose.model("Courses", CourseSchema); 
module.exports = Course;
