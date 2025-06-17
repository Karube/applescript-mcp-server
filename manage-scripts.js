#!/usr/bin/env node

/**
 * AppleScript Registry Management Utility
 * Separate script management tool for adding/removing AppleScript definitions
 */

const fs = require('fs');
const path = require('path');

const REGISTRY_FILE = 'scripts-registry.json';

class ScriptManager {
  constructor() {
    this.registryPath = path.join(process.cwd(), REGISTRY_FILE);
    this.loadRegistry();
  }

  loadRegistry() {
    try {
      if (fs.existsSync(this.registryPath)) {
        const data = fs.readFileSync(this.registryPath, 'utf8');
        this.registry = JSON.parse(data);
      } else {
        this.registry = {};
      }
    } catch (error) {
      console.error('Failed to load registry:', error.message);
      this.registry = {};
    }
  }

  saveRegistry() {
    try {
      fs.writeFileSync(this.registryPath, JSON.stringify(this.registry, null, 2));
      console.log('✅ Registry saved successfully');
    } catch (error) {
      console.error('❌ Failed to save registry:', error.message);
    }
  }

  addScript(scriptData) {
    const {
      name,
      script,
      description,
      args = [],
      usage = '',
      category = 'general'
    } = scriptData;

    if (!name || !script || !description) {
      throw new Error('name, script, and description are required');
    }

    if (this.registry[name]) {
      throw new Error(`Script '${name}' already exists`);
    }

    this.registry[name] = {
      name,
      script,
      description,
      args,
      usage,
      category,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.saveRegistry();
    console.log(`✅ Script '${name}' added successfully`);
  }

  removeScript(name) {
    if (!this.registry[name]) {
      throw new Error(`Script '${name}' not found`);
    }

    delete this.registry[name];
    this.saveRegistry();
    console.log(`✅ Script '${name}' removed successfully`);
  }

  listScripts() {
    const scripts = Object.values(this.registry);
    if (scripts.length === 0) {
      console.log('No scripts registered');
      return;
    }

    console.log('📋 Registered Scripts:');
    console.log('===================');
    scripts.forEach(script => {
      console.log(`• ${script.name} (${script.category})`);
      console.log(`  ${script.description}`);
      console.log(`  Args: ${script.args.length}`);
      console.log('');
    });
  }

  getScript(name) {
    const script = this.registry[name];
    if (!script) {
      throw new Error(`Script '${name}' not found`);
    }

    console.log('📄 Script Details:');
    console.log('==================');
    console.log(JSON.stringify(script, null, 2));
  }
}

function showHelp() {
  console.log(`
AppleScript Registry Management Utility

Usage:
  node manage-scripts.js <command> [options]

Commands:
  add <file>     Add script from JSON file
  remove <name>  Remove script by name
  list           List all registered scripts
  info <name>    Show script details
  help           Show this help

Examples:
  node manage-scripts.js add my-script.json
  node manage-scripts.js remove show_notification
  node manage-scripts.js list
  node manage-scripts.js info get_frontmost_app

JSON file format for 'add' command:
{
  "name": "script_name",
  "script": "AppleScript code here",
  "description": "What this script does",
  "args": [
    {
      "name": "param1",
      "type": "string",
      "description": "Parameter description",
      "required": true,
      "defaultValue": "optional"
    }
  ],
  "usage": "script_name(param1=\"value\")",
  "category": "automation"
}
`);
}

function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  if (!command || command === 'help') {
    showHelp();
    return;
  }

  const manager = new ScriptManager();

  try {
    switch (command) {
      case 'add':
        const filename = args[1];
        if (!filename) {
          console.error('❌ JSON file path required');
          process.exit(1);
        }
        
        const scriptData = JSON.parse(fs.readFileSync(filename, 'utf8'));
        manager.addScript(scriptData);
        break;

      case 'remove':
        const scriptName = args[1];
        if (!scriptName) {
          console.error('❌ Script name required');
          process.exit(1);
        }
        manager.removeScript(scriptName);
        break;

      case 'list':
        manager.listScripts();
        break;

      case 'info':
        const infoName = args[1];
        if (!infoName) {
          console.error('❌ Script name required');
          process.exit(1);
        }
        manager.getScript(infoName);
        break;

      default:
        console.error(`❌ Unknown command: ${command}`);
        showHelp();
        process.exit(1);
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = ScriptManager;