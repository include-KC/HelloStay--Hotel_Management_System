# HelloStay Learning Notebook
>Purpose
This document stores technical concepts learned while building HelloStay.

>For every concept, document:
- Definition
- Purpose
- Command / Syntax (if applicable)
- Example
- Industry Practice
- Common Mistakes
- HelloStay Usage

---

# Package Manager
>npm
It helps in installing dependencies.

>Example
npm install react

---

# Python

## Python Package Manager(pip)
>Definition:
PIP stands for "Pip installs Packages". It manages python packages.

>Purpose: 
Manager the python packages.

>Working Process:
PIP connects to an online repository of public packages called the Python Package Index (PyPI) and can also be configured to connect to other package repositories, both local and remote.

---

## Python Interpreter
>Definition
The Python executable that VS Code uses to run and analyze code.

>Common Problem
Packages may be installed inside a virtual environment, but VS Code may still use the global Python interpreter.

>Symptom
__Import errors such as__:
Import "fastapi" could not be resolved
even though the package is installed.

>Solution
1. Press Ctrl + Shift + P
2. Search for "Python: Select Interpreter"
3. Select the project's virtual environment

>Cause
VS Code is using a different Python interpreter than the terminal.

>Industry Practice
Always verify that the IDE is using the project's virtual environment.

---

## Package Installation
>Definition:
Installing external Python libraries into a project environment.

>Common Command
pip install package_name

>HelloStay Example
pip install fastapi uvicorn sqlalchemy pydantic

>Industry Practice
Always install packages inside a virtual environment.

#### Common Mistakes
- Installing packages globally
- Typing incorrect package names
- Forgetting to update requirements.txt

---

## Python Special Attributes

### Dunder Attribute
Dunder = Double Underscore

>Examples:
__init__
__str__
__name__
__tablename__

Frameworks such as SQLAlchemy use dunder attributes to identify special behavior.

>Example:
__tablename__
tells SQLAlchemy which database table a model should map to.

---

## Python Fundamentals

### Underscore in Python
1. name
   - Normal public variable

2. _name
   - Internal-use convention
   - Can still be accessed

3. __name
   - Name mangling
   - Used for pseudo-private attributes

4. __name__
   - Dunder (Double Under) attributes
   - Special meaning in Python or frameworks

>Examples:
__init__
__str__
__tablename__

- SQLAlchemy uses __tablename__ to identify the database table associated with a model.

### Python try/finally
>Purpose:
Ensure cleanup code always executes.

>Example:
try:
    perform work

finally:
    cleanup

>Common Uses:
- Closing database sessions
- Closing files
- Releasing resources
- Cleaning temporary data

---

## Pydantic Schemas

### Decimal vs Float
- float may introduce precision errors.

* Example:
0.1 + 0.2 = 0.30000000000000004

- Decimal provides exact decimal arithmetic.

* For monetary values such as room rent, bills, taxes, and payments, Decimal is preferred over float.

* Keep schema types consistent with database types whenever possible.

### Create Schema vs Response Schema
>Create Schema:
- Represents data sent by client.
- Usually does not contain database-generated fields.

>Response Schema:
- Represents data returned by API.
- Usually contains database-generated fields such as id.

* Primary keys should generally be returned in API responses.

### Response Schema Design
- Response schemas should match actual database values.

- If a database column is nullable,
the corresponding response field is often Optional.

- Returning all fields does not mean every field is required.

>Required:
- Always contains a value.

>Optional:
- May contain None.

### Optional vs Truly Optional
>Optional[str]
means the value can be a string or None.

>Optional[str] = None
means the field itself may be omitted.

.For Update schemas, use:
field_name: Optional[type] = None

- This allows partial updates.

---

## Partial Update API
>Definition
A partial update API updates only the fields provided in the request body while leaving all other fields unchanged.

>Example
__Current Database Record__
```json
{
    "room_number": "101",
    "price_per_night": 2500,
    "room_status": "Available",
    "room_type": "Single"
}
```

__Request__
```json
{
    "price_per_night": 3000
}
```

__Result__
```json
{
    "room_number": "101",
    "price_per_night": 3000,
    "room_status": "Available",
    "room_type": "Single"
}
```

### Implementation
```python
update_data = room.model_dump(exclude_unset=True)

for key, value in update_data.items():
    setattr(existing_room, key, value)
```

>Benefits
- Less data transfer
- Better user experience
- Preserves existing values
- Easier frontend integration
- Industry-standard REST API design

### Key Learning
A partial update modifies only the fields sent by the client and leaves all other database values unchanged.

---

## What Is (__init__.py) File?
>Definition: 
A special Python file that marks a folder as a Python package.

>Purpose:
Allows Python to import files from the folder.

>Example:
With:
app/
├── __init__.py
└── main.py
Python recognizes app as a package.

> Industry Practice:
Always include __init__.py file in Python packages.

---

## Virtual Environment (venv)
>Definition
A virtual environment is an isolated Python environment created for a specific project.

>Purpose
Allows projects to maintain their own package versions without affecting other projects.

>Why It Exists
Different projects may require different versions of the same package.

_For example_: Imagine,
Project A needs: FastAPI 0.115
Project B needs: FastAPT 0.95
If both are installed globally: Confuses the python as there are two versions to choose from.

> What are these Files?
Contains C/C++ header files used by some Python packages.

>Venv/

1. __Lib/__: Important file. Contains intalled packages.

2. __Scripts/__: Contains executeble programs.

3. __pyvenv.cfg__: Configuration file describing the virtual environment.

4. __venv/.gitignore__: Python automatically creates a .gitignore inside the venv.

_Its purpose_:
Prevent accidental commits of the virtual environment.

### Industry Practice
>Common tools:

- venv
- Poetry
- Pipenv
- Conda

### Common Mistakes
- Installing packages globally
- Committing venv to Git
- Forgetting to activate the environment
- Deleting requirements.txt

### HelloStay Usage
>Location:
HelloStay/backend/venv

- Contains all backend dependencies.

---

## Creating a Virtual Environment
>Command
python -m venv venv

>Purpose
Creates a virtual environment named venv.

