# HelloStay Project Notes

## Product Vision

HelloStay is designed as a general-purpose hotel management system rather than a custom solution for a single hotel.

### Target Market
- Small hotels
- Medium hotels
- Guest houses
- Lodges
- Resorts

### Long-Term Goal
Allow hotel owners from different countries to use the same application with minimal configuration.

---

## Future Requirements

### Hotel Registration
During initial setup, the application should allow the hotel owner to register: Hotel Name, Country, Address, Contact Information, Hotel Facilities (WiFi, Restaurant, Parking, Laundry, Swimming Pool, etc.).

### Multi-Currency Support
The application should support multiple currencies based on the hotel's country (INR, USD, EUR, GBP, etc.). Planned for future implementation.

### Room Image Management
During room creation, the hotel owner should be able to: Add, Update, and Remove room images.

### Customer Identity Storage
Customer records should support storing scanned identification documents (Passport, National ID, Driving License).

### OCR-Based Customer Registration
Future versions may support automatic extraction of customer information from scanned identity documents.

### Billing System
During checkout, the application should: Generate bill automatically, Calculate charges, Produce printable invoice. Printing support should be available from within the application.

---

## Technology Stack

### Frontend
- **React 19** (via Vite 8) - Component-based architecture with reusability
- **Tailwind CSS 3** - Utility-first CSS framework for rapid UI development
- **Framer Motion 12** - Production-ready animation library
- **Lucide React** - Consistent iconography
- **Recharts 3** - Composable charting library
- **React Router DOM 7** - Client-side SPA routing
- **Axios 1** - HTTP client for API calls
- **clsx** + **tailwind-merge** - Conditional CSS class management

### Desktop Layer
- **Electron 42** - Cross-platform desktop wrapper

### Backend
- **FastAPI** (Python) - High-performance REST API framework
- **Uvicorn** - ASGI server
- **SQLAlchemy 2** (modern Mapped/mapped_column style) - ORM
- **Alembic** - Database migration tool
- **Pydantic v2** - Request/response validation
- **python-jose** - JWT token handling
- **passlib** + **bcrypt** - Password hashing

### Database
- **SQLite** - Serverless embedded database (hellostay.db)

---

## Architecture Decisions

### AD 1: Backend Layer Separation
**Status:** Accepted

Backend follows a layered architecture: `api/`, `core/`, `database/`, `models/`, `schemas/`. Each folder has a single responsibility for cleaner code, easier debugging, better scalability, and simpler testing.

### AD 2: Database Choice
**Status:** Accepted

**Chosen:** SQLite. HelloStay is an offline desktop application requiring no server setup, easy backup, easy deployment, and lightweight footprint.

### AD 3: Database Layer Separation
**Status:** Accepted

Database-related code (`base.py`, `connection.py`, `session.py`) is stored separately from API code for reusability and maintainability.

### AD 4: Model-Based Database Design
**Status:** Accepted

Database tables are defined using SQLAlchemy models for object-oriented design, cleaner code, and easier maintenance.

### AD 5: ORM-Based Table Generation
**Status:** Accepted (Superseded by AD 48 for production)

Tables were initially generated from SQLAlchemy models rather than raw SQL for consistent schema definition.

### AD 6: Session-Based Database Access
**Status:** Accepted

Database operations performed through SQLAlchemy sessions for centralized access, better transaction control, and industry-standard patterns.

### AD 7: Separate API Layer
**Status:** Accepted

API endpoints are stored in dedicated router files per module for better organization and scalability.

### AD 8: Documentation-Driven Development
**Status:** Accepted

Documentation maintained alongside development. Knowledge gained during development is preserved for future reference.

### AD 9: Hotel-Level Business Settings
**Status:** Accepted (Future)

Business configuration settings (check-in time, checkout time, GST, invoice settings) will be stored in a dedicated `hotel_settings` table rather than the `rooms` or `system_info` table.

### AD 10: V1 First, V2 Later Strategy
**Status:** Accepted

Prioritize completing a fully functional V1 (core functionality, complete hotel workflow) before implementing advanced architecture improvements. V2 will focus on normalization, relationships, enhanced validation, and performance optimizations.

### AD 11: Room Facilities Storage
**Status:** Accepted (V1)

Room facilities stored as a comma-separated string in V1 for simplicity. A dedicated facilities table may be introduced in V2.

### AD 12: Room Status Validation Strategy
**Status:** Accepted (V1)

