import type { MotifId } from "@/content/structure";

/** Rounded so server and client markup are byte-identical. */
const r2 = (n: number) => Math.round(n * 100) / 100;

/**
 * CHAPTER COVER SYSTEM.
 *
 * Eleven reusable motifs rather than fifty bespoke scenes. Each is a small
 * static SVG animated entirely in CSS, so a chapter cover costs no JavaScript
 * and stops moving the moment the reader asks it to.
 */
export function Motif({ id, className }: { id: MotifId; className?: string }) {
  return (
    <div className={`motif motif-${id} ${className ?? ""}`} aria-hidden="true">
      <svg viewBox="0 0 200 200" role="presentation">
        {shapes[id]}
      </svg>
    </div>
  );
}

const shapes: Record<MotifId, React.ReactNode> = {
  path: (
    <>
      <line className="m-base" x1="10" y1="150" x2="190" y2="150" />
      <path className="m-draw" d="M10 150 C 40 110, 60 130, 80 118 S 120 88, 140 76 S 176 52, 190 44" />
      {[80, 110, 140, 170].map((x, i) => (
        <circle key={x} className="m-dot" style={{ ["--i" as string]: i }} cx={x} cy={150} r="2.6" />
      ))}
    </>
  ),
  cadence: (
    <>
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <rect
          key={i}
          className="m-beat"
          style={{ ["--i" as string]: i }}
          x="40"
          y={22 + i * 22}
          width="120"
          height="2"
        />
      ))}
      <rect className="m-gap" x="40" y="154" width="120" height="2" />
    </>
  ),
  flame: (
    <>
      <rect className="m-block" x="62" y="58" width="76" height="104" rx="2" />
      <path className="m-interior" d="M100 158 C 84 128, 92 112, 100 92 C 108 112, 116 128, 100 158 Z" />
      <path className="m-interior m-interior-2" d="M100 150 C 92 128, 96 118, 100 104 C 104 118, 108 128, 100 150 Z" />
    </>
  ),
  crown: (
    <>
      <circle className="m-orbit" cx="100" cy="112" r="52" />
      <circle className="m-core" cx="100" cy="112" r="26" />
      <path className="m-crown" d="M62 74 L76 50 L100 68 L124 50 L138 74" />
      {[0, 1, 2].map((i) => (
        <circle key={i} className="m-spark" style={{ ["--i" as string]: i }} cx="100" cy="60" r="2.4" />
      ))}
    </>
  ),
  vessel: (
    <>
      <path className="m-wall" d="M68 52 L132 52 L124 156 L76 156 Z" />
      <path className="m-inner" d="M84 92 L116 92 L112 142 L88 142 Z" />
      <circle className="m-light" cx="100" cy="116" r="16" />
    </>
  ),
  script: (
    <>
      <path className="m-stroke" d="M36 128 C 60 128, 62 88, 82 88 C 102 88, 100 132, 122 132 C 142 132, 148 96, 166 96" />
      {[0, 1, 2].map((i) => (
        <line key={i} className="m-lineout" style={{ ["--i" as string]: i }} x1="52" y1={150 + i * 14} x2="148" y2={150 + i * 14} />
      ))}
    </>
  ),
  mirage: (
    <>
      <line className="m-axis" x1="80" y1="34" x2="80" y2="166" />
      <line className="m-axis m-axis-false" x1="120" y1="34" x2="120" y2="166" />
      <line className="m-mirror" x1="100" y1="26" x2="100" y2="174" />
    </>
  ),
  basin: (
    <>
      {[0, 1, 2].map((i) => (
        <line key={i} className="m-fall" style={{ ["--i" as string]: i }} x1="100" y1="24" x2="100" y2="96" />
      ))}
      <path className="m-bowl" d="M56 106 C 56 150, 144 150, 144 106" />
      <line className="m-lip" x1="56" y1="106" x2="144" y2="106" />
      <path className="m-return" d="M62 118 C 30 96, 34 46, 76 30" />
      <path className="m-return m-return-b" d="M138 118 C 170 96, 166 46, 124 30" />
    </>
  ),
  soil: (
    <>
      <path className="m-ground" d="M20 152 H180" />
      <ellipse className="m-glow" cx="100" cy="150" rx="46" ry="14" />
      <path className="m-foot" d="M88 150 C 86 132, 92 122, 100 122 C 110 122, 114 134, 110 150 Z" />
      {[0, 1, 2, 3].map((i) => (
        <line key={i} className="m-grain" style={{ ["--i" as string]: i }} x1={54 + i * 30} y1="158" x2={62 + i * 30} y2="168" />
      ))}
    </>
  ),
  ring: (
    <>
      <circle className="m-ring" cx="100" cy="100" r="58" />
      {Array.from({ length: 7 }, (_, i) => {
        const a = (i / 7) * Math.PI * 2 - Math.PI / 2;
        return (
          <circle
            key={i}
            className="m-node"
            style={{ ["--i" as string]: i }}
            cx={r2(100 + Math.cos(a) * 58)}
            cy={r2(100 + Math.sin(a) * 58)}
            r="3.4"
          />
        );
      })}
      <circle className="m-eighth" cx="100" cy="100" r="20" />
    </>
  ),
  dwelling: (
    <>
      {[0, 1, 2].map((i) => (
        <line key={i} className="m-descend" style={{ ["--i" as string]: i }} x1={72 + i * 28} y1="16" x2={72 + i * 28} y2="96" />
      ))}
      <path className="m-house" d="M52 158 V104 L100 74 L148 104 V158" />
      <rect className="m-door" x="88" y="124" width="24" height="34" />
      <rect className="m-table" x="62" y="150" width="76" height="2" />
    </>
  ),
};
