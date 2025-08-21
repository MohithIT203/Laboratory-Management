const express=require('express');
const faculty=require('../schemas/facultyInfo');
const router=express.Router();

router.post('/api/faculty', async (request, response) => {
    const { body } = request;
    // console.log(body);
    try {
        const newUser = new faculty(body);
        const Saveduser = await newUser.save();
        // console.log(Saveduser);
        return response.status(200).send(Saveduser);
    }
    catch (err) {
        return response.status(400).send("Bad Request");
     }

})


module.exports=router;