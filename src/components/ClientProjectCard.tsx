import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  BookOpen,
  Bot,
  Brain,
  Briefcase,
  ExternalLink,
  Flame,
  Globe,
  GraduationCap,
  Home,
  Megaphone,
  Mic,
  Plane,
  Rocket,
  Shirt,
  Sparkles,
  TreePine,
  TrendingUp,
  Users,
  Video,
} from "lucide-react";
import type { ClientProject } from "../data/clientProjects";

const ICONS = {
  BookOpen,
  Bot,
  Brain,
  Briefcase,
  Flame,
  Globe,
  GraduationCap,
  Home,
  Megaphone,
  Mic,
  Plane,
  Rocket,
  Shirt,
  Sparkles,
  TreePine,
  TrendingUp,
  Users,
  Video,
} as const;

// Tailwind needs literal class names, so accents map to a fixed palette.
export const ACCENTS: Record<
  string,
  {
    card: string;
    border: string;
    shadow: string;
    iconBg: string;
    iconText: string;
    title: string;
    chip: string;
    glow: string;
    button: string;
  }
> = {
  teal: {
    card: "from-teal-900/50 to-slate-900/50",
    border: "border-teal-500/40",
    shadow: "shadow-teal-500/20",
    iconBg: "bg-teal-500/30 group-hover:bg-teal-500/50",
    iconText: "text-teal-300",
    title: "from-white to-teal-200",
    chip: "bg-teal-500/30 text-teal-200 border-teal-400/40",
    glow: "bg-teal-500/20 group-hover:bg-teal-500/40",
    button: "from-teal-600 to-cyan-600",
  },
  amber: {
    card: "from-amber-900/50 to-red-900/50",
    border: "border-amber-500/40",
    shadow: "shadow-amber-500/20",
    iconBg: "bg-amber-500/30 group-hover:bg-amber-500/50",
    iconText: "text-amber-300",
    title: "from-white to-amber-200",
    chip: "bg-amber-500/30 text-amber-200 border-amber-400/40",
    glow: "bg-amber-500/20 group-hover:bg-amber-500/40",
    button: "from-amber-600 to-orange-600",
  },
  orange: {
    card: "from-orange-900/50 to-amber-900/50",
    border: "border-orange-500/40",
    shadow: "shadow-orange-500/20",
    iconBg: "bg-orange-500/30 group-hover:bg-orange-500/50",
    iconText: "text-orange-300",
    title: "from-white to-orange-200",
    chip: "bg-orange-500/30 text-orange-200 border-orange-400/40",
    glow: "bg-orange-500/20 group-hover:bg-orange-500/40",
    button: "from-orange-600 to-amber-600",
  },
  purple: {
    card: "from-purple-900/50 to-indigo-900/50",
    border: "border-purple-500/40",
    shadow: "shadow-purple-500/20",
    iconBg: "bg-purple-500/30 group-hover:bg-purple-500/50",
    iconText: "text-purple-300",
    title: "from-white to-purple-200",
    chip: "bg-purple-500/30 text-purple-200 border-purple-400/40",
    glow: "bg-purple-500/20 group-hover:bg-purple-500/40",
    button: "from-purple-600 to-indigo-600",
  },
  fuchsia: {
    card: "from-fuchsia-900/50 to-purple-900/50",
    border: "border-fuchsia-500/40",
    shadow: "shadow-fuchsia-500/20",
    iconBg: "bg-fuchsia-500/30 group-hover:bg-fuchsia-500/50",
    iconText: "text-fuchsia-300",
    title: "from-white to-fuchsia-200",
    chip: "bg-fuchsia-500/30 text-fuchsia-200 border-fuchsia-400/40",
    glow: "bg-fuchsia-500/20 group-hover:bg-fuchsia-500/40",
    button: "from-fuchsia-600 to-purple-600",
  },
  red: {
    card: "from-red-900/50 to-orange-900/50",
    border: "border-red-500/40",
    shadow: "shadow-red-500/20",
    iconBg: "bg-red-500/30 group-hover:bg-red-500/50",
    iconText: "text-red-300",
    title: "from-white to-red-200",
    chip: "bg-red-500/30 text-red-200 border-red-400/40",
    glow: "bg-red-500/20 group-hover:bg-red-500/40",
    button: "from-red-600 to-orange-600",
  },
  rose: {
    card: "from-rose-900/50 to-red-900/50",
    border: "border-rose-500/40",
    shadow: "shadow-rose-500/20",
    iconBg: "bg-rose-500/30 group-hover:bg-rose-500/50",
    iconText: "text-rose-300",
    title: "from-white to-rose-200",
    chip: "bg-rose-500/30 text-rose-200 border-rose-400/40",
    glow: "bg-rose-500/20 group-hover:bg-rose-500/40",
    button: "from-rose-600 to-red-600",
  },
  violet: {
    card: "from-violet-900/50 to-fuchsia-900/50",
    border: "border-violet-500/40",
    shadow: "shadow-violet-500/20",
    iconBg: "bg-violet-500/30 group-hover:bg-violet-500/50",
    iconText: "text-violet-300",
    title: "from-white to-violet-200",
    chip: "bg-violet-500/30 text-violet-200 border-violet-400/40",
    glow: "bg-violet-500/20 group-hover:bg-violet-500/40",
    button: "from-violet-600 to-fuchsia-600",
  },
  emerald: {
    card: "from-emerald-900/50 to-teal-900/50",
    border: "border-emerald-500/40",
    shadow: "shadow-emerald-500/20",
    iconBg: "bg-emerald-500/30 group-hover:bg-emerald-500/50",
    iconText: "text-emerald-300",
    title: "from-white to-emerald-200",
    chip: "bg-emerald-500/30 text-emerald-200 border-emerald-400/40",
    glow: "bg-emerald-500/20 group-hover:bg-emerald-500/40",
    button: "from-emerald-600 to-teal-600",
  },
  indigo: {
    card: "from-indigo-900/50 to-purple-900/50",
    border: "border-indigo-500/40",
    shadow: "shadow-indigo-500/20",
    iconBg: "bg-indigo-500/30 group-hover:bg-indigo-500/50",
    iconText: "text-indigo-300",
    title: "from-white to-indigo-200",
    chip: "bg-indigo-500/30 text-indigo-200 border-indigo-400/40",
    glow: "bg-indigo-500/20 group-hover:bg-indigo-500/40",
    button: "from-indigo-600 to-purple-600",
  },
  blue: {
    card: "from-blue-900/50 to-cyan-900/50",
    border: "border-blue-500/40",
    shadow: "shadow-blue-500/20",
    iconBg: "bg-blue-500/30 group-hover:bg-blue-500/50",
    iconText: "text-blue-300",
    title: "from-white to-blue-200",
    chip: "bg-blue-500/30 text-blue-200 border-blue-400/40",
    glow: "bg-blue-500/20 group-hover:bg-blue-500/40",
    button: "from-blue-600 to-cyan-600",
  },
  green: {
    card: "from-green-900/50 to-lime-900/50",
    border: "border-green-500/40",
    shadow: "shadow-green-500/20",
    iconBg: "bg-green-500/30 group-hover:bg-green-500/50",
    iconText: "text-green-300",
    title: "from-white to-green-200",
    chip: "bg-green-500/30 text-green-200 border-green-400/40",
    glow: "bg-green-500/20 group-hover:bg-green-500/40",
    button: "from-green-600 to-lime-600",
  },
  cyan: {
    card: "from-cyan-900/50 to-sky-900/50",
    border: "border-cyan-500/40",
    shadow: "shadow-cyan-500/20",
    iconBg: "bg-cyan-500/30 group-hover:bg-cyan-500/50",
    iconText: "text-cyan-300",
    title: "from-white to-cyan-200",
    chip: "bg-cyan-500/30 text-cyan-200 border-cyan-400/40",
    glow: "bg-cyan-500/20 group-hover:bg-cyan-500/40",
    button: "from-cyan-600 to-sky-600",
  },
  pink: {
    card: "from-pink-900/50 to-rose-900/50",
    border: "border-pink-500/40",
    shadow: "shadow-pink-500/20",
    iconBg: "bg-pink-500/30 group-hover:bg-pink-500/50",
    iconText: "text-pink-300",
    title: "from-white to-pink-200",
    chip: "bg-pink-500/30 text-pink-200 border-pink-400/40",
    glow: "bg-pink-500/20 group-hover:bg-pink-500/40",
    button: "from-pink-600 to-rose-600",
  },
  slate: {
    card: "from-slate-800/60 to-blue-900/50",
    border: "border-slate-400/40",
    shadow: "shadow-slate-500/20",
    iconBg: "bg-slate-500/30 group-hover:bg-slate-500/50",
    iconText: "text-slate-200",
    title: "from-white to-slate-200",
    chip: "bg-slate-500/30 text-slate-200 border-slate-400/40",
    glow: "bg-slate-500/20 group-hover:bg-slate-500/40",
    button: "from-slate-600 to-blue-600",
  },
};

