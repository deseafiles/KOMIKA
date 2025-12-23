#!/bin/sh

echo "Waiting for Postgres..."
sleep 5

node ace migration:run
node ace db:seed

node ace serve --host=0.0.0.0 --port=3333
