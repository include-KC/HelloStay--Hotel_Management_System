# HelloStay — Hotel Management System

HelloStay is an **offline, production-oriented Hotel Management System** designed for small and medium-sized hotels, guest houses, lodges, and resorts.

The project is being built from the ground up with a strong focus on **clean architecture, maintainability, security, and engineering fundamentals**.

HelloStay is not intended to be a solution for a single hotel. The long-term goal is to make it configurable enough that hotels in different countries can use the same application with minimal configuration.

---

## 📌 Project Status

**Current Status:** Active Development — V1

The frontend is being rebuilt from scratch using React and JavaScript while preserving the existing FastAPI backend architecture.

The current development process is intentionally milestone-driven. Each milestone introduces a small piece of functionality while documenting the architectural and engineering decisions behind it.

The current V1 focuses on the core hotel workflow and deliberately postpones several advanced operational modules to V2.

---

## 🎯 Project Goals

HelloStay aims to provide a simple and reliable desktop application for managing the core operations of a hotel.

### Primary Goals

* Manage hotel rooms
* Manage guest information
* Manage guest stays
* Associate guests with stays
* Manage booking/stay workflows
* Provide financial information
* Maintain historical information
* Provide authentication and protected application access
* Run as an offline desktop application
* Keep hotel business logic centralized in the backend
* Maintain a clean separation between UI, desktop, backend, and database responsibilities

### Long-Term Goals

Future versions are planned to support:

* Multi-currency operation
* Hotel facility configuration
* Room image management
* Customer identity document storage
* OCR-based guest registration
* Automated billing
* Printable invoices
* Additional hotel operational modules
* More advanced reporting and analytics

---

# 🏗️ Architecture

HelloStay follows a layered desktop application architecture.

```text
┌───────────────────────────────────────────────┐
│                  Electron                     │
│             Desktop Application Shell         │
│                                               │
│  App lifecycle • Window • Startup • Packaging │
└──────────────────────┬────────────────────────┘
                       │
                       │
┌──────────────────────▼────────────────────────┐
│                React Renderer                 │
│                                               │
│  Pages • Components • Forms • Routing         │
│  UI State • User Interaction                 │
└──────────────────────┬────────────────────────┘
                       │
                       │ HTTP API
                       │
┌──────────────────────▼────────────────────────┐
│                 FastAPI                       │
│                                               │
│  Business Logic • Validation • Authentication │
│  API Contracts • Database Operations          │
└──────────────────────┬────────────────────────┘
                       │
                       │ SQLAlchemy
                       │
┌──────────────────────▼────────────────────────┐
│                  SQLite                       │
│                                               │
│              Persistent Storage               │
└───────────────────────────────────────────────┘
```

### Responsibility Boundaries

#### React Renderer

React is responsible for:

* Screens
* Components
* Forms
* Routing
* UI state
* Loading states
* Error states
* User interaction
* Calling frontend API services

React must **not** contain database access or authoritative hotel business rules.

#### Electron Main Process

Electron is responsible for:

* Application lifecycle
* Desktop window creation
* Startup behavior
* Native desktop integration
* Packaging
* Future backend startup/connection management

Electron must **not** contain:

* Hotel business logic
* Room logic
* Guest logic
* Stay/booking logic
* Financial calculations
* Database operations

#### Preload / IPC

The preload layer provides a controlled boundary between Electron and the React renderer when desktop functionality is required.

Security principles include:

* `contextIsolation: true`
* `nodeIntegration: false`
* Controlled IPC exposure
* No unnecessary Node.js access from React

#### FastAPI Backend

FastAPI is the **source of truth** for:

* Business rules
* Validation
* Authentication
* Database operations
* Hotel workflows
* API contracts

This prevents business rules from being duplicated across React and Electron.

---

# 🛠️ Technology Stack

## Frontend

* React 19
* Vite 8
* JavaScript
* React Router DOM 7
* Tailwind CSS 3
* Framer Motion 12
* Lucide React
* Recharts 3
* Axios 1
* clsx
* tailwind-merge

## Desktop

* Electron 42

## Backend

* FastAPI
* Uvicorn
* SQLAlchemy 2
* Alembic
* Pydantic v2
* python-jose
* passlib
* bcrypt

## Database

* SQLite

The application uses an embedded SQLite database, supporting the offline desktop architecture.

---

# 📦 Core Modules

HelloStay is designed around separate hotel-management modules.

| Module      | Purpose                                    |
| ----------- | ------------------------------------------ |
| Dashboard   | Hotel performance overview and key metrics |
| Rooms       | Room configuration and operational status  |
| Guests      | Guest identity and profile management      |
| Stays       | Transactional hotel stay records           |
| Guest Stays | Relationships between guests and stays     |
| Bookings    | Reservation/stay workflow                  |
| Finance     | Income and financial information           |
| History     | Historical activity and records            |
| Settings    | Application and hotel configuration        |
| Profile     | User profile management                    |

Additional operational modules are planned for future versions.

---

