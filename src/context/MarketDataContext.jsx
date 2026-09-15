import { useEffect, useRef, useState, useCallback } from "react";
import socket from "../socket";
import { getAllStocks } from "../services/stockService";
import { SOCKET_EVENTS } from "../utils/constants";
import { MarketDataContext } from "./marketDataContextObject";

export function MarketDataProvider({ children }) {
  // symbol -> stock object
  const [stocks, setStocks] = useState({});
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const hasHydrated = useRef(false);

  // diagnostics - keep very small logs and only first few events
  const diag = useRef({ logged: {}, maxLogs: 5 });
  const safeSample = (obj) => {
    try {
      if (!obj) return obj;
      if (Array.isArray(obj)) return obj.slice(0, 5);
      if (typeof obj === "object") {
        const keys = Object.keys(obj).slice(0, 5);
        const sample = {};
        keys.forEach((k) => (sample[k] = obj[k]));
        return sample;
      }
      return obj;
    } catch (e) {
      return "<unserializable>";
    }
  };

  const logOnce = (key, ...args) => {
    if (!diag.current) return;
    if (diag.current.logged[key]) return;
    diag.current.logged[key] = true;
    console.info(...args);
  };

  // helper to push diagnostics into window for retrieval (kept small)
  const pushDiag = (entry) => {
    try {
      const win = window;
      if (!win.__marketDiag) win.__marketDiag = [];
      win.__marketDiag.push({ ts: Date.now(), ...entry });
      // keep only recent 40 entries
      if (win.__marketDiag.length > 40) win.__marketDiag.shift();
    } catch (e) {
      /* ignore */
    }
  };

  const mergeStocks = useCallback((incoming) => {
    if (!incoming) return;
    try {
      setStocks((prev) => {
        const beforeCount = Object.keys(prev).length;
        const next = { ...prev };

        // If incoming is an array: [{symbol, ...}, ...]
        if (Array.isArray(incoming)) {
          if (!diag.current.logged["snapshot-array"]) {
            console.info("SOCKET EVENT: array payload (sample)", safeSample(incoming));
            diag.current.logged["snapshot-array"] = true;
            pushDiag({ event: "snapshot", payloadType: "array", sample: safeSample(incoming), beforeCount });
          }
          incoming.forEach((stock) => {
            if (!stock) return;
            const sym = (stock.symbol || "").toString().toUpperCase();
            if (sym) next[sym] = { ...next[sym], ...stock };
          });

          const afterCount = Object.keys(next).length;
          if (!diag.current.logged["merge-summary"]) {
            console.info("mergeStocks: array merge", { beforeCount, afterCount });
            diag.current.logged["merge-summary"] = true;
            pushDiag({ event: "merge", payloadType: "array", beforeCount, afterCount });
          }
          return next;
        }

        // If incoming is an object mapping symbols to data: { RELIANCE: {...}, TCS: {...} }
        if (typeof incoming === "object") {
          if (!diag.current.logged["snapshot-object"]) {
            console.info("SOCKET EVENT: object payload (sample)", safeSample(incoming));
            diag.current.logged["snapshot-object"] = true;
            pushDiag({ event: "snapshot", payloadType: "object", sample: safeSample(incoming), beforeCount });
          }
          // If object has a 'symbol' property, treat it as a single stock
          if (incoming.symbol) {
            const sym = incoming.symbol.toString().toUpperCase();
            next[sym] = { ...next[sym], ...incoming };
            const afterCount = Object.keys(next).length;
            if (!diag.current.logged["merge-summary"]) {
              console.info("mergeStocks: single-object merge", { beforeCount, afterCount });
              diag.current.logged["merge-summary"] = true;
              pushDiag({ event: "merge", payloadType: "single-object", beforeCount, afterCount });
            }
            return next;
          }

          // Otherwise iterate over keys
          Object.keys(incoming).forEach((key) => {
            const val = incoming[key];
            if (!val) return;
            if (val.symbol) {
              const s = val.symbol.toString().toUpperCase();
              next[s] = { ...next[s], ...val };
            } else {
              // key might be the symbol
              next[key.toString().toUpperCase()] = { ...next[key.toString().toUpperCase()], ...val };
            }
          });

          const afterCount = Object.keys(next).length;
          if (!diag.current.logged["merge-summary"]) {
            console.info("mergeStocks: object-keys merge", { beforeCount, afterCount });
            diag.current.logged["merge-summary"] = true;
            pushDiag({ event: "merge", payloadType: "object-keys", beforeCount, afterCount });
          }
          return next;
        }

        console.warn("mergeStocks: unexpected payload type", incoming);
        pushDiag({ event: "snapshot", payloadType: typeof incoming, sample: safeSample(incoming), beforeCount });
        return next;
      });
    } catch (err) {
      console.error("mergeStocks error:", err, incoming);
      pushDiag({ event: "error", error: String(err) });
    }
  }, []);

  // 1) Hydrate from REST so the UI has real numbers on first paint, even
  //    before the socket connects.
  useEffect(() => {
    if (hasHydrated.current) return;
    hasHydrated.current = true;

    getAllStocks()
      .then((data) => {
        const list = Array.isArray(data?.data) ? data.data : [];

        if (list.length) {
          setError(null);
          console.info("REST hydration: received", list.length, "stocks (sample)", safeSample(list));
          mergeStocks(list);
        } else {
          setError("No market data is currently available.");
        }
      })
      .catch((err) => {
        setError("Unable to load the initial market snapshot.");
        // Provide additional diagnostics for the failing request
        try {
          console.error("Failed to load initial stocks:", err?.response?.status, err?.response?.config?.url || err.message);
        } catch (e) {
          console.error("Failed to load initial stocks:", err.message);
        }
      })
      .finally(() => setIsLoading(false));
  }, [mergeStocks]);

  // 2) Connect the socket and subscribe to the full market feed.
  useEffect(() => {
    if (!socket.connected) socket.connect();

    const handleConnect = () => {
      setIsConnected(true);
      socket.emit(SOCKET_EVENTS.SUBSCRIBE_ALL);
    };
    const handleDisconnect = () => setIsConnected(false);
    const handleConnectError = () => {
      setIsConnected(false);
      setError("Live market connection is unavailable.");
    };
    const handleSnapshot = (snapshot) => {
      mergeStocks(snapshot);
      setError(null);
      setIsLoading(false);
    };
    const handleUpdate = (updates) => {
      mergeStocks(updates);
      setError(null);
    };

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("connect_error", handleConnectError);
    socket.on(SOCKET_EVENTS.SNAPSHOT, handleSnapshot);
    socket.on(SOCKET_EVENTS.MARKET_UPDATE, handleUpdate);

    if (socket.connected) handleConnect();

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("connect_error", handleConnectError);
      socket.off(SOCKET_EVENTS.SNAPSHOT, handleSnapshot);
      socket.off(SOCKET_EVENTS.MARKET_UPDATE, handleUpdate);
    };
  }, [mergeStocks]);

  const getStock = useCallback((symbol) => stocks[symbol?.toUpperCase()], [stocks]);

  const value = {
    stocks, // { SYMBOL: {price, change, changePercent, ...} }
    stockList: Object.values(stocks),
    getStock,
    isConnected,
    isLoading,
    error,
  };

  return <MarketDataContext.Provider value={value}>{children}</MarketDataContext.Provider>;
}
