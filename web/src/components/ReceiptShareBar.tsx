"use client";

import { useMemo, useState } from "react";
import Button from "@/components/Button";
import { CopyIcon, CheckIcon } from "@/components/icons";
import { buildTweetText, twitterIntentUrl } from "@/lib/receiptShare";

type Props = {
  skillName: string;
  input: string;
  receiptPath: string;
  riskScore?: number | null;
  verdict?: string | null;
};

export default function ReceiptShareBar({
  skillName,
  input,
  receiptPath,
  riskScore = null,
  verdict = null,
}: Props) {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedTweet, setCopiedTweet] = useState(false);

  const absoluteUrl = useMemo(() => {
    if (typeof window !== "undefined") {
      return `${window.location.origin}${receiptPath}`;
    }
    const base = process.env.NEXT_PUBLIC_SITE_URL || "https://solkernal.xyz";
    return `${base.replace(/\/$/, "")}${receiptPath}`;
  }, [receiptPath]);

  const tweetText = useMemo(
    () =>
      buildTweetText({
        skillName,
        input,
        receiptUrl: absoluteUrl,
        riskScore,
        verdict,
      }),
    [skillName, input, absoluteUrl, riskScore, verdict],
  );

  const intent = twitterIntentUrl(tweetText);

  const copy = async (text: string, which: "link" | "tweet") => {
    try {
      await navigator.clipboard.writeText(text);
      if (which === "link") {
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 1600);
      } else {
        setCopiedTweet(true);
        setTimeout(() => setCopiedTweet(false), 1600);
      }
    } catch {
      /* clipboard blocked */
    }
  };

  return (
    <div className="rounded-xl border border-border bg-bg-subtle p-4 sm:p-5">
      <p className="font-mono text-tiny uppercase tracking-[0.16em] text-text-tertiary">Share this run</p>
      <p className="mt-1 text-small text-text-secondary">
        Every receipt is public content. Post the link — not financial advice.
      </p>
      <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
        <a href={intent} target="_blank" rel="noopener noreferrer" className="sm:flex-1">
          <Button variant="accent" fullWidth size="md" className="w-full">
            Post on X
          </Button>
        </a>
        <Button
          variant="secondary"
          size="md"
          onClick={() => void copy(tweetText, "tweet")}
          leadingIcon={copiedTweet ? <CheckIcon size={15} className="text-success" /> : <CopyIcon size={15} />}
          className="sm:flex-1"
        >
          {copiedTweet ? "Tweet text copied" : "Copy for X"}
        </Button>
        <Button
          variant="ghost"
          size="md"
          onClick={() => void copy(absoluteUrl, "link")}
          leadingIcon={copiedLink ? <CheckIcon size={15} className="text-success" /> : <CopyIcon size={15} />}
          className="sm:flex-1"
        >
          {copiedLink ? "Link copied" : "Copy link"}
        </Button>
      </div>
    </div>
  );
}
