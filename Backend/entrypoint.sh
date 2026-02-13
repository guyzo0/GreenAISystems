#!/bin/bash
set -e

echo "Waiting for PostgreSQL..."

until nc -z postgres 5432; do
  sleep 1
done

echo "PostgreSQL started"

echo "Running migrations..."
alembic upgrade head

echo "Seeding roles..."
python -m app.scripts.seed_role

echo "Starting API..."

if [ "$ENV" = "prod" ]; then
    exec uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 4
else
    exec uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
fi