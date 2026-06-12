const prisma = require("../config/prisma");
const bcrypt = require("bcryptjs");

// =======================
// Get Profile
// =======================
exports.getProfile = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: req.user.id,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// =======================
// Update Profile
// =======================
exports.updateProfile = async (req, res) => {
  try {
    const { name, email } = req.body;

    const existingUser = await prisma.user.findFirst({
      where: {
        email,
        NOT: {
          id: req.user.id,
        },
      },
    });

    if (existingUser) {
      return res.status(400).json({
        message: "Email already exists",
      });
    }

    const updatedUser = await prisma.user.update({
      where: {
        id: req.user.id,
      },
      data: {
        name,
        email,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    res.status(200).json({
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// =======================
// Change Password
// =======================
exports.changePassword = async (req, res) => {
  try {
    const {
      currentPassword,
      newPassword,
    } = req.body;

    const user = await prisma.user.findUnique({
      where: {
        id: req.user.id,
      },
    });

    const isMatch = await bcrypt.compare(
      currentPassword,
      user.password
    );

    if (!isMatch) {
      return res.status(400).json({
        message: "Current password is incorrect",
      });
    }

    const hashedPassword =
      await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: {
        id: req.user.id,
      },
      data: {
        password: hashedPassword,
      },
    });

    res.status(200).json({
      message: "Password changed successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// =======================
// Seller Analytics
// =======================
exports.getAnalytics = async (req, res) => {
  try {
    const sellerId = req.user.id;

    const totalAuctions =
      await prisma.auction.count({
        where: {
          sellerId,
        },
      });

    const activeAuctions =
      await prisma.auction.count({
        where: {
          sellerId,
          status: "active",
        },
      });

    const closedAuctions =
      await prisma.auction.count({
        where: {
          sellerId,
          status: "closed",
        },
      });

    const sellerAuctions =
      await prisma.auction.findMany({
        where: {
          sellerId,
        },
        select: {
          id: true,
        },
      });

    const auctionIds =
      sellerAuctions.map(
        (auction) => auction.id
      );

    const totalBidsReceived =
      await prisma.bid.count({
        where: {
          auctionId: {
            in: auctionIds,
          },
        },
      });

    res.status(200).json({
      totalAuctions,
      activeAuctions,
      closedAuctions,
      totalBidsReceived,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// =======================
// My Auctions
// =======================
exports.getMyAuctions = async (req, res) => {
  try {
    const auctions = await prisma.auction.findMany({
      where: {
        sellerId: req.user.id,
      },
      include: {
        winner: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.status(200).json(auctions);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// =======================
// My Bids
// =======================
exports.getMyBids = async (req, res) => {
  try {
    const bids = await prisma.bid.findMany({
      where: {
        bidderId: req.user.id,
      },
      include: {
        auction: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.status(200).json(bids);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// =======================
// Won Auctions
// =======================
exports.getWonAuctions = async (req, res) => {
  try {
    const auctions = await prisma.auction.findMany({
      where: {
        winnerId: req.user.id,
      },
      include: {
        seller: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.status(200).json(auctions);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};