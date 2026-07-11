import { ImageResponse } from "next/og";
import { prisma } from "@/lib/db";
import { parseReceiptHighlights } from "@/lib/receiptShare";

export const runtime = "nodejs";
export const alt = "SolKernal execution receipt";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

type Props = { params: { id: string } };

export default async function Image({ params }: Props) {
  const id = params.id;
  let skillName = "Execution receipt";
  let input = "";
  let status = "unknown";
  let riskScore: number | null = null;
  let verdict: string | null = null;

  if (id && id.length <= 40) {
    try {
      const exec = await prisma.execution.findUnique({
        where: { id },
        select: {
          input: true,
          output: true,
          status: true,
          skill: { select: { name: true } },
        },
      });
      if (exec) {
        skillName = exec.skill.name;
        input = exec.input;
        status = exec.status;
        const h = parseReceiptHighlights(exec.output);
        riskScore = h.riskScore;
        verdict = h.verdict;
      }
    } catch {
      /* fall through to defaults */
    }
  }

  const shortInput =
    input.length > 52 ? `${input.slice(0, 20)}…${input.slice(-12)}` : input || "—";

  const scoreColor =
    riskScore == null ? "#a1a1aa" : riskScore >= 70 ? "#f87171" : riskScore >= 40 ? "#fbbf24" : "#4ade80";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "linear-gradient(145deg, #09090b 0%, #18181b 55%, #0c1222 100%)",
          color: "#fafafa",
          padding: "56px 64px",
          fontFamily: "ui-sans-serif, system-ui, sans-serif",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div
              style={{
                display: "flex",
                fontSize: 22,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "#818cf8",
                fontFamily: "ui-monospace, monospace",
              }}
            >
              SolKernal · public receipt
            </div>
            <div style={{ display: "flex", fontSize: 52, fontWeight: 700, lineHeight: 1.1, maxWidth: 780 }}>
              {skillName}
            </div>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
              gap: 8,
            }}
          >
            <div
              style={{
                display: "flex",
                fontSize: 18,
                color: "#a1a1aa",
                fontFamily: "ui-monospace, monospace",
                textTransform: "uppercase",
              }}
            >
              {status}
            </div>
            {riskScore != null && (
              <div
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  gap: 8,
                  color: scoreColor,
                }}
              >
                <span style={{ fontSize: 72, fontWeight: 700, fontFamily: "ui-monospace, monospace" }}>
                  {riskScore}
                </span>
                <span style={{ fontSize: 24, color: "#71717a" }}>/100 risk</span>
              </div>
            )}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {verdict && (
            <div
              style={{
                display: "flex",
                fontSize: 28,
                fontWeight: 600,
                color: scoreColor,
                fontFamily: "ui-monospace, monospace",
              }}
            >
              Verdict: {verdict}
            </div>
          )}
          <div
            style={{
              display: "flex",
              fontSize: 26,
              color: "#d4d4d8",
              fontFamily: "ui-monospace, monospace",
            }}
          >
            Input: {shortInput}
          </div>
          <div style={{ display: "flex", fontSize: 22, color: "#71717a" }}>
            Don&apos;t ape blind. Run the desk. · solkernal.xyz
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
