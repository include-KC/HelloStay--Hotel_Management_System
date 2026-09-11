# M9 - Complete Notes

## Source Context

I’ll treat your uploaded milestone prompt as the active Milestone 9 brief and keep the scope strictly read-only:

- Service layer
- `GET /rooms`
- Loading state
- Error state
- Empty state
- Success UI
- No CRUD

I verified the backend room contract from the uploaded backend files:

- The read endpoint exists as `GET /rooms`.
- It returns a list using `RoomResponse`.
- This makes Milestone 9 safe to build as the first real frontend data-reading module.

**Processing note:** Thought for 57s

---

## 1. Objective

Milestone 9 is the first real hotel module foundation in HelloStay.

### Goal

Build a read-only Rooms page that fetches room data from the FastAPI backend using `GET /rooms`, then displays that data in React.

The uploaded Milestone 9 brief correctly limits the scope to:

- Service creation
- Backend connection
- Loading state
- Error state
- Empty state
- Read-only display only

### Out of Scope

We will not add:

- Create room
- Edit room
- Delete room
- Room forms
- Room modals
- Filtering
- Sorting
- Pagination
- Availability logic
- Booking logic

---

## 2. Problem Analysis

Until Milestone 8, most frontend work was structure:

- Routing
- Auth state
- Protected routes
- Dashboard layout
- Placeholder pages

Milestone 9 is different because `RoomsPage.jsx` will become the first page that reads real backend data.

### Backend Endpoint

The backend already exposes this endpoint:

```http
GET /rooms
```

The uploaded backend route confirms that `GET /rooms` returns all room records using:

```python
response_model=list[RoomResponse]
```

### Backend Room Response Fields

The backend room response includes fields such as:

- `id`
- `room_number`
- `price_per_night`
- `room_status`
- `room_type`
- `max_occupancy`
- `facilities`

The uploaded schema confirms these fields in `RoomResponse`.

### CORS

The FastAPI app already allows the React dev server origin:

```txt
http://localhost:5173
```

This means the browser is allowed to call the backend during development.

---

## 3. High-Level Design

### Data Flow for Milestone 9

```txt
RoomsPage.jsx
   |
   | calls getRooms()
   v
roomService.js
   |
   | calls apiClient.js
   v
FastAPI backend
   |
   | GET /rooms
   v
SQLite database
```

### Responsibility Separation

#### FastAPI

- Owns room data
- Validates backend data
- Queries database
- Exposes `GET /rooms`

#### React

- Asks for rooms
- Stores fetched rooms in state
- Shows loading/error/empty/success UI

#### Electron

- Does not fetch rooms
- Does not contain room business logic
- Only provides desktop shell

---

## 4. Concepts Involved

### What “Read-Only Foundation” Means

Read-only means the frontend can view room data, but cannot change it.

This milestone teaches:

- `GET` data
- Display data
- Handle loading
- Handle errors
- Handle empty lists

It does not teach mutation yet:

- `POST`
- `PUT`
- `DELETE`
- Forms
- Validation
- Optimistic updates

This is how professional apps are often built:

1. First prove that the frontend can safely read backend data.
2. Then add write operations later.

### Why Rooms Is the First Real Module

Rooms is a good first module because it is a core hotel resource.

Most later modules depend on rooms:

- Rooms → Stays
- Rooms → Bookings
- Rooms → Occupancy
- Rooms → Finance calculations
- Rooms → History

Before building booking or stay workflows, the frontend must be able to display rooms reliably.

### What a Service File Does

A service file is a small JavaScript module that contains API-related functions.

Instead of writing this directly inside `RoomsPage.jsx`:

```js
fetch("http://localhost:8000/rooms")
```

Create:

```js
getRooms()
```

inside:

```txt
src/services/roomService.js
```

This keeps the page clean.

### Responsibility Rule

- The page should focus on UI.
- The service should focus on backend communication.

### Why `useEffect` Is Used

React renders UI first.

Then `useEffect` runs after the component appears on screen.

That makes it useful for work like:

- Fetch data
- Subscribe to something
- Read from browser APIs
- Connect to external systems

For Milestone 9, we use `useEffect` because loading rooms is a side effect.

A side effect means something happens outside normal JSX rendering.

### Why `useEffect` Should Not Be Directly Async

Do not write:

```jsx
useEffect(async () => {
  const rooms = await getRooms();
}, []);
```

An async function always returns a Promise.

React expects the effect callback to return either:

- Nothing
- A cleanup function

The correct beginner-friendly pattern is:

```jsx
useEffect(() => {
  async function loadRooms() {
    const rooms = await getRooms();
  }

  loadRooms();
}, []);
```

