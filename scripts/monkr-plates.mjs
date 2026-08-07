#!/usr/bin/env node
/**
 * Portfolio mockup plates via Monkr — CLEAN NATIVE iOS by default.
 * Android: use pixelPhone() → deviceId `pixel-7-pro` (also: nothing-phone).
 *
 * Prefer `node scripts/hybrid-plates.mjs` which routes:
 *   Monkr  → sextherapypro (and any future clean iOS exports)
 *   Pillow → everyone else (scripts/generate-mockups.py)
 *
 * Usage: node scripts/monkr-plates.mjs [slug...]
 */
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const MONKR = join(ROOT, '.tmp-monkr');
const SHOTS = join(ROOT, '.tmp-monkr-shots');
const OUT = join(ROOT, 'public', 'images', 'projects');
const PROJECTS = join(ROOT, '.tmp-monkr-projects');
const BGS = join(ROOT, 'public', 'images', 'mockup-bgs');

const { render } = await import(join(MONKR, 'cli', 'render.mjs'));

async function dataUrl(path) {
	const buf = await readFile(path);
	const mime = path.endsWith('.jpg') || path.endsWith('.jpeg') ? 'image/jpeg' : 'image/png';
	return `data:${mime};base64,${buf.toString('base64')}`;
}

const softShadow = {
	enabled: true,
	color: 'rgba(0,0,0,0.26)',
	blur: 32,
	spread: 0,
	offsetX: 0,
	offsetY: 12
};

function phone(id, color, shot, { x, y, scale = 0.72, rotation = 0, tiltY = 0, deviceId = 'iphone-16-pro' } = {}) {
	return {
		id,
		deviceId,
		deviceColorId: color,
		screenshotUrl: shot,
		screenshotFile: null,
		extraScreenshots: [],
		x,
		y,
		scale,
		rotation,
		tiltX: 0,
		tiltY,
		shadow: softShadow,
		frameStyle: 'default',
		borderRadius: 16,
		glow: { enabled: false, color: 'rgba(255,255,255,0.5)', blur: 16, spread: 2 }
	};
}

/** Real Pixel 7 Pro bezel (Monkr). Colors: obsidian | snow | hazel */
function pixelPhone(id, shot, opts = {}) {
	const { color = 'obsidian', ...rest } = opts;
	return phone(id, color, shot, { deviceId: 'pixel-7-pro', ...rest });
}

function macbook(id, shot, { x, y, scale = 0.9 } = {}) {
	return {
		id,
		deviceId: 'macbook-pro-16',
		deviceColorId: 'silver',
		screenshotUrl: shot,
		screenshotFile: null,
		extraScreenshots: [],
		x,
		y,
		scale,
		rotation: 0,
		tiltX: 0,
		tiltY: 0,
		shadow: softShadow,
		frameStyle: 'default',
		borderRadius: 8,
		glow: { enabled: false, color: 'rgba(255,255,255,0.5)', blur: 16, range: 2 }
	};
}

function tablet(id, color, shot, { x, y, scale = 0.7, rotation = 0 } = {}) {
	return {
		id,
		deviceId: 'ipad-pro-13',
		deviceColorId: color,
		screenshotUrl: shot,
		screenshotFile: null,
		extraScreenshots: [],
		x,
		y,
		scale,
		rotation,
		tiltX: 0,
		tiltY: 0,
		shadow: softShadow,
		frameStyle: 'default',
		borderRadius: 12,
		glow: { enabled: false, color: 'rgba(255,255,255,0.5)', blur: 16, size: 2 }
	};
}

function project({ bg, objects, w = 1600, h = 1000, padding = 2 }) {
	return {
		version: 3,
		background: bg,
		canvasSize: { width: w, height: h, presetName: 'Portfolio Wide' },
		padding,
		exportConfig: { scale: 1, format: 'png' },
		textOverlay: {},
		textBlocks: [],
		sceneObjects: objects,
		appStore: {
			enabled: false,
			numSections: 1,
			sectionWidth: w,
			sectionHeight: h,
			presetName: 'Custom'
		}
	};
}

