#!/bin/bash

# goto parent dir
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PARENT_DIR="$(dirname "$SCRIPT_DIR")"
cd "$PARENT_DIR" || exit 1

# delete database and restart pg
docker-compose stop postgres
sudo rm -rf data
docker-compose up -d postgres

# recreate database stuffs
source venv/bin/activate
cd back
echo "Waiting postgres from beein running..."
sleep 5
alembic upgrade head