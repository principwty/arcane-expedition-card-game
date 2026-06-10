import { readdir } from "node:fs/promises";
import { join } from "node:path";
import { spawnSync } from "node:child_process";

const roots = ["outputs", "scripts"];
const files = [];

for (const root of roots) {
  await collectJsFiles(root, files);
}

for (const file of files.sort()) {
  const result = spawnSync(process.execPath, ["--check", file], { encoding: "utf8" });
  if (result.status !== 0) {
    process.stderr.write(result.stderr || result.stdout);
    process.exit(result.status ?? 1);
  }
}

console.log(`Syntax check passed: ${files.length} files.`);

async function collectJsFiles(dir, result) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) await collectJsFiles(fullPath, result);
    else if (/\.(mjs|js)$/.test(entry.name)) result.push(fullPath);
  }
}
