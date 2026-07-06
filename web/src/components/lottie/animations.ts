/**
 * SolKernal Motion System — hand-authored Lottie animations.
 *
 * These are production-ready Lottie JSON documents (the output format of the
 * DiffusionStudio `text-to-lottie` workflow), rendered on the web via
 * `lottie-web` per its README. Rather than ship generic, neon marketplace
 * loaders, every animation is built from the SAME visual primitives as the
 * product — the kernel chip, the orbiting node, the blueprint lattice — and
 * uses the design-system palette so motion reinforces the brand instead of
 * decorating it.
 *
 * Built with small typed helpers so each document stays valid, diff-able, and
 * free of copy-pasted JSON. Colours are baked RGB (0–1) chosen to read on both
 * the light (default) and dark themes.
 */

// A minimal, strict JSON shape — keeps the file free of `any` while remaining
// expressive enough to assemble Lottie documents.
export type LottieValue =
  | number
  | string
  | boolean
  | null
  | LottieValue[]
  | { [key: string]: LottieValue };
export type LottieData = { [key: string]: LottieValue };

// ── Palette (baked RGB, 0–1) ──────────────────────────────────────────────
const INK: number[] = [0.55, 0.55, 0.6]; // neutral, legible on light + dark
const ACCENT: number[] = [0.486, 0.227, 0.929]; // Solana violet
const OK: number[] = [0.13, 0.7, 0.5]; // emerald (yield/success)
const ERR: number[] = [0.92, 0.3, 0.3]; // fault red

const FPS = 60;

// ── Property helpers ───────────────────────────────────────────────────────
type Keyframe = { t: number; v: number[] };

function fixed(v: number | number[] | LottieData): LottieData {
  return { a: 0, k: v };
}

/** Animated multi-keyframe property with per-segment easing. */
function animated(keys: Keyframe[], ease: "ease" | "linear" = "ease"): LottieData {
  const ix = ease === "ease" ? 0.42 : 0.5;
  const iy = ease === "ease" ? 1 : 0.5;
  const ox = ease === "ease" ? 0.58 : 0.5;
  const oy = ease === "ease" ? 0 : 0.5;
  const dims = keys[0].v.length;
  const k: LottieData[] = keys.map((kf, idx) => {
    const node: LottieData = { t: kf.t, s: kf.v };
    if (idx < keys.length - 1) {
      node.i = { x: Array(dims).fill(ix), y: Array(dims).fill(iy) };
      node.o = { x: Array(dims).fill(ox), y: Array(dims).fill(oy) };
    }
    return node;
  });
  return { a: 1, k };
}

// ── Transform helpers ────────────────────────────────────────────────────-
type LayerTransform = {
  p?: number[];
  a?: number[];
  s?: LottieData | number[];
  r?: LottieData | number;
  o?: LottieData | number;
};

