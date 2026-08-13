import fs from "node:fs";
import path from "node:path";

/**
 * IONOS / Apache often skip or hide folders starting with `_` during FTP/File Manager upload.
 * Next.js static export puts CSS/JS in `/_next/...`. Rename to `/next/...` and rewrite references.
 */
const outDir = path.resolve("out");
const fromDir = path.join(outDir, "_next");
const toDir = path.join(outDir, "next");

if (!fs.existsSync(outDir)) {
  console.error("out/ folder not found. Run next build first.");
  process.exit(1);
}

if (fs.existsSync(fromDir)) {
  if (fs.existsSync(toDir)) {
    fs.rmSync(toDir, { recursive: true, force: true });
  }
  fs.renameSync(fromDir, toDir);
  console.log("Renamed out/_next → out/next");
} else if (!fs.existsSync(toDir)) {
  console.error("Neither out/_next nor out/next found.");
  process.exit(1);
}

const textExts = new Set([
  ".html",
  ".js",
  ".css",
  ".json",
  ".txt",
  ".xml",
  ".svg",
  ".map",
]);

function walk(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, files);
    else files.push(full);
  }
  return files;
}

let patched = 0;
for (const file of walk(outDir)) {
  const ext = path.extname(file).toLowerCase();
  if (!textExts.has(ext)) continue;
  const original = fs.readFileSync(file, "utf8");
  if (!original.includes("/_next/")) continue;
  fs.writeFileSync(file, original.replaceAll("/_next/", "/next/"), "utf8");
  patched += 1;
}

console.log(`Updated /_next/ → /next/ in ${patched} files`);
