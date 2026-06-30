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


### Frontend & Desktop Requirements Converted From Previous Architecture Decisions
These requirements are no longer treated as completed frontend architecture decisions because the frontend is being rebuilt from scratch. They are preserved here as future requirements to revisit during the new React/Electron implementation.

### Future Requirement FE-59: UI/UX Design System
**Status:** Future Requirement / To be implemented during frontend rebuild
**Source:** Former AD 59 (Accepted)

**Stack:** React + Vite, Tailwind CSS, Lucide React, Framer Motion, Electron.
**Design Language:** Inspired by Linear, Notion, Stripe Dashboard. Corner radius 10-14px. Soft shadows. Premium typography. Light/dark mode. Smooth animations.
**Layout:** Desktop-first, collapsible sidebar, breadcrumb navigation, toast notifications, keyboard shortcuts, search everywhere, empty states.


### Future Requirement FE-60: Module Specifications & Features
**Status:** Future Requirement / To be implemented during frontend rebuild
**Source:** Former AD 60 (Accepted)

Complete feature requirements and role-based permissions for all 18 modules documented. Owner gets full access. Roles: Receptionist, Room Manager, Housekeeping, Accountant, Security, Custom. Employees never see management modules.


### Future Requirement FE-61: Dynamic UI Configuration & Setup Flow
**Status:** Future Requirement / To be implemented during frontend rebuild
**Source:** Former AD 61 (Accepted)

Sidebar dynamically adapts to hotel's registered facilities (e.g., no Restaurant tab if not configured). Strict setup flow: Installer → RegisterOwner → RegisterHotel → Dashboard. localStorage heavily used for multi-step setup.


### Future Requirement FE-62: Multi-Currency Support & Flexible Room Types
**Status:** Future Requirement / To be implemented during frontend rebuild
**Source:** Former AD 62 (Accepted)

Country/Currency selection during setup. Dynamic currency display from localStorage. Searchable room type selector with 20 presets + custom input. Inline status change in Rooms table.


### Future Requirement FE-63: Role-Based Access Control (RBAC) & Module Visibility
**Status:** Future Requirement / To be implemented during frontend rebuild
**Source:** Former AD 63 (Accepted)

Three login roles: Owner (full), Manager (Dashboard, Rooms, Inventory, Expenses), Employee (Dashboard, Rooms, Inventory). Role stored in localStorage. Sidebar filters nav items by role.


### Future Requirement FE-64: Full Module Implementation Strategy
**Status:** Future Requirement / To be implemented during frontend rebuild
**Source:** Former AD 64 (Accepted)

All 10 remaining modules implemented with consistent architecture: useState + lazy initialization from localStorage, Filter/Sort → Display → Mutate → Write-back pattern, data table/card grid with sort/search/filter/pagination, Add/Edit/View modals, inline actions, stats cards.


### Future Requirement FE-65: Bookings Module Data Model
**Status:** Future Requirement / To be implemented during frontend rebuild
**Source:** Former AD 65 (Accepted)

Booking stores guest info, room assignment, dates, status (Reserved/Checked In/Checked Out/Cancelled), auto-calculated total, payment tracking. Room availability validated against date conflicts.


### Future Requirement FE-66: Guest Profile Architecture
**Status:** Future Requirement / To be implemented during frontend rebuild
**Source:** Former AD 66 (Accepted)

Guests as independent profiles matched to bookings at runtime by name. Card-based layout with avatar initials, stay history from bookings.


### Future Requirement FE-67: HR & Payroll System Design
**Status:** Future Requirement / To be implemented during frontend rebuild
**Source:** Former AD 67 (Accepted)

Tab-based interface: Attendance (daily marking), Payroll (monthly calculation), Payslips. Salary = perDay × presentDays + halfDays × perDay × 0.5.


### Future Requirement FE-68: Expense Tracking Architecture

**Status:** Future Requirement / To be implemented during frontend rebuild
**Source:** Former AD 68 (Accepted)

Flat expense records with 12 predefined categories, color-coded dots, category breakdown bar chart, date range filtering, payment method tracking.


### Future Requirement FE-69: Inventory Management Design

**Status:** Future Requirement / To be implemented during frontend rebuild
**Source:** Former AD 69 (Accepted)

Quantity-based tracking with stock alerts (In Stock/Low Stock/Out of Stock). Quick +/- stock adjustment, per-unit cost, total value, storage location.


### Future Requirement FE-70: Restaurant Module Design

**Status:** Future Requirement / To be implemented during frontend rebuild
**Source:** Former AD 70 (Accepted)

Three tabs: Orders (status workflow), Menu (items with categories), Tables (visual status grid). Order status progression: Preparing → Ready → Served → Paid.


### Future Requirement FE-71: Reports Module with recharts

**Status:** Future Requirement / To be implemented during frontend rebuild
**Source:** Former AD 71 (Accepted)

Four report types: Overview (bar + pie + KPIs), Occupancy (distribution), Revenue (line + pie), Expenses (horizontal bar). All responsive with Tooltips.


### Future Requirement FE-72: Data Export/Import System

**Status:** Future Requirement / To be implemented during frontend rebuild
**Source:** Former AD 72 (Accepted)

Settings module provides JSON export/import of all localStorage data with timestamp. Blob download and FileReader upload patterns.


### Future Requirement FE-73: Module localStorage Key Registry

**Status:** Future Requirement / To be implemented during frontend rebuild
**Source:** Former AD 73 (Accepted)

Every module has a dedicated localStorage key: `helloStay_hotelData`, `helloStay_rooms`, `helloStay_bookings`, `helloStay_guests`, `helloStay_employees`, `helloStay_attendance`, `helloStay_payslips`, `helloStay_expenses`, `helloStay_inventory`, `helloStay_facilityBookings`, `helloStay_facilityCharges`, `helloStay_restaurantMenu`, `helloStay_restaurantOrders`.


### Future Requirement FE-74: Booking ↔ Room Status Synchronization

**Status:** Future Requirement / To be implemented during frontend rebuild | **Original Date:** 2026-06-24
**Source:** Former AD 74 (Accepted)

Room status is derived from booking status. New Booking → Reserved, Checked In → Occupied, Checked Out → Cleaning, Cancelled/Deleted → Available (if no other active bookings). `syncRoomStatus()` helper atomically updates room state and localStorage.


### Future Requirement FE-75: Role-Based Manual Room Status Overrides

**Status:** Future Requirement / To be implemented during frontend rebuild | **Original Date:** 2026-06-24
**Source:** Former AD 75 (Accepted)

Only Owner/Manager can manually change room status to: Available, Maintenance, Cleaning. Occupied/Reserved are booking-driven only. Employee sees read-only badge.


### Future Requirement FE-76: App Default Route — Login-First Behavior

**Status:** Future Requirement / To be implemented during frontend rebuild | **Original Date:** 2026-06-24
**Source:** Former AD 76 (Accepted)

Root (`/`) and fallback (`*`) redirect to `/login`. Login is the mandatory entry point with explicit role selection.


### Future Requirement FE-77: Room Edit Modal Reuse Pattern

**Status:** Future Requirement / To be implemented during frontend rebuild | **Original Date:** 2026-06-24
**Source:** Former AD 77 (Accepted)

`AddRoomModal` accepts optional `editingRoom` prop. When provided → Edit mode with pre-filled form. `key` prop forces clean remount between add/edit modes.


### Future Requirement FE-78: Dashboard Room Occupancy Chart Redesign — Cross-Highlight Interaction

**Status:** Future Requirement / To be implemented during frontend rebuild | **Original Date:** 2026-06-24
**Source:** Former AD 78 (Accepted)

Donut chart + status breakdown panel with cross-highlight. Single `hoveredStatus` state links chart segments to panel rows via `fillOpacity`/CSS opacity. No floating tooltips. Empty state fallback. CSS transitions replace Framer Motion for hover effects. Reduced from ~280 to 198 lines.


### Future Requirement FE-79: Inline Delete Confirmation Pattern

**Status:** Future Requirement / To be implemented during frontend rebuild
**Source:** Former AD 79 (Accepted)

Delete actions use inline Yes/No confirmation buttons replacing separate modals. Single `deletingId` state tracks which row is in confirm mode. Reducing modal fatigue for rapid operations.


### Future Requirement FE-80: Smart Pagination Algorithm

**Status:** Future Requirement / To be implemented during frontend rebuild
**Source:** Former AD 80 (Accepted)

Pagination shows max 5 page buttons with sliding window. When total pages > 5, window shifts based on current page position (start, middle, end). Previous/Next buttons with disabled states at boundaries.


### Future Requirement FE-81: useCallback + Functional State Updates Pattern

**Status:** Future Requirement / To be implemented during frontend rebuild
**Source:** Former AD 81 (Accepted)

Save functions use `useCallback` for referential stability. State updates use functional form (`prev => ...`) for correctness when multiple state updates are batched. This prevents stale closures in async operations.


### Future Requirement FE-82: Currency Symbol Lookup Table

**Status:** Future Requirement / To be implemented during frontend rebuild
**Source:** Former AD 82 (Accepted)

Currency symbols stored in a static lookup object (`CURRENCY_SYMBOLS`) in `utils/currencies.js` for O(1) access. Supports 26+ currencies. Fallback to `₹` when currency not found or localStorage empty.


### Future Requirement FE-83: Static Data Constants Outside Components

**Status:** Future Requirement / To be implemented during frontend rebuild
**Source:** Former AD 83 (Accepted)

Static data (status options, color maps, payment types, chart colors) defined as module-level constants outside components. Avoids redefinition on every render, keeps JSX clean, and centralizes configuration.


### Future Requirement FE-84: Try/Catch JSON Parsing Safety Pattern

**Status:** Future Requirement / To be implemented during frontend rebuild
**Source:** Former AD 84 (Accepted)

All `localStorage.getItem()` + `JSON.parse()` calls are wrapped in try/catch with fallback to default values. Prevents app crashes from corrupt localStorage data.


### Future Requirement FE-85: Gradient Header Pattern in Modals

**Status:** Future Requirement / To be implemented during frontend rebuild
**Source:** Former AD 85 (Accepted)

All modals use a gradient header section (`bg-gradient-to-r from-blue-600 to-indigo-700`) for visual hierarchy. Consistent across BookingModal, BillingModal, GuestView, and EmployeeDetail modals.


### Future Requirement FE-86: Authentication Flow, Profile Selection & Startup Sequence

**Status:** Future Requirement / To be implemented during frontend rebuild
**Source:** Former AD 86 (Accepted)

The application needs a seamless and professional entry point that gracefully handles different authentication states while supporting multiple users (e.g., Owner, Manager, Employee) for a single hotel instance. The standard username/password flow was too tedious for locally saved roles.
- **Animated Splash Entry**: A new `<Splash />` component acts as the global entry point (`/`). It displays a premium animation. After 2 seconds, it provides a "Get Started" gateway button that unconditionally routes all users to the Profile Selection screen.
- **Local Profile Selection**: Instead of a traditional login form, we implemented an "Account Selection" screen similar to modern streaming services (Netflix/Hulu). Local accounts are stored in `localStorage` under `helloStay_accounts`.
- **Profile Authentication & Remember Me**: Clicking a profile does not log the user in instantly. Instead, it transitions to a Password Entry view dedicated to that specific profile. The "Remember Me" toggle (which sets `helloStay_keepLoggedIn`) is located on this specific authentication screen.
- **Session Persistence**: Session state is managed via `helloStay_session` and `helloStay_keepLoggedIn`. If successful, the user is routed to the Dashboard (or Hotel Setup if incomplete).


### Future Requirement FE-87: V2 Features / Deferred Modules

**Status:** Future Requirement / To be implemented during frontend rebuild
**Source:** Former AD 87 (Accepted)

To streamline the initial Minimum Viable Product (MVP) and focus on the core booking experience, several advanced operational modules have been temporarily removed from the project and deferred to Version 2.0.
When planning Version 2.0, the following modules should be restored:
1. **Employees**: Staff records, roles, statuses.
2. **HR and Payroll**: Management of employee shifts, salaries, deductions, and performance reviews.
3. **Expenses**: A ledger for tracking hotel operational costs (electricity, maintenance) against revenue.
4. **Inventory**: Management of hotel supplies (linens, toiletries, housekeeping carts) to track usage.
5. **Manage Facilities**: Administrative module for updating, pricing, and scheduling maintenance.
6. **Restaurant**: POS integration specifically for in-house dining, table management, and room service.
7. **Reports**: Advanced analytics dashboards for revenue visualization and occupancy forecasting.


### Future Requirement FE-88: Profiles, Permissions & Hotel Information Restructure

**Status:** Future Requirement / To be implemented during frontend rebuild | **Original Date:** 2026-06-25
**Source:** Former AD 88 (Accepted)

