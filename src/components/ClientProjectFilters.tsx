import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Search, SlidersHorizontal, X } from "lucide-react";
import type { ClientProject } from "../data/clientProjects";
import { track } from "../lib/analytics";

/** Broad buckets — 19 projects across ~12 raw sectors is too granular to scan. */
const SECTORS: Record<string, RegExp> = {
  "E-commerce": /e-commerce/i,
  EdTech: /edtech|education/i,
  "HR Tech": /hr tech|recruitment/i,
  Marketing: /marketing/i,
  Hospitality: /hospitality|travel/i,
  Media: /media/i,
  Other: /professional services/i,
};

export function useClientProjectFilters(projects: ClientProject[]) {
  const [query, setQuery] = useState("");
  const [sector, setSector] = useState<string | null>(null);
  const [tech, setTech] = useState<string | null>(null);

  /** Stacks worth filtering on — anything used by 2+ projects. */
  const techOptions = useMemo(() => {
    const count = new Map<string, number>();
    projects.forEach((p) =>
      p.stack.forEach((t) => count.set(t, (count.get(t) ?? 0) + 1))
    );
    return [...count.entries()]
      .filter(([, n]) => n >= 2)
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
      .map(([t]) => t);
  }, [projects]);

  const sectorOptions = useMemo(
    () =>
      Object.keys(SECTORS).filter((label) =>
        projects.some((p) => SECTORS[label].test(p.sector))
      ),
    [projects]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return projects.filter((p) => {
      if (sector && !SECTORS[sector]?.test(p.sector)) return false;
      if (tech && !p.stack.includes(tech)) return false;
      if (!q) return true;
      return (
        p.name.toLowerCase().includes(q) ||
        p.sector.toLowerCase().includes(q) ||
        p.summary.toLowerCase().includes(q) ||
        p.tagline.toLowerCase().includes(q) ||
        p.domain.toLowerCase().includes(q) ||
        p.stack.some((t) => t.toLowerCase().includes(q)) ||
        p.tags.some((t) => t.toLowerCase().includes(q))
      );
    });
  }, [projects, query, sector, tech]);

  const active = Boolean(query.trim() || sector || tech);

  const clear = () => {
    setQuery("");
    setSector(null);
    setTech(null);
  };

  return {
    query,
    setQuery,
    sector,
    setSector,
    tech,
    setTech,
    techOptions,
    sectorOptions,
    filtered,
    active,
    clear,
  };
}

type Filters = ReturnType<typeof useClientProjectFilters>;

export function ClientProjectFilters({
  f,
  total,
}: {
  f: Filters;
  total: number;
}) {
  const [showTech, setShowTech] = useState(false);

  const chip = (on: boolean) =>
    `px-3.5 py-1.5 rounded-full text-xs font-medium border transition-all ${
      on
        ? "bg-indigo-500 text-white border-indigo-400 shadow-lg shadow-indigo-500/25"
        : "bg-white/[0.05] text-gray-300 border-white/15 hover:bg-white/10 hover:text-white"
    }`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="mb-10 md:mb-12"
    >
      <div className="flex flex-col lg:flex-row lg:items-center gap-3 mb-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
          <input
            value={f.query}
            onChange={(e) => {
              f.setQuery(e.target.value);
              if (e.target.value.length === 3)
                track("projects_search", { q: e.target.value });
            }}
            placeholder="Search projects, tech, industry…"
            aria-label="Search client projects"
            className="w-full pl-11 pr-10 py-3 rounded-full bg-white/[0.05] border border-white/15 text-white text-sm placeholder:text-gray-500 focus:outline-none focus:border-indigo-400/70 focus:ring-2 focus:ring-indigo-400/20 transition-colors"
          />
          {f.query && (
            <button
              onClick={() => f.setQuery("")}
              aria-label="Clear search"
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full text-gray-400 hover:text-white hover:bg-white/10"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => f.setSector(null)}
            className={chip(!f.sector)}
          >
            All
          </button>
          {f.sectorOptions.map((s) => (
            <button
              key={s}
              onClick={() => {
                const next = f.sector === s ? null : s;
                f.setSector(next);
                if (next) track("projects_filter", { sector: next });
              }}
              className={chip(f.sector === s)}
            >
              {s}
            </button>
          ))}
          <button
            onClick={() => setShowTech((v) => !v)}
            aria-expanded={showTech}
            className={`inline-flex items-center gap-1.5 ${chip(Boolean(f.tech))}`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            {f.tech ?? "Tech"}
          </button>
        </div>
      </div>

      {showTech && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="overflow-hidden"
        >
          <div className="flex flex-wrap gap-2 pt-1 pb-3">
            {f.techOptions.map((t) => (
              <button
                key={t}
                onClick={() => {
                  const next = f.tech === t ? null : t;
                  f.setTech(next);
                  if (next) track("projects_filter", { tech: next });
                }}
                className={chip(f.tech === t)}
              >
                {t}
              </button>
            ))}
          </div>
        </motion.div>
      )}

      <div className="flex items-center gap-3 text-sm text-gray-400">
        <span>
          Showing <span className="text-white font-semibold">{f.filtered.length}</span>{" "}
          of {total} projects
        </span>
        {f.active && (
          <button
            onClick={f.clear}
            className="text-indigo-300 hover:text-indigo-200 underline underline-offset-2"
          >
            Clear filters
          </button>
        )}
      </div>
    </motion.div>
  );
}
