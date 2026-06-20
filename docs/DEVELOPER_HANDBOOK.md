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

---

# Git
>Definition:
Git is a Distributed Version Control System.

1. __Version__: Every time you modify your project, you create a new version.

2. __Control__:- 
_Git controls_:-
* who changed the code
* when it changed
* what changed
* why it changed

3. __Distributed__: Every developer has the entire project history.

>Problem solved by Git:
Git solves version history. You can go back to any previous version.

## Staging Area(Index)
- The staging area is a temporary area.

- Think of it as a shopping cart.

>Example:
Suppose, if you want to commit only certain files only then you first have to put them in the staging area and then put commit.

---

## git init
>Definition:
Creates a new Git repository.

>Command
git init

>Example
cd HelloStay
git init

>Verification
git status

>Expected Output:
On branch master
No commits yet
nothing to commit

- This means that git repository was successfully initialized.
- Git is now tracking the HelloStay Project.
- No files have been added yet.
- No commits have been created yet.

>Understanding Output
1. __On branch master__: git created a default branch called master.
2. __No commits yet__: You have not created your first snapshot of the project.
3. __nothing to commit__: Git doesn't see any tracked files yet.

### HelloStay Usage
Used when HelloStay repository was first created.

---

## Branches in git
They are simply pointer(refs) to commit, and their names are just strings.This means you can simulate a hierarchy by using slash-separated names like:

>Example
_feature1/subfeatureA/task1_

- This naming convention is purely organizational — Git treats all branches equally regardless of slashes in their names. The hierarchy is only for human readability and for tools (like Git GUIs) that group branches visually.

---

## Branches in Git
>Definition;
A branch is an independent line of development.

>Why do Branches Exists?
Suppose your application is working perfectly.

Now you want to add Multiple Guests Per Room.

This feature requires

Database changes
API changes
Testing
Bug fixing

During development, the application might remain broken for several days.

If you work directly on the main branch:

main

Room
↓

Guest
↓

Stay
↓

❌ Broken Feature
↓

❌ More Bugs
↓

✔ Finally Fixed

Anyone using your project during that time gets broken code.

Branches solve this problem.

### The Main Branch
The main branch represents the latest stable version of your project.

>Professional rule:
Never intentionally break the main branch.

### Merge Conflicts
- Suppose,
Main: room_price = 1000
Feature: room_price = 1200

Git cannot decide which version to keep, this is the version conflict.

1. __Fast-Forward Merge__:
- Suppose,
Main: A → B
Feature: A → B → C

- Nothing changed on main.
- Git simply moves 
    main to C
- No extra merge commit is created.
This is Fast Forward.

2. __Three-Way Merge__:
- Suppose,
Main: A → B → D
Feature: A → B → C

- Git creates merge commit.
      C
     /

A ← B

     \

      D

       \

        M

### Deleting a Branch
- After merging, feature is no longer needed.

>Syntax:
git branch -d feature/multiple-guests

- Only the pointer dissapear The commits remains.

---

## How Branches actually work
A branch is not a copy of your project.

A branch is simply a pointer to a commit.

>Example:
Commit History
A ← B ← C
          ▲
        main

The branch is only pointing to
C

When you create another branch

Commit History
A ← B ← C
          ▲
        main

          ▲
      feature

Both pointers reference the same commit.

Nothing is copied.

>New commits
- Now suppose you make another commit:
A ← B ← C ← D
              ▲
          feature

- Main still points:
A ← B ← C
          ▲
        main

- feature moves, main doesn't.

---

## HEAD
HEAD is one of the most important git concept.

>Definition:
HEAD means where you are currently working.

>Symbol:
If you are seeing "*" in the branch name then that's your HEAD branch.

---

## Repository Root
>Definition
The top-level folder where Git was initialized.

>Example
HelloStay/
│
├── .git/
├── backend/
└── docs/

>Purpose
Acts as the root of the Git repository.

>Important
Git commands can be executed from any folder inside the repository because Git automatically searches upward until it finds the .git folder.

### Quick Git Concept
- When you run: git status
Git searches upward until it finds: .git

>Example
If you're inside:
HelloStay/backend/app/models

Git will walk upward:
models
↑
app
↑
backend
↑
HelloStay

find: .git
and understand:
"This is the repository root."

That's why Git commands work from subfolders too.

---

## git checkout
Helps in creating or navigating branches.

1. __TO NAVIGATE__: git checkout branch-name
2. __TO CREATING AND SWITCHING TO NEW__: git checkout -b new-branch-name

### Note
If we have uncommited changes then git may prevent switching branches.

---

## git stash
Helps in temporary saving the changes in your project.

>Syntax
git stash


---

## git branch
Helps in checking the current branch and changing the name of the branch.

>Syntax(Name change)
git branch -M main

>Syntax(Checking current branch)
git branch

### Creating a branch
>Syntax:
git branch feature/multiple-guests

- This only creates the new branch but you still on your main branch.

### Switching Branches
>Syntax:
git switch feature/multiple-guests

### Create and Switch together
>Syntax:
git switch -c feature/multiple-guests

### Branch Naming
>Avoid:
- branch1
- new
- test
- hello

>Professional Names:
- feature/multiple-guests
- feature/payment
- bugfix/login
- hotfix/crash
- docs/git-handbook

### Tracking Branches
When we executed
```bash
git push -u origin main
```

Git remembered
Local: main
Remote: origin/main

- __Git Push__: It means that push main to origin/main.

- __-u__: Without -u Git wouldm't remember.
you would need 
```bash
git push origin main
```
every time.

### Checking tacking Branch
>Command:
git branch -vv

### Git Push
>Command:
git push

__Meaning__: Local commit -> GitHub nothing more.
Push only uploads.

### Git Fetch
>Command:
git fetch

__Meaning__: GitHub -> Local Database. Notice , working directory does not change. Fetch only download information.It never modifies your project files.

### Git Pull
>Command: 
git pull

This is actually git fetch + git merge
git downloads-> merges and updates files.

### Difference between Fetch and Pull
Fetch-> Downloads only.
Pull-> Download + Merge

### When should you Fetch?
Professional developers often:
git fetch 

before
git pull

because they want to check the incoming changes.

### Git Clone
Suppose, you want to clone the repository which is already present then we use git clone.

>Code:
git clone https://github.com/include-KC/HelloStay.git

Git automatically 
* downloads repository.
* creates .git

### Best Practices
- Push frequently
- Pull before starting work
- Never force push unless absolutely necessary.
- 

---

## git add
>Purpose:
Used to add all new or modified files in the current directory and its subdirectories to the Git staging area.

>Command
git add .

- "." means that all the files present in the staging area.

>Verification
git status

>Expected:
Changes to be committed:

---

## Repository
>Definition
A repository is a project folder that Git tracks and manages.

>Purpose
- Track project changes
- Maintain project history
- Recover previous versions
- Enable collaboration

>Example
HelloStay/
└── .git/

>.git/
- When we run <git init> it creates .git/ file which contails:
1. Change history
2. Branches
3. Commits
4. Configuration

- You usually never edit .git manually.
Git manages it for you.

>Command
git init

### Local Repository vs Remote Repository
>Local Repository
* Stored in your computer.
* __Example__: C:\HOTEL_PROJECT\HelloStay

>Remote Repository
* Stored online.
*__Example__: GitHub, GitLab, Bitbucket

>Connecting Local to GitHub
- __Syntax__: 
git remote add origin https://github.com/include-KC/HelloStay.git

### What is a Remote?
A Remote is simply, a nickname for another Git repository.

- _Example_:
origin-- https://github.com/include-KC/HelloStay.git

The nickname origin could have been any other name.

Using origin is just a common practice.

### Checking Remotes
>Syntax: 
git remote -v

>Example Output:
https://github.com/include-KC/HelloStay.git(fetch)
https://github.com/include-KC/HelloStay.git(push)

Notice Fetch and Push can actually point to different URLs. Usually they are same.

1. __Fetch URL__: Git downloads from from fetch URL.
2. __Push URL__:   Git uploads to push URL, usually:
origin

fetch

↓

GitHub

push

↓

GitHub

### .git
It is a hidden file created when we use <git init>.

### Industry Practice
Initialize Git before major development begins.

### HelloStay Usage
The HelloStay project is managed using Git.

---

## Commit (Git)
>Definition
A commit is a snapshot of the repository at a specific point in time.
Each commit contains all the changes made since the previous snapshot.

>Purpose
Creates a recoverable checkpoint in project history.

>Command
git commit -m "message"

>Good Command
git commit -m "Create backend folder structure"

>Bad Command
git commit -m "Updated stuff"


