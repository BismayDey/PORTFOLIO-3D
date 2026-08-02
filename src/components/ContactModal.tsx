import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import confetti from "canvas-confetti";
import {
  ArrowRight,
  Check,
  CheckCircle2,
  ChevronDown,
  Loader2,
  MessageCircle,
  Send,
  X,
} from "lucide-react";

// FormSubmit needs no API key or account — it posts straight to this inbox.
// The FIRST submission triggers a one-time confirmation email from FormSubmit;
// click the link in it once and every later enquiry lands directly.
const CONTACT_EMAIL = "bismaydey001@gmail.com";
const FORM_ENDPOINT = `https://formsubmit.co/ajax/${CONTACT_EMAIL}`;

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


/** Red asterisk marking a mandatory field. */
function Req() {
  return (
    <span className="text-red-500 font-bold" aria-hidden="true">
      *
    </span>
  );
}

/**
 * Custom listbox — a native <select> renders OS-chrome options that ignore the
 * dark theme entirely and look broken on this panel.
 */
function ServiceSelect({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const wrap = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (!wrap.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey, true);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey, true);
    };
  }, [open]);

  return (
    <div ref={wrap} className="relative">
      {/* keeps native required-field validation on submit */}
      <input
        tabIndex={-1}
        required
        value={value}
        onChange={() => {}}
        aria-hidden="true"
        className="absolute opacity-0 w-full h-0 pointer-events-none"
      />
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-labelledby="cm-service-label"
        onClick={() => setOpen((o) => !o)}
        className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl bg-white/5 border text-left transition-colors ${
          open
            ? "border-emerald-400/70 ring-2 ring-emerald-400/20"
            : "border-white/15 hover:border-white/30"
        }`}
      >
        <span className={value ? "text-white" : "text-gray-500"}>
          {value || "Select a service"}
        </span>
        <ChevronDown
          className={`w-4 h-4 flex-shrink-0 text-gray-400 transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            role="listbox"
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="absolute z-20 bottom-full mb-2 sm:bottom-auto sm:top-full sm:mt-2 sm:mb-0 w-full max-h-52 overflow-y-auto rounded-xl border border-white/15 bg-[#0d1210] shadow-2xl shadow-black/80 p-1.5 scrollbar-thin"
          >
            {SERVICES.map((s) => {
              const on = s === value;
              return (
                <li key={s}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={on}
                    onClick={() => {
                      onChange(s);
                      setOpen(false);
                    }}
                    className={`w-full flex items-center justify-between gap-2 px-3 py-2.5 rounded-lg text-sm text-left transition-colors ${
                      on
                        ? "bg-emerald-500/20 text-emerald-200"
                        : "text-gray-300 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    <span>{s}</span>
                    {on && <Check className="w-4 h-4 flex-shrink-0" />}
                  </button>
                </li>
              );
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}

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
      const res = await fetch(FORM_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          _subject: `New project enquiry — ${form.service || "General"}`,
          _template: "table",
          _captcha: "false",
          Name: form.name,
          Email: form.email,
          Phone: form.phone,
          Service: form.service,
          Details: form.message || "—",
          Source: "bismaydey.me contact form",
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || data.success === "false")
        throw new Error(data.message || "Could not send right now.");
      setStatus("done");
      fireConfetti();
    } catch (err) {
      setStatus("error");
      setError(
        err instanceof Error
          ? err.message
          : "Could not send right now — try WhatsApp instead."
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
          className="fixed inset-0 z-[90] bg-black/80 backdrop-blur-md flex items-start md:items-center justify-center p-3 sm:p-4 overflow-y-auto"
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
            className="relative w-full max-w-2xl my-4 md:my-6 bg-gradient-to-br from-gray-900 to-black border border-emerald-500/30 rounded-3xl shadow-2xl shadow-emerald-500/10 overflow-hidden"
          >
            <button
              onClick={onClose}
              aria-label="Close contact form"
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/10 border border-white/25 text-white hover:bg-white/25 hover:border-white/50 hover:rotate-90 transition-all duration-300"
            >
              <X className="w-5 h-5" strokeWidth={2.5} />
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
              <form onSubmit={handleSubmit} className="p-5 sm:p-7 md:p-8">
                <h2
                  id="contact-modal-title"
                  className="text-2xl md:text-3xl font-bold mb-2 bg-gradient-to-r from-emerald-400 to-green-400 bg-clip-text text-transparent"
                >
                  Let's build something
                </h2>
                <p className="text-sm text-gray-400 mb-5">
                  Tell me what you need. I'll come back with scope, timeline and
                  a price.
                </p>

                <div className="space-y-3.5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
                    <div>
                      <label
                        htmlFor="cm-name"
                        className="block text-xs font-medium text-gray-400 mb-1.5"
                      >
                        Your name <Req />
                      </label>
                      <input
                        id="cm-name"
                        required
                        value={form.name}
                        onChange={(e) =>
                          setForm({ ...form, name: e.target.value })
                        }
                        placeholder="Jane Doe"
                        className={field}
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="cm-email"
                        className="block text-xs font-medium text-gray-400 mb-1.5"
                      >
                        Email <Req />
                      </label>
                      <input
                        id="cm-email"
                        type="email"
                        required
                        value={form.email}
                        onChange={(e) =>
                          setForm({ ...form, email: e.target.value })
                        }
                        placeholder="you@company.com"
                        className={field}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
                    <div>
                      <label
                        htmlFor="cm-phone"
                        className="block text-xs font-medium text-gray-400 mb-1.5"
                      >
                        Phone / WhatsApp <Req />
                      </label>
                      <input
                        id="cm-phone"
                        type="tel"
                        required
                        value={form.phone}
                        onChange={(e) =>
                          setForm({ ...form, phone: e.target.value })
                        }
                        placeholder="+91 00000 00000"
                        className={field}
                      />
                    </div>
                    <div>
                      <span
                        id="cm-service-label"
                        className="block text-xs font-medium text-gray-400 mb-1.5"
                      >
                        What do you need? <Req />
                      </span>
                      <ServiceSelect
                        value={form.service}
                        onChange={(v) => setForm({ ...form, service: v })}
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="cm-message"
                      className="block text-xs font-medium text-gray-400 mb-1.5"
                    >
                      Project details{" "}
                      <span className="text-gray-600">(optional)</span>
                    </label>
                    <textarea
                      id="cm-message"
                      rows={3}
                      value={form.message}
                      onChange={(e) =>
                        setForm({ ...form, message: e.target.value })
                      }
                      placeholder="Budget, deadline, links to what you have now"
                      className={`${field} resize-none`}
                    />
                  </div>
                </div>

                {status === "error" && (
                  <p className="mt-4 flex items-start gap-2 text-sm text-red-300 bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3">
                    <span aria-hidden="true">!</span>
                    <span>
                      {error}{" "}
                      <button
                        type="button"
                        onClick={whatsappFallback}
                        className="underline font-semibold hover:text-red-200"
                      >
                        Send it on WhatsApp instead
                      </button>
                    </span>
                  </p>
                )}

                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="mt-5 w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 text-white font-semibold shadow-lg hover:brightness-110 disabled:opacity-60 disabled:cursor-not-allowed transition-all"
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

                <p className="mt-3.5 text-center text-xs text-gray-500">
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
