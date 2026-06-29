# HelloStay Fullstack Flow
>Purpose
This document explains how the frontend, backend, and database communicate in HelloStay.

---

## Architecture Overview
HelloStay has three layers:
```
React Frontend  ───axios───▶  FastAPI Backend  ───SQLAlchemy───▶  SQLite
(Vite :5173)                 (:8000)                           (hellostay.db)
       │                              │
       │  localStorage                │
       └── (current: offline)         │
                                      │
Electron Shell  ───loadURL───▶  Vite Dev Server (dev only)
(electron/)                      or static build (prod)
```

>Current State
The frontend operates entirely offline via `localStorage`. The backend and its API layer are fully built but not yet connected to the frontend. `api.js` (the axios service) exists but is not imported by any component.

---

## Request/Response Lifecycle (Future: Frontend → Backend)

### Step 1: User Action in React Component
```jsx
// Bookings.jsx (future state)
const handleCreateBooking = async (data) => {
  try {
    const response = await api.post('/stay', data);
    setBookings(prev => [...prev, response.data]);
  } catch (err) {
    setError(err.response?.data?.detail || 'Failed to create booking');
  }
};
```
- Component validates form input
- Calls `api.post('/stay', data)` — the axios instance from `api.js`

### Step 2: Axios Service (`frontend/src/services/api.js`)
```js
const api = axios.create({
  baseURL: 'http://127.0.0.1:8000',
  headers: { 'Content-Type': 'application/json' },
});
```
- Creates an Axios instance pointing directly at the backend
- All requests pass through Vite dev server proxy during development
- `api.js` is not currently used anywhere — it's a ready-to-use service

### Step 3: Vite Dev Server Proxy (`frontend/vite.config.js`)
```
Request: POST /api/stay
          │
          ▼
Vite Proxy  ───rewrite(/^\/api/, '')───▶  http://127.0.0.1:8000/stay
```
- In development, Vite proxies `/api/*` to the backend, stripping the `/api` prefix
- Direct requests from axios bypass the proxy (same host)
- CORS middleware on the backend acts as fallback

### Step 4: FastAPI Backend (`backend/app/main.py`)
```
http://127.0.0.1:8000/stay
          │
          ▼
CORSMiddleware ───allows───▶  http://localhost:5173
          │
          ▼
Router match: stay_router (prefix="/stay", tags=["Stays"])
          │
          ▼
POST /stay → create_stay()
```
- CORS check passes (origin is in `allow_origins`)
- Router dispatches to the correct handler by path and method
- Each router is registered centrally in `main.py` via `app.include_router()`

### Step 5: Pydantic Schema Validation
```python
@router.post("/stay", response_model=StayResponse)
def create_stay(stay: StayCreate, db: Session = Depends(get_db)):
    ...
```
- FastAPI parses request body against `StayCreate` schema
- Returns 422 Unprocessable Entity if validation fails
- `response_model=StayResponse` ensures the response shape matches the schema

### Step 6: Database Session (Dependency Injection)
```python
# session.py
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# In route handler
def create_stay(stay: StayCreate, db: Session = Depends(get_db)):
```
- FastAPI calls `get_db()` generator before the handler
- Yields a SQLAlchemy session bound to SQLite
- Session is automatically closed in `finally` block after response

### Step 7: SQLAlchemy Model Operations
```python
def create_stay(stay: StayCreate, db: Session = Depends(get_db)):
    new_stay = Stay(**stay.model_dump())
    db.add(new_stay)
    db.commit()
    db.refresh(new_stay)
    return new_stay
```
- Converts Pydantic schema to a SQLAlchemy ORM instance
- `db.add()` stages the insert
- `db.commit()` persists to SQLite
- `db.refresh()` loads generated fields (id, defaults)
- Returns ORM object — FastAPI serializes via `StayResponse`

### Step 8: JSON Response Back to Frontend
```json
{
  "stay_id": 1,
  "room_id": 3,
  "check_in_datetime": "2026-06-24T14:00:00",
  "check_out_datetime": null,
  "stay_status": "Active",
  ...
}
```
- Pydantic `StayResponse` serializes the ORM object to JSON
- FastAPI returns HTTP 200 (or 201 for creates) with the JSON body
- Axios resolves the promise in the React component

---

## Current Offline Flow (Frontend → localStorage)

### Read on Mount
```jsx
const [bookings, setBookings] = useState(() => {
  try {
    const saved = localStorage.getItem('helloStay_bookings');
    return saved ? JSON.parse(saved) : [];
  } catch { return []; }
});
```
- Lazy initializer in `useState` reads from localStorage on component mount
- Try/catch handles corrupt or missing data with empty array fallback

