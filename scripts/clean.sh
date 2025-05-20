#!/bin/bash

# goto parent dir
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PARENT_DIR="$(dirname "$SCRIPT_DIR")"
cd "$PARENT_DIR" || exit 1

docker-compose down -v --remove-orphans

rm -rf venv
rm -rf front/.next
rm -rf front/node_modules
rm -rf front/out
