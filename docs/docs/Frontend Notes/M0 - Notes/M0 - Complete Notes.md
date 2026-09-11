# M0 - Complete Notes

## Source Context

### User Request

> I have uploaded all the files related to backend in your sources. Now check those files, and proceed ahead.

### Backend Review Finding

The uploaded backend files were reviewed as the actual contract source.

The important finding is that the backend currently exposes:

- Rooms
- Guests
- Stays
- Guest-Stays
- System Info
- Health Check

However, an included authentication router was not found yet.

### Processing Note

Thought for 31s.

---

## Objective

We will now convert the uploaded backend files into a real frontend API contract.

This is an important **Milestone 0** step because we are no longer guessing. We are now designing the frontend from the actual FastAPI backend that exists.

---

## Problem Analysis

After reviewing the uploaded backend files, the current backend exposes these working areas:

- Health check
- System info
- Rooms
- Guests
- Stays
- Guest-stays
- SQLite database session
- JWT/security utilities
- Token schema

The main FastAPI app currently includes these routers:

- `system_info_router`
- `room_router`
- `guest_router`
- `stay_router`
- `guest_stay_router`

It also allows CORS from the React development URL:

```text
http://localhost:5173
```

This fits a Vite React frontend setup.

### Biggest Discovery

The backend has JWT/security helper files, but an authentication router was not seen as included in `main.py`.

The backend has:

- Password hashing utilities
- JWT token creation utilities
- Token schemas with:
  - `access_token`
  - `token_type`

But the uploaded `main.py` does not include something like:

```python
app.include_router(auth_router)
```

So for the current uploaded backend, the V1 login/create-account flow is planned, but not yet fully exposed as an API contract.

### Why This Matters

The V1 design says the app should have:

- Start page
- Login
- Create account
- Dashboard

But with the current uploaded backend, we can only safely integrate:

- Start page
- Backend health check
- System info
- Rooms
- Guests
- Stays
- Guest-stays

Authentication needs either:

- Additional uploaded files, or
- A backend implementation step before connecting the real login/register pages.

---

## High-Level Design

Based on the current backend, the frontend should treat the backend like this:

```text
React Frontend
  ↓
API Client
  ↓
FastAPI Backend
  ↓
SQLAlchemy Models
  ↓
SQLite Database
```

The current business model is not exactly named **Booking** in the backend.

Instead, the backend has:

- `Room`
- `Guest`
- `Stay`
- `GuestStay`

So the actual backend relationship is:

```text
Room
  ↓
Stay
  ↓
GuestStay
  ↓
Guest
```

### Simple Explanation

- A room can have many stays.
- A stay belongs to one room.
- A guest can be linked to a stay.
- `GuestStay` connects guests and stays.

The `GuestStay` table uses:

- `guest_id`
- `stay_id`
- `is_primary_guest`

This means the backend supports multiple guests per stay and can mark one guest as the main guest.

This is a good foundation for hotel operations.

---

## Concepts Involved

## 1. Router

A FastAPI router groups related endpoints.

### Examples

- `/rooms` endpoints belong to the Rooms router.
- `/guests` endpoints belong to the Guests router.
- `/stay` endpoints belong to the Stays router.
- `/guest-stays` endpoints belong to the Guest Stays router.

React should mirror this with service files:

```text
roomsApi.js
guestsApi.js
staysApi.js
guestStaysApi.js
systemApi.js
```

---

## 2. Model

A SQLAlchemy model defines the database table.

### Example: Room Model Fields

The Room model defines fields such as:

- `id`
- `room_number`
- `room_type`
- `price_per_night`
- `max_occupancy`
- `facilities`
- `room_status`

The Room model also has a relationship to stays.

---

## 3. Schema

A Pydantic schema defines what the API accepts and returns.

For frontend work, schemas are extremely important because they tell us the exact field names React must send.

### Example Field Names

- `room_number`
- `price_per_night`
- `room_status`
- `room_type`
- `max_occupancy`
- `facilities`

The frontend must use these exact names, not names like `roomNumber` unless we deliberately map them before sending.

---