function solidBg(hex, name = 'Studio') {
	return {
		type: 'solid',
		solidColor: hex,
		gradientCss: null,
		gradientName: name,
		imageUrl: null
	};
}

function gradientBg(css, solid, name) {
	return {
		type: 'gradient',
		solidColor: solid,
		gradientCss: css,
		gradientName: name,
		imageUrl: null
	};
}

async function deskBg(name) {
	const path = join(BGS, `${name}.jpg`);
	if (!existsSync(path)) throw new Error(`Missing desk bg: ${path}`);
	return {
		type: 'image',
		solidColor: '#f5f1e9',
		gradientCss: null,
		gradientName: null,
		imageUrl: await dataUrl(path)
	};
}

const studio = solidBg('#f3f3f5', 'Studio Mist');
const studioWarm = solidBg('#f6f3ee', 'Studio Warm');
const studioCool = gradientBg(
	'linear-gradient(180deg, #f7f8fa 0%, #eef0f4 70%, #e4e7ed 100%)',
	'#f0f2f6',
	'Studio Floor'
);

const phoneColors = ['black-titanium', 'natural-titanium', 'white-titanium'];

const ASPECT = {
	phone: 1206 / 2623, // ~0.460
	tablet: 2048 / 2733, // ~0.749 portrait iPad Pro 13
	laptop: 3262 / 2109 // ~1.547 MacBook Pro 16 screen
};

async function load(slug, name) {
	return dataUrl(join(SHOTS, slug, name));
}

/**
 * Light trim of letterbox bars only. Match device aspect by padding (contain).
 * No cover-crop, no inset shrink — those made UIs look blown up.
 */
async function loadFit(slug, name, kind, bias = 'center') {
	const { execFileSync } = await import('node:child_process');
	const py = join(ROOT, '.venv-mockups', 'bin', 'python');
	const src = join(SHOTS, slug, name);
	const aspect = ASPECT[kind];
	const out = join(
		PROJECTS,
		'_fit',
		`${slug}-${name.replace(/\W+/g, '_')}-${kind}-${bias}.jpg`
	);
	await mkdir(join(PROJECTS, '_fit'), { recursive: true });
	const script = `
from PIL import Image
import numpy as np
src = ${JSON.stringify(src)}
dst = ${JSON.stringify(out)}
target = ${aspect}
im = Image.open(src).convert("RGB")
a = np.asarray(im).astype(np.float32)
h0, w0 = a.shape[:2]
row_mean = a.mean(axis=(1, 2)); col_mean = a.mean(axis=(0, 2))
row_std = a.std(axis=(1, 2)); col_std = a.std(axis=(0, 2))
def bar(mean, std, lo=14, hi=252):
    return ((mean < lo) | (mean > hi)) & (std < 8)
def strip_ends(mask):
    n = len(mask); i0, i1 = 0, n
    while i0 < n and mask[i0]: i0 += 1
    while i1 > i0 and mask[i1 - 1]: i1 -= 1
    return i0, i1
y0b, y1b = strip_ends(bar(row_mean, row_std))
x0b, x1b = strip_ends(bar(col_mean, col_std))
if (y1b - y0b) > h0 * 0.55 and (x1b - x0b) > w0 * 0.55:
    if (y1b - y0b) < h0 * 0.97 or (x1b - x0b) < w0 * 0.97:
        im = im.crop((x0b, y0b, x1b, y1b))
        a = np.asarray(im).astype(np.float32)
edge = np.concatenate([
    a[:4].reshape(-1, 3), a[-4:].reshape(-1, 3),
    a[:, :4].reshape(-1, 3), a[:, -4:].reshape(-1, 3),
])
bg_t = tuple(int(round(c)) for c in np.median(edge, axis=0))
w, h = im.size
cur = w / max(h, 1)
if abs(cur - target) > 0.03:
    if cur > target:
        nh = max(1, int(round(w / target)))
        canvas = Image.new("RGB", (w, nh), bg_t)
        canvas.paste(im, (0, (nh - h) // 2)); im = canvas
    else:
        nw = max(1, int(round(h * target)))
        canvas = Image.new("RGB", (nw, h), bg_t)
        canvas.paste(im, ((nw - w) // 2, 0)); im = canvas
tw = 1600 if target >= 1 else 1200
th = max(1, int(round(tw / target)))
im = im.resize((tw, th), Image.Resampling.LANCZOS)
im.save(dst, quality=92, optimize=True)
`;
	execFileSync(py, ['-c', script], { stdio: 'pipe' });
	return dataUrl(out);
}

