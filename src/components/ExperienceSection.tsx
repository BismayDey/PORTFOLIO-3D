import { forwardRef, useRef, useState } from "react";
import { AnimatePresence, motion, useScroll, useSpring } from "framer-motion";
import {
  BarChart3,
  Briefcase,
  Calendar,
  ChevronDown,
  Code2,
  ExternalLink,
  Globe,
  MapPin,
  Rocket,
  Users,
} from "lucide-react";
import { experience } from "../data/experience";

const ICONS = { BarChart3, Briefcase, Code2, Globe, Rocket, Users } as const;

// Literal class strings so Tailwind keeps them in the build.
const ACCENT: Record<
  string,
  { dot: string; text: string; ring: string; soft: string; glow: string }
> = {
  violet: {
    dot: "bg-violet-400",
    text: "text-violet-300",
    ring: "hover:border-violet-400/50",
    soft: "bg-violet-500/15",
    glow: "bg-violet-500/20",
  },
  amber: {
    dot: "bg-amber-400",
    text: "text-amber-300",
    ring: "hover:border-amber-400/50",
    soft: "bg-amber-500/15",
    glow: "bg-amber-500/20",
  },
  sky: {
    dot: "bg-sky-400",
    text: "text-sky-300",
    ring: "hover:border-sky-400/50",
    soft: "bg-sky-500/15",
    glow: "bg-sky-500/20",
  },
  emerald: {
    dot: "bg-emerald-400",
    text: "text-emerald-300",
    ring: "hover:border-emerald-400/50",
    soft: "bg-emerald-500/15",
    glow: "bg-emerald-500/20",
  },
  green: {
    dot: "bg-green-400",
    text: "text-green-300",
    ring: "hover:border-green-400/50",
    soft: "bg-green-500/15",
    glow: "bg-green-500/20",
  },
  cyan: {
    dot: "bg-cyan-400",
    text: "text-cyan-300",
    ring: "hover:border-cyan-400/50",
    soft: "bg-cyan-500/15",
    glow: "bg-cyan-500/20",
  },
  blue: {
    dot: "bg-blue-400",
    text: "text-blue-300",
    ring: "hover:border-blue-400/50",
    soft: "bg-blue-500/15",
    glow: "bg-blue-500/20",
  },
  purple: {
    dot: "bg-purple-400",
    text: "text-purple-300",
    ring: "hover:border-purple-400/50",
    soft: "bg-purple-500/15",
    glow: "bg-purple-500/20",
  },
  pink: {
    dot: "bg-pink-400",
    text: "text-pink-300",
    ring: "hover:border-pink-400/50",
    soft: "bg-pink-500/15",
    glow: "bg-pink-500/20",
  },
  orange: {
    dot: "bg-orange-400",
    text: "text-orange-300",
    ring: "hover:border-orange-400/50",
    soft: "bg-orange-500/15",
    glow: "bg-orange-500/20",
  },
};

