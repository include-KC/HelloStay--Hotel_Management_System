# M5 - Complete Notes

# Milestone 5: Frontend-to-Backend Communication Infrastructure

## 1. Milestone Scope

Milestone 5 is **infrastructure only**.

The goal is to introduce a clean, reusable way for the React frontend to communicate with the FastAPI backend.

This milestone does **not** build hotel features yet.

## 2. Important Milestone Decision

For Milestone 5, use only these backend endpoints:

- `/`
- `/system-info`

Do **not** create or use feature services for:

- Rooms
- Guests
- Stays
- Bookings

Do **not** create these yet:

- `roomService.js`
- `guestService.js`
- `stayService.js`
- `bookingService.js`
- `financeService.js`
- `historyService.js`

These belong to future feature milestones.

---

# 3. Objective

Milestone 5 introduces frontend-to-backend communication infrastructure for HelloStay.

The goal is not to build hotel features yet. The goal is to create a clean, reusable way for React to talk to FastAPI.

By the end of this milestone, the frontend should have:

```txt
frontend/
  src/
    services/
      apiClient.js
      systemService.js
```

The React renderer will call the backend through a reusable API client.

Electron will stay separate.

FastAPI will remain the source of truth for:

- Validation
- Business rules
- Database work
- API contracts

The backend already exposes:

- A safe root health endpoint: `/`
- CORS support for the React dev origin: `http://localhost:5173`
- Routers for system info, rooms, guests, stays, and guest-stays

For Milestone 5, only the root health endpoint and optionally `/system-info` are used.

---

# 4. Problem Analysis

The React app can already:

- Render screens
- Route between pages
- Use shared UI components

But it does not yet know how to communicate with the backend.

A beginner mistake would be doing this directly inside every component:

```js
fetch("http://127.0.0.1:8000/rooms");
```

That looks simple, but it becomes messy quickly.

## Problems With Scattered API Calls

- `LoginPage.jsx` fetches one way
- `RoomsPage.jsx` fetches another way
- `GuestsPage.jsx` handles errors differently
- `DashboardPage.jsx` forgets loading state
- Some files use `localhost`
- Other files use `127.0.0.1`
- Auth token logic gets duplicated everywhere

## Correct Approach

Create one shared API client:

```txt
apiClient.js
```

The API client becomes the frontend’s single communication gateway:

```txt
React Page
   ↓
Service file
   ↓
apiClient.js
   ↓
FastAPI backend
   ↓
SQLite database
```

FastAPI remains responsible for backend rules.

React only asks for data and displays results.

---

# 5. High-Level Design

## Milestone 5 Design

```txt
React renderer process
│
├── pages/
│   └── LoginPage.jsx or StartPage.jsx
│       Temporary debug UI only
│
├── services/
│   ├── apiClient.js
│   │   Shared low-level request logic
│   │
│   └── systemService.js
│       Safe backend health/system calls
│
└── Electron main process
    No hotel API logic here
```

## Responsibility Separation

| Layer | Responsibility |
|---|---|
| React page | Shows UI, handles button click, loading state, error message |
| Service file | Describes a backend capability, for example `getBackendHealth()` |
| API client | Handles base URL, fetch, JSON parsing, headers, errors |
| FastAPI | Owns business logic, validation, database operations |
| Electron main | Owns desktop window and app lifecycle, not hotel API logic |

## Services Not Created Yet

Even though the backend already has `/rooms` CRUD endpoints, using them now would start feature development too early.

Do not create these in Milestone 5:

- `roomService.js`
- `guestService.js`
- `stayService.js`

---

# 6. Concepts Involved

## What Is an API?

An API is a contract between frontend and backend.

React asks:

```http
GET /system-info
```

FastAPI responds:

```json
[
  {
    "id": 1,
    "application_name": "HelloStay",
    "version": "1.0.0"
  }
]
```

React should not directly access the database.

React should ask FastAPI.

## What Is an API Client?

An API client is a small frontend utility that knows how to send HTTP requests.

Instead of writing this everywhere:

```js
fetch("http://127.0.0.1:8000/system-info");
```

Write this:

