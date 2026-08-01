import { useEffect } from "react";

export const SITE_URL = "https://bismaydey.vercel.app";
export const SITE_NAME = "Bismay Dey";

function setTag(selector: string, attr: string, value: string) {
  let el = document.head.querySelector(selector) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement("meta");
    const [, key, val] = selector.match(/\[(.+?)="(.+?)"\]/) ?? [];
    if (key && val) el.setAttribute(key, val);
    document.head.appendChild(el);
  }
  el.setAttribute(attr, value);
}

function setLink(rel: string, href: string) {
  let el = document.head.querySelector(
    `link[rel="${rel}"]`
  ) as HTMLLinkElement | null;
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

export type SeoOptions = {
  title: string;
  description: string;
  path: string;
  image?: string;
  type?: "website" | "article";
  /** JSON-LD structured data injected as application/ld+json */
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
};

/**
 * Applies per-route document metadata. The prerender step (scripts/prerender.mjs)
 * snapshots the resulting <head> into static HTML, so crawlers that do not run
 * JavaScript still receive correct tags.
 */
export function useSeo({
  title,
  description,
  path,
  image = `${SITE_URL}/og-default.jpg`,
  type = "website",
  jsonLd,
}: SeoOptions) {
  useEffect(() => {
    const url = `${SITE_URL}${path}`;
    document.title = title;

    setTag('meta[name="description"]', "content", description);
    setLink("canonical", url);

    setTag('meta[property="og:title"]', "content", title);
    setTag('meta[property="og:description"]', "content", description);
    setTag('meta[property="og:type"]', "content", type);
    setTag('meta[property="og:url"]', "content", url);
    setTag('meta[property="og:image"]', "content", image);
    setTag('meta[property="og:site_name"]', "content", SITE_NAME);

    setTag('meta[name="twitter:card"]', "content", "summary_large_image");
    setTag('meta[name="twitter:title"]', "content", title);
    setTag('meta[name="twitter:description"]', "content", description);
    setTag('meta[name="twitter:image"]', "content", image);

    const prev = document.getElementById("route-jsonld");
    if (prev) prev.remove();
    if (jsonLd) {
      const script = document.createElement("script");
      script.id = "route-jsonld";
      script.type = "application/ld+json";
      script.textContent = JSON.stringify(jsonLd);
      document.head.appendChild(script);
    }
  }, [title, description, path, image, type, jsonLd]);
}