>Example
git commit -m "Create backend foundation"

### Multi-line Commit
__METHOD-1: Using Chained -m__:
>Example:
git commit \ 
-m "Title line"
-m "multi-line comment"

__METHOD-2: Using Vim environment__:
1. Run: git commit
This will either open a vim environment in the terminal or opens a new file in the explorer.

2. _In Vim_: Press i to enter insert mode(to confirm, __INSERT__ will be visible at the bottom)
- Type your comment.
- The first line of the comment will be Title.
- If you want to have multi-line comment,
After writing the Title, add other details after leaving one line.

3. Press ESC to exit the insert mode.

4. Press __:__, then type __wq__ and press enter.

### Industry Practice
One commit should represent one meaningful change.

### Common Mistakes
- Large unrelated commits
- Vague commit messages

---

## GitHub Commit Verification

### Verified Badge
- GitHub shows a **Verified** badge when it can cryptographically confirm the commit author.
- This requires commits signed with a GPG or SSH key uploaded to your GitHub account.

### Why Some Commits Are Not Verified
- Commit not signed.
- Commit email doesn’t match GitHub account email.
- Public key not uploaded to GitHub.
- Different machine setup or Git config.
- Wrong signing key used.

### Your GPG Key
- Key ID: `B5690EEEBB952194`
- Commits signed with this key and matching your GitHub account show the **Verified** badge.

### Configure Automatic Signing
1. __Enable signing globally__
git config --global commit.gpgsign true

2. __Set your signing key__
git config --global user.signingkey B5690EEEBB952194

3. __Ensure your email matches GitHub__
git config --global user.email "your-email@example.com"

4. __git status__
>Definition
Displays the current state of the Git repository.

### Purpose
>Shows:

- Modified files
- Untracked files
- Staged files

### Command
git status

### Industry Practice
Usually the first Git command developers run before committing.

### HelloStay Usage
Used to verify project changes before commits.

## Signing Methods
Automatic signing (recommended): With commit.gpgsign=true, all commits are signed automatically.

>Manual signing (per commit): Use the -S flag when committing:
```bash
git commit -S -m "My signed commit"
🔍 Verify Setup
Check config:
```

```bash
git config --global --list
```
Look for:
```bash
commit.gpgsign=true
user.signingkey=B5690EEEBB952194
user.email=your-email@example.com
```
Verify latest commit locally:
```bash
git log --show-signature -1
```
→ Should display your GPG key ID and “Good signature.”

Push and check on GitHub:
→ Commit should show Verified badge.

---

## .gitignore
>Definition
A file that tells Git which files and folders should not be tracked.
- It is nothing but a text file which includes all the files and folders that needs to be ignored.

>Purpose
Prevents generated, temporary, and sensitive files from entering version control.

>Example
```gitignore
venv/
node_modules/
*.db
*.log
.env
```

### Important
.gitignore does not delete files.
It only prevents Git from tracking them.

### Common Mistakes
- Forgetting to ignore venv
- Forgetting to ignore database files
- Committing secrets inside .env
- Not adding .gitignore, because it creates thousands of unnecessary files to enter git

### .gitignore Content description
> *.pyc: 
Python automatically generates compiled files:
__pycache__/
example.cpython-313.pyc

These should never be committed.

> .vscode/:
VS Code stores local editor settings here.

__Example__:
.vscode/
├── settings.json
├── launch.json

These settings are usually specific to one developer.

> .idea/:
If someone later opens HelloStay in PyCharm, JetBrains creates:
.idea/

which should also be ignored.

---

## .gitignore Best Practices

### Ignore Dependencies
>Examples:
- node_modules/
- venv/

### Ignore Generated Files
>Examples:
- __pycache__/
- *.pyc
- dist/
- build/

### Ignore Local IDE Settings
>Examples:
- .vscode/
- .idea/

### Industry Practice
Only commit source code and project files

---

## Git Author Configuration
>Purpose
Git stores author information with every commit.

### Configure Name
git config --global user.name "Your Name"

### Configure Email
git config --global user.email "your-email@example.com"

### Verify Configuration
git config --global user.name
git config --global user.email

### View All Configuration
git config --global --list

### Then Commit
- First check status:
git status

- Then stage files:
git add .

- Then create the commit:
git commit -m "Complete SystemInfo CRUD module"

### Industry Practice
Use the same email that is associated with your GitHub account so commits can be linked to your profile.

--- 

## git log
>Purpose
Helps in viewing the commit history.

>Command
git log

---

## git clone
>Purpose:
Downloads a remote repository to the local machine.

>Command
git clone <repository-url>

## git revert
>Purpose
Reverts the uncommited changes in the project.

>Command
git revert <commit>

---

# GitHub
>Definition;
GitHub is a website. It stores Git repositories online.

Here are the notes in a directly copy-pastable Markdown format.

## Tags and Semantic Versioning
>What is a Tag?
A tag is a permanent reference to a specific commit.

Unlike branches, tags do **not** move.

A tag is generally used to mark an important milestone or release of a project.

>Example:
Initial Commit
      │
      ▼
Room Module
      │
      ▼
Guest Module
      │
      ▼
Stay Module
      │
      ▼
Version 1.0.0  ← Tag

Once a tag is created, it always points to the same commit unless it is manually deleted and recreated.

---

>Why do Tags Exist?
Suppose your project has 250 commits.

Some important milestones might be:
Commit 25   → Room Module Completed
Commit 80   → Guest Module Completed
Commit 150  → Stay Module Completed
Commit 240  → Payment Module Completed

Finding these commits manually is difficult.

Instead, create tags:
v0.1.0
v0.5.0
v1.0.0
v2.0.0
Now any version can be accessed immediately.

---

### Branch vs Tag
A branch moves whenever a new commit is created.

Commit A ← Commit B ← Commit C

                     ↑
                   main

After another commit:
Commit A ← Commit B ← Commit C ← Commit D

                                 ↑
                               main
The branch pointer moved.

A tag never moves.
Commit A ← Commit B ← Commit C ← Commit D

                     ↑
                  v1.0.0

The tag continues pointing to Commit C forever.

---

### When Should Tags Be Created?
Tags should be created whenever the project reaches a stable milestone.

>Examples:
* First working backend
* Authentication completed
* Version released to users
* Major feature completed
* Stable production release

Avoid creating tags for unfinished work.

---

### Types of Tags
Git supports two types of tags.

#### Lightweight Tag
A lightweight tag is simply a name pointing to a commit.

>Example:
git tag v1.0.0

>Characteristics:
* Very small
* No author information
* No date
* No description

Suitable for temporary references.

---

#### Annotated Tag
Annotated tags store additional metadata.

>Example:
git tag -a v1.0.0 -m "Initial Stable Release"

>Metadata stored:
* Tag name
* Tag message
* Creator
* Creation date

Annotated tags are recommended for software releases.

---

### Listing Tags
To display all tags:

git tag

>Example:
v1.0.0
v1.1.0
v2.0.0

---

### Viewing Tag Information
To inspect an annotated tag:

git show v1.0.0

>Git displays:
* Tag message
* Commit
* Author
* Files changed

---

### Pushing Tags to GitHub
Creating a tag locally does **not** upload it to GitHub.

_Push an individual tag_:
git push origin v1.0.0

_Push all tags_:
git push origin --tags


---

### Deleting a Tag
_Delete locally_:
git tag -d v1.0.0

_Delete from GitHub_:
git push origin --delete v1.0.0

---

## Semantic Versioning
Most professional software follows Semantic Versioning.

>Format:
MAJOR.MINOR.PATCH

>Example:
2.4.7

.Where:
* Major = 2
* Minor = 4
* Patch = 7

---

### Major Version
Increase the Major version when making breaking changes.

.Example:
v1.0.0
↓
v2.0.0

__Breaking changes include__:
* API changes
* Database redesign
* Removing existing functionality
* Changes requiring users to modify their code

---

### Minor Version
Increase the Minor version when adding new features without breaking existing functionality.

>Example:
v1.2.0
↓
v1.3.0

.Examples:
* New reports
* Payment module
* Dashboard improvements

Existing features continue working.

---

### Patch Version
Increase the Patch version for bug fixes.

.Example:
v1.3.1
↓
v1.3.2

>Examples:
* Fix calculation bug
* Fix API validation
* Improve performance
* Correct UI issues

No new features are added.

---

## Versioning Example
Suppose HelloStay starts from scratch.

v0.1.0
Basic Project Structure
↓

v0.2.0
Room Module
↓

v0.3.0
Guest Module
↓

v0.4.0
Stay Module
↓

v1.0.0
Stable Backend Release
↓