Significant architectural improvements were made to identity, permissions, and initial routing:
- **Enhanced Profile Management:** Added inline "Edit Role" and "Delete Role" capabilities to both the `Login` screen and the dashboard `Profile` screen. Extended profile data to support updating credentials and assigned permissions. Prevented deletion of the final Owner profile.
- **Permission Management System:** Replaced hardcoded string roles with a flexible, array-based module permission system (e.g., `Bookings`, `Rooms`, `Settings`). The Owner manages these from the profile edit modal. `Sidebar.jsx` and `AppRoutes.jsx` (via `ProtectedRoute`) now dynamically render and protect routes based on the active session's permission array. Owners implicitly inherit `Full Access`.
- **Hotel Information Hub:** Replaced `RegisterHotel.jsx` with a dual-purpose `HotelInfo.jsx`. It sits immediately after the `Splash` screen. If unconfigured, it acts as the setup form. If configured, it acts as a read-only display hub with "Edit", "Delete", and "Proceed" actions.
- **Security & Owner Authentication:** Introduced `OwnerAuthModal`. Privileged actions—such as Editing/Deleting the Hotel, or Editing/Deleting *another* Owner profile—now prompt for the target Owner's password. Editing/Deleting an Employee profile does not require the password prompt when initiated by an Owner, smoothing UX while maintaining strict security for administrative accounts.


### Future Requirement FE-89: Simplified Checkout Configuration

**Status:** Future Requirement / To be implemented during frontend rebuild | **Original Date:** 2026-06-25
**Source:** Former AD 89 (Accepted)

Based on user feedback, the fixed checkout time settings (e.g., global 11:00 AM checkout) and the associated late checkout fee automatic calculations have been removed from the application modules (`Settings`, `HotelInfo`).
- **Deferred Feature:** Fixed global checkout times are documented here for potential future addition in a V2 billing update.
- **Current Approach:** The application retains the 12hr / 24hr "Checkout Duration" setting, which dictates stay length logic. Check-in and check-out logic during Bookings continues to rely on explicitly user-selected dates and times rather than a globally enforced hour.


### Future Requirement FE-90: Centralized Data Store as Single Source of Truth

**Status:** Future Requirement / To be implemented during frontend rebuild | **Original Date:** 2026-06-25
**Source:** Former AD 90 (Accepted)

All cross-module data mutations now route through `frontend/src/utils/dataStore.js`. Modules no longer write directly to `localStorage` for shared entities. Exports include `SYNC_EVENT`, `triggerSync()`, `getRooms/saveRooms`, `getGuests/saveGuests`, `getBookings/saveBookings`, `createBookingWithGuest`, `updateBookingStatus`, `deleteBooking`, `deleteRoom`. Components use `get*()` for lazy state initialization and listen to `SYNC_EVENT` to re-fetch data when another module mutates it.


### Future Requirement FE-91: Strict GuestId Referential Integrity

**Status:** Future Requirement / To be implemented during frontend rebuild | **Original Date:** 2026-06-25
**Source:** Former AD 91 (Accepted)

Bookings store `guestId` for primary guest and `guests[].guestId` for additional guests. The Guests module matches bookings via `booking.guestId === guest.id`. A legacy fallback matches by exact `guestName + guestPhone` for pre-migration bookings. This replaces unreliable name-based matching that broke on name changes or duplicates.


### Future Requirement FE-92: Type-Driven Occupancy Automation

**Status:** Future Requirement / To be implemented during frontend rebuild | **Original Date:** 2026-06-25
**Source:** Former AD 92 (Accepted)

Room maxOccupancy is auto-populated from room type when creating a new room: Single→1, Double/Twin→2, Suite/Family/Deluxe→4, Triple→3, Quad→4. Implemented via `autoSetOccupancyFromRoomType()` in dataStore, triggered only on create (not edit). Guest count in BookingModal is capped to the room's `maxOccupancy`.


### Future Requirement FE-93: Guarded Room State Transitions

**Status:** Future Requirement / To be implemented during frontend rebuild | **Original Date:** 2026-06-25
**Source:** Former AD 93 (Accepted)

Room status is primarily derived from booking lifecycle. Manual overrides are blocked when an active Reserved or Checked In booking exists for that room. The status state machine: `Reserved → Occupied → Cleaning → Available` (with `Cancelled` as terminal state). Only the Owner can Force a room to Available via a confirmation dialog (for emergency cases like guest left without checkout).


### Future Requirement FE-94: Unified Activity Feed

**Status:** Future Requirement / To be implemented during frontend rebuild | **Original Date:** 2026-06-25
**Source:** Former AD 94 (Accepted)

`getGuestActivity(guestId)` in dataStore returns a sorted, combined array of booking lifecycle events and guest profile changes. Activity types: `booking_created`, `check_in`, `check_out`, `booking_cancelled`, `guest_updated`, `guest_created`. Each entry has `{ id, type, description, timestamp }`. Rendered as a timeline in the Guest View Modal's "All Activity" tab with type-specific icons and colors.


### Future Requirement FE-95: One-Time Legacy Migration

**Status:** Future Requirement / To be implemented during frontend rebuild | **Original Date:** 2026-06-25
**Source:** Former AD 95 (Accepted)

A startup migration (`migrateLegacyBookings()`) runs once on app load, guarded by the `helloStay_migration_v1_complete` localStorage flag. It matches each booking without a `guestId` to a guest profile by exact `guestName + guestPhone` match, then writes the matched `guestId` back to the booking. The migration runs silently and is transparent to the user.


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

## Backend Architecture Decisions

### Backend AD 1: Backend Layer Separation
**Status:** Accepted

Backend follows a layered architecture: `api/`, `core/`, `database/`, `models/`, `schemas/`. Each folder has a single responsibility for cleaner code, easier debugging, better scalability, and simpler testing.

### Backend AD 2: Database Choice
**Status:** Accepted

**Chosen:** SQLite. HelloStay is an offline desktop application requiring no server setup, easy backup, easy deployment, and lightweight footprint.

### Backend AD 3: Database Layer Separation
**Status:** Accepted

Database-related code (`base.py`, `connection.py`, `session.py`) is stored separately from API code for reusability and maintainability.

### Backend AD 4: Model-Based Database Design
**Status:** Accepted

Database tables are defined using SQLAlchemy models for object-oriented design, cleaner code, and easier maintenance.

### Backend AD 5: ORM-Based Table Generation
**Status:** Accepted (Superseded by AD 48 for production)

Tables were initially generated from SQLAlchemy models rather than raw SQL for consistent schema definition.

### Backend AD 6: Session-Based Database Access
**Status:** Accepted

Database operations performed through SQLAlchemy sessions for centralized access, better transaction control, and industry-standard patterns.

### Backend AD 7: Separate API Layer
**Status:** Accepted

API endpoints are stored in dedicated router files per module for better organization and scalability.

### Backend AD 8: Documentation-Driven Development
**Status:** Accepted

Documentation maintained alongside development. Knowledge gained during development is preserved for future reference.

### Backend AD 9: Hotel-Level Business Settings
**Status:** Accepted (Future)

Business configuration settings (check-in time, checkout time, GST, invoice settings) will be stored in a dedicated `hotel_settings` table rather than the `rooms` or `system_info` table.

### Backend AD 10: V1 First, V2 Later Strategy
**Status:** Accepted

Prioritize completing a fully functional V1 (core functionality, complete hotel workflow) before implementing advanced architecture improvements. V2 will focus on normalization, relationships, enhanced validation, and performance optimizations.

### Backend AD 11: Room Facilities Storage
**Status:** Accepted (V1)

Room facilities stored as a comma-separated string in V1 for simplicity. A dedicated facilities table may be introduced in V2.

### Backend AD 12: Room Status Validation Strategy
**Status:** Accepted (V1)

Room status stored as a String field in V1 with allowed values: Available, Occupied, Reserved, Maintenance. Validation on frontend dropdown and API.

### Backend AD 13: Optional Maximum Occupancy
**Status:** Accepted

`max_occupancy` field is optional and nullable to accommodate hotel owners who may not define it.

### Backend AD 14: Room Status vs Reservation Availability
**Status:** Accepted

`room_status` represents current operational state only. Date-based availability is determined through reservation records.

### Backend AD 15: Upcoming Reservation Visibility
**Status:** Accepted

Future reservations are not stored in `room_status`. They are obtained from reservation records.

### Backend AD 16: Room Configuration vs Room Operations
**Status:** Accepted (V1)

Single `RoomUpdate` schema used for simplicity in V1. Room operations (status) and configuration (price, type) may be separated in V2.

### Backend AD 17: Centralized Database Session Management
**Status:** Accepted

Database sessions managed through a shared `get_db()` dependency to avoid repetitive session creation code.

### Backend AD 18: Database Session Dependency
**Status:** Accepted

Shared `get_db()` dependency uses yield/finally pattern for automatic session cleanup.

### Backend AD 19: Database Access Pattern
**Status:** Accepted

FastAPI dependency injection (`db: Session = Depends(get_db)`) replaces manual session creation per endpoint.

### Backend AD 20: Explicit Schema-to-Model Mapping
**Status:** Accepted (V1)

Explicit field mapping (`room_number=room.room_number`) used in V1 instead of `Room(**room.model_dump())` for easier learning and debugging.

### Backend AD 21: Room API Response Strategy
**Status:** Accepted

Room APIs use FastAPI `response_model` instead of manual response dictionaries for cleaner code and validation.

### Backend AD 22: Pydantic ORM Serialization
**Status:** Accepted

`model_config = ConfigDict(from_attributes=True)` enables direct ORM-to-Pydantic serialization.

### Backend AD 23: Room Creation API Pattern
**Status:** Accepted

Standard pattern: Create ORM object → `db.add()` → `db.commit()` → `db.refresh()` → Return ORM object.

### Backend AD 24: Router Registration Pattern
**Status:** Accepted

Each module exports an `APIRouter` registered in `main.py` via `app.include_router()`.

### Backend AD 25: Room Number Uniqueness
**Status:** Accepted

`room_number` has a database-level UNIQUE constraint to prevent duplicates.

### Backend AD 26: Single Room Retrieval Pattern
**Status:** Accepted

`GET /rooms/{room_id}` with 404 HTTPException when room not found.

### Backend AD 27: Room Partial Update Strategy
**Status:** Accepted

Uses `model_dump(exclude_unset=True)` + `setattr()` for partial updates, preserving existing values.

### Backend AD 28: Missing Resource Handling
**Status:** Accepted

All endpoints return HTTP 404 when a requested resource does not exist (REST-compliant).

### Backend AD 29: Delete Response Strategy
**Status:** Accepted

Delete endpoints return a success message object since the resource no longer exists.

### Backend AD 30: Guest Information Storage
**Status:** Accepted

Guest table stores identity info only. Booking-related fields (room_number, check_in/out) belong to the Booking/Stay table.

### Backend AD 31: Guest Phone Number Strategy
**Status:** Accepted (V1)

Phone numbers stored as strings to support international numbers and preserve formatting. Future versions will separate country_code.

### Backend AD 32: Guest Update Strategy
**Status:** Accepted

`GuestUpdate` schemas use all-optional fields for partial updates. `GuestCreate` requires all fields.

### Backend AD 33: Migration-Based Schema Management
**Status:** Accepted

Alembic migrations manage all database schema changes to prevent data loss and keep schema synchronized with models.

### Backend AD 34: Router Prefix Pattern
**Status:** Accepted

Each router defines its own `prefix` and `tags` for cleaner routes and Swagger grouping.

### Backend AD 35: Separate Guest Identity From Room Assignment
**Status:** Accepted

Guest records store only identity information. Room assignment handled through separate occupancy/check-in logic.

### Backend AD 36: Room Occupancy Model
**Status:** Accepted

A room may contain multiple guests simultaneously (families, couples, group bookings). No one-guest-per-room restriction.

### Backend AD 37: Separate Guest Identity From Stay Records
**Status:** Accepted

Guest information and hotel stay information in separate tables. The same guest may stay multiple times.

### Backend AD 38: Stay Status Simplification
**Status:** Accepted (V1)

Stay table supports only two statuses initially: Checked In, Checked Out.

### Backend AD 39: Avoid Duplicate Room Information
**Status:** Accepted

Stay table stores `room_id` only (not `room_number`). Room data retrieved through relationship.

### Backend AD 40: Nullable Check-Out Timestamp
**Status:** Accepted

`check_out_datetime` is nullable. Active stays identified by `check_out_datetime IS NULL`.

### Backend AD 41: Store Price Snapshot In Stay Records
**Status:** Accepted

Stay table contains `price_per_night` as a snapshot at check-in time. Future room price changes do not affect historical records.

### Backend AD 42: Stay Records Preserve Historical Relationships
**Status:** Accepted

Stay table does not enforce uniqueness on `guest_id`/`room_id`. Same guest or room can appear in multiple stays.

