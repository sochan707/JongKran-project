# Database backups

`scripts/backup-db.sh` creates a PostgreSQL custom-format dump, keeps the seven
newest successful local dumps, and can replace one off-server recovery copy.
Partial or failed dumps are never added to the retained backup set.

## Requirements

- `node`, `pg_dump`, and `pg_restore`
- `BACKUP_DATABASE_URL` in `backend/.env`
- `rclone` and `OFFSITE_BACKUP_TARGET` for the off-server copy

Use a direct PostgreSQL connection for `BACKUP_DATABASE_URL`, not a transaction
pooler. Configure an encrypted off-server destination with `rclone config`, then
set a directory target such as:

```dotenv
BACKUP_RETENTION_COUNT="7"
OFFSITE_BACKUP_TARGET="s3:jkr-backups/production"
```

Run and test one backup manually from the backend directory:

```sh
npm run db:backup
```

## Daily Linux schedule

Open the service account's crontab with `crontab -e` and schedule the backup at
02:00 every day. Replace `/absolute/path/to/Project` with the deployed path and
replace executable paths with the output of `command -v` on that server:

```cron
0 2 * * * cd /absolute/path/to/Project/backend && /usr/bin/flock -n /tmp/jongkran-backup.lock ./scripts/backup-db.sh >> backup.log 2>&1
```

The server timezone controls when 02:00 occurs. Monitor `backend/backup.log` and
configure an alert for failed cron jobs.

## Recovery checks

At least monthly, restore a retained dump into the non-production test database:

```sh
npm run db:restore -- backups/jongkran_YYYY-MM-DD_HH-MM-SS.dump
```

The dump covers PostgreSQL only. Cloudinary assets, application files, and
environment secrets need their own recovery plan.
