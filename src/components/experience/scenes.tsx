"use client";

import type { ActDef } from "@/content/structure";

/**
 * SIGNATURE SCENES.
 *
 * Every scene is a static SVG whose state is a function of one custom property,
 * `--p` (0 → 1), written by the scroller. Nothing here reads the clock, so the
 * same markup serves the scrubbed experience and the reduced-motion reading,
 * where `--p` is simply parked at its resting value.
 */

type SceneProps = { act: ActDef };

/** Rounded so server and client markup are byte-identical. */
const r2 = (n: number) => Math.round(n * 100) / 100;

/* ---- I. The cadence and its break --------------------------------------- */
function Cadence() {
  const beats = [0, 1, 2, 3, 4, 5];
  return (
    <svg viewBox="0 0 400 320" className="sc sc-cadence" aria-hidden="true">
      {beats.map((i) => (
        <g key={i} className="sc-beat" style={{ ["--i" as string]: i }}>
          <line x1="80" y1={30 + i * 38} x2="320" y2={30 + i * 38} />
          <circle cx="330" cy={30 + i * 38} r="3" />
        </g>
      ))}
      <g className="sc-break">
        <line x1="80" y1="278" x2="320" y2="278" strokeDasharray="3 7" />
      </g>
    </svg>
  );
}

/* ---- II / XIII. The walk ------------------------------------------------- */
function Walk({ descending = false }: { descending?: boolean }) {
  const H = 320;
  const base = descending ? 44 : H - 44;
  const lift = descending ? 1 : -1;
  const steps = 7;
  const span = 400 / steps;
  let d = `M 0 ${base}`;
  const pts: [number, number][] = [];
  for (let i = 0; i < steps; i++) {
    const x0 = i * span;
    const x1 = x0 + span;
    const y = base + (i + 1) * ((H - 130) / steps) * lift;
    const apex = y + lift * span * 0.26;
    d += ` C ${x0 + span * 0.3} ${apex}, ${x1 - span * 0.3} ${apex}, ${x1} ${y}`;
    pts.push([x1, y]);
  }
  return (
    <svg viewBox="0 0 400 320" className={`sc sc-walk${descending ? " is-down" : ""}`} aria-hidden="true">
      <line className="sc-walk-base" x1="0" y1={base} x2="400" y2={base} />
      <path className="sc-walk-line" d={d} pathLength={100} />
      {pts.map(([x, y], i) => (
        <circle key={i} className="sc-walk-dot" style={{ ["--i" as string]: i }} cx={x} cy={y} r="4" />
      ))}
    </svg>
  );
}

/* ---- III. Matter revealing its interior direction ----------------------- */
function Fire() {
  return (
    <svg viewBox="0 0 400 320" className="sc sc-fire" aria-hidden="true">
      <defs>
        <linearGradient id="fireInterior" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor="var(--color-ember)" />
          <stop offset="55%" stopColor="var(--accent-bright)" />
          <stop offset="100%" stopColor="var(--color-flame)" />
        </linearGradient>
        <mask id="fireMask">
          <rect x="0" y="0" width="400" height="320" fill="black" />
          <rect className="sc-fire-reveal" x="130" y="40" width="140" height="240" fill="white" />
        </mask>
      </defs>
      <rect className="sc-fire-block" x="130" y="40" width="140" height="240" rx="2" />
      <g mask="url(#fireMask)">
        {[0, 1, 2, 3, 4].map((i) => (
          <path
            key={i}
            className="sc-fire-grain"
            style={{ ["--i" as string]: i }}
            d={`M ${152 + i * 24} 280 C ${146 + i * 24} 210, ${160 + i * 24} 180, ${152 + i * 24} 44`}
            stroke="url(#fireInterior)"
          />
        ))}
      </g>
      <rect className="sc-fire-edge" x="130" y="40" width="140" height="240" rx="2" />
    </svg>
  );
}

/* ---- IV. The crown that arrives from beyond ----------------------------- */
function Crown() {
  return (
    <svg viewBox="0 0 400 320" className="sc sc-crown" aria-hidden="true">
      <circle className="sc-crown-orbit" cx="200" cy="185" r="105" />
      <circle className="sc-crown-orbit sc-crown-orbit-2" cx="200" cy="185" r="72" />
      <circle className="sc-crown-core" cx="200" cy="185" r="46" />
      <path className="sc-crown-form" d="M128 96 L156 44 L200 82 L244 44 L272 96" />
      {Array.from({ length: 10 }, (_, i) => {
        const a = (i / 10) * Math.PI * 2 - Math.PI / 2;
        return (
          <circle
            key={i}
            className="sc-crown-node"
            style={{ ["--i" as string]: i }}
            cx={r2(200 + Math.cos(a) * 105)}
            cy={r2(185 + Math.sin(a) * 105)}
            r="3.4"
          />
        );
      })}
    </svg>
  );
}