### Backend AD 43: Introduce Stay Entity for Occupancy Tracking
**Status:** Accepted

Stay entity introduced as a transactional record linking Guest and Room with price snapshot and timestamps.

### Backend AD 44: Normalize Guest–Stay Relationship Using a Junction Table
**Status:** Accepted

`GuestStay` junction table supports multiple guests per stay and multiple stays per guest, with `is_primary_guest` flag for billing.

### Backend AD 45: Keep Direct Model Imports During Learning Phase
**Status:** Temporary

Models use direct imports during learning phase. Will refactor to `TYPE_CHECKING` strategy later.

### Backend AD 46: Resolve Model Circular Imports Using TYPE_CHECKING
**Status:** Accepted

Bidirectional relationships resolved using `from typing import TYPE_CHECKING` with forward references.

### Backend AD 47: Adopt Alembic as the Sole Database Schema Manager
**Status:** Accepted

`Base.metadata.create_all()` removed. All schema changes through Alembic migrations.

### Backend AD 48: Rebuild Initial Migration History Before Feature Development
**Status:** Accepted

Existing dev database and incomplete migration files discarded. Clean initial migration generated.

### Backend AD 49: Store Historical Stay Price Independently from Room Price
**Status:** Accepted

Stay model stores agreed nightly rate at check-in. Room model stores only current price. Small intentional duplication in exchange for accurate historical billing.

### Backend AD 50: Validate Auto-Generated Migrations Before Applying
**Status:** Accepted

Every autogenerated migration must be manually reviewed before applying to the database.

### Backend AD 51: Verify ORM Metadata Before Generating Migrations
**Status:** Accepted

Verify all expected tables are present in `Base.metadata.tables` before generating important migrations.

### Backend AD 52: Review Auto-Generated Migrations Before Database Upgrade
**Status:** Accepted

Review confirms: table creation, column definitions, primary keys, foreign keys, constraints, indexes, cascade behavior.

### Backend AD 53: Use Alembic as the Sole Database Schema Manager
**Status:** Accepted

Alembic is the single source of truth. `Base.metadata.create_all()` removed from application startup.

### Backend AD 54: Adopt Version-Controlled Database Evolution
**Status:** Accepted

Workflow: Update ORM models → Generate migration → Review → Apply via `alembic upgrade head`.

### Backend AD 55: Separate Documentation by Technology Layer
**Status:** Accepted

Monolithic LEARNING_NOTEBOOK.md split into: BACKEND_CONCEPTS.md, FRONTEND_CONCEPTS.md, ELECTRON_CONCEPTS.md, FULLSTACK_FLOW.md.

---

## Frontend Architecture Decisions

### Frontend AD 0: Backend-Contract-First Frontend Rebuild Orientation
**Status:** Accepted
**Date Recorded:** 2026-06-29
**Milestone:** Frontend Milestone 0 — Frontend Orientation, Backend Contract Review, and Architecture Boundary Confirmation

The HelloStay frontend rebuild begins with a backend-contract-first orientation before adding React code, Electron code, routing, authentication, dashboard, rooms, guests, stays/bookings, finance, or history.

**Decision:**
Use Milestone 0 to confirm the frontend architecture direction before implementation. The frontend must be designed from the actual FastAPI backend contracts, not from assumptions or the deleted frontend implementation.

This single architecture decision includes the following accepted decisions from Milestone 0:
* The backend API contract must drive frontend development.
* FastAPI remains the source of truth for business logic, validation, authentication, database operations, hotel workflows, and finance truth.
* React is responsible only for the renderer UI: screens, forms, components, routing, state, loading states, error states, and API calls.
* Electron is responsible only for the desktop shell: app lifecycle, BrowserWindow creation, startup flow, native OS integration, packaging, and future backend startup/checking.
* Preload/IPC should be used only for safe desktop communication between React renderer and Electron main process.
* React must not directly access SQLite, filesystem APIs, or backend internals.
* Electron must not contain room, guest, stay, booking, finance, or database business logic.
* A central API client must be used later instead of scattered `fetch()` calls.
* The future frontend structure should be feature-based.
* Authentication must not be implemented as real frontend integration until backend auth routes exist.
* The current backend term `Stay` should be used internally instead of pretending there is a complete `/bookings` API.
* The first frontend-backend integration should be the backend health check using `GET /`.
* Rooms should be built before Guests, and Guests should be built before Stays.
* Dashboard should not be implemented first because it depends on existing module data or a future backend summary endpoint.
* Finance should eventually come from backend-calculated APIs, not permanent frontend-only calculations.

**Why this decision was made:**
HelloStay is being rebuilt as a production-oriented offline desktop hotel management system. The frontend must be understandable, maintainable, and aligned with the completed backend architecture.

Starting with an orientation milestone prevents these mistakes:
* Building UI screens that do not match backend schemas.
* Creating fake API services.
* Implementing fake authentication before backend auth routes exist.
* Moving backend business rules into React.
* Moving hotel workflow logic into Electron.
* Rebuilding the deleted frontend blindly.
* Adding routing, dashboard, or modules before the foundation is clear.
* Confusing `Booking` and `Stay` while the backend currently exposes `/stay`.

This decision protects the project architecture and supports the learning goal: understanding how professional engineers plan before implementation.

**Affected files:**
No frontend source files were created or modified during this milestone.

Backend files reviewed during this milestone included:
* Backend `main.py`
* Backend room API file
* Backend guest API file
* Backend stay API file
* Backend guest-stay API file
* Backend system-info API file
* Backend security utility file
* Backend token schema file
* Backend database connection/session/base files
* Backend Room model
* Backend Guest model
* Backend Stay model
* Backend GuestStay model
* Backend SystemInfo model
* Backend Room schema
* Backend Guest schema
* Backend Stay schema
* Backend GuestStay schema
* Existing `PROJECT_NOTES.md`

**Frontend structure after cleanup:**
No frontend structure was changed during Milestone 0.

Approved future direction:
frontend/
src/
features/
startup/
rooms/
guests/
stays/
guestStays/
shared/
components/
services/
hooks/
utils/

**Accepted implementation details:**
* No implementation was performed in this milestone.
* Milestone 0 was treated as a planning, review, and architecture-boundary milestone.
* The current backend was reviewed as the source of truth.
* The currently registered backend areas were identified as:

  * Health Check
  * System Info
  * Rooms
  * Guests
  * Stays
  * Guest-Stays
* The first future frontend API integration should use:

  * `GET /`
* A future shared API client should be introduced before feature API services.
* Future API service files should be organized by feature:

  * `systemApi.js`
  * `roomsApi.js`
  * `guestsApi.js`
  * `staysApi.js`
  * `guestStaysApi.js`
* Real authentication should wait until backend authentication routes are implemented and registered.
* The frontend should use `Stay` internally because the backend currently exposes `/stay`, not `/bookings`.

**Backend contract considered:**
Current backend APIs confirmed:

Health Check:
* `GET /`

System Info:
* `GET /system-info`

Rooms:
* `POST /rooms`
* `GET /rooms`
* `GET /rooms/{room_id}`
* `PUT /rooms/{room_id}`
* `DELETE /rooms/{room_id}`

Guests:
* `POST /guests`
* `GET /guests`
* `GET /guests/{guest_id}`
* `PUT /guests/{guest_id}`
* `DELETE /guests/{guest_id}`

Stays:
* `POST /stay`
* `GET /stay`
* `GET /stay/{stay_id}`
* `PUT /stay/{stay_id}`
* `DELETE /stay/{stay_id}`

Guest-Stays:
* `POST /guest-stays`
* `GET /guest-stays`
* `GET /guest-stays/{guest_stay_id}`
* `PUT /guest-stays/{guest_stay_id}`
* `DELETE /guest-stays/{guest_stay_id}`

Backend/API gaps identified:
* No registered auth router was visible in the uploaded backend entry file.
* No confirmed register endpoint.
* No confirmed login endpoint.
* No confirmed current-user/session endpoint.
* No dashboard summary endpoint.
* No finance summary endpoint.
* No true `/bookings` API.
* No available-room search endpoint.
* No dedicated check-in/check-out workflow endpoints.

**What was intentionally not added:**
* No React code
* No Electron code
* No React Router
* No API client
* No Axios/fetch services
* No authentication UI
* No dashboard
* No rooms UI
* No guests UI
* No stays/bookings UI
* No finance/history UI
* No shared components
* No shared context/state management
* No custom hooks
* No utility modules
* No preload/IPC implementation
* No backend startup from Electron
* No desktop packaging

**Bugs/issues found and resolved:**
* No source-code bugs were fixed because Milestone 0 did not modify code.
* A major planning issue was identified: authentication utilities exist, but real auth routes were not confirmed as registered in the uploaded backend entry file.
* A naming mismatch was identified: V1 product language says “Bookings,” but the current backend exposes “Stays.”
* A sequencing issue was resolved: Dashboard, authentication, and bookings should not be the first implementation targets.
* The correct first integration was selected: Start Page plus backend health check.

**Remaining tasks:**
* Start Frontend Milestone 1 if not already completed in the active project timeline.
* Keep frontend implementation aligned with actual backend contracts.
* Add real authentication only after backend auth endpoints are available.
* Add dashboard only after enough backend data or a dashboard summary endpoint exists.
* Add finance only after backend finance support exists, or clearly mark any frontend-derived finance as temporary.
* Revisit the Booking vs Stay model when the backend supports true reservation workflows.
* Introduce a central API client before building feature-level API services.
* Keep Electron limited to desktop shell responsibilities.

**Next recommended step:**
Proceed to the next milestone in the frontend rebuild sequence.

If Frontend Milestone 1 is already completed, continue with:

Frontend Milestone 2 — Electron Desktop Shell Setup.

Keep Electron limited to desktop shell responsibilities: app lifecycle, BrowserWindow creation, secure preload planning, and renderer loading.

Do not add hotel features, routing, backend integration, authentication, dashboard, rooms, guests, stays/bookings, finance, or history during the Electron shell setup milestone.


---

### Frontend AD 1: Minimal React Foundation Before Features
**Status:** Accepted
**Date Recorded:** 2026-06-29
**Milestone:** Frontend Milestone 1 — React Project Setup

The HelloStay frontend rebuild begins with a minimal Vite + React foundation before adding hotel features, routing, backend integration, authentication, or Electron.

**Decision:**
Create a clean React frontend using Vite with JavaScript, not TypeScript. Keep the first milestone focused only on app startup, root rendering, basic global CSS, and fixed development port configuration.

**Why this decision was made:**
The frontend is being rebuilt from scratch for learning, maintainability, and production clarity. Starting with a small foundation prevents confusion and avoids mixing React setup with unrelated concerns such as routing, authentication, API services, dashboard UI, rooms, guests, bookings, or Electron. This also keeps React clearly separated as the future Electron renderer process.

**Affected files:**
* `frontend/src/main.jsx`
* `frontend/src/App.jsx`
* `frontend/src/styles/global.css`
* `frontend/vite.config.js`

**Frontend structure after cleanup:**
frontend/
  src/
    main.jsx
    App.jsx
    styles/
      global.css

**Accepted implementation details:**
* `main.jsx` imports React, `createRoot`, `App.jsx`, and `./styles/global.css`.
* `App.jsx` renders a minimal HelloStay setup screen only.
* `global.css` contains only basic reset styles, typography, body layout, and temporary welcome-card styling.
* `vite.config.js` fixes the Vite dev server to port `5173` with `strictPort: true`.
* Unused Vite starter files were removed:

  * `src/App.css`
  * `src/index.css`
  * `src/assets/react.svg`
  * `src/assets/vite.svg`
  * `src/assets/hero.png`
  * empty `src/assets/` folder

**Backend contract considered:**
The backend already allows the React development origin at `http://localhost:5173`, so the frontend dev server must remain on port `5173`.

**What was intentionally not added:**
* No React Router
* No API client
* No Axios/fetch services
* No authentication UI
* No dashboard
* No rooms, guests, stays, bookings, finance, or history pages
* No Electron main/preload setup
* No backend startup from Electron
* No Tailwind or design system setup yet

**Bugs/issues found and resolved:**
* The folder review initially included `node_modules`, creating noisy output.
* Correct review command should focus on `src/` or exclude `node_modules`.
* Unused Vite starter files were identified and removed.
* No React code errors were found in reviewed files.

**Sub-decisions included in this AD:**
- Use Vite + React as the frontend foundation.
- Use JavaScript instead of TypeScript for the rebuild.
- Keep React as the future Electron renderer process.
- Configure Vite to run on port `5173`.
- Use `strictPort: true` so Vite does not silently switch ports.
- Use a minimal `src/` structure with only `main.jsx`, `App.jsx`, and `styles/global.css`.
- Use one global CSS file during the foundation milestone.
- Remove unused Vite starter files and assets.
- Do not create empty future folders until they are needed.
- Do not add React Router in Milestone 1.
- Do not add API services in Milestone 1.
- Do not add authentication in Milestone 1.
- Do not add Electron in Milestone 1.
- Do not build hotel feature modules in Milestone 1.
- Do not move backend business logic into React.

