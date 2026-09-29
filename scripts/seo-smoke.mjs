import assert from "node:assert/strict";

// Run against `npm run start`: node scripts/seo-smoke.mjs http://localhost:3000
const origin = process.argv[2] ?? "http://localhost:3000";
const checkpoints = ["/", "/about", "/skills", "/projects", "/journey", "/milestones", "/summit"];
const decode = (value) => value.replaceAll("&amp;", "&").replaceAll("&quot;", '"').replaceAll("&#x27;", "'").replaceAll("&lt;", "<").replaceAll("&gt;", ">");

function tagValue(html, tag, key, value, attribute) {
  const match = [...html.matchAll(new RegExp(`<${tag}\\b[^>]*>`, "g"))]
    .find(([text]) => text.includes(`${key}="${value}"`));
  return match ? decode(match[0].match(new RegExp(`${attribute}="([^"]*)"`))?.[1] ?? "") : null;
}

async function get(path, status = 200) {
  const response = await fetch(new URL(path, origin), { headers: { "User-Agent": "Twitterbot/1.0" } });
  assert.equal(response.status, status, `${path}: HTTP status`);
  return response;
}

const home = await (await get("/")).text();
const canonicalOrigin = new URL(tagValue(home, "link", "rel", "canonical", "href")).origin;
const sitemapResponse = await get("/sitemap.xml");
assert.match(sitemapResponse.headers.get("content-type"), /xml/);
const sitemap = await sitemapResponse.text();
const urls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(([, value]) => new URL(decode(value)));
const paths = urls.map((url) => url.pathname);
assert.equal(new Set(paths).size, paths.length, "No duplicate sitemap entries");
for (const path of checkpoints) assert.ok(paths.includes(path), `${path}: included in sitemap`);
assert.ok(paths.every((path) => checkpoints.includes(path) || /^\/projects\/[a-z0-9-]+$/.test(path)), "Only public content in sitemap");
assert.ok(urls.every((url) => url.origin === canonicalOrigin), "Sitemap uses the canonical origin");

for (const path of paths) {
  const response = await get(path);
  const html = await response.text();
  const title = decode(html.match(/<title>(.*?)<\/title>/)?.[1] ?? "");
  const meta = (name) => tagValue(html, "meta", name.startsWith("og:") ? "property" : "name", name, "content");
  const canonical = tagValue(html, "link", "rel", "canonical", "href");
  assert.equal(new URL(canonical).href, new URL(path, canonicalOrigin).href, `${path}: canonical`);
  assert.ok(title.length > 0, `${path}: title`);
  assert.equal(meta("og:title"), title, `${path}: OG title`);
  assert.equal(meta("twitter:title"), title, `${path}: Twitter title`);
  assert.equal(meta("og:description"), meta("description"), `${path}: OG description`);
  assert.equal(meta("twitter:description"), meta("description"), `${path}: Twitter description`);
  assert.equal(meta("og:url"), canonical, `${path}: OG URL`);
  assert.equal(meta("twitter:card"), "summary_large_image", `${path}: Twitter card`);
  assert.ok(/^https?:\/\//.test(meta("og:image")), `${path}: absolute share image`);
  assert.equal(meta("twitter:image"), meta("og:image"), `${path}: matching share images`);
  assert.ok(!meta("robots")?.includes("noindex"), `${path}: indexable`);
  assert.match(response.headers.get("cache-control"), /s-maxage=3600/, `${path}: ISR`);
  assert.ok(html.includes('/favicon.ico') && html.includes('/icon.svg'), `${path}: favicons`);
  console.log(`PASS ${path}: canonical, metadata, share cards, ISR, icons`);
}

const filtered = await (await get("/projects?search=test")).text();
assert.equal(tagValue(filtered, "link", "rel", "canonical", "href"), `${canonicalOrigin}/projects`, "Query parameters excluded from canonical");
for (const path of ["/phase-16-missing", "/peak", "/projects/phase-16-missing"]) {
  const html = await (await get(path, 404)).text();
  assert.match(tagValue(html, "meta", "name", "robots", "content"), /noindex/, `${path}: noindex`);
}
for (const path of ["/admin/login", "/admin/unauthorized"]) {
  const html = await (await get(path)).text();
  assert.match(tagValue(html, "meta", "name", "robots", "content"), /noindex, nofollow/);
  assert.equal(tagValue(html, "link", "rel", "canonical", "href"), null, "Admin has no public canonical");
}
const robots = await (await get("/robots.txt")).text();
assert.match(robots, /Disallow: \/admin/);
assert.ok(robots.includes(`Sitemap: ${canonicalOrigin}/sitemap.xml`));
const imageResponse = await get("/share-image");
assert.match(imageResponse.headers.get("content-type"), /image\/png/);
const png = Buffer.from(await imageResponse.arrayBuffer());
assert.equal(png.readUInt32BE(16), 1200, "Share image width");
assert.equal(png.readUInt32BE(20), 630, "Share image height");
await get("/favicon.ico");
await get("/icon.svg");
console.log(`PASS discovery, query canonicals, admin/404 exclusions, 1200x630 share image; ${paths.length} public pages checked.`);
