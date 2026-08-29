"use client";

import { useId, useMemo, useRef } from "react";
import { useGsapScope } from "./useGsap";

/**
 * THE WALK — the site's founding motion.
 *
 * A line advances by alternating contact with a baseline: it descends to touch
 * the ground, then rises, then touches again on the other foot. Ascent is
 * produced *by* contact rather than by leaving. The same component runs in
 * reverse for the finale, where the walk turns back toward the earth.
 */
export function WalkPath({
  steps = 7,
  descending = false,
  className,
  progress,
}: {
  steps?: number;
  descending?: boolean;
  className?: string;
  /** When set, the draw is scrubbed by this element's scroll instead of playing once. */
  progress?: React.RefObject<HTMLElement | null>;
}) {
  const scope = useRef<HTMLDivElement>(null);
  const uid = useId().replace(/:/g, "");

  const { d, contacts } = useMemo(() => {
    const W = 1000;
    const H = 220;
    const base = descending ? 40 : H - 40;
    const lift = descending ? 1 : -1;
    const span = W / steps;
    let path = `M 0 ${base}`;
    const pts: { x: number; y: number }[] = [];
    for (let i = 0; i < steps; i++) {
      const x0 = i * span;
      const x1 = x0 + span;
      // Each stride climbs by a fraction of the remaining height.
      const climb = (i + 1) * ((H - 90) / steps) * lift;
      const yTouch = base + climb;
      const yApex = yTouch + lift * span * 0.2;
      path += ` C ${x0 + span * 0.28} ${yApex}, ${x1 - span * 0.28} ${yApex}, ${x1} ${yTouch}`;
      pts.push({ x: x1, y: yTouch });
    }
    return { d: path, contacts: pts };
  }, [steps, descending]);

  useGsapScope(scope, ({ gsap, ScrollTrigger }, { scope: el }) => {
    const line = el.querySelector<SVGPathElement>(".walk-line");
    const dots = el.querySelectorAll<SVGCircleElement>(".walk-contact");
    if (!line) return;

    const len = line.getTotalLength();
    gsap.set(line, { strokeDasharray: len, strokeDashoffset: len });
    gsap.set(dots, { scale: 0, transformOrigin: "center", opacity: 0 });

    const tl = gsap.timeline({ paused: true });
    tl.to(line, { strokeDashoffset: 0, duration: steps, ease: "none" }, 0);
    dots.forEach((dot, i) => {
      tl.to(dot, { scale: 1, opacity: 1, duration: 0.28, ease: "back.out(2.4)" }, i + 0.72);
      tl.to(dot, { opacity: 0.35, duration: 0.5, ease: "power2.out" }, i + 1.0);
    });

    if (progress?.current) {
      const st = ScrollTrigger.create({
        trigger: progress.current,
        start: "top 78%",
        end: "bottom 30%",
        scrub: 0.8,
        onUpdate: (self) => tl.progress(self.progress),
      });
      return () => st.kill();
    }

    const st = ScrollTrigger.create({
      trigger: el,
      start: "top 85%",
      once: true,
      onEnter: () => tl.play(),
    });
    return () => st.kill();
  }, [steps, descending]);

  return (
    <div className={`walk ${className ?? ""}`} ref={scope} aria-hidden="true">
      <svg viewBox="0 0 1000 220" preserveAspectRatio="none" role="presentation">
        <defs>
          <linearGradient id={`walk-${uid}`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="var(--accent)" stopOpacity="0" />
            <stop offset="16%" stopColor="var(--accent)" stopOpacity="0.85" />
            <stop offset="84%" stopColor="var(--accent-bright)" stopOpacity="1" />
            <stop offset="100%" stopColor="var(--accent-bright)" stopOpacity="0.2" />
          </linearGradient>
        </defs>
        <line
          className="walk-base"
          x1="0"
          y1={descending ? 40 : 180}
          x2="1000"
          y2={descending ? 40 : 180}
        />
        <path className="walk-line" d={d} stroke={`url(#walk-${uid})`} />
        {contacts.map((p, i) => (
          <circle key={i} className="walk-contact" cx={p.x} cy={p.y} r="5.5" />
        ))}
      </svg>
    </div>
  );
}
