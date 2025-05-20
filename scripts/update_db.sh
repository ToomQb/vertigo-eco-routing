#!/bin/bash

# Fail immediately if a command fails
set -e

# Validate input
if [ -z "$1" ]; then
  echo "❌ Error: You must provide a migration message as the first argument."
  echo "Usage: $0 \"Your migration message here\""
  exit 1
fi
MIGRATION_MESSAGE="$1"

# Go to parent dir
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PARENT_DIR="$(dirname "$SCRIPT_DIR")"
cd "$PARENT_DIR" || exit 1

# Start Postgres
docker-compose up -d postgres

# Activate virtual environment and switch to backend
source venv/bin/activate
cd back

# Create and apply migration
sleep 5
alembic revision --autogenerate -m "$MIGRATION_MESSAGE" --rev-id "$(date +%s)"
alembic upgrade head