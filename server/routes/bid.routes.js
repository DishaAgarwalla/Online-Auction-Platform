const express = require("express");

const {
  placeBid,
  getBidHistory,
} = require("../controllers/bid.controller");

const { protect } = require("../middleware/auth.middleware");

const router = express.Router();

router.post("/", protect, placeBid);

router.get("/auction/:auctionId", getBidHistory);

module.exports = router;