v1.1.0
Multiple Guests Feature
↓

v1.2.0
Payment Module
↓

v1.2.1
Payment Bug Fix
↓

v2.0.0
Database Architecture Redesigned

---

## Why Start With Version 0?
Version 0 indicates the software is under development.

>General convention:
0.x.x
Development Stage

1.0.0
First Stable Release

After Version 1.0.0, users expect backward compatibility.

---

## Recommended Versioning for HelloStay
Suggested roadmap:

v0.1.0
Project Initialization

v0.2.0
Room Module

v0.3.0
Guest Module

v0.4.0
Stay Module

v0.5.0
Multiple Guests

v0.6.0
Payment Module

v0.7.0
Invoice Module

v0.8.0
Authentication

v0.9.0
Production Ready

v1.0.0
Official Stable Release

---

## GitHub Releases
A Git tag marks a version in Git history.

A GitHub Release is a published version built on top of a Git tag.

__A Release usually contains__:
* Version number
* Release notes
* Installation instructions
* Downloadable assets

>Example:
Release

Version:
v1.0.0

>Highlights:
• Room Module
• Guest Module
• Stay Module
• REST APIs
• Alembic Migrations

---

## Best Practices
* Always create annotated tags for official releases.
* Use Semantic Versioning consistently.
* Push tags immediately after creating them.
* Never rename published tags.
* Keep release notes meaningful.
* Tag only stable commits.
* Maintain one tag for each public release.

---

## Common Mistakes
Incorrect:
Version
Final
Latest
Release
Done

Correct:
v1.0.0
v1.1.0
v1.2.0
v2.0.0

---

## Interview Questions

### What is a Git Tag?
A Git Tag is a permanent reference to a specific commit, typically used to mark software releases or important milestones.

---

### Difference Between a Branch and a Tag
A branch is a movable pointer that advances with new commits.

A tag is a fixed pointer that permanently references one commit.

---

### Difference Between Lightweight and Annotated Tags
Lightweight tags only store a commit reference.

Annotated tags store additional metadata such as author, date, and description, making them suitable for production releases.

---

### What is Semantic Versioning?
Semantic Versioning is a standard version numbering system using the format:

MAJOR.MINOR.PATCH

>where:
* MAJOR represents breaking changes.
* MINOR represents backward-compatible feature additions.
* PATCH represents backward-compatible bug fixes.

---

### Why Should Releases Be Tagged?
Tags allow developers to:
* Identify stable versions quickly.
* Roll back to previous releases.
* Maintain release history.
* Create GitHub Releases.
* Distribute software consistently.

## Daily Git Workflow
A professional developer follows a consistent Git workflow regardless of the project size.

Following a standard workflow ensures:
* Clean commit history
* Easy debugging
* Better collaboration
* Fewer merge conflicts
* Easier code reviews

---

## Standard Development Cycle
The complete Git workflow can be visualized as:

Start Working
      │
      ▼
git pull
      │
      ▼
Create Feature Branch
      │
      ▼
Write Code
      │
      ▼
git status
      │
      ▼
git add
      │
      ▼
git commit
      │
      ▼
git push
      │
      ▼
Merge into main

This is the workflow you should follow throughout the HelloStay project.

---

## Step 1 - Update Your Repository
Before writing any code, always synchronize with the remote repository.

```bash
git pull
```

>Why?
Suppose another developer has added new commits.

_Your local repository_:
Commit A
↓
Commit B

_GitHub_:
Commit A
↓
Commit B
↓
Commit C

If you start working without pulling, your repository becomes outdated.

__Always start with__:
```bash
git pull
```
---

## Step 2 - Verify Repository Status
Always check the repository before making changes.

```bash
git status
```

Desired output:
On branch main

nothing to commit, working tree clean

__This confirms__:
* No uncommitted changes
* Repository is clean
* Safe to begin work

---

## Step 3 - Create a Feature Branch
Never develop new features directly on the main branch.

Create a new branch.

>Example:
```bash
git switch -c feature/multiple-guests
```

Professional naming convention:
feature/login
feature/payment
feature/dashboard
feature/multiple-guests

---

## Step 4 - Develop the Feature
Now write your code.

>Examples:
* Create new models
* Modify APIs
* Update schemas
* Add migrations
* Write tests

No Git commands are needed during development.

---

## Step 5 - Check What Changed
Before staging files:

```bash
git status
```

>Example:
Modified:
stay.py
stay_schema.py
stay_api.py

This lets you verify exactly what will be committed.

---

## Step 6 - Stage the Changes
Stage the required files.

>Stage everything:
```bash
git add .
```

>Stage a specific file:
```bash
git add app/models/stay.py
```

>After staging:
```bash
git status
```

_Git will display_:
Changes to be committed

---

## Step 7 - Create a Commit
Commit only when the current task is complete.

```bash
git commit -m "Implement multiple guest relationship"
```

A commit should represent one logical unit of work.

__Good__:
Implement Stay CRUD
Fix guest validation
Add payment model
Create invoice schema

__Avoid__:
Update
Changes
Done
Final

---

## Step 8 - Push Your Branch
Upload the commits.
```bash
git push
```

If the branch does not exist remotely:
```bash
git push -u origin feature/multiple-guests
```

After the first push, future pushes require only:
```bash
git push
```

---

## Step 9 - Merge the Feature
After testing:


feature/multiple-guests

↓

Merged

↓

main
```

Only merge when:

* Feature is complete
* Tests pass
* No known bugs exist

---

## Step 10 - Delete the Feature Branch
__After merging__:

```bash
git branch -d feature/multiple-guests
```

This keeps the repository clean.

---

## Daily Workflow Example
Imagine implementing the Payment Module.
__Morning__:

```bash
git pull
```

__Create branch__:

```bash
git switch -c feature/payment
```

Develop the module.
__Check changes__:

```bash
git status
```
__Stage__:

```bash
git add .
```
__Commit__:

```bash
git commit -m "Implement payment module"
```

__Upload__:

```bash
git push
```

Feature complete.

Merge into:
main

Delete the feature branch.

---

## When Should You Commit?
Commit whenever you finish one logical task.

__Good examples__:
* Guest CRUD completed
* Room validation completed
* Authentication completed
* Invoice generation completed

__Avoid committing__:
* Half-written functions
* Broken code
* Unfinished features

---

## How Large Should a Commit Be?
Each commit should answer one question:

> What single problem does this commit solve?
__Good__:
Add Stay CRUD APIs

__Bad__:
Room changes
Guest changes
Payment module
Invoice module
Authentication
UI updates

One commit should not contain unrelated work.

---

## Commit Frequently
Do not wait until the end of the week.

__Instead of__:
One commit
500 files

__Prefer__:
Commit 1
Room API

Commit 2
Guest API

Commit 3
Stay API

Commit 4
Validation

Small commits are easier to understand and revert.

---

## Always Keep main Stable
Your main branch should always be deployable.

If someone clones your repository:
```bash
git clone
```

They should immediately get a working project.

Never intentionally leave:
* Compilation errors
* Runtime errors
* Broken APIs

on the main branch.

---

## Repository Hygiene
__Good repository__:
main
Stable
feature/payment
Development
feature/invoice
Development

__Bad repository__:
main
Broken
Testing
Temporary
Maybe Working

---

## Typical Daily Commands
Start work:
```bash
git pull

