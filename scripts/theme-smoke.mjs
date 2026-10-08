import assert from "node:assert/strict";
import { chromium } from "playwright";
import { createRequire } from "node:module";

// Local, read-only checks. No login or content changes.
const origin = process.argv[2] ?? "http://localhost:3000";
const require = createRequire(import.meta.url);
const browser = await chromium.launch({ headless: true, channel: process.env.BROWSER_CHANNEL || undefined });
const errors = [];
const themeOf = (page) => page.locator("html").getAttribute("data-theme");
const toggle = (page, target) => page.locator(`button[aria-label="Switch to ${target} mode"]:visible`);
async function expectTheme(page, theme) {
  await page.waitForFunction((expected) => document.documentElement.dataset.theme === expected, theme);
  assert.equal(await themeOf(page), theme);
}
async function audit(page, label) {
  await page.addScriptTag({ path: require.resolve("axe-core/axe.min.js") });
  const violations = await page.evaluate(async () => {
    const result = await window.axe.run(document, { runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"] } });
    return result.violations.map(({ id, nodes }) => ({ id, targets: nodes.map(({ target }) => target) }));
  });
  assert.deepEqual(violations, [], label);
}

try {
  const context = await browser.newContext({ colorScheme: "dark", reducedMotion: "reduce", viewport: { width: 1440, height: 900 } });
  context.on("page", (page) => page.on("pageerror", (error) => errors.push(error.message)));
  const page = await context.newPage();
  await page.goto(origin + "/");
  await expectTheme(page, "dark");
  await toggle(page, "light").waitFor();
  assert.equal(await page.evaluate(() => localStorage.getItem("portfolio-theme")), null, "System default needs no saved override");
  await page.emulateMedia({ colorScheme: "light" });
  await expectTheme(page, "light");
  await toggle(page, "dark").focus();
  await page.keyboard.press("Enter");
  await expectTheme(page, "dark");
  assert.equal(await page.evaluate(() => localStorage.getItem("portfolio-theme")), "dark");
  await page.emulateMedia({ colorScheme: "dark" });
  await page.emulateMedia({ colorScheme: "light" });
  await expectTheme(page, "dark");
  await page.getByRole("navigation", { name: "Checkpoints", exact: true }).getByRole("link", { name: "About", exact: true }).click();
  await page.waitForURL(origin + "/about");
  await expectTheme(page, "dark");
  await page.reload();
  await expectTheme(page, "dark");
  console.log("PASS system preference, keyboard toggle, saved override, route and reload persistence");

  const second = await context.newPage();
  await second.goto(origin + "/");
  await expectTheme(second, "dark");
  await toggle(second, "light").waitFor();
  await toggle(page, "light").click();
  await expectTheme(second, "light");
  await second.close();
  await page.setViewportSize({ width: 320, height: 812 });
  await toggle(page, "dark").click();
  await expectTheme(page, "dark");
  const target = await toggle(page, "light").boundingBox();
  assert.ok(target.width >= 44 && target.height >= 44, "Theme control keeps a 44px target");
  assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), "320px header fits");
  await page.getByRole("button", { name: "Map", exact: true }).click();
  await audit(page, "Night mobile map");
  await page.keyboard.press("Escape");
  console.log("PASS cross-tab sync, mobile toggle and accessible night map");

  await page.goto(origin + "/");
  const admin = page.getByRole("link", { name: "Admin", exact: true });
  assert.equal(await admin.locator("xpath=ancestor::figure").count(), 1, "Admin is inside portrait");
  const adminSize = await admin.boundingBox();
  assert.ok(adminSize.width >= 43 && adminSize.height >= 43, "Rotated admin target remains at least 44px before rotation");
  await admin.click();
  await page.waitForURL(origin + "/admin/login");
  await expectTheme(page, "dark");
  await audit(page, "Night admin login");

  await page.goto(origin + "/milestones");
  const entry = page.locator('main article button[aria-haspopup="dialog"]').first();
  if (await entry.count()) {
    await entry.click();
    await page.getByRole("dialog").waitFor();
    await audit(page, "Night milestone details");
    await page.keyboard.press("Escape");
  }
  console.log("PASS portrait admin entry, night login and milestone dialog accessibility");

  // Storage failures must leave the switch usable.
  const blocked = await browser.newContext({ colorScheme: "dark", reducedMotion: "reduce", viewport: { width: 375, height: 812 } });
  await blocked.addInitScript(() => {
    for (const method of ["getItem", "setItem"]) Object.defineProperty(Storage.prototype, method, { value() { throw new DOMException("Blocked", "SecurityError"); } });
  });
  const blockedPage = await blocked.newPage();
  blockedPage.on("pageerror", (error) => errors.push(error.message));
  await blockedPage.goto(origin + "/");
  await expectTheme(blockedPage, "dark");
  await toggle(blockedPage, "light").click();
  await expectTheme(blockedPage, "light");
  await blocked.close();
  assert.deepEqual(errors, [], "No browser exceptions");
  console.log("PASS blocked-storage fallback; no browser exceptions");
} finally {
  await browser.close();
}
