"use client";

import type React from "react";
import { Suspense, useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Scene } from "./components/Scene";
import {
  Brain,
  Code2,
  Rocket,
  Gamepad2,
  SquareCode,
  Mail,
  Users,
  Github,
  BarChart3,
  Linkedin,
  Phone,
  Instagram,
  Globe,
  Briefcase,
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
  Trophy,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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
  // introComplete removed — heading kept static inside Scene
  const [canvasEventSource, setCanvasEventSource] =
    useState<HTMLElement | null>(null);

  // Process profile image: auto-crop center square and produce a data URL
  const [processedProfile, setProcessedProfile] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = "/profile.jpg";

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

  const scrollToSection = (ref: React.RefObject<HTMLDivElement>) => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
    setMobileMenuOpen(false);
  };

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

  const handleViewResume = () => {
    window.open("/BISMAY DEY.pdf", "_blank");
  };

  const allProjects = [
    {
      title: "Health Track",
      description:
        "Health Track is an AI-powered wellness app that offers health monitoring, AI diagnostics, mental health support, emergency assistance, and personalized recommendations. With real-time insights and a smart entertainment recommender, it provides a seamless and data-driven approach to well-being.",
      image:
        "https://i.postimg.cc/v8hKNVFG/1f41a369-a0b2-4b80-aaf3-bdbcc5f91580.webp",
      github: "https://github.com/BismayDey/HEALTH-TRACK",
      demo: "https://health-track-theta.vercel.app/",
      tags: ["AI", "Healthcare", "Next.js"],
    },
    {
      title: "Glow",
      description:
        "Glow is a sleek, AI-powered mental wellness app that helps you track moods, reflect through journaling, and receive personalized insights. Designed for simplicity and clarity, it offers a calming space to support your emotional well-being.",
      image:
        "https://i.postimg.cc/v8hKNVFG/1f41a369-a0b2-4b80-aaf3-bdbcc5f91580.webp",
      github: "https://github.com/BismayDey/Glow-2",
      demo: "https://glow-2-o.vercel.app/",
      tags: ["AI", "Mental Health", "React"],
    },
    {
      title: "E-Commerce Platform",
      description:
        "A modern e-commerce platform built with Next.js and TypeScript, designed for speed, scalability, and a seamless shopping experience. It features a dynamic product listing, an optimized cart system, and a responsive UI with dark mode support.",
      image:
        "https://i.postimg.cc/KzBCpq7z/938d8d08-d966-4f84-9a64-156fb136883d.webp",
      github: "https://github.com/BismayDey/ECOM-SIE",
      demo: "https://ecom4-0.vercel.app/",
      tags: ["E-Commerce", "Next.js", "TypeScript"],
    },
    {
      title: "MindTrack",
      description:
        "MindTrack is a comprehensive mental health platform designed to empower users in understanding and improving their emotional well-being. It offers personalized mood tracking, secure journaling, and treatment monitoring tools.",
      image:
        "https://i.postimg.cc/v8hKNVFG/1f41a369-a0b2-4b80-aaf3-bdbcc5f91580.webp",
      github: "https://github.com/BismayDey/MindTrack",
      demo: "https://mind-rosy.vercel.app/",
      tags: ["Mental Health", "Tracking", "React"],
    },
    {
      title: "RAGE EFFECT",
      description:
        "RAGE EFFECT is a cross-platform FPS/TPS game delivering intense tactical combat, dynamic battlefields, and multiple game modes like Deathmatch and Rage Royale. Experience high-quality graphics and seamless cross-play on PC and mobile.",
      image:
        "https://i.postimg.cc/v8hKNVFG/1f41a369-a0b2-4b80-aaf3-bdbcc5f91580.webp",
      github: "https://github.com/BismayDey/RAGE-EFFECT",
      demo: "https://rage-effect-six.vercel.app/",
      tags: ["Gaming", "3D", "WebGL"],
    },
    {
      title: "Chatting Room",
      description:
        "Simple and intuitive real-time chatting platform built with Next.js and TypeScript. It enables seamless communication with live messaging, user avatars, and a clean UI, making conversations effortless and engaging.",
      image:
        "https://i.postimg.cc/cLQMP7qC/df13d6b5-239b-442c-84fb-8703cf97ce1b.webp",
      github: "https://github.com/BismayDey/chat",
      demo: "https://chat-git-master-bismay-deys-projects.vercel.app/",
      tags: ["Real-time", "Chat", "WebSocket"],
    },
    {
      title: "Shadow Nexus",
      description:
        "Shadow Nexus is a sleek gaming hub offering a curated library of top-rated titles across genres. Discover, download, and play standout games like Shadow Protocol and Neon Drift—all in one immersive platform.",
      image:
        "https://i.postimg.cc/v8hKNVFG/1f41a369-a0b2-4b80-aaf3-bdbcc5f91580.webp",
      github: "https://github.com/BismayDey/ShadowNexus",
      demo: "https://shadownexus.vercel.app/",
      tags: ["Gaming", "Platform", "Next.js"],
    },
    {
      title: "BLACKSTREAM",
      description:
        "BLACKSTREAM is a modern streaming platform offering a diverse selection of movies, TV shows, and original content. Enjoy ad-free streaming, exclusive releases, and offline downloads—all in one place.",
      image:
        "https://i.postimg.cc/v8hKNVFG/1f41a369-a0b2-4b80-aaf3-bdbcc5f91580.webp",
      github: "https://github.com/BismayDey/BLACKSTREAM",
      demo: "https://blackstream-one.vercel.app/",
      tags: ["Streaming", "Media", "React"],
    },
    {
      title: "Let's Draw",
      description:
        "Let's Draw is a real-time collaborative drawing app built with JavaScript and WebSockets. It allows multiple users to sketch together on a shared canvas, making it perfect for creative collaboration, brainstorming, or just having fun with friends online.",
      image:
        "https://i.postimg.cc/v8hKNVFG/1f41a369-a0b2-4b80-aaf3-bdbcc5f91580.webp",
      github: "https://github.com/BismayDey/Lets-draw",
      demo: "https://lets-draw.vercel.app/",
      tags: ["Collaborative", "Canvas", "WebSocket"],
    },
    {
      title: "PokéServer",
      description:
        "PokéServer is a dynamic Pokémon battle simulator that allows users to engage in real-time battles using their favorite Pokémon. With an intuitive interface and seamless gameplay, it offers an immersive experience for Pokémon enthusiasts.",
      image:
        "https://i.postimg.cc/v8hKNVFG/1f41a369-a0b2-4b80-aaf3-bdbcc5f91580.webp",
      github: "https://github.com/BismayDey/PokeServer",
      demo: "https://pokeserver-beta.vercel.app/",
      tags: ["Gaming", "Pokemon", "Simulator"],
    },
    {
      title: "VALORANT AGENTS",
      description:
        "VALORANT AGENTS is a sleek web application showcasing detailed profiles of all VALORANT agents. Explore each agent's abilities, roles, and backgrounds in an interactive and user-friendly interface.",
      image:
        "https://i.postimg.cc/v8hKNVFG/1f41a369-a0b2-4b80-aaf3-bdbcc5f91580.webp",
      github: "https://github.com/BismayDey/valorant",
      demo: "https://valorant-chi-blue.vercel.app/",
      tags: ["Gaming", "API", "React"],
    },
    {
      title: "PaisaOP",
      description:
        "PaisaOP simplifies UPI payments by generating instant QR codes and shareable links. Ideal for creators and small businesses, it enables quick, secure, and hassle-free transactions without any coding.",
      image:
        "https://i.postimg.cc/v8hKNVFG/1f41a369-a0b2-4b80-aaf3-bdbcc5f91580.webp",
      github: "https://github.com/BismayDey/PaisaOP",
      demo: "https://upi-ashen.vercel.app/",
      tags: ["Payments", "UPI", "FinTech"],
    },
    {
      title: "Ask Bro",
      description:
        "Ask Bro is a community-driven Q&A platform where users can ask questions and share knowledge. Built with React, Next.js, TypeScript, and Firebase, it offers a seamless experience for learning and collaboration.",
      image:
        "https://i.postimg.cc/v8hKNVFG/1f41a369-a0b2-4b80-aaf3-bdbcc5f91580.webp",
      github: "https://github.com/BismayDey/AskBro",
      demo: "https://ask-bro.vercel.app/",
      tags: ["Community", "Q&A", "Firebase"],
    },
    {
      title: "Operating System",
      description:
        "Futuristic web-based operating system built using Next.js, designed to simulate a real OS experience within the browser. It features a dynamic multi-window system, draggable apps, a taskbar, and a responsive UI.",
      image:
        "https://i.postimg.cc/fyspGc5v/30017f60-9e65-41c2-b92e-8557ddefadf0.webp",
      github: "https://github.com/BismayDey/OS",
      demo: "https://os-swart.vercel.app/",
      tags: ["OS", "Simulation", "Next.js"],
    },
    {
      title: "Freelancing Site",
      description:
        "Modern freelancing platform built using Next.js and TypeScript, designed to connect clients with talented freelancers efficiently. The platform offers a seamless job posting system, real-time chat, secure payments, and a user-friendly dashboard.",
      image:
        "https://i.postimg.cc/5NQXRxc2/1ea760eb-3f1f-4a80-b6fd-42c4908c74c2.webp",
      github: "https://github.com/BismayDey/Freelancing-Site",
      demo: "https://sjsz9bxxkvpge6q4.vercel.app/",
      tags: ["Freelancing", "Platform", "TypeScript"],
    },
    {
      title: "Code Generator",
      description:
        "Powerful web-based code generator and editor built with Next.js and TypeScript, offering a seamless coding experience in the browser. It supports multiple programming languages, syntax highlighting, and real-time editing.",
      image:
        "https://i.postimg.cc/3wKhGH2B/6af74105-fc41-49a0-b62d-c47be64aa562.webp",
      github: "https://github.com/BismayDey/codegen",
      demo: "https://codegen-rose.vercel.app/",
      tags: ["Code Editor", "Generator", "TypeScript"],
    },
    {
      title: "3D Solar System",
      description: "3D solar system made using Next.js and three.js",
      image:
        "https://i.postimg.cc/v8hKNVFG/1f41a369-a0b2-4b80-aaf3-bdbcc5f91580.webp",
      github: "https://github.com/BismayDey/solar",
      demo: "https://solar-lovat-rho.vercel.app/",
      tags: ["3D", "Three.js", "Space"],
    },
    {
      title: "News Website",
      description:
        "Fast and dynamic news website built with Next.js and TypeScript, offering real-time updates, category-based filtering, and a seamless reading experience. Leveraging SSR and SSG for high performance and SEO optimization.",
      image:
        "https://plus.unsplash.com/premium_photo-1688561384438-bfa9273e2c00?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
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
      image:
        "https://i.postimg.cc/v8hKNVFG/1f41a369-a0b2-4b80-aaf3-bdbcc5f91580.webp",
      github: "https://github.com/BismayDey/maths",
      demo: "https://maths-five.vercel.app/",
      tags: ["Education", "Math", "Tools"],
    },
    {
      title: "Spotify Clone",
      description:
        "KAALO GAAN is a minimalist music player that allows users to search, play, and manage their favorite tracks seamlessly. With a clean interface and intuitive controls, it offers a smooth listening experience.",
      image:
        "https://i.postimg.cc/v8hKNVFG/1f41a369-a0b2-4b80-aaf3-bdbcc5f91580.webp",
      github: "https://github.com/BismayDey/music-player",
      demo: "https://music-player-zeta-pearl.vercel.app/",
      tags: ["Music", "Streaming", "React"],
    },
  ];

  const displayedProjects = showAllProjects
    ? allProjects
    : allProjects.slice(0, 6);

  return (
    <div className="relative w-full min-h-screen bg-black overflow-x-hidden">
      {/* 3D Background */}
      <div className="fixed inset-0">
        <Canvas
          className="pointer-events-auto"
          eventSource={canvasEventSource ?? undefined}
          eventPrefix="client"
        >
          <Suspense fallback={null}>
            <Scene />
          </Suspense>
        </Canvas>
      </div>

      {/* Navigation */}
      <div className="fixed top-0 left-0 right-0 p-4 md:p-6 z-50">
        <nav className="max-w-7xl mx-auto flex justify-between items-center text-white backdrop-blur-md bg-black/30 rounded-full px-6 md:px-8 py-3 md:py-4 border border-white/10">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="relative flex items-center gap-3"
          >
            <span className="text-2xl md:text-3xl font-black uppercase tracking-wide bg-gradient-to-r from-purple-300 via-pink-400 to-rose-400 bg-clip-text text-transparent drop-shadow-[0_0_18px_rgba(244,114,182,0.45)]">
              Bismay Dey
            </span>
          </motion.div>

          {/* Desktop Menu */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="hidden md:flex space-x-8"
          >
            <button
              onClick={() => scrollToSection(aboutRef)}
              className="hover:text-purple-400 transition-colors font-medium"
            >
              About
            </button>
            <button
              onClick={() => scrollToSection(experienceRef)}
              className="hover:text-purple-400 transition-colors font-medium"
            >
              Experience
            </button>
            <button
              onClick={() => scrollToSection(projectsRef)}
              className="hover:text-purple-400 transition-colors font-medium"
            >
              Projects
            </button>
            <button
              onClick={() => scrollToSection(certificatesRef)}
              className="hover:text-purple-400 transition-colors font-medium"
            >
              Certificates
            </button>
            <button
              onClick={() => scrollToSection(contactRef)}
              className="hover:text-purple-400 transition-colors font-medium"
            >
              Contact
            </button>
          </motion.div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2"
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
        </nav>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="md:hidden mt-4 backdrop-blur-md bg-black/30 rounded-2xl p-6 border border-white/10"
            >
              <div className="flex flex-col space-y-4 text-white">
                <button
                  onClick={() => scrollToSection(aboutRef)}
                  className="text-left hover:text-purple-400 transition-colors font-medium"
                >
                  About
                </button>
                <button
                  onClick={() => scrollToSection(experienceRef)}
                  className="text-left hover:text-purple-400 transition-colors font-medium"
                >
                  Experience
                </button>
                <button
                  onClick={() => scrollToSection(projectsRef)}
                  className="text-left hover:text-purple-400 transition-colors font-medium"
                >
                  Projects
                </button>
                <button
                  onClick={() => scrollToSection(certificatesRef)}
                  className="text-left hover:text-purple-400 transition-colors font-medium"
                >
                  Certificates
                </button>
                <button
                  onClick={() => scrollToSection(contactRef)}
                  className="text-left hover:text-purple-400 transition-colors font-medium"
                >
                  Contact
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Resume Buttons */}
      <div className="fixed bottom-6 md:bottom-8 left-0 right-0 z-50 flex justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row items-center gap-3 md:gap-4"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5 }}
            className="relative w-full sm:w-auto"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleDownloadResume}
              disabled={isDownloading}
              className={`flex items-center justify-center gap-2 md:gap-3 px-6 md:px-8 py-3 md:py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full text-white font-semibold shadow-lg w-full sm:w-auto
                ${
                  isDownloading
                    ? "opacity-75 cursor-wait"
                    : "hover:shadow-purple-500/25 hover:shadow-xl"
                }`}
            >
              <motion.div
                animate={isDownloading ? { rotate: 360 } : {}}
                transition={{
                  duration: 1,
                  repeat: isDownloading ? Infinity : 0,
                  ease: "linear",
                }}
              >
                <FileDown className="w-5 h-5 md:w-6 md:h-6" />
              </motion.div>
              <span className="text-sm md:text-base">
                {isDownloading ? "Downloading..." : "Download Resume"}
              </span>
            </motion.button>

            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={
                isDownloading
                  ? { scale: 1.2, opacity: 1 }
                  : { scale: 0, opacity: 0 }
              }
              className="absolute inset-0 rounded-full border-2 border-purple-500 border-t-transparent animate-spin"
            />
          </motion.div>

          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleViewResume}
            className="flex items-center justify-center gap-2 md:gap-3 px-6 md:px-8 py-3 md:py-4 bg-white/10 backdrop-blur-sm rounded-full text-white font-semibold
              hover:bg-white/20 transition-colors border border-white/20 w-full sm:w-auto"
          >
            <FileText className="w-5 h-5 md:w-6 md:h-6" />
            <span className="text-sm md:text-base">View Resume</span>
          </motion.button>
        </motion.div>
      </div>

      {/* Main Content */}
      <div className="relative z-10">
        {/* Hero Section - structured like other sections so it's visually divided */}
        <div className="min-h-screen bg-transparent px-4 md:px-8 py-16 md:py-24 flex items-center relative">
          {/* Shadow overlay at the bottom to create transition effect */}
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/90 to-transparent pointer-events-none z-0" />
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative z-10 max-w-7xl mx-auto w-full text-white"
          >
            {/* Intentionally left mostly empty — the Scene component renders the main hero title in 3D.
                This container provides consistent padding and a visual band like other sections. */}
          </motion.div>
        </div>

        {/* About Section - Bento Grid Layout */}
        <div
          ref={aboutRef}
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
                  {/* Profile Image */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2, type: "spring" }}
                    className="relative group"
                  >
                    <div className="relative w-40 h-40 md:w-48 md:h-48 rounded-full overflow-hidden border-4 border-purple-500/50 shadow-2xl shadow-purple-500/30 group-hover:border-pink-500/50 transition-all duration-300 bg-black/10 flex items-center justify-center">
                      <img
                        src={processedProfile ?? "/profile.jpg"}
                        alt="Bismay Dey"
                        className="w-full h-full object-cover transition-transform duration-500"
                        style={{ objectPosition: "center" }}
                        onError={(e) => {
                          e.currentTarget.src = `https://ui-avatars.com/api/?name=Bismay+Dey&size=400&background=9333ea&color=fff&bold=true`;
                        }}
                        loading="lazy"
                      />
                    </div>
                    {/* Decorative rings */}
                    <div className="absolute inset-0 rounded-full border-2 border-purple-500/30 animate-ping opacity-0 group-hover:opacity-100" />
                    <div className="absolute -inset-2 rounded-full border border-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
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
                      <div className="p-2 bg-purple-500/20 rounded-lg">
                        <Code2 className="w-5 h-5 md:w-6 md:h-6 text-purple-400" />
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
                    Hi, I'm a passionate Web Developer with a creative eye for
                    design and a love for building immersive digital
                    experiences. I specialize in crafting beautiful and
                    functional web applications using cutting-edge technologies
                    and modern design principles.
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
                <h3 className="text-2xl md:text-3xl font-bold mb-2">50+</h3>
                <p className="text-sm md:text-base text-gray-300">
                  Projects Completed
                </p>
                <div className="mt-4 pt-4 border-t border-white/10">
                  <h3 className="text-2xl md:text-3xl font-bold mb-2">1.5+</h3>
                  <p className="text-sm md:text-base text-gray-300">
                    Years Experience
                  </p>
                </div>
                <div className="mt-4 pt-4 border-t border-white/10">
                  <h3 className="text-2xl md:text-3xl font-bold mb-2">6+</h3>
                  <p className="text-sm md:text-base text-gray-300">
                    Intership Completed
                  </p>
                </div>
                <div className="mt-4 pt-4 border-t border-white/10">
                  <h3 className="text-2xl md:text-3xl font-bold mb-2">12+</h3>
                  <p className="text-sm md:text-base text-gray-300">
                    Freelance Projects Delivered
                  </p>
                </div>
                <div className="mt-4 pt-4 border-t border-white/10">
                  <h3 className="text-2xl md:text-3xl font-bold mb-2">10+</h3>
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
                  <span className="px-3 py-1.5 bg-sky-500/20 text-sky-300 rounded-full text-xs md:text-sm border border-sky-500/30">
                    Next.js
                  </span>
                  <span className="px-3 py-1.5 bg-blue-500/20 text-blue-300 rounded-full text-xs md:text-sm border border-blue-500/30">
                    React.js
                  </span>
                  <span className="px-3 py-1.5 bg-red-500/20 text-red-300 rounded-full text-xs md:text-sm border border-red-500/30">
                    Three.js
                  </span>
                  <span className="px-3 py-1.5 bg-blue-500/20 text-blue-300 rounded-full text-xs md:text-sm border border-blue-500/30">
                    TypeScript
                  </span>
                  <span className="px-3 py-1.5 bg-pink-500/20 text-pink-300 rounded-full text-xs md:text-sm border border-pink-500/30">
                    Tailwind
                  </span>
                  <span className="px-3 py-1.5 bg-purple-500/20 text-purple-300 rounded-full text-xs md:text-sm border border-purple-500/30">
                    React Native
                  </span>
                  <span className="px-3 py-1.5 bg-purple-500/20 text-purple-300 rounded-full text-xs md:text-sm border border-purple-500/30">
                    HTML
                  </span>
                  <span className="px-3 py-1.5 bg-yellow-500/20 text-yellow-300 rounded-full text-xs md:text-sm border border-yellow-500/30">
                    CSS
                  </span>
                  <span className="px-3 py-1.5 bg-purple-500/20 text-purple-300 rounded-full text-xs md:text-sm border border-purple-500/30">
                    Sass
                  </span>
                  <span className="px-3 py-1.5 bg-purple-500/20 text-purple-300 rounded-full text-xs md:text-sm border border-purple-500/30">
                    Bootstrap
                  </span>
                  <span className="px-3 py-1.5 bg-purple-500/20 text-purple-300 rounded-full text-xs md:text-sm border border-purple-500/30">
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
                  <span className="px-3 py-1.5 bg-green-500/20 text-green-300 rounded-full text-xs md:text-sm border border-green-500/30">
                    Node.js
                  </span>
                  <span className="px-3 py-1.5 bg-gray-700/20 text-red-300 rounded-full text-xs md:text-sm border border-gray-500/30">
                    Express.js
                  </span>
                  <span className="px-3 py-1.5 bg-yellow-500/20 text-yellow-300 rounded-full text-xs md:text-sm border border-yellow-500/30">
                    Python
                  </span>
                  <span className="px-3 py-1.5 bg-red-500/20 text-red-300 rounded-full text-xs md:text-sm border border-red-500/30">
                    Java
                  </span>
                  <span className="px-3 py-1.5 bg-indigo-500/20 text-indigo-300 rounded-full text-xs md:text-sm border border-indigo-500/30">
                    C
                  </span>
                  <span className="px-3 py-1.5 bg-indigo-500/20 text-indigo-300 rounded-full text-xs md:text-sm border border-indigo-500/30">
                    C++
                  </span>
                  <span className="px-3 py-1.5 bg-cyan-500/20 text-cyan-300 rounded-full text-xs md:text-sm border border-cyan-500/30">
                    Go
                  </span>
                  <span className="px-3 py-1.5 bg-pink-500/20 text-pink-300 rounded-full text-xs md:text-sm border border-pink-500/30">
                    Ruby
                  </span>
                  <span className="px-3 py-1.5 bg-purple-500/20 text-purple-300 rounded-full text-xs md:text-sm border border-purple-500/30">
                    PHP
                  </span>
                  <span className="px-3 py-1.5 bg-emerald-500/20 text-emerald-300 rounded-full text-xs md:text-sm border border-emerald-500/30">
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
                  <span className="px-3 py-1.5 bg-blue-500/20 text-blue-300 rounded-full text-xs md:text-sm border border-blue-500/30">
                    MongoDB
                  </span>
                  <span className="px-3 py-1.5 bg-orange-500/20 text-orange-300 rounded-full text-xs md:text-sm border border-orange-500/30">
                    Firebase
                  </span>

                  <span className="px-3 py-1.5 bg-blue-500/20 text-blue-300 rounded-full text-xs md:text-sm border border-blue-500/30">
                    PostgreSQL
                  </span>
                  <span className="px-3 py-1.5 bg-blue-500/20 text-blue-300 rounded-full text-xs md:text-sm border border-blue-500/30">
                    MySQL
                  </span>
                </div>
              </motion.div>
            </div>
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
                <span className="px-3 py-1.5 bg-emerald-500/20 text-emerald-300 rounded-full text-xs md:text-sm border border-emerald-500/30">
                  Shopify
                </span>
                <span className="px-3 py-1.5 bg-pink-500/20 text-pink-300 rounded-full text-xs md:text-sm border border-pink-500/30">
                  Figma
                </span>
                <span className="px-3 py-1.5 bg-yellow-500/20 text-yellow-300 rounded-full text-xs md:text-sm border border-yellow-500/30">
                  Wix
                </span>
                <span className="px-3 py-1.5 bg-gray-500/20 text-gray-300 rounded-full text-xs md:text-sm border border-gray-500/30">
                  Adobe
                </span>
                <span className="px-3 py-1.5 bg-fuchsia-500/20 text-fuchsia-300 rounded-full text-xs md:text-sm border border-fuchsia-500/30">
                  Canva
                </span>
                <span className="px-3 py-1.5 bg-indigo-500/20 text-indigo-300 rounded-full text-xs md:text-sm border border-indigo-500/30">
                  Unity
                </span>
                <span className="px-3 py-1.5 bg-blue-700/20 text-blue-400 rounded-full text-xs md:text-sm border border-blue-700/30">
                  Unreal Engine
                </span>
                <span className="px-3 py-1.5 bg-red-600/20 text-red-400 rounded-full text-xs md:text-sm border border-red-600/30">
                  Blender
                </span>
                <span className="px-3 py-1.5 bg-purple-600/20 text-purple-400 rounded-full text-xs md:text-sm border border-purple-600/30">
                  After Effects
                </span>
                <span className="px-3 py-1.5 bg-orange-500/20 text-orange-300 rounded-full text-xs md:text-sm border border-orange-500/30">
                  Premiere Pro
                </span>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Experience Section - Timeline Layout */}
        <div
          ref={experienceRef}
          className="min-h-screen bg-gradient-to-b from-black via-blue-900/10 to-black px-4 md:px-8 py-16 md:py-24"
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
              className="text-3xl md:text-4xl lg:text-5xl font-bold mb-12 md:mb-16 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent"
            >
              Experience
            </motion.h2>

            {/* Timeline */}
            <div className="relative">
              {/* Timeline Line - Hidden on mobile */}
              <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 w-0.5 h-full bg-gradient-to-b from-blue-500/50 via-purple-500/50 to-pink-500/50" />

              {/* Experience Items */}
              <div className="space-y-12 md:space-y-16">
                {/* Item 1 - PKL */}
                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  className="relative md:ml-[50%] md:pl-12"
                >
                  <div className="hidden md:block absolute left-0 top-8 w-4 h-4 bg-blue-500 rounded-full border-4 border-black transform -translate-x-[calc(50%+1.5rem)]" />

                  <motion.div
                    whileHover={{ scale: 1.02, y: -5 }}
                    className="bg-gradient-to-br from-blue-900/40 to-cyan-900/40 p-6 md:p-8 rounded-2xl backdrop-blur-sm border border-blue-500/30 shadow-lg shadow-blue-500/10"
                  >
                    <div className="flex items-start gap-4 mb-4">
                      <div className="p-3 bg-blue-500/20 rounded-xl">
                        <Briefcase className="w-6 h-6 text-blue-400" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl md:text-2xl font-bold mb-2">
                          Freelance Full-Stack Developer
                        </h3>
                        <div className="text-blue-400 font-semibold mb-2">
                          PKL
                        </div>
                        <div className="flex flex-wrap gap-3 text-sm text-gray-400 mb-4">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            Sep 2025 – Oct 2025
                          </span>
                        </div>
                        <ul className="text-gray-300 leading-relaxed space-y-3">
                          <li className="flex gap-3">
                            <span className="text-blue-400 mt-1.5 flex-shrink-0">
                              •
                            </span>
                            <span>
                              Developed the entire platform from scratch,
                              including frontend, backend, database, and
                              deployment — delivering a fully responsive LMS +
                              e-commerce + e-book store with seamless user
                              experience across all devices.
                            </span>
                          </li>
                          <li className="flex gap-3">
                            <span className="text-blue-400 mt-1.5 flex-shrink-0">
                              •
                            </span>
                            <span>
                              Developed admin and manager panels with real-time
                              monitoring, analytics dashboards, and content
                              management, enabling efficient control over
                              courses, orders, users, and payments.
                            </span>
                          </li>
                          <li className="flex gap-3">
                            <span className="text-blue-400 mt-1.5 flex-shrink-0">
                              •
                            </span>
                            <span>
                              Integrated Razorpay payment gateway, automated
                              course enrollment, order management, and live
                              tracking systems while ensuring secure, scalable,
                              and high-performing architecture with 99.9%
                              uptime.
                            </span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>

                {/* Item 2 - Shashwat Technologies */}
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  className="relative md:mr-[50%] md:pr-12"
                >
                  <div className="hidden md:block absolute right-0 top-8 w-4 h-4 bg-purple-500 rounded-full border-4 border-black transform translate-x-[calc(50%+1.5rem)]" />

                  <motion.div
                    whileHover={{ scale: 1.02, y: -5 }}
                    className="bg-gradient-to-br from-purple-900/40 to-pink-900/40 p-6 md:p-8 rounded-2xl backdrop-blur-sm border border-purple-500/30 shadow-lg shadow-purple-500/10"
                  >
                    <div className="flex items-start gap-4 mb-4">
                      <div className="p-3 bg-purple-500/20 rounded-xl">
                        <Code2 className="w-6 h-6 text-purple-400" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl md:text-2xl font-bold mb-2">
                          Full-Stack Developer
                        </h3>
                        <div className="text-purple-400 font-semibold mb-2">
                          Shashwat Technologies
                        </div>
                        <div className="flex flex-wrap gap-3 text-sm text-gray-400 mb-4">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            Sep 2025 – Sep 2025
                          </span>
                        </div>
                        <ul className="text-gray-300 leading-relaxed space-y-3">
                          <li className="flex gap-3">
                            <span className="text-purple-400 mt-1.5 flex-shrink-0">
                              •
                            </span>
                            <span>
                              Built and optimized Stayzaa's frontend and
                              backend, designing the About page and improving
                              Mapbox GL globe rendering efficiency by 30%,
                              boosting page performance and load times.
                            </span>
                          </li>
                          <li className="flex gap-3">
                            <span className="text-purple-400 mt-1.5 flex-shrink-0">
                              •
                            </span>
                            <span>
                              Delivered 100% scalable and maintainable code,
                              ensuring design consistency, responsive UI, and a
                              smooth user experience across desktop and mobile
                              platforms.
                            </span>
                          </li>
                          <li className="flex gap-3">
                            <span className="text-purple-400 mt-1.5 flex-shrink-0">
                              •
                            </span>
                            <span>
                              Collaborated with core team to ship new features,
                              resolve 90% of critical bugs, and deliver releases
                              on time with a focus on quality and ownership.
                            </span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>

                {/* Item 3 - RiseApply */}
                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  className="relative md:ml-[50%] md:pl-12"
                >
                  <div className="hidden md:block absolute left-0 top-8 w-4 h-4 bg-cyan-500 rounded-full border-4 border-black transform -translate-x-[calc(50%+1.5rem)]" />

                  <motion.div
                    whileHover={{ scale: 1.02, y: -5 }}
                    className="bg-gradient-to-br from-cyan-900/40 to-teal-900/40 p-6 md:p-8 rounded-2xl backdrop-blur-sm border border-cyan-500/30 shadow-lg shadow-cyan-500/10"
                  >
                    <div className="flex items-start gap-4 mb-4">
                      <div className="p-3 bg-cyan-500/20 rounded-xl">
                        <Rocket className="w-6 h-6 text-cyan-400" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl md:text-2xl font-bold mb-2">
                          Full-Stack Software Development Engineer Intern
                        </h3>
                        <a
                          href="https://riseapply.netlify.app/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-cyan-400 hover:text-cyan-300 transition-colors font-semibold flex items-center gap-2 mb-2"
                        >
                          RiseApply
                          <ExternalLink className="w-4 h-4" />
                        </a>
                        <div className="flex flex-wrap gap-3 text-sm text-gray-400 mb-4">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            Apr 2025 – Sep 2025
                          </span>
                        </div>
                        <ul className="text-gray-300 leading-relaxed space-y-3">
                          <li className="flex gap-3">
                            <span className="text-cyan-400 mt-1.5 flex-shrink-0">
                              •
                            </span>
                            <span>
                              Led the automation of manual workflows, boosting
                              operational efficiency by 90%.
                            </span>
                          </li>
                          <li className="flex gap-3">
                            <span className="text-cyan-400 mt-1.5 flex-shrink-0">
                              •
                            </span>
                            <span>
                              Built and scaled recruitment tools, marketing
                              platforms, and website builders using Next.js,
                              Node.js, and MongoDB.
                            </span>
                          </li>
                          <li className="flex gap-3">
                            <span className="text-cyan-400 mt-1.5 flex-shrink-0">
                              •
                            </span>
                            <span>
                              Developed and maintained scrapers, website,
                              databases, and a browser extension for automated
                              job data extraction.
                            </span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>

                {/* Item 4 - Echo of Pink */}
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  className="relative md:mr-[50%] md:pr-12"
                >
                  <div className="hidden md:block absolute right-0 top-8 w-4 h-4 bg-pink-500 rounded-full border-4 border-black transform translate-x-[calc(50%+1.5rem)]" />

                  <motion.div
                    whileHover={{ scale: 1.02, y: -5 }}
                    className="bg-gradient-to-br from-pink-900/40 to-rose-900/40 p-6 md:p-8 rounded-2xl backdrop-blur-sm border border-pink-500/30 shadow-lg shadow-pink-500/10"
                  >
                    <div className="flex items-start gap-4 mb-4">
                      <div className="p-3 bg-pink-500/20 rounded-xl">
                        <Globe className="w-6 h-6 text-pink-400" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl md:text-2xl font-bold mb-2">
                          Software Development Engineer
                        </h3>
                        <div className="text-pink-400 font-semibold mb-2">
                          Echo of Pink
                        </div>
                        <div className="flex flex-wrap gap-3 text-sm text-gray-400 mb-4">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            Aug 2025 – Sep 2025
                          </span>
                        </div>
                        <ul className="text-gray-300 leading-relaxed space-y-3">
                          <li className="flex gap-3">
                            <span className="text-pink-400 mt-1.5 flex-shrink-0">
                              •
                            </span>
                            <span>
                              Led the design, development, and optimization of
                              Echo of Pink's e-commerce platform on Shopify,
                              delivering a modern, fully responsive, and
                              conversion-focused shopping experience.
                            </span>
                          </li>
                          <li className="flex gap-3">
                            <span className="text-pink-400 mt-1.5 flex-shrink-0">
                              •
                            </span>
                            <span>
                              Built custom Shopify themes, automated workflows,
                              and API integrations for products, orders, and
                              payments — improving checkout efficiency and
                              boosting conversion rates by 20%.
                            </span>
                          </li>
                          <li className="flex gap-3">
                            <span className="text-pink-400 mt-1.5 flex-shrink-0">
                              •
                            </span>
                            <span>
                              Continuously enhanced site performance,
                              implemented data-driven UX improvements, and
                              collaborated with stakeholders to launch new
                              features that increased customer engagement and
                              online sales.
                            </span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>

                {/* Item 5 - TaxDeeds */}
                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  className="relative md:ml-[50%] md:pl-12"
                >
                  <div className="hidden md:block absolute left-0 top-8 w-4 h-4 bg-emerald-500 rounded-full border-4 border-black transform -translate-x-[calc(50%+1.5rem)]" />

                  <motion.div
                    whileHover={{ scale: 1.02, y: -5 }}
                    className="bg-gradient-to-br from-emerald-900/40 to-green-900/40 p-6 md:p-8 rounded-2xl backdrop-blur-sm border border-emerald-500/30 shadow-lg shadow-emerald-500/10"
                  >
                    <div className="flex items-start gap-4 mb-4">
                      <div className="p-3 bg-emerald-500/20 rounded-xl">
                        <BarChart3 className="w-6 h-6 text-emerald-400" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl md:text-2xl font-bold mb-2">
                          Data Engineer
                        </h3>
                        <div className="text-emerald-400 font-semibold mb-2">
                          TaxDeeds
                        </div>
                        <div className="flex flex-wrap gap-3 text-sm text-gray-400 mb-4">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            Jan 2025 – Aug 2025
                          </span>
                        </div>
                        <ul className="text-gray-300 leading-relaxed space-y-3">
                          <li className="flex gap-3">
                            <span className="text-emerald-400 mt-1.5 flex-shrink-0">
                              •
                            </span>
                            <span>
                              Managed project timelines, reducing delivery times
                              by 30%.
                            </span>
                          </li>
                          <li className="flex gap-3">
                            <span className="text-emerald-400 mt-1.5 flex-shrink-0">
                              •
                            </span>
                            <span>
                              Spearheaded the adoption of cutting-edge
                              engineering software, improving project accuracy
                              by 15%.
                            </span>
                          </li>
                          <li className="flex gap-3">
                            <span className="text-emerald-400 mt-1.5 flex-shrink-0">
                              •
                            </span>
                            <span>
                              Collaborated with cross-functional teams,
                              enhancing project success rates by 10%.
                            </span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>

                {/* Item 6 - Consult Easily */}
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  className="relative md:mr-[50%] md:pr-12"
                >
                  <div className="hidden md:block absolute right-0 top-8 w-4 h-4 bg-orange-500 rounded-full border-4 border-black transform translate-x-[calc(50%+1.5rem)]" />

                  <motion.div
                    whileHover={{ scale: 1.02, y: -5 }}
                    className="bg-gradient-to-br from-orange-900/40 to-amber-900/40 p-6 md:p-8 rounded-2xl backdrop-blur-sm border border-orange-500/30 shadow-lg shadow-orange-500/10"
                  >
                    <div className="flex items-start gap-4 mb-4">
                      <div className="p-3 bg-orange-500/20 rounded-xl">
                        <Globe className="w-6 h-6 text-orange-400" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl md:text-2xl font-bold mb-2">
                          Freelance Full-Stack Developer
                        </h3>
                        <a
                          href="https://consulteasily.com"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-orange-400 hover:text-orange-300 transition-colors font-semibold flex items-center gap-2 mb-2"
                        >
                          Consult Easily
                          <ExternalLink className="w-4 h-4" />
                        </a>
                        <div className="flex flex-wrap gap-3 text-sm text-gray-400 mb-4">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            Mar 2025 – Apr 2025
                          </span>
                        </div>
                        <ul className="text-gray-300 leading-relaxed space-y-3">
                          <li className="flex gap-3">
                            <span className="text-orange-400 mt-1.5 flex-shrink-0">
                              •
                            </span>
                            <span>
                              Built the entire website from scratch, including
                              responsive UI and seamless user experience.
                            </span>
                          </li>
                          <li className="flex gap-3">
                            <span className="text-orange-400 mt-1.5 flex-shrink-0">
                              •
                            </span>
                            <span>
                              Developed robust APIs and set up a scalable
                              backend with secure database integration.
                            </span>
                          </li>
                          <li className="flex gap-3">
                            <span className="text-orange-400 mt-1.5 flex-shrink-0">
                              •
                            </span>
                            <span>
                              Handled full-stack development end-to-end,
                              including deployment and performance optimization.
                            </span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Projects Section - Masonry Grid */}
        <div
          ref={projectsRef}
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
                  className="group bg-white/5 rounded-2xl overflow-hidden backdrop-blur-sm border border-white/10 hover:border-pink-500/50 transition-all duration-300"
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
                    icon: Phone,
                    label: "Call Me",
                    value: "+91 8100314152",
                    href: "tel:+918100314152",
                    color: "from-green-500 to-emerald-500",
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
    </div>
  );
}

export default App;
