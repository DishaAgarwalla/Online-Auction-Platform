const express = require("express");

const {
  getProfile,
  updateProfile,
  changePassword,
  getAnalytics,
  getMyAuctions,
  getMyBids,
  getWonAuctions,
} = require("../controllers/user.controller");

const { protect } = require("../middleware/auth.middleware");

const router = express.Router();

// Profile
router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);

// Password
router.put(
  "/change-password",
  protect,
  changePassword
);

// Analytics
router.get(
  "/analytics",
  protect,
  getAnalytics
);

// Auctions
router.get(
  "/my-auctions",
  protect,
  getMyAuctions
);

// Bids
router.get(
  "/my-bids",
  protect,
  getMyBids
);

// Won Auctions
router.get(
  "/won-auctions",
  protect,
  getWonAuctions
);

module.exports = router;