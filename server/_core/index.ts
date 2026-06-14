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
    "https://files.manuscdn.com/user_upload_by_module/session_file/310519663319595517/qaxRMNSdRKxzjXmV.md"; // v3.12.0 — EriHeroSection heroVariant prop (image|content): Hero Variants section added to skill; content mode: solid #232323 background, two-column layout, contentSlot right column; sanctioned BDS pattern (no knownViolations needed)
  app.get("/api/skill/latest", (_req, res) => {
    res.redirect(302, SKILL_LATEST_URL);
  });
  // Also expose the current URL as JSON for programmatic discovery
  app.get("/api/skill/latest.json", (_req, res) => {
    res.setHeader("Cache-Control", "no-store");
    res.json({ url: SKILL_LATEST_URL, version: "3.12.0" }); // v3.12.0 — EriHeroSection heroVariant prop (image|content): Hero Variants section added to skill; content mode: solid #232323 background, two-column layout, contentSlot right column; sanctioned BDS pattern (no knownViolations needed)
  });
  // ── Project instructions latest ─────────────────────────────────────────────
  // Returns the most recently published project instructions snapshot as plain text.
  // Used by ERI codebase project instructions to self-update via curl at task start.
  // Admin publishes a version via trpc.skills.publishInstructions — sets publishedAt.
  app.get("/api/project-instructions/latest", async (_req, res) => {
    try {
      const { getDb } = await import("../db");
      const { projectInstructionsVersions } = await import("../../drizzle/schema");
      const { desc, isNotNull } = await import("drizzle-orm");
      const db = await getDb();
      if (!db) {
        res.status(503).type("text/plain").send("# Project instructions unavailable — DB not connected");
        return;
      }
      const [row] = await db
        .select()
        .from(projectInstructionsVersions)
        .where(isNotNull(projectInstructionsVersions.publishedAt))
        .orderBy(desc(projectInstructionsVersions.publishedAt))
        .limit(1);
      if (!row) {
        res.status(404).type("text/plain").send("# No published project instructions found");
        return;
      }
      res.setHeader("Cache-Control", "no-store");
      res.type("text/plain").send(row.generatedSnapshot);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      res.status(500).type("text/plain").send(`# Error: ${msg}`);
    }
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

  // ── Agent skill-sync endpoint ────────────────────────────────────────────
  // Allows Manus agents to call syncMetadataFromFiles and logImprovement
  // without a session cookie. Authenticated via BDS_AGENT_SECRET header.
  // POST /api/agent/skill-sync
  // Body: { secret: string, improvements?: Array<{ skillId, version, summary, taskContext? }> }
  // Returns: { success, syncResult, logged: number, errors: string[] }
  app.post("/api/agent/skill-sync", async (req, res) => {
    try {
      const { ENV } = await import("./env");
      const secret = ENV.agentSecret;
      if (!secret) {
        res.status(503).json({ error: "BDS_AGENT_SECRET not configured on this server" });
        return;
      }
      if (req.body?.secret !== secret) {
        res.status(401).json({ error: "Invalid agent secret" });
        return;
      }

      const improvements: Array<{ skillId: string; version: string; summary: string; taskContext?: string }> =
        Array.isArray(req.body?.improvements) ? req.body.improvements : [];

      // ── 1. Sync metadata from SKILL.md files ──────────────────────────────
      const { syncMetadataFromFilesImpl } = await import("../routers/skills");
      const syncResult = await syncMetadataFromFilesImpl();

      // ── 2. Log each improvement ───────────────────────────────────────────
      const { getDb } = await import("../db");
      const { skillImprovements } = await import("../../drizzle/schema");
      const { SKILLS_METADATA } = await import("../routers/skills");
      const db = await getDb();
      const logged: string[] = [];
      const errors: string[] = [];

      for (const imp of improvements) {
        if (!imp.skillId || !imp.version || !imp.summary) {
          errors.push(`Skipped malformed entry: ${JSON.stringify(imp)}`);
          continue;
        }
        const known = SKILLS_METADATA.find((s) => s.id === imp.skillId);
        if (!known) {
          errors.push(`Skill '${imp.skillId}' not found in SKILLS_METADATA — log skipped`);
          continue;
        }
        if (db) {
          await db.insert(skillImprovements).values({
            skillId: imp.skillId,
            version: imp.version,
            summary: imp.summary,
            taskContext: imp.taskContext ?? null,
          });
          logged.push(imp.skillId);
        } else {
          errors.push("DB unavailable — improvement log skipped");
        }
      }

      res.json({
        success: true,
        syncResult,
        logged: logged.length,
        loggedSkills: logged,
        errors,
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      res.status(500).json({ error: msg });
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

  // ── Skill auto-sync heartbeat ─────────────────────────────────────────────
  // Runs syncMetadataFromFilesImpl on startup and every hour.
  // Any new SKILL.md that lands in /home/ubuntu/skills/ (e.g. from another
  // Manus task) is automatically registered in SKILLS_METADATA and visible
  // on /skills without any manual BDS task intervention.
  const runSkillSync = async () => {
    try {
      const { syncMetadataFromFilesImpl } = await import("../routers/skills");
      const result = await syncMetadataFromFilesImpl();
      if (result.changesCount > 0 || result.registeredCount > 0) {
        console.log(`[skill-sync] ${result.message}`);
      }
    } catch (err) {
      console.warn("[skill-sync] heartbeat error:", err instanceof Error ? err.message : String(err));
    }
  };
  // Run once 5 s after startup (lets the server settle before touching skills.ts)
  setTimeout(runSkillSync, 5_000);
  // Then run every hour
  setInterval(runSkillSync, 60 * 60 * 1_000);
}

startServer().catch(console.error);
