#!/usr/bin/env python3
"""
CIT-CognIQ: Supabase (PostgreSQL) Migration Utility
===================================================
Transfers all data from local SQLite database (via data_dump.json)
directly into your remote Supabase PostgreSQL database.

Usage:
  1. Pass the Supabase connection string as a CLI argument:
     .venv/bin/python push_to_supabase.py "postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"

  2. Or set DATABASE_URL or SUPABASE_DATABASE_URL in .env and run:
     .venv/bin/python push_to_supabase.py
"""

import os
import sys
import subprocess
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent
FIXTURE_PATH = BASE_DIR / "data_dump.json"

def main():
    print("=" * 65)
    print(" 🚀 CIT-CognIQ -> Supabase Migration Utility")
    print("=" * 65)

    # 1. Determine Supabase connection URL
    supabase_url = None
    if len(sys.argv) > 1:
        supabase_url = sys.argv[1].strip()
    else:
        # Check environment / .env
        from decouple import config
        supabase_url = config("SUPABASE_DATABASE_URL", default=config("DATABASE_URL", default="")).strip()

    if not supabase_url or "sqlite" in supabase_url:
        print("\n❌ Error: No valid Supabase / PostgreSQL connection string provided.")
        print("\nPlease provide your Supabase connection URI in either format:")
        print("  1. As a command line argument:")
        print('     python push_to_supabase.py "postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"')
        print("\n  2. Or in .env as:")
        print('     SUPABASE_DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"')
        sys.exit(1)

    # 2. Ensure fixture file exists
    if not FIXTURE_PATH.exists():
        print(f"\n📦 Fixture file {FIXTURE_PATH.name} not found. Generating fresh dump from SQLite...")
        subprocess.run([
            sys.executable, "manage.py", "dumpdata",
            "--natural-foreign", "--natural-primary",
            "-e", "contenttypes", "-e", "auth.Permission",
            "--indent", "2", "-o", str(FIXTURE_PATH)
        ], check=True)
        print("  ✓ Fixture generated.")

    print(f"\n📡 Connecting to Supabase instance...")
    masked_url = supabase_url
    if "@" in masked_url:
        prefix, host = masked_url.split("@", 1)
        scheme, user_pass = prefix.split("://", 1)
        user = user_pass.split(":")[0] if ":" in user_pass else user_pass
        masked_url = f"{scheme}://{user}:****@{host}"
    print(f"   Target: {masked_url}")

    # Set DATABASE_URL for subprocesses
    env = os.environ.copy()
    env["DATABASE_URL"] = supabase_url
    env["DEBUG"] = "False"

    # 3. Test connection via psycopg2
    try:
        import psycopg2
        conn = psycopg2.connect(supabase_url, connect_timeout=10)
        conn.close()
        print("   ✓ Connection to Supabase PostgreSQL verified successfully!")
    except Exception as e:
        print(f"\n❌ Failed to connect to Supabase: {e}")
        print("Please check your password, network connection, or pooler port (5432 or 6543).")
        sys.exit(1)

    # 4. Run Django migrations on Supabase
    print("\n[Step 1/3] Running Django schema migrations on Supabase...")
    res = subprocess.run([sys.executable, "manage.py", "migrate", "--noinput"], env=env)
    if res.returncode != 0:
        print("❌ Migration failed.")
        sys.exit(1)
    print("   ✓ Schemas and tables created successfully.")

    # 5. Load data from data_dump.json
    print("\n[Step 2/3] Loading institutional dataset into Supabase...")
    res = subprocess.run([sys.executable, "manage.py", "loaddata", str(FIXTURE_PATH)], env=env)
    if res.returncode != 0:
        print("❌ Data load failed.")
        sys.exit(1)
    print("   ✓ Dataset loaded successfully.")

    # 6. Reset PostgreSQL sequences so new inserts don't collide
    print("\n[Step 3/3] Resetting PostgreSQL primary key sequences...")
    reset_script = """
import os, django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'CognIQ.settings')
django.setup()
from django.db import connection

tables = [
    'myapp_school', 'myapp_user', 'myapp_studentclass', 'myapp_studentclass_students',
    'myapp_exam', 'myapp_exam_assigned_classes', 'myapp_question', 'myapp_choice',
    'myapp_examquestion', 'myapp_examattempt', 'myapp_studentanswer', 'myapp_examassignmentdate'
]

with connection.cursor() as cursor:
    for table in tables:
        try:
            cursor.execute(f"SELECT setval(pg_get_serial_sequence('{table}', 'id'), coalesce(max(id), 1)) FROM {table};")
            print(f"  ✓ Reset sequence for {table}")
        except Exception as e:
            pass
"""
    subprocess.run([sys.executable, "-c", reset_script], env=env, check=True)

    print("\n" + "=" * 65)
    print(" 🎉 MIGRATION TO SUPABASE COMPLETED SUCCESSFULLY!")
    print("=" * 65)
    print("All schools, users, cohorts, exams, questions, and attempts are now live in Supabase.")
    print("To make CognIQ use Supabase permanently:")
    print("  Add DATABASE_URL to your .env file:")
    print(f'  DATABASE_URL="{supabase_url}"')
    print("=" * 65)

if __name__ == '__main__':
    main()
