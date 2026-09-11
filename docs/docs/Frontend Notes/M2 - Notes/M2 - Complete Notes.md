# Frontend AD 2: Electron Desktop Shell Setup — Structured Notes

## 1. Milestone Scope and Electron Shell Setup

We’ll keep this milestone very narrow: Electron will only wrap your existing Vite React app, not add hotel features, backend startup, routing, auth, or packaging. The key learning goal is understanding the boundary between Electron main, preload, and React renderer before writing much code.

Thought for 37s
### 1. Objective

Milestone 2 adds only the Electron desktop shell around your existing Vite React frontend.

By the end of this milestone, you should be able to run:

```bash
npm run desktop
```

from the frontend folder, and see your existing React welcome screen inside a native Electron window.

We are not building hotel features, routing, authentication, backend startup, packaging, dashboard, rooms, guests, stays, bookings, finance, or history yet.

Your backend remains separate. FastAPI is still the source of truth for business rules, validation, database operations, and API contracts. Your current backend already exposes its API separately through FastAPI routers and allows the React dev origin http://localhost:5173, which confirms that React/Electron should not absorb backend business logic.

### 2. Problem Analysis

Right now, HelloStay is a web frontend running in the browser:

```text
React + Vite
http://localhost:5173
```

But HelloStay is planned as an offline desktop application. Electron gives us the desktop shell:

```text
Electron window
  └── loads React UI
        └── later talks to FastAPI API
```

The beginner mistake is thinking Electron replaces React or FastAPI. It does not.

Electron gives us:

Desktop app window
App lifecycle
Native menus
Installer behavior later
Secure access to OS features later

React gives us:

Screens
Components
Forms
Buttons
UI state
User interactions

FastAPI gives us:

Business logic
Database access
Validation
Authentication
Hotel workflows
REST API contracts

HelloStay’s own project notes also describe this layered direction: React/Vite for frontend, Electron for desktop layer, FastAPI with SQLite for backend, and SQLite as the offline embedded database choice.

### 3. High-Level Design

For Milestone 2, the architecture becomes:

```text
frontend/
├── src/
│   ├── main.jsx              React entry point
│   ├── App.jsx               Existing UI
│   └── styles/
│       └── global.css
│
├── electron/
│   ├── main.js               Electron main process
│   └── preload.js            Safe bridge placeholder
│
├── package.json              Scripts updated
└── vite.config.js            Existing Vite config
```

Runtime flow during development:

```text
npm run desktop
        │
        ├── starts Vite dev server
        │       └── http://localhost:5173
        │
        └── starts Electron
                └── BrowserWindow loads http://localhost:5173
```

React still runs as a webpage inside Chromium. Electron provides the native desktop window around it.

### 4. Concepts Involved
#### Electron

Electron lets us build desktop apps using web technologies. Internally, it combines:

Chromium  → renders the UI
Node.js   → allows desktop/system access in controlled places
Electron  → connects desktop lifecycle with web UI

Electron apps have multiple processes.

#### Main Process

The main process is the desktop controller.

It handles:

App startup
App quit
Creating windows
Native menus
Desktop lifecycle
OS integration

In HelloStay, this belongs in:

frontend/electron/main.js

The main process should not contain hotel rules like room availability, guest validation, stay checkout, billing, or authentication. Those belong in FastAPI.

#### Renderer Process

The renderer process is the UI.

In our case, the renderer is your React app:

frontend/src/main.jsx
frontend/src/App.jsx
frontend/src/styles/global.css

React runs inside an Electron BrowserWindow, almost like it runs inside Chrome.

The renderer should handle:

Components
Forms
Buttons
UI state
Loading states
Error states
Client-side display logic

It should not directly access the database or filesystem.

#### BrowserWindow

BrowserWindow is Electron’s native desktop window class.

Think of it as:

BrowserWindow = desktop window + embedded Chromium browser

Official Electron docs describe BrowserWindow as the API for creating and controlling browser windows, and its webPreferences include options such as preload, nodeIntegration, and contextIsolation.

