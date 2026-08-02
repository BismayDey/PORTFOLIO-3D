import { lazy, Suspense, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Gamepad2,
  Loader2,
  Orbit,
  Rocket,
  TerminalSquare,
  Layers3,
} from "lucide-react";
import { CLIENT_GAMES } from "../games/ClientGameDemo";
import { BookingModal } from "../components/BookingModal";
import { ContactModal } from "../components/ContactModal";
import { SITE_URL, useSeo } from "../lib/seo";
import { track } from "../lib/analytics";

// Each game is its own chunk — landing on /play should not download all four.
const ShipIt = lazy(() => import("../games/ShipIt").then((m) => ({ default: m.ShipIt })));
const OrbitBreaker = lazy(() =>
  import("../games/OrbitBreaker").then((m) => ({ default: m.OrbitBreaker }))
);
const BuildTheStack = lazy(() =>
  import("../games/BuildTheStack").then((m) => ({ default: m.BuildTheStack }))
);
const TerminalGame = lazy(() =>
  import("../games/Terminal").then((m) => ({ default: m.Terminal }))
);
const ClientGameDemo = lazy(() =>
  import("../games/ClientGameDemo").then((m) => ({ default: m.ClientGameDemo }))
);

const GAMES = [
  {
    id: "ship-it",
    name: "Ship It",
    icon: Rocket,
    tag: "Canvas 2D",
    blurb: "Dodge bugs, scope creep and 2am deadlines. Catch the coffee.",
    accent: "from-amber-500/20 to-orange-500/10 border-amber-400/30",
    dot: "bg-amber-400",
  },
  {
    id: "orbit-breaker",
    name: "Orbit Breaker",
    icon: Orbit,
    tag: "Three.js / WebGL",
    blurb: "Click decaying fragments orbiting a distorting core. 45 seconds.",
    accent: "from-purple-500/20 to-fuchsia-500/10 border-purple-400/30",
    dot: "bg-purple-400",
  },
  {
    id: "build-the-stack",
    name: "Build the Stack",
    icon: Layers3,
    tag: "Canvas 2D",
    blurb: "Tetris, but every block is a tech Bismay actually ships in.",
    accent: "from-cyan-500/20 to-sky-500/10 border-cyan-400/30",
    dot: "bg-cyan-400",
  },
  {
    id: "terminal",
    name: "bismay --help",
    icon: TerminalSquare,
    tag: "DOM / React",
    blurb: "The whole portfolio as a shell. ls, cat, open, hire --now.",
    accent: "from-emerald-500/20 to-green-500/10 border-emerald-400/30",
    dot: "bg-emerald-400",
  },
] as const;

type GameId = (typeof GAMES)[number]["id"];

