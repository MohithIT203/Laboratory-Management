const express = require('express');
const mongoose = require('mongoose');
const cors=require('cors');
const faculty=require('../routes/sample')
const app = express()


require('dotenv').config();
const PORT = process.env.PORT||4000;



app.use(express.json())

app.use(faculty);

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

mongoose.connect("mongodb://localhost/backendCRUD")
    .then(() => { console.log("Connected to database.") })
    .catch((err) => { console.log(`Error:${err}`) })


app.listen(PORT, () => {
    console.log(`Running on Port ${PORT}`);
})