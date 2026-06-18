# HelloStay Developer Handbook
>Purpose
This document contains developer practices, file types, documentation standards, workflow tips, debugging approaches, and industry knowledge learned while building HelloStay.

---

# Initial Steps for Project
Check whether we have all the necessary softwares installed in our device.

>Check Node.js:
node -v
npm -v

>Check Python:
python --version

>Check Git:
git --version

---

# Markdown (.md)
>Definition
Markdown is a lightweight markup language used to create formatted documentation using plain text.

>Common Examples
- README.md
- PROJECT_NOTES.md
- LEARNING_NOTEBOOK.md
- DEVELOPER_HANDBOOK.md

## Heading Levels
- "#" - Main Title

- "##" - Section

- "###" - Subsection

- "####" - Sub-subsection

## Some More Syntax
- "__ __" or "** **" - To bold any text

## Industry Practice
Most professional repositories use Markdown for documentation because it is:

- Easy to read
- Easy to write
- Supported by GitHub, GitLab, and Azure DevOps

## Note
Markdown have a very broad variety of syntax and convensions So if you need anything search it in the internet.

---

# Folder Naming Convention
>Preferred
HOTEL_PROJECT
HelloStay
SoftwareProjects

>Avoid
Hotel Project
My Folder
Final Project New

>Reason
Folders without spaces are easier to use with:

- Scripts
- Build tools
- Automation systems
- CI/CD pipelines

---

# Verification Mindset
>Industry Practice
Never assume a setup step worked correctly.
Always verify:

- Python version
- Active virtual environment
- Installed packages
- Database connections
- API responses

>Principle
Trust, but verify.
Professional developers validate important setup steps before moving forward.

## Example:
An active virtual environment does not guarantee that required packages are installed.

>Verification:
pip list

or

pip show uvicorn

>Lesson:
Always verify package availability before assuming a dependency exists.

---

# Error Analysis
>Rule:
Read the complete error message before attempting a fix.

>Common Beginner Mistake:
Trying random commands without understanding the error.

>Professional Approach:
1. Read the error.
2. Identify the failing component.
3. Determine the root cause.
4. Apply a targeted fix.
5. Verify the result.

---

# Development Workflow
>Professional Development Cycle:
1. Plan
2. Implement
3. Verify
4. Document
5. Commit

## HelloStay Example
>Plan:
- Create virtual environment

>Implement:
- python -m venv venv

>Verify:
- where.exe python

>Document:
- Update learning notes

>Commit:
- Save changes to Git

## Goal
Create repeatable and reliable development habits.

---

# Database Safety

## Principle
Database changes should be explicit.

>Preferred:
session.commit()

>Avoid:
utomatic commits whenever possible.

## Benefit
- Better control
- Easier debugging
- Safer transactions

---

# Virtual Environment Recovery

## Problem
__A virtual environment may become invalid if:__
- The project folder is moved
- The project folder is renamed
- The Python installation changes
- The virtual environment becomes corrupted

## Symptoms
>Examples:
* uvicorn command not found
* No module named uvicorn
* pip list showing missing packages

## Recovery Procedure
__Step 1: Deactivate Virtual Environment__
deactivate

__Step 2: Delete Existing Virtual Environment__
>PowerShell:
Remove-Item -Recurse -Force venv

>Alternative:
Delete the venv folder manually using File Explorer.

__Step 3: Create New Virtual Environment__
python -m venv venv

__Step 4: Activate Virtual Environment__
venv\Scripts\activate

__Step 5: Reinstall Dependencies__
pip install -r requirements.txt

__Step 6: Verify Installation__
pip list

__Step 7: Start FastAPI Server__
uvicorn app.main:app --reload

## Industry Practice
- Virtual environments are disposable.
- requirements.txt is the source of truth.
- If a virtual environment becomes corrupted, recreate it instead of trying to repair it.

## HelloStay Example
>Problem:
__Project folder was moved from:__
C:\HOTEL_PROJECT\HelloStay

__to:__
C:\__PROJECTS__\HelloStay

>Result:
The virtual environment contained invalid paths and Uvicorn could no longer start.

>Solution:
Delete the existing virtual environment and recreate it using requirements.txt.

---

# Documenting directory
This is the industry practice to use "/" while documenting the file structure of any project.

