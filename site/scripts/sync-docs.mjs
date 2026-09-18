// Copies ../docs/*.md into src/content/docs so the repo docs and the site
// never drift. Run `npm run sync-docs` before build (Vercel runs it via
// the build command in vercel.json).
import { cpSync, readdirSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const src = fileURLToPath(new URL("../../docs/", import.meta.url));
const dest = fileURLToPath(new URL("../src/content/docs/", import.meta.url));
mkdirSync(dest, { recursive: true });
for (const f of readdirSync(src)) {
  if (!f.endsWith(".md")) continue;
  const body = readFileSync(join(src, f), "utf8").replaceAll("../assets/workflow.svg", "/workflow.svg");
  writeFileSync(join(dest, f), body);
}
cpSync(join(src, "assets", "workflow.svg"), fileURLToPath(new URL("../public/workflow.svg", import.meta.url)));
console.log("docs synced");
