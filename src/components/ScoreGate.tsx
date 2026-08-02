import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import confetti from "canvas-confetti";
import { ArrowRight, Loader2, RotateCcw, Trophy } from "lucide-react";
import { track } from "../lib/analytics";

export type Entry = { name: string; score: number; at: number };

const key = (game: string) => `bd-scores-${game}`;

export function readScores(game: string): Entry[] {
  try {
    const raw = localStorage.getItem(key(game));
    return raw ? (JSON.parse(raw) as Entry[]) : [];
  } catch {
    return [];
  }
}

function writeScore(game: string, entry: Entry) {
  try {
    const all = [...readScores(game), entry]
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);
    localStorage.setItem(key(game), JSON.stringify(all));
    return all;
  } catch {
    return [entry];
  }
}

/**
 * Game-over panel. Submitting a score to the board asks for an email, which is
 * the whole point — a leaderboard that captures leads beats one that doesn't.
 */
export function ScoreGate({
  game,
  gameLabel,
  score,
  detail,
  onRestart,
  onBook,
}: {
  game: string;
  gameLabel: string;
  score: number;
  detail?: string;
  onRestart: () => void;
  onBook: () => void;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [error, setError] = useState("");
  const [board, setBoard] = useState<Entry[]>([]);

  useEffect(() => {
    setBoard(readScores(game));
    track("game_over", { game, score });
  }, [game, score]);

  const best = board[0]?.score ?? 0;
  const isBest = score > best;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (state === "sending") return;
    setState("sending");
    setError("");
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source: "game",
          name,
          email,
          meta: {
            game: gameLabel,
            score: String(score),
            detail: detail ?? "",
            page: typeof window !== "undefined" ? window.location.href : "",
          },
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Could not save that score.");
      setBoard(writeScore(game, { name: name || "Anonymous", score, at: Date.now() }));
      setState("done");
      track("game_score_submitted", { game, score });
      confetti({ particleCount: 90, spread: 75, origin: { y: 0.7 }, zIndex: 200 });
    } catch (err) {
      setState("error");
      setError(err instanceof Error ? err.message : "Something went wrong.");
    }
  };

  const field =
    "w-full px-4 py-3 rounded-xl bg-white/5 border border-white/15 text-white text-sm placeholder:text-gray-500 focus:outline-none focus:border-purple-400/70 focus:ring-2 focus:ring-purple-400/20 transition-colors";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      className="absolute inset-0 z-20 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm"
    >
      <div className="w-full max-w-sm bg-[#0e0e14] border border-purple-500/30 rounded-3xl p-6 shadow-2xl shadow-purple-900/40 max-h-full overflow-y-auto">
        <div className="text-center mb-5">
          {isBest && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 mb-3 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-200 text-[11px] font-bold uppercase tracking-wider">
              <Trophy className="w-3 h-3" />
              New personal best
            </span>
          )}
          <p className="text-xs uppercase tracking-[0.2em] text-gray-500 mb-1">
            Final score
          </p>
          <p className="text-5xl font-black text-white leading-none">{score}</p>
          {detail && <p className="text-sm text-gray-400 mt-2">{detail}</p>}
        </div>

        <AnimatePresence mode="wait">
          {state === "done" ? (
            <motion.div
              key="done"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center"
            >
              <p className="text-sm text-gray-300 mb-4">
                You're on the board. Nice work.
              </p>
              <p className="text-[13px] text-gray-400 mb-5 leading-relaxed">
                Bismay builds browser games like this one for brands and
                campaigns — want one for yours?
              </p>
              <button
                onClick={() => {
                  track("game_cta_book", { game });
                  onBook();
                }}
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white font-semibold shadow-lg hover:brightness-110 transition-all mb-2"
              >
                Talk about a game build
                <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              onSubmit={submit}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-3"
            >
              <p className="text-[13px] text-gray-400 text-center mb-1">
                Add your score to the leaderboard
              </p>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                maxLength={40}
                className={field}
              />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className={field}
              />
              {state === "error" && (
                <p className="text-xs text-red-300 bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2">
                  {error}
                </p>
              )}
              <button
                type="submit"
                disabled={state === "sending"}
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white font-semibold disabled:opacity-60 hover:brightness-110 transition-all"
              >
                {state === "sending" ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Saving…
                  </>
                ) : (
                  "Submit score"
                )}
              </button>
            </motion.form>
          )}
        </AnimatePresence>

        {board.length > 0 && (
          <div className="mt-5 pt-4 border-t border-white/10">
            <p className="text-[11px] uppercase tracking-wider text-gray-500 mb-2">
              Your top scores
            </p>
            <ol className="space-y-1">
              {board.slice(0, 5).map((e, i) => (
                <li
                  key={e.at}
                  className="flex items-center justify-between text-sm text-gray-300"
                >
                  <span className="truncate">
                    <span className="text-gray-600 mr-2">{i + 1}.</span>
                    {e.name}
                  </span>
                  <span className="font-semibold text-white">{e.score}</span>
                </li>
              ))}
            </ol>
          </div>
        )}

        <button
          onClick={onRestart}
          className="mt-5 w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full border border-white/20 text-gray-300 text-sm font-medium hover:bg-white/10 hover:text-white transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          Play again
        </button>
      </div>
    </motion.div>
  );
}
