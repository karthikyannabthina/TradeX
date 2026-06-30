import { Routes, Route } from "react-router-dom";

import DashboardLayout from "../layouts/DashboardLayout";

import Dashboard from "../pages/Dashboard/Dashboard";
import Orders from "../pages/Orders/Orders";
import Holdings from "../pages/Holdings/Holdings";
import Positions from "../pages/Positions/Positions";

import Login from "../pages/Login/Login";
import Signup from "../pages/Signup/Signup";

export default function AppRoutes() {
  return (
    <Routes>

      {/* Public Routes */}

      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* Protected Layout */}

      <Route element={<DashboardLayout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/holdings" element={<Holdings />} />
        <Route path="/positions" element={<Positions />} />
      </Route>

    </Routes>
  );
}