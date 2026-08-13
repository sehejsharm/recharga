import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/site";

// Static export: these metadata routes are generated once at build time.
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: absoluteUrl("/sitemap.xml"),
    host: absoluteUrl("/"),
  };
}
