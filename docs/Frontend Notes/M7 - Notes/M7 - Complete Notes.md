# M7 - Complete Notes

## Milestone 7: Frontend Authentication State and Protected Routing

Milestone 7 is intentionally small.

The goal is to verify what authentication support currently exists, then add safe React authentication structure and protected routing without pretending the backend authentication flow is complete.

An important blocker was found before coding:

Your uploaded backend has JWT helper code and token schemas, but there is no auth router registered in `main.py`.

Because of that, the frontend should build the authentication skeleton and route guards, but it should not claim that real login works yet.

---

## 1. Objective

Milestone 7 introduces frontend authentication state and route protection.

The goal is **not** to finish real authentication yet.

The goal is to prepare the React frontend so that, once the FastAPI auth endpoint is available, the app already knows how to:

- Remember whether the user is logged in.
- Expose `login()` and `logout()` globally.
- Protect private routes.
- Redirect unauthenticated users to `/login`.
- Redirect authenticated users away from `/login`.
- Keep auth logic out of random page components.

### Important Backend Finding

The uploaded backend currently contains JWT/password helper logic and token schemas.

However, `main.py` only registers these routers:

- `system_info`
- `room`
- `guest`
- `stay`
- `guest_stay`

There is no auth router registered there.

So real backend login is currently blocked unless another backend file exists that was not uploaded.

The backend does have token/security foundations:

- Password hashing exists.
- Password verification exists.
- `create_access_token()` exists in `security.py`.
- The `Token` schema contains:
  - `access_token`
  - `token_type`

So for Milestone 7, the correct approach is:

- Build the safe frontend authentication structure.
- Do not fake production login.

---

## 2. Problem Analysis

Right now, the app has pages such as:

- `/start` or `/`
- `/login`
- `/not-found`

But React does not yet have a central place that answers:

- Is the user logged in?
- What is the current token?
- How do we log in?
- How do we log out?
- Which pages are private?

A beginner mistake is to put login state directly inside `LoginPage.jsx`.

That works only for the login page, but the rest of the app cannot easily know the login status.

For example:

- `LoginPage` knows the user is logged in.
- `Dashboard` does not know.
- Routes do not know.
- Header does not know.
- Logout button does not know.

So we need global auth state.

In React, the beginner-friendly way to share state across many pages is the **Context API**.

---

## 3. High-Level Design

Milestone 7 architecture:

```text
React Renderer Process
│
├── main.jsx
│   └── wraps app with AuthProvider
│
├── context/
│   └── AuthContext.jsx
│       ├── stores token in React state
│       ├── restores token from sessionStorage
│       ├── exposes login()
│       ├── exposes logout()
│       └── exposes isAuthenticated
│
├── routes/
│   ├── AppRoutes.jsx
│   └── ProtectedRoute.jsx
│       └── blocks private pages if not logged in
│
├── pages/
│   ├── LoginPage.jsx
│   └── DashboardPlaceholderPage.jsx
│
└── services/
    └── authService.js
        └── future backend auth API calls live here
```

### Responsibility Separation

#### FastAPI Backend

- Validates username/password.
- Checks password hash.
- Creates JWT token.
- Protects private APIs.

#### React Renderer

- Shows login form.
- Stores frontend session token.
- Controls route access.
- Redirects users.

#### Electron Main Process

- Does not manage login form state.
- Does not store auth business logic.
- Does not validate users.

---

## 4. Concepts Involved

### Global State

Global state means state that many parts of the app need.

Example:

```js
const isAuthenticated = true;
```

This should not belong only to `LoginPage`, because many screens need it.

Examples:

- `LoginPage` needs it to redirect logged-in users.
- `ProtectedRoute` needs it to block private pages.
- `Dashboard` needs it to show logout.
- Future header/sidebar may need it to show user info.

---

### React Context

React Context allows you to create a shared value and make it available to many components without manually passing props through every level.

Without Context:

```jsx
<App token={token}>
  <Routes token={token}>
    <Dashboard token={token} />
  </Routes>
</App>
```

This becomes messy.

With Context:

```jsx
<AuthProvider>
  <App />
</AuthProvider>
```

