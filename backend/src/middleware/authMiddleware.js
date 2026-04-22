// middleware/authMiddleware.js — Token verify பண்ணி req.user set பண்றோம்
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync");

// ── Protect Middleware ────────────────────────────────────────────────────────
// இதை route la போட்டா — token இல்லாம அந்த route access பண்ண முடியாது
exports.protect = catchAsync(async (req, res, next) => {
  // 1. Token இருக்கா nu check பண்ணு — "Bearer <token>" format la வரும்
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1]; // "Bearer xxx" → "xxx"
  }

  if (!token) {
    return next(new AppError("You are not logged in. Please login.", 401));
  }

  // 2. Token valid-ஆ nu verify பண்ணு
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  // Invalid/expired token-ஆ இருந்தா jwt.verify error throw பண்ணும்
  // catchAsync அதை global error handler கிட்ட அனுப்பும்

  // 3. Token la இருக்க id la user இன்னும் exist பண்றாங்களா nu check பண்ணு
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(new AppError("User no longer exists", 401));
  }

  // 4. User ஐ req la attach பண்ணு — அடுத்த middleware/controller கு கிடைக்கும்
  req.user = currentUser;
  next();
});

// ── Restrict To Middleware ────────────────────────────────────────────────────
// Usage: restrictTo("admin") — admin மட்டும் access பண்ண முடியும்
// Usage: restrictTo("admin", "user") — both access பண்ணலாம்
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    // req.user — protect middleware run ஆன பிறகே இது call ஆகும்
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError("You do not have permission to do this action", 403)
      );
    }
    next();
  };
};