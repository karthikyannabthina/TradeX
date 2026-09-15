import { Routes, Route } from "react-router-dom";

import DashboardLayout from "../layouts/DashboardLayout";

import Dashboard from "../pages/Dashboard/Dashboard";
import Orders from "../pages/Orders/Orders";
import Holdings from "../pages/Holdings/Holdings";
import Positions from "../pages/Positions/Positions";
import Funds from "../pages/Funds/Funds";
import Profile from "../pages/Profile/Profile";

export default function AppRoutes() {
  return (
    <Routes>

      {/* Dashboard Layout */}
      <Route element={<DashboardLayout />}>

        <Route path="/" element={<Dashboard />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/holdings" element={<Holdings />} />
        <Route path="/positions" element={<Positions />} />
        <Route path="/funds" element={<Funds />} />
        <Route path="/profile" element={<Profile />} />

      </Route>

    </Routes>
  );
}