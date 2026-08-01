import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Pause, Play, Volume2 } from "lucide-react";

/**
 * A recorded scroll-through of the live client site. Captured headlessly with
 * Playwright, so it is always the real product rather than a mockup.
 *
 * preload="none" + poster keeps the ~1MB clip off the critical path; playback
 * starts only when the element scrolls into view.
 */
export function SiteClip({
  src,
  poster,
  label,
  accentText,
  accentBorder,
}: {
  src: string;
  poster?: string;
  label: string;
  accentText: string;
  accentBorder: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.play().then(
            () => setPlaying(true),
            () => {} // autoplay blocked — the manual button still works
          );
        } else {
          el.pause();
          setPlaying(false);
        }
      },
      { threshold: 0.35 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const toggle = () => {
    const el = ref.current;
    if (!el) return;
    if (el.paused) {
      el.play();
      setPlaying(true);
    } else {
      el.pause();
      setPlaying(false);
    }
  };

  if (failed) return null;

  return (
    <motion.figure
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      className="relative"
    >
      <div
        className={`relative rounded-3xl overflow-hidden border ${accentBorder} bg-black shadow-2xl`}
      >
        {/* browser chrome so it reads as a real site, not a video asset */}
        <div className="flex items-center gap-2 px-4 py-3 bg-white/[0.06] border-b border-white/10">
          <span className="w-3 h-3 rounded-full bg-red-500/70" />
          <span className="w-3 h-3 rounded-full bg-yellow-500/70" />
          <span className="w-3 h-3 rounded-full bg-green-500/70" />
          <span className="ml-3 px-3 py-1 rounded-md bg-black/40 text-[11px] text-gray-400 font-mono truncate">
            {label}
          </span>
          <span
            className={`ml-auto flex items-center gap-1.5 text-[11px] font-semibold ${accentText}`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
            LIVE CAPTURE
          </span>
        </div>

        <video
          ref={ref}
          src={src}
          poster={poster}
          muted
          loop
          playsInline
          preload="none"
          onError={() => setFailed(true)}
          className="w-full block"
        />

        <button
          onClick={toggle}
          aria-label={playing ? "Pause site walkthrough" : "Play site walkthrough"}
          className="absolute bottom-4 right-4 p-3 rounded-full bg-black/70 backdrop-blur-sm border border-white/20 text-white hover:bg-black/90 hover:scale-110 transition-all"
        >
          {playing ? (
            <Pause className="w-4 h-4" />
          ) : (
            <Play className="w-4 h-4 ml-0.5" />
          )}
        </button>
      </div>
      <figcaption className="flex items-center justify-center gap-2 text-xs text-gray-500 mt-3">
        <Volume2 className="w-3 h-3 opacity-50" />
        Recorded from the live site — no mockups, no sound
      </figcaption>
    </motion.figure>
  );
}
