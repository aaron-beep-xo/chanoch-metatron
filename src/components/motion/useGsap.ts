"use client";

import { useEffect, type RefObject } from "react";
import { usePrefs } from "@/components/chrome/Preferences";

type Gsap = typeof import("gsap")["gsap"];
type ScrollTriggerType = typeof import("gsap/ScrollTrigger")["ScrollTrigger"];

export interface GsapKit {
  gsap: Gsap;
  ScrollTrigger: ScrollTriggerType;
}

let kit: Promise<GsapKit> | null = null;

/** Loads GSAP + ScrollTrigger once, on demand, off the critical path. */
export function loadGsap(): Promise<GsapKit> {
  kit ??= (async () => {
    const [{ gsap }, { ScrollTrigger }] = await Promise.all([
      import("gsap"),
      import("gsap/ScrollTrigger"),
    ]);
    gsap.registerPlugin(ScrollTrigger);
    if (process.env.NODE_ENV !== "production") {
      // Exposed only in development, so scenes can be stepped by hand in QA.
      (window as unknown as { gsap?: unknown }).gsap = gsap;
      (window as unknown as { ScrollTrigger?: unknown }).ScrollTrigger = ScrollTrigger;
    }
    return { gsap, ScrollTrigger };
  })();
  return kit;
}

/**
 * Runs a GSAP setup scoped to `scope`, skipping it entirely when the reader has
 * asked for reduced motion. `build` may return a cleanup function.
 */
export function useGsapScope(
  scope: RefObject<HTMLElement | null>,
  build: (kit: GsapKit, ctx: { scope: HTMLElement }) => void | (() => void),
  deps: unknown[] = [],
) {
  const { reduced, ready } = usePrefs();

  useEffect(() => {
    if (!ready || reduced) return;
    const el = scope.current;
    if (!el) return;

    let cleanup: (() => void) | void;
    let ctx: { revert: () => void } | undefined;
    let cancelled = false;

    loadGsap().then((k) => {
      if (cancelled) return;
      ctx = k.gsap.context(() => {
        cleanup = build(k, { scope: el });
      }, el);
    });

    return () => {
      cancelled = true;
      cleanup?.();
      ctx?.revert();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced, ready, ...deps]);
}