async function loadRotated(slug, name, degrees) {
	// Prefer laptop for widescreen web — landscape iPad aspect (≈1.33) blows up
	// 16:10 shots. Kept for odd cases; just rotate + gentle contain.
	const { execFileSync } = await import('node:child_process');
	const py = join(ROOT, '.venv-mockups', 'bin', 'python');
	const src = join(SHOTS, slug, name);
	const out = join(PROJECTS, '_rot', `${slug}-${name.replace(/\W+/g, '_')}-${degrees}.jpg`);
	await mkdir(join(PROJECTS, '_rot'), { recursive: true });
	const script = `
from PIL import Image
import numpy as np
src = ${JSON.stringify(src)}
dst = ${JSON.stringify(out)}
deg = ${-degrees}
target2 = ${ASPECT.tablet}
im = Image.open(src).convert("RGB")
a = np.asarray(im).astype(np.float32)
edge = np.concatenate([
    a[:4].reshape(-1, 3), a[-4:].reshape(-1, 3),
    a[:, :4].reshape(-1, 3), a[:, -4:].reshape(-1, 3),
])
bg_t = tuple(int(round(c)) for c in np.median(edge, axis=0))
im = im.rotate(deg, expand=True)
w, h = im.size
cur = w / max(h, 1)
if abs(cur - target2) > 0.03:
    if cur > target2:
        nh = max(1, int(round(w / target2)))
        canvas = Image.new("RGB", (w, nh), bg_t)
        canvas.paste(im, (0, (nh - h) // 2)); im = canvas
    else:
        nw = max(1, int(round(h * target2)))
        canvas = Image.new("RGB", (nw, h), bg_t)
        canvas.paste(im, ((nw - w) // 2, 0)); im = canvas
im = im.resize((1200, int(round(1200 / target2))), Image.Resampling.LANCZOS)
im.save(dst, quality=92, optimize=True)
`;
	execFileSync(py, ['-c', script], { stdio: 'pipe' });
	return dataUrl(out);
}

/** Large centered laptop — web-only hero */
async function laptopOnly(slug, web, bg) {
	const w = await loadFit(slug, web, 'laptop', 'left');
	return project({
		bg,
		padding: 0,
		objects: [macbook('mac', w, { x: 50, y: 52, scale: 1 })]
	});
}

/** Landscape tablet + phone — phone overlapping tablet edge */
async function landscapeTabletPhone(slug, web, phoneName, phoneColor, bg) {
	const [w, p] = await Promise.all([
		loadRotated(slug, web, -90),
		loadFit(slug, phoneName, 'phone')
	]);
	return project({
		bg,
		padding: 0,
		objects: [
			tablet('tab', 'space-gray', w, { x: 44, y: 50, scale: 1, rotation: 90 }),
			phone('ph', phoneColor, p, { x: 54, y: 58, scale: 0.44 })
		]
	});
}

