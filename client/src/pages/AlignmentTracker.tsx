/**
 * ERI BDS Alignment Tracker
 *
 * Design: ERI Brand Design System — faithful to the BDS visual language.
 * - Background: #F9FAFB (off-white page) with #232323 dark header band
 * - Accent: #93E07D (Accent Lime) for status indicators and highlights
 * - Typography: Archivo (headings), system-ui (body/table)
 * - Table: dark #232323 header row, white body, ERI green for compliant cells
 * - Status indicators: dot + label, no Bootstrap pills
 * - Refresh button: Accent Lime, rounded-lg, no icon prefix
 *
 * No backend required — pure static fetch from each project's public URL.
 */

import { useEffect, useState, useCallback } from "react";
import { PROJECT_REGISTRY, getBdsMetaUrl, type ProjectRegistryEntry } from "@/data/projectRegistry";
import type { BdsMeta, ProjectFetchResult, ComponentName } from "@/data/bdsMetaTypes";

// ── Constants ────────────────────────────────────────────────────────────────

const COMPONENT_NAMES: ComponentName[] = [
  "EriAppHeader",
  "EriPageLayout",
  "EriHeroSection",
  "EriNavDrawer",
  "EriFooter",
];

const LATEST_VERSION = "v2.10.6";

// ── Design tokens (inline, matching ERI BDS) ─────────────────────────────────
const T = {
  dark:       "#232323",
  lime:       "#93E07D",
  green:      "#3ba559",
  offWhite:   "#F9FAFB",
  bodyText:   "#383838",
  mutedText:  "#6b7280",
  border:     "#e5e7eb",
  rowHover:   "#f9fafb",
};

// ── Helper: overall row status → dot colour + label ──────────────────────────

type RowStatus = "green" | "amber" | "red" | "unknown" | "loading" | "error";

function statusConfig(s: RowStatus) {
  switch (s) {
    case "green":   return { dot: T.lime,    label: "Compliant",            textColor: "#166534" };
    case "amber":   return { dot: "#f59e0b", label: "Needs update",         textColor: "#92400e" };
    case "red":     return { dot: "#ef4444", label: "Violations",           textColor: "#991b1b" };
    case "loading": return { dot: "#9ca3af", label: "Fetching…",            textColor: T.mutedText };
    case "error":   return { dot: "#ef4444", label: "Unreachable",          textColor: "#991b1b" };
    default:        return { dot: "#d1d5db", label: "No response",          textColor: T.mutedText };
  }
}

function StatusPill({ status }: { status: RowStatus }) {
  const { dot, label, textColor } = statusConfig(status);
  return (
    <span className="inline-flex items-center gap-1.5">
      <span
        className="inline-block rounded-full shrink-0"
        style={{ width: 7, height: 7, backgroundColor: dot, boxShadow: `0 0 0 2px ${dot}33` }}
      />
      <span className="text-xs font-medium" style={{ color: textColor }}>{label}</span>
    </span>
  );
}

// ── Component cell ────────────────────────────────────────────────────────────

function ComponentCell({ used, compliant }: { used?: boolean; compliant?: boolean }) {
  if (used === undefined) return <span style={{ color: "#d1d5db", fontSize: 12 }}>—</span>;
  if (!used) return <span style={{ color: T.mutedText, fontSize: 12 }}>Not used</span>;
  if (compliant) return (
    <span className="inline-flex items-center gap-1" style={{ color: T.green, fontSize: 12, fontWeight: 600 }}>
      <span>✓</span>
    </span>
  );
  return (
    <span className="inline-flex items-center gap-1" style={{ color: "#ef4444", fontSize: 12, fontWeight: 600 }}>
      <span>✗</span>
    </span>
  );
}

// ── Version badge ─────────────────────────────────────────────────────────────

function VersionBadge({ pin }: { pin?: string }) {
  if (!pin) return <span style={{ color: "#d1d5db", fontSize: 12 }}>—</span>;
  const isLatest = pin === LATEST_VERSION || pin === "main";
  const isBehind = pin !== LATEST_VERSION && pin !== "main";
  return (
    <span
      className="inline-flex items-center font-mono text-[11px] font-medium px-1.5 py-0.5 rounded"
      style={{
        backgroundColor: isLatest ? "#dcfce7" : isBehind ? "#fef9c3" : "#f3f4f6",
        color:           isLatest ? "#166534" : isBehind ? "#854d0e" : T.mutedText,
      }}
    >
      {pin}
    </span>
  );
}

