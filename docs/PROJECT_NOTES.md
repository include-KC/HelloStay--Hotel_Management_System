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

## Architecture Decision 59:
__Topic__:
UI/UX Design System

**Status:** Accepted

### Context
Before building any frontend screens, a complete design specification must be locked into the project history. This decision records the full UI/UX design language so all future frontend work is consistent.

### Decision

**Core Design System**

>Technology Stack (Frontend)
- React + Vite (component framework)
- Tailwind CSS (utility-first styling)
- Lucide React (icon library)
- Framer Motion (animations and transitions)
- Electron (desktop wrapper)

>Design Language
- Inspired by: Linear, Notion, Stripe Dashboard, GitHub Desktop
- Corner radius: 10–14px
- Shadows: Soft, layered
- Typography: Premium (Inter or equivalent)
- Theme: Light and Dark mode support
- Animations: Smooth page transitions, loading skeletons
- Philosophy: Minimal, elegant, commercial-grade. Must NOT look like a government application.

>Layout
- Desktop-first (Windows)
- Collapsible sidebar navigation
- Breadcrumb navigation
- Toast notifications
- Keyboard shortcuts
- Search everywhere
- Empty states and error pages

### Consequences
>Advantages:
- All UI decisions are formally locked before a single screen is coded, preventing design drift.

>Trade-offs:
- Tailwind CSS replaces the Bootstrap installed in Milestone 17. Bootstrap should be uninstalled from the frontend before UI work begins to avoid conflicts.

---

## Architecture Decision 60:
__Topic__:
Module Specifications & Features

**Status:** Accepted

### Context
With the design system established, the specific feature requirements, permission scopes, and functional breakdown for every module must be documented.

### Decision

**Application Flow**

>Installer UI
- HelloStay logo, version info
- Install location selector
- Progress bar, Finish screen, Launch checkbox

>Login Screen
- Centered card with logo
- Employee ID, Employee Name, Role selector
- Secondary actions: Add New Owner, Add New Employee

>Owner Registration
- Collects: Name, Phone, Email, Address, Aadhaar, Government ID upload, Password
- Auto-generates: Unique Owner ID, Owner Profile, Owner Card

>Employee Registration (Owner Only)
- Collects: Name, Phone, Address, Role, Salary, Government ID, Joining Date
- Auto-generates: Employee ID, Employee Card (printable), QR Code, Employee Profile

**Role-Based Permission System**

| Role | Access Level |
|---|---|
| Owner | Full access to all modules |
| Receptionist | Rooms, Check-in, Check-out, Bookings, Profile |
| Room Manager | Rooms, Bookings, Profile |
| Housekeeping | Rooms (cleaning status), Profile |
| Accountant | Reports, Expenses, Salary (view), Profile |
| Security | Guest verification, Profile |
| Custom Roles | Configurable by Owner |

Employees must NEVER see: Employee Management, Salary, Settings, Owner Controls, Reports, Business Analytics.

**Owner Dashboard Sidebar Modules**
Dashboard, Rooms, Bookings, Guests, Employees, HR & Payroll, Expenses, Inventory, Restaurant, Reports, Settings, Profile, Logout.

>Dashboard Widgets
Today's Check-ins, Check-outs, Occupied/Available Rooms, Revenue, Pending Payments, Employee Count, Monthly Income Graph, Recent Activities, Notifications, Upcoming Bookings.

**Room Management**

>Table Columns
Room Number, Room Type, Floor, Price, Current Status, Cleaning Status, Occupancy, Actions.

>CRUD Operations
Add, Edit, Delete, Search, Filter, Sort.

>Color Coding
Green=Available, Red=Occupied, Orange=Cleaning, Blue=Reserved.

**Guest Management**
Profile cards storing: Name, Phone, ID Proof, Room Number, Stay Duration, Payment Status, History. Allow ID proof upload.

**HR & Payroll Module (Owner Only)**
This is a full enterprise HRMS comparable to Zoho People, Keka, or GreytHR.

>Access
Owner only. Employees may only view their own attendance history. Employees must NEVER access salary details of any other employee.

>HR Dashboard KPI Cards
Total Employees, Present Today, Absent Today, On Leave, Late Today, Monthly Salary Expense, Pending Payments, Total Deductions, Attendance Percentage.

>Attendance Table Columns
Employee ID, Name, Department, Role, Shift Timing, Check-in, Check-out, Total Hours, Overtime Hours, Status, Remarks.

>Attendance Status Values
Present, Late, Half Day, Absent, Paid Leave, Sick Leave, Holiday, Weekly Off.

>Attendance Calendar
Monthly view per employee. Color indicators: Green=Present, Red=Absent, Yellow=Late, Blue=Paid Leave, Orange=Half Day, Gray=Holiday.

>Salary Profile per Employee
Monthly, Daily, Hourly Rate, Overtime Rate, Bonus, Incentives, Deductions, Advance Salary, Net Salary.

>Automatic Payroll Calculation Inputs (Owner-Configurable)
Working Days/Month, Hours/Day, Grace Period, Late Penalty, Half Day Rules, Overtime Rate, Bonus Rules, Holiday Policy, Weekly Off.

