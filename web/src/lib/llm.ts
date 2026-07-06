import OpenAI from "openai";
import { getAllToolDefinitions, executeToolCall } from "./tools/index";

const TEXT_TOOL_RE = /\{\s*"name"\s*:\s*"?([a-zA-Z_]\w*)"?\s*,\s*"parameters"\s*:\s*(\{[\s\S]*?\})\s*\}/;

export interface LLMRequest {
  provider: string;
  model: string;
  systemPrompt: string;
  userInput: string;
}

export interface LLMResponse {
  output: string;
  tokensUsed?: number;
  mocked: boolean;
}

const MODELS_WITH_TOOLS: string[] = [
  "@cf/meta/llama-4-scout-17b-16e-instruct",
  "@cf/moonshotai/kimi-k2.6",
  "@cf/moonshotai/kimi-k2.7-code",
  "@cf/zai-org/glm-4.7-flash",
  "@cf/openai/gpt-oss-120b",
  "@cf/openai/gpt-oss-20b",
];

function supportsTools(model: string) {
  return MODELS_WITH_TOOLS.some((m) => model.includes(m.replace("@cf/", "")) || model === m);
}

function getCredentials() {
  const apiKey = process.env.CLOUDFLARE_API_TOKEN;
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
  if (!apiKey || !accountId) return null;
  return { apiKey, accountId };
}

let client: OpenAI | null = null;

function getClient(creds: { apiKey: string; accountId: string }) {
  if (!client) {
    client = new OpenAI({
      apiKey: creds.apiKey,
      baseURL: `https://api.cloudflare.com/client/v4/accounts/${creds.accountId}/ai/v1`,
    });
  }
  return client;
}

function mockResponse(req: LLMRequest, reason: string): LLMResponse {
  const preview = req.userInput.slice(0, 280);
  const output = [
    "⚠️ Mock response — no live LLM was called.",
    `Reason: ${reason}.`,
    "",
    `Skill model: ${req.model}`,
    `Input received: ${preview || "(empty)"}`,
    "",
    "Configure CLOUDFLARE_API_TOKEN and CLOUDFLARE_ACCOUNT_ID to enable real execution.",
  ].join("\n");
  return { output, mocked: true };
}

function parseTextToolCall(
  content: string,
): { name: string; args: Record<string, unknown> } | null {
  const match = content.match(TEXT_TOOL_RE);
  if (!match) return null;
  try {
    const name = match[1];
    const args = JSON.parse(match[2]);
    return { name, args };
  } catch {
    return null;
  }
}

export async function executeLLM(req: LLMRequest): Promise<LLMResponse> {
  const creds = getCredentials();
  if (!creds) {
    return mockResponse(req, "missing Cloudflare Workers AI credentials");
  }

  try {
    const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
      { role: "system", content: req.systemPrompt },
      { role: "user", content: req.userInput },
    ];

    const tools = supportsTools(req.model)
      ? getAllToolDefinitions()
      : undefined;

    const response = await getClient(creds).chat.completions.create({
      model: req.model,
      messages,
      tools,
      tool_choice: tools ? "auto" : undefined,
      max_tokens: 4096,
    });

    const message = response.choices[0]?.message;
    if (!message) {
      return { output: "", mocked: false };
    }

    const toolCalls = message.tool_calls?.filter(
      (tc): tc is OpenAI.Chat.Completions.ChatCompletionMessageFunctionToolCall =>
        "function" in tc,
    );

    const textToolCall = !toolCalls?.length ? parseTextToolCall(message.content || "") : null;

    const hasToolCall = (toolCalls && toolCalls.length > 0) || textToolCall;

    if (hasToolCall) {
      const toolMessages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] =
        [
          ...messages,
          {
            role: "assistant",
            content: message.content,
            tool_calls: toolCalls?.length ? toolCalls : undefined,
          } as OpenAI.Chat.Completions.ChatCompletionAssistantMessageParam,
        ];

      if (toolCalls?.length) {
        for (const tc of toolCalls) {
          let args: Record<string, unknown> = {};
          try {
            args = JSON.parse(tc.function.arguments);
          } catch {
            args = {};
          }
          const result = await executeToolCall(tc.function.name, args);
          toolMessages.push({
            role: "tool",
            tool_call_id: tc.id,
            content: result,
          } as OpenAI.Chat.Completions.ChatCompletionToolMessageParam);
        }
      }

      if (textToolCall) {
        const result = await executeToolCall(textToolCall.name, textToolCall.args);
        toolMessages.push({
          role: "tool",
          tool_call_id: `text_tool_${Date.now()}`,
          content: result,
        } as OpenAI.Chat.Completions.ChatCompletionToolMessageParam);
      }

      const finalResponse = await getClient(creds).chat.completions.create({
        model: req.model,
        messages: toolMessages,
        max_tokens: 4096,
      });

      return {
        output: finalResponse.choices[0]?.message?.content || "",
        tokensUsed:
          (response.usage?.total_tokens || 0) +
          (finalResponse.usage?.total_tokens || 0),
        mocked: false,
      };
    }

    return {
      output: message.content || "",
      tokensUsed: response.usage?.total_tokens,
      mocked: false,
    };
  } catch (e: unknown) {
    const errorMsg = e instanceof Error ? e.message : "unknown upstream error";
    return mockResponse(req, `LLM provider error (${errorMsg})`);
  }
}
