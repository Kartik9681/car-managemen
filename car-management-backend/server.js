const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

console.log("JWT_SECRET in server.js:", process.env.JWT_SECRET); // Debugging

const setupSwaggerDocs = require("./routes/docs"); // Import Swagger


const app = express();
app.use(express.json());
app.use(cors());
app.use("/uploads", express.static("uploads")); // Serve uploaded images
setupSwaggerDocs(app); // Enable API documentation


// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/cars", require("./routes/carRoutes")); // Car routes

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
