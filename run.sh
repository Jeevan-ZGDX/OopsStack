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