/* ---- V. The Name within ------------------------------------------------- */
function Name() {
  return (
    <svg viewBox="0 0 400 320" className="sc sc-name" aria-hidden="true">
      <path className="sc-name-wall" d="M138 46 L262 46 L246 282 L154 282 Z" />
      <path className="sc-name-inner" d="M164 120 L236 120 L228 250 L172 250 Z" />
      <circle className="sc-name-light" cx="200" cy="190" r="30" />
      <text className="sc-name-letter" x="200" y="206" textAnchor="middle">
        שׁ
      </text>
    </svg>
  );
}

/* ---- VI. The Great Scribe ----------------------------------------------- */
function Scribe() {
  return (
    <svg viewBox="0 0 400 320" className="sc sc-scribe" aria-hidden="true">
      <g className="sc-scribe-cloud">
        {Array.from({ length: 14 }, (_, i) => (
          <circle
            key={i}
            style={{ ["--i" as string]: i }}
            cx={60 + (i * 137) % 280}
            cy={54 + ((i * 61) % 90)}
            r={1.6 + (i % 3) * 0.8}
          />
        ))}
      </g>
      <path
        className="sc-scribe-stroke"
        pathLength={100}
        d="M52 200 C 100 200, 104 138, 148 138 C 192 138, 188 214, 236 214 C 280 214, 292 150, 344 150"
      />
      {[0, 1, 2].map((i) => (
        <line key={i} className="sc-scribe-line" style={{ ["--i" as string]: i }} x1="72" y1={244 + i * 22} x2="328" y2={244 + i * 22} pathLength={100} />
      ))}
    </svg>
  );
}

/* ---- VII. The Acher mirage ---------------------------------------------- */
function Acher() {
  return (
    <svg viewBox="0 0 400 320" className="sc sc-acher" aria-hidden="true">
      <line className="sc-acher-true" x1="200" y1="34" x2="200" y2="286" />
      <line className="sc-acher-false" x1="200" y1="34" x2="200" y2="286" />
      <line className="sc-acher-mirror" x1="60" y1="160" x2="340" y2="160" />
      <circle className="sc-acher-root" cx="200" cy="286" r="5" />
      <circle className="sc-acher-noroot" cx="200" cy="286" r="5" />
    </svg>
  );
}

/* ---- VIII. Malchus: descent, reception, answer, return ------------------ */
function Malchus() {
  return (
    <svg viewBox="0 0 400 320" className="sc sc-malchus" aria-hidden="true">
      {[168, 200, 232].map((x, i) => (
        <line key={x} className="sc-mal-down" style={{ ["--i" as string]: i }} x1={x} y1="24" x2={x} y2="150" pathLength={100} />
      ))}
      <path className="sc-mal-basin" d="M132 158 C 132 224, 268 224, 268 158" />
      <path className="sc-mal-fill" d="M132 158 C 132 224, 268 224, 268 158 Z" />
      <circle className="sc-mal-core" cx="200" cy="186" r="18" />
      <path className="sc-mal-return" pathLength={100} d="M140 196 C 74 164, 82 62, 158 30" />
      <path className="sc-mal-return sc-mal-return-2" pathLength={100} d="M260 196 C 326 164, 318 62, 242 30" />
      <path className="sc-mal-arrow" d="M158 30 L152 46 M158 30 L170 42" />
      <path className="sc-mal-arrow" d="M242 30 L248 46 M242 30 L230 42" />
      <line className="sc-mal-floor" x1="60" y1="288" x2="340" y2="288" />
    </svg>
  );
}

/* ---- IX. Chanoch remembers the earth ------------------------------------ */
function Soil() {
  return (
    <svg viewBox="0 0 400 320" className="sc sc-soil" aria-hidden="true">
      <ellipse className="sc-soil-glow" cx="200" cy="238" rx="60" ry="20" />
      <path className="sc-soil-foot" d="M178 240 C 174 198, 188 176, 200 176 C 214 176, 224 202, 218 240 Z" />
      <line className="sc-soil-ground" x1="40" y1="240" x2="360" y2="240" />
      {Array.from({ length: 12 }, (_, i) => (
        <line
          key={i}
          className="sc-soil-grain"
          style={{ ["--i" as string]: i }}
          x1={56 + i * 26}
          y1="250"
          x2={64 + i * 26}
          y2={266 + (i % 3) * 6}
        />
      ))}
    </svg>
  );
}

