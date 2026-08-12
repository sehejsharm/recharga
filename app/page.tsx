import type { Metadata } from "next";
import { Hero } from "@/components/home/Hero";
import { ProblemSolution } from "@/components/home/ProblemSolution";
import { TechTeaser } from "@/components/home/TechTeaser";
import { ProofStrip } from "@/components/home/ProofStrip";
import { FoundersTeaser } from "@/components/home/FoundersTeaser";
import { CtaBand } from "@/components/shared/CtaBand";
import { graph, localBusinessSchema, webPageSchema } from "@/lib/schema";
import { jsonLd, pageMetadata } from "@/lib/seo";

const TITLE =
  "Recharga Chargine — RADAX hybrid flux generator architecture";
const DESCRIPTION =
  "Recharga Chargine develops the RADAX Generator: a hybrid axial-radial flux, direct-drive architecture licensed to manufacturers. DPIIT-recognised, Jaipur, India.";

export const metadata: Metadata = {
  ...pageMetadata({
    title: TITLE,
    description: DESCRIPTION,
    path: "/",
    keywords: [
      "Recharga Chargine",
      "Recharga Chargine Pvt Ltd",
      "RADAX",
      "RADAX Generator",
      "axial radial flux generator",
      "direct drive generator",
      "hybrid flux generator",
      "wind turbine generator technology",
      "generator technology licensing",
      "deep tech clean energy startup India",
    ],
  }),
  // The homepage carries the site's default title verbatim, without the
  // "| Recharga Chargine" suffix the template would otherwise append.
  title: { absolute: TITLE },
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLd(
            graph([
              webPageSchema({
                path: "/",
                name: TITLE,
                description: DESCRIPTION,
              }),
              localBusinessSchema(),
            ]),
          ),
        }}
      />

      <Hero />
      <ProblemSolution />
      <TechTeaser />
      <ProofStrip />
      <FoundersTeaser />
      <CtaBand />
    </>
  );
}
