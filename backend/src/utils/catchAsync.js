// catchAsync.js — Wraps async route handlers to avoid try/catch repetition
// Usage: router.get("/", catchAsync(async (req, res) => { ... }))
const catchAsync = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = catchAsync;
