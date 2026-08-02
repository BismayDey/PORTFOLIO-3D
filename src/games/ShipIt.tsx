import { useCallback, useEffect, useRef, useState } from "react";
import { ScoreGate } from "../components/ScoreGate";
import { GameFrame } from "./GameFrame";

// Plain canvas rather than Phaser — a ~1MB engine for a 60-second arcade loop
// is not a trade worth making on a portfolio.

type Kind = "bug" | "scope" | "deadline" | "coffee" | "commit" | "shield" | "deploy";

type Faller = {
  x: number;
  y: number;
  vy: number;
  vx: number;
  kind: Kind;
  spin: number;
  dead?: boolean;
};

type Particle = { x: number; y: number; vx: number; vy: number; life: number; c: string };
type Float = { x: number; y: number; life: number; text: string; c: string };

const BAD: Kind[] = ["bug", "scope", "deadline"];
const GOOD: Kind[] = ["coffee", "commit"];

const GLYPH: Record<Kind, string> = {
  bug: "🐞",
  scope: "📋",
  deadline: "⏰",
  coffee: "☕",
  commit: "✅",
  shield: "🛡️",
  deploy: "🚀",
};
const VALUE: Partial<Record<Kind, number>> = { coffee: 15, commit: 10, deploy: 40 };
const COLOR: Record<Kind, string> = {
  bug: "#ef4444",
  scope: "#f59e0b",
  deadline: "#f43f5e",
  coffee: "#a3e635",
  commit: "#34d399",
  shield: "#38bdf8",
  deploy: "#c084fc",
};

