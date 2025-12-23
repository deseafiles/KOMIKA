#!/bin/sh
set -e

echo "Running database migrations..."
node ace migration:run --force
node ace db:seed
echo "Starting application server..."
node ./bin/server.js
