# Drop Shield - Backend

Quick scaffold for the Drop Shield backend (Express + MongoDB).

Setup

1. Open a terminal and change to the backend folder:

```powershell
cd backend
```

2. Install dependencies:

```powershell
npm install
```

3. Copy `.env.example` to `.env` and set `MONGO_URI` and `JWT_SECRET`.

4. Run in development:

```powershell
npm run dev
```

APIs

- `POST /api/auth/register` - register new user
- `POST /api/auth/login` - login

## Data Fix Utilities

If you imported CSV files that saved columns such as `Name` or `Student Id`, run the normalization helper to copy those values into the canonical schema fields expected by the app:

```powershell
node normalize-imported-students.js
```

The script will connect to the MongoDB cluster defined in `.env`, backfill the `name`, `roll`, `email`, and `phone` fields when they are missing, and leave all existing data intact.

To create the missing parent, mentor, and department records (and link them back to each student), run:

```powershell
node sync-student-relations.js
```

This second pass will:

- Create `Department` documents for every unique department string in the student dataset.
- Create `Parent` documents (with `pid`/`parentId`) using the legacy "Parent Name"/"Parent Number" columns and link them to each student.
- Create `Faculty` entries for the mentors listed in the CSV and set each student's `mentorId` so mentor logins can discover their cohorts.
