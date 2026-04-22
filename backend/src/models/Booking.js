// models/Booking.js — ஒரு booking document எப்படி இருக்கணும்
const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",        // User model reference
      required: true,
    },

    bus: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Bus",         // Bus model reference
      required: true,
    },

    seats: {
      type: [Number],
      required: [true, "Please select at least one seat"],
      validate: {
        validator: (seats) => seats.length > 0,
        message: "At least one seat must be selected",
      },
    },

    totalAmount: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled"],
      default: "pending",
    },

    paymentStatus: {
      type: String,
      enum: ["unpaid", "paid", "refunded"],
      default: "unpaid",
    },

    // Payment பண்ணும் போது save பண்றோம் — mock payment step la use ஆகும்
    paymentId: {
      type: String,
      default: null,
    },

    // Booking time la bus details snapshot — bus delete ஆனாலும் history காணும்
    busSnapshot: {
      name: String,
      busNumber: String,
      from: String,
      to: String,
      date: String,
      departureTime: String,
      arrivalTime: String,
    },
  },
  {
    timestamps: true,
  }
);

const Booking = mongoose.model("Booking", bookingSchema);
module.exports = Booking;