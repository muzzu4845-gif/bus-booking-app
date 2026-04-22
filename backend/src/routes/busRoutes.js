// routes/busRoutes.js
const express = require("express");
const router = express.Router();

const {
  searchBuses,
  getBus,
  createBus,
  updateBus,
  deleteBus,
  getAllBuses,
} = require("../controllers/busController");

const { protect, restrictTo } = require("../middleware/authMiddleware");

// Public — anyone search பண்ணலாம்
router.get("/search", searchBuses);
router.get("/:id", getBus);

// Admin only — protect + restrictTo chain பண்றோம்
router.use(protect, restrictTo("admin")); // இதுக்கு கீழ உள்ள எல்லா routes உம் protected
router.get("/admin/all", getAllBuses);
router.post("/", createBus);
router.put("/:id", updateBus);
router.delete("/:id", deleteBus);

module.exports = router;