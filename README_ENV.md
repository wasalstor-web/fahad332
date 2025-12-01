# LogiSa Environment Variables

## Required Environment Variables

```env
# Gemini API key for AI services
GEMINI_API_KEY=your_gemini_api_key_here

# Database connection URL (SQLite for local dev)
DATABASE_URL="file:./dev.db"

# Mapit shipping provider
MAPIT_API_KEY=your_mapit_api_key_here
MAPIT_API_URL=https://api.mapit.example/v1/shipments
MAPIT_WEBHOOK_SECRET=your_mapit_webhook_secret_here

# MyFatora payment provider
MYFATORA_API_KEY=your_myfatora_api_key_here
MYFATORA_API_URL=https://api.myfatora.example/v1/payments
MYFATORA_WEBHOOK_SECRET=your_myfatora_webhook_secret_here

# Telegram bot for notifications
TELEGRAM_BOT_TOKEN=your_telegram_bot_token_here
TELEGRAM_TEST_CHAT_ID=your_telegram_chat_id_here

# Server configuration
PORT=3001
CORS_ORIGIN=http://localhost:3000
```

## Local Development Setup

### 1. Install Dependencies
```bash
npm ci
```

### 2. Setup Prisma Database
```bash
# Generate Prisma client
npx prisma generate

# Run database migrations (creates SQLite database)
npx prisma migrate dev --name init
```

### 3. Start Backend Server
```bash
npm run dev:backend
```

### 4. Start Frontend Development Server
```bash
npm run dev
```

## Testing Webhooks Locally

Use ngrok to expose your local server for webhook testing:

```bash
# Install ngrok (if not installed)
npm install -g ngrok

# Expose your backend server
ngrok http 3001

# Use the https URL provided by ngrok as your webhook URL
# Example: https://abc123.ngrok.io/api/payment/webhook
```

## GitHub Secrets Setup

For CI/CD workflows, add the following secrets to your GitHub repository:

1. Go to Repository Settings → Secrets and variables → Actions
2. Add the following secrets:
   - `TELEGRAM_BOT_TOKEN` - Your Telegram bot token
   - `TELEGRAM_TEST_CHAT_ID` - Chat ID for test notifications

## Security Notes

### Rotating Compromised Keys

If any API keys were previously committed to the repository:

1. **Immediately rotate all affected keys** through the respective provider dashboards
2. Generate new keys and update your `.env` file locally
3. Update GitHub Secrets with new values
4. Never commit `.env` files with real credentials

### Best Practices

- Use `.env.example` as a template for environment variables
- Never commit `.env` files with real credentials
- Rotate keys regularly
- Use different keys for development and production

## VPS Deployment (onlainee.space)

### Quick Setup

For a fresh Ubuntu VPS, run the automated setup script:

```bash
# SSH into your server
ssh root@YOUR_VPS_IP

# Download and run quick-start script
curl -fsSL https://raw.githubusercontent.com/wasalstor-web/fahad332/copilot/add-integration-repository-setup/scripts/quick-start.sh | bash

# Or clone first and run manually:
git clone https://github.com/wasalstor-web/fahad332.git /srv/logisa
cd /srv/logisa
git checkout copilot/add-integration-repository-setup
chmod +x scripts/quick-start.sh
./scripts/quick-start.sh
```

### Enable HTTPS (Let's Encrypt)

After the basic setup, enable HTTPS:

```bash
# Ensure DNS is pointing to your server first!
# A record: onlainee.space -> YOUR_VPS_IP
# A record: www.onlainee.space -> YOUR_VPS_IP

# Run the HTTPS setup script
chmod +x scripts/enable-https.sh
./scripts/enable-https.sh

# Or manually:
apt install -y certbot python3-certbot-nginx
certbot --nginx -d onlainee.space -d www.onlainee.space
```

### Manual Setup Steps

If you prefer manual setup:

1. **Install dependencies:**
   ```bash
   apt update && apt install -y curl git sqlite3 nginx
   curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
   apt install -y nodejs
   ```

2. **Clone and setup project:**
   ```bash
   mkdir -p /srv/logisa && cd /srv/logisa
   git clone https://github.com/wasalstor-web/fahad332.git .
   git checkout copilot/add-integration-repository-setup
   cp .env.example .env
   # Edit .env with your real API keys
   ```

3. **Build:**
   ```bash
   npm ci
   npx prisma generate
   npx prisma migrate deploy
   npm run build
   ```

4. **Configure systemd:**
   ```bash
   cp deploy/logisa.service.example /etc/systemd/system/logisa.service
   systemctl daemon-reload
   systemctl enable logisa
   systemctl start logisa
   ```

5. **Configure Nginx:**
   ```bash
   cp deploy/nginx.conf.example /etc/nginx/sites-available/logisa.conf
   ln -sf /etc/nginx/sites-available/logisa.conf /etc/nginx/sites-enabled/
   rm -f /etc/nginx/sites-enabled/default
   nginx -t && systemctl reload nginx
   ```

### Useful Commands

```bash
# Check service status
systemctl status logisa
journalctl -u logisa -f

# Restart service
systemctl restart logisa

# Test endpoints
curl -s https://onlainee.space/api/shipments

# Renew SSL certificate (usually automatic)
certbot renew --dry-run
```

### GitHub Secrets for Auto-Deploy

Add these secrets for automated SSH deployment:

- `VPS_HOST` - Server IP (e.g., `147.93.120.99`)
- `VPS_USERNAME` - SSH user (e.g., `root`)
- `VPS_PASSWORD` - SSH password
