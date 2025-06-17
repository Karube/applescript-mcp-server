#!/bin/bash

echo "🧪 AppleScript MCP Server Individual Test"
echo "==================================="

echo "1. Initialization test"
echo '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2024-11-05","capabilities":{},"clientInfo":{"name":"test","version":"1.0.0"}}}' | node dist/server.js
echo ""

echo "2. Tool list test"
echo '{"jsonrpc":"2.0","id":2,"method":"tools/list","params":{}}' | node dist/server.js
echo ""

echo "3. Script list test"
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
