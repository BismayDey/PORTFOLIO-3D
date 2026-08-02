import { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  ExternalLink,
  Loader2,
  Maximize2,
  Play,
  ShieldCheck,
  Wrench,
} from "lucide-react";
import { track } from "../lib/analytics";

const GAME_URL =
  "https://games.honeytreatacademy.com/gbl/codecraftOP/l1/index.html";
const GAME_ORIGIN = "https://games.honeytreatacademy.com";

/**
 * Live client build, embedded rather than screenshotted.
 *
 * Security posture — this is third-party code running on the page:
 *  - click-to-play, so nothing from that origin loads until asked
 *  - sandboxed to scripts only; no top-navigation, no popups, no downloads,
 *    so the frame cannot hijack or redirect this page
 *  - allow-same-origin refers to the FRAME's own origin (a different host), so
 *    it grants the game its own storage without any access to ours
 *  - no-referrer, and a permissions allowlist limited to what a game needs
 */
export function ClientGameDemo({ onBook }: { onBook: () => void }) {
  const [live, setLive] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [big, setBig] = useState(false);

  return (
    <div className="w-full">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/15 border border-amber-400/35 text-amber-200 text-[10px] font-bold uppercase tracking-wider">
              <Wrench className="w-3 h-3" />
              Client work · in progress
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/[0.06] border border-white/15 text-gray-300 text-[10px] font-medium">
              honeytreatacademy.com
            </span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-1.5">
            CodeCraft — Level 1
          </h2>
          <p className="text-sm text-gray-400 max-w-xl leading-relaxed">
            A game-based learning module being built for Honey Treat Academy —
            running live from the client's own server, not a recording. Still
            under active development, so expect rough edges.
          </p>
        </div>

        {live && (
          <button
            onClick={() => setBig((b) => !b)}
            className="self-start sm:self-auto inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.06] border border-white/20 text-sm text-gray-200 hover:bg-white/[0.12] hover:text-white transition-colors flex-shrink-0"
          >
            <Maximize2 className="w-4 h-4" />
            {big ? "Shrink" : "Bigger"}
          </button>
        )}
      </div>

      <div
        className={`relative w-full rounded-3xl overflow-hidden border-2 border-white/[0.14] bg-[#07070b] shadow-2xl shadow-black/60 transition-all duration-300 ${
          big ? "aspect-[16/10] max-h-[85vh]" : "aspect-[16/10] sm:aspect-[16/9] max-h-[70vh]"
        }`}
      >
        {live ? (
          <>
            {!loaded && (
              <div className="absolute inset-0 grid place-items-center bg-[#07070b] z-10">
                <div className="text-center">
                  <Loader2 className="w-6 h-6 animate-spin text-purple-400 mx-auto mb-3" />
                  <p className="text-xs text-gray-500">
                    Loading from the client's server…
                  </p>
                </div>
              </div>
            )}
            <iframe
              src={GAME_URL}
              title="CodeCraft Level 1 — client game demo"
              onLoad={() => setLoaded(true)}
              loading="lazy"
              referrerPolicy="no-referrer"
              // scripts + its own storage only. No top-navigation, popups,
              // downloads or form posts back out of the frame.
              sandbox="allow-scripts allow-same-origin allow-pointer-lock"
              allow="autoplay; fullscreen; gamepad; accelerometer; gyroscope"
              className="w-full h-full block border-0 bg-black"
            />
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-[#0d0b16] to-[#07070b]"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => {
                setLive(true);
                track("client_game_launched", { game: "codecraft-l1" });
              }}
              className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-amber-500 to-orange-600 text-black font-bold text-lg shadow-2xl shadow-amber-600/30 hover:brightness-110 transition-all"
            >
              <Play className="w-5 h-5 fill-current" />
              Launch the demo
            </motion.button>
            <p className="mt-5 text-xs text-gray-500 max-w-sm leading-relaxed">
              Loads live from{" "}
              <span className="text-gray-400">{GAME_ORIGIN.replace("https://", "")}</span>{" "}
              only when you press play — nothing third-party is requested before
              that.
            </p>
          </motion.div>
        )}
      </div>

      <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <p className="inline-flex items-center gap-2 text-[11px] text-gray-500">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400/70" />
          Sandboxed embed — the frame can't navigate, pop up, or read this page.
        </p>
        <div className="flex flex-wrap gap-2">
          <a
            href={GAME_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => track("client_game_newtab", { game: "codecraft-l1" })}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.06] border border-white/20 text-sm text-gray-200 hover:bg-white/[0.12] hover:text-white transition-colors"
          >
            Open in a new tab
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
          <button
            onClick={() => {
              track("game_cta_book", { game: "codecraft-l1" });
              onBook();
            }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-600 to-fuchsia-600 text-sm font-semibold text-white hover:brightness-110 transition-all"
          >
            Build something like this
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
