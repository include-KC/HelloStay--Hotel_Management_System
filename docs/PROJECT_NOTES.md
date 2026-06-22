# HelloStay Project Notes

## Product Vision
HelloStay is designed as a general-purpose hotel management system rather than a custom solution for a single hotel.

### Target Market
* Small hotels
* Medium hotels
* Guest houses
* Lodges
* Resorts

### Long-Term Goal
Allow hotel owners from different countries to use the same application with minimal configuration.

---

## Future Requirement: Hotel Registration
>During initial setup, the application should allow the hotel owner to register:
* Hotel Name
* Country
* Address
* Contact Information
* Hotel Facilities

>Examples:
* WiFi
* Restaurant
* Parking
* Laundry
* Swimming Pool

---

## Future Requirement:Multi-Currency Support
The application should support multiple currencies based on the hotel's country.

>Examples:
* INR
* USD
* EUR
* GBP

>Purpose:
Allow future global usage of HelloStay.

>Note:
This feature is planned for future implementation and is not required for Milestone 1.

---

## Future Requirement: Room Image Management
>During room creation, the hotel owner should be able to:
* Add room images
* Update room images
* Remove room images

>Purpose:
Improve room identification and management.

---

## Future Requirement: Customer Identity Storage
Customer records should support storing scanned identification documents.

>Examples:
* Passport
* National ID
* Driving License

>Purpose:
Maintain customer verification records.

---

## Future Enhancement: OCR-Based Customer Registration
Future versions may support automatic extraction of customer information from scanned identity documents.

>Potential Fields:
* Name
* Date of Birth
* Document Number
* Address

>Status:
Future enhancement only.
Not required for initial release.

---

## Future Requirement: Billing System

>During checkout, the application should:
* Generate bill automatically
* Calculate charges
* Produce printable invoice

Printing support should be available from within the application.

Bill format will be finalized later.

---

## Project Overview

### Project Name
HelloStay

### Project Type
Offline Desktop Hotel Management System

### Target Users
* Receptionist
* Manager
* Owner

### Primary Goal

>Provide a complete hotel management solution for managing:
* Rooms
* Customers
* Reservations
* Check-ins
* Check-outs
* Billing
* Inventory
* Reports

## Final Project Structure(Target)

>HelloStay/
│
├── frontend/
│   ├── src/
│   │
│   ├── components/
│   ├── pages/
│   ├── services/
│   ├── hooks/
│   ├── layouts/
│   ├── routes/
│   ├── assets/
│   └── utils/
│
├── backend/
│   ├── app/
│   │
│   ├── api/
│   ├── models/
│   ├── schemas/
│   ├── services/
│   ├── repositories/
│   ├── core/
│   ├── database/
│   └── utils/
│
├── electron/
│   ├── main.js
│   ├── preload.js
│   └── config/
│
├── database/
│   └── hotel.db
│
├── backups/
│
├── logs/
│
└── docs/

---

## Technology Stack
### Frontend
React

### Desktop Layer
Electron

### Backend
FastAPI

### Database
SQLite

### ORM
SQLAlchemy

---

## Why These Technologies Were Chosen

### React
>Chosen for:
* Component-based architecture
* Reusability
* Large ecosystem
* Industry popularity

### Electron
>Chosen because:
* Allows web technologies to run as desktop applications
* Cross-platform support
* Single codebase

### FastAPI
>Chosen for:
* High performance
* Automatic API documentation
* Easy development experience
* Modern Python architecture

### SQLite
>Chosen because:
* Lightweight
* Serverless
* Ideal for offline desktop applications

### SQLAlchemy:
>Chosen because:
* ORM support
* Cleaner database code
* Easier maintenance

---

## Backend Architecture Decision
The backend will follow a layered architecture.

### Structure
app/
├── api/
├── core/
├── database/
├── models/
├── schemas/
└── main.py

### Reason
To separate responsibilities and keep the application scalable.

### Benefits
* Easier maintenance
* Easier testing
* Easier debugging
* Cleaner code organization

### What Each Folder Will Do
> api/ :
- Contains API routes.

_Examples_: 
rooms.py
customers.py
reservations.py
auth.py

> core/ :
Contains application configuration.

_Example_:
settings.py
security.py
constants.py

> models/ :
Contains SQLAlchemy database models.

_Example_:
class Room(Base)
Tables are defined here.

> schemas/ :
Contains Pydantic validation schemas.

_Example_:
class RoomCreate(BaseModel)
Used to validate API model.

> database/ :
Contains database connection code.
Anyting related to SQLite connection belongs here.

_Example_:
connection.py
session.py
base.py

### Industry Principle
Each folder should have a single responsibility.

> Bad:
main.py
- contains everything.

> Good:
api/
models/
schemas/
database/
core/
- Each folder has one purpose.

---

## Development Approach

The project will be built milestone by milestone.

### Principles

* Learn before implementing
* Follow industry practices
* Maintain documentation
* Use version control
* Build production-quality code

### Documentation Files

>BACKEND_CONCEPTS.md
Purpose:
Store technical concepts learned during development.

>DEVELOPER_HANDBOOK.md
Purpose:
Store professional practices and workflows.

>PROJECT_NOTES.md
Purpose:
Store project decisions and architecture choices.

---

## Architecture Decision 1

### Backend Layer Separation

>Chosen Structure:
app/
├── api/
├── core/
├── database/
├── models/
├── schemas/

### Reason
To separate responsibilities across the application.