function isProp(v: unknown): v is LottieData {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

function layerTransform(opts: LayerTransform = {}): LottieData {
  return {
    o: isProp(opts.o) ? opts.o : fixed(typeof opts.o === "number" ? opts.o : 100),
    r: isProp(opts.r) ? opts.r : fixed(typeof opts.r === "number" ? opts.r : 0),
    p: fixed([...(opts.p ?? [100, 100]), 0]),
    a: fixed([...(opts.a ?? [0, 0]), 0]),
    s: Array.isArray(opts.s) ? fixed(opts.s) : opts.s ?? fixed([100, 100, 100]),
  };
}

function grTransform(opts: { p?: number[]; r?: number; s?: number[]; o?: number } = {}): LottieData {
  return {
    ty: "tr",
    p: fixed(opts.p ?? [0, 0]),
    a: fixed([0, 0]),
    s: fixed(opts.s ?? [100, 100]),
    r: fixed(opts.r ?? 0),
    o: fixed(opts.o ?? 100),
    sk: fixed(0),
    sa: fixed(0),
    nm: "tr",
  };
}

// ── Shape helpers ────────────────────────────────────────────────────────-
function ellipse(diameter: number, pos: number[] = [0, 0]): LottieData {
  return { ty: "el", d: 1, s: fixed([diameter, diameter]), p: fixed(pos), nm: "el" };
}

function rrect(w: number, h: number, radius: number, pos: number[] = [0, 0]): LottieData {
  return { ty: "rc", d: 1, s: fixed([w, h]), p: fixed(pos), r: fixed(radius), nm: "rc" };
}

function path(verts: number[][], closed = false): LottieData {
  return {
    ty: "sh",
    d: 1,
    nm: "sh",
    ks: fixed({
      i: verts.map(() => [0, 0]),
      o: verts.map(() => [0, 0]),
      v: verts,
      c: closed,
    }),
  };
}

function stroke(color: number[], width: number, opacity = 100): LottieData {
  return { ty: "st", c: fixed(color), o: fixed(opacity), w: fixed(width), lc: 2, lj: 2, ml: 4, bm: 0, nm: "st" };
}

function fill(color: number[], opacity = 100): LottieData {
  return { ty: "fl", c: fixed(color), o: fixed(opacity), r: 1, bm: 0, nm: "fl" };
}

function trim(start: number | LottieData, end: number | LottieData, offset = 0): LottieData {
  return {
    ty: "tm",
    s: isProp(start) ? start : fixed(start),
    e: isProp(end) ? end : fixed(end),
    o: fixed(offset),
    m: 1,
    nm: "tm",
  };
}

function group(items: LottieData[], tr?: LottieData): LottieData {
  return { ty: "gr", nm: "gr", bm: 0, it: [...items, tr ?? grTransform()] };
}

function shapeLayer(ind: number, nm: string, shapes: LottieData[], ks: LottieData, op: number): LottieData {
  return { ddd: 0, ind, ty: 4, nm, sr: 1, ks, ao: 0, shapes, ip: 0, op, st: 0, bm: 0 };
}

function build(nm: string, op: number, layers: LottieData[], w = 200, h = 200): LottieData {
  return { v: "5.9.0", fr: FPS, ip: 0, op, w, h, nm, ddd: 0, assets: [], layers };
}

// ── 1. AI thinking ─────────────────────────────────────────────────────────
// Three brand dots pulse in sequence inside a rotating quarter-arc and a quiet
// guide ring. Used while a skill executes against the LLM.
function thinkingDot(ind: number, x: number, phase: number): LottieData {
  const peak = 8 + phase;
  return shapeLayer(
    ind,
    "dot",
    [group([ellipse(15), fill(ACCENT)])],
    layerTransform({
      p: [x, 100],
      s: animated([
        { t: 0, v: [70, 70, 100] },
        { t: peak, v: [116, 116, 100] },
        { t: peak + 18, v: [70, 70, 100] },
        { t: 72, v: [70, 70, 100] },
      ]),
      o: animated([
        { t: 0, v: [50] },
        { t: peak, v: [100] },
        { t: peak + 18, v: [50] },
        { t: 72, v: [50] },
      ]),
    }),
    72,
  );
}

const aiThinking = build("ai-thinking", 72, [
  thinkingDot(1, 78, 0),
  thinkingDot(2, 100, 12),
  thinkingDot(3, 122, 24),
  shapeLayer(
    4,
    "arc",
    [group([ellipse(124), trim(0, 26), stroke(ACCENT, 6)])],
    layerTransform({ p: [100, 100], r: animated([{ t: 0, v: [0] }, { t: 72, v: [360] }], "linear") }),
    72,
  ),
  shapeLayer(5, "ring", [group([ellipse(124), stroke(INK, 2, 32)])], layerTransform({ p: [100, 100] }), 72),
]);

// ── 2. Success check ─────────────────────────────────────────────────────-
// A ring scales in, the checkmark draws along its path, then a soft pulse
// confirms. Plays once for completed executions / stakes.
const successCheck = build("success-check", 70, [
  shapeLayer(
    1,
    "check",
    [
      group([
        path([
          [76, 103],
          [92, 121],
          [128, 79],
        ]),
        trim(0, animated([{ t: 14, v: [0] }, { t: 40, v: [100] }])),
        stroke(OK, 9),
      ]),
    ],
    layerTransform({ p: [0, 0] }),
    70,
  ),
  shapeLayer(
    2,
    "ring",
    [group([ellipse(122), stroke(OK, 8)])],
    layerTransform({
      p: [100, 100],
      a: [100, 100],
      s: animated([
        { t: 0, v: [0, 0, 100] },
        { t: 14, v: [112, 112, 100] },
        { t: 24, v: [100, 100, 100] },
      ]),
      o: animated([{ t: 0, v: [0] }, { t: 6, v: [100] }]),
    }),
    70,
  ),
  shapeLayer(
    3,
    "pulse",
    [group([ellipse(122), stroke(OK, 4)])],
    layerTransform({
      p: [100, 100],
      a: [100, 100],
      s: animated([{ t: 18, v: [100, 100, 100] }, { t: 54, v: [178, 178, 100] }]),
      o: animated([{ t: 18, v: [50] }, { t: 54, v: [0] }]),
    }),
    70,
  ),
]);

// ── 3. Empty registry ─────────────────────────────────────────────────────
// A dashed kernel module with corner nodes and a search lens that breathes a
// pulse ring — "nothing matches yet" without a stock illustration.
const emptyRegistry = build("empty-registry", 120, [
  shapeLayer(
    1,
    "pulse",
    [group([ellipse(40), stroke(ACCENT, 3)])],
    layerTransform({
      p: [96, 92],
      a: [96, 92],
      s: animated([{ t: 0, v: [100, 100, 100] }, { t: 120, v: [215, 215, 100] }]),
      o: animated([{ t: 0, v: [55] }, { t: 92, v: [0] }, { t: 120, v: [0] }]),
    }),
    120,
  ),
  shapeLayer(2, "handle", [group([rrect(7, 16, 3), fill(ACCENT)], grTransform({ r: 45 }))], layerTransform({ p: [118, 116] }), 120),
  shapeLayer(3, "lens", [group([ellipse(40), stroke(ACCENT, 5)])], layerTransform({ p: [96, 92] }), 120),
  shapeLayer(4, "module", [group([rrect(150, 104, 16), stroke(INK, 2, 45)])], layerTransform({ p: [100, 100] }), 120),
  shapeLayer(
    5,
    "nodes",
    [
      group([ellipse(6), fill(INK, 55)], grTransform({ p: [60, 66] })),
      group([ellipse(6), fill(INK, 55)], grTransform({ p: [140, 66] })),
      group([ellipse(6), fill(INK, 55)], grTransform({ p: [60, 134] })),
      group([ellipse(6), fill(INK, 55)], grTransform({ p: [140, 134] })),
    ],
    layerTransform({ p: [0, 0] }),
    120,
  ),
]);

// ── 4. Error recovery ──────────────────────────────────────────────────────
// A fault chip with a "!" glyph, a rotating retry arc, and a fading pulse —
// communicates a recoverable error and the act of retrying.
const errorRecovery = build("error-recovery", 96, [
  shapeLayer(
    1,
    "retry",
    [group([ellipse(122), trim(0, 28), stroke(ERR, 5)])],
    layerTransform({ p: [100, 100], r: animated([{ t: 0, v: [0] }, { t: 96, v: [360] }], "linear") }),
    96,
  ),
  shapeLayer(
    2,
    "pulse",
    [group([ellipse(72), stroke(ERR, 3)])],
    layerTransform({
      p: [100, 100],
      a: [100, 100],
      s: animated([{ t: 0, v: [100, 100, 100] }, { t: 96, v: [182, 182, 100] }]),
      o: animated([{ t: 0, v: [50] }, { t: 70, v: [0] }, { t: 96, v: [0] }]),
    }),
    96,
  ),
  shapeLayer(
    3,
    "chip",
    [
      group([rrect(58, 58, 15), stroke(INK, 2, 70)], grTransform({ p: [100, 100] })),
      group([rrect(4, 18, 2), fill(ERR)], grTransform({ p: [100, 93] })),
      group([ellipse(5), fill(ERR)], grTransform({ p: [100, 107] })),
    ],
    layerTransform({ p: [0, 0] }),
    96,
  ),
]);

// ── 5. Kernel boot ─────────────────────────────────────────────────────────
// An orbiting node circles a breathing kernel chip wrapped by a spinning arc
// and pulse ring. Used as the app-level loading state.
const kernelBoot = build("kernel-boot", 90, [
  shapeLayer(
    1,
    "orbit",
    [group([ellipse(12), fill(ACCENT)], grTransform({ p: [0, -56] }))],
    layerTransform({ p: [100, 100], r: animated([{ t: 0, v: [0] }, { t: 90, v: [360] }], "linear") }),
    90,
  ),
  shapeLayer(
    2,
    "arc",
    [group([ellipse(98), trim(0, 30), stroke(ACCENT, 6)])],
    layerTransform({ p: [100, 100], r: animated([{ t: 0, v: [120] }, { t: 90, v: [480] }], "linear") }),
    90,
  ),
  shapeLayer(
    3,
    "chip",
    [
      group([rrect(54, 54, 14), stroke(ACCENT, 2.5)], grTransform({ p: [100, 100] })),
      group([rrect(28, 28, 7), stroke(ACCENT, 2)], grTransform({ p: [100, 100], r: 45 })),
      group([ellipse(8), fill(ACCENT)], grTransform({ p: [100, 100] })),
    ],
    layerTransform({
      p: [100, 100],
      a: [100, 100],
      s: animated([
        { t: 0, v: [96, 96, 100] },
        { t: 45, v: [104, 104, 100] },
        { t: 90, v: [96, 96, 100] },
      ]),
    }),
    90,
  ),
  shapeLayer(
    4,
    "pulse",
    [group([ellipse(60), stroke(ACCENT, 3)])],
    layerTransform({
      p: [100, 100],
      a: [100, 100],
      s: animated([{ t: 0, v: [100, 100, 100] }, { t: 90, v: [210, 210, 100] }]),
      o: animated([{ t: 0, v: [55] }, { t: 70, v: [0] }, { t: 90, v: [0] }]),
    }),
    90,
  ),
]);

// ── Registry ─────────────────────────────────────────────────────────────-
export const lottieAnimations = {
  "ai-thinking": aiThinking,
  "success-check": successCheck,
  "empty-registry": emptyRegistry,
  "error-recovery": errorRecovery,
  "kernel-boot": kernelBoot,
} satisfies Record<string, LottieData>;

export type LottieName = keyof typeof lottieAnimations;
