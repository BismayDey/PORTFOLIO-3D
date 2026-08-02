import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import {
  ArrowRight,
  FileDown,
  FileText,
  Github,
  Instagram,
  Linkedin,
  Loader2,
  Mail,
  MapPin,
  MessageCircle,
  MousePointerClick,
  LayoutGrid,
} from "lucide-react";

const ROLES = [
  "Full-Stack Developer",
  "Mobile App Developer",
  "AI / ML Engineer",
  "Web Game Developer",
  "Shopify & WordPress Developer",
  "AI Video Manager",
  "SEO Specialist",
];

const STATS = [
  { value: "19+", label: "client platforms" },
  { value: "50+", label: "projects shipped" },
  { value: "12", label: "roles held" },
  { value: "10+", label: "hackathons won" },
];

const SOCIALS = [
  { icon: Github, href: "https://github.com/BismayDey", label: "GitHub" },
  {
    icon: Linkedin,
    href: "https://www.linkedin.com/in/bismay-dey-634937268/",
    label: "LinkedIn",
  },
  {
    icon: Instagram,
    href: "https://www.instagram.com/carbon_alternater/",
    label: "Instagram",
  },
  { icon: Mail, href: "mailto:bismaydey001@gmail.com", label: "Email" },
];

const MARQUEE = [
  "Next.js",
  "React",
  "TypeScript",
  "Node.js",
  "Three.js",
  "Firebase",
  "MongoDB",
  "Shopify",
  "WordPress",
  "Tailwind",
  "AWS",
  "Docker",
];

/** Types one role, holds, deletes, moves to the next. */
function RoleTyper() {
  const [i, setI] = useState(0);
  const [text, setText] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const full = ROLES[i];
    if (!deleting && text === full) {
      const hold = setTimeout(() => setDeleting(true), 1800);
      return () => clearTimeout(hold);
    }
    if (deleting && text === "") {
      setDeleting(false);
      setI((n) => (n + 1) % ROLES.length);
      return;
    }
    const step = setTimeout(
      () =>
        setText(
          deleting ? full.slice(0, text.length - 1) : full.slice(0, text.length + 1)
        ),
      deleting ? 35 : 65
    );
    return () => clearTimeout(step);
  }, [text, deleting, i]);

  return (
    <span className="inline-flex items-baseline">
      <span className="bg-gradient-to-r from-purple-300 via-pink-300 to-rose-300 bg-clip-text text-transparent">
        {text}
      </span>
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.6, repeat: Infinity, repeatType: "reverse" }}
        className="ml-1 inline-block w-[3px] h-[0.9em] bg-pink-400 translate-y-[0.06em]"
      />
    </span>
  );
}

