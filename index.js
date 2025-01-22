const express = require("express");
const dotenv = require("dotenv");
// const morgan = require("morgan");
const cors = require("cors");
// const routes = require("./routes")

// Initialize environment variables
dotenv.config();

// Create the Express app
const app = express();

// Middleware
app.use(express.json()); // For parsing JSON requests
app.use(express.urlencoded({ extended: true })); // For parsing URL-encoded data
app.use(cors()); // Enable CORS
// app.use(morgan("dev")); // Log requests in development mode

// Routes
// app.use("/api", routes); // Use the router for all /api routes

// Health check route
app.get("/", (req, res) => {
  res.status(200).json({ message: "Welcome to the Restaurant Analytics API!" });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

// 404 route handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