#### Preload Script

The preload script runs between the main process and renderer.

It is useful when React needs safe access to desktop features later, for example:

Read app version
Open file picker
Export backup file
Print invoice
Communicate with main process through IPC

But we do not need IPC yet.

For Milestone 2, we create preload.js as a secure placeholder so the architecture is ready without exposing unnecessary power.

#### nodeIntegration: false

This is very important.

If nodeIntegration is enabled, React code could use Node APIs directly, such as:

require("fs")
require("child_process")

That is dangerous because the renderer is UI code. UI code is more exposed to user input, browser-like behavior, and future third-party packages.

So we keep:

#### nodeIntegration: false

This means React cannot directly access Node.js APIs.

#### contextIsolation: true

contextIsolation separates the preload/Electron world from the webpage/React world. Electron’s docs describe context isolation as keeping preload scripts and Electron internals in a separate JavaScript context from the loaded website.

So instead of exposing everything, we expose only carefully selected APIs later through contextBridge.

For now, we expose nothing.

### 5. Folder/File Changes

We will add:

frontend/electron/main.js
frontend/electron/preload.js

We will update:

frontend/package.json

We will not change:

frontend/src/App.jsx
frontend/src/main.jsx
frontend/src/styles/global.css
vite.config.js
backend files
### 6. Step-by-Step Explanation
#### Step 1: Go to the frontend folder

This command moves your terminal into the React frontend project. We install Electron inside the frontend package because Electron wraps the frontend UI.

```powershell
cd frontend
```

Verification:

dir

On Windows, you should see files like:

package.json
vite.config.js
src
#### Step 2: Install Electron development tools

This command installs three development dependencies:

```powershell
npm install --save-dev electron concurrently wait-on
```

What each package does:

electron      Runs the desktop shell
concurrently Runs Vite and Electron together
wait-on       Waits until Vite is ready before opening Electron

Why wait-on matters:

If Electron opens before Vite is ready, Electron may try to load:

http://localhost:5173

too early and show a connection error. wait-on avoids that.

Verification:

```powershell
npm list electron concurrently wait-on
```

You should see all three packages listed.

#### Step 3: Create the Electron folder

Create this folder:

frontend/electron

Inside it, create:

main.js
preload.js

```text
Your structure should become:

frontend/
├── electron/
│   ├── main.js
│   └── preload.js
├── src/
├── package.json
└── vite.config.js
```
### 7. Implementation
frontend/electron/main.js

Use this code:

```javascript
import { app, BrowserWindow } from "electron";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const VITE_DEV_SERVER_URL = "http://localhost:5173";

function createMainWindow() {
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 900,
    minHeight: 600,
    show: false,
    backgroundColor: "#f6f7fb",
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  mainWindow.once("ready-to-show", () => {
    mainWindow.show();
  });

  if (app.isPackaged) {
    mainWindow.loadFile(path.join(__dirname, "../dist/index.html"));
  } else {
    mainWindow.loadURL(VITE_DEV_SERVER_URL);
  }
}

app.whenReady().then(() => {
  createMainWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createMainWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
```
frontend/electron/preload.js

For now, keep it intentionally minimal:

```javascript
// Preload script for HelloStay.
//
// This file runs before the React renderer loads.
// In future milestones, we can expose safe desktop APIs here using contextBridge.
//
// For Milestone 2, we intentionally expose nothing.
```

This is a good production-oriented decision. We create the file because the architecture needs it, but we do not expose APIs before there is a real need.

#### Update frontend/package.json

Your package.json will already have scripts similar to this:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

Add "main" and the Electron scripts.

Example:

```json
{
  "main": "electron/main.js",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "electron": "wait-on http://localhost:5173 && electron .",
    "desktop": "concurrently -k \"npm run dev\" \"npm run electron\""
  }
}
```

Do not remove your existing dependencies.

Important: if your package.json already has "type": "module", keep it. The main.js code above uses modern ES module syntax:

```javascript
import { app, BrowserWindow } from "electron";
```

