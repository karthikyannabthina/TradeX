import api from "./apiClient";

export const getAccount = async () => {
  const response = await api.get("/account");
  return response.data;
};