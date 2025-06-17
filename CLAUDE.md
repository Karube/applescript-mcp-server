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
The server exposes 6 tools via the MCP protocol:
1. `run_applescript` - Execute a registered script with optional parameters
2. `run_raw_applescript` - Execute raw AppleScript code directly
3. `list_scripts` - List all registered scripts
4. `get_script_info` - Get details about a specific script
5. `add_script` - Register a new script in the registry
6. `remove_script` - Remove a script from the registry

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