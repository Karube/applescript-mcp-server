import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';
import { ScriptInfo, ScriptRegistry, AddScriptRequest } from './types';

export class ScriptRegistryManager {
  private registryPath: string;
  private registry: ScriptRegistry = {};

  constructor(registryPath?: string) {
    this.registryPath = registryPath || join(process.cwd(), 'scripts-registry.json');
    this.loadRegistry();
  }

  private loadRegistry(): void {
    try {
      if (existsSync(this.registryPath)) {
        const data = readFileSync(this.registryPath, 'utf8');
        this.registry = JSON.parse(data);
      } else {
        this.initializeWithDefaults();
      }
    } catch (error) {
      console.error('Failed to load script registry:', error);
      this.initializeWithDefaults();
    }
  }

  private initializeWithDefaults(): void {
    this.registry = {
      'show_notification': {
        name: 'show_notification',
        script: 'display notification "{{message}}" with title "{{title}}"',
        description: 'Display macOS notification',
        args: [
          { name: 'message', type: 'string', description: 'Notification message', required: true },
          { name: 'title', type: 'string', description: 'Notification title', required: false, defaultValue: 'Notification' }
        ],
        usage: 'show_notification(message="Hello", title="My App")',
        category: 'ui',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      'get_frontmost_app': {
        name: 'get_frontmost_app',
        script: 'tell application "System Events" to get name of first application process whose frontmost is true',
        description: 'Get the frontmost application name',
        args: [],
        usage: 'get_frontmost_app()',
        category: 'system',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    };
    this.saveRegistry();
  }

  private saveRegistry(): void {
    try {
      writeFileSync(this.registryPath, JSON.stringify(this.registry, null, 2), 'utf8');
    } catch (error) {
      console.error('Failed to save script registry:', error);
      throw new Error('Failed to save script registry');
    }
  }

  getAllScripts(): ScriptInfo[] {
    return Object.values(this.registry);
  }

  getScript(name: string): ScriptInfo | undefined {
    return this.registry[name];
  }

  addScript(request: AddScriptRequest): void {
    if (this.registry[request.name]) {
      throw new Error(`Script '${request.name}' already exists`);
    }

    const now = new Date().toISOString();
    const scriptInfo: ScriptInfo = {
      name: request.name,
      script: request.script,
      description: request.description,
      args: request.args || [],
      usage: request.usage || `${request.name}()`,
      category: request.category,
      createdAt: now,
      updatedAt: now
    };

    this.registry[request.name] = scriptInfo;
    this.saveRegistry();
  }

  updateScript(name: string, updates: Partial<AddScriptRequest>): void {
    if (!this.registry[name]) {
      throw new Error(`Script '${name}' not found`);
    }

    const existing = this.registry[name];
    this.registry[name] = {
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString()
    };

    this.saveRegistry();
  }

  removeScript(name: string): void {
    if (!this.registry[name]) {
      throw new Error(`Script '${name}' not found`);
    }

    delete this.registry[name];
    this.saveRegistry();
  }

  getScriptsByCategory(category: string): ScriptInfo[] {
    return Object.values(this.registry).filter(script => script.category === category);
  }

  searchScripts(keyword: string): ScriptInfo[] {
    const lowerKeyword = keyword.toLowerCase();
    return Object.values(this.registry).filter(script =>
      script.name.toLowerCase().includes(lowerKeyword) ||
      script.description.toLowerCase().includes(lowerKeyword)
    );
  }

  getScriptNames(): string[] {
    return Object.keys(this.registry);
  }
}

export default ScriptRegistryManager;
