# Milestone 8 Structured Notes — React Routing & Dashboard Layout

## 1. Milestone Focus

Milestone 8 focuses only on **React routing and dashboard layout**.

The backend files confirm that future modules already have boundaries, but this milestone does **not** call backend APIs.

### Key Design Decision

`/dashboard` becomes the **parent route**.

The following routes become **child routes** rendered inside the dashboard shell:

- `/dashboard/rooms`
- `/dashboard/guests`
- `/dashboard/stays`
- `/dashboard/finance`
- `/dashboard/history`

---

## 2. Objective

Milestone 8 creates the dashboard application shell for **HelloStay**.

This milestone does **not** build hotel features yet. It only creates the protected desktop-style layout that future modules will live inside.

### Expected Routes

```text
/login
/dashboard
/dashboard/rooms
/dashboard/guests
/dashboard/stays
/dashboard/finance
/dashboard/history
```

### Authentication Requirement

Only authenticated users should access:

```text
/dashboard/*
```

### Backend Alignment

The backend already has future module boundaries for:

- Rooms
- Guests
- Stays
- Guest-stays

Existing backend route directions include:

```text
/rooms
/guests
/stay
/guest-stays
```

The frontend placeholders are aligned with this backend direction.

---

## 3. Problem Analysis

Until now, the protected area was only a temporary placeholder page.

That was enough to test authentication, but it is not enough for a real desktop app.

A hotel management system needs a stable structure:

```text
Dashboard shell
├── Sidebar navigation
├── Top header
└── Changing page content
```

### Bad Approach

A common beginner mistake is putting sidebar and header code inside every page.

```text
RoomsPage
├── Sidebar
├── Header
└── Rooms content

GuestsPage
├── Sidebar again
├── Header again
└── Guests content
```

This creates duplication and makes future changes harder.

### Correct Approach

The layout should stay fixed, while only the inner page changes.

```text
DashboardLayout
├── Sidebar
├── Header
└── Outlet
    ├── DashboardHome
    ├── RoomsPage
    ├── GuestsPage
    ├── StaysPage
    ├── FinancePage
    └── HistoryPage
```

---

## 4. High-Level Design

Create the dashboard shell:

```text
src/layouts/DashboardLayout.jsx
```

Create placeholder pages:

```text
src/pages/DashboardHome.jsx
src/pages/RoomsPage.jsx
src/pages/GuestsPage.jsx
src/pages/StaysPage.jsx
src/pages/FinancePage.jsx
src/pages/HistoryPage.jsx
```

Update the routing file:

```text
src/routes/AppRoutes.jsx
```

### Route Structure

```text
/dashboard
├── index route        → DashboardHome
├── rooms             → RoomsPage
├── guests            → GuestsPage
├── stays             → StaysPage
├── finance           → FinancePage
└── history           → HistoryPage
```

---

## 5. Concepts Involved

### Application Shell

An application shell is the fixed outer structure of an app.

For HelloStay, the dashboard shell includes:

```text
Sidebar + Header + Main Content Area
```

The shell does not care whether the current page is rooms, guests, finance, or history.

It only provides the frame.

This is especially useful in Electron because desktop apps usually feel like one stable window where the inner content changes.

---

### Nested Routes

Nested routes mean one route lives inside another route.

Example:

```text
/dashboard/rooms
```

This means:

```text
/dashboard        parent route
rooms             child route
```

The parent route renders the layout.

The child route renders inside that layout.

---

### Outlet

`Outlet` is a React Router component.

It marks the place where child route content should appear.

Example:

```jsx
<main>
  <Outlet />
</main>
```

If the user visits:

```text
/dashboard/rooms
```

React Router places `RoomsPage` inside the `Outlet`.

---

### NavLink

`NavLink` is like `Link`, but smarter.

`Link` only navigates:

```jsx
<Link to="/dashboard/rooms">Rooms</Link>
```

`NavLink` navigates and also knows whether the link is currently active:

```jsx
<NavLink to="/dashboard/rooms">
  Rooms
</NavLink>
```

This allows active sidebar styling.

---

### Link vs NavLink

| Component | Purpose |
|---|---|
| `Link` | Use when you only need navigation |
| `NavLink` | Use when you need navigation plus active styling |

For sidebar menus, `NavLink` is the better choice.

---