**Remaining tasks:**
* Verify `npm run dev` opens the app at `http://localhost:5173`.
* Confirm browser console has no red errors.
* Confirm Network tab shows no backend API calls during Milestone 1.
* Begin Electron setup only in Milestone 2.

**Next recommended step:**
Start Frontend Milestone 2: Electron Desktop Shell Setup. Keep Electron limited to desktop shell responsibilities: app lifecycle, BrowserWindow creation, secure preload planning, and renderer loading. Do not add hotel features, routing, backend integration, or authentication yet.

---

## Frontend AD 2: Electron Desktop Shell Setup
**Status:** Accepted
**Date Recorded:** 2026-06-29
**Milestone:** Frontend Milestone 2 — Electron Desktop Shell Setup

### Context
HelloStay is an offline desktop Hotel Management System. The frontend was already initialized as a minimal Vite + React application in Milestone 1. The next step was to introduce Electron as the desktop shell while keeping the architecture clean and avoiding premature feature development.

Electron is responsible for desktop application behavior. React remains responsible for the user interface. FastAPI remains the source of truth for business logic, validation, database operations, authentication, and API contracts.

### Decision
Introduce a minimal Electron shell around the existing Vite React frontend.

The Electron setup will include:

* `frontend/electron/main.js` as the Electron main process entry file.

* `frontend/electron/preload.js` as the preload script placeholder.

* A secure Electron `BrowserWindow`.

* Development loading from the Vite dev server at:
  http://localhost:5173

* A future production loading branch using the React build output.

* npm scripts for running Vite and Electron together during development.

Electron will not start the FastAPI backend yet. Electron will not contain hotel business logic. Electron will not access SQLite directly. React will not get direct Node.js access.

### Architectural Boundaries
The application is separated into clear responsibilities:
Electron main process
  Owns desktop lifecycle, BrowserWindow creation, app startup, app quit behavior.

Electron preload script
  Reserved for future safe renderer-main communication.

React renderer process
  Owns screens, components, forms, UI state, user interaction, and visual rendering.

FastAPI backend
  Owns business logic, validation, authentication, database operations, and API contracts.

SQLite database
  Owns persistent local data storage.

### BrowserWindow Security Configuration

The Electron `BrowserWindow` must use secure defaults:
```js
webPreferences: {
  preload: path.join(__dirname, "preload.js"),
  nodeIntegration: false,
  contextIsolation: true,
}
```

`nodeIntegration` is disabled so React cannot directly use Node.js APIs.

`contextIsolation` is enabled so Electron/preload code and React renderer code remain separated.

The preload script is connected but exposes no APIs yet.

### Development Loading Decision

During development, Electron loads the Vite React dev server:
http://localhost:5173

This allows React fast refresh and keeps frontend development simple.

The Electron main process uses a development branch to load the Vite URL and a future production branch to load the built React output from `dist/index.html`.

Production packaging is not part of this milestone.

### npm Script Decision

The frontend package uses development scripts to run React and Electron together:
```json
"dev": "vite",
"electron": "wait-on http://localhost:5173; electron .",
"desktop": "concurrently -k \"npm run dev\" \"npm run electron\""
```

`concurrently` is used to run the Vite dev server and Electron at the same time.

`wait-on` is used so Electron starts only after the Vite dev server is available.

A PowerShell-compatible command separator is used because the local Windows PowerShell environment did not support `&&`.

### Main Process Platform Decision
The Electron main process handles platform-specific close behavior.

On Windows and Linux, the app quits when all windows are closed.

On macOS, the app remains active until the user explicitly quits, matching normal macOS desktop behavior.

The final implementation may use an explicit Node process import:
```js
import process from "node:process";
```

and check:
```js
process.platform !== "darwin"
```

This avoids editor/tooling confusion where the global `process` object may not be recognized.

### Preload Decision
Create `frontend/electron/preload.js`, but expose nothing during this milestone.

The preload script exists only to prepare the secure architecture for future IPC and desktop APIs.

No `contextBridge`, `ipcRenderer`, filesystem access, app version access, printing, backup, or native OS integration is added yet.

### Why This Decision Was Made
This decision keeps the project simple, secure, and understandable.

Starting with a minimal Electron shell helps separate responsibilities clearly before adding more complexity. It prevents the common beginner mistake of mixing React UI code, Electron desktop code, backend logic, and database access in the same layer.

This also supports HelloStay’s long-term goal as an offline desktop application while preserving FastAPI as the backend source of truth.

### Benefits
* Clear separation between desktop shell and React UI.
* Secure Electron defaults from the beginning.
* React remains simple and browser-like.
* FastAPI remains responsible for business rules and data operations.
* The app can run as a desktop window during development.
* Future preload/IPC work has a safe place to be added later.
* Packaging can be introduced later without rushing the architecture.

### Trade-Offs
* Development now requires running both Vite and Electron.
* The app is not packaged yet.
* Electron does not yet start or manage the FastAPI backend.
* The preload file exists but does not provide functionality yet.
* The startup scripts are still development-focused and may be improved later for stronger cross-platform behavior.

These trade-offs are acceptable because Milestone 2 focuses only on the desktop shell foundation.

### Affected Files
frontend/package.json
frontend/electron/main.js
frontend/electron/preload.js

### Not Included In This Decision

This decision does not include:
* React Router
* Authentication
* Login flow
* Dashboard
* Rooms
* Guests
* Stays
* Bookings
* Finance
* History
* Backend API integration
* FastAPI process startup from Electron
* SQLite access from Electron
* IPC API design
* File system access
* Printing
* App packaging
* Installer setup

### Final Outcome
HelloStay can now be launched as a desktop application during development.

The command:
```bash
npm run desktop
```

starts Vite, waits for the Vite dev server, starts Electron, creates a secure desktop window, and loads the React frontend inside it.

### Consequence
Future milestones can now build on a clear desktop architecture:

Electron wraps the app.
React renders the UI.
Preload safely bridges future desktop APIs.
FastAPI owns business logic.
SQLite stores data.

This decision establishes the foundation for future Electron capabilities without weakening security or mixing responsibilities.

---

# Frontend AD 3: Startup Flow and Routing Belong to the React Renderer
**Status:** Accepted
**Date Recorded:** 2026-06-30
**Milestone:** Frontend Milestone 3 — Startup Flow and Routing
**Project:** HelloStay — Offline Hotel Management System

## 1. Decision
HelloStay will handle startup flow and application routing inside the React renderer process using React Router.

The Electron main process will not manage React routes. It will only create the desktop window, manage the application lifecycle, and load the React app.

Route definitions will be stored separately in:
src/routes/AppRoutes.jsx

Page-level components will be stored in:
src/pages/

The app will start at:
/

The first milestone route structure will be:
/          → StartPage
/login     → LoginPage
*          → NotFoundPage

## 2. Context
HelloStay is an offline desktop application built with Electron, React, and FastAPI.

Electron provides the desktop shell. React provides the user interface inside Electron. FastAPI remains the source of truth for backend business logic, validation, database operations, authentication, and API contracts.

Before adding hotel features, authentication, dashboard layout, or API integration, the frontend needs a clean way to move between screens.

Routing is the mechanism that allows a single React application to show different pages based on the current URL.

## 3. Why This Decision Was Made
This decision was made to keep the frontend architecture clean and scalable.

A production application should not keep all screens inside `App.jsx`. As the project grows, putting all page logic directly inside `App.jsx` would make the file difficult to understand and maintain.

By separating routes into `AppRoutes.jsx`, the application has a clear place for route definitions.

By separating pages into the `pages/` folder, each screen becomes easier to locate, modify, test, and extend.

This also protects the separation of responsibilities between Electron and React.

Electron should not know about routes like:
/login
/rooms
/guests
/dashboard

Those are UI-level routes and belong to React.

## 4. Architecture Rule

The accepted architecture rule is:
React renderer owns application routing.
Electron main process owns desktop lifecycle.
FastAPI owns backend business logic and API contracts.

This means:
* React decides which page to show.
* Electron decides how the desktop window opens.
* FastAPI decides how business data is created, validated, stored, and returned.

## 5. Chosen Approach
The chosen routing approach for Milestone 3 is `BrowserRouter`.

`BrowserRouter` was selected because:
* It is beginner-friendly.
* It works well with the Vite development server.
* It gives clean URLs.
* It is commonly used in React applications.
* It supports normal paths like `/login`.

Example:
/login

instead of:
/#/login

## 6. Alternatives Considered

### Alternative 1: Keep conditional rendering inside App.jsx

Example:
If current screen is "start", show StartPage.
If current screen is "login", show LoginPage.

This was rejected because it does not scale well. It also teaches a weaker architecture pattern for a production application.

### Alternative 2: Use HashRouter

Example route:
/#/login

This can be useful in some packaged Electron applications because it avoids server fallback issues.

However, it was not chosen for this milestone because the app is currently running through Vite during development, and clean browser-style URLs are better for learning React Router basics.

HashRouter may be reconsidered later during Electron packaging if required.

### Alternative 3: Use advanced React Router data routers
This was rejected for now because Milestone 3 has no route loaders, form actions, backend calls, or route-level data fetching.

The milestone only needs simple page navigation.

## 7. Consequences

### Positive Consequences
* The app now has a clean routing foundation.
* `App.jsx` remains small.
* Route definitions are easy to find.
* Page components are organized clearly.
* React renderer responsibilities are clear.
* Electron remains separated from UI routing.
* The app is ready for future login, dashboard, and feature routes.

### Trade-Offs
Using `BrowserRouter` may require additional care later when the Electron app is packaged and loaded from production build files.

This is acceptable because Milestone 3 is focused on development-time routing and beginner-friendly learning.

The routing strategy can be revisited later during the packaging milestone if needed.

## 8. Affected Files

The following files were added:
frontend/src/routes/AppRoutes.jsx
frontend/src/pages/StartPage.jsx
frontend/src/pages/LoginPage.jsx
frontend/src/pages/NotFoundPage.jsx

The following files were updated:
frontend/src/main.jsx
frontend/src/App.jsx
frontend/src/styles/global.css

## 9. What This Decision Does Not Include

This decision does not include:
* Real authentication.
* Login API integration.
* JWT storage.
* Auth context.
* Protected routes.
* Dashboard routes.
* Dashboard layout.
* Hotel feature modules.
* Backend startup from Electron.
* Electron packaging.

These will be handled in later milestones.

## 10. Future Implications

This decision prepares the project for later milestones such as:
/login
/dashboard
/rooms
/guests
/stays
/bookings
/finance
/history
/settings

Later, authentication can introduce protected routes.

Example future structure:
Public routes:
  /
  /login

Protected routes:
  /dashboard
  /rooms
  /guests
  /stays
  /finance

However, protected routes should only be added after real authentication and auth state are designed.

## 11. Final Decision Summary
HelloStay will use React Router inside the React renderer process for application navigation.

Electron will not manage application routes.

FastAPI will not be involved in frontend routing.

The route definitions will live in `src/routes/AppRoutes.jsx`, and screen-level components will live in `src/pages/`.

This keeps the architecture simple, maintainable, beginner-friendly, and production-oriented.


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
Maintain guest database. Card-based layout with avatar initials, stay history derived from bookings (guestId-based with legacy name+phone fallback), total spent calculation, search/filter/pagination. Tabbed View Modal: Profile (personal info), Stays (full stay history), Facilities (Coming Soon), Expenses (Coming Soon), All Activity (unified timeline of booking lifecycle + profile events). Target: Owner (planned).

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

# Frontend AD 4: UI Foundation and Reusable Component System

**Status:** Accepted
**Date Recorded:** 2026-06-30
**Milestone:** Frontend Milestone 4 — UI Foundation and Layout System

## Context

HelloStay is an offline desktop Hotel Management System built with a FastAPI backend, React frontend, and Electron desktop shell.

Milestone 1 established the minimal React foundation using Vite and JavaScript.
Milestone 2 introduced Electron as the desktop shell while keeping React as the renderer process.
Milestone 3 introduced React Router and basic placeholder pages.

At this stage, the application has routing and simple pages, but it does not yet have a reusable visual foundation. Before building authentication, dashboard screens, rooms, guests, stays, bookings, finance, history, or settings, the frontend needs a small UI foundation that promotes consistency, readability, and maintainability.

## Decision

Create a simple UI foundation using plain CSS and reusable React components.

The frontend will use:

* CSS variables for design tokens.
* A clean global CSS structure.
* Small reusable UI components.
* Simple page-level styling.
* Beginner-friendly component patterns using props, children, and className.

