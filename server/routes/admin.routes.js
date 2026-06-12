const express = require("express");

const {
  getDashboardStats,
  getAllUsers,
  getAllAuctions,
  deleteUser,
  deleteAuction,
} = require("../controllers/admin.controller");

const { protect } = require("../middleware/auth.middleware");
const { adminOnly } = require("../middleware/admin.middleware");

const router = express.Router();

router.get(
  "/dashboard",
  protect,
  adminOnly,
  getDashboardStats
);

router.get(
  "/users",
  protect,
  adminOnly,
  getAllUsers
);

router.get(
  "/auctions",
  protect,
  adminOnly,
  getAllAuctions
);

router.delete(
  "/users/:id",
  protect,
  adminOnly,
  deleteUser
);

router.delete(
  "/auctions/:id",
  protect,
  adminOnly,
  deleteAuction
);

module.exports = router;