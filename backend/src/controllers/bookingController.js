// controllers/bookingController.js
const Booking = require("../models/Booking");
const Bus = require("../models/Bus");
const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync");
const Razorpay = require("razorpay");
const crypto = require("crypto");

// Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

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

  res.status(200).json({
    success: true,
    message: "Booking cancelled successfully",
    booking,
  });
});

// ── Create Razorpay Order ─────────────────────────────────────────────────────
exports.createPaymentOrder = catchAsync(async (req, res, next) => {
  const booking = await Booking.findById(req.params.id);

  console.log("=== CREATE ORDER ===");
  console.log("Booking ID:", req.params.id);
  console.log("User ID:", req.user.id);
  console.log("Booking user:", booking?.user?.toString());
  console.log("RAZORPAY_KEY_ID:", process.env.RAZORPAY_KEY_ID ? "exists" : "MISSING!");
  console.log("RAZORPAY_KEY_SECRET:", process.env.RAZORPAY_KEY_SECRET ? "exists" : "MISSING!");

  if (!booking) return next(new AppError("Booking not found", 404));
  if (booking.user.toString() !== req.user.id) {
    console.log("User mismatch!", booking.user.toString(), "vs", req.user.id);
    return next(new AppError("Unauthorized", 403));
  }
  if (booking.paymentStatus === "paid") return next(new AppError("Already paid", 400));
  if (booking.status === "cancelled") return next(new AppError("Cannot pay for cancelled booking", 400));

  try {
    const order = await razorpay.orders.create({
      amount: booking.totalAmount * 100,
      currency: "INR",
      receipt: `booking_${booking._id}`,
    });

    console.log("Razorpay order created:", order.id);

    res.status(200).json({
      success: true,
      order,
      booking,
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (razorpayError) {
    console.error("Razorpay error:", razorpayError.message);
    return next(new AppError(`Razorpay error: ${razorpayError.message}`, 500));
  }
});

// ── Verify Payment ────────────────────────────────────────────────────────────
exports.verifyPayment = catchAsync(async (req, res, next) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  const body = razorpay_order_id + "|" + razorpay_payment_id;
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(body)
    .digest("hex");

  if (expectedSignature !== razorpay_signature) {
    return next(new AppError("Payment verification failed", 400));
  }

  const booking = await Booking.findById(req.params.id);
  booking.paymentStatus = "paid";
  booking.paymentId = razorpay_payment_id;
  await booking.save();

  res.status(200).json({
    success: true,
    message: "Payment successful! 🎉",
    booking,
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