import { Link } from "react-router-dom";
import { FaBell, FaBars } from "react-icons/fa";
import "./Navbar.css";
import { useAuth } from "../../context/AuthContext";

export default function Navbar({ onMenuClick }) {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar">

      {/* Mobile menu button */}
      <button
        className="mobile-menu-btn"
        onClick={onMenuClick}
        aria-label="Open navigation"
      >
        <FaBars />
      </button>

      <div className="navbar-spacer" />

      <div className="navbar-right">

        <div className="navbar-search">
          <input
            type="text"
            placeholder="Search stocks..."
          />
        </div>

        <button className="notification-btn">
          <FaBell />
          <span />
        </button>

        {user ? (
          <div className="user-menu">

            <div className="user-avatar">
              {(user.name || user.email || "U")
                .charAt(0)
                .toUpperCase()}
            </div>

            <div className="user-info">
              <strong>{user.name || "User"}</strong>
              <small>Investor</small>
            </div>

            <button
              className="logout-btn"
              onClick={logout}
            >
              Logout
            </button>

          </div>
        ) : (
          <Link
            to="/login"
            className="login-btn"
          >
            Login
          </Link>
        )}

      </div>
    </nav>
  );
}