### Expected Benefits
- Cleaner code
- Easier debugging
- Better scalability
- Easier team collaboration
- Simpler testing

### Future Usage
api/ -> API endpoints

schemas/ -> Request and response validation

models/ -> Database tables

database/ -> Database connection management

core/ -> Application configuration

---

## Architecture Decision 2

### Database Choice

>Chosen Database:
SQLite

### Reason
HelloStay is an offline desktop application.

### Benefits
- No server setup
- Easy backup
- Easy deployment
- Lightweight

### Database File
hellostay.db

### ORM
SQLAlchemy

### Reason
Provides object-oriented database interaction and cleaner code architecture.

---

## Architecture Decision 3

### Database Layer Separation
Database-related code is stored separately from API code.

>Structure:
database/
├── base.py
└── connection.py

>Reason:
- Reusability
- Maintainability
- Cleaner architecture

>Benefit:
Future database changes can be made without modifying API routes.

---

## Architecture Decision 4

### Model-Based Database Design
Database tables will be defined using SQLAlchemy models.

>Example:
class Room(Base)
class Customer(Base)
class Reservation(Base)

>Benefits:
- Object-oriented design
- Cleaner code
- Easier maintenance
- Strong integration with FastAPI

---

## Architecture Decision 5

### ORM-Based Table Generation
Tables will be generated from SQLAlchemy models rather than manually writing SQL CREATE TABLE statements.

>Benefits:
- Consistent schema definition
- Easier maintenance
- Faster development
- Better integration with application code

---

## Architecture Decision 6

### Session-Based Database Access
Database operations will be performed through SQLAlchemy sessions.

>Reason:
- Centralized database access
- Better transaction control
- Industry-standard SQLAlchemy pattern

>Benefits:
- Safer updates
- Easier debugging
- Consistent database interactions

---

## Architecture Decision 7

### Separate API Layer
API endpoints are stored in dedicated router files.

>Example:
app/api/system_info.py

>Reason:
- Better organization
- Easier maintenance
- Scales well as the project grows

>Future modules:
- room.py
- customer.py
- reservation.py
- billing.py

---

## Architecture Decision 8

### Documentation-Driven Development
Documentation will be maintained alongside development.

>Documentation Files:
- BACKEND_CONCEPTS.md
- DEVELOPER_HANDBOOK.md
- PROJECT_NOTES.md

>Reason:
Knowledge gained during development should be preserved for future reference.

>Benefits:
- Faster onboarding
- Easier revision
- Better project understanding
- Reduced dependency on memory

>Industry Practice:
Well-documented projects are easier to maintain and scale.

---

## Architecture Decision 9

### Hotel-Level Business Settings
>Decision
Business configuration settings will be stored in a dedicated `hotel_settings` table instead of the `rooms` table or `system_info` table.

>Examples of Future Settings
- Check-in time
- Checkout time
- GST percentage
- Hotel contact information
- Invoice settings
- Late checkout policies

>Reason
These settings belong to the hotel as a whole and should not be duplicated for every room.

>Impact
- Better normalization
- Easier maintenance
- Improved scalability
- Cleaner separation of responsibilities

---

## Architecture Decision 10

### V1 First, V2 Later Strategy
>Decision
HelloStay will prioritize completing a fully functional V1 before implementing advanced architecture improvements.

>V1 Focus
- Core functionality
- Complete hotel workflow
- End-to-end usability
- Faster development

>V2 Focus
- Database normalization improvements
- Advanced relationships
- Enhanced validation
- Performance optimizations
- Industry-level architecture enhancements

>Reason
Completing a working product provides faster feedback and practical experience. Architectural refinements can then be implemented with a better understanding of real application requirements.

>Impact
- Faster delivery of V1
- Reduced overengineering
- Clear upgrade path for future versions

---

## Architecture Decision 11

### Room Facilities Storage
>Decision
Room facilities will be stored as a comma-separated string in the Room table during V1.

>Example
AC,WiFi,TV,Hot Water

>Reason
Simplifies implementation and reduces database complexity during the initial development phase.

>Future Improvement
A dedicated facilities table and many-to-many relationship may be introduced in V2 if advanced filtering becomes necessary.

---

## Architecture Decision 12

### Room Status Validation Strategy
>Decision
Room status will be stored as a String field during V1.

>Allowed Values
- Available
- Occupied
- Reserved
- Maintenance

>Validation Location
Frontend dropdown and API validation.

>Reason
Allows faster development while keeping the database schema simple.

>Future Improvement
May be converted to an Enum in V2.

---

## Architecture Decision 13

### Optional Maximum Occupancy
>Decision
The max_occupancy field will be optional and stored as nullable in the database.

>Reason
Some hotel owners may not define a maximum occupancy value for rooms.

>Business Consideration
Actual room occupancy can be inferred from reservation records when necessary.

>Impact
- Increased flexibility for hotel owners
- Better alignment between business requirements and database design
- Reduced data entry requirements during room creation

---

## Architecture Decision 14

### Room Status vs Reservation Availability
>Decision
room_status will represent the current operational state of a room.

>Examples
- Available
- Occupied
- Maintenance
- Out of Service

>Future Reservation Handling
Date-based availability will be determined through reservation records rather than room_status.

>Reason
- A room may be available today while already reserved for future dates.

- Using reservation records provides accurate availability calculations for advance bookings.

---

## Architecture Decision 15

### Upcoming Reservation Visibility
>Decision
Future reservations will not be stored in room_status.

>Reason
- room_status should represent only the current operational state of a room.

