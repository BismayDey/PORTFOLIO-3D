import { useCallback, useEffect, useRef, useState } from "react";
import { ScoreGate } from "../components/ScoreGate";
import { GameFrame } from "./GameFrame";

// Tetris, but the pieces are the stack Bismay actually works in — so the game
// doubles as a skills display.
const TECH = [
  { name: "React", color: "#61dafb" },
  { name: "Next", color: "#ffffff" },
  { name: "TS", color: "#3178c6" },
  { name: "Node", color: "#5fa04e" },
  { name: "Mongo", color: "#47a248" },
  { name: "Three", color: "#c084fc" },
  { name: "Shopify", color: "#95bf47" },
];

const SHAPES = [
  [[1, 1, 1, 1]],
  [
    [1, 1],
    [1, 1],
  ],
  [
    [0, 1, 0],
    [1, 1, 1],
  ],
  [
    [1, 0, 0],
    [1, 1, 1],
  ],
  [
    [0, 0, 1],
    [1, 1, 1],
  ],
  [
    [0, 1, 1],
    [1, 1, 0],
  ],
  [
    [1, 1, 0],
    [0, 1, 1],
  ],
];

const COLS = 10;
const ROWS = 18;

type Cell = { on: boolean; tech: number };
type Piece = { shape: number[][]; x: number; y: number; tech: number };

const emptyGrid = (): Cell[][] =>
  Array.from({ length: ROWS }, () =>
    Array.from({ length: COLS }, () => ({ on: false, tech: 0 }))
  );