function RoleCard({ role, index }: { role: (typeof experience)[0]; index: number }) {
  // Only the two current roles start open — 12 expanded cards is what made
  // this section feel endless.
  const [open, setOpen] = useState(index < 2);
  const a = ACCENT[role.accent] ?? ACCENT.violet;
  const Icon = ICONS[role.icon as keyof typeof ICONS] ?? Briefcase;

  return (
    <motion.li
      initial={{ opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-70px" }}
      transition={{
        delay: Math.min(index * 0.04, 0.2),
        type: "spring",
        stiffness: 170,
        damping: 24,
      }}
      className="relative pl-12 sm:pl-20"
    >
      {/* node on the spine */}
      <span className="absolute left-[13px] sm:left-[21px] top-7 -translate-x-1/2 flex items-center justify-center">
        <span
          className={`w-3 h-3 rounded-full ${a.dot} ring-4 ring-black z-10`}
        />
        {role.current && (
          <span
            className={`absolute w-3 h-3 rounded-full ${a.dot} animate-ping opacity-60`}
          />
        )}
      </span>

      <div
        className={`group relative rounded-2xl border-2 border-white/[0.16] bg-[#121217] shadow-xl shadow-black/60 transition-all duration-300 hover:shadow-2xl ${a.ring}`}
      >
        <div
          className={`absolute -top-px left-8 right-8 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent opacity-0 group-hover:opacity-100 transition-opacity`}
        />

        <button
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          className="w-full text-left p-5 sm:p-6 flex items-start gap-4 rounded-2xl hover:bg-white/[0.03] transition-colors"
        >
          <span
            className={`hidden sm:flex flex-shrink-0 w-11 h-11 rounded-xl ${a.soft} items-center justify-center group-hover:scale-110 transition-transform duration-300`}
          >
            <Icon className={`w-5 h-5 ${a.text}`} />
          </span>

          <span className="flex-1 min-w-0">
            <span className="flex flex-wrap items-center gap-x-2.5 gap-y-1 mb-1.5">
              <span className="text-base sm:text-lg md:text-xl font-bold text-white leading-snug">
                {role.title}
              </span>
              {role.current && (
                <span
                  className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider ${a.soft} ${a.text}`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${a.dot}`} />
                  Now
                </span>
              )}
            </span>

            {role.url ? (
              <a
                href={role.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className={`inline-flex items-center gap-1.5 font-semibold ${a.text} hover:underline`}
              >
                {role.company}
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            ) : (
              <span className={`font-semibold ${a.text}`}>{role.company}</span>
            )}

            <span className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs sm:text-sm text-gray-500">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                {role.period}
              </span>
              {role.location && (
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5" />
                  {role.location}
                </span>
              )}
            </span>
          </span>

          <span className="flex-shrink-0 flex items-center gap-2 pt-0.5">
            <span
              className={`hidden md:inline text-[11px] font-semibold uppercase tracking-wider ${a.text} opacity-80 group-hover:opacity-100 transition-opacity`}
            >
              {open ? "Hide" : "Details"}
            </span>
            <motion.span
              animate={
                open ? { rotate: 180, y: 0 } : { rotate: 0, y: [0, 2.5, 0] }
              }
              transition={
                open
                  ? { duration: 0.3 }
                  : { duration: 1.6, repeat: Infinity, ease: "easeInOut" }
              }
              className={`w-8 h-8 rounded-full ${a.soft} border border-white/15 flex items-center justify-center group-hover:scale-110 group-hover:border-white/35 transition-all duration-300`}
            >
              <ChevronDown className={`w-4 h-4 ${a.text}`} />
            </motion.span>
          </span>
        </button>

        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <ul className="px-5 sm:px-6 pb-5 sm:pb-6 sm:pl-[76px] space-y-2.5 border-t border-white/[0.08] pt-4 mt-0">
                {role.bullets.map((b, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.06 + i * 0.05 }}
                    className="flex gap-3 text-sm text-gray-400 leading-relaxed"
                  >
                    <span className={`mt-1.5 flex-shrink-0 ${a.text}`}>
                      <span className="block w-1.5 h-1.5 rounded-full bg-current" />
                    </span>
                    <span>{b}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.li>
  );
}

export const ExperienceSection = forwardRef<HTMLDivElement>((_props, ref) => {
  const listRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: listRef,
    offset: ["start 0.85", "end 0.5"],
  });
  const fill = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 26,
    restDelta: 0.001,
  });

  const companies = new Set(experience.map((r) => r.company)).size;
  const current = experience.filter((r) => r.current).length;

  return (
    <div
      ref={ref}
      id="experience"
      className="relative bg-black px-4 md:px-8 py-20 md:py-28 overflow-hidden"
    >
      <div className="absolute top-1/4 -left-32 w-[34rem] h-[34rem] bg-blue-600/10 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute bottom-0 -right-32 w-[30rem] h-[30rem] bg-violet-600/10 rounded-full blur-[130px] pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto text-white">
        <div className="mb-12 md:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-3 mb-5"
          >
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
            <span className="text-xs uppercase tracking-[0.25em] text-gray-400">
              Where I've worked
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.05 }}
            className="text-4xl md:text-6xl font-bold tracking-tight mb-5 leading-[1.05]"
          >
            Experience
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-gray-400 text-base md:text-lg max-w-2xl leading-relaxed mb-8"
          >
            Twelve roles across product leadership, full-stack delivery and data
            — tap any one to see what the work actually involved.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
            className="flex flex-wrap gap-x-8 gap-y-3 text-sm"
          >
            {[
              [String(experience.length), "roles held"],
              [String(companies), "organisations"],
              [String(current), "held right now"],
            ].map(([n, label]) => (
              <div key={label} className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-white">{n}</span>
                <span className="text-gray-400">{label}</span>
              </div>
            ))}
          </motion.div>
        </div>

        <div ref={listRef} className="relative">
          {/* spine + scroll-linked fill */}
          <div className="absolute left-[13px] sm:left-[21px] top-2 bottom-2 w-px bg-white/10" />
          <motion.div
            style={{ scaleY: fill }}
            className="absolute left-[13px] sm:left-[21px] top-2 bottom-2 w-px origin-top bg-gradient-to-b from-violet-400 via-blue-400 to-emerald-400"
          />

          <ol className="space-y-3 sm:space-y-4">
            {experience.map((role, i) => (
              <RoleCard key={`${role.company}-${role.title}`} role={role} index={i} />
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
});

ExperienceSection.displayName = "ExperienceSection";
