const prisma = require("../config/prisma");

// Create Auction
exports.createAuction = async (req, res) => {
  try {
    const {
      title,
      description,
      startingPrice,
      endTime,
    } = req.body;

    const image = req.file
      ? `/uploads/${req.file.filename}`
      : null;

    const auction = await prisma.auction.create({
      data: {
        title,
        description,
        image,
        startingPrice: Number(startingPrice),
        currentBid: Number(startingPrice),
        endTime: new Date(endTime),
        sellerId: req.user.id,
      },
    });

    res.status(201).json({
      message: "Auction created successfully",
      auction,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get All Auctions + Pagination + Search + Filter + Sort
exports.getAuctions = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      status,
      sort,
    } = req.query;

    const skip =
      (Number(page) - 1) * Number(limit);

    const where = {};

    if (search) {
      where.title = {
        contains: search,
      };
    }

    if (status) {
      where.status = status;
    }

    let orderBy = {
      createdAt: "desc",
    };

    if (sort === "bid") {
      orderBy = {
        currentBid: "desc",
      };
    }

    if (sort === "latest") {
      orderBy = {
        createdAt: "desc",
      };
    }

    const totalAuctions =
      await prisma.auction.count({
        where,
      });

    const auctions =
      await prisma.auction.findMany({
        where,
        skip,
        take: Number(limit),
        orderBy,
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
      });

    let watchlistIds = [];

    if (req.user) {
      const watchlist =
        await prisma.watchlist.findMany({
          where: {
            userId: req.user.id,
          },
          select: {
            auctionId: true,
          },
        });

      watchlistIds = watchlist.map(
        (item) => item.auctionId
      );
    }

    const auctionsWithWatchlist =
      auctions.map((auction) => ({
        ...auction,
        isWatchlisted:
          watchlistIds.includes(auction.id),
      }));

    res.status(200).json({
      currentPage: Number(page),
      totalPages: Math.ceil(
        totalAuctions / Number(limit)
      ),
      totalAuctions,
      auctions: auctionsWithWatchlist,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get Single Auction
exports.getAuctionById = async (req, res) => {
  try {
    const auction =
      await prisma.auction.findUnique({
        where: {
          id: Number(req.params.id),
        },
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
          bids: {
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
          },
        },
      });

    if (!auction) {
      return res.status(404).json({
        message: "Auction not found",
      });
    }

    let isWatchlisted = false;

    if (req.user) {
      const watchlist =
        await prisma.watchlist.findFirst({
          where: {
            userId: req.user.id,
            auctionId: auction.id,
          },
        });

      isWatchlisted = !!watchlist;
    }

    res.status(200).json({
      ...auction,
      isWatchlisted,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Delete Auction
exports.deleteAuction = async (req, res) => {
  try {
    const auction =
      await prisma.auction.findUnique({
        where: {
          id: Number(req.params.id),
        },
      });

    if (!auction) {
      return res.status(404).json({
        message: "Auction not found",
      });
    }

    if (auction.sellerId !== req.user.id) {
      return res.status(403).json({
        message: "Not authorized",
      });
    }

    await prisma.auction.delete({
      where: {
        id: Number(req.params.id),
      },
    });

    res.status(200).json({
      message: "Auction deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Close Auction
exports.closeAuction = async (req, res) => {
  try {
    const auctionId = Number(req.params.id);

    const auction =
      await prisma.auction.findUnique({
        where: {
          id: auctionId,
        },
      });

    if (!auction) {
      return res.status(404).json({
        message: "Auction not found",
      });
    }

    if (auction.status === "closed") {
      return res.status(400).json({
        message: "Auction already closed",
      });
    }

    const highestBid =
      await prisma.bid.findFirst({
        where: {
          auctionId,
        },
        orderBy: {
          amount: "desc",
        },
      });

    const updatedAuction =
      await prisma.auction.update({
        where: {
          id: auctionId,
        },
        data: {
          status: "closed",
          winnerId: highestBid
            ? highestBid.bidderId
            : null,
        },
      });

    res.status(200).json({
      message: "Auction closed successfully",
      auction: updatedAuction,
      winnerId: highestBid
        ? highestBid.bidderId
        : null,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};