The following reusable UI components are introduced:

* `Button`
* `Input`
* `Card`
* `Loading`
* `ErrorMessage`

These components are placed under:

```txt
frontend/src/components/ui/
```

Existing placeholder pages may use these components lightly:

```txt
frontend/src/pages/StartPage.jsx
frontend/src/pages/LoginPage.jsx
frontend/src/pages/NotFoundPage.jsx
```

No full dashboard shell, sidebar, topbar, protected routes, authentication, backend integration, or hotel features are introduced in this milestone.

## Architecture Decision

The frontend will begin with a small custom design system instead of using Tailwind CSS, icon libraries, animation libraries, or third-party UI component libraries.

Styling remains inside the React renderer layer. Electron will not contain UI component logic.

The responsibility split remains:

```txt
FastAPI backend
  Business logic, validation, authentication rules, database operations, API contracts

Electron main process
  Desktop window, app lifecycle, native shell behavior

Electron preload layer
  Safe renderer-main communication when needed

React renderer process
  Pages, components, forms, routing, UI state, styling
```

## Why This Decision Was Made

A reusable UI foundation prevents duplicated styles and inconsistent interface patterns as the application grows.

HelloStay will eventually contain many screens such as login, dashboard, room management, guest management, stay management, finance, history, and settings. These screens will repeatedly need buttons, inputs, cards, loading states, and error messages.

Creating these reusable pieces early helps the project stay organized without prematurely building full business features.

Plain CSS is intentionally chosen for this milestone because it helps build strong fundamentals before introducing additional styling tools. Since the project is being built for learning and production-quality engineering, the priority is to understand how UI systems work from first principles.

## What This Decision Allows

This decision allows future pages to use consistent components such as:

```jsx
<Button>Save</Button>
<Input label="Username" />
<Card>...</Card>
<Loading message="Loading rooms..." />
<ErrorMessage message="Something went wrong." />
```

It also creates a stable place for design tokens such as:

```css
--color-primary
--color-bg
--color-surface
--color-border
--radius-md
--space-md
```

This keeps styling centralized and reduces repeated hard-coded values.

## What This Decision Prevents

This decision prevents:

* Duplicating button styles across pages.
* Duplicating input markup across forms.
* Mixing page-level components with reusable UI components.
* Adding dashboard layout too early.
* Adding authentication before the visual foundation exists.
* Moving UI logic into Electron.
* Introducing styling libraries before understanding CSS fundamentals.
* Creating hotel-specific components before generic UI foundations are stable.

## Affected Files

New files:

```txt
frontend/src/components/ui/Button.jsx
frontend/src/components/ui/Input.jsx
frontend/src/components/ui/Card.jsx
frontend/src/components/ui/Loading.jsx
frontend/src/components/ui/ErrorMessage.jsx
```

Modified files:

```txt
frontend/src/styles/global.css
frontend/src/pages/StartPage.jsx
frontend/src/pages/LoginPage.jsx
frontend/src/pages/NotFoundPage.jsx
```

Unchanged responsibilities:

```txt
frontend/electron/
backend/
frontend/src/routes/AppRoutes.jsx
```

## Implementation Direction

The UI foundation should remain small and readable.

The global stylesheet should contain:

```txt
1. CSS variables
2. base reset
3. body styling
4. page helper classes
5. reusable UI component classes
```

The UI components should be simple functional React components.

The components should accept props only where useful. Examples:

```txt
Button:
  children
  variant
  type
  disabled
  className

Input:
  label
  error
  helperText
  id
  className

Card:
  children
  className

Loading:
  message

ErrorMessage:
  message
```

## Design System Direction

The design system is intentionally minimal.

It includes:

* Primary color
* Background color
* Surface color
* Text color
* Muted text color
* Border color
* Error color
* Border radius values
* Spacing values
* Box shadows
* Base font family

This is enough for the current milestone.

The design system should grow only when future screens reveal real repeated needs.

## Electron Boundary

No Electron files should be changed for this milestone.

Electron’s role remains limited to the desktop shell. React owns the visual interface.

The Electron main process must not create React components, HTML forms, login UI, buttons, page layout, or CSS styling.

If future desktop-native features are required, they should go through a secure preload and IPC boundary. That is not needed in this milestone.

## Backend Boundary

No backend endpoints are consumed in this milestone.

Although the FastAPI backend already contains endpoints for rooms, guests, stays, guest-stays, and system info, Milestone 4 does not connect to them.

The backend remains the future source of truth for:

* Business rules
* Validation
* Authentication
* Database access
* API contracts

## Consequences

Positive consequences:

* The UI becomes more consistent.
* Future pages become easier to build.
* Basic visual tokens are centralized.
* Components are easier to reuse.
* The project remains beginner-friendly.
* The React renderer stays cleanly separated from Electron.
* The app avoids unnecessary dependencies.

Trade-offs:

* Plain CSS requires discipline as the project grows.
* The design system is basic and not visually complete yet.
* Some temporary layout spacing may still exist in placeholder pages.
* More advanced UI patterns are intentionally delayed.

## Rejected Alternatives

### Tailwind CSS

Rejected for this milestone.

Tailwind can be useful later, but introducing it now would add another tool before the core React and CSS fundamentals are clear.

### UI Component Library

Rejected for this milestone.

Libraries such as Material UI, Ant Design, or Chakra UI provide many ready-made components, but they reduce the opportunity to learn reusable component design from first principles.

### Full Dashboard Layout

Rejected for this milestone.

A dashboard layout requires authentication flow, protected routes, navigation structure, and real app sections. That belongs in a later milestone.

### Feature-Specific Components

Rejected for this milestone.

Components such as `RoomCard`, `GuestTable`, `BookingForm`, and `FinanceWidget` are not created yet because hotel features are not part of Milestone 4.

## Final Decision

HelloStay will use a small custom UI foundation built with plain CSS and reusable React components.

This foundation belongs entirely to the React renderer process and will support future frontend milestones without introducing unnecessary complexity or dependencies.

The accepted reusable UI components for this milestone are:

```txt
Button
Input
Card
Loading
ErrorMessage
```

This decision keeps the project simple, understandable, production-oriented, and aligned with the learning goal of rebuilding the frontend from first principles.


---

## Backend Milestone History

### Frontend Rebuild Note
The previous frontend/Electron implementation milestones have been intentionally removed from this history because the frontend will be rebuilt from scratch. The related frontend decisions are now tracked under Future Requirements instead of Architecture Decisions.

### Backend Milestone 0 — Project Planning & Documentation
**Status:** Completed
Project vision, technology stack, architecture approach, and documentation structure defined.

### Backend Milestone 1 — Development Environment Setup
**Status:** Completed
Git repository, virtual environment, dependency installation, requirements.txt.

### Backend Milestone 2 — Backend Architecture Setup
**Status:** Completed
Layered backend structure (api/, core/, database/, models/, schemas/).

### Backend Milestone 3 — Database Foundation
**Status:** Completed
SQLite integration, engine, SessionLocal, Base model, first SystemInfo model.

### Backend Milestone 4 — CRUD API Development
**Status:** Completed
Complete CRUD for SystemInfo using FastAPI and SQLAlchemy.

### Backend Milestone 5 — API Testing & Validation
**Status:** Completed
Swagger UI testing of all CRUD operations.

### Backend Milestone 6 — Room API Foundation
**Status:** Completed
RoomCreate/RoomResponse/RoomUpdate schemas, get_db dependency, APIRouter, response_model.

### Backend Milestone 7 — First Room API Registration
**Status:** Completed
Room router registered in main.py, Swagger integration.

### Backend Milestone 8 — Room Retrieval APIs
**Status:** Completed
GET /rooms (list all), GET /rooms/{room_id} (single with 404 handling).

### Backend Milestone 9 — Room Retrieval API
**Status:** Completed
List response model, ORM serialization for collections.

### Backend Milestone 10 — Single Room Retrieval
**Status:** Completed
GET /rooms/{room_id} with HTTPException 404.

### Backend Milestone 11 — Room CRUD Module
**Status:** COMPLETED
Full CRUD: POST, GET (list + single), PUT (partial update), DELETE with proper error handling.

### Backend Milestone 12 — Guest CRUD API
**Status:** Completed
Full guest CRUD with Alembic migration.

### Backend Milestone 13 — Stay Management System
**Status:** Completed
Stay model with foreign keys, price snapshot, nullable checkout, full CRUD.

### Backend Milestone 14 — Documentation Restructuring
**Status:** Completed
LEARNING_NOTES.md split into BACKEND_CONCEPTS.md, FRONTEND_CONCEPTS.md, ELECTRON_CONCEPTS.md, FULLSTACK_FLOW.md.

### Backend Milestone 15 — Guest Stay Module
**Status:** Completed
GuestStay junction table for many-to-many Guest-Stay relationship with is_primary_guest flag.

### Backend Milestone 16 — Backend Authentication Setup
**Status:** Completed
passlib[bcrypt], python-jose for JWT, core/security.py, schemas/token.py.

---

# Frontend Milestone Plan

## HelloStay Frontend V1 Milestone Plan

### Objective
Divide the remaining **HelloStay frontend + Electron desktop app work** into clear milestones so each milestone can be completed in a separate ChatGPT session under the HelloStay project.

The goal is to keep every session focused, reduce confusion, preserve accuracy, and help with learning:
- React
- JavaScript
- Electron
- Frontend architecture

## Milestone 0: Project Orientation and Rules Review

### Purpose
Before writing code, review the existing backend, API contracts, architecture decisions, and V1 scope.

### Scope
This milestone is only for understanding the project.

### Topics
- HelloStay V1 feature scope
- Existing FastAPI backend structure
- Authentication flow
- API endpoints
- Architecture Decisions
- Offline desktop requirement
- Electron + React responsibility separation

### Output
A clear frontend implementation strategy.

### Done When

You understand:
- What belongs in React
- What belongs in Electron
- What belongs in FastAPI
- What V1 includes
- What V1 excludes

### Suggested Session Title
**Milestone 0 — HelloStay Frontend Orientation**

---

## Milestone 1: Frontend Project Setup

### Purpose
Create the frontend project from scratch.

### Scope
Set up the React frontend foundation without building features yet.

### Topics
- Vite + React setup
- JavaScript project structure
- Basic folder organization
- Development scripts
- ESLint basics
- Environment variables
- API base URL setup

### Folder/File Focus
```text
frontend/
  src/
    main.jsx
    App.jsx
    routes/
    pages/
    components/
    services/
    hooks/
    context/
    utils/
    styles/
```

### Output
A clean React app that runs successfully.

### Done When
- React app starts without errors
- Folder structure is ready
- No hotel features are implemented yet

### Suggested Session Title
**Milestone 1 — React Project Setup**

---

## Milestone 2: Electron Desktop Shell Setup

### Purpose
Add Electron as the desktop shell around React.

### Scope
Set up Electron main process, preload file, and secure renderer loading.

### Topics
- Electron main process
- Renderer process
- Preload script
- BrowserWindow
- Context isolation
- Node integration security
- Loading React inside Electron
- Development vs production startup

### Folder/File Focus
```text
electron/
  main.js
  preload.js

frontend/
  src/
```

### Output
HelloStay opens as a desktop window.

### Done When
- Electron window opens
- React UI loads inside Electron
- Security basics are respected
- Backend logic is not moved into Electron

### Suggested Session Title
**Milestone 2 — Electron Desktop Shell**

---

## Milestone 3: App Startup Flow

### Purpose
Build the first user-facing flow.

### Scope
Create the app start screen and redirect flow into login.

### Topics
- App startup screen
- React Router
- Navigation
- Initial loading screen
- Desktop app startup behavior
- Offline-first mindset

### Pages
- StartPage
- LoginPage placeholder

### Output
The app opens to a start page, then moves to login.

### Done When
- Start page exists
- Login route exists
- Navigation works
- No authentication logic yet

### Suggested Session Title
**Milestone 3 — Startup Flow and Routing**

---

## Milestone 4: Layout System and Design Foundation

### Purpose
Create the visual foundation before feature screens.

### Scope
Build reusable layout, spacing, colors, typography, and shared UI components.

### Topics
- CSS strategy
- Global styles
- App layout
- Reusable buttons
- Inputs
- Cards
- Loading state component
- Error message component
- Responsive desktop UI basics

### Folder/File Focus
```text
components/ui/
  Button.jsx
  Input.jsx
  Card.jsx
  Loading.jsx
  ErrorMessage.jsx

styles/
  global.css
```

### Output
A clean design foundation for the whole app.

### Done When
- UI components are reusable
- Pages do not contain messy duplicated styles
- The app has a consistent visual style

### Suggested Session Title
**Milestone 4 — UI Foundation and Layout System**

---

## Milestone 5: API Client Setup

