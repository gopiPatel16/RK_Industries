/**
 * Guarantee Next starts from a clean build cache on this project's exFAT volume.
 *
 * macOS cannot store extended attributes on exFAT, so it writes an AppleDouble
 * sidecar (`._<name>`) next to any file carrying them. Turbopack reads those
 * sidecars back as if they were real cache entries and gets 4 KB of binary
 * metadata instead of the chunk it wrote — so a dev server that worked before a
 * restart serves broken chunks after one. A single session leaves a few hundred
 * of these inside `.next`.
 *
 * Deleting only the sidecars is not enough: an unclean shutdown or a drive that
 * drops off mid-write (both routine for a USB volume) also leaves half-written
 * chunks that survive into the next boot. So the whole cache goes. The cost is
 * one full compile at startup — a slower first page for a dev server that
 * actually starts.
 *
 * Relocating `.next` off the volume is not an option: `distDir` may not leave
 * the project, and symlinking it breaks Turbopack's PostCSS transform, which
 * resolves `@tailwindcss/postcss` by walking up from the chunk's own directory
 * and so never reaches the project's `node_modules`.
 *
 * Scope is deliberately just `.next`. Sidecars elsewhere in the tree are git
 * noise rather than a build problem, and some of them are committed — sweeping
 * the whole project deletes tracked files.
 *
 * Runs from `predev` / `prebuild`, and is a no-op on filesystems that hold
 * xattrs natively (APFS, HFS+) and on CI, so Vercel builds keep their cache.
 */
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const projectDir = process.cwd();

if (process.env.CI || process.env.VERCEL) {
  process.exit(0);
}

/**
 * The filesystem the project sits on. macOS `stat` has no format for this, so
 * resolve the mount point with `df` and look its type up in `mount`. The mount
 * point is every field from the sixth on, because volume names contain spaces
 * ("/Volumes/TOSHIBA G").
 */
function fsType(dir) {
  try {
    const row = execFileSync("df", ["-P", dir], { encoding: "utf8" })
      .trim()
      .split("\n")[1]
      .trim()
      .split(/\s+/);
    const mountPoint = row.slice(5).join(" ");
    const line = execFileSync("mount", [], { encoding: "utf8" })
      .split("\n")
      .find((l) => l.includes(` on ${mountPoint} (`));
    return line?.match(/\(([^,)]+)/)?.[1] ?? "";
  } catch {
    return "";
  }
}

if (!/exfat|msdos|fat/i.test(fsType(projectDir))) {
  process.exit(0);
}

const buildDir = path.join(projectDir, ".next");
if (fs.existsSync(buildDir)) {
  fs.rmSync(buildDir, { recursive: true, force: true });
  console.log("cleared .next (exFAT: stale chunks cannot be trusted)");
}
