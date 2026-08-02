/**
 * Thin event wrapper. Works with Vercel Analytics out of the box and no-ops
 * cleanly in dev or if the script is blocked, so call sites never need a guard.
 */
type Props = Record<string, string | number | boolean>;

declare global {
  interface Window {
    va?: (event: "event", opts: { name: string; data?: Props }) => void;
    plausible?: (name: string, opts?: { props?: Props }) => void;
  }
}

export function track(name: string, props?: Props) {
  if (typeof window === "undefined") return;
  try {
    window.va?.("event", { name, data: props });
    window.plausible?.(name, props ? { props } : undefined);
    if (import.meta.env.DEV) console.debug("[track]", name, props ?? "");
  } catch {
    /* analytics must never break the UI */
  }
}