# Actual Backend API Contract

## 1. Health Check API

### Endpoint

```http
GET /
```

### Response

```json
{
  "application": "HelloStay",
  "version": "1.0.0",
  "message": "Backend server is running successfully"
}
```

### Frontend Purpose

This should be used by the React Start Page to check whether the backend is running.

### Frontend Use

- `StartPage`
- `BackendStatusIndicator`
- Electron startup check

---

## 2. System Info API

### Endpoint

```http
GET /system-info
```

### Response Shape

```json
[
  {
    "id": 1,
    "application_name": "HelloStay",
    "version": "1.0.0"
  }
]
```

The route queries `SystemInfo` records and returns:

- `id`
- `application_name`
- `version`

### Frontend Use

- Start page footer
- About screen later
- App version display
- Electron splash/startup screen

For V1, this is optional but useful.

---

## 3. Rooms API

The backend exposes full CRUD for rooms.

### Endpoints

| Purpose | Method | Endpoint |
|---|---:|---|
| Create room | `POST` | `/rooms` |
| List rooms | `GET` | `/rooms` |
| Get room by ID | `GET` | `/rooms/{room_id}` |
| Update room | `PUT` | `/rooms/{room_id}` |
| Delete room | `DELETE` | `/rooms/{room_id}` |

### Room Fields

The database model has:

- `id`
- `room_number`
- `room_type`
- `price_per_night`
- `max_occupancy`
- `facilities`
- `room_status`

### Important Field Rules

- `room_number` is unique and required.
- `price_per_night` is required at database level.
- `max_occupancy` is required at database level.
- `room_status` is required at database level.

### Frontend Implication

The Rooms module can be built from the current backend.

For V1, the Rooms screen can support:

- View all rooms
- Create room
- Edit room
- Delete room
- View room details
- Show room status

### Important Backend Issue

There is a possible contract mismatch:

- Room model says `max_occupancy` is `nullable=False`.
- `RoomCreate` schema makes `max_occupancy` optional.

From a frontend perspective, we should treat `max_occupancy` as required because the database requires it.

Otherwise, the form may submit successfully through Pydantic but fail when saving to SQLite.

### Required React Room Form Fields

The React Room Form should require:

- `room_number`
- `price_per_night`
- `max_occupancy`
- `room_status`

---

## 4. Guests API

The backend exposes full CRUD for guests.

### Endpoints

| Purpose | Method | Endpoint |
|---|---:|---|
| Create guest | `POST` | `/guests` |
| List guests | `GET` | `/guests` |
| Get guest by ID | `GET` | `/guests/{guest_id}` |
| Update guest | `PUT` | `/guests/{guest_id}` |
| Delete guest | `DELETE` | `/guests/{guest_id}` |

### Guest Fields

The Guest model has:

- `id`
- `guest_name`
- `guest_phone_number`
- `guest_address`
- `id_proof_type`
- `id_proof_number`

### Important Field Rules

- `guest_phone_number` is unique.
- `id_proof_number` is unique.

### Frontend Implication

The Guests module can be built from the current backend.

For V1, the Guests screen can support:

- View all guests
- Create guest
- Edit guest
- Delete guest
- View guest details

### Guest Form Fields

The guest form should collect:

- Guest name
- Phone number
- Address
- ID proof type
- ID proof number

Because phone number and ID proof number are unique, the frontend must be ready to display backend errors if the user enters duplicates.

---

## 5. Stays API

The backend currently uses `/stay`, not `/bookings`.

### Endpoints

| Purpose | Method | Endpoint |
|---|---:|---|
| Create stay | `POST` | `/stay` |
| List stays | `GET` | `/stay` |
| Get stay by ID | `GET` | `/stay/{stay_id}` |
| Update stay | `PUT` | `/stay/{stay_id}` |
| Delete stay | `DELETE` | `/stay/{stay_id}` |

### Stay Fields

The Stay model has:

- `stay_id`
- `room_id`
- `price_per_night`
- `check_in_datetime`
- `check_out_datetime`
- `stay_status`

A stay belongs to a room through `room_id`.

