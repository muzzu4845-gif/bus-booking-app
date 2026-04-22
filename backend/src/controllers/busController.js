// controllers/busController.js — Bus CRUD + Search logic
const Bus = require("../models/Bus");
const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync");

// ── Search Buses ──────────────────────────────────────────────────────────────
// GET /api/buses?from=chennai&to=bangalore&date=2024-12-25
exports.searchBuses = catchAsync(async (req, res, next) => {
  const { from, to, date } = req.query;

  if (!from || !to || !date) {
    return next(new AppError("Please provide from, to and date", 400));
  }

  const buses = await Bus.find({
    from: from.toLowerCase(),
    to: to.toLowerCase(),
    date,
    isActive: true,
    availableSeats: { $gt: 0 }, // 0 seats இருந்தா show பண்ணாதே
  });

  res.status(200).json({
    success: true,
    count: buses.length,
    buses,
  });
});

// ── Get Single Bus ────────────────────────────────────────────────────────────
// GET /api/buses/:id
exports.getBus = catchAsync(async (req, res, next) => {
  const bus = await Bus.findById(req.params.id);

  if (!bus) {
    return next(new AppError("Bus not found", 404));
  }

  res.status(200).json({
    success: true,
    bus,
  });
});

// ── Create Bus (Admin only) ───────────────────────────────────────────────────
// POST /api/buses
exports.createBus = catchAsync(async (req, res, next) => {
  const bus = await Bus.create(req.body);

  res.status(201).json({
    success: true,
    message: "Bus created successfully",
    bus,
  });
});

// ── Update Bus (Admin only) ───────────────────────────────────────────────────
// PUT /api/buses/:id
exports.updateBus = catchAsync(async (req, res, next) => {
  const bus = await Bus.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,           // Updated document return பண்ணு
      runValidators: true, // Schema validation run ஆகும்
    }
  );

  if (!bus) {
    return next(new AppError("Bus not found", 404));
  }

  res.status(200).json({
    success: true,
    message: "Bus updated successfully",
    bus,
  });
});

// ── Delete Bus (Admin only) ───────────────────────────────────────────────────
// DELETE /api/buses/:id
exports.deleteBus = catchAsync(async (req, res, next) => {
  const bus = await Bus.findById(req.params.id);

  if (!bus) {
    return next(new AppError("Bus not found", 404));
  }

  // Hard delete பண்ணாம soft delete — isActive false பண்றோம்
  // Data இருக்கும், ஆனா search la வராது
  bus.isActive = false;
  await bus.save();

  res.status(200).json({
    success: true,
    message: "Bus removed successfully",
  });
});

// ── Get All Buses (Admin only) ────────────────────────────────────────────────
// GET /api/buses/admin/all
exports.getAllBuses = catchAsync(async (req, res, next) => {
  const buses = await Bus.find().sort("-createdAt");

  res.status(200).json({
    success: true,
    count: buses.length,
    buses,
  });
});