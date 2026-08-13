import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from "@/lib/og";

// Static export: these metadata routes are generated once at build time.
export const dynamic = "force-static";

export const alt = "The RADAX Generator — hybrid axial-radial flux, direct-drive architecture";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return renderOgImage({
    eyebrow: "The RADAX Generator",
    title: "Two flux paths. One direct-drive machine.",
  });
}
