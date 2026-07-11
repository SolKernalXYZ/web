/**
 * Parse execution output for shareable highlights (risk score, verdict).
 * Best-effort — models vary in format; never invent numbers.
 */

export type ReceiptHighlights = {
  riskScore: number | null;
  verdict: string | null;
  summary: string | null;
};

function clampScore(n: number): number | null {
  if (!Number.isFinite(n)) return null;
  if (n < 0 || n > 100) return null;
  return Math.round(n);
}

export function parseReceiptHighlights(output: string): ReceiptHighlights {
  if (!output || typeof output !== "string") {
    return { riskScore: null, verdict: null, summary: null };
  }

  let riskScore: number | null = null;
  let verdict: string | null = null;
  let summary: string | null = null;

  // Risk Score: 72 | risk_score": 72 | Risk Score (0-100): 72
  const scorePatterns = [
    /risk\s*score[^0-9]{0,20}(\d{1,3})/i,
    /["']risk_score["']\s*:\s*(\d{1,3})/i,
    /score\s*[:=]\s*(\d{1,3})\s*\/\s*100/i,
    /\b(\d{1,3})\s*\/\s*100\b/,
  ];
  for (const re of scorePatterns) {
    const m = output.match(re);
    if (m) {
      riskScore = clampScore(Number(m[1]));
      if (riskScore != null) break;
    }
  }

  // Verdict: AVOID | "verdict": "CAUTION"
  const verdictPatterns = [
    /\bverdict\s*[:\-–—]\s*[*_]*([A-Z][A-Z0-9 /_-]{2,40})/i,
    /["']verdict["']\s*:\s*["']([^"']{2,48})["']/i,
    /\boverall_verdict\s*[:\-–—]\s*[*_]*([A-Za-z][A-Za-z0-9 /_-]{2,40})/i,
    /["']overall_verdict["']\s*:\s*["']([^"']{2,48})["']/i,
    /\bsignal\s*[:\-–—]\s*[*_]*(BULLISH|BEARISH|NEUTRAL)/i,
  ];
  for (const re of verdictPatterns) {
    const m = output.match(re);
    if (m?.[1]) {
      verdict = m[1].replace(/[*_]/g, "").trim().toUpperCase().slice(0, 48);
      break;
    }
  }

  // Short summary line if present
  const summaryMatch =
    output.match(/\bsummary\s*[:\-–—]\s*(.+?)(?:\n|$)/i) ||
    output.match(/["']summary["']\s*:\s*["']([^"']{10,200})["']/i);
  if (summaryMatch?.[1]) {
    summary = summaryMatch[1].replace(/[*_`]/g, "").trim().slice(0, 160);
  }

  return { riskScore, verdict, summary };
}

export function riskTone(
  score: number | null,
): "success" | "warning" | "danger" | "neutral" {
  if (score == null) return "neutral";
  if (score >= 70) return "danger";
  if (score >= 40) return "warning";
  return "success";
}

/** Prefill for X / Twitter compose. */
export function buildTweetText(opts: {
  skillName: string;
  input: string;
  receiptUrl: string;
  riskScore?: number | null;
  verdict?: string | null;
}): string {
  const shortInput =
    opts.input.length > 44 ? `${opts.input.slice(0, 8)}…${opts.input.slice(-6)}` : opts.input;

  const bits: string[] = [];
  bits.push(`${opts.skillName} on SolKernal`);
  if (opts.riskScore != null) bits.push(`Risk ${opts.riskScore}/100`);
  if (opts.verdict) bits.push(opts.verdict);
  bits.push(`Input: ${shortInput}`);

  const head = bits.join(" · ");
  const body = `${head}\n\n${opts.receiptUrl}\n\nDon't ape blind. Run the desk.\n$SKRN`;
  // X hard limit ~280; leave headroom
  return body.length > 270 ? `${head}\n\n${opts.receiptUrl}\n$SKRN` : body;
}

export function twitterIntentUrl(text: string): string {
  return `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
}
