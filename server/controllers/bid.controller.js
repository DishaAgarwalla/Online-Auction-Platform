const prisma = require("../config/prisma");
const sendEmail = require("../services/email.service");

// Place Bid
exports.placeBid = async (req, res) => {
  try {
    const { auctionId, amount } = req.body;

    const auction = await prisma.auction.findUnique({
      where: {
        id: Number(auctionId),
      },
      include: {
        seller: true,
      },
    });

    if (!auction) {
      return res.status(404).json({
        message: "Auction not found",
      });
    }

    if (auction.status !== "active") {
      return res.status(400).json({
        message: "Auction is closed",
      });
    }

    if (amount <= auction.currentBid) {
      return res.status(400).json({
        message: `Bid must be greater than ${auction.currentBid}`,
      });
    }

    // Previous Highest Bid
    const previousHighestBid = await prisma.bid.findFirst({
      where: {
        auctionId: auction.id,
      },
      orderBy: {
        amount: "desc",
      },
      include: {
        bidder: true,
      },
    });

    // Create Bid
    const bid = await prisma.bid.create({
      data: {
        amount,
        auctionId: auction.id,
        bidderId: req.user.id,
      },
      include: {
        bidder: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    // Update Current Bid
    const updatedAuction = await prisma.auction.update({
      where: {
        id: auction.id,
      },
      data: {
        currentBid: amount,
      },
    });

    // -------------------------
    // SELLER NOTIFICATION + EMAIL
    // -------------------------
    if (auction.sellerId !== req.user.id) {
      await prisma.notification.create({
        data: {
          userId: auction.sellerId,
          message: `${bid.bidder.name} placed a bid of ₹${amount} on "${auction.title}"`,
        },
      });

      try {
        await sendEmail(
          auction.seller.email,
          "New Bid Received",
          `${bid.bidder.name} placed a bid of ₹${amount} on your auction "${auction.title}".`
        );
      } catch (err) {
        console.log("Seller Email Error:", err.message);
      }
    }

    // -------------------------
    // OUTBID NOTIFICATION + EMAIL
    // -------------------------
    if (
      previousHighestBid &&
      previousHighestBid.bidderId !== req.user.id
    ) {
      await prisma.notification.create({
        data: {
          userId: previousHighestBid.bidderId,
          message: `You have been outbid on "${auction.title}". New bid: ₹${amount}`,
        },
      });

      try {
        await sendEmail(
          previousHighestBid.bidder.email,
          "You Have Been Outbid",
          `Someone placed a higher bid of ₹${amount} on "${auction.title}".`
        );
      } catch (err) {
        console.log("Outbid Email Error:", err.message);
      }
    }

    // -------------------------
    // WATCHLIST NOTIFICATIONS
    // -------------------------
    const watchlistUsers = await prisma.watchlist.findMany({
      where: {
        auctionId: auction.id,
      },
    });

    for (const watch of watchlistUsers) {
      if (
        watch.userId !== req.user.id &&
        watch.userId !== auction.sellerId
      ) {
        await prisma.notification.create({
          data: {
            userId: watch.userId,
            message: `New bid placed on watched auction "${auction.title}"`,
          },
        });
      }
    }

    // -------------------------
    // SOCKET EVENTS
    // -------------------------
    const io = req.app.get("io");

    if (io) {
      io.to(`auction-${auction.id}`).emit("newBid", {
        auctionId: auction.id,
        currentBid: amount,
        bidder: bid.bidder,
        timestamp: bid.createdAt,
      });

      io.emit("notification", {
        auctionId: auction.id,
        title: auction.title,
        amount,
      });
    }

    res.status(201).json({
      message: "Bid placed successfully",
      bid,
      auction: updatedAuction,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get Bid History
exports.getBidHistory = async (req, res) => {
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

    const bids = await prisma.bid.findMany({
      where: {
        auctionId,
      },
      include: {
        bidder: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        amount: "desc",
      },
    });

    res.status(200).json({
      totalBids: bids.length,
      currentBid: auction.currentBid,
      bids,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};