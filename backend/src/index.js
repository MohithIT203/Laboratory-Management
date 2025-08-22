const express = require('express');
const mongoose = require('mongoose');
// const session=require('express-session');
const courses=require('../Routes/course');
const cors=require('cors');
const app = express()
const jwt = require('jsonwebtoken');
const SlotFaculty=require('../Routes/newSlot');
const bookSlot=require('../Routes/BookSlot');
const new_Slot=require('../Routes/new_course');
const Otp=require('../Routes/Otp');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const PORT = process.env.PORT||4000;

const login=require('../Routes/login');

app.use(express.json())

app.use(cookieParser());

app.use(cors({
  origin: process.env.APPLICATION_URL,
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

mongoose.connect(process.env.MONGO_URI)
    .then(() => { console.log("Connected to database.") })
    .catch((err) => { console.log(`Error:${err}`) })


app.use(login);
app.use(courses);
app.use(SlotFaculty);
app.use(bookSlot);
app.use(Otp);
// app.use(new_Slot);
app.listen(PORT, () => {
    console.log(`Running on Port ${PORT}`);
})