import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from "@/lib/og";

// Static export: these metadata routes are generated once at build time.
export const dynamic = "force-static";

export const alt = "About Recharga Chargine Pvt. Ltd.";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return renderOgImage({
    eyebrow: "About Recharga Chargine",
    title: "Rethinking the machine at the centre of wind power.",
  });
}
