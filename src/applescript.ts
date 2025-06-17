import { exec } from 'child_process';
import { promisify } from 'util';
import { ExecutionResult, ScriptArgument } from './types';

const execAsync = promisify(exec);

export class AppleScriptExecutor {
  private timeout: number;

  constructor(timeout: number = 30000) {
    this.timeout = timeout;
  }

  async execute(script: string, args: Record<string, any> = {}): Promise<ExecutionResult> {
    const startTime = Date.now();
    
    try {
      // Embed arguments into the script
      const processedScript = this.processScriptWithArgs(script, args);
      
      // Execute osascript command (escape only once)
      const command = `osascript -e ${JSON.stringify(processedScript)}`;
      
      const { stdout, stderr } = await execAsync(command, {
        timeout: this.timeout,
        encoding: 'utf8'
      });

      const executionTime = Date.now() - startTime;

      if (stderr && stderr.trim()) {
        return {
          success: false,
          error: stderr.trim(),
          executionTime
        };
      }

      return {
        success: true,
        output: stdout.trim(),
        executionTime
      };

    } catch (error: any) {
      const executionTime = Date.now() - startTime;
      
      return {
        success: false,
        error: error.message || 'Unknown execution error',
        executionTime
      };
    }
  }

  /**
   * Replace argument placeholders in the script with actual values
   */
  private processScriptWithArgs(script: string, args: Record<string, any>): string {
    let processedScript = script;
    
    for (const [key, value] of Object.entries(args)) {
      const placeholder = `{{${key}}}`;
      // Wrap strings in double quotes, others remain as-is
      const stringValue = typeof value === 'string' ? `"${value}"` : String(value);
      processedScript = processedScript.replace(new RegExp(placeholder, 'g'), stringValue);
    }
    
    return processedScript;
  }

  /**
   * Validate argument types
   */
  validateArgs(args: Record<string, any>, expectedArgs: ScriptArgument[]): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    for (const expectedArg of expectedArgs) {
      const value = args[expectedArg.name];
      
      // Check required arguments
      if (expectedArg.required && (value === undefined || value === null)) {
        errors.push(`Required argument '${expectedArg.name}' is missing`);
        continue;
      }
      
      // Set default values
      if (value === undefined && expectedArg.defaultValue !== undefined) {
        args[expectedArg.name] = expectedArg.defaultValue;
        continue;
      }
      
      // Type checking
      if (value !== undefined) {
        const actualType = typeof value;
        if (expectedArg.type !== actualType) {
          errors.push(`Argument '${expectedArg.name}' should be ${expectedArg.type}, got ${actualType}`);
        }
      }
    }
    
    return {
      valid: errors.length === 0,
      errors
    };
  }
}
