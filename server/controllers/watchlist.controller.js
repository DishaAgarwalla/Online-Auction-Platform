const prisma = require("../config/prisma");

// Add Auction to Watchlist
exports.addToWatchlist = async (req, res) => {
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

    const existing = await prisma.watchlist.findUnique({
      where: {
        userId_auctionId: {
          userId: req.user.id,
          auctionId,
        },
      },
    });

    if (existing) {
      return res.status(400).json({
        message: "Auction already in watchlist",
      });
    }

    const watchlist = await prisma.watchlist.create({
      data: {
        userId: req.user.id,
        auctionId,
      },
    });

    res.status(201).json({
      message: "Added to watchlist",
      watchlist,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Remove Auction from Watchlist
exports.removeFromWatchlist = async (req, res) => {
  try {
    const auctionId = Number(req.params.auctionId);

    const existing = await prisma.watchlist.findUnique({
      where: {
        userId_auctionId: {
          userId: req.user.id,
          auctionId,
        },
      },
    });

    if (!existing) {
      return res.status(404).json({
        message: "Auction not found in watchlist",
      });
    }

    await prisma.watchlist.delete({
      where: {
        id: existing.id,
      },
    });

    res.status(200).json({
      message: "Removed from watchlist",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get My Watchlist
exports.getMyWatchlist = async (req, res) => {
  try {
    const watchlist = await prisma.watchlist.findMany({
      where: {
        userId: req.user.id,
      },
      include: {
        auction: {
          include: {
            seller: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
            winner: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.status(200).json(watchlist);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};