import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import confetti from "canvas-confetti";
import {
  ArrowRight,
  CheckCircle2,
  Loader2,
  MessageCircle,
  Send,
  X,
} from "lucide-react";

// Web3Forms access key — free, no backend. Get one at https://web3forms.com
// and paste it here; until then the form falls back to opening WhatsApp with
// the enquiry pre-filled so no lead is ever lost.
const WEB3FORMS_KEY = "";

const WHATSAPP_NUMBER = "918100314152";

export const SERVICES = [
  "Custom Web App (Next.js / React)",
  "Website Development",
  "Mobile App Development",
  "AI Feature Development",
  "Chatbot Development",
  "AI Video",
  "Video Editing",
  "WordPress Website",
  "Shopify Store",
  "Webflow Website",
  "Web Game Development",
  "Web Design",
  "Figma Design",
  "Fixes & Rescue Work",
  "Maintenance & Support",
  "Something else",
];

type Status = "idle" | "sending" | "done" | "error";

export function ContactModal({
  open,
  onClose,
  onSeeProjects,
}: {
  open: boolean;
  onClose: () => void;
  onSeeProjects: () => void;
}) {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    service: "",
    message: "",
  });
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  // reset a moment after closing so the exit animation isn't jarring
  useEffect(() => {
    if (open) return;
    const t = setTimeout(() => {
      setStatus("idle");
      setError("");
      setForm({ name: "", email: "", phone: "", service: "", message: "" });
    }, 400);
    return () => clearTimeout(t);
  }, [open]);

  const fireConfetti = () => {
    const base = { spread: 70, ticks: 220, zIndex: 100 };
    confetti({ ...base, particleCount: 90, origin: { x: 0.2, y: 0.7 }, angle: 60 });
    confetti({ ...base, particleCount: 90, origin: { x: 0.8, y: 0.7 }, angle: 120 });
    setTimeout(
      () =>
        confetti({
          ...base,
          particleCount: 140,
          spread: 100,
          origin: { y: 0.6 },
        }),
      220
    );
  };

  const whatsappFallback = () => {
    const text = encodeURIComponent(
      `Hi Bismay, I'd like to discuss a project.\n\n` +
        `Name: ${form.name}\n` +
        `Email: ${form.email}\n` +
        `Phone: ${form.phone}\n` +
        `Service: ${form.service}\n\n` +
        `${form.message}`
    );
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${text}`, "_blank");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    setError("");

    try {
      if (WEB3FORMS_KEY) {
        const res = await fetch("https://api.web3forms.com/submit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            access_key: WEB3FORMS_KEY,
            subject: `New project enquiry — ${form.service || "General"}`,
            from_name: "Portfolio contact form",
            ...form,
          }),
        });
        const data = await res.json();
        if (!data.success) throw new Error(data.message || "Submission failed");
      } else {
        // No key configured yet — hand the enquiry to WhatsApp instead of
        // silently dropping it.
        whatsappFallback();
      }
      setStatus("done");
      fireConfetti();
    } catch (err) {
      setStatus("error");
      setError(
        err instanceof Error ? err.message : "Something went wrong. Try WhatsApp?"
      );
    }
  };

  const field =
    "w-full px-4 py-3 rounded-xl bg-white/5 border border-white/15 text-white placeholder:text-gray-500 focus:outline-none focus:border-emerald-400/70 focus:ring-2 focus:ring-emerald-400/20 transition-colors";

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={(e) => e.target === e.currentTarget && onClose()}
          className="fixed inset-0 z-[90] bg-black/80 backdrop-blur-md flex items-start md:items-center justify-center p-4 overflow-y-auto"
        >
          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="contact-modal-title"
            initial={{ opacity: 0, y: 30, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
            className="relative w-full max-w-lg my-8 bg-gradient-to-br from-gray-900 to-black border border-emerald-500/30 rounded-3xl shadow-2xl shadow-emerald-500/10 overflow-hidden"
          >
            <button
              onClick={onClose}
              aria-label="Close contact form"
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/5 hover:bg-white/15 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {status === "done" ? (
              <div className="p-8 md:p-10 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 260, damping: 16 }}
                  className="w-20 h-20 mx-auto mb-6 rounded-full bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center"
                >
                  <CheckCircle2 className="w-10 h-10 text-emerald-400" />
                </motion.div>
                <h2
                  id="contact-modal-title"
                  className="text-2xl md:text-3xl font-bold mb-3 text-white"
                >
                  Thanks, {form.name.split(" ")[0] || "there"}!
                </h2>
                <p className="text-gray-400 mb-8 leading-relaxed">
                  Your enquiry is in. I reply to every message personally —
                  usually within a few hours.
                </p>

                <div className="flex flex-col gap-3">
                  <button
                    onClick={() => {
                      onClose();
                      onSeeProjects();
                    }}
                    className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold shadow-lg hover:brightness-110 transition-all"
                  >
                    See my client projects
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <a
                    href={`https://wa.me/${WHATSAPP_NUMBER}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold shadow-lg hover:brightness-110 transition-all"
                  >
                    <MessageCircle className="w-4 h-4" />
                    Continue on WhatsApp
                  </a>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="p-6 md:p-8">
                <h2
                  id="contact-modal-title"
                  className="text-2xl md:text-3xl font-bold mb-2 bg-gradient-to-r from-emerald-400 to-green-400 bg-clip-text text-transparent"
                >
                  Let's build something
                </h2>
                <p className="text-sm text-gray-400 mb-6">
                  Tell me what you need. I'll come back with scope, timeline and
                  a price.
                </p>

                <div className="space-y-4">
                  <div>
                    <label htmlFor="cm-name" className="sr-only">
                      Your name
                    </label>
                    <input
                      id="cm-name"
                      required
                      value={form.name}
                      onChange={(e) =>
                        setForm({ ...form, name: e.target.value })
                      }
                      placeholder="Your name *"
                      className={field}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="cm-email" className="sr-only">
                        Email address
                      </label>
                      <input
                        id="cm-email"
                        type="email"
                        required
                        value={form.email}
                        onChange={(e) =>
                          setForm({ ...form, email: e.target.value })
                        }
                        placeholder="Email *"
                        className={field}
                      />
                    </div>
                    <div>
                      <label htmlFor="cm-phone" className="sr-only">
                        Phone number
                      </label>
                      <input
                        id="cm-phone"
                        type="tel"
                        required
                        value={form.phone}
                        onChange={(e) =>
                          setForm({ ...form, phone: e.target.value })
                        }
                        placeholder="Phone / WhatsApp *"
                        className={field}
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="cm-service" className="sr-only">
                      Service needed
                    </label>
                    <select
                      id="cm-service"
                      required
                      value={form.service}
                      onChange={(e) =>
                        setForm({ ...form, service: e.target.value })
                      }
                      className={`${field} ${
                        form.service ? "text-white" : "text-gray-500"
                      }`}
                    >
                      <option value="" disabled className="bg-gray-900">
                        What do you need? *
                      </option>
                      {SERVICES.map((s) => (
                        <option key={s} value={s} className="bg-gray-900">
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="cm-message" className="sr-only">
                      Project details
                    </label>
                    <textarea
                      id="cm-message"
                      rows={4}
                      value={form.message}
                      onChange={(e) =>
                        setForm({ ...form, message: e.target.value })
                      }
                      placeholder="Anything else — budget, deadline, links to what you have now"
                      className={`${field} resize-none`}
                    />
                  </div>
                </div>

                {status === "error" && (
                  <p className="mt-4 text-sm text-red-400">{error}</p>
                )}

                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="mt-6 w-full inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 text-white font-semibold shadow-lg hover:brightness-110 disabled:opacity-60 disabled:cursor-not-allowed transition-all"
                >
                  {status === "sending" ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Sending…
                    </>
                  ) : (
                    <>
                      Send enquiry
                      <Send className="w-4 h-4" />
                    </>
                  )}
                </button>

                <p className="mt-4 text-center text-xs text-gray-500">
                  Prefer to talk?{" "}
                  <a
                    href={`https://wa.me/${WHATSAPP_NUMBER}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-400 hover:underline"
                  >
                    Message me on WhatsApp
                  </a>
                </p>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
