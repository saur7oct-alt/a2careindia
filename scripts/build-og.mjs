import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

/**
 * Renders the social share card once, at authoring time, instead of via a dynamic
 * ImageResponse route — a static PNG costs nothing per crawl and cannot fail a build.
 *
 *   node scripts/build-og.mjs
 */

const WIDTH = 1200;
const HEIGHT = 630;

const card = `
<svg width="${WIDTH}" height="${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="scrim" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#040f19" stop-opacity="0.90"/>
      <stop offset="55%" stop-color="#071b2b" stop-opacity="0.93"/>
      <stop offset="100%" stop-color="#0a263d" stop-opacity="0.96"/>
    </linearGradient>
    <linearGradient id="accent" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#00aeef"/>
      <stop offset="100%" stop-color="#20d5d2"/>
    </linearGradient>
  </defs>

  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#scrim)"/>
  <rect x="0" y="${HEIGHT - 5}" width="${WIDTH}" height="5" fill="url(#accent)"/>

  <g font-family="DejaVu Sans, Arial, sans-serif">
    <text x="80" y="132" fill="#20d5d2" font-size="26" letter-spacing="7" font-weight="600">A2CARE INDIA</text>
    <text x="80" y="168" fill="#8193a0" font-size="21" letter-spacing="2">RUDRAPUR, UTTARAKHAND &#183; EST. 2018</text>

    <text x="80" y="290" fill="#f2f8fa" font-size="72" font-weight="700" letter-spacing="-2">Engineering pure water.</text>
    <text x="80" y="372" fill="#f2f8fa" font-size="72" font-weight="700" letter-spacing="-2">Powering a better</text>
    <text x="80" y="454" fill="#f2f8fa" font-size="72" font-weight="700" letter-spacing="-2">tomorrow.</text>

    <text x="80" y="540" fill="#8193a0" font-size="27">Industrial RO &#183; ETP &#183; STP &#183; Dosing &#183; Chillers &#183; Pan-India installation</text>
  </g>
</svg>
`;

const input = readFileSync(
  fileURLToPath(new URL('../public/media/decorative/hero-water.webp', import.meta.url)),
);

const composed = await sharp(input)
  .resize(WIDTH, HEIGHT, { fit: 'cover', position: 'centre' })
  .blur(3)
  .composite([{ input: Buffer.from(card), blend: 'over' }])
  .webp({ quality: 82 })
  .toBuffer();

// A WebP sibling for browsers that request it, PNG for the canonical OG URL.
await sharp(composed)
  .png({ quality: 82 })
  .toFile(fileURLToPath(new URL('../public/og/default.png', import.meta.url)));
await sharp(composed)
  .webp({ quality: 82 })
  .toFile(fileURLToPath(new URL('../public/og/default.webp', import.meta.url)));

console.log('public/og/default.png + default.webp written');