>Procedure
1. Open terminal inside backend folder.
2. Execute the command.
3. Verify the venv folder is created.

---

## Activating a Virtual Environment
>Command
venv\Scripts\activate

>Expected Output
(venv)

- If the venv environment is activated, then we can see (venv) at the starting of path name in powershell.

>Purpose
Activates the virtual environment.

> Common Mistakes
- Running from wrong folder
- Forgetting activation before package installation

---

## Verifying Virtual Environment

### Method 1
where.exe python

>Expected Result
- The result will have all the paths where python is installed, including the global and virtual environments.

- Path should include:
venv\Scripts\python.exe

---

### Method 2
python -c "import sys; print(sys.executable)"

>Expected Result
Returns the Python execut
able currently being used.

>Purpose
Confirms that Python is running from the virtual environment.

### pip freeze
It is a python command which generates the list of all the python packages installed in the system.

>Command
pip freeze

---

## requirements.txt
>Definition
A file containing all Python dependencies required by a project.

>Purpose
Allows developers to recreate the same environment.

>Generate File
pip freeze > requirements.txt

>Install Dependencies
pip install -r requirements.txt

### Example

fastapi==0.136.3
SQLAlchemy==2.0.50
uvicorn==0.48.0

### Industry Practice
- Every Python project should maintain an up-to-date requirements.txt.

### Real Company Workflow:
> Developer A:
pip install fastapi
pip freeze > requirements.txt
git commit

> Developer B:
git pull
pip install -r requirements.txt

-  Now both the machines have the identical dependencies.
- Every dependency used by the project should be documented.

### Common Mistakes
- Forgetting to regenerate requirements.txt
- Installing packages globally

### HelloStay Usage
Stores backend dependencies such as:
- FastAPI
- SQLAlchemy
- Uvicorn

### Why requirements.txt File Contains So Many Packages?
- The requirements.txt file contains the primary packages with the other packages as well.
- These other packages are called dependencies of dependencies (also called transitive dependencies).
- When we install FastAPI, pip automatically installs the packages FastAPI needs.

---

## Dependency Tree
>Definition
A package may depend on other packages to function correctly.

>Example
FastAPI depends on:
- Starlette
- Pydantic

Pydantic depends on:
- pydantic_core
- annotated-types

### Industry Term
Transitive Dependencies

### HelloStay Usage
Installing FastAPI automatically installed supporting packages.

---

## pip list
>Purpose:
This gives you the list of all the packages along with their versions.

>Command:
pip list

---

## pip show
>Purpose:
Gives the information of specific packages.

>Command example:
pip show fastapi

---

## Install Packages
>Purpose:
- This is the first step to start our backend journey.

- This code helps in intalling the important packages for HelloStay project.

>Command:
pip install fastapi uvicorn sqlalchemy pydantic

>Verifying the install:
1. check installed packages using <pip list>.
2. Freeze the dependencies using <pip freeze>.

---

## Working of Packages
> FastAPI:
* __Definition__: A modern Python framework used to build APIs quickly and efficiently.

* __Purpose__: Handles requests from the frontend and returns responses.

* __HelloStay Usage__: Will handle requests related to rooms, customers, reservations, billing, and reports. 

__Example__:
GET /rooms
POST /customers
PUT /reservations

>Uvicorn:
* __Definition__: An ASGI server used to run FastAPI applications.

* __Purpose__: Runs the FastAPI appications.

* __Industry Practice__: FastAPI applications are commonly executed using Uvicorn.

__Think of it as__:
FastAPI = Car
Uvicorn = Engine

* __HelloStay Usage__: Runs the backend server.

>SQLAlchemy:
* __Definition__: An ORM (Object Relational Mapper) for Python.

* __Purpose__: Talks to the database using Python objects.

* __HelloStay Usage__: Will communicate with the SQLite database.

__Instead of writing__: <SELECT *FROM rooms;>
- We write python code to do the same task.
- This is called ORM.

>Pydantic:
* __Definition__: A data validation library used by FastAPI.

* __Purpose__: Data validation and data conversion.

* __HelloStay Usage__: Will validate user input and API request data.

__Example__:
- If somebody enters:
Room Number = "abc"
- When a number is required,
- Pydantic catches the error.

---

## Deactivate Virtual Environment
>Purpose:
Exits the currently active virtual environment.

>Command:
deactivate

---

# FastAPI
Every FastAPI project starts by creating a FastAPI application.

>Definition
A modern Python framework used to build APIs.

>Purpose
Handles requests from the frontend and returns responses.

## HelloStay Usage
>Will manage:

- Rooms
- Customers
- Reservations
- Billing
- Reports

---

## Create vs Response vs Update Schemas
>Create Schema:
Used when creating new records.
Does not contain database-generated fields like id.

>Response Schema:
Used when returning data from API.
Contains database-generated fields such as id.

>Update Schema:
Used when updating existing records.
Fields are typically optional to allow partial updates.

---

## FastAPI Application
>Purpose
Acts as the entry point of the backend application.

>Example
app = FastAPI()

---

## FastAPI Architecture

### REST Naming Convention
>Collection:
    /rooms

.Single Resource:
    /rooms/{room_id}

>HTTP Methods:
POST    → Create
GET     → Read
PUT     → Update
DELETE  → Delete

### What is a Schema?
Schema = Blueprint for API Data.

>Purpose:
- Validate incoming requests.
- Validate outgoing responses.
- Define API data structure.

>Example
```python
from pydantic import BaseModel
class StudentCreate(BaseModel):
    name: str
    age: int
    course: str
```
- This means that whenever someone creates a student,
these fields are expected:
```json
{
    "name": "Krishna",
    "age": 20,
    "course": "Computer Science"
}
```
>Addiing Optional Fields
__Example__:

```python
from pydantic import BaseModel
from typing import Optional

class StudentUpdate(BaseModel):
    name: Optional[str] = None
    age: Optional[int] = None
    course: Optional[str] = None
```

#### Common Schema Imports
>BaseModel:
- Used to create schemas.

>Optional:
- Used for fields that may be omitted or set to None.

>Decimal:
- Used for monetary values.
- Preferred over float for billing-related data.

>Create Schema
- Used for creating new records.
- Example: RoomCreate

