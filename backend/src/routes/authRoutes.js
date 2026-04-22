// routes/authRoutes.js — Auth endpoints define பண்றோம்
const express = require("express");
const router = express.Router();

const {
  register,
  login,
  getMe,
} = require("../controllers/authController");

const { protect } = require("../middleware/authMiddleware");

// Public routes — token தேவையில்லை
router.post("/register", register);
router.post("/login", login);

// Protected route — token வேணும்
// protect middleware first run ஆகும், pass ஆனா getMe run ஆகும்
router.get("/me", protect, getMe);

module.exports = router;