#!/usr/bin/env bash

set -euo pipefail

if [[ $# -lt 1 || $# -gt 2 ]]; then
  echo "Usage: ./scripts/restore-db.sh <backup-file> [target-database]"
  exit 1
fi

BACKUP_FILE="$1"
TARGET_DB="${2:-jongkran_restore_test}"

if [[ ! -f "$BACKUP_FILE" ]]; then
  echo "Backup file not found: $BACKUP_FILE"
  exit 1
fi

if [[ ! "$TARGET_DB" =~ ^[A-Za-z_][A-Za-z0-9_]*$ ]]; then
  echo "Invalid database name: $TARGET_DB"
  exit 1
fi

# Prevent accidental restoration over the real database.
if [[ "$TARGET_DB" == "neondb" ]]; then
  echo "Restore blocked: cannot overwrite the production neondb database."
  exit 1
fi

OWNER_URL="$(
  node --input-type=module -e '
    import "dotenv/config";

    const value = process.env.OWNER_DATABASE_URL;

    if (!value) {
      console.error("OWNER_DATABASE_URL is missing");
      process.exit(1);
    }

    const url = new URL(value);
    url.searchParams.delete("schema");
    url.hostname = url.hostname.replace("-pooler", "");

    process.stdout.write(url.toString());
  '
)"

DATABASE_EXISTS="$(
  psql "$OWNER_URL" \
    --tuples-only \
    --no-align \
    --command="SELECT 1 FROM pg_database WHERE datname = '$TARGET_DB';"
)"

if [[ "$DATABASE_EXISTS" != "1" ]]; then
  echo "Creating database: $TARGET_DB"

  psql "$OWNER_URL" \
    --set=ON_ERROR_STOP=1 \
    --command="CREATE DATABASE \"$TARGET_DB\";"
fi

RESTORE_URL="$(
  TARGET_DB="$TARGET_DB" node --input-type=module -e '
    import "dotenv/config";

    const url = new URL(process.env.OWNER_DATABASE_URL);
    url.searchParams.delete("schema");
    url.hostname = url.hostname.replace("-pooler", "");
    url.pathname = `/${process.env.TARGET_DB}`;

    process.stdout.write(url.toString());
  '
)"

echo "Restoring $BACKUP_FILE into $TARGET_DB..."

pg_restore \
  --dbname="$RESTORE_URL" \
  --clean \
  --if-exists \
  --exit-on-error \
  --no-owner \
  --no-privileges \
  "$BACKUP_FILE"

echo "Restore completed successfully."

psql "$RESTORE_URL" \
  --command="SELECT COUNT(*) AS recipe_count FROM recipes;"

unset OWNER_URL RESTORE_URL DATABASE_EXISTS

