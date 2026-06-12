const { Server } = require("socket.io");

const initializeSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "*",
    },
  });

  io.on("connection", (socket) => {
    console.log("User Connected:", socket.id);

    socket.on("joinAuction", (auctionId) => {
      socket.join(`auction-${auctionId}`);

      console.log(
        `Socket ${socket.id} joined auction-${auctionId}`
      );
    });

    socket.on("disconnect", () => {
      console.log("User Disconnected:", socket.id);
    });
  });

  return io;
};

module.exports = initializeSocket;