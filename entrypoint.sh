#!/bin/sh

echo "Waiting for Postgres..."
sleep 5

node ace migration:run --force
node ace db:seed

node ace serve
