import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { clientProjects } from "../data/clientProjects";
import { serviceGroups } from "../data/services";
import { experience } from "../data/experience";
import { track } from "../lib/analytics";

type Line = { kind: "in" | "out" | "err" | "sys"; text: string };

const BANNER = [
  "  ██████╗ ██████╗ ",
  "  ██╔══██╗██╔══██╗   bismay-shell v1.0",
  "  ██████╔╝██║  ██║   type `help` to begin",
  "  ██╔══██╗██║  ██║",
  "  ██████╔╝██████╔╝",
  "  ╚═════╝ ╚═════╝ ",
];

export function Terminal({ onBook }: { onBook: () => void }) {
  const navigate = useNavigate();
  const [lines, setLines] = useState<Line[]>([
    ...BANNER.map((t) => ({ kind: "sys" as const, text: t })),
    { kind: "out", text: "" },
  ]);
  const [value, setValue] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [hIdx, setHIdx] = useState(-1);
  const scroller = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLInputElement>(null);

  useEffect(() => {
    scroller.current?.scrollTo({ top: scroller.current.scrollHeight });
  }, [lines]);

  const push = (...l: Line[]) => setLines((cur) => [...cur, ...l]);
  const out = (...text: string[]) =>
    push(...text.map((t) => ({ kind: "out" as const, text: t })));

  const COMMANDS: Record<string, { help: string; run: (args: string[]) => void }> = {
    help: {
      help: "list every command",
      run: () => {
        out("Available commands:", "");
        Object.entries(COMMANDS).forEach(([name, c]) =>
          out(`  ${name.padEnd(14)} ${c.help}`)
        );
        out("", "Tip: Tab completes, ↑/↓ walks history.");
      },
    },
    whoami: {
      help: "who is Bismay",
      run: () =>
        out(
          "Bismay Dey — Full-Stack Developer, Kolkata, India",
          "Head of Development & Project Manager @ Alphonso Media",
          "19+ client platforms · 50+ projects · 12 roles · 10+ hackathons won",
          "Available for freelance and full-time work."
        ),
    },
    ls: {
      help: "ls projects | services | experience",
      run: (a) => {
        const what = a[0] ?? "projects";
        if (what.startsWith("proj")) {
          out(`${clientProjects.length} client projects:`, "");
          clientProjects.forEach((p, i) =>
            out(`  ${String(i + 1).padStart(2)}. ${p.name.padEnd(26)} ${p.sector}`)
          );
          out("", "Run `open <name>` to read a case study.");
        } else if (what.startsWith("serv")) {
          serviceGroups.forEach((g) => {
            out(`${g.label}:`);
            g.services.forEach((s) => out(`  · ${s.title.padEnd(30)} ${s.timeline}`));
            out("");
          });
        } else if (what.startsWith("exp")) {
          experience.forEach((r) =>
            out(`  ${r.period.padEnd(22)} ${r.title} — ${r.company}`)
          );
        } else {
          push({ kind: "err", text: `ls: unknown target '${what}'` });
        }
      },
    },
    open: {
      help: "open <project> — jump to a case study",
      run: (a) => {
        const q = a.join(" ").toLowerCase();
        if (!q) return push({ kind: "err", text: "open: needs a project name" });
        const hit =
          clientProjects.find((p) => p.slug === q) ??
          clientProjects.find((p) => p.name.toLowerCase().includes(q));
        if (!hit) return push({ kind: "err", text: `open: no project matching '${q}'` });
        out(`Opening ${hit.name}…`);
        track("terminal_open_project", { project: hit.slug });
        setTimeout(() => navigate(`/client/${hit.slug}`), 500);
      },
    },
    cat: {
      help: "cat about.md | stack.txt | contact",
      run: (a) => {
        const f = (a[0] ?? "").toLowerCase();
        if (f.startsWith("about"))
          out(
            "I build products end to end — web platforms, mobile apps, AI",
            "features and browser games. Architecture through deployment,",
            "then the maintenance and search visibility that keep them working."
          );
        else if (f.startsWith("stack"))
          out(
            "frontend  React · Next.js · TypeScript · Tailwind · Three.js",
            "backend   Node · Express · Python · PHP · Go",
            "data      MongoDB · Firebase · PostgreSQL · MySQL",
            "devops    Docker · K8s · AWS · Vercel · GitHub Actions",
            "platforms Shopify · WordPress · Webflow"
          );
        else if (f.startsWith("contact"))
          out(
            "email     bismaydey001@gmail.com",
            "whatsapp  +91 81003 14152",
            "github    github.com/BismayDey",
            "linkedin  linkedin.com/in/bismay-dey-634937268",
            "",
            "Run `hire --now` to book a call."
          );
        else push({ kind: "err", text: `cat: ${f || "?"}: no such file` });
      },
    },
    hire: {
      help: "hire --now — book a 30-min call",
      run: () => {
        out("Opening the booking calendar…");
        track("terminal_hire");
        setTimeout(onBook, 400);
      },
    },
    sudo: {
      help: "try it",
      run: () =>
        push({
          kind: "err",
          text: "bismay is not in the sudoers file. This incident will be reported.",
        }),
    },
    clear: {
      help: "clear the screen",
      run: () => setLines([]),
    },
    exit: {
      help: "back to the portfolio",
      run: () => {
        out("Goodbye.");
        setTimeout(() => navigate("/"), 400);
      },
    },
  };

  const run = (raw: string) => {
    const cmd = raw.trim();
    push({ kind: "in", text: cmd });
    if (!cmd) return;
    setHistory((h) => [cmd, ...h]);
    setHIdx(-1);
    const [name, ...args] = cmd.split(/\s+/);
    const entry = COMMANDS[name.toLowerCase()];
    if (!entry) {
      push({
        kind: "err",
        text: `command not found: ${name} — try \`help\``,
      });
      return;
    }
    track("terminal_command", { cmd: name.toLowerCase() });
    entry.run(args);
  };

  const onKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      run(value);
      setValue("");
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const i = Math.min(hIdx + 1, history.length - 1);
      if (history[i]) {
        setHIdx(i);
        setValue(history[i]);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      const i = hIdx - 1;
      setHIdx(i);
      setValue(i >= 0 ? history[i] ?? "" : "");
    } else if (e.key === "Tab") {
      e.preventDefault();
      const hit = Object.keys(COMMANDS).find((c) => c.startsWith(value.trim()));
      if (hit) setValue(hit + " ");
    }
  };

  return (
    <div className="w-full">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-1.5">
            bismay --help
          </h2>
          <p className="text-sm text-gray-400 max-w-xl leading-relaxed">
            The whole portfolio as a shell. Try <code className="text-purple-300">ls projects</code>,{" "}
            <code className="text-purple-300">cat about.md</code>, or{" "}
            <code className="text-purple-300">hire --now</code>.
          </p>
        </div>
      </div>

      <div
        onClick={() => input.current?.focus()}
        className="relative w-full aspect-[16/10] sm:aspect-[16/9] max-h-[70vh] rounded-3xl overflow-hidden border-2 border-white/[0.14] bg-[#05050a] shadow-2xl shadow-black/60 cursor-text"
      >
        <div className="flex items-center gap-2 px-4 py-2.5 bg-white/[0.05] border-b border-white/10">
          <span className="w-3 h-3 rounded-full bg-red-500/70" />
          <span className="w-3 h-3 rounded-full bg-yellow-500/70" />
          <span className="w-3 h-3 rounded-full bg-green-500/70" />
          <span className="ml-2 text-[11px] text-gray-500 font-mono">
            bismay@portfolio ~ %
          </span>
        </div>

        <div
          ref={scroller}
          className="h-[calc(100%-42px)] overflow-y-auto p-4 font-mono text-[12px] sm:text-[13px] leading-relaxed"
        >
          {lines.map((l, i) => (
            <div
              key={i}
              className={
                l.kind === "in"
                  ? "text-white"
                  : l.kind === "err"
                    ? "text-red-400"
                    : l.kind === "sys"
                      ? "text-purple-400"
                      : "text-gray-300"
              }
            >
              {l.kind === "in" && <span className="text-green-400 mr-1.5">❯</span>}
              <span className="whitespace-pre-wrap break-words">{l.text || " "}</span>
            </div>
          ))}

          <div className="flex items-center text-white mt-0.5">
            <span className="text-green-400 mr-1.5">❯</span>
            <input
              ref={input}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={onKey}
              autoFocus
              spellCheck={false}
              autoComplete="off"
              aria-label="Terminal input"
              className="flex-1 bg-transparent border-0 outline-none text-white font-mono caret-purple-400"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