---

## 5. Folder/File Changes

For this milestone, change only these files:

```txt
frontend/
  src/
    services/
      roomService.js        ← new file

    pages/
      RoomsPage.jsx         ← update existing placeholder

    styles/
      global.css            ← optional small CSS addition
```

Do not change:

- Electron files
- Backend files
- Auth logic

---

## 6. Step-by-Step Explanation

### Step 1 — Review `apiClient.js`

Before creating `roomService.js`, open:

```txt
frontend/src/services/apiClient.js
```

You are checking for one thing:

> Does it already provide a reusable function for API requests?

It may look something like this:

```js
export async function apiRequest(path, options = {}) {
  // common fetch logic
}
```

Or:

```js
const apiClient = {
  get(path) {
    // common fetch logic
  },
};
```

Use whatever pattern you already created in Milestone 5.

Do not duplicate the base URL inside `roomService.js` if `apiClient.js` already owns it.

### Step 2 — Create `roomService.js`

Create this file:

```txt
frontend/src/services/roomService.js
```

#### Recommended version if `apiClient.js` exports `apiRequest`

```js
import { apiRequest } from "./apiClient";

export async function getRooms() {
  const rooms = await apiRequest("/rooms");

  if (!Array.isArray(rooms)) {
    return [];
  }

  return rooms;
}
```

#### Alternative version if `apiClient.js` uses a default export like `apiClient.get()`

```js
import apiClient from "./apiClient";

export async function getRooms() {
  const rooms = await apiClient.get("/rooms");

  if (!Array.isArray(rooms)) {
    return [];
  }

  return rooms;
}
```

Use only one version based on your existing `apiClient.js`.

### Architectural Rule

- `RoomsPage.jsx` should not know the raw endpoint details.
- `roomService.js` should know the endpoint.
- `apiClient.js` should know the base URL and common request behavior.

---

## 7. Implementation

### Update `RoomsPage.jsx`

Replace the placeholder content in:

```txt
frontend/src/pages/RoomsPage.jsx
```

with this:

```jsx
import { useEffect, useState } from "react";

import Card from "../components/ui/Card.jsx";
import Loading from "../components/ui/Loading.jsx";
import ErrorMessage from "../components/ui/ErrorMessage.jsx";
import { getRooms } from "../services/roomService.js";

function RoomsPage() {
  const [rooms, setRooms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isComponentActive = true;

    async function loadRooms() {
      try {
        setIsLoading(true);
        setError("");

        const roomData = await getRooms();

        if (isComponentActive) {
          setRooms(roomData);
        }
      } catch (err) {
        if (isComponentActive) {
          setError(err.message || "Unable to load rooms.");
        }
      } finally {
        if (isComponentActive) {
          setIsLoading(false);
        }
      }
    }

    loadRooms();

    return () => {
      isComponentActive = false;
    };
  }, []);

  return (
    <main className="rooms-page">
      <div className="rooms-header">
        <div>
          <h1 className="page-title">Rooms</h1>
          <p className="page-description">
            View all rooms currently registered in HelloStay.
          </p>
        </div>
      </div>

      {isLoading && <Loading message="Loading rooms..." />}

      {!isLoading && error && (
        <ErrorMessage message={error} />
      )}

      {!isLoading && !error && rooms.length === 0 && (
        <Card>
          <h2>No rooms found</h2>
          <p className="page-description">
            No rooms are available in the system yet. Room creation will be
            added in a later milestone.
          </p>
        </Card>
      )}

      {!isLoading && !error && rooms.length > 0 && (
        <div className="rooms-grid">
          {rooms.map((room) => (
            <Card key={room.id}>
              <div className="room-card-header">
                <div>
                  <h2 className="room-title">Room {room.room_number}</h2>
                  <p className="room-subtitle">
                    {room.room_type || "Room type not set"}
                  </p>
                </div>

                <span className="room-status">
                  {room.room_status}
                </span>
              </div>

              <dl className="room-details">
                <div>
                  <dt>Price per night</dt>
                  <dd>{room.price_per_night}</dd>
                </div>

                <div>
                  <dt>Max occupancy</dt>
                  <dd>{room.max_occupancy ?? "Not set"}</dd>
                </div>

                <div>
                  <dt>Facilities</dt>
                  <dd>{room.facilities || "No facilities listed"}</dd>
                </div>
              </dl>
            </Card>
          ))}
        </div>
      )}
    </main>
  );
}

export default RoomsPage;
```

### Add Small CSS to `global.css`

Append this to the bottom of:

```txt
frontend/src/styles/global.css
```

Do not replace your existing CSS.

