const { io } = require("socket.io-client");

const socket = io("http://localhost:5000");

socket.on("connect", () => {
  console.log("🔌 Connected to TradeX");
  console.log("Socket ID:", socket.id);
});

socket.on("market:update", (data) => {
  console.log(
    `📈 ${data.symbol} | ₹${data.currentPrice} | Volume: ${data.volume}`
  );
});

socket.on("disconnect", () => {
  console.log("🔌 Disconnected from TradeX");
});

socket.on("connect_error", (error) => {
  console.error("❌ Socket connection error:", error.message);
});