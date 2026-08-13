import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from "@/lib/og";

// Static export: these metadata routes are generated once at build time.
export const dynamic = "force-static";

export const alt = "Recharga Chargine — the RADAX hybrid axial-radial flux generator architecture";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return renderOgImage({
    eyebrow: "Deep-tech clean energy",
    title: "A new generator architecture for the wind turbines of the next decade.",
  });
}
