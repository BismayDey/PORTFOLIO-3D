import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  LayoutGrid,
  Loader2,
  Maximize2,
  Play,
  ShieldCheck,
  Wrench,
  X,
} from "lucide-react";
import { track } from "../lib/analytics";

export type ClientGame = {
  id: string;
  title: string;
  level: string;
  client: string;
  url: string;
  blurb: string;
  built: string[];
};

export const CLIENT_GAMES: ClientGame[] = [
  {
    id: "codecraft",
    title: "CodeCraft",
    level: "Level 1 — DevHouse",
    client: "Honey Treat Academy",
    url: "https://games.honeytreatacademy.com/gbl/codecraftOP/l1/index.html",
    blurb:
      "A game-based learning module teaching real web development. Apprentices move through DevHouse solving HTML structure, markup and accessibility challenges as timed units.",
    built: [
      "Tile-based world with interior/exterior zones",
      "Unit-driven challenge system (U1–U7) with progress tracking",
      "In-game NPC dialogue and objective briefing",
      "Day/time simulation and scoring",
    ],
  },
  {
    id: "bricklayer",
    title: "Bricklayer",
    level: "Level 1",
    client: "Honey Treat Academy",
    url: "https://games.honeytreatacademy.com/gbl/bricklayerOP/l1/index.html",
    blurb:
      "A second module on the same platform, teaching masonry trade skills — site safety, PPE and hazard identification — by having apprentices do the work rather than read about it.",
    built: [
      "Health, safety and masonry unit flow (MAS/L1)",
      "Hazard-finding and PPE selection objectives",
      "NPC foreman dialogue and task briefing",
      "Shared engine and shell with CodeCraft",
    ],
  },
];

// Five minutes of actual play. Override with ?promptAfter=<seconds> to preview
// the prompt without waiting (e.g. /play?promptAfter=5).
const promptAfterMs = () => {
  if (typeof window === "undefined") return 5 * 60 * 1000;
  const q = Number(new URLSearchParams(window.location.search).get("promptAfter"));
  return Number.isFinite(q) && q > 0 ? q * 1000 : 5 * 60 * 1000;
};
const UNLOCK_SECONDS = 10;

/**
 * Live client build embedded rather than screenshotted.
 *
 * Security — this is third-party code on the page:
 *  - click-to-play, so nothing loads from that origin until asked
 *  - sandboxed: scripts only. No top-navigation, popups, downloads or forms,
 *    so the frame cannot hijack or redirect this page
 *  - allow-same-origin refers to the FRAME's own origin (a different host), so
 *    it gets its own storage with no access to ours
 *  - no-referrer, and a permissions allowlist limited to what a game needs
 */
