# AppleScript MCP Server

[日本語版](README.ja.md)

An MCP (Model Context Protocol) server that enables AI assistants to execute pre-registered AppleScript commands on macOS. It provides a secure, registry-based approach to executing AppleScript automation with scripts managed outside of MCP.

## Features

- **Script Registry**: Manage reusable AppleScripts in JSON format
- **Template Support**: Dynamic parameters using `{{placeholder}}` syntax
- **Security Validation**: Script validation before execution
- **3 MCP Tools**:
  - `run_applescript` - Execute registered scripts
  - `list_scripts` - List all registered scripts
  - `get_script_info` - Get details about a specific script
- **Separate Script Management**: Scripts are added/removed via `manage-scripts.js` utility, not through MCP

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

### Script Management

```bash
# Add a script from JSON file
node manage-scripts.js add my-script.json

# Remove a script
node manage-scripts.js remove script_name

# List all scripts
node manage-scripts.js list

# Get script details
node manage-scripts.js info script_name
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
├── manage-scripts.js       # Script management utility
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

### Add New Script

Create a JSON file with script definition:

```json
{
  "name": "my_script",
  "script": "display dialog \"{{message}}\"",
  "description": "Show a dialog with custom message",
  "args": [
    {
      "name": "message",
      "type": "string",
      "description": "Message to display",
      "required": true
    }
  ],
  "usage": "my_script(message=\"Hello\")",
  "category": "ui"
}
```

Then add it:

```bash
node manage-scripts.js add my-script.json
```

## Security

- All scripts are validated before execution
- Dangerous commands (`do shell script`, `System Events`, etc.) are blocked
- Scripts are persisted in `scripts-registry.json`

## Private Scripts

To keep your personal AppleScripts private:

1. Your custom scripts are stored in `scripts-registry.json` (gitignored)
2. The repository includes `scripts-registry.sample.json` with example scripts
3. On first run, the sample registry is copied to create your private registry
4. Your private scripts will never be committed to the repository

## License

MIT License

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.