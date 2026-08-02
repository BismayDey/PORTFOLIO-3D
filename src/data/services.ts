export type Service = {
  title: string;
  /** lucide-react icon name */
  icon: string;
  description: string;
  /** the concrete things that ship */
  deliverables: string[];
  /** honest typical turnaround */
  timeline: string;
  /** bento span — "wide" fills two columns on large screens */
  span?: "wide";
};

export type ServiceGroup = {
  id: string;
  label: string;
  headline: string;
  blurb: string;
  accent: string;
  services: Service[];
};

export const serviceGroups: ServiceGroup[] = [
  {
    id: "build",
    label: "Build",
    headline: "Products that hold up in production",
    blurb:
      "Full ownership from architecture to deployment — not a prototype you have to rewrite.",
    accent: "amber",
    services: [
      {
        title: "Custom Web Apps",
        icon: "Code2",
        description:
          "Production applications in Next.js, React and Node — auth, dashboards, payments, real-time data and the APIs behind them.",
        deliverables: [
          "System architecture & database design",
          "Role-based auth and permissions",
          "Payment and third-party integrations",
          "CI/CD, monitoring and handover docs",
        ],
        timeline: "3–10 weeks",
        span: "wide",
      },
      {
        title: "Website Development",
        icon: "Globe",
        description:
          "Fast, responsive, SEO-ready marketing sites and landing pages that load in under two seconds and convert on a phone.",
        deliverables: [
          "Design to pixel-accurate build",
          "Core Web Vitals tuning",
          "Schema markup and meta",
          "CMS your team can actually edit",
        ],
        timeline: "1–3 weeks",
      },
      {
        title: "Mobile Apps",
        icon: "Smartphone",
        description:
          "Cross-platform apps sharing one codebase and one backend with your web product — no duplicated logic.",
        deliverables: [
          "iOS + Android from one codebase",
          "Push notifications & deep links",
          "Offline-first data layer",
          "Store submission support",
        ],
        timeline: "4–12 weeks",
      },
      {
        title: "Web Games",
        icon: "Gamepad2",
        description:
          "Browser games and interactive 3D experiences built with Three.js, WebGL and Canvas that run without a download. Four playable demos live at /play.",
        deliverables: [
          "Game loop and physics",
          "Asset pipeline & sprite atlases",
          "Leaderboards and save state",
          "60fps on mid-range hardware",
        ],
        timeline: "3–8 weeks",
      },
    ],
  },
  {
    id: "ai",
    label: "AI & Media",
    headline: "Intelligence and motion, built in",
    blurb:
      "AI that does a specific job inside your product, plus the video to launch it.",
    accent: "cyan",
    services: [
      {
        title: "AI Feature Development",
        icon: "Sparkles",
        description:
          "LLM features wired into your product — summarisation, semantic search, generation and agentic workflows, with humans kept in the loop where it matters.",
        deliverables: [
          "Model selection and prompt design",
          "RAG pipelines over your own data",
          "Streaming responses and caching",
          "Cost controls and usage limits",
        ],
        timeline: "2–6 weeks",
        span: "wide",
      },
      {
        title: "Chatbots",
        icon: "MessageSquare",
        description:
          "Support and sales bots trained on your own content, deployed to web, WhatsApp or Slack — with handoff to a human when they get stuck.",
        deliverables: [
          "Knowledge base ingestion",
          "Multi-channel deployment",
          "Human escalation path",
          "Conversation analytics",
        ],
        timeline: "1–4 weeks",
      },
      {
        title: "AI Video",
        icon: "Film",
        description:
          "AI-generated video for ads, explainers and social — script to finished cut, in your brand's voice.",
        deliverables: [
          "Script and storyboard",
          "Generated scenes and voiceover",
          "Brand-matched grading",
          "Platform-ready exports",
        ],
        timeline: "3 days–2 weeks",
      },
      {
        title: "Video Editing",
        icon: "Video",
        description:
          "Reels, YouTube edits, promos and motion graphics cut in Premiere Pro and After Effects.",
        deliverables: [
          "Multi-cam edit and colour",
          "Motion graphics and titles",
          "Sound design and mix",
          "Vertical + horizontal cuts",
        ],
        timeline: "2 days–1 week",
      },
    ],
  },
  {
    id: "commerce",
    label: "Commerce, Design & Growth",
    headline: "Storefronts, the design behind them, and the traffic to fill them",
    blurb:
      "Platforms your team can run without a developer, visuals built to convert, and the search visibility that feeds both.",
    accent: "fuchsia",
    services: [
      {
        title: "Shopify Stores",
        icon: "ShoppingCart",
        description:
          "Theme development, custom sections, app integration and a checkout tuned for conversion — merchandising your team controls.",
        deliverables: [
          "Custom theme or heavy customisation",
          "Metafield-driven sections",
          "App integration and migration",
          "Checkout and upsell tuning",
        ],
        timeline: "1–4 weeks",
      },
      {
        title: "WordPress",
        icon: "LayoutTemplate",
        description:
          "Custom themes, plugin work, migrations and rescue jobs — with none of the page-builder bloat left behind.",
        deliverables: [
          "Custom theme development",
          "WooCommerce setup",
          "Speed and security hardening",
          "Content migration",
        ],
        timeline: "1–3 weeks",
      },
      {
        title: "Webflow",
        icon: "Layers",
        description:
          "Pixel-accurate Webflow builds with CMS collections and interactions your marketing team can edit alone.",
        deliverables: [
          "Design to Webflow build",
          "CMS collection structure",
          "Scroll and hover interactions",
          "Team training on edits",
        ],
        timeline: "1–3 weeks",
      },
      {
        title: "Web Design & Figma",
        icon: "Palette",
        description:
          "Full visual direction — layout, type, colour and motion — designed to be built, not just admired. Handoff-ready components, not flat mockups.",
        deliverables: [
          "Wireframes to high-fidelity",
          "Design system & components",
          "Responsive breakpoints specced",
          "Developer handoff files",
        ],
        timeline: "1–3 weeks",
        span: "wide",
      },
      {
        title: "SEO & AI Search Optimisation",
        icon: "Search",
        description:
          "Technical SEO, on-page structure and content strategy that gets you ranking for terms buyers actually search — plus AISEO so you surface inside AI answers, not just the blue links.",
        deliverables: [
          "Technical audit and fixes",
          "Keyword and intent mapping",
          "Schema markup and Core Web Vitals",
          "Google Business Profile and local SEO",
          "AI search (AISEO) optimisation",
          "Monthly ranking and traffic reporting",
        ],
        timeline: "Ongoing / 4–12 weeks",
      },
    ],
  },
  {
    id: "care",
    label: "Rescue & Care",
    headline: "For when it is already broken",
    blurb:
      "The unglamorous work that keeps revenue flowing. Often the most valuable thing I do.",
    accent: "emerald",
    services: [
      {
        title: "Fixes & Rescues",
        icon: "Wrench",
        description:
          "Broken builds, blank white pages, failing deploys, hacked sites, plugin conflicts and performance disasters — diagnosed properly, then fixed at the root.",
        deliverables: [
          "Root-cause diagnosis, not a patch",
          "Malware cleanup and hardening",
          "Deploy pipeline repair",
          "Written post-mortem",
        ],
        timeline: "24h–1 week",
        span: "wide",
      },
      {
        title: "Maintenance & Support",
        icon: "Server",
        description:
          "Ongoing backend, server and site upkeep — updates, backups, monitoring and uptime you can stop thinking about.",
        deliverables: [
          "Scheduled updates and backups",
          "Uptime and error monitoring",
          "Monthly performance report",
          "Priority response window",
        ],
        timeline: "Monthly retainer",
      },
    ],
  },
];

export const allServices = serviceGroups.flatMap((g) => g.services);
