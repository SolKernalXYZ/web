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
  "gemini-2.5-flash",
  "gemini-2.5-flash-lite",
  "gemini-2.5-pro",
  "grok-4.5",
  "grok-4-1-fast-reasoning",
  "grok-4-1-fast-non-reasoning",
  "grok-3",
  "grok-3-mini",
];

function supportsTools(model: string) {
  return MODELS_WITH_TOOLS.some((m) => model.includes(m.replace("@cf/", "")) || model === m);
}

type CloudflareCreds = { provider: "cloudflare"; apiKey: string; accountId: string };
type GroqCreds = { provider: "groq"; apiKey: string };
type GoogleCreds = { provider: "google"; apiKey: string };
type GrokCreds = { provider: "grok"; apiKey: string };

function getCloudflareCredentials(): CloudflareCreds | null {
  const apiKey = process.env.CLOUDFLARE_API_TOKEN;
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
  if (!apiKey || !accountId) return null;
  return { provider: "cloudflare", apiKey, accountId };
}

function getGroqCredentials(): GroqCreds | null {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) return null;
  return { provider: "groq", apiKey };
}

function getGoogleCredentials(): GoogleCreds | null {
  const apiKey = process.env.GOOGLE_API_KEY;
  if (!apiKey) return null;
  return { provider: "google", apiKey };
}

function getGrokCredentials(): GrokCreds | null {
  const apiKey = process.env.XAI_API_KEY;
  if (!apiKey) return null;
  return { provider: "grok", apiKey };
}

let cfClient: OpenAI | null = null;
let groqClient: OpenAI | null = null;
let googleClient: OpenAI | null = null;
let grokClient: OpenAI | null = null;

function getClient(provider: string) {
  if (provider === "google") {
    const creds = getGoogleCredentials();
    if (!creds) return null;
    if (!googleClient) {
      googleClient = new OpenAI({
        apiKey: creds.apiKey,
        baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
      });
    }
    return googleClient;
  }

  if (provider === "groq") {
    const creds = getGroqCredentials();
    if (!creds) return null;
    if (!groqClient) {
      groqClient = new OpenAI({
        apiKey: creds.apiKey,
        baseURL: "https://api.groq.com/openai/v1",
      });
    }
    return groqClient;
  }

  if (provider === "grok") {
    const creds = getGrokCredentials();
    if (!creds) return null;
    if (!grokClient) {
      grokClient = new OpenAI({
        apiKey: creds.apiKey,
        baseURL: "https://api.x.ai/v1",
      });
    }
    return grokClient;
  }

  const creds = getCloudflareCredentials();
  if (!creds) return null;
  if (!cfClient) {
    cfClient = new OpenAI({
      apiKey: creds.apiKey,
      baseURL: `https://api.cloudflare.com/client/v4/accounts/${creds.accountId}/ai/v1`,
    });
  }
  return cfClient;
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
    "Configure CLOUDFLARE_API_TOKEN + CLOUDFLARE_ACCOUNT_ID, GROQ_API_KEY, GOOGLE_API_KEY, or XAI_API_KEY to enable real execution.",
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

async function callLLM(
  provider: string,
  model: string,
  messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[],
  tools: OpenAI.Chat.Completions.ChatCompletionTool[] | undefined,
) {
  const client = getClient(provider);
  if (!client) return null;
  return client.chat.completions.create({
    model,
    messages,
    tools,
    tool_choice: tools ? "auto" : undefined,
    max_tokens: 4096,
  });
}

function resolveProvider(raw: string | undefined): "cloudflare" | "groq" | "google" | "grok" {
  const p = raw?.toLowerCase().trim() ?? "";
  if (p === "groq") return "groq";
  if (p === "google") return "google";
  if (p === "grok" || p === "xai" || p === "x.ai") return "grok";
  return "cloudflare";
}

export async function executeLLM(req: LLMRequest): Promise<LLMResponse> {
  const provider = resolveProvider(req.provider);

  if (provider === "google" && !getGoogleCredentials()) {
    return mockResponse(req, "missing GOOGLE_API_KEY");
  }
  if (provider === "groq" && !getGroqCredentials()) {
    return mockResponse(req, "missing GROQ_API_KEY");
  }
  if (provider === "grok" && !getGrokCredentials()) {
    return mockResponse(req, "missing XAI_API_KEY");
  }
  if (provider === "cloudflare" && !getCloudflareCredentials()) {
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

    const response = await callLLM(provider, req.model, messages, tools);
    if (!response) {
      return mockResponse(req, "failed to create LLM client");
    }

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

      const finalResponse = await callLLM(provider, req.model, toolMessages, undefined);
      if (!finalResponse) {
        return mockResponse(req, "failed to call LLM for tool response");
      }

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