### Purpose
Create the frontend layer that talks to the FastAPI backend.

### Scope
No screens yet. Only API communication setup.

### Topics
- Fetch API or Axios
- API base URL
- Request helpers
- Error handling
- JSON parsing
- Authentication token attachment
- Backend unavailable handling

### Folder/File Focus
```text
services/
  apiClient.js
  authService.js
```

### Output
A reusable API client.

### Done When
- Frontend can call backend safely
- Errors are handled consistently
- API code is not scattered inside components

### Suggested Session Title
**Milestone 5 — API Client and Backend Communication**

---

## Milestone 6: Authentication UI

### Purpose
Build login and create-account screens.

### Scope
Create the UI first, then connect it to backend authentication.

### Topics
- Controlled forms
- React state
- Form submission
- Validation
- Login request
- Register request
- JWT storage strategy
- Auth errors
- Loading states

### Pages
- LoginPage
- RegisterPage

### Output
User can create an account and log in.

### Done When
- Login works with backend
- Register works with backend
- Invalid credentials show error
- Loading state appears during requests
- Token is stored safely for V1

### Suggested Session Title
**Milestone 6 — Authentication UI and Logic**

---

## Milestone 7: Auth State and Protected Routes

### Purpose
Teach the app who is logged in and protect private pages.

### Scope
Create global authentication state.

### Topics
- React Context API
- AuthProvider
- Protected routes
- Logout
- Persisting login across refresh
- Redirecting unauthenticated users

### Folder/File Focus
```text
context/
  AuthContext.jsx

routes/
  ProtectedRoute.jsx
```

### Output
Only logged-in users can access the dashboard.

### Done When
- Dashboard is protected
- Logged-out users go to login
- Logged-in users remain logged in
- Logout works

### Suggested Session Title
**Milestone 7 — Auth Context and Protected Routes**

---

## Milestone 8: Main Dashboard Shell

### Purpose
Build the main application structure after login.

### Scope
Create the dashboard layout but not all feature logic yet.

### Topics
- Sidebar navigation
- Header
- Main content area
- Nested routes
- Dashboard cards
- Page layout consistency

### Pages
- DashboardLayout
- DashboardHome
- RoomsPage placeholder
- BookingsPage placeholder
- GuestsPage placeholder
- FinancePage placeholder
- HistoryPage placeholder
- SettingsPage optional

### Output
A professional app shell for HelloStay.

### Done When
- Sidebar navigation works
- Header shows app/user info
- Feature pages are reachable
- Layout is reusable

### Suggested Session Title
**Milestone 8 — Dashboard Layout and Navigation**

---

## Milestone 9: Rooms Management

### Purpose
Build the first real hotel module.

### Scope
Manage hotel rooms using backend APIs.

### Topics
- Fetching room list
- Room table/grid
- Create room form
- Edit room form
- Delete/deactivate room
- Room status
- Loading/error/empty states
- Component decomposition

### Pages/Components
- RoomsPage
- RoomList
- RoomCard or RoomTable
- RoomForm
- RoomStatusBadge

### Output
User can manage rooms.

### Done When
- Rooms can be listed
- Rooms can be created
- Rooms can be edited
- Rooms can be deleted/deactivated depending on backend rules
- Errors are shown properly

### Suggested Session Title
**Milestone 9 — Rooms Management Module**

---

## Milestone 10: Guests Management

### Purpose
Build guest record management.

### Scope
Create, view, update, and search guests.

### Topics
- Guest list
- Guest details
- Guest form
- Search/filter
- ID/contact fields
- Form validation
- Reusable form patterns

### Pages/Components
- GuestsPage
- GuestList
- GuestForm
- GuestDetails
- GuestSearch

### Output
User can manage guest records.

### Done When
- Guests can be listed
- Guests can be created
- Guests can be edited
- Guest search works
- Guest details are clear

### Suggested Session Title
**Milestone 10 — Guests Management Module**

---

## Milestone 11: Bookings Management

### Purpose
Build the central hotel workflow: bookings.

### Scope
Create and manage room bookings.

### Topics
- Booking list
- Create booking
- Select guest
- Select available room
- Check-in/check-out dates
- Booking status
- Backend validation
- Date handling
- Conflict handling

### Pages/Components
- BookingsPage
- BookingList
- BookingForm
- BookingDetails
- BookingStatusBadge
- RoomAvailabilitySelector
- GuestSelector

### Output
User can create and manage bookings.

### Done When
- Bookings can be listed
- New booking can be created
- Guest and room are selected properly
- Date validation works
- Backend conflict errors are displayed clearly

### Suggested Session Title
**Milestone 11 — Bookings Management Module**

---

## Milestone 12: Booking Lifecycle Actions

### Purpose
Add real hotel workflow actions to bookings.

### Scope
Implement status-based actions.

### Topics
- Check-in
- Check-out
- Cancel booking
- Booking status transitions
- Confirm dialogs
- Business-rule-driven UI
- Preventing invalid actions

### Components
- BookingActions
- ConfirmDialog
- StatusActionButton

### Output
Bookings can move through their lifecycle.

### Done When
- User can check in a booking
- User can check out a booking
- User can cancel when allowed
- Invalid actions are hidden or disabled
- Backend remains source of truth

### Suggested Session Title
**Milestone 12 — Booking Lifecycle Actions**

---

## Milestone 13: Finance and Income Overview

### Purpose
Show income and financial summaries for V1.

### Scope
Display total income and finance-related booking/payment data based on existing backend endpoints.

### Topics
- Finance dashboard
- Total income
- Date filters
- Booking revenue
- Paid/unpaid status if backend supports it
- Summary cards
- Basic charts only if needed

### Pages/Components
- FinancePage
- IncomeSummaryCards
- FinanceFilters
- RevenueTable

### Output
User can see financial overview.

### Done When
- Total income is visible
- Finance data comes from backend
- Date filtering works if backend supports it
- Empty/error states are handled

### Suggested Session Title
**Milestone 13 — Finance and Income Module**

---

## Milestone 14: History Module

### Purpose
Show historical hotel activity.

### Scope
Display previous bookings, completed stays, cancelled bookings, and relevant records.

### Topics
- Booking history
- Guest stay history
- Filters
- Date ranges
- Status filters
- Read-only historical data
- Difference between active data and history

### Pages/Components
- HistoryPage
- HistoryList
- HistoryFilters
- HistoryDetails

### Output
User can review historical records.

### Done When
- History page works
- Completed/cancelled/past data is visible
- Filters work
- No accidental editing of historical records

### Suggested Session Title
**Milestone 14 — History Module**

---

## Milestone 15: Dashboard Metrics

### Purpose
Make the dashboard useful after core modules exist.

### Scope
Show operational summary on the dashboard home.

### Topics
- Available rooms
- Occupied rooms
- Active bookings
- Today’s check-ins
- Today’s check-outs
- Total guests
- Income summary
- Parallel API calls
- Loading multiple data sources

### Components
- DashboardHome
- MetricCard
- TodayActivity
- DashboardSummary

### Output
Dashboard gives a quick overview of hotel status.

### Done When
- Metrics are displayed
- Data is current
- Loading states are clean
- Errors do not break the whole dashboard

### Suggested Session Title
**Milestone 15 — Dashboard Metrics and Overview**

---

## Milestone 16: Error Handling, Empty States, and UX Polish

### Purpose
Make the app feel reliable and professional.

### Scope
Improve user experience across all modules.

### Topics
- Global error patterns
- Empty states
- Loading skeletons
- Form error messages
- Toast notifications
- Confirmation modals
- Disabled buttons
- Accessibility basics
- Keyboard usability

### Output
The app becomes much more usable.

### Done When
- Every page handles loading
- Every page handles errors
- Empty lists look intentional
- Forms guide the user clearly
- Destructive actions require confirmation

### Suggested Session Title
**Milestone 16 — UX Polish and Error Handling**

---

## Milestone 17: Offline Desktop Behavior

### Purpose
Improve the Electron/offline production behavior.

### Scope
Handle local backend startup and desktop app reliability.

### Topics
- FastAPI backend startup from Electron
- Checking backend availability
- Startup loading state
- Backend connection failure screen
- App quit behavior
- Localhost API configuration
- Desktop-specific error handling

### Electron Responsibility Split

#### Electron Main
- Starts/checks backend
- Manages window lifecycle

#### Preload
- Exposes safe desktop APIs

#### React Renderer
- Shows startup/loading/error UI

### Output
The desktop app behaves properly when launched offline.

### Done When
- App can detect backend availability
- User sees a clear message if backend is unavailable
- React does not directly access unsafe Node APIs
- Electron remains only a shell and startup manager

### Suggested Session Title
**Milestone 17 — Offline Electron Startup Behavior**

---

## Milestone 18: Security Review

### Purpose
Review the app for common frontend and Electron security mistakes.

### Scope
No new features. Review and harden the app.

### Topics
- JWT storage risks
- Protected routes limitations
- Backend authorization
- Electron context isolation
- Disable nodeIntegration
- Secure preload APIs
- Input validation
- XSS prevention
- API error leakage
- Local desktop risks

### Output
Security checklist and improvements.

### Done When
- Electron security basics are correct
- Auth flow is reasonably safe for V1
- No backend business rules are trusted only in frontend
- Sensitive data is not casually exposed

### Suggested Session Title
**Milestone 18 — Frontend and Electron Security Review**

---

## Milestone 19: Testing and Debugging Workflow

### Purpose
Learn how to test and debug the application like an engineer.

### Scope
Add practical testing and debugging workflows.

### Topics
- Manual test checklist
- React DevTools
- Browser DevTools
- Network tab
- Electron DevTools
- Backend logs
- API error debugging
- Component testing basics
- Integration testing strategy

### Output
A repeatable testing checklist.

### Done When
- Each module has manual test cases
- Common bugs can be diagnosed
- You know where to look when something fails

### Suggested Session Title
**Milestone 19 — Testing and Debugging Workflow**

---

## Milestone 20: Packaging Preparation

### Purpose
Prepare HelloStay for desktop distribution.

### Scope
Set up production build and packaging flow.

### Topics
- React production build
- Electron production loading
- Environment configuration
- electron-builder or similar tool
- App icon
- Installer basics
- File paths
- SQLite database location
- Backend executable strategy

### Output
A production packaging plan.

### Done When
- React builds successfully
- Electron can load production build
- Packaging strategy is clear
- Database/backend file path issues are understood

### Suggested Session Title
**Milestone 20 — Electron Packaging Preparation**

---

## Milestone 21: Final V1 Review and Stabilization

### Purpose
Review the whole V1 application before considering it complete.

### Scope
Final cleanup, refactoring, bug fixing, and quality review.

### Topics
- Code cleanup
- Folder consistency
- Naming consistency
- Removing dead code
- UI consistency
- Backend contract review
- Business rule review
- V1 scope review
- Known limitations

### Output
HelloStay V1 frontend is stable and understandable.

### Done When
- Rooms work
- Guests work
- Bookings work
- Finance works
- History works
- Auth works
- Electron desktop shell works
- V1 excludes employees as planned

### Suggested Session Title
**Milestone 21 — Final V1 Review and Stabilization**

---

## Recommended Milestone Order
Use this exact order:

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

---

## Completed Frontend Milestone 

### Frontend Milestone 0 — Frontend Orientation, Backend Contract Review, and Architecture Boundary Confirmation
**Status:** Completed
**Date Recorded:** 2026-06-29

Frontend orientation was completed before writing new React/Electron frontend code.

**What was completed:**
* Reviewed the current HelloStay backend files before starting the frontend rebuild.
* Confirmed that the frontend must be built from actual backend API contracts, not assumptions.
* Confirmed that FastAPI remains the source of truth for business logic, validation, authentication, database operations, and hotel workflow rules.
* Confirmed that React is responsible for renderer UI only: screens, forms, components, routing, loading states, error states, and API calls.
* Confirmed that Electron is responsible for desktop shell behavior only: app window, lifecycle, startup flow, native desktop integration, and packaging.
* Confirmed that preload/IPC should be used only for safe desktop communication when React needs controlled access to Electron functionality.
* Reviewed the currently registered backend routers.
* Confirmed that the backend currently supports Health Check, System Info, Rooms, Guests, Stays, and Guest-Stays.
* Confirmed that the backend currently exposes CRUD-style APIs for Rooms, Guests, Stays, and Guest-Stays.
* Confirmed that the backend has JWT/security helper utilities and token schemas, but no registered authentication router was visible in the uploaded `main.py`.
* Confirmed that real frontend authentication should not be implemented until backend auth routes exist.
* Confirmed that the current backend uses `Stay`, not `Booking`, so the frontend should use `Stay` internally until a true booking/reservation API exists.
* Confirmed that the first frontend-backend integration should be the backend health check using `GET /`.
* Confirmed that the frontend should use a central API client instead of scattered `fetch()` calls.
* Confirmed that future frontend folders should be feature-based, not random or prematurely over-structured.
* Recorded the following architecture decisions from this milestone:

  * Backend contract first.
  * FastAPI remains the source of truth.
  * React is the renderer UI layer.
  * Electron is the desktop shell only.
  * Preload/IPC is only for safe desktop access.
  * A central API client is required.
  * A feature-based folder structure should be used.
  * Real auth must wait until backend auth API exists.
  * Use backend term `Stay` internally.
  * First API integration must be the backend health check.
  * Build Rooms before Guests, Guests before Stays.
  * Dashboard should not be built first.
  * Finance must eventually come from backend-calculated APIs.

