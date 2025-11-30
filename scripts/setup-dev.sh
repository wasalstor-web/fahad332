#!/usr/bin/env bash
# Local dev environment setup
# Run this once to set up development environment

set -euo pipefail

echo "🔧 Setting up development environment..."

# Install dependencies
echo "📦 Installing npm packages..."
npm ci

# Setup database
echo "🗄️ Setting up database..."
npx prisma generate
npx prisma migrate deploy

echo ""
echo "✅ Development environment ready!"
echo ""
echo "🚀 To start development:"
echo ""
echo "Terminal 1 - Frontend (Vite):"
echo "  npm run dev"
echo ""
echo "Terminal 2 - Backend (Node.js):"
echo "  npm run dev:backend"
echo ""
echo "📍 Frontend: http://localhost:5173"
echo "📍 Backend: http://localhost:3000"
echo ""
echo "After testing locally, push to GitHub:"
echo "  git add ."
echo "  git commit -m 'Your message'"
echo "  git push origin copilot/add-integration-repository-setup"
echo ""
echo "Then watch auto-deployment at:"
echo "  https://github.com/wasalstor-web/fahad332/actions"
