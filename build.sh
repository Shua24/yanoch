#!/bin/sh
# Build script — installs JS deps and rebuilds TipTap bundle
set -e
cd "$(dirname "$0")"
echo "→ Installing JS dependencies..."
npm install --silent
echo "→ Building TipTap editor bundle (ES module)..."
npx vite build
echo "✓ Done. Run: dotnet run --project src/Yanoch.Web"
