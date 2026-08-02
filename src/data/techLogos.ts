// Logo lookup for the tech-stack chips on case-study pages.
// devicon carries the coloured brand marks; simple-icons fills the gaps but is
// monochrome black, so those need inverting on a dark background.
const DEVICON = (p: string) =>
  `https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${p}.svg`;
const SIMPLE = (n: string) =>
  `https://cdn.jsdelivr.net/npm/simple-icons@13/icons/${n}.svg`;

type Logo = { src: string; invert?: boolean };

const LOGOS: Record<string, Logo> = {
  "next.js": { src: DEVICON("nextjs/nextjs-original"), invert: true },
  react: { src: DEVICON("react/react-original") },
  "node.js": { src: DEVICON("nodejs/nodejs-original") },
  express: { src: DEVICON("express/express-original"), invert: true },
  typescript: { src: DEVICON("typescript/typescript-original") },
  javascript: { src: DEVICON("javascript/javascript-original") },
  css: { src: DEVICON("css3/css3-original") },
  "tailwind css": { src: DEVICON("tailwindcss/tailwindcss-original") },
  mongodb: { src: DEVICON("mongodb/mongodb-original") },
  firebase: { src: DEVICON("firebase/firebase-plain") },
  firestore: { src: DEVICON("firebase/firebase-plain") },
  php: { src: DEVICON("php/php-original") },
  wordpress: { src: DEVICON("wordpress/wordpress-original") },
  woocommerce: { src: DEVICON("woocommerce/woocommerce-original") },
  "aws s3": { src: DEVICON("amazonwebservices/amazonwebservices-original-wordmark") },
  shopify: { src: SIMPLE("shopify"), invert: true },
  webflow: { src: SIMPLE("webflow"), invert: true },
  razorpay: { src: SIMPLE("razorpay"), invert: true },
  stripe: { src: SIMPLE("stripe"), invert: true },
  "mapbox gl": { src: SIMPLE("mapbox"), invert: true },
  "google calendar": { src: SIMPLE("googlecalendar"), invert: true },
  "google drive": { src: SIMPLE("googledrive"), invert: true },
  "google meet api": { src: SIMPLE("googlemeet"), invert: true },
  "google reviews api": { src: SIMPLE("google"), invert: true },
  "framer motion": { src: SIMPLE("framer"), invert: true },
  gsap: { src: SIMPLE("greensock"), invert: true },
};

/** Returns a logo, or null when the entry has no brand mark (SEO, LLM APIs…). */
export const techLogo = (name: string): Logo | null =>
  LOGOS[name.toLowerCase()] ?? null;
