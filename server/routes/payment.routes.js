const express = require("express");

const {
  createPaymentOrder,
  verifyPayment,
} = require("../controllers/payment.controller");

const {
  protect,
} = require("../middleware/auth.middleware");

const router = express.Router();

router.post(
  "/create-order/:auctionId",
  protect,
  createPaymentOrder
);

router.post(
  "/verify",
  protect,
  verifyPayment
);

module.exports = router;