**Final approved source structure:**
No frontend source structure was created or modified during this milestone.

Milestone 0 was a planning and orientation milestone only.

Approved future direction:
frontend/
src/
features/
startup/
rooms/
guests/
stays/
guestStays/
shared/
components/
services/
hooks/
utils/

**Files reviewed and approved:**
* Backend `main.py`
* Backend room API file
* Backend guest API file
* Backend stay API file
* Backend guest-stay API file
* Backend system-info API file
* Backend security utility file
* Backend token schema file
* Backend database connection/session/base files
* Backend Room model
* Backend Guest model
* Backend Stay model
* Backend GuestStay model
* Backend SystemInfo model
* Backend Room schema
* Backend Guest schema
* Backend Stay schema
* Backend GuestStay schema
* Existing `PROJECT_NOTES.md`

**Why this milestone matters:**
This milestone prevents the frontend rebuild from starting with guesses, fake APIs, or premature UI decisions.

It establishes the correct engineering direction before implementation:
* The backend API contract drives frontend development.
* React must not contain backend business rules.
* Electron must not become a second backend.
* The preload layer must remain secure and limited.
* Frontend modules must be built in dependency order.
* Authentication must not be faked before backend support exists.
* The first integration must be small, real, and testable.

This milestone protects the project from rebuilding the deleted frontend blindly and keeps the new implementation understandable for learning.

**Backend/API contracts involved:**

Current backend APIs confirmed:
* `GET /`
* `GET /system-info`

Rooms:
* `POST /rooms`
* `GET /rooms`
* `GET /rooms/{room_id}`
* `PUT /rooms/{room_id}`
* `DELETE /rooms/{room_id}`

Guests:
* `POST /guests`
* `GET /guests`
* `GET /guests/{guest_id}`
* `PUT /guests/{guest_id}`
* `DELETE /guests/{guest_id}`

Stays:
* `POST /stay`
* `GET /stay`
* `GET /stay/{stay_id}`
* `PUT /stay/{stay_id}`
* `DELETE /stay/{stay_id}`

Guest-Stays:
* `POST /guest-stays`
* `GET /guest-stays`
* `GET /guest-stays/{guest_stay_id}`
* `PUT /guest-stays/{guest_stay_id}`
* `DELETE /guest-stays/{guest_stay_id}`

Backend/API gaps identified:
* No registered auth router was visible in the uploaded backend entry file.
* No confirmed register endpoint.
* No confirmed login endpoint.
* No confirmed current-user/session endpoint.
* No dashboard summary endpoint.
* No finance summary endpoint.
* No true `/bookings` API.
* No available-room search endpoint.
* No dedicated check-in/check-out workflow endpoints.

**What was intentionally deferred:**
* Writing React code
* Writing Electron code
* Creating frontend folders
* Creating reusable components
* Creating API service files
* Creating routing
* Creating authentication UI
* Creating dashboard UI
* Creating rooms UI
* Creating guests UI
* Creating stays/bookings UI
* Creating finance/history UI
* Creating shared state/context
* Creating custom hooks
* Creating preload/IPC APIs
* Starting FastAPI from Electron
* Packaging the desktop app

**Cleanup performed:**
No code cleanup was performed because this milestone did not modify source files.

Planning cleanup was performed by separating confirmed backend-supported features from future or missing features.

Confirmed as currently supported:

* Health check
* System info
* Rooms
* Guests
* Stays
* Guest-Stays

Marked as pending or future backend support:
* Authentication
* Dashboard summary
* Finance summary
* True bookings/reservations
* Available-room search
* Dedicated check-in/check-out workflow

**Debugging/learning conclusion:**
Before building a frontend feature, always inspect the backend route, schema, model, and response shape.

Do not guess endpoint names or field names.

For HelloStay, frontend debugging should start with the smallest possible full-stack check:
React Start Page
  ↓
systemApi
  ↓
apiClient
  ↓
GET /
  ↓
FastAPI health check response

This confirms that React, FastAPI, CORS, and the API client are working before any hotel module is added.

**Next milestone:**
Frontend Milestone 1 — React Project Setup.

---

### Frontend Milestone 1 — React Project Setup
**Status:** Completed
**Date Recorded:** 2026-06-29

React frontend setup was completed using Vite with JavaScript.

**What was completed:**
* Created a new React frontend using Vite.
* Used JavaScript instead of TypeScript.
* Created a minimal root React app.
* Added `src/main.jsx` as the React entry point.
* Added `src/App.jsx` as the root component.
* Added `src/styles/global.css` for basic global styling.
* Configured Vite to run on port `5173`.
* Enabled `strictPort: true` so Vite does not silently switch ports.
* Removed unused Vite starter files and assets.
* Kept the frontend free of feature logic.

**Final approved source structure:**
frontend/
  src/
    main.jsx
    App.jsx
    styles/
      global.css

**Files reviewed and approved:**

* `frontend/src/App.jsx`
* `frontend/src/main.jsx`
* `frontend/src/styles/global.css`
* `frontend/vite.config.js`

**Why this milestone matters:**
This milestone establishes a clean React renderer foundation before Electron, routing, authentication, API services, or hotel modules are introduced. It keeps the frontend rebuild understandable and prevents premature architecture decisions.

**Backend/API contracts involved:**
No backend API integration was implemented. However, the frontend port was aligned with the backend CORS configuration, which currently allows `http://localhost:5173`.

**What was intentionally deferred:**
* Electron desktop shell
* React Router
* API services
* Authentication
* Dashboard
* Rooms module
* Guests module
* Stays/bookings module
* Finance/history
* Feature components
* Shared context/state management
* Custom hooks
* Utility modules

**Cleanup performed:**
* Removed unused default Vite CSS files.
* Removed unused starter image assets.
* Avoided creating empty future folders such as `components`, `pages`, `routes`, `services`, `hooks`, `context`, and `utils`.

**Debugging/learning conclusion:**
When checking project structure, avoid listing `node_modules` because it contains dependency files and creates noisy output. Prefer:

```powershell
Get-ChildItem .\src -Recurse -File | Select-Object FullName
```

**Next milestone:**
Frontend Milestone 2 — Electron Desktop Shell Setup.

---

## Frontend Milestone 2 — Electron Desktop Shell Setup
**Status:** Completed
**Milestone Number:** 2
**Layer:** Desktop / Frontend Shell
**Technology Used:** Electron, Vite, React, JavaScript

### Objective
Set up the basic Electron desktop shell around the existing Vite React frontend without adding hotel features, routing, authentication, backend integration, packaging, or business logic.

The goal of this milestone was to make HelloStay open as a desktop application while keeping React as the renderer process and Electron as the desktop shell.

### Completed Work
* Installed Electron as the desktop runtime.

* Installed `concurrently` to run Vite and Electron together during development.

* Installed `wait-on` to wait for the Vite dev server before launching Electron.

* Created the Electron main process file:
  frontend/electron/main.js

* Created the Electron preload file:
  frontend/electron/preload.js

* Configured Electron to create a secure `BrowserWindow`.

* Configured Electron to load the Vite React app from:
  http://localhost:5173

* Kept `nodeIntegration` disabled.

* Kept `contextIsolation` enabled.

* Added Electron development scripts in `package.json`.

* Verified that the React app opens inside a native Electron desktop window.

### Files Added
frontend/electron/main.js
frontend/electron/preload.js

### Files Updated
frontend/package.json


### Final Electron Main Process Responsibility
The Electron main process is responsible only for desktop application lifecycle concerns:

* Starting the Electron app.
* Creating the main desktop window.
* Loading the React Vite development server during development.
* Preparing for future production loading from the React build output.
* Handling macOS activate behavior.
* Quitting the app on non-macOS platforms when all windows are closed.

The Electron main process does not contain hotel business logic, database logic, authentication logic, API logic, room logic, booking logic, guest logic, or financial logic.

### Final Preload Responsibility
The preload file exists as a future secure bridge between Electron and React.

For this milestone, the preload file intentionally exposes nothing.

No IPC, desktop APIs, filesystem access, or backend logic were added.

### Development Script Setup
The project now supports running the desktop app during development using:

```bash
npm run desktop
```

The development script starts:
Vite React dev server
Electron desktop shell

Electron waits for Vite to become available before opening the desktop window.

### Important Security Decisions Preserved
* React renderer does not get direct Node.js access.
* Electron APIs are not exposed directly to React.
* `nodeIntegration` remains disabled.
* `contextIsolation` remains enabled.
* Preload remains empty until a real desktop capability is needed.
* Backend business logic remains in FastAPI.
* Database operations remain outside React and Electron.

### What Was Intentionally Not Added
The following were intentionally excluded from this milestone:

* React Router
* Authentication
* Dashboard
* Rooms module
* Guests module
* Stays module
* Bookings module
* Finance module
* History module
* API service layer
* FastAPI backend startup from Electron
* SQLite access from Electron
* IPC communication
* App packaging
* Installer setup
* Production build configuration beyond a basic future loading branch

### Verification Result
The command:

```bash
npm run desktop
```

successfully opened the HelloStay React frontend inside an Electron desktop window.

### Summary
Milestone 2 successfully introduced Electron as the desktop shell for HelloStay while preserving a clean architecture:

Electron main process → desktop lifecycle
React renderer        → user interface
Preload script        → future safe bridge
FastAPI backend       → business logic and API contracts
SQLite database       → persistence

This milestone completed the basic desktop foundation without mixing frontend UI, desktop lifecycle, backend logic, or database responsibilities.

---

# Frontend Milestone 3: Startup Flow and Routing
**Status:** Completed
**Date Completed:** 2026-06-30
**Project:** HelloStay — Offline Hotel Management System
**Frontend Stack:** React, JavaScript, Vite
**Desktop Shell:** Electron

## 1. Milestone Objective
The objective of Milestone 3 was to introduce a clean startup flow and basic routing structure inside the React renderer process.

This milestone focused only on navigation between minimal placeholder pages. No hotel features, backend integration, authentication, dashboard layout, protected routes, Electron backend startup, or packaging logic were added.

## 2. Scope of This Milestone

Milestone 3 included:
* Installing React Router DOM.
* Creating a clean routing structure.
* Creating a minimal `StartPage`.
* Creating a minimal `LoginPage` placeholder.
* Creating a `NotFoundPage` fallback route.
* Setting up routing through `BrowserRouter`.
* Moving route definitions into a dedicated `AppRoutes.jsx` file.
* Making the app open on the startup page.
* Adding a button on the startup page that navigates to the login page.

## 3. Out of Scope

The following were intentionally not added:
* Real authentication.
* Login form.
* JWT handling.
* Auth state.
* Protected routes.
* Dashboard routes.
* Dashboard layout.
* Rooms module.
* Guests module.
* Stays or bookings module.
* Finance module.
* History module.
* Settings module.
* Backend API calls.
* FastAPI startup from Electron.
* Electron packaging.

This was intentional because the milestone was only about routing foundation.

## 4. Final Route Structure

The app now supports the following routes:
/          → StartPage
/login     → LoginPage
*          → NotFoundPage

The `*` route acts as a fallback for unknown paths.

Example:
/random-page → NotFoundPage


## 5. Final Folder Structure

The frontend now follows this structure:
frontend/
  src/
    main.jsx
    App.jsx

    routes/
      AppRoutes.jsx

    pages/
      StartPage.jsx
      LoginPage.jsx
      NotFoundPage.jsx

    styles/
      global.css

## 6. Files Added

The following files were added:
src/routes/AppRoutes.jsx
src/pages/StartPage.jsx
src/pages/LoginPage.jsx
src/pages/NotFoundPage.jsx

## 7. Files Updated

The following files were updated:
src/main.jsx
src/App.jsx
src/styles/global.css


## 8. Implementation Summary
`main.jsx` now wraps the React application with `BrowserRouter`.

main.jsx
  ↓
BrowserRouter
  ↓
App.jsx
  ↓
AppRoutes.jsx
  ↓
Page components


`App.jsx` was kept small and only renders `AppRoutes`.

`AppRoutes.jsx` owns all route definitions.

The startup page contains a button that uses `useNavigate` to move the user to `/login`.

The login page is only a placeholder.

