#!/bin/sh
set -e

echo "Running database migrations..."
node ace migration:run --force

echo "Starting application server..."
node ./bin/server.js