Then any child component can read auth state using:

```js
const { isAuthenticated, login, logout } = useAuth();
```

---

### Provider

A Provider is the component that supplies shared data.

In this case:

```jsx
<AuthProvider>
  <App />
</AuthProvider>
```

This means every component inside `App` can access auth state.

---

### Consumer / `useContext`

A consumer is any component that reads context.

In modern React, we usually use a custom hook:

```js
const { logout } = useAuth();
```

Instead of using `useContext(AuthContext)` directly everywhere, we create `useAuth()` to keep the app cleaner.

---

### ProtectedRoute

`ProtectedRoute` is a wrapper component.

It checks:

> Is the user authenticated?

If yes:

- Show the private page.

If no:

- Redirect to `/login`.

Example:

```jsx
<Route
  path="/dashboard"
  element={
    <ProtectedRoute>
      <DashboardPlaceholderPage />
    </ProtectedRoute>
  }
/>
```

---

### Navigate from React Router

`Navigate` is a React Router component used for redirects.

Example:

```jsx
return <Navigate to="/login" replace />;
```

This means:

- Do not render this page.
- Send the user to `/login` instead.

`replace` means the browser history entry is replaced, so the user cannot simply press Back to return to the blocked private page.

---

### Authentication vs Authorization

Authentication means:

> Who are you?

Example:

- Username + password login.

Authorization means:

> What are you allowed to do?

Examples:

- Owner can access finance.
- Receptionist can create bookings.
- Housekeeping can update cleaning status.

Milestone 7 handles only authentication state and route protection.

Role-based authorization should wait.

---

### Frontend Route Protection Is Not Backend Security

Protected routes improve user experience, but they are not enough.

A user could still manually call backend APIs using tools like Postman if the backend does not protect them.

So later, FastAPI must protect private APIs using token verification.

Frontend protection:

- Prevents normal UI navigation.

Backend protection:

- Actually protects data.

Both are needed.

---

### Token Storage Strategy for V1

For this milestone, use:

```text
sessionStorage
```

Store only:

- Access token.

Do not store:

- Rooms.
- Guests.
- Stays.
- Bookings.
- Finance data.
- Hotel business data.

#### Why `sessionStorage` for now?

- It is simple.
- It survives page refresh.
- It clears when the app window/session closes.
- It is safer than long-term `localStorage` for beginner V1 auth.

#### Why not blindly use `localStorage`?

- `localStorage` persists longer.
- If malicious JavaScript ever runs in the renderer, it can read `localStorage`.
- Electron reduces some risks when configured safely, but it does not magically remove all frontend security risks.

Later, for a packaged Electron app, we can revisit more secure desktop token storage.

---

## 5. Folder/File Changes

Create or update these files:

```text
frontend/src/context/AuthContext.jsx

frontend/src/routes/ProtectedRoute.jsx
frontend/src/routes/AppRoutes.jsx

frontend/src/pages/LoginPage.jsx
frontend/src/pages/DashboardPlaceholderPage.jsx

frontend/src/services/authService.js

frontend/src/main.jsx
```

No new dependency is needed if React Router is already installed from Milestone 3.

---

## 6. Step-by-Step Explanation

### Step 1: Create `context/AuthContext.jsx`

This file will own the global auth state.

Create this folder if it does not exist:

```text
frontend/src/context/
```

Then create:

```text
frontend/src/context/AuthContext.jsx
```

Implementation:

```jsx
import { createContext, useContext, useMemo, useState } from "react";

import { loginRequest } from "../services/authService.js";

const AuthContext = createContext(null);

const TOKEN_STORAGE_KEY = "hellostay_access_token";

function readStoredToken() {
  try {
    return sessionStorage.getItem(TOKEN_STORAGE_KEY);
  } catch {
    return null;
  }
}

function saveToken(token) {
  try {
    sessionStorage.setItem(TOKEN_STORAGE_KEY, token);
  } catch {
    // If browser storage fails, React state will still hold the token for this session.
  }
}

function removeToken() {
  try {
    sessionStorage.removeItem(TOKEN_STORAGE_KEY);
  } catch {
    // Ignore storage cleanup failure.
  }
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => readStoredToken());
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const isAuthenticated = Boolean(token);

  async function login(credentials) {
    setIsAuthenticating(true);

    try {
      const authData = await loginRequest(credentials);

      if (!authData?.access_token) {
        throw new Error("Login response did not include an access token.");
      }

      saveToken(authData.access_token);
      setToken(authData.access_token);

      return authData;
    } finally {
      setIsAuthenticating(false);
    }
  }

  function logout() {
    removeToken();
    setToken(null);
  }

  const value = useMemo(
    () => ({
      token,
      isAuthenticated,
      isAuthenticating,
      login,
      logout,
    }),
    [token, isAuthenticated, isAuthenticating]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (context === null) {
    throw new Error("useAuth must be used inside AuthProvider.");
  }

  return context;
}
```

#### Verification After This Step

- No visible UI change yet.
- The app may fail only if `authService.js` does not export `loginRequest`.
- We fix that next.

---

### Step 2: Prepare `services/authService.js`

Because the uploaded backend does not expose a confirmed login endpoint yet, do not invent:

- `/login`
- `/auth/login`
- `/token`
- `/users/login`

Create or update:

```text
frontend/src/services/authService.js
```

Use this safe version for now:

```js
export async function loginRequest(credentials) {
  console.log("Login credentials prepared for backend auth:", {
    username: credentials.username,
  });

  throw new Error(
    "Backend authentication endpoint is not implemented yet. Frontend auth state is ready, but real login is blocked until FastAPI exposes a login endpoint."
  );
}
```

Important:

- We are not storing a fake token.
- This is intentional.
- The frontend structure is ready, but real authentication remains blocked until the backend exposes a real auth API.

Later, when the backend contract is confirmed, this function will become something like:

```js
// Example only. Do not use until the real backend contract is confirmed.
// export async function loginRequest(credentials) {
//   return apiRequest("/confirmed-auth-endpoint", {
//     method: "POST",
//     body: credentials,
//   });
// }
```

#### Verification After This Step

- The frontend can import `loginRequest`.
- Submitting login should show a controlled error instead of pretending success.

---

### Step 3: Wrap the App with `AuthProvider`

Open:

```text
frontend/src/main.jsx
```

The file may already look slightly different, but the idea is:

```jsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";

import "./styles/global.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
```

Important placement:

- `BrowserRouter` should wrap route-related components.
- `AuthProvider` should wrap the app so all pages can access auth state.

If `BrowserRouter` is already inside `App.jsx`, then use this instead:

```jsx
<StrictMode>
  <AuthProvider>
    <App />
  </AuthProvider>
</StrictMode>
```

The cleaner structure is usually:

```text
main.jsx
└── BrowserRouter
    └── AuthProvider
        └── App
            └── AppRoutes
```

#### Verification After This Step

Run the app.

If you see this error:

```text
useAuth must be used inside AuthProvider
```

Then the Provider is not wrapping the component that calls `useAuth`.

---

### Step 4: Create `ProtectedRoute.jsx`

Create:

```text
frontend/src/routes/ProtectedRoute.jsx
```

Implementation:

```jsx
import { Navigate, useLocation } from "react-router-dom";

import { useAuth } from "../context/AuthContext.jsx";

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
}

export default ProtectedRoute;
```

This component does one job:

- If logged in, show the page.
- If not logged in, redirect to login.

#### Verification After This Step

No visible change until we use `ProtectedRoute` in `AppRoutes.jsx`.

---

### Step 5: Create a Temporary Private Page

Create:

```text
frontend/src/pages/DashboardPlaceholderPage.jsx
```

This is not the real dashboard.

It exists only to test protected routing.

```jsx
import { useNavigate } from "react-router-dom";

import Button from "../components/ui/Button.jsx";
import Card from "../components/ui/Card.jsx";
import { useAuth } from "../context/AuthContext.jsx";

function DashboardPlaceholderPage() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  function handleLogout() {
    logout();
    navigate("/login", { replace: true });
  }

  return (
    <main className="page-center">
      <div className="page-stack">
        <Card>
          <h1 className="page-title">Private Area</h1>

          <p className="page-description">
            This is a temporary protected page for testing authentication state
            and protected routing. The real dashboard shell will be built in a
            later milestone.
          </p>

          <div style={{ marginTop: "24px" }}>
            <Button type="button" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </Card>
      </div>
    </main>
  );
}

export default DashboardPlaceholderPage;
```

