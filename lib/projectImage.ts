import fs from "fs";
import path from "path";

export function resolveProjectImage(src?: string): string | undefined {
  if (!src) return undefined;
  return fs.existsSync(path.join(process.cwd(), "public", src)) ? src : undefined;
}
