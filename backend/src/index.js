const express = require('express');
const mongoose = require('mongoose');
// const session=require('express-session');
const courses=require('../Routes/course');
const cors=require('cors');
const app = express()
const jwt = require('jsonwebtoken');

const cookieParser = require('cookie-parser');
require('dotenv').config();
const PORT = process.env.PORT;

const login=require('../Routes/login');

app.use(express.json())



app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

mongoose.connect(process.env.MONGO_URI)
    .then(() => { console.log("Connected to database.") })
    .catch((err) => { console.log(`Error:${err}`) })


app.use(login);
app.use(courses)
app.listen(PORT, () => {
    console.log(`Running on Port ${PORT}`);
})