>Response Schema
- Used for returning API data.
- Example: RoomResponse

>Update Schema
- Used for updating existing records.
- Example: RoomUpdate

Using separate schemas keeps API validation clear and maintainable.

### Model vs Schema
>Model:
- Database blueprint.
- Defines tables and columns.

>Schema:
- API blueprint.
- Defines request and response data.

>Common Schemas:
- Create Schema
- Response Schema
- Update Schema

---

## Basic FastAPI Formation
__Code__:
```python

from fastapi import FastAPI
app = FastAPI()
@app.get("/")
def root():
    return {
        "application": "HelloStay",
        "message": "Backend server is running successfully"
    }

```
__Output__:
```JSON

{
  "application": "HelloStay",
  "message": "Backend server is running successfully"
}

```
1. __"from fastapi import FastAPI"__: Imports the FastAPI class.
2. __"app = FastAPI()"__: Creates the FastAPI application object. This object becomes the center of our backend.
3. __"@app.get("/")"__: This is called a GET endpoint. This means, 
When someone visits: / -->  Run the function below.
4. __"def root()"__: Functions that executes whewn the route is accessed.
5. __"return {...}"__: FastAPI automatically converts Python dictionaries into JSON.

### Common mistake:
1. Wrong indentation on Python code.
2. Forgetting parenthesis, ().
3. Typing root incorrectly.
 _BAD_: @app.get("/"), Without a function below. 

---

## model_dump(exclude_unset=True)
>Problem
_Request Body_
```json
{
  "price_per_night": 3000
}
```

_Schema_
```python
class RoomUpdate(BaseModel):
    room_number: Optional[str]
    price_per_night: Optional[Decimal]
    room_status: Optional[str]
```

>model_dump()
```python
room.model_dump()
```

_Output_
```python
{
    "room_number": None,
    "price_per_night": 3000,
    "room_status": None
}
```

>model_dump(exclude_unset=True)
```python
room.model_dump(exclude_unset=True)
```

_Output_
```python
{
    "price_per_night": 3000
}
```

### Why Is This Useful?
- It tells us exactly which fields the client wants to update.
- We can then safely update only those fields.

### Key Learning
_Use_:
```python
room.model_dump(exclude_unset=True)
```

- for partial update APIs.
- It prevents existing database values from being overwritten with None.

### model_dump()
>Definition
`model_dump()` is a Pydantic method that converts a schema object into a Python dictionary.

>Syntax
```python
schema.model_dump()
```

>Example
```python
update_data = room.model_dump(exclude_unset=True)
```

#### Common Mistake
__Incorrect__:
```python
room.model.dump()
```

__Correct__:
```python
room.model_dump()
```

>Key Learning
`model_dump()` is a method of the schema object itself and is commonly used to convert request data into a dictionary for processing.

---

## Dictionary Iteration
>Example
```python
update_data = {
    "price_per_night": 3000,
    "room_status": "Available"
}
```

>Loop
```python
for key, value in update_data.items():
```

>Iteration 1
```python
key = "price_per_night"
value = 3000
```

>Iteration 2
```python
key = "room_status"
value = "Available"
```

>Why Is This Useful?
- The loop allows us to process any number of fields dynamically.

- Instead of writing separate update statements for every field, we can update fields using the key-value pairs generated by the loop.

>Key Learning
Dictionary `.items()` returns both keys and values, making it suitable for dynamic update operations.

---

## setattr()
>Definition
`setattr()` is a built-in Python function used to dynamically modify an object's attributes.

>Purpose
Allows attribute names to be determined at runtime instead of being hardcoded.

>Syntax
```python
setattr(object, attribute_name, value)
```

>Example
```python
setattr(existing_room, "price_per_night", 3000)
```

_Equivalent to_:
```python
existing_room.price_per_night = 3000
```

### How It Works
_Given_:
```python
key = "price_per_night"
value = 3000
```

_Python executes_:
```python
setattr(existing_room, key, value)
```

_Result_:
```python
existing_room.price_per_night = 3000
```

### Industry Practice
Frequently used for:

- Dynamic updates
- Serialization
- Generic CRUD APIs
- Framework internals

### Common Mistakes
1. Passing an invalid attribute name

```python
setattr(room, "wrong_field", value)
```

2. Using setattr() when direct assignment is simpler

```python
room.price_per_night = 3000
```

### HelloStay Usage
Used inside the Room Update API to dynamically update only the fields provided by the client.

### Key Learning
`setattr()` allows dynamic field updates without writing separate assignment statements for every field.

---

## return vs yield
>return:
- Sends value back.
- Function immediately exits.

>yield:
- Sends value back temporarily.
- Function can resume later.

- Pause the function here.
Give this value to FastAPI.
Come back later and continue.

- FastAPI uses yield for dependencies that require cleanup.

>Example:
Database Session
↓
yield session
↓
Endpoint executes
↓
Session closes automatically

---

## Role of yield and finally
- yield does not clean resources.
- yield only pauses the function and provides a value.
- finally is responsible for cleanup.
- _finally means_:
Execute this code no matter what.

>Example:
db = SessionLocal()

yield db

finally:
    db.close()

>Meaning:
Create Session
↓
Use Session
↓
Close Session

---

## API
>Definition
API stands for Application Programming Interface.

>Purpose
Allows different software systems to communicate.

### HelloStay Usage
The React frontend will communicate with the FastAPI backend using APIs.

---

## Endpoint
>Definition
A URL that performs a specific operation.

>Example
/system-info

>Purpose
Provides access to application functionality.

## Resource Identification
When updating, deleting, or retrieving a specific record, the primary key is usually included in the URL.

>Example:
- PUT /system-info/1
- DELETE /system-info/1

>Reason:
Primary keys uniquely identify records.

>Industry Practice:
REST APIs commonly use:

- /resource/{id}

>Examples:
- /rooms/1
- /customers/5
- /reservations/10

---

## Dependency Injection and Depends()
Dependency Injection allows FastAPI to provide resources automatically.

>Common dependencies:
- Database Session
- Logged-in User
- Authentication
- Settings

Depends() tells FastAPI to execute a dependency function and provide its result.