Room status stored as a String field in V1 with allowed values: Available, Occupied, Reserved, Maintenance. Validation on frontend dropdown and API.

### AD 13: Optional Maximum Occupancy
**Status:** Accepted

`max_occupancy` field is optional and nullable to accommodate hotel owners who may not define it.

### AD 14: Room Status vs Reservation Availability
**Status:** Accepted

`room_status` represents current operational state only. Date-based availability is determined through reservation records.

### AD 15: Upcoming Reservation Visibility
**Status:** Accepted

Future reservations are not stored in `room_status`. They are obtained from reservation records.

### AD 16: Room Configuration vs Room Operations
**Status:** Accepted (V1)

Single `RoomUpdate` schema used for simplicity in V1. Room operations (status) and configuration (price, type) may be separated in V2.

### AD 17: Centralized Database Session Management
**Status:** Accepted

Database sessions managed through a shared `get_db()` dependency to avoid repetitive session creation code.

### AD 18: Database Session Dependency
**Status:** Accepted

Shared `get_db()` dependency uses yield/finally pattern for automatic session cleanup.

### AD 19: Database Access Pattern
**Status:** Accepted

FastAPI dependency injection (`db: Session = Depends(get_db)`) replaces manual session creation per endpoint.

### AD 20: Explicit Schema-to-Model Mapping
**Status:** Accepted (V1)

Explicit field mapping (`room_number=room.room_number`) used in V1 instead of `Room(**room.model_dump())` for easier learning and debugging.

### AD 21: Room API Response Strategy
**Status:** Accepted

Room APIs use FastAPI `response_model` instead of manual response dictionaries for cleaner code and validation.

### AD 22: Pydantic ORM Serialization
**Status:** Accepted

`model_config = ConfigDict(from_attributes=True)` enables direct ORM-to-Pydantic serialization.

### AD 23: Room Creation API Pattern
**Status:** Accepted

Standard pattern: Create ORM object → `db.add()` → `db.commit()` → `db.refresh()` → Return ORM object.

### AD 24: Router Registration Pattern
**Status:** Accepted

Each module exports an `APIRouter` registered in `main.py` via `app.include_router()`.

### AD 25: Room Number Uniqueness
**Status:** Accepted

`room_number` has a database-level UNIQUE constraint to prevent duplicates.

### AD 26: Single Room Retrieval Pattern
**Status:** Accepted

`GET /rooms/{room_id}` with 404 HTTPException when room not found.

### AD 27: Room Partial Update Strategy
**Status:** Accepted

Uses `model_dump(exclude_unset=True)` + `setattr()` for partial updates, preserving existing values.

### AD 28: Missing Resource Handling
**Status:** Accepted

All endpoints return HTTP 404 when a requested resource does not exist (REST-compliant).

### AD 29: Delete Response Strategy
**Status:** Accepted

Delete endpoints return a success message object since the resource no longer exists.

### AD 30: Guest Information Storage
**Status:** Accepted

Guest table stores identity info only. Booking-related fields (room_number, check_in/out) belong to the Booking/Stay table.

### AD 31: Guest Phone Number Strategy
**Status:** Accepted (V1)

Phone numbers stored as strings to support international numbers and preserve formatting. Future versions will separate country_code.

### AD 32: Guest Update Strategy
**Status:** Accepted

`GuestUpdate` schemas use all-optional fields for partial updates. `GuestCreate` requires all fields.

### AD 33: Migration-Based Schema Management
**Status:** Accepted

Alembic migrations manage all database schema changes to prevent data loss and keep schema synchronized with models.

### AD 34: Router Prefix Pattern
**Status:** Accepted

Each router defines its own `prefix` and `tags` for cleaner routes and Swagger grouping.

### AD 35: Separate Guest Identity From Room Assignment
**Status:** Accepted

Guest records store only identity information. Room assignment handled through separate occupancy/check-in logic.

### AD 36: Room Occupancy Model
**Status:** Accepted

A room may contain multiple guests simultaneously (families, couples, group bookings). No one-guest-per-room restriction.

### AD 37: Separate Guest Identity From Stay Records
**Status:** Accepted

Guest information and hotel stay information in separate tables. The same guest may stay multiple times.

### AD 38: Stay Status Simplification
**Status:** Accepted (V1)

Stay table supports only two statuses initially: Checked In, Checked Out.

