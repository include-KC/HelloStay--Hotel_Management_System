# M3 - Complete Notes

## 1. Objective

Milestone 3 adds startup flow and routing to the React renderer.

By the end of this milestone, HelloStay will have:

/          → StartPage
/login     → LoginPage placeholder
anything  → NotFoundPage

The app will open on the startup page, and the startup page will have a button that navigates to the login page.

We are not building authentication, dashboard, hotel modules, backend integration, or Electron backend startup yet.

## 2. Problem Analysis

Right now, your React app likely renders one component directly through App.jsx.

That is fine for Milestone 1, but real applications need multiple screens:

Start page
Login page
Dashboard
Rooms
Guests
Bookings
Finance
Settings

Without routing, React has no clean way to decide:

“When the URL is /login, show the login screen.”

React Router solves this problem.

React Router’s official docs explain that routes are configured with <Routes> and <Route>, where URL segments are connected to UI components.

For HelloStay, routing belongs in the React renderer process, not the Electron main process.

Electron’s job is:

Open the desktop window
Load the React app
Handle desktop lifecycle

React’s job is:

Show pages
Handle navigation
Render UI
Respond to user clicks

Your backend already exists separately as FastAPI, with routes registered in main.py, but this milestone will not call those APIs yet.

## 3. High-Level Design

We will keep the structure simple:

frontend/
  src/
    main.jsx
    App.jsx

    routes/
      AppRoutes.jsx

    pages/
      StartPage.jsx
      LoginPage.jsx
      NotFoundPage.jsx

    styles/
      global.css

The flow will look like this:

main.jsx
  ↓
BrowserRouter
  ↓
App.jsx
  ↓
AppRoutes.jsx
  ↓
StartPage / LoginPage / NotFoundPage

Important decision:

main.jsx creates the React root.
App.jsx holds the app shell.
AppRoutes.jsx owns route definitions.
pages/ contains page-level screens.

This keeps your app clean as it grows.

## 4. Concepts Involved
### What routing means in a React single-page app

A normal website often works like this:

Click link → browser asks server for a new HTML page → full reload

A React single-page app works differently:

Click link → React Router changes the URL → React swaps the visible component

The browser does not reload the whole page.

That means the app feels faster and smoother.

### Why Electron apps can use React Router

Electron displays your React app inside a Chromium browser window.

So even though HelloStay is a desktop app, the React renderer still behaves like a web app inside Electron.

That means this is valid:

Electron window
  contains
React app
  uses
React Router

Electron does not need to understand /login, /rooms, or /dashboard.

Those are renderer routes.

### BrowserRouter

BrowserRouter gives React Router access to the browser history system.

It allows paths like:

/
 /login
 /dashboard

Current React Router documentation shows wrapping the app with <BrowserRouter> around your React application.

For HelloStay, we will use BrowserRouter because:

Vite dev server supports it
Electron loads the Vite app from localhost during development
It gives clean URLs
It is beginner-friendly
### Routes and Route

Routes is the container.

Route defines one mapping.

Example:

<Routes>
  <Route path="/" element={<StartPage />} />
  <Route path="/login" element={<LoginPage />} />
</Routes>

Meaning:

If URL is /        → show StartPage
If URL is /login   → show LoginPage
### Link

Link is React Router’s version of an anchor tag.

Instead of this:

<a href="/login">Go to Login</a>

we usually prefer:

<Link to="/login">Go to Login</Link>

React Router describes Link as a wrapper around <a> that enables client-side routing.

### useNavigate

useNavigate gives you a navigation function inside a component.

Example:

const navigate = useNavigate();

<button onClick={() => navigate("/login")}>
  Continue
</button>

React Router describes useNavigate as a hook that returns a function for programmatic navigation.

For this milestone, we will use useNavigate on the startup button because it teaches button-based navigation clearly.

## 5. Folder/File Changes

You will create these new folders:

src/routes/
src/pages/

You will create these new files:

