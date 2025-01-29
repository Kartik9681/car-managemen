const mongoose = require("mongoose");

const CarSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Owner of the car
  title: { type: String, required: true },
  description: { type: String, required: true },
  images: { type: [String], default: [] }, // Store image URLs
  tags: { type: [String], default: [] }, // Car type, company, dealer, etc.
}, { timestamps: true });

module.exports = mongoose.model("Car", CarSchema);
