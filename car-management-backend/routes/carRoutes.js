const express = require("express");
const Car = require("../models/Car");
const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

// 📌 SEARCH CARS (user-specific)
router.get("/search", authMiddleware, async (req, res) => {
  const { keyword,userID } = req.query;
  console.log(userID)
  

  if (!keyword) return res.status(400).json({ message: "Keyword is required" });

  try {
    // Find cars belonging to the user and matching the search keyword
    const cars = await Car.find({
      user: userID, // Filter by user
      $or: [
        { title: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
        { tags: { $regex: keyword, $options: "i" } },
      ],
    }).sort({ createdAt: -1 });

    if (cars.length === 0) return res.status(404).json({ message: "No matching cars found" });

    res.json(cars);
  } catch (err) {
    console.error("Search Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// 📌 CREATE a new car
router.post("/", authMiddleware, upload.array("images", 10), async (req, res) => {
  try {
    const { title, description, tags } = req.body;
    const images = req.files.map((file) => `/uploads/${file.filename}`);

    const newCar = new Car({
      user: req.user,
      title,
      description,
      images,
      tags: tags ? tags.split(",") : [],
    });

    await newCar.save();
    res.status(201).json(newCar);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server Error" });
  }
});

// 📌 GET all cars for the logged-in user
router.get("/", authMiddleware, async (req, res) => {
  try {
    const cars = await Car.find({ user: req.user }).sort({ createdAt: -1 });
    res.json(cars);
  } catch (error) {
    res.status(500).json({ msg: "Server Error" });
  }
});

// 📌 GET a single car by ID
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) return res.status(404).json({ msg: "Car not found" });

    if (car.user.toString() !== req.user) return res.status(403).json({ msg: "Not authorized" });

    res.json(car);
  } catch (error) {
    res.status(500).json({ msg: "Server Error" });
  }
});

// 📌 UPDATE a car
// 📌 UPDATE a car
router.put("/:id", authMiddleware, upload.array("images", 10), async (req, res) => {
  try {
    let car = await Car.findById(req.params.id);
    if (!car) return res.status(404).json({ msg: "Car not found" });

    if (car.user.toString() !== req.user.toString()) {
      return res.status(403).json({ msg: "Not authorized" });
    }

    const { title, description, tags } = req.body;
    const images = req.files.length > 0 ? req.files.map((file) => `/uploads/${file.filename}`) : car.images;

    // Update the car document
    car = await Car.findByIdAndUpdate(
      req.params.id, 
      { 
        title, 
        description, 
        images, 
        tags: tags ? tags.split(",") : car.tags 
      }, 
      { new: true } // Return the updated car object
    );

    res.json(car);
  } catch (error) {
    console.error("Error while updating car:", error);
    res.status(500).json({ msg: "Server Error" });
  }
});


// 📌 DELETE a car
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) return res.status(404).json({ msg: "Car not found" });

    if (car.user.toString() !== req.user) return res.status(403).json({ msg: "Not authorized" });

    await car.deleteOne();
    res.json({ msg: "Car deleted successfully" });
  } catch (error) {
    res.status(500).json({ msg: "Server Error" });
  }
});

module.exports = router;
