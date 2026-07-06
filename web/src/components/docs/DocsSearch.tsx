"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { SearchIcon } from "@/components/icons";
import { docsSearchIndex } from "@/lib/docs";

export default function DocsSearch() {
  const [query, setQuery] = useState("");
  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return docsSearchIndex.slice(0, 6);
    return docsSearchIndex
      .filter((doc) => `${doc.title} ${doc.description} ${doc.category}`.toLowerCase().includes(q))
      .slice(0, 8);
  }, [query]);

  return (
    <div className="relative">
      <label htmlFor="docs-search" className="sr-only">
        Search docs
      </label>
      <div className="flex h-10 items-center gap-2 rounded-md border border-border bg-bg-primary px-3 text-text-secondary focus-within:border-border-focused">
        <SearchIcon size={16} className="shrink-0 text-text-tertiary" />
        <input
          id="docs-search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search docs"
          className="min-w-0 flex-1 bg-transparent text-small text-text-primary outline-none placeholder:text-text-tertiary"
        />
        <kbd className="hidden rounded border border-border bg-bg-subtle px-1.5 py-0.5 font-mono text-[10px] text-text-tertiary sm:inline">
          /
        </kbd>
      </div>

      {query.trim() && (
        <div className="absolute left-0 right-0 top-12 z-20 overflow-hidden rounded-lg border border-border bg-bg-elevated shadow-lg">
          {results.length ? (
            <ul className="max-h-80 overflow-y-auto p-1.5">
              {results.map((doc) => (
                <li key={doc.slug}>
                  <Link href={doc.href} className="block rounded-md px-3 py-2.5 transition-colors hover:bg-bg-hover">
                    <span className="block font-medium text-text-primary">{doc.title}</span>
                    <span className="mt-0.5 line-clamp-1 block text-small text-text-secondary">{doc.description}</span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="px-3 py-4 text-small text-text-secondary">No docs match that search.</p>
          )}
        </div>
      )}
    </div>
  );
}