```js
apiClient.get("/system-info");
```

This keeps the app consistent.

## HTTP Methods

| Method | Meaning | Hotel Example |
|---|---|---|
| GET | Read data | Get all rooms |
| POST | Create data | Create a guest |
| PUT | Replace/update data | Update room info |
| DELETE | Remove data | Delete a room |

In Milestone 5, mainly test `GET`.

## Request and Response

A request is what React sends to FastAPI.

A response is what FastAPI sends back.

Example request:

```http
GET http://127.0.0.1:8000/
```

Example response:

```http
200 OK
```

```json
{
  "application": "HelloStay",
  "version": "1.0.0",
  "message": "Backend server is running successfully"
}
```

The backend root endpoint already returns this kind of health-check response.

## Status Codes

| Status | Meaning |
|---|---|
| 200 | Success |
| 201 | Created |
| 204 | Success, no response body |
| 400 | Bad request |
| 401 | Not authenticated |
| 403 | Not allowed |
| 404 | Not found |
| 422 | Validation error, common in FastAPI |
| 500 | Backend error |

## JSON

JSON is the common format used to exchange data between frontend and backend.

JavaScript object:

```js
{
  application: "HelloStay"
}
```

JSON string:

```json
{
  "application": "HelloStay"
}
```

The API client will:

- Convert JavaScript objects into JSON when sending data
- Parse JSON when receiving data

## Promise

A Promise means:

> This value is not available yet, but it may be available later.

`fetch()` returns a Promise because network requests take time.

```js
const response = fetch("/system-info");
```

At this point, `response` is not the real response yet. It is a Promise.

## async/await

`async/await` lets asynchronous code be written in a readable way.

```js
const response = await fetch("/system-info");
```

This means:

> Wait until the backend responds, then continue.

But `await` can only be used inside an `async` function:

```js
async function loadSystemInfo() {
  const response = await fetch("/system-info");
}
```

## try/catch

`try/catch` handles failures.

```js
try {
  const data = await getBackendHealth();
} catch (error) {
  console.error(error);
}
```

This is important because the backend might be unavailable.

## Network Error vs Backend Error

These are different.

### Network Error

A network error means React could not reach the backend at all.

Example causes:

- Backend server is not running
- Wrong API base URL
- Port is incorrect
- CORS blocked the request

### Backend Error

A backend error means React reached FastAPI, but FastAPI returned an error.

Examples:

- `404 Room Not Found`
- `422 Validation Error`
- `500 Internal Server Error`

The API client should handle both.

---

# 7. Folder and File Changes

Create this folder:

```txt
frontend/src/services/
```

Create these files:

```txt
frontend/src/services/apiClient.js
frontend/src/services/systemService.js
```

Create this environment file:

```txt
frontend/.env.development
```

Optional temporary debug change:

```txt
frontend/src/pages/LoginPage.jsx
```

or:

```txt
frontend/src/pages/StartPage.jsx
```

The temporary API test UI is only for learning and verification.

---

# 8. Step-by-Step Implementation

## Step 1: Create the Services Folder

In the frontend project root, run:

```powershell
mkdir src\services
```

This creates a dedicated place for frontend API communication files.

If the folder already exists and gives an error, that is okay.

It can also be created manually in VS Code.

Verification:

```txt
frontend/src/services/
```

should now exist.

---

## Step 2: Create Environment Config for the API Base URL

Create this file at the frontend root:

```txt
frontend/.env.development
```

Add:

```env
VITE_API_BASE_URL=http://127.0.0.1:8000
```

Important: in Vite, environment variables exposed to React must start with:

```txt
VITE_
```

This works:

```js
import.meta.env.VITE_API_BASE_URL
```

This does not work in the browser:

```js
import.meta.env.API_BASE_URL
```

## Why the Base URL Belongs in Environment Config

Different environments may need different backend URLs.

| Environment | Possible Backend URL |
|---|---|
| Development | `http://127.0.0.1:8000` |
| Future packaged app | Maybe dynamic/local Electron-managed URL |
| Testing | Could be different |

Do not hardcode the backend URL throughout the app.

