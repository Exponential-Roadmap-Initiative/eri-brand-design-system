/**
 * ERI BDS Alignment Tracker
 *
 * Design: ERI Brand Design System
 * - pt-[108px] to clear the fixed SiteHeader (68px) + TabNav (40px)
 * - Full-width dark #232323 header band with Accent Lime eyebrow + stat cards
 * - Archivo headings, dot status indicators, no Bootstrap pills
 * - Dark #232323 table header row, white body rows
 */

import { useEffect, useState, useCallback } from "react";
import { PROJECT_REGISTRY, getBdsMetaUrl } from "@/data/projectRegistry";
import type { BdsMeta, ProjectFetchResult, ComponentName } from "@/data/bdsMetaTypes";

// ── Constants ─────────────────────────────────────────────────────────────────

const COMPONENT_NAMES: ComponentName[] = [
  "EriAppHeader",
  "EriPageLayout",
  "EriHeroSection",
  "EriAppFooter",
  "EriStatusBadge",
  "EriContactUsButton",
];

const LATEST_VERSION = "v2.10.9";

// ── Design tokens ─────────────────────────────────────────────────────────────

const T = {
  dark:      "#232323",
  lime:      "#93E07D",
  green:     "#3ba559",
  offWhite:  "#F9FAFB",
  bodyText:  "#383838",
  muted:     "#6b7280",
  border:    "#e5e7eb",
};

// ── Status helpers ────────────────────────────────────────────────────────────

type RowStatus = "green" | "amber" | "red" | "unknown" | "loading" | "error";

function statusCfg(s: RowStatus) {
  switch (s) {
    case "green":   return { dot: T.lime,    label: "Compliant",   text: "#166534" };
    case "amber":   return { dot: "#f59e0b", label: "Needs update",text: "#92400e" };
    case "red":     return { dot: "#ef4444", label: "Violations",  text: "#991b1b" };
    case "error":   return { dot: "#ef4444", label: "Unreachable", text: "#991b1b" };
    case "loading": return { dot: "#9ca3af", label: "Fetching…",   text: T.muted   };
    default:        return { dot: "#d1d5db", label: "No response", text: T.muted   };
  }
}

function StatusDot({ status }: { status: RowStatus }) {
  const { dot, label, text } = statusCfg(status);
  const pulse = status === "loading";
  return (
    <span className="inline-flex items-center gap-1.5">
      <span
        className={`inline-block rounded-full shrink-0${pulse ? " animate-pulse" : ""}`}
        style={{ width: 8, height: 8, backgroundColor: dot, boxShadow: `0 0 0 2px ${dot}33` }}
      />
      <span className="text-xs font-medium" style={{ color: text }}>{label}</span>
    </span>
  );
}

/**
 * Compute the compliance status from the raw BdsMeta data.
 * The tracker does NOT trust the self-reported overallStatus field — it derives
 * status independently so that projects cannot accidentally mis-classify themselves.
 *
 * Rules (in priority order):
 *   red   — any component with used:true AND compliant:false, OR any knownViolations
 *           entry whose component key maps to a used:true component
 *   amber — cssImportMethod is "source-workaround", OR eriComponentsPin is more than
 *           one minor version behind LATEST_VERSION
 *   green — everything else (including used:false components with knownViolations notes)
 */
function deriveStatus(meta: BdsMeta | undefined): RowStatus {
  if (!meta) return "unknown";

  // Build a set of component keys that are actively used
  const usedComponents = new Set<string>(
    Object.entries(meta.components ?? {}).filter(([, v]) => {
      if (typeof v === "object" && v !== null) return (v as { used?: boolean }).used === true;
      // legacy string format — treat any string value as "used"
      return typeof v === "string";
    }).map(([k]) => k)
  );

  // Red: any used component is non-compliant
  const hasNonCompliantUsed = Object.entries(meta.components ?? {}).some(([, v]) => {
    if (typeof v === "object" && v !== null) {
      const c = v as { used?: boolean; compliant?: boolean };
      return c.used === true && c.compliant === false;
    }
    return false;
  });

  // Red: any knownViolations entry references a used component
  const hasActiveViolation = (meta.knownViolations ?? []).some((v) => {
    if (typeof v === "object" && v !== null) {
      const component = (v as Record<string, unknown>).component;
      if (typeof component === "string") return usedComponents.has(component);
    }
    // plain string violations always count as active
    return typeof v === "string" && v.trim().length > 0;
  });

  if (hasNonCompliantUsed || hasActiveViolation) return "red";

  // Amber: CSS import method is not dist
  if (meta.cssImportMethod && meta.cssImportMethod !== "dist") return "amber";

  // Amber: package pin is more than one minor version behind
  const pinMatch    = (meta.eriComponentsPin ?? "").match(/v?(\d+)\.(\d+)/);
  const latestMatch = LATEST_VERSION.match(/v?(\d+)\.(\d+)/);
  if (pinMatch && latestMatch) {
    const pinMinor    = parseInt(pinMatch[2], 10);
    const latestMinor = parseInt(latestMatch[2], 10);
    if (parseInt(pinMatch[1], 10) < parseInt(latestMatch[1], 10)) return "amber";
    if (latestMinor - pinMinor > 1) return "amber";
  }

  return "green";
}

