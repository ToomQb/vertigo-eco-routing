#!/bin/bash

# goto parent dir and get env vars
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PARENT_DIR="$(dirname "$SCRIPT_DIR")"
cd "$PARENT_DIR" || exit 1
ROOT=$(pwd)
source .env

# create venv on first run
if ! test -d venv; then
    python3 -m venv venv
fi;

# install deps if needed
source venv/bin/activate
cd back
pip install -r requirements.txt
cd ../front
npm install
cd ../

# build frontend
export PROD=1
cd front && npm run build && cd ..

# create db on first run
if ! test -d data; then
    ./scripts/db_reset.sh
fi;
docker-compose up -d postgres
docker-compose up -d nginx


cleanup() {
    cd $ROOT
    docker-compose stop postgres
    docker-compose stop nginx
    echo "All docker services terminated."
    exit 0
}

trap cleanup SIGINT

cd back && uvicorn app.main:app --host $BACKEND_HOST --port $BACKEND_PORT

wait

