import { useState } from "react";
import { Link } from "react-router-dom";

import Button from "../components/ui/Button.jsx";
import Card from "../components/ui/Card.jsx";
import ErrorMessage from "../components/ui/ErrorMessage.jsx";
import Input from "../components/ui/Input.jsx";
import Loading from "../components/ui/Loading.jsx";
import { registerAccount } from "../services/authService.js";

function RegisterPage() {
  const [formValues, setFormValues] = useState({
    username: "",
    password: "",
    confirmPassword: "",
  });

  const [fieldErrors, setFieldErrors] = useState({
    username: "",
    password: "",
    confirmPassword: "",
  });

  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleInputChange(event) {
    const { name, value } = event.target;

    setFormValues((currentValues) => {
      return {
        ...currentValues,
        [name]: value,
      };
    });

    setFieldErrors((currentErrors) => {
      return {
        ...currentErrors,
        [name]: "",
      };
    });

    setFormError("");
  }

  function validateForm() {
    const errors = {
      username: "",
      password: "",
      confirmPassword: "",
    };

    if (!formValues.username.trim()) {
      errors.username = "Username is required.";
    }

    if (!formValues.password) {
      errors.password = "Password is required.";
    }

    if (formValues.password && formValues.password.length < 6) {
      errors.password = "Password should be at least 6 characters.";
    }

    if (!formValues.confirmPassword) {
      errors.confirmPassword = "Please confirm your password.";
    }

    if (
      formValues.password &&
      formValues.confirmPassword &&
      formValues.password !== formValues.confirmPassword
    ) {
      errors.confirmPassword = "Passwords do not match.";
    }

    setFieldErrors(errors);

    return (
      !errors.username &&
      !errors.password &&
      !errors.confirmPassword
    );
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const isValid = validateForm();

    if (!isValid) {
      return;
    }

    try {
      setIsSubmitting(true);
      setFormError("");

      await registerAccount({
        username: formValues.username.trim(),
        password: formValues.password,
        confirmPassword: formValues.confirmPassword,
      });

      /*
        Future milestone:
        - Decide whether registration automatically logs in the user
        - Decide whether only the first owner account can be created
        - Decide whether hotel setup is required after registration
      */
    } catch (error) {
      setFormError(
        error.message || "Unable to create account. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="page-center">
      <div className="page-stack auth-page-stack">
        <Card>
          <div className="auth-header">
            <p className="eyebrow-text">HelloStay</p>
            <h1 className="page-title">Create Account</h1>
            <p className="page-description">
              Create the first account for this local HelloStay installation.
            </p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit} noValidate>
            {formError ? <ErrorMessage message={formError} /> : null}

            <Input
              id="register-username"
              name="username"
              label="Username"
              type="text"
              placeholder="Choose a username"
              autoComplete="username"
              value={formValues.username}
              onChange={handleInputChange}
              error={fieldErrors.username}
              disabled={isSubmitting}
            />

            <Input
              id="register-password"
              name="password"
              label="Password"
              type="password"
              placeholder="Choose a password"
              autoComplete="new-password"
              value={formValues.password}
              onChange={handleInputChange}
              error={fieldErrors.password}
              disabled={isSubmitting}
              helperText="Use at least 6 characters for now. Backend rules will become the final source of truth later."
            />

            <Input
              id="confirm-password"
              name="confirmPassword"
              label="Confirm Password"
              type="password"
              placeholder="Re-enter your password"
              autoComplete="new-password"
              value={formValues.confirmPassword}
              onChange={handleInputChange}
              error={fieldErrors.confirmPassword}
              disabled={isSubmitting}
            />

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Account"}
            </Button>

            {isSubmitting ? <Loading message="Preparing account..." /> : null}
          </form>

          <p className="auth-footer-text">
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </Card>
      </div>
    </main>
  );
}

export default RegisterPage;