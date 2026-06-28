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

### AD 47: Adopt Alembic as the Sole Database Schema Manager
**Status:** Accepted

`Base.metadata.create_all()` removed. All schema changes through Alembic migrations.

### AD 48: Rebuild Initial Migration History Before Feature Development
**Status:** Accepted

Existing dev database and incomplete migration files discarded. Clean initial migration generated.

### AD 49: Store Historical Stay Price Independently from Room Price
**Status:** Accepted

Stay model stores agreed nightly rate at check-in. Room model stores only current price. Small intentional duplication in exchange for accurate historical billing.

### AD 50: Validate Auto-Generated Migrations Before Applying
**Status:** Accepted

Every autogenerated migration must be manually reviewed before applying to the database.

### AD 51: Verify ORM Metadata Before Generating Migrations
**Status:** Accepted

Verify all expected tables are present in `Base.metadata.tables` before generating important migrations.

### AD 52: Review Auto-Generated Migrations Before Database Upgrade
**Status:** Accepted

Review confirms: table creation, column definitions, primary keys, foreign keys, constraints, indexes, cascade behavior.

### AD 53: Use Alembic as the Sole Database Schema Manager
**Status:** Accepted

Alembic is the single source of truth. `Base.metadata.create_all()` removed from application startup.

### AD 54: Adopt Version-Controlled Database Evolution
**Status:** Accepted

Workflow: Update ORM models → Generate migration → Review → Apply via `alembic upgrade head`.

### AD 55: Separate Documentation by Technology Layer
**Status:** Accepted

Monolithic LEARNING_NOTEBOOK.md split into: BACKEND_CONCEPTS.md, FRONTEND_CONCEPTS.md, ELECTRON_CONCEPTS.md, FULLSTACK_FLOW.md.

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

## Milestone History

### Frontend Rebuild Note
The previous frontend/Electron implementation milestones have been intentionally removed from this history because the frontend will be rebuilt from scratch. The related frontend decisions are now tracked under Future Requirements instead of Architecture Decisions.

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

### Milestone 16 — Backend Authentication Setup
**Status:** Completed
passlib[bcrypt], python-jose for JWT, core/security.py, schemas/token.py.
