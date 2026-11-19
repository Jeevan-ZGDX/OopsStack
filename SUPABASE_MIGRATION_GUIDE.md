# CognIQ: Supabase PostgreSQL Migration Guide

All data currently in your application has been stored in your SQLite database files and exported into a database-agnostic JSON fixture format ready for Supabase:

1. **`db.sqlite3`** — Active local database (448 KB) containing all 37 users, 12 cohorts, 13 exams, 25 questions, 100 choices, and 35 attempts.
2. **`db_backup.sqlite3`** — Safety snapshot copy of your SQLite database.
3. **`data_dump.json`** — Standard Django natural-key data fixture (108 KB, 4,888 lines) containing all institutional records.
4. **`push_to_supabase.py`** — 1-command automated migration script.

---

## How to Push Data into Supabase

### Method 1: Automated Script (Recommended)

When you create your Supabase project:
1. Open your **Supabase Dashboard** -> **Project Settings** -> **Database**.
2. Copy the **Connection String** (URI mode, starting with `postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres` or port `6543`).
3. Run the following command in your terminal:

```bash
.venv/bin/python push_to_supabase.py "postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"
```

The script will automatically:
1. Verify the connection to your Supabase PostgreSQL database.
2. Apply all Django database migrations (`python manage.py migrate`).
3. Load all records from `data_dump.json` (`python manage.py loaddata`).
4. Reset all PostgreSQL primary key sequences to prevent future ID collision.

---

### Method 2: Manual Migration via `.env`

If you prefer adding the connection string directly to your `.env`:

1. Edit `.env` and add:
   ```env
   DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"
   ```

2. Run migrations:
   ```bash
   .venv/bin/python manage.py migrate
   ```

3. Load the data fixture:
   ```bash
   .venv/bin/python manage.py loaddata data_dump.json
   ```

4. Reset sequence counters:
   ```bash
   .venv/bin/python manage.py sqlsequencereset myapp | .venv/bin/python manage.py dbshell
   ```

---

## Dataset Breakdown Ready in `data_dump.json`

| Model | Record Count | Description |
|---|---|---|
| `myapp.school` | **1** | Coimbatore Institute of Technology (Root Tenant) |
| `myapp.user` | **37** | 11 School Admins, 12 Teachers, 14 Students |
| `myapp.studentclass` | **12** | Department cohorts across CSE, AIDS, IT, ECE, Mech, Civil, etc. |
| `myapp.exam` | **13** | Practice & test evaluations with duration and pass criteria |
| `myapp.question` | **25** | Technical MCQs with detailed explanations |
| `myapp.choice` | **100** | 4 randomized answer options per question |
| `myapp.examquestion` | **25** | Order junction relationships |
| `myapp.examattempt` | **35** | Graded student sessions with scores and percentages |
| `myapp.studentanswer` | **69** | Question-by-question student selections and correctness |
| `myapp.examassignmentdate` | **12** | Class-level assignment timestamps |
