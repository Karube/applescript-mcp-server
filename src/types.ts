export interface ScriptArgument {
  name: string;
  type: 'string' | 'number' | 'boolean';
  description: string;
  required?: boolean;
  defaultValue?: string | number | boolean;
}

export interface ScriptInfo {
  name: string;
  script: string;
  description: string;
  args: ScriptArgument[];
  usage: string;
  category?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ScriptRegistry {
  [key: string]: ScriptInfo;
}

export interface ExecutionResult {
  success: boolean;
  output?: string;
  error?: string;
  executionTime: number;
}

export interface AddScriptRequest {
  name: string;
  script: string;
  description: string;
  args?: ScriptArgument[];
  usage?: string;
  category?: string;
}
