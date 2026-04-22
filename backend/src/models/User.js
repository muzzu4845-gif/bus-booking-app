// models/User.js — MongoDB la oru user document எப்படி இருக்கணும்னு define பண்றோம்
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,     // Same email la 2 accounts create பண்ண முடியாது
      lowercase: true,  // Always lowercase la store பண்ணும்
      trim: true,
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false,    // IMPORTANT: query பண்ணும் போது password automatically hide ஆகும்
    },

    role: {
      type: String,
      enum: ["user", "admin"], // இந்த 2 values மட்டும் allowed
      default: "user",
    },
  },
  {
    timestamps: true, // createdAt, updatedAt — automatically add ஆகும்
  }
);

// ── Pre-save Hook ──────────────────────────────────────────────────────────────
// DB la save ஆகுற முன்னாடி இது run ஆகும் — password hash பண்ணும்
userSchema.pre("save", async function (next) {
  // Password மாறலன்னா skip பண்ணிடு (update flows la useful)
  if (!this.isModified("password")) return next();

  // 12 = salt rounds — எவ்வளவு அதிகமா இருந்தா அவ்வளவு secure, ஆனா slow
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// ── Instance Method ────────────────────────────────────────────────────────────
// Login time la — user type பண்ண password correct-ah nu check பண்ண இதை use பண்ணுவோம்
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model("User", userSchema);
module.exports = User;