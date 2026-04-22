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

const LATEST_VERSION = "v2.11.1";

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

/** Compute a checklist compliance score from the self-reported fields in bds-meta.json */
function checklistScore(meta: BdsMeta | undefined): { score: number; total: number } | null {
  if (!meta) return null;
  const { systemOps, brand, layout } = meta;
  // Only compute if at least one field group is present
  if (!systemOps && !brand && !layout) return null;
  const fields = [
    systemOps?.projectContextExists,
    systemOps?.manusPlatformInstructionsRead,
    brand?.hexTokensOnly,
    brand?.archivoHeadings,
    brand?.openSansBody,
    brand?.bodyTextHex383838,
    brand?.ctaAccentLime,
    layout?.eriPageLayoutInAppTsx,
    layout?.showCtaExplicit,
    layout?.sourcePropsPresent,
    layout?.noStaleComponentNames,
  ];
  const reported = fields.filter((f) => f !== undefined && f !== null);
  const passing  = reported.filter((f) => f === true);
  return { score: passing.length, total: reported.length };
}

function ChecklistScoreCell({ meta, isLoading, isError }: { meta?: BdsMeta; isLoading: boolean; isError: boolean }) {
  if (isLoading) return <span className="text-xs animate-pulse" style={{ color: "#d1d5db" }}>…</span>;
  if (isError)   return <Dash />;
  const result = checklistScore(meta);
  if (!result)   return <span className="text-[11px]" style={{ color: T.muted }}>—</span>;
  const { score, total } = result;
  const pct = total > 0 ? score / total : 0;
  const bg  = pct === 1 ? "#dcfce7" : pct >= 0.7 ? "#fef9c3" : "#fee2e2";
  const fg  = pct === 1 ? "#166534" : pct >= 0.7 ? "#854d0e" : "#991b1b";
  return (
    <span
      className="inline-flex items-center font-mono text-[11px] font-semibold px-1.5 py-0.5 rounded"
      style={{ backgroundColor: bg, color: fg }}
      title={`${score} of ${total} checklist items passing`}
    >
      {score}/{total}
    </span>
  );
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
                  { label: "Checklist",    w: "" },
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

                    {/* Checklist score */}
                    <td className="px-4 py-4">
                      <ChecklistScoreCell meta={meta} isLoading={isLoading} isError={isError} />
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
`{\n  "schemaVersion": "1.0",\n  "project": "your-project-id",\n  "displayName": "Your Project Name",\n  "url": "https://your-project.exponentialroadmap.org",\n  "eriComponentsPin": "${LATEST_VERSION}",\n  "cssImportMethod": "dist",\n  "components": {\n    "EriAppHeader":       { "used": true,  "compliant": true  },\n    "EriPageLayout":      { "used": true,  "compliant": true  },\n    "EriHeroSection":     { "used": true,  "compliant": true  },\n    "EriAppFooter":       { "used": true,  "compliant": true  },\n    "EriStatusBadge":     { "used": true,  "compliant": true  },\n    "EriContactUsButton": { "used": true,  "compliant": true  }\n  },\n  "systemOps": {\n    "projectContextExists":          false,\n    "manusPlatformInstructionsRead": false\n  },\n  "brand": {\n    "hexTokensOnly":     false,\n    "archivoHeadings":   false,\n    "openSansBody":      false,\n    "bodyTextHex383838": false,\n    "ctaAccentLime":     false\n  },\n  "layout": {\n    "eriPageLayoutInAppTsx": false,\n    "showCtaExplicit":       false,\n    "sourcePropsPresent":    false,\n    "noStaleComponentNames": false\n  },\n  "knownViolations": [],\n  "overallStatus": "red",\n  "lastUpdated": "${today}",\n  "updatedBy": "Manus"\n}`
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
  "displayName": "Your Project Name",
  "url": "https://your-project.exponentialroadmap.org",
  "eriComponentsPin": "${LATEST_VERSION}",
  "cssImportMethod": "dist",
  "components": {
    "EriAppHeader":       { "used": true,  "compliant": true  },
    "EriPageLayout":      { "used": true,  "compliant": true  },
    "EriHeroSection":     { "used": true,  "compliant": true  },
    "EriAppFooter":       { "used": true,  "compliant": true  },
    "EriStatusBadge":     { "used": true,  "compliant": true  },
    "EriContactUsButton": { "used": true,  "compliant": true  }
  },
  "systemOps": {
    "projectContextExists":          false,
    "manusPlatformInstructionsRead": false
  },
  "brand": {
    "hexTokensOnly":     false,
    "archivoHeadings":   false,
    "openSansBody":      false,
    "bodyTextHex383838": false,
    "ctaAccentLime":     false
  },
  "layout": {
    "eriPageLayoutInAppTsx": false,
    "showCtaExplicit":       false,
    "sourcePropsPresent":    false,
    "noStaleComponentNames": false
  },
  "knownViolations": [],
  "overallStatus": "red",
  "lastUpdated": "2026-04-22",
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

        {/* ── System Operations ──────────────────────────────────────────────── */}
        <div className="mt-8 rounded-xl p-6 bg-white" style={{ border: `1px solid ${T.border}` }}>
          <div className="flex items-center gap-2 mb-4">
            <span className="inline-flex items-center justify-center rounded-full text-xs font-bold px-2 py-0.5" style={{ backgroundColor: T.dark, color: T.lime }}>SYS OPS</span>
            <h2 className="font-archivo font-bold text-lg" style={{ color: T.dark }}>System Operations — AI context continuity</h2>
          </div>

          {/* What */}
          <div className="mb-6">
            <p className="text-[11px] font-semibold uppercase tracking-widest mb-2" style={{ color: T.lime }}>WHAT</p>
            <p className="text-sm mb-3" style={{ color: T.bodyText }}>
              Every ERI Manus project must follow three mandatory steps at the start of every AI task session. Together they form the <strong>System Operations</strong> pattern — a lightweight protocol that prevents recurring errors caused by context compaction and sandbox resets.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {[
                {
                  step: "Step 0",
                  title: "Read Manus project instructions",
                  body: "Every ERI Manus project has project-level instructions set in the Manus platform. These appear in the project_instructions tag at the top of each conversation. Read them in full before doing anything else.",
                  color: T.lime,
                },
                {
                  step: "Step 1",
                  title: "Read or create PROJECT-CONTEXT.md",
                  body: "A PROJECT-CONTEXT.md file at the project root is the persistent memory that survives context compaction. If it exists, read it first. If not, create it — seed it with canonical values from the eri-bds-reference skill. Update it after every task.",
                  color: T.lime,
                },
                {
                  step: "Step 2",
                  title: "Check bds-meta.json exists",
                  body: "Every ERI project must publish client/public/bds-meta.json. This file is not part of the @eri/components package — it is created in each consuming project. If missing, create it before closing the task.",
                  color: T.lime,
                },
              ].map(({ step, title, body, color }) => (
                <div key={step} className="rounded-lg p-4" style={{ backgroundColor: T.offWhite, border: `1px solid ${T.border}` }}>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] font-bold font-mono px-1.5 py-0.5 rounded" style={{ backgroundColor: T.dark, color }}>{step}</span>
                    <span className="text-xs font-semibold" style={{ color: T.dark }}>{title}</span>
                  </div>
                  <p className="text-[11px] leading-relaxed" style={{ color: T.muted }}>{body}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Why */}
          <div className="mb-6">
            <p className="text-[11px] font-semibold uppercase tracking-widest mb-2" style={{ color: T.lime }}>WHY</p>
            <p className="text-sm mb-3" style={{ color: T.bodyText }}>
              AI agents operating in long-running projects suffer from two failure modes: <strong>context compaction</strong> (earlier conversation history is summarised and key details are lost) and <strong>sandbox resets</strong> (the agent's working memory is wiped between sessions). Without a structured recovery mechanism, the agent reverts to defaults — re-introducing errors that were previously fixed, using stale component names, or missing required files.
            </p>
            <p className="text-sm" style={{ color: T.bodyText }}>
              The System Operations pattern solves this by externalising memory into two durable artefacts: the Manus platform project instructions (set once by the project owner, always present) and the <code className="font-mono text-[11px] px-1 rounded" style={{ backgroundColor: "#f3f4f6" }}>PROJECT-CONTEXT.md</code> file (updated after every task, read before every task). Together they give the agent a reliable starting point regardless of what was lost from session memory.
            </p>
          </div>

          {/* How */}
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-widest mb-2" style={{ color: T.lime }}>HOW — Set up a new ERI project</p>
            <ol className="text-sm space-y-3" style={{ color: T.bodyText }}>
              <li className="flex gap-3">
                <span className="shrink-0 font-mono text-[11px] font-bold px-1.5 py-0.5 rounded self-start mt-0.5" style={{ backgroundColor: T.dark, color: T.lime }}>1</span>
                <span><strong>Set Manus project instructions.</strong> In the Manus platform, open the project settings and add instructions that include: the ERI development workflow (Research → Design → Plan → Implement → Test → Iterate), the active skills to apply (<code className="font-mono text-[11px] px-1 rounded" style={{ backgroundColor: "#f3f4f6" }}>eri-bds-reference</code>, <code className="font-mono text-[11px] px-1 rounded" style={{ backgroundColor: "#f3f4f6" }}>exponential-human-ai-collaboration</code>), and any project-specific constraints.</span>
              </li>
              <li className="flex gap-3">
                <span className="shrink-0 font-mono text-[11px] font-bold px-1.5 py-0.5 rounded self-start mt-0.5" style={{ backgroundColor: T.dark, color: T.lime }}>2</span>
                <span><strong>Create <code className="font-mono text-[11px] px-1 rounded" style={{ backgroundColor: "#f3f4f6" }}>PROJECT-CONTEXT.md</code> at the project root.</strong> Seed it with: current <code className="font-mono text-[11px] px-1 rounded" style={{ backgroundColor: "#f3f4f6" }}>@eri/components</code> version pin, colour tokens, known errors, pending work, and any canonical decisions made for this project. Commit it to the repository.</span>
              </li>
              <li className="flex gap-3">
                <span className="shrink-0 font-mono text-[11px] font-bold px-1.5 py-0.5 rounded self-start mt-0.5" style={{ backgroundColor: T.dark, color: T.lime }}>3</span>
                <span><strong>Create <code className="font-mono text-[11px] px-1 rounded" style={{ backgroundColor: "#f3f4f6" }}>client/public/bds-meta.json</code>.</strong> Copy the canonical template from the section above. Fill in the project-specific fields and commit it so the tracker can fetch it.</span>
              </li>
            </ol>

            {/* PROJECT-CONTEXT.md seed template */}
            <div className="mt-6 rounded-lg overflow-hidden" style={{ border: `1px solid ${T.border}` }}>
              <div className="flex items-center justify-between px-4 py-2.5" style={{ backgroundColor: T.dark }}>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold font-mono px-1.5 py-0.5 rounded" style={{ backgroundColor: T.lime, color: T.dark }}>SEED TEMPLATE</span>
                  <span className="text-xs font-semibold font-mono" style={{ color: T.lime }}>PROJECT-CONTEXT.md</span>
                </div>
                <button
                  onClick={() => {
                    const today = new Date().toISOString().slice(0, 10);
                    navigator.clipboard.writeText(
`# [Project Name] — Project Context

**READ THIS FILE FIRST.** Before taking any action on this project, read this file in full.
It is the single source of truth for all project decisions, known errors, and canonical values.
Do not rely on memory of previous sessions — context compaction removes that history.

---

## What this project is

[Brief description of the project purpose and outputs.]

---

## Canonical colour values

| Token | Hex | Usage |
|---|---|---|
| Primary Green | \`#3ba559\` | Links, active states, text accents — NOT for filled buttons |
| Primary Dark | \`#232323\` | Headings (H1–H4), footer background, dark section backgrounds |
| Dark Gray | \`#383838\` | Standard body paragraph text on white/light backgrounds |
| Neutral Gray | \`#6b7280\` | Secondary text, borders, disabled states |
| Off White | \`#F9FAFB\` | Page background, card background |
| Accent Lime | \`#93E07D\` | All filled CTA buttons; heading accent words on dark backgrounds |

---

## Standard components — canonical names and current version

Package: \`@eri/components\` — current pin: **${LATEST_VERSION}**

| Component | Purpose |
|---|---|
| \`EriAppHeader\` | 64px fixed header — rendered once via EriPageLayout |
| \`EriPageLayout\` | Full-page layout wrapper — use in App.tsx only |
| \`EriHeroSection\` | Full-viewport hero section |
| \`EriAppFooter\` | Two-zone dark footer — rendered once via EriPageLayout |
| \`EriStatusBadge\` | Status pill badge (ALPHA / BETA / PREVIEW / LIVE) |
| \`EriContactUsButton\` | Accent Lime CTA linking to the shared contact service |

---

## Known pending work (as of ${today})

- [ ] [Add initial tasks here]

---

## Known errors that have been corrected — do not reintroduce

[Document any errors found and fixed, so they are not re-introduced in future sessions.]

---

## bds-meta.json status

File: \`client/public/bds-meta.json\` — [exists / missing]
Last updated: ${today}
Overall status: [green / amber / red]
`
                    );
                  }}
                  className="text-[11px] px-3 py-1 rounded font-semibold transition-opacity hover:opacity-80"
                  style={{ backgroundColor: T.lime, color: T.dark }}
                >
                  Copy template
                </button>
              </div>
              <div className="p-4 font-mono text-[11px] leading-relaxed overflow-x-auto" style={{ backgroundColor: "#1a1a1a", color: "#a3e635" }}>
                <div style={{ color: T.lime, fontWeight: 700 }}># [Project Name] — Project Context</div>
                <div className="mt-1" style={{ color: "#9ca3af" }}>**READ THIS FILE FIRST.** Before taking any action on this project, read this file in full.</div>
                <div style={{ color: "#9ca3af" }}>It is the single source of truth for all project decisions, known errors, and canonical values.</div>
                <div className="mt-2" style={{ color: T.lime }}>## Canonical colour values</div>
                <div style={{ color: "#9ca3af" }}>| Primary Dark | #232323 | Headings, footer background |</div>
                <div style={{ color: "#9ca3af" }}>| Dark Gray    | #383838 | Body text on white/light bg  |</div>
                <div style={{ color: "#9ca3af" }}>| Accent Lime  | #93E07D | All filled CTA buttons       |</div>
                <div className="mt-2" style={{ color: T.lime }}>## Standard components — pin: {LATEST_VERSION}</div>
                <div style={{ color: "#9ca3af" }}>EriAppHeader · EriPageLayout · EriHeroSection</div>
                <div style={{ color: "#9ca3af" }}>EriAppFooter · EriStatusBadge · EriContactUsButton</div>
                <div className="mt-2" style={{ color: T.lime }}>## Known pending work</div>
                <div style={{ color: "#9ca3af" }}>- [ ] [Add initial tasks here]</div>
                <div className="mt-2" style={{ color: T.lime }}>## Known errors that have been corrected</div>
                <div style={{ color: "#9ca3af" }}>[Document errors fixed so they are not re-introduced]</div>
              </div>
            </div>

            <ol className="text-sm space-y-3 mt-4" style={{ color: T.bodyText }}>
              <li className="flex gap-3">
                <span className="shrink-0 font-mono text-[11px] font-bold px-1.5 py-0.5 rounded self-start mt-0.5" style={{ backgroundColor: T.dark, color: T.lime }}>4</span>
                <span><strong>Maintain both files.</strong> After every AI task session, the agent updates <code className="font-mono text-[11px] px-1 rounded" style={{ backgroundColor: "#f3f4f6" }}>PROJECT-CONTEXT.md</code> with new decisions and corrected errors. After every component upgrade or compliance change, the agent updates <code className="font-mono text-[11px] px-1 rounded" style={{ backgroundColor: "#f3f4f6" }}>bds-meta.json</code>.</span>
              </li>
            </ol>
          </div>
        </div>

      {/* ================================================================ */}
      {/* PROJECT ALIGNMENT CHECKLIST */}
      {/* ================================================================ */}
      <div className="mt-16 rounded-xl overflow-hidden" style={{ border: `1px solid ${T.border}` }}>
        {/* Header */}
        <div className="px-6 py-4 flex items-center gap-3" style={{ backgroundColor: T.dark }}>
          <span className="font-mono text-[11px] font-bold px-2 py-0.5 rounded tracking-widest uppercase" style={{ backgroundColor: T.lime, color: T.dark }}>CHECKLIST</span>
          <h2 className="font-archivo text-lg font-extrabold" style={{ color: '#ffffff' }}>Project Alignment Checklist</h2>
        </div>
        <div className="px-6 py-5" style={{ backgroundColor: '#ffffff' }}>
          <p className="text-sm mb-6" style={{ color: T.bodyText }}>
            Run this checklist before saving a checkpoint or marking any task complete on an ERI project. Each item maps to a specific section of the <a href="/" className="underline" style={{ color: '#3ba559' }}>BDS reference</a> or the <a href="https://github.com/Exponential-Roadmap-Initiative/eri-brand-design-system" className="underline" style={{ color: '#3ba559' }}>eri-bds-reference skill</a>. If any item fails, fix it before closing.
          </p>

          {/* S — System Operations */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <span className="font-mono text-[11px] font-bold px-2 py-0.5 rounded" style={{ backgroundColor: '#fef3c7', color: '#92400e' }}>S</span>
              <h3 className="font-archivo text-base font-extrabold" style={{ color: T.dark }}>System Operations</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr style={{ backgroundColor: '#f9fafb' }}>
                    <th className="text-left px-3 py-2 font-semibold text-xs uppercase tracking-wide" style={{ color: T.muted, borderBottom: `1px solid ${T.border}` }}>#</th>
                    <th className="text-left px-3 py-2 font-semibold text-xs uppercase tracking-wide" style={{ color: T.muted, borderBottom: `1px solid ${T.border}` }}>Check</th>
                    <th className="text-left px-3 py-2 font-semibold text-xs uppercase tracking-wide" style={{ color: T.muted, borderBottom: `1px solid ${T.border}` }}>Pass condition</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { id: 'S1', check: 'PROJECT-CONTEXT.md exists at project root and was read at task start', pass: 'File exists; you read it before taking any action' },
                    { id: 'S2', check: 'client/public/bds-meta.json exists', pass: 'File is present and served at https://{domain}/bds-meta.json' },
                    { id: 'S3', check: 'bds-meta.json has schemaVersion: "1.0" and overallStatus reflects actual state', pass: 'Field present; status is green, amber, or red per the overallStatus rules' },
                  ].map((row, i) => (
                    <tr key={row.id} style={{ backgroundColor: i % 2 === 0 ? '#ffffff' : '#f9fafb', borderBottom: `1px solid ${T.border}` }}>
                      <td className="px-3 py-2 font-mono text-[11px] font-bold" style={{ color: T.lime, backgroundColor: T.dark }}>{row.id}</td>
                      <td className="px-3 py-2" style={{ color: T.bodyText }}>{row.check}</td>
                      <td className="px-3 py-2 text-xs" style={{ color: T.muted }}>{row.pass}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* B — Brand */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <span className="font-mono text-[11px] font-bold px-2 py-0.5 rounded" style={{ backgroundColor: '#dbeafe', color: '#1e40af' }}>B</span>
              <h3 className="font-archivo text-base font-extrabold" style={{ color: T.dark }}>Brand</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr style={{ backgroundColor: '#f9fafb' }}>
                    <th className="text-left px-3 py-2 font-semibold text-xs uppercase tracking-wide" style={{ color: T.muted, borderBottom: `1px solid ${T.border}` }}>#</th>
                    <th className="text-left px-3 py-2 font-semibold text-xs uppercase tracking-wide" style={{ color: T.muted, borderBottom: `1px solid ${T.border}` }}>Check</th>
                    <th className="text-left px-3 py-2 font-semibold text-xs uppercase tracking-wide" style={{ color: T.muted, borderBottom: `1px solid ${T.border}` }}>Pass condition</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { id: 'B1', check: 'All colour values use exact hex tokens', pass: 'No Tailwind colour names (text-green-500, bg-gray-900) for brand colours — only exact hex values' },
                    { id: 'B2', check: 'Heading font is Archivo, loaded via Google Fonts CDN', pass: 'family=Archivo in the <link> tag in index.html; no local font files' },
                    { id: 'B3', check: 'Body font is Open Sans, loaded via Google Fonts CDN', pass: 'family=Open+Sans in the <link> tag in index.html' },
                    { id: 'B4', check: 'Body text colour is #383838, not #232323', pass: '#383838 for paragraph text on white/light backgrounds; #232323 reserved for headings and footer background only' },
                    { id: 'B5', check: 'Filled CTA buttons use #93E07D (Accent Lime) and rounded-lg shape', pass: 'No rounded-full on CTAs; no bg-[#3ba559] for filled buttons' },
                  ].map((row, i) => (
                    <tr key={row.id} style={{ backgroundColor: i % 2 === 0 ? '#ffffff' : '#f9fafb', borderBottom: `1px solid ${T.border}` }}>
                      <td className="px-3 py-2 font-mono text-[11px] font-bold" style={{ color: '#1e40af', backgroundColor: '#dbeafe' }}>{row.id}</td>
                      <td className="px-3 py-2" style={{ color: T.bodyText }}>{row.check}</td>
                      <td className="px-3 py-2 text-xs" style={{ color: T.muted }}>{row.pass}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* C — Components */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <span className="font-mono text-[11px] font-bold px-2 py-0.5 rounded" style={{ backgroundColor: '#dcfce7', color: '#166534' }}>C</span>
              <h3 className="font-archivo text-base font-extrabold" style={{ color: T.dark }}>Components</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr style={{ backgroundColor: '#f9fafb' }}>
                    <th className="text-left px-3 py-2 font-semibold text-xs uppercase tracking-wide" style={{ color: T.muted, borderBottom: `1px solid ${T.border}` }}>#</th>
                    <th className="text-left px-3 py-2 font-semibold text-xs uppercase tracking-wide" style={{ color: T.muted, borderBottom: `1px solid ${T.border}` }}>Check</th>
                    <th className="text-left px-3 py-2 font-semibold text-xs uppercase tracking-wide" style={{ color: T.muted, borderBottom: `1px solid ${T.border}` }}>Pass condition</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { id: 'C1', check: '@eri/components is installed and pinned to a stable version', pass: 'pnpm list @eri/components shows a version; bds-meta.json eriComponentsPin matches' },
                    { id: 'C2', check: '@import "@eri/components/dist/eri-components.css" is at the top of client/src/index.css', pass: 'Line present; no @source workaround unless pinned to pre-v2.9.1' },
                    { id: 'C3', check: 'EriPageLayout wraps all public pages in App.tsx', pass: 'Single <EriPageLayout> in App.tsx; no header/footer markup in individual page files' },
                    { id: 'C4', check: 'EriAppHeader and EriAppFooter are NOT imported directly in page files', pass: 'grep -r "EriAppHeader|EriAppFooter" client/src/pages/ returns no results' },
                    { id: 'C5', check: 'showCTA={true} is passed explicitly on EriPageLayout', pass: 'The prop is written out — do not rely on the default' },
                    { id: 'C6', check: 'source, sourceLabel, and returnUrl are all passed when showCTA={true}', pass: 'All three props present; values match the Registered Source IDs table exactly' },
                    { id: 'C7', check: 'No stale component names (EriNavDrawer, EriFooter) anywhere in the codebase', pass: 'grep -r "EriNavDrawer|EriFooter" client/src/ returns no results' },
                  ].map((row, i) => (
                    <tr key={row.id} style={{ backgroundColor: i % 2 === 0 ? '#ffffff' : '#f9fafb', borderBottom: `1px solid ${T.border}` }}>
                      <td className="px-3 py-2 font-mono text-[11px] font-bold" style={{ color: '#166534', backgroundColor: '#dcfce7' }}>{row.id}</td>
                      <td className="px-3 py-2" style={{ color: T.bodyText }}>{row.check}</td>
                      <td className="px-3 py-2 text-xs" style={{ color: T.muted }}>{row.pass}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Self-reporting note */}
          <div className="mb-6 rounded-lg p-4" style={{ backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0' }}>
            <p className="text-xs font-semibold mb-1" style={{ color: '#166534' }}>Self-reporting in bds-meta.json</p>
            <p className="text-[11px]" style={{ color: '#166534' }}>
              After running this checklist, update the <code className="font-mono" style={{ backgroundColor: '#dcfce7', padding: '0 2px', borderRadius: 2 }}>systemOps</code>, <code className="font-mono" style={{ backgroundColor: '#dcfce7', padding: '0 2px', borderRadius: 2 }}>brand</code>, and <code className="font-mono" style={{ backgroundColor: '#dcfce7', padding: '0 2px', borderRadius: 2 }}>layout</code> fields in <code className="font-mono" style={{ backgroundColor: '#dcfce7', padding: '0 2px', borderRadius: 2 }}>client/public/bds-meta.json</code> to reflect the results. Set each field to <code className="font-mono" style={{ backgroundColor: '#dcfce7', padding: '0 2px', borderRadius: 2 }}>true</code> if the check passes, <code className="font-mono" style={{ backgroundColor: '#dcfce7', padding: '0 2px', borderRadius: 2 }}>false</code> if it fails (and add an entry to <code className="font-mono" style={{ backgroundColor: '#dcfce7', padding: '0 2px', borderRadius: 2 }}>knownViolations</code>), or omit the field if not applicable. The tracker will display a compliance score badge (<span className="font-mono font-bold">9/11</span>) in the Checklist column, computed from these self-reported values.
            </p>
          </div>

          {/* Quick shell commands */}
          <div className="rounded-lg p-4" style={{ backgroundColor: T.dark }}>
            <p className="text-[11px] font-semibold uppercase tracking-widest mb-3" style={{ color: T.lime }}>QUICK VERIFICATION COMMANDS</p>
            <p className="text-xs mb-3" style={{ color: '#9ca3af' }}>Run these in the project root to verify C4 and C7 in seconds. Both should return no output.</p>
            <pre className="text-xs leading-relaxed" style={{ color: '#e5e7eb', fontFamily: 'monospace' }}>{`# C4 — confirm header/footer not imported in page files
grep -r "EriAppHeader\\|EriAppFooter" client/src/pages/

# C7 — confirm no stale component names
grep -r "EriNavDrawer\\|EriFooter" client/src/`}</pre>
          </div>
        </div>
      </div>

      </div>
    </div>
  );
}