#### Verification After This Step

This page should not be accessible yet unless a real token exists.

---

### Step 6: Update `AppRoutes.jsx`

Open:

```text
frontend/src/routes/AppRoutes.jsx
```

A minimal Milestone 7 version should look like this:

```jsx
import { Navigate, Route, Routes } from "react-router-dom";

import ProtectedRoute from "./ProtectedRoute.jsx";

import StartPage from "../pages/StartPage.jsx";
import LoginPage from "../pages/LoginPage.jsx";
import DashboardPlaceholderPage from "../pages/DashboardPlaceholderPage.jsx";
import NotFoundPage from "../pages/NotFoundPage.jsx";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<StartPage />} />

      <Route path="/login" element={<LoginPage />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPlaceholderPage />
          </ProtectedRoute>
        }
      />

      <Route path="/not-found" element={<NotFoundPage />} />
      <Route path="*" element={<Navigate to="/not-found" replace />} />
    </Routes>
  );
}

export default AppRoutes;
```

Important:

- `/dashboard` is only a temporary protected route.
- It is not the real dashboard layout.
- No sidebar.
- No hotel modules.
- No rooms.
- No guests.
- No bookings.

#### Verification After This Step

Visit:

```text
http://localhost:5173/dashboard
```

Expected result:

```text
You should be redirected to /login.
```

That confirms the unauthenticated protected route guard works.

---

### Step 7: Connect `LoginPage.jsx` to `AuthContext` Safely

Open:

```text
frontend/src/pages/LoginPage.jsx
```

Use this structure, but preserve any styling classes already created in Milestone 6.

```jsx
import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";

import Button from "../components/ui/Button.jsx";
import Card from "../components/ui/Card.jsx";
import ErrorMessage from "../components/ui/ErrorMessage.jsx";
import Input from "../components/ui/Input.jsx";
import { useAuth } from "../context/AuthContext.jsx";

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
```

If `RegisterPage.jsx` was not created in Milestone 6, remove this part for now:

```jsx
<p className="page-description" style={{ marginTop: "16px" }}>
  New to HelloStay? <Link to="/register">Create an account</Link>
</p>
```

Or keep it only if `/register` exists in the routes.

#### Verification After This Step

Submit the login form.

Expected result right now:

```text
Backend authentication endpoint is not implemented yet...
```

That is correct for the currently uploaded backend state.

The frontend is not faking login.

---

## 7. Implementation Order

Follow this exact order:

1. Create `src/context/AuthContext.jsx`.
2. Update `src/services/authService.js`.
3. Wrap `App` with `AuthProvider` in `src/main.jsx`.
4. Create `src/routes/ProtectedRoute.jsx`.
5. Create `src/pages/DashboardPlaceholderPage.jsx`.
6. Update `src/routes/AppRoutes.jsx`.
7. Update `src/pages/LoginPage.jsx`.
8. Run and verify.

Run the app:

```bash
npm run dev
```

If testing through Electron:

```bash
npm run desktop
```

---

## 8. Code Walkthrough

### `AuthContext.jsx`

This line creates the context:

```js
const AuthContext = createContext(null);
```

At first, it contains no value.

This line restores an existing token:

```js
const [token, setToken] = useState(() => readStoredToken());
```

The function form is important:

```js
useState(() => readStoredToken())
```

This means React calls `readStoredToken()` only during the first render.

This line converts token into a boolean:

```js
const isAuthenticated = Boolean(token);
```

If token exists:

```text
isAuthenticated = true
```

If token is missing:

```text
isAuthenticated = false
```

The `login()` function calls the service layer:

```js
const authData = await loginRequest(credentials);
```

That keeps API logic outside the page.

The `logout()` function removes the token:

```js
removeToken();
setToken(null);
```

This updates both browser session storage and React state.

---

### `ProtectedRoute.jsx`

This line reads auth state:

