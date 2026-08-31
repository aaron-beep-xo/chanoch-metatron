/**
 * A generated plate laid behind a banner, under a heavy wash of the ground
 * colour so that it never competes with the type in front of it.
 *
 * It carries no information — the geometry it shows is said in words elsewhere
 * — so it is hidden from assistive technology and takes no alternative text.
 */
export function Veil({ art, className }: { art: string; className?: string }) {
  return (
    <div
      className={className ? `veil ${className}` : "veil"}
      style={{ ["--veil-art" as string]: `url("${art}")` }}
      aria-hidden="true"
    />
  );
}
