const express = require("express");
const cors = require("cors");
const http = require("http");
const path = require("path");
require("dotenv").config();

const authRoutes = require("./routes/auth.routes");
const auctionRoutes = require("./routes/auction.routes");
const bidRoutes = require("./routes/bid.routes");
const userRoutes = require("./routes/user.routes");
const adminRoutes = require("./routes/admin.routes");
const watchlistRoutes = require("./routes/watchlist.routes");
const notificationRoutes = require("./routes/notification.routes");
const paymentRoutes = require("./routes/payment.routes");

const startAuctionExpiryJob = require("./jobs/auctionExpiry.job");
const initializeSocket = require("./socket");

const app = express();
const server = http.createServer(app);

// Frontend URL for local development
const allowedOrigin = "http://localhost:5173";

// Initialize Socket.IO
const io = initializeSocket(server);

// Make io available globally
app.set("io", io);

// CORS configuration
app.use(
  cors({
    origin: allowedOrigin,
    credentials: true,
  })
);

app.use(express.json());

// Serve uploaded images
app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"))
);

// Test route
app.get("/", (req, res) => {
  res.send("BidSphere API Running 🚀");
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/auctions", auctionRoutes);
app.use("/api/bids", bidRoutes);
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/watchlist", watchlistRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/payments", paymentRoutes);

// Start Auction Expiry Job
startAuctionExpiryJob(io);

// Server Port
const PORT = process.env.PORT || 5000;

// Start Server
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});