export default function PlayPage() {
  const [active, setActive] = useState<GameId | null>(null);
  const [clientGame, setClientGame] = useState<string>(CLIENT_GAMES[0].id);
  const [booking, setBooking] = useState(false);
  const [contact, setContact] = useState(false);

  useSeo({
    title: "Playable Demos — Browser Games by Bismay Dey | Web Game Developer",
    description:
      "Four playable browser games built with Three.js, WebGL and Canvas — proof that Bismay Dey builds real web games, not just landing pages. Play free, no signup.",
    path: "/play",
    jsonLd: GAMES.map((g) => ({
      "@context": "https://schema.org",
      "@type": "VideoGame",
      name: g.name,
      description: g.blurb,
      url: `${SITE_URL}/play`,
      gamePlatform: "Web Browser",
      applicationCategory: "Game",
      operatingSystem: "Any",
      author: { "@type": "Person", name: "Bismay Dey", url: SITE_URL },
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    })),
  });

  const openGame = (id: GameId) => {
    setActive(id);
    track("game_started", { game: id });
    setTimeout(
      () => document.getElementById("stage")?.scrollIntoView({ behavior: "smooth" }),
      80
    );
  };

  return (
    <main className="min-h-screen bg-black text-white">
      <nav className="sticky top-0 z-40 backdrop-blur-xl bg-black/70 border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between gap-4">
          <Link
            to="/"
            className="group inline-flex items-center gap-2 text-sm text-gray-300 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to portfolio
          </Link>
          <button
            onClick={() => {
              setBooking(true);
              track("cta_click", { where: "play-nav" });
            }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-600 to-fuchsia-600 text-sm font-semibold shadow-lg hover:brightness-110 transition-all"
          >
            Let's Talk
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </nav>

      <header className="relative px-4 md:px-8 pt-14 pb-10 md:pt-20 overflow-hidden">
        <div className="absolute -top-32 left-1/4 w-[34rem] h-[34rem] bg-purple-600/15 rounded-full blur-[130px] pointer-events-none" />
        <div className="relative z-10 max-w-6xl mx-auto">
          <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/[0.06] border border-white/15 mb-6">
            <Gamepad2 className="w-4 h-4 text-purple-300" />
            <span className="text-xs sm:text-sm text-gray-200 font-medium">
              Playable proof · no signup
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-5 leading-[1.02]">
            Anyone can claim{" "}
            <span className="bg-gradient-to-r from-amber-300 via-purple-300 to-cyan-300 bg-clip-text text-transparent">
              web game development.
            </span>
          </h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-2xl leading-relaxed">
            So here are two live client builds and four arcade demos, all
            running in your browser right now. Three.js, WebGL, plain Canvas.
          </p>
        </div>
      </header>

      {/* Real client work — deliberately separated from the demos */}
      <section className="px-4 md:px-8 pb-14">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6">
            <div>
              <div className="flex items-center gap-2.5 mb-2">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                <span className="text-[11px] uppercase tracking-[0.22em] font-bold text-amber-300">
                  Shipped for a paying client
                </span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
                Real client work
              </h2>
              <p className="text-gray-400 max-w-2xl leading-relaxed">
                Two modules from a game-based learning platform being built for
                Honey Treat Academy. These are live builds running from the
                client's own servers — not demos made for this page.
              </p>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              {CLIENT_GAMES.map((cg) => (
                <button
                  key={cg.id}
                  onClick={() => {
                    setClientGame(cg.id);
                    track("client_game_tab", { game: cg.id });
                  }}
                  className={`px-4 py-2 rounded-full text-sm font-semibold border transition-all ${
                    clientGame === cg.id
                      ? "bg-amber-400 text-black border-amber-300 shadow-lg shadow-amber-500/25"
                      : "bg-white/[0.05] text-gray-300 border-white/15 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {cg.title}
                </button>
              ))}
            </div>
          </div>

          <Suspense
            fallback={
              <div className="aspect-[16/9] rounded-3xl border-2 border-amber-400/20 grid place-items-center">
                <Loader2 className="w-6 h-6 animate-spin text-amber-400" />
              </div>
            }
          >
            <ClientGameDemo
              game={
                CLIENT_GAMES.find((c) => c.id === clientGame) ?? CLIENT_GAMES[0]
              }
              onBook={() => setBooking(true)}
              onSeeWork={() => {
                window.location.href = "/#client-projects";
              }}
            />
          </Suspense>
        </div>
      </section>

      {/* Arcade demos */}
      <section className="px-4 md:px-8 pb-10">
        <div className="max-w-6xl mx-auto">
          <div className="mb-6">
            <div className="flex items-center gap-2.5 mb-2">
              <span className="w-2 h-2 rounded-full bg-purple-400" />
              <span className="text-[11px] uppercase tracking-[0.22em] font-bold text-purple-300">
                Built for this page
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
              Four arcade demos
            </h2>
            <p className="text-gray-400 max-w-2xl leading-relaxed">
              Written from scratch in Three.js, WebGL and plain Canvas — no game
              engine, no download, works on a phone.
            </p>
          </div>
        </div>
      </section>

      <section className="px-4 md:px-8 pb-10">
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {GAMES.map((g, i) => {
            const on = active === g.id;
            return (
              <motion.button
                key={g.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
                whileHover={{ y: -5 }}
                onClick={() => openGame(g.id)}
                className={`group text-left rounded-3xl border-2 bg-gradient-to-br p-5 transition-all ${g.accent} ${
                  on ? "ring-2 ring-white/40" : "hover:border-white/35"
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="p-2.5 rounded-xl bg-white/10 group-hover:scale-110 transition-transform">
                    <g.icon className="w-5 h-5 text-white" />
                  </span>
                  <span className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-gray-400">
                    <span className={`w-1.5 h-1.5 rounded-full ${g.dot}`} />
                    {g.tag}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white mb-1.5">{g.name}</h3>
                <p className="text-[13px] text-gray-400 leading-relaxed">
                  {g.blurb}
                </p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-white group-hover:gap-2.5 transition-all">
                  {on ? "Playing" : "Play"} <ArrowRight className="w-3 h-3" />
                </span>
              </motion.button>
            );
          })}
        </div>
      </section>

      <section id="stage" className="px-4 md:px-8 pb-20 scroll-mt-24">
        <div className="max-w-6xl mx-auto">
          <AnimatePresence mode="wait">
            {active ? (
              <motion.div
                key={active}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
              >
                <Suspense
                  fallback={
                    <div className="aspect-[16/9] rounded-3xl border-2 border-white/10 grid place-items-center">
                      <Loader2 className="w-6 h-6 animate-spin text-purple-400" />
                    </div>
                  }
                >
                  {active === "ship-it" && <ShipIt onBook={() => setBooking(true)} />}
                  {active === "orbit-breaker" && (
                    <OrbitBreaker onBook={() => setBooking(true)} />
                  )}
                  {active === "build-the-stack" && (
                    <BuildTheStack onBook={() => setBooking(true)} />
                  )}
                  {active === "terminal" && (
                    <TerminalGame onBook={() => setBooking(true)} />
                  )}

                </Suspense>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="rounded-3xl border-2 border-dashed border-white/10 py-20 text-center"
              >
                <Gamepad2 className="w-10 h-10 mx-auto mb-4 text-gray-700" />
                <p className="text-gray-500">Pick a game above to start playing.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      <section className="px-4 md:px-8 pb-24">
        <div className="max-w-6xl mx-auto rounded-3xl border border-purple-400/30 bg-gradient-to-br from-purple-950/50 to-[#0d0a14] p-8 md:p-12 text-center overflow-hidden relative">
          <div className="absolute -bottom-24 -right-16 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl" />
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Want one of these for your brand?
            </h2>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto mb-8 leading-relaxed">
              Browser games convert better than banner ads and people actually
              share them. Campaign games, product demos, interactive 3D — built
              to run anywhere without a download.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => {
                  setBooking(true);
                  track("cta_click", { where: "play-footer" });
                }}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-white text-black font-bold shadow-2xl hover:scale-105 transition-transform"
              >
                Book a 30-min call
                <ArrowRight className="w-4 h-4" />
              </button>
              <Link
                to="/#services"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full border border-white/30 font-semibold hover:bg-white/10 transition-colors"
              >
                See all services
              </Link>
            </div>
          </div>
        </div>
      </section>

      <BookingModal
        open={booking}
        onClose={() => setBooking(false)}
        onUseForm={() => {
          setBooking(false);
          setContact(true);
        }}
      />
      <ContactModal
        open={contact}
        onClose={() => setContact(false)}
        onSeeProjects={() => {
          window.location.href = "/#client-projects";
        }}
      />
    </main>
  );
}