That fits Vite’s normal setup.

#### Step 4: Run the desktop app

This command starts both Vite and Electron:

```powershell
npm run desktop
```

#### Expected result:

Vite starts on http://localhost:5173
Electron opens a desktop window
Your existing React UI appears inside Electron

Vite’s official docs describe vite as starting the development server from the current project root, and your project already uses port 5173.

### 8. Code Walkthrough
These imports:

```javascript
import { app, BrowserWindow } from "electron";
```

app controls the Electron application lifecycle.

BrowserWindow creates the desktop window.

These imports:

```javascript
import path from "node:path";
import { fileURLToPath } from "node:url";
```

Because we are using ES modules, Node does not automatically give us __dirname.

So we recreate it:

```javascript
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
```

This gives Electron a reliable way to find:

frontend/electron/preload.js
This constant:

```javascript
const VITE_DEV_SERVER_URL = "http://localhost:5173";
```

During development, Electron does not load a built HTML file.

Instead, it loads the running Vite server:

```javascript
mainWindow.loadURL(VITE_DEV_SERVER_URL);
```

This gives you Vite’s fast refresh behavior inside Electron.

This part creates the window:

```javascript
const mainWindow = new BrowserWindow({
  width: 1200,
  height: 800,
  minWidth: 900,
  minHeight: 600,
  show: false,
  backgroundColor: "#f6f7fb",
  webPreferences: {
    preload: path.join(__dirname, "preload.js"),
    nodeIntegration: false,
    contextIsolation: true,
  },
});
```

#### Important choices:

show: false

Prevents a white flash before React is ready.

backgroundColor: "#f6f7fb"

Matches your app’s light background from the existing CSS direction.

#### nodeIntegration: false

Keeps Node.js out of React.

#### contextIsolation: true

Keeps Electron/preload APIs separate from the React page.

preload: path.join(__dirname, "preload.js")

Registers the preload file, even though it exposes nothing yet.

This part shows the window only when ready:

```javascript
mainWindow.once("ready-to-show", () => {
  mainWindow.show();
});
```

Without this, users may briefly see a blank white desktop window.

#### Development loading vs production loading

```javascript
if (app.isPackaged) {
  mainWindow.loadFile(path.join(__dirname, "../dist/index.html"));
} else {
  mainWindow.loadURL(VITE_DEV_SERVER_URL);
}
```

#### Development:

Electron loads http://localhost:5173

#### Production later:

Electron loads frontend/dist/index.html

We are not packaging yet, but this prepares the code correctly.

This starts Electron safely:

```javascript
app.whenReady().then(() => {
  createMainWindow();
});
```

Electron should create windows only after the app is ready.

This handles macOS behavior:

```javascript
app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createMainWindow();
  }
});
```

On macOS, users expect clicking the dock icon to reopen the app window if no windows are open.

This quits on Windows/Linux:

```javascript
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
```

On Windows and Linux, closing all windows usually quits the app.

On macOS, apps often remain active until the user explicitly quits.

### 9. Debugging Tips
Problem: Electron opens but shows a blank page

Check whether Vite is running:

http://localhost:5173

Open it in your browser. If it does not load there, Electron cannot load it either.

Problem: Electron says connection refused

Usually this means Electron started before Vite was ready.

Check your script:

```json
"electron": "wait-on http://localhost:5173 && electron ."
```

wait-on should delay Electron until the Vite server responds.

Problem: Cannot use import statement outside a module

Your package.json probably does not have:

```json
"type": "module"
```

Because Vite projects normally use ES modules, you can either keep/add:

```json
"type": "module"
```

or rewrite electron/main.js using CommonJS. For this project, prefer keeping ES modules.

Problem: preload.js not found

Check this line:

preload: path.join(__dirname, "preload.js"),

And confirm this file exists:

frontend/electron/preload.js
Problem: app opens in browser but not Electron

Run these separately:

```powershell
npm run dev
```

Then in another terminal:

```powershell
npm run electron
```

