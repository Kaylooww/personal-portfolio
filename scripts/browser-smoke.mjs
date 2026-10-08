import assert from "node:assert/strict";
import { chromium } from "playwright";
import { createRequire } from "node:module";

// Read-only: no credentials, database writes or external-link navigation.
// BROWSER_CHANNEL=msedge uses an installed Edge; otherwise install Playwright Chromium.
const origin = process.argv[2] ?? "http://localhost:3000";
const theme = process.env.BROWSER_THEME ?? "light";
assert.ok(["light", "dark"].includes(theme), "BROWSER_THEME must be light or dark");
const require = createRequire(import.meta.url);
const browser = await chromium.launch({ headless: true, channel: process.env.BROWSER_CHANNEL || undefined });
const routes = ["/", "/about", "/skills", "/projects", "/journey", "/milestones", "/summit"];
const widths = [320, 375, 430, 768, 1024, 1440, 1920];
const errors = [];
let layouts = 0;
let audits = 0;

try {
  const context = await browser.newContext({ reducedMotion: "reduce", colorScheme: theme });
  const page = await context.newPage();
  page.on("pageerror", (error) => errors.push(error.message));
  const sitemap = await (await context.request.get(`${origin}/sitemap.xml`)).text();
  const projectPaths = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)]
    .map(([, url]) => new URL(url).pathname).filter((path) => path.startsWith("/projects/"));
  const internalLinks = new Set();

  for (const path of [...routes, ...projectPaths]) {
    await page.setViewportSize({ width: 1440, height: 900 });
    const response = await page.goto(origin + path, { waitUntil: "load" });
    assert.equal(response.status(), 200, `${path}: HTTP 200`);
    assert.equal(await page.locator("main").count(), 1, `${path}: one main landmark`);
    assert.equal(await page.locator("h1").count(), 1, `${path}: one primary heading`);
    await page.evaluate(() => document.fonts.ready);
    for (const width of widths) {
      await page.setViewportSize({ width, height: 900 });
      await page.evaluate(() => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))));
      await page.evaluate(() => document.fonts.ready);
      await page.waitForFunction(() => document.documentElement.scrollWidth <= innerWidth, null, { timeout: 3000 });
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `${path}: overflow at ${width}px`);
      layouts++;
      if (width === 375 || width === 1440) {
        await page.addScriptTag({ path: require.resolve("axe-core/axe.min.js") });
        const violations = await page.evaluate(async () => {
          const result = await window.axe.run(document, { runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"] } });
          return result.violations.map(({ id, nodes }) => ({ id, elements: nodes.map(({ target }) => target) }));
        });
        assert.deepEqual(violations, [], `${path} at ${width}px: accessibility`);
        audits++;
      }
    }
    const links = await page.locator('a[href^="/"]').evaluateAll((items) => items.map((item) => item.getAttribute("href")));
    links.filter((href) => !href.startsWith("/admin")).forEach((href) => internalLinks.add(href));
    console.log(`PASS ${path}: seven widths, headings, mobile/desktop WCAG A/AA`);
  }

  for (const href of internalLinks) {
    assert.equal((await context.request.get(origin + href)).status(), 200, `Internal link ${href}`);
  }
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto(origin + "/", { waitUntil: "load" });
  await page.keyboard.press("Tab");
  assert.match(await page.locator(":focus").textContent(), /Skip to content/);
  await page.keyboard.press("Enter");
  assert.equal(await page.locator(":focus").getAttribute("id"), "main");
  const map = page.getByRole("button", { name: "Map", exact: true });
  await map.focus();
  await page.keyboard.press("Enter");
  const mapNav = page.getByRole("navigation", { name: "All checkpoints" });
  await mapNav.waitFor();
  assert.equal(await mapNav.getByRole("link").count(), 7);
  await page.keyboard.press("Escape");
  assert.equal(await map.evaluate((element) => element === document.activeElement), true);
  for (const label of ["About", "Skills", "Projects", "Journey", "Milestones", "Summit", "Airport"]) {
    await map.click();
    await mapNav.getByRole("link", { name: new RegExp(`^${label}`) }).click();
    await page.waitForURL(origin + routes[["Airport", "About", "Skills", "Projects", "Journey", "Milestones", "Summit"].indexOf(label)]);
    assert.equal(await page.locator('dialog[aria-labelledby="mobile-map-title"]').evaluate((dialog) => dialog.open), false);
  }
  console.log("PASS mobile route navigation, skip link, keyboard open/Escape/focus return");

  await page.goto(origin + "/projects", { waitUntil: "load" });
  await page.getByRole("searchbox", { name: "Search projects" }).fill("no-matching-expedition-qa-17");
  await page.getByText(projectPaths.length ? "No trail matches" : "No expeditions yet", { exact: true }).waitFor();
  await page.getByRole("button", { name: "Clear filters" }).click();
  assert.equal(await page.getByRole("searchbox").inputValue(), "");
  const statuses = page.getByRole("group", { name: "Filter by status" }).getByRole("button");
  for (const button of await statuses.all()) {
    await button.click();
    assert.equal(await button.getAttribute("aria-pressed"), "true");
  }
  await page.goto(origin + "/milestones", { waitUntil: "load" });
  const categories = page.locator('ul[aria-label^="Milestone categories"] button');
  for (const category of await categories.all()) {
    await category.click();
    await page.getByRole("button", { name: "Show all", exact: true }).click();
  }
  console.log("PASS project search/empty/reset/status filters and milestone category filters");

  const views = page.getByRole("group", { name: "Milestone view" });
  for (const name of ["Board", "List", "Gallery"]) {
    await views.getByRole("button", { name, exact: true }).click();
    assert.equal(await views.getByRole("button", { name, exact: true }).getAttribute("aria-pressed"), "true");
    for (const width of [320, 375, 768, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      await page.waitForFunction(() => document.documentElement.scrollWidth <= innerWidth);
    }
    if (name !== "Board") {
      const group = page.locator("main details").first();
      if (await group.count()) {
        await group.locator("summary").click();
        assert.equal(await group.evaluate((element) => element.open), false);
        await group.locator("summary").click();
      }
    }
  }
  console.log("PASS milestone Gallery/Board/List switching, four widths and category collapse");

  const milestoneEntries = page.locator('main article button[aria-haspopup="dialog"]');
  for (const entry of await milestoneEntries.all()) {
    await entry.focus();
    await page.keyboard.press("Enter");
    const detail = page.getByRole("dialog");
    await detail.waitFor();
    assert.equal(await detail.locator("h2").count(), 1, "Milestone detail has a heading");
    assert.equal(await detail.getByRole("button", { name: "Close milestone" }).evaluate((element) => element === document.activeElement), true);
    await page.keyboard.press("Escape");
    await detail.waitFor({ state: "hidden" });
    assert.equal(await entry.evaluate((element) => element === document.activeElement), true, "Milestone returns focus to its log entry");
  }
  console.log(`PASS ${await milestoneEntries.count()} milestone dialogs: keyboard open, close and focus return`);

  for (const path of ["/phase17-not-found", "/peak", "/projects/phase17-not-found"]) {
    const response = await page.goto(origin + path, { waitUntil: "load" });
    assert.equal(response.status(), 404);
    assert.equal(await page.locator("main").count(), 1);
    assert.match(await page.locator('meta[name="robots"]').first().getAttribute("content"), /noindex/);
  }
  for (const path of ["/admin", "/admin/settings", "/admin/projects/new", "/admin/media"]) {
    await page.goto(origin + path, { waitUntil: "load" });
    assert.ok(new URL(page.url()).pathname === "/admin/login", `${path}: signed-out guard`);
  }
  await page.goto(origin + "/admin/login?next=https://example.invalid", { waitUntil: "load" });
  assert.equal(await page.locator('input[name="next"]').inputValue(), "/admin");
  await page.getByLabel("Email", { exact: true }).fill("qa-invalid@example.invalid");
  await page.getByLabel("Password", { exact: true }).fill("invalid-test-password-17");
  await page.getByRole("button", { name: /Sign in/ }).click();
  await page.getByText("Email or password is incorrect.", { exact: true }).waitFor();
  assert.match(await page.locator("form").getByRole("alert").textContent(), /Email or password is incorrect/);
  assert.deepEqual(errors, [], "No browser exceptions");
  console.log(`PASS 404s, admin guards, safe return path, invalid login; ${layouts} layouts, ${audits} accessibility audits, ${internalLinks.size} internal links.`);
} finally {
  await browser.close();
}
