const mongoose=require('mongoose')

const Student=new mongoose.Schema({
    email:{
        type:mongoose.Schema.Types.String,
        required:true,
        unique:true
    },
    Student_name:{
         type:mongoose.Schema.Types.String,
        required:true,
    },
    regno:{
        type:mongoose.Schema.Types.String,
        required:true
    },
    dept:{
        type:mongoose.Schema.Types.String,
        required:true
    }
    
})

const StudentSchema=mongoose.model("Student",Student);
module.exports = StudentSchema;