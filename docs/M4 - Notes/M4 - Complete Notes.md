# M4 - Complete Notes

## 1. Objective

Milestone 4 is about creating the visual foundation of HelloStay’s React renderer.

We are not building hotel features yet. We are creating the small reusable UI building blocks that future pages will use.

### Required Files by the End of This Milestone

```text
frontend/src/components/ui/Button.jsx
frontend/src/components/ui/Input.jsx
frontend/src/components/ui/Card.jsx
frontend/src/components/ui/Loading.jsx
frontend/src/components/ui/ErrorMessage.jsx
frontend/src/styles/global.css
```

### Existing Placeholder Pages That Will Use These Components Lightly

```text
frontend/src/pages/StartPage.jsx
frontend/src/pages/LoginPage.jsx
frontend/src/pages/NotFoundPage.jsx
```

### Goal

The goal is not to make the app visually perfect.

The goal is to create a clean, understandable, reusable foundation.

---

## 2. Problem Analysis

Right now, after Milestone 3, your app likely has pages such as:

```text
StartPage
LoginPage
NotFoundPage
```

Each page probably has its own simple HTML and maybe repeated styles.

That is okay at the beginning, but as HelloStay grows, repeated UI code becomes a problem.

### Repeated UI Code Example

Many future screens will need elements such as:

```jsx
<button>Save</button>
<input />
<div className="card">...</div>
<p className="error">Something went wrong</p>
```

If every page writes these differently, the app becomes inconsistent.

### Reusable UI Components for Milestone 4

In Milestone 4, we create small reusable UI components.

| Component | Purpose |
|---|---|
| Button | Reusable button styling |
| Input | Reusable input field styling |
| Card | Reusable white panel/container |
| Loading | Reusable loading message |
| ErrorMessage | Reusable error text |
| optional PageShell | Simple page wrapper if useful |

### Responsibility Reminder

These components belong in React, not Electron.

Electron gives us the desktop window. React renders the UI inside that window.

---

## 3. High-Level Design

### Target Folder Structure

The structure should look like this:

```text
frontend/
  src/
    components/
      ui/
        Button.jsx
        Input.jsx
        Card.jsx
        Loading.jsx
        ErrorMessage.jsx

    pages/
      StartPage.jsx
      LoginPage.jsx
      NotFoundPage.jsx

    routes/
      AppRoutes.jsx

    styles/
      global.css
```

### Design Direction

```text
React renderer
  ├── pages
  │   ├── StartPage
  │   ├── LoginPage
  │   └── NotFoundPage
  │
  ├── reusable UI components
  │   ├── Button
  │   ├── Input
  │   ├── Card
  │   ├── Loading
  │   └── ErrorMessage
  │
  └── global CSS foundation
      ├── CSS variables
      ├── base reset
      ├── layout helpers
      └── component classes
```

### Important Boundary

No dashboard shell yet.

### Why No Dashboard Shell Yet?

Dashboard layout means sidebar, topbar, authenticated routes, app navigation, and protected screens.

That belongs to a later milestone after authentication and app structure are clearer.

---

## 4. Concepts Involved

### What Is a Design System?

A design system is a collection of reusable visual rules and UI parts.

Examples include:

- Colors
- Spacing
- Font sizes
- Border radius
- Button styles
- Input styles
- Card styles
- Error styles
- Loading styles

Instead of randomly choosing colors and spacing on every page, we define common values once.

A beginner mistake is thinking a design system means a huge complex setup. It does not.

For HelloStay, the Milestone 4 design system is only:

```css
:root {
  --color-primary: #2563eb;
  --color-bg: #f6f7fb;
  --radius-md: 12px;
  --space-md: 16px;
}
```

That is already the beginning of a design system.

### What Are CSS Variables?

CSS variables are reusable values in CSS.

Example:

```css
:root {
  --color-primary: #2563eb;
}
```

Then later:

```css
.button {
  background: var(--color-primary);
}
```

### Why CSS Variables Help

If you change the primary color later, you change it in one place.

Without variables, you might write this everywhere:

```css
background: #2563eb;
```

That creates duplication.

### What Are Reusable UI Components?

A reusable UI component is a small React component that can be used in many places.

Instead of writing this on every page:

```jsx
<button className="primary-button">Login</button>
```

We create:

```jsx
<Button>Login</Button>
```

The Button component hides the styling details.

This makes future pages cleaner.

### Page Components vs UI Components

A page component represents a full screen.

Examples:

```text
StartPage
LoginPage
NotFoundPage
```

A UI component is a small reusable part of the interface.

