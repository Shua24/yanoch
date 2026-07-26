#!/bin/sh
# Build + run in one step
set -e
cd "$(dirname "$0")"
./build.sh
echo ""
echo "→ Starting Yanoch..."
dotnet run --project src/Yanoch.Web
