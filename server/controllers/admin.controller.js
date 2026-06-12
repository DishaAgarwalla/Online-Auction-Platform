const prisma = require("../config/prisma");

// Dashboard Stats
exports.getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await prisma.user.count();

    const totalAuctions = await prisma.auction.count();

    const activeAuctions = await prisma.auction.count({
      where: {
        status: "active",
      },
    });

    const closedAuctions = await prisma.auction.count({
      where: {
        status: "closed",
      },
    });

    const totalBids = await prisma.bid.count();

    res.json({
      totalUsers,
      totalAuctions,
      activeAuctions,
      closedAuctions,
      totalBids,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get All Users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json(users);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get All Auctions
exports.getAllAuctions = async (req, res) => {
  try {
    const auctions = await prisma.auction.findMany({
      include: {
        seller: true,
        winner: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json(auctions);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Delete User
exports.deleteUser = async (req, res) => {
  try {
    const id = Number(req.params.id);

    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    await prisma.user.delete({
      where: { id },
    });

    res.json({
      message: "User deleted successfully",
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
    const id = Number(req.params.id);

    const auction = await prisma.auction.findUnique({
      where: { id },
    });

    if (!auction) {
      return res.status(404).json({
        message: "Auction not found",
      });
    }

    await prisma.auction.delete({
      where: { id },
    });

    res.json({
      message: "Auction deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};