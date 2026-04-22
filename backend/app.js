// app.js — Express app setup: middleware, routes, global error handler
// Keeping app config separate from server startup is a best practice
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const app = express();

// ── Middleware ────────────────────────────────────────────────────────────────
app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:3000" }));
app.use(express.json());
app.use(morgan("dev")); // HTTP request logger

// ── Routes ────────────────────────────────────────────────────────────────────
// TODO: Import and mount route files as they're built
app.use("/api/auth", require("./src/routes/authRoutes"));
app.use("/api/buses", require("./src/routes/busRoutes"));
 app.use("/api/bookings", require("./src/routes/bookingRoutes"));

app.get("/", (req, res) => res.json({ message: "BusGo API is running 🚌" }));

// ── Global Error Handler ──────────────────────────────────────────────────────
// Must be defined AFTER all routes
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
});

module.exports = app;
