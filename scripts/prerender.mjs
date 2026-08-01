// Post-build step: renders every route in headless Chromium and writes the
// resulting HTML to dist/<route>/index.html, plus a sitemap and an OG image.
//
// Why: the app is a client-rendered SPA. Google executes JS, but LinkedIn,
// WhatsApp, Slack, Twitter and most other crawlers do not — without this the
// case-study pages would share as a bare URL with the generic home-page title.
import { chromium } from "file:///C:/Users/bisma/AppData/Local/npm-cache/_npx/9833c18b2d85bc59/node_modules/playwright-core/index.mjs";
import { spawn } from "node:child_process";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

const CHROME =
  "C:/Users/bisma/AppData/Local/ms-playwright/chromium-1228/chrome-win64/chrome.exe";
const PORT = 4188;
const ORIGIN = `http://localhost:${PORT}`;
const SITE_URL = "https://bismaydey.vercel.app";
const DIST = "dist";

// Slugs come straight from the data file so the two can never drift.
const dataSrc = readFileSync("src/data/clientProjects.ts", "utf8");
const slugs = [...dataSrc.matchAll(/^\s{4}slug: "([^"]+)",$/gm)].map((m) => m[1]);
if (!slugs.length) throw new Error("no client slugs found — check the regex");

const routes = ["/", ...slugs.map((s) => `/client/${s}`)];
console.log(`Prerendering ${routes.length} routes…`);

const server = spawn(
  process.platform === "win32" ? "npx.cmd" : "npx",
  ["vite", "preview", "--port", String(PORT), "--strictPort"],
  { stdio: "ignore", shell: process.platform === "win32" }
);

const browser = await chromium.launch({ executablePath: CHROME });
const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });

async function waitForServer(page) {
  for (let i = 0; i < 40; i++) {
    try {
      await page.goto(ORIGIN, { timeout: 2000 });
      return true;
    } catch {
      await page.waitForTimeout(500);
    }
  }
  return false;
}

try {
  const page = await ctx.newPage();
  if (!(await waitForServer(page))) throw new Error("preview server never came up");

  for (const route of routes) {
    await page.goto(`${ORIGIN}${route}`, { waitUntil: "networkidle", timeout: 60000 });
    // give useSeo's effect a tick to stamp the head
    await page.waitForTimeout(route === "/" ? 3500 : 1200);

    const html = await page.content();
    const outPath =
      route === "/" ? join(DIST, "index.html") : join(DIST, route, "index.html");
    mkdirSync(dirname(outPath), { recursive: true });
    writeFileSync(outPath, html);
    console.log(`  ✓ ${route}`);
  }

  // Open Graph image: the hero, cropped to the 1.91:1 ratio social cards use.
  const og = await ctx.newPage();
  await og.setViewportSize({ width: 1200, height: 630 });
  await og.goto(ORIGIN, { waitUntil: "networkidle", timeout: 60000 });
  await og.waitForTimeout(5000);
  await og.screenshot({ path: join(DIST, "og-default.jpg"), type: "jpeg", quality: 85 });
  writeFileSync(
    "public/og-default.jpg",
    readFileSync(join(DIST, "og-default.jpg"))
  );
  console.log("  ✓ og-default.jpg");

  const today = new Date().toISOString().slice(0, 10);
  const NS = "http://www.sitemaps.org/schemas/sitemap/0.9";
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="${NS}">
${routes
  .map(
    (r) => `  <url>
    <loc>${SITE_URL}${r}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${r === "/" ? "weekly" : "monthly"}</changefreq>
    <priority>${r === "/" ? "1.0" : "0.8"}</priority>
  </url>`
  )
  .join("\n")}
</urlset>
`;
  writeFileSync(join(DIST, "sitemap.xml"), sitemap);
  writeFileSync("public/sitemap.xml", sitemap);
  console.log(`  ✓ sitemap.xml (${routes.length} urls)`);
} finally {
  await browser.close();
  server.kill();
}

console.log("Prerender complete.");
process.exit(0);
