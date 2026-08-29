/**
 * The canonical origin used for metadata, hreflang, the sitemap and robots.
 *
 * Prefers an explicit `NEXT_PUBLIC_SITE_URL` (set this once a real domain is
 * attached), then falls back to the production URL Vercel injects into every
 * deployment, so preview builds are self-consistent without configuration.
 */
function resolve(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/$/, "");

  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (vercel) return `https://${vercel.replace(/\/$/, "")}`;

  return "http://localhost:3939";
}

export const SITE_URL = resolve();