// ── Cell helpers ──────────────────────────────────────────────────────────────

function Dash() {
  return <span style={{ color: "#d1d5db", fontSize: 12 }}>—</span>;
}

function ComponentCell({ used, compliant }: { used?: boolean; compliant?: boolean }) {
  if (used === undefined) return <Dash />;
  if (!used) return <span style={{ color: T.muted, fontSize: 12 }}>—</span>;
  if (compliant) return <span style={{ color: T.green, fontSize: 13, fontWeight: 700 }}>✓</span>;
  return <span style={{ color: "#ef4444", fontSize: 13, fontWeight: 700 }}>✗</span>;
}

function VersionBadge({ pin }: { pin?: string }) {
  if (!pin) return <Dash />;
  const latest = pin === LATEST_VERSION || pin === "main";
  const behind = !latest;
  return (
    <span
      className="inline-flex items-center font-mono text-[11px] font-semibold px-1.5 py-0.5 rounded"
      style={{
        backgroundColor: latest ? "#dcfce7" : behind ? "#fef9c3" : "#f3f4f6",
        color:           latest ? "#166534" : behind ? "#854d0e" : T.muted,
      }}
    >
      {pin}
    </span>
  );
}

function CssCell({ method }: { method?: string }) {
  if (!method) return <Dash />;
  if (method === "dist") return <span style={{ color: T.green, fontSize: 12, fontWeight: 600 }}>✓ dist/</span>;
  if (method === "source-workaround") return <span style={{ color: "#f59e0b", fontSize: 12, fontWeight: 600 }}>⚠ @source</span>;
  return <span style={{ color: "#ef4444", fontSize: 12, fontWeight: 600 }}>✗ None</span>;
}

/** Normalise a knownViolations entry to a display string regardless of whether
 * the project published it as a plain string or a richer object
 * (e.g. { component, reason, approvedBy, bdsRef }).
 */
function violationText(v: unknown): string {
  if (typeof v === "string") return v;
  if (v && typeof v === "object") {
    const o = v as Record<string, unknown>;
    const parts: string[] = [];
    if (o.component) parts.push(String(o.component));
    if (o.reason)    parts.push(String(o.reason));
    if (o.bdsRef)    parts.push(`ref:${o.bdsRef}`);
    if (o.approvedBy) parts.push(`approved:${o.approvedBy}`);
    return parts.length ? parts.join(" — ") : JSON.stringify(v);
  }
  return String(v);
}

function ViolationsCell({ violations, error }: { violations?: unknown[]; error?: string }) {
  if (error) return <span style={{ color: "#ef4444", fontSize: 11 }}>Failed to fetch</span>;
  if (!violations) return <Dash />;
  if (violations.length === 0) return <span style={{ color: T.green, fontSize: 12 }}>None</span>;
  return (
    <ul className="space-y-0.5">
      {violations.map((v, i) => (
        <li key={i} className="font-mono text-[10px] px-1 rounded" style={{ color: "#ef4444", backgroundColor: "#fef2f2" }}>{violationText(v)}</li>
      ))}
    </ul>
  );
}

/**
 * Filter knownViolations to only those that reference a used:true component.
 * Entries for used:false components are documentation notes and must not be displayed
 * as violations in the tracker UI.
 */
