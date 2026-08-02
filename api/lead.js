// One pipe for every lead the site captures — game leaderboard sign-ups,
// chatbot conversations, exit-intent. Everything lands in the same inbox as the
// contact form so nothing needs a separate place to be checked.

const CONTACT_EMAIL = "bismaydey001@gmail.com";
const FORM_ENDPOINT = `https://formsubmit.co/ajax/${CONTACT_EMAIL}`;

const hits = new Map();
function limited(ip) {
  const now = Date.now();
  const rec = hits.get(ip) ?? { n: 0, t: now };
  if (now - rec.t > 60_000) {
    rec.n = 0;
    rec.t = now;
  }
  rec.n += 1;
  hits.set(ip, rec);
  if (hits.size > 500) hits.clear();
  return rec.n > 8;
}

const clean = (v, max = 400) => String(v ?? "").trim().slice(0, max);
const looksLikeEmail = (v) => /^[^@\s]+@[^@\s.]+\.[^@\s]{2,}$/.test(v);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const ip = req.headers["x-forwarded-for"]?.split(",")[0]?.trim() || "local";
  if (limited(ip)) {
    return res.status(429).json({ error: "Too many submissions — try again shortly." });
  }

  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body ?? {};
    const source = clean(body.source, 40) || "unknown";
    const name = clean(body.name, 80);
    const email = clean(body.email, 120);

    if (!looksLikeEmail(email)) {
      return res.status(400).json({ error: "That email doesn't look right." });
    }

    // Everything else is free-form context per source (score, game, transcript)
    const details = {};
    for (const [k, v] of Object.entries(body.meta ?? {})) {
      details[clean(k, 40)] = clean(v, 1500);
    }

    const subject =
      source === "game"
        ? `Leaderboard signup — ${details.game ?? "game"} (${details.score ?? "?"})`
        : source === "chatbot"
          ? `BD's Helper lead — ${name || email}`
          : `New lead (${source}) — ${name || email}`;

    console.log("[lead]", JSON.stringify({ at: new Date().toISOString(), source, email, ...details }));

    const upstream = await fetch(FORM_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        _subject: subject,
        _template: "table",
        _captcha: "false",
        Source: source,
        Name: name || "—",
        Email: email,
        ...details,
      }),
    });

    if (!upstream.ok) {
      // The lead is already in the logs, so report success rather than losing it
      console.error("[lead] formsubmit failed", upstream.status);
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("[lead] failed", err);
    return res.status(500).json({ error: "Could not save that — please try again." });
  }
}
