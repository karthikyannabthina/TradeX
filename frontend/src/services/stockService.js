import axios from "axios";
import { API_BASE_URL } from "../utils/constants";

const STOCK_API = `${API_BASE_URL}/stocks`;
const MARKET_API = `${API_BASE_URL}/market`;

// Get the current simulator snapshot before the socket begins streaming
// incremental market updates.
export const getAllStocks = async () => {
  const response = await axios.get(MARKET_API);
  return response.data;
};

// Get a single stock by symbol.
export const getStock = async (symbol) => {
  const response = await axios.get(`${STOCK_API}/${symbol}`);
  return response.data;
};

// Search stocks by symbol or name.
export const searchStocks = async (query) => {
  const response = await axios.get(`${STOCK_API}/search?q=${query}`);
  return response.data;
};
