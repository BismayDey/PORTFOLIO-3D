"use client";

import { useEffect, useRef, useState } from "react";
import {
  Brain,
  CalendarDays,
  Loader2,
  Code2,
  Rocket,
  Gamepad2,
  SquareCode,
  Mail,
  Users,
  Github,
  Linkedin,
  Instagram,
  Award,
  ExternalLink,
  FileText,
  FileDown,
  X,
  Calendar,
  MapPin,
  Zap,
  Target,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Trophy,
  Star,
  Server,
  Lock,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  clientProjects,
  featuredClientProjects,
} from "./data/clientProjects";
import { ClientProjectCard } from "./components/ClientProjectCard";
import {
  ClientProjectFilters,
  useClientProjectFilters,
} from "./components/ClientProjectFilters";
import { ContactModal } from "./components/ContactModal";
import { ServicesSection } from "./components/ServicesSection";
import { ExperienceSection } from "./components/ExperienceSection";
import { Hero } from "./components/Hero";
import { IntroOverlay } from "./components/IntroOverlay";
import { ChatWidget } from "./components/ChatWidget";
import { Background3D } from "./components/Background3D";
import { BookingModal } from "./components/BookingModal";
import { track } from "./lib/analytics";
import { SITE_URL, useSeo } from "./lib/seo";

const NAV_LINKS = [
  { id: "about", label: "About" },
  { id: "services", label: "Services" },
  { id: "experience", label: "Experience" },
  { id: "client-projects", label: "Client Work" },
  { id: "projects", label: "Projects" },
  { id: "certificates", label: "Certificates" },
  { id: "contact", label: "Contact" },
];

