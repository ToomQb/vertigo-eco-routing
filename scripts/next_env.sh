#!/bin/bash

# goto parent dir and get env vars
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PARENT_DIR="$(dirname "$SCRIPT_DIR")"
cd "$PARENT_DIR" || exit 1
source .env

export NEXT_PUBLIC_DEBUG="$DEBUG"

# export next specifics env vars
if test $PROD; then 
    export NEXT_PUBLIC_API_URL="https://$NGINX_HOST/api"
else
    export NEXT_PUBLIC_API_URL="http://$BACKEND_HOST:$BACKEND_PORT"
fi;
