'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Button from '@/components/Button';
import Badge from '@/components/Badge';
import EmptyState from '@/components/graphics/EmptyState';
import LottiePlayer from '@/components/lottie/LottiePlayer';
import { SearchIcon, FilterIcon, RunIcon, ArrowRight } from '@/components/icons';
import { cn } from '@/lib/cn';

type Skill = {
  slug: string;
  name: string;
  category: string;
  fee: number;
  runs: number;
  provider: string;
  description: string;
  builderWallet: string;
};

const CATEGORIES = ['DeFi', 'Trading', 'Writing', 'Code', 'Research', 'Utility'];
const PROVIDERS = ['Cloudflare', 'Groq', 'Google', 'Grok'];

export default function SkillsPage() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedProviders, setSelectedProviders] = useState<string[]>([]);
  const [feeMin, setFeeMin] = useState('');
  const [feeMax, setFeeMax] = useState('');
  const [sort, setSort] = useState('popular');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    setLoadError('');
    fetch('/api/skills')
      .then(async (r) => {
        const data = await r.json().catch(() => null);
        if (!r.ok) throw new Error((data && data.error) || 'Failed to load skills');
        if (!Array.isArray(data)) throw new Error('Unexpected skills response');
        setSkills(data);
      })
      .catch((e: unknown) => {
        setSkills([]);
        setLoadError(e instanceof Error ? e.message : 'Failed to load skills');
      })
      .finally(() => setLoading(false));
  }, []);

  const toggleCategory = (cat: string) =>
    setSelectedCategories((prev) => (prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]));

  const toggleProvider = (p: string) =>
    setSelectedProviders((prev) => (prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]));

  const clearFilters = () => {
    setSearch('');
    setSelectedCategories([]);
    setSelectedProviders([]);
    setFeeMin('');
    setFeeMax('');
  };

  const filtered = useMemo(() => {
    const result = skills.filter((s) => {
      if (search && !s.name.toLowerCase().includes(search.toLowerCase())) return false;
      if (selectedCategories.length && !selectedCategories.includes(s.category)) return false;
      if (selectedProviders.length && !selectedProviders.includes(s.provider)) return false;
      if (feeMin && s.fee < parseFloat(feeMin)) return false;
      if (feeMax && s.fee > parseFloat(feeMax)) return false;
      return true;
    });
    if (sort === 'popular') result.sort((a, b) => b.runs - a.runs);
    else if (sort === 'fee-low') result.sort((a, b) => a.fee - b.fee);
    else if (sort === 'fee-high') result.sort((a, b) => b.fee - a.fee);
    else if (sort === 'newest') result.sort((a, b) => a.slug.localeCompare(b.slug));
    return result;
  }, [skills, search, selectedCategories, selectedProviders, feeMin, feeMax, sort]);

  const categoryCounts = CATEGORIES.map((cat) => ({ cat, count: skills.filter((s) => s.category === cat).length }));
  const activeFilterCount = selectedCategories.length + selectedProviders.length + (feeMin ? 1 : 0) + (feeMax ? 1 : 0) + (search ? 1 : 0);

  const fieldCls =
    'w-full rounded-md border border-border bg-bg-primary px-3 py-2 text-small font-mono text-text-primary placeholder:text-text-tertiary focus:border-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/40';

  const filterPanel = (
    <div className="space-y-6">
      <div>
        <label htmlFor="skill-search" className="sr-only">Search skills</label>
        <div className="relative">
          <SearchIcon size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" />
          <input
            id="skill-search"
            type="search"
            placeholder="Search skills…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={cn(fieldCls, 'pl-9')}
          />
        </div>
      </div>

      <fieldset>
        <legend className="mb-2.5 text-tiny font-semibold uppercase tracking-[0.14em] text-text-tertiary">Category</legend>
        <div className="space-y-1">
          {categoryCounts.map(({ cat, count }) => (
            <label
              key={cat}
              className="flex cursor-pointer items-center gap-2.5 rounded-md px-2 py-1.5 text-small text-text-secondary transition-colors hover:bg-bg-hover hover:text-text-primary"
            >
              <input
                type="checkbox"
                checked={selectedCategories.includes(cat)}
                onChange={() => toggleCategory(cat)}
                className="h-4 w-4 rounded accent-accent"
              />
              <span className="flex-1">{cat}</span>
              <span className="font-mono text-mono-sm text-text-tertiary">{count}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="mb-2.5 text-tiny font-semibold uppercase tracking-[0.14em] text-text-tertiary">Fee range ($SKRN)</legend>
        <div className="flex items-center gap-2">
          <input type="number" placeholder="Min" value={feeMin} onChange={(e) => setFeeMin(e.target.value)} step="0.01" className={fieldCls} aria-label="Minimum fee" />
          <span className="text-text-tertiary">–</span>
          <input type="number" placeholder="Max" value={feeMax} onChange={(e) => setFeeMax(e.target.value)} step="0.01" className={fieldCls} aria-label="Maximum fee" />
        </div>
      </fieldset>

      <fieldset>
        <legend className="mb-2.5 text-tiny font-semibold uppercase tracking-[0.14em] text-text-tertiary">LLM provider</legend>
        <div className="space-y-1">
          {PROVIDERS.map((p) => (
            <label
              key={p}
              className="flex cursor-pointer items-center gap-2.5 rounded-md px-2 py-1.5 text-small text-text-secondary transition-colors hover:bg-bg-hover hover:text-text-primary"
            >
              <input
                type="checkbox"
                checked={selectedProviders.includes(p)}
                onChange={() => toggleProvider(p)}
                className="h-4 w-4 rounded accent-accent"
              />
              <span>{p}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <Button variant="ghost" size="sm" onClick={clearFilters} fullWidth disabled={activeFilterCount === 0}>
        Clear filters{activeFilterCount > 0 ? ` (${activeFilterCount})` : ''}
      </Button>
    </div>
  );

  return (
    <div className="mx-auto max-w-content px-4 py-10 sm:px-6">
      {/* Header */}
      <div className="mb-8">
        <p className="font-mono text-tiny uppercase tracking-[0.16em] text-accent">Registry</p>
        <h1 className="mt-2 text-h1">Skill marketplace</h1>
        <p className="mt-2 max-w-prose text-body text-text-secondary">
          Browse the on-chain registry of AI skills. Filter by category, provider, and execution cost — then run any
          skill in seconds.
        </p>
      </div>

      {/* Mobile filter toggle */}
      <div className="mb-4 md:hidden">
        <button
          onClick={() => setFiltersOpen(!filtersOpen)}
          aria-expanded={filtersOpen}
          aria-controls="filter-panel"
          className="flex w-full items-center gap-2 rounded-md border border-border px-3 py-2.5 text-small font-medium text-text-secondary transition-colors hover:border-border-focused focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          <FilterIcon size={16} />
          Filters
          {activeFilterCount > 0 && <Badge tone="accent">{activeFilterCount}</Badge>}
          <span className="ml-auto text-text-tertiary">{filtersOpen ? '▲' : '▼'}</span>
        </button>
        {filtersOpen && (
          <div id="filter-panel" className="mt-2 rounded-lg border border-border bg-bg-subtle p-4">
            {filterPanel}
          </div>
        )}
      </div>

      <div className="flex gap-8">
        <aside className="hidden w-64 shrink-0 md:block">
          <div className="sticky top-20 rounded-lg border border-border bg-bg-subtle p-5">{filterPanel}</div>
        </aside>

        <div className="min-w-0 flex-1">
          <div className="mb-5 flex items-center justify-between gap-4">
            <p className="text-small text-text-secondary">
              {loading ? 'Loading…' : (
                <><span className="font-mono font-semibold text-text-primary">{filtered.length}</span> skill{filtered.length !== 1 ? 's' : ''}</>
              )}
            </p>
            <div className="flex items-center gap-2">
              <label htmlFor="sort-skills" className="text-small text-text-tertiary">Sort</label>
              <div className="relative">
                <select
                  id="sort-skills"
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="appearance-none rounded-md border border-border bg-bg-primary py-2 pl-3 pr-8 text-small font-mono text-text-primary focus:border-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
                >
                  <option value="popular">Most popular</option>
                  <option value="fee-low">Fee: low → high</option>
                  <option value="fee-high">Fee: high → low</option>
                  <option value="newest">Newest</option>
                </select>
                <svg className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-text-tertiary" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M6 9l6 6 6-6" /></svg>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="space-y-3 rounded-lg border border-border bg-bg-subtle p-5">
                  <div className="h-4 w-20 animate-pulse rounded bg-bg-hover" />
                  <div className="h-5 w-3/4 animate-pulse rounded bg-bg-hover" />
                  <div className="h-8 animate-pulse rounded bg-bg-hover" />
                  <div className="h-4 w-1/2 animate-pulse rounded bg-bg-hover" />
                </div>
              ))}
            </div>
          ) : loadError ? (
            <EmptyState
              title="Could not load skills"
              description={loadError}
              art={<LottiePlayer name="empty-registry" className="h-40 w-40" ariaLabel="Failed to load skills" />}
              action={
                <Button variant="secondary" onClick={() => window.location.reload()}>
                  Retry
                </Button>
              }
            />
          ) : filtered.length === 0 ? (
            <EmptyState
              title="No skills match your filters"
              description="Try widening your fee range or clearing a category to see more of the registry."
              art={<LottiePlayer name="empty-registry" className="h-40 w-40" ariaLabel="No matching skills" />}
              action={<Button variant="secondary" onClick={clearFilters}>Clear filters</Button>}
            />
          ) : (
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              {filtered.map((skill) => (
                <Link
                  key={skill.slug}
                  href={`/skills/${skill.slug}`}
                  className="group rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary"
                >
                  <article className="lift flex h-full flex-col rounded-lg border border-border bg-bg-subtle p-5 hover:border-border-focused hover:shadow-md">
                    <div className="flex items-center justify-between">
                      <Badge tone="accent" mono>{skill.category}</Badge>
                      <span className="font-mono text-small font-semibold text-text-primary">
                        {Number(skill.fee).toLocaleString(undefined, { maximumFractionDigits: 2 })} $SKRN
                      </span>
                    </div>
                    <h2 className="mt-3 flex items-center gap-1.5 font-semibold text-text-primary">
                      {skill.name}
                      <ArrowRight size={15} className="text-text-tertiary opacity-0 transition-all duration-200 ease-out-expo group-hover:translate-x-0.5 group-hover:opacity-100 group-hover:text-accent" />
                    </h2>
                    <p className="mt-1.5 line-clamp-2 text-small text-text-secondary">{skill.description}</p>
                    <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
                      <span className="font-mono text-mono-sm text-text-tertiary">
                        {skill.builderWallet.slice(0, 4)}…{skill.builderWallet.slice(-4)}
                      </span>
                      <span className="flex items-center gap-1.5 font-mono text-mono-sm text-text-secondary">
                        <RunIcon size={12} />
                        {skill.runs.toLocaleString()} runs
                      </span>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
