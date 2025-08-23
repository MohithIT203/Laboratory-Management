const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const faculty = require('../routes/server');

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors({ origin: "*" }));
app.use(express.json());

// Routes (all endpoints will start with /faculty)
app.use(faculty);


// MongoDB Connection
mongoose.connect("mongodb://127.0.0.1:27017/backendCRUD", {
})
.then(() => console.log("Connected to database."))
.catch((err) => console.log(`Error: ${err}`));

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

