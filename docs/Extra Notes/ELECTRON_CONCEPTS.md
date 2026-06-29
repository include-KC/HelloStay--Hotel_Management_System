# HelloStay Electron Concepts
>Purpose
This document stores Electron/desktop technical concepts learned while building HelloStay.

---

## BrowserWindow Creation
>Definition
The `BrowserWindow` constructor in Electron's main process creates a native OS window that hosts web content (HTML/CSS/JS).

>Purpose
Desktop apps need a native window container. BrowserWindow provides title bars, sizing, native menus, and web content rendering via Chromium.

>Syntax Example
```js
const { BrowserWindow } = require('electron');

function createWindow() {
    const win = new BrowserWindow({
        width: 1200,
        height: 800,
        title: "HelloStay Desktop",
        webPreferences: {
            nodeIntegration: false,
            preload: path.join(__dirname, 'preload.js'),
        }
    });
    win.loadURL('http://localhost:5173');
}
```

>Industry Practice
- Set `nodeIntegration: false` for security (prevents renderer from accessing Node.js APIs)
- Always use a preload script to expose specific APIs via `contextBridge`
- Specify reasonable default window dimensions (1200x800 is a good standard)
- Use `win.loadURL()` for dev and `win.loadFile()` for production builds
- Store the window reference in a variable to prevent garbage collection

>Common Mistakes
- Leaving `nodeIntegration: true` — security vulnerability, renderer can run arbitrary Node code
- Not using a preload script — no way to safely expose Electron APIs to the renderer
- Calling `loadURL` with an unreachable URL — app shows a blank white screen
- Not preventing garbage collection — window closes immediately after creation

>HelloStay Usage
In `electron/main.js`. Creates a 1200x800 window titled "HelloStay Desktop" that loads the Vite dev server at `http://localhost:5173`. Node integration is disabled.

---

## Preload Script & contextBridge
>Definition
A preload script runs in a privileged context between Node.js and the renderer process. It uses `contextBridge.exposeInMainWorld()` to safely expose specific Electron/Native APIs to the browser window.

>Purpose
To bridge the gap between Electron's main process (Node.js) and the renderer process (browser). Without the preload, the renderer has no access to OS-level features. The preload selectively exposes only the APIs the app needs.

>Syntax Example
```js
// preload.js
const { contextBridge } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    platform: process.platform,
});
```

>Industry Practice
- Always use `contextBridge` — never use `window.require()` in the renderer
- Expose only the minimum necessary APIs (principle of least privilege)
- Name the exposed object descriptively (e.g., `electronAPI`, `desktopAPI`)
- Use TypeScript or JSDoc to type the exposed API for frontend consumption
- For IPC, expose async wrapper functions that call `ipcRenderer.invoke()`

>Common Mistakes
- Exposing `ipcRenderer.send()` directly — any renderer code can send arbitrary IPC messages
- Using `contextIsolation: false` — defeats the security model entirely
- Not calling `contextBridge` inside the preload — the renderer has no access to Node APIs
- Exposing process.env — leaks environment variables to the browser

>HelloStay Usage
In `electron/preload.js`. Exposes `window.electronAPI.platform` (the OS platform string). No IPC channels are currently exposed — the app doesn't yet use any Electron-specific features.

---

## Electron App Lifecycle
>Definition
Electron's `app` module controls the application lifecycle with events like `ready`, `window-all-closed`, and `activate`.

>Purpose
To handle OS-level events: create the window when the app starts, quit when all windows close (non-macOS), or reopen a window when the dock icon is clicked (macOS).

>Syntax Example
```js
const { app, BrowserWindow } = require('electron');

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
```

>Industry Practice
- Use `app.whenReady()` (Promise-based) instead of `app.on('ready')` (callback-based)
- On macOS, keep the app running when all windows close (standard Mac behavior)
- On Windows/Linux, quit the app when all windows close (standard behavior)
- Register lifecycle event handlers before calling `app.whenReady()`
- Handle `activate` event on macOS to recreate the window if none exists

>Common Mistakes
- Not checking `process.platform !== 'darwin'` — app doesn't quit on Windows
- Calling `app.quit()` unconditionally — macOS users expect to keep the app in Dock
- Calling `BrowserWindow` creation before `app.whenReady()` — crashes

>HelloStay Usage
In `electron/main.js`. App quits on Windows/Linux when window closes. macOS keeps the app alive (no `activate` handler yet).

---

## Electron Project Structure
>Definition
The Electron shell lives in a separate `electron/` directory with its own `package.json`, separate from the Vite/React frontend.

>Directory Layout
```
HelloStay/
├── electron/                  # Electron wrapper (standalone)
│   ├── package.json           # Electron dependency & start script
│   ├── main.js                # Main process (BrowserWindow, lifecycle)
│   └── preload.js             # contextBridge API exposure
├── frontend/                  # Vite + React app
│   └── package.json           # No Electron scripts
└── backend/                   # FastAPI server
```

>Purpose
Keeping Electron in a separate directory avoids mixing Electron dependencies with frontend dependencies. The Electron package uses CommonJS (`"type": "commonjs"`) while the Vite frontend uses ESM/JSX.

>Industry Practice
- Keep Electron as a thin shell — all UI logic stays in the web app
- Use `"type": "commonjs"` in electron's package.json for `require()` syntax
- For production, bundle the frontend build and have Electron load the static files
- Use tools like electron-builder for packaging/distribution

>Common Mistakes
- Putting Electron in the same package.json as the frontend — dependency conflicts
- Not setting `"type": "commonjs"` — Electron's `require()` syntax fails in ESM mode
- Electron depending on React dev dependencies — unnecessary bloat

>HelloStay Usage
The `electron/` directory has its own `package.json` with `electron ^42.4.1` as the only dependency. The frontend's `package.json` has no Electron references. The app is launched by running `npm start` from the `electron/` directory.

---

## Electron Version 42.x
>Definition
Electron 42 is a relatively recent major version (released ~2025) that runs on Chromium equivalent to Chrome ~130+. The exact version used is `^42.4.1`.

>Purpose
Provides the latest Chromium rendering engine, security fixes, and modern web API support for the desktop app. The caret (`^`) allows minor/patch updates.

>Industry Practice
- Pin Electron major version for stability (e.g., `^42.0.0`)
- Test new Electron versions before upgrading — breaking changes in Chromium can affect the app
- Use the Electron release timeline to plan upgrades

>Common Mistakes
- Using `*` or no version constraint — gets latest major, which may break compatibility
- Not updating Electron — misses security patches and web API improvements
- Assuming features from newer Chromium work in older Electron versions

>HelloStay Usage
`electron/package.json` specifies `"electron": "^42.4.1"`. This is a modern version that supports all features used by the Vite/React frontend.