git status
```

Create feature:
```bash
git switch -c feature/feature-name
```

Stage:
```bash
git add .
```

Commit:
```bash
git commit -m "Meaningful commit message"
```

Upload:
```bash
git push
```

---

## HelloStay Workflow
For HelloStay, every major feature should have its own branch.

>Examples:
feature/multiple-guests
feature/payment
feature/invoice
feature/authentication
feature/reporting
feature/dashboard

Each branch should contain exactly one feature.

---

## Best Practices
* Start every day with `git pull`.
* Check `git status` before every commit.
* Commit only complete logical tasks.
* Keep commits small and meaningful.
* Push regularly.
* Keep the main branch stable.
* Delete merged feature branches.
* Never mix multiple unrelated features in one commit.

---

## Common Mistakes
__Incorrect__:
Write code
Commit
Write more code
Commit
Fix previous commit
Commit
Break application
Commit

__Correct__:
Finish feature
Test feature
Commit
Push

---

## Interview Questions

### Why should developers commit frequently?
Frequent commits produce a clean history, simplify debugging, reduce merge conflicts, and make it easier to revert individual changes.

---

### Why should commits be small?
Small commits represent one logical change, making reviews, debugging, and rollbacks significantly easier.

---

### Why should development occur on feature branches instead of the main branch?
Feature branches isolate incomplete work, allowing the main branch to remain stable and deployable.

---

### What should be checked before every commit?
__Always verify__:
* `git status`
* Correct files are staged
* The project builds successfully
* Tests pass
* The commit message accurately describes the change

---

### What is considered a good commit message?
A concise message that explains the purpose of the change.

>xamples:
Implement Stay CRUD APIs
Fix room availability validation
Add invoice generation

## Merge, Merge Conflicts and Rebase

### What is a Merge?
A merge combines the changes from one branch into another.

Suppose your repository looks like this:

main
A
↓
B

You create a new branch:
main

A
↓
B

└──── feature/payment

Now you develop the feature.
main

A
↓
B

feature/payment

A
↓
B
↓
C
↓
D

Once the feature is complete, merge it into `main`.

main

A
↓
B
↓
C
↓
D

The changes from the feature branch are now part of the main branch.

---

## Why Merge?
Branches allow isolated development.
Merging integrates completed work back into the main development line.

__Without merging__:
* The feature branch remains isolated.
* Other developers cannot use the new feature.
* The project never progresses.

---

## Basic Merge
Switch to the target branch.

```bash
git switch main
```

Merge the feature.
```bash
git merge feature/payment
```

Git attempts to combine both histories automatically.

---

## Fast-Forward Merge
Consider the following history.

A
↓
B

Create a feature branch.

feature

A
↓
B
↓
C
↓
D

The main branch never changed.

main

A
↓
B

Now merge.

Git simply moves the main branch pointer.
main

A
↓
B
↓
C
↓
D

No additional merge commit is required.

This is called a **Fast-Forward Merge**.

---

## Three-Way Merge
Suppose both branches changed.

Main:
A
↓
B
↓
E

Feature:
A
↓
B
↓
C
↓
D

Now Git cannot simply move the pointer.

It creates a merge commit.
        C

        ↓

        D

       /

A

↓

B

       \

        E

         \

          M

`M` is called the **Merge Commit**.

---

## Why Does Git Create a Merge Commit?
Because two independent histories now exist.

Git must preserve both.

__The merge commit records__:
* where the histories diverged
* how they were combined

---

## Conflict Example
Main
status = "Available"

Feature
status = "Occupied"

Git produces:
<<<<<<< HEAD

status = "Available"

=======

status = "Occupied"

>>>>>>> feature/payment

You must manually decide the correct code.

---

## Resolving Merge Conflicts
Suppose the correct value is:
```python
status = "Occupied"
```

Delete the conflict markers.

Final code:
```python
status = "Occupied"
```

Stage the file.

```bash
git add filename.py
```

Complete the merge.

```bash
git commit
```

The merge is now resolved.

---

## Avoiding Merge Conflicts
Merge conflicts cannot always be prevented.

However, they can be minimized by:
* Pulling frequently.
* Keeping feature branches short-lived.
* Making small commits.
* Communicating with teammates.
* Avoiding long-running branches.

---

## What is Rebase?
Rebase is another way to integrate changes.

Instead of combining histories, Git rewrites history.

>Example:
Main:
A
↓
B
↓
E

Feature:
A
↓
B
↓
C
↓
D

Running:
```bash
git rebase main
```

produces:
A
↓
B
↓
E
↓
C'
↓
D'

Notice:
`C` and `D` were recreated.

Git copies the commits onto the latest main branch.

---

## Merge vs Rebase
Merge:
        C

        ↓

        D

       /

A

↓

B

       \

        E

         \

          M

History branches.

---

Rebase:
A
↓
B
↓
E
↓
C'
↓
D'

History remains linear.

---

## Advantages of Merge
* Complete history is preserved.
* Safer.
* Easier for beginners.
* Recommended for shared branches.

---

## Advantages of Rebase
* Cleaner history.
* No unnecessary merge commits.
* Easier to read commit logs.
* Preferred before opening Pull Requests.

---

## Disadvantages of Rebase
Rebase rewrites commit history.

_Therefore_:
Never rebase commits that have already been shared publicly.

_Rule_:
Private Branch
↓
Rebase
✔ Safe

Shared Branch
↓
Rebase
✘ Dangerous

---

## Interactive Rebase
Git also supports:

```bash
git rebase -i HEAD~3
```

Interactive rebase allows:
* Rename commit messages.
* Combine commits.
* Delete commits.
* Reorder commits.

This is commonly used before publishing a branch.

---

## Squashing Commits
Suppose your history looks like:

Fix typo
↓
Another typo
↓
Another typo
↓
Real implementation

Interactive rebase allows combining them into:
Implement Payment Module

The history becomes much cleaner.

---

## Abort a Merge
Suppose a merge becomes complicated.

Cancel it.

```bash
git merge --abort
```

Git restores the repository to its previous state.

---

## Abort a Rebase
Cancel an ongoing rebase.

```bash
git rebase --abort
```

The repository returns to its original history.

---

## Continue a Rebase
After resolving conflicts:

```bash
git rebase --continue
```

Git proceeds with the remaining commits.

---

## Skip a Commit During Rebase
Sometimes a commit is no longer needed.

```bash
git rebase --skip
```

Git ignores that commit.

---

## HelloStay Example
Suppose you are developing:
feature/multiple-guests

Meanwhile another developer adds:
Authentication

to main.

Before merging your feature:
```bash
git switch feature/multiple-guests

