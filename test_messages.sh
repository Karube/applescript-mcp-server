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

echo "4. Notification test (simple message)"
echo '{"jsonrpc":"2.0","id":4,"method":"tools/call","params":{"name":"run_applescript","arguments":{"script_name":"show_notification","args":{"message":"Hello","title":"Test"}}}}' | node dist/server.js
echo ""

echo "5. Get frontmost app test"
echo '{"jsonrpc":"2.0","id":5,"method":"tools/call","params":{"name":"run_applescript","arguments":{"script_name":"get_frontmost_app","args":{}}}}' | node dist/server.js
echo ""

echo "6. Raw script execution test"
echo '{"jsonrpc":"2.0","id":6,"method":"tools/call","params":{"name":"run_raw_applescript","arguments":{"script":"display dialog \"MCP Test\" buttons {\"OK\"} default button 1","args":{}}}}' | node dist/server.js
echo ""

echo "Test completed"
EOF

chmod +x test-individual.sh

echo "✅ test-individual.sh created successfully"

# Create batch test script
echo "Creating: test-batch.sh"
cat > test-batch.sh << 'EOF'
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
EOF

chmod +x test-batch.sh

echo "✅ test-batch.sh created successfully"

echo ""
echo "📊 Created test files:"
ls -la test-*
echo ""
echo "🎯 Test execution methods:"
echo "1. Individual test: ./test-individual.sh"
echo "2. Batch test: ./test-batch.sh"
echo "3. File usage: cat test-messages.jsonl | node dist/server.js"
echo ""
echo "We recommend first checking the operation with individual tests."