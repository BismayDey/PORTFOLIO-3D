import { useCallback, useEffect, useRef, useState } from "react";
import { ScoreGate } from "../components/ScoreGate";
import { GameFrame } from "./GameFrame";

// Plain canvas rather than Phaser — a ~1MB engine dependency for a 30-second
// arcade loop is not a trade worth making on a portfolio.

type Faller = {
  x: number;
  y: number;
  vy: number;
  kind: "bug" | "scope" | "deadline" | "coffee" | "commit";
  rot: number;
};

const BAD = ["bug", "scope", "deadline"] as const;
const GOOD = ["coffee", "commit"] as const;

const GLYPH: Record<Faller["kind"], string> = {
  bug: "🐞",
  scope: "📋",
  deadline: "⏰",
  coffee: "☕",
  commit: "✅",
};
const LABEL: Record<Faller["kind"], string> = {
  bug: "bug",
  scope: "scope creep",
  deadline: "2am deadline",
  coffee: "coffee",
  commit: "commit",
};

export function ShipIt({ onBook }: { onBook: () => void }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const [phase, setPhase] = useState<"ready" | "playing" | "over">("ready");
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [caught, setCaught] = useState(0);

  // mutable game state kept in a ref so the loop never re-renders per frame
  const g = useRef({
    px: 0.5, // player x, 0..1
    target: 0.5,
    fallers: [] as Faller[],
    t: 0,
    spawn: 0,
    score: 0,
    lives: 3,
    caught: 0,
    running: false,
    speed: 1,
  });

  const reset = useCallback(() => {
    g.current = {
      px: 0.5,
      target: 0.5,
      fallers: [],
      t: 0,
      spawn: 0,
      score: 0,
      lives: 3,
      caught: 0,
      running: true,
      speed: 1,
    };
    setScore(0);
    setLives(3);
    setCaught(0);
    setPhase("playing");
  }, []);

  useEffect(() => {
    const el = canvas.current;
    if (!el) return;
    const ctx = el.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let last = performance.now();

    const resize = () => {
      const r = el.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      el.width = r.width * dpr;
      el.height = r.height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const move = (clientX: number) => {
      const r = el.getBoundingClientRect();
      g.current.target = Math.max(0, Math.min(1, (clientX - r.left) / r.width));
    };
    const onMouse = (e: MouseEvent) => move(e.clientX);
    const onTouch = (e: TouchEvent) => {
      if (e.touches[0]) move(e.touches[0].clientX);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") g.current.target = Math.max(0, g.current.target - 0.12);
      if (e.key === "ArrowRight") g.current.target = Math.min(1, g.current.target + 0.12);
    };
    el.addEventListener("mousemove", onMouse);
    el.addEventListener("touchmove", onTouch, { passive: true });
    window.addEventListener("keydown", onKey);

    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      const W = el.clientWidth;
      const H = el.clientHeight;
      const s = g.current;

      ctx.clearRect(0, 0, W, H);
      // backdrop
      const grad = ctx.createLinearGradient(0, 0, 0, H);
      grad.addColorStop(0, "#0d0b16");
      grad.addColorStop(1, "#07070b");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, W, H);

      if (s.running) {
        s.t += dt;
        s.speed = 1 + s.t / 22;
        s.px += (s.target - s.px) * Math.min(1, dt * 12);

        // spawn
        s.spawn -= dt;
        if (s.spawn <= 0) {
          s.spawn = Math.max(0.22, 0.72 - s.t * 0.012);
          const good = Math.random() < 0.3;
          const kind = good
            ? GOOD[(Math.random() * GOOD.length) | 0]
            : BAD[(Math.random() * BAD.length) | 0];
          s.fallers.push({
            x: 0.06 + Math.random() * 0.88,
            y: -0.06,
            vy: (0.28 + Math.random() * 0.16) * s.speed,
            kind,
            rot: (Math.random() - 0.5) * 0.6,
          });
        }

        const playerY = H - 54;
        for (const f of s.fallers) {
          f.y += f.vy * dt;
          const fx = f.x * W;
          const fy = f.y * H;
          const hit =
            Math.abs(fx - s.px * W) < 42 && Math.abs(fy - playerY) < 34;
          if (hit && !(f as Faller & { done?: boolean }).done) {
            (f as Faller & { done?: boolean }).done = true;
            if ((GOOD as readonly string[]).includes(f.kind)) {
              s.score += f.kind === "coffee" ? 15 : 10;
              s.caught += 1;
            } else {
              s.lives -= 1;
              s.score = Math.max(0, s.score - 5);
            }
            setScore(s.score);
            setLives(s.lives);
            setCaught(s.caught);
            if (s.lives <= 0) {
              s.running = false;
              setPhase("over");
            }
          }
        }
        s.fallers = s.fallers.filter(
          (f) => f.y < 1.15 && !(f as Faller & { done?: boolean }).done
        );
        // survival points
        s.score += dt * 4;
        if (Math.floor(s.score) !== score) setScore(Math.floor(s.score));
      }

      // fallers
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      for (const f of s.fallers) {
        ctx.save();
        ctx.translate(f.x * W, f.y * H);
        ctx.rotate(Math.sin(s.t * 2 + f.x * 10) * f.rot * 0.4);
        ctx.font = "28px system-ui, sans-serif";
        ctx.fillText(GLYPH[f.kind], 0, 0);
        ctx.restore();
      }

      // player pod
      const px = s.px * W;
      const py = H - 54;
      ctx.save();
      ctx.shadowColor = "rgba(168,85,247,0.8)";
      ctx.shadowBlur = 22;
      ctx.fillStyle = "#a855f7";
      ctx.beginPath();
      ctx.roundRect(px - 34, py - 15, 68, 30, 15);
      ctx.fill();
      ctx.restore();
      ctx.fillStyle = "#fff";
      ctx.font = "bold 13px system-ui, sans-serif";
      ctx.fillText("BD", px, py);

      // ground line
      ctx.strokeStyle = "rgba(255,255,255,0.09)";
      ctx.beginPath();
      ctx.moveTo(0, H - 22);
      ctx.lineTo(W, H - 22);
      ctx.stroke();
    };

    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("keydown", onKey);
      el.removeEventListener("mousemove", onMouse);
      el.removeEventListener("touchmove", onTouch);
    };
    // the loop reads everything from the ref; re-running it would reset play
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <GameFrame
      title="Ship It"
      blurb="Catch the coffee and the green ticks. Dodge bugs, scope creep and 2am deadlines. Move with your mouse, finger, or arrow keys."
      hud={
        phase === "playing"
          ? [
              { label: "Score", value: score },
              { label: "Lives", value: "❤".repeat(Math.max(0, lives)) || "—" },
              { label: "Caught", value: caught },
            ]
          : undefined
      }
      onStart={phase === "ready" ? reset : undefined}
      startLabel="Start shipping"
    >
      <canvas
        ref={canvas}
        className="w-full h-full block touch-none cursor-none"
      />
      {phase === "over" && (
        <ScoreGate
          game="ship-it"
          gameLabel="Ship It"
          score={score}
          detail={`${caught} good things caught before the deadlines got you`}
          onRestart={reset}
          onBook={onBook}
        />
      )}
    </GameFrame>
  );
}

export const SHIP_IT_LEGEND = { GLYPH, LABEL };
