import api from "./apiClient";

const BASE = "/orders";

export const createOrder = async (orderData) => {
  const response = await api.post(BASE, orderData);
  return response.data;
};

export const getOrders = async () => {
  const response = await api.get(BASE);
  return response.data;
};
