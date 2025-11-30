#!/usr/bin/env bash
set -euo pipefail

# Simple deployment script for VPS
# Usage: ./scripts/deploy.sh [branch]
# Default branch: copilot/add-integration-repository-setup

BRANCH="${1:-copilot/add-integration-repository-setup}"
APP_DIR="/srv/logisa"
SERVICE_NAME="logisa"

if [[ $(id -u) -ne 0 ]]; then
  echo "[WARN] Prefer running as root or via sudo if managing systemd." >&2
fi

if [[ ! -d "$APP_DIR/.git" ]]; then
  echo "[INFO] Cloning repository fresh..."
  mkdir -p "$APP_DIR"
  git clone https://github.com/wasalstor-web/fahad332.git "$APP_DIR"
fi

cd "$APP_DIR"

echo "[INFO] Fetching latest commits..."
 git fetch --all --prune

echo "[INFO] Checking out branch: $BRANCH"
 git checkout "$BRANCH"
 git pull origin "$BRANCH"

echo "[INFO] Installing dependencies (npm ci)..."
 npm ci

echo "[INFO] Generating Prisma client..."
 npx prisma generate

echo "[INFO] Applying migrations..."
 npx prisma migrate deploy

echo "[INFO] Building frontend (Vite)..."
 npm run build

echo "[INFO] Restarting systemd service (if exists)..."
 if systemctl list-units --type=service | grep -q "${SERVICE_NAME}.service"; then
   systemctl restart "${SERVICE_NAME}.service"
   systemctl status --no-pager "${SERVICE_NAME}.service" || true
 else
   echo "[WARN] Systemd service '${SERVICE_NAME}.service' not found. Run backend manually: 'npm run start:backend'"
 fi

echo "[SUCCESS] Deployment completed."