#!/bin/bash

echo "🧪 AppleScript MCP Server 一括テスト"
echo "==================================="

echo "サーバーを起動して test-messages.jsonl を処理します..."
echo ""

if [ ! -f dist/server.js ]; then
    echo "❌ dist/server.js が見つかりません"
    echo "npm run build を実行してください"
    exit 1
fi

echo "テスト実行中..."
cat test-messages.jsonl | node dist/server.js

echo ""
echo "✅ 一括テスト完了"
