const express = require('express');
const Location=require('../Schemas/location');
const locations = require('../Schemas/location');
const router = express.Router();

router.get('/locations',async(req,res)=>{
    try{
        const response=await Location.find({});
        if(!response){
            return res.status(404).send({message:"Locations not found"});
        }
        return res.status(200).send(response); 
    }catch(err){
        return res.status(500).send({message:"Error getting locations"});
    }
})

router.post('/locations',async(req,res)=>{
    const {name}=req.body;
    try{
        const duplicate=await Location.find({Lab_name:name});
        if(!duplicate){
            return res.status(409).send({message:"Location already exists"});
        }
        const newLocation=new Location({
            Lab_name:name
        })
        await newLocation.save();
        return res.status(200).send({message:"Locations Added to Database",newLocation});

    }catch(err){
        return res.status(500).send({message:"Error getting locations"});
    }
})
router.delete('/locations/:id',async (req,res)=>{
    const {id}=req.params;
    try {
    const staff=await Location.findByIdAndDelete(id);
    if(!staff){
        return res.status(404).send({message:"Location Not found"})
    }
    res
      .status(201)
      .json({ message: "success" });
  } catch(err){
        return res.status(500).send({message:"Error Deleting Data"});
    }
})

module.exports = router;