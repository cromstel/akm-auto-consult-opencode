/**
 * Build script: generates public/favicon.ico (multi-frame, PNG-compressed
 * entries) from app/icon.svg using sharp, plus matching PNG sizes.
 * Run from repo root: node scripts/build-ico.js
 */
import sharp from 'sharp';
import fs from 'node:fs';

const svgPath = 'app/icon.svg';
const outDir = 'public';
fs.mkdirSync(outDir, { recursive: true });

const sizes = [16, 32];
const pngs = [];
for (const s of sizes) {
  const buf = await sharp(svgPath).resize(s, s).png().toBuffer();
  pngs.push({ size: s, data: buf });
  fs.writeFileSync(`${outDir}/icon-${s}.png`, buf);
}

// ICO container: 6-byte header + 16-byte dir entry per frame + image data
const headerSize = 6;
const entrySize = 16;
let offset = headerSize + pngs.length * entrySize;
const header = Buffer.alloc(headerSize);
header.writeUInt16LE(0, 0); // reserved
header.writeUInt16LE(1, 2); // type = icon
header.writeUInt16LE(pngs.length, 4); // frame count

const dirEntries = [];
for (const p of pngs) {
  const e = Buffer.alloc(entrySize);
  e[0] = p.size >= 256 ? 0 : p.size; // width
  e[1] = p.size >= 256 ? 0 : p.size; // height
  e[2] = 0; // color count (truecolor)
  e[3] = 0; // reserved
  e.writeUInt16LE(1, 4); // planes
  e.writeUInt16LE(32, 6); // bit count
  e.writeUInt32LE(p.data.length, 8); // bytes in resource
  e.writeUInt32LE(offset, 12); // image offset
  dirEntries.push(e);
  offset += p.data.length;
}

const ico = Buffer.concat([header, ...dirEntries, ...pngs.map((p) => p.data)]);
fs.writeFileSync(`${outDir}/favicon.ico`, ico);
console.log('favicon.ico written:', ico.length, 'bytes; PNG frames:', pngs.length);
