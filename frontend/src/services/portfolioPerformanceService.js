import api from "./apiClient";

export const getPortfolioPerformance = async () => {
  const response = await api.get(
    "/portfolio/performance"
  );

  return response.data;
};