After changing `.env.development`, restart Vite because Vite reads env files at startup.

```bash
npm run dev
```

---

## Step 3: Create `apiClient.js`

This file handles:

- Base URL
- Request headers
- JSON body conversion
- Safe JSON parsing
- Network failures
- Backend error responses
- Future auth token attachment

Use the built-in browser `fetch`.

## Why Not Axios Yet?

| Option | Pros | Cons |
|---|---|---|
| fetch | Built into browser, no dependency, good for learning fundamentals | Slightly more manual error handling |
| Axios | Nice defaults, automatic JSON behavior, interceptors | Extra dependency, hides some beginner-level HTTP details |

For Milestone 5, choose `fetch` because the goal is to learn the fundamentals.

---

# 9. Implementation Code

## File: `frontend/src/services/apiClient.js`

```js
const DEFAULT_API_BASE_URL = "http://127.0.0.1:8000";

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || DEFAULT_API_BASE_URL;

export class ApiError extends Error {
  constructor(message, options = {}) {
    super(message);

    this.name = "ApiError";
    this.status = options.status || null;
    this.data = options.data || null;
    this.isNetworkError = options.isNetworkError || false;
    this.cause = options.cause || null;
  }
}

function buildUrl(endpoint) {
  const normalizedBaseUrl = API_BASE_URL.replace(/\/+$/, "");
  const normalizedEndpoint = endpoint.startsWith("/")
    ? endpoint
    : `/${endpoint}`;

  return `${normalizedBaseUrl}${normalizedEndpoint}`;
}

function getAuthToken() {
  // Future milestone:
  // Later, when real authentication is implemented,
  // this function can read the saved access token.
  //
  // For Milestone 5, we intentionally return null.
  return null;
}

async function parseResponseBody(response) {
  if (response.status === 204) {
    return null;
  }

  const contentType = response.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    try {
      return await response.json();
    } catch {
      return null;
    }
  }

  const text = await response.text();
  return text || null;
}

function getErrorMessage(response, data) {
  if (data?.detail) {
    if (Array.isArray(data.detail)) {
      return data.detail
        .map((error) => error.msg || "Validation error")
        .join(", ");
    }

    if (typeof data.detail === "string") {
      return data.detail;
    }
  }

  if (data?.message) {
    return data.message;
  }

  return `Request failed with status ${response.status}`;
}

export async function apiRequest(endpoint, options = {}) {
  const {
    method = "GET",
    body,
    headers = {},
    ...customOptions
  } = options;

  const token = getAuthToken();

  const requestHeaders = {
    Accept: "application/json",
    ...headers,
  };

  if (body !== undefined && !(body instanceof FormData)) {
    requestHeaders["Content-Type"] = "application/json";
  }

  if (token) {
    requestHeaders.Authorization = `Bearer ${token}`;
  }

  const fetchOptions = {
    method,
    headers: requestHeaders,
    ...customOptions,
  };

  if (body !== undefined) {
    fetchOptions.body = body instanceof FormData ? body : JSON.stringify(body);
  }

  let response;

  try {
    response = await fetch(buildUrl(endpoint), fetchOptions);
  } catch (error) {
    throw new ApiError(
      "Cannot connect to HelloStay backend. Please make sure the backend server is running.",
      {
        isNetworkError: true,
        cause: error,
      }
    );
  }

  const data = await parseResponseBody(response);

  if (!response.ok) {
    throw new ApiError(getErrorMessage(response, data), {
      status: response.status,
      data,
    });
  }

  return data;
}

export const apiClient = {
  get(endpoint, options = {}) {
    return apiRequest(endpoint, {
      ...options,
      method: "GET",
    });
  },

  post(endpoint, body, options = {}) {
    return apiRequest(endpoint, {
      ...options,
      method: "POST",
      body,
    });
  },

  put(endpoint, body, options = {}) {
    return apiRequest(endpoint, {
      ...options,
      method: "PUT",
      body,
    });
  },

  delete(endpoint, options = {}) {
    return apiRequest(endpoint, {
      ...options,
      method: "DELETE",
    });
  },
};
```

---

## Step 4: Create `systemService.js`