>Example:
db: Session = Depends(get_db)

>Meaning:
FastAPI calls get_db() and injects the database session into db.

>Benefits:
- Less repetition
- Automatic resource management
- Cleaner code
- Easier testing

---

## db vs get_db() vs Depends()
>db
It is a database session and not a complete database. It is a temporary connection to that database.

>get_db()
get_db() is a function which returning the output. It's function is to create, provide and close database session.

>Depends()
Depends tells FastAPI:
"Execute this dependency function and inject result into my endpoint".

---

## Route
>Definition
A mapping between a URL and a Python function.

>Example
@app.get("/")

>Purpose
Tells FastAPI what function should run for a request.

---

## GET Request
>Definition
A request used to retrieve data.

>Example
@app.get("/")

>Purpose
Reads information without modifying data.

---

## APIRouter
>Definition
A FastAPI component used to organize endpoints into separate files.

>Example
router = APIRouter()

>Purpose
Improves maintainability and scalability.

### HelloStay Usage
>Used in:
app/api/system_info.py

## What are tags?
>Definition
Tags are the names given to an APIRouter.

>Purpose
This helps in separating the Endpoints of different API's.

>Example
router = APIRouter(
    tags=["Guests"]
)

---

## What are prefix?
>Definition
Prefix is the name given to an API endpoint.

>Purpose
Helps saving time on writing the name in every endpoint.

>Syntax
router = APIRouter(
    prefix = "/guests",
    tags=["Guests"]
)

>Example
@router.get("", response_model = list[GuestResponse])
def get_guest(
    db: Session = Depends(get_db)
):
    guests = db.query(Guest).all()
    return guests

- You can clearly see that we have used and empty inverter commas("") in 
`@router.get()` because we have already defined prefix.

- If we want to use an input attribute then we can do that normally, like
`/{guest_id}`.

---

## Note(Tags and prefix)
Both tags and prefix can be used directly like, `@router.put(tags=[""], prefix ="")`, if we want.

---

## Swagger UI
>Definition
An interactive API documentation and testing interface generated automatically by FastAPI.

>URL
http://127.0.0.1:8000/docs

>Purpose
- View APIs
- Test APIs
- Understand requests
- Understand responses

>Industry Practice
Widely used during development and testing.

>HelloStay Usage
Used to test all backend endpoints.

>Benefits
- No need to manually document APIs during development
- Easy API testing
- Helps frontend and backend teams collaborate
- Automatically updates when new endpoints are added

>Examples
When HelloStay contains:
GET /rooms
POST /rooms
GET /customers

- Swagger will automatically display all of them.

### Industry Practice
Swagger is widely used during development and testing.
Many companies disable Swagger in production environments for security reasons.

### Alternate Tools
- Postman
- Insomnia
- Thunder Client
- curl

### HelloStay Usage
Swagger will be used throughout development to test all APIs before integrating them with React and Electron.

---

## Running FastAPI Server
>Command
uvicorn app.main:app --reload

>Breakdown
app.main
→ app/main.py

>app
→ FastAPI instance

>reload
→ Automatically restarts when code changes

### Understanding "uvicorn app.main:app --reload"
* _Uvicorn_: Runs the server.
* _app.main_: Means, app/main.py.
* _:app_: Means, app = FastAPI(), inside main.py.

>Expected Output
Will watch for changes in these directories:
Uvicorn running on: http://127.0.0.1:8000
Started reloader process
Started server process
Application startup complete

- The server link will give you the JSON that you have defined in main.py using FastAPI.

