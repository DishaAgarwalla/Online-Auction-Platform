const express = require("express");

const {
  addToWatchlist,
  removeFromWatchlist,
  getMyWatchlist,
} = require("../controllers/watchlist.controller");

const { protect } = require("../middleware/auth.middleware");

const router = express.Router();

// Get My Watchlist
router.get("/", protect, getMyWatchlist);

// Add Auction to Watchlist
router.post("/:auctionId", protect, addToWatchlist);

// Remove Auction from Watchlist
router.delete("/:auctionId", protect, removeFromWatchlist);

module.exports = router;