This service is safe because it does not create rooms, guests, stays, or bookings.

It only tests backend communication.

## File: `frontend/src/services/systemService.js`

```js
import { apiClient } from "./apiClient";

export function getBackendHealth() {
  return apiClient.get("/");
}

export function getSystemInfo() {
  return apiClient.get("/system-info");
}
```

The backend already has `/system-info`, which queries `SystemInfo` records and returns:

- `id`
- `application_name`
- `version`

---

# 10. Temporary API Test UI

Use this only as learning/debug UI.

Recommended location:

```txt
frontend/src/pages/LoginPage.jsx
```

Reason:

- Login is where backend communication will matter soon
- Real authentication is not being implemented yet
- The test is clearly temporary

Do not replace the whole page blindly unless instructed.

The important flow is:

```txt
Button click
  ↓
handleTestBackendConnection()
  ↓
systemService.js
  ↓
apiClient.js
  ↓
FastAPI backend
```

---

## Example Temporary LoginPage Test UI

```js
import { useState } from "react";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import Loading from "../components/ui/Loading";
import ErrorMessage from "../components/ui/ErrorMessage";
import { getBackendHealth, getSystemInfo } from "../services/systemService";

function LoginPage() {
  const [healthData, setHealthData] = useState(null);
  const [systemInfo, setSystemInfo] = useState(null);
  const [isTestingApi, setIsTestingApi] = useState(false);
  const [apiError, setApiError] = useState("");

  async function handleTestBackendConnection() {
    setIsTestingApi(true);
    setApiError("");
    setHealthData(null);
    setSystemInfo(null);

    try {
      const health = await getBackendHealth();
      const info = await getSystemInfo();

      setHealthData(health);
      setSystemInfo(info);
    } catch (error) {
      setApiError(error.message);
    } finally {
      setIsTestingApi(false);
    }
  }

  return (
    <main className="page">
      <Card>
        <h1>Login</h1>
        <p>Login form will be implemented in a future milestone.</p>

        <hr />

        <section>
          <h2>Temporary Backend Connection Test</h2>
          <p>
            This is temporary debug UI for Milestone 5 only. It confirms that
            React can communicate with the FastAPI backend.
          </p>

          <Button
            type="button"
            onClick={handleTestBackendConnection}
            disabled={isTestingApi}
          >
            Test Backend Connection
          </Button>

          {isTestingApi && <Loading message="Testing backend connection..." />}

          {apiError && <ErrorMessage message={apiError} />}

          {healthData && (
            <pre>{JSON.stringify(healthData, null, 2)}</pre>
          )}

          {systemInfo && (
            <pre>{JSON.stringify(systemInfo, null, 2)}</pre>
          )}
        </section>
      </Card>
    </main>
  );
}

export default LoginPage;
```

If existing `Button`, `Card`, `Loading`, or `ErrorMessage` components use different prop names, adjust only those props.

---

# 11. Full LoginPage Version Used for Milestone 5 Testing

Replace the current file with this version during the temporary test phase:

```js
import { useState } from "react";
import { Link } from "react-router-dom";

import Button from "../components/ui/Button.jsx";
import Card from "../components/ui/Card.jsx";
import Input from "../components/ui/Input.jsx";
import Loading from "../components/ui/Loading.jsx";
import ErrorMessage from "../components/ui/ErrorMessage.jsx";

import { getBackendHealth, getSystemInfo } from "../services/systemService.js";

function LoginPage() {
  const [healthData, setHealthData] = useState(null);
  const [systemInfo, setSystemInfo] = useState(null);
  const [isTestingApi, setIsTestingApi] = useState(false);
  const [apiError, setApiError] = useState("");

  async function handleTestBackendConnection() {
    setIsTestingApi(true);
    setApiError("");
    setHealthData(null);
    setSystemInfo(null);

    try {
      const health = await getBackendHealth();
      const info = await getSystemInfo();

      setHealthData(health);
      setSystemInfo(info);
    } catch (error) {
      setApiError(error.message);
    } finally {
      setIsTestingApi(false);
    }
  }

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

          <div style={{ marginTop: "32px" }}>
            <h2 className="page-title" style={{ fontSize: "1.25rem" }}>
              Temporary Backend Connection Test
            </h2>

            <p className="page-description">
              This section is only for Milestone 5. It confirms that the React
              renderer can communicate with the FastAPI backend.
            </p>

            <div style={{ display: "grid", gap: "16px", marginTop: "16px" }}>
              <Button
                type="button"
                onClick={handleTestBackendConnection}
                disabled={isTestingApi}
              >
                Test Backend Connection
              </Button>

              {isTestingApi && (
                <Loading message="Testing backend connection..." />
              )}

              {apiError && <ErrorMessage message={apiError} />}

              {healthData && (
                <pre>
                  {JSON.stringify(healthData, null, 2)}
                </pre>
              )}

              {systemInfo && (
                <pre>
                  {JSON.stringify(systemInfo, null, 2)}
                </pre>
              )}
            </div>
          </div>
        </Card>
      </div>
    </main>
  );
}

export default LoginPage;
```

