#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
} from '@modelcontextprotocol/sdk/types.js';

import { AppleScriptExecutor } from './applescript';
import { ScriptRegistryManager } from './registry';

class AppleScriptMCPServer {
  private server: Server;
  private executor: AppleScriptExecutor;
  private registry: ScriptRegistryManager;

  constructor() {
    this.server = new Server(
      {
        name: 'applescript-mcp-server',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.executor = new AppleScriptExecutor();
    this.registry = new ScriptRegistryManager();

    this.setupToolHandlers();
  }

  private setupToolHandlers(): void {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      const tools: Tool[] = [
        {
          name: 'run_applescript',
          description: 'Execute a registered AppleScript',
          inputSchema: {
            type: 'object',
            properties: {
              script_name: {
                type: 'string',
                description: 'Script name to execute',
              },
              args: {
                type: 'object',
                description: 'Script arguments (object format)',
                additionalProperties: true,
              },
            },
            required: ['script_name'],
          },
        },
        {
          name: 'run_raw_applescript',
          description: 'Execute raw AppleScript code directly',
          inputSchema: {
            type: 'object',
            properties: {
              script: {
                type: 'string',
                description: 'AppleScript code to execute',
              },
              args: {
                type: 'object',
                description: 'Script arguments (replace with {{key}} format)',
                additionalProperties: true,
              },
            },
            required: ['script'],
          },
        },
        {
          name: 'list_scripts',
          description: 'Get list of registered scripts',
          inputSchema: {
            type: 'object',
            properties: {
              category: {
                type: 'string',
                description: 'Filter by category (optional)',
              },
              search: {
                type: 'string',
                description: 'Keyword search (optional)',
              },
            },
          },
        },
        {
          name: 'get_script_info',
          description: 'Get detailed information about a specific script',
          inputSchema: {
            type: 'object',
            properties: {
              script_name: {
                type: 'string',
                description: 'Script name',
              },
            },
            required: ['script_name'],
          },
        },
        {
          name: 'add_script',
          description: 'Register a new script',
          inputSchema: {
            type: 'object',
            properties: {
              name: {
                type: 'string',
                description: 'Script name',
              },
              script: {
                type: 'string',
                description: 'AppleScript code',
              },
              description: {
                type: 'string',
                description: 'Script description',
              },
              args: {
                type: 'array',
                description: 'Argument definitions',
                items: {
                  type: 'object',
                  properties: {
                    name: { type: 'string' },
                    type: { type: 'string', enum: ['string', 'number', 'boolean'] },
                    description: { type: 'string' },
                    required: { type: 'boolean' },
                    defaultValue: {},
                  },
                  required: ['name', 'type', 'description'],
                },
              },
              usage: {
                type: 'string',
                description: 'Usage example',
              },
              category: {
                type: 'string',
                description: 'Category',
              },
            },
            required: ['name', 'script', 'description'],
          },
        },
        {
          name: 'remove_script',
          description: 'Remove a script',
          inputSchema: {
            type: 'object',
            properties: {
              script_name: {
                type: 'string',
                description: 'Script name to remove',
              },
            },
            required: ['script_name'],
          },
        },
      ];

      return { tools };
    });

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case 'run_applescript':
            return await this.handleRunAppleScript(args);
          
          case 'run_raw_applescript':
            return await this.handleRunRawAppleScript(args);
          
          case 'list_scripts':
            return await this.handleListScripts(args);
          
          case 'get_script_info':
            return await this.handleGetScriptInfo(args);
          
          case 'add_script':
            return await this.handleAddScript(args);
          
          case 'remove_script':
            return await this.handleRemoveScript(args);
          
          default:
            throw new Error(`Unknown tool: ${name}`);
        }
      } catch (error: any) {
        return {
          content: [
            {
              type: 'text',
              text: `Error: ${error.message}`,
            },
          ],
        };
      }
    });
  }

  private async handleRunAppleScript(args: any) {
    const { script_name, args: scriptArgs = {} } = args;
    
    const scriptInfo = this.registry.getScript(script_name);
    if (!scriptInfo) {
      throw new Error(`Script '${script_name}' not found`);
    }

    const validation = this.executor.validateArgs(scriptArgs, scriptInfo.args);
    if (!validation.valid) {
      throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
    }

    const result = await this.executor.execute(scriptInfo.script, scriptArgs);
    
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            success: result.success,
            output: result.output,
            error: result.error,
            executionTime: result.executionTime,
            scriptName: script_name,
          }, null, 2),
        },
      ],
    };
  }

  private async handleRunRawAppleScript(args: any) {
    const { script, args: scriptArgs = {} } = args;
    
    const result = await this.executor.execute(script, scriptArgs);
    
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            success: result.success,
            output: result.output,
            error: result.error,
            executionTime: result.executionTime,
          }, null, 2),
        },
      ],
    };
  }

  private async handleListScripts(args: any) {
    const { category, search } = args;
    
    let scripts = this.registry.getAllScripts();
    
    if (category) {
      scripts = this.registry.getScriptsByCategory(category);
    }
    
    if (search) {
      scripts = this.registry.searchScripts(search);
    }
    
    const scriptList = scripts.map(script => ({
      name: script.name,
      description: script.description,
      category: script.category,
      usage: script.usage,
      argsCount: script.args.length,
    }));
    
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(scriptList, null, 2),
        },
      ],
    };
  }

  private async handleGetScriptInfo(args: any) {
    const { script_name } = args;
    
    const scriptInfo = this.registry.getScript(script_name);
    if (!scriptInfo) {
      throw new Error(`Script '${script_name}' not found`);
    }
    
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(scriptInfo, null, 2),
        },
      ],
    };
  }

  private async handleAddScript(args: any) {
    this.registry.addScript(args);
    
    return {
      content: [
        {
          type: 'text',
          text: `Script '${args.name}' has been successfully added to the registry.`,
        },
      ],
    };
  }

  private async handleRemoveScript(args: any) {
    const { script_name } = args;
    
    this.registry.removeScript(script_name);
    
    return {
      content: [
        {
          type: 'text',
          text: `Script '${script_name}' has been successfully removed from the registry.`,
        },
      ],
    };
  }

  async run(): Promise<void> {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('AppleScript MCP Server running on stdio');
  }
}

const server = new AppleScriptMCPServer();
server.run().catch(console.error);