- Future bookings are reservation data and should be obtained from reservation records.

>Operational Requirement
Managers must be able to view upcoming reservations associated with a room.

>Example
Room 101
Current Status: Occupied

Upcoming Reservation:
Check-in: 13 June

This helps staff manage guest extensions and room allocation.

---

## Architecture Decision 16

### Room Configuration vs Room Operations
>Decision
Room status and room configuration are conceptually different responsibilities.

>Room Operations
Frequently updated values:
- room_status

>Room Configuration
Rarely updated values:

- room_number
- room_type
- price_per_night
- max_occupancy
- facilities

>V1 Implementation
A single RoomUpdate schema will be used for simplicity.

Future versions may separate configuration updates from operational status updates.

---

## Architecture Decision 17

### Centralized Database Session Management
>Decision
Database sessions will be managed through a shared get_db() dependency.

>Reason
Avoid repetitive session creation code across API endpoints.

>Benefits
- Cleaner code
- Automatic session cleanup
- Consistent database access pattern
- Easier testing and maintenance

---

## Architecture Decision 18

### Database Session Dependency
>Decision
A shared get_db() dependency will be used by all API endpoints.

>Implementation
def get_db():
    db = SessionLocal()

    try:
        yield db

    finally:
        db.close()

>Benefits
- Automatic session cleanup
- Consistent database access
- Reduced code duplication
- FastAPI dependency injection support

---

## Architecture Decision 19

### Database Access Pattern
>Previous Approach
Each endpoint manually created and closed database sessions.

>New Approach
Use FastAPI dependency injection:
db: Session = Depends(get_db)

>Reason
- Less code duplication
- Centralized session management
- Industry standard FastAPI pattern
- Easier maintenance

---

## Architecture Decision 20

### Explicit Schema-to-Model Mapping

>Decision
HelloStay V1 will use explicit field mapping when creating database objects.

__Example__:
room_number=room.room_number

__instead of__:
Room(**room.model_dump())

>Reason
- Easier learning
- More explicit code
- Easier debugging
- Better understanding of data flow

>Future
May switch to automatic mapping in V2 after core architecture is stable.

---

## Architecture Decision 21

### Room API Response Strategy

>Decision
Room APIs will use FastAPI response models instead of manually creating response dictionaries.

>Example:
@router.post("/rooms", response_model=RoomResponse)

return new_room

>Previous Approach
return {
    "id": room.id,
    ...
}

>Reason
- Reduces repetitive code
- Automatic response validation
- Easier maintenance when fields change
- Industry-standard FastAPI pattern
- Better integration with Pydantic schemas

>V1 Scope
SystemInfo APIs will remain unchanged.

Room APIs will adopt response_model-based responses.

---

## Architecture Decision 22

### Pydantic ORM Serialization
>Decision
RoomResponse will support direct serialization from SQLAlchemy ORM objects.

>Implementation
model_config = ConfigDict(
    from_attributes=True
)

>Reason
Allows FastAPI and Pydantic to convert SQLAlchemy objects into API responses automatically.

>Benefits
- Cleaner endpoint code
- No manual response dictionaries
- Automatic validation
- Better scalability for future modules

---

## Architecture Decision 23

### Room Creation API Pattern
>Decision
Room creation endpoints will follow:

Create ORM Object
→ db.add()
→ db.commit()
→ db.refresh()
→ return ORM Object

>Reason
- Ensures database-generated values are available
- Compatible with response_model
- Industry-standard SQLAlchemy workflow

---

## Architecture Decision 24

### Router Registration Pattern
>Decision
All feature modules will expose a router object and will be registered in main.py.

>Example
from app.api.room import router as room_router

app.include_router(room_router)

>Reason
- Clear module separation
- Scalable project structure
- Easy feature expansion
- Industry-standard FastAPI architecture

---

## Architecture Decision 25

### Room Number Uniqueness
>Decision
room_number must be unique within the Room table.

>Reason
Two rooms cannot share the same room number.

>Enforcement
Database-level UNIQUE constraint on room_number.

>Benefit
Prevents duplicate room creation even if API validation is bypassed.

---

## Architecture Decision 26

### Single Room Retrieval Pattern
>Endpoint
GET /rooms/{room_id}

>Query Pattern
room = db.query(Room)\
    .filter(Room.id == room_id)\
    .first()

>Error Handling
if room is None:
    raise HTTPException(
        status_code=404,
        detail="Room not found."
    )

>Reason
- A room lookup by ID may fail if the requested room does not exist.

- Returning HTTP 404 is the REST-compliant response for missing resources.

---

## Architecture Decision 27

### Room Partial Update Strategy
> Decision
Room updates will support partial updates.

> Implementation
```python
update_data = room.model_dump(exclude_unset=True)

for key, value in update_data.items():
    setattr(existing_room, key, value)
```

> Example
__Request__:
```json
{
    "room_status": "Occupied"
}
```

__Result__:
Only room_status is updated.

All other room fields remain unchanged.

> Reason
- Users should not be required to send unchanged fields.
- Reduces data transfer.
- Preserves existing database values.
- Follows modern REST API practices.

---

## Architecture Decision 28

### Missing Resource Handling
> Decision
All room endpoints will return HTTP 404 when a requested room does not exist.

> Implementation
```python
raise HTTPException(
    status_code=404,
    detail="Room not found."
)
```

> Reason
- REST-compliant behavior
- Consistent API design
- Better frontend error handling

---

## Architecture Decision 29

