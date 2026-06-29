# HelloStay Frontend Setup Notes

## 1. Vite Install Setup Choice: ESLint vs Oxlint

### Original Question

> In the install setup in Vite, I have got this message saying use ESLint instead of Oxlint? And I have two options:
>
> 1. No (Oxlint)
> 2. Yes (ESLint)
>
> What should I do?

### Context

For HelloStay, this is a tooling choice, not a feature choice.

The Vite prompt is referring to the linting tool used in the React frontend setup.

### Reasoning Time

> Thought for 18s

### Recommended Choice

Choose:

```text
2. Yes (ESLint)
```

### Why ESLint Is Recommended for HelloStay

For HelloStay, ESLint is the better choice right now because the frontend is being rebuilt as a learning-focused, production-quality React project.

ESLint is preferred because it is:

- Mature
- Widely used
- Well-suited for React
- Well-supported by editors
- Compatible with plugins and configuration for JavaScript and JSX
- Useful for finding and fixing JavaScript problems
- Suitable for editor and CI workflows

### Why Not Oxlint Right Now

Oxlint is newer and faster, but speed is not the priority for HelloStay at this stage.

The current priorities are:

- Understanding React
- Writing clean code
- Debugging effectively
- Learning common industry tooling
- Building a stable project foundation

Oxlint can be explored later after the project foundation is stable.

Oxlint’s own documentation positions it as a replacement option for ESLint, but that does not automatically make it the safest beginner choice for this project.

### Final Decision

Select:

```text
Yes (ESLint)
```

### Project Alignment

This choice fits HelloStay’s current Milestone 1 goal:

> Create a clean React foundation, not experiment with newer tooling.

Vite itself is the correct React setup tool.

The backend already allows the Vite dev origin:

```text
http://localhost:5173
```

So choosing ESLint stays aligned with the frontend setup direction.

---

## 2. Vite Terminal Output and Error

### Terminal Output

```text
  VITE v8.1.0  ready in 430 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
2:02:10 pm [vite] (client) page reload src/main.jsx
2:02:38 pm [vite] (client) hmr update /src/App.jsx
2:02:42 pm [vite] (client) Pre-transform error: Failed to resolve import "./styles/global.css" from "src/main.jsx". Does the file exist?
  Plugin: vite:import-analysis
  File: C:/__PROJECTS__/HelloStay/frontend/src/main.jsx:5:7
  2  |  import { createRoot } from "react-dom/client";
  3  |  import App from "./App.jsx";
  4  |  import "./styles/global.css";
     |          ^
  5  |  var _jsxFileName = "C:/__PROJECTS__/HelloStay/frontend/src/main.jsx";
  6  |  import { jsxDEV as _jsxDEV } from "react/jsx-dev-runtime";
2:02:42 pm [vite] Internal server error: Failed to resolve import "./styles/global.css" from "src/main.jsx". Does the file exist?
  Plugin: vite:import-analysis
  File: C:/__PROJECTS__/HelloStay/frontend/src/main.jsx:5:7
  2  |  import { createRoot } from "react-dom/client";
  3  |  import App from "./App.jsx";
  4  |  import "./styles/global.css";
     |          ^
  5  |  var _jsxFileName = "C:/__PROJECTS__/HelloStay/frontend/src/main.jsx";
  6  |  import { jsxDEV as _jsxDEV } from "react/jsx-dev-runtime";
      at TransformPluginContext._formatLog (file:///C:/__PROJECTS__/HelloStay/frontend/node_modules/vite/dist/node/chunks/node.js:29914:39)
      at TransformPluginContext.error (file:///C:/__PROJECTS__/HelloStay/frontend/node_modules/vite/dist/node/chunks/node.js:29911:14)
      at normalizeUrl (file:///C:/__PROJECTS__/HelloStay/frontend/node_modules/vite/dist/node/chunks/node.js:26975:18)
      at async file:///C:/__PROJECTS__/HelloStay/frontend/node_modules/vite/dist/node/chunks/node.js:27038:30
      at async Promise.all (index 3)
      at async TransformPluginContext.transform (file:///C:/__PROJECTS__/HelloStay/frontend/node_modules/vite/dist/node/chunks/node.js:27006:4)
      at async EnvironmentPluginContainer.transform (file:///C:/__PROJECTS__/HelloStay/frontend/node_modules/vite/dist/node/chunks/node.js:29699:14)
      at async loadAndTransform (file:///C:/__PROJECTS__/HelloStay/frontend/node_modules/vite/dist/node/chunks/node.js:19725:26)
      at async viteTransformMiddleware (file:///C:/__PROJECTS__/HelloStay/frontend/node_modules/vite/dist/node/chunks/node.js:24149:20)
```

