const mongoose = require('mongoose')
const experiment_schema=new mongoose.Schema({
  exp_no:Number,   
  exp_name:String,
  exp_description:String
});
const Slot = new mongoose.Schema({
    Staff_name: {
        type: String,
        required: true,
    },
    email:{
        type:String,
        required:true,
    },
    Course: {
        type:String,
        required: true,
        
    },
    experiment:{
        type:experiment_schema,
        required:true,
    },
    dept: {
        type:String,
        required: true
    },
    Date: {
        type: Date,
        required: true,
        
    },
    Time: {
        type: String,
        required: true,
        
    },
    venue:{
        type:String,
        required:true,
    },
    capacity:{
        type:Number,
        required:true,
        
    },
    pdf_material: {
        type: String,
        required: false,
    },
    video_material: {
        type: String,
        required: false,
    },
    total_booked:{
        type:Number,
        required:false,
    },
    booked_students:{
        type:[String],
        required:false,
    }
})

const new_SlotSchema = mongoose.model("new_Slotsfaculty", Slot);
module.exports = new_SlotSchema;