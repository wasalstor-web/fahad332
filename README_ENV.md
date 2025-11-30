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
