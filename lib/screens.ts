import fs from "fs";
import path from "path";
import { withBasePath } from "@/lib/projectImage";

/** video: optional looping clip for this screen (src is its poster). contain: show the whole frame (for 9:16 captures). */
export type Screen = { src: string; app: string; video?: string; contain?: boolean };

// Captures that are 9:16 rather than a full-height phone screen; shown whole instead of cropped.
const containSlugs = new Set(["innerverse"]);

/** Phone screenshots for a project, from public/images/screens/<slug>/ (1.jpg, 2.jpg, ...). */
export function getScreens(slug: string, app: string): Screen[] {
  const dir = path.join(process.cwd(), "public/images/screens", slug);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".jpg"))
    .sort((a, b) => parseInt(a) - parseInt(b))
    .map((f) => {
      const video = f.replace(/\.jpg$/, ".mp4");
      return {
        src: withBasePath(`/images/screens/${slug}/${f}`),
        app,
        ...(fs.existsSync(path.join(dir, video)) ? { video: withBasePath(`/images/screens/${slug}/${video}`) } : {}),
        ...(containSlugs.has(slug) ? { contain: true } : {}),
      };
    });
}

/** Glow colour behind the phone, picked from each app's own UI. */
export const appTint: Record<string, string> = {
  agenticly: "#22c55e",
  innerverse: "#d4a24c",
  bugmapper: "#ea580c",
  safedeal: "#f97316",
  qubio: "#a855f7",
  "kitty-nip": "#7c3aed",
};