function App() {
  const aboutRef = useRef<HTMLDivElement>(null);
  const projectsRef = useRef<HTMLDivElement>(null);
  const contactRef = useRef<HTMLDivElement>(null);
  const certificatesRef = useRef<HTMLDivElement>(null);
  const experienceRef = useRef<HTMLDivElement>(null);
  const [selectedCertificate, setSelectedCertificate] = useState<number | null>(
    null
  );
  const [isDownloading, setIsDownloading] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showAllProjects, setShowAllProjects] = useState(false);
  const [showAllClientProjects, setShowAllClientProjects] = useState(false);
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [navScrolled, setNavScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("about");
  const scrollToId = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMobileMenuOpen(false);
  };
  const clientProjectsRef = useRef<HTMLDivElement>(null);
  // introComplete removed — heading kept static inside Scene
  const [canvasEventSource, setCanvasEventSource] =
    useState<HTMLElement | null>(null);

  // Process profile image: auto-crop center square and produce a data URL
  const [processedProfile, setProcessedProfile] = useState<string | null>(null);
  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const [perView, setPerView] = useState(3);
  const TESTIMONIAL_COUNT = 13;
  const maxTestimonialIndex = Math.max(0, TESTIMONIAL_COUNT - perView);

  useEffect(() => {
    let cancelled = false;
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = "/PROFILE.png";

    img.onload = () => {
      if (cancelled) return;
      const w = img.naturalWidth;
      const h = img.naturalHeight;
      const side = Math.min(w, h);
      const sx = Math.floor((w - side) / 2);
      const sy = Math.floor((h - side) / 2);

      const canvasSize = 512;
      const canvas = document.createElement("canvas");
      canvas.width = canvasSize;
      canvas.height = canvasSize;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // Optional subtle background so round frame never shows an ugly edge
      ctx.fillStyle = "rgba(0,0,0,0)";
      ctx.fillRect(0, 0, canvasSize, canvasSize);

      // Draw the centered square crop scaled to canvas size
      ctx.drawImage(img, sx, sy, side, side, 0, 0, canvasSize, canvasSize);

      try {
        const dataUrl = canvas.toDataURL("image/jpeg", 0.92);
        setProcessedProfile(dataUrl);
      } catch {
        // If canvas is tainted or conversion fails, don't set processed profile
      }
    };

    img.onerror = () => {
      /* leave processedProfile null and browser will fallback to /profile.jpg */
    };

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const apply = () => {
      const w = window.innerWidth;
      setPerView(w >= 1024 ? 3 : w >= 768 ? 2 : 1);
    };
    apply();
    window.addEventListener("resize", apply);
    return () => window.removeEventListener("resize", apply);
  }, []);

  // never leave the track parked past the last full row
  useEffect(() => {
    setTestimonialIndex((i) => Math.min(i, maxTestimonialIndex));
  }, [maxTestimonialIndex]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTestimonialIndex((prev) =>
        prev >= maxTestimonialIndex ? 0 : prev + 1
      );
    }, 5000);
    return () => clearInterval(interval);
  }, [maxTestimonialIndex]);

  useSeo({
    title:
      "Bismay Dey — Full-Stack Developer in Kolkata | Web Apps, Shopify, AI",
    description:
      "Full-stack developer in Kolkata building web apps, e-commerce stores and AI features. 19+ client projects delivered across EdTech, HR Tech, retail and hospitality. Available for freelance and full-time work.",
    path: "/",
    jsonLd: [
      {
        "@context": "https://schema.org",
        "@type": "Person",
        name: "Bismay Dey",
        url: SITE_URL,
        image: `${SITE_URL}/PROFILE.png`,
        jobTitle: "Full-Stack Developer",
        email: "mailto:bismaydey001@gmail.com",
        address: {
          "@type": "PostalAddress",
          addressLocality: "Kolkata",
          addressCountry: "IN",
        },
        sameAs: [
          "https://github.com/BismayDey",
          "https://www.linkedin.com/in/bismay-dey-634937268/",
          "https://www.instagram.com/carbon_alternater/",
        ],
        knowsAbout: [
          "React",
          "Next.js",
          "TypeScript",
          "Node.js",
          "Firebase",
          "Shopify",
          "WordPress",
          "Three.js",
          "AI Integration",
          "DevOps",
        ],
      },
      {
        "@context": "https://schema.org",
        "@type": "ProfessionalService",
        name: "Bismay Dey — Web & App Development",
        url: SITE_URL,
        areaServed: "Worldwide",
        description:
          "Custom web apps, websites, mobile apps, Shopify and WordPress stores, AI features, chatbots and ongoing maintenance.",
        address: {
          "@type": "PostalAddress",
          addressLocality: "Kolkata",
          addressCountry: "IN",
        },
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "Development Services",
          itemListElement: [
            "Custom Web App Development",
            "Website Development",
            "Mobile App Development",
            "AI Feature Development",
            "Chatbot Development",
            "Shopify Store Development",
            "WordPress Development",
            "Webflow Development",
            "Web Game Development",
            "UI/UX & Figma Design",
            "Website Maintenance & Support",
          ].map((name) => ({
            "@type": "Offer",
            itemOffered: { "@type": "Service", name },
          })),
        },
      },
      {
        "@context": "https://schema.org",
        "@type": "ItemList",
        name: "Client Projects",
        itemListElement: clientProjects.map((p, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: p.name,
          url: `${SITE_URL}/client/${p.slug}`,
        })),
      },
    ],
  });

  useEffect(() => {
    const onScroll = () => setNavScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // highlight whichever section owns the middle of the viewport
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        const hit = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (hit) setActiveSection(hit.target.id);
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: [0, 0.25, 0.5, 1] }
    );
    NAV_LINKS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, []);

  // Deep links from the case-study pages arrive as /#contact
  useEffect(() => {
    if (window.location.hash !== "#contact") return;
    const t = setTimeout(
      () => contactRef.current?.scrollIntoView({ behavior: "smooth" }),
      300
    );
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    setCanvasEventSource(document.body);

    return () => {
      setCanvasEventSource(null);
    };
  }, []);

  const certificates = [
    {
      id: 1,
      title: "Iemhacks 3.0 Hackathon",
      issuer: "Iemhacks 3.0",
      date: "2025",
      description:
        "Participated and showcased innovative solutions in one of the most prestigious hackathons.",
      image: "/certificates/IEM.jpg",
      imageSizes: {
        thumbnail: "/certificates/IEM.jpg",
        full: "/certificates/IEM.jpg",
      },
      color: "from-blue-500 to-cyan-500",
    },
    {
      id: 2,
      title: "SIH-Smart India Hackathon",
      issuer: "IIC",
      date: "2024",
      description:
        "Competed in India's biggest hackathon, solving real-world problems with innovative tech solutions.",
      image: "/certificates/SIH.jpg",
      imageSizes: {
        thumbnail: "/certificates/SIH.jpg",
        full: "/certificates/SIH.jpg",
      },
      color: "from-purple-500 to-pink-500",
    },
    {
      id: 3,
      title: "HackHazards Hackathon",
      issuer: "HackHazards",
      date: "2024",
      description:
        "Developed creative solutions addressing critical challenges in a competitive hackathon environment.",
      image: "/certificates/Hackhazards.jpeg",
      imageSizes: {
        thumbnail: "/certificates/Hackhazards.jpeg",
        full: "/certificates/Hackhazards.jpeg",
      },
      color: "from-orange-500 to-red-500",
    },
    {
      id: 4,
      title: "RiseApply Internship Certificate",
      issuer: "RiseApply",
      date: "2024",
      description:
        "Successfully completed full-stack software development internship, contributing to real-world projects.",
      image: "/certificates/Riseapply.pdf",
      imageSizes: {
        thumbnail: "/certificates/Riseapply.pdf",
        full: "/certificates/Riseapply.pdf",
      },
      color: "from-emerald-500 to-teal-500",
      isPdf: true,
    },
  ];

  const handleDownloadResume = () => {
    setIsDownloading(true);

    setTimeout(() => {
      const link = document.createElement("a");
      link.href = "/BISMAY DEY.pdf";
      link.download = "bismay-dey-resume.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setTimeout(() => {
        setIsDownloading(false);
      }, 1000);
    }, 800);
  };


  const allProjects = [
    {
      title: "Health Track",
      description:
        "Health Track is an AI-powered wellness app that offers health monitoring, AI diagnostics, mental health support, emergency assistance, and personalized recommendations. With real-time insights and a smart entertainment recommender, it provides a seamless and data-driven approach to well-being.",
      image: "/projects/health-track.jpg",
      github: "https://github.com/BismayDey/HEALTH-TRACK",
      demo: "https://health-track-theta.vercel.app/",
      tags: ["AI", "Healthcare", "Next.js"],
    },
      {
      title: "BLACKSTREAM",
      description:
        "BLACKSTREAM is a modern streaming platform offering a diverse selection of movies, TV shows, and original content. Enjoy ad-free streaming, exclusive releases, and offline downloads—all in one place.",
      image: "/projects/blackstream.jpg",
      github: "https://github.com/BismayDey/BLACKSTREAM",
      demo: "https://blackstream-one.vercel.app/",
      tags: ["Streaming", "Media", "React"],
    },
    {
      title: "E-Commerce Platform",
      description:
        "A modern e-commerce platform built with Next.js and TypeScript, designed for speed, scalability, and a seamless shopping experience. It features a dynamic product listing, an optimized cart system, and a responsive UI with dark mode support.",
      image: "/projects/ecommerce-platform.jpg",
      github: "https://github.com/BismayDey/ECOM-SIE",
      demo: "https://ecom4-0.vercel.app/",
      tags: ["E-Commerce", "Next.js", "TypeScript"],
    },
    {
      title: "MindTrack",
      description:
        "MindTrack is a comprehensive mental health platform designed to empower users in understanding and improving their emotional well-being. It offers personalized mood tracking, secure journaling, and treatment monitoring tools.",
      image: "/projects/mindtrack.jpg",
      github: "https://github.com/BismayDey/MindTrack",
      demo: "https://mind-rosy.vercel.app/",
      tags: ["Mental Health", "Tracking", "React"],
    },
    {
      title: "RAGE EFFECT",
      description:
        "RAGE EFFECT is a cross-platform FPS/TPS game delivering intense tactical combat, dynamic battlefields, and multiple game modes like Deathmatch and Rage Royale. Experience high-quality graphics and seamless cross-play on PC and mobile.",
      image: "/projects/rage-effect.jpg",
      github: "https://github.com/BismayDey/RAGE-EFFECT",
      demo: "https://rage-effect-six.vercel.app/",
      tags: ["Gaming", "3D", "WebGL"],
    },
    {
      title: "Chatting Room",
      description:
        "Simple and intuitive real-time chatting platform built with Next.js and TypeScript. It enables seamless communication with live messaging, user avatars, and a clean UI, making conversations effortless and engaging.",
      image: "/projects/chatting-room.jpg",
      github: "https://github.com/BismayDey/chat",
      demo: "https://chat-git-master-bismay-deys-projects.vercel.app/",
      tags: ["Real-time", "Chat", "WebSocket"],
    },
    {
      title: "Shadow Nexus",
      description:
        "Shadow Nexus is a sleek gaming hub offering a curated library of top-rated titles across genres. Discover, download, and play standout games like Shadow Protocol and Neon Drift—all in one immersive platform.",
      image: "/projects/shadow-nexus.jpg",
      github: "https://github.com/BismayDey/ShadowNexus",
      demo: "https://shadownexus.vercel.app/",
      tags: ["Gaming", "Platform", "Next.js"],
    },

    {
      title: "Let's Draw",
      description:
        "Let's Draw is a real-time collaborative drawing app built with JavaScript and WebSockets. It allows multiple users to sketch together on a shared canvas, making it perfect for creative collaboration, brainstorming, or just having fun with friends online.",
      image: "/projects/lets-draw.jpg",
      github: "https://github.com/BismayDey/Lets-draw",
      demo: "https://lets-draw.vercel.app/",
      tags: ["Collaborative", "Canvas", "WebSocket"],
    },
    {
      title: "PokéServer",
      description:
        "PokéServer is a dynamic Pokémon battle simulator that allows users to engage in real-time battles using their favorite Pokémon. With an intuitive interface and seamless gameplay, it offers an immersive experience for Pokémon enthusiasts.",
      image: "/projects/pokeserver.jpg",
      github: "https://github.com/BismayDey/PokeServer",
      demo: "https://pokeserver-beta.vercel.app/",
      tags: ["Gaming", "Pokemon", "Simulator"],
    },
    {
      title: "VALORANT AGENTS",
      description:
        "VALORANT AGENTS is a sleek web application showcasing detailed profiles of all VALORANT agents. Explore each agent's abilities, roles, and backgrounds in an interactive and user-friendly interface.",
      image: "/projects/valorant-agents.jpg",
      github: "https://github.com/BismayDey/valorant",
      demo: "https://valorant-chi-blue.vercel.app/",
      tags: ["Gaming", "API", "React"],
    },
    {
      title: "PaisaOP",
      description:
        "PaisaOP simplifies UPI payments by generating instant QR codes and shareable links. Ideal for creators and small businesses, it enables quick, secure, and hassle-free transactions without any coding.",
      image: "/projects/paisaop.jpg",
      github: "https://github.com/BismayDey/PaisaOP",
      demo: "https://upi-ashen.vercel.app/",
      tags: ["Payments", "UPI", "FinTech"],
    },
    {
      title: "Ask Bro",
      description:
        "Ask Bro is a community-driven Q&A platform where users can ask questions and share knowledge. Built with React, Next.js, TypeScript, and Firebase, it offers a seamless experience for learning and collaboration.",
      image: "/projects/ask-bro.jpg",
      github: "https://github.com/BismayDey/AskBro",
      demo: "https://ask-bro.vercel.app/",
      tags: ["Community", "Q&A", "Firebase"],
    },
    {
      title: "Operating System",
      description:
        "Futuristic web-based operating system built using Next.js, designed to simulate a real OS experience within the browser. It features a dynamic multi-window system, draggable apps, a taskbar, and a responsive UI.",
      image: "/projects/operating-system.jpg",
      github: "https://github.com/BismayDey/OS",
      demo: "https://os-swart.vercel.app/",
      tags: ["OS", "Simulation", "Next.js"],
    },
    {
      title: "Freelancing Site",
      description:
        "Modern freelancing platform built using Next.js and TypeScript, designed to connect clients with talented freelancers efficiently. The platform offers a seamless job posting system, real-time chat, secure payments, and a user-friendly dashboard.",
      image: "/projects/freelancing-site.jpg",
      github: "https://github.com/BismayDey/Freelancing-Site",
      demo: "https://sjsz9bxxkvpge6q4.vercel.app/",
      tags: ["Freelancing", "Platform", "TypeScript"],
    },
    {
      title: "Code Generator",
      description:
        "Powerful web-based code generator and editor built with Next.js and TypeScript, offering a seamless coding experience in the browser. It supports multiple programming languages, syntax highlighting, and real-time editing.",
      image: "/projects/code-generator.jpg",
      github: "https://github.com/BismayDey/codegen",
      demo: "https://codegen-rose.vercel.app/",
      tags: ["Code Editor", "Generator", "TypeScript"],
    },
    {
      title: "3D Solar System",
      description: "3D solar system made using Next.js and three.js",
      image: "/projects/solar-system.jpg",
      github: "https://github.com/BismayDey/solar",
      demo: "https://solar-lovat-rho.vercel.app/",
      tags: ["3D", "Three.js", "Space"],
    },
    {
      title: "News Website",
      description:
        "Fast and dynamic news website built with Next.js and TypeScript, offering real-time updates, category-based filtering, and a seamless reading experience. Leveraging SSR and SSG for high performance and SEO optimization.",
      image: "/projects/news-website.jpg",
      github: "https://github.com/BismayDey/News",
      demo: "https://v0-spotify-y0hzcsy2n9f-9af5zg.vercel.app/",
      tags: ["News", "Media", "Next.js"],
    },
    {
      title: "FREEZZZ",
      description:
        "FREEZZZ is a modern freelancing platform built using Next.js and TypeScript, designed to seamlessly connect freelancers with clients. It provides an intuitive user experience with job postings, real-time chat, secure payments, and profile management.",
      image:
        "https://i.postimg.cc/2SfKKFc9/fc3534cb-64c2-46f2-bbda-73701c0cf749.webp",
      github: "https://bismaydey.github.io/FREEZZZ/",
      demo: "https://bismaydey.github.io/FREEZZZ/",
      tags: ["Freelancing", "Platform", "Next.js"],
    },
    {
      title: "Advanced Math Solver",
      description:
        "Advanced Math Solver is a comprehensive tool offering calculators, graphing capabilities, unit conversions, formula references, and quizzes to enhance mathematical learning and problem-solving.",
      image: "/projects/math-solver.jpg",
      github: "https://github.com/BismayDey/maths",
      demo: "https://maths-five.vercel.app/",
      tags: ["Education", "Math", "Tools"],
    },
    {
      title: "Spotify Clone",
      description:
        "KAALO GAAN is a minimalist music player that allows users to search, play, and manage their favorite tracks seamlessly. With a clean interface and intuitive controls, it offers a smooth listening experience.",
      image: "/projects/spotify-clone.jpg",
      github: "https://github.com/BismayDey/music-player",
      demo: "https://music-player-zeta-pearl.vercel.app/",
      tags: ["Music", "Streaming", "React"],
    },
  ];

  const filters = useClientProjectFilters(clientProjects);
  // When a filter is on, show every match. Otherwise keep the featured 9 until
  // "Read More" is pressed.
  const visibleClientProjects = filters.active
    ? filters.filtered
    : showAllClientProjects
      ? clientProjects
      : featuredClientProjects;

  const displayedProjects = showAllProjects
    ? allProjects
    : allProjects.slice(0, 6);

  return (
    <div className="relative w-full min-h-screen bg-black overflow-x-hidden">
      {/* 3D Background — lazy, idle-mounted, skipped on reduced-motion/low-end */}
      <Background3D eventSource={canvasEventSource} />

      {/* Navigation */}
      <motion.div
        initial={{ y: -24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 180, damping: 24 }}
        className="fixed top-0 left-0 right-0 px-4 md:px-6 z-50"
      >
        <nav
          className={`max-w-7xl mx-auto flex justify-between items-center text-white rounded-full border transition-all duration-300 ${
            navScrolled
              ? "bg-black/80 backdrop-blur-xl border-white/15 shadow-2xl shadow-black/50 mt-2 px-5 md:px-6 py-2.5 md:py-3"
              : "bg-black/30 backdrop-blur-md border-white/10 mt-4 px-6 md:px-8 py-3 md:py-4"
          }`}
        >
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="relative flex items-center gap-3 group"
            aria-label="Back to top"
          >
            <span
              className={`font-black uppercase tracking-wide bg-gradient-to-r from-purple-300 via-pink-400 to-rose-400 bg-clip-text text-transparent drop-shadow-[0_0_18px_rgba(244,114,182,0.45)] transition-all duration-300 ${
                navScrolled ? "text-xl md:text-2xl" : "text-2xl md:text-3xl"
              }`}
            >
              Bismay Dey
            </span>
          </button>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map((link) => {
              const active = activeSection === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => scrollToId(link.id)}
                  aria-current={active ? "true" : undefined}
                  className={`relative px-3.5 py-2 rounded-full text-sm font-medium transition-colors ${
                    active
                      ? "text-purple-200"
                      : "text-gray-300 hover:text-purple-300"
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId="nav-pill"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      className="absolute inset-0 rounded-full bg-purple-500/20 border border-purple-400/40"
                    />
                  )}
                  <span className="relative z-10">{link.label}</span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setBookingOpen(true);
                track("cta_click", { where: "navbar" });
              }}
              className="hidden sm:inline-flex items-center gap-2 px-4 md:px-5 py-2 md:py-2.5 rounded-full bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white text-sm font-semibold shadow-lg shadow-purple-500/25 hover:shadow-purple-500/45 hover:brightness-110 transition-all"
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75 animate-ping" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-green-400" />
              </span>
              Let's Talk
            </motion.button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2"
              aria-label="Toggle menu"
              aria-expanded={mobileMenuOpen}
            >
              <div className="w-6 h-5 flex flex-col justify-between">
                <span
                  className={`w-full h-0.5 bg-white transition-all ${
                    mobileMenuOpen ? "rotate-45 translate-y-2" : ""
                  }`}
                />
                <span
                  className={`w-full h-0.5 bg-white transition-all ${
                    mobileMenuOpen ? "opacity-0" : ""
                  }`}
                />
                <span
                  className={`w-full h-0.5 bg-white transition-all ${
                    mobileMenuOpen ? "-rotate-45 -translate-y-2" : ""
                  }`}
                />
              </div>
            </button>
          </div>
        </nav>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              className="lg:hidden mt-3 backdrop-blur-xl bg-black/85 rounded-3xl p-4 border border-white/15 shadow-2xl shadow-black/60"
            >
              <div className="flex flex-col text-white">
                {NAV_LINKS.map((link, i) => (
                  <motion.button
                    key={link.id}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                    onClick={() => scrollToId(link.id)}
                    className={`text-left px-4 py-3 rounded-2xl font-medium transition-colors ${
                      activeSection === link.id
                        ? "bg-purple-500/20 text-purple-200 border border-purple-400/30"
                        : "text-gray-300 hover:bg-white/5 hover:text-purple-300"
                    }`}
                  >
                    {link.label}
                  </motion.button>
                ))}
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setBookingOpen(true);
                    track("cta_click", { where: "mobile-menu" });
                  }}
                  className="mt-3 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white font-semibold shadow-lg shadow-purple-500/25"
                >
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75 animate-ping" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-green-400" />
                  </span>
                  Let's Talk
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Main Content */}
      <div className="relative z-10">
        <Hero
          onTalk={() => {
            setBookingOpen(true);
            track("cta_click", { where: "hero" });
          }}
          onSeeWork={() =>
            clientProjectsRef.current?.scrollIntoView({ behavior: "smooth" })
          }
        />

        {/* About Section - Bento Grid Layout */}
        <div
          ref={aboutRef}
          id="about"
          className="min-h-screen bg-gradient-to-b from-black via-purple-900/10 to-black px-4 md:px-8 py-16 md:py-24"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative z-10 max-w-7xl mx-auto text-white"
          >
            <motion.h2
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl lg:text-5xl font-bold mb-8 md:mb-12 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"
            >
              About Me
            </motion.h2>

            {/* Bento Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {/* Main Bio - Spans 2 columns */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="lg:col-span-2 bg-gradient-to-br from-purple-900/30 to-pink-900/30 p-8 md:p-10 rounded-3xl backdrop-blur-sm border border-white/10 h-full flex flex-col justify-center"
              >
                <div className="flex flex-col items-center text-center gap-4">
                  {/* Profile Image - Optimized for 771x1024 portrait image */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2, type: "spring" }}
                    className="relative group mb-6"
                  >
                    {/* Main portrait container - reduced height, image maintains scale */}
                    <div className="relative w-60 h-64 md:w-72 md:h-80 lg:w-80 lg:h-[22rem] rounded-3xl overflow-hidden border-4 border-purple-500/50 shadow-2xl shadow-purple-500/30 group-hover:border-pink-500/50 group-hover:shadow-pink-500/40 transition-all duration-500 bg-gradient-to-br from-purple-900/20 to-pink-900/20">
                      <img
                        src={processedProfile ?? "/PROFILE.png"}
                        srcSet={`${processedProfile ?? "/PROFILE.png"} 1x, ${
                          processedProfile ?? "/PROFILE.png"
                        } 2x`}
                        alt="Bismay Dey"
                        className="w-full h-full object-cover object-top transition-all duration-700 group-hover:scale-[1.02]"
                        onError={(e) => {
                          e.currentTarget.src = `https://ui-avatars.com/api/?name=Bismay+Dey&size=400&background=9333ea&color=fff&bold=true`;
                        }}
                        loading="lazy"
                      />
                      {/* Gradient overlay on hover */}
                      <div className="absolute inset-0 bg-gradient-to-t from-purple-900/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </div>

                    {/* Decorative elements */}
                    <div className="absolute inset-0 rounded-3xl border-2 border-purple-400/40 animate-pulse opacity-0 group-hover:opacity-60 transition-opacity duration-500" />
                    <div className="absolute -inset-3 rounded-3xl border border-pink-500/30 opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-sm" />

                    {/* Glowing corner accents */}
                    <div className="absolute -top-1 -right-1 w-8 h-8 bg-purple-500/50 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="absolute -bottom-1 -left-1 w-8 h-8 bg-pink-500/50 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </motion.div>

                  {/* Name */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 }}
                  >
                    <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-1 bg-gradient-to-r from-purple-400 via-pink-400 to-rose-400 bg-clip-text text-transparent">
                      Bismay Dey
                    </h3>

                    {/* Title with Icon */}
                    <div className="flex items-center justify-center gap-3 mb-2">
                      <div className="p-2 bg-purple-500/20 rounded-lg hidden">
                        <Code2 className="w-5 h-5 md:w-6 md:h-6 text-purple-400 hidden md:block" />
                      </div>
                      <p className="text-xl md:text-2xl text-purple-300 font-semibold">
                        Full Stack Developer & AI/ML Engineer
                      </p>
                    </div>
                  </motion.div>

                  {/* Description */}
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 }}
                    className="text-base md:text-lg text-gray-300 leading-relaxed max-w-3xl"
                  >
                    I’m a results-driven Full Stack Developer and AI/ML
                    Engineer, passionate about building intelligent, end-to-end
                    web solutions that blend smart technology with seamless user
                    experience. With expertise in React, Next.js, Node.js,
                    Python, and machine learning frameworks, I develop scalable
                    applications that are both dynamic and data-driven. I thrive
                    on solving real-world problems, exploring cutting-edge
                    tools, and pushing the boundaries of what tech can do.
                  </motion.p>

                  {/* Quick Highlights */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 }}
                    className="flex flex-wrap items-center justify-center gap-4 mt-4"
                  >
                    <div className="flex items-center gap-2 px-4 py-2 bg-purple-500/20 rounded-full border border-purple-500/30">
                      <Zap className="w-4 h-4 text-purple-400" />
                      <span className="text-sm font-medium">
                        Full Stack Developer
                      </span>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 bg-pink-500/20 rounded-full border border-pink-500/30">
                      <Rocket className="w-4 h-4 text-pink-400" />
                      <span className="text-sm font-medium">
                        UI/UX Enthusiast
                      </span>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 bg-rose-500/20 rounded-full border border-rose-500/30">
                      <Brain className="w-4 h-4 text-rose-400" />
                      <span className="text-sm font-medium">
                        Problem Solver
                      </span>
                    </div>
                  </motion.div>
                </div>
              </motion.div>

              {/* Quick Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="bg-gradient-to-br from-blue-900/30 to-cyan-900/30 p-6 md:p-8 rounded-3xl backdrop-blur-sm border border-white/10"
              >
                <Target className="w-8 h-8 md:w-10 md:h-10 text-blue-400 mb-4" />
                <h3 className="text-2xl md:text-3xl font-bold mb-2">100+</h3>
                <p className="text-sm md:text-base text-gray-300">
                  Projects Completed
                </p>
                <div className="mt-4 pt-4 border-t border-white/10">
                  <h3 className="text-2xl md:text-3xl font-bold mb-2">4+</h3>
                  <p className="text-sm md:text-base text-gray-300">
                    Years Experience
                  </p>
                </div>
                <div className="mt-4 pt-4 border-t border-white/10">
                  <h3 className="text-2xl md:text-3xl font-bold mb-2">8+</h3>
                  <p className="text-sm md:text-base text-gray-300">
                    Intership Completed
                  </p>
                </div>
                <div className="mt-4 pt-4 border-t border-white/10">
                  <h3 className="text-2xl md:text-3xl font-bold mb-2">30+</h3>
                  <p className="text-sm md:text-base text-gray-300">
                    Freelance Projects Delivered
                  </p>
                </div>
                <div className="mt-4 pt-4 border-t border-white/10">
                  <h3 className="text-2xl md:text-3xl font-bold mb-2">20+</h3>
                  <p className="text-sm md:text-base text-gray-300">
                    End-to-End Product Launches
                  </p>
                </div>
                                <div className="mt-4 pt-4 border-t border-white/10">
                  <h3 className="text-2xl md:text-3xl font-bold mb-2">10+</h3>
                  <p className="text-sm md:text-base text-gray-300">
                    Part-Time jobs Completed
                  </p>
                </div>
                                <div className="mt-4 pt-4 border-t border-white/10">
                  <h3 className="text-2xl md:text-3xl font-bold mb-2">100+</h3>
                  <p className="text-sm md:text-base text-gray-300">
                    End-to-End Product Launches
                  </p>
                </div>
              </motion.div>

              {/* Frontend Skills */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="bg-gradient-to-br from-pink-900/30 to-rose-900/30 p-6 md:p-8 rounded-3xl backdrop-blur-sm border border-white/10"
              >
                <h3 className="text-lg md:text-xl font-bold mb-4 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-pink-400" />
                  Frontend
                </h3>
                <div className="flex flex-wrap gap-2">
                  <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-sky-500/20 text-sky-300 rounded-full text-xs md:text-sm border border-sky-500/30">
                    <img
                      src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg"
                      alt="Next.js logo"
                      loading="lazy"
                      className="w-4 h-4 md:w-5 md:h-5 object-contain filter invert"
                    />
                    Next.js
                  </span>
                  <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-500/20 text-blue-300 rounded-full text-xs md:text-sm border border-blue-500/30">
                    <img
                      src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg"
                      alt="React logo"
                      loading="lazy"
                      className="w-4 h-4 md:w-5 md:h-5 object-contain"
                    />
                    React.js
                  </span>
                  <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-red-500/20 text-red-300 rounded-full text-xs md:text-sm border border-red-500/30">
                    <img
                      src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/threejs/threejs-original.svg"
                      alt="Three.js logo"
                      loading="lazy"
                      className="w-4 h-4 md:w-5 md:h-5 object-contain filter invert"
                    />
                    Three.js
                  </span>
                  <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-500/20 text-blue-300 rounded-full text-xs md:text-sm border border-blue-500/30">
                    <img
                      src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg"
                      alt="TypeScript logo"
                      loading="lazy"
                      className="w-4 h-4 md:w-5 md:h-5 object-contain"
                    />
                    TypeScript
                  </span>
                  <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-pink-500/20 text-pink-300 rounded-full text-xs md:text-sm border border-pink-500/30">
                    <img
                      src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg"
                      alt="Tailwind CSS logo"
                      loading="lazy"
                      className="w-4 h-4 md:w-5 md:h-5 object-contain"
                    />
                    Tailwind
                  </span>
                  <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-purple-500/20 text-purple-300 rounded-full text-xs md:text-sm border border-purple-500/30">
                    <img
                      src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg"
                      alt="React Native logo"
                      loading="lazy"
                      className="w-4 h-4 md:w-5 md:h-5 object-contain"
                    />
                    React Native
                  </span>
                  <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-purple-500/20 text-purple-300 rounded-full text-xs md:text-sm border border-purple-500/30">
                    <img
                      src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg"
                      alt="HTML5 logo"
                      loading="lazy"
                      className="w-4 h-4 md:w-5 md:h-5 object-contain"
                    />
                    HTML
                  </span>
                  <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-yellow-500/20 text-yellow-300 rounded-full text-xs md:text-sm border border-yellow-500/30">
                    <img
                      src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg"
                      alt="CSS3 logo"
                      loading="lazy"
                      className="w-4 h-4 md:w-5 md:h-5 object-contain"
                    />
                    CSS
                  </span>
                  <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-purple-500/20 text-purple-300 rounded-full text-xs md:text-sm border border-purple-500/30">
                    <img
                      src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/sass/sass-original.svg"
                      alt="Sass logo"
                      loading="lazy"
                      className="w-4 h-4 md:w-5 md:h-5 object-contain"
                    />
                    Sass
                  </span>
                  <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-purple-500/20 text-purple-300 rounded-full text-xs md:text-sm border border-purple-500/30">
                    <img
                      src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/bootstrap/bootstrap-original.svg"
                      alt="Bootstrap logo"
                      loading="lazy"
                      className="w-4 h-4 md:w-5 md:h-5 object-contain"
                    />
                    Bootstrap
                  </span>
                  <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-purple-500/20 text-purple-300 rounded-full text-xs md:text-sm border border-purple-500/30">
                    <img
                      src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/jquery/jquery-original.svg"
                      alt="jQuery logo"
                      loading="lazy"
                      className="w-4 h-4 md:w-5 md:h-5 object-contain"
                    />
                    jQuery
                  </span>
                </div>
              </motion.div>

              {/* Backend Skills */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                className="bg-gradient-to-br from-green-900/30 to-emerald-900/30 p-6 md:p-8 rounded-3xl backdrop-blur-sm border border-white/10"
              >
                <h3 className="text-lg md:text-xl font-bold mb-4 flex items-center gap-2">
                  <SquareCode className="w-5 h-5 text-green-400" />
                  Backend
                </h3>
                <div className="flex flex-wrap gap-2">
                  <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-500/20 text-green-300 rounded-full text-xs md:text-sm border border-green-500/30">
                    <img
                      src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg"
                      alt="Node.js logo"
                      loading="lazy"
                      className="w-4 h-4 md:w-5 md:h-5 object-contain"
                    />
                    Node.js
                  </span>
                  <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-700/20 text-red-300 rounded-full text-xs md:text-sm border border-gray-500/30">
                    <img
                      src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg"
                      alt="Express.js logo"
                      loading="lazy"
                      className="w-4 h-4 md:w-5 md:h-5 object-contain filter invert"
                    />
                    Express.js
                  </span>
                  <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-yellow-500/20 text-yellow-300 rounded-full text-xs md:text-sm border border-yellow-500/30">
                    <img
                      src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg"
                      alt="Python logo"
                      loading="lazy"
                      className="w-4 h-4 md:w-5 md:h-5 object-contain"
                    />
                    Python
                  </span>
                  <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-red-500/20 text-red-300 rounded-full text-xs md:text-sm border border-red-500/30">
                    <img
                      src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg"
                      alt="Java logo"
                      loading="lazy"
                      className="w-4 h-4 md:w-5 md:h-5 object-contain"
                    />
                    Java
                  </span>
                  <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-indigo-500/20 text-indigo-300 rounded-full text-xs md:text-sm border border-indigo-500/30">
                    <img
                      src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/c/c-original.svg"
                      alt="C logo"
                      loading="lazy"
                      className="w-4 h-4 md:w-5 md:h-5 object-contain"
                    />
                    C
                  </span>
                  <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-indigo-500/20 text-indigo-300 rounded-full text-xs md:text-sm border border-indigo-500/30">
                    <img
                      src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg"
                      alt="C++ logo"
                      loading="lazy"
                      className="w-4 h-4 md:w-5 md:h-5 object-contain"
                    />
                    C++
                  </span>
                  <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-cyan-500/20 text-cyan-300 rounded-full text-xs md:text-sm border border-cyan-500/30">
                    <img
                      src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/go/go-original.svg"
                      alt="Go logo"
                      loading="lazy"
                      className="w-4 h-4 md:w-5 md:h-5 object-contain"
                    />
                    Go
                  </span>
                  <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-pink-500/20 text-pink-300 rounded-full text-xs md:text-sm border border-pink-500/30">
                    <img
                      src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/ruby/ruby-original.svg"
                      alt="Ruby logo"
                      loading="lazy"
                      className="w-4 h-4 md:w-5 md:h-5 object-contain"
                    />
                    Ruby
                  </span>
                  <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-purple-500/20 text-purple-300 rounded-full text-xs md:text-sm border border-purple-500/30">
                    <img
                      src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/php/php-original.svg"
                      alt="PHP logo"
                      loading="lazy"
                      className="w-4 h-4 md:w-5 md:h-5 object-contain"
                    />
                    PHP
                  </span>
                  <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-500/20 text-emerald-300 rounded-full text-xs md:text-sm border border-emerald-500/30">
                    <img
                      src="https://cdn.jsdelivr.net/npm/simple-icons@13/icons/shopify.svg"
                      alt="Shopify logo"
                      loading="lazy"
                      className="w-4 h-4 md:w-5 md:h-5 object-contain filter invert"
                    />
                    Shopify
                  </span>
                </div>
              </motion.div>

              {/* Languages */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 }}
                className="bg-gradient-to-br from-orange-900/30 to-amber-900/30 p-6 md:p-8 rounded-3xl backdrop-blur-sm border border-white/10"
              >
                <h3 className="text-lg md:text-xl font-bold mb-4 flex items-center gap-2">
                  <Brain className="w-5 h-5 text-orange-400" />
                  Database
                </h3>
                <div className="flex flex-wrap gap-2">
                  <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-500/20 text-blue-300 rounded-full text-xs md:text-sm border border-blue-500/30">
                    <img
                      src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg"
                      alt="MongoDB logo"
                      loading="lazy"
                      className="w-4 h-4 md:w-5 md:h-5 object-contain"
                    />
                    MongoDB
                  </span>
                  <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-orange-500/20 text-orange-300 rounded-full text-xs md:text-sm border border-orange-500/30">
                    <img
                      src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firebase/firebase-plain.svg"
                      alt="Firebase logo"
                      loading="lazy"
                      className="w-4 h-4 md:w-5 md:h-5 object-contain"
                    />
                    Firebase
                  </span>
                  <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-500/20 text-blue-300 rounded-full text-xs md:text-sm border border-blue-500/30">
                    <img
                      src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg"
                      alt="PostgreSQL logo"
                      loading="lazy"
                      className="w-4 h-4 md:w-5 md:h-5 object-contain"
                    />
                    PostgreSQL
                  </span>
                  <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-500/20 text-blue-300 rounded-full text-xs md:text-sm border border-blue-500/30">
                    <img
                      src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg"
                      alt="MySQL logo"
                      loading="lazy"
                      className="w-4 h-4 md:w-5 md:h-5 object-contain"
                    />
                    MySQL
                  </span>
                </div>
              </motion.div>
            </div>
            {/* DevOps Skills */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.35 }}
              className="mt-4 bg-gradient-to-br from-sky-900/30 to-slate-900/30 p-6 md:p-8 rounded-3xl backdrop-blur-sm border border-white/10"
            >
              <h3 className="text-lg md:text-xl font-bold mb-4 flex items-center gap-2">
                <Server className="w-5 h-5 text-sky-400" />
                DevOps & Cloud
              </h3>
              <div className="flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-500/20 text-blue-300 rounded-full text-xs md:text-sm border border-blue-500/30">
                  <img
                    src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg"
                    alt="Docker logo"
                    loading="lazy"
                    className="w-4 h-4 md:w-5 md:h-5 object-contain"
                  />
                  Docker
                </span>
                <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-indigo-500/20 text-indigo-300 rounded-full text-xs md:text-sm border border-indigo-500/30">
                  <img
                    src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kubernetes/kubernetes-original.svg"
                    alt="Kubernetes logo"
                    loading="lazy"
                    className="w-4 h-4 md:w-5 md:h-5 object-contain"
                  />
                  Kubernetes
                </span>
                <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-orange-500/20 text-orange-300 rounded-full text-xs md:text-sm border border-orange-500/30">
                  <img
                    src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original-wordmark.svg"
                    alt="AWS logo"
                    loading="lazy"
                    className="w-4 h-4 md:w-5 md:h-5 object-contain"
                  />
                  AWS
                </span>
                <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-sky-500/20 text-sky-300 rounded-full text-xs md:text-sm border border-sky-500/30">
                  <img
                    src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/azure/azure-original.svg"
                    alt="Microsoft Azure logo"
                    loading="lazy"
                    className="w-4 h-4 md:w-5 md:h-5 object-contain"
                  />
                  Azure
                </span>
                <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-400/20 text-blue-200 rounded-full text-xs md:text-sm border border-blue-400/30">
                  <img
                    src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/googlecloud/googlecloud-original.svg"
                    alt="Google Cloud logo"
                    loading="lazy"
                    className="w-4 h-4 md:w-5 md:h-5 object-contain"
                  />
                  Google Cloud
                </span>
                <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-600/20 text-gray-200 rounded-full text-xs md:text-sm border border-gray-500/30">
                  <img
                    src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/githubactions/githubactions-original.svg"
                    alt="GitHub Actions logo"
                    loading="lazy"
                    className="w-4 h-4 md:w-5 md:h-5 object-contain"
                  />
                  GitHub Actions
                </span>
                <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-red-500/20 text-red-300 rounded-full text-xs md:text-sm border border-red-500/30">
                  <img
                    src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/jenkins/jenkins-original.svg"
                    alt="Jenkins logo"
                    loading="lazy"
                    className="w-4 h-4 md:w-5 md:h-5 object-contain"
                  />
                  Jenkins
                </span>
                <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-purple-500/20 text-purple-300 rounded-full text-xs md:text-sm border border-purple-500/30">
                  <img
                    src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/terraform/terraform-original.svg"
                    alt="Terraform logo"
                    loading="lazy"
                    className="w-4 h-4 md:w-5 md:h-5 object-contain"
                  />
                  Terraform
                </span>
                <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-700/20 text-gray-200 rounded-full text-xs md:text-sm border border-gray-500/30">
                  <img
                    src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/ansible/ansible-original.svg"
                    alt="Ansible logo"
                    loading="lazy"
                    className="w-4 h-4 md:w-5 md:h-5 object-contain filter invert"
                  />
                  Ansible
                </span>
                <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-500/20 text-green-300 rounded-full text-xs md:text-sm border border-green-500/30">
                  <img
                    src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nginx/nginx-original.svg"
                    alt="Nginx logo"
                    loading="lazy"
                    className="w-4 h-4 md:w-5 md:h-5 object-contain"
                  />
                  Nginx
                </span>
                <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-yellow-500/20 text-yellow-300 rounded-full text-xs md:text-sm border border-yellow-500/30">
                  <img
                    src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linux/linux-original.svg"
                    alt="Linux logo"
                    loading="lazy"
                    className="w-4 h-4 md:w-5 md:h-5 object-contain"
                  />
                  Linux
                </span>
                <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-600/20 text-slate-200 rounded-full text-xs md:text-sm border border-slate-500/30">
                  <img
                    src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/bash/bash-original.svg"
                    alt="Bash logo"
                    loading="lazy"
                    className="w-4 h-4 md:w-5 md:h-5 object-contain filter invert"
                  />
                  Bash
                </span>
                <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-orange-600/20 text-orange-300 rounded-full text-xs md:text-sm border border-orange-600/30">
                  <img
                    src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg"
                    alt="Git logo"
                    loading="lazy"
                    className="w-4 h-4 md:w-5 md:h-5 object-contain"
                  />
                  Git
                </span>
                <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-800/30 text-gray-100 rounded-full text-xs md:text-sm border border-gray-500/30">
                  <img
                    src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vercel/vercel-original.svg"
                    alt="Vercel logo"
                    loading="lazy"
                    className="w-4 h-4 md:w-5 md:h-5 object-contain filter invert"
                  />
                  Vercel
                </span>
                <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-orange-500/20 text-orange-300 rounded-full text-xs md:text-sm border border-orange-500/30">
                  <img
                    src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/grafana/grafana-original.svg"
                    alt="Grafana logo"
                    loading="lazy"
                    className="w-4 h-4 md:w-5 md:h-5 object-contain"
                  />
                  Grafana
                </span>
                <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-red-600/20 text-red-300 rounded-full text-xs md:text-sm border border-red-600/30">
                  <img
                    src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/prometheus/prometheus-original.svg"
                    alt="Prometheus logo"
                    loading="lazy"
                    className="w-4 h-4 md:w-5 md:h-5 object-contain"
                  />
                  Prometheus
                </span>
              </div>
            </motion.div>

            {/* additional Skills */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="mt-4 bg-gradient-to-br from-green-900/30 to-emerald-900/30 p-6 md:p-8 rounded-3xl backdrop-blur-sm border border-white/10"
            >
              <h3 className="text-lg md:text-xl font-bold mb-4 flex items-center gap-2">
                <Brain className="w-5 h-5 text-green-400" />
                Additional Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-sky-500/20 text-sky-300 rounded-full text-xs md:text-sm border border-sky-500/30">
                  <img
                    src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/wordpress/wordpress-original.svg"
                    alt="WordPress logo"
                    loading="lazy"
                    className="w-4 h-4 md:w-5 md:h-5 object-contain"
                  />
                  WordPress
                </span>
                <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-500/20 text-emerald-300 rounded-full text-xs md:text-sm border border-emerald-500/30">
                  <img
                    src="https://cdn.jsdelivr.net/npm/simple-icons@13/icons/shopify.svg"
                    alt="Shopify logo"
                    loading="lazy"
                    className="w-4 h-4 md:w-5 md:h-5 object-contain filter invert"
                  />
                  Shopify
                </span>
                <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-pink-500/20 text-pink-300 rounded-full text-xs md:text-sm border border-pink-500/30">
                  <img
                    src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg"
                    alt="Figma logo"
                    loading="lazy"
                    className="w-4 h-4 md:w-5 md:h-5 object-contain"
                  />
                  Figma
                </span>
                <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-yellow-500/20 text-yellow-300 rounded-full text-xs md:text-sm border border-yellow-500/30">
                  <img
                    src="https://cdn.jsdelivr.net/npm/simple-icons@13/icons/wix.svg"
                    alt="Wix logo"
                    loading="lazy"
                    className="w-4 h-4 md:w-5 md:h-5 object-contain filter invert"
                  />
                  Wix
                </span>
                <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-500/20 text-gray-300 rounded-full text-xs md:text-sm border border-gray-500/30">
                  <img
                    src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/photoshop/photoshop-plain.svg"
                    alt="Adobe logo"
                    loading="lazy"
                    className="w-4 h-4 md:w-5 md:h-5 object-contain"
                  />
                  Adobe
                </span>
                <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-fuchsia-500/20 text-fuchsia-300 rounded-full text-xs md:text-sm border border-fuchsia-500/30">
                  <img
                    src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/canva/canva-original.svg"
                    alt="Canva logo"
                    loading="lazy"
                    className="w-4 h-4 md:w-5 md:h-5 object-contain"
                  />
                  Canva
                </span>
                <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-indigo-500/20 text-indigo-300 rounded-full text-xs md:text-sm border border-indigo-500/30">
                  <img
                    src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/unity/unity-original.svg"
                    alt="Unity logo"
                    loading="lazy"
                    className="w-4 h-4 md:w-5 md:h-5 object-contain filter invert"
                  />
                  Unity
                </span>
                <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-700/20 text-blue-400 rounded-full text-xs md:text-sm border border-blue-700/30">
                  <img
                    src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/unrealengine/unrealengine-original.svg"
                    alt="Unreal Engine logo"
                    loading="lazy"
                    className="w-4 h-4 md:w-5 md:h-5 object-contain filter invert"
                  />
                  Unreal Engine
                </span>
                <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-red-600/20 text-red-400 rounded-full text-xs md:text-sm border border-red-600/30">
                  <img
                    src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/blender/blender-original.svg"
                    alt="Blender logo"
                    loading="lazy"
                    className="w-4 h-4 md:w-5 md:h-5 object-contain"
                  />
                  Blender
                </span>
                <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-purple-600/20 text-purple-400 rounded-full text-xs md:text-sm border border-purple-600/30">
                  <img
                    src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/aftereffects/aftereffects-original.svg"
                    alt="After Effects logo"
                    loading="lazy"
                    className="w-4 h-4 md:w-5 md:h-5 object-contain"
                  />
                  After Effects
                </span>
                <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-orange-500/20 text-orange-300 rounded-full text-xs md:text-sm border border-orange-500/30">
                  <img
                    src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/premierepro/premierepro-original.svg"
                    alt="Premiere Pro logo"
                    loading="lazy"
                    className="w-4 h-4 md:w-5 md:h-5 object-contain"
                  />
                  Premiere Pro
                </span>
              </div>
            </motion.div>
          </motion.div>
        </div>

        <ServicesSection
          onEnquire={() => {
            setBookingOpen(true);
            track("cta_click", { where: "services" });
          }}
        />

        <ExperienceSection ref={experienceRef} />

        {/* Client Projects Section - Enhanced */}
        <div
          ref={clientProjectsRef}
          id="client-projects"
          className="relative min-h-screen bg-gradient-to-b from-black via-indigo-900/10 to-black px-4 md:px-8 py-16 md:py-24 overflow-hidden"
        >
          {/* Decorative Background Elements */}
          <div className="absolute top-20 left-10 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-700" />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative z-10 max-w-7xl mx-auto text-white"
          >
            <div className="text-center mb-12 md:mb-16">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="inline-block mb-4"
              >
                <span className="px-4 py-2 bg-indigo-500/20 text-indigo-300 rounded-full text-sm font-semibold border border-indigo-500/30">
                  Featured Work
                </span>
              </motion.div>
              <motion.h2
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent"
              >
                Client Projects
              </motion.h2>
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="text-gray-400 text-base md:text-lg max-w-2xl mx-auto"
              >
                Delivering exceptional digital experiences for clients worldwide
              </motion.p>
            </div>

            <ClientProjectFilters f={filters} total={clientProjects.length} />

            {visibleClientProjects.length === 0 ? (
              <div className="py-16 text-center">
                <p className="text-xl text-white font-semibold mb-2">
                  Nothing matches that yet
                </p>
                <p className="text-gray-400 mb-6">
                  Try a different industry or stack — or just ask BD's Helper.
                </p>
                <button
                  onClick={filters.clear}
                  className="px-6 py-3 rounded-full bg-indigo-600 text-white font-semibold hover:brightness-110 transition-all"
                >
                  Clear filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {visibleClientProjects.map((project, index) => (
                  <ClientProjectCard
                    key={project.slug}
                    project={project}
                    index={index}
                  />
                ))}
              </div>
            )}

            {/* See More / Show Less Client Projects */}
            {!filters.active && visibleClientProjects.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-12 flex justify-center"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setShowAllClientProjects(!showAllClientProjects);
                  if (showAllClientProjects)
                    clientProjectsRef.current?.scrollIntoView({
                      behavior: "smooth",
                    });
                }}
                className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full text-white font-semibold shadow-lg hover:shadow-indigo-500/25 hover:shadow-xl transition-all"
              >
                <span className="text-base">
                  {showAllClientProjects
                    ? "Show Less"
                    : "Read More Client Projects"}
                </span>
                <motion.div
                  animate={{ y: showAllClientProjects ? [0, -3, 0] : [0, 3, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <ChevronDown
                    className={`w-5 h-5 ${
                      showAllClientProjects ? "rotate-180" : ""
                    }`}
                  />
                </motion.div>
              </motion.button>
            </motion.div>
          )}
          </motion.div>
        </div>

        {/* Client Testimonials Section - Enhanced */}
        <div className="relative min-h-screen bg-gradient-to-b from-black via-purple-900/10 to-black px-4 md:px-8 py-16 md:py-24 overflow-hidden">
          {/* Decorative Background Elements */}
          <div className="absolute top-20 right-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 left-10 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-700" />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative z-10 max-w-7xl mx-auto text-white"
          >
            <div className="text-center mb-12 md:mb-16">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="inline-block mb-4"
              >
                <span className="px-4 py-2 bg-purple-500/20 text-purple-300 rounded-full text-sm font-semibold border border-purple-500/30">
                  What Clients Say
                </span>
              </motion.div>
              <motion.h2
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 via-pink-400 to-rose-400 bg-clip-text text-transparent"
              >
                Client Testimonials
              </motion.h2>
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="text-gray-400 text-base md:text-lg max-w-2xl mx-auto"
              >
                Trusted by businesses worldwide to deliver excellence
              </motion.p>
            </div>

            <div className="relative overflow-hidden">
              <div
                className="flex items-start transition-transform duration-700 ease-out -mx-3 md:-mx-4"
                style={{
                  transform: `translateX(-${(testimonialIndex * 100) / perView}%)`,
                }}
              >
              {/* Testimonial 1 - Prasanta Kar for Consult Easily */}
              <div className="w-full md:w-1/2 lg:w-1/3 flex-shrink-0 px-3 md:px-4">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1, type: "spring", stiffness: 100 }}
                whileHover={{ scale: 1.02, y: -5 }}
                className="group relative bg-gradient-to-br from-indigo-900/50 to-purple-900/50 p-8 rounded-3xl backdrop-blur-md border border-indigo-500/40 shadow-2xl shadow-indigo-500/20 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/0 to-purple-500/0 group-hover:from-indigo-500/10 group-hover:to-purple-500/10 transition-all duration-500" />

                <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-indigo-500/30 group-hover:scale-110 transition-transform">
                      P
                    </div>
                    <div>
                      <h4 className="font-bold text-lg group-hover:text-indigo-200 transition-colors">
                        Prasanta Kar
                      </h4>
                      <p className="text-sm text-gray-400">
                        Prasanta Kar Institute
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-1 mb-6">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-5 h-5 fill-yellow-400 text-yellow-400 drop-shadow-lg"
                      />
                    ))}
                  </div>
                  <p className="text-gray-300 text-sm md:text-base leading-relaxed italic group-hover:text-gray-200 transition-colors">
                    "Bismay revolutionized our educational institute's online presence with a stunning, user-centric platform. The course management system and student engagement features have exceeded all expectations. His passion for education technology is evident in every detail."
                  </p>
                </div>
                <div className="absolute -bottom-6 -right-6 w-20 h-20 bg-indigo-500/20 rounded-full blur-2xl group-hover:bg-indigo-500/40 transition-all duration-500" />
              </motion.div>
              </div>

              {/* Testimonial 2 - Shiv Saha for Consult Easily */}
              <div className="w-full md:w-1/2 lg:w-1/3 flex-shrink-0 px-3 md:px-4">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
                whileHover={{ scale: 1.02, y: -5 }}
                className="group relative bg-gradient-to-br from-blue-900/50 to-cyan-900/50 p-8 rounded-3xl backdrop-blur-md border border-blue-500/40 shadow-2xl shadow-blue-500/20 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-cyan-500/0 group-hover:from-blue-500/10 group-hover:to-cyan-500/10 transition-all duration-500" />

                <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform">
                      S
                    </div>
                    <div>
                      <h4 className="font-bold text-lg group-hover:text-blue-200 transition-colors">
                        Shiv Saha
                      </h4>
                      <p className="text-sm text-gray-400">
                        Consult Easily
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-1 mb-6">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-5 h-5 fill-yellow-400 text-yellow-400 drop-shadow-lg"
                      />
                    ))}
                  </div>
                  <p className="text-gray-300 text-sm md:text-base leading-relaxed italic group-hover:text-gray-200 transition-colors">
                    "Bismay's collaboration on our Consult Easily project brought fresh innovation and technical excellence. His ability to deliver scalable solutions under tight deadlines is remarkable. The results speak for themselves in our improved efficiency."
                  </p>
                </div>
                <div className="absolute -bottom-6 -right-6 w-20 h-20 bg-blue-500/20 rounded-full blur-2xl group-hover:bg-blue-500/40 transition-all duration-500" />
              </motion.div>
              </div>

              {/* Testimonial 3 - Sayyed Owais for Trade Care International (TCI) */}
              <div className="w-full md:w-1/2 lg:w-1/3 flex-shrink-0 px-3 md:px-4">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, type: "spring", stiffness: 100 }}
                whileHover={{ scale: 1.02, y: -5 }}
                className="group relative bg-gradient-to-br from-amber-900/50 to-orange-900/50 p-8 rounded-3xl backdrop-blur-md border border-amber-500/40 shadow-2xl shadow-amber-500/20 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-amber-500/0 to-orange-500/0 group-hover:from-amber-500/10 group-hover:to-orange-500/10 transition-all duration-500" />

                <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-amber-500/30 group-hover:scale-110 transition-transform">
                      S
                    </div>
                    <div>
                      <h4 className="font-bold text-lg group-hover:text-amber-200 transition-colors">
                        Sayyed Owais
                      </h4>
                      <p className="text-sm text-gray-400">
                        Trade Care International (TCI)
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-1 mb-6">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-5 h-5 fill-yellow-400 text-yellow-400 drop-shadow-lg"
                      />
                    ))}
                  </div>
                  <p className="text-gray-300 text-sm md:text-base leading-relaxed italic group-hover:text-gray-200 transition-colors">
                    "Partnering with Bismay for TCI's digital transformation was a smart move. His expertise in building robust trade and logistics platforms has given us a competitive edge. The system's reliability and user experience are top-tier."
                  </p>
                </div>
                <div className="absolute -bottom-6 -right-6 w-20 h-20 bg-amber-500/20 rounded-full blur-2xl group-hover:bg-amber-500/40 transition-all duration-500" />
              </motion.div>
              </div>

              {/* Testimonial 4 - Bruteswar Parida for JustHopon */}
              <div className="w-full md:w-1/2 lg:w-1/3 flex-shrink-0 px-3 md:px-4">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4, type: "spring", stiffness: 100 }}
                whileHover={{ scale: 1.02, y: -5 }}
                className="group relative bg-gradient-to-br from-teal-900/50 to-green-900/50 p-8 rounded-3xl backdrop-blur-md border border-teal-500/40 shadow-2xl shadow-teal-500/20 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-teal-500/0 to-green-500/0 group-hover:from-teal-500/10 group-hover:to-green-500/10 transition-all duration-500" />

                <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-14 h-14 bg-gradient-to-br from-teal-500 to-green-500 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-teal-500/30 group-hover:scale-110 transition-transform">
                      B
                    </div>
                    <div>
                      <h4 className="font-bold text-lg group-hover:text-teal-200 transition-colors">
                        Bruteswar Parida
                      </h4>
                      <p className="text-sm text-gray-400">
                        JustHopon
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-1 mb-6">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-5 h-5 fill-yellow-400 text-yellow-400 drop-shadow-lg"
                      />
                    ))}
                  </div>
                  <p className="text-gray-300 text-sm md:text-base leading-relaxed italic group-hover:text-gray-200 transition-colors">
                    "JustHopOn's success is largely thanks to Bismay's visionary development. He crafted a platform that connects adventurers seamlessly, with features that make travel planning effortless. His creativity and technical skill are unmatched in the travel tech space."
                  </p>
                </div>
                <div className="absolute -bottom-6 -right-6 w-20 h-20 bg-teal-500/20 rounded-full blur-2xl group-hover:bg-teal-500/40 transition-all duration-500" />
              </motion.div>
              </div>

              {/* Testimonial 5 - Samrat De for Techno AI, Techno HR and Techno Talents */}
              <div className="w-full md:w-1/2 lg:w-1/3 flex-shrink-0 px-3 md:px-4">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5, type: "spring", stiffness: 100 }}
                whileHover={{ scale: 1.02, y: -5 }}
                className="group relative bg-gradient-to-br from-purple-900/50 to-pink-900/50 p-8 rounded-3xl backdrop-blur-md border border-purple-500/40 shadow-2xl shadow-purple-500/20 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 to-pink-500/0 group-hover:from-purple-500/10 group-hover:to-pink-500/10 transition-all duration-500" />

                <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-purple-500/30 group-hover:scale-110 transition-transform">
                      S
                    </div>
                    <div>
                      <h4 className="font-bold text-lg group-hover:text-purple-200 transition-colors">
                        Samrat De
                      </h4>
                      <p className="text-sm text-gray-400">
                        Techno AI, Techno HR, Techno Talents
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-1 mb-6">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-5 h-5 fill-yellow-400 text-yellow-400 drop-shadow-lg"
                      />
                    ))}
                  </div>
                  <p className="text-gray-300 text-sm md:text-base leading-relaxed italic group-hover:text-gray-200 transition-colors">
                    "Bismay elevated our Techno AI, HR, and Talents platforms to new heights. The AI integrations are sophisticated yet user-friendly, transforming how we manage talent and operations. His forward-thinking approach is exactly what modern businesses need."
                  </p>
                </div>
                <div className="absolute -bottom-6 -right-6 w-20 h-20 bg-purple-500/20 rounded-full blur-2xl group-hover:bg-purple-500/40 transition-all duration-500" />
              </motion.div>
              </div>

              {/* Testimonial 6 - Jayatri Chakraborty for Glow */}
              <div className="w-full md:w-1/2 lg:w-1/3 flex-shrink-0 px-3 md:px-4">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6, type: "spring", stiffness: 100 }}
                whileHover={{ scale: 1.02, y: -5 }}
                className="group relative bg-gradient-to-br from-rose-900/50 to-red-900/50 p-8 rounded-3xl backdrop-blur-md border border-rose-500/40 shadow-2xl shadow-rose-500/20 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-rose-500/0 to-red-500/0 group-hover:from-rose-500/10 group-hover:to-red-500/10 transition-all duration-500" />

                <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-14 h-14 bg-gradient-to-br from-rose-500 to-red-500 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-rose-500/30 group-hover:scale-110 transition-transform">
                      J
                    </div>
                    <div>
                      <h4 className="font-bold text-lg group-hover:text-rose-200 transition-colors">
                        Jayatri Chakraborty
                      </h4>
                      <p className="text-sm text-gray-400">
                        Glow
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-1 mb-6">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-5 h-5 fill-yellow-400 text-yellow-400 drop-shadow-lg"
                      />
                    ))}
                  </div>
                  <p className="text-gray-300 text-sm md:text-base leading-relaxed italic group-hover:text-gray-200 transition-colors">
                    "Glow wouldn't be the beauty brand it is without Bismay's empathetic design. He understood our vision for natural radiance and delivered products that are both beautiful and deeply functional. Users love the personalized shade finder and cruelty-free formulations!"
                  </p>
                </div>
                <div className="absolute -bottom-6 -right-6 w-20 h-20 bg-rose-500/20 rounded-full blur-2xl group-hover:bg-rose-500/40 transition-all duration-500" />
              </motion.div>
              </div>

              {/* Testimonial 7 - Jithendhar Reddy for RiseApply */}
              <div className="w-full md:w-1/2 lg:w-1/3 flex-shrink-0 px-3 md:px-4">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.7, type: "spring", stiffness: 100 }}
                whileHover={{ scale: 1.02, y: -5 }}
                className="group relative bg-gradient-to-br from-lime-900/50 to-emerald-900/50 p-8 rounded-3xl backdrop-blur-md border border-lime-500/40 shadow-2xl shadow-lime-500/20 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-lime-500/0 to-emerald-500/0 group-hover:from-lime-500/10 group-hover:to-emerald-500/10 transition-all duration-500" />

                <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-14 h-14 bg-gradient-to-br from-lime-500 to-emerald-500 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-lime-500/30 group-hover:scale-110 transition-transform">
                      J
                    </div>
                    <div>
                      <h4 className="font-bold text-lg group-hover:text-lime-200 transition-colors">
                        Jithendhar Reddy
                      </h4>
                      <p className="text-sm text-gray-400">
                        RiseApply
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-1 mb-6">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-5 h-5 fill-yellow-400 text-yellow-400 drop-shadow-lg"
                      />
                    ))}
                  </div>
                  <p className="text-gray-300 text-sm md:text-base leading-relaxed italic group-hover:text-gray-200 transition-colors">
                    "RiseApply's internship matching system is a testament to Bismay's skill in educational technology. He built a platform that bridges students and opportunities with ease. The certificate features and user feedback have been game-changing for career development."
                  </p>
                </div>
                <div className="absolute -bottom-6 -right-6 w-20 h-20 bg-lime-500/20 rounded-full blur-2xl group-hover:bg-lime-500/40 transition-all duration-500" />
              </motion.div>
              </div>

              {/* Testimonial 8 - Varun S for coding on the Rocks */}
              <div className="w-full md:w-1/2 lg:w-1/3 flex-shrink-0 px-3 md:px-4">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.8, type: "spring", stiffness: 100 }}
                whileHover={{ scale: 1.02, y: -5 }}
                className="group relative bg-gradient-to-br from-cyan-900/50 to-blue-900/50 p-8 rounded-3xl backdrop-blur-md border border-cyan-500/40 shadow-2xl shadow-cyan-500/20 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/0 to-blue-500/0 group-hover:from-cyan-500/10 group-hover:to-blue-500/10 transition-all duration-500" />

                <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-14 h-14 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-cyan-500/30 group-hover:scale-110 transition-transform">
                      V
                    </div>
                    <div>
                      <h4 className="font-bold text-lg group-hover:text-cyan-200 transition-colors">
                        Varun S
                      </h4>
                      <p className="text-sm text-gray-400">
                        coding on the Rocks
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-1 mb-6">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-5 h-5 fill-yellow-400 text-yellow-400 drop-shadow-lg"
                      />
                    ))}
                  </div>
                  <p className="text-gray-300 text-sm md:text-base leading-relaxed italic group-hover:text-gray-200 transition-colors">
                    "Coding on the Rocks thrives because of Bismay's dedication to developer education. He created an interactive platform that's both powerful and accessible, supporting multiple languages and real-time collaboration. It's become an essential tool for our community."
                  </p>
                </div>
                <div className="absolute -bottom-6 -right-6 w-20 h-20 bg-cyan-500/20 rounded-full blur-2xl group-hover:bg-cyan-500/40 transition-all duration-500" />
              </motion.div>
              </div>

              {/* Testimonial 9 - Kevin Kapoor for Alphonso Media */}
              <div className="w-full md:w-1/2 lg:w-1/3 flex-shrink-0 px-3 md:px-4">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, type: "spring", stiffness: 100 }}
                whileHover={{ scale: 1.02, y: -5 }}
                className="group relative bg-gradient-to-br from-violet-900/50 to-fuchsia-900/50 p-8 rounded-3xl backdrop-blur-md border border-violet-500/40 shadow-2xl shadow-violet-500/20 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-violet-500/0 to-fuchsia-500/0 group-hover:from-violet-500/10 group-hover:to-fuchsia-500/10 transition-all duration-500" />

                <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-14 h-14 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-violet-500/30 group-hover:scale-110 transition-transform">
                      K
                    </div>
                    <div>
                      <h4 className="font-bold text-lg group-hover:text-violet-200 transition-colors">
                        Kevin Kapoor
                      </h4>
                      <p className="text-sm text-gray-400">Alphonso Media</p>
                    </div>
                  </div>
                  <div className="flex gap-1 mb-6">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-5 h-5 fill-yellow-400 text-yellow-400 drop-shadow-lg"
                      />
                    ))}
                  </div>
                  <p className="text-gray-300 text-sm md:text-base leading-relaxed italic group-hover:text-gray-200 transition-colors">
                    "Bringing Bismay in to head development changed how we ship. He turned a loose set of client requests into proper SRS documents, sprint plans and a delivery roadmap, then led the team that built it. Architecture decisions get made quickly and correctly, deadlines hold, and clients hear one clear technical voice instead of five. He is the reason our delivery is predictable."
                  </p>
                </div>
                <div className="absolute -bottom-6 -right-6 w-20 h-20 bg-violet-500/20 rounded-full blur-2xl group-hover:bg-violet-500/40 transition-all duration-500" />
              </motion.div>
              </div>


                {/* Slide 4 */}
              {/* Testimonial 10 - Rahat International (name withheld) */}
              <div className="w-full md:w-1/2 lg:w-1/3 flex-shrink-0 px-3 md:px-4">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1, type: "spring", stiffness: 100 }}
                whileHover={{ scale: 1.02, y: -5 }}
                className="group relative bg-gradient-to-br from-red-900/50 to-orange-900/50 p-8 rounded-3xl backdrop-blur-md border border-red-500/40 shadow-2xl shadow-red-500/20 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-red-500/0 to-orange-500/0 group-hover:from-red-500/10 group-hover:to-orange-500/10 transition-all duration-500" />

                <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-14 h-14 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-red-500/30 group-hover:scale-110 transition-transform">
                      R
                    </div>
                    <div>
                      <h4 className="font-bold text-lg group-hover:text-red-200 transition-colors flex items-center gap-2">
                        <span
                          className="blur-[6px] select-none pointer-events-none"
                          aria-hidden="true"
                        >
                          Rahatul Karim
                        </span>
                        <span className="sr-only">Name withheld</span>
                        <Lock className="w-3.5 h-3.5 text-gray-500 flex-shrink-0" />
                      </h4>
                      <p className="text-sm text-gray-400">
                        Rahat International
                      </p>
                      <p className="text-[11px] text-gray-600 mt-0.5">
                        Name withheld on request
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-1 mb-6">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-5 h-5 fill-yellow-400 text-yellow-400 drop-shadow-lg"
                      />
                    ))}
                  </div>
                  <p className="text-gray-300 text-sm md:text-base leading-relaxed italic group-hover:text-gray-200 transition-colors">
                    "We have three decades of placements behind us and almost none of it was visible online. Bismay turned our nine-step recruitment process into something a client in the Gulf can actually follow, industry by industry, without a single phone call. Enquiries now arrive already understanding how we work. That is the whole job, and he did it."
                  </p>
                </div>
                <div className="absolute -bottom-6 -right-6 w-20 h-20 bg-red-500/20 rounded-full blur-2xl group-hover:bg-red-500/40 transition-all duration-500" />
              </motion.div>
              </div>

              {/* Testimonial 11 - Anish Popat for The Ecom Lab */}
              <div className="w-full md:w-1/2 lg:w-1/3 flex-shrink-0 px-3 md:px-4">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
                whileHover={{ scale: 1.02, y: -5 }}
                className="group relative bg-gradient-to-br from-orange-900/50 to-amber-900/50 p-8 rounded-3xl backdrop-blur-md border border-orange-500/40 shadow-2xl shadow-orange-500/20 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/0 to-amber-500/0 group-hover:from-orange-500/10 group-hover:to-amber-500/10 transition-all duration-500" />

                <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-amber-500 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-orange-500/30 group-hover:scale-110 transition-transform">
                      A
                    </div>
                    <div>
                      <h4 className="font-bold text-lg group-hover:text-orange-200 transition-colors">
                        Anish Popat
                      </h4>
                      <p className="text-sm text-gray-400">The Ecom Lab</p>
                    </div>
                  </div>
                  <div className="flex gap-1 mb-6">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-5 h-5 fill-yellow-400 text-yellow-400 drop-shadow-lg"
                      />
                    ))}
                  </div>
                  <p className="text-gray-300 text-sm md:text-base leading-relaxed italic group-hover:text-gray-200 transition-colors">
                    "Our whole pitch is that growth comes from four pillars working together, and every previous version of the site buried that. Bismay built the structure so the argument is obvious before you read a word — case studies leading with the number, one clear path to a booked call. It sells the way we actually sell."
                  </p>
                </div>
                <div className="absolute -bottom-6 -right-6 w-20 h-20 bg-orange-500/20 rounded-full blur-2xl group-hover:bg-orange-500/40 transition-all duration-500" />
              </motion.div>
              </div>

              {/* Testimonial 12 - Anish Popat for ONCALL LONDON */}
              <div className="w-full md:w-1/2 lg:w-1/3 flex-shrink-0 px-3 md:px-4">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, type: "spring", stiffness: 100 }}
                whileHover={{ scale: 1.02, y: -5 }}
                className="group relative bg-gradient-to-br from-teal-900/50 to-cyan-900/50 p-8 rounded-3xl backdrop-blur-md border border-teal-500/40 shadow-2xl shadow-teal-500/20 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-teal-500/0 to-cyan-500/0 group-hover:from-teal-500/10 group-hover:to-cyan-500/10 transition-all duration-500" />

                <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-14 h-14 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-teal-500/30 group-hover:scale-110 transition-transform">
                      A
                    </div>
                    <div>
                      <h4 className="font-bold text-lg group-hover:text-teal-200 transition-colors">
                        Anish Popat
                      </h4>
                      <p className="text-sm text-gray-400">
                        Founder, ONCALL LONDON
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-1 mb-6">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-5 h-5 fill-yellow-400 text-yellow-400 drop-shadow-lg"
                      />
                    ))}
                  </div>
                  <p className="text-gray-300 text-sm md:text-base leading-relaxed italic group-hover:text-gray-200 transition-colors">
                    "Our customers shop in the ten minutes between shifts, so every extra click costs a sale. Bismay put the full size run straight onto the collection grid and built separate routes for teams and students. Best of all, we now run our own campaigns — countdowns, badges, promo rails — without booking developer time for every launch."
                  </p>
                </div>
                <div className="absolute -bottom-6 -right-6 w-20 h-20 bg-teal-500/20 rounded-full blur-2xl group-hover:bg-teal-500/40 transition-all duration-500" />
              </motion.div>
              </div>

              {/* Testimonial 13 - Amit for obo me */}
              <div className="w-full md:w-1/2 lg:w-1/3 flex-shrink-0 px-3 md:px-4">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4, type: "spring", stiffness: 100 }}
                whileHover={{ scale: 1.02, y: -5 }}
                className="group relative bg-gradient-to-br from-purple-900/50 to-indigo-900/50 p-8 rounded-3xl backdrop-blur-md border border-purple-500/40 shadow-2xl shadow-purple-500/20 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 to-indigo-500/0 group-hover:from-purple-500/10 group-hover:to-indigo-500/10 transition-all duration-500" />

                <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-purple-500/30 group-hover:scale-110 transition-transform">
                      A
                    </div>
                    <div>
                      <h4 className="font-bold text-lg group-hover:text-purple-200 transition-colors">
                        Amit
                      </h4>
                      <p className="text-sm text-gray-400">obo me™</p>
                    </div>
                  </div>
                  <div className="flex gap-1 mb-6">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-5 h-5 fill-yellow-400 text-yellow-400 drop-shadow-lg"
                      />
                    ))}
                  </div>
                  <p className="text-gray-300 text-sm md:text-base leading-relaxed italic group-hover:text-gray-200 transition-colors">
                    "obo is two products in one — storytellers need to record and publish, listeners need a reason to come back tomorrow. Bismay built both sides as a single platform instead of bolting them together, and kept our multi-language catalogue findable as it grew. Our narrators onboard themselves now, which is exactly what we wanted."
                  </p>
                </div>
                <div className="absolute -bottom-6 -right-6 w-20 h-20 bg-purple-500/20 rounded-full blur-2xl group-hover:bg-purple-500/40 transition-all duration-500" />
              </motion.div>
              </div>
              </div>

            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-center mt-8 gap-4">
              <button
                onClick={() =>
                  setTestimonialIndex((prev) =>
                    prev <= 0 ? maxTestimonialIndex : prev - 1
                  )
                }
                className="bg-gradient-to-r from-pink-400/70 to-rose-400/70 hover:from-pink-500/80 hover:to-rose-500/80 text-white p-3 rounded-full transition-all duration-300 shadow-lg shadow-pink-400/30"
                aria-label="Previous testimonials"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={() =>
                  setTestimonialIndex((prev) =>
                    prev >= maxTestimonialIndex ? 0 : prev + 1
                  )
                }
                className="bg-gradient-to-r from-rose-400/70 to-pink-400/70 hover:from-rose-500/80 hover:to-pink-500/80 text-white p-3 rounded-full transition-all duration-300 shadow-lg shadow-rose-400/30"
                aria-label="Next testimonials"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          </motion.div>
        </div>

        {/* Projects Section - Masonry Grid */}
        <div
          ref={projectsRef}
          id="projects"
          className="min-h-screen bg-gradient-to-b from-black via-pink-900/10 to-black px-4 md:px-8 py-16 md:py-24"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-7xl mx-auto text-white"
          >
            <motion.h2
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl lg:text-5xl font-bold mb-8 md:mb-12 bg-gradient-to-r from-pink-400 to-rose-400 bg-clip-text text-transparent"
            >
              Featured Projects
            </motion.h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {displayedProjects.map((project, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ y: -8 }}
                  className="group bg-gray-900 rounded-2xl overflow-hidden backdrop-blur-sm border border-white/10 hover:border-pink-500/50 transition-all duration-300"
                >
                  <div className="relative aspect-video overflow-hidden">
                    <img
                      src={project.image || "/placeholder.svg"}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2 group-hover:text-pink-400 transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-sm text-gray-400 mb-4 line-clamp-3">
                      {project.description}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.tags.map((tag, i) => (
                        <span
                          key={i}
                          className="px-2 py-1 bg-pink-500/20 text-pink-300 rounded-lg text-xs border border-pink-500/30"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="flex justify-between items-center">
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-2 text-sm hover:text-pink-400 transition-colors"
                      >
                        <Github className="w-4 h-4" />
                        <span>Code</span>
                      </a>
                      <a
                        href={project.demo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-2 text-sm hover:text-pink-400 transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" />
                        <span>Live Demo</span>
                      </a>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* See More Projects Button */}
            {!showAllProjects && allProjects.length > 6 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mt-12 flex justify-center"
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowAllProjects(true)}
                  className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-pink-600 to-rose-600 rounded-full text-white font-semibold shadow-lg hover:shadow-pink-500/25 hover:shadow-xl transition-all"
                >
                  <span className="text-base">See More Projects</span>
                  <motion.div
                    animate={{ y: [0, 3, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <ChevronDown className="w-5 h-5" />
                  </motion.div>
                </motion.button>
              </motion.div>
            )}

            {/* Show Less Button */}
            {showAllProjects && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-12 flex justify-center"
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setShowAllProjects(false);
                    projectsRef.current?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-pink-600 to-rose-600 rounded-full text-white font-semibold shadow-lg hover:shadow-pink-500/25 hover:shadow-xl transition-all"
                >
                  <span className="text-base">Show Less</span>
                  <motion.div
                    animate={{ y: [0, -3, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <ChevronDown className="w-5 h-5 rotate-180" />
                  </motion.div>
                </motion.button>
              </motion.div>
            )}
          </motion.div>
        </div>

        {/* Certificates Section - Card Grid */}
        <div
          ref={certificatesRef}
          id="certificates"
          className="min-h-screen bg-gradient-to-b from-black via-cyan-900/10 to-black px-4 md:px-8 py-16 md:py-24"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-7xl mx-auto text-white"
          >
            <motion.h2
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl lg:text-5xl font-bold mb-8 md:mb-12 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent"
            >
              Certifications & Achievements
            </motion.h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {certificates.map((certificate, index) => (
                <motion.div
                  key={certificate.id}
                  initial={{ opacity: 0, scale: 0.9, rotateY: -10 }}
                  whileInView={{ opacity: 1, scale: 1, rotateY: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    delay: index * 0.15,
                    duration: 0.5,
                    type: "spring",
                    stiffness: 100,
                  }}
                  whileHover={{
                    scale: 1.05,
                    y: -8,
                    rotateY: 5,
                    transition: {
                      duration: 0.3,
                      type: "spring",
                      stiffness: 300,
                      damping: 20,
                    },
                  }}
                  className={`group relative bg-gradient-to-br ${certificate.color}/20 rounded-2xl overflow-hidden backdrop-blur-sm border border-white/20 cursor-pointer shadow-xl hover:shadow-2xl transition-shadow duration-300`}
                  onClick={() => setSelectedCertificate(certificate.id)}
                  style={{ transformStyle: "preserve-3d" }}
                >
                  {/* Animated gradient overlay */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${certificate.color}/30 animate-pulse`}
                    />
                  </div>

                  <div className="relative aspect-[3/2] overflow-hidden">
                    {certificate.isPdf ? (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-black/60 to-black/40">
                        <div className="text-center">
                          <FileText className="w-12 h-12 text-white/80 mx-auto mb-2" />
                          <p className="text-white/70 font-semibold text-sm">
                            PDF Certificate
                          </p>
                          <p className="text-white/50 text-xs mt-1">
                            Click to view
                          </p>
                        </div>
                      </div>
                    ) : (
                      <img
                        src={
                          certificate.imageSizes.thumbnail || "/placeholder.svg"
                        }
                        alt={certificate.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
                        loading="lazy"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent opacity-70 group-hover:opacity-50 transition-opacity duration-300" />

                    {/* Floating Award Badge */}
                    <motion.div
                      className="absolute top-3 right-3"
                      whileHover={{ rotate: 360, scale: 1.2 }}
                      transition={{ duration: 0.6 }}
                    >
                      <div
                        className={`p-2 bg-gradient-to-br ${certificate.color}/40 rounded-full backdrop-blur-md border border-white/30 shadow-lg`}
                      >
                        <Award className="w-4 h-4 text-white" />
                      </div>
                    </motion.div>

                    {/* Shine effect on hover */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 group-hover:translate-x-full transition-transform duration-700 ease-out" />
                    </div>
                  </div>

                  <div className="relative p-4 space-y-2">
                    <div className="flex items-center gap-2 mb-1">
                      <div
                        className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${certificate.color} animate-pulse`}
                      />
                      <span className="text-xs font-bold text-white">
                        {certificate.issuer}
                      </span>
                      <span className="text-xs text-white">•</span>
                      <span className="text-xs text-white flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {certificate.date}
                      </span>
                    </div>
                    <h3 className="text-base md:text-lg font-bold text-white transition-all">
                      {certificate.title}
                    </h3>
                    <p className="text-xs text-gray-400 leading-relaxed line-clamp-2 group-hover:text-gray-300 transition-colors">
                      {certificate.description}
                    </p>

                    {/* Click to view indicator */}
                    <motion.div
                      className="flex items-center gap-2 text-xs text-white/60 group-hover:text-white/90 transition-colors pt-1"
                      whileHover={{ x: 5 }}
                    >
                      <span>Click to view</span>
                      <ChevronDown className="w-3 h-3 rotate-[-90deg]" />
                    </motion.div>
                  </div>

                  {/* Border glow effect */}
                  <div
                    className={`absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-r ${certificate.color} blur-xl -z-10`}
                  />
                </motion.div>
              ))}
            </div>

            {/* Stats Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6"
            >
              {[
                { label: "Hackathons Won", value: "10+", icon: Zap },
                { label: "Clients Served", value: "15+", icon: Users },
                { label: "Achievements", value: "20+", icon: Target },
                { label: "Projects Delivered", value: "50+", icon: Trophy },
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="bg-gradient-to-br from-white/5 to-white/10 rounded-2xl p-6 backdrop-blur-sm border border-white/20 text-center"
                >
                  <stat.icon className="w-8 h-8 mx-auto mb-3 text-cyan-400" />
                  <h4 className="text-2xl md:text-3xl font-bold text-white mb-1">
                    {stat.value}
                  </h4>
                  <p className="text-sm text-gray-400">{stat.label}</p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* Contact Section - Split Layout */}
        <div
          ref={contactRef}
          id="contact"
          className="min-h-screen bg-gradient-to-b from-black via-emerald-900/10 to-black px-4 md:px-8 py-16 md:py-24"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-6xl mx-auto text-white"
          >
            <motion.h2
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl lg:text-5xl font-bold mb-8 md:mb-12 bg-gradient-to-r from-emerald-400 to-green-400 bg-clip-text text-transparent"
            >
              Let's Connect
            </motion.h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
              {/* Left Side - Info */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                <div className="bg-gradient-to-br from-emerald-900/30 to-green-900/30 p-6 md:p-8 rounded-2xl backdrop-blur-sm border border-emerald-500/30">
                  <p className="text-base md:text-lg text-gray-300 leading-relaxed mb-6">
                    I'm always interested in hearing about new projects and
                    opportunities. Feel free to reach out if you'd like to
                    connect or discuss potential collaborations.
                  </p>
                  <div className="flex items-center gap-2 text-gray-400">
                    <MapPin className="w-5 h-5 text-emerald-400" />
                    <span>Kolkata, India</span>
                  </div>
                  <p className="text-sm text-gray-400 mt-2">
                    Available for freelance and full-time opportunities
                  </p>

                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => {
                      setContactModalOpen(true);
                      track("cta_click", { where: "contact-form" });
                    }}
                    className="mt-6 w-full inline-flex items-center justify-center gap-3 px-7 py-4 rounded-full bg-gradient-to-r from-emerald-600 to-green-600 text-white font-semibold shadow-lg hover:shadow-emerald-500/25 hover:shadow-xl transition-all"
                  >
                    <Mail className="w-5 h-5" />
                    <span className="text-base">Contact Me</span>
                  </motion.button>
                  <button
                    onClick={() => {
                      setBookingOpen(true);
                      track("cta_click", { where: "contact-book" });
                    }}
                    className="mt-3 w-full inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-full bg-white/[0.06] border border-white/20 text-white font-semibold hover:bg-white/[0.12] hover:border-white/40 transition-all"
                  >
                    <CalendarDays className="w-5 h-5" />
                    Or book a 30-min call
                  </button>
                  <p className="mt-3 text-center text-xs text-gray-500">
                    Form for details, call for a conversation — either reaches me
                    directly.
                  </p>
                </div>

                {/* Skills Tags */}
                <div className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 p-6 md:p-8 rounded-2xl backdrop-blur-sm border border-white/10">
                  <h3 className="text-lg font-bold mb-4">What I Do</h3>
                  <div className="flex flex-wrap gap-3">
                    <div className="flex items-center space-x-2 bg-purple-500/20 px-4 py-2 rounded-full border border-purple-500/30">
                      <Code2 className="w-4 h-4 text-purple-400" />
                      <span className="text-sm">Web Developer</span>
                    </div>
                    <div className="flex items-center space-x-2 bg-red-500/20 px-4 py-2 rounded-full border border-red-500/30">
                      <SquareCode className="w-4 h-4 text-red-400" />
                      <span className="text-sm">Backend Developer</span>
                    </div>
                    <div className="flex items-center space-x-2 bg-orange-500/20 px-4 py-2 rounded-full border border-orange-500/30">
                      <Brain className="w-4 h-4 text-orange-400" />
                      <span className="text-sm">AI/ML Engineer</span>
                    </div>
                    <div className="flex items-center space-x-2 bg-green-500/20 px-4 py-2 rounded-full border border-green-500/30">
                      <Rocket className="w-4 h-4 text-green-400" />
                      <span className="text-sm">Tech Enthusiast</span>
                    </div>
                    <div className="flex items-center space-x-2 bg-blue-500/20 px-4 py-2 rounded-full border border-blue-500/30">
                      <Gamepad2 className="w-4 h-4 text-blue-400" />
                      <span className="text-sm">Gamer</span>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Right Side - Contact Links */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="space-y-4"
              >
                {[
                  {
                    icon: Mail,
                    label: "Email Me",
                    value: "bismaydey001@gmail.com",
                    href: "mailto:bismaydey001@gmail.com",
                    color: "from-red-500 to-orange-500",
                    external: false,
                  },

                  {
                    icon: Github,
                    label: "GitHub",
                    value: "@BismayDey",
                    href: "https://github.com/BismayDey",
                    color: "from-gray-500 to-gray-700",
                    external: true,
                  },
                  {
                    icon: Linkedin,
                    label: "LinkedIn",
                    value: "Bismay Dey",
                    href: "https://www.linkedin.com/in/bismay-dey-634937268/",
                    color: "from-blue-500 to-blue-700",
                    external: true,
                  },
                  {
                    icon: Instagram,
                    label: "Instagram",
                    value: "@carbon_alternater",
                    href: "https://www.instagram.com/carbon_alternater/",
                    color: "from-pink-500 to-purple-500",
                    external: true,
                  },
                ].map((contact, index) => (
                  <motion.a
                    key={index}
                    href={contact.href}
                    target={contact.external ? "_blank" : undefined}
                    rel={contact.external ? "noopener noreferrer" : undefined}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{
                      scale: 1.02,
                      x: 5,
                      transition: { duration: 0.2 },
                    }}
                    className={`flex items-center gap-4 p-6 bg-gradient-to-r ${contact.color} bg-opacity-10 rounded-2xl backdrop-blur-sm border border-white/10 hover:border-white/30 transition-all group`}
                  >
                    <div className="p-3 bg-white/10 rounded-xl group-hover:bg-white/20 transition-colors">
                      <contact.icon className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm md:text-base font-bold mb-1 text-white">
                        {contact.label}
                      </p>
                      <p className="text-base md:text-lg font-semibold text-gray-300">
                        {contact.value}
                      </p>
                    </div>
                    <ExternalLink className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </motion.a>
                ))}
              </motion.div>
            </div>

            {/* Footer */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="mt-16 pt-8 border-t border-white/10 text-center text-gray-400"
            >
              <p className="text-sm">
                © 2025 Bismay Dey. Built with React, Three.js & Framer Motion
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Certificate Modal */}
      <AnimatePresence>
        {selectedCertificate && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm p-4"
            onClick={() => setSelectedCertificate(null)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0, rotateY: -20 }}
              animate={{ scale: 1, opacity: 1, rotateY: 0 }}
              exit={{ scale: 0.8, opacity: 0, rotateY: 20 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="relative w-full max-w-6xl bg-gradient-to-br from-white/10 to-white/5 rounded-3xl overflow-hidden backdrop-blur-xl border border-white/30 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <div className="absolute top-4 right-4 z-20">
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setSelectedCertificate(null)}
                  className="p-3 rounded-full bg-gradient-to-r from-red-500/80 to-pink-500/80 text-white hover:from-red-600 hover:to-pink-600 transition-all shadow-lg backdrop-blur-sm"
                >
                  <X className="w-6 h-6" />
                </motion.button>
              </div>

              {(() => {
                const cert = certificates.find(
                  (c) => c.id === selectedCertificate
                );
                if (!cert) return null;

                return (
                  <>
                    <div className="p-4 md:p-8">
                      {cert.isPdf ? (
                        <div className="w-full h-[70vh] flex flex-col items-center justify-center gap-6 bg-gradient-to-br from-black/40 to-black/20 rounded-2xl border border-white/20">
                          <motion.div
                            animate={{ scale: [1, 1.1, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                          >
                            <FileText className="w-32 h-32 text-white/80" />
                          </motion.div>
                          <div className="text-center space-y-4">
                            <h3 className="text-2xl md:text-3xl font-bold text-white">
                              PDF Certificate
                            </h3>
                            <p className="text-gray-300 max-w-md">
                              This certificate is in PDF format. Click the
                              button below to open it in a new tab.
                            </p>
                            <motion.a
                              href={cert.image}
                              target="_blank"
                              rel="noopener noreferrer"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full text-white font-semibold shadow-lg hover:shadow-cyan-500/50 transition-all"
                            >
                              <FileDown className="w-5 h-5" />
                              Open PDF Certificate
                            </motion.a>
                          </div>
                        </div>
                      ) : (
                        <motion.img
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.2 }}
                          src={cert.imageSizes.full || "/placeholder.svg"}
                          alt={cert.title}
                          className="w-full h-auto object-contain max-h-[70vh] rounded-2xl shadow-2xl"
                        />
                      )}
                    </div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="p-6 md:p-8 bg-gradient-to-t from-black via-black/90 to-transparent border-t border-white/10"
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="space-y-3">
                          <div className="flex items-center gap-3">
                            <motion.div
                              animate={{ rotate: [0, 360] }}
                              transition={{
                                duration: 3,
                                repeat: Infinity,
                                ease: "linear",
                              }}
                            >
                              <Award
                                className={`w-8 h-8 bg-gradient-to-r ${cert.color} bg-clip-text text-transparent`}
                                style={{
                                  filter: "drop-shadow(0 0 8px currentColor)",
                                }}
                              />
                            </motion.div>
                            <span
                              className={`text-xl font-bold bg-gradient-to-r ${cert.color} bg-clip-text text-transparent`}
                            >
                              {cert.issuer}
                            </span>
                            <span className="text-gray-400">•</span>
                            <span className="text-gray-300 flex items-center gap-2">
                              <Calendar className="w-4 h-4" />
                              {cert.date}
                            </span>
                          </div>
                          <h3 className="text-2xl md:text-3xl font-bold text-white">
                            {cert.title}
                          </h3>
                          <p className="text-gray-300 leading-relaxed max-w-2xl">
                            {cert.description}
                          </p>
                        </div>

                        {!cert.isPdf && (
                          <motion.a
                            href={cert.image}
                            download
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full text-white font-semibold shadow-lg hover:shadow-green-500/50 transition-all whitespace-nowrap"
                          >
                            <FileDown className="w-5 h-5" />
                            Download
                          </motion.a>
                        )}
                      </div>
                    </motion.div>
                  </>
                );
              })()}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sticky résumé bar — hidden over the hero so it doesn't sit on top of
          the hero's own buttons, then rides along for the rest of the page. */}
      <AnimatePresence>
        {navScrolled && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            transition={{ type: "spring", stiffness: 260, damping: 26 }}
            className="fixed bottom-5 md:bottom-6 left-0 right-0 z-[60] flex justify-center px-4 pointer-events-none"
          >
            <div className="flex items-center gap-2 sm:gap-3 p-1.5 rounded-full bg-black/70 backdrop-blur-xl border border-white/15 shadow-2xl shadow-black/60 pointer-events-auto">
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={handleDownloadResume}
                disabled={isDownloading}
                className="flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full text-white text-sm font-semibold shadow-lg shadow-pink-500/25 hover:brightness-110 disabled:opacity-70 disabled:cursor-wait transition-all"
              >
                {isDownloading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <FileDown className="w-4 h-4" />
                )}
                <span className="hidden sm:inline">
                  {isDownloading ? "Downloading…" : "Download Resume"}
                </span>
                <span className="sm:hidden">
                  {isDownloading ? "…" : "Resume"}
                </span>
              </motion.button>

              <motion.a
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                href="/BISMAY DEY.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-full text-white text-sm font-semibold hover:bg-white/10 transition-colors"
              >
                <FileText className="w-4 h-4" />
                <span className="hidden sm:inline">View Resume</span>
                <span className="sm:hidden">View</span>
              </motion.a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <BookingModal
        open={bookingOpen}
        onClose={() => setBookingOpen(false)}
        onUseForm={() => {
          setBookingOpen(false);
          setContactModalOpen(true);
        }}
      />

      <ChatWidget />

      <IntroOverlay />

      <ContactModal
        open={contactModalOpen}
        onClose={() => setContactModalOpen(false)}
        onSeeProjects={() =>
          clientProjectsRef.current?.scrollIntoView({ behavior: "smooth" })
        }
      />

      <FloatingWhatsApp />
    </div>
  );
}

function FloatingWhatsApp() {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  // Replace with your actual WhatsApp number (in international format without + or spaces)
  const phoneNumber = "918100314152"; // Your number
  const message = "Hello, I’m reaching out regarding your services. I’m interested in website development, mobile/web app development, and any related solutions you provide.";

  const whatsappLink = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
    message
  )}`;

  return (
    <>
      <AnimatePresence>
        {isVisible && (
          <motion.div
            className="fixed bottom-10 right-6 z-50 flex flex-col items-end gap-4"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.3, delay: 1 }}
          >
            {/* Chat Popup */}
            <AnimatePresence>
              {isOpen && (
                <motion.div
                  className="bg-white rounded-2xl shadow-2xl w-96 overflow-hidden"
                  initial={{ opacity: 0, y: 20, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 20, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Header */}
                  <div className="bg-[#075e54] text-white p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                        <svg
                          className="w-8 h-8"
                          viewBox="0 0 24 24"
                          fill="#25D366"
                        >
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.67-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-bold text-base">Bismay Dey</h3>
                        <p className="text-xs text-green-100">
                          Full Stack Developer
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setIsOpen(false)}
                      className="hover:bg-white/20 rounded-full p-1 transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Body */}
                  <div className="p-4 bg-[#ece5dd] min-h-[250px] relative">
                    {/* Chat bubble */}
                    <motion.div
                      className="bg-white rounded-lg rounded-tl-none p-3 shadow-sm max-w-[85%]"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <p className="text-sm font-bold text-neutral-800 mb-1">
                        Hello👋! Need a website or app for your business, startup, or personal brand?
                      </p>
                      <p className="text-xs font-semibold text-neutral-500">
                     I develop, design, and deliver high-quality websites, apps, and scalable digital products that help businesses grow.
Tell me what you need. <br/>I’ll take care of the rest.
                      </p>
                    </motion.div>

                    {/* Timestamp */}
                    <p className="text-xs font-semibold text-neutral-500 mt-2 ml-2">
                      Just now
                    </p>
                  </div>

                  {/* Footer */}
                  <div className="p-4 bg-white border-t border-neutral-200">
                    <a
                      href={whatsappLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-semibold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors duration-300"
                    >
                      <svg
                        className="w-5 h-5"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.67-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                      </svg>
                      Start Chat on WhatsApp
                    </a>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Main Button */}
            <motion.button
              onClick={() => setIsOpen(!isOpen)}
              className="bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-full shadow-2xl hover:shadow-[0_8px_30px_rgba(37,211,102,0.4)] transition-all duration-300 relative group"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              style={{ width: "60px", height: "60px" }}
            >
              {/* Ping animation */}
              <motion.span
                className="absolute inset-0 rounded-full bg-[#25D366]"
                animate={{
                  scale: [1, 1.3, 1.3],
                  opacity: [0.5, 0, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeOut",
                }}
              />

              {/* WhatsApp Icon */}
              <motion.div
                className="absolute inset-0 flex items-center justify-center"
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                {isOpen ? (
                  <X className="w-7 h-7" />
                ) : (
                  <svg
                    className="w-8 h-8"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.67-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                )}
              </motion.div>

              {/* Notification badge */}
              {!isOpen && (
                <motion.span
                  className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center border-2 border-white"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 1.5, type: "spring" }}
                >
                  1
                </motion.span>
              )}

              {/* Tooltip on hover */}
              <motion.span
                className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-neutral-900 text-white text-sm font-semibold px-4 py-2 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-lg"
                initial={{ x: 10 }}
                whileHover={{ x: 0 }}
              >
                Chat with me on WhatsApp
                {/* Arrow */}
                <span className="absolute left-full top-1/2 -translate-y-1/2 border-8 border-transparent border-l-neutral-900"></span>
              </motion.span>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default App;