/** Laptop + phone overlapping — phone tucked over laptop bezel */
async function laptopPhone(slug, web, phoneName, phoneColor, bg) {
	const [w, p] = await Promise.all([
		loadFit(slug, web, 'laptop', 'left'),
		loadFit(slug, phoneName, 'phone')
	]);
	return project({
		bg,
		padding: 0,
		objects: [
			macbook('mac', w, { x: 52, y: 50, scale: 1 }),
			phone('ph', phoneColor, p, { x: 36, y: 58, scale: 0.5 })
		]
	});
}

/** Laptop + phone + tablet — overlapping family, no big gaps */
async function laptopPhoneTablet(slug, { web, phoneShot, tabletShot, phoneColor, tabletColor = 'space-gray' }, bg) {
	const [w, p, t] = await Promise.all([
		loadFit(slug, web, 'laptop', 'left'),
		loadFit(slug, phoneShot, 'phone'),
		loadFit(slug, tabletShot, 'tablet', 'top')
	]);
	return project({
		bg,
		padding: 0,
		objects: [
			macbook('mac', w, { x: 50, y: 48, scale: 1 }),
			tablet('tab', tabletColor, t, { x: 62, y: 56, scale: 0.48 }),
			phone('ph', phoneColor, p, { x: 36, y: 58, scale: 0.42 })
		]
	});
}

/** Laptop + portrait tablet overlapping */
async function laptopTablet(slug, web, tabletShot, bg) {
	const [w, t] = await Promise.all([
		loadFit(slug, web, 'laptop'),
		loadFit(slug, tabletShot, 'tablet')
	]);
	return project({
		bg,
		padding: 0,
		objects: [
			macbook('mac', w, { x: 44, y: 50, scale: 1 }),
			tablet('tab', 'space-gray', t, { x: 64, y: 54, scale: 0.52 })
		]
	});
}

/** Two phones — overlapping */
async function duo(slug, names, colors, bg) {
	const [a, b] = await Promise.all(names.map((n) => loadFit(slug, n, 'phone')));
	return project({
		bg,
		padding: 0,
		objects: [
			phone('l', colors[0], a, { x: 42, y: 52, scale: 1 }),
			phone('r', colors[1], b, { x: 58, y: 52, scale: 1 })
		]
	});
}

/** Three phones — center forward, tight */
async function triple(slug, names, colors, bg) {
	const [a, b, c] = await Promise.all(names.map((n) => loadFit(slug, n, 'phone')));
	return project({
		bg,
		padding: 0,
		objects: [
			phone('l', colors[0], a, { x: 36, y: 54, scale: 0.92 }),
			phone('r', colors[2], c, { x: 64, y: 54, scale: 0.92 }),
			phone('c', colors[1], b, { x: 50, y: 50, scale: 1 })
		]
	});
}

/** Five-phone showcase — packed */
async function five(slug, names, colors, bg) {
	const shots = await Promise.all(names.map((n) => loadFit(slug, n, 'phone')));
	const [bl, ml, c, mr, br] = shots;
	return project({
		bg,
		padding: 0,
		objects: [
			phone('bl', colors[0], bl, { x: 22, y: 54, scale: 0.82 }),
			phone('ml', colors[1], ml, { x: 36, y: 52, scale: 0.94 }),
			phone('c', colors[2], c, { x: 50, y: 50, scale: 1 }),
			phone('mr', colors[3] ?? colors[1], mr, { x: 64, y: 52, scale: 0.94 }),
			phone('br', colors[4] ?? colors[0], br, { x: 78, y: 54, scale: 0.82 })
		]
	});
}

