#!/bin/bash
set -e

# Determine directory of this script
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# If running from root directory containing CIT-CognIQ, enter CIT-CognIQ
if [ -d "$SCRIPT_DIR/CIT-CognIQ" ]; then
    PROJECT_DIR="$SCRIPT_DIR/CIT-CognIQ"
else
    PROJECT_DIR="$SCRIPT_DIR"
fi

cd "$PROJECT_DIR"

# Ensure virtual environment exists
if [ ! -d ".venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv .venv
    echo "Installing dependencies..."
    .venv/bin/pip install -r requirements.txt
fi

# Ensure .env exists
if [ ! -f ".env" ]; then
    echo "Creating default .env configuration..."
    cat << 'EOF' > .env
SECRET_KEY=django-insecure-cogniq-local-development-key-xyz123456789
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1,0.0.0.0
USE_CLOUDFLARE=False
REQUIRE_HTTPS=False
EOF
fi

# Run database migrations
echo "Running migrations..."
.venv/bin/python manage.py migrate --noinput

<<<<<<< HEAD
# Run Django development server
HOST="${1:-127.0.0.1}"
PORT="${2:-8000}"

echo "=========================================================="
echo " Starting CIT-CognIQ local server on http://${HOST}:${PORT}"
echo " Default Admin Username: admin"
echo " Default Admin Password: adminpassword123"
echo " Press Ctrl+C to stop the server"
echo "=========================================================="

exec .venv/bin/python manage.py runserver "${HOST}:${PORT}"
=======
# Ensure frontend dependencies are installed
if [ -d "frontend" ] && [ ! -d "frontend/node_modules" ]; then
    echo "Installing Next.js frontend dependencies..."
    (cd frontend && npm install)
fi

# Run servers
BACKEND_PORT="${2:-8001}"
FRONTEND_PORT="3000"

echo "=========================================================="
echo " 🚀 Starting CIT-CognIQ Full Stack System"
echo " 🌐 Frontend (Next.js): http://localhost:${FRONTEND_PORT}"
echo " ⚙️ Backend API (Django): http://127.0.0.1:${BACKEND_PORT}"
echo " ---------------------------------------------------------"
echo " 🔑 Demo Credentials:"
echo "   • School Admin : admin       / adminpassword123"
echo "   • Teacher      : tch_001     / teachpass123"
echo "   • Student      : stu_aids_001 / studentpass123"
echo " ---------------------------------------------------------"
echo " Press Ctrl+C to stop both servers"
echo "=========================================================="

# Start Next.js frontend in background
if [ -d "frontend/.next" ]; then
    (cd frontend && npm run start) &
else
    (cd frontend && npm run dev) &
fi
FRONTEND_PID=$!

# Trap Ctrl+C to kill background processes
trap "kill $FRONTEND_PID 2>/dev/null || true; exit" SIGINT SIGTERM EXIT

# Start Django backend in foreground
.venv/bin/python manage.py runserver "127.0.0.1:${BACKEND_PORT}"
>>>>>>> f81bc8d (next changes)