### `src/routes/AppRoutes.jsx`
### `src/pages/StartPage.jsx`
### `src/pages/LoginPage.jsx`
### `src/pages/NotFoundPage.jsx`

You will update:

src/main.jsx
### `src/App.jsx`
### `src/styles/global.css`
## 6. Step-by-Step Explanation
### Step 1: Install React Router DOM

Run this from the frontend folder:

npm install react-router-dom

Meaning:

npm install

adds a package to your project.

react-router-dom

is the routing package commonly used in browser-based React apps.

Current React Router docs now show the unified react-router package for new apps, while react-router-dom remains available and re-exports React Router functionality for compatibility.

For your milestone wording and beginner learning path, using react-router-dom is fine.

Verification:

npm list react-router-dom

You should see the installed version.

### Step 2: Create the folders

Inside frontend/src, create:

routes
pages

Your structure should become:

src/
  App.jsx
  main.jsx
  routes/
  pages/
  styles/

Verification:

Make sure the folders are inside src, not beside it.

Correct:

frontend/src/routes
frontend/src/pages

Wrong:

frontend/routes
frontend/pages
### Step 3: Wrap the app with BrowserRouter

Update src/main.jsx.

import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App.jsx";
import "./styles/global.css";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);

Verification:

Run:

npm run dev

Open:

http://localhost:5173

The app should still load.

At this point, routing is installed but no routes are visible yet.

## 7. Implementation
### `src/App.jsx`
import AppRoutes from "./routes/AppRoutes.jsx";

function App() {
  return <AppRoutes />;
}

export default App;
### `src/routes/AppRoutes.jsx`
import { Route, Routes } from "react-router-dom";

import StartPage from "../pages/StartPage.jsx";
import LoginPage from "../pages/LoginPage.jsx";
import NotFoundPage from "../pages/NotFoundPage.jsx";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<StartPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default AppRoutes;
### `src/pages/StartPage.jsx`
import { useNavigate } from "react-router-dom";

function StartPage() {
  const navigate = useNavigate();

  function handleContinue() {
    navigate("/login");
  }

  return (
    <main className="page-center">
      <section className="welcome-card">
        <p className="eyebrow">HelloStay Desktop</p>

        <h1>Welcome to HelloStay</h1>

        <p className="page-description">
          A simple offline hotel management system for small and medium hotels,
          guest houses, lodges, and resorts.
        </p>

        <button className="primary-button" type="button" onClick={handleContinue}>
          Continue to Login
        </button>
      </section>
    </main>
  );
}

export default StartPage;
### `src/pages/LoginPage.jsx`
function LoginPage() {
  return (
    <main className="page-center">
      <section className="welcome-card">
        <p className="eyebrow">Login</p>

        <h1>Login Page</h1>

        <p className="page-description">
          This is only a placeholder. Real login forms, validation, token
          handling, and authentication will be added in a later milestone.
        </p>
      </section>
    </main>
  );
}

export default LoginPage;
### `src/pages/NotFoundPage.jsx`
import { Link } from "react-router-dom";

function NotFoundPage() {
  return (
    <main className="page-center">
      <section className="welcome-card">
        <p className="eyebrow">404</p>

        <h1>Page Not Found</h1>

        <p className="page-description">
          The page you are looking for does not exist.
        </p>

        <Link className="text-link" to="/">
          Go back to Start Page
        </Link>
      </section>
    </main>
  );
}

export default NotFoundPage;
### `src/styles/global.css`

Use this if you want a clean minimal style for Milestone 3:

* {
  box-sizing: border-box;
}

:root {
  font-family:
    Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI",
    sans-serif;
  color: #172033;
  background: #f6f7fb;
  font-synthesis: none;
  text-rendering: optimizeLegibility;
}

body {
  margin: 0;
  min-width: 320px;
  min-height: 100vh;
}

button,
input,
textarea,
select {
  font: inherit;
}

.page-center {
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 24px;
}

