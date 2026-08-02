// Post-build SEO step. Writes a real HTML file per route so crawlers that do
// not run JavaScript (LinkedIn, WhatsApp, Slack, Twitter) still get correct
// titles, canonicals, Open Graph tags and JSON-LD.
//
// Each route gets a copy of index.html with its own <title>, description,
// canonical, Open Graph/Twitter tags and JSON-LD stamped into the head. The
// body still hydrates client-side. No browser needed, so this runs identically
// on a laptop and on Vercel.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";

const SITE_URL = "https://www.bismaydey.me";
const DIST = "dist";

const require = createRequire(import.meta.url);

// ---------------------------------------------------------------- load data
// esbuild ships with Vite, so the TypeScript data file can be transpiled and
// imported instead of regex-scraped.
async function loadProjects() {
  const esbuild = require("esbuild");
  const out = esbuild.buildSync({
    entryPoints: ["src/data/clientProjects.ts"],
    bundle: true,
    format: "esm",
    platform: "node",
    write: false,
  });
  const code = Buffer.from(out.outputFiles[0].text).toString("base64");
  const mod = await import(`data:text/javascript;base64,${code}`);
  return mod.clientProjects;
}

const projects = await loadProjects();
const routes = ["/", "/play", ...projects.map((p) => `/client/${p.slug}`)];
console.log(`SEO: ${routes.length} routes`);

// -------------------------------------------------------------- head builder
const esc = (v = "") =>
  String(v)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

function metaFor(route) {
  if (route === "/play") {
    return {
      title:
        "Playable Demos — Browser Games by Bismay Dey | Web Game Developer",
      description:
        "Four playable browser games built with Three.js, WebGL and Canvas, plus a live client build in progress. Proof that Bismay Dey ships real web games. Play free, no signup.",
      image: `${SITE_URL}/og-default.jpg`,
      type: "website",
      jsonLd: null,
    };
  }
  if (route === "/") {
    return {
      title:
        "Bismay Dey — Full-Stack Developer in Kolkata | Web Apps, Shopify, AI",
      description:
        "Full-stack developer in Kolkata building web apps, e-commerce stores and AI features. 19+ client projects delivered across EdTech, HR Tech, retail and hospitality. Available for freelance and full-time work.",
      image: `${SITE_URL}/og-default.jpg`,
      type: "website",
      jsonLd: null,
    };
  }
  const p = projects.find((x) => `/client/${x.slug}` === route);
  return {
    title: `${p.name} — ${p.sector} Case Study | Bismay Dey`,
    description: `${p.summary} Built by Bismay Dey — ${p.role}, ${p.stack
      .slice(0, 4)
      .join(", ")}.`,
    image: p.screenshots[0]
      ? `${SITE_URL}${p.screenshots[0]}`
      : `${SITE_URL}/og-default.jpg`,
    type: "article",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "CreativeWork",
      name: p.name,
      headline: `${p.name} — ${p.sector} case study`,
      description: p.summary,
      url: `${SITE_URL}${route}`,
      image: p.screenshots.map((s) => `${SITE_URL}${s}`),
      dateCreated: p.year,
      keywords: [...p.tags, ...p.stack].join(", "),
      creator: {
        "@type": "Person",
        name: "Bismay Dey",
        jobTitle: "Full-Stack Developer",
        url: SITE_URL,
      },
      about: { "@type": "Thing", name: p.sector },
      mainEntityOfPage: `${SITE_URL}${route}`,
    },
  };
}

function stampHead(html, route) {
  const m = metaFor(route);
  const url = `${SITE_URL}${route}`;
  let head = html;

  head = head.replace(
    /<title>[\s\S]*?<\/title>/,
    `<title>${esc(m.title)}</title>`
  );
  const set = (attr, key, value) => {
    const re = new RegExp(`<meta ${attr}="${key}"[^>]*>`);
    const tag = `<meta ${attr}="${key}" content="${esc(value)}">`;
    head = re.test(head) ? head.replace(re, tag) : head.replace("</head>", `  ${tag}\n</head>`);
  };
  set("name", "description", m.description);
  set("property", "og:title", m.title);
  set("property", "og:description", m.description);
  set("property", "og:url", url);
  set("property", "og:image", m.image);
  set("property", "og:type", m.type);
  set("name", "twitter:title", m.title);
  set("name", "twitter:description", m.description);
  set("name", "twitter:image", m.image);

  head = head.replace(
    /<link rel="canonical"[^>]*>/,
    `<link rel="canonical" href="${url}">`
  );
  if (m.jsonLd) {
    head = head.replace(
      "</head>",
      `  <script type="application/ld+json">${JSON.stringify(m.jsonLd)}</script>\n</head>`
    );
  }
  return head;
}

// ------------------------------------------------------------------- outputs
const indexHtml = readFileSync(join(DIST, "index.html"), "utf8");
for (const route of routes) {
  const out =
    route === "/" ? join(DIST, "index.html") : join(DIST, route, "index.html");
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, stampHead(indexHtml, route));
}
console.log(`  ✓ per-route <head> written for ${routes.length} routes`);

// -------------------------------------------------------------- sitemap etc.
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
console.log("SEO complete.");
// never fail a deploy over SEO extras
process.exit(0);