This helps identify whether the issue is Vite or Electron.

### 10. Common Mistakes
#### Mistake 1: Putting React code in electron/main.js

Do not do this:

```javascript
// Wrong place
const rooms = [];
```

Hotel UI state belongs in React. Hotel business state belongs in FastAPI/database.

#### Mistake 2: Enabling Node in the renderer

Avoid this:

```javascript
nodeIntegration: true
```

It makes React too powerful and weakens security.

#### Mistake 3: Exposing too much from preload

Avoid this later:

```javascript
contextBridge.exposeInMainWorld("electron", {
  ipcRenderer,
});
```

That exposes too much power.

Prefer small, specific APIs later:

```javascript
contextBridge.exposeInMainWorld("helloStay", {
  getAppVersion: () => ipcRenderer.invoke("app:getVersion"),
});
```

But not yet.

#### Mistake 4: Starting FastAPI from Electron too early

We are not doing this in Milestone 2.

Later, Electron may help start/monitor the backend process. But that requires careful handling of:

Python path
Backend process lifecycle
Database file location
Logs
Error recovery
Installer behavior
Security

That is a separate milestone.

### 11. Alternative Approaches
#### Approach A: Use plain Electron manually

This is what we are doing.

#### Pros:

Simple
Educational
You understand every file
No hidden framework magic
Good for learning Electron properly

#### Cons:

You must later configure packaging yourself

Recommended for HelloStay right now.

#### Approach B: Use electron-vite

#### Pros:

Very convenient
Good dev experience
Handles many defaults

#### Cons:

Adds abstraction
Less beginner-friendly
May hide main/preload/renderer boundaries

Not recommended yet because your goal is to learn from first principles.

#### Approach C: Use Electron Forge immediately

#### Pros:

Good packaging workflow
Officially recognized ecosystem tool

#### Cons:

Introduces packaging concepts too early
More config before you understand the shell

Better for a later packaging milestone.

### 12. Industry Best Practices

For HelloStay, follow these rules from the beginning:

Keep nodeIntegration disabled.
Keep contextIsolation enabled.
Use preload only for safe, narrow APIs.
Do not expose raw ipcRenderer to React.
Do not put backend business logic in Electron.
Do not let React access SQLite directly.
Let FastAPI remain the source of truth.
Keep Electron main process focused on desktop lifecycle.

A good mental model:

React asks.
FastAPI decides.
SQLite stores.
Electron wraps.
### 13. Summary

Milestone 2 adds the basic Electron shell only.

You will install:

electron
concurrently
wait-on

You will create:

frontend/electron/main.js
frontend/electron/preload.js

You will update:

frontend/package.json

You will run:

```powershell
npm run desktop
```

#### Expected result:

Your existing Vite React app opens inside an Electron desktop window.

No hotel features are added. No backend is started. No routing is added. No packaging is done.

### 14. Suggested Next Step

Implement exactly this Milestone 2 setup first, then run npm run desktop. After that, we should review your package.json, electron/main.js, terminal output, and Electron window behavior before moving to any Electron preload or IPC concept.

## 2. User `main.js`

```javascript
import { app, BrowserWindow } from "electron";
import path from "node:path";
import os from "node:os";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const VITE_DEV_SERVER_URL = "http://localhost:5173";

function createMainWindow() {
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 900,
    minHeight: 600,
    show: false,
    backgroundColor: "#f6f7fb",
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  mainWindow.once("ready-to-show", () => {
    mainWindow.show();
  });

  if (app.isPackaged) {
    mainWindow.loadFile(path.join(__dirname, "../dist/index.html"));
  } else {
    mainWindow.loadURL(VITE_DEV_SERVER_URL);
  }
}

app.whenReady().then(() => {
  createMainWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createMainWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (os.platform() !== "darwin") {
    app.quit();
  }
});
```
This is my main.js

## 3. Troubleshooting: PowerShell `&&` and Port 5173

You have two separate issues, not one: PowerShell cannot parse &&, and Vite says port 5173 is already occupied. We’ll fix the script first, then clean up the already-running Vite process.