### Frontend Implication

This is the current backend equivalent of a booking/stay record.

But we must be careful with naming.

Your V1 scope says:

```text
Manages bookings
```

The backend currently says:

```text
Manages stays
```

That means we have two options:

- **Option A:** UI says `Stays`
- **Option B:** UI says `Bookings`, but internally calls `/stay`

For a hotel owner, **Booking** is more familiar when reserving rooms in advance.

But the current backend model looks more like an actual guest stay/check-in record, because `StayCreate` has `check_in_datetime` but not a required planned `check_out_datetime`.

### Recommendation for V1

Use this naming strategy:

- Frontend menu label: `Bookings / Stays`
- Internal service name: `staysApi.js`
- Backend endpoint: `/stay`

Later, when the backend supports real reservations, we can separate:

- Bookings = future reservations
- Stays = actual check-in/check-out records

---

## 6. Guest-Stays API

The backend exposes CRUD for linking guests to stays.

### Endpoints

| Purpose | Method | Endpoint |
|---|---:|---|
| Create guest-stay link | `POST` | `/guest-stays` |
| List guest-stay links | `GET` | `/guest-stays` |
| Get guest-stay by ID | `GET` | `/guest-stays/{guest_stay_id}` |
| Update guest-stay | `PUT` | `/guest-stays/{guest_stay_id}` |
| Delete guest-stay | `DELETE` | `/guest-stays/{guest_stay_id}` |

### GuestStay Fields

- `id`
- `guest_id`
- `stay_id`
- `is_primary_guest`

The database has a unique constraint on the pair of:

- `guest_id`
- `stay_id`

So the same guest cannot be linked to the same stay twice.

### Frontend Implication

The booking/stay creation flow will eventually need two steps:

1. Create stay.
2. Link guest to stay through guest-stays.

### Example Frontend Flow

```text
User selects room
User selects guest
User enters check-in date/time
User enters price/status
Submit
  ↓
POST /stay
  ↓
Backend returns stay_id
  ↓
POST /guest-stays with guest_id + stay_id
```

This is important because there is no single backend endpoint yet that creates a complete booking with guest + room + stay together.

---

# Current Backend Capability Map

| V1 Feature | Backend Ready? | Notes |
|---|---|---|
| Start page | Yes | Use `GET /` health check |
| System info/version | Yes | Use `GET /system-info` |
| Login | Not fully visible | Security utilities exist, but no auth router is included |
| Create account | Not fully visible | No user/auth route found in uploaded `main.py` |
| Dashboard | Partially | Can derive from rooms/stays, but no dashboard summary endpoint |
| Rooms | Yes | CRUD available |
| Guests | Yes | CRUD available |
| Bookings | Partially | Backend has stays, not full booking/reservation workflow |
| History | Partially | Can list stays, but no filtered history endpoint |
| Finance | Partially | Stay has `price_per_night`, but no income summary endpoint |

---

# Correct Frontend Strategy After Backend Review

We should slightly adjust the frontend plan.

## Original Plan Before Backend Review

Before reviewing the files, the plan was:

- Start page
- Login
- Register
- Dashboard
- Rooms
- Guests
- Bookings
- Finance
- History

## Safer Plan After Backend Review

After reviewing the backend, the safer plan is:

1. Milestone 1: React + Electron foundation
2. Milestone 2: Start page + backend health check
3. Milestone 3: Rooms module
4. Milestone 4: Guests module
5. Milestone 5: Stays / Bookings basic flow
6. Milestone 6: Dashboard from available backend data
7. Milestone 7: History from stays
8. Milestone 8: Finance summary, either frontend-derived or backend-supported
9. Milestone 9: Auth integration after backend auth router exists

## Auth Decision Point

Because the V1 design requires login before dashboard, we should decide one thing clearly:

- Do we add the missing auth backend first?
- Or do we build frontend shell with placeholder auth and integrate real auth later?

### Recommendation

Do not fake the auth API.

Build the frontend foundation and Start Page first.

Then either add or confirm backend auth endpoints before implementing Login/Register.