### User Question

> What is this coming in my terminal?

### Reasoning Time

> Thought for 8s

---

## 3. Objective

This terminal message means Vite is running correctly, but the React app is failing because one imported CSS file does not exist.

The important line is:

```text
Failed to resolve import "./styles/global.css" from "src/main.jsx". Does the file exist?
```

---

## 4. Problem Analysis

In `src/main.jsx`, the app currently has this line:

```jsx
import "./styles/global.css";
```

React/Vite reads this as:

```text
frontend/src/styles/global.css
```

But Vite cannot find that file.

### What the Problem Is Not

The problem is not with:

- Vite
- React
- The backend

### What the Problem Is

It simply means:

```text
You told Vite to load src/styles/global.css,
but that file/folder has not been created yet.
```

---

## 5. High-Level Design

For HelloStay Milestone 1, the goal is to use one clean global stylesheet.

So keep this import:

```jsx
import "./styles/global.css";
```

And create this file:

```text
frontend/
└── src/
    ├── main.jsx
    ├── App.jsx
    └── styles/
        └── global.css
```

---

## 6. Folder and File Changes

Create this folder:

```text
src/styles
```

Create this file:

```text
src/styles/global.css
```

---

## 7. Step-by-Step Fix

Inside the frontend project, create this file:

```text
C:/__PROJECTS__/HelloStay/frontend/src/styles/global.css
```

Then paste this basic CSS inside it:

```css
* {
  box-sizing: border-box;
}

html,
body,
#root {
  min-height: 100%;
}

body {
  margin: 0;
  font-family:
    Inter,
    system-ui,
    -apple-system,
    BlinkMacSystemFont,
    "Segoe UI",
    sans-serif;
  background-color: #f8fafc;
  color: #0f172a;
}

button,
input,
textarea,
select {
  font: inherit;
}

a {
  color: inherit;
  text-decoration: none;
}
```

---

## 8. Correct `main.jsx`

Your `main.jsx` should look like this:

```jsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./styles/global.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

---

## 9. Code Walkthrough

This line:

```jsx
import "./styles/global.css";
```

does not import JavaScript.

It tells Vite:

```text
Load this CSS file globally for the whole React app.
```

Because `main.jsx` is the entry point of the React app, importing CSS there makes the styles available across the whole application.

---

## 10. Why Vite Shows This Error

Vite checks every import before running the app.

When it sees:

```jsx
import "./styles/global.css";
```

it tries to find:

```text
src/styles/global.css
```

Since the file is missing, Vite stops and shows:

```text
Pre-transform error
Failed to resolve import
```

### Meaning of “Resolve Import”

“Resolve import” means:

```text
Find the actual file that this import path points to.
```

---

## 11. Debugging Tips

When this kind of error appears, check these three things.

### 1. Does the File Exist?

Check for:

```text
src/styles/global.css
```

### 2. Is the Spelling Exactly Correct?

The correct file name is:

```text
global.css
```

Not:

```text
globals.css
Global.css
style.css
```

### 3. Is the Path Correct Relative to the Importing File?

Because `main.jsx` is inside `src`, this import:

```jsx
import "./styles/global.css";
```

means:

```text
src/styles/global.css
```

---

## 12. Common Mistake

A common beginner mistake is creating the file here:

```text
frontend/styles/global.css
```

But that is wrong for this import.

The correct place is:

```text
frontend/src/styles/global.css
```

---

## 13. Alternative Fix

You could also change the import back to Vite’s default CSS file:

```jsx
import "./index.css";
```

But for HelloStay, the recommended import is:

```jsx
import "./styles/global.css";
```

because it gives a cleaner project structure as the app grows.

---

## 14. Summary

The Vite server is working.

The app is crashing because this file is missing:

```text
src/styles/global.css
```

Create that file, paste the CSS above, save it, and Vite should automatically reload.

---

## 15. Suggested Next Step

After this error disappears, check the browser at:

```text
http://localhost:5173/
```

Then confirm whether the basic `App.jsx` screen is showing correctly.