Thought for 27s
### 1. Objective

Your Electron app did not start because of two different terminal errors:

Problem 1: PowerShell does not accept && in your npm script.
Problem 2: Port 5173 is already being used by an old Vite process.

We will fix both.

### 2. Problem Analysis
#### Error 1: && is not valid in your PowerShell

Your script is:

```json
"electron": "wait-on http://localhost:5173 && electron ."
```

Your terminal says:

```text
The token '&&' is not a valid statement separator in this version.
```

This means your npm script is being executed through an older Windows PowerShell environment where && is not supported.

&& means:

Run the second command only if the first command succeeds.

But your PowerShell version does not understand it.

#### Error 2: Port 5173 is already in use

This part:

```text
Error: Port 5173 is already in use
```

means something is already running here:

```text
http://localhost:5173
```

Most likely, an older Vite server is still running from a previous terminal.

Because your Vite config uses fixed port 5173, Vite refuses to start on another port. That is good for Electron consistency, but it means we must free the port before running again.

### 3. High-Level Design

Your current startup flow should be:

```text
npm run desktop
        ↓
start Vite on localhost:5173
        ↓
wait until localhost:5173 is ready
        ↓
start Electron
        ↓
Electron loads React app

But currently it fails here:

wait-on http://localhost:5173 && electron .
                              ^^
PowerShell does not understand this
```

So Electron never starts.

### 4. Concepts Involved
#### What is &&?

In many terminals, this works:

```bash
command1 && command2
```

It means:

Run command1.
If command1 succeeds, run command2.

But your PowerShell version does not support this syntax.

#### What is wait-on?

This part:

```bash
wait-on http://localhost:5173
```

means:

Wait until the Vite development server is available.

Without this, Electron may open before React is ready and show a connection error.

#### What does Port 5173 is already in use mean?

Only one process can use one port at a time.

So if Vite is already running at:

```text
localhost:5173
```

a second Vite process cannot start on the same port.

### 5. Folder/File Changes

Update only this file:

```text
frontend/package.json
```

You currently have:

```json
"electron": "wait-on http://localhost:5173 && electron ."
```

Change it to this:

```json
"electron": "wait-on http://localhost:5173; electron ."
```

So your scripts become:

```json
"scripts": {
  "dev": "vite",
  "build": "vite build",
  "lint": "eslint .",
  "preview": "vite preview",
  "electron": "wait-on http://localhost:5173; electron .",
  "desktop": "concurrently -k \"npm run dev\" \"npm run electron\""
}
```

This works better in your PowerShell environment.

### 6. Step-by-Step Explanation
#### Step 1: Go to the frontend folder

Your terminal shows you ran the command from:

```text
C:\__PROJECTS__\HelloStay\frontend\electron
```

For this milestone, run npm commands from:

```text
C:\__PROJECTS__\HelloStay\frontend
```

So run:

```powershell
cd C:\__PROJECTS__\HelloStay\frontend
```

Why?

Because package.json belongs to the frontend folder.

#### Step 2: Update the npm script

In frontend/package.json, replace this:

```json
"electron": "wait-on http://localhost:5173 && electron ."
```

with this:

```json
"electron": "wait-on http://localhost:5173; electron ."
```

This avoids the PowerShell && problem.

#### Step 3: Free port 5173

First, close any terminal where npm run dev or Vite is already running.

Then check whether port 5173 is still occupied:

```powershell
netstat -ano | findstr :5173
```

You may see something like:

```text
TCP    127.0.0.1:5173    0.0.0.0:0    LISTENING    12345
```

The last number is the process ID.

Then kill it:

```powershell
taskkill /PID 12345 /F
```

Replace 12345 with the actual PID you see.

#### Step 4: Run again

From this folder:

```text
C:\__PROJECTS__\HelloStay\frontend
```

run:

```powershell
npm run desktop
```

#### Expected result:

Vite starts on http://localhost:5173
Electron starts
Your React app opens inside a desktop window
### 7. Implementation

