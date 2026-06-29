# Structured Notes — HelloStay Milestone 1

## Part 1 — React Frontend Foundation Guide

We’ll keep this milestone intentionally small: create a clean Vite React app, understand each generated file, simplify it, and verify it runs on localhost:5173 without touching backend, routing, auth, or Electron.

Thought for 17s

### 1. Objective

Milestone 1 creates the clean React renderer foundation for HelloStay.

By the end of this milestone, you should have:

frontend/
  index.html
  package.json
  vite.config.js
  src/
    main.jsx
    App.jsx
    styles/
      global.css

We will not build rooms, guests, bookings, dashboard, auth, API services, routing, or Electron in this milestone.

The reason is simple: before building hotel features, we need a clean, understandable React project that can later sit safely inside Electron as the renderer process.

Your backend already allows the React development origin http://localhost:5173, and the backend currently includes routers for system info, rooms, guests, stays, and guest-stays, plus a root health-check endpoint. So Milestone 1 must make sure the React app runs on that same frontend port.

### 2. Problem Analysis

A beginner mistake is trying to build the whole frontend immediately:

Login → Dashboard → Rooms → Guests → Bookings → API calls → Electron

That feels productive, but it creates confusion because too many concepts arrive at once.

For HelloStay, we should build in layers:

Milestone 1: React foundation
Milestone 2: Electron shell
Milestone 3: routing/layout
Milestone 4+: feature screens and API integration

Milestone 1 answers only these questions:

Can React run?
Can Vite serve it on port 5173?
Do we understand main.jsx?
Do we understand App.jsx?
Do we have clean global styling?
Is the folder structure ready for future growth?

The backend is already the source of truth. It owns business logic, validation, database access, and API contracts. For example, the backend’s room, guest, stay, and guest-stay modules already exist as API routers. React should not duplicate those rules.

### 3. High-Level Design

For now, the app will look like this:

Browser / Electron Renderer later
        |
        v
index.html
        |
        v

#### src/main.jsx
        |
        v
<App />
        |
        v
Minimal HelloStay setup screen

Later, Electron will wrap this React app:

Electron Main Process
  - creates desktop window
  - manages app lifecycle
  - starts/connects backend later

Electron Preload
  - safe bridge between desktop APIs and React
  - secure IPC later

React Renderer
  - screens
  - components
  - user interface
  - forms
  - state
  - API calls later

Milestone 1 only touches the React renderer.

### 4. Concepts Involved

#### What is Vite?

Vite is a frontend build tool and development server. Its job is to help us run React during development and bundle the app for production later. The official Vite guide shows npm create vite@latest as the standard scaffolding command.

Think of Vite as the tool that says:

Take my React files
Start a local dev server
Refresh quickly when I edit code
Build optimized files later

Vite is not React. Vite is the tool around React.

#### What is React?

React is a JavaScript library for building user interfaces out of reusable pieces called components. The React docs describe this component-based approach as building UIs from individual pieces and combining them into screens and apps.

For HelloStay, examples of future components will be:

RoomCard
GuestForm
BookingTable
Sidebar
DashboardMetricCard

But we are not creating them yet.

#### What is JSX?

JSX is a syntax extension for JavaScript that lets us write HTML-like markup inside JavaScript files. React’s docs describe JSX as HTML-like markup written inside JavaScript.

Example:

function App() {
  return <h1>HelloStay</h1>;
}

This looks like HTML, but it is actually JSX. React turns it into browser DOM updates.

#### What is main.jsx?

main.jsx is the React entry file.

It finds a real HTML element from index.html:

<div id="root"></div>

Then React attaches your app to it using createRoot.

React’s official docs say createRoot creates a root to display React components inside a browser DOM node.

#### What is App.jsx?

App.jsx is the root component of our React application.

For now:

App.jsx = the first visible React component

Later:

App.jsx may contain providers, layout, routes, auth guards, app shell

But not yet.

### 5. Folder/File Changes

#### Final Milestone 1 structure

Create only what is needed now:

frontend/
  index.html
  package.json
  vite.config.js
  src/
    main.jsx
    App.jsx
    styles/
      global.css

#### Why not create everything now?

You mentioned this future direction:

frontend/
  src/
    main.jsx
    App.jsx
    styles/
      global.css
    assets/
    components/
    pages/
    routes/
    services/
    hooks/
    context/
    utils/

That structure is good, but in Milestone 1 we should avoid empty folders unless needed.

A professional rule:

Create folders when the project has real files that belong there.
Do not create architecture decoration.

So for now:

styles/ exists because global.css exists.
components/ waits until we create real reusable components.
pages/ waits until routing/pages begin.
routes/ waits until React Router begins.
services/ waits until API calls begin.
hooks/ waits until custom hooks begin.
context/ waits until shared app state begins.
utils/ waits until reusable helper functions begin.
assets/ can wait unless we add images/icons.

### 6. Step-by-Step Explanation

#### Step 1: Go to the project root

Run this from the folder that contains your backend project folder.

Command:

cd path/to/HelloStay

What this means:

cd = change directory
path/to/HelloStay = your actual project folder

Verification:

pwd

On Windows PowerShell:

Get-Location

You should be inside the main HelloStay project folder, not inside the backend app folder.

#### Step 2: Create the Vite React project

Run:

npm create vite@latest frontend -- --template react

What this means:

npm
  Node package manager

create vite@latest
  use the latest official Vite project generator

frontend
  create the project inside a folder named frontend

-- --template react
  choose the React JavaScript template

Important: this uses the React template, not TypeScript.

Verification:

cd frontend
ls

On Windows PowerShell:

cd frontend
dir

You should see files like:

index.html
package.json
src/

#### vite.config.js

#### Step 3: Install dependencies

Run:

npm install

What this means:

Read package.json
Download required packages
Create node_modules/
Create package-lock.json

Verification:

ls

You should now see:

node_modules/
package-lock.json
package.json

Do not manually edit node_modules.

#### Step 4: Start the dev server

Run:

npm run dev

What this means:

npm reads package.json
Finds the "dev" script
Starts Vite development server

You should see something like:

Local: http://localhost:5173/

Open:

http://localhost:5173

This matters because your FastAPI backend CORS already allows http://localhost:5173.

### 7. Implementation

Now simplify the generated Vite files.

#### src/main.jsx

Replace the file with this:

import React from 'react';
import { createRoot } from 'react-dom/client';

import App from './App.jsx';
import './styles/global.css';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

#### src/App.jsx

Replace the file with this:

function App() {
  return (
    <main className="app-shell">
      <section className="welcome-card">
        <p className="eyebrow">HelloStay</p>

        <h1>React frontend setup is ready</h1>

        <p className="description">
          This is the clean React foundation for the HelloStay hotel management
          application. Feature screens, routing, API services, authentication,
          and Electron integration will be added in later milestones.
        </p>
      </section>
    </main>
  );
}

export default App;

#### Create src/styles/global.css

First create the folder:

mkdir src/styles

Then create:

src/styles/global.css

Add this CSS:

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

.app-shell {
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 24px;
}

.welcome-card {
  width: min(100%, 720px);
  padding: 40px;
  border: 1px solid #e2e8f0;
  border-radius: 18px;
  background: #ffffff;
  box-shadow: 0 20px 60px rgba(15, 23, 42, 0.08);
}

.eyebrow {
  margin: 0 0 12px;
  color: #2563eb;
  font-size: 0.85rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

h1 {
  margin: 0;
  font-size: clamp(2rem, 5vw, 3.5rem);
  line-height: 1.05;
}

.description {
  max-width: 58ch;
  margin: 20px 0 0;
  color: #526173;
  font-size: 1.05rem;
  line-height: 1.7;
}

#### vite.config.js

Vite will generate this file. Update it to explicitly keep port 5173:

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    strictPort: true,
  },
});

Why this is useful:

port: 5173
  tells Vite to use the backend-approved frontend origin

strictPort: true
  prevents Vite from silently switching to 5174 if 5173 is busy

That is important because your backend currently allows only http://localhost:5173 for React development.

### 8. Code Walkthrough

#### main.jsx
import React from 'react';

This imports React itself. In modern React, JSX can often work without explicitly importing React, but keeping it here is beginner-friendly because we are using:

<React.StrictMode>
import { createRoot } from 'react-dom/client';

This imports the function that connects React to the browser DOM.

The browser has real HTML:

<div id="root"></div>

React takes control of that element.

import App from './App.jsx';

This imports our root component.

The ./ means:

Look in the same folder as main.jsx
import './styles/global.css';

This loads global CSS once for the whole app.

We put global CSS in main.jsx because main.jsx is the app entry point.

createRoot(document.getElementById('root')).render(...)

Breakdown:

document
  the browser page

getElementById('root')
  find <div id="root"></div> inside index.html

createRoot(...)
  tell React this is where the app lives

.render(...)
  display the React component tree
<React.StrictMode>
  <App />
</React.StrictMode>

StrictMode helps catch unsafe patterns during development. It does not show anything visible on screen.

<App /> means:

Render the App component

#### App.jsx
function App() {

This defines a JavaScript function.

In React, a component is usually just a function that returns JSX.

return (
  <main className="app-shell">

The component returns JSX.

Important JSX rule:

Use className instead of class.

#### Why?

Because class is a reserved JavaScript keyword. JSX uses className.

export default App;

This makes the component available to other files.

That is why main.jsx can do:

import App from './App.jsx';

### 9. Debugging Tips

#### Problem: npm is not recognized

Cause:

Node.js is not installed or not available in PATH.

Check:

node -v
npm -v

You should see version numbers.

#### Problem: Vite runs on 5174 instead of 5173

Cause:

Something else is already using port 5173.

Because we used:

strictPort: true

Vite should stop instead of silently changing ports.

Fix:

Stop the other process or close the other terminal running Vite.

#### Problem: Blank white page

Open browser DevTools:

Right click → Inspect → Console

Common causes:

Wrong import path
Deleted App.jsx accidentally
CSS path typo
Syntax error in JSX

#### Problem: Failed to resolve import "./styles/global.css"

Cause:

The styles folder or global.css file does not exist at the expected path.

Expected path:

frontend/src/styles/global.css

#### Problem: JSX error

Example mistake:

function App() {
  return (
    <h1>HelloStay</h1>
    <p>Ready</p>
  );
}

This is invalid because React components must return one parent element.

Correct:

function App() {
  return (
    <main>
      <h1>HelloStay</h1>
      <p>Ready</p>
    </main>
  );
}

### 10. Common Mistakes

#### Mistake 1: Adding React Router now

Do not add React Router in Milestone 1.

#### Why?

Routing introduces concepts like:

BrowserRouter
Routes
Route
navigation
protected routes
layout routes
fallback routes

Those belong in Milestone 3 after we have a stable React foundation and Electron shell plan.

#### Mistake 2: Creating API services now

Do not create:

services/apiClient.js
services/roomService.js
services/guestService.js

yet.

#### Why?

API integration needs decisions about:

base URL
backend startup
Electron production URL
error handling
auth token behavior
offline failure states

Those should not be guessed in Milestone 1.

#### Mistake 3: Building login UI now

The backend currently has security/token-related files, but your visible backend router registration does not expose a complete auth router in main.py. So building login assumptions now would be premature.

#### Mistake 4: Adding Tailwind immediately

Tailwind is useful later, but Milestone 1 should stay simple.

For now, plain global CSS teaches:

CSS file imports
className
layout basics
browser defaults
root styling

#### Mistake 5: Creating many empty folders

A folder structure should support real code, not decorate the project.

This is enough for Milestone 1:

src/
  main.jsx
  App.jsx
  styles/
    global.css

### 11. Alternative Approaches

#### Approach A: Vite React JavaScript

Recommended for HelloStay now.

Pros:

Fast setup
Simple mental model
Good React support
Matches modern frontend practice
Easy Electron integration later

Cons:

Does not enforce types like TypeScript

This is fine because you specifically chose JavaScript for the frontend rebuild.

#### Approach B: Create React App

Not recommended.

Pros:

Older tutorials use it

Cons:

Heavier
Less modern
Slower dev experience
Not ideal for new projects

#### Approach C: TypeScript setup

Not for this milestone.

Pros:

Better type safety
Catches many bugs earlier

Cons for you right now:

Adds extra learning overhead
Distracts from React fundamentals

### 12. Industry Best Practices

For this milestone, follow these practices:

Keep the root component minimal.
Keep global CSS small.
Do not build features before app structure is clear.
Configure the dev server port explicitly.
Do not duplicate backend business rules in React.
Do not add libraries before the problem exists.
Use readable file names.
Use one responsibility per file.

The backend already has defined API modules and schemas for the hotel domain, including rooms, guests, stays, and guest-stay relationships. The frontend should grow around those contracts later instead of inventing its own data model.

### 13. Summary

Milestone 1 creates the React foundation only.

You should now have:

frontend/
  index.html
  package.json
  vite.config.js
  src/
    main.jsx
    App.jsx
    styles/
      global.css

You learned:

Vite starts and builds the frontend.
React builds UI through components.
JSX is HTML-like syntax inside JavaScript.
main.jsx attaches React to index.html.
App.jsx is the root React component.
global.css handles basic app-wide styling.
Port 5173 matters because the backend CORS allows it.
Electron is not added yet because this milestone is renderer-only.

Milestone 1 is complete when:

npm run dev works
The app opens at http://localhost:5173
You see the HelloStay setup message
There are no console errors
No backend/API/auth/Electron code has been added

### 14. Suggested Next Step

Complete the commands and file edits above, then send me your resulting frontend folder structure and the contents of main.jsx, App.jsx, global.css, and vite.config.js. I’ll review them like a code review before we move to Milestone 2.

## Source Context Lines

Pasted text.txt
Document
This was the output of Get-ChildItem -Recurse -File | Select-Object FullName
Pasted text.txt
Document
I have deleted the unused files, this was my output of Get-ChildItem

## Part 2 — Milestone 1 Code Review

### 1. Objective

Your vite.config.js is correct.

This completes the code review for Milestone 1.

### 2. Problem Analysis

The main thing we needed from vite.config.js was this:

server: {
  port: 5173,
  strictPort: true,
}

That is present and correct.

This matters because your FastAPI backend is configured to allow the React development origin at:

http://localhost:5173

So we do not want Vite silently moving to another port like 5174.

### 3. High-Level Design

Your frontend setup now has a clean startup chain:

frontend/
  index.html
    ↓
  src/main.jsx
    ↓
  src/App.jsx
    ↓
  src/styles/global.css

And Vite serves it on:

http://localhost:5173

This is exactly what Milestone 1 needed.

### 4. Concepts Involved

#### defineConfig
import { defineConfig } from 'vite';

defineConfig helps Vite understand your configuration clearly. It also gives better editor support.

#### React plugin
import react from '@vitejs/plugin-react';

plugins: [react()],

This enables React support inside Vite, including JSX handling and React development features.

#### Fixed port
port: 5173,

This tells Vite to start the dev server on port 5173.

#### Strict port
strictPort: true,

This tells Vite:

If 5173 is busy, stop and show an error.
Do not silently switch to another port.

That is a good production-minded development habit.

### 5. Folder/File Changes

No change needed.

Your reviewed files are now approved:

src/
  App.jsx
  main.jsx
  styles/
    global.css

#### vite.config.js

### 6. Step-by-Step Explanation

Your project now works like this:

### 1. npm run dev starts Vite.

### 2. Vite reads vite.config.js.

### 3. Vite starts on port 5173.

### 4. Browser opens index.html.

### 5. index.html loads /src/main.jsx.

### 6. main.jsx renders <App />.

### 7. App.jsx shows the HelloStay setup screen.

### 8. global.css styles the screen.

That is the complete Milestone 1 React setup flow.

### 7. Implementation Review

Approved:

App.jsx: passed
main.jsx: passed
global.css: passed
vite.config.js: passed
folder cleanup: passed

Your vite.config.js:

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    strictPort: true,
  },
});