### Delete Response Strategy
> Decision
Room deletion endpoints will return a success message after successful deletion.

> Implementation
```python
return {
    "message": "Room deleted successfully"
}
```

> Reason
- The deleted room no longer exists.
- Clients only require confirmation.
- Simpler API response design.

---

## Architecture Decision 30

### Guest Information Storage
> Decision
The Guest table will store:
guest_id
guest_name
phone_number
address
id_proof_type
id_proof_number

> Excluded Fields
room_number
check_in_datetime
check_out_datetime

- These belong to the Booking table.

> Reason
- Guest information represents a person.

- Booking information represents a specific stay.

- Separating these entities prevents data duplication and follows proper database normalization principles.

---

## Architecture Decision 31

### Guest Phone Number Strategy
> Decision
- Guest phone numbers will be stored as strings.

- Future versions of HelloStay will separate:
country_code
phone_number

> Reason
- Supports international numbers.
- Preserves leading zeros.
- Supports "+" prefixes.
- Aligns with common hotel management systems.

> UI Design
A country-code dropdown will be displayed beside the phone number input field.

The dropdown may be preselected but must remain editable by the user.

---

## Architecture Decision 32

### Guest Update Strategy
> Decision
GuestUpdate schemas will use optional fields.

> Example
```python
guest_address: Optional[str] = None
```

> Reason
A receptionist may only need to update a subset of guest information.

_Example_:
```json
{
  "guest_address": "Bhopal"
}
```

- Only the address changes while all other guest data remains unchanged.

> Create vs Update
__GuestCreate__:
All fields required.

__GuestUpdate__:
All fields optional.

---

## Architecture Decision 33

### Migration-Based Schema Management
> Decision
HelloStay will use Alembic migrations to manage database schema changes.

> Reason
Database structures will evolve as new modules are added.

>Examples:
Guest
Booking
Payment
Check-In
Check-Out

- Using migrations prevents data loss and keeps database tables synchronized with SQLAlchemy models.

> Analogy
- Git tracks source-code changes.
- Alembic tracks database-schema changes.

---

## Architecture Decision 34

### Router Prefix Pattern
> Decision
Each resource router will define its own prefix.

>Example:
router = APIRouter(
    prefix="/guests",
    tags=["Guests"]
)

> Endpoint Style
@router.get("")
@router.get("/{id}")
@router.put("/{id}")
@router.delete("/{id}")

__instead of__:
@router.get("/guests")
@router.get("/guests/{id}")

> Reason
- Eliminates duplicate route segments.
- Keeps routes cleaner.
- Makes Swagger grouping easier.
- Improves maintainability as the project grows.

> Result
Guests
Rooms
System Info

- appear as separate sections in Swagger UI.

---

## Architecture Decision 35

### Separate Guest Identity From Room Assignment
> Decision
- Guest records will initially store only guest identity information.

- Room assignment will be handled through dedicated occupancy/check-in logic.

> Guest Scope
Name
Phone Number
Address
ID Proof Type
ID Proof Number

> Excluded For Now
Room Assignment
Check-In Logic
Check-Out Logic
Occupancy Tracking

> Reason
- Guest information and hotel stay information represent different business concerns.

- Keeping them separate simplifies CRUD development and allows occupancy workflows to be designed independently.

> Future Extension
Guest-to-room relationships will be introduced through room occupancy management APIs.

---

## Architecture Decision 36

### Room Occupancy Model
> Decision
A room may contain multiple guests simultaneously.

> Examples
Room 101
├── Guest A
├── Guest B
├── Guest C

Room 205
├── Guest A
├── Guest B

> Reason
- Families may stay together.
- Couples may stay together.
- Group bookings become possible.
- Matches real hotel operations.

> Result
- The system will not enforce a one-guest-per-room restriction.

- Future occupancy design must support one-to-many room occupancy relationships.

---

## Architecture Decision 37

### Separate Guest Identity From Stay Records
> Decision
Guest information and hotel stay information will be stored in separate tables.

> Guest Table Responsibility
Name
Phone Number
Address
ID Proof Type
ID Proof Number

> Stay Table Responsibility
Assigned Room
Check-In Date & Time
Check-Out Date & Time
Stay Status

> Reason
The same guest may stay in the hotel multiple times.

>Example:
Guest: Krishna Chaurasia

Stay #1
Room 101
01-Jan-2026

Stay #2
Room 205
15-Feb-2026

Stay #3
Room 103
20-Apr-2026

- Without a separate Stay table, guest records would need to be duplicated.

> Result
Guest identity management and hotel occupancy management remain independent and scalable.

---

## Architecture Decision 38

### Stay Status Simplification
> Decision
The Stay table will initially support only two statuses.
Checked In
Checked Out

> Reason
- Keeps the occupancy workflow simple.
- Reduces unnecessary complexity during early development.
- Covers the primary hotel operation flow.

> Future Expansion
Additional statuses may be introduced later.

>Examples:
Cancelled
No Show
Extended
Reserved

> Result
Initial stay management logic will operate using only:
Checked In
Checked Out

---

## Architecture Decision 39

### Avoid Duplicate Room Information
> Decision
The Stay table will store:
room_id

only.

It will not store:
room_number

> Reason
- Room information already exists inside the Rooms table.

- Duplicating room_number would create redundant data.

>Example:
Stay
└── room_id = 5

Room
└── room_number = 101

- The room number can always be retrieved through the room relationship.

> Result
The database remains normalized and avoids data inconsistency.

---

