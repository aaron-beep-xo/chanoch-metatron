"use client";

import { createContext, useCallback, useContext, useMemo, useSyncExternalStore, type ReactNode } from "react";

export type Surface = "night" | "parchment";

export interface Prefs {
  /** The reader's explicit motion override; null means "follow the system". */
  reducedChoice: boolean | null;
  surface: Surface;
  translit: boolean;
  sourceNotes: boolean;
  bookmarks: string[];
}

const KEY = "chanoch.prefs.v1";

const DEFAULTS: Prefs = {
  reducedChoice: null,
  surface: "night",
  translit: false,
  sourceNotes: true,
  bookmarks: [],
};

/* ---------------------------------------------------------------------------
   An external store rather than component state: preferences live in
   localStorage and on the <html> element, both of which exist outside React.
   useSyncExternalStore gives us a hydration-safe read with no effect-driven
   cascade, and the pre-paint boot script has already applied the visual ones.
   ------------------------------------------------------------------------- */

let snapshot: Prefs = DEFAULTS;
let systemReduced = false;
let hydrated = false;
const listeners = new Set<() => void>();

function emit() {
  for (const l of listeners) l();
}

function hydrate() {
  if (hydrated || typeof window === "undefined") return;
  hydrated = true;
  try {
    snapshot = { ...DEFAULTS, ...(JSON.parse(localStorage.getItem(KEY) ?? "{}") as Partial<Prefs>) };
  } catch {
    snapshot = DEFAULTS;
  }
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  systemReduced = mq.matches;
  mq.addEventListener("change", (e) => {
    systemReduced = e.matches;
    applyToDocument();
    emit();
  });
  applyToDocument();
}

function applyToDocument() {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  root.dataset.motion = (snapshot.reducedChoice ?? systemReduced) ? "reduced" : "full";
  root.dataset.surface = snapshot.surface;
}

function write(patch: Partial<Prefs>) {
  snapshot = { ...snapshot, ...patch };
  try {
    localStorage.setItem(KEY, JSON.stringify(snapshot));
  } catch {
    /* storage may be unavailable; preferences simply do not persist */
  }
  applyToDocument();
  emit();
}

function subscribe(fn: () => void) {
  hydrate();
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}

const getSnapshot = () => snapshot;
const getServerSnapshot = () => DEFAULTS;

interface PrefState extends Prefs {
  /** True when either the OS or the reader has asked for less motion. */
  reduced: boolean;
  setReducedChoice: (v: boolean | null) => void;
  setSurface: (s: Surface) => void;
  setTranslit: (v: boolean) => void;
  setSourceNotes: (v: boolean) => void;
  toggleBookmark: (slug: string) => void;
  /** False during the very first render, before storage has been read. */
  ready: boolean;
}

const Ctx = createContext<PrefState | null>(null);

export function Preferences({ children }: { children: ReactNode }) {
  const prefs = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const toggleBookmark = useCallback((slug: string) => {
    const has = snapshot.bookmarks.includes(slug);
    write({
      bookmarks: has ? snapshot.bookmarks.filter((s) => s !== slug) : [...snapshot.bookmarks, slug],
    });
  }, []);

  const value = useMemo<PrefState>(
    () => ({
      ...prefs,
      reduced: prefs.reducedChoice ?? systemReduced,
      ready: hydrated,
      setReducedChoice: (v) => write({ reducedChoice: v }),
      setSurface: (s) => write({ surface: s }),
      setTranslit: (v) => write({ translit: v }),
      setSourceNotes: (v) => write({ sourceNotes: v }),
      toggleBookmark,
    }),
    [prefs, toggleBookmark],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function usePrefs(): PrefState {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("usePrefs must be used inside <Preferences>");
  return ctx;
}

/**
 * Applies stored preferences before first paint so the reader never sees the
 * wrong surface or a burst of motion they asked not to have.
 */
export const prefsBootScript = `(function(){try{
var s=JSON.parse(localStorage.getItem(${JSON.stringify(KEY)})||"{}");
var m=window.matchMedia("(prefers-reduced-motion: reduce)").matches;
var r=(s.reducedChoice===undefined||s.reducedChoice===null)?m:s.reducedChoice;
var e=document.documentElement;
e.dataset.js="on";
e.dataset.motion=r?"reduced":"full";
e.dataset.surface=s.surface||"night";
}catch(e){}})();`;
