const cron = require("node-cron");
const prisma = require("../config/prisma");
const sendEmail = require("../services/email.service");

const startAuctionExpiryJob = (io) => {
  cron.schedule("* * * * *", async () => {
    try {
      console.log("Checking expired auctions...");

      const expiredAuctions = await prisma.auction.findMany({
        where: {
          status: "active",
          endTime: {
            lt: new Date(),
          },
        },
        include: {
          seller: true,
        },
      });

      for (const auction of expiredAuctions) {
        const highestBid = await prisma.bid.findFirst({
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

        await prisma.auction.update({
          where: {
            id: auction.id,
          },
          data: {
            status: "closed",
            winnerId: highestBid
              ? highestBid.bidderId
              : null,
          },
        });

        // -------------------------
        // WINNER NOTIFICATION + EMAIL
        // -------------------------
        if (highestBid) {
          await prisma.notification.create({
            data: {
              userId: highestBid.bidderId,
              message: `🎉 Congratulations! You won the auction "${auction.title}" with a bid of ₹${highestBid.amount}`,
            },
          });

          try {
            await sendEmail(
              highestBid.bidder.email,
              "Auction Won 🎉",
              `Congratulations! You won "${auction.title}" with a bid of ₹${highestBid.amount}.`
            );
          } catch (err) {
            console.log("Winner Email Error:", err.message);
          }
        }

        // -------------------------
        // SELLER NOTIFICATION + EMAIL
        // -------------------------
        await prisma.notification.create({
          data: {
            userId: auction.sellerId,
            message: highestBid
              ? `Your auction "${auction.title}" has ended. Winner selected successfully.`
              : `Your auction "${auction.title}" ended without any bids.`,
          },
        });

        try {
          await sendEmail(
            auction.seller.email,
            "Auction Ended",
            highestBid
              ? `Your auction "${auction.title}" has ended successfully.`
              : `Your auction "${auction.title}" ended without any bids.`
          );
        } catch (err) {
          console.log("Seller Email Error:", err.message);
        }

        // -------------------------
        // WATCHLIST NOTIFICATIONS
        // -------------------------
        const watchlistUsers =
          await prisma.watchlist.findMany({
            where: {
              auctionId: auction.id,
            },
          });

        for (const watch of watchlistUsers) {
          await prisma.notification.create({
            data: {
              userId: watch.userId,
              message: `Auction "${auction.title}" has ended.`,
            },
          });
        }

        // -------------------------
        // SOCKET EVENTS
        // -------------------------
        if (io) {
          io.emit("auctionClosed", {
            auctionId: auction.id,
            title: auction.title,
            winnerId: highestBid
              ? highestBid.bidderId
              : null,
          });

          io.emit("notification", {
            message: `Auction "${auction.title}" closed`,
          });
        }

        console.log(
          `Auction ${auction.id} closed automatically`
        );
      }
    } catch (error) {
      console.error(
        "Auction Expiry Job Error:",
        error.message
      );
    }
  });
};

module.exports = startAuctionExpiryJob;