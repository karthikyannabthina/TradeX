import { useEffect, useRef, useState } from "react";
import {
  createChart,
  CandlestickSeries,
  HistogramSeries,
} from "lightweight-charts";

import socket from "../../socket";
import useMarketData from "../../context/useMarketData";

import "./PortfolioChart.css";

const API_URL =
  "http://localhost:5000/api/v1/market";

const STOCKS = [
  "TCS",
  "RELIANCE",
  "INFY",
  "HDFCBANK",
  "ICICIBANK",
  "SBIN",
];

const RANGES = [
  "1D",
  "1W",
  "1M",
  "3M",
  "1Y",
  "ALL",
];

const ONE_MINUTE = 60;

export default function PortfolioChart() {
  const chartContainerRef = useRef(null);

  const chartRef = useRef(null);
  const candleSeriesRef = useRef(null);
  const volumeSeriesRef = useRef(null);

  const candlesRef = useRef([]);
  const lastCandleRef = useRef(null);

  const previousMarketVolumeRef =
    useRef(null);

  const currentCandleVolumeRef =
    useRef(0);

  const [symbol, setSymbol] = useState("TCS");
  const [range, setRange] = useState("1D");

  const [candles, setCandles] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const {
    getStock,
    isConnected,
  } = useMarketData();

  /*
   * =====================================================
   * LOAD HISTORICAL CANDLES
   * =====================================================
   */

  useEffect(() => {
    let cancelled = false;

    const loadCandles = async () => {
      try {
        setLoading(true);
        setError(false);

        previousMarketVolumeRef.current = null;
        currentCandleVolumeRef.current = 0;
        lastCandleRef.current = null;

        const response = await fetch(
          `${API_URL}/${symbol}/candles?range=${range}`
        );

        if (!response.ok) {
          throw new Error(
            "Failed to fetch candles"
          );
        }

        const result =
          await response.json();

        const candleData =
          result?.data?.candles || [];

        if (!cancelled) {
          candlesRef.current = candleData;

          setCandles(candleData);
        }
      } catch (err) {
        console.error(
          "Candle API error:",
          err
        );

        if (!cancelled) {
          setError(true);

          setCandles([]);

          candlesRef.current = [];

          lastCandleRef.current = null;
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadCandles();

    return () => {
      cancelled = true;
    };
  }, [symbol, range]);

  /*
   * =====================================================
   * CREATE LIGHTWEIGHT CHART
   * =====================================================
   */

  useEffect(() => {
    if (!chartContainerRef.current) {
      return;
    }

    const container =
      chartContainerRef.current;

    const chart = createChart(container, {
      width: container.clientWidth,

      height: 330,

      layout: {
        background: {
          color: "transparent",
        },

        textColor: "#64748b",

        fontFamily:
          "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      },

      grid: {
        vertLines: {
          color:
            "rgba(255,255,255,0.025)",
        },

        horzLines: {
          color:
            "rgba(255,255,255,0.025)",
        },
      },

      crosshair: {
        mode: 1,

        vertLine: {
          color:
            "rgba(148,163,184,0.28)",

          width: 1,

          style: 3,

          labelBackgroundColor:
            "#1e293b",
        },

        horzLine: {
          color:
            "rgba(148,163,184,0.28)",

          width: 1,

          style: 3,

          labelBackgroundColor:
            "#1e293b",
        },
      },

      rightPriceScale: {
        borderColor:
          "rgba(255,255,255,0.045)",

        scaleMargins: {
          top: 0.08,
          bottom: 0.20,
        },

        entireTextOnly: true,
      },

      timeScale: {
        borderColor:
          "rgba(255,255,255,0.045)",

        timeVisible: true,

        secondsVisible: false,

        rightOffset: 6,

        barSpacing: 7,

        minBarSpacing: 3,

        fixLeftEdge: false,

        fixRightEdge: false,
      },

      handleScroll: {
        mouseWheel: true,

        pressedMouseMove: true,
      },

      handleScale: {
        mouseWheel: true,

        pinch: true,

        axisPressedMouseMove: true,
      },
    });

    /*
     * ===================================================
     * CANDLESTICKS
     * ===================================================
     */

    const candleSeries =
      chart.addSeries(
        CandlestickSeries,
        {
          upColor: "#10b981",

          downColor: "#ef5350",

          borderUpColor: "#10b981",

          borderDownColor: "#ef5350",

          wickUpColor: "#10b981",

          wickDownColor: "#ef5350",

          priceLineVisible: true,

          lastValueVisible: true,

          priceFormat: {
            type: "price",

            precision: 2,

            minMove: 0.01,
          },
        }
      );

    /*
     * ===================================================
     * VOLUME
     * ===================================================
     */

    const volumeSeries =
      chart.addSeries(
        HistogramSeries,
        {
          priceFormat: {
            type: "volume",
          },

          priceScaleId: "",

          scaleMargins: {
            top: 0.84,

            bottom: 0,
          },
        }
      );

    candleSeriesRef.current =
      candleSeries;

    volumeSeriesRef.current =
      volumeSeries;

    chartRef.current = chart;

    /*
     * ===================================================
     * RESPONSIVE
     * ===================================================
     */

    const handleResize = () => {
      if (!chartContainerRef.current) {
        return;
      }

      chart.applyOptions({
        width:
          chartContainerRef.current
            .clientWidth,
      });
    };

    window.addEventListener(
      "resize",
      handleResize
    );

    /*
     * ===================================================
     * CLEANUP
     * ===================================================
     */

    return () => {
      window.removeEventListener(
        "resize",
        handleResize
      );

      chart.remove();

      chartRef.current = null;

      candleSeriesRef.current = null;

      volumeSeriesRef.current = null;
    };
  }, []);

  /*
   * =====================================================
   * DRAW HISTORICAL CANDLES
   * =====================================================
   */

  useEffect(() => {
    if (
      !candleSeriesRef.current ||
      !volumeSeriesRef.current
    ) {
      return;
    }

    if (!candles.length) {
      return;
    }

    const candleData = candles
      .map((candle) => ({
        time: candle.time,

        open: Number(candle.open),

        high: Number(candle.high),

        low: Number(candle.low),

        close: Number(candle.close),
      }))
      .filter(
        (candle) =>
          candle.time &&
          Number.isFinite(candle.open) &&
          Number.isFinite(candle.high) &&
          Number.isFinite(candle.low) &&
          Number.isFinite(candle.close)
      );

    const volumeData = candles
      .map((candle) => ({
        time: candle.time,

        value: Number(
          candle.volume || 0
        ),

        color:
          Number(candle.close) >=
          Number(candle.open)
            ? "rgba(16,185,129,0.20)"
            : "rgba(239,83,80,0.20)",
      }))
      .filter(
        (candle) =>
          candle.time &&
          Number.isFinite(candle.value)
      );

    if (!candleData.length) {
      return;
    }

    candleSeriesRef.current.setData(
      candleData
    );

    volumeSeriesRef.current.setData(
      volumeData
    );

    const latest =
      candleData[candleData.length - 1];

    lastCandleRef.current = latest;

    previousMarketVolumeRef.current =
      null;

    currentCandleVolumeRef.current =
      0;

    chartRef.current
      ?.timeScale()
      .fitContent();
  }, [candles]);

  /*
   * =====================================================
   * LIVE MARKET UPDATE
   * =====================================================
   */

  useEffect(() => {
    const handleMarketUpdate = (
      marketData
    ) => {
      if (!marketData) {
        return;
      }

      const incomingSymbol =
        marketData.symbol?.toUpperCase();

      if (
        incomingSymbol !==
        symbol.toUpperCase()
      ) {
        return;
      }

      const price = Number(
        marketData.price ??
          marketData.ltp ??
          marketData.currentPrice
      );

      if (!Number.isFinite(price)) {
        return;
      }

      if (
        !candleSeriesRef.current ||
        !volumeSeriesRef.current
      ) {
        return;
      }

      /*
       * CURRENT TIME BUCKET
       */

      const now = Math.floor(
        Date.now() / 1000
      );

      const currentMinute =
        Math.floor(
          now / ONE_MINUTE
        ) * ONE_MINUTE;

      /*
       * GET LAST CANDLE
       */

      const previousCandle =
        lastCandleRef.current;

      /*
       * FIRST LIVE CANDLE
       */

      if (!previousCandle) {
        const newCandle = {
          time: currentMinute,

          open: price,

          high: price,

          low: price,

          close: price,
        };

        lastCandleRef.current =
          newCandle;

        candlesRef.current = [
          ...candlesRef.current,
          newCandle,
        ];

        candleSeriesRef.current.update(
          newCandle
        );

        currentCandleVolumeRef.current =
          0;

        volumeSeriesRef.current.update({
          time: currentMinute,

          value: 0,

          color:
            "rgba(16,185,129,0.20)",
        });

        return;
      }

      /*
       * SAME MINUTE
       */

      if (
        Number(
          previousCandle.time
        ) === currentMinute
      ) {
        const updatedCandle = {
          time: previousCandle.time,

          open: previousCandle.open,

          high: Math.max(
            previousCandle.high,
            price
          ),

          low: Math.min(
            previousCandle.low,
            price
          ),

          close: price,
        };

        candleSeriesRef.current.update(
          updatedCandle
        );

        /*
         * INCREMENTAL VOLUME
         */

        const backendVolume =
          Number(
            marketData.volume
          );

        if (
          Number.isFinite(
            backendVolume
          )
        ) {
          if (
            previousMarketVolumeRef.current !==
            null
          ) {
            const volumeDifference =
              backendVolume -
              previousMarketVolumeRef.current;

            if (volumeDifference > 0) {
              currentCandleVolumeRef.current +=
                volumeDifference;
            }
          }

          previousMarketVolumeRef.current =
            backendVolume;
        }

        volumeSeriesRef.current.update({
          time: currentMinute,

          value:
            currentCandleVolumeRef.current,

          color:
            price >=
            updatedCandle.open
              ? "rgba(16,185,129,0.20)"
              : "rgba(239,83,80,0.20)",
        });

        lastCandleRef.current =
          updatedCandle;

        return;
      }

      /*
       * NEW MINUTE
       */

      const newCandle = {
        time: currentMinute,

        open: previousCandle.close,

        high: price,

        low: price,

        close: price,
      };

      /*
       * STARTING VOLUME
       */

      const backendVolume =
        Number(
          marketData.volume
        );

      let newVolume = 0;

      if (
        Number.isFinite(
          backendVolume
        ) &&
        previousMarketVolumeRef.current !==
          null
      ) {
        const volumeDifference =
          backendVolume -
          previousMarketVolumeRef.current;

        if (volumeDifference > 0) {
          newVolume =
            volumeDifference;
        }
      }

      currentCandleVolumeRef.current =
        newVolume;

      if (
        Number.isFinite(
          backendVolume
        )
      ) {
        previousMarketVolumeRef.current =
          backendVolume;
      }

      /*
       * UPDATE CHART
       */

      candleSeriesRef.current.update(
        newCandle
      );

      volumeSeriesRef.current.update({
        time: currentMinute,

        value: newVolume,

        color:
          price >= newCandle.open
            ? "rgba(16,185,129,0.20)"
            : "rgba(239,83,80,0.20)",
      });

      /*
       * UPDATE REFERENCE
       */

      lastCandleRef.current =
        newCandle;

      candlesRef.current = [
        ...candlesRef.current,
        newCandle,
      ];
    };

    socket.on(
      "market:update",
      handleMarketUpdate
    );

    return () => {
      socket.off(
        "market:update",
        handleMarketUpdate
      );
    };
  }, [symbol]);

  /*
   * =====================================================
   * CURRENT PRICE
   * =====================================================
   */

  const liveStock = getStock(symbol);

  const lastCandle =
    candles[candles.length - 1];

  const currentPrice = Number(
    liveStock?.price ??
      liveStock?.ltp ??
      liveStock?.currentPrice ??
      lastCandle?.close ??
      0
  );

  const previousPrice = Number(
    liveStock?.previousPrice ??
      liveStock?.previousClose ??
      lastCandle?.open ??
      0
  );

  const change = Number(
    liveStock?.change ??
      currentPrice - previousPrice
  );

  const changePercent = Number(
    liveStock?.changePercent ??
      (previousPrice
        ? (change / previousPrice) * 100
        : 0)
  );

  const positive = change >= 0;

  /*
   * =====================================================
   * UI
   * =====================================================
   */

  return (
    <div className="portfolio-card">

      {/* =================================================
          CHART HEADER
      ================================================= */}

      <div className="stock-chart-header">

        {/* STOCK INFORMATION */}

        <div className="stock-info">

          <div className="stock-title-row">

            <select
              value={symbol}
              onChange={(event) =>
                setSymbol(
                  event.target.value
                )
              }
            >
              {STOCKS.map((stock) => (
                <option
                  key={stock}
                  value={stock}
                >
                  {stock}
                </option>
              ))}
            </select>

            <span className="exchange">
              NSE
            </span>

            <span
              className={
                isConnected
                  ? "chart-market-status live"
                  : "chart-market-status offline"
              }
            >
              <span className="status-dot" />

              {isConnected
                ? "LIVE"
                : "OFFLINE"}
            </span>

          </div>


          {/* PRICE */}

          <div className="stock-price-row">

            <span className="stock-price">
              ₹
              {currentPrice.toLocaleString(
                "en-IN",
                {
                  minimumFractionDigits: 2,

                  maximumFractionDigits: 2,
                }
              )}
            </span>

            <span
              className={
                positive
                  ? "stock-change positive"
                  : "stock-change negative"
              }
            >
              {positive ? "+" : ""}

              ₹{change.toFixed(2)}

              {" "}

              (
              {positive ? "+" : ""}
              {changePercent.toFixed(2)}
              %)
            </span>

          </div>

        </div>


        {/* RANGE SELECTOR */}

        <div className="chart-ranges">

          {RANGES.map((item) => (
            <button
              key={item}
              className={
                range === item
                  ? "active"
                  : ""
              }
              onClick={() =>
                setRange(item)
              }
            >
              {item}
            </button>
          ))}

        </div>

      </div>


      {/* =================================================
          CHART
      ================================================= */}

      <div className="chart-wrapper">

        {loading && (
          <div className="chart-status">
            Loading market data...
          </div>
        )}

        {error && (
          <div className="chart-status error">
            Unable to load market data
          </div>
        )}

        <div
          ref={chartContainerRef}
          className="trading-chart"
        />

      </div>

    </div>
  );
}