This avoids teaching bad habits like building fake login flows that do not match the backend.

---

# Folder/File Changes

For the frontend, based on the actual backend, the first service layer should be:

```text
src/
  shared/
    services/
      apiClient.js

  features/
    startup/
      services/
        systemApi.js
      pages/
        StartPage.jsx

    rooms/
      services/
        roomsApi.js
      pages/
        RoomsPage.jsx

    guests/
      services/
        guestsApi.js
      pages/
        GuestsPage.jsx

    stays/
      services/
        staysApi.js
      pages/
        StaysPage.jsx

    guestStays/
      services/
        guestStaysApi.js
```

For now, do not create `authApi.js` until the backend auth route is available.

---

# Step-by-Step Explanation

## Step 1: Use the Backend Health Check First

The first real frontend API call should be:

```http
GET /
```

### Why?

Because it teaches the simplest possible integration:

```text
React calls FastAPI
FastAPI responds
React shows backend status
```

This is perfect for the Start Page.

---

## Step 2: Create Central API Client

We should not call this everywhere:

```javascript
fetch("http://localhost:8000/rooms")
```

Instead, we create one shared API client.

Conceptually:

```javascript
apiClient.get("/")
apiClient.get("/rooms")
apiClient.post("/rooms", data)
```

This keeps the frontend clean and prepares us for JWT later.

---

## Step 3: Build Rooms First

Rooms are the cleanest module.

The backend already supports:

- Create
- List
- Detail
- Update
- Delete

So Rooms will teach:

- GET request
- POST request
- PUT request
- DELETE request
- Forms
- Tables
- Loading state
- Error state
- Empty state

This is the best first business module.

---

## Step 4: Build Guests Second

Guests are similar to rooms, but they introduce unique fields:

- `guest_phone_number`
- `id_proof_number`

This teaches how to handle duplicate backend errors.

---

## Step 5: Build Stays / Bookings Third

Stays are more complex because they depend on:

- Rooms
- Guests
- GuestStay linking

So we should not start with bookings.

Correct order:

```text
Rooms → Guests → Stays → GuestStay link flow
```

---

# Implementation

No frontend code yet in this response.

But the next coding milestone should be:

```text
Milestone 1: React + Electron foundation with backend health check
```

The first real implementation should include:

- Electron main process
- Electron preload file
- React app bootstrapping
- `StartPage`
- `systemApi.js`
- `apiClient.js`
- `GET /` health check

This gives us a working desktop shell and proves React can talk to FastAPI.

---

# Code Walkthrough

## Start Page Data Flow

```text
Electron opens app
  ↓
React renders StartPage
  ↓
StartPage calls systemApi.getHealth()
  ↓
systemApi calls apiClient.get("/")
  ↓
FastAPI returns application/version/message
  ↓
StartPage shows "Backend connected"
```

## Rooms Data Flow

```text
RoomsPage loads
  ↓
roomsApi.getRooms()
  ↓
GET /rooms
  ↓
Backend returns list of rooms
  ↓
RoomsPage displays table
```

## Create Stay Data Flow

```text
CreateStayPage
  ↓
User selects room and guest
  ↓
POST /stay
  ↓
Backend returns stay_id
  ↓
POST /guest-stays
  ↓
Guest is linked to stay
```

---

# Debugging Tips

## If the Start Page Cannot Connect to Backend

Check:

- Is FastAPI running?
- Is the backend on the expected port?
- Does browser open `GET /` successfully?
- Is React using the correct base URL?
- Is CORS allowing `localhost:5173`?

Your backend currently allows:

```text
http://localhost:5173
```

So Vite’s default port is already expected.

---

## If Creating a Room Fails

Check:

- Did you send `room_number`?
- Did you send `price_per_night`?
- Did you send `room_status`?
- Did you send `max_occupancy`?

Even though the create schema may look flexible, the Room database model requires `max_occupancy`, so the frontend should not leave it empty.

---

## If Creating a Stay Fails

Check:

- Does the selected `room_id` exist?
- Did you send `check_in_datetime` in valid datetime format?
- Did you send `stay_status`?

