#!/bin/bash

echo "🧪 AppleScript MCP Server Batch Test"
echo "==================================="

echo "Starting server and processing test-messages.jsonl..."
echo ""

if [ ! -f dist/server.js ]; then
    echo "❌ dist/server.js not found"
    echo "Please run npm run build"
    exit 1
fi

echo "Running tests..."
cat test-messages.jsonl | node dist/server.js

echo ""
echo "✅ Batch test completed"