Final package.json scripts should be:

```json
"scripts": {
  "dev": "vite",
  "build": "vite build",
  "lint": "eslint .",
  "preview": "vite preview",
  "electron": "wait-on http://localhost:5173; electron .",
  "desktop": "concurrently -k \"npm run dev\" \"npm run electron\""
}
```

For your current Windows PowerShell setup, this is the practical fix.

### 8. Code Walkthrough

This script:

```json
"dev": "vite"
```

starts the React development server.

This script:

```json
"electron": "wait-on http://localhost:5173; electron ."
```

does two things:

1. Waits until Vite is available at localhost:5173
2. Starts Electron

This script:

"desktop": "concurrently -k \"npm run dev\" \"npm run electron\""

runs both scripts together.

So the flow becomes:

```text
npm run desktop
        ↓
npm run dev       → starts Vite
npm run electron  → waits for Vite, then starts Electron
```
### 9. Debugging Tips
If you see this again:
Port 5173 is already in use

Run:

```powershell
netstat -ano | findstr :5173
```

Then kill the PID:

```powershell
taskkill /PID <PID> /F
```

Example:

```powershell
taskkill /PID 12345 /F
```
#### If Electron still does not open

Run commands separately.

##### Terminal 1:

```powershell
cd C:\__PROJECTS__\HelloStay\frontend
npm run dev
```

##### Terminal 2:

```powershell
cd C:\__PROJECTS__\HelloStay\frontend
npm run electron
```

This helps identify whether the failure is Vite or Electron.

### 10. Common Mistakes
#### Mistake 1: Running npm from the electron folder

Avoid:

```text
frontend/electron
```

Use:

```text
frontend
```

Your npm scripts belong to frontend/package.json.

#### Mistake 2: Leaving old Vite servers running

If one Vite process is already using 5173, a new one cannot start.

#### Mistake 3: Thinking Electron failed because of React

React did not fail here.

Your failure happened before Electron could start:

PowerShell rejected &&

Then Vite also failed because:

5173 was already occupied
### 11. Alternative Approaches
#### Option A: Use ; for PowerShell

```json
"electron": "wait-on http://localhost:5173; electron ."
```

Recommended for your current setup.

#### Option B: Use && but run through CMD

This can work, but it is more confusing for a beginner because now you are depending on a different shell.

#### Option C: Add a custom Node startup script

This is more professional and cross-platform, but it is too much for Milestone 2. We can do it later if needed.

### 12. Industry Best Practices

For now, the important best practice is:

Keep the startup workflow simple and understandable.

We are not adding backend startup, packaging, or complex process management yet.

Your current target is only:

```text
Vite React app inside Electron BrowserWindow
```
### 13. Summary

You have two fixes:

First, update package.json:

```json
"electron": "wait-on http://localhost:5173; electron ."
```

Second, free port 5173:

```powershell
netstat -ano | findstr :5173
taskkill /PID <PID> /F
```

Then run from the frontend folder:

```powershell
npm run desktop
```
### 14. Suggested Next Step

Make the script change, kill the old 5173 process, then run npm run desktop again from:

```text
C:\__PROJECTS__\HelloStay\frontend
```

## 4. User Confirmation

the desktop application opened

## 5. Milestone 2 Completion Notes

### 1. Objective

Excellent. That means Milestone 2 implementation is working.

Your current setup successfully does this:

```text
Vite React app → loaded inside → Electron desktop window
```
### 2. Problem Analysis

The earlier problems were not architectural problems. They were development-environment issues:

PowerShell did not support &&
Port 5173 was already occupied

After fixing those, Electron was able to load your React app correctly.

### 3. High-Level Design

Your working Milestone 2 flow is now:

```text
npm run desktop
        ↓
concurrently starts Vite and Electron
        ↓
Vite serves React on http://localhost:5173
        ↓
wait-on waits until Vite is ready
        ↓
Electron starts
        ↓
electron/main.js creates BrowserWindow
        ↓
BrowserWindow loads the Vite React app
```

