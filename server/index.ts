import express from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const server = createServer(app);

  // Serve static files from dist/public in production
  const staticPath =
    process.env.NODE_ENV === "production"
      ? path.resolve(__dirname, "public")
      : path.resolve(__dirname, "..", "dist", "public");

  // ── BDS-meta proxy ─────────────────────────────────────────────────────────
  // MUST be registered BEFORE express.static so /api/* routes are never
  // shadowed by static file serving or the catch-all index.html handler.
  // Fetches bds-meta.json server-side so the browser never makes a cross-origin
  // request. This means CORS headers on the target site are irrelevant.
  app.get("/api/fetch-bds-meta", async (req, res) => {
    const raw = req.query.url;
    if (typeof raw !== "string" || !raw.startsWith("https://")) {
      res.status(400).json({ error: "Missing or invalid url parameter" });
      return;
    }
    try {
      const upstream = await fetch(raw, {
        headers: { "User-Agent": "ERI-BDS-Tracker/1.0" },
        signal: AbortSignal.timeout(8000),
      });
      if (!upstream.ok) {
        res.status(upstream.status).json({ error: `Upstream HTTP ${upstream.status}` });
        return;
      }
      const data = await upstream.json();
      res.setHeader("Cache-Control", "no-store");
      res.json(data);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      res.status(502).json({ error: msg });
    }
  });

  // Handle client-side routing - serve index.html for all routes
  app.get("*", (_req, res) => {
    res.sendFile(path.join(staticPath, "index.html"));
  });

  const port = process.env.PORT || 3000;

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);