## Architecture Decision 40

### Nullable Check-Out Timestamp
> Decision
The Stay table will allow:
check_out_datetime

to be NULL.

> Reason
- At check-in time the guest has not yet checked out.

- Therefore the checkout timestamp is unknown.

>Example:
Guest Checks In
↓
check_in_datetime = populated

check_out_datetime = NULL

__Later__:
Guest Checks Out
↓
check_out_datetime = populated

> Result
- Active stays are identified by:

check_out_datetime = NULL

and completed stays contain a checkout timestamp.

---

## Architecture Decision 41

### Store Price Snapshot In Stay Records
> Decision
_The Stay table will contain_:
price_per_night

_in addition to_:
room_id

> Reason
Room prices may change over time.

>Example:
01-Jan-2026

Room 101
₹3000/night

Guest checks in.

__Later__:
Room 101
₹4000/night

Historical stay records must still reflect the original amount paid.

> Result
- Each stay preserves the room price that was active at check-in time.

- Future room price changes do not affect historical stay records.

---

## Architecture Decision 42

### Stay Records Preserve Historical Relationships
> Decision
The Stay table will not enforce uniqueness on:
guest_id
room_id

> Reason
A guest may stay multiple times.
__Example__:
Guest
├── Stay #1
├── Stay #2
└── Stay #3

- A room may host multiple stays over time.

__Example__:
Room 101
├── Stay #1
├── Stay #2
└── Stay #3

> Result
Both foreign keys represent reusable historical relationships rather than one-time assignments.

---

## Architecture Decision 43
__Title__: Introduce Stay Entity for Occupancy Tracking

>Status:
Accepted

>Context:
Guests and rooms are permanent entities. A hotel requires a transactional record representing each occupancy period of a guest in a room.

>Decision:
A dedicated Stay entity was introduced containing:
- guest_id
- room_id
- price_per_night
- check_in_datetime
- check_out_datetime
- stay_status

- The Stay table references Guest and Room through foreign keys.

>Consequences:
- Historical occupancy tracking becomes possible.
- One guest can have multiple stays over time.
- One room can be occupied across multiple stays over time.
- Billing and checkout calculations can be built on top of Stay records.

---

## Architecture Decision 44: 
__Title__:
Normalize Guest–Stay Relationship Using a Junction Table

**Status:** Accepted

### Context
A hotel room can be occupied by multiple guests during a single stay.

>Examples:
- Family bookings
- Business groups
- Friends sharing one room

A simple `guest_id` foreign key inside the `Stay` table cannot represent this relationship.

### Decision
Introduce a dedicated junction table:
Guest
   │
GuestStay
   │
Stay

The `GuestStay` table stores:
- guest_id
- stay_id
- is_primary_guest

### Consequences
__Advantages__:
- Supports multiple guests per stay.
- Supports multiple stays for a single guest.
- Eliminates duplicate relationship data.
- Maintains database normalization.
- Provides a natural place to store guest-specific stay information.
- Allows one guest to be designated as the Primary Guest for billing.

__Trade-offs__:
- Slightly more complex queries.
- Additional ORM relationships are required.
- CRUD operations require handling the junction table.

This design was chosen because it is scalable and accurately models real-world hotel occupancy.

---

## Architecture Decision 45: 
__Title__:
Keep Direct Model Imports During Learning Phase

**Status:** Temporary

### Context
SQLAlchemy projects often use advanced techniques such as:

- `TYPE_CHECKING`
- `from __future__ import annotations`
- String-based relationship declarations

These techniques reduce circular imports but introduce additional Python concepts.

### Decision
During the learning phase, model files will continue using direct imports to make ORM relationships easier to understand.

After the ORM layer is complete, all models will be refactored to the professional SQLAlchemy import strategy.

### Consequences
__Advantages__:
- Easier to understand ORM relationships.
- Simplifies debugging while learning.
- Reduces cognitive load.

__Trade-offs__:
- Temporary circular import risk.
- Not the final production structure.

This decision is educational rather than architectural. It will be revisited once the ORM layer is complete.

---

## Architecture Decision 46: 
__Title__:
Resolve Model Circular Imports Using TYPE_CHECKING

**Status:** Accepted

### Context
The introduction of bidirectional SQLAlchemy relationships created circular imports between ORM models.

Directly importing related models at runtime caused Python import cycles and prevented the application from starting.

### Decision
Model files will import related ORM classes only during static type checking using:

```python
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    ...
```

Relationship annotations will continue using forward references.

### Consequences
>Advantages:
- Eliminates circular imports.
- Preserves editor autocomplete and static type checking.
- Keeps runtime dependencies minimal.
- Scales cleanly as additional models are introduced.

__Trade-offs__:
- Developers must understand the distinction between runtime imports and type-checking imports.

---

## Architecture Decision 48: 
__Title__:
Adopt Alembic as the Sole Database Schema Manager

**Status:** Accepted

### Context
The project initially used `Base.metadata.create_all()` to create database tables during development.

As Alembic was introduced for schema versioning, using both mechanisms caused inconsistencies between the actual database schema and Alembic's migration history.

### Decision
The project will exclusively use Alembic for creating and modifying the database schema.

`Base.metadata.create_all()` will be removed from the application startup.

All future schema changes must be performed through Alembic migrations.

### Consequences
>Advantages:
- Single source of truth for schema evolution.
- Reliable migration history.
- Easier collaboration and deployment.
- Supports schema upgrades and downgrades.

