const mongoose=require('mongoose')

const Staff=new mongoose.Schema({
    email:{
        type:mongoose.Schema.Types.String,
        required:true,
        unique:true
    },
    Staff_name:{
         type:mongoose.Schema.Types.String,
        required:true,
    },
    Staff_id:{
        type:mongoose.Schema.Types.String,
        required:true
    },
    dept:{
        type:mongoose.Schema.Types.String,
        required:true
    }
    
    
})

const StaffSchema=mongoose.model("faculty",Staff);
module.exports = StaffSchema;