```js
const { isAuthenticated } = useAuth();
```

This line remembers where the user tried to go:

```js
const location = useLocation();
```

This redirects unauthenticated users:

```jsx
return <Navigate to="/login" replace state={{ from: location }} />;
```

The `state={{ from: location }}` part is useful because after login, you can return the user to the originally requested page.

---

### `LoginPage.jsx`

This line gets auth tools:

```js
const { isAuthenticated, isAuthenticating, login } = useAuth();
```

This protects the login page from logged-in users:

```jsx
if (isAuthenticated) {
  return <Navigate to={redirectTo} replace />;
}
```

This makes the form controlled:

```js
const [formData, setFormData] = useState({
  username: "",
  password: "",
});
```

A controlled form means React state is the source of truth for input values.

This updates the correct field dynamically:

```js
const { name, value } = event.target;
```

Because the inputs have:

```jsx
name="username"
name="password"
```

This code updates either field:

```js
setFormData((currentFormData) => ({
  ...currentFormData,
  [name]: value,
}));
```

`[name]` is JavaScript computed property syntax.

If `name` is `"username"`, it updates:

```js
username: value
```

If `name` is `"password"`, it updates:

```js
password: value
```

---

## 9. Debugging Tips

### Error: `useAuth must be used inside AuthProvider`

Cause:

- A component is calling `useAuth()`, but `AuthProvider` is not wrapping it.

Fix:

- Check `main.jsx`.
- Make sure `AuthProvider` wraps `App`.

---

### Error: `loginRequest is not exported`

Cause:

- `authService.js` does not export `loginRequest`.

Fix:

```js
export async function loginRequest(credentials) {
  // ...
}
```

---

### Error: Page Redirects to `/login` Forever

Cause:

- No token exists.

For now, this is expected because backend login is blocked.

Once the backend login endpoint exists and returns an access token, successful login should store the token and allow `/dashboard`.

---

### Login Button Shows Backend Auth Unavailable

Cause:

- Correct current behavior.
- The backend has JWT helper utilities, but no registered auth API route in the uploaded `main.py`.

---

### Error: `/register` Goes to Not Found

Cause:

- `RegisterPage` route does not exist.

Fix:

- Either create `RegisterPage` from Milestone 6.
- Or remove the register link temporarily.

---

## 10. Common Mistakes

### Mistake 1: Storing Hotel Data in `localStorage`

Do not store this in frontend storage:

- Rooms.
- Guests.
- Stays.
- Bookings.
- Income.
- Finance history.

FastAPI and SQLite are the source of truth.

Frontend storage may hold only temporary frontend session data, such as:

- Access token.

---

### Mistake 2: Putting Auth Logic Inside `LoginPage.jsx`

Bad:

```text
LoginPage owns everything.
```

Better:

- `LoginPage` handles form UI.
- `AuthContext` handles auth state.
- `authService` handles backend API call.

---

### Mistake 3: Treating `ProtectedRoute` as Real Security

`ProtectedRoute` is helpful, but it is not enough.

The backend must still protect private APIs.

Later, FastAPI should check:

```http
Authorization: Bearer <token>
```

before returning private hotel data.

---

### Mistake 4: Using Electron Main Process for Auth Form Logic

Do not do this:

- Electron main process validates username/password.
- Electron main process stores hotel auth state.
- Electron main process decides route access.

Correct:

- React handles UI auth state.
- FastAPI validates credentials.
- Electron only hosts the app window.

---

### Mistake 5: Inventing Backend Endpoints

Do not write:

```js
apiRequest("/auth/login")
```

unless the backend actually exposes that endpoint.

Endpoint contracts must come from FastAPI.

---

## 11. Alternative Approaches

### Option A: React Context

Best for Milestone 7.

Pros:

- Beginner-friendly.
- No extra library.
- Good for simple auth state.
- Easy to understand.

Cons:

- Can become too broad if used for everything.
- Not ideal for complex server cache.

Recommended now.

---

### Option B: Redux / Zustand

Useful later if app state becomes large.

Pros:

- Better for complex global state.
- Good debugging tools.

Cons:

- More concepts.
- Too much for current milestone.

Not recommended yet.

