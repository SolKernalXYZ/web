'use client';

import { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import { useRouter } from 'next/navigation';
import Button from '@/components/Button';
import Input, { Textarea, Select } from '@/components/Input';
import { SubmitIcon, RouterIcon, YieldIcon, ArrowRight } from '@/components/icons';

const sections = [
  { n: 1, Icon: SubmitIcon, title: 'Skill details' },
  { n: 2, Icon: RouterIcon, title: 'Model configuration' },
  { n: 3, Icon: YieldIcon, title: 'Pricing' },
];

export default function SubmitPage() {
  const { connected, publicKey } = useWallet();
  const { setVisible } = useWalletModal();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    name: '', category: '', description: '', tags: '', provider: 'Cloudflare', model: '', systemPrompt: '', outputFormat: '', fee: '', paymentToken: '$SKRN',
  });

  const set = (key: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm({ ...form, [key]: e.target.value });

  const submit = async () => {
    if (!connected || !publicKey) return;
    setError('');
    setSubmitting(true);
    try {
      const res = await fetch('/api/skills', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, fee: parseFloat(form.fee), builderWallet: publicKey.toBase58() }),
      });
      const data = await res.json();
      if (res.ok) router.push(`/skills/${data.slug}`);
      else setError(data.error || 'Submission failed');
    } catch { setError('Network error'); }
    finally { setSubmitting(false); }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <header>
        <p className="font-mono text-tiny uppercase tracking-[0.16em] text-accent">Submit.md</p>
        <h1 className="mt-2 text-h1">Publish a skill</h1>
        <p className="mt-2 max-w-prose text-body text-text-secondary">
          Register your AI skill to the SolKernal marketplace. Define a prompt, configure a model, set a price — and
          earn a share of every execution.
        </p>
      </header>

      {/* Section stepper */}
      <ol className="mt-8 flex items-center gap-2 text-small">
        {sections.map((s, i) => (
          <li key={s.n} className="flex items-center gap-2">
            <span className="inline-flex items-center gap-2 rounded-md border border-border bg-bg-subtle px-2.5 py-1.5 font-mono text-mono-sm text-text-secondary">
              <s.Icon size={14} className="text-accent" /> {s.title}
            </span>
            {i < sections.length - 1 && <ArrowRight size={14} className="text-text-tertiary" />}
          </li>
        ))}
      </ol>

      {error && (
        <div className="mt-6 flex items-start gap-2 rounded-lg border border-danger/40 bg-danger-subtle p-3 text-small text-danger" role="alert">
          <span className="mt-0.5 font-mono">!</span>
          <span>{error}</span>
        </div>
      )}

      <form
        onSubmit={(e) => { e.preventDefault(); submit(); }}
        className="mt-8 space-y-8"
      >
        <section className="rounded-xl border border-border bg-bg-subtle p-6">
          <h2 className="mb-5 flex items-center gap-2 text-h3"><span className="font-mono text-accent">01</span> Skill details</h2>
          <div className="space-y-4">
            <Input label="Skill name *" value={form.name} onChange={set('name')} placeholder="Token Sentiment Analyst" />
            <Select label="Category *" value={form.category} onChange={set('category')}>
              <option value="">Select category</option>
              <option value="DeFi">DeFi</option>
              <option value="Trading">Trading</option>
              <option value="Writing">Writing</option>
              <option value="Code">Code</option>
              <option value="Research">Research</option>
              <option value="Utility">Utility</option>
            </Select>
            <Textarea label="Description *" value={form.description} onChange={set('description')} placeholder="What does this skill do, and what does it return?" />
            <Input label="Tags" value={form.tags} onChange={set('tags')} placeholder="comma, separated, tags" hint="Helps users discover your skill." />
          </div>
        </section>

        <section className="rounded-xl border border-border bg-bg-subtle p-6">
          <h2 className="mb-5 flex items-center gap-2 text-h3"><span className="font-mono text-accent">02</span> Model configuration</h2>
          <div className="space-y-4">
            <Select label="LLM Provider *" value={form.provider} onChange={(e) => { set('provider')(e); setForm(f => ({ ...f, model: '' })); }}>
              <option value="Cloudflare">Cloudflare Workers AI</option>
              <option value="Google">Google Gemini</option>
            </Select>
            <Select label="Model *" value={form.model} onChange={set('model')}>
              <option value="">Select model</option>
              {form.provider === 'Google' ? (
                <>
                  <option value="gemini-2.5-flash">Gemini 2.5 Flash</option>
                  <option value="gemini-2.5-flash-lite">Gemini 2.5 Flash-Lite</option>
                  <option value="gemini-2.5-pro">Gemini 2.5 Pro</option>
                </>
              ) : (
                <>
                  <option value="@cf/meta/llama-3.1-8b-instruct-fast">Llama 3.1 8B (General)</option>
                  <option value="@cf/meta/llama-4-scout-17b-16e-instruct">Llama 4 Scout 17B (Complex)</option>
                  <option value="@cf/qwen/qwen2.5-coder-32b-instruct">Qwen 2.5 Coder 32B (Code)</option>
                  <option value="@cf/deepseek-ai/deepseek-r1-distill-qwen-32b">DeepSeek R1 32B (Reasoning)</option>
                </>
              )}
            </Select>
            <Textarea label="System prompt *" value={form.systemPrompt} onChange={set('systemPrompt')} rows={8} className="font-mono text-mono" placeholder="You are a..." />
            <Select label="Output format *" value={form.outputFormat} onChange={set('outputFormat')}>
              <option value="">Select format</option>
              <option value="plaintext">plaintext</option>
              <option value="markdown">markdown</option>
              <option value="json">json</option>
            </Select>
          </div>
        </section>

        <section className="rounded-xl border border-border bg-bg-subtle p-6">
          <h2 className="mb-5 flex items-center gap-2 text-h3"><span className="font-mono text-accent">03</span> Pricing</h2>
          <div className="space-y-4">
            <Input label="Execution fee ($SKRN) *" type="number" min="0.10" step="0.01" value={form.fee} onChange={set('fee')} placeholder="500" />
            <fieldset>
              <legend className="mb-2 text-small font-medium text-text-secondary">Payment token</legend>
              <div className="flex gap-3">
                {['$SKRN'].map((tok) => (
                  <label
                    key={tok}
                    className={`flex flex-1 cursor-pointer items-center gap-2 rounded-md border px-4 py-3 text-body transition-colors ${form.paymentToken === tok ? 'border-accent bg-accent-subtle text-text-primary' : 'border-border text-text-secondary hover:border-border-strong'}`}
                  >
                    <input type="radio" name="paymentToken" value={tok} checked={form.paymentToken === tok} onChange={set('paymentToken')} className="h-4 w-4 accent-accent" />
                    {tok}
                  </label>
                ))}
              </div>
            </fieldset>
            <div className="flex items-center justify-between rounded-lg border border-border bg-bg-primary px-4 py-3 text-small">
              <span className="text-text-secondary">You receive per execution</span>
              <span className="font-mono font-semibold text-success">
                {form.fee ? `${(parseFloat(form.fee) * 0.3).toFixed(2)} ${form.paymentToken}` : '30%'}
              </span>
            </div>
          </div>
        </section>

        <div className="flex flex-col items-start gap-3 border-t border-border pt-6">
          {connected ? (
            <Button type="submit" size="lg" variant="accent" loading={submitting} trailingIcon={!submitting ? <ArrowRight size={18} /> : undefined}>
              {submitting ? 'Submitting…' : 'Submit skill'}
            </Button>
          ) : (
            <Button type="button" size="lg" onClick={() => setVisible(true)}>Connect wallet to submit</Button>
          )}
          <p className="text-small text-text-tertiary">A connected wallet assigns builder ownership and your fee share.</p>
        </div>
      </form>
    </div>
  );
}
