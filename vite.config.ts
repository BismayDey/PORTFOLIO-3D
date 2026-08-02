import { defineConfig, loadEnv, type Plugin } from "vite";
import react from "@vitejs/plugin-react";

/**
 * Runs the Vercel serverless function at /api/chat during `vite dev` and
 * `vite preview` too, so the chatbot behaves identically locally and in
 * production. The Groq key is read from .env here and never exposed to the
 * client — loadEnv with an empty prefix keeps it server-side only.
 */
function apiDevServer(mode: string): Plugin {
  const env = loadEnv(mode, process.cwd(), "");
  const attach = (server: { middlewares: import("connect").Server }) => {
    server.middlewares.use("/api/chat", async (req, res) => {
      // guard the assignments: process.env coerces undefined to "undefined"
      if (env.GROQ_API_KEY) process.env.GROQ_API_KEY ||= env.GROQ_API_KEY;
      if (env.GROQ_MODEL) process.env.GROQ_MODEL ||= env.GROQ_MODEL;
      try {
        const chunks: Buffer[] = [];
        for await (const c of req) chunks.push(c as Buffer);
        const raw = Buffer.concat(chunks).toString("utf8");

        const { default: handler } = await import("./api/chat.js");
        await handler(
          { method: req.method, headers: req.headers, body: raw || "{}" },
          {
            status(code: number) {
              res.statusCode = code;
              return this;
            },
            setHeader(k: string, v: string) {
              res.setHeader(k, v);
              return this;
            },
            write(chunk: string) {
              res.write(chunk);
              return true;
            },
            end() {
              res.end();
            },
            json(payload: unknown) {
              res.setHeader("Content-Type", "application/json");
              res.end(JSON.stringify(payload));
            },
          }
        );
      } catch (err) {
        res.statusCode = 500;
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify({ error: String(err) }));
      }
    });
  };

  return {
    name: "api-dev-server",
    configureServer: attach,
    configurePreviewServer: attach,
  };
}

export default defineConfig(({ mode }) => ({
  plugins: [react(), apiDevServer(mode)],
  optimizeDeps: {
    include: ["@fingerprintjs/fingerprintjs"],
  },
  build: {
    // No manualChunks. Forcing three into its own chunk made Rollup hoist the
    // shared React runtime in there too, so the entry had to import it and the
    // 950KB chunk landed back on the critical path. Rollup's automatic async
    // splitting handles the lazy Background3D/Scene imports correctly.
    modulePreload: {
      // do not preload the 3D chunks — they are deliberately idle-mounted
      resolveDependencies: (_url: string, deps: string[]) =>
        deps.filter((d) => !/(Scene|Background3D)-/.test(d)),
    },
    chunkSizeWarningLimit: 800,
  },
}));