---

### Option C: Server Session Cookies

Common in web apps.

Pros:

- Can be more secure when configured properly.

Cons:

- Requires backend session/cookie architecture.
- Not what the current backend files show.

Not for this milestone.

---

### Option D: Electron Secure Storage

Useful later for a packaged desktop app.

Pros:

- Better than plain browser storage.
- More desktop-native.

Cons:

- Requires Electron preload/main IPC design.
- Too early before auth backend is complete.

Future milestone.

---

## 12. Industry Best Practices

For HelloStay V1, use this rule:

```text
React remembers session state.
FastAPI validates identity.
SQLite stores real hotel data.
Electron hosts the desktop shell.
```

Recommended practices:

- Keep auth state in `AuthContext`.
- Keep API calls in services.
- Keep route protection in `ProtectedRoute`.
- Keep form state inside `LoginPage`.
- Keep hotel business data out of `localStorage`.
- Do not build role permissions yet.
- Do not build the real dashboard yet.
- Do not move backend logic into Electron.

The clean mental model is:

```text
Page = UI
Context = shared frontend state
Service = API communication
Route = navigation rule
Backend = business truth
Database = persistence
Electron = desktop shell
```

---

## 13. Summary

Milestone 7 adds the frontend structure needed for authentication:

- `AuthContext.jsx`
- `ProtectedRoute.jsx`
- `DashboardPlaceholderPage.jsx`
- `LoginPage` connected to `AuthContext`
- `/dashboard` protected route
- Logout behavior
- `sessionStorage` token strategy

But based on the uploaded backend files, real login is not ready yet because no auth router is registered in `main.py`.

The backend has JWT helper foundations and token schemas, but not the full login/register API contract.

So the correct Milestone 7 result is:

- Unauthenticated `/dashboard` redirects to `/login`.
- Login form submits safely.
- Login shows backend-auth-not-implemented error.
- No fake token is created.
- Frontend auth architecture is ready for the real backend endpoint.

---

## 14. Suggested Next Step

Implement the files in this order:

1. `AuthContext.jsx`
2. `authService.js`
3. `main.jsx`
4. `ProtectedRoute.jsx`
5. `DashboardPlaceholderPage.jsx`
6. `AppRoutes.jsx`
7. `LoginPage.jsx`

After that, test `/dashboard`.

Expected result:

```text
Redirecting to /login
```

---

# Verification Follow-Up

The expected output was confirmed:

```text
/dashboard → redirects to /login when no token exists
```

That means the unauthenticated protected-route behavior is working correctly.

---

## Verified Behavior

Milestone 7’s main frontend guard is now verified:

```text
/dashboard → redirects to /login when no token exists
```

That is the correct behavior because the current backend files do not yet expose a registered auth router in `main.py`.

Only routers such as the following are included:

- System info
- Rooms
- Guests
- Stays
- Guest-stays

---

## What Has Been Verified

The following are confirmed:

- React Router is working.
- `AuthProvider` is wrapping the app correctly.
- `useAuth` is available inside route/page components.
- `ProtectedRoute` correctly detects unauthenticated state.
- `Navigate` correctly redirects the user to `/login`.
- No fake login token is being created.

This is a good production-minded result.

The app is not pretending authentication is complete before the backend contract exists.

---

## What Is Still Not Verified

This part is not yet testable properly:

- Login success.
- Token storage after login.
- Authenticated access to `/dashboard`.
- Logout from protected page.

Reason:

The backend currently has JWT/security helper foundations, but not a confirmed working login endpoint registered in the app.

The helper functions for password hashing and access-token creation exist in `security.py`, and the token response schema exists in `token.py`, but the frontend should not invent an endpoint contract.

---

## Current Milestone 7 Status

### Complete

You can mark this part as complete:

- Milestone 7 frontend auth-state foundation: complete.
- `ProtectedRoute` unauthenticated redirect: complete.
- Login form connected safely to `AuthContext`: complete.
- Fake production login avoided: complete.

### Blocked by Backend

You should mark this part as blocked by backend:

- Real login success flow: blocked.
- Authenticated dashboard access: blocked.
- Logout after real login: blocked.
