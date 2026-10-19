
import "./Auth.css";
import { useState } from "react";
import { BriefcaseBusiness } from "lucide-react";

export default function Login({ onLogin, onSwitchToSignUp }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:3000/api/auth/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      if (!data.accessToken) {
        throw new Error("No access token was returned.");
      }

      localStorage.setItem("accessToken", data.accessToken);
      onLogin();
    } catch (err) {
      setError(err.message || "Unable to log in.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-card">
        <div className="auth-brand">
          <div className="auth-brand-icon">
            <BriefcaseBusiness size={23} />
          </div>
          <span className="auth-brand-name">TrackMyCareer</span>
        </div>

        <h1 className="auth-heading">Welcome back!</h1>
        <p className="auth-subtitle">
          Log in to track your jobs and internships.
        </p>

        <form className="auth-form" onSubmit={handleSubmit}>
          <label className="auth-field">
            Email address
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
              required
            />
          </label>

          <label className="auth-field">
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              autoComplete="current-password"
              required
            />
          </label>

          {error && <p className="auth-error">{error}</p>}

          <button
            className="auth-submit"
            type="submit"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Log in"}
          </button>
        </form>

        <p className="auth-switch">
          Don't have an account?{" "}
          <button
            type="button"
            className="auth-link"
            onClick={onSwitchToSignUp}
          >
            Sign up
          </button>
        </p>

        <p className="auth-footer">
          Your next opportunity starts here.
        </p>
      </section>
    </main>
  );
}