# 🏨 Rooms

The Rooms module manages hotel rooms and their configuration.

Planned/core functionality includes:

* Room creation
* Room editing
* Room deletion
* Room status
* Room type
* Room price
* Maximum occupancy
* Room facilities
* Search/filter/sorting capabilities

The backend treats room status and date-based reservation availability as separate concepts.

---

# 👤 Guests

The Guests module maintains guest identity information.

Guest records are intentionally separated from stay records.

This allows the same guest to stay at the hotel multiple times without duplicating their identity information.

The frontend uses the backend guest identity as the authoritative source rather than relying on guest names as unique identifiers.

---

# 🛏️ Stays

The backend uses the concept of a **Stay** for transactional occupancy records.

A Stay connects a room with hotel-stay information such as:

* Room
* Check-in timestamp
* Check-out timestamp
* Stay status
* Historical nightly price

The nightly price is stored as a snapshot so that changing the current room price does not modify historical stay information.

---

# 🔗 Guest-Stay Relationships

HelloStay uses a dedicated `GuestStay` relationship to connect guests and stays.

This allows:

```text
One Guest
   ↓
Multiple Stays

One Stay
   ↓
Multiple Guests
```

A primary guest can also be identified for billing-related workflows.

This relationship is important for supporting couples, families, and group stays.

---

# 🔐 Authentication

Authentication is designed around backend authority.

The intended architecture is:

```text
React Login Form
       ↓
Authentication Service
       ↓
FastAPI Authentication API
       ↓
Credential Verification
       ↓
JWT
       ↓
Authenticated Frontend Session
```

The frontend must never be responsible for deciding whether credentials are valid.

The backend owns:

* Password verification
* Password hashing
* JWT creation
* Authentication validation
* User identity

Protected routes and authentication state are handled on the React side only after the backend authentication contract is available.

---

# 🌐 Frontend API Architecture

HelloStay does not place raw API requests throughout React components.

The frontend follows a service-based communication pattern:

```text
React Page
     ↓
Feature Service
     ↓
apiClient
     ↓
FastAPI
     ↓
SQLite
```

For example:

```text
RoomsPage
    ↓
roomService.js
    ↓
apiClient.js
    ↓
FastAPI /rooms
```

This provides a centralized location for:

* API base URL
* HTTP requests
* Request headers
* Response handling
* Error handling
* Future authentication token handling

---

# 📁 Frontend Structure

The frontend follows a feature-oriented and responsibility-based structure.

A simplified structure is:

```text
frontend/
│
├── electron/
│   ├── main.js
│   └── preload.js
│
├── src/
│   ├── components/
│   │   └── ui/
│   │
│   ├── pages/
│   │
│   ├── routes/
│   │
│   ├── services/
│   │
│   ├── hooks/
│   │
│   ├── context/
│   │
│   ├── utils/
│   │
│   └── styles/
│
├── package.json
└── vite.config.js
```

The exact structure evolves as new modules are introduced.

The project avoids creating large numbers of empty folders before they are actually needed.

---

# 🔄 Backend API

The currently established backend API areas include:

## Health Check

```http
GET /
```

## System Information

```http
GET /system-info
```

## Rooms

```http
POST   /rooms
GET    /rooms
GET    /rooms/{room_id}
PUT    /rooms/{room_id}
DELETE /rooms/{room_id}
```

## Guests

```http
POST   /guests
GET    /guests
GET    /guests/{guest_id}
PUT    /guests/{guest_id}
DELETE /guests/{guest_id}
```

## Stays

```http
POST   /stay
GET    /stay
GET    /stay/{stay_id}
PUT    /stay/{stay_id}
DELETE /stay/{stay_id}
```

## Guest-Stays

```http
POST   /guest-stays
GET    /guest-stays
GET    /guest-stays/{guest_stay_id}
PUT    /guest-stays/{guest_stay_id}
DELETE /guest-stays/{guest_stay_id}
```

The frontend is developed against the actual backend contract rather than assumptions or the previously deleted frontend.

---

# 🗄️ Database Architecture

HelloStay uses **SQLite** because it fits the application's offline desktop requirements.

Benefits include:

* No external database server required
* Simple deployment
* Lightweight footprint
* Easy local backup
* Suitable for an offline desktop application

SQLAlchemy is used as the ORM.

Alembic is the sole database schema migration system.

```text
SQLAlchemy Models
       ↓
Alembic Migration
       ↓
SQLite Database
```

Schema changes follow the workflow:

```text
Update ORM Model
       ↓
Generate Migration
       ↓
Review Migration
       ↓
Apply Migration
```

Auto-generated migrations are manually reviewed before being applied.

---

# 🖥️ Running the Project

## Backend

Start the FastAPI backend using the project's backend environment and configuration.

The backend should be running before testing frontend features that require API access.

The frontend development API is configured to communicate with:

```text
http://127.0.0.1:8000
```

---

## Frontend

From the frontend directory:

```bash
npm install
```

Start the Vite development server:

```bash
npm run dev
```

The frontend development server runs on:

```text
http://localhost:5173
```

The Vite configuration uses a fixed development port so that the frontend and backend development configuration remain predictable.

---

## Electron Desktop Development

The desktop application can be launched with:

```bash
npm run desktop
```

The development flow is:

```text
Vite starts
    ↓
Electron waits for Vite
    ↓
Electron creates BrowserWindow
    ↓
React application loads
```

Electron uses secure BrowserWindow defaults:

```text
nodeIntegration: false
contextIsolation: true
```

---

# 🔒 Security Principles

Security is treated as an architectural concern rather than something added at the end.

Important principles include:

* FastAPI remains the authentication authority.
* React does not directly access SQLite.
* React does not directly access Node.js APIs.
* Electron does not contain hotel business logic.
* `nodeIntegration` remains disabled.
* `contextIsolation` remains enabled.
* Preload APIs should only expose capabilities that are actually required.
* Backend validation must never be replaced by frontend validation.
* Sensitive authentication behavior should not be implemented only in the renderer.

---

# 🧠 Engineering Philosophy

HelloStay is also a learning project.

The objective is not simply to produce a working application as quickly as possible.

The project is being developed to understand **why production applications are structured the way they are**.

Development therefore emphasizes:

* Architecture before implementation
* Backend contracts before frontend assumptions
* Small milestones
* Clear responsibility boundaries
* Reusable components
* Service-layer API communication
* Readable JavaScript
* Understandable React
* Secure Electron architecture
* Backend-driven business rules
* Documentation alongside development
* Manual verification and debugging
* Avoiding premature abstractions

The frontend is being rebuilt from scratch rather than recreating the previously deleted implementation.

---

# 🧭 Development Roadmap

The planned frontend and Electron development sequence is:

1. Project Orientation
2. React Project Setup
3. Electron Desktop Shell
4. Startup Flow and Routing
5. UI Foundation
6. API Client
7. Authentication UI
8. Auth State and Protected Routes
9. Dashboard Layout
10. Rooms Management
11. Guests Management
12. Bookings Management
13. Booking Lifecycle Actions
14. Finance and Income
15. History
16. Dashboard Metrics
17. UX Polish
18. Offline Electron Startup
19. Security Review
20. Testing and Debugging
21. Packaging Preparation
22. Final V1 Review

The milestone approach is intentional: each stage establishes a stable foundation before the next layer of complexity is introduced.

---

# 🚧 V1 Scope

HelloStay V1 focuses on the core hotel workflow.

Advanced operational modules are intentionally deferred to V2.

Planned V2 modules include:

* Employees
* HR & Payroll
* Expenses
* Inventory
* Manage Facilities
* Restaurant
* Advanced Reports

This allows V1 development to remain focused on the essential hotel workflow instead of expanding into every possible hotel-management feature at once.

---

# 🔮 Future Features

The project documentation identifies several future requirements.

### Hotel Setup

Hotels will eventually be able to configure:

* Hotel name
* Country
* Address
* Contact information
* Facilities

### Multi-Currency

Support for currencies such as:

```text
INR
USD
EUR
GBP
```

and other currencies is planned.

### Room Images

Future versions may allow hotel owners to:

* Add room images
* Update room images
* Remove room images

### Guest Identity Documents

Future guest records may support:

* Passport
* National ID
* Driving License

### OCR

OCR-based guest registration may eventually extract information automatically from identity documents.

### Billing

Future billing functionality is planned to:

* Calculate charges
* Generate bills
* Produce printable invoices
* Support printing from the application

---

# 📚 Documentation

HelloStay follows documentation-driven development.

Architecture and learning documentation is maintained alongside the project.

The documentation is separated by technology layer:

```text
BACKEND_CONCEPTS.md
FRONTEND_CONCEPTS.md
ELECTRON_CONCEPTS.md
FULLSTACK_FLOW.md
PROJECT_NOTES.md
```

Architecture Decisions are documented so that important engineering decisions are not lost as the project evolves.

---

# 🤝 Development Philosophy

This project intentionally avoids the mindset of:

> "Make it work as quickly as possible."

Instead, the goal is:

```text
Understand the problem
        ↓
Understand the architecture
        ↓
Inspect the backend contract
        ↓
Design the frontend boundary
        ↓
Implement a small milestone
        ↓
Verify the behavior
        ↓
Understand the code
        ↓
Document the decision
        ↓
Move to the next milestone
```

The long-term objective is to build not only HelloStay, but also the engineering skills required to independently design, implement, debug, test, package, and maintain similar full-stack desktop applications.

---

# 📄 License

License information will be added when the project's distribution and licensing strategy is finalized.

---

# 👨‍💻 Project

**HelloStay — The Hotel Management App**

An offline desktop Hotel Management System built with:

```text
React
Electron
FastAPI
SQLAlchemy
Alembic
SQLite
```

Built with a focus on:

**Clean Architecture • Learning • Maintainability • Security • Production Engineering**
