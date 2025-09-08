const mongoose=require('mongoose');
const locationSchema=new mongoose.Schema({
   Lab_name:{
    type:String,
    required:true
   }
},{timestamps:true});

const locations=mongoose.model("location",locationSchema);
module.exports = locations;