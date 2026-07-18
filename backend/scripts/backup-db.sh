#!/usr/bin/env bash

set -euo pipefail

mkdir -p backups

BACKUP_URL="$(
  node --input-type=module -e '
    import "dotenv/config";

    const value = process.env.BACKUP_DATABASE_URL;

    if (!value) {
      console.error("BACKUP_DATABASE_URL is missing");
      process.exit(1);
    }

    const url = new URL(value);
    url.searchParams.delete("schema");

    process.stdout.write(url.toString());
  '
)"

BACKUP_FILE="backups/jongkran_$(date +%Y-%m-%d_%H-%M-%S).dump"

pg_dump "$BACKUP_URL" \
  --format=custom \
  --no-owner \
  --no-privileges \
  --file="$BACKUP_FILE"

unset BACKUP_URL

echo "Backup created: $BACKUP_FILE"

