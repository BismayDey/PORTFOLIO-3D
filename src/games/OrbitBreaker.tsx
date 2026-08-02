import { Suspense, lazy, useCallback, useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Icosahedron, MeshDistortMaterial, Torus } from "@react-three/drei";
import * as THREE from "three";
import { ScoreGate } from "../components/ScoreGate";
import { GameFrame } from "./GameFrame";

// three is already a dependency for the hero, so this reuses it rather than
// pulling in a second engine.
const Canvas = lazy(() =>
  import("@react-three/fiber").then((m) => ({ default: m.Canvas }))
);

type Frag = {
  id: number;
  angle: number;
  radius: number;
  speed: number;
  life: number;
  maxLife: number;
  tilt: number;
  bad: boolean;
};

function Fragment({
  frag,
  onHit,
}: {
  frag: Frag;
  onHit: (id: number, bad: boolean) => void;
}) {
  const ref = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    const a = frag.angle + t * frag.speed;
    ref.current.position.set(
      Math.cos(a) * frag.radius,
      Math.sin(a) * frag.radius * Math.cos(frag.tilt),
      Math.sin(a) * frag.radius * Math.sin(frag.tilt)
    );
    ref.current.rotation.x += 0.02;
    ref.current.rotation.y += 0.03;
    // shrink as it decays so the urgency is readable
    const k = Math.max(0.001, frag.life / frag.maxLife);
    const s = (hovered ? 0.34 : 0.28) * (0.5 + k * 0.5);
    ref.current.scale.setScalar(s);
  });

  return (
    <mesh
      ref={ref}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        setHovered(false);
        document.body.style.cursor = "";
      }}
      onPointerDown={(e) => {
        e.stopPropagation();
        onHit(frag.id, frag.bad);
      }}
    >
      <icosahedronGeometry args={[1, 0]} />
      <meshStandardMaterial
        color={frag.bad ? "#ef4444" : "#c084fc"}
        emissive={frag.bad ? "#ef4444" : "#a855f7"}
        emissiveIntensity={hovered ? 2.2 : 1.1}
        metalness={0.7}
        roughness={0.25}
      />
    </mesh>
  );
}

function Arena({
  frags,
  onHit,
  onExpire,
  running,
}: {
  frags: Frag[];
  onHit: (id: number, bad: boolean) => void;
  onExpire: (id: number) => void;
  running: boolean;
}) {
  const core = useRef<THREE.Mesh>(null);
  const ring = useRef<THREE.Mesh>(null);
  const clock = useRef(0);

  useFrame((state, dt) => {
    if (core.current) core.current.rotation.y = state.clock.elapsedTime * 0.25;
    if (ring.current) ring.current.rotation.z = state.clock.elapsedTime * 0.5;
    if (!running) return;
    clock.current += dt;
    for (const f of frags) {
      f.life -= dt;
      if (f.life <= 0) onExpire(f.id);
    }
  });

  return (
    <>
      <ambientLight intensity={0.6} />
      <pointLight position={[0, 0, 4]} intensity={4} color="#a855f7" distance={14} />
      <pointLight position={[4, 3, 2]} intensity={2} color="#f472b6" distance={14} />

      <Icosahedron ref={core} args={[1.1, 8]}>
        <MeshDistortMaterial
          color="#6d28d9"
          emissive="#7c3aed"
          emissiveIntensity={0.7}
          metalness={0.85}
          roughness={0.2}
          distort={0.32}
          speed={1.4}
        />
      </Icosahedron>
      <Torus ref={ring} args={[3.2, 0.01, 12, 128]}>
        <meshBasicMaterial color="#f472b6" transparent opacity={0.35} />
      </Torus>

      {frags.map((f) => (
        <Fragment key={f.id} frag={f} onHit={onHit} />
      ))}
    </>
  );
}

export function OrbitBreaker({ onBook }: { onBook: () => void }) {
  const [phase, setPhase] = useState<"ready" | "playing" | "over">("ready");
  const [score, setScore] = useState(0);
  const [missed, setMissed] = useState(0);
  const [timeLeft, setTimeLeft] = useState(45);
  const [frags, setFrags] = useState<Frag[]>([]);
  const nextId = useRef(1);
  const timers = useRef<number[]>([]);

  const stop = useCallback(() => {
    timers.current.forEach(clearInterval);
    timers.current = [];
  }, []);

  const start = useCallback(() => {
    stop();
    setScore(0);
    setMissed(0);
    setTimeLeft(45);
    setFrags([]);
    setPhase("playing");

    const spawn = window.setInterval(() => {
      setFrags((cur) => {
        if (cur.length > 9) return cur;
        const bad = Math.random() < 0.22;
        return [
          ...cur,
          {
            id: nextId.current++,
            angle: Math.random() * Math.PI * 2,
            radius: 2.1 + Math.random() * 1.5,
            speed: (0.4 + Math.random() * 0.55) * (Math.random() < 0.5 ? 1 : -1),
            life: bad ? 3.4 : 3.8,
            maxLife: bad ? 3.4 : 3.8,
            tilt: Math.random() * Math.PI,
            bad,
          },
        ];
      });
    }, 620);

    const tick = window.setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          stop();
          setPhase("over");
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    timers.current = [spawn, tick];
  }, [stop]);

  const onHit = useCallback((id: number, bad: boolean) => {
    setFrags((cur) => cur.filter((f) => f.id !== id));
    setScore((s) => Math.max(0, s + (bad ? -15 : 10)));
  }, []);

  const onExpire = useCallback((id: number) => {
    setFrags((cur) => {
      const f = cur.find((x) => x.id === id);
      if (f && !f.bad) setMissed((m) => m + 1);
      return cur.filter((x) => x.id !== id);
    });
  }, []);

  const hud = useMemo(
    () => [
      { label: "Score", value: score },
      { label: "Time", value: `${timeLeft}s` },
      { label: "Missed", value: missed },
    ],
    [score, timeLeft, missed]
  );

  return (
    <GameFrame
      title="Orbit Breaker"
      blurb="Click the purple fragments before they decay. Red ones are unstable — hit those and you lose points. 45 seconds on the clock."
      hud={phase === "playing" ? hud : undefined}
      onStart={phase === "ready" ? start : undefined}
      startLabel="Enter the orbit"
    >
      <Suspense
        fallback={<div className="absolute inset-0 grid place-items-center text-gray-600 text-sm">Loading scene…</div>}
      >
        <Canvas camera={{ position: [0, 0, 8], fov: 55 }} dpr={[1, 1.75]}>
          <Arena
            frags={frags}
            onHit={onHit}
            onExpire={onExpire}
            running={phase === "playing"}
          />
        </Canvas>
      </Suspense>

      {phase === "over" && (
        <ScoreGate
          game="orbit-breaker"
          gameLabel="Orbit Breaker"
          score={score}
          detail={missed ? `${missed} fragments slipped past you` : "Nothing got past you"}
          onRestart={start}
          onBook={onBook}
        />
      )}
    </GameFrame>
  );
}