### AD 39: Avoid Duplicate Room Information
**Status:** Accepted

Stay table stores `room_id` only (not `room_number`). Room data retrieved through relationship.

### AD 40: Nullable Check-Out Timestamp
**Status:** Accepted

`check_out_datetime` is nullable. Active stays identified by `check_out_datetime IS NULL`.

### AD 41: Store Price Snapshot In Stay Records
**Status:** Accepted

Stay table contains `price_per_night` as a snapshot at check-in time. Future room price changes do not affect historical records.

### AD 42: Stay Records Preserve Historical Relationships
**Status:** Accepted

Stay table does not enforce uniqueness on `guest_id`/`room_id`. Same guest or room can appear in multiple stays.

### AD 43: Introduce Stay Entity for Occupancy Tracking
**Status:** Accepted

Stay entity introduced as a transactional record linking Guest and Room with price snapshot and timestamps.

### AD 44: Normalize Guest–Stay Relationship Using a Junction Table
**Status:** Accepted

`GuestStay` junction table supports multiple guests per stay and multiple stays per guest, with `is_primary_guest` flag for billing.

### AD 45: Keep Direct Model Imports During Learning Phase
**Status:** Temporary

Models use direct imports during learning phase. Will refactor to `TYPE_CHECKING` strategy later.

### AD 46: Resolve Model Circular Imports Using TYPE_CHECKING
**Status:** Accepted

Bidirectional relationships resolved using `from typing import TYPE_CHECKING` with forward references.

### AD 48: Adopt Alembic as the Sole Database Schema Manager
**Status:** Accepted

`Base.metadata.create_all()` removed. All schema changes through Alembic migrations.

### AD 49: Rebuild Initial Migration History Before Feature Development
**Status:** Accepted

Existing dev database and incomplete migration files discarded. Clean initial migration generated.

### AD 51: Store Historical Stay Price Independently from Room Price
**Status:** Accepted

Stay model stores agreed nightly rate at check-in. Room model stores only current price. Small intentional duplication in exchange for accurate historical billing.

### AD 52: Validate Auto-Generated Migrations Before Applying
**Status:** Accepted

Every autogenerated migration must be manually reviewed before applying to the database.

### AD 53: Verify ORM Metadata Before Generating Migrations
**Status:** Accepted

Verify all expected tables are present in `Base.metadata.tables` before generating important migrations.

### AD 54: Review Auto-Generated Migrations Before Database Upgrade
**Status:** Accepted

Review confirms: table creation, column definitions, primary keys, foreign keys, constraints, indexes, cascade behavior.

### AD 55: Use Alembic as the Sole Database Schema Manager
**Status:** Accepted

Alembic is the single source of truth. `Base.metadata.create_all()` removed from application startup.

### AD 57: Adopt Version-Controlled Database Evolution
**Status:** Accepted

Workflow: Update ORM models → Generate migration → Review → Apply via `alembic upgrade head`.

### AD 58: Separate Documentation by Technology Layer
**Status:** Accepted

Monolithic LEARNING_NOTEBOOK.md split into: BACKEND_CONCEPTS.md, FRONTEND_CONCEPTS.md, ELECTRON_CONCEPTS.md, FULLSTACK_FLOW.md.

### AD 59: UI/UX Design System
**Status:** Accepted

**Stack:** React + Vite, Tailwind CSS, Lucide React, Framer Motion, Electron.
**Design Language:** Inspired by Linear, Notion, Stripe Dashboard. Corner radius 10-14px. Soft shadows. Premium typography. Light/dark mode. Smooth animations.
**Layout:** Desktop-first, collapsible sidebar, breadcrumb navigation, toast notifications, keyboard shortcuts, search everywhere, empty states.

### AD 60: Module Specifications & Features
**Status:** Accepted

Complete feature requirements and role-based permissions for all 18 modules documented. Owner gets full access. Roles: Receptionist, Room Manager, Housekeeping, Accountant, Security, Custom. Employees never see management modules.

### AD 61: Dynamic UI Configuration & Setup Flow
**Status:** Accepted

Sidebar dynamically adapts to hotel's registered facilities (e.g., no Restaurant tab if not configured). Strict setup flow: Installer → RegisterOwner → RegisterHotel → Dashboard. localStorage heavily used for multi-step setup.

### AD 62: Multi-Currency Support & Flexible Room Types
**Status:** Accepted

