
import { useState } from "react";
import { BriefcaseBusiness } from "lucide-react";
import "./Auth.css";

export default function SignUp({ onSwitchToLogin }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:3000/api/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: username.trim(),
            email: email.trim(),
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed.");
      }

      setSuccess("Account created successfully! Please log in.");
      setUsername("");
      setEmail("");
      setPassword("");
    } catch (err) {
      setError(err.message || "Unable to create your account.");
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

        <h1 className="auth-heading">Create your account</h1>
        <p className="auth-subtitle">
          Start organizing your jobs and internships.
        </p>

        <form className="auth-form" onSubmit={handleSubmit}>
          <label className="auth-field">
            Username
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Choose a username"
              autoComplete="username"
              required
            />
          </label>

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
              placeholder="Create a password"
              autoComplete="new-password"
              minLength={8}
              required
            />
          </label>

          {error && <p className="auth-error">{error}</p>}
          {success && <p className="auth-success">{success}</p>}

          <button
            className="auth-submit"
            type="submit"
            disabled={loading}
          >
            {loading ? "Creating account..." : "Create account"}
          </button>
        </form>

        <p className="auth-switch">
          Already have an account?{" "}
          <button
            type="button"
            className="auth-link"
            onClick={onSwitchToLogin}
          >
            Log in
          </button>
        </p>

        <p className="auth-footer">
          Your next opportunity starts here.
        </p>
      </section>
    </main>
  );
}