.welcome-card {
  width: min(100%, 720px);
  padding: 40px;
  border: 1px solid #e2e6ef;
  border-radius: 18px;
  background: #ffffff;
  box-shadow: 0 24px 60px rgba(15, 23, 42, 0.08);
}

.eyebrow {
  margin: 0 0 12px;
  color: #52607a;
  font-size: 0.82rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

h1 {
  margin: 0;
  font-size: clamp(2rem, 4vw, 3.5rem);
  line-height: 1.05;
}

.page-description {
  max-width: 560px;
  margin: 20px 0 28px;
  color: #52607a;
  font-size: 1.05rem;
  line-height: 1.7;
}

.primary-button {
  border: 0;
  border-radius: 12px;
  padding: 12px 18px;
  color: #ffffff;
  background: #172033;
  font-weight: 700;
  cursor: pointer;
}

.primary-button:hover {
  background: #26334d;
}

.text-link {
  color: #172033;
  font-weight: 700;
  text-decoration: none;
}

.text-link:hover {
  text-decoration: underline;
}
## 8. Code Walkthrough
main.jsx

This is the React entry point.

<BrowserRouter>
  <App />
</BrowserRouter>

This means every component inside App can use React Router features such as:

Routes
Route
### Link
### useNavigate

Without BrowserRouter, useNavigate and Link will not work correctly.

App.jsx
function App() {
  return <AppRoutes />;
}

App.jsx stays clean.

This is good architecture because App.jsx should not become a large file full of route definitions, layouts, API calls, and business logic.

AppRoutes.jsx
<Route path="/" element={<StartPage />} />

This says:

When the URL is /, render StartPage.
<Route path="/login" element={<LoginPage />} />

This says:

When the URL is /login, render LoginPage.
<Route path="*" element={<NotFoundPage />} />

This is the fallback route.

The * means:

Match anything that no previous route matched.
StartPage.jsx
const navigate = useNavigate();

This gives the component a navigation function.

navigate("/login");

This changes the current route to /login.

Important: this does not reload the whole app.

React Router changes the URL and renders the login page component.

LoginPage.jsx

This is intentionally only a placeholder.

No form.

No username.

No password.

No API call.

No token.

No localStorage.

That is correct for Milestone 3.

NotFoundPage.jsx
<Link to="/">Go back to Start Page</Link>

This teaches link-based navigation.

In this milestone:

StartPage uses useNavigate
NotFoundPage uses Link

That gives you experience with both navigation styles.

## 9. Debugging Tips
Error: useNavigate() may be used only in the context of a Router

Cause:

StartPage is using useNavigate, but your app is not wrapped in BrowserRouter.

Fix:

Check main.jsx:

<BrowserRouter>
  <App />
</BrowserRouter>
Error: Failed to resolve import "react-router-dom"

Cause:

The package is not installed.

Fix:

Run inside frontend:

npm install react-router-dom

Then restart the dev server.

### Blank screen

Open Browser DevTools and check the Console.

Common causes:

Wrong import path
Misspelled file name
File saved in wrong folder
Component not exported

Example mistake:

import StartPage from "../page/StartPage.jsx";

But folder is:

pages

Correct:

import StartPage from "../pages/StartPage.jsx";
### Electron window does not show route

For now, always test first in browser:

http://localhost:5173

Then test in Electron:

npm run desktop

If browser works but Electron does not, the issue is likely Electron startup or Vite loading, not React Router itself.

## 10. Common Mistakes
Mistake 1: Putting routes in Electron main process

Do not do this.

Electron main should not know:

/login
/dashboard
/rooms

React owns those.

Mistake 2: Building authentication too early

Do not add:

auth context
JWT storage
protected routes
login form
backend login API call
role checks

Those are later milestones.

Routing first. Authentication second.

Mistake 3: Creating dashboard routes now

Avoid this for Milestone 3:

<Route path="/dashboard" element={<Dashboard />} />

Why?

Because it tempts you to start layout, sidebar, protected routes, auth guards, and dashboard cards too early.

For now, only:

/
 /login
 *
Mistake 4: Using <a href="/login">

This causes browser-style navigation.

Prefer:

<Link to="/login">

or:

navigate("/login");
Mistake 5: Importing from mixed packages

Choose one style and stay consistent.

For this milestone, use:

import { BrowserRouter, Routes, Route, Link, useNavigate } from "react-router-dom";

Do not mix:

from "react-router"
from "react-router-dom"

in the same milestone.

## 11. Alternative Approaches
Approach A: BrowserRouter

Recommended for this milestone.

Pros:

Clean URLs
Easy to understand
Works well with Vite dev server
Common in React apps

Cons:

Needs correct server fallback in production
Electron packaged file loading may need care later
Approach B: HashRouter

Example URLs:

/#/
/#/login

Pros:

Often easier for file-based Electron production builds
No server fallback needed

Cons:

Less clean URLs
Looks less professional
Can hide routing problems during development

For now, use BrowserRouter.

Later, during Electron packaging, we can revisit whether production should use BrowserRouter, HashRouter, or a memory/data router based on how Electron loads the bundled React app.

Approach C: Data Router

React Router also supports data routers like createBrowserRouter.

Not needed yet.

Why?

Because Milestone 3 has no data loading, no forms, no backend integration, and no route-level loaders.

Keep it simple.

## 12. Industry Best Practices

For HelloStay, follow these rules:

Keep pages in pages/
Keep route definitions in routes/
Keep App.jsx small
Keep Electron separate
Do not put business logic in routes
Do not add auth guards before auth exists
Use clear route names
Use fallback routes early

A good production frontend grows like this:

Milestone 3:
Basic public routes

Later:
Auth routes

Later:
Protected routes

Later:
Dashboard layout

Later:
Feature routes

Later:
Role-based route access

This avoids building a confusing frontend too early.

## 13. Summary

Milestone 3 adds the first real navigation structure to HelloStay.

You will have:

/        Start page
/login   Login placeholder
*        Not found page

You learned:

What routing is
### Why Electron apps can use React Router
What BrowserRouter does
How Routes and Route map URLs to components
How Link navigates declaratively
How useNavigate navigates programmatically
Why routing belongs in React, not Electron main
Why authentication should wait

The most important architecture decision in this milestone is:

React renderer owns application routes.
Electron main process owns desktop lifecycle only.
FastAPI owns backend business logic only.
## 14. Suggested Next Step

Implement only the files above, then verify these three URLs:

http://localhost:5173/
http://localhost:5173/login
http://localhost:5173/random-page

After that, run the same flow through Electron with:

npm run desktop
Everything is working fine
Thought for a few seconds

Great. That means Milestone 3: Startup Flow and Routing is complete.

### Milestone 3 Completion Check

You now have:

/          → StartPage
/login     → LoginPage placeholder
*          → NotFoundPage

And these responsibilities are still cleanly separated:

React renderer:
- Pages
- Routing
- Navigation
- UI flow

Electron main process:
- Desktop window
- App lifecycle
- Loading the React app

FastAPI backend:
- Business logic
- Validation
- Database
- API contracts

Most importantly, you did not accidentally add:

Real authentication
Backend API calls
Dashboard layout
Protected routes
Hotel feature screens
Electron backend startup
Packaging logic

That is exactly correct for this milestone.

### What You Learned in Milestone 3

You now understand the first layer of frontend app structure:

main.jsx
  wraps the app with BrowserRouter

App.jsx
  keeps the app clean and delegates routing

AppRoutes.jsx
  owns route definitions

pages/
  contains screen-level UI components

This is a professional pattern because it prevents App.jsx from becoming messy as the app grows.

### Milestone 3 Status
Status: Completed
Frontend milestone: 3
Topic: Startup Flow and Routing
Result: Success
