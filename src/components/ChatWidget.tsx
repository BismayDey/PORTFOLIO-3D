import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Check,
  Copy,
  Maximize2,
  MessageCircle,
  Minimize2,
  RotateCcw,
  Send,
  Sparkles,
  X,
} from "lucide-react";

type Msg = { role: "user" | "assistant"; content: string; id: number };

const STORE = "bd-helper-thread";

const WELCOME = `Hi — I'm **BD's Helper**, Bismay's assistant.

I know his 19 client projects, 15 services, 12 roles and everything else on this site. Ask me what he's built, what he can build for you, or how to get started.`;

const SUGGESTIONS = [
  "What can Bismay build for me?",
  "Show me his best client work",
  "Does he do Shopify or WordPress?",
  "What's his experience with AI?",
  "How do I hire him?",
  "How fast can he deliver?",
];

/** Minimal markdown: **bold**, `code`, bullet lines, bare URLs. */
function render(text: string) {
  return text.split("\n").map((line, i) => {
    const bullet = /^\s*[-*]\s+/.test(line);
    const body = bullet ? line.replace(/^\s*[-*]\s+/, "") : line;
    const parts: React.ReactNode[] = [];
    const re = /(\*\*[^*]+\*\*|`[^`]+`|https?:\/\/[^\s)]+)/g;
    let last = 0;
    let m: RegExpExecArray | null;
    while ((m = re.exec(body))) {
      if (m.index > last) parts.push(body.slice(last, m.index));
      const t = m[0];
      if (t.startsWith("**"))
        parts.push(
          <strong key={m.index} className="font-semibold text-white">
            {t.slice(2, -2)}
          </strong>
        );
      else if (t.startsWith("`"))
        parts.push(
          <code
            key={m.index}
            className="px-1.5 py-0.5 rounded bg-white/10 text-purple-200 text-[0.9em]"
          >
            {t.slice(1, -1)}
          </code>
        );
      else
        parts.push(
          <a
            key={m.index}
            href={t}
            target="_blank"
            rel="noopener noreferrer"
            className="text-purple-300 underline underline-offset-2 hover:text-purple-200 break-all"
          >
            {t.replace(/^https?:\/\//, "")}
          </a>
        );
      last = m.index + t.length;
    }
    if (last < body.length) parts.push(body.slice(last));

    if (!body.trim()) return <div key={i} className="h-2" />;
    return bullet ? (
      <div key={i} className="flex gap-2 my-0.5">
        <span className="text-purple-400 mt-[2px]">•</span>
        <span>{parts}</span>
      </div>
    ) : (
      <p key={i} className="my-1 first:mt-0 last:mb-0">
        {parts}
      </p>
    );
  });
}

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [full, setFull] = useState(false);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState<number | null>(null);
  const [nudge, setNudge] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const saved = sessionStorage.getItem(STORE);
      if (saved) return JSON.parse(saved);
    } catch {
      /* fall through to the welcome message */
    }
    return [{ role: "assistant", content: WELCOME, id: 0 }];
  });

  const scroller = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    try {
      sessionStorage.setItem(STORE, JSON.stringify(msgs.slice(-40)));
    } catch {
      /* storage full or blocked — the thread just won't persist */
    }
  }, [msgs]);

  useEffect(() => {
    scroller.current?.scrollTo({
      top: scroller.current.scrollHeight,
      behavior: "smooth",
    });
  }, [msgs, busy, open, full]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 320);
  }, [open, full]);

  // one gentle nudge so the widget gets noticed
  useEffect(() => {
    if (sessionStorage.getItem("bd-helper-nudged")) return;
    const t = setTimeout(() => {
      setNudge(true);
      sessionStorage.setItem("bd-helper-nudged", "1");
      setTimeout(() => setNudge(false), 7000);
    }, 6000);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) {
        if (full) setFull(false);
        else setOpen(false);
      }
      if (e.key === "/" && !open && e.target === document.body) {
        e.preventDefault();
        setOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, full]);

  useEffect(() => {
    document.body.style.overflow = open && full ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open, full]);

  const send = useCallback(
    async (text: string) => {
      const q = text.trim();
      if (!q || busy) return;
      setInput("");
      setNudge(false);
      const next: Msg[] = [
        ...msgs,
        { role: "user", content: q, id: Date.now() },
      ];
      setMsgs(next);
      setBusy(true);
      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: next
              .filter((m) => m.id !== 0)
              .map(({ role, content }) => ({ role, content })),
          }),
        });
        const data = await res.json().catch(() => ({}));
        setMsgs((m) => [
          ...m,
          {
            role: "assistant",
            content:
              data.reply ||
              data.error ||
              "Something went wrong. Please use the contact form and Bismay will reply personally.",
            id: Date.now() + 1,
          },
        ]);
      } catch {
        setMsgs((m) => [
          ...m,
          {
            role: "assistant",
            content:
              "I couldn't connect just now. Please use the **Let's Talk** form — Bismay replies personally, usually within a day.",
            id: Date.now() + 1,
          },
        ]);
      } finally {
        setBusy(false);
      }
    },
    [msgs, busy]
  );

  const reset = () => {
    const fresh: Msg[] = [{ role: "assistant", content: WELCOME, id: 0 }];
    setMsgs(fresh);
    sessionStorage.setItem(STORE, JSON.stringify(fresh));
  };

  const copy = (m: Msg) => {
    navigator.clipboard?.writeText(m.content.replace(/\*\*/g, ""));
    setCopied(m.id);
    setTimeout(() => setCopied(null), 1500);
  };

  const showSuggestions = msgs.filter((m) => m.role === "user").length === 0;

  return (
    <>
      {/* launcher — left side, clear of the WhatsApp float on the right */}
      <div className="fixed bottom-10 left-6 z-50 flex items-end gap-3">
        <motion.button
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 1.2, type: "spring", stiffness: 260, damping: 18 }}
          whileHover={{ scale: 1.07 }}
          whileTap={{ scale: 0.94 }}
          onClick={() => setOpen((o) => !o)}
          aria-label={open ? "Close BD's Helper" : "Open BD's Helper"}
          style={{ width: "60px", height: "60px" }}
          className="relative rounded-full bg-gradient-to-br from-purple-600 to-fuchsia-600 shadow-2xl hover:shadow-[0_8px_30px_rgba(168,85,247,0.45)] transition-all duration-300 flex items-center justify-center text-white overflow-hidden"
        >
          {/* ping ring, same cadence as the WhatsApp float */}
          <motion.span
            className="absolute inset-0 rounded-full bg-purple-500"
            animate={{ scale: [1, 1.3, 1.3], opacity: [0.5, 0, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
          />
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            animate={{ rotate: open ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            {open ? (
              <X className="w-7 h-7" />
            ) : (
              <img
                src="/chatbot.png"
                alt=""
                aria-hidden="true"
                width={60}
                height={60}
                className="w-full h-full object-cover rounded-full"
              />
            )}
          </motion.div>
        </motion.button>

        <AnimatePresence>
          {nudge && !open && (
            <motion.button
              initial={{ opacity: 0, x: -8, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -8, scale: 0.9 }}
              onClick={() => setOpen(true)}
              className="mb-2 max-w-[210px] text-left px-3.5 py-2.5 rounded-2xl rounded-bl-sm bg-[#15151b] border border-white/15 shadow-xl text-xs text-gray-200"
            >
              Questions about Bismay's work? Ask me anything.
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {open && full && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setFull(false)}
            className="fixed inset-0 z-[75] bg-black/80 backdrop-blur-sm"
          />
        )}

        {open && (
          <motion.div
            key={full ? "full" : "dock"}
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 280, damping: 26 }}
            role="dialog"
            aria-label="BD's Helper chat"
            className={
              full
                ? "fixed z-[80] inset-[5%] w-[90%] h-[90%] flex flex-col rounded-3xl border border-purple-500/30 bg-[#0b0b10] shadow-2xl shadow-purple-900/40 overflow-hidden"
                : "fixed z-[80] bottom-28 left-4 right-4 sm:right-auto sm:left-6 sm:w-96 h-[min(560px,70vh)] flex flex-col rounded-3xl border border-purple-500/30 bg-[#0b0b10] shadow-2xl shadow-purple-900/40 overflow-hidden"
            }
          >
            {/* header */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-white/10 bg-gradient-to-r from-purple-600/20 to-fuchsia-600/10 flex-shrink-0">
              <span className="relative w-9 h-9 rounded-xl overflow-hidden flex-shrink-0 ring-1 ring-white/20">
                <img
                  src="/chatbot.png"
                  alt=""
                  aria-hidden="true"
                  className="w-full h-full object-cover"
                />
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-bold text-white text-sm leading-tight">
                  BD's Helper
                </p>
                <p className="text-[11px] text-green-400 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                  Online · knows this whole site
                </p>
              </div>
              <button
                onClick={reset}
                aria-label="Start a new chat"
                title="New chat"
                className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                onClick={() => setFull((f) => !f)}
                aria-label={full ? "Exit full screen" : "Expand to full screen"}
                title={full ? "Exit full screen" : "Full screen"}
                className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                {full ? (
                  <Minimize2 className="w-4 h-4" />
                ) : (
                  <Maximize2 className="w-4 h-4" />
                )}
              </button>
              <button
                onClick={() => {
                  setOpen(false);
                  setFull(false);
                }}
                aria-label="Close chat"
                className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* thread */}
            <div
              ref={scroller}
              className="flex-1 overflow-y-auto px-4 py-4 space-y-3"
            >
              <div
                className={
                  full ? "max-w-3xl mx-auto w-full space-y-3" : "space-y-3"
                }
              >
                {msgs.map((m) => (
                  <motion.div
                    key={m.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`group flex ${
                      m.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`relative max-w-[85%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                        m.role === "user"
                          ? "bg-gradient-to-br from-purple-600 to-fuchsia-600 text-white rounded-br-sm"
                          : "bg-white/[0.06] border border-white/10 text-gray-200 rounded-bl-sm"
                      }`}
                    >
                      {render(m.content)}
                      {m.role === "assistant" && (
                        <button
                          onClick={() => copy(m)}
                          aria-label="Copy reply"
                          className="absolute -right-2 -bottom-2 p-1.5 rounded-lg bg-[#15151b] border border-white/15 text-gray-400 opacity-0 group-hover:opacity-100 hover:text-white transition-opacity"
                        >
                          {copied === m.id ? (
                            <Check className="w-3 h-3 text-green-400" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </button>
                      )}
                    </div>
                  </motion.div>
                ))}

                {busy && (
                  <div className="flex justify-start">
                    <div className="px-4 py-3 rounded-2xl rounded-bl-sm bg-white/[0.06] border border-white/10 flex gap-1.5">
                      {[0, 1, 2].map((i) => (
                        <motion.span
                          key={i}
                          animate={{ y: [0, -4, 0], opacity: [0.4, 1, 0.4] }}
                          transition={{
                            duration: 1,
                            repeat: Infinity,
                            delay: i * 0.15,
                          }}
                          className="w-1.5 h-1.5 rounded-full bg-purple-300"
                        />
                      ))}
                    </div>
                  </div>
                )}

                {showSuggestions && !busy && (
                  <div className="pt-1">
                    <p className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-gray-500 mb-2">
                      <Sparkles className="w-3 h-3" />
                      Try asking
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {SUGGESTIONS.map((s) => (
                        <button
                          key={s}
                          onClick={() => send(s)}
                          className="px-3 py-1.5 rounded-full text-xs bg-white/[0.06] border border-white/15 text-gray-300 hover:bg-purple-500/20 hover:border-purple-400/40 hover:text-white transition-colors"
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* composer */}
            <div className="p-3 border-t border-white/10 bg-black/40 flex-shrink-0">
              <div
                className={full ? "max-w-3xl mx-auto w-full" : undefined}
              >
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    send(input);
                  }}
                  className="flex items-end gap-2"
                >
                  <textarea
                    ref={inputRef}
                    rows={1}
                    value={input}
                    onChange={(e) => {
                      setInput(e.target.value);
                      e.target.style.height = "auto";
                      e.target.style.height = `${Math.min(e.target.scrollHeight, 110)}px`;
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        send(input);
                      }
                    }}
                    placeholder="Ask about Bismay's work…"
                    maxLength={500}
                    className="flex-1 resize-none px-4 py-2.5 rounded-2xl bg-white/[0.06] border border-white/15 text-white text-sm placeholder:text-gray-500 focus:outline-none focus:border-purple-400/70 focus:ring-2 focus:ring-purple-400/20 transition-colors max-h-28"
                  />
                  <button
                    type="submit"
                    disabled={!input.trim() || busy}
                    aria-label="Send message"
                    className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-fuchsia-600 text-white flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed hover:brightness-110 transition-all"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
                <p className="mt-2 text-[10px] text-gray-600 text-center">
                  Answers only about Bismay's work. For anything else, use{" "}
                  <span className="text-gray-500">Let's Talk</span>.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export { MessageCircle };
