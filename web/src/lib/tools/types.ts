export interface ToolDefinition {
  name: string;
  description: string;
  parameters: Record<string, unknown>;
  execute: (args: Record<string, unknown>) => Promise<Record<string, unknown>>;
}

export interface ToolResult {
  tool_call_id: string;
  output: string;
}