Country/Currency selection during setup. Dynamic currency display from localStorage. Searchable room type selector with 20 presets + custom input. Inline status change in Rooms table.

### AD 63: Role-Based Access Control (RBAC) & Module Visibility
**Status:** Accepted

Three login roles: Owner (full), Manager (Dashboard, Rooms, Inventory, Expenses), Employee (Dashboard, Rooms, Inventory). Role stored in localStorage. Sidebar filters nav items by role.

### AD 64: Full Module Implementation Strategy
**Status:** Accepted

All 10 remaining modules implemented with consistent architecture: useState + lazy initialization from localStorage, Filter/Sort → Display → Mutate → Write-back pattern, data table/card grid with sort/search/filter/pagination, Add/Edit/View modals, inline actions, stats cards.

### AD 65: Bookings Module Data Model
**Status:** Accepted

Booking stores guest info, room assignment, dates, status (Reserved/Checked In/Checked Out/Cancelled), auto-calculated total, payment tracking. Room availability validated against date conflicts.

### AD 66: Guest Profile Architecture
**Status:** Accepted

Guests as independent profiles matched to bookings at runtime by name. Card-based layout with avatar initials, stay history from bookings.

### AD 67: HR & Payroll System Design
**Status:** Accepted

Tab-based interface: Attendance (daily marking), Payroll (monthly calculation), Payslips. Salary = perDay × presentDays + halfDays × perDay × 0.5.

### AD 68: Expense Tracking Architecture
**Status:** Accepted

Flat expense records with 12 predefined categories, color-coded dots, category breakdown bar chart, date range filtering, payment method tracking.

### AD 69: Inventory Management Design
**Status:** Accepted

Quantity-based tracking with stock alerts (In Stock/Low Stock/Out of Stock). Quick +/- stock adjustment, per-unit cost, total value, storage location.

### AD 70: Restaurant Module Design
**Status:** Accepted

Three tabs: Orders (status workflow), Menu (items with categories), Tables (visual status grid). Order status progression: Preparing → Ready → Served → Paid.

### AD 71: Reports Module with recharts
**Status:** Accepted

Four report types: Overview (bar + pie + KPIs), Occupancy (distribution), Revenue (line + pie), Expenses (horizontal bar). All responsive with Tooltips.

### AD 72: Data Export/Import System
**Status:** Accepted

Settings module provides JSON export/import of all localStorage data with timestamp. Blob download and FileReader upload patterns.

### AD 73: Module localStorage Key Registry
**Status:** Accepted

Every module has a dedicated localStorage key: `helloStay_hotelData`, `helloStay_rooms`, `helloStay_bookings`, `helloStay_guests`, `helloStay_employees`, `helloStay_attendance`, `helloStay_payslips`, `helloStay_expenses`, `helloStay_inventory`, `helloStay_facilityBookings`, `helloStay_facilityCharges`, `helloStay_restaurantMenu`, `helloStay_restaurantOrders`.

### AD 74: Booking ↔ Room Status Synchronization
**Status:** Accepted | **Date:** 2026-06-24

Room status is derived from booking status. New Booking → Reserved, Checked In → Occupied, Checked Out → Cleaning, Cancelled/Deleted → Available (if no other active bookings). `syncRoomStatus()` helper atomically updates room state and localStorage.

### AD 75: Role-Based Manual Room Status Overrides
**Status:** Accepted | **Date:** 2026-06-24

Only Owner/Manager can manually change room status to: Available, Maintenance, Cleaning. Occupied/Reserved are booking-driven only. Employee sees read-only badge.

### AD 76: App Default Route — Login-First Behavior
**Status:** Accepted | **Date:** 2026-06-24

Root (`/`) and fallback (`*`) redirect to `/login`. Login is the mandatory entry point with explicit role selection.

### AD 77: Room Edit Modal Reuse Pattern
**Status:** Accepted | **Date:** 2026-06-24

`AddRoomModal` accepts optional `editingRoom` prop. When provided → Edit mode with pre-filled form. `key` prop forces clean remount between add/edit modes.

### AD 78: Dashboard Room Occupancy Chart Redesign — Cross-Highlight Interaction
**Status:** Accepted | **Date:** 2026-06-24

Donut chart + status breakdown panel with cross-highlight. Single `hoveredStatus` state links chart segments to panel rows via `fillOpacity`/CSS opacity. No floating tooltips. Empty state fallback. CSS transitions replace Framer Motion for hover effects. Reduced from ~280 to 198 lines.