### Write on Change
```jsx
const saveBookings = useCallback((updated) => {
  setBookings(updated);
  localStorage.setItem('helloStay_bookings', JSON.stringify(updated));
}, []);
```
- `useCallback` memoizes the save function with empty deps
- `setBookings` is called with the functional updater form (`prev => ...`) when derived from current state
- `localStorage.setItem` serializes the full array on every change
- All localStorage keys use the `helloStay_` prefix

### Data Export/Import
```jsx
// Export
const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
const url = URL.createObjectURL(blob);
const a = document.createElement('a');
a.href = url;
a.download = `backup_${date}.json`;
a.click();
URL.revokeObjectURL(url);

// Import
const reader = new FileReader();
reader.onload = (ev) => {
  const data = JSON.parse(ev.target.result);
  Object.entries(data).forEach(([key, value]) => {
    if (key !== 'exportDate') localStorage.setItem(key, JSON.stringify(value));
  });
  window.location.reload();
};
reader.readAsText(file);
```
- Export serializes all `helloStay_*` keys to a downloadable JSON file
- Import reads a JSON file and restores each key to localStorage
- Page reload refreshes all React state from the newly imported localStorage data

---

## localStorage Key Registry
All persistence keys used across the app:

| Key | Module | Format |
|-----|--------|--------|
| `helloStay_rooms` | Rooms.jsx | Array of room objects |
| `helloStay_bookings` | Bookings.jsx | Array of booking objects |
| `helloStay_guests` | Guests.jsx | Array of guest objects |
| `helloStay_nightAudit` | NightAudit.jsx | Array of audit entries |
| `helloStay_reports` | Reports.jsx | Array of report objects |
| `helloStay_setup` | Settings.jsx | Setup/configuration object |
| `helloStay_staff` | Employees.jsx | Array of employee objects |
| `helloStay_login` | Login.jsx | Login state object |

---

## Data Models (Cross-Layer)

### Room
| Field | Frontend (localStorage) | Backend Model | Schema |
|-------|------------------------|---------------|--------|
| id | auto-increment (manual) | `Integer, PK, index` | int |
| room_number | `roomNumber` | `String(20), unique` | str |
| room_type | `roomType` | `String(50)` | Optional[str] |
| price_per_night | `price` | `Numeric(10,2)` | Decimal |
| max_occupancy | `occupancy` | `Integer` | Optional[int] |
| facilities | `facilities` | `String(500)` | Optional[str] |
| room_status | `status` | `String(15)` | str |

>Note: Frontend uses camelCase (JS convention), backend uses snake_case (Python convention). Axios will automatically handle this conversion since the frontend will send data matching the backend schema.

---

## Error Handling Across Layers

### Frontend (React)
```jsx
try {
  const response = await api.post('/stay', data);
  // success
} catch (err) {
  if (err.response) {
    // Server responded with error (4xx, 5xx)
    setError(err.response.data.detail || 'Server error');
  } else if (err.request) {
    // No response received (network error, CORS)
    setError('Network error — is the backend running?');
  } else {
    // Request setup error
    setError('An unexpected error occurred');
  }
}
```
- Distinguishes between server errors, network errors, and client errors
- Uses `err.response?.data?.detail` for FastAPI validation errors

### Backend (FastAPI)
```python
raise HTTPException(status_code=404, detail=f"Room with id {room_id} not found")
```
- Returns structured JSON with `detail` field
- HTTP 404 for not found, 422 for validation, 500 for server errors
- Pydantic auto-returns 422 with field-level error details for invalid request bodies

### Database (SQLAlchemy)
- `db.commit()` raises `IntegrityError` for constraint violations (unique, FK)
- FastAPI catches unhandled exceptions and returns HTTP 500
- Database connection errors propagate as 500s

---

## Environment Configuration

| Environment | Frontend URL | Backend URL | Data Source |
|-------------|-------------|-------------|-------------|
| Development | `http://localhost:5173` (Vite) | `http://127.0.0.1:8000` | localStorage + SQLite |
| Electron (Dev) | Vite dev server | Backend server | Same as dev |
| Production | Bundled static files | Nginx → Backend | SQLite |

>Configuration Files:
- `frontend/vite.config.js`: Vite proxy for `/api` → backend
- `frontend/src/services/api.js`: axios baseURL (hardcoded)
- `backend/app/database/connection.py`: SQLAlchemy DATABASE_URL (hardcoded to `sqlite:///hellostay.db`)
