import { NavLink } from "react-router-dom";
import {
  FaChartPie,
  FaShoppingBag,
  FaWallet,
  FaChartLine,
  FaMoneyBill,
  FaUser,
} from "react-icons/fa";
import "./Sidebar.css";

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="brand">
        <h3>Trade X</h3>
      </div>

      <nav className="side-nav">
        <NavLink to="/" end>
          <FaChartPie /> <span>Dashboard</span>
        </NavLink>

        <NavLink to="/orders">
          <FaShoppingBag /> <span>Orders</span>
        </NavLink>

        <NavLink to="/holdings">
          <FaWallet /> <span>Holdings</span>
        </NavLink>

        <NavLink to="/positions">
          <FaChartLine /> <span>Positions</span>
        </NavLink>

        <NavLink to="/funds">
          <FaMoneyBill /> <span>Funds</span>
        </NavLink>

        <NavLink to="/profile">
          <FaUser /> <span>Profile</span>
        </NavLink>
      </nav>

      <div className="side-footer">
        <small className="p-muted">© 2026</small>
      </div>
    </aside>
  );
}
