import { io } from "socket.io-client";
import { SOCKET_URL } from "./utils/constants";

// Single shared socket instance for the whole app. autoConnect is off so we
// only open the connection once something actually needs live data
// (see MarketDataContext), and it reconnects automatically if dropped.
const socket = io(SOCKET_URL, {
  autoConnect: false,
  reconnection: true,
  reconnectionAttempts: Infinity,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
});

export default socket;
