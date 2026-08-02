export type Role = {
  title: string;
  company: string;
  url: string | null;
  period: string;
  location: string | null;
  accent: string;
  /** lucide-react icon name */
  icon: string;
  current: boolean;
  bullets: string[];
};

/** Newest first. Drives the experience timeline. */
export const experience: Role[] = [
  {
    title: "Head of Development & Project Manager",
    company: "Alphonso Media (OPC) Private Limited",
    url: "https://alphonsomedia.com/",
    period: "Jan 2026 – Present",
    location: "Remote",
    accent: "violet",
    icon: "Users",
    current: true,
    bullets: [
      "Leading end-to-end delivery of software products — from technical strategy and system architecture to project planning, sprint execution, and successful client delivery.",
      "Coordinating cross-functional teams across frontend, backend, UI/UX, QA, and DevOps, while owning code quality, technical reviews, deployment strategy, and product releases.",
      "Working directly with clients to gather requirements and define scope, preparing SRS documents, roadmaps, and delivery plans that translate business needs into technical solutions.",
      "Identifying and mitigating project risks, driving Agile process improvements, and mentoring developers to sustain a culture of collaboration and continuous improvement.",
    ],
  },
  {
    title: "Freelance Lead Full-Stack Developer & Product Owner",
    company: "Coding On The Rocks",
    url: "https://codingontherocks.com/",
    period: "Dec 2025 – Present",
    location: "Remote · Freelance",
    accent: "amber",
    icon: "Code2",
    current: true,
    bullets: [
      "Owning the complete product lifecycle — ideation, requirements analysis, system architecture, development, testing, deployment, and post-launch optimization.",
      "Building full-stack applications with Next.js, React, Node.js, Firebase, MongoDB, and AWS — REST/GraphQL APIs, optimized schemas, and secure role-based access control.",
      "Leading cross-functional teams across frontend, backend, UI/UX, and QA, and designing responsive, accessible interfaces that hold brand consistency under real performance budgets.",
      "Setting up CI/CD pipelines, automated testing, and environment management for fast, reliable releases — plus code reviews and mentoring to keep engineering standards high.",
    ],
  },
  {
    title: "Engineering Data Analyst",
    company: "Garage Guys",
    url: null,
    period: "Dec 2025 – Jul 2026",
    location: "Remote, Tennessee, US",
    accent: "sky",
    icon: "BarChart3",
    current: false,
    bullets: [
      "Analyzed building and construction permit data for residential and commercial infrastructure projects, extracting permit types, property identifiers, contractor details, and site records.",
      "Applied systematic validation, cleaning, and normalization across large datasets to keep accuracy, completeness, and consistency intact at volume.",
      "Interpreted permit documentation to classify engineering-relevant work (new construction, remodeling, plumbing, electrical) and flagged anomalies before they reached downstream systems.",
    ],
  },
  {
    title: "Tech Lead & Full-Stack Developer",
    company: "Techno India Group",
    url: "https://technoindiagroup.in/",
    period: "Aug 2025 – Present",
    location: null,
    accent: "emerald",
    icon: "Briefcase",
    current: true,
    bullets: [
      "Overseeing and managing all technical operations for Techno India Group, including frontend and backend development, database design, domain & DNS configuration, server management, and deployment pipelines, ensuring seamless performance and reliability across all projects.",
      "Leading a multidisciplinary development team to plan, architect, and deliver modern, scalable web platforms — handling everything from wireframing and system architecture to integration, optimization, and security.",
      "Driving innovation and technical excellence by implementing best practices, maintaining high system uptime, and ensuring every project aligns with the group's long-term digital transformation goals.",
    ],
  },
  {
    title: "Supply Chain Management Engineer",
    company: "Addi & Evie Pageant Rentals",
    url: "https://www.aepageantrentals.com/",
    period: "Oct 2025 – Aug 2026",
    location: "Remote, Tennessee, US",
    accent: "green",
    icon: "Briefcase",
    current: false,
    bullets: [
      "Oversee end-to-end inventory operations, including stock tracking, transfers, and logistics coordination for efficient order fulfillment.",
      "Maintain accurate real-time inventory records and optimize stock levels to prevent shortages and overstock.",
      "Implement systematic labeling and categorization for enhanced traceability and reduced errors.",
      "Collaborate with teams to streamline material flow and support data-driven forecasting and reporting.",
    ],
  },
  {
    title: "Web Developer (Independent Contractor)",
    company: "SINIM Bridge Corp.",
    url: null,
    period: "Aug 2025 – Nov 2025",
    location: null,
    accent: "cyan",
    icon: "Code2",
    current: false,
    bullets: [
      "Developing, maintaining, and publishing SINIM Bridge's official website, digital platforms, and web applications, ensuring high performance, accessibility, and responsiveness across all devices.",
      "Collaborating with HR and recruitment teams to design and manage career pages and job listings, supporting global hiring operations through optimized workflows and automated postings.",
      "Enhancing company branding and digital presence by ensuring all content, visuals, and communication assets remain accurate, updated, and aligned with organizational goals.",
    ],
  },
  {
    title: "Freelance Full-Stack Developer",
    company: "Prasanta Kar Institute",
    url: "https://www.prasantakarinstitute.com/",
    period: "Sep 2025 – Oct 2025",
    location: null,
    accent: "blue",
    icon: "Briefcase",
    current: false,
    bullets: [
      "Developed the entire platform from scratch, including frontend, backend, database, and deployment — delivering a fully responsive LMS + e-commerce + e-book store with seamless user experience across all devices.",
      "Developed admin and manager panels with real-time monitoring, analytics dashboards, and content management, enabling efficient control over courses, orders, users, and payments.",
      "Integrated Razorpay payment gateway, automated course enrollment, order management, and live tracking systems while ensuring secure, scalable, and high-performing architecture with 99.9% uptime.",
    ],
  },
  {
    title: "Full-Stack Developer",
    company: "Shashwat Technologies",
    url: "https://stayzaa.com/",
    period: "Sep 2025 – Sep 2025",
    location: null,
    accent: "purple",
    icon: "Code2",
    current: false,
    bullets: [
      "Built and optimized Stayzaa's frontend and backend, designing the About page and improving Mapbox GL globe rendering efficiency by 30%, boosting page performance and load times.",
      "Delivered 100% scalable and maintainable code, ensuring design consistency, responsive UI, and a smooth user experience across desktop and mobile platforms.",
      "Collaborated with core team to ship new features, resolve 90% of critical bugs, and deliver releases on time with a focus on quality and ownership.",
    ],
  },
  {
    title: "Full-Stack Software Development Engineer Intern",
    company: "RiseApply",
    url: "https://riseapply.netlify.app/",
    period: "Apr 2025 – Sep 2025",
    location: null,
    accent: "cyan",
    icon: "Rocket",
    current: false,
    bullets: [
      "Led the automation of manual workflows, boosting operational efficiency by 90%.",
      "Built and scaled recruitment tools, marketing platforms, and website builders using Next.js, Node.js, and MongoDB.",
      "Developed and maintained scrapers, website, databases, and a browser extension for automated job data extraction.",
    ],
  },
  {
    title: "Software Development Engineer",
    company: "Echo of Pink",
    url: "https://www.echoofpink.com/",
    period: "Aug 2025 – Sep 2025",
    location: null,
    accent: "pink",
    icon: "Globe",
    current: false,
    bullets: [
      "Led the design, development, and optimization of Echo of Pink's e-commerce platform on Shopify, delivering a modern, fully responsive, and conversion-focused shopping experience.",
      "Built custom Shopify themes, automated workflows, and API integrations for products, orders, and payments — improving checkout efficiency and boosting conversion rates by 20%.",
      "Continuously enhanced site performance, implemented data-driven UX improvements, and collaborated with stakeholders to launch new features that increased customer engagement and online sales.",
    ],
  },
  {
    title: "Data Engineer",
    company: "TaxDeeds",
    url: null,
    period: "Jan 2025 – Aug 2025",
    location: null,
    accent: "emerald",
    icon: "BarChart3",
    current: false,
    bullets: [
      "Managed project timelines, reducing delivery times by 30%.",
      "Spearheaded the adoption of cutting-edge engineering software, improving project accuracy by 15%.",
      "Collaborated with cross-functional teams, enhancing project success rates by 10%.",
    ],
  },
  {
    title: "Freelance Full-Stack Developer",
    company: "Consult Easily",
    url: "https://consulteasily.com",
    period: "Mar 2025 – Apr 2025",
    location: null,
    accent: "orange",
    icon: "Globe",
    current: false,
    bullets: [
      "Built the entire website from scratch, including responsive UI and seamless user experience.",
      "Developed robust APIs and set up a scalable backend with secure database integration.",
      "Handled full-stack development end-to-end, including deployment and performance optimization.",
    ],
  },
];
