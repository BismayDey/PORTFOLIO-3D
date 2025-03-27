import React, { Suspense, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Scene } from "./components/Scene";
import {
  Brain,
  Code2,
  Rocket,
  Gamepad2,
  SquareCode,
  Mail,
  Github,
  Linkedin,
  Phone,
  Instagram,
  Award,
  ExternalLink,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function App() {
  const aboutRef = useRef<HTMLDivElement>(null);
  const projectsRef = useRef<HTMLDivElement>(null);
  const contactRef = useRef<HTMLDivElement>(null);
  const certificatesRef = useRef<HTMLDivElement>(null);
  const [selectedCertificate, setSelectedCertificate] = useState<number | null>(
    null
  );
  const certificates = [
    {
      id: 1,
      title: "Participation Certificate",
      issuer: "Iemhacks 3.0",
      date: "2025",
      image: "/IEM.jpg",
      imageSizes: {
        thumbnail: "/certificates/web-dev-cert-thumb.jpg",
        full: "/IEM.jpg",
      },
    },
    {
      id: 2,
      title: "React Development",
      issuer: "Meta",
      date: "2024",
      image: "/certificates/react-cert.jpg",
      imageSizes: {
        thumbnail: "/certificates/react-cert-thumb.jpg",
        full: "/certificates/react-cert.jpg",
      },
    },
    {
      id: 3,
      title: "Full Stack Development",
      issuer: "Udacity",
      date: "2023",
      image: "/certificates/fullstack-cert.jpg",
      imageSizes: {
        thumbnail: "/certificates/fullstack-cert-thumb.jpg",
        full: "/certificates/fullstack-cert.jpg",
      },
    },
  ];
  const scrollToSection = (ref: React.RefObject<HTMLDivElement>) => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="relative w-full min-h-screen bg-black overflow-x-hidden">
      <div className="fixed inset-0">
        <Canvas>
          <Suspense fallback={null}>
            <Scene />
          </Suspense>
        </Canvas>
      </div>

      <div className="fixed top-0 left-0 right-0 p-6 z-50">
        <nav className="max-w-6xl mx-auto flex justify-between items-center text-white backdrop-blur-sm bg-black/20 rounded-full px-8 py-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-xl font-bold"
          >
            Bismay Dey
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-x-6 hidden md:block"
          >
            <button
              onClick={() => scrollToSection(aboutRef)}
              className="hover:text-purple-400 transition-colors"
            >
              About
            </button>
            <button
              onClick={() => scrollToSection(projectsRef)}
              className="hover:text-purple-400 transition-colors"
            >
              Projects
            </button>
            <button
              onClick={() => scrollToSection(certificatesRef)}
              className="hover:text-purple-400 transition-colors"
            >
              Certificates
            </button>
            <button
              onClick={() => scrollToSection(contactRef)}
              className="hover:text-purple-400 transition-colors"
            >
              Contact
            </button>
          </motion.div>
        </nav>
      </div>

      <div className="relative z-10">
        <div className="h-screen" />

        <div
          ref={aboutRef}
          className="min-h-screen bg-gradient-to-b from-black via-purple-900/20 to-black px-8 py-24"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-6xl mx-auto text-white"
          >
            <h2 className="text-3xl font-bold mb-8">About Me</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="space-y-6">
                <p className="text-lg text-gray-300">
                  Hi, I'm{" "}
                  <span className="text-purple-400 font-semibold">
                    Bismay Dey
                  </span>
                  , a passionate Web Developer with a creative eye for design
                  and a love for building immersive digital experiences. I
                  specialize in crafting beautiful and functional web
                  applications using cutting-edge technologies and modern design
                  principles.
                </p>
                <div className="flex flex-wrap gap-4">
                  <div className="bg-purple-900/30 px-4 py-2 rounded-lg hover:bg-sky-900/50 transition-colors cursor-default">
                    Next.js
                  </div>
                  <div className="bg-purple-900/30 px-4 py-2 rounded-lg hover:bg-blue-900/50 transition-colors cursor-default">
                    React.js
                  </div>
                  <div className="bg-purple-900/30 px-4 py-2 rounded-lg hover:bg-red-900/50 transition-colors cursor-default">
                    Three.js
                  </div>
                  <div className="bg-purple-900/30 px-4 py-2 rounded-lg hover:bg-sky-900/50 transition-colors cursor-default">
                    TypeScript
                  </div>
                  <div className="bg-purple-900/30 px-4 py-2 rounded-lg hover:bg-pink-900/50 transition-colors cursor-default">
                    Tailwind CSS
                  </div>
                  <div className="bg-purple-900/30 px-4 py-2 rounded-lg hover:bg-yellow-900/50 transition-colors cursor-default">
                    JavaScript
                  </div>
                  <div className="bg-purple-900/30 px-4 py-2 rounded-lg hover:bg-green-900/50 transition-colors cursor-default">
                    Node.js
                  </div>
                  <div className="bg-purple-900/30 px-4 py-2 rounded-lg hover:bg-green-900/50 transition-colors cursor-default">
                    MongoDB
                  </div>
                  <div className="bg-purple-900/30 px-4 py-2 rounded-lg hover:bg-blue-900/50 transition-colors cursor-default">
                    MySQL
                  </div>
                  <div className="bg-purple-900/30 px-4 py-2 rounded-lg hover:bg-blue-900/50 transitblueion-colors cursor-default">
                    Python
                  </div>
                  <div className="bg-purple-900/30 px-4 py-2 rounded-lg hover:bg-orange-900/50 transition-colors cursor-default">
                    Java
                  </div>
                  <div className="bg-purple-900/30 px-4 py-2 rounded-lg hover:bg-blue-900/50 transition-colors cursor-default">
                    C
                  </div>
                </div>
              </div>
              <div className="space-y-6">
                <h3 className="text-xl font-semibold">Experience</h3>
                <div className="space-y-4">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="bg-white/5 p-6 rounded-lg backdrop-blur-sm"
                  >
                    <h4 className="font-semibold">Web Developer</h4>
                    <p className="text-gray-400">
                      Creating responsive and interactive web applications with
                      modern frameworks
                    </p>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        <div
          ref={projectsRef}
          className="min-h-screen bg-gradient-to-b from-black via-pink-900/20 to-black px-8 py-24"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-6xl mx-auto text-white"
          >
            <h2 className="text-3xl font-bold mb-8">Projects</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-white/5 rounded-lg overflow-hidden"
              >
                <img
                  src="https://i.postimg.cc/KzBCpq7z/938d8d08-d966-4f84-9a64-156fb136883d.webp"
                  alt="AI Project"
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="font-semibold text-xl mb-2">E-Commerce</h3>
                  <p className="text-gray-400 mb-4">
                    A modern e-commerce platform built with Next.js and
                    TypeScript, designed for speed, scalability, and a seamless
                    shopping experience. It features a dynamic product listing,
                    an optimized cart system, and a responsive UI with dark mode
                    support. Leveraging server-side rendering (SSR) and static
                    site generation (SSG).
                  </p>
                  <div className="flex justify-between items-center">
                    <a
                      href="https://github.com/BismayDey/ECOM-SIE"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-2 hover:text-purple-400 transition-colors"
                    >
                      <Github className="w-5 h-5" />
                      <span>Code</span>
                    </a>
                    <a
                      href="https://ecom4-0.vercel.app/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-2 hover:text-red-400 transition-colors"
                    >
                      <ExternalLink className="w-5 h-5" />
                      <span>Live Demo</span>
                    </a>
                  </div>
                </div>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-white/5 rounded-lg overflow-hidden"
              >
                <img
                  src="https://i.postimg.cc/cLQMP7qC/df13d6b5-239b-442c-84fb-8703cf97ce1b.webp"
                  alt="ML Project"
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="font-semibold text-xl mb-2">Chatting Room</h3>
                  <p className="text-gray-400 mb-4">
                    Simple and intuitive real-time chatting platform built with
                    Next.js and TypeScript. It enables seamless communication
                    with live messaging, user avatars, and a clean UI, making
                    conversations effortless and engaging.
                  </p>
                  <div className="flex justify-between items-center">
                    <a
                      href="https://github.com/BismayDey/chat"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-2 hover:text-purple-400 transition-colors"
                    >
                      <Github className="w-5 h-5" />
                      <span>Code</span>
                    </a>
                    <a
                      href="https://chat-git-master-bismay-deys-projects.vercel.app/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-2 hover:text-red-400 transition-colors"
                    >
                      <ExternalLink className="w-5 h-5" />
                      <span>Live Demo</span>
                    </a>
                  </div>
                </div>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-white/5 rounded-lg overflow-hidden"
              >
                <img
                  src="https://i.postimg.cc/fyspGc5v/30017f60-9e65-41c2-b92e-8557ddefadf0.webp"
                  alt="E-Commerce Project"
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="font-semibold text-xl mb-2">
                    Operating System
                  </h3>
                  <p className="text-gray-400 mb-4">
                    Futuristic web-based operating system built using Next.js,
                    designed to simulate a real OS experience within the
                    browser. It features a dynamic multi-window system,
                    draggable apps, a taskbar, and a responsive UI, delivering a
                    seamless and interactive user experience.
                  </p>
                  <div className="flex justify-between items-center">
                    <a
                      href="https://github.com/BismayDey/OS"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-2 hover:text-purple-400 transition-colors"
                    >
                      <Github className="w-5 h-5" />
                      <span>Code</span>
                    </a>
                    <a
                      href="https://os-swart.vercel.app/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-2 hover:text-red-400 transition-colors"
                    >
                      <ExternalLink className="w-5 h-5" />
                      <span>Live Demo</span>
                    </a>
                  </div>
                </div>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-white/5 rounded-lg overflow-hidden"
              >
                <img
                  src="https://i.postimg.cc/5NQXRxc2/1ea760eb-3f1f-4a80-b6fd-42c4908c74c2.webp"
                  alt="ML Project"
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="font-semibold text-xl mb-2">
                    Freelancing Site
                  </h3>
                  <p className="text-gray-400 mb-4">
                    Modern freelancing platform built using Next.js and
                    TypeScript, designed to connect clients with talented
                    freelancers efficiently. The platform offers a seamless job
                    posting system, real-time chat, secure payments, and a
                    user-friendly dashboard for both freelancers and employers.
                  </p>
                  <div className="flex justify-between items-center">
                    <a
                      href="https://github.com/BismayDey/Freelancing-Site"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-2 hover:text-purple-400 transition-colors"
                    >
                      <Github className="w-5 h-5" />
                      <span>Code</span>
                    </a>
                    <a
                      href="https://sjsz9bxxkvpge6q4.vercel.app/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-2 hover:text-red-400 transition-colors"
                    >
                      <ExternalLink className="w-5 h-5" />
                      <span>Live Demo</span>
                    </a>
                  </div>
                </div>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-white/5 rounded-lg overflow-hidden"
              >
                <img
                  src="https://i.postimg.cc/3wKhGH2B/6af74105-fc41-49a0-b62d-c47be64aa562.webp"
                  alt="E-Commerce Project"
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="font-semibold text-xl mb-2">
                    Code Generator and Editor
                  </h3>
                  <p className="text-gray-400 mb-4">
                    Powerful web-based code generator and editor built with
                    Next.js and TypeScript, offering a seamless coding
                    experience in the browser. It supports multiple programming
                    languages, syntax highlighting, real-time editing, and code
                    generation for various use cases.
                  </p>
                  <div className="flex justify-between items-center">
                    <a
                      href="https://github.com/BismayDey/codegen"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-2 hover:text-purple-400 transition-colors"
                    >
                      <Github className="w-5 h-5" />
                      <span>Code</span>
                    </a>
                    <a
                      href="https://codegen-rose.vercel.app/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-2 hover:text-red-400 transition-colors"
                    >
                      <ExternalLink className="w-5 h-5" />
                      <span>Live Demo</span>
                    </a>
                  </div>
                </div>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-white/5 rounded-lg overflow-hidden"
              >
                <img
                  src="https://i.postimg.cc/v8hKNVFG/1f41a369-a0b2-4b80-aaf3-bdbcc5f91580.webp"
                  alt="E-Commerce Project"
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="font-semibold text-xl mb-2">
                    3D Solar System
                  </h3>
                  <p className="text-gray-400 mb-4">
                    3D solar system made using Next.js and three.js
                  </p>
                  <div className="flex justify-between items-center">
                    <a
                      href="https://github.com/BismayDey/solar"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-2 hover:text-purple-400 transition-colors"
                    >
                      <Github className="w-5 h-5" />
                      <span>Code</span>
                    </a>
                    <a
                      href="https://solar-lovat-rho.vercel.app/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-2 hover:text-red-400 transition-colors"
                    >
                      <ExternalLink className="w-5 h-5" />
                      <span>Live Demo</span>
                    </a>
                  </div>
                </div>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-white/5 rounded-lg overflow-hidden"
              >
                <img
                  src="https://plus.unsplash.com/premium_photo-1688561384438-bfa9273e2c00?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  alt="E-Commerce Project"
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="font-semibold text-xl mb-2">News Website</h3>
                  <p className="text-gray-400 mb-4">
                    Fast and dynamic news website built with Next.js and
                    TypeScript, offering real-time updates, category-based
                    filtering, and a seamless reading experience. Leveraging
                    server-side rendering (SSR) and static site generation
                    (SSG), it ensures high performance and SEO optimization for
                    the latest news articles.
                  </p>
                  <div className="flex justify-between items-center">
                    <a
                      href="https://github.com/BismayDey/News"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-2 hover:text-purple-400 transition-colors"
                    >
                      <Github className="w-5 h-5" />
                      <span>Code</span>
                    </a>
                    <a
                      href="https://v0-spotify-y0hzcsy2n9f-9af5zg.vercel.app/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-2 hover:text-red-400 transition-colors"
                    >
                      <ExternalLink className="w-5 h-5" />
                      <span>Live Demo</span>
                    </a>
                  </div>
                </div>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-white/5 rounded-lg overflow-hidden"
              >
                <img
                  src="https://i.postimg.cc/2SfKKFc9/fc3534cb-64c2-46f2-bbda-73701c0cf749.webp"
                  alt="E-Commerce Project"
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="font-semibold text-xl mb-2">FREEZZZ</h3>
                  <p className="text-gray-400 mb-4">
                    FREEZZZ is a modern freelancing platform built using Next.js
                    and TypeScript, designed to seamlessly connect freelancers
                    with clients. It provides an intuitive user experience with
                    job postings, real-time chat, secure payments, and profile
                    management.
                  </p>
                  <div className="flex justify-between items-center">
                    <a
                      href="https://github.com/BismayDey/OS"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-2 hover:text-purple-400 transition-colors"
                    >
                      <Github className="w-5 h-5" />
                      <span>Code</span>
                    </a>
                    <a
                      href="https://os-swart.vercel.app/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-2 hover:text-red-400 transition-colors"
                    >
                      <ExternalLink className="w-5 h-5" />
                      <span>Live Demo</span>
                    </a>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>

        <div
          ref={certificatesRef}
          className="min-h-screen bg-gradient-to-b from-black via-blue-900/20 to-black px-8 py-24"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-6xl mx-auto text-white"
          >
            <h2 className="text-3xl font-bold mb-12">
              Certifications & Achievements
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {certificates.map((certificate) => (
                <motion.div
                  key={certificate.id}
                  whileHover={{ scale: 1.02 }}
                  className="bg-white/5 rounded-xl overflow-hidden backdrop-blur-sm border border-white/10 cursor-pointer"
                  onClick={() => setSelectedCertificate(certificate.id)}
                >
                  <div className="relative aspect-[4/3]">
                    <img
                      src={certificate.imageSizes.thumbnail}
                      alt={certificate.title}
                      className="w-full h-full object-contain bg-black/40"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Award className="w-5 h-5 text-blue-400" />
                        <span className="text-sm text-blue-300">
                          {certificate.issuer}
                        </span>
                      </div>
                      <h3 className="text-lg font-semibold text-white">
                        {certificate.title}
                      </h3>
                      <p className="text-sm text-gray-300 mt-1">
                        {certificate.date}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
        <div
          ref={contactRef}
          className="min-h-screen bg-gradient-to-b from-black via-green-900/20 to-black px-8 py-24"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-6xl mx-auto text-white"
          >
            <h2 className="text-3xl font-bold mb-8">Contact</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="space-y-6">
                <p className="text-lg text-gray-300">
                  I'm always interested in hearing about new projects and
                  opportunities. Feel free to reach out if you'd like to connect
                  or discuss potential collaborations.
                </p>
                <div className="flex flex-wrap gap-4">
                  <a
                    href="mailto:bismaydey001@gmail.com"
                    className="flex items-center space-x-2 bg-white/10 px-6 py-3 rounded-lg hover:bg-white/20 transition-colors"
                  >
                    <Mail className="w-5 h-5" />
                    <span>Email Me</span>
                  </a>
                  <a
                    href="https://github.com/BismayDey"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 bg-white/10 px-6 py-3 rounded-lg hover:bg-white/20 transition-colors"
                  >
                    <Github className="w-5 h-5" />
                    <span>GitHub</span>
                  </a>
                  <a
                    href="https://www.linkedin.com/in/bismay-dey-634937268/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 bg-white/10 px-6 py-3 rounded-lg hover:bg-white/20 transition-colors"
                  >
                    <Linkedin className="w-5 h-5" />
                    <span>LinkedIn</span>
                  </a>
                  <a
                    href="https://www.instagram.com/carbon_alternater/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 bg-white/10 px-6 py-3 rounded-lg hover:bg-white/20 transition-colors"
                  >
                    <Instagram className="w-5 h-5" />
                    <span>Intagram</span>
                  </a>
                  <a
                    href="tel:+918100314152"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 bg-white/10 px-6 py-3 rounded-lg hover:bg-white/20 transition-colors"
                  >
                    <Phone className="w-5 h-5" />
                    <span>Phone</span>
                  </a>
                </div>
              </div>
              <div className="bg-white/5 p-8 rounded-lg">
                <div className="flex flex-wrap gap-6 mb-6">
                  <div className="flex items-center space-x-2 bg-purple-900/50 px-4 py-2 rounded-full">
                    <Code2 className="w-5 h-5" />
                    <span>Web Developer</span>
                  </div>
                  <div className="flex items-center space-x-2 bg-red-900/50 px-4 py-2 rounded-full">
                    <SquareCode className="w-5 h-5" />
                    <span>Backend Developer</span>
                  </div>
                  <div className="flex items-center space-x-2 bg-orange-900/50 px-4 py-2 rounded-full">
                    <Brain className="w-5 h-5" />
                    <span>AI/ML Engineer</span>
                  </div>
                  <div className="flex items-center space-x-2 bg-green-900/50 px-4 py-2 rounded-full">
                    <Rocket className="w-5 h-5" />
                    <span>Tech Enthusiast</span>
                  </div>
                  <div className="flex items-center space-x-2 bg-blue-900/50 px-4 py-2 rounded-full">
                    <Gamepad2 className="w-5 h-5" />
                    <span>Gamer</span>
                  </div>
                </div>
                <p className="text-gray-400">
                  Kolkata
                  <br />
                  Available for freelance and full-time opportunities
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      <AnimatePresence>
        {selectedCertificate && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/95"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-[95vw] h-[95vh] bg-white/5 rounded-2xl overflow-hidden backdrop-blur-sm"
            >
              <div className="absolute top-4 left-4 right-4 z-10 flex justify-between items-center">
                <button
                  onClick={() => setSelectedCertificate(null)}
                  className="p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="h-full w-full flex items-center justify-center p-12">
                <img
                  src={
                    certificates.find((c) => c.id === selectedCertificate)
                      ?.imageSizes.full
                  }
                  alt={
                    certificates.find((c) => c.id === selectedCertificate)
                      ?.title
                  }
                  className="max-w-full max-h-full object-contain"
                />
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black via-black/80 to-transparent">
                <div className="flex items-center gap-2 mb-2">
                  <Award className="w-6 h-6 text-blue-400" />
                  <span className="text-lg text-blue-300">
                    {
                      certificates.find((c) => c.id === selectedCertificate)
                        ?.issuer
                    }
                  </span>
                </div>
                <h3 className="text-2xl font-semibold text-white">
                  {
                    certificates.find((c) => c.id === selectedCertificate)
                      ?.title
                  }
                </h3>
                <p className="text-lg text-gray-300 mt-2">
                  {certificates.find((c) => c.id === selectedCertificate)?.date}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