## 6. Folder and File Changes

### Create Folder

```text
frontend/src/layouts/
```

### Create Files

```text
frontend/src/layouts/DashboardLayout.jsx

frontend/src/pages/DashboardHome.jsx
frontend/src/pages/RoomsPage.jsx
frontend/src/pages/GuestsPage.jsx
frontend/src/pages/StaysPage.jsx
frontend/src/pages/FinancePage.jsx
frontend/src/pages/HistoryPage.jsx
```

### Modify Files

```text
frontend/src/routes/AppRoutes.jsx
frontend/src/styles/global.css
```

---

## 7. Step-by-Step Implementation

## Step 1: Create the Layout Folder

From inside the `frontend` folder, run:

```bash
mkdir src/layouts
```

This creates a dedicated place for layout components.

A layout is not a page.

A page represents a route.

A layout represents the common structure around multiple routes.

---

## Step 2: Create `DashboardLayout.jsx`

Create:

```text
frontend/src/layouts/DashboardLayout.jsx
```

Add:

```jsx
import { NavLink, Outlet, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext.jsx";

const navigationItems = [
  {
    label: "Dashboard",
    to: "/dashboard",
    end: true,
  },
  {
    label: "Rooms",
    to: "/dashboard/rooms",
  },
  {
    label: "Guests",
    to: "/dashboard/guests",
  },
  {
    label: "Stays",
    to: "/dashboard/stays",
  },
  {
    label: "Finance",
    to: "/dashboard/finance",
  },
  {
    label: "History",
    to: "/dashboard/history",
  },
];

function DashboardLayout() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login", { replace: true });
  }

  return (
    <div className="dashboard-shell">
      <aside className="dashboard-sidebar">
        <div className="dashboard-brand">
          <span className="dashboard-brand-mark">H</span>
          <div>
            <p className="dashboard-brand-name">HelloStay</p>
            <p className="dashboard-brand-subtitle">Hotel Management</p>
          </div>
        </div>

        <nav className="dashboard-nav" aria-label="Dashboard navigation">
          {navigationItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                isActive
                  ? "dashboard-nav-link dashboard-nav-link-active"
                  : "dashboard-nav-link"
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="dashboard-sidebar-footer">
          <p className="dashboard-user-label">Signed in as</p>
          <p className="dashboard-user-name">
            {user?.username || "HelloStay User"}
          </p>

          <button
            type="button"
            className="dashboard-logout-button"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </aside>

      <div className="dashboard-main-area">
        <header className="dashboard-topbar">
          <div>
            <p className="dashboard-topbar-label">Offline Desktop App</p>
            <h1 className="dashboard-topbar-title">Dashboard</h1>
          </div>

          <p className="dashboard-topbar-status">Local system ready</p>
        </header>

        <main className="dashboard-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;
```

### Verification After Step 2

Nothing will appear yet unless the route is connected.

Run:

```bash
npm run dev
```

If Vite says:

```text
Failed to resolve import "../context/AuthContext.jsx"
```

check the file name and path from Milestone 7.

---

## Step 3: Create `DashboardHome.jsx`

Create:

```text
frontend/src/pages/DashboardHome.jsx
```

Add:

```jsx
function DashboardHome() {
  return (
    <section className="dashboard-page">
      <div className="dashboard-page-header">
        <div>
          <p className="dashboard-page-eyebrow">Overview</p>
          <h2 className="dashboard-page-title">Dashboard Home</h2>
        </div>

        <p className="dashboard-page-description">
          This is the future overview screen for hotel activity, occupancy,
          income, and daily operations.
        </p>
      </div>

      <div className="dashboard-placeholder-grid">
        <article className="dashboard-placeholder-card">
          <h3>Rooms Summary</h3>
          <p>Room metrics will be added in a future milestone.</p>
        </article>

        <article className="dashboard-placeholder-card">
          <h3>Guest Activity</h3>
          <p>Guest check-in and stay activity will appear here later.</p>
        </article>

        <article className="dashboard-placeholder-card">
          <h3>Finance Snapshot</h3>
          <p>Income and payment summaries will be added later.</p>
        </article>
      </div>
    </section>
  );
}

export default DashboardHome;
```

This page is intentionally simple.

It includes:

- No charts
- No API calls
- No metrics yet

---

