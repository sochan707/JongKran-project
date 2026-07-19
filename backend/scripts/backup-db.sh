#!/usr/bin/env bash

set -euo pipefail
umask 077

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
BACKUP_DIR="${BACKUP_DIR:-$BACKEND_DIR/backups}"
BACKUP_RETENTION_COUNT="${BACKUP_RETENTION_COUNT:-7}"

if [[ ! "$BACKUP_RETENTION_COUNT" =~ ^[1-9][0-9]*$ ]]; then
  echo "BACKUP_RETENTION_COUNT must be a positive integer" >&2
  exit 1
fi

mkdir -p "$BACKUP_DIR"
cd "$BACKEND_DIR"

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

BACKUP_FILE="$BACKUP_DIR/jongkran_$(date +%Y-%m-%d_%H-%M-%S).dump"
PARTIAL_FILE="$BACKUP_FILE.partial"

cleanup_partial() {
  rm -f "$PARTIAL_FILE"
}

trap cleanup_partial EXIT

pg_dump "$BACKUP_URL" \
  --format=custom \
  --no-owner \
  --no-privileges \
  --file="$PARTIAL_FILE"

# Do not publish or retain a dump whose archive cannot be read.
pg_restore --list "$PARTIAL_FILE" >/dev/null

mv "$PARTIAL_FILE" "$BACKUP_FILE"
trap - EXIT

unset BACKUP_URL

echo "Backup created: $BACKUP_FILE"

if [[ -n "${OFFSITE_BACKUP_TARGET:-}" ]]; then
  if ! command -v rclone >/dev/null 2>&1; then
    echo "rclone is required when OFFSITE_BACKUP_TARGET is configured" >&2
    exit 1
  fi

  OFFSITE_TARGET="${OFFSITE_BACKUP_TARGET%/}/jongkran_latest.dump"
  rclone copyto "$BACKUP_FILE" "$OFFSITE_TARGET"
  echo "Off-server backup updated: $OFFSITE_TARGET"
fi

# Timestamped names sort chronologically, so remove only the oldest excess files.
BACKUP_FILES=("$BACKUP_DIR"/jongkran_*.dump)
if [[ ! -e "${BACKUP_FILES[0]}" ]]; then
  BACKUP_FILES=()
fi

EXCESS_COUNT=$((${#BACKUP_FILES[@]} - BACKUP_RETENTION_COUNT))
for ((i = 0; i < EXCESS_COUNT; i++)); do
  rm -- "${BACKUP_FILES[$i]}"
  echo "Removed expired local backup: ${BACKUP_FILES[$i]}"
done
