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
      // 引数をスクリプトに埋め込む
      const processedScript = this.processScriptWithArgs(script, args);
      
      // osascriptコマンドを実行（エスケープは1回のみ）
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
   * スクリプト内の引数プレースホルダーを実際の値に置換
   */
  private processScriptWithArgs(script: string, args: Record<string, any>): string {
    let processedScript = script;
    
    for (const [key, value] of Object.entries(args)) {
      const placeholder = `{{${key}}}`;
      // 文字列の場合はダブルクォートで囲む、それ以外はそのまま
      const stringValue = typeof value === 'string' ? `"${value}"` : String(value);
      processedScript = processedScript.replace(new RegExp(placeholder, 'g'), stringValue);
    }
    
    return processedScript;
  }

  /**
   * 引数の型検証
   */
  validateArgs(args: Record<string, any>, expectedArgs: ScriptArgument[]): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    for (const expectedArg of expectedArgs) {
      const value = args[expectedArg.name];
      
      // 必須引数のチェック
      if (expectedArg.required && (value === undefined || value === null)) {
        errors.push(`Required argument '${expectedArg.name}' is missing`);
        continue;
      }
      
      // デフォルト値の設定
      if (value === undefined && expectedArg.defaultValue !== undefined) {
        args[expectedArg.name] = expectedArg.defaultValue;
        continue;
      }
      
      // 型チェック
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