### AD 79: Inline Delete Confirmation Pattern
**Status:** Accepted

Delete actions use inline Yes/No confirmation buttons replacing separate modals. Single `deletingId` state tracks which row is in confirm mode. Reducing modal fatigue for rapid operations.

### AD 80: Smart Pagination Algorithm
**Status:** Accepted

Pagination shows max 5 page buttons with sliding window. When total pages > 5, window shifts based on current page position (start, middle, end). Previous/Next buttons with disabled states at boundaries.

### AD 81: useCallback + Functional State Updates Pattern
**Status:** Accepted

Save functions use `useCallback` for referential stability. State updates use functional form (`prev => ...`) for correctness when multiple state updates are batched. This prevents stale closures in async operations.

### AD 82: Currency Symbol Lookup Table
**Status:** Accepted

Currency symbols stored in a static lookup object (`CURRENCY_SYMBOLS`) in `utils/currencies.js` for O(1) access. Supports 26+ currencies. Fallback to `₹` when currency not found or localStorage empty.

### AD 83: Static Data Constants Outside Components
**Status:** Accepted

Static data (status options, color maps, payment types, chart colors) defined as module-level constants outside components. Avoids redefinition on every render, keeps JSX clean, and centralizes configuration.

### AD 84: Try/Catch JSON Parsing Safety Pattern
**Status:** Accepted

All `localStorage.getItem()` + `JSON.parse()` calls are wrapped in try/catch with fallback to default values. Prevents app crashes from corrupt localStorage data.

### AD 85: Gradient Header Pattern in Modals
**Status:** Accepted

All modals use a gradient header section (`bg-gradient-to-r from-blue-600 to-indigo-700`) for visual hierarchy. Consistent across BookingModal, BillingModal, GuestView, and EmployeeDetail modals.

---

## Application Modules

This section describes every module (page) in HelloStay, its purpose, key features, and target user role.

### Dashboard
Central overview screen showing real-time hotel performance metrics. KPI cards, Room Occupancy donut chart (recharts), Activity Timeline, Welcome banner with hotel name. Target: Owner, Manager, Employee.

### Rooms
Manage all hotel rooms. Data table with sort/search/filter/pagination. Inline status change, Add/Edit Room modal with searchable room type selector, dynamic currency display. Target: Owner, Manager, Employee.

### Bookings
Handle room reservations. Full data table, New Booking modal with room selection, auto-calculate total, room availability validation, status workflow, payment tracking, billing modal with late checkout fee calculation. Target: Owner (planned).

### Guests
Maintain guest database. Card-based layout with avatar initials, stay history derived from bookings, total spent calculation, search/filter/pagination. Target: Owner (planned).

### Employees
Manage hotel staff records. Data table with sort/search/role filter/status filter. Edit/View modals, quick Active/Inactive toggle. Target: Owner.

### HR & Payroll
Tab-based: Attendance | Payroll | Payslips. Daily attendance marking, monthly salary calculation based on attendance, payslip generation. Target: Owner (planned).

### Expenses
Track operational expenses. Data table with category filter/date range filter. Category breakdown bar chart, 12 predefined categories, payment method tracking. Target: Owner, Manager.

### Inventory
Manage supplies and stock. Data table with category/stock status filters. Quick stock adjustment (+/-), stock status alerts (In Stock/Low Stock/Out of Stock). Target: Owner, Manager, Employee.

### Facilities (Manage Facilities)
Manage hotel facilities (Spa, Pool, Gym, etc.). Facility cards with real-time stats. Booking system with payment status options (Club to Final Bill, Paid Before, Paid After, Complimentary). Charges configuration (All Guests, By Room Type, By Room Number, Free for All). Target: Owner, Manager.

### Restaurant
Manage in-house restaurant operations. Tabs: Orders (status workflow: Preparing→Ready→Served→Paid), Menu (item management), Tables (visual status grid). Condition: Only visible if "In-house Restaurant" facility selected. Target: Owner, Manager.

### Reports
Generate analytics with recharts. Tabs: Overview (Revenue bar + Occupancy pie + KPIs), Occupancy (room distribution), Revenue (monthly line + payment pie), Expenses (category horizontal bar). Target: Owner (planned).

### Settings
Configure application preferences. Tabs: Hotel Profile, System, Backup & Data. Export/Import all localStorage data as JSON. Target: Owner (planned).