### Process of Data Fetching By Uvicorn Server
>When we open the link(http://127.0.0.1:8000):
1. Browser sent a GET request.
2. FastAPI received the request.
3. FastAPI matched: @app.get("/")
4. FastAPI executed: def root()
5. The function returned a Python dictionary.
6. FastAPI converts this Python dictionary into JSON array.
7. Browser displayed the JSON response.

### Common Mistakes
- Wrong module path
- Running outside backend folder
- Virtual environment not activated

---

## JSON
>Definition
JSON stands for JavaScript Object Notation.

>Purpose
Used for data exchange between systems.

>Example
{
  "name": "HelloStay"
}

---

## JSON Object
>Definition
A collection of key-value pairs.

>Example
{
  "id": 1,
  "name": "HelloStay"
}
---

## JSON Response
>Definition:
A structured data format commonly used in APIs.

>Example:
{
  "message": "Hello"
}

>Industry Practice:
Most modern frontend-backend communication uses JSON.

---

## JSON Array
>Definition
A collection of multiple values or objects.

>Example
[
  {
    "id": 1
  },
  {
    "id": 2
  }
]

### HelloStay Usage
>Returned when using:
    .all()

### OpenAPI JSON
>API Documentation: 
The openapi.json file provides a detailed description of the API, including its endpoints, operations (e.g., GET, POST), parameters, request/response formats, and authentication methods. Tools like Swagger UI can render this file into interactive API documentation.

>URL
http://127.0.0.1:8000/openapi.json

---

## CRUD
### Definition
>CRUD stands for:

- Create
- Read
- Update
- Delete

### HelloStay Status
- Create ✓
- Read ✓
- Update (Next)
- Delete (Later)

### Difference Between POST and PUT

1. __POST__
>Purpose:
Create new records.

>Example:
POST /system-info

---

2. __PUT__
>Purpose:
Update existing records.

>Example:
PUT /system-info/1

### Industry Practice:
If the specified record does not exist, many APIs return a "Record not found" error instead of creating a new record automatically.

>Reason:
Prevents accidental data creation caused by incorrect IDs.

---

## Query
>Definition:
A request sent to the database to retrieve data.

>Purpose:
Reads records from database tables.

>Code Example
db.query(SystemInfo)

>Example:
Give me all rooms.
Give me all customers.
Give me all reservations.

---

## CRUD Operations
>CRUD stands for:

- Create
- Read
- Update
- Delete

- These are the four fundamental database operations.

### Create
>Purpose:
Insert a new record.

>Example:
db.add(record)
db.commit()

>Result:
A new row is added to the table.

>Important:
db.add() creates new row not updates it.

---

### Read
>Purpose:
Retrieve records from the database.

>Examples:
db.query(Model).all()
db.query(Model).first()

---

### Update
>Purpose:
Modify an existing record.

>Workflow:
1. Find record
2. Modify attributes
3. Commit changes
4. Refresh object
5. Return updated data

>Example:
record.version = "2.0.0"
db.commit()
db.refresh(record)

#### Important
Changing an object does not immediately update the database.
To make the change permanent:
db.commit()
must be executed.

---

### Delete

>Purpose:
Remove an existing record.

>Workflow:
1. Find record
2. Verify it exists
3. Delete record
4. Commit changes
5. Return success message

>Example:
db.delete(record)
db.commit()

---

### Important
>Create and Delete operations require:
db.commit()

- Without commit(), the database will not be permanently changed.

---

### first() Behavior
>Returns:
- First matching object
- None if no match exists

>Example:
record = db.query(Model).first()

---

### all() Behavior
>Returns:
- List of matching objects
- Empty list [] if no match exists

>Example:
records = db.query(Model).all()

---

### Collection Retrieval Endpoint
>Purpose
Returns all records from a table.

>Example
items = db.query(Item).all()

>Response Model
response_model=list[ItemResponse]

>Return Value
return items

>Key Learning
`.all()` returns a list of ORM objects, which FastAPI serializes using the response model.

---

# Database Concepts

## SQLite
>Definition
A lightweight serverless database stored in a single file. Unlike, MySQL and PostgreSQL which requires separate servers.

>Purpose
Stores application data locally.

### HelloStay Usage
>Database file:
hellostay.db

>Why HelloStay uses SQLite?
- Offline operation
- Easy deployment
- Lightweight
- No separate database server required

### Industry Practice:
>Good for:
- Learning
- Desktop Apps
- Prototypes

>Large applications usually use:
- PostgreSQL
- MySQL

---

### Database Creation
#### Code Used(_HelloStay/backend/app/database/connection.py_):
```Python

from sqlalchemy import create_engine
DATABASE_URL = "sqlite:///hellostay.db"
engine = create_engine(
    DATABASE_URL,
    echo=True
)
```
>Explanation:
1. __DATABASE_URL__: Creates SQLite database file: hellostay.db inside backend folder.
2. __Engine__: Creates connection manager.
3. __echo = True__: Show SQL statements in terminal. Useful for learning and debugging.

#### Industry Practice
Development: echo=True
Production: echo=False
- because logging every SQL query slows things down.

#### Common Mistake
1. _Wrong_: <DATABASE_URL = "sqlite://hellostay.db">
_Must be_: <DATABASE_URL = "sqlite:///hellostay.db">
Notice, "///"
2. Importing wrong Base class. Use exactly:
from sqlalchemy.orm import DeclarativeBase

---

## Table
>Definition
A structure used to store related data.

>Example
system_info

>Example Table
| id | room_number |  status   |
|----|-------------|-----------|
| 1  |     101     | Available |

---

## Row
>Definition
A single record inside a table.

>Example
| id | application_name | version |
|----|------------------|---------|
| 1  |    HelloStay     |  1.0.0  |

---

## Column
>Definition
A field within a table.

>Example
id
application_name
version

---

## Primary Key
>Definition
A unique identifier for each row.

>Example
id

>Properties
- Unique
- Non-null
- Usually auto-incremented

>Purpose
Allows records to be uniquely identified

### Industry Practice
Almost every table contains a primary key.

---

# SQLAlchemy

## ORM
>Definition
ORM stands for Object Relational Mapper.

>Purpose
Allows developers to work with database tables using Python classes instead of raw SQL.

>Example
__Instead of:__
SELECT * FROM system_info;

__Use:__
db.query(SystemInfo).all()

### Mental Model
Think of an ORM as a translator.

Python Objects
↓
ORM
↓
SQL Queries
↓
Database

and

Database Results
↓
ORM
↓
Python Objects

### HelloStay Usage
SQLAlchemy acts as the bridge between Python and SQLite.

---

## SQLAlchemy Object Tracking
>Definition
SQLAlchemy automatically tracks changes made to objects loaded from the database.

>Example
record.version = "2.0.0"

>Benefit
Developers only modify Python objects and SQLAlchemy generates the required SQL UPDATE statements automatically.

---

## Model Discovery
>Definition
SQLAlchemy can only create tables for models that have been imported into the application.

>Example
import app.models.system_info

>Why It Is Needed
If a model is not imported, SQLAlchemy does not know it exists and will not create its table.

### Common Beginner Mistake
Creating a model file but forgetting to import it before calling:
Base.metadata.create_all()

---

## Alembic 
>Purpose
Alembic generates migrations using:

Base.metadata

>Configuration
from app.database.base import Base
target_metadata = Base.metadata

>Model Imports
Models should be imported before migration generation.

>Example:
from app.models.room import Room
from app.models.guest import Guest

>Reason
Only imported models are registered inside:
Base.metadata

- If a model is not imported, Alembic may not detect its table.

>Key Learning
Alembic discovers database tables through `Base.metadata`, and models must be imported to be registered.

### Autogenerated Migrations
>Command
alembic revision --autogenerate -m "create guests table"

>Purpose
Alembic compares:
Base.metadata

against the actual database schema.

>Output
A migration file is generated inside:
alembic/versions/

>Key Learning
`revision --autogenerate` creates migration files but does not modify the database.

Database changes are applied later using:
alembic upgrade head

---

## Foreign Keys in SQLAlchemy

### Purpose
A foreign key creates a relationship between two tables.

>Example:
guest_id: Mapped[int] = mapped_column(
    Integer,
    ForeignKey("guests.id"),
    nullable=False
)

### Syntax
ForeignKey("table_name.column_name")

### Common Mistake
>Incorrect:
ForeignKey = Guest.id

>Correct:
ForeignKey("guests.id")

### Key Learning
Foreign keys reference database table names and column names, not Python class attributes.

---

## Testing Foreign Keys
>Purpose
Verify that foreign key constraints are actually enforced by the database.

>Test Method
Attempt to insert a record using a non-existent foreign key value.

__Example__:
guest_id = 9999

- when Guest 9999 does not exist.

>Expected Result
FOREIGN KEY constraint failed

### Key Learning
A foreign key is working only if the database rejects invalid references.

---

## Engine
>Definition
The SQLAlchemy component responsible for connecting the application to the database.

>Purpose
Establishes communication between SQLite and FastAPI.

>Example
engine = create_engine(DATABASE_URL)

### HelloStay Usage
__Used to connect to:__
hellostay.db

---

## Base Class
>Definition
The parent class for all SQLAlchemy models.

>Purpose
- Tells SQLAlchemy that the class represents a database table.
- Stores metadata about database tables.
- Every database will inherit from this.

>Syntax Example:
class class-name(base)

### HelloStay Usage
All future models inherit from Base.

### Working of Base Class
__When we wrote__:
``` python

class Room(base):

```
__You told SQLAlchemy__:
Room is one of the database models that belnogs to this Base.

>How our table is loaded to SQLAlchemy?
You created Room model.
↓
But SQLAlchemy must import it somewhere.
↓
Then it becomes part of Base.metadata.

---

## Database Model

>Definition
A Python class that represents a database table.

>Example
class Room(Base):
  ...

>Purpose
Allows developers to define database tables using Python code.

>Industry Practice
Each database table is usually represented by a separate model class.

---

## Table Creation
>Definition
Creates database tables from SQLAlchemy models.

>Example
Base.metadata.create_all(bind=engine)
- This line looks for every model-> Creates Table->Inside SQLite.
- This is the line that should create our database(hellostay.db).

>Purpose
Automatically generates tables.

### HelloStay Usage
Created the system_info table.

### Basic Code for Table Creation
>Code:
```Python

from sqlalchemy import Integer, String
from sqlalchemy.orm import Mapped, mapped_column
from app.database.base import Base
class SystemInfo(Base):
    __tablename__ = "system_info"
    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        index=True
    )
    application_name: Mapped[str] = mapped_column(
        String(100)
    )
    version: Mapped[str] = mapped_column(
        String(20)
    )
```
>Explanation:
1. __tablename__ : Name for the table. SQLAlchemy will create the table.
2. __id__: Primary key and unique for every row.
3. __application_name__: Stores "HelloStay".
4. __Version__: Stores "1.0.0".

---

## Model Registration
>Definition
SQLAlchemy must discover models before creating tables.

>Purpose
Ensures model metadata is loaded.

>Example
import app.models.system_info
- If we remove this code after running once then nothing will happen because the table has already been created.
- Removing this code will affect the SQLAlchemy. SQLAlchemy only knows about the models that hhave been imported into memory. If we create any new class after removing this code then SQLAlchemy will not know whether that new class exists or not.

>Why It Matters
SQLAlchemy only creates tables for models that have been loaded into memory.

>Common Beginner Mistake
Creating a model file but forgetting to import it before running:
Base.metadata.create_all()

>Note:
Creating a model file does not automatically register it with SQLAlchemy.

- The model must be imported before:
Base.metadata.create_all()
runs.

- Example:
import app.models.room

- After importing, the model becomes part of Base.metadata and SQLAlchemy can create its table.

### Industry Practice
Developers don't manually import every model in main.py.
Instead, they use: models/__init__.py that imports all models in one place.

---

## Session Factory (SessionLocal)
>Definition
Factory used to create database sessions.

>Example
db = SessionLocal()

>Purpose
Creates a database session.

### HelloStay Usage
Used by API endpoints to interact with the database.

---

## Session
>Definition
A temporary workspace for database operations.

>Purpose
__Allows:__
- Insert
- Read
- Update
- Delete
operations.

>Code
_File:HelloStay/app/database/session.py_:
```Python
from sqlalchemy.orm import sessionmaker
from app.database.connection import engine
SessionLocal = sessionmaker(
    bind=engine,
    autoflush=False,
    autocommit=False
)
```
1. __bind=engine__: Connects session to our SQLite engine.
2. __autoflush=False__: Prevents automatic writes. We'll explicitly decide when data is saved.
3. __autocommit=false__: Requires us to manually commit changes.

---

## Mental Model of SQLAlchemy Components
_Base_
→ Defines database tables.

_Engine_
→ Connects the application to the database.

_Session_
→ Performs database operations.

>Example Flow:
Room Model
↓
Base
↓
Engine
↓
Session
↓
SQLite Database

---

## add()
>Definition
Adds an object to the current database session.

>Example
db.add(system_info)

>Important
The data is not saved permanently until:
db.commit()

---

## commit()
>Definition
Persists database changes.

>Example
db.commit()

### Important
Without commit(), changes are not permanently saved.

### What Happens Without commit()
Changes made to ORM objects are only stored in Python memory until commit() is executed.

>Example:
system_info.version = "2.0.0"
- At this stage the database is not updated.

__To permanently save changes:__
db.commit()

#### Industry Practice:
Always commit database changes intentionally to maintain transaction control.

#### Common Mistake:
Forgetting to call commit() after Create, Update, or Delete operations.

#### What are Transactions?
Transactions are a group of database changes.

---

## Auto Increment Primary Key
>Definition
A primary key value automatically generated by the database.

>Example
1
2
3
4

>Benefit
Ensures every row has a unique identifier.

### HelloStay Example
The system_info table automatically generated:
id = 1

---

## refresh()
>Definition
Reloads the latest values from the database.

>Example
db.refresh(system_info)

>Purpose
Gets generated values such as auto-increment IDs.

### refresh() After Update
refresh() is commonly used after commit() to reload the latest state from the database.

>Example:
db.commit()
db.refresh(system_info)

- In simple updates, refresh() may not be strictly required because the object already contains the updated values.

- However, many projects still use refresh() for consistency and to ensure the returned object matches the database state.

### refresh() After Delete
refresh() should not be used after deleting a record.

>Reason:
refresh() reloads an object from the database.

- After a successful delete operation, the record no longer exists in the database, so there is nothing to reload.

>Example:
db.delete(system_info)
db.commit()

No refresh() here

---

## close()
>Definition
Closes the database session.

>Example
db.close()

>Purpose
Releases database resources.

---

## What does include_router() Do?
- Think of it like:
main.py
│
├── Home Route (/)
│
└── Import Routes From
    system_info.py

- When FastAPI starts:  
app.include_router(system_info_router)
tells it: "Also load all the router from system_info.py"
- Without this line: __POST /system-info__ will never appear in Swagger.

### Industry Practice
- Small Project-- main.py contains all the routes.
- Large projects (like HelloStay): Each file contains related routes, then main.py imports all the routes.

---

## Common Mistakes in SQLAlchemy CRUD
1. Forgetting db.commit().
2. Forgetting db.close().
3. Thinking db.add() saves the data. Only, db.commit() make it permanent.

---

## first()
>Definition
Returns the first matching record.

>Example
db.query(SystemInfo).first()

>Result
Returns a single object.

### Property of first()
__If first() cannot find a matching record, it returns:__
None

>Reason:
first() returns a single object. If no matching object exists, SQLAlchemy returns None.

>Example:
db.query(SystemInfo)\
    .filter(SystemInfo.id == 999)\
    .first()

1. __db.query(SystemInfo)__: Search inside the SystemInfo table.
2. __.filter(SystemInfo.id == 1)__: Only keep records whose id is 1.
3. __.first()__: Give me the first matching record.

>Result:
None

#### Industry Practice
Before updating or deleting:
```python

if system_info is None:
    return {"message": "Record not found"}

```
Only proceed if the record actually exists.

---

## Flow of API Logic
1. Receive ID
        ↓
2. Search record using filter() + first()
        ↓
3. Check if record exists
        ↓
4. Modify values
        ↓
5. commit()
        ↓
6. refresh()
        ↓
7. Return updated data

---

## all()

>Definition
Returns all matching records.

>Example
db.query(SystemInfo).all()

>Result
Returns a Python list.

>Property of all()
__If all() cannot find any matching records, it returns:__
[]

>Reason:
all() always returns a list. If no matching records exist, SQLAlchemy returns an empty list.

>Example:
db.query(SystemInfo)\
    .filter(SystemInfo.id == 999)\
    .all()

>Result:
[]

### NOTE:
If we have a very large data in the database then all() will return all the data. That's why in real applications we usually do: __.limit()__ or __.paginate()__ instead of loading everything.

---

## filter()
>Definition:
Add a filteration condition while using all() or first() functions.

>Example:
db.query(SystemInfo).filter(
    SystemInfo.version == "1.0.0"
).all()

---

## Related Code Used
_File: HelloStay/app/api/system_info.py_
```Python
from fastapi import APIRouter
from sqlalchemy.orm import Session
from app.database.session import SessionLocal
from app.models.system_info import SystemInfo
router = APIRouter()
@router.post("/system-info")
def create_system_info():
    db: Session = SessionLocal()
    try:
        system_info = SystemInfo(
            application_name="HelloStay",
            version="1.0.0"
        )
        db.add(system_info)
        db.commit()
        db.refresh(system_info)
        return {
            "id": system_info.id,
            "application_name": system_info.application_name,
            "version": system_info.version
        }
    finally:
        db.close()

```
1. __db = SessionLocal()__: Creates database session.
2. __system_info = SystemInfo(...)__: Creates a Python Object.
3. __db.add(system_info)__: Marks it for insertion. Still not permanent.
4. __db.commit()__: Actually writes to SQLite.
5. __db.refresh(system_info)__: Leads generated values back into Python.
6. __db.close()__: Releases database resource.Very important.

### CAUTION:
If you are giving any parameter inside function then make sure to write the datatype of the parameter along with it.

>Example:
def delete_system_info(system_info_id: int)

---

## Naming the Model Class
In SQLAlchemy, a model class usually represents one object, not the whole table. So while writing the name of the class:

- _Bad_: class Rooms(base)
_Good_: class Room(base)

- The database table may contain many instances but each instance of the class represents only one entry. 

---

## SQLAlchemy ORM Concepts
SQLAlchemy 2.0 introduces a modern way of defining models using:
- Mapped
- mapped_column

>Example:
id: Mapped[int] = mapped_column(
    Integer,
    primary_key=True
)

>Benefits:
- Better type hint support
- Better IDE autocomplete
- Improved readability
- Recommended for new SQLAlchemy projects

>Old Style:
id = Column(Integer, primary_key=True)

>New Style:
id: Mapped[int] = mapped_column(Integer, primary_key=True)

### Mapped Type vs Database Type
Mapped uses Python data types. 

>Examples:
Mapped[int]
Mapped[str]

mapped_column uses SQLAlchemy database types.

>Examples:
Integer
String
Numeric

>Example:
room_number: Mapped[str] = mapped_column(
    String(20)
)

__Python Type__:
str

- Tells python about what type of data is going to store in the variable.

__Database Type__:
String(20)

- Tell SQLAlchemy about what type of column should be created in the database.

Python types and database types serve different purposes.

### Numeric Columns and Python Types
Numeric(10,2) stores decimal values.

>Examples:
1500.00
1999.99
2500.50

__Using__:
Mapped[int]

- is not appropriate because integers cannot represent decimal values.

>Common progression:
Mapped[int]      → Whole numbers
Mapped[float]    → Decimal numbers
Mapped[Decimal]  → Financial calculations (recommended)

- Money-related fields should eventually use Decimal for maximum accuracy.

### Base.metadata
- Base.metadata stores information about all models that inherit from Base.

>Example:
```Python
class Room(Base):
    ...
class Customer(Base):
    ...
```

- Both models become part of Base.metadata

>Purpose;
- Base.metadata.create_all()
uses this metadata to create database tables automatically.

- Think of Base.metadata as the master registry of all database tables in the application.

### Engine vs Session vs Metadata
>Engine
- Connects SQLAlchemy to the database.

>Session
- Performs CRUD operations.

>Base.metadata
- Stores information about all registered models.

>create_all()
- Uses Base.metadata to create database tables.

>Flow:
Model
↓
Base.metadata
↓
create_all()
↓
Database Table Created

### create_all() Limitation
- Base.metadata.create_all()

- creates missing tables only.

- It does not modify existing tables.

>Examples of changes that create_all() cannot apply:
- Changing nullable=True/False
- Renaming columns
- Changing column types
- Deleting columns

- Database migrations are required for modifying existing database schemas.

### create_all() vs Alembic
>create_all()
__Purpose__:
- Create missing tables

__Limitations__:
- Cannot modify existing tables
- Cannot change constraints
- Cannot rename columns

>Alembic
__Purpose__:
- Modify existing database schemas
- Apply versioned migrations
- Preserve existing data

Industry projects typically use Alembic for database schema changes.

### Database Migration

>Definition
A migration is a record of changes made to the database schema.

>Purpose
Keeps the database structure synchronized with SQLAlchemy models.

>Examples
__Create table__:
CREATE TABLE guests

__Add column__:
ALTER TABLE rooms
ADD COLUMN price_per_night

__Remove column__:
ALTER TABLE rooms
DROP COLUMN old_column

>Why Migrations Exist
_Without migrations_:
Python Models
≠
Database Tables

- which causes application errors.

>Analogy
- Git Commit → Source Code
- Migration → Database Schema

>Key Learning
Migrations allow database structures to evolve without losing existing data.

---

## SQLAlchemy Datatype

### Numeric
Numeric is used for storing decimal values with fixed precision.

>Syntax:
Numeric(total_digits, decimal_places)

>Example:
Numeric(10,2)

- __Meaning__:
10 = Maximum total digits
2 = Digits after decimal point

>Valid Examples:
1500.00
2500.50
99999999.99

>Invalid Examples:
999999999.99
500.123

>Use Cases:
- Room Prices
- Taxes
- Bills
- Invoices
- Discounts

- Numeric is preferred over Float for money-related values because it avoids floating-point precision errors.

### Decimal
This datatype is used for storing decimal values.

>To use this datatype:
```Python

from decimal import Decimal

```
- We need to import decimal package in python.

>HelloStay Usage
This datatype is given to the money or price related input like, price_per_night.

---

## Database Constraints

### Unique vs Required
Unique and Required are different concepts.

>Unique:
Ensures no duplicate values exist.

>Required:
Ensures a value must be provided.

>Examples:
room_number
- Unique
- Required

price_per_night
- Required
- Not Unique

* Multiple rooms may have the same price but cannot have the same room number.

### Primary Key
A Primary Key uniquely identifies each record in a table.

>Characteristics:
- Unique
- Stable
- Never changes
- Used internally by the database

>Example:
id

Business values such as room_number should not be used as primary keys because they may change in the future.

---

## Database Design

### Business Identifier vs Database Identifier
>Business Identifier:
Used by users to identify records.

>Examples:
room_number
booking_number
invoice_number

>Database Identifier:
Used internally by the database.

>Examples:
id

>Best Practice:
Use an auto-increment id as Primary Key and keep business identifiers as separate fields.

### String Length Limits
__Instead of using__:
String

__Prefer__:
String(20)
String(50)
String(100)

>Benefits:
- Prevents invalid data
- Enforces business rules
- Improves readability
- Makes the schema self-documenting

>Example:
version = String(20)
- Version numbers are expected to remain short.

### Required vs Optional Fields
>Required Fields:
- Cannot be empty
- Use nullable=False

>Optional Fields:
- May be empty
- Use nullable=True

Room Module Example:
__Required__:
- room_number
- price_per_night
- max_occupancy
- room_status

__Optional__:
- room_type
- facilities

### Database Constraints vs Validation Rules
>nullable=False
prevents NULL values.

__It does NOT prevent__:
0
-1
-100

>Example:
max_occupancy > 0

>can be enforced by:
1. Application Validation
2. Database Check Constraints

- Not every business rule is automatically enforced by the database schema.

---

# HTTP Methods
HTTP methods define the action a client wants to perform.

## GET
>Purpose:
Retrieve data.

>Example:
GET /system-info

## POST
>Purpose:
Create new data.

>Example:
POST /system-info

## PUT
>Purpose:
Update existing data.

>Example:
PUT /system-info/1

## DELETE
>Purpose:
Remove existing data.

>Example:
DELETE /system-info/1

## CRUD Mapping
1. Create -> POST

2. Read -> GET

3. Update -> PUT

4. Delete -> DELETE

## Industry Practice
API routes should use the correct HTTP method based on the intended action.

---

## HTTPException and Error Handling
>What is HTTPException?
HTTPException is used to stop API execution and return an HTTP error response to the client.

>Import
```python
from fastapi import HTTPException
```

>Syntax
```python
raise HTTPException(
    status_code=404,
    detail="Room not found."
)
```

>Why use raise?
HTTPException is an exception and must be raised instead of returned.

__Correct__:
```python
raise HTTPException(
    status_code=404,
    detail="Room not found."
)
```

__Incorrect__:
```python
return HTTPException(
    status_code=404,
    detail="Room not found."
)
```

>Common HTTP Status Codes
| Status Code |         Meaning       |
|------------ |-----------------------|
| 200         | Success               |
| 201         | Created               |
| 400         | Bad Request           |
| 401         | Unauthorized          |
| 403         | Forbidden             |
| 404         | Not Found             |
| 500         | Internal Server Error |

>Example
```python
room = db.query(Room)\
    .filter(Room.id == room_id)\
    .first()

if room is None:
    raise HTTPException(
        status_code=404,
        detail="Room not found."
    )

return room
```

>Why use HTTPException?
- Provides clear error messages
- Returns proper HTTP status codes
- Follows REST API standards
- Improves frontend integration

>Key Learning
Use HTTPException whenever the requested resource does not exist or the request cannot be processed.

---

# Software Architecture

## Separation of Responsibilities
__Models__
→ Database structure

__Schemas__
→ Data validation

__API Routes__
→ Request handling

__Database Layer__
→ Connections and sessions

- Each layer should focus on a single responsibility.

## Model Layer Responsibilities
The Model Layer is responsible only for defining database tables.

>Models should contain:
- Table names
- Columns
- Data types
- Constraints

.Models should not contain:
- FastAPI routers
- Swagger code
- Session handling
- Request processing

>Examples:
models/
→ Database Structure

api/
→ CRUD Operations

schemas/
→ Validation

database/
→ Connections and Sessions

---