git rebase main
```

Your feature now sits on top of the latest authentication changes.

After testing:
Merge into main.

---

## Professional Workflow
Typical workflow.
main
↓
Create Feature Branch
↓
Develop
↓
Commit
↓
Pull Latest Main
↓
Rebase
↓
Resolve Conflicts
↓
Push
↓
Pull Request
↓
Merge

---

## Best Practices
* Keep feature branches small.
* Merge frequently.
* Pull regularly.
* Resolve conflicts immediately.
* Use merge for shared branches.
* Use rebase for cleaning private branches.
* Never rebase published history.

---

## Common Mistakes
Incorrect:

Feature branch lives for six months.

Result:
Huge merge conflicts.

---

Incorrect:

Rebase after pushing to teammates.

Result:
Broken shared history.

---

Incorrect:
Ignore merge conflicts.

Result:
Broken application.

---

Correct:
Small feature
↓
Short branch
↓
Frequent pull
↓
Clean merge

---

## Interview Questions

### What is a merge?
A merge combines the histories of two branches into one.

---

### What is a merge conflict?
A merge conflict occurs when Git cannot automatically determine which changes should be kept.

---

### Difference between Merge and Rebase
Merge preserves branch history by creating a merge commit.

Rebase rewrites commit history by replaying commits onto another branch.

---

### Why is rebase considered dangerous?
Because it rewrites commit history.

Rewriting commits that have already been shared can create inconsistencies for other developers.

---

### When should merge be preferred?
Merge should be preferred when integrating shared branches because it preserves history and avoids rewriting commits.

---

### When should rebase be preferred?
Rebase is useful for cleaning up a private feature branch before merging it into the main branch.

## Undoing Changes
Mistakes are a normal part of software development.

Git provides multiple commands to safely undo changes depending on **what stage the change is in**.

Choosing the correct command is important because some commands preserve history while others rewrite it.

---

## The Three States of a File
Every file in Git exists in one of three states.

Working Directory
        │
        ▼
Staging Area
        │
        ▼
Repository (Commit History)

Understanding these three areas makes undo commands much easier to understand.

---

## Working Directory
The Working Directory contains the files you are currently editing.

>Example:
```python
room_price = 1000
```

You change it to:

```python
room_price = 1200
```

The file has changed only in your working directory.

Nothing has been staged or committed yet.

---

## Staging Area
After running:

```bash
git add room.py
```

The modified version moves into the staging area.

Git is now preparing it for the next commit.

---

## Repository
After:

```bash
git commit
```

The staged snapshot becomes part of Git's permanent history.

---

# Undoing Unstaged Changes
Suppose you modified:

```python
status = "Occupied"
```

but decide you don't want the modification.

Check status:

```bash
git status
```

Output:
Modified:
room.py

Restore the file.

```bash
git restore room.py
```

Git replaces the file with the last committed version.

The modification disappears.

---

## Restore Multiple Files
```bash
git restore .
```

This restores every modified file in the current directory.

Use carefully.

---

## Undoing Staged Changes
Suppose you executed:

```bash
git add room.py
```

Now the file is staged.

You decide not to include it in the next commit.

Run:

```bash
git restore --staged room.py
```

The file leaves the staging area.

The modification still exists in your working directory.

Nothing is lost.

---

## Difference
Working Directory
↓
```bash
git restore
```

Restores file contents.

---

Staging Area
↓
```bash
git restore --staged
```

Removes files from staging.

---

## Undoing the Last Commit
Suppose:
A
↓
B
↓
C

Commit C is incorrect.
There are several ways to handle this.

---

## git reset
`git reset` moves the branch pointer backward.

Different reset modes behave differently.

---

### Soft Reset
```bash
git reset --soft HEAD~1
```

Result:
A
↓
B

Commit C disappears.

However,
all changes remain staged.

Nothing is lost.

---

### Mixed Reset
(Default)

```bash
git reset HEAD~1
```

Result:
Commit removed.

Changes remain in the working directory.

Nothing is staged.

---

### Hard Reset
```bash
git reset --hard HEAD~1
```

Result:
Commit removed.

Working directory restored.

Changes permanently disappear.

Use with extreme caution.

---

## Visual Example
Before:
A
↓
B
↓
C

Soft Reset
A
↓
B
(Staged Changes)

---

Mixed Reset
A
↓
B
(Unstaged Changes)

---

Hard Reset
A
↓
B

Everything from C is deleted.

---

## HEAD
Git uses `HEAD` to represent your current commit.

Example:
A
↓
B
↓
C ← HEAD

`HEAD~1`
means
One commit before HEAD

which is:
A
↓
B ← HEAD~1

---

## git revert
Unlike reset,

`git revert`
does **not** remove commits.

Instead,
Git creates a new commit that reverses the changes.

>Example:
History:
A
↓
B
↓
C

Run:
```bash
git revert HEAD
```

History becomes:
A
↓
B
↓
C
↓
D

Commit D undoes everything introduced in C.

Nothing is deleted.

History remains intact.

---

## Reset vs Revert
Reset
A
↓
B

Commit C disappears.
History is rewritten.

---

Revert
A
↓
B
↓
C
↓
D

History remains unchanged.
A new reversing commit is added.

---

## When to Use Reset
Use reset when:
* The commit has not been shared.
* The branch is private.
* You want to rewrite history.

---

## When to Use Revert
Use revert when:
* The commit has already been pushed.
* Other developers may already have it.
* History should remain unchanged.

This is the professional choice for public branches.

---

## Amending the Last Commit
Suppose you forgot one file.

Current history:
A
↓
B

Forgot to include:
invoice.py
Stage it.

```bash
git add invoice.py
```

Instead of creating another commit:

```bash
git commit --amend
```

Git updates Commit B.

No extra commit is created.

---

## Changing Commit Message
```bash
git commit --amend -m "Implement Invoice Module"
```

The previous commit message is replaced.

---

## Steps of changing Commit message
- These steps changes the message of the recent commit made by you.

1. Use:

```bash 
git commit --amend -m "New mesage"
```

2.  After that you need to forcefully push the change to the github:

```bash
git push origin main -f
```

This will change message of the **recent commit**.

---

## reflog
Even after reset,

Git often remembers previous commits.

Display reference log.

```bash
git reflog
```

>Example:
HEAD@{0}
Reset
HEAD@{1}
Commit
HEAD@{2}
Checkout

Suppose you accidentally removed a commit.

Recover it.
```bash
git reset --hard HEAD@{1}
```

This makes `reflog` one of Git's most powerful recovery tools.

---

## Recovering Deleted Commits
>Example:

Original:
A
↓
B
↓
C

Accidental reset:
A
↓
B

Use:
```bash
git reflog
```

Find C.

Then:
```bash
git reset --hard <commit-id>
```

Commit C returns.

---

## Undo Workflow
Situation
↓
Command

---

Modified file
↓
```bash
git restore
```

---

Staged file
↓
```bash
git restore --staged
```

---

Wrong last commit (private)
↓
```bash
git reset
```

---

Wrong public commit
↓
```bash
git revert
```

---

Forgot a file
↓
```bash
git commit --amend
```

---

Deleted commit accidentally
↓
```bash
git reflog
```

---

## HelloStay Example
Suppose:
You accidentally commit:
Database Password

but haven't pushed.

Use:
```bash
git reset --soft HEAD~1
```

Remove the password.
Commit again.

---

Suppose the password was already pushed.

Never use reset.

Instead:
* Remove the password.
* Commit the correction.
* Rotate the password immediately.

History should not be rewritten on a shared repository.

---

## Best Practices
* Use `restore` for local modifications.
* Use `restore --staged` for staged files.
* Prefer `revert` on public branches.
* Use `reset` only on private branches.
* Use `commit --amend` only before pushing.
* Learn `reflog`; it can recover seemingly lost work.
* Never use `--hard` unless you are absolutely certain.

---

## Common Mistakes
Incorrect:
```bash
git reset --hard
```

without understanding its effect.

Result:
Permanent loss of uncommitted work.

---

Incorrect:
```bash
git reset
```
after pushing.

Result:
History divergence for teammates.

---

Incorrect:
```bash
git commit
```
for a forgotten file.

Result:
Unnecessary extra commits.

Instead:
```bash
git commit --amend
```

---

## Interview Questions

### What is the difference between `git restore` and `git restore --staged`?
`git restore` restores changes in the working directory.

`git restore --staged` removes files from the staging area while keeping working directory changes.

---

### Difference between `git reset` and `git revert`
`git reset` rewrites history by moving the branch pointer.

`git revert` preserves history by creating a new commit that reverses previous changes.

---

### When should `git revert` be preferred?
When the commit has already been shared or pushed to a remote repository.

---

### What does `git commit --amend` do?
It modifies the most recent commit by updating its contents or commit message instead of creating a new commit.

---

### What is `git reflog`?
`git reflog` records movements of `HEAD` and allows recovery of commits that may no longer appear in normal Git history.

---

### Which reset mode is the safest?
`--soft` is the safest because it removes the commit while preserving all changes in the staging area.

## Git Stash
During development, it is common to pause one task and switch to another.

>Examples:
* A critical production bug appears.
* A teammate requests urgent help.
* You need to switch branches immediately.
* You want to pull the latest changes before continuing.

However, your current work is incomplete and should not be committed yet.

Git provides **Stash** for this purpose.

---

## What is Git Stash?
A stash is a temporary storage area for uncommitted changes.

It allows you to:
* Save unfinished work.
* Restore a clean working directory.
* Switch branches safely.
* Continue later from exactly where you stopped.

Think of Git Stash as a temporary clipboard for your work.

---

## Visual Representation
Before stashing:

 id="cghxjv"
Working Directory
↓
Modified Files
↓
Not Committed

After:
```bash id="g8n7r5"
git stash
```

Result:
 id="3jnpqb"
Working Directory
↓
Clean

The unfinished work is safely stored inside Git.

---

## Why Not Just Commit?
Suppose you are halfway through implementing the Payment Module.

The project does not compile.

Creating a commit now would produce:

 id="8db2m6"
Implement half of payment module

This is poor practice because:
* The commit is incomplete.
* The application may be broken.
* The history becomes messy.

Instead:

```bash id="dkd28h"
git stash
```

---

## Creating a Stash
Save all tracked changes:

```bash id="7q4qk2"
git stash
```

Git stores:
* Modified files
* Staged files

Your working directory becomes clean.

---

## Stash with Message
Always provide a descriptive message.

```bash id="jlwm9d"
git stash push -m "Payment module in progress"
```

This makes identifying stashes much easier later.

---

## Listing Stashes
Display all saved stashes.

```bash id="1pbyc7"
git stash list
```

>Example:
 id="e9l3rb"
stash@{0}
Payment module
stash@{1}
Invoice API
stash@{2}
Room validation

The newest stash always has index:
 id="pvb7wr"
stash@{0}

---

## Viewing a Stash
Inspect a stash.
```bash id="9tfb8v"
git stash show
```

To view detailed changes:
```bash id="7zwd9h"
git stash show -p
```

Git displays the stored modifications.

---

## Applying a Stash
Restore the latest stash.

```bash id="1o6m5e"
git stash apply
```

Your files return exactly as they were.

The stash remains stored.

---

## Applying a Specific Stash
Suppose:
 id="5w90db"
stash@{0}

Payment
stash@{1}
Invoice
stash@{2}
Reports

Restore only:
```bash id="me6rvk"
git stash apply stash@{1}
```

Only the Invoice stash is restored.

---

## Pop a Stash
Instead of applying and keeping it,

use:
```bash id="s8u7h7"
git stash pop
```

Git:
* Restores the stash.
* Deletes it automatically.

---

## Apply vs Pop
Apply
 id="5m9jlwm"
Restore
↓
Keep Stash

Pop
 id="9ghih6"
Restore
↓
Delete Stash

---

## Deleting a Stash
Delete one stash.

```bash id="q1pmzi"
git stash drop stash@{0}
```

---

Delete every stash.
```bash id="svkwn0"
git stash clear
```

Be careful.
This permanently removes all stored stashes.

---

## Stashing Untracked Files
By default,
Git does not stash untracked files.

>Example:
 id="6u2xq2"
new_file.py

will remain.

To include untracked files:
```bash id="5hbm7z"
git stash -u
```

or

```bash id="dkcz3v"
git stash --include-untracked
```

---

## Stashing Ignored Files
To include ignored files:
```bash id="56gmwl"
git stash -a
```

or

```bash id="i9gszy"
git stash --all
```

This includes:
* Tracked files
* Untracked files
* Ignored files

---

## Partial Stashing
Sometimes you only want to stash selected changes.

Use:
```bash id="lrz4r8"
git stash -p
```

Git asks for each change:
 id="9v4k0r"
Stash this change?
y/n

This allows storing only the desired modifications.

---

## Creating a Branch from a Stash
Suppose you decide the stashed work deserves its own branch.

```bash id="slfnt5"
git stash branch feature/payment
```

Git will:
* Create the branch.
* Restore the stash.
* Delete the stash if successful.

Very useful when priorities change.

---

## Typical Workflow
Suppose:
You are implementing invoices.

Suddenly:
A production bug appears.

Current work:
 id="jlwmxf"
Invoice Module

50% Complete

Do not commit.

Instead:
```bash id="a58cfr"
git stash push -m "Invoice module"
```

Switch branch.

```bash id="3odjlwm"
git switch hotfix
```

Fix the bug.
Commit.
Push.
Return.

```bash id="7qv4ph"
git switch feature/invoice
```

Restore work.

```bash id="egqmg8"
git stash pop
```

Continue developing.

---

## HelloStay Example
Suppose:
You are implementing:

 id="pdz4gx"
Multiple Guest Support

Halfway through,
a critical bug is reported in Room Booking.

Instead of committing unfinished code:

```bash id="t2qjyz"
git stash push -m "Multiple guest feature"
```

Switch.

```bash id="7p7w25"
git switch hotfix/booking
```

Fix.
Commit.
Push.
Return.

```bash id="q70c4d"
git switch feature/multiple-guests
git stash pop
```
Continue where you stopped.

---

## Best Practices
* Always give meaningful stash messages.
* Use stash for temporary work only.
* Avoid accumulating many old stashes.
* Remove unnecessary stashes regularly.
* Prefer feature branches for long-term work.
* Use stash for interruptions, not permanent storage.

---

## Common Mistakes

Incorrect:
 id="tukwsm"
30 stashes

Unknown contents

Result:
Impossible to identify the correct stash.

---

Incorrect:
 id="xlkkl8"
Using stash instead of commits for long-term work.

Result:
Important work may be forgotten.

---

Incorrect:
```bash id="ygb10h"
git stash clear
```

without checking contents.

Result:
Permanent loss of every stash.

---

Correct:
 id="rjagmr"
One stash
↓
Short interruption
↓
Restore
↓
Continue

---

## Interview Questions

### What is Git Stash?
Git Stash temporarily stores uncommitted changes so that the working directory can be returned to a clean state without creating a commit.

---

### Difference between `git stash apply` and `git stash pop`
`apply` restores the stash but keeps it stored.

`pop` restores the stash and removes it from the stash list.

---

### What does `git stash list` display?
It displays every saved stash in reverse chronological order.

---

### Can Git Stash store untracked files?
Yes.

Use:
```bash id="eclgg6"
git stash -u
```

or

```bash id="2d3nmw"
git stash --include-untracked
```

---

### When should Git Stash be used?
Git Stash should be used when temporarily switching tasks while preserving unfinished work without creating an incomplete commit.

---

### Should Git Stash replace commits?
No.

Stash is intended for temporary interruptions.

Completed work should always be committed to the repository.

## GitHub Workflow
Git is a version control system.

GitHub is a cloud platform that hosts Git repositories and provides collaboration tools.

A professional GitHub workflow involves much more than simply pushing code.

It includes:
* Branches
* Pull Requests
* Code Reviews
* Issues
* Releases
* Discussions
* Project Boards

---

## Typical GitHub Workflow
A professional development cycle usually looks like this.

Issue Created
      │
      ▼
Create Feature Branch
      │
      ▼
Develop Feature
      │
      ▼
Commit Changes
      │
      ▼
Push Branch
      │
      ▼
Open Pull Request
      │
      ▼
Code Review
      │
      ▼
Merge
      │
      ▼
Delete Branch

---

## Git vs GitHub
| Git                    | GitHub                              |
| ---------------------- | ----------------------------------- |
| Version Control System | Cloud hosting platform              |
| Installed locally      | Accessed online                     |
| Tracks code history    | Stores repositories                 |
| Works offline          | Requires internet for collaboration |
| Handles commits        | Handles collaboration               |

---

## Repository
A repository is the complete project.

>Example:
HelloStay
│
├── backend
├── frontend
├── docs
├── database
└── .gitignore

Everything belongs to one repository.

---

## Clone
Clone downloads an existing repository.

```bash
git clone https://github.com/include-KC/HelloStay.git
```

Git creates:
HelloStay
↓
Complete Local Copy

Clone is generally performed only once.

---

## Pull
After cloning,
other developers may add commits.
Synchronize your local repository.

```bash
git pull
```

This downloads and merges the newest commits.

---

## Push
After committing locally,
upload changes.

```bash
git push
```

Local commits become available on GitHub.

---

## Fork
Fork creates your own copy of someone else's repository.

Original Repository
Open Source Project
↓
Fork
↓
Your GitHub Account

You now own the copied repository.

Forks are primarily used in open-source development.

---

## Clone vs Fork
Clone
GitHub
↓
Local Computer

Fork
Someone Else's Repository
↓
Your GitHub Repository
↓
Local Computer

---

## Pull Request
A Pull Request (PR) requests permission to merge code into another branch.

>Example:
main
↓
feature/payment

You finish development.

Instead of directly merging,

you create a Pull Request.

The project owner reviews your code.

---

## Pull Request Workflow
Feature Branch
↓
Push
↓
Pull Request
↓
Review
↓
Approve
↓
Merge

---

## What Does a Pull Request Contain?
A Pull Request usually includes:
* Title
* Description
* Changed files
* Commit history
* Comments
* Code review

>Example:
Title
Implement Payment Module
Description
• Added payment model
• Added APIs
• Added validation
• Added tests

---

## Why Pull Requests Matter
Pull Requests provide:
* Code review
* Team discussion
* Bug detection
* Documentation
* Approval before merging

Large companies rarely allow direct pushes to the main branch.

---

## Code Review
Before merging,
another developer reviews the code.

Possible outcomes:
Approved

or

Request Changes

Example comments:
* Improve naming
* Remove duplicate code
* Fix validation
* Add documentation

---

## Merge Pull Request
Once approved,
GitHub merges the branch.

History becomes:
main
↓
Payment Module

The feature is now part of the project.

---

## Delete Branch
After merging,

GitHub usually suggests:
Delete Branch

Delete it.
The work already exists in the main branch.

---

## Issues
Issues track work.

>Examples:
Bug
Feature Request
Enhancement
Documentation
Task

Example Issue:
Title
Support Multiple Guests

Description
Current implementation allows only one guest.
Implement GuestStay relationship.

---

## Issue Workflow
Issue
↓
Assign Developer
↓
Create Branch
↓
Implement
↓
Pull Request
↓
Close Issue

---

## Labels
Labels organize Issues.

>Examples:
bug
enhancement
documentation
good first issue
help wanted

---

## Milestones
Milestones group Issues.

>Example:
Version 1.0
↓
Guest Module
Room Module
Stay Module
Authentication

Once all Issues are complete,

the milestone is complete.

---

## Discussions
GitHub Discussions allow conversations that are not code-related.

>Examples:
* Architecture decisions
* Feature ideas
* Questions
* Community feedback

---

## Wiki
GitHub Wiki provides project documentation.

Useful for:
* API Documentation
* Installation Guide
* Architecture Notes

For HelloStay,
your own `docs/` folder already serves this purpose.

---

## Releases
A Release represents a published version.

Workflow:
Stable Commit
↓
Tag
↓
GitHub Release

Release page includes:
* Version
* Release notes
* Download links
* Changelog

---

## Watching
Watching a repository means receiving notifications.

Options:
All Activity
Participating
Ignore

---

## Starring
Star a repository to bookmark it.

Stars indicate popularity.

---

## Following
Following a developer allows you to receive updates about their public activity.

---

## Protected Branches
Professional repositories often protect the main branch.

Restrictions may include:
* No direct push
* Pull Request required
* Code review required
* Passing tests required

Example.
main

Protected
↓
Only Merge via Pull Request

---

## GitHub Actions
GitHub Actions automate workflows.

>Examples:
Push
↓
Run Tests
↓
Build Project
↓
Deploy

HelloStay can later use GitHub Actions to:
* Run backend tests
* Verify formatting
* Build frontend
* Deploy automatically

---

## Notifications
GitHub notifies you about:
* Pull Requests
* Reviews
* Issues
* Mentions
* Discussions

---

## HelloStay Workflow
Suggested workflow.

Issue
Implement Multiple Guest Support
↓
Branch
feature/multiple-guests
↓
Develop
↓
Commit
↓
Push
↓
Pull Request
↓
Review
↓
Merge
↓
Delete Branch

---

## Best Practices
* Keep Pull Requests small.
* Write meaningful descriptions.
* Reference Issues.
* Delete merged branches.
* Protect the main branch.
* Review code carefully.
* Use Issues for planning.
* Use Releases for stable versions.

---

## Common Mistakes
Incorrect:
Push directly to main.

---

Incorrect:
One Pull Request
↓
200 changed files

---

Incorrect:
Create branch
↓
Never delete it

---

Correct:
One Feature
↓
One Branch
↓
One Pull Request
↓
Merge
↓
Delete Branch

---

## Interview Questions

### What is GitHub?
GitHub is a cloud platform that hosts Git repositories and provides collaboration features such as Pull Requests, Issues, Reviews, and Releases.

---

### What is a Pull Request?
A Pull Request is a request to merge changes from one branch into another after review and approval.

---

### Why are Pull Requests important?
They enable code review, discussion, testing, and approval before changes are merged into the main branch.

---

### What is the difference between Fork and Clone?
A clone downloads a repository to a local machine.

A fork creates a personal copy of another user's repository on GitHub.

---

### What is an Issue?
An Issue is a task, bug report, enhancement request, or feature request used to organize project work.

---

### Why should feature branches be deleted after merging?
Once merged, the work is safely stored in the main branch.

Deleting merged branches keeps the repository clean and reduces clutter.

---

### What is a protected branch?
A protected branch prevents direct modification and typically requires Pull Requests, code reviews, and successful automated checks before changes can be merged.

## Professional Team Workflows
As projects grow from a single developer to multiple developers, a structured branching strategy becomes essential.

A team workflow defines:
* How branches are created
* Where development occurs
* When merges happen
* How releases are managed
* How production remains stable

Different organizations use different workflows depending on team size and project complexity.

---

## Why Team Workflows Matter
Imagine ten developers all pushing directly to the `main` branch.

 id="wrk001"
Developer A
        │
Developer B
        │
Developer C
        │
Developer D
        │
Developer E
        │
Developer F
        │
Developer G
        │
Developer H
        │
Developer I
        │
Developer J
        │
        ▼
       main

This quickly results in:
* Frequent merge conflicts
* Broken builds
* Difficult debugging
* Unstable production

A structured workflow solves these problems.

---

# GitHub Flow
GitHub Flow is the simplest professional workflow.

It is commonly used by:
* Small teams
* Web applications
* SaaS products
* Continuous deployment projects

---

## Branch Structure
 id="wrk002"
main
│
├── feature/login
├── feature/payment
├── feature/invoice

Only one permanent branch exists:
 id="wrk003"
main

Every feature gets its own temporary branch.

---

## GitHub Flow Process
 id="wrk004"
main
↓
Create Feature Branch
↓
Develop
↓
Commit
↓
Push
↓
Pull Request
↓
Review
↓
Merge
↓
Delete Branch

Very simple.

---

## Advantages
* Easy to learn
* Minimal branches
* Fast development
* Excellent for continuous deployment

---

## Disadvantages
* Less suitable for large release cycles
* Difficult to maintain multiple supported versions

---

# Git Flow
Git Flow is a more structured workflow.

It is commonly used by:
* Enterprise software
* Banking systems
* ERP systems
* Desktop software

---

## Branch Structure
 id="wrk005"
main
│
develop
│
├── feature/login
├── feature/payment
├── feature/reporting
│
release/v1.0
│
hotfix/payment

Permanent branches:
* main
* develop

Temporary branches:
* feature
* release
* hotfix

---

## Main Branch
 id="wrk006"
main

Contains only production-ready code.

Every commit should be deployable.

---

## Develop Branch
 id="wrk007"
develop

Contains completed features waiting for release.
Develop is the integration branch.

---

## Feature Branch
>Example:
 id="wrk008"
feature/payment

Created from:
 id="wrk009"
develop

Merged back into:
 id="wrk010"
develop

---

## Release Branch
Once enough features are complete:
 id="wrk011"
release/v1.0

Purpose:
* Final testing
* Documentation
* Bug fixes
* Version updates

No new features are added here.

---

## Hotfix Branch
Suppose production has a critical bug.

Create:
 id="wrk012"
hotfix/payment

Fix it immediately.

Merge into:
* main
* develop

This keeps both branches synchronized.

---

## Git Flow Diagram
 id="wrk013"
main
│
├─────────────── Release
│                     ▲
develop───────────────┘
│
├── feature/login
├── feature/payment
├── feature/reporting
│
└── hotfix

---

## Advantages
* Excellent organization
* Stable production
* Easy release management
* Ideal for large teams

---

## Disadvantages
* More complex
* Many branches
* More merges
* Slower development

---

# Trunk-Based Development
Large technology companies often use Trunk-Based Development.

Examples include:
* Google
* Facebook
* Microsoft

---

## Branch Structure
 id="wrk014"
main
│
├── Short Feature Branch
├── Short Feature Branch
├── Short Feature Branch

Feature branches exist only for a very short time.

Often:
Less than one day.

---

## Development Process
 id="wrk015"
Feature
↓
Commit
↓
Merge
↓
Delete Branch
↓
Repeat

Developers integrate changes continuously.

---

## Feature Flags
Incomplete features are hidden using Feature Flags.

Example:
```python id="wrk016"
if FEATURE_PAYMENT:

    show_payment()
