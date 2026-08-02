import { motion } from "framer-motion";
import {
  ArrowRight,
  Check,
  Clock,
  Code2,
  Film,
  Gamepad2,
  Globe,
  Layers,
  LayoutTemplate,
  MessageSquare,
  Palette,
  Search,
  Server,
  ShoppingCart,
  Smartphone,
  Sparkles,
  Video,
  Wrench,
} from "lucide-react";
import { serviceGroups } from "../data/services";

const ICONS = {
  Code2,
  Film,
  Gamepad2,
  Globe,
  Layers,
  LayoutTemplate,
  MessageSquare,
  Palette,
  Search,
  Server,
  ShoppingCart,
  Smartphone,
  Sparkles,
  Video,
  Wrench,
} as const;

// Literal class names so Tailwind's scanner keeps them.
const THEME: Record<
  string,
  {
    text: string;
    dot: string;
    chip: string;
    ring: string;
    grad: string;
    glow: string;
    tabOn: string;
  }
> = {
  amber: {
    text: "text-amber-300",
    dot: "bg-amber-400",
    chip: "bg-amber-500/15 text-amber-200 border-amber-400/30",
    ring: "hover:border-amber-400/60",
    grad: "from-amber-500/25 via-orange-500/10 to-transparent",
    glow: "bg-amber-500/25",
    tabOn: "bg-amber-500 text-black",
  },
  cyan: {
    text: "text-cyan-300",
    dot: "bg-cyan-400",
    chip: "bg-cyan-500/15 text-cyan-200 border-cyan-400/30",
    ring: "hover:border-cyan-400/60",
    grad: "from-cyan-500/25 via-sky-500/10 to-transparent",
    glow: "bg-cyan-500/25",
    tabOn: "bg-cyan-400 text-black",
  },
  fuchsia: {
    text: "text-fuchsia-300",
    dot: "bg-fuchsia-400",
    chip: "bg-fuchsia-500/15 text-fuchsia-200 border-fuchsia-400/30",
    ring: "hover:border-fuchsia-400/60",
    grad: "from-fuchsia-500/25 via-purple-500/10 to-transparent",
    glow: "bg-fuchsia-500/25",
    tabOn: "bg-fuchsia-400 text-black",
  },
  emerald: {
    text: "text-emerald-300",
    dot: "bg-emerald-400",
    chip: "bg-emerald-500/15 text-emerald-200 border-emerald-400/30",
    ring: "hover:border-emerald-400/60",
    grad: "from-emerald-500/25 via-green-500/10 to-transparent",
    glow: "bg-emerald-500/25",
    tabOn: "bg-emerald-400 text-black",
  },
};

