import type { ToolDefinition } from "./types";
import { solanaTools } from "./solana";
import { marketTools } from "./market";
import { webSearchTool } from "./websearch";

const toolRegistry = new Map<string, ToolDefinition>();

function register(tool: ToolDefinition) {
  toolRegistry.set(tool.name, tool);
}

solanaTools.forEach(register);
marketTools.forEach(register);
register(webSearchTool);

export function getAllToolDefinitions() {
  return Array.from(toolRegistry.values()).map((t) => ({
    type: "function" as const,
    function: {
      name: t.name,
      description: t.description,
      parameters: t.parameters,
    },
  }));
}

export async function executeToolCall(
  name: string,
  args: Record<string, unknown>,
): Promise<string> {
  const tool = toolRegistry.get(name);
  if (!tool) {
    return JSON.stringify({ error: `Unknown tool: ${name}` });
  }
  try {
    const result = await tool.execute(args);
    return JSON.stringify(result);
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Tool execution failed";
    return JSON.stringify({ error: msg });
  }
}
