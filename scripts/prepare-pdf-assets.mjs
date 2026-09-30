import { cpSync, mkdirSync, readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";

const require = createRequire(import.meta.url);
const source = dirname(require.resolve("pdfjs-dist/package.json"));
const { version } = JSON.parse(readFileSync(join(source, "package.json"), "utf8"));
const target = join(import.meta.dirname, "..", "public", "pdfjs", version);
mkdirSync(target, { recursive: true });
cpSync(join(source, "build", "pdf.worker.min.mjs"), join(target, "pdf.worker.min.mjs"));
for (const folder of ["cmaps", "standard_fonts", "wasm"]) {
  cpSync(join(source, folder), join(target, folder), { recursive: true });
}
cpSync(join(source, "LICENSE"), join(target, "LICENSE"));
console.log(`Prepared local PDF.js ${version} assets`);
