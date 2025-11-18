#!/bin/sh
set -e

cp /usr/src/app/.crontab /etc/cron.d/zuba-jobs
chmod 0644 /etc/cron.d/zuba-jobs

exec cron -f