const builders = {
	// web + mobile + charts → full family hero
	async agenticly() {
		const bgDark = solidBg('#121418', 'Ink Studio');
		const bg = studioCool;
		const c = phoneColors;
		return {
			// widescreen web → MacBook (iPad landscape aspect blows up 16:10 shots)
			hero: await laptopPhone('agenticly', 'web.png', 'home.jpg', 'black-titanium', bgDark),
			'detail-1': await laptopPhone('agenticly', 'web.png', 'chat.jpg', 'natural-titanium', bg),
			'detail-2': await triple('agenticly', ['home.jpg', 'charts.jpg', 'analysis.jpg'], c, bg)
		};
	},

	async snapwork() {
		const bg = studioWarm;
		const c = phoneColors;
		return {
			hero: await laptopPhone(
				'snapwork',
				'campaigns-web.png',
				'listing.png',
				'black-titanium',
				bg
			),
			'detail-1': await laptopPhone(
				'snapwork',
				'dashboard.png',
				'listing.png',
				'natural-titanium',
				bg
			),
			'detail-2': await triple('snapwork', ['connect.png', 'portfolio.png', 'listing.png'], c, bg)
		};
	},

	async catchat() {
		const bg = studio;
		const c = phoneColors;
		return {
			hero: await laptopPhone('catchat', 'web.png', 'chat.png', 'white-titanium', bg),
			// web-modal is landscape — use as second laptop plate, not tablet
			'detail-1': await laptopPhone(
				'catchat',
				'web-loggedin.png',
				'home.png',
				'natural-titanium',
				bg
			),
			'detail-2': await triple('catchat', ['home.png', 'modal.png', 'list.png'], c, bg)
		};
	},

	async 'cpas-huddle-up'() {
		const bg = solidBg('#111418', 'Ink');
		const c = phoneColors;
		return {
			hero: await laptopPhone(
				'cpas-huddle-up',
				'web.png',
				'home.png',
				'black-titanium',
				bg
			),
			'detail-1': await triple('cpas-huddle-up', ['podcast.png', 'room.png', 'home.png'], c, bg),
			'detail-2': await duo('cpas-huddle-up', ['splash.png', 'room.png'], c, bg)
		};
	},

	async decidr() {
		const bg = studioWarm;
		const c = phoneColors;
		return {
			hero: await laptopPhone(
				'decidr',
				'landing.png',
				'dashboard-mobile.png',
				'natural-titanium',
				bg
			),
			'detail-1': await laptopOnly('decidr', 'dashboard.png', bg),
			'detail-2': await triple(
				'decidr',
				['dashboard-mobile.png', 'detail-mobile.png', 'compare-mobile.png'],
				c,
				bg
			)
		};
	},

	async 'dealflow-ai'() {
		const bg = studioCool;
		const c = phoneColors;
		return {
			hero: await laptopPhone(
				'dealflow-ai',
				'web.png',
				'home.png',
				'black-titanium',
				bg
			),
			'detail-1': await laptopOnly('dealflow-ai', 'web-2.png', bg),
			'detail-2': await triple('dealflow-ai', ['home.png', 'pipeline.png', 'deal.png'], c, bg)
		};
	},

	async qubio() {
		const bg = studio;
		const c = phoneColors;
		return {
			// Prefer Pillow compose_laptop_flanked (phone|laptop|phone) via generate-mockups.py.
			hero: await laptopPhone('qubio', 'web.png', 'pages.png', 'white-titanium', bg),
			'detail-1': await duo('qubio', ['home.png', 'blocks.png'], c, bg),
			'detail-2': await duo('qubio', ['qrinfo.png', 'share.png'], c, bg)
		};
	},

	async bugmapper() {
		const bg = studioWarm;
		const c = phoneColors;
		return {
			hero: await laptopPhone('bugmapper', 'web.png', 'home.png', 'black-titanium', bg),
			'detail-1': await triple('bugmapper', ['home.png', 'trap.png', 'scan.png'], c, bg),
			'detail-2': await duo('bugmapper', ['sync.png', 'pim.png'], c, bg)
		};
	},

	async safedeal() {
		const bg = studioWarm;
		const c = phoneColors;
		const hasWeb = existsSync(join(SHOTS, 'safedeal', 'web.png'));
		return {
			hero: hasWeb
				? await laptopPhone('safedeal', 'web.png', 'home.png', 'black-titanium', bg)
				: await triple('safedeal', ['home.png', 'insights.png', 'product.png'], c, bg),
			'detail-1': await triple('safedeal', ['home.png', 'insights.png', 'ai.png'], c, bg),
			'detail-2': await duo('safedeal', ['product.png', 'browse.png'], c, bg)
		};
	},

	async sextherapypro() {
		// Clean native iOS — only project that stays on Monkr in the hybrid path
		const bg = solidBg('#e8ecf6', 'Mist');
		const c = [...phoneColors, 'natural-titanium', 'black-titanium'];
		return {
			hero: await triple('sextherapypro', ['plan.png', 'goals.png', 'map.png'], c, bg),
			'detail-1': await duo('sextherapypro', ['game.png', 'chat.png'], c, bg)
		};
	},

	async realtag() {
		const bg = solidBg('#14161a', 'Ink');
		const c = phoneColors;
		return {
			hero: await triple('realtag', ['detect.png', 'tagged.png', 'manual.png'], c, bg),
			'detail-1': await duo('realtag', ['form.png', 'list.png'], c, bg),
			'detail-2': await triple('realtag', ['detect.png', 'manual.png', 'list.png'], c, bg)
		};
	},

	async innerverse() {
		const bg = solidBg('#12141a', 'Ink');
		const c = [...phoneColors, 'natural-titanium', 'white-titanium'];
		return {
			hero: await five('innerverse', ['s1.png', 's2.png', 's3.png', 's4.png', 's5.png'], c, bg),
			'detail-1': await triple('innerverse', ['s6.png', 's7.png', 's8.png'], c, bg)
		};
	},

	async 'kitty-nip'() {
		const bg = studioWarm;
		const c = phoneColors;
		return {
			hero: await triple('kitty-nip', ['swipe.png', 'profile.png', 'chat.png'], c, bg),
			'detail-1': await duo('kitty-nip', ['welcome.png', 'match.png'], c, bg),
			'detail-2': await triple('kitty-nip', ['swipe.png', 'chat.png', 'match.png'], c, bg)
		};
	},

	async 'meet-and-greet'() {
		const bg = solidBg('#111418', 'Ink');
		const c = phoneColors;
		return {
			hero: await triple('meet-and-greet', ['online.png', 'call.png', 'group.png'], c, bg),
			'detail-1': await duo('meet-and-greet', ['dial.png', 'call.png'], c, bg),
			'detail-2': await triple('meet-and-greet', ['online.png', 'dial.png', 'group.png'], c, bg)
		};
	},

	async interio() {
		const bg = studioCool;
		const c = phoneColors;
		return {
			hero: await triple('interio', ['home.png', 'camera.png', 'ar.png'], c, bg),
			'detail-1': await duo('interio', ['post-scan.png', 'ar.png'], c, bg),
			'detail-2': await triple('interio', ['home.png', 'post-scan.png', 'camera.png'], c, bg)
		};
	},

	async bschedule() {
		const bg = studioWarm;
		const c = phoneColors;
		return {
			hero: await triple('bschedule', ['m1.png', 'm2.png', 'm3.png'], c, bg),
			'detail-1': await duo('bschedule', ['m4.png', 'm5.png'], c, bg),
			'detail-2': await triple('bschedule', ['m1.png', 'm4.png', 'm6.png'], c, bg)
		};
	}
};