### Profile
View/edit logged-in user's personal profile. Gradient header card, edit name/email/phone, change password form, role badge display. Target: Owner, Manager, Employee (planned).

---

## Milestone History

### Milestone 0 — Project Planning & Documentation
**Status:** Completed
Project vision, technology stack, architecture approach, and documentation structure defined.

### Milestone 1 — Development Environment Setup
**Status:** Completed
Git repository, virtual environment, dependency installation, requirements.txt.

### Milestone 2 — Backend Architecture Setup
**Status:** Completed
Layered backend structure (api/, core/, database/, models/, schemas/).

### Milestone 3 — Database Foundation
**Status:** Completed
SQLite integration, engine, SessionLocal, Base model, first SystemInfo model.

### Milestone 4 — CRUD API Development
**Status:** Completed
Complete CRUD for SystemInfo using FastAPI and SQLAlchemy.

### Milestone 5 — API Testing & Validation
**Status:** Completed
Swagger UI testing of all CRUD operations.

### Milestone 6 — Room API Foundation
**Status:** Completed
RoomCreate/RoomResponse/RoomUpdate schemas, get_db dependency, APIRouter, response_model.

### Milestone 7 — First Room API Registration
**Status:** Completed
Room router registered in main.py, Swagger integration.

### Milestone 8 — Room Retrieval APIs
**Status:** Completed
GET /rooms (list all), GET /rooms/{room_id} (single with 404 handling).

### Milestone 9 — Room Retrieval API
**Status:** Completed
List response model, ORM serialization for collections.

### Milestone 10 — Single Room Retrieval
**Status:** Completed
GET /rooms/{room_id} with HTTPException 404.

### Milestone 11 — Room CRUD Module
**Status:** COMPLETED
Full CRUD: POST, GET (list + single), PUT (partial update), DELETE with proper error handling.

### Milestone 12 — Guest CRUD API
**Status:** Completed
Full guest CRUD with Alembic migration.

### Milestone 13 — Stay Management System
**Status:** Completed
Stay model with foreign keys, price snapshot, nullable checkout, full CRUD.

### Milestone 14 — Documentation Restructuring
**Status:** Completed
LEARNING_NOTES.md split into BACKEND_CONCEPTS.md, FRONTEND_CONCEPTS.md, ELECTRON_CONCEPTS.md, FULLSTACK_FLOW.md.

### Milestone 15 — Guest Stay Module
**Status:** Completed
GuestStay junction table for many-to-many Guest-Stay relationship with is_primary_guest flag.

### Milestone 16 — Frontend Environment Setup
**Status:** Completed
Vite + React initialized, boilerplate cleaned.

### Milestone 17 — Bootstrap & Frontend Architecture
**Status:** Completed
Bootstrap installed (later replaced by Tailwind), folder structure created.

### Milestone 18 — Electron Desktop Setup
**Status:** Completed
Electron wrapping React dev server in native window.

### Milestone 19 — API Communication Setup
**Status:** Completed
CORSMiddleware, Axios, centralized api.js.

### Milestone 20 — Backend Authentication Setup
**Status:** Completed
passlib[bcrypt], python-jose for JWT, core/security.py, schemas/token.py.

### Milestone 21 — Frontend Core Architecture & Routing
**Status:** Completed
Complete frontend structure per AD 59 & AD 60.

### Milestone 22 — Frontend Core Architecture & Dynamic UI
**Status:** Completed
Onboarding flow, dynamic sidebar, role-based navigation, localStorage setup.

### Milestone 23 — Room Management Module & Facilities
**Status:** Completed
Dashboard upgrades (recharts chart), Rooms data table, AddRoomModal, ManageFacilities module, role-based login, multi-currency support.

### Milestone 24 — Complete Module Implementation
**Status:** COMPLETED | **Date:** 2026-06-23
All 10 remaining modules implemented: Bookings, Guests, Employees, HR & Payroll, Expenses, Inventory, Restaurant, Reports, Settings, Profile. Consistent architecture with localStorage persistence. AD 64-73 recorded.

### Milestone 25 — Bug Fixes, Room-Booking Sync & Role-Based Status
**Status:** COMPLETED | **Date:** 2026-06-24
Login-first route, Dashboard donut chart + single-screen layout, Edit button fix (reuse AddRoomModal), bidirectional booking-room sync, role-based manual status overrides. AD 74-78 recorded.
