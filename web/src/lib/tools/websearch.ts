import type { ToolDefinition } from "./types";

const TAVILY_API = "https://api.tavily.com/search";

export const webSearchTool: ToolDefinition = {
  name: "web_search",
  description:
    "Search the web for current information. Use this to fetch real-time data: token news, protocol updates, market conditions, project info, recent events, or any topic. Returns up to 5 results with titles, URLs, and content snippets.",
  parameters: {
    type: "object",
    properties: {
      query: {
        type: "string",
        description: "The search query (concise and specific)",
      },
    },
    required: ["query"],
  },
  execute: async (args) => {
    const query = String(args.query || "").trim();
    if (!query) {
      return { error: "Empty search query" };
    }

    const apiKey = process.env.TAVILY_API_KEY;
    if (!apiKey) {
      return { error: "Web search API key not configured" };
    }

    const resp = await fetch(TAVILY_API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        api_key: apiKey,
        query,
        search_depth: "advanced",
        include_answer: true,
        max_results: 5,
      }),
    });

    if (!resp.ok) {
      const text = await resp.text();
      return { error: `Tavily API error (${resp.status}): ${text.slice(0, 200)}` };
    }

    const data = (await resp.json()) as {
      answer?: string;
      results?: Array<{
        title: string;
        url: string;
        content: string;
        score: number;
      }>;
    };

    return {
      query,
      answer: data.answer || null,
      results: (data.results || []).map((r) => ({
        title: r.title,
        url: r.url,
        snippet: r.content.slice(0, 500),
      })),
    };
  },
};
