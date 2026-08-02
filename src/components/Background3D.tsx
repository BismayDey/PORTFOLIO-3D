import { Suspense, lazy, useEffect, useState } from "react";

// three + drei is ~700KB. Keeping it out of the entry chunk means first paint
// never waits on it; the scene streams in afterwards and fades up.
const Canvas = lazy(() =>
  import("@react-three/fiber").then((m) => ({ default: m.Canvas }))
);
const Scene = lazy(() =>
  import("./Scene").then((m) => ({ default: m.Scene }))
);

/** Cheap CSS stand-in shown until (or instead of) the real scene. */
function StaticBackdrop() {
  return (
    <div className="absolute inset-0 bg-black">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_70%_40%,rgba(124,58,237,0.18),transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_40%_at_20%_70%,rgba(236,72,153,0.12),transparent_60%)]" />
    </div>
  );
}

function shouldSkip3D() {
  if (typeof window === "undefined") return true;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return true;
  const nav = navigator as Navigator & {
    connection?: { saveData?: boolean; effectiveType?: string };
    deviceMemory?: number;
  };
  if (nav.connection?.saveData) return true;
  if (nav.connection?.effectiveType && /^(slow-)?2g$/.test(nav.connection.effectiveType))
    return true;
  if (typeof nav.deviceMemory === "number" && nav.deviceMemory <= 2) return true;
  return false;
}

export function Background3D({
  eventSource,
}: {
  eventSource?: HTMLElement | null;
}) {
  const [mount, setMount] = useState(false);
  const [skip, setSkip] = useState(false);

  useEffect(() => {
    if (shouldSkip3D()) {
      setSkip(true);
      return;
    }
    // requestIdleCallback alone fires the moment the entry chunk finishes —
    // which is still before first paint. Wait for the load event first, then
    // idle, so the 700KB three chunk never competes with FCP.
    let idle: number | undefined;
    const schedule = () => {
      idle = (
        window.requestIdleCallback ??
        ((cb: () => void) => window.setTimeout(cb, 300))
      )(() => setMount(true), { timeout: 3000 } as IdleRequestOptions);
    };

    if (document.readyState === "complete") {
      // already loaded (client-side nav) — a frame of headroom is enough
      idle = window.setTimeout(schedule, 200) as unknown as number;
    } else {
      window.addEventListener("load", schedule, { once: true });
    }

    return () => {
      window.removeEventListener("load", schedule);
      if (idle !== undefined) {
        if (window.cancelIdleCallback) window.cancelIdleCallback(idle);
        clearTimeout(idle);
      }
    };
  }, []);

  return (
    <div className="fixed inset-0">
      <StaticBackdrop />
      {!skip && mount && (
        <Suspense fallback={null}>
          <div className="absolute inset-0 animate-[fadeIn_1.2s_ease-out_forwards] opacity-0">
            <Canvas
              className="pointer-events-auto"
              eventSource={eventSource ?? undefined}
              eventPrefix="client"
              dpr={[1, 1.75]}
              gl={{ antialias: false, powerPreference: "high-performance" }}
            >
              <Suspense fallback={null}>
                <Scene />
              </Suspense>
            </Canvas>
          </div>
        </Suspense>
      )}
    </div>
  );
}