>Auto-Calculated Outputs
Present Days, Absent Days, Leave, Half Days, Lates, Overtime, Gross Salary, Deductions, Bonus, Net Payable.

>Deduction Rules (Configurable)
Per-absence deduction, per-late deduction, half-day salary cut, leave exemption, overtime multiplier (1.5x/2x), attendance bonus threshold.

>Salary Slip Generator
Hotel Logo, Hotel Details, Employee Name/ID/Department, Salary Month, Attendance Summary, Overtime, Bonuses, Deductions, Final Salary, Payment Status, Owner Signature. Export: Print, PDF, Download, Email.

>Leave Management
Employee submits request. Owner approves/rejects/requests info. Leave statistics displayed.

>Owner Notifications
Absent employee, Late check-in, Forgot check-out, Salary due, Leave request, Attendance modification.

**Reports Module**
Charts: Revenue, Occupancy Rate, Employee Performance, Monthly Profit, Booking Trends, Room Utilization.

**Settings Module (Owner Only)**
Hotel Information, GST Details, Invoice Settings, Theme (Light/Dark), Backup, Restore, Database, User Permissions, Application Preferences.

### Consequences
>Advantages:
- The role-permission matrix is defined upfront, guiding all backend auth middleware.

>Trade-offs:
- The HR & Payroll module requires significant new backend models (Attendance, Salary, Leave) that must be planned as dedicated milestones.

---

## Architecture Decision 61:
__Topic__:
Dynamic UI Configuration & Setup Flow

**Status:** Accepted

### Context
HelloStay must be flexible enough to handle a small 10-room motel or a massive 500-room luxury resort with casinos and golf courses. Therefore, the UI modules cannot be hard-coded for every user.

### Decision

**1. Dynamic Navigation Modules**
The application navigation (Sidebar) must dynamically adapt to the Hotel's registered profile. 
- If the owner does NOT select "In-house Restaurant" during the setup phase, the Restaurant module is completely hidden from the UI.
- This configuration is read synchronously during layout rendering.

**2. Strict Setup Flow Enforcement**
- `RegisterOwner.jsx` (Master Admin creation) does not route to Login. It routes strictly to `RegisterHotel.jsx`.
- `RegisterHotel.jsx` forces the owner to configure their specific capacity (Total Rooms) and Facilities.
- The `Dashboard.jsx` relies entirely on this configuration to generate capacity metrics and welcome banners.

**3. Temporary Storage**
- `localStorage` is heavily utilized to persist the Hotel Profile data during this multi-step setup phase to ensure smooth routing without premature backend API submissions.

### Consequences
>Advantages:
- Keeps the UI clean and uncluttered for smaller hotels.
- Creates a customized, premium onboarding experience for the owner.

>Trade-offs:
- Requires continuous state-checks (reading from storage or a React Context) inside core layout components like `Sidebar.jsx`.

---

## Architecture Decision 62:
__Topic__:
Multi-Currency Support & Flexible Room Types

**Status:** Accepted

### Context
HelloStay targets hotels across multiple countries. A hardcoded ₹ symbol or fixed room type dropdown limits international adoption. Hotels need to:
- Display prices in their local currency
- Define room types that match their specific naming conventions (e.g., "Heritage Room", "Overwater Villa")

### Decision

**1. Currency & Country Selection During Setup**
- `RegisterHotel.jsx` now includes Country and Currency dropdowns.
- Country selection auto-populates the Currency field (e.g., selecting "India" sets ₹ INR).
- Currency can be manually overridden if needed.
- A confirmation card shows the selected country + currency combination.
- Currency symbol is stored in `localStorage('helloStay_hotelData')` as `currency` code.

**2. Dynamic Currency Display**
- `AddRoomModal.jsx` reads the currency symbol from localStorage and displays it in the Price Per Night label and input prefix.
- `Rooms.jsx` reads the currency symbol from localStorage and displays it in the Price/Night table column.
- Currency lookup uses a `CURRENCY_SYMBOLS` map for fast O(1) access.

**3. Searchable Room Type Selector with Custom Input**
- `AddRoomModal.jsx` replaces the fixed `<select>` dropdown with a searchable text input.
- 20 industry-standard room types are preloaded as suggestions (Standard, Deluxe, Suite, Villa, Penthouse, etc.).
- User can type to filter suggestions or type a completely custom room type.
- A "Add [custom type]" option appears when the typed value doesn't match any preset.
- Click outside closes the dropdown; selecting an option fills the field.

**4. Inline Status Change**
- `Rooms.jsx` status column is now clickable — clicking the status badge reveals a `<select>` dropdown.
- Status can be changed directly from the table without opening an edit page.
- Changes persist immediately to localStorage.

### Consequences
>Advantages:
- Hotels worldwide can use the app with their local currency and room naming conventions.
- Inline status change reduces clicks and improves operational speed for front desk staff.
- Searchable room type combines the speed of presets with the flexibility of free text.

>Trade-offs:
- Currency conversion rates are not handled — only the display symbol is localized.
- Custom room types are not validated against industry standards, which may lead to inconsistent naming.

---

## Architecture Decision 63:
__Topic__:
Role-Based Access Control (RBAC) & Module Visibility

