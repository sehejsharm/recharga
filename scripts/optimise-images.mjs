/**
 * Portrait optimiser.
 *
 * The site is a static export, so Next's on-demand image optimiser is not
 * available — whatever sits in /public is exactly what the browser downloads.
 * This pre-compresses the founder portraits at the size they are actually
 * displayed, which is the difference between a ~1 MB PNG and a ~60 KB WebP on
 * the largest image on the page.
 *
 * Source of truth is assets/portraits (committed, never served). Output goes
 * to public/team. Run via `npm run images`; `npm run build` runs it first.
 */
import { mkdir, readdir, stat, writeFile } from "node:fs/promises";
import { join, parse } from "node:path";
import sharp from "sharp";

const SOURCE_DIR = "assets/portraits";
const OUT_DIR = "public/team";

/**
 * Portraits render at most ~34rem (544 CSS px) wide, so 1100px covers a 2x
 * display with room to spare. Taller than 4:5 is fine — the frame crops.
 */
const MAX_WIDTH = 1100;
const QUALITY = 82;

/** Only these are published. Anything else in the source dir is ignored. */
const PUBLISH = new Set(["sehej-sharma", "ali-electricwala"]);

const kb = (bytes) => `${(bytes / 1024).toFixed(0)} KB`;

await mkdir(OUT_DIR, { recursive: true });

const files = (await readdir(SOURCE_DIR)).filter((f) =>
  /\.(png|jpe?g|webp)$/i.test(f),
);

let totalBefore = 0;
let totalAfter = 0;
let published = 0;

for (const file of files) {
  const { name } = parse(file);
  if (!PUBLISH.has(name)) {
    console.log(`·  ${name} — held back (not published)`);
    continue;
  }

  const inputPath = join(SOURCE_DIR, file);
  const outputPath = join(OUT_DIR, `${name}.webp`);

  const before = (await stat(inputPath)).size;
  const buffer = await sharp(inputPath)
    .rotate() // honour EXIF orientation before resizing
    .resize({ width: MAX_WIDTH, withoutEnlargement: true })
    .webp({ quality: QUALITY, effort: 6 })
    .toBuffer();

  await writeFile(outputPath, buffer);

  const meta = await sharp(buffer).metadata();
  totalBefore += before;
  totalAfter += buffer.length;
  published += 1;

  const saved = Math.round((1 - buffer.length / before) * 100);
  console.log(
    `✓  ${name}.webp  ${meta.width}×${meta.height}  ${kb(before)} → ${kb(buffer.length)}  (−${saved}%)`,
  );
}

if (published === 0) {
  console.error("No portraits were published — check assets/portraits.");
  process.exit(1);
}

console.log(
  `\n${published} portrait(s): ${kb(totalBefore)} → ${kb(totalAfter)} ` +
    `(−${Math.round((1 - totalAfter / totalBefore) * 100)}%)`,
);