// ── CSS import cell ───────────────────────────────────────────────────────────

function CssImportCell({ method }: { method?: string }) {
  if (!method) return <span style={{ color: "#d1d5db", fontSize: 12 }}>—</span>;
  if (method === "dist") return <span style={{ color: T.green, fontSize: 12, fontWeight: 600 }}>✓ dist/</span>;
  if (method === "source-workaround") return <span style={{ color: "#f59e0b", fontSize: 12, fontWeight: 600 }}>⚠ @source</span>;
  return <span style={{ color: "#ef4444", fontSize: 12, fontWeight: 600 }}>✗ None</span>;
}

// ── Violations cell ───────────────────────────────────────────────────────────

function ViolationsCell({ violations, error }: { violations?: string[]; error?: string }) {
  if (error) return <span style={{ color: "#ef4444", fontSize: 11 }}>Failed to fetch</span>;
  if (!violations) return <span style={{ color: "#d1d5db", fontSize: 12 }}>—</span>;
  if (violations.length === 0) return <span style={{ color: T.green, fontSize: 12 }}>None</span>;
  return (
    <ul className="space-y-0.5">
      {violations.map((v, i) => (
        <li key={i} className="font-mono text-[10px] px-1 rounded" style={{ color: "#ef4444", backgroundColor: "#fef2f2" }}>{v}</li>
      ))}
    </ul>
  );
}

// ── Summary stat card ─────────────────────────────────────────────────────────

