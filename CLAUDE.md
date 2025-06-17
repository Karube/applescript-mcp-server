# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an MCP (Model Context Protocol) server that enables AI assistants to execute AppleScript commands on macOS. It provides a secure, registry-based approach to managing and executing AppleScript automation.

## Key Commands

### Development
- `npm install` - Install dependencies
- `npm run build` - Compile TypeScript to JavaScript (required before running)
- `npm run dev` - Run server directly with ts-node for development
- `npm start` - Run compiled server from dist/

### Testing
- `./test-batch.sh` - Run batch tests using test-messages.jsonl
- `./test-individual.sh` - Run individual test commands

## Architecture

### Core Components
- **AppleScriptMCPServer** (src/server.ts): Main MCP server implementation handling stdio communication and tool routing
- **AppleScriptExecutor** (src/applescript.ts): Validates and executes AppleScript code with security checks
- **ScriptRegistryManager** (src/registry.ts): Manages persistent storage of registered scripts in scripts-registry.json

### MCP Tools
The server exposes 3 tools via the MCP protocol:
1. `run_applescript` - Execute a registered script with optional parameters
2. `list_scripts` - List all registered scripts
3. `get_script_info` - Get details about a specific script

### Script Management
Scripts are managed via the separate `manage-scripts.js` utility (not through MCP):
- `node manage-scripts.js add <file.json>` - Add script from JSON file
- `node manage-scripts.js remove <name>` - Remove script by name
- `node manage-scripts.js list` - List all scripts
- `node manage-scripts.js info <name>` - Show script details

### Key Design Patterns
- **Registry Pattern**: Scripts are stored in a JSON file for reuse
- **Template System**: Scripts support `{{placeholder}}` syntax for dynamic values
- **Validation**: All scripts undergo security validation before execution
- **Error Handling**: Comprehensive error handling with typed results throughout

## Important Notes
- This server only works on macOS due to AppleScript dependency
- Scripts are persisted in `scripts-registry.json` in the project root
- The server communicates via stdio, making it suitable for integration with AI assistants
- TypeScript strict mode is enabled - maintain type safety when making changes

## MCP Server Configuration

For Claude Code, add this to your MCP configuration:

```json
{
  "mcpServers": {
    "applescript": {
      "command": "/Users/karube.masaaki/MCP/applescript-mcp-server/node_modules/.bin/ts-node",
      "args": [
        "/Users/karube.masaaki/MCP/applescript-mcp-server/src/server.ts"
      ],
      "cwd": "/Users/karube.masaaki/MCP/applescript-mcp-server",
      "env": {}
    }
  }
}
```

## Available Sample Scripts

1. **show_notification** - Display macOS notification
2. **get_frontmost_app** - Get the frontmost application name