>Trade-offs:
- Initial setup requires generating and applying migrations.
- Every schema change requires creating a new migration.

---

## Architecture Decision 49: 
__Topic__:
Rebuild Initial Migration History Before Feature Development

**Status:** Accepted

### Context
The project initially mixed SQLAlchemy's `Base.metadata.create_all()` with Alembic migrations, resulting in an incomplete and inconsistent migration history.

The database contained only disposable test data and no production information.

### Decision
The existing development database and incomplete migration files will be discarded.

A new initial migration will be generated after validating all ORM models, establishing Alembic as the sole source of truth for schema creation and evolution.

### Consequences
>Advantages:
- Produces a clean migration history.
- Removes early development inconsistencies.
- Establishes a production-ready schema management workflow.

>Trade-offs:
- Existing test data and development migrations are discarded.
- Acceptable because no production data exists.

---

## Architecture Decision 51: 
__Topic__:
Store Historical Stay Price Independently from Room Price

Status: Accepted

### Context
The Room entity stores the current nightly price of a room.

The Stay entity also stores the nightly price applicable at the time the stay begins.

Although this appears to duplicate information, the two fields represent different business concepts.

### Decision
The Stay model will permanently store the agreed nightly rate at check-in.

The Room model will continue storing only the current room price.

### Consequences
>Advantages:
- Historical billing remains accurate.
- Future room price changes do not affect completed or ongoing stays.
- Invoices can always be reproduced correctly.

>Trade-offs:
- Small amount of intentional data duplication.
- Acceptable because it preserves historical business records.

---

## Architecture Decision 52: 
__Topic__:
Validate Auto-Generated Migrations Before Applying Them

**Status:** Accepted

### Context
Alembic automatically generates migration scripts based on ORM metadata.

Automatic generation may omit models, generate unexpected tables, or produce incorrect constraints.

### Decision
Every autogenerated migration must be reviewed manually before being applied to the database.

>Migration review includes:
- Verifying expected tables.
- Verifying foreign keys.
- Verifying indexes.
- Verifying constraints.
- Ensuring no unintended schema changes are introduced.

### Consequences
>Advantages:
- Prevents accidental schema errors.
- Detects missing models early.
- Keeps migration history reliable.

>Trade-offs:
- Requires an additional review step before applying migrations.

---

## Architecture Decision 53:
__Topic__:
 Verify ORM Metadata Before Generating Migrations

**Status:** Accepted

### Context
Alembic relies entirely on SQLAlchemy's `Base.metadata` when generating migrations.

If a model is not registered in the metadata, Alembic cannot detect it regardless of whether the model file exists.

### Decision
Before generating important migrations, especially the initial schema, verify that all expected tables are present in `Base.metadata.tables`.

### Consequences
>Advantages:
- Detects model registration issues early.
- Simplifies Alembic debugging.
- Prevents incomplete migration generation.

>Trade-offs:
- Adds a small verification step before migration generation.

---

## Architecture Decision 54: 
__Topic__:
Review Auto-Generated Migrations Before Database Upgrade

**Status:** Accepted

### Context
Alembic's autogenerated migrations are based on ORM metadata and should not be assumed to be correct without verification.

Applying an incorrect migration can introduce schema errors that become part of the project's migration history.

### Decision
Every autogenerated migration will be manually reviewed before executing `alembic upgrade head`.

>The review will verify:
- Table creation.
- Column definitions.
- Primary keys.
- Foreign keys.
- Constraints.
- Indexes.
- Cascade behavior.

### Consequences
>Advantages:
- Prevents incorrect database schemas.
- Ensures migration history remains accurate.
- Reduces debugging effort in later development stages.

>Trade-offs:
- Adds a short manual review step before applying migrations.

---

## Architecture Decision 55: 
__Topic__:
Use Alembic as the Sole Database Schema Manager

**Status:** Accepted

### Context
During early development, the application used `Base.metadata.create_all()` to create database tables automatically.

As the project grows, schema evolution requires versioning, reproducibility, and controlled upgrades.

### Decision
Alembic will become the single source of truth for all database schema changes.

`Base.metadata.create_all()` will be removed from the application startup.

All future schema modifications must be implemented through Alembic migrations.

### Consequences
>Advantages:
- Version-controlled database schema.
- Reproducible deployments.
- Safe schema evolution.
- Industry-standard migration workflow.

>Trade-offs:
- Every schema change requires generating and applying a migration.
- Slightly more development overhead in exchange for significantly better maintainability.

---

## Architecture Decision 57: 
__Topic__:
Adopt Version-Controlled Database Evolution

**Status:** Accepted

### Context
The initial database schema has now been successfully migrated using Alembic.

The project requires a reproducible and maintainable process for future schema changes.

### Decision
All future database modifications will follow the migration workflow:

1. Update ORM models.
2. Generate an Alembic migration.
3. Review the generated migration.
4. Apply the migration using `alembic upgrade head`.

Direct schema creation through `Base.metadata.create_all()` is no longer permitted.

### Consequences
>Advantages:
- Complete schema history.
- Reproducible deployments.
- Safe database evolution.
- Industry-standard development workflow.

>Trade-offs:
- Every schema change requires an accompanying migration.

---

## Architecture Decision 58: 
__Topic__:
Separate Documentation by Technology Layer

**Status:** Accepted

### Context
As HelloStay grows beyond the backend, a single `LEARNING_NOTEBOOK.md` file containing all technical concepts becomes unmanageable.

The file had grown to 3600+ lines covering only backend concepts (FastAPI, SQLAlchemy, Alembic, Pydantic).