function StatCard({ count, label, color }: { count: number; label: string; color: string }) {
  return (
    <div
      className="flex items-center gap-3 px-5 py-3 rounded-lg"
      style={{ backgroundColor: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}
    >
      <span className="text-2xl font-extrabold font-archivo leading-none" style={{ color }}>{count}</span>
      <span className="text-xs" style={{ color: "rgba(255,255,255,0.5)" }}>{label}</span>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function AlignmentTracker() {
  const [results, setResults] = useState<Record<string, ProjectFetchResult>>(() =>
    Object.fromEntries(
      PROJECT_REGISTRY.map((p) => [
        p.id,
        { projectId: p.id, url: p.url, status: "loading" as const },
      ])
    )
  );
  const [lastRefreshed, setLastRefreshed] = useState<Date | null>(null);

  const fetchAll = useCallback(async () => {
    setLastRefreshed(null);
    setResults(
      Object.fromEntries(
        PROJECT_REGISTRY.map((p) => [
          p.id,
          { projectId: p.id, url: p.url, status: "loading" as const },
        ])
      )
    );

    await Promise.all(
      PROJECT_REGISTRY.map(async (project) => {
        const metaUrl = getBdsMetaUrl(project.url);
        try {
          const res = await fetch(metaUrl, { cache: "no-store" });
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          const meta: BdsMeta = await res.json();
          setResults((prev) => ({
            ...prev,
            [project.id]: { projectId: project.id, url: project.url, status: "ok", meta },
          }));
        } catch (err) {
          setResults((prev) => ({
            ...prev,
            [project.id]: {
              projectId: project.id,
              url: project.url,
              status: "error",
              error: err instanceof Error ? err.message : "Unknown error",
            },
          }));
        }
      })
    );
    setLastRefreshed(new Date());
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const liveResults = PROJECT_REGISTRY.map((p) => results[p.id]).filter(Boolean);
  const greenCount  = liveResults.filter((r) => r.meta?.overallStatus === "green").length;
  const amberCount  = liveResults.filter((r) => r.meta?.overallStatus === "amber").length;
  const redCount    = liveResults.filter((r) => r.meta?.overallStatus === "red" || r.status === "error").length;

  return (
    <div className="min-h-screen" style={{ backgroundColor: T.offWhite }}>

      {/* ── Dark header band ─────────────────────────────────────────────────── */}
      <div style={{ backgroundColor: T.dark }}>
        <div className="max-w-7xl mx-auto px-6 py-10">

          {/* Eyebrow */}
          <p
            className="text-[11px] font-semibold uppercase tracking-widest mb-3 font-archivo"
            style={{ color: T.lime }}
          >
            BDS Alignment Tracker
          </p>

          {/* Title + description row */}
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <div>
              <h1 className="font-archivo text-3xl md:text-4xl font-extrabold text-white mb-3 leading-tight">
                Project Compliance
              </h1>
              <p className="text-sm leading-relaxed max-w-2xl" style={{ color: "rgba(255,255,255,0.55)" }}>
                Live status of BDS alignment across all ERI projects. Data is fetched directly from each
                project's published{" "}
                <code
                  className="font-mono text-[11px] px-1.5 py-0.5 rounded"
                  style={{ backgroundColor: "rgba(255,255,255,0.08)", color: T.lime }}
                >
                  bds-meta.json
                </code>{" "}
                file. Latest{" "}
                <code
                  className="font-mono text-[11px] px-1.5 py-0.5 rounded"
                  style={{ backgroundColor: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.7)" }}
                >
                  @eri/components
                </code>{" "}
                release:{" "}
                <span className="font-mono text-[11px] font-semibold" style={{ color: T.lime }}>
                  {LATEST_VERSION}
                </span>
              </p>
            </div>

            {/* Refresh button */}
            <button
              onClick={fetchAll}
              className="self-start lg:self-auto flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-opacity hover:opacity-90 shrink-0"
              style={{ backgroundColor: T.lime, color: T.dark }}
            >
              ↻ Refresh
            </button>
          </div>

          {/* Stat row */}
          <div className="flex flex-wrap gap-3 mt-7">
            <StatCard count={PROJECT_REGISTRY.length} label="Projects tracked" color="white" />
            <StatCard count={greenCount}              label="Compliant"         color={T.lime} />
            <StatCard count={amberCount}              label="Needs update"      color="#fbbf24" />
            <StatCard count={redCount}                label="Violations / unreachable" color="#f87171" />
          </div>

          {/* Last refreshed */}
          {lastRefreshed && (
            <p className="text-[11px] mt-4" style={{ color: "rgba(255,255,255,0.3)" }}>
              Last refreshed: {lastRefreshed.toLocaleTimeString()}
            </p>
          )}
        </div>
      </div>

      {/* ── Main content ─────────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">

        {/* Desktop table */}
        <div className="hidden lg:block overflow-x-auto rounded-xl shadow-sm" style={{ border: `1px solid ${T.border}` }}>
          <table className="w-full text-sm" style={{ backgroundColor: "white" }}>
            <thead>
              <tr style={{ backgroundColor: T.dark }}>
                <th className="text-left px-5 py-3.5 font-archivo text-[11px] font-semibold uppercase tracking-widest w-52" style={{ color: "rgba(255,255,255,0.5)" }}>
                  Project
                </th>
                <th className="text-left px-4 py-3.5 font-archivo text-[11px] font-semibold uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.5)" }}>
                  Status
                </th>
                <th className="text-left px-4 py-3.5 font-archivo text-[11px] font-semibold uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.5)" }}>
                  Package Pin
                </th>
                <th className="text-left px-4 py-3.5 font-archivo text-[11px] font-semibold uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.5)" }}>
                  CSS Import
                </th>
                {COMPONENT_NAMES.map((c) => (
                  <th
                    key={c}
                    className="text-left px-3 py-3.5 font-archivo text-[11px] font-semibold uppercase tracking-widest whitespace-nowrap"
                    style={{ color: "rgba(255,255,255,0.5)" }}
                  >
                    {c.replace("Eri", "")}
                  </th>
                ))}
                <th className="text-left px-4 py-3.5 font-archivo text-[11px] font-semibold uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.5)" }}>
                  Violations
                </th>
                <th className="text-left px-4 py-3.5 font-archivo text-[11px] font-semibold uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.5)" }}>
                  Updated
                </th>
              </tr>
            </thead>
            <tbody>
              {PROJECT_REGISTRY.map((project, idx) => {
                const result  = results[project.id];
                const meta    = result?.meta;
                const isLoading = result?.status === "loading";
                const isError   = result?.status === "error";
                const rowStatus: RowStatus = isLoading ? "loading" : isError ? "error" : (meta?.overallStatus as RowStatus) ?? "unknown";

                return (
                  <tr
                    key={project.id}
                    className="transition-colors"
                    style={{
                      borderTop: idx === 0 ? "none" : `1px solid ${T.border}`,
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = T.rowHover)}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "white")}
                  >
                    {/* Project name + URL */}
                    <td className="px-5 py-4">
                      <div className="font-semibold text-sm mb-0.5" style={{ color: T.dark }}>
                        {project.displayName}
                      </div>
                      <a
                        href={project.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[11px] transition-colors hover:underline"
                        style={{ color: T.mutedText }}
                      >
                        {project.url.replace("https://", "")} ↗
                      </a>
                      {project.status === "in-development" && (
                        <span
                          className="ml-1.5 text-[10px] font-semibold px-1.5 py-0.5 rounded"
                          style={{ backgroundColor: "#fef9c3", color: "#854d0e" }}
                        >
                          in dev
                        </span>
                      )}
                    </td>

                    {/* Status */}
                    <td className="px-4 py-4">
                      {isLoading && (
                        <span className="inline-flex items-center gap-1.5">
                          <span className="inline-block rounded-full animate-pulse" style={{ width: 7, height: 7, backgroundColor: "#d1d5db" }} />
                          <span className="text-xs" style={{ color: T.mutedText }}>Fetching…</span>
                        </span>
                      )}
                      {!isLoading && <StatusPill status={rowStatus} />}
                    </td>

                    {/* Package pin */}
                    <td className="px-4 py-4">
                      {isLoading && <span className="text-xs animate-pulse" style={{ color: "#d1d5db" }}>…</span>}
                      {isError   && <span style={{ color: "#d1d5db", fontSize: 12 }}>—</span>}
                      {meta      && <VersionBadge pin={meta.eriComponentsPin} />}
                    </td>

                    {/* CSS import */}
                    <td className="px-4 py-4">
                      {isLoading && <span className="text-xs animate-pulse" style={{ color: "#d1d5db" }}>…</span>}
                      {isError   && <span style={{ color: "#d1d5db", fontSize: 12 }}>—</span>}
                      {meta      && <CssImportCell method={meta.cssImportMethod} />}
                    </td>

                    {/* Component columns */}
                    {COMPONENT_NAMES.map((c) => (
                      <td key={c} className="px-3 py-4">
                        {isLoading && <span className="text-xs animate-pulse" style={{ color: "#e5e7eb" }}>…</span>}
                        {isError   && <span style={{ color: "#e5e7eb", fontSize: 12 }}>—</span>}
                        {meta      && <ComponentCell used={meta.components[c]?.used} compliant={meta.components[c]?.compliant} />}
                      </td>
                    ))}

                    {/* Violations */}
                    <td className="px-4 py-4 max-w-[200px]">
                      {isLoading && <span className="text-xs animate-pulse" style={{ color: "#e5e7eb" }}>…</span>}
                      {isError   && <ViolationsCell error={result.error} />}
                      {meta      && <ViolationsCell violations={meta.knownViolations} />}
                    </td>

                    {/* Updated */}
                    <td className="px-4 py-4">
                      {meta ? (
                        <div>
                          <div className="text-xs" style={{ color: T.bodyText }}>{meta.lastUpdated}</div>
                          <div className="text-[11px]" style={{ color: T.mutedText }}>{meta.updatedBy}</div>
                        </div>
                      ) : (
                        <span style={{ color: "#d1d5db", fontSize: 12 }}>—</span>
                      )}
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
            const rowStatus: RowStatus = isLoading ? "loading" : isError ? "error" : (meta?.overallStatus as RowStatus) ?? "unknown";

            return (
              <div
                key={project.id}
                className="rounded-xl p-4"
                style={{ backgroundColor: "white", border: `1px solid ${T.border}` }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="font-semibold text-sm mb-0.5" style={{ color: T.dark }}>
                      {project.displayName}
                    </div>
                    <a
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] hover:underline"
                      style={{ color: T.mutedText }}
                    >
                      {project.url.replace("https://", "")} ↗
                    </a>
                  </div>
                  <StatusPill status={rowStatus} />
                </div>

                {meta && (
                  <>
                    <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                      <div className="flex items-center gap-1.5">
                        <span style={{ color: T.mutedText }}>Package:</span>
                        <VersionBadge pin={meta.eriComponentsPin} />
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span style={{ color: T.mutedText }}>CSS:</span>
                        <CssImportCell method={meta.cssImportMethod} />
                      </div>
                    </div>
                    {meta.knownViolations.length > 0 && (
                      <div className="mt-2">
                        <p className="text-[11px] font-semibold mb-1" style={{ color: "#ef4444" }}>Violations:</p>
                        <div className="flex flex-wrap gap-1">
                          {meta.knownViolations.map((v, i) => (
                            <span key={i} className="font-mono text-[10px] px-1 rounded" style={{ backgroundColor: "#fef2f2", color: "#ef4444" }}>{v}</span>
                          ))}
                        </div>
                      </div>
                    )}
                    <p className="text-[11px] mt-2" style={{ color: T.mutedText }}>
                      Updated {meta.lastUpdated} by {meta.updatedBy}
                    </p>
                  </>
                )}
                {isError && (
                  <p className="text-xs mt-1" style={{ color: "#ef4444" }}>
                    Could not fetch bds-meta.json — project may not have the file yet.
                  </p>
                )}
              </div>
            );
          })}
        </div>

        {/* ── How this tracker works ─────────────────────────────────────────── */}
        <div
          className="mt-8 rounded-xl p-6"
          style={{ backgroundColor: "white", border: `1px solid ${T.border}` }}
        >
          <h2 className="font-archivo font-bold text-lg mb-5" style={{ color: T.dark }}>
            How this tracker works
          </h2>
          <div className="grid md:grid-cols-2 gap-8 text-sm" style={{ color: T.bodyText }}>

            {/* Left: for Manus agents */}
            <div>
              <h3 className="font-semibold mb-2" style={{ color: T.dark }}>For Manus AI agents</h3>
              <p className="leading-relaxed mb-4" style={{ color: T.mutedText }}>
                When working on any ERI project, update{" "}
                <code className="font-mono text-[11px] px-1 rounded" style={{ backgroundColor: "#f3f4f6" }}>
                  client/public/bds-meta.json
                </code>{" "}
                as part of your task whenever you upgrade{" "}
                <code className="font-mono text-[11px] px-1 rounded" style={{ backgroundColor: "#f3f4f6" }}>
                  @eri/components
                </code>
                , change the CSS import method, add or fix a component, or resolve a violation.
              </p>
              <div
                className="rounded-lg p-4 font-mono text-xs overflow-x-auto"
                style={{ backgroundColor: T.dark, color: T.lime }}
              >
{`{
  "schemaVersion": "1.0",
  "project": "PSM",
  "eriComponentsPin": "${LATEST_VERSION}",
  "cssImportMethod": "dist",
  "overallStatus": "green",
  "lastUpdated": "2026-04-19",
  "updatedBy": "Manus"
}`}
              </div>
            </div>

            {/* Right: status rules */}
            <div>
              <h3 className="font-semibold mb-3" style={{ color: T.dark }}>Status rules</h3>
              <div className="space-y-3">
                {(["green","amber","red","error"] as RowStatus[]).map((s) => {
                  const { dot, label } = statusConfig(s);
                  const desc: Record<string, string> = {
                    green: `All components compliant, CSS uses dist/, no violations.`,
                    amber: `CSS uses @source workaround, or package pin is 2+ minor versions behind ${LATEST_VERSION}.`,
                    red:   `Any component has a known violation, or knownViolations is non-empty.`,
                    error: `Project has not yet published a bds-meta.json file, or the URL is unreachable.`,
                  };
                  return (
                    <div key={s} className="flex items-start gap-3">
                      <span
                        className="inline-block rounded-full mt-1 shrink-0"
                        style={{ width: 8, height: 8, backgroundColor: dot, boxShadow: `0 0 0 2px ${dot}33` }}
                      />
                      <div>
                        <span className="font-semibold text-xs" style={{ color: T.dark }}>{label} — </span>
                        <span className="text-xs" style={{ color: T.mutedText }}>{desc[s]}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div
                className="mt-5 p-4 rounded-lg"
                style={{ backgroundColor: T.offWhite, border: `1px solid ${T.border}` }}
              >
                <p className="text-[11px]" style={{ color: T.mutedText }}>
                  <strong style={{ color: T.dark }}>File location in each project:</strong>
                  <br />
                  <code className="font-mono">client/public/bds-meta.json</code>
                  <br />
                  Served at:{" "}
                  <code className="font-mono">https://&#123;domain&#125;/bds-meta.json</code>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