**Status:** Accepted

### Context
HelloStay is used by different types of users — hotel owners, hired management companies, managers, and employees. Each role has different responsibilities and should only see the modules relevant to their work. The owner also needs to delegate management to a third-party company without giving away full ownership.

### Decision

**1. Three Login Roles**
The Login page offers three tabs:
- **Owner** — Full access to all modules including hotel setup, employee management, reports, and settings.
- **Manager** — Limited access: Dashboard, Rooms, Inventory, Expenses. Cannot manage employees, bookings, guests, or reports.
- **Employee** — Most limited: Dashboard, Rooms, Inventory only.

**2. Role Stored in localStorage**
On sign-in, `helloStay_userRole` is written to localStorage. The Sidebar reads this value to filter navigation items. No backend auth is involved yet — this is the setup phase pattern.

**3. Management Company Option**
A management company (third party hired to run the hotel) logs in as **Manager**. This gives them operational access (Rooms, Facilities, Restaurant, Inventory, Expenses) without access to sensitive owner functions (payroll, employee data, financial reports, hotel settings). The owner decides this responsibility during registration or later in settings.

**4. Setup Flow is Owner-Only**
The Installer → RegisterOwner → RegisterHotel flow is exclusively for the owner. When the setup wizard runs, it writes `helloStay_userRole: 'owner'` to localStorage automatically.

### Consequences
>Advantages:
- Owners can delegate operational management to a hired company without exposing financial/HR data.
- Employees see only what they need — clean, focused UI.
- Easy to extend: new roles can be added by extending the `roles` array in `Sidebar.jsx`.

>Trade-offs:
- Role is stored in localStorage only — no server-side enforcement yet.
- No granular permission system (e.g., "can view reports but not edit") — just module-level visibility.

---

# Application Modules

This section describes every module (page) in HelloStay, its purpose, key features, and target user role.

---

## Dashboard
>Purpose
The central overview screen showing real-time hotel performance metrics and recent activity.

>Key Features
- KPI cards: Total Rooms, Available, Occupied, Occupancy Rate, Revenue
- Room Occupancy bar chart (recharts) showing status breakdown
- Activity Timeline with recent events (check-ins, check-outs, housekeeping)
- Welcome banner with hotel name from setup

>Target Role: Owner, Manager, Employee

---

## Rooms
>Purpose
Manage all hotel rooms — add, edit, delete, and change status.

>Key Features
- Data table with sort, search, filter, and pagination
- Inline status change (click badge to change Available/Occupied/Cleaning/Reserved)
- Add Room modal with searchable room type selector (20 presets + custom)
- Dynamic currency display based on hotel setup
- Inline delete confirmation

>Target Role: Owner, Manager, Employee

---

## Bookings
>Purpose
Handle room reservations — create, view, update, and cancel bookings.

>Key Features
- Booking creation with guest selection, room assignment, check-in/check-out dates
- Booking status tracking (Confirmed, Checked-In, Checked-Out, Cancelled)
- Revenue calculation per booking
- Calendar view for availability

>Target Role: Owner (planned)

---

## Guests
>Purpose
Maintain a database of all guests who have stayed or are currently staying.

>Key Features
- Guest profile with personal details, ID proof, contact info
- Stay history linked to bookings
- Search and filter guests
- Guest identification document storage

>Target Role: Owner (planned)

---

## Employees
>Purpose
Manage hotel staff — register, view, and maintain employee records.

>Key Features
- Employee registration with name, phone, role, salary, joining date
- Government ID storage
- Role assignment (Receptionist, Room Manager, Housekeeping, Accountant, Security)
- Employee listing with search

>Target Role: Owner

---

## HR & Payroll
>Purpose
Handle employee salary calculations, attendance, and payroll processing.

>Key Features
- Monthly salary calculation
- Attendance tracking
- Payroll generation
- Salary slip export

>Target Role: Owner (planned)

---

## Expenses
>Purpose
Track and categorize all hotel operational expenses.

>Key Features
- Expense logging with category, amount, date, description
- Category-wise breakdown
- Monthly/yearly expense reports
- Budget tracking

>Target Role: Owner, Manager

---

## Inventory
>Purpose
Manage hotel supplies and stock — toiletries, linens, food items, cleaning supplies.

>Key Features
- Item registration with name, category, quantity, reorder level
- Stock in/out tracking
- Low stock alerts
- Supplier management

>Target Role: Owner, Manager, Employee

---

## Facilities (Manage Facilities)
>Purpose
Manage all hotel facilities (Spa, Pool, Gym, Conference Room, etc.) — bookings, occupancy, guest info, payment status, and charges configuration.

