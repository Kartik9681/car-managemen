const Car = require("../models/Car");

exports.createCar = async (req, res) => {
  try {
    const { title, description, tags } = req.body;
    const images = req.files.map(file => file.path); // Store image URLs

    const newCar = new Car({ title, description, images, tags, userId: req.user.id });
    await newCar.save();
    res.status(201).json(newCar);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

exports.getCars = async (req, res) => {
  try {
    const cars = await Car.find({ userId: req.user.id });
    res.json(cars);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};
    