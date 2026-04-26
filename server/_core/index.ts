import "dotenv/config";
import express from "express";
import { createServer } from "http";
import net from "net";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerOAuthRoutes } from "./oauth";
import { appRouter } from "../routers";
import { createContext } from "./context";
import { serveStatic, setupVite } from "./vite";

function isPortAvailable(port: number): Promise<boolean> {
  return new Promise(resolve => {
    const server = net.createServer();
    server.listen(port, () => {
      server.close(() => resolve(true));
    });
    server.on("error", () => resolve(false));
  });
}

async function findAvailablePort(startPort: number = 3000): Promise<number> {
  for (let port = startPort; port < startPort + 20; port++) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  throw new Error(`No available port found starting from ${startPort}`);
}

async function startServer() {
  const app = express();
  const server = createServer(app);
  // Configure body parser with larger size limit for file uploads
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));
  // OAuth callback under /api/oauth/callback
  registerOAuthRoutes(app);
  // tRPC API
  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );
  // ── Skill latest redirect ────────────────────────────────────────────────────
  // Stable URL for the current eri-bds-reference skill.
  // Update SKILL_LATEST_URL when releasing a new skill version.
  // All ERI project instructions reference /api/skill/latest — this URL never changes.
  const SKILL_LATEST_URL =
    "https://d2xsxph8kpxj0f.cloudfront.net/310519663319595517/5mtZtU66sMbsnmPoVbf6UJ/eri-bds-reference-latest_cb7e5baa.skill";
  app.get("/api/skill/latest", (_req, res) => {
    res.redirect(302, SKILL_LATEST_URL);
  });
  // Also expose the current URL as JSON for programmatic discovery
  app.get("/api/skill/latest.json", (_req, res) => {
    res.setHeader("Cache-Control", "no-store");
    res.json({ url: SKILL_LATEST_URL, version: "2.8.0" });
  });

  // ── BDS-meta proxy ─────────────────────────────────────────────────────────
  // Fetches bds-meta.json server-side so the browser never makes a cross-origin
  // request. CORS headers on the target site are irrelevant.
  // Registered before setupVite so Express handles /api/* before Vite.
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

  // development mode uses Vite, production mode uses static files
  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  const preferredPort = parseInt(process.env.PORT || "3000");
  const port = await findAvailablePort(preferredPort);

  if (port !== preferredPort) {
    console.log(`Port ${preferredPort} is busy, using port ${port} instead`);
  }

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);