export function ClientGameDemo({
  game,
  onBook,
  onSeeWork,
}: {
  game: ClientGame;
  onBook: () => void;
  onSeeWork: () => void;
}) {
  const [live, setLive] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [big, setBig] = useState(false);
  const [prompt, setPrompt] = useState(false);
  const [unlock, setUnlock] = useState(UNLOCK_SECONDS);
  const started = useRef(0);

  // reset when switching between client games
  useEffect(() => {
    setLive(false);
    setLoaded(false);
    setPrompt(false);
    setUnlock(UNLOCK_SECONDS);
  }, [game.id]);

  // after five minutes in the game, ask the question that matters
  useEffect(() => {
    if (!live || prompt) return;
    started.current = Date.now();
    const after = promptAfterMs();
    const t = setInterval(() => {
      if (Date.now() - started.current >= after) {
        setPrompt(true);
        track("client_game_prompt", { game: game.id });
        clearInterval(t);
      }
    }, 1000);
    return () => clearInterval(t);
  }, [live, prompt, game.id]);

  // countdown before the prompt can be dismissed
  useEffect(() => {
    if (!prompt) return;
    setUnlock(UNLOCK_SECONDS);
    const t = setInterval(() => {
      setUnlock((s) => {
        if (s <= 1) {
          clearInterval(t);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [prompt]);

  const pct = ((UNLOCK_SECONDS - unlock) / UNLOCK_SECONDS) * 100;

  return (
    <div className="w-full">
      <div className="rounded-3xl border-2 border-amber-400/40 bg-gradient-to-br from-amber-500/[0.07] via-transparent to-transparent p-4 sm:p-5 md:p-6">
        {/* client banner */}
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4 mb-5">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-400 text-black text-[10px] font-black uppercase tracking-wider">
                <BadgeCheck className="w-3 h-3" />
                Real client build
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/[0.06] border border-white/15 text-gray-300 text-[10px] font-medium">
                <Wrench className="w-3 h-3" />
                In progress
              </span>
              <span className="px-2.5 py-1 rounded-full bg-white/[0.06] border border-white/15 text-gray-400 text-[10px]">
                {game.client}
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-1">
              {game.title}{" "}
              <span className="text-amber-300/80 font-semibold text-lg md:text-xl">
                {game.level}
              </span>
            </h2>
            <p className="text-sm text-gray-400 max-w-2xl leading-relaxed">
              {game.blurb}
            </p>
          </div>

          {live && (
            <button
              onClick={() => setBig((b) => !b)}
              className="self-start inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.06] border border-white/20 text-sm text-gray-200 hover:bg-white/[0.12] hover:text-white transition-colors flex-shrink-0"
            >
              <Maximize2 className="w-4 h-4" />
              {big ? "Shrink" : "Bigger"}
            </button>
          )}
        </div>

        <div
          className={`relative w-full rounded-2xl overflow-hidden border border-amber-400/25 bg-[#07070b] shadow-2xl shadow-black/60 transition-all duration-300 ${
            big
              ? "aspect-[16/10] max-h-[86vh]"
              : "aspect-[16/10] sm:aspect-[16/9] max-h-[70vh]"
          }`}
        >
          {live ? (
            <>
              {!loaded && (
                <div className="absolute inset-0 grid place-items-center bg-[#07070b] z-10">
                  <div className="text-center">
                    <Loader2 className="w-6 h-6 animate-spin text-amber-400 mx-auto mb-3" />
                    <p className="text-xs text-gray-500">
                      Loading from the client's server…
                    </p>
                  </div>
                </div>
              )}
              <iframe
                key={game.id}
                src={game.url}
                title={`${game.title} ${game.level} — client game demo`}
                onLoad={() => setLoaded(true)}
                loading="lazy"
                referrerPolicy="no-referrer"
                sandbox="allow-scripts allow-same-origin allow-pointer-lock"
                allow="autoplay; fullscreen; gamepad; accelerometer; gyroscope"
                className="w-full h-full block border-0 bg-black"
              />

              {/* forced prompt after five minutes of play */}
              <AnimatePresence>
                {prompt && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 z-30 grid place-items-center bg-black/85 backdrop-blur-md p-4"
                  >
                    <motion.div
                      initial={{ scale: 0.94, y: 16 }}
                      animate={{ scale: 1, y: 0 }}
                      transition={{ type: "spring", stiffness: 280, damping: 24 }}
                      className="relative w-full max-w-md rounded-3xl border border-amber-400/40 bg-[#0e0c08] p-6 sm:p-8 text-center shadow-2xl"
                    >
                      {/* close, locked until the countdown finishes */}
                      <button
                        onClick={() => unlock === 0 && setPrompt(false)}
                        disabled={unlock > 0}
                        aria-label={
                          unlock > 0 ? `Closes in ${unlock}s` : "Close"
                        }
                        className={`absolute top-4 right-4 w-9 h-9 rounded-full grid place-items-center transition-all ${
                          unlock > 0
                            ? "cursor-not-allowed text-gray-500"
                            : "bg-white/10 border border-white/25 text-white hover:bg-white/25 hover:rotate-90"
                        }`}
                      >
                        {unlock > 0 ? (
                          <>
                            <svg
                              className="absolute inset-0 w-9 h-9 -rotate-90"
                              viewBox="0 0 36 36"
                              aria-hidden="true"
                            >
                              <circle
                                cx="18"
                                cy="18"
                                r="16"
                                fill="none"
                                stroke="rgba(255,255,255,0.12)"
                                strokeWidth="2.5"
                              />
                              <circle
                                cx="18"
                                cy="18"
                                r="16"
                                fill="none"
                                stroke="#fbbf24"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                                strokeDasharray={2 * Math.PI * 16}
                                strokeDashoffset={
                                  2 * Math.PI * 16 * (1 - pct / 100)
                                }
                                style={{ transition: "stroke-dashoffset 1s linear" }}
                              />
                            </svg>
                            <span className="relative text-[11px] font-bold text-amber-300">
                              {unlock}
                            </span>
                          </>
                        ) : (
                          <X className="w-4 h-4" strokeWidth={2.5} />
                        )}
                      </button>

                      <span className="inline-flex w-14 h-14 mb-5 rounded-2xl bg-amber-400/20 border border-amber-400/40 items-center justify-center">
                        <Wrench className="w-7 h-7 text-amber-300" />
                      </span>

                      <h3 className="text-2xl font-bold text-white mb-3 leading-snug">
                        Enjoying it? This was built for a client.
                      </h3>
                      <p className="text-gray-300 text-[15px] leading-relaxed mb-7">
                        Bismay builds games like this for brands, academies and
                        campaigns — playable anywhere, no install. Want one for
                        yours?
                      </p>

                      <div className="flex flex-col gap-2.5">
                        <button
                          onClick={() => {
                            track("client_game_prompt_book", { game: game.id });
                            setPrompt(false);
                            onBook();
                          }}
                          className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 text-black font-bold shadow-lg hover:brightness-110 transition-all"
                        >
                          Let's Talk
                          <ArrowRight className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            track("client_game_prompt_work", { game: game.id });
                            setPrompt(false);
                            onSeeWork();
                          }}
                          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full border border-white/25 text-white font-semibold hover:bg-white/10 transition-colors"
                        >
                          <LayoutGrid className="w-4 h-4" />
                          See my work
                        </button>
                        <p className="text-[11px] text-gray-600 mt-1">
                          {unlock > 0
                            ? `You can dismiss this in ${unlock}s`
                            : "Or dismiss and keep playing"}
                        </p>
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-[#16110a] to-[#07070b]"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => {
                  setLive(true);
                  track("client_game_launched", { game: game.id });
                }}
                className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 text-black font-bold text-lg shadow-2xl shadow-amber-600/30 hover:brightness-110 transition-all"
              >
                <Play className="w-5 h-5 fill-current" />
                Launch {game.title}
              </motion.button>
              <p className="mt-5 text-xs text-gray-500 max-w-sm leading-relaxed">
                Runs live from the client's server — nothing third-party loads
                until you press play.
              </p>
            </motion.div>
          )}
        </div>

        {/* what was built */}
        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
          {game.built.map((b) => (
            <p key={b} className="flex gap-2.5 text-[13px] text-gray-400">
              <BadgeCheck className="w-4 h-4 text-amber-400/70 flex-shrink-0 mt-px" />
              {b}
            </p>
          ))}
        </div>

        <div className="mt-5 pt-4 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <p className="inline-flex items-center gap-2 text-[11px] text-gray-500">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400/70" />
            Sandboxed embed — the frame can't navigate, pop up, or read this page.
          </p>
          <button
            onClick={() => {
              track("game_cta_book", { game: game.id });
              onBook();
            }}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 text-black text-sm font-bold hover:brightness-110 transition-all"
          >
            Build something like this
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