>Key Features
- **Facility Cards** — Each configured facility shown as a card with real-time stats (total bookings, today's bookings, pending payments)
- **Booking System** — Create bookings with guest name, room number, date, time, number of guests
- **Guest Information** — Guest name, room number, number of guests, special notes
- **Payment Status Options:**
  - *Club to Final Bill* — Charges added to room bill at checkout
  - *Paid Before* — Guest pays before using the service
  - *Paid After* — Guest pays after using the service
  - *Complimentary* — No charge
- **Charges Configuration:**
  - *All Guests* — Same charge for every guest
  - *By Room Type* — Different charges based on room type (Standard, Deluxe, Suite, etc.)
  - *By Room Number* — Specific charges for specific rooms
  - *Free for All* — No charges for any guest
- **Booking List** — View recent bookings per facility with payment status badges
- **Booking Details Modal** — Full view of guest info, payment status, notes
- **Expandable Cards** — Click a facility card to see its booking list inline

>Target Role: Owner, Manager

---

## Restaurant
>Purpose
Manage in-house restaurant operations — menu, orders, table management.

>Key Features
- Menu management (items, prices, categories)
- Order taking and tracking
- Table status management
- Daily sales summary

>Target Role: Owner, Manager
>Condition: Only visible if "In-house Restaurant" is selected in hotel facilities

---

## Reports
>Purpose
Generate analytics and reports for business insights.

>Key Features
- Revenue reports (daily, weekly, monthly)
- Occupancy analytics
- Expense reports
- Guest statistics
- Export to PDF/Excel

>Target Role: Owner (planned)

---

## Settings
>Purpose
Configure application preferences and hotel profile.

>Key Features
- Hotel profile editing (name, address, contact)
- Currency and country update
- Facility management
- User account settings
- Data backup/restore

>Target Role: Owner (planned)

---

## Profile
>Purpose
View and edit the logged-in user's personal profile.

>Key Features
- Personal information display
- Password change
- Notification preferences

>Target Role: Owner, Manager, Employee (planned)

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

---

## Milestone 16 - Frontend Environment Setup

### Status
Completed

### Objective
Initialize a fast, modern React application using Vite and clean up the default boilerplate.

### Deliverables
- `frontend` directory initialized with Vite and React
- Default Vite boilerplate removed from `App.jsx`
- `npm install` executed to install dependencies
- React development server successfully tested

### Concepts Learned
- Vite as a rapid build tool
- npm for dependency management
- Single Page Application (SPA) architecture
- JSX syntax basics

### Key Outcomes
- Frontend foundation established
- Live development server operational
- Ready for CSS framework integration

---

## Milestone 17 - Bootstrap & Frontend Architecture

### Status
Completed

### Objective
Install Bootstrap for ready-to-use CSS styling and create a professional folder structure inside the React project.

### Deliverables
- `bootstrap` npm package installed
- Bootstrap CSS imported globally in `main.jsx`
- `App.jsx` updated with Bootstrap utility classes
- Empty architectural folders created: `components`, `pages`, `services`, `utils`, `hooks`

### Concepts Learned
- Bootstrap 5 framework integration
- Component-Based Architecture layout
- Separation of Concerns in frontend code

### Key Outcomes
- Professional UI styling system activated
- Scalable codebase structure established
- Ready for Desktop wrapper integration

---

## Milestone 18 - Electron Desktop Setup

### Status
Completed

### Objective
Initialize a separate Node.js environment for Electron and wrap the React application inside a native desktop window.

### Deliverables
- `electron` npm package installed as a dev dependency
- Custom `package.json` configured for the Electron process
- `main.js` script created to control the desktop window lifecycle
- Desktop window successfully loading the local React development server

### Concepts Learned
- Electron Main Process vs Web View
- Node.js initialization (`npm init -y`)
- `BrowserWindow` configuration

### Key Outcomes
- HelloStay now runs as a standalone desktop application rather than a browser tab
- Frontend architecture is now fully containerized within a desktop wrapper
- Ready to connect the React UI to the FastAPI backend

---

## Milestone 19 - API Communication Setup

### Status
Completed

### Objective
Establish a secure communication bridge between the React frontend and FastAPI backend.

### Deliverables
- `CORSMiddleware` configured in FastAPI `main.py`
- `axios` installed in the frontend
- Centralized `api.js` configured with backend base URL
- `App.jsx` updated to fetch and display backend root message

### Concepts Learned
- Axios for HTTP requests
- CORS (Cross-Origin Resource Sharing) security mechanisms
- React `useEffect` for data fetching

### Key Outcomes
- The frontend successfully retrieves live data from the backend
- **Phase 1 (Foundation) is officially 100% Complete!**
- Ready to begin Phase 2 (Authentication)

---

## Milestone 20 - Backend Authentication Setup (Phase 2)

### Status
Completed

### Objective
Implement secure password hashing and JSON Web Token (JWT) generation logic in the FastAPI backend to prepare for user login functionality.

### Deliverables
- Security dependencies installed (`passlib[bcrypt]`, `python-jose`, `python-multipart`).
- `core/security.py` module created with hash and token functions.
- `schemas/token.py` created for token payload validation.
- VS Code workspace properly configured to recognize the virtual environment (`pyrightconfig.json`).

### Concepts Learned
- Password Hashing (bcrypt vs passlib compatibility)
- JWT (JSON Web Tokens)
- Python Virtual Environments in VS Code

### Key Outcomes
- Backend is now capable of securely authenticating users.
- Ready to build the frontend layout and connect the login interface.

---

## Milestone 21 - Frontend Core Architecture & Routing

### Status
Completed

### Objective
Create the complete frontend structure based on Architecture Decisions 59 & 60, including routing, dynamic layouts, and dummy pages for all planned modules.

---

## Milestone 22 - Frontend Core Architecture & Dynamic UI

### Status
Completed

### Objective
Build the dynamic onboarding flow, context-aware dashboard, and hotel setup system based on Architecture Decision 61.

### Deliverables
- `RegisterOwner.jsx` — Master Owner registration form
- `RegisterHotel.jsx` — Hotel setup with name, capacity, and 49 facilities (with search filter)
- `MainLayout.jsx` — Sidebar + Topbar + Outlet layout wrapper
- `Sidebar.jsx` — Dynamic navigation that hides modules based on hotel facilities
- `Topbar.jsx` — Context-aware header with search and notifications
- `Dashboard.jsx` — Welcome banner, KPI cards, and facilities display using Lazy State Initialization
- `AppRoutes.jsx` — Full routing with protected MainLayout and standalone auth pages
- All data persisted in `localStorage` during setup phase

### Key Outcomes
- Onboarding flow enforces strict setup order (AD 61)
- UI dynamically adapts to hotel configuration
- Comprehensive documentation in FRONTEND_CONCEPTS.md and DEVELOPER_HANDBOOK.md

---

## Milestone 23 - Room Management Module & Facilities

### Status
Completed

### Objective
Build a premium Room Management module with data visualization on the Dashboard, a fully interactive data table, an Add Room modal with form validation, and a comprehensive Facilities management module with booking and charges configuration.

### Deliverables
- `Dashboard.jsx` upgraded with:
  - Room Occupancy bar chart (recharts) showing Available/Occupied/Cleaning/Reserved breakdown
  - Activity Timeline with staggered Framer Motion animations
  - KPI cards now read real room data from localStorage when available
- `Rooms.jsx` — Complete rewrite with:
  - Premium data table: Room Number, Type, Price/Night, Status (color-coded badges), Max Occupancy, Actions
  - Column header click-to-sort (ascending/descending)
  - Real-time search by room number or type
  - Status filter dropdown (All, Available, Occupied, Cleaning, Reserved)
  - Pagination (10 rows per page) with page number buttons
  - Empty state with illustration and CTA button
  - Inline delete confirmation (Yes/No) replacing action buttons
  - Inline status change — click status badge to reveal dropdown, change status without edit page
  - Dynamic currency symbol from localStorage (no hardcoded ₹)
- `AddRoomModal.jsx` — New component:
  - Full overlay with backdrop blur and Framer Motion spring animation
  - Form fields: Room Number, Room Type, Status, Price, Max Occupancy, Facilities
  - Searchable Room Type selector with 20 industry presets + custom input option
  - Dynamic currency symbol prefix in Price Per Night (reads from localStorage)
  - Inline validation with error messages and red border highlights
  - Writes to `localStorage('helloStay_rooms')` and triggers parent re-render
  - State reset on close
- `ManageFacilities.jsx` — New comprehensive module:
  - Facility Cards showing real-time stats (total/today/pending bookings)
  - Booking System with guest name, room number, date, time, guests, payment status, notes
  - Payment Status Options: Club to Final Bill, Paid Before, Paid After, Complimentary
  - Charges Configuration: All Guests, By Room Type, By Room Number, Free for All
  - Expandable cards with inline booking list
  - Booking Details Modal with full guest info
  - All data persists to localStorage
- `RegisterHotel.jsx` — Upgraded with:
  - Country dropdown (50 countries with auto-mapped currencies)
  - Currency dropdown (29 currencies with symbols)
  - Auto-populate currency when country is selected
  - Confirmation card showing selected country + currency
- `RegisterOwner.jsx` — Removed ID upload section
- `Login.jsx` — Role-based login with 3 tabs (Owner, Manager, Employee)
- `Sidebar.jsx` — Role-based navigation with dynamic module visibility
- `FRONTEND_CONCEPTS.md` updated with new concepts:
  - Searchable Dropdown Pattern, Inline Status Change, Dynamic Currency Display
  - Computed Property Names, Optional Chaining, Nullish Coalescing
  - e.stopPropagation(), .find(), .some()
- `DEVELOPER_HANDBOOK.md` updated with:
  - Room Management Module architecture section
  - Role-Based Sidebar Navigation pattern
  - Role-Based Login Flow pattern

### Technologies Introduced
- `recharts@3.8.1` — Charting library for data visualization

### Architecture Decisions Referenced
- AD 59 — UI/UX Design System (Tailwind, Lucide, Framer Motion)
- AD 60 — Module Specifications (Room table columns, color-coding, CRUD operations)
- AD 61 — Dynamic UI (localStorage persistence during setup phase)
- AD 62 — Multi-Currency Support & Flexible Room Types
- AD 63 — Role-Based Access Control & Module Visibility

### Key Outcomes
- Dashboard now provides real-time visual occupancy insights
- Room Management page is fully functional with search, sort, filter, pagination, and inline status change
- Add Room flow validates input and persists data correctly with dynamic currency and flexible room types
- Facilities module enables booking management, payment tracking, and charges configuration
- Role-based access: Owner (full), Manager (Rooms, Facilities, Restaurant, Expenses), Employee (Rooms, Inventory)
- Hotel setup now captures country and currency for internationalization
- Zero lint errors across all new and modified files
- Ready for backend API integration in a future milestone

---

## Architecture Decision 64: Full Module Implementation Strategy

**Status:** Accepted
**Date:** 2026-06-23
**Context:** After completing Milestone 23 (Room Management + Facilities), the remaining 10 modules (Bookings, Guests, Employees, HR & Payroll, Expenses, Inventory, Restaurant, Reports, Settings, Profile) needed to be designed and implemented. Each module required consistent architecture, premium UI, and comprehensive documentation.

### Decision
Implement all 10 modules using the same localStorage-based data persistence pattern established in Rooms and ManageFacilities. Each module follows a consistent architecture:
- **State:** useState with lazy initialization from localStorage
- **Data Flow:** Read on mount → Filter/Sort → Display → Mutate → Write-back to state + localStorage
- **UI:** Data table or card grid with sort, search, filter, pagination
- **Modals:** Add/Edit form modal + View details modal
- **Actions:** Inline edit, status toggle, delete with confirmation
- **Stats:** Summary cards with key metrics at top of page

### Consequences
- All modules are immediately functional without backend
- Consistent UX across the entire application
- Easy to swap localStorage for API calls in future milestones
- Each module is self-contained with its own localStorage keys

---

## Architecture Decision 65: Bookings Module Data Model

**Status:** Accepted
**Date:** 2026-06-23

### Decision
The Bookings module stores the following data per booking:
```
{
  id: number (Date.now()),
  guestName: string,
  guestPhone: string,
  roomId: number,
  roomNumber: string,
  checkInDate: string (YYYY-MM-DD),
  checkOutDate: string (YYYY-MM-DD),
  adults: number,
  children: number,
  status: "Reserved" | "Checked In" | "Checked Out" | "Cancelled",
  totalAmount: number (auto-calculated: nights × pricePerNight),
  amountPaid: number,
  paymentStatus: "Pending" | "Partial" | "Paid" | "Refunded",
  specialRequests: string,
  createdAt: string (ISO),
  updatedAt: string (ISO),
  actualCheckIn: string (ISO, set on check-in),
  actualCheckOut: string (ISO, set on check-out)
}
```

### Key Features
- Auto-calculate total amount from room price × nights
- Room availability validation (checks date conflicts)
- Status change auto-updates room status (Checked In → Occupied, Checked Out → Cleaning)
- Inline payment recording from view modal
- Guest/Room/Date/Phone search across all fields

### Consequences
- Bookings are the central entity linking guests to rooms
- Room status is derived from booking status (single source of truth)
- Historical price is preserved in the booking record

---

## Architecture Decision 66: Guest Profile Architecture

**Status:** Accepted
**Date:** 2026-06-23

### Decision
Guests are stored as independent profiles (not tied to bookings). The relationship is resolved at runtime by matching guest name to booking guestName.

### Guest Data Model
```
{
  id: number,
  name: string,
  phone: string,
  email: string,
  address: string,
  idProofType: "Aadhaar Card" | "Passport" | "Driving License" | "Voter ID" | "PAN Card",
  idProofNumber: string,
  nationality: string,
  dateOfBirth: string,
  gender: string,
  notes: string (VIP, allergies, preferences),
  createdAt: string,
  updatedAt: string
}
```

### Key Features
- Card-based layout (not table) for visual appeal
- Stay history derived from bookings at runtime
- Total spent calculated from booking payments
- Avatar initials with color-coded backgrounds

---

## Architecture Decision 67: HR & Payroll System Design

**Status:** Accepted
**Date:** 2026-06-23

### Decision
The HR module uses a tab-based interface with three sections:
1. **Attendance:** Daily attendance marking per employee with Present/Absent/Half Day/Leave/Holiday
2. **Payroll:** Monthly salary calculation based on attendance, with earned amount and deductions
3. **Payslips:** Generated payslips for each month, stored separately

### Data Models
- **Attendance:** `{ id, employeeId, date, status }` — one record per employee per day
- **Payslips:** `{ id, employeeId, employeeName, role, month, year, baseSalary, daysPresent, daysAbsent, halfDays, leaves, earned, deductions, netPay, generatedAt }`

### Salary Calculation Logic
```
perDay = baseSalary / daysInMonth
earned = (presentDays × perDay) + (halfDays × perDay × 0.5)
netPay = earned - deductions
```

---

## Architecture Decision 68: Expense Tracking Architecture

**Status:** Accepted
**Date:** 2026-06-23

### Decision
Expenses are stored as flat records with category-based organization. No hierarchical categories — just flat string categories with color-coded visual indicators.

### Key Features
- 12 predefined expense categories with color-coded dots
- Category breakdown bar chart (visual spending distribution)
- Date range filtering for periodic reports
- Receipt number tracking (optional)
- Payment method tracking (Cash, Card, Bank Transfer, UPI, Cheque)

---

## Architecture Decision 69: Inventory Management Design

**Status:** Accepted
**Date:** 2026-06-23

### Decision
Inventory uses a quantity-based tracking system with stock status alerts:
- **In Stock:** quantity > minStock (or no minStock set)
- **Low Stock:** quantity ≤ minStock and quantity > 0
- **Out of Stock:** quantity = 0

### Key Features
- Quick stock adjustment (+/- buttons directly in table)
- Per-unit cost tracking with total value calculation
- Min stock alert threshold
- Category-based organization (10 categories)
- Storage location tracking

---

## Architecture Decision 70: Restaurant Module Design

**Status:** Accepted
**Date:** 2026-06-23

### Decision
The Restaurant module has three tabs:
1. **Orders:** Active order management with status flow (Preparing → Ready → Served → Paid)
2. **Menu:** Menu item management with categories and pricing
3. **Tables:** Visual table status grid (Available/Occupied)

### Order Data Model
```
{
  id: number,
  tableNumber: string,
  items: [{ menuItemId, name, price, quantity }],
  total: number (auto-calculated),
  status: "Preparing" | "Ready" | "Served" | "Paid",
  guestName: string,
  specialInstructions: string,
  createdAt: string
}
```

### Key Features
- Add items to order from menu with quantity controls
- Status progression workflow (Preparing → Ready → Served → Paid)
- Visual table grid showing occupied/available status
- Order summary with itemized totals

---

## Architecture Decision 71: Reports Module with recharts

**Status:** Accepted
**Date:** 2026-06-23

### Decision
The Reports module uses recharts for all data visualization with four report types:
1. **Overview:** Revenue bar chart + Occupancy pie chart + KPI cards
2. **Occupancy:** Room status distribution bar chart + percentage cards
3. **Revenue:** Monthly revenue line chart + Payment status pie chart
4. **Expenses:** Category-wise horizontal bar chart

### Charts Used
- `BarChart` — Revenue by month, occupancy distribution
- `PieChart` — Room occupancy, payment status
- `LineChart` — Revenue trend over time
- `ResponsiveContainer` — All charts responsive
- `Cell` — Color-coded segments

---

## Architecture Decision 72: Data Export/Import System

**Status:** Accepted
**Date:** 2026-06-23

### Decision
The Settings module provides data backup and restore:
- **Export:** Downloads all localStorage data as a single JSON file with timestamp
- **Import:** Reads a JSON backup file and restores all localStorage keys
- **Clear All:** Nuclear option with double confirmation (window.confirm)

### Exported Keys
All `helloStay_*` localStorage keys are included in the export.

---

## Architecture Decision 73: Module localStorage Key Registry

**Status:** Accepted
**Date:** 2026-06-23

### Decision
Every module has a dedicated localStorage key. The complete registry:

| Module | localStorage Key | Data Type |
|--------|-----------------|-----------|
| Hotel Setup | `helloStay_hotelData` | Object |
| User Role | `helloStay_userRole` | String |
| Rooms | `helloStay_rooms` | Array |
| Bookings | `helloStay_bookings` | Array |
| Guests | `helloStay_guests` | Array |
| Employees | `helloStay_employees` | Array |
| Attendance | `helloStay_attendance` | Array |
| Payslips | `helloStay_payslips` | Array |
| Expenses | `helloStay_expenses` | Array |
| Inventory | `helloStay_inventory` | Array |
| Facility Bookings | `helloStay_facilityBookings` | Array |
| Facility Charges | `helloStay_facilityCharges` | Object |
| Restaurant Menu | `helloStay_restaurantMenu` | Array |
| Restaurant Orders | `helloStay_restaurantOrders` | Array |

---

## Milestone 24: Complete Module Implementation

**Status:** COMPLETED
**Date:** 2026-06-23

### Objective
Design and implement all 10 remaining frontend modules with premium UI, consistent architecture, and comprehensive documentation.

### Completed Modules

#### 1. Bookings Module (`Bookings.jsx` — ~550 lines)
- Full data table with sort, search, filter (status, payment, date), pagination
- New Booking modal with guest info, room selection, date pickers
- Auto-calculate total from room price × nights
- Room availability validation (checks date conflicts)
- Status dropdown (Reserved/Checked In/Checked Out/Cancelled)
- Status change auto-updates room status
- Payment status tracking (Pending/Partial/Paid/Refunded)
- View booking details modal with inline payment recording
- Edit booking with form pre-population
- Delete with inline Yes/No confirmation
- Stats cards: Today's Check-ins, Check-outs, Revenue, Pending Amount

#### 2. Guests Module (`Guests.jsx` — ~500 lines)
- Card-based layout (not table) for visual guest profiles
- Avatar initials with color-coded backgrounds
- Guest stats: Total stays, Total spent, Country
- Add/Edit guest modal with personal info, address, identity document
- View guest modal with full profile + stay history from bookings
- Search by name, phone, email, ID number
- Pagination for card grid
- Stats: Total Guests, Added This Month, With Bookings, Nationalities

#### 3. Employees Module (`Employees.jsx` — ~500 lines)
- Full data table with sort, search, role filter, status filter
- Add employee (navigates to `/register-employee`)
- Edit employee modal with all fields
- Quick toggle Active/Inactive status
- Inline delete confirmation
- View employee modal with salary, months worked, all details
- Stats: Total Staff, Active, On Leave, Monthly Payroll

#### 4. HR & Payroll Module (`HRPayroll.jsx` — ~450 lines)
- Tab-based interface: Attendance | Payroll | Payslips
- Attendance: Daily marking per employee (Present/Absent/Half Day/Leave/Holiday)
- Monthly attendance summary per employee
- Payroll: Salary calculation based on attendance
- Payslip generation for entire staff
- Payslip cards with detail modal
- Month/Year selector for period navigation

#### 5. Expenses Module (`Expenses.jsx` — ~450 lines)
- Full data table with sort, search, category filter, date range filter
- Category breakdown bar chart (visual spending distribution)
- Add/Edit expense with 12 categories
- Payment method tracking
- Receipt number tracking
- Stats: Total, This Month, This Year, Entries

#### 6. Inventory Module (`Inventory.jsx` — ~450 lines)
- Full data table with sort, search, category filter, stock status filter
- Quick stock adjustment (+/- buttons in table)
- Stock status: In Stock / Low Stock / Out of Stock
- Add/Edit item with category, unit, cost, supplier, location
- Total value calculation
- Stats: Total Items, Stock Value, Low Stock, Out of Stock

#### 7. Restaurant Module (`Restaurant.jsx` — ~550 lines)
- Tab-based interface: Orders | Menu | Tables
- Orders: Active order cards with status workflow
- Menu: Menu item cards with add-to-order functionality
- Tables: Visual grid showing Available/Occupied status
- Order creation with item selection, quantity controls
- Status progression: Preparing → Ready → Served → Paid
- Stats: Active Orders, Total Orders, Revenue, Menu Items

#### 8. Reports Module (`Reports.jsx` — ~350 lines)
- Tab-based interface: Overview | Occupancy | Revenue | Expenses
- recharts integration: BarChart, PieChart, LineChart
- Overview: Revenue bar + Occupancy pie + KPI cards
- Occupancy: Room status distribution + percentages
- Revenue: Monthly trend line + Payment status pie
- Expenses: Category-wise horizontal bar chart
- All charts responsive with tooltips

#### 9. Settings Module (`Settings.jsx` — ~350 lines)
- Tab-based interface: Hotel Profile | System | Backup & Data
- Hotel Profile: Name, rooms, country, currency, contact info
- System: Theme (placeholder), Notifications (placeholder)
- Export Data: Downloads all localStorage as JSON
- Import Data: Restores from JSON backup
- Clear All: Nuclear option with confirmation

#### 10. Profile Module (`Profile.jsx` — ~280 lines)
- Profile card with gradient header and avatar
- Edit name, email, phone
- Role badge display (Owner/Manager/Employee)
- Change password form with validation
- Account information display
- Password change placeholder (until backend auth)

### New Concepts Documented
- Frontend Concepts: Tab Navigation Pattern, Card Grid Layout, Avatar Initials, Quick Stock Adjustment, Chart Integration (recharts), Data Export/Import Pattern, Attendance Marking Pattern, Order Workflow Pattern
- Developer Handbook: Complete Module Architecture Pattern, Data Table Pattern, Card Grid Pattern, Tab Navigation Pattern, Chart Dashboard Pattern, Data Export/Import Pattern, Attendance System Pattern, Order Management Pattern

### Files Modified/Created
- `Bookings.jsx` — Complete rewrite (~550 lines)
- `Guests.jsx` — Complete rewrite (~500 lines)
- `Employees.jsx` — Complete rewrite (~500 lines)
- `HRPayroll.jsx` — Complete rewrite (~450 lines)
- `Expenses.jsx` — Complete rewrite (~450 lines)
- `Inventory.jsx` — Complete rewrite (~450 lines)
- `Restaurant.jsx` — Complete rewrite (~550 lines)
- `Reports.jsx` — Complete rewrite (~350 lines)
- `Settings.jsx` — Complete rewrite (~350 lines)
- `Profile.jsx` — Complete rewrite (~280 lines)
- `PROJECT_NOTES.md` — AD 64-73 added, Milestone 24 added
- `FRONTEND_CONCEPTS.md` — 8 new concepts documented
- `DEVELOPER_HANDBOOK.md` — 8 new architectural patterns

### Architecture Decisions Referenced
- AD 59 — UI/UX Design System
- AD 60 — Module Specifications
- AD 61 — Dynamic UI Configuration
- AD 62 — Multi-Currency Support
- AD 63 — Role-Based Access Control
- AD 64 — Full Module Implementation Strategy
- AD 65 — Bookings Module Data Model
- AD 66 — Guest Profile Architecture
- AD 67 — HR & Payroll System Design
- AD 68 — Expense Tracking Architecture
- AD 69 — Inventory Management Design
- AD 70 — Restaurant Module Design
- AD 71 — Reports Module with recharts
- AD 72 — Data Export/Import System
- AD 73 — Module localStorage Key Registry

### Key Outcomes
- All 14 application modules are now fully implemented (Dashboard, Rooms, Bookings, Guests, Employees, HR & Payroll, Expenses, Inventory, Facilities, Restaurant, Reports, Settings, Profile, RegisterEmployee)
- Zero lint errors across all files
- Consistent architecture across all modules
- Premium UI with Framer Motion animations
- Comprehensive documentation for beginners
- Ready for backend API integration