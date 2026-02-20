import fs from "node:fs";
import path from "node:path";

const roots = ["backend", "frontend", "tests"];
const badChar = /\uFFFD/;
let failed = false;

function walk(dir) {
  if (!fs.existsSync(dir)) return;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(full);
      continue;
    }
    if (!/\.(js|mjs|md|sql|yaml|yml)$/.test(entry.name)) continue;
    const text = fs.readFileSync(full, "utf8");
    if (badChar.test(text)) {
      failed = true;
      console.error(`Invalid UTF-8 replacement character found in ${full}`);
    }
  }
}

for (const root of roots) {
  walk(root);
}

if (failed) {
  process.exit(1);
}