export function ShipIt({ onBook }: { onBook: () => void }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const [phase, setPhase] = useState<"ready" | "playing" | "over">("ready");
  const [ui, setUi] = useState({ score: 0, lives: 3, combo: 0, best: 0, wave: 1 });

  const g = useRef({
    px: 0.5,
    target: 0.5,
    fallers: [] as Faller[],
    parts: [] as Particle[],
    floats: [] as Float[],
    t: 0,
    spawn: 0,
    score: 0,
    lives: 3,
    combo: 0,
    bestCombo: 0,
    wave: 1,
    shield: 0,
    shake: 0,
    running: false,
    magnet: 0,
  });

  const reset = useCallback(() => {
    g.current = {
      px: 0.5,
      target: 0.5,
      fallers: [],
      parts: [],
      floats: [],
      t: 0,
      spawn: 0,
      score: 0,
      lives: 3,
      combo: 0,
      bestCombo: 0,
      wave: 1,
      shield: 0,
      shake: 0,
      running: true,
      magnet: 0,
    };
    setUi({ score: 0, lives: 3, combo: 0, best: 0, wave: 1 });
    setPhase("playing");
  }, []);

  useEffect(() => {
    const el = canvas.current;
    if (!el) return;
    const ctx = el.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let last = performance.now();
    let uiTick = 0;

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
    const onTouch = (e: TouchEvent) => e.touches[0] && move(e.touches[0].clientX);
    const onKey = (e: KeyboardEvent) => {
      if (!g.current.running) return;
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        g.current.target = Math.max(0, g.current.target - 0.14);
      }
      if (e.key === "ArrowRight") {
        e.preventDefault();
        g.current.target = Math.min(1, g.current.target + 0.14);
      }
    };
    el.addEventListener("mousemove", onMouse);
    el.addEventListener("touchmove", onTouch, { passive: true });
    window.addEventListener("keydown", onKey);

    const burst = (x: number, y: number, c: string, n = 12) => {
      for (let i = 0; i < n; i++) {
        const a = Math.random() * Math.PI * 2;
        const sp = 60 + Math.random() * 180;
        g.current.parts.push({
          x,
          y,
          vx: Math.cos(a) * sp,
          vy: Math.sin(a) * sp - 40,
          life: 0.5 + Math.random() * 0.4,
          c,
        });
      }
    };

    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      const W = el.clientWidth;
      const H = el.clientHeight;
      const s = g.current;

      ctx.save();
      if (s.shake > 0) {
        ctx.translate((Math.random() - 0.5) * s.shake, (Math.random() - 0.5) * s.shake);
        s.shake = Math.max(0, s.shake - dt * 40);
      }

      const grad = ctx.createLinearGradient(0, 0, 0, H);
      grad.addColorStop(0, "#0e0b1a");
      grad.addColorStop(1, "#06060a");
      ctx.fillStyle = grad;
      ctx.fillRect(-20, -20, W + 40, H + 40);

      const laneY = H - 56;

      if (s.running) {
        s.t += dt;
        s.wave = 1 + Math.floor(s.t / 20);
        s.px += (s.target - s.px) * Math.min(1, dt * 14);
        if (s.shield > 0) s.shield -= dt;
        if (s.magnet > 0) s.magnet -= dt;

        // spawn — rate and speed climb per wave, power-ups are rare
        s.spawn -= dt;
        if (s.spawn <= 0) {
          s.spawn = Math.max(0.2, 0.7 - s.t * 0.014);
          const roll = Math.random();
          let kind: Kind;
          if (roll < 0.04) kind = "shield";
          else if (roll < 0.08) kind = "deploy";
          else if (roll < 0.42) kind = GOOD[(Math.random() * GOOD.length) | 0];
          else kind = BAD[(Math.random() * BAD.length) | 0];
          s.fallers.push({
            x: 0.07 + Math.random() * 0.86,
            y: -0.08,
            vy: (0.26 + Math.random() * 0.14) * (1 + s.t / 30),
            vx: (Math.random() - 0.5) * 0.06,
            kind,
            spin: (Math.random() - 0.5) * 3,
          });
        }

        for (const f of s.fallers) {
          f.y += f.vy * dt;
          f.x += f.vx * dt;
          if (f.x < 0.04 || f.x > 0.96) f.vx *= -1;

          // magnet pulls collectibles toward the pod
          const collectible = f.kind !== "bug" && f.kind !== "scope" && f.kind !== "deadline";
          if (s.magnet > 0 && collectible && f.y > 0.45) {
            f.x += (s.px - f.x) * dt * 2.4;
          }

          const fx = f.x * W;
          const fy = f.y * H;
          if (!f.dead && Math.abs(fx - s.px * W) < 44 && Math.abs(fy - laneY) < 32) {
            f.dead = true;
            if (collectible) {
              s.combo += 1;
              s.bestCombo = Math.max(s.bestCombo, s.combo);
              const mult = 1 + Math.floor(s.combo / 5) * 0.5;
              const gain = Math.round((VALUE[f.kind] ?? 10) * mult);
              s.score += gain;
              s.floats.push({
                x: fx,
                y: fy,
                life: 0.9,
                text: `+${gain}${mult > 1 ? ` x${mult}` : ""}`,
                c: COLOR[f.kind],
              });
              burst(fx, fy, COLOR[f.kind], 14);
              if (f.kind === "shield") s.shield = 6;
              if (f.kind === "deploy") s.magnet = 5;
            } else if (s.shield > 0) {
              s.floats.push({ x: fx, y: fy, life: 0.9, text: "BLOCKED", c: "#38bdf8" });
              burst(fx, fy, "#38bdf8", 16);
            } else {
              s.lives -= 1;
              s.combo = 0;
              s.score = Math.max(0, s.score - 8);
              s.shake = 14;
              s.floats.push({ x: fx, y: fy, life: 0.9, text: "-8", c: "#ef4444" });
              burst(fx, fy, COLOR[f.kind], 18);
              if (s.lives <= 0) {
                s.running = false;
                setPhase("over");
              }
            }
          }
          // missing a collectible breaks the combo
          if (!f.dead && f.y > 1.1 && collectible) s.combo = 0;
        }
        s.fallers = s.fallers.filter((f) => !f.dead && f.y < 1.15);
        s.score += dt * (4 + s.wave);
      }

      // particles
      for (const p of s.parts) {
        p.life -= dt;
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.vy += 520 * dt;
      }
      s.parts = s.parts.filter((p) => p.life > 0);
      for (const p of s.parts) {
        ctx.globalAlpha = Math.max(0, p.life * 1.6);
        ctx.fillStyle = p.c;
        ctx.fillRect(p.x - 2, p.y - 2, 4, 4);
      }
      ctx.globalAlpha = 1;

      // fallers
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      for (const f of s.fallers) {
        ctx.save();
        ctx.translate(f.x * W, f.y * H);
        ctx.rotate(Math.sin(s.t * 2 + f.x * 8) * f.spin * 0.12);
        ctx.font = "30px system-ui, sans-serif";
        ctx.fillText(GLYPH[f.kind], 0, 0);
        ctx.restore();
      }

      // score pop-ups
      for (const fl of s.floats) {
        fl.life -= dt;
        fl.y -= dt * 42;
      }
      s.floats = s.floats.filter((f) => f.life > 0);
      ctx.font = "bold 15px system-ui, sans-serif";
      for (const fl of s.floats) {
        ctx.globalAlpha = Math.max(0, fl.life);
        ctx.fillStyle = fl.c;
        ctx.fillText(fl.text, fl.x, fl.y);
      }
      ctx.globalAlpha = 1;

      // pod
      const px = s.px * W;
      ctx.save();
      ctx.shadowColor = s.shield > 0 ? "rgba(56,189,248,0.9)" : "rgba(168,85,247,0.85)";
      ctx.shadowBlur = 24;
      ctx.fillStyle = s.shield > 0 ? "#38bdf8" : "#a855f7";
      ctx.beginPath();
      ctx.roundRect(px - 36, laneY - 16, 72, 32, 16);
      ctx.fill();
      ctx.restore();
      ctx.fillStyle = "#fff";
      ctx.font = "bold 13px system-ui, sans-serif";
      ctx.fillText("BD", px, laneY);

      if (s.shield > 0) {
        ctx.strokeStyle = `rgba(56,189,248,${0.35 + Math.sin(s.t * 8) * 0.2})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(px, laneY, 46, 0, Math.PI * 2);
        ctx.stroke();
      }
      if (s.magnet > 0) {
        ctx.strokeStyle = `rgba(192,132,252,${0.3 + Math.sin(s.t * 10) * 0.2})`;
        ctx.setLineDash([4, 6]);
        ctx.beginPath();
        ctx.arc(px, laneY, 62, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // combo meter
      if (s.combo > 1) {
        ctx.fillStyle = "rgba(255,255,255,0.9)";
        ctx.font = "bold 12px system-ui, sans-serif";
        ctx.fillText(`${s.combo}x combo`, px, laneY - 34);
      }

      ctx.strokeStyle = "rgba(255,255,255,0.08)";
      ctx.beginPath();
      ctx.moveTo(0, H - 22);
      ctx.lineTo(W, H - 22);
      ctx.stroke();
      ctx.restore();

      // throttle React updates to ~10/s
      uiTick += dt;
      if (uiTick > 0.1) {
        uiTick = 0;
        setUi({
          score: Math.floor(s.score),
          lives: s.lives,
          combo: s.combo,
          best: s.bestCombo,
          wave: s.wave,
        });
      }
    };

    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("keydown", onKey);
      el.removeEventListener("mousemove", onMouse);
      el.removeEventListener("touchmove", onTouch);
    };
  }, []);

  return (
    <GameFrame
      title="Ship It"
      blurb="Catch coffee and commits, dodge bugs, scope creep and deadlines. Chain catches for a combo multiplier. 🛡️ blocks one hit, 🚀 magnets everything toward you."
      hud={
        phase === "playing"
          ? [
              { label: "Score", value: ui.score },
              { label: "Wave", value: ui.wave },
              { label: "Combo", value: ui.combo > 1 ? `${ui.combo}x` : "—" },
              { label: "Lives", value: "❤".repeat(Math.max(0, ui.lives)) || "—" },
            ]
          : undefined
      }
      onStart={phase === "ready" ? reset : undefined}
      startLabel="Start shipping"
    >
      <canvas ref={canvas} className="w-full h-full block touch-none cursor-none" />
      {phase === "over" && (
        <ScoreGate
          game="ship-it"
          gameLabel="Ship It"
          score={ui.score}
          detail={`Wave ${ui.wave} · best combo ${ui.best}x`}
          onRestart={reset}
          onBook={onBook}
        />
      )}
    </GameFrame>
  );
}
