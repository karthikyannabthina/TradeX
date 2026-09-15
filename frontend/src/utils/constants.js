export const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://10.46.90.150:5000/api/v1";

export const SOCKET_URL =
  import.meta.env.VITE_SOCKET_URL || "http://10.46.90.150:5000";

export const SOCKET_EVENTS = {
  SNAPSHOT: "market:snapshot",
  MARKET_UPDATE: "market:update",
  STOCK_UPDATE: "stock:update",
  SUBSCRIBE_ALL: "market:subscribeAll",
  SUBSCRIBE: "market:subscribe",
  UNSUBSCRIBE: "market:unsubscribe",
  GET_ONE: "stock:getOne",
};