```css
.rooms-page {
  display: grid;
  gap: 24px;
}

.rooms-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
}

.rooms-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 16px;
}

.room-card-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 20px;
}

.room-title {
  margin: 0;
  font-size: 20px;
  color: #172033;
}

.room-subtitle {
  margin: 6px 0 0;
  color: #667085;
}

.room-status {
  border-radius: 999px;
  padding: 6px 10px;
  background: #eef2ff;
  color: #3538cd;
  font-size: 13px;
  font-weight: 600;
  white-space: nowrap;
}

.room-details {
  display: grid;
  gap: 14px;
  margin: 0;
}

.room-details div {
  display: grid;
  gap: 4px;
}

.room-details dt {
  color: #667085;
  font-size: 13px;
}

.room-details dd {
  margin: 0;
  color: #172033;
  font-weight: 600;
}
```

---

## 8. Code Walkthrough

### Imports

```jsx
import { useEffect, useState } from "react";
```

`useState` stores changing component data.

### Component State

The page has three pieces of state:

```jsx
const [rooms, setRooms] = useState([]);
const [isLoading, setIsLoading] = useState(true);
const [error, setError] = useState("");
```

Meaning:

| State | Meaning |
|---|---|
| `rooms` | Actual room data from backend |
| `isLoading` | Whether the request is still running |
| `error` | Error message if the request fails |

### Effect

```jsx
useEffect(() => {
  ...
}, []);
```

The empty dependency array means:

> Run this effect once when `RoomsPage` first loads.

That is exactly what we want for a basic list page.

### Load Function

```jsx
async function loadRooms() {
  ...
}
```

This function performs the actual API call.

It is inside `useEffect` because the data fetch belongs to this page load behavior.

### Service Call

```jsx
const roomData = await getRooms();
```

This calls your service function.

The page does not call `/rooms` directly.

That is good architecture because later, if the endpoint changes, you update the service file, not every page.

### Error Handling

```jsx
catch (err) {
  if (isComponentActive) {
    setError(err.message || "Unable to load rooms.");
  }
}
```

This handles:

- Backend errors
- CORS errors
- Server-down errors
- Failed JSON parsing errors

A production UI should never silently fail.

### Loading UI

```jsx
{isLoading && <Loading message="Loading rooms..." />}
```

This displays loading UI while the request is running.

### Error UI

```jsx
{!isLoading && error && <ErrorMessage message={error} />}
```

This displays an error only after loading is finished.

### Empty State

```jsx
{!isLoading && !error && rooms.length === 0 && (...)}
```

This is the empty state.

Empty state is not an error.

It means the request worked, but the backend returned:

```json
[]
```

### Success State

```jsx
{!isLoading && !error && rooms.length > 0 && (...)}
```

This is the success state.

It displays room cards.

---

## 9. Debugging Tips

### Verify Backend First

From your backend folder, run the command you normally use, likely:

```bash
uvicorn app.main:app --reload
```

Then open Swagger UI:

```txt
http://localhost:8000/docs
```

Test:

```http
GET /rooms
```

Expected result:

```json
[
  {
    "id": 1,
    "room_number": "101",
    "price_per_night": "1200.00",
    "room_status": "Available",
    "room_type": "Deluxe",
    "max_occupancy": 2,
    "facilities": "WiFi, AC"
  }
]
```

The exact values depend on your database.

### Verify Frontend Request

Run the frontend:

```bash
npm run dev
```

Then go to:

```txt
Dashboard → Rooms
```

Open browser DevTools:

```txt
Right click → Inspect → Network tab
```

Refresh the Rooms page.

Look for:

```http
GET /rooms
```

Check:

- Status: `200`
- Response: list of rooms

### If You Get a CORS Error

Check that frontend is running on:

```txt
http://localhost:5173
```

Your backend CORS currently allows this origin.

If React runs on a different port, the backend may block the request.

### If You Get “Failed to Fetch”

Usually one of these is true:

- Backend is not running
- Backend URL is wrong in `apiClient.js`
- CORS origin does not match
- FastAPI crashed
- Network request is blocked

### If the Page Stays Loading Forever

Check whether this line runs in `finally`:

```jsx
setIsLoading(false);
```

If loading never becomes false, your request may be hanging or your `finally` block may be missing.

---

## 10. Common Mistakes

### Mistake 1 — Calling `fetch` Directly Inside `RoomsPage.jsx`

Avoid this:

```js
fetch("http://localhost:8000/rooms");
```

Reason:

- It spreads API details across UI files.

Use:

```js
getRooms();
```

### Mistake 2 — Making `useEffect` Directly Async

Avoid this:

```jsx
useEffect(async () => {
  await getRooms();
}, []);
```

