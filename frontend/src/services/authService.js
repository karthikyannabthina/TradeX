import api from "./apiClient";

// Auth service endpoints
export const login = async ({ email, password }) => {
  const response = await api.post("/auth/login", { email, password });
  return response.data;
};

export const googleLogin = async (idToken) => {
  const response = await api.post("/auth/google", {
    idToken,
  });

  return response.data;
};

export const register = async ({ name, email, password }) => {
  const response = await api.post("/auth/register", { name, email, password });
  return response.data;
};

export const refresh = async () => {
  const response = await api.post("/auth/refresh");
  return response.data;
};

export const logout = async () => {
  const response = await api.post("/auth/logout");
  return response.data;
};

export const me = async () => {
  const response = await api.get("/auth/me");
  return response.data;
};
