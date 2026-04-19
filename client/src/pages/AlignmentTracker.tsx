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
  "EriNavDrawer",
  "EriFooter",
];

const LATEST_VERSION = "v2.10.6";

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

function ViolationsCell({ violations, error }: { violations?: string[]; error?: string }) {
  if (error) return <span style={{ color: "#ef4444", fontSize: 11 }}>Failed to fetch</span>;
  if (!violations) return <Dash />;
  if (violations.length === 0) return <span style={{ color: T.green, fontSize: 12 }}>None</span>;
  return (
    <ul className="space-y-0.5">
      {violations.map((v, i) => (
        <li key={i} className="font-mono text-[10px] px-1 rounded" style={{ color: "#ef4444", backgroundColor: "#fef2f2" }}>{v}</li>
      ))}
    </ul>
  );
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
          const meta: BdsMeta = await res.json();
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
  const greenCount = live.filter((r) => r.meta?.overallStatus === "green").length;
  const amberCount = live.filter((r) => r.meta?.overallStatus === "amber").length;
  const redCount   = live.filter((r) => r.meta?.overallStatus === "red" || r.status === "error").length;

  return (
    // pt-[108px] clears the fixed SiteHeader (68px) + TabNav (40px)
    <div className="min-h-screen pt-[108px]" style={{ backgroundColor: T.offWhite }}>

      {/* ── Dark header band — full viewport width ───────────────────────── */}
      <div style={{ backgroundColor: T.dark }}>
        <div className="max-w-7xl mx-auto px-6 py-10">

          {/* Eyebrow */}
          <p className="font-archivo text-[11px] font-semibold uppercase tracking-widest mb-3" style={{ color: T.lime }}>
            BDS Alignment Tracker
          </p>

          {/* Title + refresh */}
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-4">
            <div>
              <h1 className="font-archivo text-3xl md:text-4xl font-extrabold text-white leading-tight mb-2">
                Project Compliance
              </h1>
              <p className="text-sm leading-relaxed max-w-2xl" style={{ color: "rgba(255,255,255,0.5)" }}>
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

          {/* Stat cards */}
          <div className="flex flex-wrap gap-3 mt-6">
            {[
              { count: PROJECT_REGISTRY.length, label: "Projects tracked", color: "white" },
              { count: greenCount,              label: "Compliant",         color: T.lime },
              { count: amberCount,              label: "Needs update",      color: "#fbbf24" },
              { count: redCount,                label: "Violations / unreachable", color: "#f87171" },
            ].map(({ count, label, color }) => (
              <div
                key={label}
                className="flex items-center gap-3 px-5 py-3 rounded-lg"
                style={{ backgroundColor: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}
              >
                <span className="font-archivo text-2xl font-extrabold leading-none" style={{ color }}>{count}</span>
                <span className="text-xs" style={{ color: "rgba(255,255,255,0.45)" }}>{label}</span>
              </div>
            ))}
          </div>

          {lastRefreshed && (
            <p className="text-[11px] mt-4" style={{ color: "rgba(255,255,255,0.25)" }}>
              Last refreshed: {lastRefreshed.toLocaleTimeString()}
            </p>
          )}
        </div>
      </div>

      {/* ── Table ────────────────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">

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
                const rowStatus: RowStatus = isLoading ? "loading" : isError ? "error" : (meta?.overallStatus as RowStatus) ?? "unknown";

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
                          : <ComponentCell used={meta?.components[c]?.used} compliant={meta?.components[c]?.compliant} />}
                      </td>
                    ))}

                    {/* Violations */}
                    <td className="px-4 py-4 max-w-[200px]">
                      {isLoading ? <span className="text-xs animate-pulse" style={{ color: "#e5e7eb" }}>…</span>
                        : isError ? <ViolationsCell error={result.error} />
                        : <ViolationsCell violations={meta?.knownViolations} />}
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
            const rowStatus: RowStatus = isLoading ? "loading" : isError ? "error" : (meta?.overallStatus as RowStatus) ?? "unknown";

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
                    {meta.knownViolations.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {meta.knownViolations.map((v, i) => (
                          <span key={i} className="font-mono text-[10px] px-1 rounded" style={{ backgroundColor: "#fef2f2", color: "#ef4444" }}>{v}</span>
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
          <h2 className="font-archivo font-bold text-lg mb-5" style={{ color: T.dark }}>How this tracker works</h2>
          <div className="grid md:grid-cols-2 gap-8 text-sm">

            <div>
              <h3 className="font-semibold mb-2" style={{ color: T.dark }}>For Manus AI agents</h3>
              <p className="leading-relaxed mb-4" style={{ color: T.muted }}>
                When working on any ERI project, update{" "}
                <code className="font-mono text-[11px] px-1 rounded" style={{ backgroundColor: "#f3f4f6" }}>client/public/bds-meta.json</code>{" "}
                whenever you upgrade <code className="font-mono text-[11px] px-1 rounded" style={{ backgroundColor: "#f3f4f6" }}>@eri/components</code>,
                change the CSS import method, add or fix a component, or resolve a violation.
              </p>
              <div className="rounded-lg p-4 font-mono text-xs overflow-x-auto" style={{ backgroundColor: T.dark, color: T.lime }}>
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

            <div>
              <h3 className="font-semibold mb-3" style={{ color: T.dark }}>Status rules</h3>
              <div className="space-y-3">
                {(["green","amber","red","error"] as RowStatus[]).map((s) => {
                  const { dot, label } = statusCfg(s);
                  const desc: Record<string, string> = {
                    green: `All components compliant, CSS uses dist/, no violations.`,
                    amber: `CSS uses @source workaround, or package pin is 2+ minor versions behind ${LATEST_VERSION}.`,
                    red:   `Any component has a known violation, or knownViolations is non-empty.`,
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
              <div className="mt-5 p-4 rounded-lg" style={{ backgroundColor: T.offWhite, border: `1px solid ${T.border}` }}>
                <p className="text-[11px]" style={{ color: T.muted }}>
                  <strong style={{ color: T.dark }}>File location in each project:</strong><br />
                  <code className="font-mono">client/public/bds-meta.json</code><br />
                  Served at: <code className="font-mono">https://&#123;domain&#125;/bds-meta.json</code>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
