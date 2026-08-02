// Builds api/_knowledge.json from the real data files so the chatbot can never
// drift from what the site actually says. Re-run after editing any data file
// (it is wired into `npm run build`).
import { createRequire } from "node:module";
import { writeFileSync } from "node:fs";

const require = createRequire(import.meta.url);

async function load(file, name) {
  const esbuild = require("esbuild");
  const out = esbuild.buildSync({
    entryPoints: [file],
    bundle: true,
    format: "esm",
    platform: "node",
    write: false,
  });
  const code = Buffer.from(out.outputFiles[0].text).toString("base64");
  const mod = await import(`data:text/javascript;base64,${code}`);
  return mod[name];
}

const clientProjects = await load("src/data/clientProjects.ts", "clientProjects");
const serviceGroups = await load("src/data/services.ts", "serviceGroups");
const experience = await load("src/data/experience.ts", "experience");

// Groq's free tier caps a request at 8000 tokens/min, so the whole corpus
// cannot ride along on every message. Split into a small always-on core plus
// detail packs the handler pulls in only when a question matches them.
const core = {
  updated: new Date().toISOString().slice(0, 10),
  name: "Bismay Dey",
  location: "Kolkata, West Bengal, India",
  site: "https://www.bismaydey.me",
  email: "bismaydey001@gmail.com",
  whatsapp: "+91 81003 14152",
  github: "https://github.com/BismayDey",
  linkedin: "https://www.linkedin.com/in/bismay-dey-634937268/",
  availability: "Available for freelance and full-time work",
  roles: [
    "Full-Stack Developer",
    "Mobile App Developer",
    "AI / ML Engineer",
    "Web Game Developer",
    "Shopify & WordPress Developer",
    "AI Video Manager",
    "SEO Specialist",
  ],
  stats: "19+ client platforms, 50+ projects shipped, 12 roles held, 10+ hackathons won",
  skills:
    "Frontend: React, Next.js, TypeScript, Tailwind, Three.js, Framer Motion, Sass, Bootstrap. Backend: Node.js, Express, Python, Java, C, C++, Go, Ruby, PHP. Data: MongoDB, Firebase/Firestore, PostgreSQL, MySQL. DevOps: Docker, Kubernetes, AWS, Azure, GCP, GitHub Actions, Jenkins, Terraform, Ansible, Nginx, Linux, Git, Vercel, Grafana, Prometheus. Platforms: Shopify, WordPress, WooCommerce, Webflow, Wix. Design/media: Figma, Adobe, Canva, After Effects, Premiere Pro, Blender, Unity, Unreal.",
  serviceIndex: serviceGroups.flatMap((g) =>
    g.services.map((s) => `${s.title} [${g.label}] ${s.timeline}`)
  ),
  // one line each — ask about any of them and the handler attaches the full pack
  clientProjectIndex: clientProjects.map(
    (p, i) =>
      `${p.name}${i < 9 ? "*" : ""} (${p.sector.split(" · ")[0]}, ${p.year}) ${p.summary.split(".")[0]}. /client/${p.slug}`
  ),
  experience: experience.map(
    (r) => `${r.title} at ${r.company} (${r.period}${r.location ? ", " + r.location : ""})${r.current ? " [current]" : ""}`
  ),
  personalProjects:
    "Health Track (AI wellness), BLACKSTREAM (streaming), MindTrack (mental health), RAGE EFFECT (browser FPS game), Operating System (web OS sim), 3D Solar System (Three.js), PaisaOP (UPI payments), Let's Draw (collaborative canvas), Code Generator, Ask Bro (Q&A), Chatting Room (realtime chat), Advanced Math Solver — all on github.com/BismayDey and linked in the Featured Projects section",
  howToHire:
    "Use the 'Let's Talk' button in the navbar or hero, or 'Contact Me' in the contact section — a short form (name, email, phone, service, details). Bismay replies personally, usually within a day, with scope, timeline and price. WhatsApp available. Pricing is always quoted per project — never state or estimate a rate.",
  siteSections:
    "Hero, About (skills), Services (15 across Build / AI & Media / Commerce-Design-Growth / Rescue & Care), Experience (12 roles), Client Projects (19 case studies at /client/<slug>), Testimonials (13), Featured Projects, Certificates, Contact",
  note: "One testimonial has a deliberately withheld client name — never speculate about who it is.",
};

const projectDetail = Object.fromEntries(
  clientProjects.map((p) => [
    p.slug,
    {
      name: p.name,
      sector: p.sector,
      year: p.year,
      role: p.role,
      stack: p.stack,
      live: p.url,
      caseStudy: `https://www.bismaydey.me/client/${p.slug}`,
      brief: p.challenge,
      whatIBuilt: p.work,
      features: p.features.map((f) => `${f.title}: ${f.description}`),
      outcomes: p.results,
    },
  ])
);

const serviceDetail = Object.fromEntries(
  serviceGroups.flatMap((g) =>
    g.services.map((s) => [
      s.title,
      {
        category: g.label,
        what: s.description,
        includes: s.deliverables,
        timeline: s.timeline,
      },
    ])
  )
);

const experienceDetail = Object.fromEntries(
  experience.map((r) => [
    r.company,
    { title: r.title, period: r.period, location: r.location, highlights: r.bullets },
  ])
);

const knowledge = { core, projectDetail, serviceDetail, experienceDetail };

writeFileSync("api/_knowledge.json", JSON.stringify(knowledge, null, 1));
const kb = JSON.stringify(knowledge);
console.log(
  `core ~${Math.round(JSON.stringify(core).length / 4)} tokens | ` +
    `${Object.keys(projectDetail).length} project packs, ` +
    `${Object.keys(serviceDetail).length} service packs, ` +
    `${Object.keys(experienceDetail).length} role packs | ` +
    `total ~${Math.round(kb.length / 4)} tokens`
);