/* ---- X. Seven, and the eighth inside ------------------------------------ */
function SevenEight() {
  return (
    <svg viewBox="0 0 400 320" className="sc sc-seven" aria-hidden="true">
      <circle className="sc-seven-ring" cx="200" cy="160" r="104" pathLength={100} />
      {Array.from({ length: 7 }, (_, i) => {
        const a = (i / 7) * Math.PI * 2 - Math.PI / 2;
        return (
          <circle
            key={i}
            className="sc-seven-node"
            style={{ ["--i" as string]: i }}
            cx={r2(200 + Math.cos(a) * 104)}
            cy={r2(160 + Math.sin(a) * 104)}
            r="4.5"
          />
        );
      })}
      <circle className="sc-seven-inner" cx="200" cy="160" r="52" />
      <circle className="sc-seven-eighth" cx="200" cy="160" r="7" />
    </svg>
  );
}

/* ---- XI. Total speech, and the still origin ----------------------------- */
function Speech() {
  return (
    <svg viewBox="0 0 400 320" className="sc sc-speech" aria-hidden="true">
      {Array.from({ length: 5 }, (_, i) => (
        <circle key={i} className="sc-speech-wave" style={{ ["--i" as string]: i }} cx="200" cy="160" r={40 + i * 34} />
      ))}
      {Array.from({ length: 22 }, (_, i) => {
        const a = (i / 22) * Math.PI * 2;
        const r = 60 + ((i * 37) % 110);
        return (
          <rect
            key={i}
            className="sc-speech-glyph"
            style={{ ["--i" as string]: i % 6 }}
            x={r2(200 + Math.cos(a) * r)}
            y={r2(160 + Math.sin(a) * r * 0.72)}
            width="7"
            height="2"
          />
        );
      })}
      <path className="sc-speech-origin" d="M196 138 C 196 168, 204 168, 204 190" />
    </svg>
  );
}

/* ---- XII. Light entering ordinary matter -------------------------------- */
function Dwelling() {
  return (
    <svg viewBox="0 0 400 320" className="sc sc-dwelling" aria-hidden="true">
      {[140, 200, 260].map((x, i) => (
        <line key={x} className="sc-dw-beam" style={{ ["--i" as string]: i }} x1={x} y1="16" x2={x} y2="150" pathLength={100} />
      ))}
      <line className="sc-dw-floor" x1="48" y1="266" x2="352" y2="266" />
      {/* cup */}
      <path className="sc-dw-object" style={{ ["--i" as string]: 0 }} d="M104 224 L136 224 L131 264 L109 264 Z" />
      {/* parchment */}
      <path className="sc-dw-object" style={{ ["--i" as string]: 1 }} d="M172 216 L228 216 L228 264 L172 264 Z" />
      {/* doorpost */}
      <path className="sc-dw-object" style={{ ["--i" as string]: 2 }} d="M268 200 L292 200 L292 264 L268 264 Z" />
      <path className="sc-dw-roof" d="M84 200 L200 132 L316 200" />
    </svg>
  );
}

/* ---- Finale. Everything settles downward -------------------------------- */
function Finale() {
  return (
    <svg viewBox="0 0 400 320" className="sc sc-finale" aria-hidden="true">
      {Array.from({ length: 9 }, (_, i) => (
        <line
          key={i}
          className="sc-fin-fall"
          style={{ ["--i" as string]: i }}
          x1={64 + i * 34}
          y1="20"
          x2={64 + i * 34}
          y2="236"
          pathLength={100}
        />
      ))}
      <line className="sc-fin-ground" x1="40" y1="248" x2="360" y2="248" />
      <ellipse className="sc-fin-pool" cx="200" cy="250" rx="150" ry="14" />
      <path className="sc-fin-house" d="M124 248 V196 L200 156 L276 196 V248" />
    </svg>
  );
}

export function Scene({ act }: SceneProps) {
  switch (act.scene) {
    case "cadence": return <Cadence />;
    case "walk": return <Walk />;
    case "fire": return <Fire />;
    case "crown": return <Crown />;
    case "name": return <Name />;
    case "scribe": return <Scribe />;
    case "acher": return <Acher />;
    case "malchus": return <Malchus />;
    case "soil": return <Soil />;
    case "seven-eight": return <SevenEight />;
    case "speech": return <Speech />;
    case "dwelling": return <Dwelling />;
    case "return": return <Walk descending />;
    case "finale": return <Finale />;
  }
}
