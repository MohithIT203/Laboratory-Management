const mongoose = require('mongoose')

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
        
    }

})

const SlotSchema = mongoose.model("Slotsfaculty", Slot);
module.exports = SlotSchema;