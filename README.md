# AppleScript MCP Server

[日本語版](README.ja.md)

An MCP (Model Context Protocol) server that enables AI assistants to execute AppleScript commands on macOS. It provides a secure, registry-based approach to managing and executing AppleScript automation.

## Features

- **Script Registry**: Manage reusable AppleScripts in JSON format
- **Template Support**: Dynamic parameters using `{{placeholder}}` syntax
- **Security Validation**: Script validation before execution
- **6 MCP Tools**:
  - `run_applescript` - Execute registered scripts
  - `run_raw_applescript` - Execute raw AppleScript code directly
  - `list_scripts` - List all registered scripts
  - `get_script_info` - Get details about a specific script
  - `add_script` - Register a new script
  - `remove_script` - Remove a script from registry

## Requirements

- macOS (AppleScript required)
- Node.js 16+
- npm or yarn

## Installation

```bash
# Install dependencies
npm install

# Build TypeScript
npm run build
```

## Usage

### Development

```bash
npm run dev
```

### Production

```bash
npm start
```

### Running Tests

```bash
# Run all tests
./tests/test-batch.sh

# Run individual tests
./tests/test-individual.sh
```

## Project Structure

```
.
├── src/                    # Source code
│   ├── server.ts          # MCP server implementation
│   ├── applescript.ts     # AppleScript execution engine
│   ├── registry.ts        # Script registry management
│   └── types.ts           # TypeScript type definitions
├── dist/                   # Compiled JavaScript
├── tests/                  # Test files
│   ├── test-batch.sh      # Batch test runner
│   ├── test-individual.sh # Individual test runner
│   └── test-messages.jsonl # Test messages
├── scripts-registry.json   # Registered scripts storage
├── package.json           # npm configuration
├── tsconfig.json          # TypeScript configuration
└── CLAUDE.md              # AI development guidelines
```

## Script Examples

### Execute Registered Script

```json
{
  "method": "tools/call",
  "params": {
    "name": "run_applescript",
    "arguments": {
      "script_name": "show_notification",
      "parameters": {
        "message": "Hello from AppleScript!"
      }
    }
  }
}
```

### Execute Raw AppleScript

```json
{
  "method": "tools/call",
  "params": {
    "name": "run_raw_applescript",
    "arguments": {
      "script": "display dialog \"Hello, World!\""
    }
  }
}
```

## Security

- All scripts are validated before execution
- Dangerous commands (`do shell script`, `System Events`, etc.) are blocked
- Scripts are persisted in `scripts-registry.json`

## License

MIT License

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.