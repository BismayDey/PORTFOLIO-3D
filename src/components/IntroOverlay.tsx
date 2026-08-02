import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const KEY = "bd-intro-seen";

/**
 * First-load curtain. Shows once per tab session — a returning visitor should
 * never be made to sit through it again. Skipped entirely for anyone who has
 * asked for reduced motion.
 */
export function IntroOverlay({ onDone }: { onDone?: () => void }) {
  const [show, setShow] = useState(() => {
    if (typeof window === "undefined") return false;
    if (sessionStorage.getItem(KEY)) return false;
    return !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  });

  useEffect(() => {
    if (!show) {
      onDone?.();
      return;
    }
    document.body.style.overflow = "hidden";
    const t = setTimeout(() => {
      sessionStorage.setItem(KEY, "1");
      setShow(false);
      document.body.style.overflow = "";
      onDone?.();
    }, 2100);
    return () => {
      clearTimeout(t);
      document.body.style.overflow = "";
    };
  }, [show, onDone]);

  const name = "BISMAY DEY";

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          exit={{ y: "-100%" }}
          transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
          className="fixed inset-0 z-[200] bg-black flex flex-col items-center justify-center"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="relative mb-8"
          >
            <div className="absolute inset-0 blur-3xl bg-purple-600/40 rounded-full scale-150" />
            <img
              src="/favio.png"
              alt=""
              width={72}
              height={72}
              className="relative w-16 h-16 md:w-20 md:h-20 rounded-2xl"
            />
          </motion.div>

          <div className="flex overflow-hidden" aria-label="Bismay Dey">
            {name.split("").map((ch, i) => (
              <motion.span
                key={i}
                initial={{ y: "110%", opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{
                  delay: 0.25 + i * 0.045,
                  duration: 0.6,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="text-2xl sm:text-4xl md:text-5xl font-black uppercase tracking-[0.2em] bg-gradient-to-r from-purple-300 via-pink-400 to-rose-400 bg-clip-text text-transparent"
              >
                {ch === " " ? " " : ch}
              </motion.span>
            ))}
          </div>

          <div className="mt-8 h-px w-40 sm:w-56 bg-white/10 overflow-hidden rounded-full">
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1.7, ease: "easeInOut" }}
              className="h-full w-full origin-left bg-gradient-to-r from-purple-400 to-pink-400"
            />
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="mt-5 text-[11px] uppercase tracking-[0.3em] text-gray-600"
          >
            Full-Stack Developer
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