---

# 12. Code Walkthrough

## `API_BASE_URL`

```js
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || DEFAULT_API_BASE_URL;
```

This means:

- Use `VITE_API_BASE_URL` if available
- Otherwise use `http://127.0.0.1:8000`

This is safer than hardcoding the URL everywhere.

## `ApiError`

```js
export class ApiError extends Error
```

This creates a custom error type.

Normal JavaScript errors usually only have:

- `message`

The API error can also store:

- `status`
- `data`
- `isNetworkError`
- `cause`

This helps future screens decide what to show.

Examples:

```txt
Network error:
"Cannot connect to HelloStay backend..."
```

```txt
Backend validation error:
status 422
data.detail = [...]
```

## `buildUrl`

```js
function buildUrl(endpoint) {
  const normalizedBaseUrl = API_BASE_URL.replace(/\/+$/, "");
  const normalizedEndpoint = endpoint.startsWith("/")
    ? endpoint
    : `/${endpoint}`;

  return `${normalizedBaseUrl}${normalizedEndpoint}`;
}
```

This prevents broken URLs.

Example problem:

```txt
Base URL: http://127.0.0.1:8000/
Endpoint: /system-info
Bad result: http://127.0.0.1:8000//system-info
```

`buildUrl()` normalizes this.

## `getAuthToken`

```js
function getAuthToken() {
  return null;
}
```

This prepares the architecture for authentication but does not implement authentication yet.

Later, this may become:

```js
function getAuthToken() {
  return localStorage.getItem("accessToken");
}
```

But that is not part of Milestone 5.

## `parseResponseBody`

```js
if (response.status === 204) {
  return null;
}
```

Some successful API responses have no body.

Then:

```js
const contentType = response.headers.get("content-type") || "";
```

This checks whether the backend actually returned JSON.

This is important because not every backend response is guaranteed to be JSON.

## `try/catch` Around `fetch`

```js
try {
  response = await fetch(buildUrl(endpoint), fetchOptions);
} catch (error) {
  throw new ApiError(...);
}
```

This catches network-level failures.

Examples:

- Backend is off
- Port is wrong
- Computer blocks connection

This does not catch `404` or `422`, because those are real backend responses, not network failures.

## `response.ok`

```js
if (!response.ok) {
  throw new ApiError(...);
}
```

`response.ok` is true for status codes from `200` to `299`.

These are okay:

- `200 OK`
- `201 Created`
- `204 No Content`

These are not okay:

- `400`
- `401`
- `404`
- `422`
- `500`

## `systemService.js`

```js
export function getBackendHealth() {
  return apiClient.get("/");
}
```

This function gives the rest of the frontend a clean name.

Instead of saying:

```js
apiClient.get("/");
```

A page can say:

```js
getBackendHealth();
```

That is more readable.

---

# 13. React State Walkthrough for Temporary Test UI

This import is needed during the temporary test phase:

```js
import { useState } from "react";
```

`useState` lets the component remember changing values.

## API Test State

```js
const [healthData, setHealthData] = useState(null);
const [systemInfo, setSystemInfo] = useState(null);
const [isTestingApi, setIsTestingApi] = useState(false);
const [apiError, setApiError] = useState("");
```

