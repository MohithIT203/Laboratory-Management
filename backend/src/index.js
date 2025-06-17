const express = require('express');
const mongoose = require('mongoose');
const session=require('express-session');
const cors=require('cors');
const app = express()
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const PORT = process.env.PORT || 4000;

const login=require('../Routes/login')

app.use(express.json())


app.use(session({
    secret:process.env.JWT_SECRET,
    saveUninitialized:false,
    resave:false,
    cookie:{
        maxAge:60000*60,
    },
}))
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

mongoose.connect(process.env.MONGO_URI)
    .then(() => { console.log("Connected to database.") })
    .catch((err) => { console.log(`Error:${err}`) })

// app.use(Student);
// app.use(faculty);
app.use(login);
// app.use(roleroute);
app.get('/', (request, response) => {
    console.log(request.session);
    console.log(request.session.id);
    request.session.visited=true;
    response.send("Hello World!!")
})


app.listen(PORT, () => {
    console.log(`Running on Port ${PORT}`);
})