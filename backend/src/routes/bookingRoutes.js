const express = require("express");
const router = express.Router();

const {
  createBooking,
  getMyBookings,
  cancelBooking,
  getAllBookings,
  createPaymentOrder,
  verifyPayment,
} = require("../controllers/bookingController");

const { protect, restrictTo } = require("../middleware/authMiddleware");

router.use(protect);

router.post("/", createBooking);
router.get("/my", getMyBookings);
router.put("/:id/cancel", cancelBooking);
router.post("/:id/create-order", createPaymentOrder);
router.post("/:id/verify-payment", verifyPayment);

router.get("/admin/all", restrictTo("admin"), getAllBookings);

module.exports = router;