| State | Purpose |
|---|---|
| `healthData` | Stores backend `/` response |
| `systemInfo` | Stores backend `/system-info` response |
| `isTestingApi` | Tracks loading state |
| `apiError` | Stores error message |

## Button Click Handler

```js
async function handleTestBackendConnection() {
```

Because API requests take time, the function must be `async`.

Before the request starts:

```js
setIsTestingApi(true);
setApiError("");
setHealthData(null);
setSystemInfo(null);
```

This:

- Clears old results
- Clears old errors
- Shows loading

Then:

```js
const health = await getBackendHealth();
const info = await getSystemInfo();
```

React calls the service functions.

Then:

```js
setHealthData(health);
setSystemInfo(info);
```

React updates the screen.

If something fails:

```js
catch (error) {
  setApiError(error.message);
}
```

The error message appears through `ErrorMessage`.

Finally:

```js
finally {
  setIsTestingApi(false);
}
```

Loading stops whether the request succeeds or fails.

---

# 14. Debugging Tips

## Problem: Cannot Connect to HelloStay Backend

Check:

- Is FastAPI running?
- Is it running on port `8000`?
- Is `VITE_API_BASE_URL` correct?
- Did you restart Vite after creating `.env.development`?

Common backend command from the backend project root:

```bash
uvicorn app.main:app --reload
```

Use the exact command that matches the backend folder structure.

## Problem: CORS Error in Browser Console

The backend currently allows:

```txt
http://localhost:5173
```

as the React frontend origin.

If React runs on a different port, for example `5174`, CORS may block it.

Check that Vite is still running on:

```txt
http://localhost:5173
```

## Problem: Failed to Fetch

This usually means React could not reach the backend at all.

Open this in the browser:

```txt
http://127.0.0.1:8000/
```

Expected response:

```json
{
  "application": "HelloStay",
  "version": "1.0.0",
  "message": "Backend server is running successfully"
}
```

## Problem: Blank or Empty `/system-info`

That does not necessarily mean the API client is broken.

The `/system-info` endpoint reads rows from the `system_info` table.

If the table has no records, it may return an empty array.

The root `/` health endpoint is safer for confirming that the backend is running.

## Problem: Import Error

Check paths carefully:

```js
import { getBackendHealth } from "../services/systemService";
```

From `pages/LoginPage.jsx`, `../services/systemService` means:

```txt
src/pages/LoginPage.jsx
  go up to src/
  then enter services/
```

---

# 15. Common Mistakes

## Mistake 1: Putting Raw `fetch()` in Every Component

Avoid:

```js
fetch("http://127.0.0.1:8000/rooms");
```

Prefer service functions.

Later:

```js
roomService.getRooms();
```

For now:

```js
getBackendHealth();
```

## Mistake 2: Building Feature Services Too Early

Do not create these yet:

- `roomService.js`
- `guestService.js`
- `stayService.js`
- `bookingService.js`
- `financeService.js`
- `historyService.js`

They will come when their UI milestones begin.

## Mistake 3: Putting API Logic in Electron Main Process

Do not do this:

```txt
electron/main.js talks to /rooms
```

Electron main should not own hotel workflows.

Correct separation:

```txt
Electron main:
  desktop shell, window, lifecycle

React renderer:
  UI and API service calls

FastAPI:
  hotel logic and database
```

## Mistake 4: Assuming Every Response Has JSON

Some responses may be:

- Empty
- Plain text
- Malformed due to backend errors

That is why responses are safely parsed:

```js
parseResponseBody(response)
```

## Mistake 5: Implementing Auth Token Storage Now

This is prepared:

```js
function getAuthToken() {
  return null;
}
```

But tokens are not stored yet.

Authentication deserves its own milestone.

## Mistake 6: Forgetting to Restart Vite

After adding:

```env
VITE_API_BASE_URL=http://127.0.0.1:8000
```

Restart:

```bash
npm run dev
```

## Mistake 7: Turning This Into Real Login

Do not make the login button active yet.

Keep:

```jsx
<Button disabled>Login later</Button>
```