export function ClientProjectCard({
  project,
  index,
}: {
  project: ClientProject;
  index: number;
}) {
  const a = ACCENTS[project.accent] ?? ACCENTS.indigo;
  const Icon = ICONS[project.icon as keyof typeof ICONS] ?? Rocket;
  const thumb = project.screenshots[0];

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{
        opacity: 1,
        y: 0,
        transition: {
          delay: (index % 3) * 0.1,
          type: "spring",
          stiffness: 100,
        },
      }}
      viewport={{ once: true }}
      whileHover={{
        y: -8,
        transition: { type: "spring", stiffness: 320, damping: 20 },
      }}
      className={`group relative flex flex-col bg-gradient-to-br ${a.card} rounded-3xl backdrop-blur-md border ${a.border} shadow-2xl ${a.shadow} overflow-hidden transition-all duration-300`}
    >
      {thumb && (
        <Link
          to={`/client/${project.slug}`}
          className="relative block aspect-[16/10] overflow-hidden bg-black/40"
          aria-label={`${project.name} case study`}
        >
          <img
            src={thumb}
            alt={`${project.name} website homepage`}
            loading="lazy"
            width={1440}
            height={900}
            className="w-full h-full object-cover object-top opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
        </Link>
      )}

      <div className="relative z-10 p-6 md:p-8 flex flex-col flex-1">
        <div className="flex items-center justify-between mb-5">
          <div
            className={`p-3.5 ${a.iconBg} rounded-2xl group-hover:scale-110 transition-all duration-300 shadow-lg`}
          >
            <Icon className={`w-6 h-6 ${a.iconText}`} />
          </div>
          <a
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className={`p-2 rounded-full ${a.iconBg} opacity-60 hover:opacity-100 transition-opacity`}
            aria-label={`Visit ${project.name} live site`}
          >
            <ExternalLink className={`w-4 h-4 ${a.iconText}`} />
          </a>
        </div>

        <p className="text-xs uppercase tracking-wider text-gray-500 mb-2">
          {project.sector}
        </p>
        <h3
          className={`text-2xl font-bold mb-3 bg-gradient-to-r ${a.title} bg-clip-text text-transparent`}
        >
          {project.name}
        </h3>
        <p className="text-gray-300 text-sm mb-5 leading-relaxed flex-1">
          {project.summary}
        </p>

        <div className="flex flex-wrap gap-2 mb-6">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className={`px-3 py-1 rounded-full text-xs font-medium border ${a.chip}`}
            >
              {tag}
            </span>
          ))}
        </div>

        <Link
          to={`/client/${project.slug}`}
          className={`inline-flex items-center justify-center gap-2 w-full px-5 py-3 rounded-xl bg-gradient-to-r ${a.button} text-white text-sm font-semibold shadow-lg hover:shadow-xl hover:brightness-110 transition-all`}
        >
          Know More
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      <div
        className={`absolute -bottom-8 -right-8 w-24 h-24 ${a.glow} rounded-full blur-2xl transition-all duration-500 pointer-events-none`}
      />
    </motion.article>
  );
}
