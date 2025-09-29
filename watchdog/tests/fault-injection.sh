#!/usr/bin/env bash
# POSIX fault-injection script for watchdog tests
set -euo pipefail

PKG_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
LOG_FILE="$PKG_ROOT/watchdog_restarts.log"

echo "Looking for kiosk process (node fake_kiosk.js)..."
PID=$(pgrep -f fake_kiosk || true)
if [ -z "$PID" ]; then
  echo "No kiosk process found. Start fake_kiosk.js first for a meaningful test." >&2
  exit 2
fi

echo "Killing kiosk pid $PID"
kill -TERM "$PID"

echo "Waiting up to 5s for watchdog to restart..."
end=$((SECONDS+5))
while [ $SECONDS -lt $end ]; do
  if [ -f "$LOG_FILE" ]; then
    if tail -n 50 "$LOG_FILE" | grep -q "spawned"; then
      echo "Watchdog restarted kiosk (log contains spawn entry).";
      exit 0
    fi
  fi
  sleep 1
done

echo "Watchdog did not restart kiosk within 5s" >&2
exit 1