Upcoming frontend (React, Vite, Bootstrap, axios) and desktop (Electron, IPC) technologies will introduce a significant volume of new concepts.

### Decision
The monolithic `LEARNING_NOTEBOOK.md` is renamed to `BACKEND_CONCEPTS.md` and three new documentation files are created:

| File | Scope |
|------|-------|
| `BACKEND_CONCEPTS.md` | FastAPI, SQLAlchemy, Alembic, Pydantic, Python |
| `FRONTEND_CONCEPTS.md` | React, Vite, Bootstrap, axios, component patterns |
| `ELECTRON_CONCEPTS.md` | Electron, IPC, BrowserWindow, packaging |
| `FULLSTACK_FLOW.md` | Data flow, request lifecycle, API communication |

### Consequences
>Advantages:
- Each file remains focused and searchable.
- Related concepts stay together.
- New developers can navigate by technology layer.

>Trade-offs:
- Requires discipline to write new concepts in the correct file.
- Slightly more files to manage.

---

# Milestone History

## Milestone 0 - Project Planning & Documentation

### Status
Completed

### Objective
Define the project vision, technology stack, architecture approach, and documentation structure before starting development.

### Major Deliverables
* Project idea finalized
* Technology stack selected
* Documentation system created
* Development approach defined

### Technologies Chosen

>Frontend:
* React

>Desktop Layer:
* Electron

>Backend:
* FastAPI

>Database:
* SQLite

>ORM:
* SQLAlchemy

### Documentation Files Created
* BACKEND_CONCEPTS.md
* DEVELOPER_HANDBOOK.md
* PROJECT_NOTES.md

### Key Outcomes
* Project vision clearly defined
* Architecture planning completed
* Documentation workflow established

---

## Milestone 1 - Development Environment Setup

### Status
Completed

### Objective
Prepare the local development environment and version control system.

### Major Deliverables
* Project folder setup
* Git repository initialization
* .gitignore creation
* Virtual environment creation
* Dependency installation
* requirements.txt generation

### Commands Used

>Initialize Git:
git init

>Create Virtual Environment:
python -m venv venv

>Activate Virtual Environment:
venv\Scripts\activate

>Generate Requirements File:
pip freeze > requirements.txt

### Packages Installed
* FastAPI
* Uvicorn
* SQLAlchemy

### Key Outcomes
* Reproducible development environment established
* Version control enabled
* Dependency management configured

---

## Milestone 2 - Backend Architecture Setup

### Status
Completed

### Objective
Create a scalable backend folder structure following industry practices.

### Major Deliverables

>Backend structure created:
app/
├── api/
├── core/
├── database/
├── models/
├── schemas/
└── main.py

>Database layer created:
database/
├── base.py
└── connection.py

### Key Outcomes
* Layered architecture established
* Separation of concerns implemented
* Foundation prepared for future modules

---

## Milestone 3 - Database Foundation

### Status
Completed

### Objective
Configure database connectivity and establish ORM-based database architecture.

### Major Deliverables
* SQLite integration
* Database engine creation
* SessionLocal creation
* Base model setup
* Database file creation
* First model creation
* Table generation from models

### Database File
hellostay.db

### First Model
SystemInfo

### Key Outcomes
* Database architecture established
* ORM workflow implemented
* Automatic table generation configured

---

## Milestone 4 - CRUD API Development

### Status
Completed

### Objective
Build and test complete CRUD functionality using FastAPI and SQLAlchemy.

### Major Deliverables

#### Create API

>Implemented:
POST /system-info

>Capabilities:
* Insert records into database

#### Read API

>Implemented:
GET /system-info

>Capabilities:
* Retrieve single records
* Retrieve multiple records

#### Update API

>Implemented:
PUT /system-info/{system_info_id}

>Capabilities:
* Update records using primary key

#### Delete API
>Implemented:
DELETE /system-info/{system_info_id}

>Capabilities:
* Delete records using primary key

### Key Outcomes
* Complete CRUD cycle implemented
* Database interaction workflow established
* Primary-key-based operations implemented

---

## Milestone 5 - API Testing & Validation

### Status
Completed

### Objective
Verify API functionality using FastAPI Swagger documentation.

### Major Deliverables
* Swagger UI testing
* Create API testing
* Read API testing
* Update API testing
* Delete API testing
* Database verification

### Testing Tool
Swagger UI

>URL:
http://127.0.0.1:8000/docs

### Key Outcomes
* All CRUD operations verified
* API responses validated
* Database updates confirmed
* Database deletions confirmed

---

## Milestone 6 - Room API Foundation

### Status
Completed

### Objective
Create the first production-style Room API using FastAPI, SQLAlchemy, and Pydantic.

### Major Deliverables
* RoomCreate schema
* RoomResponse schema
* RoomUpdate schema
* get_db dependency
* APIRouter setup
* Dependency injection using Depends()
* Room creation endpoint
* ORM-to-Pydantic serialization
* response_model integration

### Endpoint Created
POST /rooms

### Key Outcomes
* Request validation implemented
* Database session injection implemented
* ORM object creation workflow established
* Automatic API response serialization configured
* CRUD foundation established for future Room APIs

---

## Milestone 7 - First Room API Registration

### Status
Completed

### Objective
Register the Room API router and verify endpoint discovery through FastAPI.

### Major Deliverables
* Room router registration
* FastAPI route discovery
* Swagger integration
* Room endpoint visibility