## Step 4: Create Module Placeholder Pages

### `RoomsPage.jsx`

Create:

```text
frontend/src/pages/RoomsPage.jsx
```

Add:

```jsx
function RoomsPage() {
  return (
    <section className="dashboard-page">
      <div className="dashboard-page-header">
        <div>
          <p className="dashboard-page-eyebrow">Rooms</p>
          <h2 className="dashboard-page-title">Rooms</h2>
        </div>

        <p className="dashboard-page-description">
          Room listing, room creation, room editing, and room status management
          will be built in a future milestone.
        </p>
      </div>

      <article className="dashboard-placeholder-card">
        <h3>Rooms module placeholder</h3>
        <p>No room API calls, tables, forms, or CRUD logic are added yet.</p>
      </article>
    </section>
  );
}

export default RoomsPage;
```

---

### `GuestsPage.jsx`

Create:

```text
frontend/src/pages/GuestsPage.jsx
```

Add:

```jsx
function GuestsPage() {
  return (
    <section className="dashboard-page">
      <div className="dashboard-page-header">
        <div>
          <p className="dashboard-page-eyebrow">Guests</p>
          <h2 className="dashboard-page-title">Guests</h2>
        </div>

        <p className="dashboard-page-description">
          Guest profiles, guest creation, guest editing, and guest history will
          be built in a future milestone.
        </p>
      </div>

      <article className="dashboard-placeholder-card">
        <h3>Guests module placeholder</h3>
        <p>No guest API calls, forms, search, filters, or CRUD logic are added yet.</p>
      </article>
    </section>
  );
}

export default GuestsPage;
```

---

### `StaysPage.jsx`

Create:

```text
frontend/src/pages/StaysPage.jsx
```

Add:

```jsx
function StaysPage() {
  return (
    <section className="dashboard-page">
      <div className="dashboard-page-header">
        <div>
          <p className="dashboard-page-eyebrow">Stays</p>
          <h2 className="dashboard-page-title">Stays</h2>
        </div>

        <p className="dashboard-page-description">
          Check-in, check-out, room assignment, and guest-stay workflows will be
          built in a future milestone.
        </p>
      </div>

      <article className="dashboard-placeholder-card">
        <h3>Stays module placeholder</h3>
        <p>No booking, stay, guest-stay, billing, or checkout logic is added yet.</p>
      </article>
    </section>
  );
}

export default StaysPage;
```

---

### `FinancePage.jsx`

Create:

```text
frontend/src/pages/FinancePage.jsx
```

Add:

```jsx
function FinancePage() {
  return (
    <section className="dashboard-page">
      <div className="dashboard-page-header">
        <div>
          <p className="dashboard-page-eyebrow">Finance</p>
          <h2 className="dashboard-page-title">Finance</h2>
        </div>

        <p className="dashboard-page-description">
          Income summaries, payments, billing, and financial reports will be
          built in a future milestone.
        </p>
      </div>

      <article className="dashboard-placeholder-card">
        <h3>Finance module placeholder</h3>
        <p>No charts, totals, reports, or backend finance calls are added yet.</p>
      </article>
    </section>
  );
}

export default FinancePage;
```

---

### `HistoryPage.jsx`

Create:

```text
frontend/src/pages/HistoryPage.jsx
```

Add:

```jsx
function HistoryPage() {
  return (
    <section className="dashboard-page">
      <div className="dashboard-page-header">
        <div>
          <p className="dashboard-page-eyebrow">History</p>
          <h2 className="dashboard-page-title">History</h2>
        </div>

        <p className="dashboard-page-description">
          Past stays, guest activity, room activity, and financial history will
          be built in a future milestone.
        </p>
      </div>

      <article className="dashboard-placeholder-card">
        <h3>History module placeholder</h3>
        <p>No timeline, filters, reports, or historical API logic is added yet.</p>
      </article>
    </section>
  );
}

export default HistoryPage;
```

---

## Step 5: Update `AppRoutes.jsx`

Open:

```text
frontend/src/routes/AppRoutes.jsx
```

Use this structure.

If `RegisterPage.jsx` exists, keep the register import and route.

If it does not exist, do not import it.

