#!/bin/bash
set -euo pipefail

ENV="${ENV}"
echo "ENV=$ENV"

DB_HOST="${DB_HOST:-postgres}"
DB_PORT="${DB_PORT:-5432}"
DB_TIMEOUT="${DB_TIMEOUT:-60}"

echo "Attente PostgreSQL sur $DB_HOST:$DB_PORT..."

for i in $(seq 1 "$DB_TIMEOUT"); do
    if nc -z "$DB_HOST" "$DB_PORT"; then
        echo "PostgreSQL prêt ✅"
        break
    fi
    sleep 1
done

if ! nc -z "$DB_HOST" "$DB_PORT" >/dev/null 2>&1; then
    echo "⛔ PostgreSQL non disponible après $DB_TIMEOUT secondes"
    exit 1
fi

echo "Lancement des migrations Alembic..."
alembic upgrade head

APP_MODULE="${APP_MODULE:-app.main:app}"
APP_HOST="${APP_HOST:-0.0.0.0}"
APP_PORT="${APP_PORT:-8000}"

if [ "$ENV" = "prod" ]; then
    exec uvicorn "$APP_MODULE" --host "$APP_HOST" --port "$APP_PORT" --workers "${WORKERS:-4}"
else
    exec uvicorn "$APP_MODULE" --host "$APP_HOST" --port "$APP_PORT" --reload
fi