export function Hero({
  onTalk,
  onSeeWork,
  onDownloadResume,
  isDownloading,
}: {
  onTalk: () => void;
  onSeeWork: () => void;
  onDownloadResume: () => void;
  isDownloading: boolean;
}) {
  // gentle parallax — the copy drifts against the 3D layer behind it
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 60, damping: 20 });
  const sy = useSpring(my, { stiffness: 60, damping: 20 });
  const tx = useTransform(sx, [-0.5, 0.5], [14, -14]);
  const ty = useTransform(sy, [-0.5, 0.5], [10, -10]);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mx.set(e.clientX / window.innerWidth - 0.5);
      my.set(e.clientY / window.innerHeight - 0.5);
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [mx, my]);

  const name = "Bismay Dey";
  const base = 0.15;

  return (
    <header
      id="hero"
      className="relative min-h-[100svh] flex items-center px-4 md:px-8 pt-28 pb-36 md:pt-32 md:pb-40 overflow-hidden"
    >
      {/* Legibility scrim — the drifting 3D shapes otherwise wander across the
          headline. Left-weighted so the core on the right stays fully visible. */}
      <div className="absolute inset-0 z-[1] pointer-events-none bg-[radial-gradient(ellipse_70%_80%_at_10%_50%,rgba(0,0,0,0.92)_0%,rgba(0,0,0,0.75)_35%,transparent_70%)]" />
      <div className="absolute inset-y-0 left-0 w-full lg:w-3/5 z-[1] pointer-events-none bg-gradient-to-r from-black/85 via-black/45 to-transparent" />

      {/* bottom fade into the next section */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-black via-black/70 to-transparent pointer-events-none z-[1]" />

      <motion.div
        style={{ x: tx, y: ty }}
        className="relative z-10 max-w-7xl mx-auto w-full"
      >
        <div className="max-w-3xl">
          {/* availability */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: base, duration: 0.5 }}
            className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/[0.06] border border-white/15 backdrop-blur-md mb-6"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75 animate-ping" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-green-400" />
            </span>
            <span className="text-xs sm:text-sm text-gray-200 font-medium">
              Available for freelance &amp; full-time
            </span>
            <span className="hidden sm:inline-flex items-center gap-1 text-xs text-gray-500 pl-2 border-l border-white/15">
              <MapPin className="w-3 h-3" />
              Kolkata, IN
            </span>
          </motion.div>

          {/* name — per-character reveal */}
          <h1 className="text-[clamp(2.75rem,10vw,7rem)] font-black leading-[0.92] tracking-tight mb-4">
            <span className="sr-only">{name}</span>
            <span aria-hidden="true" className="flex flex-wrap">
              {name.split("").map((ch, i) => (
                <motion.span
                  key={i}
                  initial={{ y: "0.4em", opacity: 0, rotateX: -60 }}
                  animate={{ y: 0, opacity: 1, rotateX: 0 }}
                  transition={{
                    delay: base + 0.1 + i * 0.045,
                    duration: 0.7,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="inline-block bg-gradient-to-br from-white via-purple-100 to-purple-300 bg-clip-text text-transparent"
                  style={{ transformOrigin: "bottom" }}
                >
                  {ch === " " ? " " : ch}
                </motion.span>
              ))}
            </span>
          </h1>

          {/* rotating role */}
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: base + 0.55, duration: 0.5 }}
            className="text-xl sm:text-2xl md:text-4xl font-bold mb-6 min-h-[1.4em]"
          >
            <RoleTyper />
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: base + 0.68, duration: 0.5 }}
            className="text-base sm:text-lg md:text-xl text-gray-300 leading-relaxed max-w-2xl mb-9"
          >
            I build products end to end — web platforms, mobile apps, AI
            features and browser games. Architecture through deployment, then
            the maintenance and search visibility that keep them working.
          </motion.p>

          {/* actions */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: base + 0.8, duration: 0.5 }}
            className="flex flex-wrap items-center gap-3 mb-4"
          >
            <motion.button
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.97 }}
              onClick={onTalk}
              className="group inline-flex items-center justify-center gap-2.5 px-6 sm:px-7 py-3.5 rounded-full bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white font-semibold shadow-lg shadow-purple-500/30 hover:shadow-purple-500/55 hover:brightness-110 transition-all"
            >
              <MessageCircle className="w-5 h-5" />
              Let's Talk
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.97 }}
              onClick={onSeeWork}
              className="group inline-flex items-center justify-center gap-2.5 px-6 sm:px-7 py-3.5 rounded-full bg-white/[0.08] border border-white/20 text-white font-semibold backdrop-blur-md hover:bg-white/[0.15] hover:border-white/40 transition-all"
            >
              <LayoutGrid className="w-5 h-5" />
              See my work
            </motion.button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: base + 0.88, duration: 0.5 }}
            className="flex flex-wrap items-center gap-3 mb-10"
          >
            <motion.button
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.97 }}
              onClick={onDownloadResume}
              disabled={isDownloading}
              className="inline-flex items-center justify-center gap-2.5 px-6 sm:px-7 py-3.5 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold shadow-lg shadow-pink-500/25 hover:shadow-pink-500/45 hover:brightness-110 disabled:opacity-70 disabled:cursor-wait transition-all"
            >
              {isDownloading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <FileDown className="w-5 h-5" />
              )}
              {isDownloading ? "Downloading…" : "Download Resume"}
            </motion.button>

            <motion.a
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.97 }}
              href="/BISMAY DEY.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2.5 px-6 sm:px-7 py-3.5 rounded-full bg-white/[0.08] border border-white/20 text-white font-semibold backdrop-blur-md hover:bg-white/[0.15] hover:border-white/40 transition-all"
            >
              <FileText className="w-5 h-5" />
              View Resume
            </motion.a>
          </motion.div>

          {/* stats */}
          <motion.dl
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: base + 0.95, duration: 0.6 }}
            className="flex flex-wrap gap-x-8 sm:gap-x-12 gap-y-4 mb-9"
          >
            {STATS.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: base + 1 + i * 0.08 }}
              >
                <dt className="sr-only">{s.label}</dt>
                <dd>
                  <span className="block text-2xl sm:text-3xl font-bold text-white leading-none mb-1">
                    {s.value}
                  </span>
                  <span className="text-xs sm:text-sm text-gray-500">
                    {s.label}
                  </span>
                </dd>
              </motion.div>
            ))}
          </motion.dl>

          {/* socials */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: base + 1.25 }}
            className="flex items-center gap-2"
          >
            {SOCIALS.map(({ icon: Icon, href, label }) => (
              <motion.a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                whileHover={{ y: -3, scale: 1.08 }}
                className="w-10 h-10 rounded-full bg-white/[0.06] border border-white/15 flex items-center justify-center text-gray-300 hover:text-white hover:border-white/40 hover:bg-white/[0.12] backdrop-blur-md transition-colors"
              >
                <Icon className="w-4 h-4" />
              </motion.a>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* drag hint for the 3D layer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.2 }}
        className="hidden xl:flex absolute right-10 bottom-40 z-10 items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-gray-500 pointer-events-none"
      >
        <MousePointerClick className="w-3.5 h-3.5" />
        Drag to orbit
      </motion.div>

      {/* tech ticker */}
      <div className="absolute bottom-16 md:bottom-20 left-0 right-0 z-[2] overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_12%,black_88%,transparent)]">
        <motion.div
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
          className="flex gap-8 whitespace-nowrap w-max"
        >
          {[...MARQUEE, ...MARQUEE].map((t, i) => (
            <span
              key={i}
              className="text-xs sm:text-sm font-medium text-gray-600 flex items-center gap-8"
            >
              {t}
              <span className="w-1 h-1 rounded-full bg-gray-700" />
            </span>
          ))}
        </motion.div>
      </div>

      {/* scroll cue */}
      <motion.button
        onClick={onSeeWork}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        aria-label="Scroll to content"
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 group"
      >
        <span className="text-[10px] uppercase tracking-[0.28em] text-gray-600 group-hover:text-gray-400 transition-colors">
          Scroll
        </span>
        <span className="w-5 h-8 rounded-full border border-white/20 flex items-start justify-center p-1.5 group-hover:border-white/40 transition-colors">
          <motion.span
            animate={{ y: [0, 8, 0], opacity: [1, 0.2, 1] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            className="w-1 h-1 rounded-full bg-purple-300"
          />
        </span>
      </motion.button>
    </header>
  );
}
