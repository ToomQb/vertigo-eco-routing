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
export WNGINX=1
cd front && npm run build && cd ..

# create nginx certs on first run
if ! test -d nginx/certs; then
    mkdir -p nginx/certs
    openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout nginx/certs/selfsigned.key \
    -out nginx/certs/selfsigned.crt \
    -subj "/CN=${NGINX_HOST}"
fi;

# generate nginx config
set -a
. .env
set +a
envsubst '$BACKEND_HOST $BACKEND_PORT' < nginx/default.conf.template > nginx/default.conf

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

