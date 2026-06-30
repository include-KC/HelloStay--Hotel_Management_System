# M6 - Complete Notes

## Milestone 6: Authentication UI Foundation

**Project:** HelloStay  
**Milestone:** Milestone 6  
**Focus Area:** Frontend authentication UI foundation  
**Status:** Complete  
**Main Decision:** Build authentication screens and service boundaries, but do **not** build real login behavior until backend authentication endpoints are exposed and confirmed.

---

## Table of Contents

1. [Objective](#1-objective)
2. [Backend Auth Verification Findings](#2-backend-auth-verification-findings)
3. [Problem Analysis](#3-problem-analysis)
4. [Correct Authentication Architecture](#4-correct-authentication-architecture)
5. [Milestone Boundary](#5-milestone-boundary)
6. [High-Level Design](#6-high-level-design)
7. [Concepts Involved](#7-concepts-involved)
8. [Folder and File Changes](#8-folder-and-file-changes)
9. [Step-by-Step Explanation](#9-step-by-step-explanation)
10. [Implementation](#10-implementation)
11. [Code Walkthrough](#11-code-walkthrough)
12. [Debugging Tips](#12-debugging-tips)
13. [Common Mistakes](#13-common-mistakes)
14. [Alternative Approaches](#14-alternative-approaches)
15. [Industry Best Practices](#15-industry-best-practices)
16. [Milestone 6 Completion Record](#16-milestone-6-completion-record)
17. [Next Step After Verification](#17-next-step-after-verification)
18. [Pre-Milestone 7 Checklist](#18-pre-milestone-7-checklist)
19. [Summary](#19-summary)

---

# 1. Objective

Milestone 6 is about building the **authentication UI foundation** for HelloStay.

This means building:

- Authentication screens
- Login form
- Register form
- Controlled inputs
- Frontend validation
- Loading states
- Error states
- Authentication service boundary

This milestone does **not** pretend that login is working before the backend exposes real authentication endpoints.

The correct decision for this milestone is:

> Build the authentication frontend foundation, but do not build real authentication behavior yet.

---

# 2. Backend Auth Verification Findings

## 2.1 Current Backend Router Registration

From the backend verification, `main.py` currently registers only these routers:

```text
system_info_router
room_router
guest_router
stay_router
guest_stay_router
```

There is currently **no registered auth router**.

That means there is no confirmed backend route for:

```text
/login
/register
/auth/login
/auth/register
/me
/logout
```

## 2.2 Existing Auth-Related Backend Helpers

Even though an auth router is not registered yet, the backend already contains authentication-related helper logic.

Existing backend auth/security pieces include:

- `verify_password`
- `get_password_hash`
- `create_access_token`
- token schema with `access_token`
- token schema with `token_type`
- `TokenPayload`

## 2.3 Correct Backend Interpretation

The backend is prepared conceptually for authentication because security helpers and token schemas exist.

However, the backend does **not yet expose confirmed login/register endpoints**.

Therefore, Milestone 6 should build the authentication UI and frontend boundaries only.

---

# 3. Problem Analysis

Authentication may look simple from the UI side:

```text
User enters username + password
User clicks Login
App checks credentials
User enters dashboard
```

But this is not how professional authentication should work.

The frontend should **never** decide whether the username and password are correct.

## 3.1 Bad Approach

Do not write fake credential checks in React:

```js
if (username === "admin" && password === "admin") {
  loginUser();
}
```

This makes React the source of truth for authentication, which is wrong.

## 3.2 Correct Approach for Now

The frontend should call a service function and handle the result:

```js
try {
  await login({ username, password });
} catch (error) {
  showError(error.message);
}
```

For now, the service should clearly say:

```text
Login API endpoint is not confirmed yet.
```

That keeps the UI realistic without faking backend behavior.

---

# 4. Correct Authentication Architecture

The real authentication flow should eventually be:

```text
React Login Form
      |
      v
authService.login()
      |
      v
apiClient request
      |
      v
FastAPI auth endpoint
      |
      v
Backend verifies username/password
      |
      v
Backend returns JWT token
      |
      v
Frontend stores/uses token carefully
```

In Milestone 6, the backend endpoint part is not confirmed yet.

So the project should stop before pretending the full flow works.

---

# 5. Milestone Boundary

## 5.1 What Milestone 6 Adds

Milestone 6 adds:

- Real `LoginPage` form UI
- Real `RegisterPage` form UI
- Controlled components
- `useState`-based form state
- Basic frontend validation
- Loading state
- Error state
- Dedicated `authService.js`
- `/register` route
- Clear service boundary for future backend integration

## 5.2 What Milestone 6 Does Not Add

Milestone 6 does **not** add:

- Real login
- Real registration
- Token storage
- `AuthContext`
- `ProtectedRoute`
- Dashboard redirect
- Role-based authorization
- Fake users
- Fake login success
- Invented backend endpoint paths

## 5.3 Reason for the Boundary

This is the correct boundary because the backend currently has JWT/security helpers and token schemas, but no confirmed registered auth endpoints.

---

# 6. High-Level Design

Milestone 6 adds this layer:

```text
React Pages
  LoginPage.jsx
  RegisterPage.jsx

Reusable UI
  Button.jsx
  Input.jsx
  Card.jsx
  Loading.jsx
  ErrorMessage.jsx

Service Layer
  authService.js

Existing Service Layer
  apiClient.js

Routes
  AppRoutes.jsx
```

## 6.1 Responsibility Split

| File / Layer | Responsibility |
|---|---|
| `LoginPage.jsx` | Form UI, form state, frontend validation, loading/error display, calls `authService` |
| `RegisterPage.jsx` | Account creation form UI, validation, loading/error display, calls `authService` |
| `authService.js` | Dedicated authentication API boundary, no fake users, no invented endpoint paths |
| `apiClient.js` | Generic HTTP request handling, base URL, JSON parsing, network/backend unavailable handling |
| FastAPI backend | Real credential verification, password hashing, JWT creation, database user lookup |
| Electron | No authentication form logic and no hotel business logic |

Electron is not involved in this milestone.

Electron main process should not know anything about username/password forms.

---

# 7. Concepts Involved

## 7.1 Authentication

Authentication answers:

> Who is this user?

Example:

```text
Username: owner
Password: ********
```

The backend verifies whether this identity is valid.

## 7.2 Authorization

Authorization answers:

> What is this authenticated user allowed to do?

Examples:

```text
Owner can view finance reports.
Manager can manage bookings.
Employee may only check in guests.
```

Authentication comes first. Authorization comes after.

For HelloStay:

```text
Milestone 6: Authentication UI foundation
Milestone 7: Auth state, token strategy, protected routes
Later: Roles and authorization
```

## 7.3 Controlled Components

A controlled input means React state controls the value of the input.

Example:

```jsx
const [username, setUsername] = useState("");

<Input
  value={username}
  onChange={(event) => setUsername(event.target.value)}
/>
```

The input value lives in React state.

Without controlled components, the browser owns the input value.

With controlled components, React owns the input value.

### Why Engineers Use Controlled Components

Controlled components make it easier to handle:

- Validation
- Reset behavior
- Submit handling
- Predictable UI
- Debugging

## 7.4 `useState`

`useState` lets a component remember information between renders.

Example:

```jsx
const [password, setPassword] = useState("");
```

This means:

| Name | Meaning |
|---|---|
| `password` | current value |
| `setPassword` | function used to update password |

When this runs:

```js
setPassword("hello");
```

React stores the new value and re-renders the component.

## 7.5 Form Submission

HTML forms normally reload the page when submitted.

In React apps, we usually stop that behavior:

```js
event.preventDefault();
```

Reason:

HelloStay is a single-page application. React should handle the submit event without refreshing the whole desktop UI.

## 7.6 Loading State

When the user clicks Login, the app may wait for the backend.

So we need:

```jsx
const [isSubmitting, setIsSubmitting] = useState(false);
```

This helps:

- Disable the button
- Prevent duplicate submissions
- Show `Checking...` or a loader

## 7.7 Error State

If validation fails or the backend is unavailable, we need:

```jsx
const [errorMessage, setErrorMessage] = useState("");
```

This lets the UI show a clear message instead of failing silently.

## 7.8 JWT at Beginner Level

JWT means **JSON Web Token**.

It is a signed string created by the backend after successful login.

Simplified JWT flow:

```text
User logs in successfully
Backend creates token
Frontend sends token with future requests
Backend checks token before allowing protected actions
```

JWT does not mean the frontend is secure by itself.

The backend must still verify the token on protected APIs.

Token storage must be decided carefully.

For Milestone 6, do **not** store tokens yet.

---

# 8. Folder and File Changes

For Milestone 6, touch only these frontend files:

```text
frontend/
  src/
    services/
      apiClient.js
      authService.js          new

    pages/
      StartPage.jsx
      LoginPage.jsx           update
      RegisterPage.jsx        new
      NotFoundPage.jsx

    routes/
      AppRoutes.jsx           update

    components/
      ui/
        Button.jsx            only if needed
        Input.jsx             only if needed
        Card.jsx
        Loading.jsx
        ErrorMessage.jsx

    styles/
      global.css              small additions only if needed
```

## 8.1 Files Not Included in This Milestone

Do not add:

- Dashboard
- Protected routes
- Token persistence
- Electron changes
- Backend changes

---

# 9. Step-by-Step Explanation

## Step 1: Verify Backend Auth Status

Current result:

- Security helpers exist.
- Token schemas exist.
- Auth endpoints are not confirmed.
- Auth router is not registered in `main.py`.

Proceed with UI foundation only.

No terminal command is needed for this step.

### Verification Steps

Open `backend/main.py`.

Confirm there is no:

```python
app.include_router(auth_router)
```

Open Swagger UI.

Confirm there is no:

```text
/login
/register
/auth/login
/auth/register
/me
/logout
```

## Step 2: Create `authService.js`

Create:

```text
frontend/src/services/authService.js
```

Purpose:

- `LoginPage` should not know endpoint details.
- `RegisterPage` should not know endpoint details.
- All auth-related API behavior should pass through `authService`.

For now, this service deliberately refuses to perform real auth because endpoints are not confirmed.

## Step 3: Improve `LoginPage.jsx`

The login page should become a real form UI with:

- username field
- password field
- controlled state
- validation
- loading state
- error message
- submit handler
- link to register page

Do not redirect to dashboard yet.

## Step 4: Add `RegisterPage.jsx`

This is appropriate because the V1 design says the login page should allow creating a new account.

Because the backend register endpoint is not confirmed, the page should behave like the login page:

- real form UI
- frontend validation
- no fake account creation
- calls `authService.register()`
- shows “register endpoint not confirmed yet”

## Step 5: Register the Route

Add:

```text
/register
```

to `AppRoutes.jsx`.

Do not add protected routes yet.

---

# 10. Implementation

## 10.1 Create `authService.js`

Create this file:

```text
frontend/src/services/authService.js
```

Code:

```js
const AUTH_API_STATUS = {
  loginEndpointConfirmed: false,
  registerEndpointConfirmed: false,
};

function createUnconfirmedEndpointError(actionName) {
  return new Error(
    `${actionName} API endpoint is not confirmed yet. The backend has JWT/security helpers, but no registered auth route was found.`
  );
}

export async function login(credentials) {
  const { username, password } = credentials;

  if (!username || !password) {
    throw new Error("Username and password are required.");
  }

  if (!AUTH_API_STATUS.loginEndpointConfirmed) {
    throw createUnconfirmedEndpointError("Login");
  }

  /*
    Future implementation after backend contract is confirmed:

    return apiClient("/confirmed-login-endpoint", {
      method: "POST",
      body: {
        username,
        password,
      },
    });

    Do not add endpoint paths until the FastAPI auth API exists.
  */
}

export async function registerAccount(accountData) {
  const { username, password, confirmPassword } = accountData;

  if (!username || !password || !confirmPassword) {
    throw new Error("Username, password, and confirm password are required.");
  }

  if (password !== confirmPassword) {
    throw new Error("Password and confirm password do not match.");
  }

  if (!AUTH_API_STATUS.registerEndpointConfirmed) {
    throw createUnconfirmedEndpointError("Register");
  }

  /*
    Future implementation after backend contract is confirmed:

    return apiClient("/confirmed-register-endpoint", {
      method: "POST",
      body: {
        username,
        password,
      },
    });

    Do not add endpoint paths until the FastAPI auth API exists.
  */
}

export function getAuthApiStatus() {
  return { ...AUTH_API_STATUS };
}
```

Important detail:

Do not import `apiClient.js` yet because there is no confirmed endpoint to call.

This keeps the file safe and honest.

---

## 10.2 Check `Input.jsx`

The `Input` component must allow `value` and `onChange`.

If the current `Input.jsx` already forwards props, this can be skipped.

Beginner-friendly version:

```jsx
function Input({
  id,
  label,
  helperText,
  error,
  className = "",
  ...props
}) {
  return (
    <div className={`form-field ${className}`}>
      {label ? (
        <label className="form-label" htmlFor={id}>
          {label}
        </label>
      ) : null}

      <input id={id} className="form-input" {...props} />

      {error ? <p className="form-error">{error}</p> : null}

      {!error && helperText ? (
        <p className="form-helper">{helperText}</p>
      ) : null}
    </div>
  );
}

export default Input;
```

The most important part is:

```jsx
{...props}
```

That allows this component to receive:

- `value`
- `onChange`
- `type`
- `name`
- `placeholder`
- `autoComplete`
- `disabled`
- `required`

Without `{...props}`, the reusable input becomes too limited.

---

## 10.3 Check `Button.jsx`

The button should also forward props.

```jsx
function Button({
  children,
  variant = "primary",
  className = "",
  ...props
}) {
  return (
    <button className={`button button-${variant} ${className}`} {...props}>
      {children}
    </button>
  );
}

export default Button;
```

The most important part is:

```jsx
{...props}
```

That allows:

- `type="submit"`
- `disabled={isSubmitting}`
- `onClick={...}`

---

## 10.4 Update `LoginPage.jsx`

Replace the placeholder login page with this:

```jsx
import { useState } from "react";
import { Link } from "react-router-dom";

import Button from "../components/ui/Button.jsx";
import Card from "../components/ui/Card.jsx";
import ErrorMessage from "../components/ui/ErrorMessage.jsx";
import Input from "../components/ui/Input.jsx";
import Loading from "../components/ui/Loading.jsx";
import { login } from "../services/authService.js";

function LoginPage() {
  const [formValues, setFormValues] = useState({
    username: "",
    password: "",
  });

  const [fieldErrors, setFieldErrors] = useState({
    username: "",
    password: "",
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
    };

    if (!formValues.username.trim()) {
      errors.username = "Username is required.";
    }

    if (!formValues.password) {
      errors.password = "Password is required.";
    }

    setFieldErrors(errors);

    return !errors.username && !errors.password;
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

      await login({
        username: formValues.username.trim(),
        password: formValues.password,
      });

      /*
        Future Milestone 7:
        - Save auth state safely
        - Store token according to chosen strategy
        - Redirect to dashboard
      */
    } catch (error) {
      setFormError(error.message || "Unable to login. Please try again.");
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
            <h1 className="page-title">Login</h1>
            <p className="page-description">
              Sign in to continue to your hotel management workspace.
            </p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit} noValidate>
            {formError ? <ErrorMessage message={formError} /> : null}

            <Input
              id="username"
              name="username"
              label="Username"
              type="text"
              placeholder="Enter your username"
              autoComplete="username"
              value={formValues.username}
              onChange={handleInputChange}
              error={fieldErrors.username}
              disabled={isSubmitting}
            />

            <Input
              id="password"
              name="password"
              label="Password"
              type="password"
              placeholder="Enter your password"
              autoComplete="current-password"
              value={formValues.password}
              onChange={handleInputChange}
              error={fieldErrors.password}
              disabled={isSubmitting}
            />

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Checking..." : "Login"}
            </Button>

            {isSubmitting ? <Loading message="Checking login details..." /> : null}
          </form>

          <p className="auth-footer-text">
            New to HelloStay?{" "}
            <Link to="/register">Create an account</Link>
          </p>
        </Card>
      </div>
    </main>
  );
}

export default LoginPage;
```

---

## 10.5 Create `RegisterPage.jsx`

Create this file:

```text
frontend/src/pages/RegisterPage.jsx
```

Code:

```jsx
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
```

---

## 10.6 Update `AppRoutes.jsx`

The route file should include the register page.

Example:

```jsx
import { Route, Routes } from "react-router-dom";

import LoginPage from "../pages/LoginPage.jsx";
import NotFoundPage from "../pages/NotFoundPage.jsx";
import RegisterPage from "../pages/RegisterPage.jsx";
import StartPage from "../pages/StartPage.jsx";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<StartPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default AppRoutes;
```

Do not add this yet:

```jsx
<Route path="/dashboard" element={<DashboardPage />} />
```

That belongs later.

Do not add this yet:

```jsx
<ProtectedRoute />
```

That belongs in Milestone 7.

---

## 10.7 Optional CSS Additions

Add only if the current styles do not already cover these classes.

File:

```text
frontend/src/styles/global.css
```

Add:

```css
.auth-page-stack {
  width: min(100%, 440px);
}

.auth-header {
  display: grid;
  gap: 8px;
  margin-bottom: 24px;
}

.auth-form {
  display: grid;
  gap: 16px;
}

.auth-footer-text {
  margin: 20px 0 0;
  color: var(--color-text-muted, #64748b);
  font-size: 14px;
  text-align: center;
}

.auth-footer-text a {
  color: var(--color-primary, #2563eb);
  font-weight: 600;
  text-decoration: none;
}

.auth-footer-text a:hover {
  text-decoration: underline;
}

.eyebrow-text {
  margin: 0;
  color: var(--color-primary, #2563eb);
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.form-field {
  display: grid;
  gap: 6px;
}

.form-label {
  color: var(--color-text, #172033);
  font-size: 14px;
  font-weight: 600;
}

.form-input {
  width: 100%;
  border: 1px solid var(--color-border, #d7dce5);
  border-radius: 10px;
  padding: 11px 12px;
  color: var(--color-text, #172033);
  background: #ffffff;
}

.form-input:focus {
  border-color: var(--color-primary, #2563eb);
  outline: 2px solid rgba(37, 99, 235, 0.14);
}

.form-input:disabled {
  cursor: not-allowed;
  opacity: 0.7;
}

.form-helper {
  margin: 0;
  color: var(--color-text-muted, #64748b);
  font-size: 13px;
}

.form-error {
  margin: 0;
  color: var(--color-danger, #dc2626);
  font-size: 13px;
}
```

---

# 11. Code Walkthrough

## 11.1 `authService.js`

This file protects the frontend architecture.

Instead of doing this inside `LoginPage`:

```js
fetch("/login")
```

Use:

```js
await login({ username, password });
```

Reason:

Page components should focus on UI.

Service files should focus on API communication.

This makes the app easier to change later.

When the backend later confirms an endpoint such as `/auth/login`, only `authService.js` needs to change.

The page can remain mostly the same.

---

## 11.2 `formValues`

In `LoginPage`:

```jsx
const [formValues, setFormValues] = useState({
  username: "",
  password: "",
});
```

This creates one state object for the form.

Instead of separate states:

```jsx
const [username, setUsername] = useState("");
const [password, setPassword] = useState("");
```

one object is used because login fields belong together.

---

## 11.3 `handleInputChange`

```js
const { name, value } = event.target;
```

This reads the input that changed.

If the input is:

```jsx
name="username"
```

then this update:

```js
[name]: value
```

means:

```js
username: value
```

If the input is:

```jsx
name="password"
```

then it means:

```js
password: value
```

This pattern keeps the form scalable.

---

## 11.4 `event.preventDefault()`

```js
event.preventDefault();
```

Without this, the browser reloads the page when the form submits.

In React, we want to handle the submit manually.

---

## 11.5 `try/catch/finally`

```js
try {
  setIsSubmitting(true);
  await login(...);
} catch (error) {
  setFormError(error.message);
} finally {
  setIsSubmitting(false);
}
```

This pattern is very common in real apps.

Meaning:

| Block | Meaning |
|---|---|
| `try` | attempt the operation |
| `catch` | handle failure |
| `finally` | always clean up loading state |

Even if login fails, `finally` still runs.

---

# 12. Debugging Tips

## Problem: Page Goes Blank After Adding `RegisterPage`

Likely cause:

```text
Wrong import path
```

Check:

```jsx
import RegisterPage from "../pages/RegisterPage.jsx";
```

Also check that the file name is exactly:

```text
RegisterPage.jsx
```

React/Vite imports are path-sensitive.

---

## Problem: Input Does Not Type

Likely cause:

```text
Input component does not pass value/onChange to the real input.
```

`Input.jsx` must include:

```jsx
<input {...props} />
```

---

## Problem: Button Does Not Submit Form

Likely cause:

```text
Button component does not pass type="submit" to the real button.
```

`Button.jsx` must include:

```jsx
<button {...props}>
```

---

## Problem: Error Always Says Auth Endpoint Not Confirmed

That is expected in Milestone 6.

It means the frontend is correctly refusing to fake authentication.

---

## Problem: Login Does Not Redirect

That is also expected.

Redirecting after login requires:

- confirmed backend login endpoint
- token handling strategy
- global auth state
- protected routes

Those belong to Milestone 7.

---

# 13. Common Mistakes

## Mistake 1: Hardcoding Fake Users

Avoid:

```js
if (username === "admin" && password === "admin") {
  navigate("/dashboard");
}
```

This creates a fake source of truth.

React should not verify credentials.

---

## Mistake 2: Calling APIs Directly in `LoginPage`

Avoid:

```js
fetch("http://localhost:8000/login")
```

inside `LoginPage`.

Use:

```js
authService.login()
```

This keeps page components clean.

---

## Mistake 3: Inventing Backend Endpoints

Avoid:

```js
apiClient("/auth/login")
```

unless the backend actually exposes `/auth/login`.

Right now, from the files shared, that endpoint is not registered.

---

## Mistake 4: Adding `ProtectedRoute` Too Early

Protected routes need reliable auth state.

First decide:

- Where is the token stored?
- How is login state restored after refresh?
- How does logout work?
- How does the app verify the current user?

That is Milestone 7 work.

---

## Mistake 5: Using `localStorage` Casually for Tokens

`localStorage` is easy, but token storage is a security decision.

In Electron, possible options may later include:

- memory-only token
- secure Electron storage
- `httpOnly` cookies if backend/browser setup supports it
- encrypted local storage with limitations

Do not decide this casually in Milestone 6.

---

# 14. Alternative Approaches

## Approach A: Build Only `LoginPage`

This is simpler, but incomplete for the V1 direction because the app should support account creation.

Recommendation:

```text
Not recommended.
```

## Approach B: Build `LoginPage` and `RegisterPage` UI Now

This is the chosen approach.

Benefits:

- Matches V1 flow
- Teaches forms properly
- Keeps backend honesty
- Prepares future auth integration

Recommendation:

```text
Recommended.
```

## Approach C: Build Full Auth Context Now

This is too early.

Auth context needs real backend behavior and token strategy.

Recommendation:

```text
Not recommended for Milestone 6.
```

## Approach D: Add Fake Login Temporarily

This may be useful for quick demos, but it is bad for learning production architecture.

Recommendation:

```text
Not recommended for HelloStay.
```

---

# 15. Industry Best Practices

## 15.1 Professional Frontend Authentication Practices

For professional frontend authentication:

1. Keep forms controlled.
2. Validate basic required fields on the frontend.
3. Let backend validate real credentials.
4. Keep API calls inside service files.
5. Do not invent API contracts.
6. Do not store tokens until the storage strategy is decided.
7. Do not protect routes until login state exists.
8. Show loading states during async actions.
9. Show clear user-facing errors.
10. Keep authentication separate from hotel business workflows.

## 15.2 HelloStay-Specific Responsibility Split

### React Renderer

Responsible for:

- Auth forms
- UI state
- Calls to `authService`

### `authService`

Responsible for:

- Login/register API boundary

### `apiClient`

Responsible for:

- Generic HTTP behavior

### FastAPI

Responsible for:

- Real auth rules
- Password hashing
- JWT creation
- User database lookup

### Electron

Responsible for:

- No auth form logic
- No hotel business logic

---

# 16. Milestone 6 Completion Record

Milestone 6 is complete.

Completion status:

- [x] `LoginPage` was converted from a placeholder into a real controlled form.
- [x] `RegisterPage` was created for the V1 account creation flow.
- [x] `/register` route was added.
- [x] Form values are managed with React `useState`.
- [x] Basic frontend validation was added.
- [x] Loading and error states were added.
- [x] Existing reusable UI components were used.
- [x] `authService.js` was created as the dedicated authentication service layer.
- [x] No fake users were hardcoded.
- [x] No fake login success was implemented.
- [x] No dashboard redirect was added.
- [x] No `ProtectedRoute` was created yet.
- [x] No token persistence strategy was implemented yet.
- [x] Backend auth endpoints were not invented.

## 16.1 Correct Stopping Point

This is the correct stopping point because:

- the backend has JWT/security helper code,
- the backend has token schemas,
- but the current FastAPI app registration still only includes:
  - system info
  - room
  - guest
  - stay
  - guest-stay routers
- and does not include an auth router.

The JWT helper functions exist separately in the security file, so the backend is prepared conceptually but is not yet exposing confirmed login/register routes.

---

# 17. Next Step After Verification

After verification, the next step is not to start coding Milestone 7 immediately.

First, close Milestone 6 properly by creating:

```text
Frontend AD 6
Milestone 6 Notes
```

After that, start:

```text
Milestone 7: Authentication Contract and Auth State Foundation
```

## 17.1 Recommended Workflow

```text
Step 1: Record Frontend AD 6
Step 2: Record Milestone 6 Notes
Step 3: Start Milestone 7
```

## 17.2 Milestone 7 Focus

Milestone 7 should focus on:

- confirming or designing backend auth endpoints
- planning token handling
- planning `AuthContext`
- planning login persistence
- planning `ProtectedRoute`
- preparing dashboard redirect

Do not build dashboard UI yet.

---

# 18. Pre-Milestone 7 Checklist

Before moving to Milestone 7, verify:

- [ ] `/login` opens correctly.
- [ ] `/register` opens correctly.
- [ ] Empty fields show validation errors.
- [ ] Typing works in all fields.
- [ ] Submit shows the expected unconfirmed auth endpoint message.
- [ ] No redirect happens.
- [ ] No fake user login exists.
- [ ] No token is stored.
- [ ] No protected route exists.

If all of these are true, Milestone 6 is complete.

---

# 19. Summary

Milestone 6 adds the authentication UI foundation.

It includes:

- real `LoginPage` form UI
- real `RegisterPage` form UI
- controlled inputs
- `useState`-based form state
- frontend validation
- loading state
- error state
- dedicated `authService.js`
- `/register` route

It intentionally does not include:

- real login
- real registration
- token storage
- `AuthContext`
- `ProtectedRoute`
- dashboard redirect
- role-based authorization

The next logical milestone is:

```text
Milestone 7: Authentication Contract Verification and Auth State Planning
```

Milestone 7 should verify or design the backend auth API contract first.

Potential future auth API contract:

```text
POST /auth/register
POST /auth/login
GET /auth/me
POST /auth/logout optional
```

Then decide:

- what login request body looks like
- what login response body looks like
- whether the backend returns JWT `access_token`
- where the frontend should keep the token
- whether `AuthContext` is needed
- how `ProtectedRoute` should work
- when redirect to dashboard should happen

Final next action:

```text
Generate Frontend AD 6 for Milestone 6.
Generate Milestone 6 Notes.
Then generate the starter prompt for Milestone 7.
```