async function jpegFromPng(pngPath, jpgPath) {
	const { execFileSync } = await import('node:child_process');
	const py = join(ROOT, '.venv-mockups', 'bin', 'python');
	// Crop-to-devices when bg is flat (studio). Skip crop when desk photo
	// (wall/floor contrast fools the mask). Always output 1600×1000.
	const script = `
from PIL import Image, ImageFilter
import numpy as np
src = ${JSON.stringify(pngPath)}
dst = ${JSON.stringify(jpgPath)}
im = Image.open(src).convert("RGB")
a = np.asarray(im).astype(np.float32)
h, w = a.shape[:2]
cs = max(8, min(h, w) // 40)
corners = np.concatenate([
    a[:cs, :cs].reshape(-1, 3),
    a[:cs, -cs:].reshape(-1, 3),
    a[-cs:, :cs].reshape(-1, 3),
    a[-cs:, -cs:].reshape(-1, 3),
])
bg = np.median(corners, axis=0)
# desk plates: floor vs wall → corner variance high → skip crop
corner_std = corners.std(axis=0).mean()
tw, th = 1600, 1000
if corner_std > 18:
    if im.size != (tw, th):
        im = im.resize((tw, th), Image.Resampling.LANCZOS)
    im.save(dst, quality=90, optimize=True)
else:
    diff = np.abs(a - bg).mean(axis=2)
    mask = (diff > 16).astype(np.uint8) * 255
    mask = np.asarray(Image.fromarray(mask, mode="L").filter(ImageFilter.MaxFilter(21))) > 0
    ys, xs = np.where(mask)
    if len(xs) < 200:
        im.resize((tw, th), Image.Resampling.LANCZOS).save(dst, quality=90, optimize=True)
    else:
        pad = 10
        x0 = max(0, int(xs.min()) - pad)
        y0 = max(0, int(ys.min()) - pad)
        x1 = min(im.width, int(xs.max()) + pad + 1)
        y1 = min(im.height, int(ys.max()) + pad + 1)
        crop = im.crop((x0, y0, x1, y1))
        scale = min((tw * 0.98) / crop.width, (th * 0.98) / crop.height)
        nw, nh = max(1, int(crop.width * scale)), max(1, int(crop.height * scale))
        crop = crop.resize((nw, nh), Image.Resampling.LANCZOS)
        canvas = Image.new("RGB", (tw, th), tuple(int(round(c)) for c in bg))
        canvas.paste(crop, ((tw - nw) // 2, (th - nh) // 2))
        canvas.save(dst, quality=90, optimize=True)
`;
	execFileSync(py, ['-c', script], { stdio: 'inherit' });
}