```jsx
import { Route, Routes } from "react-router-dom";

import DashboardLayout from "../layouts/DashboardLayout.jsx";
import DashboardHome from "../pages/DashboardHome.jsx";
import FinancePage from "../pages/FinancePage.jsx";
import GuestsPage from "../pages/GuestsPage.jsx";
import HistoryPage from "../pages/HistoryPage.jsx";
import LoginPage from "../pages/LoginPage.jsx";
import NotFoundPage from "../pages/NotFoundPage.jsx";
import RoomsPage from "../pages/RoomsPage.jsx";
import StartPage from "../pages/StartPage.jsx";
import StaysPage from "../pages/StaysPage.jsx";
import ProtectedRoute from "./ProtectedRoute.jsx";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<StartPage />} />
      <Route path="/login" element={<LoginPage />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardHome />} />
        <Route path="rooms" element={<RoomsPage />} />
        <Route path="guests" element={<GuestsPage />} />
        <Route path="stays" element={<StaysPage />} />
        <Route path="finance" element={<FinancePage />} />
        <Route path="history" element={<HistoryPage />} />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default AppRoutes;
```

### Important Routing Detail

This index route:

```jsx
<Route index element={<DashboardHome />} />
```

means:

```text
/dashboard → DashboardHome
```

This child route:

```jsx
<Route path="rooms" element={<RoomsPage />} />
```

means:

```text
/dashboard/rooms → RoomsPage
```

Do **not** write this inside the dashboard parent route:

```jsx
<Route path="/dashboard/rooms" element={<RoomsPage />} />
```

Child paths should usually be relative.

---

## Step 6: Add Dashboard CSS

Open:

```text
frontend/src/styles/global.css
```

Append this CSS at the bottom.

Do not delete existing Milestone 4 CSS.

```css
.dashboard-shell {
  min-height: 100vh;
  display: grid;
  grid-template-columns: 260px 1fr;
  background: var(--color-background, #f6f7fb);
  color: var(--color-text, #172033);
}

.dashboard-sidebar {
  min-height: 100vh;
  padding: 24px 18px;
  background: #ffffff;
  border-right: 1px solid #e5e7eb;
  display: flex;
  flex-direction: column;
}

.dashboard-brand {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 0 8px 24px;
  border-bottom: 1px solid #eef0f4;
}

.dashboard-brand-mark {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  display: grid;
  place-items: center;
  background: var(--color-primary, #2563eb);
  color: #ffffff;
  font-weight: 700;
}

.dashboard-brand-name {
  margin: 0;
  font-weight: 700;
  color: #111827;
}

.dashboard-brand-subtitle {
  margin: 4px 0 0;
  font-size: 13px;
  color: #6b7280;
}

.dashboard-nav {
  display: grid;
  gap: 6px;
  margin-top: 24px;
}

.dashboard-nav-link {
  display: block;
  padding: 11px 12px;
  border-radius: 10px;
  color: #4b5563;
  text-decoration: none;
  font-weight: 500;
}

.dashboard-nav-link:hover {
  background: #f3f4f6;
  color: #111827;
}

.dashboard-nav-link-active {
  background: #eef4ff;
  color: var(--color-primary, #2563eb);
}

.dashboard-sidebar-footer {
  margin-top: auto;
  padding: 18px 8px 0;
  border-top: 1px solid #eef0f4;
}

.dashboard-user-label {
  margin: 0;
  font-size: 12px;
  color: #6b7280;
}

.dashboard-user-name {
  margin: 4px 0 14px;
  font-weight: 600;
  color: #111827;
}

.dashboard-logout-button {
  width: 100%;
  border: 1px solid #d1d5db;
  background: #ffffff;
  color: #111827;
  border-radius: 10px;
  padding: 10px 12px;
  cursor: pointer;
  font-weight: 600;
}

.dashboard-logout-button:hover {
  background: #f9fafb;
}

.dashboard-main-area {
  min-width: 0;
  display: flex;
  flex-direction: column;
}

.dashboard-topbar {
  height: 76px;
  padding: 0 32px;
  background: #ffffff;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.dashboard-topbar-label {
  margin: 0;
  font-size: 13px;
  color: #6b7280;
}

.dashboard-topbar-title {
  margin: 4px 0 0;
  font-size: 22px;
  color: #111827;
}

.dashboard-topbar-status {
  margin: 0;
  font-size: 14px;
  color: #047857;
  font-weight: 600;
}

.dashboard-content {
  padding: 32px;
  overflow: auto;
}

.dashboard-page {
  display: grid;
  gap: 24px;
}

.dashboard-page-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 24px;
}

.dashboard-page-eyebrow {
  margin: 0;
  font-size: 13px;
  font-weight: 700;
  color: var(--color-primary, #2563eb);
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.dashboard-page-title {
  margin: 6px 0 0;
  font-size: 28px;
  color: #111827;
}

.dashboard-page-description {
  max-width: 520px;
  margin: 0;
  color: #6b7280;
  line-height: 1.6;
}

.dashboard-placeholder-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 18px;
}

.dashboard-placeholder-card {
  padding: 24px;
  border-radius: 16px;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  box-shadow: 0 12px 30px rgba(15, 23, 42, 0.04);
}

.dashboard-placeholder-card h3 {
  margin: 0 0 8px;
  color: #111827;
}

.dashboard-placeholder-card p {
  margin: 0;
  color: #6b7280;
  line-height: 1.6;
}
```

