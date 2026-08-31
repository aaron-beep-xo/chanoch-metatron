"use client";

import { useEffect, useRef } from "react";
import { usePrefs } from "@/components/chrome/Preferences";

/** Never pull a megabyte of loop down a connection that has asked for less. */
function metered() {
  const conn = (navigator as { connection?: { saveData?: boolean } }).connection;
  return Boolean(conn?.saveData);
}

/**
 * A slow generated loop behind a banner. Like the ambient field it carries no
 * information, so it is dropped entirely on reduced motion and on metered
 * connections; the still plate underneath is what is seen instead, and it is
 * also what paints while the loop is still arriving.
 *
 * The loops are cut to run forward and then back, so they close on themselves
 * and never jump.
 */
export function AmbientVideo({
  src,
  poster,
  still,
  className,
}: {
  src: string;
  poster: string;
  /** Shown in place of the loop wherever motion is unwelcome. */
  still: string;
  className?: string;
}) {
  const { reduced, ready } = usePrefs();
  const ref = useRef<HTMLVideoElement>(null);

  // `ready` is false until storage has been read, which also keeps the
  // navigator read off the server.
  const playing = ready && !reduced && !metered();

  // A background loop has nothing to say to a hidden tab.
  useEffect(() => {
    if (!playing) return;
    function onVisibility() {
      const el = ref.current;
      if (!el) return;
      if (document.hidden) el.pause();
      else void el.play().catch(() => undefined);
    }
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, [playing]);

  return (
    <div
      className={className ? `veil ${className}` : "veil"}
      style={{ ["--veil-art" as string]: `url("${ready && reduced ? still : poster}")` }}
      aria-hidden="true"
    >
      {playing ? (
        <video
          ref={ref}
          className="veil-loop"
          src={src}
          poster={poster}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          tabIndex={-1}
        />
      ) : null}
    </div>
  );
}
