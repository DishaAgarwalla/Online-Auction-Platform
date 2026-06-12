const Razorpay = require("razorpay");
const crypto = require("crypto");
const prisma = require("../config/prisma");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create Payment Order
exports.createPaymentOrder = async (req, res) => {
  try {
    const auctionId = Number(req.params.auctionId);

    const auction = await prisma.auction.findUnique({
      where: {
        id: auctionId,
      },
    });

    if (!auction) {
      return res.status(404).json({
        message: "Auction not found",
      });
    }

    if (auction.winnerId !== req.user.id) {
      return res.status(403).json({
        message: "Only winner can make payment",
      });
    }

    if (auction.paymentStatus === "paid") {
      return res.status(400).json({
        message: "Auction already paid",
      });
    }

    const options = {
      amount: Math.round(auction.currentBid * 100),
      currency: "INR",
      receipt: `auction_${auction.id}`,
    };

    const order = await razorpay.orders.create(options);

    res.status(200).json({
      success: true,
      order,
      auction,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Verify Payment
exports.verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      auctionId,
    } = req.body;

    const generatedSignature = crypto
      .createHmac(
        "sha256",
        process.env.RAZORPAY_KEY_SECRET
      )
      .update(
        razorpay_order_id + "|" + razorpay_payment_id
      )
      .digest("hex");

    const isValid =
      generatedSignature === razorpay_signature;

    if (!isValid) {
      return res.status(400).json({
        message: "Payment verification failed",
      });
    }

    await prisma.auction.update({
      where: {
        id: Number(auctionId),
      },
      data: {
        paymentStatus: "paid",
        paidAt: new Date(),
      },
    });

    res.status(200).json({
      success: true,
      message: "Payment successful",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};