---

## 8. Implementation Testing

After creating the files and CSS, run:

```bash
npm run dev
```

Then test these paths:

```text
http://localhost:5173/dashboard
http://localhost:5173/dashboard/rooms
http://localhost:5173/dashboard/guests
http://localhost:5173/dashboard/stays
http://localhost:5173/dashboard/finance
http://localhost:5173/dashboard/history
```

### Expected Behavior

| Test | Expected Result |
|---|---|
| Not logged in and visit `/dashboard` | Redirected to login |
| Logged in and visit `/dashboard` | Dashboard layout appears |
| Click Rooms | Main area changes to Rooms placeholder |
| Click Guests | Main area changes to Guests placeholder |
| Click Stays | Main area changes to Stays placeholder |
| Active sidebar link | Current page link is highlighted |
| Click Logout | Auth state clears and user returns to login |

---

## 9. Code Walkthrough

## `DashboardLayout.jsx`

This is the most important file in Milestone 8.

### Navigation Items

```jsx
const navigationItems = [...]
```

This array stores sidebar links as data.

That is better than writing every link manually because later you can add icons, permissions, or feature flags in one place.

### Active Navigation Link

```jsx
<NavLink
  className={({ isActive }) =>
    isActive
      ? "dashboard-nav-link dashboard-nav-link-active"
      : "dashboard-nav-link"
  }
>
```

`NavLink` gives access to `isActive`.

If the current URL matches the link, the active class is applied.

### Outlet

```jsx
<Outlet />
```

This is where child pages appear.

Example:

```text
/dashboard/rooms
```

React Router renders:

```text
DashboardLayout
└── Outlet
    └── RoomsPage
```

---

## `AppRoutes.jsx`

This section protects the dashboard layout:

```jsx
<Route
  path="/dashboard"
  element={
    <ProtectedRoute>
      <DashboardLayout />
    </ProtectedRoute>
  }
>
```

All child routes inside the protected parent route are also protected:

```text
/dashboard/rooms
/dashboard/guests
/dashboard/stays
/dashboard/finance
/dashboard/history
```

---

## Placeholder Pages

The placeholder pages are intentionally simple.

They prove that:

- Routing works
- Layout works
- Navigation works
- Protection works
- Module boundaries are ready

They do **not** add:

- Tables
- Forms
- API calls
- Modals
- Charts
- Business rules

---

# 10. Errors and Debugging Section

This section is separated as requested.

## Error 1: `useAuth is not a function`

### Likely Cause

`AuthContext.jsx` does not export a `useAuth` hook, or the hook name is different.

### Fix

Check `AuthContext.jsx`.

It should have something like:

```jsx
export function useAuth() {
  return useContext(AuthContext);
}
```

If your hook has a different name, either:

- Rename it to `useAuth`
- Or update the import in `DashboardLayout.jsx`

---

## Error 2: `Cannot destructure property 'logout' of useAuth(...)`

### Likely Cause

`AuthContext` is not providing `logout`.

### Fix

Go back to Milestone 7 and confirm the provider value includes `logout`.

Example:

```jsx
<AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
```

---

## Error 3: Child Pages Do Not Appear

### Likely Cause

`DashboardLayout.jsx` does not contain `Outlet`.

### Fix

Make sure `DashboardLayout.jsx` contains:

```jsx
<Outlet />
```

Without `Outlet`, nested routes have nowhere to render.

---

## Error 4: `/dashboard/rooms` Shows `NotFoundPage`

### Likely Cause

Route nesting is incorrect.

### Fix

Inside the `/dashboard` parent route, child paths should be relative:

```jsx
<Route path="rooms" element={<RoomsPage />} />
```

Do not write:

```jsx
<Route path="/dashboard/rooms" element={<RoomsPage />} />
```

inside the dashboard parent route.

---

## Error 5: Active Link Styling Does Not Work for Dashboard

### Likely Cause

The dashboard home link is matching child routes too broadly.

### Fix

Make sure the dashboard home navigation item uses:

```jsx
end: true
```

Also make sure `NavLink` receives it:

```jsx
<NavLink end={item.end} />
```

Without `end`, the dashboard link may stay active even when the user is on:

```text
/dashboard/rooms
```

---

## Error Note

The provided text mentions:

```text
I have got this error
```

However, no specific runtime error message or stack trace was included after that line.

The error section above includes the debugging cases explicitly mentioned in the source text.

---

## 11. Common Mistakes

### Mistake 1: Putting Sidebar and Header Inside Every Page

This creates duplicated layout code and makes future changes painful.

The correct approach is to keep sidebar and header inside `DashboardLayout`.

---

### Mistake 2: Building Real Room or Guest Logic Too Early

At this stage, routes and layout are the goal.

Do not add:

- Room tables
- Guest forms
- API calls
- CRUD logic
- Business workflows

---

### Mistake 3: Putting Dashboard Navigation Inside Electron

Electron should open and manage the desktop window.

React should control the UI inside that window.

Electron should handle:

- App window
- Lifecycle
- Preload security
- Packaging

React Router should handle:

- Renderer navigation
- Dashboard routes
- Page rendering

---

### Mistake 4: Forgetting Child Routes Are Relative

Inside `/dashboard`, use:

```jsx
<Route path="rooms" element={<RoomsPage />} />
```

Do not use:

```jsx
<Route path="/dashboard/rooms" element={<RoomsPage />} />
```

---

## 12. Alternative Approaches

## Approach 1: Separate Dashboard Routes Without Nested Routes

Example:

```jsx
<Route path="/dashboard" element={<DashboardPage />} />
<Route path="/dashboard/rooms" element={<RoomsPage />} />
<Route path="/dashboard/guests" element={<GuestsPage />} />
```

### Problem

Each page would need its own layout wrapper, or sidebar/header logic would be repeated.

### Recommendation

Not recommended.

---

## Approach 2: Nested Routes with `DashboardLayout`

This is the approach used in Milestone 8.

### Benefits

- Clean
- Scalable
- Production-friendly
- Avoids duplicated layout code
- Keeps module pages focused

### Recommendation

Recommended for HelloStay.

---

## Approach 3: Electron-Level Navigation

### Problem

Electron should not manage hotel pages.

Electron should manage desktop concerns only.

### Recommendation

Not recommended.

---

## 13. Industry Best Practices

- Keep layouts separate from pages.
- Keep routes centralized in `AppRoutes.jsx`.
- Use `NavLink` for sidebar navigation.
- Use `Outlet` for nested route rendering.
- Keep placeholder pages simple until real module milestones begin.
- Keep the Electron main process free from dashboard logic.
- Keep FastAPI as the source of truth for hotel workflows and business validation.

---

## 14. Summary

Milestone 8 creates the protected dashboard shell.

The final structure is:

```text
DashboardLayout
├── Sidebar
├── Header
└── Main content Outlet
```

The placeholder pages are:

```text
DashboardHome
RoomsPage
GuestsPage
StaysPage
FinancePage
HistoryPage
```

No hotel feature logic was added.

That is correct for this milestone.

This milestone prepares the structure for future rooms, guests, stays, finance, and history modules without mixing concerns too early.

---

## 15. Suggested Next Step

Implement Milestone 8 exactly as described.

Then verify:

- Login protection
- Sidebar navigation
- Active link styling
- Logout behavior
- All dashboard child routes

After this works, the next milestone should be:

```text
Milestone 9: Rooms Module Read-Only Foundation
```

In Milestone 9, you can begin with a simple rooms list page before adding create, edit, and delete logic.