function activeViolations(meta: BdsMeta | undefined): unknown[] {
  if (!meta) return [];
  const usedComponents = new Set<string>(
    Object.entries(meta.components ?? {}).filter(([, v]) => {
      if (typeof v === "object" && v !== null) return (v as { used?: boolean }).used === true;
      return typeof v === "string";
    }).map(([k]) => k)
  );
  return (meta.knownViolations ?? []).filter((v) => {
    if (typeof v === "object" && v !== null) {
      const component = (v as Record<string, unknown>).component;
      if (typeof component === "string") return usedComponents.has(component);
      // object without a component key — show it (conservative)
      return true;
    }
    // plain string — always show
    return typeof v === "string" && v.trim().length > 0;
  });
}

// ── Main ──────────────────────────────────────────────────────────────────────

export default function AlignmentTracker() {
  const [results, setResults] = useState<Record<string, ProjectFetchResult>>(() =>
    Object.fromEntries(
      PROJECT_REGISTRY.map((p) => [p.id, { projectId: p.id, url: p.url, status: "loading" as const }])
    )
  );
  const [lastRefreshed, setLastRefreshed] = useState<Date | null>(null);

  const fetchAll = useCallback(async () => {
    setLastRefreshed(null);
    setResults(Object.fromEntries(
      PROJECT_REGISTRY.map((p) => [p.id, { projectId: p.id, url: p.url, status: "loading" as const }])
    ));
    await Promise.all(
      PROJECT_REGISTRY.map(async (project) => {
        try {
          const res = await fetch(getBdsMetaUrl(project.url), { cache: "no-store" });
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          const json = await res.json();
          // Validate that the JSON is a v1.0 bds-meta.json — reject legacy or wrong-schema files
          if (!json || typeof json !== "object" || json.error) {
            throw new Error(json?.error ?? "Invalid JSON response");
          }
          if (!json.schemaVersion) {
            throw new Error("Not a bds-meta.json file (missing schemaVersion)");
          }
          const meta: BdsMeta = json as BdsMeta;
          setResults((prev) => ({ ...prev, [project.id]: { projectId: project.id, url: project.url, status: "ok", meta } }));
        } catch (err) {
          setResults((prev) => ({
            ...prev,
            [project.id]: { projectId: project.id, url: project.url, status: "error", error: err instanceof Error ? err.message : "Unknown" },
          }));
        }
      })
    );
    setLastRefreshed(new Date());
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const live       = PROJECT_REGISTRY.map((p) => results[p.id]).filter(Boolean);
  const greenCount = live.filter((r) => deriveStatus(r.meta) === "green").length;
  const amberCount = live.filter((r) => deriveStatus(r.meta) === "amber").length;
  const redCount   = live.filter((r) => deriveStatus(r.meta) === "red" || r.status === "error").length;

  return (
    // pt-[108px] clears the fixed SiteHeader (68px) + TabNav (40px)
    <div className="min-h-screen pt-[108px]" style={{ backgroundColor: T.offWhite }}>

       {/* ── Dark header band — full viewport width ───────────────────── */}
      <div style={{ backgroundColor: T.dark }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16 md:pb-24">

          {/* Eyebrow */}
          <p className="font-archivo text-[11px] font-semibold uppercase tracking-widest mb-3" style={{ color: T.lime }}>
            BDS Alignment Tracker
          </p>

          {/* Title + refresh */}
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <h1 className="font-archivo text-4xl md:text-5xl font-extrabold text-white leading-tight mb-2">
                Project Compliance
              </h1>
              <p className="text-xl leading-relaxed max-w-3xl" style={{ color: "rgba(255,255,255,0.6)" }}>
                Live status of BDS alignment across all ERI projects. Data is fetched directly from each project's published{" "}
                <code className="font-mono text-[11px] px-1.5 py-0.5 rounded" style={{ backgroundColor: "rgba(255,255,255,0.08)", color: T.lime }}>bds-meta.json</code>{" "}
                file. Latest{" "}
                <code className="font-mono text-[11px] px-1.5 py-0.5 rounded" style={{ backgroundColor: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.7)" }}>@eri/components</code>{" "}
                release: <span className="font-mono text-[11px] font-semibold" style={{ color: T.lime }}>{LATEST_VERSION}</span>
              </p>
            </div>
            <button
              onClick={fetchAll}
              className="self-start sm:self-auto shrink-0 px-5 py-2.5 rounded-lg text-sm font-semibold transition-opacity hover:opacity-90"
              style={{ backgroundColor: T.lime, color: T.dark }}
            >
              ↻ Refresh
            </button>
          </div>
        </div>
      </div>

      {/* ── Stats strip — below hero, same alignment as header logo ─────── */}
      <div className="border-b" style={{ backgroundColor: "#fff", borderColor: T.border }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-0 divide-x" style={{ borderColor: T.border }}>
            {[
              { count: PROJECT_REGISTRY.length, label: "Projects tracked", color: T.bodyText },
              { count: greenCount,              label: "Compliant",         color: T.green },
              { count: amberCount,              label: "Needs update",      color: "#d97706" },
              { count: redCount,                label: "Violations / unreachable", color: "#dc2626" },
            ].map(({ count, label, color }) => (
              <div key={label} className="flex items-center gap-3 px-6 py-4 first:pl-0">
                <span className="font-archivo text-2xl font-extrabold leading-none" style={{ color }}>{count}</span>
                <span className="text-xs" style={{ color: T.muted }}>{label}</span>
              </div>
            ))}
            {lastRefreshed && (
              <div className="flex items-center px-6 py-4 ml-auto">
                <span className="text-[11px]" style={{ color: T.muted }}>Refreshed {lastRefreshed.toLocaleTimeString()}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Table ────────────────────────────────────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Desktop */}
        <div className="hidden lg:block overflow-x-auto rounded-xl shadow-sm" style={{ border: `1px solid ${T.border}` }}>
          <table className="w-full text-sm bg-white">
            <thead>
              <tr style={{ backgroundColor: T.dark }}>
                {[
                  { label: "Project",      w: "w-52" },
                  { label: "Status",       w: "" },
                  { label: "Package Pin",  w: "" },
                  { label: "CSS Import",   w: "" },
                  ...COMPONENT_NAMES.map((c) => ({ label: c.replace("Eri", ""), w: "" })),
                  { label: "Violations",   w: "" },
                  { label: "Updated",      w: "" },
                ].map(({ label, w }) => (
                  <th
                    key={label}
                    className={`text-left px-4 py-3.5 font-archivo text-[11px] font-semibold uppercase tracking-widest whitespace-nowrap ${w}`}
                    style={{ color: "rgba(255,255,255,0.45)" }}
                  >
                    {label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {PROJECT_REGISTRY.map((project, idx) => {
                const result    = results[project.id];
                const meta      = result?.meta;
                const isLoading = result?.status === "loading";
                const isError   = result?.status === "error";
                 const rowStatus: RowStatus = isLoading ? "loading" : isError ? "error" : deriveStatus(meta);
                return (
                  <tr
                    key={project.id}
                    className="transition-colors hover:bg-[#f9fafb]"
                    style={{ borderTop: idx === 0 ? "none" : `1px solid ${T.border}` }}
                  >
                    {/* Project */}
                    <td className="px-4 py-4">
                      <div className="font-semibold text-sm mb-0.5" style={{ color: T.dark }}>{project.displayName}</div>
                      <a
                        href={project.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[11px] hover:underline"
                        style={{ color: T.muted }}
                      >
                        {project.url.replace("https://", "")} ↗
                      </a>
                      {project.status === "in-development" && (
                        <span className="ml-1.5 text-[10px] font-semibold px-1.5 py-0.5 rounded" style={{ backgroundColor: "#fef9c3", color: "#854d0e" }}>
                          in dev
                        </span>
                      )}
                    </td>

                    {/* Status */}
                    <td className="px-4 py-4"><StatusDot status={rowStatus} /></td>

                    {/* Package pin */}
                    <td className="px-4 py-4">
                      {isLoading ? <span className="text-xs animate-pulse" style={{ color: "#d1d5db" }}>…</span>
                        : isError ? <Dash />
                        : <VersionBadge pin={meta?.eriComponentsPin} />}
                    </td>

                    {/* CSS import */}
                    <td className="px-4 py-4">
                      {isLoading ? <span className="text-xs animate-pulse" style={{ color: "#d1d5db" }}>…</span>
                        : isError ? <Dash />
                        : <CssCell method={meta?.cssImportMethod} />}
                    </td>

                    {/* Component columns */}
                    {COMPONENT_NAMES.map((c) => (
                      <td key={c} className="px-4 py-4">
                        {isLoading ? <span className="text-xs animate-pulse" style={{ color: "#e5e7eb" }}>…</span>
                          : isError ? <Dash />
                          : (() => {
                              const cv = meta?.components?.[c];
                              // Handle both object format {used, compliant} and legacy string format
                              if (!cv) return <Dash />;
                              if (typeof cv === 'string') return <ComponentCell used={true} compliant={cv === 'used' || cv === 'via-EriPageLayout'} />;
                              return <ComponentCell used={(cv as {used:boolean}).used} compliant={(cv as {compliant:boolean}).compliant} />;
                            })()}
                      </td>
                    ))}

                    {/* Violations */}
                    <td className="px-4 py-4 max-w-[200px]">
                      {isLoading ? <span className="text-xs animate-pulse" style={{ color: "#e5e7eb" }}>…</span>
                        : isError ? <ViolationsCell error={result.error} />
                        : <ViolationsCell violations={activeViolations(meta)} />}
                    </td>

                    {/* Updated */}
                    <td className="px-4 py-4">
                      {meta ? (
                        <>
                          <div className="text-xs" style={{ color: T.bodyText }}>{meta.lastUpdated}</div>
                          <div className="text-[11px]" style={{ color: T.muted }}>{meta.updatedBy}</div>
                        </>
                      ) : <Dash />}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Mobile cards */}
        <div className="lg:hidden space-y-3">
          {PROJECT_REGISTRY.map((project) => {
            const result    = results[project.id];
            const meta      = result?.meta;
            const isLoading = result?.status === "loading";
            const isError   = result?.status === "error";
            const rowStatus: RowStatus = isLoading ? "loading" : isError ? "error" : deriveStatus(meta);
            return (
              <div key={project.id} className="rounded-xl p-4 bg-white" style={{ border: `1px solid ${T.border}` }}>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="font-semibold text-sm mb-0.5" style={{ color: T.dark }}>{project.displayName}</div>
                    <a href={project.url} target="_blank" rel="noopener noreferrer" className="text-[11px] hover:underline" style={{ color: T.muted }}>
                      {project.url.replace("https://", "")} ↗
                    </a>
                  </div>
                  <StatusDot status={rowStatus} />
                </div>
                {meta && (
                  <>
                    <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                      <div className="flex items-center gap-1.5">
                        <span style={{ color: T.muted }}>Package:</span>
                        <VersionBadge pin={meta.eriComponentsPin} />
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span style={{ color: T.muted }}>CSS:</span>
                        <CssCell method={meta.cssImportMethod} />
                      </div>
                    </div>
                    {activeViolations(meta).length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {activeViolations(meta).map((v, i) => (
                          <span key={i} className="font-mono text-[10px] px-1 rounded" style={{ backgroundColor: "#fef2f2", color: "#ef4444" }}>{violationText(v)}</span>
                        ))}
                      </div>
                    )}
                    <p className="text-[11px] mt-2" style={{ color: T.muted }}>Updated {meta.lastUpdated} · {meta.updatedBy}</p>
                  </>
                )}
                {isError && <p className="text-xs mt-1" style={{ color: "#ef4444" }}>Could not fetch bds-meta.json</p>}
              </div>
            );
          })}
        </div>

        {/* ── How it works ─────────────────────────────────────────────────── */}
        <div className="mt-8 rounded-xl p-6 bg-white" style={{ border: `1px solid ${T.border}` }}>
          <h2 className="font-archivo font-bold text-lg mb-1" style={{ color: T.dark }}>How this tracker works</h2>
          <div className="mb-4 px-3 py-2 rounded text-xs font-medium" style={{ backgroundColor: "#fef3c7", color: "#92400e", border: "1px solid #fcd34d" }}>
            ⚠️ <strong>This file is NOT part of the <code className="font-mono">@eri/components</code> package.</strong> You create it yourself in each consuming project. The package ships only component source and <code className="font-mono">dist/eri-components.css</code> — nothing else. Copy the template below and commit it to <code className="font-mono">client/public/bds-meta.json</code> in your project.
          </div>
          <p className="text-sm mb-6" style={{ color: T.muted }}>
            Every ERI project must publish a static{" "}
            <code className="font-mono text-[11px] px-1 rounded" style={{ backgroundColor: "#f3f4f6" }}>bds-meta.json</code>{" "}
            file at <code className="font-mono text-[11px] px-1 rounded" style={{ backgroundColor: "#f3f4f6" }}>client/public/bds-meta.json</code>{" "}
            so it is served at{" "}
            <code className="font-mono text-[11px] px-1 rounded" style={{ backgroundColor: "#f3f4f6" }}>https://&#123;domain&#125;/bds-meta.json</code>.
            The tracker fetches this file from every registered project and renders a live compliance dashboard.
            Update it whenever you upgrade <code className="font-mono text-[11px] px-1 rounded" style={{ backgroundColor: "#f3f4f6" }}>@eri/components</code>, change the CSS import method, add or fix a component, or resolve a violation.
          </p>

          {/* Canonical template */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-sm" style={{ color: T.dark }}>
                Canonical template — copy into <code className="font-mono text-[11px] px-1 rounded" style={{ backgroundColor: "#f3f4f6" }}>client/public/bds-meta.json</code>
              </h3>
              <button
                onClick={() => {
                  const today = new Date().toISOString().slice(0, 10);
                  navigator.clipboard.writeText(
`{\n  "schemaVersion": "1.0",\n  "project": "your-project-id",\n  "projectName": "Your Project Name",\n  "domain": "your-project.exponentialroadmap.org",\n  "eriComponentsPin": "${LATEST_VERSION}",\n  "cssImportMethod": "dist",\n  "components": {\n    "EriAppHeader":       { "used": true,  "compliant": true  },\n    "EriPageLayout":      { "used": true,  "compliant": true  },\n    "EriHeroSection":     { "used": true,  "compliant": true  },\n    "EriAppFooter":       { "used": true,  "compliant": true  },\n    "EriStatusBadge":     { "used": true,  "compliant": true  },\n    "EriContactUsButton": { "used": true,  "compliant": true  }\n  },\n  "knownViolations": [],\n  "overallStatus": "green",\n  "lastUpdated": "${today}",\n  "updatedBy": "Manus"\n}`
                  );
                }}
                className="text-[11px] px-3 py-1.5 rounded font-semibold transition-opacity hover:opacity-80"
                style={{ backgroundColor: T.lime, color: T.dark }}
              >
                Copy template
              </button>
            </div>
            <div className="rounded-lg p-4 font-mono text-xs overflow-x-auto leading-relaxed" style={{ backgroundColor: T.dark, color: T.lime }}>
{`{
  "schemaVersion": "1.0",
  "project": "your-project-id",
  "projectName": "Your Project Name",
  "domain": "your-project.exponentialroadmap.org",
  "eriComponentsPin": "${LATEST_VERSION}",
  "cssImportMethod": "dist",
  "components": {
    "EriAppHeader":   { "used": true,  "compliant": true  },
    "EriPageLayout":  { "used": true,  "compliant": true  },
    "EriHeroSection": { "used": true,  "compliant": true  },
    "EriAppFooter":        { "used": true,  "compliant": true  },
    "EriStatusBadge":      { "used": true,  "compliant": true  },
    "EriContactUsButton":  { "used": true,  "compliant": true  }
  },
  "knownViolations": [],
  "overallStatus": "green",
  "lastUpdated": "2026-04-19",
  "updatedBy": "Manus"
}`}
            </div>
          </div>

          {/* Field reference + Status rules */}
          <div className="grid md:grid-cols-2 gap-8 text-sm">

            {/* Field reference */}
            <div>
              <h3 className="font-semibold mb-3" style={{ color: T.dark }}>Field reference</h3>
              <div className="space-y-2">
                {([
                  ["schemaVersion", '"1.0"',                        'Always "1.0" — do not change.'],
                  ["project",       '"hal"',                         'Short lowercase project code. Examples: hal, psm, playbook, taxonomy.'],
                  ["projectName",   '"Human-AI Lab"',                'Full human-readable project name.'],
                  ["domain",        '"hal.exponentialroadmap.org"',  'Canonical deployed domain (no https://).'],
                  ["eriComponentsPin", `"${LATEST_VERSION}"`,        `Exact version tag installed. Latest is ${LATEST_VERSION}.`],
                  ["cssImportMethod", '"dist"',                      '"dist" = correct. "source-workaround" = amber. "none" = red.'],
                  ["components",    '{ ... }',                       'Per-component status. Each key: { used: boolean, compliant: boolean }.'],
                  ["knownViolations", '[]',                          'Violations for used:true components only. Entries for used:false components are shown as documentation but do not affect status. Supports plain strings or objects: { component, reason, approvedBy, bdsRef }.'],
                  ["overallStatus", '"green"',                       '"green" | "amber" | "red". Informational — the tracker computes status independently from the component data and ignores this field.'],
                  ["lastUpdated",   '"2026-04-19"',                  'ISO date (YYYY-MM-DD) of last update.'],
                  ["updatedBy",     '"Manus"',                       'Who last updated this file — "Manus" or your name.'],
                ] as [string, string, string][]).map(([field, example, desc]) => (
                  <div key={field} className="rounded-lg p-3" style={{ backgroundColor: T.offWhite, border: `1px solid ${T.border}` }}>
                    <div className="flex items-baseline gap-2 mb-0.5 flex-wrap">
                      <code className="font-mono text-[11px] font-bold" style={{ color: T.dark }}>{field}</code>
                      <code className="font-mono text-[10px]" style={{ color: T.muted }}>{example}</code>
                    </div>
                    <p className="text-[11px]" style={{ color: T.muted }}>{desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Status rules + component guide + checklist */}
            <div>
              <h3 className="font-semibold mb-3" style={{ color: T.dark }}>Status rules</h3>
              <div className="space-y-3 mb-6">
                {(["green","amber","red","error"] as RowStatus[]).map((s) => {
                  const { dot, label } = statusCfg(s);
                  const desc: Record<string, string> = {
                    green: `All used components are compliant, CSS uses dist/, and no knownViolations entry references a used component. Unused components (used:false) with documentation notes do not affect this status.`,
                    amber: `CSS uses @source workaround, or package pin is 2+ minor versions behind ${LATEST_VERSION}.`,
                    red:   `Any used component (used:true) has compliant:false, or a knownViolations entry references a used component.`,
                    error: `Project has not yet published a bds-meta.json file, or the URL is unreachable.`,
                  };
                  return (
                    <div key={s} className="flex items-start gap-3">
                      <span className="inline-block rounded-full mt-1 shrink-0" style={{ width: 8, height: 8, backgroundColor: dot, boxShadow: `0 0 0 2px ${dot}33` }} />
                      <div>
                        <span className="font-semibold text-xs" style={{ color: T.dark }}>{label} — </span>
                        <span className="text-xs" style={{ color: T.muted }}>{desc[s]}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              <h3 className="font-semibold mb-3" style={{ color: T.dark }}>Component values guide</h3>
              <div className="space-y-2 text-[11px] mb-6" style={{ color: T.muted }}>
                <div className="p-2 rounded" style={{ backgroundColor: T.offWhite, border: `1px solid ${T.border}` }}>
                  <code className="font-mono" style={{ color: T.dark }}>used: true, compliant: true</code>
                  <p className="mt-0.5">Component is used and follows the BDS spec.</p>
                </div>
                <div className="p-2 rounded" style={{ backgroundColor: T.offWhite, border: `1px solid ${T.border}` }}>
                  <code className="font-mono" style={{ color: T.dark }}>used: true, compliant: false</code>
                  <p className="mt-0.5">Component is used but deviates from the BDS spec. Add an entry to <code className="font-mono">knownViolations</code> with <code className="font-mono">component</code>, <code className="font-mono">reason</code>, <code className="font-mono">approvedBy</code>, and <code className="font-mono">bdsRef</code>.</p>
                </div>
                <div className="p-2 rounded" style={{ backgroundColor: T.offWhite, border: `1px solid ${T.border}` }}>
                  <code className="font-mono" style={{ color: T.dark }}>used: false, compliant: false</code>
                  <p className="mt-0.5">Component is not applicable to this project (e.g. <code className="font-mono">EriContactUsButton</code> on the Contact Us page itself). No <code className="font-mono">knownViolations</code> entry is needed — <code className="font-mono">used: false</code> is sufficient. Do not add a violation note for unused components.</p>
                </div>
              </div>

              <div className="p-4 rounded-lg" style={{ backgroundColor: T.offWhite, border: `1px solid ${T.border}` }}>
                <p className="text-[11px] font-semibold mb-2" style={{ color: T.dark }}>Quick checklist before setting overallStatus: "green"</p>
                <ul className="text-[11px] space-y-1" style={{ color: T.muted }}>
                  <li>✓ <code className="font-mono">@eri/components</code> pinned to {LATEST_VERSION}</li>
                  <li>✓ CSS imported from <code className="font-mono">dist/eri-components.css</code></li>
                  <li>✓ All used components have <code className="font-mono">compliant: true</code></li>
                  <li>✓ <code className="font-mono">knownViolations</code> contains no entries for <code className="font-mono">used:true</code> components (entries for <code className="font-mono">used:false</code> components must be removed — they are not violations)</li>
                  <li>✓ File committed at <code className="font-mono">client/public/bds-meta.json</code> and deployed</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
