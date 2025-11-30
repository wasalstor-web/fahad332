#!/usr/bin/env bash
# Quick one-shot setup (backend + frontend) for a fresh Ubuntu VPS
# Domain: onlainee.space
# WARNING: Review before running. Not idempotent.
set -euo pipefail

APP_DIR="/srv/logisa"
BRANCH="copilot/add-integration-repository-setup"
REPO_URL="https://github.com/wasalstor-web/fahad332.git"
DOMAIN="onlainee.space"

if [[ $(id -u) -ne 0 ]]; then
  echo "Run as root (sudo -i) for full setup." >&2
  exit 1
fi

echo "[1/7] Update apt packages"
apt update

echo "[2/7] Install base packages"
apt install -y curl git sqlite3 nginx

if ! command -v node >/dev/null; then
  echo "[Install Node.js 20]"
  curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
  apt install -y nodejs
fi

echo "[3/7] Prepare app directory"
mkdir -p "$APP_DIR"
cd "$APP_DIR"

if [[ ! -d .git ]]; then
  echo "[Clone repo]"
  git clone "$REPO_URL" .
fi

echo "[Checkout branch]"
 git fetch --all --prune
 git checkout "$BRANCH"
 git pull origin "$BRANCH" || true

if [[ ! -f .env ]]; then
  echo "[Create .env from example]"
  cp .env.example .env
  sed -i 's/PORT=3001/PORT=3000/' .env
fi

echo "[4/7] Install dependencies"
npm ci

echo "[5/7] Prisma generate & migrate"
npx prisma generate
npx prisma migrate deploy

echo "[6/7] Build frontend"
npm run build

cat >/etc/systemd/system/logisa.service <<'EOF'
[Unit]
Description=LogiSa Backend Service
After=network.target

[Service]
Type=simple
WorkingDirectory=/srv/logisa
EnvironmentFile=/srv/logisa/.env
ExecStart=/usr/bin/npm run start:backend
Restart=always
RestartSec=5
User=root
Group=root

[Install]
WantedBy=multi-user.target
EOF

systemctl daemon-reload
systemctl enable logisa
systemctl restart logisa

# Nginx config
cat >/etc/nginx/sites-available/logisa.conf <<'EOF'
server {
    listen 80;
    server_name _;

    root /srv/logisa/dist;
    index index.html;

    location / {
        try_files $uri /index.html;
    }

    location /api/ {
        proxy_pass http://127.0.0.1:3000/api/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
EOF

ln -sf /etc/nginx/sites-available/logisa.conf /etc/nginx/sites-enabled/logisa.conf
nginx -t && systemctl reload nginx

echo "[7/7] Done. Frontend served on port 80, backend on 3000 via proxy."