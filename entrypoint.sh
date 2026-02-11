#!/bin/bash
set -e

# Start cloudflared tunnel in background
echo "[entrypoint] Starting cloudflared tunnel..."
cloudflared tunnel --config /etc/cloudflared/config.yml run grad-api &

# Start Flask via gunicorn
echo "[entrypoint] Starting gunicorn..."
exec gunicorn grad_upload_receiver:app \
    --bind 0.0.0.0:5050 \
    --workers 2 \
    --timeout 30 \
    --access-logfile - \
    --error-logfile -
