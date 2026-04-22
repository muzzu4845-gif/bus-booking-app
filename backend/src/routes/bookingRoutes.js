// routes/bookingRoutes.js
const express = require("express");
const router = express.Router();

const {
  createBooking,
  getMyBookings,
  cancelBooking,
  getAllBookings,
  mockPayment, 
} = require("../controllers/bookingController");

const { protect, restrictTo } = require("../middleware/authMiddleware");

// எல்லா booking routes உம் login வேணும்
router.use(protect);

router.post("/", createBooking);
router.post("/:id/pay", mockPayment);
router.get("/my", getMyBookings);
router.put("/:id/cancel", cancelBooking);

// Admin only
router.get("/admin/all", restrictTo("admin"), getAllBookings);

module.exports = router;