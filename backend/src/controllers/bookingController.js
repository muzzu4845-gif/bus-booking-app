// controllers/bookingController.js
const Booking = require("../models/Booking");
const Bus = require("../models/Bus");
const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync");
const User = require("../models/User");
const smsService = require("../services/smsService");

// ── Create Booking ────────────────────────────────────────────────────────────
exports.createBooking = catchAsync(async (req, res, next) => {
  const { busId, seats } = req.body;

  if (!busId || !seats || seats.length === 0) {
    return next(new AppError("Please provide busId and seats", 400));
  }

  const bus = await Bus.findOneAndUpdate(
    {
      _id: busId,
      isActive: true,
      availableSeats: { $gte: seats.length },
      bookedSeats: { $not: { $elemMatch: { $in: seats } } },
    },
    {
      $push: { bookedSeats: { $each: seats } },
      $inc: { availableSeats: -seats.length },
    },
    { new: true }
  );

  if (!bus) {
    const existingBus = await Bus.findById(busId);
    if (!existingBus) return next(new AppError("Bus not found", 404));
    if (!existingBus.isActive) return next(new AppError("Bus is not available", 400));
    if (existingBus.availableSeats < seats.length) return next(new AppError("Not enough seats available", 400));
    const alreadyBooked = seats.filter((s) => existingBus.bookedSeats.includes(s));
    return next(new AppError(`Seats ${alreadyBooked.join(", ")} are already booked`, 400));
  }

  const totalAmount = bus.price * seats.length;

  const booking = await Booking.create({
    user: req.user.id,
    bus: busId,
    seats,
    totalAmount,
    status: "confirmed",
    busSnapshot: {
      name: bus.name,
      busNumber: bus.busNumber,
      from: bus.from,
      to: bus.to,
      date: bus.date,
      departureTime: bus.departureTime,
      arrivalTime: bus.arrivalTime,
    },
  });

  // SMS send பண்ணு
  try {
    const user = await User.findById(req.user.id);
    console.log("=== SMS DEBUG ===");
    console.log("User ID:", req.user.id);
    console.log("User phone:", user?.phone);
    if (user?.phone) {
      console.log("Sending SMS to:", user.phone);
      await smsService.sendBookingConfirmedSMS(user.phone, booking);
    } else {
      console.log("No phone — SMS skipped");
    }
  } catch (smsError) {
    console.error("Booking SMS failed:", smsError.message);
  }

  res.status(201).json({
    success: true,
    message: "Booking confirmed!",
    booking,
  });
});

// ── Get My Bookings ───────────────────────────────────────────────────────────
exports.getMyBookings = catchAsync(async (req, res, next) => {
  const bookings = await Booking.find({ user: req.user.id })
    .populate("bus", "name busNumber from to date departureTime arrivalTime price")
    .sort("-createdAt");

  res.status(200).json({
    success: true,
    count: bookings.length,
    bookings,
  });
});

// ── Cancel Booking ────────────────────────────────────────────────────────────
exports.cancelBooking = catchAsync(async (req, res, next) => {
  const booking = await Booking.findById(req.params.id);

  if (!booking) return next(new AppError("Booking not found", 404));
  if (booking.user.toString() !== req.user.id) return next(new AppError("You can only cancel your own booking", 403));
  if (booking.status === "cancelled") return next(new AppError("Booking is already cancelled", 400));

  const bus = await Bus.findById(booking.bus);
  if (bus) {
    bus.bookedSeats = bus.bookedSeats.filter((seat) => !booking.seats.includes(seat));
    bus.availableSeats += booking.seats.length;
    await bus.save();
  }

  booking.status = "cancelled";
  booking.paymentStatus = booking.paymentStatus === "paid" ? "refunded" : "unpaid";
  await booking.save();

  // SMS send பண்ணு
  try {
    const user = await User.findById(req.user.id);
    console.log("Cancel SMS - User phone:", user?.phone);
    if (user?.phone) {
      await smsService.sendBookingCancelledSMS(user.phone, booking);
    }
  } catch (smsError) {
    console.error("Cancel SMS failed:", smsError.message);
  }

  res.status(200).json({
    success: true,
    message: "Booking cancelled successfully",
    booking,
  });
});

// ── Mock Payment ──────────────────────────────────────────────────────────────
exports.createPaymentOrder = catchAsync(async (req, res, next) => {
  const booking = await Booking.findById(req.params.id);

  if (!booking) return next(new AppError("Booking not found", 404));
  if (booking.user.toString() !== req.user.id) return next(new AppError("Unauthorized", 403));
  if (booking.paymentStatus === "paid") return next(new AppError("Already paid", 400));
  if (booking.status === "cancelled") return next(new AppError("Cannot pay for cancelled booking", 400));

  const mockPaymentId = `PAY-${Date.now()}-${Math.random()
    .toString(36)
    .substring(2, 8)
    .toUpperCase()}`;

  booking.paymentStatus = "paid";
  booking.paymentId = mockPaymentId;
  await booking.save();

  // SMS send பண்ணு
  try {
    const user = await User.findById(req.user.id);
    console.log("Payment SMS - User phone:", user?.phone);
    if (user?.phone) {
      await smsService.sendPaymentSuccessSMS(user.phone, booking);
    }
  } catch (smsError) {
    console.error("Payment SMS failed:", smsError.message);
  }

  res.status(200).json({
    success: true,
    message: "Payment successful! 🎉",
    paymentId: mockPaymentId,
    booking,
  });
});

// ── Verify Payment ────────────────────────────────────────────────────────────
exports.verifyPayment = catchAsync(async (req, res, next) => {
  res.status(200).json({
    success: true,
    message: "Payment verified!",
  });
});

// ── Get All Bookings Admin ────────────────────────────────────────────────────
exports.getAllBookings = catchAsync(async (req, res, next) => {
  const bookings = await Booking.find()
    .populate("user", "name email")
    .populate("bus", "name busNumber from to date")
    .sort("-createdAt");

  res.status(200).json({
    success: true,
    count: bookings.length,
    bookings,
  });
});