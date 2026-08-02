import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, CalendarDays, X } from "lucide-react";
import { track } from "../lib/analytics";

const KEY = "bd-exit-shown";

/**
 * Fires once per session when the cursor leaves toward the browser chrome —
 * i.e. someone who read a case study and is about to leave. Desktop only;
 * there is no equivalent signal on touch and guessing would just annoy people.
 */
export function ExitIntent({ onBook }: { onBook: () => void }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem(KEY)) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;

    // don't fire on someone who just arrived
    let armed = false;
    const arm = setTimeout(() => {
      armed = true;
    }, 15000);

    const onLeave = (e: MouseEvent) => {
      if (!armed || e.clientY > 8 || e.relatedTarget) return;
      sessionStorage.setItem(KEY, "1");
      setOpen(true);
      track("exit_intent_shown", { path: window.location.pathname });
      document.removeEventListener("mouseout", onLeave);
    };

    document.addEventListener("mouseout", onLeave);
    return () => {
      clearTimeout(arm);
      document.removeEventListener("mouseout", onLeave);
    };
  }, []);

  const close = () => setOpen(false);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={(e) => e.target === e.currentTarget && close()}
          className="fixed inset-0 z-[92] bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Before you go"
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 300, damping: 26 }}
            className="relative w-full max-w-md bg-[#0e0e14] border border-purple-500/30 rounded-3xl p-7 sm:p-8 shadow-2xl shadow-purple-900/40 text-center"
          >
            <button
              onClick={close}
              aria-label="Close"
              className="absolute top-4 right-4 p-2 rounded-full bg-white/10 border border-white/25 text-white hover:bg-white/25 hover:rotate-90 transition-all duration-300"
            >
              <X className="w-4 h-4" strokeWidth={2.5} />
            </button>

            <span className="inline-flex w-14 h-14 mb-5 rounded-2xl bg-purple-500/20 border border-purple-400/30 items-center justify-center">
              <CalendarDays className="w-7 h-7 text-purple-300" />
            </span>

            <h2 className="text-2xl font-bold text-white mb-3 leading-snug">
              Seen something you'd want built?
            </h2>
            <p className="text-gray-300 text-[15px] leading-relaxed mb-7">
              Grab 30 minutes with Bismay. No pitch — just scope, a realistic
              timeline, and a price. Free either way.
            </p>

            <div className="flex flex-col gap-2.5">
              <button
                onClick={() => {
                  track("exit_intent_book");
                  close();
                  onBook();
                }}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white font-semibold shadow-lg hover:brightness-110 transition-all"
              >
                Book a 30-min call
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  track("exit_intent_dismiss");
                  close();
                }}
                className="px-6 py-2.5 rounded-full text-sm text-gray-400 hover:text-white transition-colors"
              >
                Not right now
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
