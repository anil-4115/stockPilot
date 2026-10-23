
require("dotenv").config();
const express = require("express");
const path = require("path");
const productRoutes = require("./routes/productRoutes");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serve frontend files
app.use(express.static(path.join(__dirname, "public")));

// Health check route
app.get("/api/health", (req, res) => {
    res.status(200).json({
        success: true,
        message: "StockPilot server is running!"
    });
});

// Product routes
app.use("/api/products", productRoutes);

// Handle unknown API routes
app.use("/api", (req, res) => {
    res.status(404).json({
        success: false,
        message: "API route not found."
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`StockPilot server running at http://localhost:${PORT}`);
});
