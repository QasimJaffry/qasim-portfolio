#!/usr/bin/env node
/**
 * Hybrid mockup pipeline
 *
 *   Monkr  → clean native iOS only (Sex Therapy Pro)
 *   Pillow → everything else (Android chrome strip, web+phone, editorial plates)
 *
 * Usage:
 *   node scripts/hybrid-plates.mjs              # all
 *   node scripts/hybrid-plates.mjs agenticly    # AppScreen copy-only (no Pillow compose)
 *   node scripts/hybrid-plates.mjs sextherapypro
 */
import { spawnSync } from 'node:child_process';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { existsSync } from 'node:fs';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const PY = join(ROOT, '.venv-mockups', 'bin', 'python');

/** Projects that get real Apple frames via Monkr (clean iOS exports only).
 *  Empty for now — STP looks better on the Pillow wellness plates.
 *  Add a slug here when a native iOS export clearly beats Pillow. */
const MONKR_SLUGS = new Set([]);

/** AppScreen-only — generate-mockups just copies exported plates (no composition). */
const APPSCREEN_SLUGS = new Set(['agenticly']);

/** Pillow builders in generate-mockups.py */
const PILLOW_SLUGS = [
	'snapwork',
	'catchat',
	'cpas-huddle-up',
	'decidr',
	'dealflow-ai',
	'qubio',
	'bugmapper',
	'safedeal',
	'realtag',
	'innerverse',
	'kitty-nip',
	'meet-and-greet',
	'interio',
	'bschedule',
	'sextherapypro'
];

function run(cmd, args, env = {}) {
	console.log(`\n› ${cmd} ${args.join(' ')}`);
	const r = spawnSync(cmd, args, {
		cwd: ROOT,
		stdio: 'inherit',
		env: { ...process.env, ...env }
	});
	if (r.status !== 0) {
		throw new Error(`${cmd} failed with status ${r.status}`);
	}
}

const args = process.argv.slice(2);
const want = args.length ? args : [...PILLOW_SLUGS, ...MONKR_SLUGS, ...APPSCREEN_SLUGS];

const pillow = want.filter((s) => PILLOW_SLUGS.includes(s));
const monkr = want.filter((s) => MONKR_SLUGS.has(s));
const appscreen = want.filter((s) => APPSCREEN_SLUGS.has(s));
const unknown = want.filter(
	(s) => !PILLOW_SLUGS.includes(s) && !MONKR_SLUGS.has(s) && !APPSCREEN_SLUGS.has(s)
);
if (unknown.length) {
	console.error(`Unknown slug(s): ${unknown.join(', ')}`);
	process.exit(1);
}

if (!existsSync(PY)) {
	console.error(`Missing venv python at ${PY}`);
	process.exit(1);
}

if (pillow.length) {
	console.log(`\n══ Pillow path (${pillow.length}) ══`);
	run(PY, [join(ROOT, 'scripts', 'generate-mockups.py'), ...pillow]);
}

if (appscreen.length) {
	console.log(`\n══ AppScreen copy-only (${appscreen.length}) ══`);
	run(PY, [join(ROOT, 'scripts', 'generate-mockups.py'), ...appscreen]);
}

if (monkr.length) {
	console.log(`\n══ Monkr path (${monkr.length}) ══`);
	run(
		'node',
		[join(ROOT, 'scripts', 'monkr-plates.mjs'), ...monkr],
		{ PLAYWRIGHT_BROWSERS_PATH: `${process.env.HOME}/Library/Caches/ms-playwright` }
	);
}

console.log('\nHybrid done.');
console.log(`  Monkr    : ${[...MONKR_SLUGS].join(', ') || '(none)'}`);
console.log(`  AppScreen: ${[...APPSCREEN_SLUGS].join(', ') || '(none)'}`);
console.log(`  Pillow   : ${PILLOW_SLUGS.join(', ')}`);
