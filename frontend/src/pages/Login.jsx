import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Login() {
  const { user, login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (user) {
    return (
      <Navigate
        to={user.role === "Manager" ? "/manager" : "/employee"}
        replace
      />
    );
  }

  const handleChange = (event) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const loggedInUser = await login(
        form.email,
        form.password,
      );

      navigate(
        loggedInUser.role === "Manager"
          ? "/manager"
          : "/employee",
      );
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          "Unable to log in.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="login-page">
      <section className="login-card">
        <div className="login-intro">
          <p className="eyebrow">Employee Management</p>
          <h1>Welcome to LeaveFlow</h1>
          <p>
            Submit, review, and manage employee leave requests.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="form-stack">
          <label>
            Email
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Password
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
            />
          </label>

          {error && <p className="error-message">{error}</p>}

          <button
            type="submit"
            className="button button-primary"
            disabled={submitting}
          >
            {submitting ? "Logging in..." : "Log In"}
          </button>
        </form>

        <div className="demo-accounts">
          <p>
            <strong>Employee:</strong> employee@test.com /
            employee123
          </p>

          <p>
            <strong>Manager:</strong> manager@test.com /
            manager123
          </p>
        </div>
      </section>
    </main>
  );
}

export default Login;