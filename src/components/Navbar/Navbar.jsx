import { NavLink, Link } from "react-router-dom";
import { FaBell } from "react-icons/fa";
import {
  FaChartPie,
  FaShoppingBag,
  FaWallet,
  FaChartLine,
  FaMoneyBill,
  FaUser,
} from "react-icons/fa";

import "./Navbar.css";

export default function Navbar() {
  return (
    <nav className="navbar">
      {/* Logo */}
      <div className="left">
        <h2>Zerodha</h2>
      </div>

      {/* Navigation */}
      <div className="nav-links">
        <NavLink to="/">
          <FaChartPie />
          <span>Dashboard</span>
        </NavLink>

        <NavLink to="/orders">
          <FaShoppingBag />
          <span>Orders</span>
        </NavLink>

        <NavLink to="/holdings">
          <FaWallet />
          <span>Holdings</span>
        </NavLink>

        <NavLink to="/positions">
          <FaChartLine />
          <span>Positions</span>
        </NavLink>

        <NavLink to="/funds">
          <FaMoneyBill />
          <span>Funds</span>
        </NavLink>

        <NavLink to="/profile">
          <FaUser />
          <span>Profile</span>
        </NavLink>
      </div>

      {/* Right Section */}
      <div className="right">
        <input type="text" placeholder="Search stocks..." />

        <FaBell className="bell" />

        <Link to="/login" className="login-btn">
          Login
        </Link>
      </div>
    </nav>
  );
}