async function runSlug(slug) {
	const plates = await builders[slug]();
	const dest = join(OUT, slug);
	await mkdir(dest, { recursive: true });
	await mkdir(join(PROJECTS, slug), { recursive: true });

	const { readdirSync, unlinkSync } = await import('node:fs');
	for (const f of readdirSync(dest)) {
		if (/^(hero|detail-\d+)\.(jpg|png|jpeg|webp)$/i.test(f)) {
			unlinkSync(join(dest, f));
		}
	}

	for (const [name, proj] of Object.entries(plates)) {
		const monkrPath = join(PROJECTS, slug, `${name}.monkr`);
		await writeFile(monkrPath, JSON.stringify(proj));
		const tmpOut = join(PROJECTS, slug, `${name}-out`);
		await mkdir(tmpOut, { recursive: true });
		console.log(`• Rendering ${slug}/${name}`);
		const written = await render({
			monkr: monkrPath,
			out: tmpOut,
			format: 'png',
			scale: 1,
			shots: [],
			build: false
		});
		if (!written.length) throw new Error(`No output for ${slug}/${name}`);
		const jpg = join(dest, `${name}.jpg`);
		await jpegFromPng(written[0], jpg);
		console.log(`  → ${jpg}`);
	}
}

const args = process.argv.slice(2);
// Default: only clean-iOS Monkr targets (hybrid owns the rest via Pillow)
const MONKR_DEFAULT = ['sextherapypro'];
const slugs = args.length ? args : MONKR_DEFAULT;
for (const slug of slugs) {
	if (!builders[slug]) throw new Error(`Unknown slug: ${slug}`);
	if (!existsSync(join(SHOTS, slug))) {
		throw new Error(`Missing staged shots at .tmp-monkr-shots/${slug}`);
	}
	await runSlug(slug);
}
console.log('Done.');
