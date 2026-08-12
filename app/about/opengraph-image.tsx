import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from "@/lib/og";

export const alt = "About Recharga Chargine Pvt. Ltd.";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return renderOgImage({
    eyebrow: "About Recharga",
    title: "Rethinking the machine at the centre of wind power.",
  });
}