### Endpoint Available
POST /rooms

### Key Outcomes
* Room module successfully integrated into application
* Router architecture validated
* Swagger documentation generated automatically
* Room API ready for live testing

---

## Milestone 8 - Room Retrieval APIs

### Objective
Implement room retrieval functionality.

### Tasks
1. Create GET /rooms
   - Return all rooms
   - Use response_model=list[RoomResponse]

2. Create GET /rooms/{room_id}
   - Return a single room
   - Query by primary key

3. Add not-found handling
   - Return proper HTTPException
   - Status code 404

4. Test all room retrieval endpoints using Swagger

### Expected Outcome
>Users can:
- Create rooms
- View all rooms
- View a specific room

---

## Milestone 9 - Room Retrieval API

### Status
Completed

### Objective
Retrieve all room records from the database.

### Deliverables
- GET /rooms endpoint
- List response model support
- ORM serialization for collections
- Database retrieval testing

### Endpoint
GET /rooms

### Validation
Successfully tested through Swagger UI.

### Key Outcomes
- Multiple room records returned successfully
- Response model list serialization works
- Room database contents can be viewed through API
- Read operations verified

---

## Milestone 10 - Single Room Retrieval

### Objective
Implement GET /rooms/{room_id} with proper error handling.

### Tasks
1. Import HTTPException

2. Query room by id

3. Check if room exists

4. If room does not exist:
   raise HTTPException(
       status_code=404,
       detail="Room not found"
   )

5. Return room if found

### Endpoint
GET /rooms/{room_id}

### Expected Outcome
- Existing room returns RoomResponse
- Non-existing room returns 404 Not Found

---

## Milestone 11 - Room CRUD Module

### Status
COMPLETED ✅

### Endpoints Implemented

#### Create
```text
POST /rooms
```

#### Read
```text
GET /rooms
GET /rooms/{room_id}
```

#### Update
```text
PUT /rooms/{room_id}
```

__Features__:
- Partial updates
- model_dump(exclude_unset=True)
- setattr()
- 404 handling

#### Delete
```text
DELETE /rooms/{room_id}
```

__Features__:
- 404 handling
- Success confirmation message

### Concepts Learned
- FastAPI Routing
- Dependency Injection
- SQLAlchemy ORM
- CRUD Operations
- Response Models
- HTTPException
- 404 Error Handling
- Partial Updates
- model_dump(exclude_unset=True)
- setattr()
- Database Transactions

### Outcome
The Room module now supports complete CRUD functionality and is ready to be used by future modules.

---

## Milestone 12 - Guest CRUD API

### Status
Completed

### Objective
Build complete CRUD operations for guest management.

### Deliverables
- Guest database model
- Guest Pydantic schemas
- Alembic migration for guests table
- POST /guests
- GET /guests
- GET /guests/{guest_id}
- PUT /guests/{guest_id}
- DELETE /guests/{guest_id}

### Endpoints
POST /guests

GET /guests

GET /guests/{guest_id}

PUT /guests/{guest_id}

DELETE /guests/{guest_id}

### Validation
Successfully tested through Swagger UI.

### Key Outcomes
- Guest records can be created
- Guest records can be retrieved individually
- All guest records can be listed
- Guest information can be updated
- Guest records can be deleted
- Alembic migration workflow successfully integrated into the project
- Guests table successfully created and managed through migrations

---

## Milestone 13 - Stay Management System

### Status
Completed

### Objective
Track guest occupancy history by connecting guests and rooms through stay records.

### Deliverables
- Stay database model
- Stay migration
- Foreign key relationships
- StayCreate schema
- StayResponse schema
- StayUpdate schema
- POST /stays
- GET /stays
- GET /stays/{id}
- PUT /stays/{id}
- DELETE /stays/{id}

### Validation
Successfully tested through Swagger UI.

### Key Outcomes
- Stay records can be created and managed
- Guest and room relationships established
- Occupancy history can be stored
- Checkout tracking supported through nullable checkout datetime
- Price per night preserved for each stay transaction

---

## Milestone 14 - Documentation Restructuring

### Status
Completed

### Objective
Restructure project documentation to support upcoming frontend and desktop development phases.

### Deliverables
- `LEARNING_NOTES.md` renamed to `BACKEND_CONCEPTS.md`
- `FRONTEND_CONCEPTS.md` created with header template
- `ELECTRON_CONCEPTS.md` created with header template
- `FULLSTACK_FLOW.md` created with header template
- Architecture Decision 58 documented
- All cross-references to old filename updated

### Key Outcomes
- Documentation now organized by technology layer
- Each new technology (React, Electron) has a dedicated concepts file
- Clear separation between backend, frontend, desktop, and fullstack knowledge
- Architecture decision recorded for future reference

---

## Milestone 15 - Guest Stay Module

### Status
Completed

### Objective
Enable multiple guest entries in a single room to accurately track all occupants for a specific stay.

### Deliverables
- `GuestStay` database model representing the many-to-many relationship
- Alembic migration for the `guest_stay` table
- `GuestStayCreate`, `GuestStayResponse`, and `GuestStayUpdate` schemas
- `POST /guest-stays`
- `GET /guest-stays`
- `GET /guest-stays/{id}`
- `PUT /guest-stays/{id}`
- `DELETE /guest-stays/{id}`

### Validation
Successfully tested through Swagger UI.

### Key Outcomes
- Multiple guests can now be associated with a single stay record
- Backend core features for Phase 1 are fully complete
- Ready for Frontend architecture setup