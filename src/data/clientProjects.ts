// Single source of truth for the client-projects grid and the detail pages.
// Order matters: the first 9 are the flagship entries shown before "Read More".
// Ranking criteria — live on a real custom domain, then commercial weight.

export type ClientProject = {
  slug: string;
  name: string;
  url: string;
  domain: string;
  /** Custom domain (not a *.vercel.app subdomain) */
  ownDomain: boolean;
  sector: string;
  /** lucide-react icon name, resolved in the component */
  icon: string;
  /** tailwind colour family driving the card + page accents */
  accent: string;
  tagline: string;
  tags: string[];
  year: string;
  role: string;
  stack: string[];
  /** short card copy */
  summary: string;
  /** detail page: the problem the client had */
  challenge: string;
  /** detail page: what I actually built */
  work: string[];
  /** detail page: notable features shipped */
  features: { title: string; description: string }[];
  /** detail page: outcomes / numbers */
  results: string[];
  screenshots: string[];
};

export const clientProjects: ClientProject[] = [
  {
    slug: "oncall-london",
    name: "ONCALL LONDON",
    url: "https://oncall-london.com/",
    domain: "oncall-london.com",
    ownDomain: true,
    sector: "E-commerce · Medical Apparel",
    icon: "Shirt",
    accent: "teal",
    tagline: "D2C scrubs brand built for clinicians on twelve-hour shifts",
    tags: ["E-commerce", "Shopify", "Apparel"],
    year: "2025",
    role: "Web Developer",
    stack: ["Shopify", "Liquid", "JavaScript", "CSS", "Klaviyo"],
    summary:
      "Medical scrubs brand founded by an NHS doctor — size-aware product pages, team and student ordering, and campaign-driven merchandising.",
    challenge:
      "ONCALL LONDON sells technical workwear to a buyer who shops in the ten minutes between shifts. The store needed to communicate fabric, fit and utility fast, serve three very different buyers — individual clinicians, whole hospital teams, and students on a discount — and run aggressive time-boxed campaigns without a developer touching the theme each time.",
    work: [
      "Built size-aware product cards that expose the full size run (XS–XL) and the review score inline, so a buyer can add to cart from the collection grid without a detour into the product page.",
      "Implemented separate Teams and Students purchase paths, including the 20% student discount programme and bulk ordering for hospital departments.",
      "Wired campaign merchandising the client can run themselves — countdown banners, best-seller and category rails, and percentage-off badges driven by Shopify metafields rather than hardcoded markup.",
      "Built the men's and women's category architecture (classic tops, mandarin tops, joggers, trousers) with a shared component set so new ranges drop in without new templates.",
      "Integrated email capture offering 15% off a first order, with list segmentation by men's/women's preference at signup.",
      "Optimised the storefront for mobile-first browsing, which is where the majority of shift-time traffic lands.",
    ],
    features: [
      {
        title: "Inline size selection",
        description:
          "Full size run surfaced on the collection grid, cutting the path to cart from three clicks to one.",
      },
      {
        title: "Three buyer journeys",
        description:
          "Individual, Teams and Students routes with their own pricing logic and ordering flows.",
      },
      {
        title: "Self-serve campaigns",
        description:
          "Countdown timers, discount badges and promo rails the client configures without code.",
      },
      {
        title: "Trust surface",
        description:
          "Review scores, free shipping and 30-day return messaging carried through header, PDP and footer.",
      },
    ],
    results: [
      "Storefront live on a custom domain serving UK and international clinicians",
      "4.7/5 average product rating displayed across the catalogue",
      "Dedicated B2B route for hospital team orders alongside D2C checkout",
    ],
    screenshots: [
      "/clients/oncall-london-1.jpg",
      "/clients/oncall-london-2.jpg",
      "/clients/oncall-london-3.jpg",
      "/clients/oncall-london-4.jpg",
    ],
  },
  {
    slug: "area51-fireworks",
    name: "Area 51 Fireworks",
    url: "https://area51fireworks.com/",
    domain: "area51fireworks.com",
    ownDomain: true,
    sector: "E-commerce · Retail",
    icon: "Flame",
    accent: "amber",
    tagline: "Multi-store fireworks retailer with a case-based catalog",
    tags: ["E-commerce", "WooCommerce", "Retail"],
    year: "2025",
    role: "Web Developer",
    stack: ["WordPress", "WooCommerce", "PHP", "JavaScript", "Google Reviews API"],
    summary:
      "Fireworks retail storefront with case-based catalog, cart and checkout, brand collections, store locator and Google review integration.",
    challenge:
      "Fireworks retail does not work like normal e-commerce. Product is sold by the case in odd configurations (12/1, 4/24, 3/24), inventory is seasonal and spiky, legality varies by county, and most of the revenue still happens in physical stores. The site had to sell online, drive footfall, and keep customers out of legal trouble at the same time.",
    work: [
      "Built a case-quantity catalog that models real pack configurations (CASE 12/1, CASE 4/24) rather than forcing fireworks into a single-unit product schema.",
      "Implemented cart, checkout and customer accounts across 100+ SKUs spanning 12+ house brands including Alien, Ninja, Reaper's Doom and Excalibur.",
      "Built weekly-featured and Top 10 merchandising rails with load-more pagination, so the team can re-rank the storefront each week during peak season.",
      "Developed a store locator for the service-area network, converting online browsers into in-store buyers.",
      "Integrated Google Reviews to surface the 906-review, 5.0-star rating as live social proof instead of static testimonials.",
      "Built a shipping and delivery FAQ addressing the case-minimum and direct-shipping questions that dominated customer support.",
    ],
    features: [
      {
        title: "Case-based product model",
        description:
          "Catalog schema built around real pack configurations instead of single units.",
      },
      {
        title: "Brand collections",
        description:
          "12+ house brands with their own landing surfaces and cross-sell rails.",
      },
      {
        title: "Weekly merchandising",
        description:
          "Featured and Top 10 rails the team re-ranks without touching code.",
      },
      {
        title: "Store locator",
        description:
          "Service-area finder that routes online traffic to the nearest physical store.",
      },
    ],
    results: [
      "100+ SKUs across 12+ house brands live with full checkout",
      "906+ Google reviews at a 5.0 rating surfaced directly on the storefront",
      "Online catalog and physical store network unified in one funnel",
    ],
    screenshots: [
      "/clients/area51-fireworks-1.jpg",
      "/clients/area51-fireworks-2.jpg",
      "/clients/area51-fireworks-3.jpg",
      "/clients/area51-fireworks-4.jpg",
    ],
  },
  {
    slug: "ecom-lab",
    name: "The Ecom Lab",
    url: "https://ecomlab.social/",
    domain: "ecomlab.social",
    ownDomain: true,
    sector: "Marketing · Growth Agency",
    icon: "TrendingUp",
    accent: "orange",
    tagline: "Four-pillar growth system for ecommerce brands",
    tags: ["Agency", "Ecommerce", "Marketing"],
    year: "2026",
    role: "Web Developer",
    stack: ["Webflow", "JavaScript", "GSAP", "SEO"],
    summary:
      "Growth-agency site built around four pillars — paid acquisition, retention, SEO and CRO — with case studies and a strategy-call funnel.",
    challenge:
      "Every ecommerce agency site says the same things. The Ecom Lab's pitch is structural — that growth comes from four interconnected pillars working together, not from one channel — and the site had to make that argument visually before a visitor reads a single paragraph, then convert them into a booked strategy call.",
    work: [
      "Built the site architecture around the four-pillar model — Acquisition, Retention, Organic Growth, Growth Optimisation — each with its own service surface and its own proof.",
      "Developed case-study modules that lead with the number (+383% monthly revenue, +327% conversion rate, 1.2x → 5.4x ROAS) rather than burying it in prose.",
      "Implemented a partner logo marquee and testimonial system with named founder attribution across four client verticals.",
      "Built an accordion FAQ handling the objections that stall the sale — contracts, timelines, minimum ad spend, working alongside an in-house team.",
      "Wired a multi-CTA layout funnelling every scroll depth toward the same action: booking a free growth strategy call.",
      "Structured the page for SEO around commercial-intent terms rather than vanity keywords.",
    ],
    features: [
      {
        title: "Four-pillar architecture",
        description:
          "Site structure mirrors the agency's growth model so the pitch is legible from the nav alone.",
      },
      {
        title: "Number-first case studies",
        description:
          "Results modules that lead with the metric, then explain how it was reached.",
      },
      {
        title: "Objection-handling FAQ",
        description:
          "Eight-question accordion covering the exact concerns that stall agency deals.",
      },
      {
        title: "Single-action funnel",
        description:
          "Every CTA on the page converges on one outcome — the booked strategy call.",
      },
    ],
    results: [
      "Three published case studies with verified client outcomes",
      "Full-funnel site from cold traffic to booked strategy call",
      "Structured for commercial-intent organic search",
    ],
    screenshots: [
      "/clients/ecom-lab-1.jpg",
      "/clients/ecom-lab-2.jpg",
      "/clients/ecom-lab-3.jpg",
      "/clients/ecom-lab-4.jpg",
    ],
  },
  {
    slug: "obo-me",
    name: "obo me™",
    url: "https://www.obome.co/",
    domain: "obome.co",
    ownDomain: true,
    sector: "Media · Creator Platform",
    icon: "Mic",
    accent: "purple",
    tagline: "India's audio storytelling platform",
    tags: ["Audio Streaming", "Creator Platform", "Storytelling"],
    year: "2026",
    role: "Full-Stack Developer",
    stack: ["Next.js", "React", "Node.js", "MongoDB", "AWS S3"],
    summary:
      "Audio storytelling platform — curated stories, creator recording tools, a discovery feed and pro storyteller profiles across languages.",
    challenge:
      "obo me™ is a two-sided platform: professional storytellers need somewhere to record and publish, and listeners need a reason to keep coming back. It also had to work across multiple Indian languages without fragmenting into separate products, and surface a growing catalogue without an editorial team curating every shelf by hand.",
    work: [
      "Built the listener side — featured story carousel, curated obo picks rails, and a discovery feed carrying listen counts, language tags and narrator attribution.",
      "Developed creator-side recording and publishing flows, so storytellers can produce and release without leaving the platform.",
      "Implemented the obo pro storyteller directory with individual profiles, an infinite marquee, and a join funnel for new creators.",
      "Built search spanning both story titles and creator usernames, so a listener can find work by name or by narrator.",
      "Developed the obo social section — a short-form discovery surface for regional stories and travel content.",
      "Shipped supporting surfaces: event creation for pro accounts, a help centre, and an app-download funnel.",
    ],
    features: [
      {
        title: "Two-sided platform",
        description:
          "Listener discovery and creator publishing built as one product, not two.",
      },
      {
        title: "Multi-language catalogue",
        description:
          "Language tagging carried through discovery so regional stories stay findable.",
      },
      {
        title: "Creator directory",
        description:
          "Pro storyteller profiles with a marquee and join funnel for new narrators.",
      },
      {
        title: "Unified search",
        description:
          "One search box spanning story titles and creator usernames.",
      },
    ],
    results: [
      "Live catalogue spanning multiple Indian languages",
      "Pro storyteller network with dedicated creator profiles",
      "Web platform paired with a native app download funnel",
    ],
    screenshots: [
      "/clients/obo-me-1.jpg",
      "/clients/obo-me-2.jpg",
      "/clients/obo-me-3.jpg",
      "/clients/obo-me-4.jpg",
    ],
  },
  {
    slug: "cremsocial",
    name: "Cremsocial",
    url: "https://www.cremsocial.com/",
    domain: "cremsocial.com",
    ownDomain: true,
    sector: "Marketing · Digital Agency",
    icon: "Megaphone",
    accent: "fuchsia",
    tagline: "Marketing that actually works — no unicorn promises",
    tags: ["Agency", "SEO", "Lead Gen"],
    year: "2026",
    role: "Web Developer",
    stack: ["Next.js", "React", "Tailwind CSS", "SEO"],
    summary:
      "Digital marketing agency site covering SEO, paid ads, social and creator shadow-operating, with a free-audit lead capture funnel.",
    challenge:
      "Cremsocial's entire positioning is a reaction against agency jargon — their promise is plain English and real numbers. A polished, buzzword-heavy site would have contradicted the pitch. It needed to feel blunt and specific while still converting two very different audiences: local business owners who need the phone to ring, and creators who need a revenue system built behind their content.",
    work: [
      "Built service sections for SEO and local visibility, paid ads, social presence and conversion-focused web development — each listing concrete deliverables rather than abstract capabilities.",
      "Implemented the 'Shadow Operating for Creators' programme flow: audience deep-dive, offer strategy, backend build, launch and refine, including the revenue-share model.",
      "Developed a free-marketing-audit lead capture form with qualification fields, so inbound leads arrive pre-scoped instead of as blank enquiries.",
      "Built a seven-question accordion FAQ covering scope, pricing, timelines and whether a single service can be bought standalone.",
      "Structured the copy hierarchy so the anti-jargon voice survives the scroll — short lines, concrete claims, no filler sections.",
      "Optimised the site for local SEO and Google Business Profile alignment, which is the service Cremsocial sells hardest.",
    ],
    features: [
      {
        title: "Deliverable-led services",
        description:
          "Every service section lists what actually gets done, not what it's called.",
      },
      {
        title: "Creator shadow-ops flow",
        description:
          "Four-step programme surface covering strategy, build, launch and revenue share.",
      },
      {
        title: "Qualifying audit form",
        description:
          "Lead capture that scopes the enquiry before it reaches the inbox.",
      },
      {
        title: "Local SEO structure",
        description:
          "Built to rank for the local-intent terms the agency's own clients compete on.",
      },
    ],
    results: [
      "Two distinct audiences served through one site without diluting either",
      "Qualified lead capture replacing generic contact-form enquiries",
      "Structured for local search visibility in the GTA market",
    ],
    screenshots: [
      "/clients/cremsocial-1.jpg",
      "/clients/cremsocial-2.jpg",
      "/clients/cremsocial-3.jpg",
      "/clients/cremsocial-4.jpg",
    ],
  },
  {
    slug: "rahat-international",
    name: "Rahat International",
    url: "https://www.rahatinternational.com.np/",
    domain: "rahatinternational.com.np",
    ownDomain: true,
    sector: "Recruitment · Corporate",
    icon: "Users",
    accent: "red",
    tagline: "Connecting global talent across the Gulf, Africa and Asia",
    tags: ["Recruitment", "Corporate", "Global Workforce"],
    year: "2026",
    role: "Web Developer",
    stack: ["React", "Next.js", "Tailwind CSS", "Framer Motion"],
    summary:
      "Nepal-based overseas recruitment agency presenting a 9-step hiring journey, 14+ industries served and client testimonials across 16 countries.",
    challenge:
      "International recruitment is a compliance-heavy, trust-first business. A prospective client in the Gulf is handing over responsibility for hundreds of workers and needs to see the process, the paperwork and the track record before making contact. The site had to make a nine-stage regulatory pipeline feel navigable rather than bureaucratic.",
    work: [
      "Built an interactive nine-step recruitment journey — demand paperwork and MOFA attestation, pre-approval, advertisement, interview and selection, medical checks, visa stamping, final approval, ticketing and deployment, after-recruitment service.",
      "Developed a step-by-step navigator so a visitor can walk the pipeline stage by stage instead of reading a wall of process copy.",
      "Implemented a 14-industry capability grid spanning construction, hospitality, facility management, security, manufacturing, agriculture, oil and gas, aviation and more.",
      "Built a client logo wall and a nine-entry testimonial carousel with role and organisation attribution for credibility at a glance.",
      "Surfaced trust metrics — 35 years of operation, 326,866+ placements, presence in 16+ countries — in a scannable proof section.",
      "Developed the vision, mission and who-we-are surfaces plus a newsletter capture for ongoing opportunity alerts.",
    ],
    features: [
      {
        title: "Nine-step journey navigator",
        description:
          "Interactive pipeline walking clients through every regulatory stage to deployment.",
      },
      {
        title: "Industry capability grid",
        description:
          "14+ sectors, each with its own placement track record.",
      },
      {
        title: "Trust metrics surface",
        description:
          "35 years, 326,866+ placements and 16+ countries presented as scannable proof.",
      },
      {
        title: "Testimonial carousel",
        description:
          "Nine client quotes with named roles and organisations.",
      },
    ],
    results: [
      "Full recruitment pipeline made self-explanatory to overseas clients",
      "14+ industry verticals presented with dedicated capability surfaces",
      "Three decades of track record translated into a credibility-first layout",
    ],
    screenshots: [
      "/clients/rahat-international-1.jpg",
      "/clients/rahat-international-2.jpg",
      "/clients/rahat-international-3.jpg",
      "/clients/rahat-international-4.jpg",
    ],
  },
  {
    slug: "tci-global",
    name: "TCI Global Recruitment",
    url: "https://www.tcibd.com/",
    domain: "tcibd.com",
    ownDomain: true,
    sector: "Recruitment · Global Workforce",
    icon: "Globe",
    accent: "rose",
    tagline: "24+ years of overseas talent deployment across 25+ countries",
    tags: ["Recruitment", "Global Workforce", "Overseas Hiring"],
    year: "2025",
    role: "Web Developer",
    stack: ["React", "Node.js", "Tailwind CSS"],
    summary:
      "Leading overseas recruitment company with 24+ years experience in talent deployment across 25+ countries, maintaining a 98% placement success rate.",
    challenge:
      "TCI had two decades of placement history and almost none of it was visible online. Competitors with a fraction of the track record presented better. The brief was to turn 24 years of operational credibility into a digital presence that would hold up next to far larger international agencies.",
    work: [
      "Built the corporate platform presenting 24+ years of operating history, 25+ country coverage and the 98% placement success rate as primary trust signals.",
      "Developed sector-by-sector capability surfaces so prospective employers can find their own industry immediately.",
      "Implemented the recruitment process walkthrough covering sourcing, selection, documentation and deployment.",
      "Built responsive layouts tuned for the Gulf and South Asian markets where the majority of traffic originates.",
      "Structured the site so credibility metrics appear above the fold on every key landing surface.",
    ],
    features: [
      {
        title: "Track-record-first layout",
        description:
          "24 years, 25+ countries and 98% placement rate lead every major surface.",
      },
      {
        title: "Sector capability pages",
        description:
          "Industry-specific surfaces so employers self-identify instantly.",
      },
      {
        title: "Process transparency",
        description:
          "End-to-end sourcing-to-deployment walkthrough for compliance-minded clients.",
      },
      {
        title: "Market-tuned responsive build",
        description:
          "Optimised for the mobile-heavy Gulf and South Asian traffic profile.",
      },
    ],
    results: [
      "Two decades of placement history made visible and verifiable online",
      "25+ country coverage presented as a single navigable capability map",
      "98% placement success rate established as the headline trust signal",
    ],
    screenshots: [
      "/clients/tci-global-1.jpg",
      "/clients/tci-global-2.jpg",
      "/clients/tci-global-3.jpg",
      "/clients/tci-global-4.jpg",
    ],
  },
  {
    slug: "technotalents-ai",
    name: "Technotalents AI",
    url: "https://www.technotalents.ai/",
    domain: "technotalents.ai",
    ownDomain: true,
    sector: "HR Tech · AI",
    icon: "Brain",
    accent: "violet",
    tagline: "Machine-learning talent matching at scale",
    tags: ["AI/ML", "Recruitment", "HR Tech"],
    year: "2025",
    role: "Full-Stack Developer",
    stack: ["Next.js", "TypeScript", "Node.js", "MongoDB", "AI/ML APIs"],
    summary:
      "AI-powered talent acquisition platform leveraging machine learning to match candidates with opportunities efficiently.",
    challenge:
      "Recruiters drown in unstructured CVs. The platform needed to turn free-text resumes and job descriptions into something comparable, then rank matches in a way a human recruiter would actually trust — because an unexplained score gets ignored.",
    work: [
      "Built the candidate-to-opportunity matching platform with machine-learning ranking over parsed CV and job-description data.",
      "Developed the recruiter-facing interface for reviewing, filtering and shortlisting ranked candidate sets.",
      "Implemented candidate profile ingestion and normalisation so unstructured resumes become comparable structured records.",
      "Built the employer surfaces for posting roles and managing pipelines end to end.",
      "Shipped a responsive interface on a .ai domain positioning the product in the AI recruitment category.",
    ],
    features: [
      {
        title: "ML-ranked matching",
        description:
          "Candidates scored against role requirements rather than keyword-matched.",
      },
      {
        title: "Resume normalisation",
        description:
          "Unstructured CVs parsed into comparable structured records.",
      },
      {
        title: "Recruiter workflow",
        description:
          "Review, filter and shortlist ranked candidate sets in one surface.",
      },
      {
        title: "Employer pipelines",
        description:
          "Role posting through to hire, managed end to end.",
      },
    ],
    results: [
      "Matching engine replacing manual CV screening",
      "Structured candidate records generated from free-text resumes",
      "Live on a category-defining .ai domain",
    ],
    screenshots: [
      "/clients/technotalents-ai-1.jpg",
      "/clients/technotalents-ai-2.jpg",
      "/clients/technotalents-ai-3.jpg",
      "/clients/technotalents-ai-4.jpg",
    ],
  },
  {
    slug: "consulteasily",
    name: "Consulteasily",
    url: "https://www.consulteasily.com/",
    domain: "consulteasily.com",
    ownDomain: true,
    sector: "Professional Services",
    icon: "Rocket",
    accent: "indigo",
    tagline: "Consulting platform connecting clients and consultants",
    tags: ["Full-Stack", "React", "Consulting"],
    year: "2025",
    role: "Freelance Full-Stack Developer",
    stack: ["React", "Node.js", "Express", "MongoDB"],
    summary:
      "Comprehensive consulting platform designed to streamline client-consultant interactions with intuitive features and a seamless user experience.",
    challenge:
      "Consulteasily needed to go from nothing to a working platform — frontend, backend, database and deployment — inside a two-month window, without cutting the corners that would make it unmaintainable later.",
    work: [
      "Built the entire site from scratch, including responsive UI and the end-to-end client-consultant interaction flow.",
      "Developed the REST API layer and a scalable backend with secure database integration.",
      "Owned full-stack delivery through deployment, including performance optimisation on launch.",
      "Structured the codebase for maintainability so the platform could grow past the initial engagement.",
    ],
    features: [
      {
        title: "End-to-end build",
        description:
          "Frontend, backend, database and deployment delivered by one developer.",
      },
      {
        title: "Secure API layer",
        description:
          "REST endpoints with authenticated, validated database access.",
      },
      {
        title: "Responsive UI",
        description:
          "Consistent experience across desktop, tablet and mobile.",
      },
      {
        title: "Launch optimisation",
        description:
          "Performance tuned before go-live rather than after.",
      },
    ],
    results: [
      "Full platform delivered from zero in a two-month engagement",
      "Scalable backend architecture with secure data access",
      "Deployed and performance-optimised at launch",
    ],
    screenshots: [
      "/clients/consulteasily-1.jpg",
      "/clients/consulteasily-2.jpg",
      "/clients/consulteasily-3.jpg",
      "/clients/consulteasily-4.jpg",
    ],
  },
  {
    slug: "stayzaa",
    name: "StayZaa",
    url: "https://stayzaa.com/",
    domain: "stayzaa.com",
    ownDomain: true,
    sector: "Hospitality · Travel",
    icon: "Home",
    accent: "emerald",
    tagline: "Accommodation search and booking, rendered on a 3D globe",
    tags: ["Hospitality", "Booking", "Mapbox GL"],
    year: "2025",
    role: "Full-Stack Developer",
    stack: ["React", "Node.js", "Mapbox GL", "MongoDB"],
    summary:
      "Hospitality and booking platform providing seamless accommodation search, reservations, and property management solutions.",
    challenge:
      "StayZaa's differentiator is an interactive 3D globe for discovering stays — and it was the slowest thing on the site. The globe carried the brand but was costing page performance badly enough to hurt the funnel it was supposed to feed.",
    work: [
      "Profiled and optimised the Mapbox GL globe rendering pipeline, improving render efficiency by 30% and measurably cutting page load times.",
      "Built and refined frontend and backend features across the booking flow, including the About surface.",
      "Delivered scalable, maintainable component architecture with consistent design language and responsive behaviour across desktop and mobile.",
      "Worked with the core team to ship features on release cadence and resolved 90% of the critical bug backlog.",
      "Held design consistency across the property search, listing and reservation surfaces.",
    ],
    features: [
      {
        title: "Optimised 3D globe",
        description:
          "Mapbox GL rendering pipeline rebuilt for a 30% efficiency gain.",
      },
      {
        title: "Booking flow",
        description:
          "Search through reservation, built for mobile and desktop parity.",
      },
      {
        title: "Property management",
        description:
          "Host-side surfaces for listing and managing inventory.",
      },
      {
        title: "Release-cadence delivery",
        description:
          "Shipped alongside the core team with 90% of critical bugs cleared.",
      },
    ],
    results: [
      "30% improvement in Mapbox GL globe rendering efficiency",
      "90% of critical bugs resolved during the engagement",
      "Measurable page performance and load-time gains",
    ],
    screenshots: [],
  },
  {
    slug: "justhopon",
    name: "JustHopOn",
    url: "https://www.justhopon.com/",
    domain: "justhopon.com",
    ownDomain: true,
    sector: "Travel Tech · Adventure",
    icon: "Plane",
    accent: "teal",
    tagline: "Guided expeditions from the Himalayas to the Arctic",
    tags: ["Travel Tech", "Adventure", "Guided Trips"],
    year: "2025",
    role: "Full-Stack Developer",
    stack: ["React", "Next.js", "Node.js", "Tailwind CSS"],
    summary:
      "Adventure booking platform connecting travellers with expert guides and curated global expeditions.",
    challenge:
      "Adventure travel is a high-consideration purchase — people research for weeks before booking a Himalayan trek. The platform had to carry enough detail to close that research loop while keeping the booking path short enough that a decided buyer doesn't drop out.",
    work: [
      "Built the expedition discovery and booking platform connecting travellers with vetted expert guides.",
      "Developed curated expedition surfaces spanning destinations from the Himalayas to Arctic skies.",
      "Implemented the guide profile system so travellers can evaluate who they're travelling with, not just where.",
      "Built responsive, image-forward layouts that carry the destination without stalling load times.",
      "Shipped the enquiry and booking flow from browse to confirmed trip.",
    ],
    features: [
      {
        title: "Curated expeditions",
        description:
          "Destination-led discovery across a globally spread trip catalogue.",
      },
      {
        title: "Guide profiles",
        description:
          "Vetted expert profiles so travellers evaluate the guide, not just the route.",
      },
      {
        title: "Image-forward, fast",
        description:
          "Photography-heavy layouts kept within a real performance budget.",
      },
      {
        title: "Short booking path",
        description:
          "Deep research content without lengthening the path to booking.",
      },
    ],
    results: [
      "Global expedition catalogue live under one booking flow",
      "Guide-led trust model built into the product",
      "Research-depth content paired with a short conversion path",
    ],
    screenshots: [
      "/clients/justhopon-1.jpg",
      "/clients/justhopon-2.jpg",
      "/clients/justhopon-3.jpg",
    ],
  },
  {
    slug: "prasanta-kar-institute",
    name: "Prasanta Kar Institute",
    url: "https://www.prasantakarinstitute.com/",
    domain: "prasantakarinstitute.com",
    ownDomain: true,
    sector: "Education · LMS + Commerce",
    icon: "GraduationCap",
    accent: "blue",
    tagline: "LMS, e-commerce and e-book store in one platform",
    tags: ["Education", "LMS", "Razorpay"],
    year: "2025",
    role: "Freelance Full-Stack Developer",
    stack: ["Next.js", "Node.js", "MongoDB", "Razorpay"],
    summary:
      "Educational institute platform with course management, enrollment systems, and interactive learning modules for students and educators.",
    challenge:
      "The institute needed three products at once — a learning management system, an e-commerce store, and an e-book shop — plus admin tooling to run all of it. Built as three systems it would have been unmaintainable; it had to be one platform with one identity, one cart and one dashboard.",
    work: [
      "Developed the entire platform from scratch — frontend, backend, database and deployment — unifying an LMS, e-commerce store and e-book store under one account system.",
      "Built admin and manager panels with real-time monitoring, analytics dashboards and content management across courses, orders, users and payments.",
      "Integrated the Razorpay payment gateway with automated course enrolment triggered on successful payment.",
      "Implemented order management and live tracking on a secure, scalable architecture sustaining 99.9% uptime.",
      "Delivered fully responsive layouts so students can work through course content on phones.",
    ],
    features: [
      {
        title: "Three products, one platform",
        description:
          "LMS, storefront and e-book shop sharing one account, cart and dashboard.",
      },
      {
        title: "Admin + manager panels",
        description:
          "Real-time monitoring and analytics over courses, orders, users and payments.",
      },
      {
        title: "Automated enrolment",
        description:
          "Razorpay payment success triggers course access with no manual step.",
      },
      {
        title: "99.9% uptime",
        description:
          "Architecture built to hold through enrolment-period traffic spikes.",
      },
    ],
    results: [
      "99.9% uptime sustained on a scalable architecture",
      "Automated enrolment removing manual admin from every sale",
      "Three product lines unified under a single platform",
    ],
    screenshots: [
      "/clients/prasanta-kar-institute-1.jpg",
      "/clients/prasanta-kar-institute-2.jpg",
      "/clients/prasanta-kar-institute-3.jpg",
      "/clients/prasanta-kar-institute-4.jpg",
    ],
  },
  {
    slug: "jhore-jole-jongole",
    name: "Jhore Jole Jongole",
    url: "https://jhore-jole-jungle-production.vercel.app/",
    domain: "jhore-jole-jungle-production.vercel.app",
    ownDomain: false,
    sector: "Hospitality · Eco Tourism",
    icon: "TreePine",
    accent: "green",
    tagline: "Eco-heritage resort at the edge of the Sundarbans",
    tags: ["Hospitality", "Eco Tourism", "Booking"],
    year: "2026",
    role: "Full-Stack Developer",
    stack: ["Next.js", "React", "Tailwind CSS", "Framer Motion"],
    summary:
      "Eco-heritage resort platform — rooms, curated packages, wildlife experiences, gallery and an enquiry-driven booking flow.",
    challenge:
      "The resort's real advantage is logistical — it is one of the only Sundarbans properties reachable by car with no river crossing — but that story was invisible online. It also books through enquiry rather than instant payment, so the site had to capture enough detail in one form for the team to quote accurately without a phone tag loop.",
    work: [
      "Built the full marketing and booking site — rooms, curated packages, wildlife and experience sections, amenities, gallery and location guidance.",
      "Led with the logistics advantage: three hours from Kolkata, no river crossing, Tiger Rescue Centre five minutes away, direct car access and parking.",
      "Implemented a multi-field reservation enquiry flow capturing dates, guest count, package preference and special requests including wheelchair access and dietary requirements.",
      "Developed six curated package layouts covering families, day trips, river cruises, school excursions, corporate retreats and senior citizens.",
      "Built a twelve-item amenities grid and a wildlife section covering the seven species guests actually come to see.",
      "Shipped responsive image galleries and video sections carrying creator-generated social proof.",
    ],
    features: [
      {
        title: "Logistics-first positioning",
        description:
          "The no-river-crossing advantage surfaced above the fold, not buried in an FAQ.",
      },
      {
        title: "Six curated packages",
        description:
          "Distinct layouts for families, schools, corporates and senior guests.",
      },
      {
        title: "Detailed enquiry capture",
        description:
          "Accessibility, dietary and occasion fields so the team can quote in one pass.",
      },
      {
        title: "Wildlife and amenity surfaces",
        description:
          "Twelve amenities and seven species presented as reasons to book.",
      },
    ],
    results: [
      "Six package types live with a single unified enquiry flow",
      "Two-hour response commitment supported by pre-qualified enquiries",
      "Resort's core logistical advantage made the headline message",
    ],
    screenshots: [
      "/clients/jhore-jole-jongole-1.jpg",
      "/clients/jhore-jole-jongole-2.jpg",
      "/clients/jhore-jole-jongole-3.jpg",
      "/clients/jhore-jole-jongole-4.jpg",
    ],
  },
  {
    slug: "e-tuition",
    name: "E-Tuition",
    url: "https://e-tution-platform.vercel.app/",
    domain: "e-tution-platform.vercel.app",
    ownDomain: false,
    sector: "EdTech · Coaching Platform",
    icon: "Video",
    accent: "rose",
    tagline: "A coaching academy's whole day, on one platform",
    tags: ["EdTech", "Firebase", "AI Notes"],
    year: "2026",
    role: "Full-Stack Developer & Product Owner",
    stack: [
      "Next.js",
      "Firebase",
      "Firestore",
      "Google Meet API",
      "Google Calendar",
      "Google Drive",
    ],
    summary:
      "Coaching-academy platform running the whole day — Google Meet classes, auto attendance, resumable recordings, AI class notes and verifiable certificates.",
    challenge:
      "Coaching centres run on five apps and a group chat: Zoom links in WhatsApp, recordings on a shared drive, attendance in a paper register, marks across four spreadsheets, certificates in Word. Replacing that meant matching every one of those workflows on day one — a platform that covers 80% of the day is worse than the mess it replaces, because now there are six systems.",
    work: [
      "Integrated Google Meet, Calendar, Drive and Sign-in so classes are scheduled from the course and joined inside the platform — teachers never learn a new video tool.",
      "Built automatic attendance capture at join time, replacing the register entirely; nobody calls names.",
      "Implemented recordings that resume to the exact second across devices, with per-student per-lesson completion tracked as they watch.",
      "Shipped an AI notes pipeline producing transcript, summary, key points and timecoded topics after every session — landing as a draft, never auto-published.",
      "Gated all AI output behind mandatory teacher review, because unreviewed machine output is not something to hand a student.",
      "Enforced three strictly separated roles — administrator, teacher, student — in Firestore security rules rather than by hiding buttons in the UI.",
      "Automated certificate issuance on course completion with serial numbers verifiable at a public URL.",
      "Built owner reporting recomputed from actual attendance and watch events, never estimated.",
    ],
    features: [
      {
        title: "Google Meet native",
        description:
          "Classes scheduled from the course, joined in-platform, links visible only to enrolled students.",
      },
      {
        title: "Attendance at the door",
        description:
          "Captured automatically as students join. No register, no roll call.",
      },
      {
        title: "AI notes, teacher-reviewed",
        description:
          "Transcript, summary, key points and timecodes — published only after a human pass.",
      },
      {
        title: "Second-accurate resume",
        description:
          "Recordings pick up exactly where a student stopped, on any device.",
      },
      {
        title: "Database-enforced roles",
        description:
          "Admin, teacher and student separation written into Firestore rules.",
      },
      {
        title: "Self-verifying certificates",
        description:
          "Issued automatically with serials anyone can check at a public URL.",
      },
    ],
    results: [
      "Seven separate tools and workflows replaced on day one",
      "Notes turnaround cut from an hour of writing to a fifteen-minute review",
      "Owner reporting recomputed from real events instead of asked for on Mondays",
    ],
    screenshots: [
      "/clients/e-tuition-1.jpg",
      "/clients/e-tuition-2.jpg",
      "/clients/e-tuition-3.jpg",
      "/clients/e-tuition-4.jpg",
    ],
  },
  {
    slug: "ai-se-ai-seekho",
    name: "AI Se AI Seekho",
    url: "https://ai-se-ai-seekho.vercel.app/",
    domain: "ai-se-ai-seekho.vercel.app",
    ownDomain: false,
    sector: "EdTech · AI",
    icon: "Bot",
    accent: "cyan",
    tagline: "Learn AI from AI itself",
    tags: ["AI/ML", "EdTech", "Prompt Engineering"],
    year: "2026",
    role: "Full-Stack Developer",
    stack: ["Next.js", "TypeScript", "LLM APIs", "Tailwind CSS"],
    summary:
      "AI learning platform with a live model playground, prompt lab, structured courses, an AI tutor and a community prompt marketplace.",
    challenge:
      "You cannot learn prompt engineering by reading about prompt engineering. The platform had to put a live model in front of a learner within seconds of landing, then build structure around that experimentation so it becomes a curriculum rather than a toy.",
    work: [
      "Built an interactive AI playground with live prompt execution, adjustable model parameters and a one-click prompt enhancer — reachable from the hero without signing up.",
      "Developed a structured course system spanning beginner fundamentals through advanced LLM techniques and fine-tuning.",
      "Implemented the Prompt Lab with version control and performance scoring, so learners can iterate on a prompt and see whether it improved.",
      "Built an AI tutor delivering personalised guidance and instant feedback on learner work.",
      "Developed a community prompt marketplace for browsing, sharing and monetising prompts, with ratings and category filtering.",
      "Shipped separate learner, dashboard and admin surfaces on one account system.",
    ],
    features: [
      {
        title: "Zero-friction playground",
        description:
          "Live model execution from the landing page, no signup wall.",
      },
      {
        title: "Prompt Lab with versioning",
        description:
          "Iterate prompts with version history and performance scoring.",
      },
      {
        title: "AI tutor",
        description:
          "Personalised guidance and instant feedback, available around the clock.",
      },
      {
        title: "Prompt marketplace",
        description:
          "Community browsing, sharing and monetisation with ratings.",
      },
    ],
    results: [
      "Live model experimentation available before signup",
      "Structured curriculum from fundamentals to fine-tuning",
      "Community marketplace turning learners into contributors",
    ],
    screenshots: [
      "/clients/ai-se-ai-seekho-1.jpg",
      "/clients/ai-se-ai-seekho-2.jpg",
      "/clients/ai-se-ai-seekho-3.jpg",
      "/clients/ai-se-ai-seekho-4.jpg",
    ],
  },
  {
    slug: "techno-talents",
    name: "Techno Talents",
    url: "https://techno-talents.vercel.app/",
    domain: "techno-talents.vercel.app",
    ownDomain: false,
    sector: "EdTech · Student Ecosystem",
    icon: "GraduationCap",
    accent: "purple",
    tagline: "One ecosystem for students, parents and institutions",
    tags: ["EdTech", "Student Platform", "End-to-End Ecosystem"],
    year: "2025",
    role: "Full-Stack Developer",
    stack: ["Next.js", "React", "Node.js", "MongoDB"],
    summary:
      "Unified ecosystem offering coaching, universities, hostels, meals, courses, mentorship, lifestyle perks and verified outcomes in one platform.",
    challenge:
      "A student moving cities for education deals with a dozen unrelated vendors — coaching, admission, hostel, food, mentorship. The platform had to consolidate that into one account without becoming an unnavigable directory.",
    work: [
      "Built the unified platform spanning coaching, universities, hostels, meals, courses, mentorship and lifestyle perks under one student account.",
      "Developed distinct surfaces for the three audiences — students, parents and institutions — without splitting the product.",
      "Implemented a verified-outcomes system so claims made on the platform are backed by evidence.",
      "Built discovery and comparison flows across service categories.",
      "Shipped responsive layouts for a predominantly mobile student user base.",
    ],
    features: [
      {
        title: "Single student account",
        description:
          "Coaching, housing, meals and mentorship consolidated into one login.",
      },
      {
        title: "Three audiences, one product",
        description:
          "Student, parent and institution surfaces without fragmenting the platform.",
      },
      {
        title: "Verified outcomes",
        description:
          "Evidence-backed claims rather than unverified marketing numbers.",
      },
      {
        title: "Cross-category discovery",
        description:
          "Compare across service types in a single browsing flow.",
      },
    ],
    results: [
      "Seven service categories unified into one student account",
      "Parent and institution surfaces served without a separate build",
      "Outcome verification built into the platform model",
    ],
    screenshots: [
      "/clients/techno-talents-1.jpg",
      "/clients/techno-talents-2.jpg",
      "/clients/techno-talents-3.jpg",
      "/clients/techno-talents-4.jpg",
    ],
  },
  {
    slug: "technohr",
    name: "TechnoHR",
    url: "https://technohr.vercel.app/",
    domain: "technohr.vercel.app",
    ownDomain: false,
    sector: "HR Tech · AI",
    icon: "Briefcase",
    accent: "blue",
    tagline: "AI-powered job search and smart employer tooling",
    tags: ["HR Tech", "AI Matching", "Job Platform"],
    year: "2025",
    role: "Full-Stack Developer",
    stack: ["Next.js", "React", "Node.js", "MongoDB", "AI APIs"],
    summary:
      "AI-powered recruitment platform offering job search, smart employer tools, automated matching and hiring insights.",
    challenge:
      "Job boards fail both sides at once: candidates apply into a void, employers drown in unqualified applications. TechnoHR needed automated matching that actually reduces volume on the employer side while raising signal on the candidate side.",
    work: [
      "Built the AI-powered job search experience with automated candidate-to-role matching.",
      "Developed smart employer tooling for posting, screening and pipeline management.",
      "Implemented hiring insights and analytics surfaces for employers tracking funnel health.",
      "Built the candidate profile system feeding the matching engine.",
      "Shipped a responsive platform connecting talent with global opportunities.",
    ],
    features: [
      {
        title: "Automated matching",
        description:
          "Roles and candidates paired by fit rather than keyword overlap.",
      },
      {
        title: "Employer tooling",
        description:
          "Posting, screening and pipeline management in one surface.",
      },
      {
        title: "Hiring insights",
        description:
          "Funnel analytics so employers see where candidates drop.",
      },
      {
        title: "Global reach",
        description:
          "Cross-border opportunity discovery for candidates.",
      },
    ],
    results: [
      "Automated matching reducing unqualified application volume",
      "End-to-end employer pipeline from posting to hire",
      "Analytics surfacing funnel health in real time",
    ],
    screenshots: [
      "/clients/technohr-1.jpg",
      "/clients/technohr-2.jpg",
      "/clients/technohr-3.jpg",
      "/clients/technohr-4.jpg",
    ],
  },
  {
    slug: "glow",
    name: "Glow",
    url: "https://glow-2-o.vercel.app/",
    domain: "glow-2-o.vercel.app",
    ownDomain: false,
    sector: "E-commerce · Beauty",
    icon: "Sparkles",
    accent: "pink",
    tagline: "Premium cosmetics storefront",
    tags: ["E-commerce", "Next.js", "Beauty"],
    year: "2025",
    role: "Full-Stack Developer",
    stack: ["Next.js", "TypeScript", "Tailwind CSS", "Stripe"],
    summary:
      "Modern e-commerce platform for premium cosmetics with stunning product showcases, cart management and secure checkout.",
    challenge:
      "Cosmetics sell on presentation — the product photography has to dominate — but heavy imagery is the fastest way to kill a mobile conversion rate. The build had to keep the visual impact without the load cost.",
    work: [
      "Built the storefront with image-forward product showcases tuned to keep cosmetics photography sharp without blocking first paint.",
      "Implemented cart management with persistent state across sessions.",
      "Developed the secure checkout flow end to end.",
      "Built responsive category and product surfaces for a mobile-majority beauty audience.",
      "Optimised image delivery so the visual quality survives the performance budget.",
    ],
    features: [
      {
        title: "Image-forward, fast",
        description:
          "Product photography kept sharp without blocking first paint.",
      },
      {
        title: "Persistent cart",
        description:
          "Cart state survives across sessions and devices.",
      },
      {
        title: "Secure checkout",
        description:
          "End-to-end payment flow with validated order handling.",
      },
      {
        title: "Mobile-majority build",
        description:
          "Tuned for the phone-first beauty shopping pattern.",
      },
    ],
    results: [
      "Visual-first storefront within a real performance budget",
      "Full cart-to-checkout flow shipped end to end",
      "Responsive experience across the mobile-heavy beauty audience",
    ],
    screenshots: [
      "/clients/glow-1.jpg",
      "/clients/glow-2.jpg",
      "/clients/glow-3.jpg",
      "/clients/glow-4.jpg",
    ],
  },
  {
    slug: "tmsl-lms",
    name: "TMSL LMS",
    url: "https://tmsl-lms-main.vercel.app/",
    domain: "tmsl-lms-main.vercel.app",
    ownDomain: false,
    sector: "Education · LMS",
    icon: "BookOpen",
    accent: "slate",
    tagline: "Course delivery and coursework for an engineering college",
    tags: ["LMS", "Education", "Next.js"],
    year: "2025",
    role: "Full-Stack Developer",
    stack: ["Next.js", "React", "Firebase", "Tailwind CSS"],
    summary:
      "Learning management system for an engineering college — course delivery, study material and student coursework in one portal.",
    challenge:
      "College course material lived across email threads, shared drives and departmental noticeboards. Students missed deadlines because nothing was in one place, and faculty had no view of who had actually accessed what.",
    work: [
      "Built the learning management portal unifying course delivery, study material distribution and student coursework.",
      "Developed faculty surfaces for publishing material and tracking student engagement.",
      "Implemented the student-facing course view with material access and submission flows.",
      "Built role separation between faculty and student accounts.",
      "Shipped responsive layouts so students can access coursework from phones.",
    ],
    features: [
      {
        title: "Unified course portal",
        description:
          "Material, delivery and coursework in one place instead of three.",
      },
      {
        title: "Faculty publishing",
        description:
          "Upload and distribute material without IT involvement.",
      },
      {
        title: "Engagement visibility",
        description:
          "Faculty can see what students have actually accessed.",
      },
      {
        title: "Role separation",
        description:
          "Faculty and student accounts with distinct permissions.",
      },
    ],
    results: [
      "Course material consolidated from three channels into one portal",
      "Faculty visibility into student engagement",
      "Mobile access for coursework and submissions",
    ],
    screenshots: [
      "/clients/tmsl-lms-1.jpg",
      "/clients/tmsl-lms-2.jpg",
      "/clients/tmsl-lms-3.jpg",
      "/clients/tmsl-lms-4.jpg",
    ],
  },
];

export const featuredClientProjects = clientProjects.slice(0, 9);

export const getClientProject = (slug?: string) =>
  clientProjects.find((p) => p.slug === slug);
