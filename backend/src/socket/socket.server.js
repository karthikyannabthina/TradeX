const { Server } = require("socket.io");

const {
  initializeSocketEvents,
} = require("./socket.events");
const {
  getMarketState,
} = require("../modules/market/market.simulator");

let io;

const initializeSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log(
      `🔌 Client connected: ${socket.id}`
    );

    socket.on("disconnect", () => {
      console.log(
        `🔌 Client disconnected: ${socket.id}`
      );
    });

    socket.on("market:subscribeAll", () => {
      socket.emit("market:snapshot", getMarketState());
    });
  });

  initializeSocketEvents(io);

  console.log("🔌 Socket.IO initialized");

  return io;
};

const getIO = () => {
  if (!io) {
    throw new Error(
      "Socket.IO has not been initialized"
    );
  }

  return io;
};

module.exports = {
  initializeSocket,
  getIO,
};
