#!/bin/bash

echo "📝 テスト用メッセージファイル作成"
echo "==============================="

PROJECT_DIR="/Users/karube.masaaki/MCP/applescript-mcp-server"
cd "$PROJECT_DIR"

# テスト用JSONメッセージファイルを作成
echo "作成中: test-messages.jsonl"
cat > test-messages.jsonl << 'EOF'
{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2024-11-05","capabilities":{},"clientInfo":{"name":"test","version":"1.0.0"}}}
{"jsonrpc":"2.0","id":2,"method":"tools/list","params":{}}
{"jsonrpc":"2.0","id":3,"method":"tools/call","params":{"name":"list_scripts","arguments":{}}}
{"jsonrpc":"2.0","id":4,"method":"tools/call","params":{"name":"run_applescript","arguments":{"script_name":"show_notification","args":{"message":"Hello MCP","title":"テスト成功"}}}}
{"jsonrpc":"2.0","id":5,"method":"tools/call","params":{"name":"run_applescript","arguments":{"script_name":"get_frontmost_app","args":{}}}}
{"jsonrpc":"2.0","id":6,"method":"tools/call","params":{"name":"run_raw_applescript","arguments":{"script":"tell application \"Finder\" to get name of startup disk","args":{}}}}
{"jsonrpc":"2.0","id":7,"method":"tools/call","params":{"name":"get_script_info","arguments":{"script_name":"show_notification"}}}
EOF

echo "✅ test-messages.jsonl 作成完了"

# 個別テスト用スクリプト作成
echo "作成中: test-individual.sh"
cat > test-individual.sh << 'EOF'
#!/bin/bash

echo "🧪 AppleScript MCP Server 個別テスト"
echo "==================================="

echo "1. 初期化テスト"
echo '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2024-11-05","capabilities":{},"clientInfo":{"name":"test","version":"1.0.0"}}}' | node dist/server.js
echo ""

echo "2. ツール一覧テスト"
echo '{"jsonrpc":"2.0","id":2,"method":"tools/list","params":{}}' | node dist/server.js
echo ""

echo "3. スクリプト一覧テスト"
echo '{"jsonrpc":"2.0","id":3,"method":"tools/call","params":{"name":"list_scripts","arguments":{}}}' | node dist/server.js
echo ""

echo "4. 通知テスト（簡単なメッセージ）"
echo '{"jsonrpc":"2.0","id":4,"method":"tools/call","params":{"name":"run_applescript","arguments":{"script_name":"show_notification","args":{"message":"Hello","title":"Test"}}}}' | node dist/server.js
echo ""

echo "5. 最前面アプリ取得テスト"
echo '{"jsonrpc":"2.0","id":5,"method":"tools/call","params":{"name":"run_applescript","arguments":{"script_name":"get_frontmost_app","args":{}}}}' | node dist/server.js
echo ""

echo "6. 生スクリプト実行テスト"
echo '{"jsonrpc":"2.0","id":6,"method":"tools/call","params":{"name":"run_raw_applescript","arguments":{"script":"display dialog \"MCP Test\" buttons {\"OK\"} default button 1","args":{}}}}' | node dist/server.js
echo ""

echo "テスト完了"
EOF

chmod +x test-individual.sh

echo "✅ test-individual.sh 作成完了"

# 一括テスト用スクリプト作成
echo "作成中: test-batch.sh"
cat > test-batch.sh << 'EOF'
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
EOF

chmod +x test-batch.sh

echo "✅ test-batch.sh 作成完了"

echo ""
echo "📊 作成されたテストファイル:"
ls -la test-*
echo ""
echo "🎯 テスト実行方法:"
echo "1. 個別テスト: ./test-individual.sh"
echo "2. 一括テスト: ./test-batch.sh"
echo "3. ファイル使用: cat test-messages.jsonl | node dist/server.js"
echo ""
echo "まず個別テストで動作確認することをお勧めします。"