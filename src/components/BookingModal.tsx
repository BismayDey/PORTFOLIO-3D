import { lazy, Suspense, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CalendarDays, Loader2, Mail, X } from "lucide-react";
import { track } from "../lib/analytics";

// Cal's embed pulls its own bundle — keep it out of the entry chunk.
const Cal = lazy(() => import("@calcom/embed-react"));

const CAL_LINK = "bismay-dey/30min";
const CAL_NAMESPACE = "30min";

export function BookingModal({
  open,
  onClose,
  onUseForm,
}: {
  open: boolean;
  onClose: () => void;
  onUseForm: () => void;
}) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    (async () => {
      try {
        const { getCalApi } = await import("@calcom/embed-react");
        const cal = await getCalApi({ namespace: CAL_NAMESPACE });
        cal("ui", {
          hideEventTypeDetails: false,
          layout: "month_view",
          theme: "dark",
          cssVarsPerTheme: {
            dark: {
              "cal-brand": "#a855f7",
              "cal-bg": "#0b0b10",
              "cal-bg-emphasis": "#17171f",
            },
            light: { "cal-brand": "#a855f7" },
          },
        });
        if (!cancelled) setReady(true);
      } catch {
        if (!cancelled) setReady(true); // let the iframe try regardless
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={(e) => e.target === e.currentTarget && onClose()}
          className="fixed inset-0 z-[95] bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6"
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Book a call with Bismay"
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 280, damping: 26 }}
            className="relative w-full max-w-5xl h-[92vh] sm:h-[88vh] flex flex-col bg-[#0b0b10] border border-purple-500/30 rounded-3xl shadow-2xl shadow-purple-900/40 overflow-hidden"
          >
            <div className="flex items-center gap-3 px-5 py-4 border-b border-white/10 bg-gradient-to-r from-purple-600/20 to-fuchsia-600/10 flex-shrink-0">
              <span className="w-9 h-9 rounded-xl bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                <CalendarDays className="w-5 h-5 text-purple-300" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-bold text-white text-sm sm:text-base leading-tight">
                  Book a 30-minute call
                </p>
                <p className="text-[11px] sm:text-xs text-gray-400">
                  Pick any slot that suits you — no back-and-forth email
                </p>
              </div>
              <button
                onClick={() => {
                  track("booking_switch_to_form");
                  onUseForm();
                }}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
              >
                <Mail className="w-3.5 h-3.5" />
                Rather send a message?
              </button>
              <button
                onClick={onClose}
                aria-label="Close booking"
                className="p-2 rounded-full bg-white/10 border border-white/25 text-white hover:bg-white/25 hover:rotate-90 transition-all duration-300"
              >
                <X className="w-5 h-5" strokeWidth={2.5} />
              </button>
            </div>

            <div className="flex-1 min-h-0 bg-[#0b0b10] [&_iframe]:!h-full [&>div]:!h-full">
              <Suspense
                fallback={
                  <div className="h-full flex items-center justify-center bg-[#0b0b10]">
                    <Loader2 className="w-6 h-6 animate-spin text-purple-400" />
                  </div>
                }
              >
                {ready && (
                  <Cal
                    namespace={CAL_NAMESPACE}
                    calLink={CAL_LINK}
                    style={{
                      width: "100%",
                      height: "100%",
                      overflow: "auto",
                    }}
                    config={{
                      layout: "month_view",
                      useSlotsViewOnSmallScreen: "true",
                    }}
                  />
                )}
              </Suspense>
            </div>

            <button
              onClick={() => {
                track("booking_switch_to_form");
                onUseForm();
              }}
              className="sm:hidden py-3 text-xs text-gray-300 border-t border-white/10 bg-black/60"
            >
              Rather send a message instead?
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
