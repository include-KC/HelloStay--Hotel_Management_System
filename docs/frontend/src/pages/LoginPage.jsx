import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";

import Button from "../components/ui/Button.jsx";
import Card from "../components/ui/Card.jsx";
import ErrorMessage from "../components/ui/ErrorMessage.jsx";
import Input from "../components/ui/Input.jsx";
import { useAuth } from "../hooks/useAuth.js";

function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const { isAuthenticated, isAuthenticating, login } = useAuth();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [formError, setFormError] = useState("");

  const redirectTo = location.state?.from?.pathname || "/dashboard";

  if (isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((currentFormData) => ({
      ...currentFormData,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setFormError("");

    const username = formData.username.trim();
    const password = formData.password;

    if (!username) {
      setFormError("Username is required.");
      return;
    }

    if (!password) {
      setFormError("Password is required.");
      return;
    }

    try {
      await login({
        username,
        password,
      });

      navigate(redirectTo, { replace: true });
    } catch (error) {
      setFormError(error.message || "Login failed. Please try again.");
    }
  }

  return (
    <main className="page-center">
      <div className="page-stack">
        <Card>
          <h1 className="page-title">Login</h1>

          <p className="page-description">
            Sign in to access the private area of HelloStay.
          </p>

          <form onSubmit={handleSubmit} style={{ marginTop: "24px" }}>
            <div style={{ display: "grid", gap: "16px" }}>
              <Input
                id="username"
                name="username"
                label="Username"
                type="text"
                placeholder="Enter your username"
                value={formData.username}
                onChange={handleChange}
                autoComplete="username"
              />

              <Input
                id="password"
                name="password"
                label="Password"
                type="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                autoComplete="current-password"
              />

              {formError ? <ErrorMessage message={formError} /> : null}

              <Button type="submit" disabled={isAuthenticating}>
                {isAuthenticating ? "Logging in..." : "Login"}
              </Button>
            </div>
          </form>

          <p className="page-description" style={{ marginTop: "16px" }}>
            New to HelloStay? <Link to="/register">Create an account</Link>
          </p>
        </Card>
      </div>
    </main>
  );
}

export default LoginPage;