- You do not actually type the / into the folder name.
Windows will not allow folder names ending with / anyway, because / is a path separator.

>Example
HelloStay/
├── frontend/
├── backend/
├── electron/
├── database/
├── backups/
├── logs/
└── docs/

---

# Correct Path for Project Folder
>For software development, especially when working with:
- Node.js (node_modules)
- Electron
- SQLite databases
- Git repositories

>OneDrive can sometimes cause:
- File locking issues
- Slow installs
- Git conflicts
- Database synchronization problems

>I recommend keeping HelloStay somewhere like:
C:\Projects\HelloStay

- This is not mandatory right now, but it's a professional practice and will save headaches later.

---

# Verifying Virtual Environment Creation
Always make sure to check whether the virtual environment has been created succesfully by the following ways:

1. Check though <where.exe python> and make sure that the python version is visible under the venv folder.
2. Check whether the venv folder is present inside the folder where you have installed it.

---

# Choosing the Correct Python Version
If we take the example of VS Code, Look at the bottom right row in your ide and look at the block where we are able to see the currently using language model. Check whether we have python(venv) or (venv) seleted, which means that we are using python which has been installed in our virtual environment.

- If you are unable to see (venv) then do the following steps:

1. Use ctrl + K then M or click the same language model name on the bottom right corner to open the Choose languae model dialog. 
2. Choose the python version which have the same location path of venv folder. If you are unable to see the python version then copy-paste the path of the python installed in venv folder.

## Alternate Check(Very Reliable)
1. Press: Ctrl + Shift + P, then type: Python: Select Interpreter, and press Enter.

2. You will see an option like Python 3.13.3 (venv). If not, then choose Enter interpreter path. After that, paste the path of the python installed in the venv folder and press Enter.

---

# Dependency Management

>Principle
If a project depends on a package, that dependency must be documented.

>Python Standard
requirements.txt

>Goal
Allow any developer to recreate the project environment reliably.

>Common Command
pip install -r requirements.txt

---

## Separation of Concerns

>Definition
A software design principle where each component has a specific responsibility.

>Purpose
Keeps code organized, maintainable, and scalable.

>Example
_Good_:
api/ → Routes
models/ → Database tables
schemas/ → Validation
database/ → Database connection

_Bad_:
Putting API logic, database logic, and validation logic in one file.

## Benefit
- Easier maintenance
- Easier testing
- Easier debugging
- Better scalability

### Industry Practice
Large applications separate responsibilities into different modules instead of keeping everything in one file.

---

# PowerShell vs CMD Commands
Some commands differ between Command Prompt and PowerShell.

>Example:
_.CMD_:
rmdir /s /q venv

_PowerShell_:
Remove-Item -Recurse -Force venv

_Lesson_:
Always verify which shell is being used before executing system commands.

---

# Common Naming Convention in ORM Projects
- Most ORM projects use singular class names and plural table names.

>Example:
_class_:
class User(Base)
class Product(Base)

_tables_:
__tablename__ = "users"
__tablename__ = "products"

>Purpose:
This makes it easy to distinguish:
Class → One object.
Table → Collection of objects.

---

# Python Import Style
- It is recommended to import the files in your project like the following way:

Standard Library
↓
Third Party Libraries
↓
Project Imports

>Example
```python
from decimal import Decimal

from sqlalchemy import Integer, String, Numeric
from sqlalchemy.orm import Mapped, mapped_column

from app.database.base import Base
```

---

# Database Debugging

## Verifying Database Changes
When creating a new model:

1. Verify the model is imported.
2. Verify create_all() executes.
3. Verify the table exists in the actual database.
4. Do not rely only on terminal logs.

The database itself is the final source of truth.

---

# Resource Not Found Handling
>Problem
A client requests a room that does not exist.

>Example:
```python
DELETE /rooms/999
```

- where room 999 is not present in the database.

>Incorrect Approach
```python
return {
    "message": "Room not found"
}
```

- This returns HTTP 200 even though the operation failed.

>Correct Approach
```python
raise HTTPException(
    status_code=404,
    detail="Room not found."
)
```

>Why?
- Follows REST standards
- Clearly communicates failure
- Easier frontend error handling
- Consistent with GET and PUT endpoints

>Key Learning
Missing resources should return HTTP 404 instead of a success response.