Examples:

```text
Button
Input
Card
Loading
ErrorMessage
```

So:

| Type | Meaning |
|---|---|
| Page | Screen |
| UI component | Small building block |

### What Are Props?

Props are values passed from a parent component to a child component.

Example:

```jsx
<Button variant="primary">Continue</Button>
```

Here:

| Item | Meaning |
|---|---|
| `variant` | prop |
| `"primary"` | prop value |
| `Continue` | children prop |

Inside `Button.jsx`, React receives those values.

### What Is `children`?

`children` means whatever you put between an opening and closing component tag.

Example:

```jsx
<Card>
  <h1>HelloStay</h1>
  <p>Offline hotel management system</p>
</Card>
```

Inside `Card`, this content is available as:

```jsx
children
```

So `Card` can wrap any content.

### What Is `className`?

In normal HTML, we write:

```html
<button class="btn">Click</button>
```

In React JSX, we write:

```jsx
<button className="btn">Click</button>
```

Why?

Because `class` is a reserved word in JavaScript. JSX uses `className` instead.

---

## 5. Folder/File Changes

### Create This Folder

```text
frontend/src/components/ui/
```

### Create These Files

```text
Button.jsx
Input.jsx
Card.jsx
Loading.jsx
ErrorMessage.jsx
```

### Modify These Existing Files

```text
frontend/src/styles/global.css
frontend/src/pages/StartPage.jsx
frontend/src/pages/LoginPage.jsx
frontend/src/pages/NotFoundPage.jsx
```

### No Changes Needed In

```text
electron/
routes/AppRoutes.jsx
backend/
```

### Layer Responsibilities

Electron remains responsible for the desktop shell only.

React remains responsible for visual UI.

FastAPI remains responsible for business logic and API behavior.

---

## 6. Step-by-Step Explanation

### Step 1: Improve `global.css`

This file should contain:

1. CSS variables
2. Base reset
3. Body styling
4. Reusable utility classes
5. Simple component classes

We are keeping CSS simple.

No Tailwind.

No UI library.

No animation library.

That is the correct decision for this milestone because you are learning fundamentals.

### Step 2: Create `Button`

The button should support basic variants:

```text
primary
secondary
ghost
```

This teaches props.

Example usage:

```jsx
<Button variant="primary">Continue</Button>
<Button variant="secondary">Cancel</Button>
```

### Step 3: Create `Input`

The input should support:

```text
label
error
helperText
```

This prepares us for login forms later, but we are not building real authentication yet.

### Step 4: Create `Card`

A card is a reusable content container.

Example:

```jsx
<Card>
  <h1>HelloStay</h1>
  <p>Welcome to the app</p>
</Card>
```

### Step 5: Create `Loading`

Future API screens will need loading states.

For now, it is just a simple reusable message.

### Step 6: Create `ErrorMessage`

Future forms and API screens will need error states.

For now, it is just a reusable error text component.

### Step 7: Apply Components Lightly to Placeholder Pages

We only improve current pages visually.

We do not add:

```text
real login
backend calls
protected routes
dashboard
hotel modules
```

---

## 7. Implementation

### `frontend/src/styles/global.css`

Replace or reorganize your current `global.css` like this:

```css
/* =========================
   HelloStay Global Styles
   Milestone 4: UI Foundation
   ========================= */

/* 
  CSS variables are reusable design values.
  They help us avoid repeating colors, spacing, and sizes everywhere.
*/
:root {
  --color-bg: #f6f7fb;
  --color-surface: #ffffff;
  --color-text: #172033;
  --color-text-muted: #64748b;

  --color-primary: #2563eb;
  --color-primary-hover: #1d4ed8;

  --color-border: #d9e0ec;
  --color-error: #dc2626;
  --color-error-bg: #fef2f2;

  --shadow-sm: 0 1px 3px rgba(15, 23, 42, 0.08);
  --shadow-md: 0 10px 30px rgba(15, 23, 42, 0.08);

  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 18px;

  --space-xs: 6px;
  --space-sm: 10px;
  --space-md: 16px;
  --space-lg: 24px;
  --space-xl: 40px;

  --font-family-base:
    Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI",
    sans-serif;
}

/* 
  box-sizing: border-box makes sizing easier.
  Padding and border are included inside the element's width.
*/
* {
  box-sizing: border-box;
}

html {
  min-width: 320px;
  min-height: 100%;
}

body {
  margin: 0;
  min-width: 320px;
  min-height: 100vh;
  font-family: var(--font-family-base);
  color: var(--color-text);
  background: var(--color-bg);
  font-synthesis: none;
  text-rendering: optimizeLegibility;
}

button,
input,
textarea,
select {
  font: inherit;
}

a {
  color: inherit;
}

/* =========================
   Page Layout Helpers
   ========================= */

.page-center {
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: var(--space-lg);
}

.page-stack {
  width: min(100%, 720px);
  display: grid;
  gap: var(--space-md);
}

.page-title {
  margin: 0;
  font-size: 2rem;
  line-height: 1.2;
}

.page-description {
  margin: 0;
  color: var(--color-text-muted);
  line-height: 1.6;
}

/* =========================
   UI Components
   ========================= */

.ui-card {
  width: 100%;
  padding: var(--space-xl);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
}

.ui-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 42px;
  padding: 0 var(--space-md);
  border: 1px solid transparent;
  border-radius: var(--radius-sm);
  font-weight: 600;
  cursor: pointer;
  transition:
    background-color 140ms ease,
    border-color 140ms ease,
    color 140ms ease,
    transform 140ms ease;
}

.ui-button:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

.ui-button:not(:disabled):active {
  transform: translateY(1px);
}

.ui-button--primary {
  color: #ffffff;
  background: var(--color-primary);
}

.ui-button--primary:hover {
  background: var(--color-primary-hover);
}

.ui-button--secondary {
  color: var(--color-text);
  background: var(--color-surface);
  border-color: var(--color-border);
}

.ui-button--secondary:hover {
  background: #f8fafc;
}

.ui-button--ghost {
  color: var(--color-primary);
  background: transparent;
}

.ui-button--ghost:hover {
  background: #eff6ff;
}

.ui-input-group {
  display: grid;
  gap: var(--space-xs);
}

.ui-label {
  font-size: 0.9rem;
  font-weight: 600;
}

.ui-input {
  width: 100%;
  min-height: 42px;
  padding: 0 var(--space-md);
  color: var(--color-text);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  outline: none;
}

.ui-input:focus {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.12);
}

.ui-input--error {
  border-color: var(--color-error);
}

.ui-helper-text {
  margin: 0;
  font-size: 0.85rem;
  color: var(--color-text-muted);
}

.ui-error-message {
  margin: 0;
  padding: var(--space-sm) var(--space-md);
  color: var(--color-error);
  background: var(--color-error-bg);
  border: 1px solid rgba(220, 38, 38, 0.2);
  border-radius: var(--radius-sm);
  line-height: 1.5;
}

.ui-loading {
  color: var(--color-text-muted);
  font-weight: 500;
}
```

#### Verification

Run:

```bash
npm run dev
```

The app should still load without CSS errors.

---

### `frontend/src/components/ui/Button.jsx`

```jsx
function Button({
  children,
  variant = "primary",
  type = "button",
  disabled = false,
  className = "",
  ...props
}) {
  return (
    <button
      type={type}
      disabled={disabled}
      className={`ui-button ui-button--${variant} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;
```

---

### `frontend/src/components/ui/Input.jsx`

```jsx
function Input({
  label,
  error,
  helperText,
  className = "",
  id,
  ...props
}) {
  return (
    <div className="ui-input-group">
      {label ? (
        <label className="ui-label" htmlFor={id}>
          {label}
        </label>
      ) : null}

      <input
        id={id}
        className={`ui-input ${error ? "ui-input--error" : ""} ${className}`}
        {...props}
      />

      {error ? (
        <p className="ui-error-message">{error}</p>
      ) : helperText ? (
        <p className="ui-helper-text">{helperText}</p>
      ) : null}
    </div>
  );
}

export default Input;
```

---

### `frontend/src/components/ui/Card.jsx`

```jsx
function Card({ children, className = "" }) {
  return <section className={`ui-card ${className}`}>{children}</section>;
}

export default Card;
```

---

### `frontend/src/components/ui/Loading.jsx`

```jsx
function Loading({ message = "Loading..." }) {
  return <p className="ui-loading">{message}</p>;
}

export default Loading;
```

---

### `frontend/src/components/ui/ErrorMessage.jsx`

```jsx
function ErrorMessage({ message = "Something went wrong." }) {
  return <p className="ui-error-message">{message}</p>;
}

export default ErrorMessage;
```

---

### Update `frontend/src/pages/StartPage.jsx`

Your exact route path may already be different from mine, but the page can look like this:

```jsx
import { Link } from "react-router-dom";

import Button from "../components/ui/Button.jsx";
import Card from "../components/ui/Card.jsx";