The backend checks whether the room exists before creating a stay.

---

## If Linking Guest to Stay Fails

Check:

- Does `guest_id` exist?
- Does `stay_id` exist?
- Was this guest already linked to this stay?

The database has a unique constraint on:

- `guest_id`
- `stay_id`

---

# Common Mistakes

## Mistake 1: Calling the Module “Bookings” Without Understanding Backend Meaning

The backend currently has `Stay`, not `Booking`.

A stay is usually an actual guest occupancy record.

A booking is usually a reservation that may happen in the future.

So for now, we should either use:

- `Stays`
- `Bookings / Stays`

until the backend supports full reservation behavior.

---

## Mistake 2: Building Login UI Before Auth API Exists

The backend has JWT helpers, but the uploaded app does not expose auth routes.

So we should not pretend login is complete.

We can design the login page later, but real integration needs backend endpoints.

---

## Mistake 3: Deriving Finance Permanently in React

The backend does not currently expose a finance summary endpoint.

React can display temporary calculated totals for learning, but production finance should eventually come from backend endpoints.

---

## Mistake 4: Creating One Giant Booking Form Too Early

Because a stay and guest-stay are separate backend resources, the frontend should first learn each separately.

Then we can compose them into a smoother workflow.

---

# Alternative Approaches

## Approach A: Build Backend Auth First

### Pros

- Matches V1 login requirement
- Cleaner protected routing
- Real dashboard access flow

### Cons

- Delays frontend coding
- Requires backend work first

### Best For

This is best if you want strict V1 architecture from day one.

---

## Approach B: Build Frontend Shell and Health Check First

### Pros

- Lets you start React/Electron learning immediately
- Uses real backend endpoint
- Avoids fake auth
- Builds confidence with API calls

### Cons

- Login/Register will wait until auth endpoints are available

### Recommendation

This is the recommended path.

---

## Approach C: Temporarily Skip Auth and Build Rooms/Guests

### Pros

- Fastest business-feature progress
- Backend already supports these modules

### Cons

- Dashboard/login flow is not realistic yet

### Acceptability

This is acceptable for learning, but it should clearly be marked as temporary.

---

# Industry Best Practices

A professional team would now create a written API contract file before coding.

Example:

```text
docs/frontend-api-contract.md
```

Inside it:

- Health Check
- System Info
- Rooms
- Guests
- Stays
- Guest-Stays
- Missing/Auth Pending
- Missing/Dashboard Pending
- Missing/Finance Pending

This becomes the bridge between backend and frontend.

It prevents future confusion like:

- Should frontend call `/bookings` or `/stay`?
- Does room use `roomStatus` or `room_status`?
- Does guest use `phone` or `guest_phone_number`?

For HelloStay, we should follow the backend field names at the API boundary.

---

# Summary

The uploaded backend is enough to start frontend integration, but not enough to fully implement the V1 login/register flow yet.

## Current Confirmed Backend APIs

```http
GET /
GET /system-info

POST /rooms
GET /rooms
GET /rooms/{room_id}
PUT /rooms/{room_id}
DELETE /rooms/{room_id}

POST /guests
GET /guests
GET /guests/{guest_id}
PUT /guests/{guest_id}
DELETE /guests/{guest_id}

POST /stay
GET /stay
GET /stay/{stay_id}
PUT /stay/{stay_id}
DELETE /stay/{stay_id}

POST /guest-stays
GET /guest-stays
GET /guest-stays/{guest_stay_id}
PUT /guest-stays/{guest_stay_id}
DELETE /guest-stays/{guest_stay_id}
```

## Current Backend Gaps for V1

- No visible auth router included in `main.py`
- No dashboard summary endpoint
- No finance summary endpoint
- No true `/bookings` endpoint
- No available-room search endpoint
- No check-in/check-out dedicated endpoints
- No reservation conflict validation visible

## Correct Next Frontend Step

Start with:

1. React + Electron foundation
2. Backend health check using `GET /`
3. Rooms
4. Guests
5. Basic Stays / Bookings using:
   - `/stay`
   - `/guest-stays`
