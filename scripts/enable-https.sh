#!/usr/bin/env bash
# Enable HTTPS for LogiSa using Let's Encrypt (certbot)
# Domain: onlainee.space
# Run after quick-start.sh or manual setup
set -euo pipefail

DOMAIN="onlainee.space"

if [[ $(id -u) -ne 0 ]]; then
  echo "Run as root (sudo -i)" >&2
  exit 1
fi

echo "=== LogiSa HTTPS Setup for $DOMAIN ==="
echo ""

# Check if DNS is pointing to this server
echo "[1/4] Checking DNS resolution..."
SERVER_IP=$(curl -s ifconfig.me || curl -s icanhazip.com)
DOMAIN_IP=$(dig +short $DOMAIN | tail -1)

if [[ "$SERVER_IP" != "$DOMAIN_IP" ]]; then
  echo "WARNING: DNS may not be configured correctly."
  echo "  Server IP: $SERVER_IP"
  echo "  Domain resolves to: $DOMAIN_IP"
  echo ""
  read -p "Continue anyway? (y/N) " -n 1 -r
  echo
  if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    exit 1
  fi
fi

echo "[2/4] Installing certbot..."
apt install -y certbot python3-certbot-nginx dnsutils

echo "[3/4] Obtaining SSL certificate..."
certbot --nginx -d $DOMAIN -d www.$DOMAIN --non-interactive --agree-tos --email admin@$DOMAIN --redirect

echo "[4/4] Setting up auto-renewal..."
systemctl enable certbot.timer
systemctl start certbot.timer

echo ""
echo "============================================="
echo "✅ HTTPS is now enabled!"
echo "============================================="
echo ""
echo "Your site is now available at:"
echo "  https://$DOMAIN"
echo "  https://www.$DOMAIN"
echo ""
echo "Certificate auto-renewal is configured."
echo "Test renewal with: certbot renew --dry-run"