function StartPage() {
  return (
    <main className="page-center">
      <div className="page-stack">
        <Card>
          <h1 className="page-title">Welcome to HelloStay</h1>

          <p className="page-description">
            HelloStay is an offline hotel management system for managing small
            and medium hotels, guest houses, lodges, and resorts.
          </p>

          <div style={{ marginTop: "24px" }}>
            <Link to="/login">
              <Button>Go to Login</Button>
            </Link>
          </div>
        </Card>
      </div>
    </main>
  );
}

export default StartPage;
```

A small note: using inline style here is acceptable for a temporary placeholder, but later we should move layout spacing into CSS classes.

---

### Update `frontend/src/pages/LoginPage.jsx`

This is still a placeholder login page.

No real authentication yet.

```jsx
import { Link } from "react-router-dom";

import Button from "../components/ui/Button.jsx";
import Card from "../components/ui/Card.jsx";
import Input from "../components/ui/Input.jsx";

function LoginPage() {
  return (
    <main className="page-center">
      <div className="page-stack">
        <Card>
          <h1 className="page-title">Login</h1>

          <p className="page-description">
            This is a placeholder login screen. Real authentication will be
            added in a later milestone.
          </p>

          <div style={{ display: "grid", gap: "16px", marginTop: "24px" }}>
            <Input
              id="username"
              label="Username"
              type="text"
              placeholder="Enter your username"
              helperText="Placeholder only. No backend connection yet."
            />

            <Input
              id="password"
              label="Password"
              type="password"
              placeholder="Enter your password"
              helperText="Authentication will be implemented later."
            />

            <Button disabled>Login later</Button>

            <Link to="/">
              <Button variant="ghost">Back to Start</Button>
            </Link>
          </div>
        </Card>
      </div>
    </main>
  );
}

export default LoginPage;
```

---

### Update `frontend/src/pages/NotFoundPage.jsx`

```jsx
import { Link } from "react-router-dom";

import Button from "../components/ui/Button.jsx";
import Card from "../components/ui/Card.jsx";
import ErrorMessage from "../components/ui/ErrorMessage.jsx";

function NotFoundPage() {
  return (
    <main className="page-center">
      <div className="page-stack">
        <Card>
          <h1 className="page-title">Page Not Found</h1>

          <div style={{ marginTop: "16px" }}>
            <ErrorMessage message="The page you are looking for does not exist." />
          </div>

          <div style={{ marginTop: "24px" }}>
            <Link to="/">
              <Button>Go to Start Page</Button>
            </Link>
          </div>
        </Card>
      </div>
    </main>
  );
}

export default NotFoundPage;
```

---

## 8. Code Walkthrough

### Button Component

```jsx
function Button({
  children,
  variant = "primary",
  type = "button",
  disabled = false,
  className = "",
  ...props
})
```

This means the component accepts several props.

Example:

```jsx
<Button variant="secondary">Cancel</Button>
```

React passes:

```text
variant = "secondary"
children = "Cancel"
```

This part:

```jsx
variant = "primary"
```

means if no variant is passed, use `"primary"` by default.

This part:

```jsx
...props
```

collects any extra props.

So this works:

```jsx
<Button onClick={handleClick}>Save</Button>
```

The `onClick` is included inside `props` and passed to the real `<button>`.

---

### Input Component

The `Input` component wraps three things:

```text
label
input
helper/error text
```

This is better than repeating this pattern on every form.

This part:

```jsx
{label ? (...) : null}
```

means:

- If `label` exists, show label.
- Otherwise show nothing.

This part:

```jsx
error ? "ui-input--error" : ""
```

means:

- If there is an error, add error styling.
- Otherwise do not add that class.

---

### Card Component

```jsx
function Card({ children, className = "" }) {
  return <section className={`ui-card ${className}`}>{children}</section>;
}
```

`Card` does not care what content is inside it.

That is the power of `children`.

You can put text inside:

```jsx
<Card>Hello</Card>
```

Or a full page section:

```jsx
<Card>
  <h1>Login</h1>
  <Input />
  <Button>Submit</Button>