The not-found page uses `Link` to return to the startup page.

## 9. Responsibilities After This Milestone

### React Renderer Process

React owns:
* Page rendering.
* Route definitions.
* Client-side navigation.
* Startup page.
* Login placeholder page.
* Fallback route.

### Electron Main Process

Electron owns:
* Desktop window creation.
* App lifecycle.
* Loading the React app.
* Desktop shell behavior.

Electron does not know about React routes such as `/login`.

### FastAPI Backend

FastAPI remains responsible for:
* Business logic.
* Validation.
* Database operations.
* API contracts.
* Authentication logic later.

No backend integration was added in this milestone.

## 10. Key Concepts Learned

This milestone introduced the following concepts:
* Routing in a React single-page application.
* Difference between client-side navigation and full page reload.
* Why Electron desktop apps can still use React Router.
* Why routes belong in the React renderer process.
* What `BrowserRouter` does.
* What `Routes` does.
* What `Route` does.
* What `Link` does.
* What `useNavigate` does.
* Why authentication and protected routes should wait for later milestones.

## 11. Verification Steps Completed

The following URLs were verified:
http://localhost:5173/
http://localhost:5173/login
http://localhost:5173/random-page


Expected results:
/              shows StartPage
/login         shows LoginPage
/random-page   shows NotFoundPage


The app was also verified through Electron using:
```bash
npm run desktop
```

## 12. Milestone Result
Milestone 3 was completed successfully.

HelloStay now has a clean routing foundation inside the React renderer process while preserving the separation between React, Electron, and FastAPI.

## 13. Suggested Next Milestone

The recommended next milestone is:
Frontend Milestone 4: Authentication UI Foundation

Milestone 4 should still avoid real backend authentication at first. It should focus on creating a clean login page UI structure, basic form state, input handling, and frontend-only validation concepts before connecting to the FastAPI authentication API.

---

# Frontend Milestone 4 Notes: UI Foundation and Layout System

## Milestone Name

Frontend Milestone 4 — UI Foundation and Layout System

## Milestone Status

Completed / Ready to Implement

## Purpose of This Milestone

The purpose of Milestone 4 is to create the basic visual foundation for the HelloStay React frontend.

This milestone does not build hotel features. It prepares the frontend so future screens can be built consistently using reusable UI components and shared styling rules.

The focus is on:

* CSS variables
* Global styling organization
* Reusable UI components
* Basic placeholder page improvement
* Renderer-only UI responsibilities

## What Was Already Completed Before This Milestone

### Milestone 1

* React frontend was created using Vite.
* JavaScript was selected instead of TypeScript.
* The app runs on `http://localhost:5173`.
* A clean minimal frontend structure was created.
* No feature logic was added.

### Milestone 2

* Electron was installed.
* A basic Electron desktop shell was created.
* Electron opens the Vite React app in a desktop window.
* Electron main process, preload script, and renderer process responsibilities were separated.
* `nodeIntegration` remains disabled.
* `contextIsolation` remains enabled.
* No backend startup, packaging, authentication, routing, or hotel features were added.

### Milestone 3

* React Router was introduced.
* A basic routing structure was created.
* `AppRoutes.jsx` was created.
* `StartPage`, `LoginPage`, and `NotFoundPage` were created.
* The app can navigate from the start page to the login page.
* No real authentication, protected routes, dashboard, backend calls, or hotel features were added.

## Milestone 4 Scope

Milestone 4 adds a reusable UI foundation only.

Included:

* Improved `global.css`
* CSS variables for design tokens
* Basic page helper classes
* Reusable UI component classes
* `Button` component
* `Input` component
* `Card` component
* `Loading` component
* `ErrorMessage` component
* Light usage of these components in existing placeholder pages

Excluded:

* Real authentication
* Backend API calls
* Protected routes
* Dashboard layout
* Sidebar
* Topbar
* Rooms module
* Guests module
* Stays module
* Bookings module
* Finance module
* History module
* Settings module
* Electron backend startup
* App packaging
* Tailwind CSS
* UI libraries
* Icon libraries
* Animation libraries

## Final Folder Direction

```txt
frontend/
  src/
    components/
      ui/
        Button.jsx
        Input.jsx
        Card.jsx
        Loading.jsx
        ErrorMessage.jsx

    pages/
      StartPage.jsx
      LoginPage.jsx
      NotFoundPage.jsx

    routes/
      AppRoutes.jsx

    styles/
      global.css
```

## Key Concept: Design System

A design system is a reusable set of visual rules and UI building blocks.

In this milestone, the design system is intentionally small.

It includes:

* Colors
* Spacing
* Border radius
* Shadows
* Font family
* Button styles
* Input styles
* Card styles
* Error styles
* Loading styles

The goal is not to create a complete enterprise design system yet. The goal is to avoid duplicated visual decisions and create a consistent foundation.

## Key Concept: CSS Variables

CSS variables are reusable values defined in CSS.

Example:

```css
:root {
  --color-primary: #2563eb;
}
```

Then they can be reused like this:

```css
.ui-button--primary {
  background: var(--color-primary);
}
```

This helps avoid repeated hard-coded values.

Instead of writing the same color many times, we define it once and reuse it.

## Key Concept: Reusable UI Components

Reusable UI components are small React components that can be used across many screens.

Examples:

```txt
Button
Input
Card
Loading
ErrorMessage
```

Instead of every page writing its own button style, every page can use:

```jsx
<Button>Save</Button>
```

This improves consistency and makes future changes easier.

## Key Concept: Page Components vs UI Components

A page component represents a full screen.

Examples:

```txt
StartPage
LoginPage
NotFoundPage
```

A UI component is a small reusable piece used inside pages.

Examples:

```txt
Button
Input
Card
Loading
ErrorMessage
```

Simple rule:

```txt
Page component = screen
UI component = reusable building block
```

## Key Concept: Props

Props are values passed into a React component.

Example:

```jsx
<Button variant="secondary">Cancel</Button>
```

Here:

```txt
variant is a prop
secondary is the prop value
Cancel is passed as children
```

Props allow one component to behave slightly differently in different places.

## Key Concept: Children Prop

The `children` prop means the content placed between opening and closing component tags.

Example:

```jsx
<Card>
  <h1>HelloStay</h1>
  <p>Offline hotel management system</p>
</Card>
```

The `Card` component receives everything inside it as `children`.

This makes wrapper components flexible.

## Key Concept: className

In normal HTML, we use:

```html
<div class="card"></div>
```

In React JSX, we use:

```jsx
<div className="card"></div>
```

React uses `className` because `class` is a reserved word in JavaScript.

## Files Created

### `frontend/src/components/ui/Button.jsx`

Purpose:

Creates a reusable button component.

Supports:

* `children`
* `variant`
* `type`
* `disabled`
* `className`
* extra props such as `onClick`

Common usage:

```jsx
<Button>Continue</Button>
<Button variant="secondary">Cancel</Button>
<Button variant="ghost">Back</Button>
```

### `frontend/src/components/ui/Input.jsx`

Purpose:

Creates a reusable input component.

Supports:

* `label`
* `error`
* `helperText`
* `id`
* `className`
* normal input props such as `type`, `placeholder`, and `value`

Common usage:

```jsx
<Input
  id="username"
  label="Username"
  type="text"
  placeholder="Enter username"
/>
```

### `frontend/src/components/ui/Card.jsx`

Purpose:

Creates a reusable surface/container component.

Common usage:

```jsx
<Card>
  <h1>HelloStay</h1>
  <p>Welcome to the app.</p>
</Card>
```

### `frontend/src/components/ui/Loading.jsx`

Purpose:

Creates a reusable loading message component.

Common usage:

```jsx
<Loading message="Loading rooms..." />
```

### `frontend/src/components/ui/ErrorMessage.jsx`

Purpose:

Creates a reusable error message component.

Common usage:

```jsx
<ErrorMessage message="Something went wrong." />
```

## Files Modified

### `frontend/src/styles/global.css`

Purpose:

Stores the global visual foundation.

Includes:

* CSS variables
* global reset
* body styles
* page helper classes
* reusable UI classes

Important sections:

```txt
:root design tokens
base reset
page layout helpers
UI component classes
```

### `frontend/src/pages/StartPage.jsx`

Purpose:

Uses `Card` and `Button` to make the start page visually consistent.

Still only navigates to the login page.

No backend logic added.

### `frontend/src/pages/LoginPage.jsx`

Purpose:

Uses `Card`, `Input`, and `Button` to show a placeholder login screen.

Important note:

The login form is not functional yet.

No authentication is added in Milestone 4.

### `frontend/src/pages/NotFoundPage.jsx`

Purpose:

Uses `Card`, `Button`, and `ErrorMessage` to display a consistent 404 page.

## Important Architecture Boundary

Milestone 4 belongs only to the React renderer process.

React renderer handles:

```txt
pages
components
forms
styling
routing UI
placeholder layout
```

Electron main process handles:

```txt
desktop window
app lifecycle
native shell behavior
```

Electron preload handles:

```txt
safe communication between renderer and main process when needed
```

FastAPI backend handles:

```txt
business logic
validation
database operations
API contracts
authentication rules
```

No Electron files should be changed in this milestone.

No FastAPI files should be changed in this milestone.

## Why Dashboard Layout Was Not Built

Dashboard layout is intentionally delayed.

A real dashboard shell usually needs:

* authenticated user state
* protected routes
* sidebar navigation
* topbar
* logout behavior
* active route highlighting
* feature sections

Since real authentication and protected routes are not built yet, building the dashboard shell now would create premature structure.

Milestone 4 only builds generic UI pieces that can support the dashboard later.

## Why Tailwind or UI Libraries Were Not Added

Tailwind, Material UI, Chakra UI, Ant Design, and similar tools are not used in this milestone.

Reason:

The project goal is to learn frontend architecture from first principles.

Plain CSS helps teach:

* CSS variables
* reusable class names
* layout basics
* component styling
* separation of concerns
* design token thinking

External libraries can be useful later, but they are unnecessary for this foundation milestone.

## Verification Steps

After implementing Milestone 4:

Run the React development server:

```bash
npm run dev
```

Open:

```txt
http://localhost:5173
```

Verify:

* Start page loads.
* Start page uses the new card/button styling.
* Clicking the login navigation opens the login page.
* Login page shows placeholder inputs.
* Login button remains disabled.
* Back navigation works.
* Unknown routes show the not found page.
* No console import errors appear.
* No CSS import errors appear.

If using Electron development command, verify:

```bash
npm run desktop
```

Expected result:

* Electron opens the React app.
* The same styled pages appear inside the desktop window.
* No Electron main/preload changes are required.

## Common Errors and Fixes

### Error: Failed to resolve import

Cause:

The file path is wrong or the file does not exist.

Example:

```txt
Failed to resolve import "../components/ui/Button.jsx"
```

Fix:

From a page file inside:

```txt
src/pages/
```

the correct import path is:

```jsx
import Button from "../components/ui/Button.jsx";
```

### Error: Styles are not applied

Cause:

`global.css` may not be imported in `main.jsx`.

Fix:

Make sure this exists in:

```txt
frontend/src/main.jsx
```

```jsx
import "./styles/global.css";
```

### Error: Login button does nothing

Cause:

The login button is intentionally disabled.

Milestone 4 does not implement authentication.

### Error: Page navigation does not work

Cause:

The `Link` route path may not match `AppRoutes.jsx`.

Fix:

Check that `/login` exists in `AppRoutes.jsx`.

## Beginner Lessons Learned

Milestone 4 teaches:

* How a small design system begins.
* How CSS variables reduce duplication.
* How reusable components make pages cleaner.
* How props customize components.
* How `children` makes wrapper components flexible.
* How `className` connects JSX to CSS.
* Why UI belongs in React, not Electron main.
* Why building features too early creates confusion.
* Why production apps grow through small stable foundations.

## Production Lessons Learned

A production frontend should not grow randomly.

Before creating many feature screens, it needs:

* consistent styling rules
* reusable primitives
* clear folder structure
* predictable component APIs
* clean architecture boundaries

Milestone 4 establishes those basics.

## Final Milestone 4 Result

At the end of this milestone, HelloStay has:

```txt
A cleaner global CSS foundation
A small design token system
Reusable UI components
Improved placeholder pages
Clear renderer-only UI responsibility
No premature hotel features
No premature dashboard shell
No backend integration
No Electron responsibility leakage
```

## Suggested Next Milestone

The next milestone should likely focus on one of these:

```txt
Milestone 5 — Authentication UI Foundation
```

or

```txt
Milestone 5 — Login Page Form State and Validation Without Backend
```

Recommended next step:

Build the login page properly as a frontend-only form first.

That would teach:

* controlled inputs
* React state
* form submission
* validation
* error display
* disabled submit behavior
* loading state simulation
* preparing for future backend authentication

```
```