export function BuildTheStack({ onBook }: { onBook: () => void }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const [phase, setPhase] = useState<"ready" | "playing" | "over">("ready");
  const [score, setScore] = useState(0);
  const [lines, setLines] = useState(0);
  const [level, setLevel] = useState(1);

  const st = useRef({
    grid: emptyGrid(),
    piece: null as Piece | null,
    nextShape: null as { shape: number[][]; tech: number } | null,
    flash: 0,
    drop: 0,
    interval: 0.7,
    score: 0,
    lines: 0,
    running: false,
  });

  const roll = () => ({
    shape: SHAPES[(Math.random() * SHAPES.length) | 0],
    tech: (Math.random() * TECH.length) | 0,
  });

  const spawn = useCallback(() => {
    const cur = st.current.nextShape ?? roll();
    st.current.nextShape = roll();
    const { shape, tech } = cur;
    const p: Piece = {
      shape,
      tech,
      x: ((COLS - shape[0].length) / 2) | 0,
      y: 0,
    };
    if (collides(st.current.grid, p, 0, 0)) {
      st.current.running = false;
      setPhase("over");
      return;
    }
    st.current.piece = p;
  }, []);

  const start = useCallback(() => {
    st.current = {
      grid: emptyGrid(),
      piece: null,
      nextShape: roll(),
      flash: 0,
      drop: 0,
      interval: 0.7,
      score: 0,
      lines: 0,
      running: true,
    };
    setScore(0);
    setLines(0);
    setLevel(1);
    setPhase("playing");
    spawn();
  }, [spawn]);

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

    const onKey = (e: KeyboardEvent) => {
      const s = st.current;
      if (!s.running || !s.piece) return;
      if (["ArrowLeft", "ArrowRight", "ArrowDown", "ArrowUp", " "].includes(e.key))
        e.preventDefault();
      if (e.key === "ArrowLeft" && !collides(s.grid, s.piece, -1, 0)) s.piece.x -= 1;
      if (e.key === "ArrowRight" && !collides(s.grid, s.piece, 1, 0)) s.piece.x += 1;
      if (e.key === "ArrowDown" && !collides(s.grid, s.piece, 0, 1)) s.piece.y += 1;
      if (e.key === "ArrowUp") {
        const rot = rotate(s.piece.shape);
        const test = { ...s.piece, shape: rot };
        if (!collides(s.grid, test, 0, 0)) s.piece.shape = rot;
      }
      if (e.key === " ") {
        let d = 0;
        while (!collides(s.grid, s.piece, 0, 1)) {
          s.piece.y += 1;
          d += 1;
        }
        s.score += d * 2; // reward committing to a drop
        s.drop = s.interval;
      }
    };
    window.addEventListener("keydown", onKey);

    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      const s = st.current;
      const W = el.clientWidth;
      const H = el.clientHeight;
      const cell = Math.min(W / COLS, H / ROWS);
      const ox = (W - cell * COLS) / 2;
      const oy = (H - cell * ROWS) / 2;

      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = "#07070b";
      ctx.fillRect(0, 0, W, H);

      // well
      ctx.strokeStyle = "rgba(255,255,255,0.07)";
      ctx.strokeRect(ox, oy, cell * COLS, cell * ROWS);

      if (s.flash > 0) {
        s.flash -= dt;
        ctx.fillStyle = `rgba(255,255,255,${Math.max(0, s.flash) * 0.7})`;
        ctx.fillRect(ox, oy, cell * COLS, cell * ROWS);
      }

      if (s.running && s.piece) {
        s.drop += dt;
        if (s.drop >= s.interval) {
          s.drop = 0;
          if (!collides(s.grid, s.piece, 0, 1)) {
            s.piece.y += 1;
          } else {
            merge(s.grid, s.piece);
            const cleared = clearLines(s.grid);
            if (cleared) {
              s.lines += cleared;
              const lvl = 1 + Math.floor(s.lines / 8);
              s.score += ([0, 100, 300, 500, 800][cleared] ?? 800) * lvl;
              s.interval = Math.max(0.12, 0.7 - (lvl - 1) * 0.06);
              s.flash = 0.25;
              setLines(s.lines);
              setScore(s.score);
              setLevel(lvl);
            }
            spawn();
          }
        }
      }

      const draw = (cx: number, cy: number, tech: number, ghost = false) => {
        const t = TECH[tech];
        ctx.globalAlpha = ghost ? 0.18 : 1;
        ctx.fillStyle = t.color;
        ctx.beginPath();
        ctx.roundRect(ox + cx * cell + 1, oy + cy * cell + 1, cell - 2, cell - 2, 4);
        ctx.fill();
        if (!ghost && cell > 22) {
          ctx.globalAlpha = 1;
          ctx.fillStyle = "rgba(0,0,0,0.72)";
          ctx.font = `bold ${Math.max(8, cell * 0.3)}px system-ui, sans-serif`;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(t.name, ox + cx * cell + cell / 2, oy + cy * cell + cell / 2);
        }
        ctx.globalAlpha = 1;
      };

      for (let y = 0; y < ROWS; y++)
        for (let x = 0; x < COLS; x++)
          if (s.grid[y][x].on) draw(x, y, s.grid[y][x].tech);

      // next-piece preview to the right of the well
      if (s.nextShape && ox > cell * 3.2) {
        const n = s.nextShape;
        const bx = ox + cell * COLS + cell * 0.6;
        ctx.fillStyle = "rgba(255,255,255,0.35)";
        ctx.font = "bold 10px system-ui, sans-serif";
        ctx.textAlign = "left";
        ctx.fillText("NEXT", bx, oy + 12);
        n.shape.forEach((row, ry) =>
          row.forEach((v, rx) => {
            if (!v) return;
            ctx.fillStyle = TECH[n.tech].color;
            ctx.beginPath();
            ctx.roundRect(
              bx + rx * cell * 0.6 + 1,
              oy + 22 + ry * cell * 0.6 + 1,
              cell * 0.6 - 2,
              cell * 0.6 - 2,
              3
            );
            ctx.fill();
          })
        );
        ctx.textAlign = "center";
      }

      if (s.piece) {
        // ghost landing position
        const ghost = { ...s.piece, shape: s.piece.shape };
        let gy = ghost.y;
        while (!collides(s.grid, { ...ghost, y: gy }, 0, 1)) gy += 1;
        s.piece.shape.forEach((row, ry) =>
          row.forEach((v, rx) => {
            if (v) draw(s.piece!.x + rx, gy + ry, s.piece!.tech, true);
          })
        );
        s.piece.shape.forEach((row, ry) =>
          row.forEach((v, rx) => {
            if (v) draw(s.piece!.x + rx, s.piece!.y + ry, s.piece!.tech);
          })
        );
      }
    };

    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("keydown", onKey);
    };
  }, [spawn]);

  const nudge = (dx: number, dy: number, rot = false) => {
    const s = st.current;
    if (!s.running || !s.piece) return;
    if (rot) {
      const r = rotate(s.piece.shape);
      if (!collides(s.grid, { ...s.piece, shape: r }, 0, 0)) s.piece.shape = r;
      return;
    }
    if (!collides(s.grid, s.piece, dx, dy)) {
      s.piece.x += dx;
      s.piece.y += dy;
    }
  };

  return (
    <GameFrame
      title="Build the Stack"
      blurb="Tetris with the tech Bismay actually ships in. Arrows move and rotate, space hard-drops for bonus points. Every 8 lines raises the level and the speed."
      hud={
        phase === "playing"
          ? [
              { label: "Score", value: score },
              { label: "Lines", value: lines },
              { label: "Level", value: level },
            ]
          : undefined
      }
      onStart={phase === "ready" ? start : undefined}
      startLabel="Start stacking"
    >
      <canvas ref={canvas} className="w-full h-full block" />

      {/* touch controls */}
      {phase === "playing" && (
        <div className="sm:hidden absolute bottom-3 left-0 right-0 flex justify-center gap-2 px-3">
          {[
            { l: "◀", a: () => nudge(-1, 0) },
            { l: "⟳", a: () => nudge(0, 0, true) },
            { l: "▼", a: () => nudge(0, 1) },
            { l: "▶", a: () => nudge(1, 0) },
          ].map((b) => (
            <button
              key={b.l}
              onClick={b.a}
              className="w-14 h-12 rounded-xl bg-white/10 border border-white/20 text-white text-lg active:bg-white/25"
            >
              {b.l}
            </button>
          ))}
        </div>
      )}

      {phase === "over" && (
        <ScoreGate
          game="build-the-stack"
          gameLabel="Build the Stack"
          score={score}
          detail={`${lines} lines cleared · reached level ${level}`}
          onRestart={start}
          onBook={onBook}
        />
      )}
    </GameFrame>
  );
}

