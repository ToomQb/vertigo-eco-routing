#!/bin/bash

# goto parent dir and get env vars
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PARENT_DIR="$(dirname "$SCRIPT_DIR")"
cd "$PARENT_DIR" || exit 1
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

# create db on first run
if ! test -d data; then
    ./scripts/reset_db.sh
fi;
docker-compose up -d postgres


# run backend and frontend with same shell
cmd1="cd back && uvicorn app.main:app --reload --port ${BACKEND_PORT} --host ${BACKEND_HOST}"
cmd2="cd front && npm run dev"
pids=()

# Function to run a command and print output with prefix
run_command() {
    local name="$1"
    local command="$2"

    {
        echo "[$name] Starting"
        eval "$command"
        echo "[$name] Finished"
    } 2>&1 | sed -u "s/^/[$name] /" &
    
    pids+=($!)
}

# Trap CTRL+C
cleanup() {
    echo
    echo "Caught SIGINT, terminating all subprocesses..."
    for pid in "${pids[@]}"; do
        if kill -0 "$pid" 2>/dev/null; then
            echo "Killing PID $pid"
            kill "$pid"
        fi
    done

    docker-compose stop postgres

    wait
    echo "All subprocesses terminated."
    exit 0
}

trap cleanup SIGINT

# Run commands in parallel
run_command "backend" "$cmd1"
run_command "frontend" "$cmd2"

# Wait for all background jobs
wait
