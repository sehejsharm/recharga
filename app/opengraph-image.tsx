import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from "@/lib/og";

export const alt = "Recharga — RADAX hybrid axial-radial flux wind generator architecture";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return renderOgImage({
    eyebrow: "Deep-tech clean energy",
    title: "A new generator architecture for the wind turbines of the next decade.",
  });
}
