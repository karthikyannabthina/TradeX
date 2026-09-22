import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { useAuth } from "../../context/AuthContext";
import "./Login.css";

export default function Login() {
  const navigate = useNavigate();
  const { login, googleLogin } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login({ email, password });
      navigate("/");
    } catch (err) {
      console.error("Login failed", err);

      alert(
        "Login failed: " +
          (err?.response?.data?.error?.message ||
            err?.response?.data?.message ||
            err.message)
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async (credentialResponse) => {
    try {
      setLoading(true);

      await googleLogin(credentialResponse.credential);

      navigate("/");
    } catch (err) {
      console.error("Google login failed", err);

      alert(
        "Google login failed: " +
          (err?.response?.data?.error?.message ||
            err?.response?.data?.message ||
            err.message)
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>TradeX</h1>
        <h2>Login</h2>

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label>Email</label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>

          <button
            type="submit"
            className="auth-btn"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div style={{ margin: "20px 0", textAlign: "center" }}>
          <span>OR</span>
        </div>

        <GoogleLogin
          onSuccess={handleGoogleLogin}
          onError={() => {
            console.error("Google Login Failed");
            alert("Google login failed");
          }}
        />

        <p>
          Don't have an account?
          <Link to="/signup"> Sign Up</Link>
        </p>
      </div>
    </div>
  );
}