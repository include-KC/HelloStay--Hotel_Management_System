# Fixing Vite Import Error for `RegisterPage.jsx`

## Error Message

```text
6:12:48 pm [vite] (client) Pre-transform error: Failed to resolve import "/pages/RegisterPage.jsx" from "src/routes/AppRoutes.jsx". Does the file exist?

Plugin: vite:import-analysis
File: C:/__PROJECTS__/HelloStay/frontend/src/routes/AppRoutes.jsx:6:25

3  |  import LoginPage from "../pages/LoginPage.jsx";
4  |  import NotFoundPage from "../pages/NotFoundPage.jsx";
5  |  import RegisterPage from "/pages/RegisterPage.jsx";
   |                            ^
6  |  var _jsxFileName = "C:/__PROJECTS__/HelloStay/frontend/src/routes/AppRoutes.jsx";
7  |  import { jsxDEV as _jsxDEV } from "react/jsx-dev-runtime"; (x2)
```

## Context

This error appears in the terminal while running:

```bash
npm run dev
```

## Objective

Fix this Vite import error:

```text
Failed to resolve import "/pages/RegisterPage.jsx" from "src/routes/AppRoutes.jsx"
```

---

## Problem Analysis

The problem is this line in `src/routes/AppRoutes.jsx`:

```jsx
import RegisterPage from "/pages/RegisterPage.jsx";
```

The starting `/` makes this an absolute import from the project root, not from the `src` folder.

Because of that, Vite tries to find the file here:

```text
frontend/pages/RegisterPage.jsx
```

But the actual page should be inside:

```text
frontend/src/pages/RegisterPage.jsx
```

That is why Vite cannot resolve the import.

---

## Correct Fix

Open this file:

```text
frontend/src/routes/AppRoutes.jsx
```

Replace this incorrect import:

```jsx
import RegisterPage from "/pages/RegisterPage.jsx";
```

With this correct relative import:

```jsx
import RegisterPage from "../pages/RegisterPage.jsx";
```

---

## Why `../pages/RegisterPage.jsx` Works

Your route file is located here:

```text
src/routes/AppRoutes.jsx
```

Your page file should be located here:

```text
src/pages/RegisterPage.jsx
```

So from `AppRoutes.jsx`, the path needs to move like this:

```text
src/routes
   ↑ go up one level using ..
src
   ↓ enter pages
src/pages/RegisterPage.jsx
```

That becomes:

```jsx
"../pages/RegisterPage.jsx"
```

---

## Check That the File Exists

Make sure this file exists:

```text
frontend/src/pages/RegisterPage.jsx
```

If the file has not been created yet, create it.

You can use this simple placeholder for now:

```jsx
import { Link } from "react-router-dom";

function RegisterPage() {
  return (
    <main className="page-center">
      <div className="page-stack">
        <h1 className="page-title">Create Account</h1>

        <p className="page-description">
          This is a placeholder registration page. Real account creation will be
          added step by step in this milestone.
        </p>

        <Link to="/login">Back to login</Link>
      </div>
    </main>
  );
}

export default RegisterPage;
```

---

## Correct `AppRoutes.jsx` Example

Your `AppRoutes.jsx` should look like this:

```jsx
import { Routes, Route } from "react-router-dom";

import StartPage from "../pages/StartPage.jsx";
import LoginPage from "../pages/LoginPage.jsx";
import RegisterPage from "../pages/RegisterPage.jsx";
import NotFoundPage from "../pages/NotFoundPage.jsx";

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

---

## Important Concept

In React and Vite imports:

```jsx
import Something from "../pages/RegisterPage.jsx";
```

means the path is relative to the current file.

But this:

```jsx
import Something from "/pages/RegisterPage.jsx";
```

means Vite starts looking from the project or dev-server root.

For the current HelloStay structure, use relative imports like this:

```jsx
../pages/RegisterPage.jsx
```

---

## Common Mistakes

### Mistake 1: Using an absolute path

Do not write:

```jsx
import RegisterPage from "/pages/RegisterPage.jsx";
```

This points to:

```text
frontend/pages/RegisterPage.jsx
```

instead of:

```text
frontend/src/pages/RegisterPage.jsx
```

### Mistake 2: Using `./pages`

Do not write:

```jsx
import RegisterPage from "./pages/RegisterPage.jsx";
```

Because `AppRoutes.jsx` is already inside the `routes` folder, `./pages` would point to:

```text
src/routes/pages/RegisterPage.jsx
```

That folder does not exist.

---

## Final Summary

The error is caused by the wrong import path.

Use this:

```jsx
import RegisterPage from "../pages/RegisterPage.jsx";
```

Then make sure this file exists:

```text
frontend/src/pages/RegisterPage.jsx
```

After saving, Vite should reload automatically.

If the error remains, stop the dev server with:

```bash
Ctrl + C
```

Then run:

```bash
npm run dev
```

---

## Final Checklist

- [ ] Open `frontend/src/routes/AppRoutes.jsx`
- [ ] Replace `"/pages/RegisterPage.jsx"` with `"../pages/RegisterPage.jsx"`
- [ ] Confirm `frontend/src/pages/RegisterPage.jsx` exists
- [ ] Add the placeholder component if the file does not exist
- [ ] Save all files
- [ ] Let Vite reload automatically
- [ ] If needed, restart the dev server using `npm run dev`
