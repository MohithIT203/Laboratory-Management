const mongoose=require('mongoose');
const locationSchema=new mongoose.Schema({
   Lab_name:{
    type:String,
    required:true
   },
   capacity:{
      type:Number,
      required:true,
      default:0
   }
},{timestamps:true});

const locations=mongoose.model("location",locationSchema);
module.exports = locations;