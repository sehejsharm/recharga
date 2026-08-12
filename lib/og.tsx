import { ImageResponse } from "next/og";

/**
 * Shared 1200×630 share-card renderer (§10 I).
 *
 * Rendered by Satori, which supports only a subset of CSS — flexbox layout,
 * inline styles, no CSS variables — so the brand values are repeated here as
 * literals rather than pulled from the token sheet.
 */

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = "image/png";

const ABYSS = "#0E0E10";
const BRAND = "#00FF5E";
const INK = "#F4F4F6";
const INK_3 = "#6B6B73";
const HAIRLINE = "#2E2E34";

function Mark({ size = 46 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 512 512" fill="none">
      <g fill={BRAND}>
        <path d="M212 116 A99 99 0 1 0 384 208 Z" />
        <path d="M240 232 L118 341 L203 347 L137 452 L293 314 L231 306 Z" />
      </g>
      <g stroke={BRAND} strokeWidth={22} strokeLinecap="round" fill="none">
        <path d="M256 132 L293 63" />
        <path d="M351 183 L388 113" />
      </g>
    </svg>
  );
}

export function renderOgImage({
  eyebrow,
  title,
  footer = "Recharga Chargine Pvt. Ltd. · Jaipur, India",
}: {
  eyebrow: string;
  title: string;
  footer?: string;
}) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: ABYSS,
          padding: "68px 76px",
          position: "relative",
        }}
      >
        {/* Energy glow */}
        <div
          style={{
            position: "absolute",
            top: -180,
            right: -140,
            width: 720,
            height: 720,
            background:
              "radial-gradient(circle, rgba(0,255,94,0.20) 0%, rgba(14,158,110,0.08) 42%, rgba(0,255,94,0) 70%)",
            display: "flex",
          }}
        />

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <Mark />
          <span
            style={{
              fontSize: 30,
              color: INK,
              letterSpacing: "-0.02em",
              fontWeight: 600,
              display: "flex",
              gap: 9,
            }}
          >
            <span>Recharga</span>
            <span style={{ color: INK_3 }}>Chargine</span>
          </span>
        </div>

        {/* Body */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div
              style={{ width: 9, height: 9, backgroundColor: BRAND, display: "flex" }}
            />
            <span
              style={{
                fontSize: 21,
                color: INK_3,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
              }}
            >
              {eyebrow}
            </span>
          </div>

          <div
            style={{
              marginTop: 30,
              fontSize: title.length > 62 ? 62 : 74,
              lineHeight: 1.06,
              color: INK,
              letterSpacing: "-0.035em",
              fontWeight: 600,
              maxWidth: 960,
              display: "flex",
            }}
          >
            {title}
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: `1px solid ${HAIRLINE}`,
            paddingTop: 26,
          }}
        >
          <span style={{ fontSize: 22, color: INK_3 }}>{footer}</span>
          <span style={{ fontSize: 22, color: BRAND }}>RADAX Generator</span>
        </div>
      </div>
    ),
    OG_SIZE,
  );
}
