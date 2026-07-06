import type { Metadata } from "next";
import DocsShell from "@/components/docs/DocsShell";

export const metadata: Metadata = {
  title: "Documentation",
  description: "SolKernal developer documentation for skills, execution, staking, APIs, Blinks, security, and launch readiness.",
};

export default function DocsPage() {
  return <DocsShell />;
}
