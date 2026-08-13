import type { NextConfig } from "next";

/**
 * Static export, for Hostinger.
 *
 * Hostinger's web hosting plans serve files through LiteSpeed/Apache with PHP —
 * there is no Node runtime, so a Next.js server cannot run there. `output:
 * "export"` renders every route to plain HTML at build time, which is exactly
 * what that environment serves best, and keeps the site fully crawlable.
 *
 * Two consequences, both handled:
 *  - Server Actions are unavailable, so the contact form posts to a small PHP
 *    endpoint (public/api/contact.php) that Hostinger runs natively.
 *  - The image optimiser is unavailable, so images are pre-compressed at the
 *    sizes they are actually displayed (see scripts/optimise-images.mjs).
 */
const nextConfig: NextConfig = {
  output: "export",

  // No Node image optimiser on static hosting; assets are optimised at build.
  images: { unoptimized: true },

  // Emit /about.html rather than /about/index.html. The bundled .htaccess
  // rewrites extensionless paths onto those files, so URLs stay clean and
  // canonicals need no trailing slash.
  trailingSlash: false,

  // Fail the build on type errors rather than shipping them. Linting runs as
  // its own step (`npm run lint`); Next 16 no longer accepts it here.
  typescript: { ignoreBuildErrors: false },

  productionBrowserSourceMaps: false,
};

export default nextConfig;