Authentication will be its own milestone.

---

# 16. Alternative Approaches

## Alternative 1: Axios

Axios would allow:

```js
axios.get("/system-info");
```

It has useful features:

- Interceptors
- Default base URLs
- Automatic JSON handling

But for HelloStay right now, `fetch` is better because:

- No extra package
- HTTP fundamentals are easier to see
- Errors, headers, JSON, and status codes are learned manually
- The app stays simple

Axios can be introduced later if the app grows complex.

## Alternative 2: React Query / TanStack Query

React Query is excellent for:

- Caching
- Loading states
- Background refetching
- Server state management
- Pagination
- Deduplication

But it is too early for Milestone 5.

First, understand plain API communication.

Later, when Rooms, Guests, Stays, and Dashboard need real server-state behavior, React Query may become useful.

## Alternative 3: API Calls Through Electron IPC

Some desktop apps route requests through Electron IPC.

For HelloStay, do not do that now.

Why:

- React already runs in a browser-like renderer
- FastAPI is an HTTP backend
- The renderer can safely call FastAPI over HTTP
- Electron main should not become a middleman for hotel business logic

Later, Electron may help start the backend process or provide a dynamic local backend URL, but it should not own the hotel API logic.

## Alternative 4: Test From `StartPage.jsx`

The backend could be tested from `StartPage.jsx` instead of `LoginPage.jsx`.

But `LoginPage.jsx` is better here because:

- Login will soon need backend communication
- The test is still clearly temporary
- It keeps `StartPage` clean

A browser-console-only test is also possible, but it teaches less React state handling.

---

# 17. Industry Best Practices

For HelloStay, use these rules:

- One `apiClient.js` for low-level HTTP behavior
- One service file per backend domain, added only when that domain milestone starts
- No raw `fetch` scattered inside page components
- No hotel business logic in React
- No hotel business logic in Electron main
- No auth token logic until the auth milestone
- No feature service files before feature screens exist
- Handle loading, success, and error states explicitly
- Treat FastAPI response models as the frontend contract

Future structure will likely grow like this:

```txt
src/services/
  apiClient.js
  authService.js
  roomService.js
  guestService.js
  stayService.js
  bookingService.js
  financeService.js
  historyService.js
```

For Milestone 5, only add:

```txt
apiClient.js
systemService.js
```

---

# 18. Milestone 5 Verification

## Run Backend

From the backend project, run the FastAPI server.

Usually:

```bash
uvicorn app.main:app --reload
```

Then open:

```txt
http://127.0.0.1:8000/
```

Expected response:

```json
{
  "application": "HelloStay",
  "version": "1.0.0",
  "message": "Backend server is running successfully"
}
```

## Run Frontend

From the frontend project:

```bash
npm run dev
```

Open:

```txt
http://localhost:5173
```

Go to the login page and click:

```txt
Test Backend Connection
```

## Successful Result

Both outputs appear:

```txt
/             → health data
/system-info  → system info data
```

This confirms:

```txt
React renderer
→ systemService.js
→ apiClient.js
→ FastAPI backend
→ response shown in UI
```

---

# 19. Confirmation After Testing

The backend connection test succeeded.

Both outputs were received:

- Health data
- System info

This confirms Milestone 5’s main infrastructure goal:

> React can reach FastAPI through the API client/service layer, not through scattered page-level fetch calls.

The frontend can communicate with the backend safely through the centralized API structure.

---

# 20. Cleanup After Verification

## Should the Temporary Backend Test UI Stay?

For learning, it was useful.

For production-quality code, it should not remain inside the login page.

The login page should not show debug/backend testing tools to hotel users.

## Correct Next Step

Keep:

```txt
src/services/apiClient.js
src/services/systemService.js
.env.development
```

Remove:

```txt
temporary backend test UI from LoginPage.jsx
```

---

# 21. Cleanup Design

After cleanup, the structure should remain:

```txt
frontend/
  .env.development

  src/
    services/
      apiClient.js
      systemService.js

    pages/
      LoginPage.jsx
```

The services stay because they are real infrastructure.

The temporary UI goes away because it was only for verification.

