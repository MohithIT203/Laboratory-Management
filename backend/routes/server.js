const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

// ====================== SCHEMAS & MODELS ======================

// Location Schema (separate collection)
const LocationSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true }
}, { timestamps: true });

const Location = mongoose.model("Location", LocationSchema);

// Course Schema (with reference to Location ID)
const CourseSchema = new mongoose.Schema({
    course_name: { type: String, required: true },
    course_code: { type: String, required: true, unique: true },
    department: { type: String, required: true },
    experiments: [
        {
            exp_no: { type: Number, required: true },
            exp_name: { type: String, required: true },
            description: { type: String, default: "" },
            location: { type: mongoose.Schema.Types.ObjectId, ref: "Location" } // Reference to Location
        }
    ]
}, { timestamps: true });

const Course = mongoose.model("Course", CourseSchema);

// ====================== LOCATION ROUTES ======================

// Get all locations
router.get("/locations", async (req, res) => {
    try {
        const locations = await Location.find({});
        console.log(locations);
        res.status(200).json(locations);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Add new location
router.post("/locations", async (req, res) => {
    try {
        const { lab,dept } = req.params;
        console.log(lab);
        console.log(dept);

        if (!lab) return res.status(400).json({ error: "Location name is required" });

        const existing = await Location.findOne({ name:lab });
        if (existing) return res.status(400).json({ error: "Location already exists" });

        const location = new Location({ name:lab });
        await location.save();

        res.status(201).json(location);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete location by ID
router.delete("/locations/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const location = await Location.findById(id);
        if (!location) return res.status(404).json({ error: "Location not found" });

        // Remove reference to this location from all experiments
        await Course.updateMany(
            { "experiments.location": id },
            { $set: { "experiments.$[elem].location": null } },
            { arrayFilters: [{ "elem.location": id }] }
        );

        // Delete the location itself
        await Location.findByIdAndDelete(id);

        res.status(200).json({ message: "Location deleted and experiments updated" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ====================== COURSE ROUTES ======================

// Get all courses with populated locations in experiments
router.get("/courses", async (req, res) => {
    try {
        const courses = await Course.find().populate("experiments.location");
        res.status(200).json(courses);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get single course by ID with populated locations
router.get("/courses/:id", async (req, res) => {
    try {
        const course = await Course.findById(req.params.id).populate("experiments.location");
        if (!course) return res.status(404).json({ error: "Course not found" });
        res.status(200).json(course);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Create new course
router.post("/courses", async (req, res) => {
    try {
        const { course_name, course_code, department } = req.body;
        if (!course_name || !course_code || !department) {
            return res.status(400).json({ error: "All fields are required" });
        }

        const existingCourse = await Course.findOne({ course_code });
        if (existingCourse) return res.status(400).json({ error: "Course code already exists" });

        const newCourse = new Course(req.body);
        await newCourse.save();
        res.status(201).json(newCourse);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete course
router.delete("/courses/:id", async (req, res) => {
    try {
        const course = await Course.findByIdAndDelete(req.params.id);
        if (!course) return res.status(404).json({ error: "Course not found" });
        res.status(200).json({ message: "Course deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Add experiment to course (with location ID)
router.post("/courses/:id/experiments", async (req, res) => {
    try {
        const { exp_no, exp_name, description, location } = req.body;
        if (!exp_no || !exp_name) {
            return res.status(400).json({ error: "Experiment number and name are required" });
        }

        if (location) {
            const locExists = await Location.findById(location);
            if (!locExists) return res.status(400).json({ error: "Invalid location ID" });
        }

        const course = await Course.findById(req.params.id);
        if (!course) return res.status(404).json({ error: "Course not found" });

        course.experiments.push({ exp_no, exp_name, description, location });
        await course.save();

        res.status(201).json(await Course.findById(req.params.id).populate("experiments.location"));
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update experiment (including location ID)
router.put("/courses/:id/experiments/:expId", async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);
        if (!course) return res.status(404).json({ error: "Course not found" });

        const experiment = course.experiments.id(req.params.expId);
        if (!experiment) return res.status(404).json({ error: "Experiment not found" });

        if (req.body.exp_no !== undefined) experiment.exp_no = req.body.exp_no;
        if (req.body.exp_name !== undefined) experiment.exp_name = req.body.exp_name;
        if (req.body.description !== undefined) experiment.description = req.body.description;

        if (req.body.location) {
            const locExists = await Location.findById(req.body.location);
            if (!locExists) return res.status(400).json({ error: "Invalid location ID" });
            experiment.location = req.body.location;
        }

        await course.save();
        res.status(200).json(await Course.findById(req.params.id).populate("experiments.location"));
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete experiment
router.delete("/courses/:id/experiments/:expId", async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);
        if (!course) return res.status(404).json({ error: "Course not found" });

        const experiment = course.experiments.id(req.params.expId);
        if (!experiment) return res.status(404).json({ error: "Experiment not found" });

        experiment.deleteOne();
        await course.save();

        res.status(200).json({ message: "Experiment deleted", course });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
