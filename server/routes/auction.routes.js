const express = require("express");

const {
  createAuction,
  getAuctions,
  getAuctionById,
  deleteAuction,
  closeAuction,
} = require("../controllers/auction.controller");

const { protect } = require("../middleware/auth.middleware");
const upload = require("../middleware/upload.middleware");

const router = express.Router();

// Create Auction with Image
router.post(
  "/",
  protect,
  upload.single("image"),
  createAuction
);

router.get("/", getAuctions);

router.get("/:id", getAuctionById);

router.delete("/:id", protect, deleteAuction);

router.put("/:id/close", protect, closeAuction);

module.exports = router;