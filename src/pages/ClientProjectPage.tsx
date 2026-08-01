import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  CheckCircle2,
  ExternalLink,
  Globe,
  Layers,
  Target,
  X,
  Zap,
} from "lucide-react";
import {
  clientProjects,
  getClientProject,
} from "../data/clientProjects";
import { ACCENTS } from "../components/ClientProjectCard";
import { SITE_URL, useSeo } from "../lib/seo";

export default function ClientProjectPage() {
  const { slug } = useParams();
  const project = getClientProject(slug);
  const [lightbox, setLightbox] = useState<string | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setLightbox(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightbox]);

  const a = ACCENTS[project?.accent ?? "indigo"] ?? ACCENTS.indigo;

  useSeo({
    title: project
      ? `${project.name} — ${project.sector} Case Study | Bismay Dey`
      : "Project not found | Bismay Dey",
    description: project
      ? `${project.summary} Built by Bismay Dey — ${project.role}, ${project.stack.slice(0, 4).join(", ")}.`
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

  const others = clientProjects
    .filter((p) => p.slug !== project.slug)
    .slice(0, 3);

  return (
    <main className="min-h-screen bg-black text-white">
      {/* Breadcrumb + back */}
      <nav
        aria-label="Breadcrumb"
        className="sticky top-0 z-40 backdrop-blur-xl bg-black/70 border-b border-white/10"
      >
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between gap-4">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-gray-300 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back to portfolio</span>
            <span className="sm:hidden">Back</span>
          </Link>
          <a
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r ${a.button} text-sm font-semibold shadow-lg hover:brightness-110 transition-all`}
          >
            Visit live site
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </nav>

      {/* Hero */}
      <header className="relative overflow-hidden px-4 md:px-8 pt-14 pb-12 md:pt-20 md:pb-16">
        <div
          className={`absolute top-0 left-1/4 w-[32rem] h-[32rem] ${a.glow} rounded-full blur-3xl opacity-40 pointer-events-none`}
        />
        <div className="relative z-10 max-w-6xl mx-auto">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs uppercase tracking-[0.2em] text-gray-500 mb-4"
          >
            {project.sector}
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className={`text-4xl md:text-6xl font-bold mb-5 bg-gradient-to-r ${a.title} bg-clip-text text-transparent`}
          >
            {project.name}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg md:text-xl text-gray-300 max-w-3xl leading-relaxed mb-8"
          >
            {project.tagline}
          </motion.p>

          <motion.dl
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
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
            ].map((item) => (
              <div
                key={item.label}
                className="bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-sm"
              >
                <dt className="flex items-center gap-2 text-xs uppercase tracking-wide text-gray-500 mb-2">
                  <item.icon className="w-3.5 h-3.5" />
                  {item.label}
                </dt>
                <dd className="text-sm font-semibold text-white break-words">
                  {item.value}
                </dd>
              </div>
            ))}
          </motion.dl>
        </div>
      </header>

      {/* Lead screenshot */}
      {project.screenshots[0] && (
        <section className="px-4 md:px-8 mb-16 md:mb-24">
          <motion.figure
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-6xl mx-auto"
          >
            <button
              onClick={() => setLightbox(project.screenshots[0])}
              className={`block w-full rounded-3xl overflow-hidden border ${a.border} shadow-2xl ${a.shadow} cursor-zoom-in`}
            >
              <img
                src={project.screenshots[0]}
                alt={`${project.name} homepage`}
                width={1440}
                height={900}
                className="w-full"
              />
            </button>
            <figcaption className="text-center text-xs text-gray-500 mt-3">
              {project.domain} — click any screenshot to enlarge
            </figcaption>
          </motion.figure>
        </section>
      )}

      <div className="max-w-6xl mx-auto px-4 md:px-8 pb-24">
        {/* Challenge */}
        <section className="mb-16 md:mb-24">
          <h2 className="text-xs uppercase tracking-[0.2em] text-gray-500 mb-4">
            The brief
          </h2>
          <p className="text-xl md:text-2xl leading-relaxed text-gray-200 max-w-4xl">
            {project.challenge}
          </p>
        </section>

        {/* What I built */}
        <section className="mb-16 md:mb-24">
          <h2 className="text-3xl md:text-4xl font-bold mb-8">
            What I built
          </h2>
          <ul className="space-y-5 max-w-4xl">
            {project.work.map((item, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: Math.min(i * 0.05, 0.3) }}
                className="flex gap-4"
              >
                <CheckCircle2
                  className={`w-5 h-5 mt-1 flex-shrink-0 ${a.iconText}`}
                />
                <span className="text-gray-300 leading-relaxed">{item}</span>
              </motion.li>
            ))}
          </ul>
        </section>

        {/* Screenshot gallery */}
        {project.screenshots.length > 1 && (
          <section className="mb-16 md:mb-24">
            <h2 className="text-3xl md:text-4xl font-bold mb-3">
              Inside the build
            </h2>
            <p className="text-gray-400 mb-8">
              Captured from the live site at {project.domain}.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {project.screenshots.slice(1).map((shot, i) => (
                <motion.button
                  key={shot}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: (i % 2) * 0.08 }}
                  onClick={() => setLightbox(shot)}
                  className={`group relative rounded-2xl overflow-hidden border ${a.border} bg-black/40 cursor-zoom-in`}
                >
                  <img
                    src={shot}
                    alt={`${project.name} interface detail ${i + 1}`}
                    loading="lazy"
                    width={1440}
                    height={900}
                    className="w-full group-hover:scale-[1.03] transition-transform duration-500"
                  />
                </motion.button>
              ))}
            </div>
          </section>
        )}

        {/* Features */}
        <section className="mb-16 md:mb-24">
          <h2 className="text-3xl md:text-4xl font-bold mb-8">
            Key features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {project.features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: (i % 2) * 0.08 }}
                className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-white/25 transition-colors"
              >
                <div className={`p-2.5 w-fit rounded-xl ${a.iconBg} mb-4`}>
                  <Zap className={`w-5 h-5 ${a.iconText}`} />
                </div>
                <h3 className="text-lg font-bold mb-2">{f.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {f.description}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Stack + results */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16 md:mb-24">
          <div>
            <h2 className="text-2xl font-bold mb-5">Tech stack</h2>
            <div className="flex flex-wrap gap-2">
              {project.stack.map((tech) => (
                <span
                  key={tech}
                  className={`px-4 py-2 rounded-full text-sm font-medium border ${a.chip}`}
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-5">Outcome</h2>
            <ul className="space-y-3">
              {project.results.map((r) => (
                <li key={r} className="flex gap-3 text-gray-300">
                  <span className={a.iconText}>—</span>
                  <span>{r}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* CTA */}
        <section
          className={`rounded-3xl border ${a.border} bg-gradient-to-br ${a.card} p-8 md:p-12 text-center mb-16 md:mb-24`}
        >
          <h2 className="text-2xl md:text-3xl font-bold mb-3">
            Want something like this built?
          </h2>
          <p className="text-gray-300 mb-8 max-w-xl mx-auto">
            I take on full builds end to end — architecture, development,
            deployment and the maintenance afterwards.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/#contact"
              className={`inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-gradient-to-r ${a.button} font-semibold shadow-lg hover:brightness-110 transition-all`}
            >
              Start a project
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full border border-white/25 font-semibold hover:bg-white/10 transition-colors"
            >
              Visit {project.name}
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </section>

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
                  className={`group rounded-2xl overflow-hidden border ${oa.border} bg-gradient-to-br ${oa.card} transition-transform hover:-translate-y-1`}
                >
                  {p.screenshots[0] && (
                    <img
                      src={p.screenshots[0]}
                      alt={p.name}
                      loading="lazy"
                      className="w-full aspect-[16/10] object-cover object-top opacity-70 group-hover:opacity-100 transition-opacity"
                    />
                  )}
                  <div className="p-5">
                    <p className="text-xs text-gray-500 mb-1">{p.sector}</p>
                    <h3 className="font-bold mb-1">{p.name}</h3>
                    <span
                      className={`text-sm ${oa.iconText} inline-flex items-center gap-1`}
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
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center p-4 cursor-zoom-out"
          >
            <button
              onClick={() => setLightbox(null)}
              aria-label="Close image"
              className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            <motion.img
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              src={lightbox}
              alt={`${project.name} full screenshot`}
              className="max-w-full max-h-[92vh] rounded-xl object-contain"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
