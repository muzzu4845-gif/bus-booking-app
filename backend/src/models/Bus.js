// models/Bus.js — ஒரு bus document எப்படி இருக்கணும்னு define பண்றோம்
const mongoose = require("mongoose");

const busSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Bus name is required"],
      trim: true,
    },

    busNumber: {
      type: String,
      required: [true, "Bus number is required"],
      unique: true,
      uppercase: true, // "tn01" → "TN01" automatically
    },

    from: {
      type: String,
      required: [true, "Departure city is required"],
      trim: true,
      lowercase: true, // Search case-insensitive ஆக இருக்கும்
    },

    to: {
      type: String,
      required: [true, "Destination city is required"],
      trim: true,
      lowercase: true,
    },

    departureTime: {
      type: String,
      required: [true, "Departure time is required"],
      // "08:30" format la store பண்றோம்
    },

    arrivalTime: {
      type: String,
      required: [true, "Arrival time is required"],
    },

    duration: {
      type: String,
      required: [true, "Duration is required"],
      // Example: "6h 30m"
    },

    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
    },

    totalSeats: {
      type: Number,
      required: [true, "Total seats is required"],
      min: [1, "Must have at least 1 seat"],
    },

    availableSeats: {
      type: Number,
      // Default = totalSeats — bus create பண்ணும் போது automatically set ஆகும்
    },

    // எந்த seats book ஆச்சுன்னு track பண்ண
    bookedSeats: {
      type: [Number],
      default: [],
    },

    busType: {
      type: String,
      enum: ["AC", "Non-AC", "Sleeper", "Semi-Sleeper"],
      default: "AC",
    },

    amenities: {
      type: [String],
      // Example: ["WiFi", "USB Charging", "Water Bottle"]
      default: [],
    },

    isActive: {
      type: Boolean,
      default: true, // false ஆனா search results la வராது
    },

    date: {
      type: String,
      required: [true, "Travel date is required"],
      // "2024-12-25" format
    },
  },
  {
    timestamps: true,
  }
);

// ── Pre-save Hook ─────────────────────────────────────────────────────────────
// availableSeats set ஆகலன்னா totalSeats ஐ default ஆ use பண்ணு
busSchema.pre("save", function (next) {
  if (this.isNew && this.availableSeats === undefined) {
    this.availableSeats = this.totalSeats;
  }
  next();
});

// ── Index ─────────────────────────────────────────────────────────────────────
// from, to, date — இந்த 3 fields la search fast ஆக இருக்கும்
busSchema.index({ from: 1, to: 1, date: 1 });

const Bus = mongoose.model("Bus", busSchema);
module.exports = Bus;