export function ServicesSection({ onEnquire }: { onEnquire: () => void }) {
  const t = THEME[serviceGroups[0].accent];

  return (
    <section
      id="services"
      aria-labelledby="services-heading"
      className="relative bg-black px-4 md:px-8 py-20 md:py-28 overflow-hidden"
    >
      {/* Ambient field */}
      <div
        className={`absolute -top-20 left-1/4 w-[40rem] h-[40rem] ${t.glow} rounded-full blur-[140px] opacity-40 transition-colors duration-700 pointer-events-none`}
      />
      <div
        className="absolute inset-0 opacity-[0.05] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.6) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
          maskImage:
            "radial-gradient(ellipse 80% 60% at 50% 30%, black 20%, transparent 75%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 80% 60% at 50% 30%, black 20%, transparent 75%)",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <div className="max-w-3xl mb-12 md:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-3 mb-5"
          >
            <span className={`w-2 h-2 rounded-full ${t.dot} animate-pulse`} />
            <span className="text-xs uppercase tracking-[0.25em] text-gray-400">
              What I Do
            </span>
          </motion.div>

          <motion.h2
            id="services-heading"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.05 }}
            className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white mb-6 leading-[1.05]"
          >
            One developer.
            <br />
            <span className="bg-gradient-to-r from-amber-300 via-fuchsia-300 to-cyan-300 bg-clip-text text-transparent">
              The whole build.
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg md:text-xl text-gray-300 leading-relaxed"
          >
            From a single landing page to a full product with AI baked in —
            architected, built, shipped and maintained end to end. No handoffs
            between four freelancers, no one to blame when it breaks.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
            className="flex flex-wrap gap-x-8 gap-y-3 mt-8 text-sm"
          >
            {[
              ["19+", "client platforms shipped"],
              ["15", "services under one roof"],
              ["24h", "typical first response"],
            ].map(([n, label]) => (
              <div key={label} className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-white">{n}</span>
                <span className="text-gray-400">{label}</span>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Every group rendered — nothing hidden behind a tab */}
        <div className="space-y-14 md:space-y-20">
          {serviceGroups.map((group, gi) => {
            const t = THEME[group.accent];
            return (
              <section key={group.id} aria-labelledby={`svc-${group.id}`}>
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6 md:mb-7"
                >
                  <div>
                    <div className="flex items-center gap-2.5 mb-2">
                      <span className={`w-1.5 h-1.5 rounded-full ${t.dot}`} />
                      <span
                        className={`text-[11px] uppercase tracking-[0.2em] font-semibold ${t.text}`}
                      >
                        {group.label}
                      </span>
                    </div>
                    <h3
                      id={`svc-${group.id}`}
                      className="text-2xl md:text-3xl font-bold text-white mb-1.5"
                    >
                      {group.headline}
                    </h3>
                    <p className="text-gray-400 text-sm md:text-base">
                      {group.blurb}
                    </p>
                  </div>
                  <span className="hidden sm:block text-sm text-gray-600 flex-shrink-0">
                    {String(gi + 1).padStart(2, "0")} / 04
                  </span>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-5 items-stretch">
                  {group.services.map((s, i) => {
                    const Icon = ICONS[s.icon as keyof typeof ICONS] ?? Code2;
                    // an odd count would leave a gap in a 2-up grid
                    const spanFull =
                      group.services.length % 2 === 1 &&
                      i === group.services.length - 1;
                    return (
                      <motion.article
                        key={s.title}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-40px" }}
                        transition={{ delay: (i % 2) * 0.08 }}
                        className={`group relative flex flex-col rounded-3xl border border-white/[0.14] bg-[#0e0e11] p-6 sm:p-7 md:p-8 overflow-hidden transition-all duration-300 shadow-xl shadow-black/60 ${t.ring} hover:bg-white/[0.06] hover:-translate-y-1 ${spanFull ? "lg:col-span-2" : ""}`}
                      >
                        <div
                          className={`absolute inset-x-0 -top-24 h-48 bg-gradient-to-b ${t.grad} opacity-0 group-hover:opacity-100 blur-2xl transition-opacity duration-500 pointer-events-none`}
                        />

                        <div className="relative z-10 flex flex-col h-full">
                          <div className="flex items-start justify-between gap-3 mb-5">
                            <div className="p-3 rounded-2xl bg-white/[0.06] border border-white/10 group-hover:scale-110 group-hover:border-white/25 transition-all duration-300">
                              <Icon className={`w-5 h-5 sm:w-6 sm:h-6 ${t.text}`} />
                            </div>
                            <span
                              className={`inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full text-[10px] sm:text-[11px] font-medium border whitespace-nowrap ${t.chip}`}
                            >
                              <Clock className="w-3 h-3" />
                              {s.timeline}
                            </span>
                          </div>

                          <h4 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-2.5">
                            {s.title}
                          </h4>
                          <p className="text-gray-300 text-sm leading-relaxed mb-5">
                            {s.description}
                          </p>

                          <ul
                            className={`mt-auto grid gap-x-5 gap-y-2.5 pt-5 border-t border-white/10 ${
                              spanFull ? "sm:grid-cols-3" : "sm:grid-cols-2"
                            }`}
                          >
                            {s.deliverables.map((d) => (
                              <li
                                key={d}
                                className="flex items-start gap-2 text-[13px] text-gray-400 group-hover:text-gray-300 transition-colors"
                              >
                                <Check
                                  className={`w-3.5 h-3.5 mt-0.5 flex-shrink-0 ${t.text}`}
                                />
                                <span>{d}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </motion.article>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>

        {/* Closing CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-14 md:mt-20 relative rounded-3xl border border-white/15 bg-gradient-to-br from-white/[0.07] to-white/[0.02] p-8 md:p-12 overflow-hidden"
        >
          <div
            className={`absolute -right-16 -top-16 w-72 h-72 ${t.glow} rounded-full blur-3xl opacity-50 transition-colors duration-700`}
          />
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="max-w-xl">
              <h3 className="text-2xl md:text-4xl font-bold text-white mb-3 leading-tight">
                Not sure which of these you need?
              </h3>
              <p className="text-gray-300 text-base md:text-lg leading-relaxed">
                Tell me the problem, not the solution. I'll come back with scope,
                a timeline and a price — usually within a day, and free either
                way.
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              onClick={onEnquire}
              className="flex-shrink-0 inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-white text-black font-bold text-base shadow-2xl hover:shadow-white/20 transition-shadow"
            >
              Start a project
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
