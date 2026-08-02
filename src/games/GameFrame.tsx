import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { Play } from "lucide-react";

/** Shared chrome for every game: title, blurb, HUD, start overlay, canvas area. */
export function GameFrame({
  title,
  blurb,
  hud,
  onStart,
  startLabel = "Start",
  children,
}: {
  title: string;
  blurb: string;
  hud?: { label: string; value: string | number }[];
  onStart?: () => void;
  startLabel?: string;
  children: ReactNode;
}) {
  return (
    <div className="w-full">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-1.5">
            {title}
          </h2>
          <p className="text-sm text-gray-400 max-w-xl leading-relaxed">
            {blurb}
          </p>
        </div>
        {hud && (
          <div className="flex gap-5 flex-shrink-0">
            {hud.map((h) => (
              <div key={h.label}>
                <p className="text-[10px] uppercase tracking-wider text-gray-500">
                  {h.label}
                </p>
                <p className="text-lg font-bold text-white leading-tight">
                  {h.value}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] max-h-[70vh] rounded-3xl overflow-hidden border-2 border-white/[0.14] bg-[#07070b] shadow-2xl shadow-black/60">
        {children}

        {onStart && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/70 backdrop-blur-sm p-6 text-center"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.96 }}
              onClick={onStart}
              className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white font-bold text-lg shadow-2xl shadow-purple-600/40 hover:brightness-110 transition-all"
            >
              <Play className="w-5 h-5 fill-current" />
              {startLabel}
            </motion.button>
            <p className="mt-4 text-xs text-gray-500 max-w-xs">
              Built with the same stack Bismay uses for client game work.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
