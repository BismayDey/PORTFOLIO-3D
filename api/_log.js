// Conversation logging — what visitors actually ask is free market research.
//
// Serverless filesystems are ephemeral, so this writes wherever it can:
//   1. A webhook (Slack/Discord/Zapier) if CHAT_LOG_WEBHOOK is set — best option.
//   2. Structured console lines otherwise, readable in Vercel → Logs.
// Never blocks or throws into the response path.

const RECENT_MAX = 50;
/** In-memory ring buffer so /api/chat-log can show the latest without a store. */
export const recent = [];

function redact(text = "") {
  return String(text)
    .replace(/[\w.+-]+@[\w-]+\.[\w.]+/g, "[email]")
    .replace(/\+?\d[\d\s-]{8,}\d/g, "[phone]")
    .slice(0, 800);
}

export function logConversation(ip, question, answer, model) {
  try {
    const entry = {
      at: new Date().toISOString(),
      // a coarse visitor tag, not an identifier we store
      visitor: String(ip).split(".").slice(0, 2).join(".") + ".x",
      model,
      q: redact(question),
      a: redact(answer.replace(/FOLLOWUPS:.*$/s, "").trim()),
    };

    recent.unshift(entry);
    if (recent.length > RECENT_MAX) recent.length = RECENT_MAX;

    console.log("[bd-helper]", JSON.stringify(entry));

    const hook = process.env.CHAT_LOG_WEBHOOK;
    if (hook) {
      // fire and forget; a logging failure must never affect the reply
      fetch(hook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: `*BD's Helper* · ${entry.visitor} · ${model}\n*Q:* ${entry.q}\n*A:* ${entry.a.slice(0, 400)}`,
        }),
      }).catch(() => {});
    }
  } catch {
    /* logging is best-effort by design */
  }
}
