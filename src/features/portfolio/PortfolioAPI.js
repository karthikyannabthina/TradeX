import api from "../../services/apiClient";

export const getPortfolio = async () => {
  const response = await api.get("/portfolio");
  return response.data;
};