Use this:

```jsx
useEffect(() => {
  async function loadRooms() {
    await getRooms();
  }

  loadRooms();
}, []);
```

### Mistake 3 — Treating Empty Rooms as an Error

This is not an error:

```json
[]
```

It means:

> The backend worked, but there are no room records yet.

### Mistake 4 — Adding CRUD Too Early

Do not add buttons like:

- Add Room
- Edit
- Delete
- Change Status

Those belong to later milestones.

Milestone 9 is about safe reading.

### Mistake 5 — Moving Room Logic into Electron

Electron should not call:

```http
GET /rooms
```

React can call FastAPI through the service layer.

FastAPI remains the source of truth.

Electron remains the desktop shell.

---

## 11. Alternative Approaches

### Approach A — Fetch Directly in Page

Simple, but not recommended for HelloStay.

```js
const response = await fetch("/rooms");
```

Problem:

- API logic gets mixed with UI logic.

### Approach B — Use Service File

Recommended for this milestone.

```js
const rooms = await getRooms();
```

Benefits:

- Good balance of simplicity and maintainability

### Approach C — Use Custom Hook

Example:

```js
useRooms()
```

This can be useful later, but it is too early now.

For Milestone 9, keep the logic inside `RoomsPage.jsx`.

Later, if multiple components need room data, we can extract a hook.

### Approach D — Use React Query / TanStack Query

Professional apps often use it for server state.

But for the current learning stage, it would hide too much.

Right now, you should understand:

- `useState`
- `useEffect`
- Loading
- Error
- Empty
- Success
- Service layer

before adding a data-fetching library.

---

## 12. Industry Best Practices

For this milestone, the professional practice is:

- Page owns UI state.
- Service owns API endpoint.
- `apiClient` owns base URL and common request behavior.
- Backend owns validation and database access.
- Electron owns desktop shell only.

A clean module starts small:

1. Read list first.
2. Then read single item.
3. Then create.
4. Then update.
5. Then delete.
6. Then advanced UI.

This avoids building complicated forms before confirming that the frontend and backend can communicate correctly.

Also, always design list pages with four states:

- Loading
- Error
- Empty
- Success

A page that only handles success is not production-ready.

---

## 13. Summary

In Milestone 9, you are adding the first real backend-connected frontend module.

You will create:

```txt
src/services/roomService.js
```

You will update:

```txt
src/pages/RoomsPage.jsx
```

You may append small styles to:

```txt
src/styles/global.css
```

The result should be:

```txt
Dashboard → Rooms → fetches GET /rooms → displays room cards
```

No create, edit, delete, forms, modals, pagination, or booking availability yet.

---

## 14. Small Quiz

1. Why should `RoomsPage.jsx` call `getRooms()` instead of calling `fetch("/rooms")` directly?
2. Why do we need separate loading, error, empty, and success UI states?
3. Why should `useEffect` not be written as an async function directly?
4. What is the difference between frontend route protection and backend API security?
5. Why should Electron not contain room-fetching logic?

---

## 15. Suggested Next Step

Implement `roomService.js` first.

Then update `RoomsPage.jsx`.

Then test `GET /rooms` from the browser Network tab.

After Milestone 9 works, the next milestone should be:

> Milestone 10 — Rooms Module Create Room Foundation

In Milestone 10, we add the first controlled room form and connect it to:

```http
POST /rooms
```

---

## 16. `apiRequest` Confirmation

The `apiRequest` function confirms the Step 1 approach.

Because `apiClient.js` has:

```js
export async function apiRequest(endpoint, options = {}) {
```

`roomService.js` should import it like this:

```js
import { apiRequest } from "./apiClient";

export async function getRooms() {
  const rooms = await apiRequest("/rooms");

  if (!Array.isArray(rooms)) {
    return [];
  }

  return rooms;
}
```

### Why This Confirms Step 1

`apiClient.js` is already acting as the shared API helper.

That means `apiClient.js` owns the common request logic, such as:

- Base URL
- HTTP method
- Headers
- JSON body handling
- Error handling
- Response parsing

Then `roomService.js` only needs to say:

> For rooms, call `/rooms`.

And `RoomsPage.jsx` only needs to say:

> Give me rooms.

### Clean Structure

```txt
RoomsPage.jsx
   calls getRooms()

roomService.js
   calls apiRequest("/rooms")

apiClient.js
   handles fetch details
```

### Version to Use for the Current Setup

```js
import { apiRequest } from "./apiClient";

export async function getRooms() {
  const rooms = await apiRequest("/rooms");

  if (!Array.isArray(rooms)) {
    return [];
  }

  return rooms;
}
```