This confirms your Electron shell is correctly connected to your React renderer.

### 4. Concepts Involved

You have now implemented the basic Electron process separation:

```text
Electron main process
  frontend/electron/main.js
  Creates and controls the desktop window

Electron preload script
  frontend/electron/preload.js
  Exists as a future safe bridge, but exposes nothing yet

React renderer process
  frontend/src/main.jsx
  frontend/src/App.jsx
  Runs the UI inside the Electron window
```

This is exactly the boundary we wanted.

### 5. Folder/File Changes Completed

Milestone 2 now has these files:

```text
frontend/electron/main.js
frontend/electron/preload.js
frontend/package.json
```

Your main.js is responsible for:

BrowserWindow creation
development loading
future production loading branch
desktop lifecycle behavior
security settings

Your preload.js is intentionally minimal.

Your package.json now starts both React and Electron during development.

### 6. Step-by-Step Verification

Now verify these things manually:

#### Check 1: React appears inside Electron

You already confirmed this because the desktop app opened.

#### Check 2: Browser should still show React

Open:

```text
http://localhost:5173
```

You should see the same React screen in the browser.

This teaches an important point:

Electron is loading the same React app that the browser can load.
#### Check 3: Closing the Electron window should stop the development command

Because you used:

```json
"desktop": "concurrently -k \"npm run dev\" \"npm run electron\""
```

when Electron exits, concurrently should also stop Vite.

If the port remains occupied later, it means one Vite process is still running and needs to be closed.

### 7. Implementation Status

Milestone 2 implementation status:

```text
Install Electron                    Done
Create electron/main.js              Done
Create electron/preload.js           Done
Create secure BrowserWindow          Done
Load Vite app in Electron dev mode   Done
Keep nodeIntegration disabled        Done
Keep contextIsolation enabled        Done
Add npm desktop scripts              Done
Do not start FastAPI yet             Respected
Do not package app yet               Respected
Do not build hotel features yet      Respected
```
### 8. Code Walkthrough Summary

The most important Milestone 2 code is this:

```javascript
webPreferences: {
  preload: path.join(__dirname, "preload.js"),
  nodeIntegration: false,
  contextIsolation: true,
}
```

This means:

React cannot directly use Node.js.
React cannot directly access Electron internals.
Any future desktop access must go through preload safely.

That is the correct security posture.

### 9. Debugging Tips

Keep these commands in your notes.

If port 5173 is stuck:

```powershell
netstat -ano | findstr :5173
```

Then kill the PID:

```powershell
taskkill /PID <PID> /F
```

If you want to debug separately:

##### Terminal 1:

```powershell
npm run dev
```

##### Terminal 2:

```powershell
npm run electron
```

This separation is useful because it tells you whether the issue is Vite or Electron.

### 10. Common Mistakes Avoided

You correctly avoided these beginner mistakes:

You did not enable nodeIntegration.
You did not disable contextIsolation.
You did not add hotel logic to Electron.
You did not start FastAPI from Electron yet.
You did not package too early.
You did not add routing/auth/features too early.

That is good engineering discipline.

### 11. Alternative Approaches

Later, we may improve the dev script to be more cross-platform and avoid shell differences like &&.

For now, your working setup is acceptable because the milestone goal is learning Electron basics, not perfecting build tooling yet.

### 12. Industry Best Practices

Your current Electron shell follows the right early production pattern:

Minimal main process
Empty preload until needed
Secure BrowserWindow defaults
React kept as renderer
Backend kept separate
No premature packaging

This is exactly how a maintainable Electron app should begin.

### 13. Summary

Milestone 2 is now functionally complete.

You successfully launched:

```text
HelloStay React frontend inside an Electron desktop window
```

The current architecture is:

```text
Electron wraps
React renders
FastAPI decides
SQLite stores
```
### 14. Suggested Next Step

Before starting Milestone 3, document this as Frontend AD 2: Electron Desktop Shell Setup, matching your milestone numbering.
