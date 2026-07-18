import fs from "fs";
import path from "path";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/** Prefix public asset paths for GitHub Pages basePath when set. */
export function withBasePath(src: string): string {
  if (!src.startsWith("/") || src.startsWith("//") || src.startsWith("http")) {
    return src;
  }
  return `${basePath}${src}`;
}

export function resolveProjectImage(src?: string): string | undefined {
  if (!src) return undefined;
  if (!fs.existsSync(path.join(process.cwd(), "public", src))) return undefined;
  return withBasePath(src);
}
