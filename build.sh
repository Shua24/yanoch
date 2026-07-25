#!/bin/sh
# Build script — installs JS deps and rebuilds TipTap bundle
set -e
cd "$(dirname "$0")"
echo "→ Installing JS dependencies..."
npm install --silent
echo "→ Building TipTap editor bundle..."
npx vite build
echo "→ Copying bundle to wwwroot..."
cp src/dist/wwwroot/js/tiptap-editor.js src/Yanoch.Web/wwwroot/js/tiptap-editor.js
echo "✓ Done. Run: dotnet run --project src/Yanoch.Web"