```

The code exists,
but users cannot access it until the feature flag is enabled.

---

## Advantages
* Very small merge conflicts
* Continuous integration
* Rapid releases

---

## Disadvantages
* Requires excellent testing
* Requires automation
* Difficult for beginners

---

# Which Workflow Should You Choose?
| Workflow    | Best For                   |
| ----------- | -------------------------- |
| GitHub Flow | Small projects             |
| Git Flow    | Enterprise software        |
| Trunk-Based | Large technology companies |

---

# Workflow Comparison
| Feature            | GitHub Flow | Git Flow  | Trunk-Based |
| ------------------ | ----------- | --------- | ----------- |
| Permanent Branches | 1           | 2         | 1           |
| Complexity         | Low         | High      | Medium      |
| Releases           | Continuous  | Scheduled | Continuous  |
| Learning Curve     | Easy        | Moderate  | Advanced    |
| Team Size          | Small       | Large     | Very Large  |

---

# Which Workflow Should HelloStay Use?
HelloStay is:
* One developer
* Portfolio project
* Continuous development
* Frequent commits

GitHub Flow is the ideal choice.

Suggested structure:

 id="wrk017"
main
↓
feature/multiple-guests
↓
Merge
↓
Delete Branch
↓
feature/payment
↓
Merge
↓
Delete Branch

There is no need for:
* develop
* release
* hotfix

at this stage.

---

# Future Evolution
Suppose HelloStay eventually becomes a commercial product.

The workflow could evolve into Git Flow.

Example:
 id="wrk018"
main
develop
feature
release
hotfix

Until then,
GitHub Flow is simpler and more productive.

---

# Branch Naming Convention
Professional naming:

Features
 id="wrk019"

feature/payment
feature/invoice
feature/dashboard

Bug Fixes
id="wrk020"

bugfix/payment-validation
bugfix/login-error

Hotfixes
id="wrk021"

hotfix/critical-payment

Releases
id="wrk022"

release/v1.0
release/v2.0


Avoid names like:
 id="wrk023"
test
new
changes
branch1

---

# Merge Strategy
Professional teams generally prefer:
 id="wrk024"
Feature Branch
↓
Pull Request
↓
Review
↓
Merge
↓
Delete Branch

Avoid:
 id="wrk025"
Feature Branch
↓
Direct Push to main

---

# Continuous Integration
Modern teams automatically test every Pull Request.

Example:
 id="wrk026"
Pull Request
↓
Run Tests
↓
Build
↓
Lint
↓
Approve
↓
Merge

This prevents broken code from entering production.

---

# Best Practices
* Choose one workflow and follow it consistently.
* Keep feature branches short-lived.
* Delete merged branches.
* Use descriptive branch names.
* Never develop directly on the main branch.
* Review every Pull Request.
* Keep the main branch deployable.
* Automate testing whenever possible.

---

# Common Mistakes
Incorrect:
 id="wrk027"
One feature branch
↓
Used for six months

Result:
Massive merge conflicts.

---

Incorrect:
 id="wrk028"
Direct development on main

Result:
Unstable production.

---

Incorrect:
 id="wrk029"
Random branch names
↓
test
↓
new
↓
abc

Result:
Poor repository organization.

---

Correct:
 id="wrk030"
feature/payment
↓
Merge
↓
Delete
↓
feature/invoice
↓
Merge
↓
Delete

---

# Interview Questions

### What is GitHub Flow?
GitHub Flow is a lightweight branching strategy where every feature is developed in its own branch, reviewed through a Pull Request, merged into `main`, and the branch is then deleted.

---

### What is Git Flow?
Git Flow is a structured branching model using permanent `main` and `develop` branches along with temporary feature, release, and hotfix branches to support scheduled software releases.

---

### What is Trunk-Based Development?
Trunk-Based Development is a workflow where developers integrate small changes into the main branch frequently using short-lived feature branches and extensive automated testing.

---

### Which workflow is best for small projects?
GitHub Flow is generally the best choice because it is simple, easy to maintain, and supports rapid development.

---

### Which workflow is best for enterprise software?
Git Flow is commonly preferred because it provides structured release management and better organization for large teams.

---

### Which workflow should HelloStay follow?
HelloStay should follow **GitHub Flow**, as it is currently a single-developer project with continuous feature development and no requirement for complex release management.

## Git Best Practices and Common Mistakes
Writing clean Git history is as important as writing clean code.

Good Git practices make your project:
* Easier to understand
* Easier to debug
* Easier to scale
* Easier to collaborate on
* More professional

Bad Git practices create confusion, bugs, and technical debt in version history.

---

# Git Best Practices

## 1. Commit Frequently but Logically
Each commit should represent a single logical change.

Good:
 id="bp001"
Add Stay CRUD APIs

Fix room availability validation

Implement payment model

Bad:
 id="bp002"
Update everything
Fix bugs
Changes
Final code

---

## 2. Keep Commits Small
Small commits are:
* Easier to review
* Easier to debug
* Easier to revert
* Easier to understand

Example:
Instead of one large commit:

 id="bp003"
Add Guest, Room, Stay, Payment, Invoice modules

Prefer multiple commits:
 id="bp004"
Add Guest module
Add Room module
Add Stay module

---

## 3. Always Write Meaningful Commit Messages
A commit message should explain:
* What changed
* Why it changed (if necessary)

Good:
 id="bp005"
Fix room availability check for overlapping stays

Bad:
 id="bp006"
fix
update
done

---

## 4. Use Feature Branches
Never work directly on the main branch.

Correct workflow:
 id="bp007"
main
↓
feature/payment

Each feature gets its own branch.

---

## 5. Keep main Always Stable
The main branch should always:
* Compile successfully
* Pass tests
* Be deployable

If someone clones the repo:
```bash id="bp008"
git clone
```
It should work immediately.

---

## 6. Pull Before You Start Work
Always synchronize with remote:
```bash id="bp009"
git pull
```

Prevents:
* Merge conflicts
* Outdated code
* Duplicate work

---

## 7. Push Regularly
Do not wait until the end of a feature.

```bash id="bp010"
git push
```

Frequent pushes:
* Provide backup
* Help collaboration
* Make history visible

---

## 8. Use .gitignore Properly
Never commit unnecessary files:
* node_modules/
* venv/
* **pycache**/
* .env
* build files

Example:
 id="bp011"
node_modules/
venv/
.env
__pycache__/

---

## 9. Review Before Committing
Always check:
```bash id="bp012"
git status
```

Make sure:
* Only intended files are staged
* No sensitive data is included
* No debug code remains

---

## 10. Use Pull Requests for Integration
Even solo developers should use Pull Requests.

Benefits:
* History tracking
* Code review simulation
* Better discipline
* Professional workflow

---

## 11. Delete Merged Branches
After merging:
```bash id="bp013"
git branch -d feature/payment
```
Keeps repository clean.

---

## 12. Avoid Committing Secrets
Never commit:
* Passwords
* API keys
* Database credentials
* JWT secrets

Use `.env` instead.

---

## 13. Use Tags for Releases
Mark stable versions:
```bash id="bp014"
git tag v1.0.0
```

Push tags:
```bash id="bp015"
git push origin v1.0.0
```

---

## 14. Keep Branch Names Consistent
Use standard naming:

Features:
 id="bp016"
feature/login
feature/payment

Bug fixes:
 id="bp017"
bugfix/room-validation

Hotfix:
 id="bp018"
hotfix/payment-crash

Avoid random names:
 id="bp019"
test1
newbranch
abc

---

## 15. Regularly Clean History (When Appropriate)
Before merging a feature branch, use:
```bash id="bp020"
git rebase -i HEAD~n
```

To:
* Squash commits
* Clean history
* Improve readability

---

## 16. Understand When NOT to Rewrite History
Never rewrite history if:
* The branch is shared
* It has been pushed and used by others

Avoid:
```bash id="bp021"
git reset --hard
git push --force
```
unless absolutely necessary.

---

# Common Git Mistakes

## Mistake 1: Huge Commits
Bad:
 id="bp022"
One commit for entire project

Problem:
* Impossible to review
* Hard to debug
* Difficult rollback

---

## Mistake 2: Direct Push to main
Bad:
 id="bp023"
git push origin main

Problem:
* Breaks production stability
* No review process
* High risk

---

## Mistake 3: Ignoring Conflicts
Bad:
 id="bp024"
Ignoring merge conflicts

Problem:
* Broken application logic
* Data inconsistencies

---

## Mistake 4: Meaningless Commit Messages
Bad:
 id="bp025"
fix
update
done
final

Problem:
* No project clarity
* Impossible to track history

---

## Mistake 5: Long-Lived Feature Branches
Bad:
 id="bp026"
feature branch exists for 3 months

Problem:
* Massive merge conflicts
* Outdated code
* Difficult integration

---

## Mistake 6: Not Pulling Before Work
Bad:
 id="bp027"
Start coding without git pull

Problem:
* Outdated base
* Merge conflicts later

## Mistake 7: Committing Sensitive Data
Bad:
 id="bp028"
API_KEY=123456

__Problem__:
* Security risk
* Credential leaks
* Production compromise

# Good Git Workflow Summary
A professional workflow looks like this:

 id="bp029"
Pull latest code
↓
Create feature branch
↓
Write code
↓
Commit logically
↓
Push regularly
↓
Open Pull Request
↓
Code review
↓
Merge
↓
Delete branch

# HelloStay Specific Best Practices
For your project:
* Keep backend APIs modular (Guest, Room, Stay, Payment)
* One feature per branch
* Use tags for version milestones (v0.1, v0.2, v1.0)
* Keep database migrations versioned with Alembic
* Never commit `.env` files
* Use Pull Requests even if working alone

## Interview Questions
>Why are small commits important?
Small commits make it easier to track changes, debug issues, and revert specific functionality without affecting unrelated parts of the code.

>Why should main branch always be stable?
Because it represents production-ready code. Any unstable code in main can break deployments or affect other developers.

>Why should feature branches be used?
Feature branches isolate development work, allowing multiple features to be built independently without affecting the main codebase.

>What is the danger of using git push --force?
It rewrites remote history and can delete other developers' work, causing repository inconsistency.

>Why are commit messages important?
They document the history of the project and help developers understand why changes were made without reading the entire code.

---

# Verifying the ORM Layer
Before implementing business logic or API endpoints, verify that the application starts successfully.

>A successful application startup confirms:
- All SQLAlchemy models are importable.
- Relationship definitions are valid.
- Circular imports have been resolved.
- FastAPI can initialize all routers.
- Database configuration loads correctly.

Application startup is an important milestone because it validates the project's foundational architecture before additional features are developed.

---

# Single Source of Truth for Database Schema
A project should use only one mechanism to create and evolve the database schema.

__Avoid mixing__:
- `Base.metadata.create_all()`
- Alembic migrations

__Reason__:
- `create_all()` creates tables but does not record migration history.
- Alembic maintains version-controlled schema history.

Using both can cause Alembic to detect existing tables without corresponding migration records, leading to migration conflicts.

For production applications, Alembic should be the single source of truth for all schema changes.