---

# 22. Cleanup Concepts

Temporary testing code is allowed while learning or debugging.

But once its purpose is complete, remove it from user-facing screens.

This is the difference between:

- Development/debug code
- Production application code

The API client is production infrastructure.

The temporary login-page test button is not production UI.

---

# 23. Cleanup File Changes

Do not delete these:

```txt
src/services/apiClient.js
src/services/systemService.js
.env.development
```

Update only:

```txt
src/pages/LoginPage.jsx
```

Remove:

- `useState` import
- `Loading` import
- `ErrorMessage` import
- `getBackendHealth` import
- `getSystemInfo` import
- Temporary backend test state
- `handleTestBackendConnection` function
- Temporary backend test JSX section

---

# 24. Clean `LoginPage.jsx` After Milestone 5 Verification

Use this version after removing the temporary backend test UI:

```js
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
              helperText="Placeholder only. Authentication is not active yet."
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

# 25. Cleanup Verification

After replacing the file:

1. Save `LoginPage.jsx`
2. Keep backend running
3. Keep frontend running
4. Open the app
5. Go to the login page

Expected result:

- Login page still works
- No backend test button appears
- No console import errors appear
- `apiClient.js` still exists
- `systemService.js` still exists

---

# 26. Cleanup Code Walkthrough

Removed:

```js
import { useState } from "react";
```

Reason:

- The login page no longer stores temporary API test state

Removed:

```js
import Loading from "../components/ui/Loading.jsx";
import ErrorMessage from "../components/ui/ErrorMessage.jsx";
```

Reason:

- Temporary loading and error UI are no longer needed here

Removed:

```js
import { getBackendHealth, getSystemInfo } from "../services/systemService.js";
```

Reason:

- The login page should not call backend system diagnostics in normal UI

Do not delete `systemService.js`.

It may be useful later for:

- Startup health check
- Backend availability screen
- Electron startup diagnostics
- Offline backend connection status

---

# 27. Cleanup Debugging Tips

If the page breaks after cleanup, check for:

- Unused imports still present
- Missing closing `</div>`
- Missing closing `</Card>`
- Import path typo
- Button component prop mismatch

In the browser console, unused imports usually do not break the app, but missing imports or broken JSX will.

---

# 28. Final Milestone 5 Summary

Milestone 5 adds the communication foundation between React and FastAPI.

Created:

```txt
src/services/apiClient.js
src/services/systemService.js
```

Also created:

```txt
.env.development
```

Learned:

- What an API client is
- Why API calls should not be scattered inside React components
- How HTTP requests and responses work
- What `GET`, `POST`, `PUT`, and `DELETE` mean
- How status codes work
- How JSON parsing works
- How `async/await` works
- How `try/catch` handles failures
- The difference between network errors and backend errors
- Why FastAPI remains the source of truth
- Why Electron should not contain hotel API service logic
- Why temporary debug UI should be removed after verification

The temporary test UI is allowed only because it verifies infrastructure.

After confirming the connection works, it should be removed from the final login page.

---

# 29. Final Action List

## Initial Implementation

1. Create `.env.development`
2. Create `src/services/apiClient.js`
3. Create `src/services/systemService.js`
4. Update `LoginPage.jsx` with temporary backend test
5. Run backend
6. Run frontend
7. Click `Test Backend Connection`

## After Successful Verification

1. Keep `apiClient.js`
2. Keep `systemService.js`
3. Keep `.env.development`
4. Remove temporary backend test UI from `LoginPage.jsx`
5. Verify the login page still renders correctly
6. Record `AD 5` and `Milestone 5 Notes`

---

# 30. Milestone 5 Status

Milestone 5 is complete.

Confirmed:

```txt
React renderer
→ systemService.js
→ apiClient.js
→ FastAPI backend
→ response shown in UI
```

Final state:

- API communication is centralized
- Backend URL is not scattered everywhere
- Error handling is reusable
- Future auth token attachment has a clear place
- React renderer owns frontend API communication
- Electron main process does not contain hotel API logic
- FastAPI remains the source of truth
- Temporary UI was used only for verification and should be removed