This is correct.

### 8. Code Walkthrough

This part enables React:

plugins: [react()],

Without this plugin, Vite would not handle React JSX development properly.

This part controls the dev server:

server: {
  port: 5173,
  strictPort: true,
}

This is especially important for HelloStay because the backend/frontend relationship depends on predictable local ports during development.

### 9. Debugging Tips

If npm run dev says port 5173 is already in use, do not change the port casually.

Instead:

### 1. Find the other terminal running Vite.

### 2. Stop it with Ctrl + C.

### 3. Run npm run dev again.

If Vite still cannot start, restart your terminal or check if another process is using the port.

On Windows PowerShell, you can inspect port usage with:

netstat -ano | findstr :5173

### 10. Common Mistakes

Do not change this:

port: 5173

to another port unless you also update backend CORS later.

Do not add backend proxy configuration yet.

For example, do not add this in Milestone 1:

proxy: {
  '/api': 'http://localhost:8000'
}

API integration comes later.

Do not add Electron config here yet. Electron belongs to the desktop layer and will be introduced separately.

### 11. Alternative Approaches

Some projects allow Vite to choose any available port.

That is okay for simple demos, but not ideal here because HelloStay has a backend CORS configuration that expects a known frontend origin.

So your explicit port configuration is the better choice.

### 12. Industry Best Practices

This milestone followed good setup practices:

Small foundation first.
No feature code during setup.
No unused starter files.
One global CSS file.
Fixed dev port.
No premature routing.
No premature API client.
No premature Electron setup.

That is how professional projects stay understandable as they grow.

### 13. Summary

Milestone 1 is complete.

Final approved structure:

frontend/
  index.html
  package.json
  package-lock.json
  vite.config.js
  public/
    favicon.svg
    icons.svg
  src/
    App.jsx
    main.jsx
    styles/
      global.css

Approved source files:

App.jsx: correct
main.jsx: correct
global.css: correct
vite.config.js: correct

Your React frontend foundation is now ready.
