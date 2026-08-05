#!/usr/bin/env node
/**
 * Portfolio mockup framer — Frames device assets + clean plates for this site.
 *
 * Layouts:
 *   single | duo | trio
 *   combo-stage       — laptop back-center, phone front-right
 *   combo-overlap-right — laptop left, phone overlapping right
 *   combo-overlap-left  — phone left front, laptop right
 *   combo-split       — side-by-side, light overlap
 *
 * Combo plates use `devices: [{ device, shot }, ...]` instead of device+shots.
 *
 * Usage:
 *   node frame.mjs
 *   node frame.mjs agenticly decidr
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "../..");
const FRAMES_DIR = path.join(ROOT, "tools/frames/public/assets/frames");
const SHOTS = path.join(ROOT, ".tmp-monkr-shots");
const OUT_ROOT = path.join(ROOT, "public/images/projects");

const PLATE_W = 1600;
const PLATE_H = 1000;

const FRAME_META = {
  iphone: {
    file: "iphone.png",
    frameDimensions: { width: 1470, height: 3000 },
    screenOffset: { x: 75, y: 66 },
    screenWidth: 1320,
    screenHeight: 2868,
    cornerRadius: 120,
  },
  macbook: {
    file: "macbook.png",
    frameDimensions: { width: 3306, height: 1897 },
    screenOffset: { x: 373, y: 123 },
    screenWidth: 2560,
    screenHeight: 1600,
    cornerRadius: 18,
  },
};

const BG_PRESETS = {
  mist: { from: "#eef0f3", to: "#d5dae2" },
  porcelain: { from: "#f6f4f0", to: "#e4dfd6" },
  sand: { from: "#f3ebe2", to: "#ddd0c0" },
  slate: { from: "#2a2d33", to: "#15171b" },
  ink: { from: "#1c1e22", to: "#0c0d10" },
  fog: { from: "#e8ebf0", to: "#cfd5df" },
  dusk: { from: "#3a3340", to: "#1a1620" },
  sky: { from: "#e8eef6", to: "#c5d0e0" },
};

function svgGradient({ from, to }) {
  return Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${PLATE_W}" height="${PLATE_H}">
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="${from}"/>
          <stop offset="100%" stop-color="${to}"/>
        </linearGradient>
        <radialGradient id="v" cx="50%" cy="40%" r="70%">
          <stop offset="0%" stop-color="#ffffff" stop-opacity="0.16"/>
          <stop offset="100%" stop-color="#000000" stop-opacity="0.12"/>
        </radialGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#g)"/>
      <rect width="100%" height="100%" fill="url(#v)"/>
    </svg>`,
  );
}

async function makeBackground(name) {
  const preset = BG_PRESETS[name] || BG_PRESETS.mist;
  return sharp(svgGradient(preset)).png().toBuffer();
}

async function roundedShot(shotPath, w, h, radius, { cropBottom = 0 } = {}) {
  let input = sharp(shotPath);
  if (cropBottom > 0) {
    const meta = await sharp(shotPath).metadata();
    const cropH = Math.max(1, Math.round(meta.height * (1 - cropBottom)));
    input = sharp(shotPath).extract({
      left: 0,
      top: 0,
      width: meta.width,
      height: cropH,
    });
  }

  const resized = await input
    .resize(w, h, { fit: "cover", position: cropBottom > 0 ? "north" : "centre" })
    .png()
    .toBuffer();

  if (!radius) return resized;

  const mask = Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
      <rect width="${w}" height="${h}" rx="${radius}" ry="${radius}" fill="#fff"/>
    </svg>`,
  );

  return sharp(resized)
    .composite([{ input: mask, blend: "dest-in" }])
    .png()
    .toBuffer();
}

async function frameScreenshot(shotPath, device, { graphite = false, cropBottom = 0 } = {}) {
  const meta = FRAME_META[device];
  if (!meta) throw new Error(`Unknown device: ${device}`);

  const shot = await roundedShot(
    shotPath,
    meta.screenWidth,
    meta.screenHeight,
    meta.cornerRadius,
    { cropBottom },
  );

  let frameInput = path.join(FRAMES_DIR, meta.file);
  if (graphite && device === "iphone") {
    frameInput = await sharp(frameInput)
      .modulate({ brightness: 0.52, saturation: 0.8 })
      .png()
      .toBuffer();
  }

  const { width, height } = meta.frameDimensions;

  return sharp({
    create: {
      width,
      height,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    },
  })
    .composite([
      { input: shot, left: meta.screenOffset.x, top: meta.screenOffset.y },
      { input: frameInput, left: 0, top: 0 },
    ])
    .png()
    .toBuffer();
}

async function deviceShadow(devicePng, { blur = 42, opacity = 0.38, y = 28 } = {}) {
  const meta = await sharp(devicePng).metadata();
  const pad = Math.ceil(blur * 2.5);
  const w = meta.width;
  const h = meta.height;

  const { data, info } = await sharp(devicePng)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  for (let i = 0; i < data.length; i += 4) {
    const a = data[i + 3];
    data[i] = 0;
    data[i + 1] = 0;
    data[i + 2] = 0;
    data[i + 3] = Math.round(a * opacity);
  }

  const shaped = await sharp(data, {
    raw: { width: info.width, height: info.height, channels: 4 },
  })
    .png()
    .toBuffer();

  const shadow = await sharp({
    create: {
      width: w + pad * 2,
      height: h + pad * 2 + y,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    },
  })
    .composite([{ input: shaped, left: pad, top: pad + y }])
    .blur(blur)
    .png()
    .toBuffer();

  return { buffer: shadow, pad };
}

async function placeDevice(layers, deviceBuf, left, top, shadowOpts) {
  const { buffer: shadow, pad } = await deviceShadow(deviceBuf, shadowOpts);
  layers.push(
    { input: shadow, left: left - pad, top: top - pad },
    { input: deviceBuf, left, top },
  );
}

async function resizeDevice(framed, maxW, maxH) {
  const meta = await sharp(framed).metadata();
  const scale = Math.min(maxW / meta.width, maxH / meta.height);
  const w = Math.round(meta.width * scale);
  const h = Math.round(meta.height * scale);
  const buf = await sharp(framed).resize(w, h).png().toBuffer();
  return { buf, w, h };
}

function resolveShot(shot) {
  const abs = path.isAbsolute(shot) ? shot : path.join(SHOTS, shot);
  if (!fs.existsSync(abs)) throw new Error(`Missing screenshot: ${abs}`);
  return abs;
}

async function composeCombo(layers, MARGIN, { layout, laptop, phone, darkBg }) {
  // Distinct compositions so combo heroes don't all look the same
  const presets = {
    "combo-stage": {
      // Laptop sits back-center; phone steps forward lower-right
      laptop: { maxW: PLATE_W * 0.78, maxH: PLATE_H * 0.72, x: 0.08, y: 0.1 },
      phone: { maxW: PLATE_W * 0.28, maxH: PLATE_H * 0.86, x: 0.62, y: 0.1 },
      order: ["laptop", "phone"],
    },
    "combo-overlap-right": {
      // Laptop left-heavy; phone overlaps its right edge
      laptop: { maxW: PLATE_W * 0.74, maxH: PLATE_H * 0.7, x: 0.02, y: 0.16 },
      phone: { maxW: PLATE_W * 0.3, maxH: PLATE_H * 0.88, x: 0.58, y: 0.06 },
      order: ["laptop", "phone"],
    },
    "combo-overlap-left": {
      // Phone leads left; laptop fills right behind/beside
      laptop: { maxW: PLATE_W * 0.72, maxH: PLATE_H * 0.68, x: 0.28, y: 0.18 },
      phone: { maxW: PLATE_W * 0.3, maxH: PLATE_H * 0.9, x: 0.06, y: 0.05 },
      order: ["laptop", "phone"],
    },
    "combo-split": {
      // Clearer side-by-side, phone slightly forward
      laptop: { maxW: PLATE_W * 0.66, maxH: PLATE_H * 0.66, x: 0.04, y: 0.2 },
      phone: { maxW: PLATE_W * 0.28, maxH: PLATE_H * 0.84, x: 0.68, y: 0.08 },
      order: ["laptop", "phone"],
    },
  };

  const preset = presets[layout];
  if (!preset) throw new Error(`Unknown combo layout: ${layout}`);

  const lap = await resizeDevice(
    laptop,
    Math.round(preset.laptop.maxW),
    Math.round(preset.laptop.maxH),
  );
  const ph = await resizeDevice(
    phone,
    Math.round(preset.phone.maxW),
    Math.round(preset.phone.maxH),
  );

  const placements = {
    laptop: {
      buf: lap.buf,
      left: MARGIN + Math.round(PLATE_W * preset.laptop.x),
      top: MARGIN + Math.round(PLATE_H * preset.laptop.y),
      shadow: {
        blur: 50,
        opacity: darkBg ? 0.55 : 0.32,
        y: 36,
      },
    },
    phone: {
      buf: ph.buf,
      left: MARGIN + Math.round(PLATE_W * preset.phone.x),
      top: MARGIN + Math.round(PLATE_H * preset.phone.y),
      shadow: {
        blur: 42,
        opacity: darkBg ? 0.48 : 0.3,
        y: 26,
      },
    },
  };

  for (const key of preset.order) {
    const p = placements[key];
    await placeDevice(layers, p.buf, p.left, p.top, p.shadow);
  }
}

async function makePlate(plate) {
  const layout = plate.layout || "single";
  const bg = plate.bg || "mist";
  const darkBg = bg === "slate" || bg === "ink" || bg === "dusk";
  const base = await makeBackground(bg);

  const MARGIN = 200;
  const canvasW = PLATE_W + MARGIN * 2;
  const canvasH = PLATE_H + MARGIN * 2;
  const layers = [{ input: base, left: MARGIN, top: MARGIN }];

  const isCombo = layout.startsWith("combo-");

  if (isCombo) {
    const devices = plate.devices;
    if (!devices || devices.length < 2) {
      throw new Error(`Combo layout ${layout} needs devices: [{device, shot}, ...]`);
    }
    const laptopSpec = devices.find((d) => d.device === "macbook");
    const phoneSpec = devices.find((d) => d.device === "iphone");
    if (!laptopSpec || !phoneSpec) {
      throw new Error("Combo needs one macbook and one iphone entry");
    }

    const laptop = await frameScreenshot(
      resolveShot(laptopSpec.shot),
      "macbook",
      { graphite: false, cropBottom: laptopSpec.cropBottom ?? 0 },
    );
    const phone = await frameScreenshot(
      resolveShot(phoneSpec.shot),
      "iphone",
      { graphite: !darkBg, cropBottom: phoneSpec.cropBottom ?? plate.cropBottom ?? 0 },
    );

    await composeCombo(layers, MARGIN, { layout, laptop, phone, darkBg });
  } else {
    const device = plate.device;
    const graphite = !darkBg && device === "iphone";
    const shots = plate.shots || [];
    const framed = [];
    for (const shot of shots) {
      framed.push(
        await frameScreenshot(resolveShot(shot), device, {
          graphite,
          cropBottom: plate.cropBottom ?? 0,
        }),
      );
    }

    const fill =
      plate.fill ??
      (device === "macbook"
        ? 0.74
        : layout === "trio"
          ? 0.86
          : layout === "duo"
            ? 0.9
            : 0.9);

    if (layout === "single" || framed.length === 1) {
      const { buf, w, h } = await resizeDevice(
        framed[0],
        Math.round(PLATE_W * (device === "macbook" ? 0.92 : 0.46)),
        Math.round(PLATE_H * Math.max(fill, 0.9)),
      );
      const left = MARGIN + Math.round((PLATE_W - w) / 2);
      const top =
        MARGIN +
        Math.round((PLATE_H - h) / 2) -
        (device === "macbook" ? 10 : 0);
      await placeDevice(layers, buf, left, top, {
        blur: device === "macbook" ? 52 : 44,
        opacity: darkBg ? 0.55 : 0.35,
        y: device === "macbook" ? 40 : 28,
      });
    } else {
      const count = Math.min(framed.length, 3);
      const meta0 = await sharp(framed[0]).metadata();
      const centerH = Math.round(PLATE_H * fill);
      const sideH = Math.round(PLATE_H * fill * 0.88);
      const centerScale = centerH / meta0.height;
      const sideScale = sideH / meta0.height;

      const sizes = Array.from({ length: count }, (_, i) => {
        const useCenter = count === 3 ? i === 1 : i === 1;
        const s = useCenter ? centerScale : sideScale;
        return {
          w: Math.round(meta0.width * s),
          h: Math.round(meta0.height * s),
          isCenter: useCenter,
        };
      });

      const gap = Math.round(
        (sizes.find((s) => s.isCenter)?.w || sizes[0].w) * 0.62,
      );
      const refW = sizes[0].w;
      const totalW = refW + gap * (count - 1);
      const startX = MARGIN + Math.round((PLATE_W - totalW) / 2);
      const order = count === 3 ? [0, 2, 1] : [0, 1];

      for (const i of order) {
        const { w, h, isCenter } = sizes[i];
        const deviceBuf = await sharp(framed[i]).resize(w, h).png().toBuffer();
        const left = startX + i * gap + Math.round((refW - w) / 2);
        const top =
          MARGIN + Math.round((PLATE_H - h) / 2) + (isCenter ? -14 : 14);
        await placeDevice(layers, deviceBuf, left, top, {
          blur: isCenter ? 48 : 36,
          opacity: darkBg
            ? isCenter
              ? 0.5
              : 0.35
            : isCenter
              ? 0.32
              : 0.22,
          y: isCenter ? 28 : 18,
        });
      }
    }
  }

  const composed = await sharp({
    create: {
      width: canvasW,
      height: canvasH,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    },
  })
    .composite(layers)
    .png()
    .toBuffer();

  return sharp(composed)
    .extract({ left: MARGIN, top: MARGIN, width: PLATE_W, height: PLATE_H })
    .jpeg({ quality: 90, mozjpeg: true })
    .toBuffer();
}

function loadManifest() {
  return JSON.parse(fs.readFileSync(path.join(__dirname, "manifest.json"), "utf8"));
}

async function run() {
  if (!fs.existsSync(FRAMES_DIR)) {
    console.error("Frames assets missing at tools/frames/public/assets/frames");
    process.exit(1);
  }

  const only = new Set(process.argv.slice(2));
  const manifest = loadManifest();
  let ok = 0;
  let fail = 0;

  for (const project of manifest.projects) {
    if (only.size && !only.has(project.slug)) continue;
    const outDir = path.join(OUT_ROOT, project.slug);
    fs.mkdirSync(outDir, { recursive: true });

    for (const plate of project.plates) {
      const outPath = path.join(outDir, plate.out);
      try {
        const buf = await makePlate({
          ...plate,
          bg: plate.bg || project.bg || "mist",
        });
        fs.writeFileSync(outPath, buf);
        const meta = await sharp(buf).metadata();
        console.log(`✓ ${project.slug}/${plate.out}  ${meta.width}×${meta.height}`);
        ok++;
      } catch (err) {
        console.error(`✗ ${project.slug}/${plate.out}: ${err.message}`);
        fail++;
      }
    }
  }

  console.log(`\nDone. ${ok} ok, ${fail} failed.`);
  if (fail) process.exit(1);
}

run();