// ---- helpers ----
function collides(grid: Cell[][], p: Piece, dx: number, dy: number) {
  for (let y = 0; y < p.shape.length; y++) {
    for (let x = 0; x < p.shape[y].length; x++) {
      if (!p.shape[y][x]) continue;
      const nx = p.x + x + dx;
      const ny = p.y + y + dy;
      if (nx < 0 || nx >= COLS || ny >= ROWS) return true;
      if (ny >= 0 && grid[ny][nx].on) return true;
    }
  }
  return false;
}

function merge(grid: Cell[][], p: Piece) {
  p.shape.forEach((row, y) =>
    row.forEach((v, x) => {
      if (v && p.y + y >= 0) grid[p.y + y][p.x + x] = { on: true, tech: p.tech };
    })
  );
}

function clearLines(grid: Cell[][]) {
  let cleared = 0;
  for (let y = ROWS - 1; y >= 0; y--) {
    if (grid[y].every((c) => c.on)) {
      grid.splice(y, 1);
      grid.unshift(Array.from({ length: COLS }, () => ({ on: false, tech: 0 })));
      cleared += 1;
      y += 1;
    }
  }
  return cleared;
}

function rotate(shape: number[][]) {
  return shape[0].map((_, i) => shape.map((r) => r[i]).reverse());
}