</Card>
```

---

### Loading Component

```jsx
function Loading({ message = "Loading..." }) {
  return <p className="ui-loading">{message}</p>;
}
```

Later, when we connect to the backend, many screens will have this pattern:

```jsx
if (isLoading) {
  return <Loading message="Loading rooms..." />;
}
```

But not yet.

---

### ErrorMessage Component

```jsx
function ErrorMessage({ message = "Something went wrong." }) {
  return <p className="ui-error-message">{message}</p>;
}
```

Later, API errors and form validation errors can reuse this.

---

## 9. Debugging Tips

### Problem: Import Path Error

Example error:

```text
Failed to resolve import "../components/ui/Button.jsx"
```

Check:

- Is `Button.jsx` actually inside `src/components/ui`?
- Is the file name exactly `Button.jsx`?
- Is the import path relative to the current file?

From:

```text
src/pages/StartPage.jsx
```

To:

```text
src/components/ui/Button.jsx
```

The correct path is:

```jsx
import Button from "../components/ui/Button.jsx";
```

---

### Problem: Page Becomes Unstyled

Check that `global.css` is still imported in:

```text
src/main.jsx
```

You should have something like:

```jsx
import "./styles/global.css";
```

Do not import `global.css` inside every component.

Global CSS should be imported once near the app entry point.

---

### Problem: Button Does Nothing

For `StartPage`, make sure the button is inside a React Router `Link`:

```jsx
<Link to="/login">
  <Button>Go to Login</Button>
</Link>
```

Also confirm `AppRoutes.jsx` has a route for:

```text
/login
```

---

### Problem: The Login Button Is Disabled

That is intentional in this milestone.

```jsx
<Button disabled>Login later</Button>
```

We are not building real authentication yet.

---

## 10. Common Mistakes

### Mistake 1: Building the Dashboard Too Early

Do not add sidebar, topbar, dashboard cards, room stats, or income sections yet.

That belongs later.

Milestone 4 is only UI foundation.

### Mistake 2: Adding Backend Calls

Do not fetch:

```text
/rooms
/guests
/stay
```

yet.

Those are real hotel features.

### Mistake 3: Putting UI Logic in Electron

Do not put React component logic in Electron files.

Wrong:

```text
electron/main.js creates buttons or login form
```

Correct:

```text
Electron main process creates the desktop window.
React renderer creates buttons, forms, pages, and layouts.
```

### Mistake 4: Creating Too Many Components

Do not create:

```text
Navbar
Sidebar
DashboardCard
RoomCard
GuestTable
BookingForm
FinanceWidget
```

yet.

Only create generic UI components.

### Mistake 5: Overengineering the Design System

Do not install UI libraries yet.

For this milestone, plain CSS is better because you are learning:

```text
CSS variables
className
props
children
component composition
```

---

## 11. Alternative Approaches

### Approach 1: Plain CSS

This is what I recommend now.

#### Advantages

- Simple
- Beginner-friendly
- Easy to debug
- No extra dependency
- Good for learning fundamentals

#### Disadvantages

- You must organize CSS carefully as the app grows

---

### Approach 2: Tailwind CSS

Tailwind is popular, but not needed yet.

#### Advantages

- Fast styling
- Consistent spacing utilities
- Good for production teams that already know it

#### Disadvantages for You Right Now

- Adds another tool to learn
- Can distract from React fundamentals
- Class names can feel overwhelming for beginners

---

### Approach 3: UI Component Library

Examples include Material UI, Ant Design, Chakra UI, etc.

#### Advantages

- Many ready-made components
- Faster enterprise UI development

#### Disadvantages for HelloStay Right Now

- Less learning from first principles
- Harder to customize deeply
- Adds dependency weight
- Can make the app feel generic

### Recommendation

Stay with plain CSS for Milestone 4.

---

## 12. Industry Best Practices

For this milestone, professional practice means:

- Keep components small.
- Use clear names.
- Avoid duplicated styles.
- Use CSS variables for repeated design values.
- Keep React UI inside renderer.
- Do not mix Electron main-process code with React components.
- Do not build future features before the foundation is stable.
- Prefer boring readable code over clever abstractions.

A production app grows safely when each layer has a clear responsibility.

### HelloStay Layer Responsibilities

| Layer | Responsibility |
|---|---|
| FastAPI | Business rules, validation, database, API contracts |
| Electron main | Desktop lifecycle and native shell |
| Electron preload | Safe bridge when renderer needs desktop capabilities |
| React renderer | UI, routes, pages, components, forms, styling |

Milestone 4 only touches the React renderer.

---

## 13. Summary

In Milestone 4, we created the beginning of HelloStay’s UI foundation.

### You Learned

- What a design system is
- Why CSS variables are useful
- Why reusable UI components exist
- The difference between pages and UI components
- How props work
- How children work
- How className works in JSX
- Why styling belongs in React, not Electron main
- Why we are not building the dashboard yet

### Reusable Components You Should Now Have

```text
Button
Input
Card
Loading
ErrorMessage
```

Your placeholder pages should now look more consistent without becoming real hotel features.
