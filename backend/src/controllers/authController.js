// controllers/authController.js — Register & Login logic
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync");

// ── Helper: JWT Token Generate பண்ண ──────────────────────────────────────────
// Controller la repeatedly எழுதாம, ஒரே இடத்துல வச்சிருக்கோம்
const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },                          // Payload — token உள்ள என்ன store பண்றோம்
    process.env.JWT_SECRET,                  // Secret key — .env la இருக்கு
    { expiresIn: process.env.JWT_EXPIRES_IN } // "7d" — 7 days கழிச்சு expire ஆகும்
  );
};

// ── Register ──────────────────────────────────────────────────────────────────
// POST /api/auth/register
exports.register = catchAsync(async (req, res, next) => {
  const { name, email, password, phone } = req.body;

  // 1. Email already exists-ஆ nu check பண்ணு
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return next(new AppError("Email already registered", 400));
  }

  // 2. User create பண்ணு — password pre-save hook la automatically hash ஆகும்
  const user = await User.create({ name, email, password, phone });

  // 3. Token generate பண்ணு
  const token = generateToken(user._id);

  // 4. Response அனுப்பு — password போகாம இருக்க undefined set பண்றோம்
  user.password = undefined;

  res.status(201).json({
    success: true,
    message: "Account created successfully",
    token,
    user,
  });
});

// ── Login ─────────────────────────────────────────────────────────────────────
// POST /api/auth/login
exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // 1. Email & password இருக்கா nu check பண்ணு
  if (!email || !password) {
    return next(new AppError("Please provide email and password", 400));
  }

  // 2. User கண்டுபிடி — select("+password") இல்லன்னா password field வராது
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(new AppError("Invalid email or password", 401));
  }

  // 3. Password correct-ஆ nu check பண்ணு (User model la எழுதின instance method)
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    return next(new AppError("Invalid email or password", 401));
  }

  // 4. Token generate பண்ணி அனுப்பு
  const token = generateToken(user._id);
  user.password = undefined;

  res.status(200).json({
    success: true,
    message: "Login successful",
    token,
    user,
  });
});

// ── Get Current User ──────────────────────────────────────────────────────────
// GET /api/auth/me — Protected route (token வேணும்)
exports.getMe = catchAsync(async (req, res, next) => {
  // req.user — auth middleware la set ஆகும் (next step la பார்ப்போம்)
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    user,
  });
});