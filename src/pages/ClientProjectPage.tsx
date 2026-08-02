import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion, AnimatePresence, useScroll, useSpring } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  CheckCircle2,
  ExternalLink,
  Globe,
  Layers,
  Sparkles,
  Target,
  TrendingUp,
  X,
} from "lucide-react";
import { clientProjects, getClientProject } from "../data/clientProjects";
import { ACCENTS } from "../components/ClientProjectCard";
import { SiteClip } from "../components/SiteClip";
import { SITE_URL, useSeo } from "../lib/seo";

export default function ClientProjectPage() {
  const { slug } = useParams();
  const project = getClientProject(slug);
  const [lightbox, setLightbox] = useState<string | null>(null);

  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setLightbox(null);
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [lightbox]);

  const a = ACCENTS[project?.accent ?? "indigo"] ?? ACCENTS.indigo;

  useSeo({
    title: project
      ? `${project.name} — ${project.sector} Case Study | Bismay Dey`
      : "Project not found | Bismay Dey",
    description: project
      ? `${project.summary} Built by Bismay Dey — ${project.role}, ${project.stack
          .slice(0, 4)
          .join(", ")}.`
      : "This case study could not be found.",
    path: `/client/${slug ?? ""}`,
    image: project?.screenshots[0]
      ? `${SITE_URL}${project.screenshots[0]}`
      : undefined,
    type: "article",
    jsonLd: project
      ? {
          "@context": "https://schema.org",
          "@type": "CreativeWork",
          name: project.name,
          headline: `${project.name} — ${project.sector} case study`,
          description: project.summary,
          url: `${SITE_URL}/client/${project.slug}`,
          image: project.screenshots.map((s) => `${SITE_URL}${s}`),
          video: {
            "@type": "VideoObject",
            name: `${project.name} — site walkthrough`,
            description: `A recorded scroll-through of ${project.domain}.`,
            contentUrl: `${SITE_URL}/clips/${project.slug}.webm`,
            thumbnailUrl: project.screenshots[0]
              ? `${SITE_URL}${project.screenshots[0]}`
              : undefined,
            uploadDate: `${project.year}-01-01`,
          },
          dateCreated: project.year,
          keywords: [...project.tags, ...project.stack].join(", "),
          creator: {
            "@type": "Person",
            name: "Bismay Dey",
            jobTitle: "Full-Stack Developer",
            url: SITE_URL,
          },
          about: { "@type": "Thing", name: project.sector },
          mainEntityOfPage: `${SITE_URL}/client/${project.slug}`,
        }
      : undefined,
  });

  if (!project) {
    return (
      <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-6 text-center">
        <h1 className="text-4xl font-bold mb-4">Case study not found</h1>
        <p className="text-gray-400 mb-8">
          That project does not exist or has been renamed.
        </p>
        <Link
          to="/"
          className="px-6 py-3 rounded-full bg-indigo-600 font-semibold"
        >
          Back to portfolio
        </Link>
      </main>
    );
  }

  const others = clientProjects.filter((p) => p.slug !== project.slug).slice(0, 3);
  const clip = `/clips/${project.slug}.webm`;

  return (
    <main className="min-h-screen bg-black text-white selection:bg-white/20">
      {/* scroll progress */}
      <motion.div
        style={{ scaleX: progress }}
        className={`fixed top-0 left-0 right-0 h-[3px] origin-left z-50 bg-gradient-to-r ${a.button}`}
      />

      <nav
        aria-label="Breadcrumb"
        className="sticky top-0 z-40 backdrop-blur-xl bg-black/70 border-b border-white/10"
      >
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between gap-4">
          <Link
            to="/"
            className="group inline-flex items-center gap-2 text-sm text-gray-300 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="hidden sm:inline">Back to portfolio</span>
            <span className="sm:hidden">Back</span>
          </Link>
          <a
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r ${a.button} text-sm font-semibold shadow-lg hover:brightness-110 hover:scale-105 transition-all`}
          >
            Visit live site
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </nav>

      {/* Hero */}
      <header className="relative overflow-hidden px-4 md:px-8 pt-16 pb-12 md:pt-24 md:pb-16">
        <div
          className={`absolute -top-40 left-1/4 w-[38rem] h-[38rem] ${a.glow} rounded-full blur-[130px] opacity-50 pointer-events-none`}
        />
        <div
          className="absolute inset-0 opacity-[0.06] pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
            maskImage:
              "radial-gradient(ellipse 70% 50% at 50% 0%, black 20%, transparent 70%)",
            WebkitMaskImage:
              "radial-gradient(ellipse 70% 50% at 50% 0%, black 20%, transparent 70%)",
          }}
        />

        <div className="relative z-10 max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-wrap items-center gap-3 mb-6"
          >
            <span
              className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border ${a.chip}`}
            >
              <Sparkles className="w-3 h-3" />
              {project.sector}
            </span>
            {project.ownDomain && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-white/5 border border-white/15 text-gray-300">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                Live in production
              </span>
            )}
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className={`text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6 leading-[0.95] bg-gradient-to-br ${a.title} bg-clip-text text-transparent`}
          >
            {project.name}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl md:text-2xl text-gray-300 max-w-3xl leading-relaxed mb-10"
          >
            {project.tagline}
          </motion.p>

          <motion.dl
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4"
          >
            {[
              { icon: Target, label: "Role", value: project.role },
              { icon: Calendar, label: "Year", value: project.year },
              { icon: Globe, label: "Live at", value: project.domain },
              {
                icon: Layers,
                label: "Sector",
                value: project.sector.split(" · ")[0],
              },
            ].map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.05 }}
                className="group bg-white/[0.04] border border-white/10 rounded-2xl p-4 backdrop-blur-sm hover:bg-white/[0.08] hover:border-white/25 transition-all"
              >
                <dt className="flex items-center gap-2 text-[11px] uppercase tracking-wider text-gray-500 mb-2">
                  <item.icon className={`w-3.5 h-3.5 ${a.iconText}`} />
                  {item.label}
                </dt>
                <dd className="text-sm font-semibold text-white break-words">
                  {item.value}
                </dd>
              </motion.div>
            ))}
          </motion.dl>
        </div>
      </header>

      {/* Walkthrough video */}
      <section className="px-4 md:px-8 mb-20 md:mb-28">
        <div className="max-w-6xl mx-auto">
          <SiteClip
            src={clip}
            poster={project.screenshots[0]}
            label={project.domain}
            accentText={a.iconText}
            accentBorder={a.border}
          />
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 md:px-8 pb-24">
        {/* Challenge */}
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          className="mb-20 md:mb-28"
        >
          <div className="relative rounded-3xl border border-purple-400/30 bg-gradient-to-br from-purple-950/60 via-[#140d20] to-[#0d0a14] p-6 sm:p-9 md:p-12 overflow-hidden shadow-2xl shadow-purple-900/30">
            <div className="absolute -top-24 -left-16 w-72 h-72 bg-purple-500/25 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute -bottom-28 -right-16 w-80 h-80 bg-fuchsia-500/15 rounded-full blur-[110px] pointer-events-none" />

            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <span className="w-2 h-2 rounded-full bg-purple-300 animate-pulse" />
                <h2 className="text-[11px] sm:text-xs uppercase tracking-[0.28em] font-semibold text-purple-200">
                  The brief
                </h2>
                <span className="h-px flex-1 bg-gradient-to-r from-purple-400/40 to-transparent" />
              </div>

              <div className="flex gap-4 sm:gap-6">
                <span
                  aria-hidden="true"
                  className="hidden sm:block text-6xl md:text-7xl leading-[0.8] font-serif text-purple-400/40 select-none"
                >
                  &ldquo;
                </span>
                <p className="text-lg sm:text-xl md:text-2xl lg:text-[28px] leading-[1.55] text-purple-50 font-light">
                  {project.challenge}
                </p>
              </div>
            </div>
          </div>
        </motion.section>

        {/* What I built */}
        <section className="mb-20 md:mb-28">
          <motion.h2
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold mb-10 tracking-tight"
          >
            What I built
          </motion.h2>
          <ul className="max-w-4xl divide-y divide-white/10 border-y border-white/10">
            {project.work.map((item, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: Math.min(i * 0.05, 0.3) }}
                className="group flex gap-5 py-6 hover:bg-white/[0.03] px-2 -mx-2 rounded-lg transition-colors"
              >
                <span
                  className={`text-xs font-mono ${a.iconText} pt-1.5 opacity-60 group-hover:opacity-100 transition-opacity`}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <CheckCircle2
                  className={`w-5 h-5 mt-0.5 flex-shrink-0 ${a.iconText}`}
                />
                <span className="text-gray-300 leading-relaxed group-hover:text-white transition-colors">
                  {item}
                </span>
              </motion.li>
            ))}
          </ul>
        </section>

        {/* Gallery */}
        {project.screenshots.length > 1 && (
          <section className="mb-20 md:mb-28">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-10"
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-3 tracking-tight">
                Inside the build
              </h2>
              <p className="text-gray-400 text-lg">
                Captured from the live site at {project.domain}.
              </p>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {project.screenshots.slice(1).map((shot, i) => (
                <motion.button
                  key={shot}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: (i % 2) * 0.1 }}
                  onClick={() => setLightbox(shot)}
                  className={`group relative rounded-2xl overflow-hidden border ${a.border} bg-black/40 cursor-zoom-in`}
                >
                  <img
                    src={shot}
                    alt={`${project.name} interface detail ${i + 1}`}
                    loading="lazy"
                    width={1440}
                    height={900}
                    className="w-full group-hover:scale-[1.04] transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <span className="absolute bottom-4 left-4 text-xs font-medium text-white opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                    Click to enlarge
                  </span>
                </motion.button>
              ))}
            </div>
          </section>
        )}

        {/* Features */}
        <section className="mb-20 md:mb-28">
          <motion.h2
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold mb-10 tracking-tight"
          >
            Key features
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5 items-stretch">
            {project.features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: (i % 2) * 0.08 }}
                className="group relative flex gap-5 bg-[#0e0e11] border border-white/[0.14] rounded-2xl p-6 md:p-7 overflow-hidden shadow-xl shadow-black/60 hover:border-white/30 hover:-translate-y-1 transition-all duration-300"
              >
                {/* accent rail — reads as a solid card edge instead of an outline on black */}
                <span
                  className={`absolute left-0 top-6 bottom-6 w-[3px] rounded-r-full ${a.iconBg.split(" ")[0]} opacity-70 group-hover:opacity-100 group-hover:top-3 group-hover:bottom-3 transition-all duration-300`}
                />
                <div
                  className={`absolute -right-12 -top-12 w-32 h-32 ${a.glow} rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                />

                <span
                  className={`relative z-10 flex-shrink-0 font-mono text-sm ${a.iconText} opacity-50 group-hover:opacity-100 transition-opacity pt-0.5`}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>

                <div className="relative z-10 min-w-0">
                  <h3 className="text-lg md:text-xl font-bold mb-2 leading-snug">
                    {f.title}
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed group-hover:text-gray-300 transition-colors">
                    {f.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Stack + outcome */}
        <section className="grid grid-cols-1 lg:grid-cols-5 gap-4 md:gap-5 mb-20 md:mb-28">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-2 rounded-3xl border border-white/[0.14] bg-[#0e0e11] p-6 sm:p-7 md:p-8 shadow-xl shadow-black/60"
          >
            <div className="flex items-center gap-2.5 mb-6">
              <Layers className={`w-4 h-4 ${a.iconText}`} />
              <h2 className="text-sm uppercase tracking-[0.18em] font-semibold text-gray-400">
                Tech stack
              </h2>
            </div>
            <div className="flex flex-wrap gap-2 sm:gap-2.5">
              {project.stack.map((tech, i) => (
                <motion.span
                  key={tech}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.04 }}
                  className={`px-3.5 sm:px-4 py-2 rounded-full text-[13px] sm:text-sm font-medium border ${a.chip} hover:scale-105 transition-transform`}
                >
                  {tech}
                </motion.span>
              ))}
            </div>
            <p className="mt-6 pt-5 border-t border-white/10 text-xs text-gray-500 leading-relaxed">
              Chosen for what this product needed — not for what was trendy.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.08 }}
            className="lg:col-span-3 rounded-3xl border border-white/[0.14] bg-[#0e0e11] p-6 sm:p-7 md:p-8 shadow-xl shadow-black/60"
          >
            <div className="flex items-center gap-2.5 mb-6">
              <TrendingUp className={`w-4 h-4 ${a.iconText}`} />
              <h2 className="text-sm uppercase tracking-[0.18em] font-semibold text-gray-400">
                Outcome
              </h2>
            </div>
            <ul className="divide-y divide-white/10 -my-1">
              {project.results.map((r, i) => (
                <motion.li
                  key={r}
                  initial={{ opacity: 0, x: 16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="flex gap-4 py-4 text-gray-300"
                >
                  <span
                    className={`flex-shrink-0 w-7 h-7 rounded-full ${a.iconBg} flex items-center justify-center text-[11px] font-bold ${a.iconText}`}
                  >
                    {i + 1}
                  </span>
                  <span className="leading-relaxed text-sm sm:text-base">
                    {r}
                  </span>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </section>

        {/* CTA */}
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className={`relative rounded-3xl border ${a.border} bg-gradient-to-br ${a.card} p-8 md:p-14 text-center mb-20 md:mb-28 overflow-hidden`}
        >
          <div
            className={`absolute -bottom-24 -right-24 w-80 h-80 ${a.glow} rounded-full blur-3xl opacity-60`}
          />
          <div className="relative z-10">
            <h2 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">
              Want something like this built?
            </h2>
            <p className="text-gray-300 text-lg mb-9 max-w-xl mx-auto leading-relaxed">
              I take on full builds end to end — architecture, development,
              deployment and the maintenance afterwards.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                to="/#contact"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-white text-black font-bold shadow-2xl hover:shadow-white/20 hover:scale-105 transition-all"
              >
                Start a project
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full border border-white/30 font-semibold hover:bg-white/10 hover:border-white/50 transition-all"
              >
                Visit {project.name}
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </motion.section>

        {/* More work */}
        <section>
          <h2 className="text-2xl font-bold mb-6">More client work</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {others.map((p) => {
              const oa = ACCENTS[p.accent] ?? ACCENTS.indigo;
              return (
                <Link
                  key={p.slug}
                  to={`/client/${p.slug}`}
                  className={`group rounded-2xl overflow-hidden border ${oa.border} bg-gradient-to-br ${oa.card} transition-all hover:-translate-y-1.5 hover:shadow-2xl`}
                >
                  {p.screenshots[0] && (
                    <img
                      src={p.screenshots[0]}
                      alt={p.name}
                      loading="lazy"
                      className="w-full aspect-[16/10] object-cover object-top opacity-70 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                    />
                  )}
                  <div className="p-5">
                    <p className="text-xs text-gray-500 mb-1">{p.sector}</p>
                    <h3 className="font-bold mb-2">{p.name}</h3>
                    <span
                      className={`text-sm ${oa.iconText} inline-flex items-center gap-1.5 group-hover:gap-2.5 transition-all`}
                    >
                      Know more <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightbox(null)}
            className="fixed inset-0 z-[60] bg-black/95 backdrop-blur-sm flex items-center justify-center p-4 cursor-zoom-out"
          >
            <button
              onClick={() => setLightbox(null)}
              aria-label="Close image"
              className="absolute top-5 right-5 p-2.5 rounded-full bg-white/10 hover:bg-white/25 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            <motion.img
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              src={lightbox}
              alt={`${project.name} full screenshot`}
              className="max-w-full max-h-[92vh] rounded-xl object-contain shadow-2xl"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
