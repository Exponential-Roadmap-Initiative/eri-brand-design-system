/**
 * ERI BDS Alignment Tracker
 *
 * Fetches bds-meta.json from every registered ERI project on page load
 * and renders a live compliance dashboard.
 *
 * Design: clean data table with RAG status indicators, ERI dark/green palette.
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

const LATEST_VERSION = "v2.10.2";

// ── Helper components ─────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: "green" | "amber" | "red" | "unknown" | "loading" | "error" }) {
  const map = {
    green:   { bg: "#d1fae5", text: "#065f46", label: "Compliant" },
    amber:   { bg: "#fef3c7", text: "#92400e", label: "Needs Update" },
    red:     { bg: "#fee2e2", text: "#991b1b", label: "Violations" },
    unknown: { bg: "#f3f4f6", text: "#6b7280", label: "Unknown" },
    loading: { bg: "#eff6ff", text: "#1d4ed8", label: "Fetching…" },
    error:   { bg: "#fef2f2", text: "#b91c1c", label: "Unreachable" },
  };
  const s = map[status] ?? map.unknown;
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold"
      style={{ backgroundColor: s.bg, color: s.text }}
    >
      {s.label}
    </span>
  );
}

function ComponentCell({ used, compliant }: { used?: boolean; compliant?: boolean }) {
  if (used === undefined) return <span className="text-gray-300 text-xs">—</span>;
  if (!used) return <span className="text-gray-400 text-xs">Not used</span>;
  if (compliant) return <span className="text-green-600 text-xs font-medium">✓ Used</span>;
  return <span className="text-red-500 text-xs font-medium">✗ Violation</span>;
}

function VersionBadge({ pin }: { pin?: string }) {
  if (!pin) return <span className="text-gray-300 text-xs">—</span>;
  const isLatest = pin === LATEST_VERSION || pin === "main";
  const isBehind = pin !== LATEST_VERSION && pin !== "main";
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-mono font-medium"
      style={{
        backgroundColor: isLatest ? "#d1fae5" : isBehind ? "#fef3c7" : "#f3f4f6",
        color: isLatest ? "#065f46" : isBehind ? "#92400e" : "#6b7280",
      }}
    >
      {pin}
    </span>
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
    // Reset to loading
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
  const greenCount = liveResults.filter((r) => r.meta?.overallStatus === "green").length;
  const amberCount = liveResults.filter((r) => r.meta?.overallStatus === "amber").length;
  const redCount = liveResults.filter((r) => r.meta?.overallStatus === "red" || r.status === "error").length;

  return (
    <div className="min-h-screen bg-[#F9FAFB] pt-[108px]">
      {/* ── Page header ── */}
      <div className="bg-[#232323] text-white px-6 py-10">
        <div className="max-w-7xl mx-auto">
          <p className="text-[11px] font-semibold uppercase tracking-widest mb-2" style={{ color: "#93E07D" }}>
            BDS Alignment Tracker
          </p>
          <h1 className="font-archivo text-3xl md:text-4xl font-extrabold text-white mb-3">
            Project Compliance Dashboard
          </h1>
          <p className="text-gray-400 text-sm max-w-2xl leading-relaxed">
            Live status of BDS alignment across all ERI projects. Data is fetched directly from each
            project's published <code className="font-mono text-xs bg-gray-800 px-1 rounded">bds-meta.json</code> file.
            Latest <code className="font-mono text-xs bg-gray-800 px-1 rounded">@eri/components</code> release:{" "}
            <span className="font-mono text-xs" style={{ color: "#93E07D" }}>{LATEST_VERSION}</span>
          </p>

          {/* Summary row */}
          <div className="flex flex-wrap gap-4 mt-6">
            <div className="flex items-center gap-2 bg-white/5 rounded-lg px-4 py-2">
              <span className="text-2xl font-bold text-white">{PROJECT_REGISTRY.length}</span>
              <span className="text-xs text-gray-400">Projects tracked</span>
            </div>
            <div className="flex items-center gap-2 bg-white/5 rounded-lg px-4 py-2">
              <span className="text-2xl font-bold" style={{ color: "#93E07D" }}>{greenCount}</span>
              <span className="text-xs text-gray-400">Compliant</span>
            </div>
            <div className="flex items-center gap-2 bg-white/5 rounded-lg px-4 py-2">
              <span className="text-2xl font-bold text-yellow-400">{amberCount}</span>
              <span className="text-xs text-gray-400">Needs update</span>
            </div>
            <div className="flex items-center gap-2 bg-white/5 rounded-lg px-4 py-2">
              <span className="text-2xl font-bold text-red-400">{redCount}</span>
              <span className="text-xs text-gray-400">Violations / unreachable</span>
            </div>
            <button
              onClick={fetchAll}
              className="ml-auto flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-colors"
              style={{ backgroundColor: "#93E07D", color: "#232323" }}
            >
              ↻ Refresh
            </button>
          </div>

          {lastRefreshed && (
            <p className="text-[11px] text-gray-500 mt-3">
              Last refreshed: {lastRefreshed.toLocaleTimeString()}
            </p>
          )}
        </div>
      </div>

      {/* ── Main table ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">

        {/* Desktop table */}
        <div className="hidden lg:block overflow-x-auto rounded-xl border border-gray-200 shadow-sm bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider w-48">Project</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Package pin</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">CSS import</th>
                {COMPONENT_NAMES.map((c) => (
                  <th key={c} className="text-left px-3 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                    {c.replace("Eri", "")}
                  </th>
                ))}
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Violations</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Updated</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {PROJECT_REGISTRY.map((project) => {
                const result = results[project.id];
                const meta = result?.meta;
                const isLoading = result?.status === "loading";
                const isError = result?.status === "error";

                return (
                  <tr key={project.id} className="hover:bg-gray-50 transition-colors">
                    {/* Project */}
                    <td className="px-4 py-3">
                      <div className="font-semibold text-gray-900 text-sm">{project.displayName}</div>
                      <a
                        href={project.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[11px] text-gray-400 hover:text-[#3ba559] transition-colors"
                      >
                        {project.url.replace("https://", "")} ↗
                      </a>
                      {project.status === "in-development" && (
                        <span className="ml-1 text-[10px] text-yellow-600 font-medium">In dev</span>
                      )}
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3">
                      {isLoading && <StatusBadge status="loading" />}
                      {isError && <StatusBadge status="error" />}
                      {meta && <StatusBadge status={meta.overallStatus} />}
                    </td>

                    {/* Package pin */}
                    <td className="px-4 py-3">
                      {isLoading && <span className="text-gray-300 text-xs animate-pulse">…</span>}
                      {isError && <span className="text-gray-300 text-xs">—</span>}
                      {meta && <VersionBadge pin={meta.eriComponentsPin} />}
                    </td>

                    {/* CSS import */}
                    <td className="px-4 py-3">
                      {isLoading && <span className="text-gray-300 text-xs animate-pulse">…</span>}
                      {isError && <span className="text-gray-300 text-xs">—</span>}
                      {meta && (
                        <span className={`text-xs font-medium ${
                          meta.cssImportMethod === "dist" ? "text-green-600" :
                          meta.cssImportMethod === "source-workaround" ? "text-yellow-600" :
                          "text-red-500"
                        }`}>
                          {meta.cssImportMethod === "dist" ? "✓ dist/" :
                           meta.cssImportMethod === "source-workaround" ? "⚠ @source" :
                           "✗ None"}
                        </span>
                      )}
                    </td>

                    {/* Components */}
                    {COMPONENT_NAMES.map((c) => (
                      <td key={c} className="px-3 py-3">
                        {isLoading && <span className="text-gray-200 text-xs animate-pulse">…</span>}
                        {isError && <span className="text-gray-200 text-xs">—</span>}
                        {meta && (
                          <ComponentCell
                            used={meta.components[c]?.used}
                            compliant={meta.components[c]?.compliant}
                          />
                        )}
                      </td>
                    ))}

                    {/* Violations */}
                    <td className="px-4 py-3 max-w-[200px]">
                      {isLoading && <span className="text-gray-200 text-xs animate-pulse">…</span>}
                      {isError && (
                        <span className="text-red-400 text-xs">{result.error}</span>
                      )}
                      {meta && meta.knownViolations.length === 0 && (
                        <span className="text-green-600 text-xs">None</span>
                      )}
                      {meta && meta.knownViolations.length > 0 && (
                        <ul className="space-y-1">
                          {meta.knownViolations.map((v, i) => (
                            <li key={i} className="text-red-500 text-[11px] font-mono bg-red-50 px-1 rounded">{v}</li>
                          ))}
                        </ul>
                      )}
                    </td>

                    {/* Updated */}
                    <td className="px-4 py-3">
                      {meta ? (
                        <div>
                          <div className="text-xs text-gray-600">{meta.lastUpdated}</div>
                          <div className="text-[11px] text-gray-400">{meta.updatedBy}</div>
                        </div>
                      ) : (
                        <span className="text-gray-300 text-xs">—</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Mobile cards */}
        <div className="lg:hidden space-y-4">
          {PROJECT_REGISTRY.map((project) => {
            const result = results[project.id];
            const meta = result?.meta;
            const isLoading = result?.status === "loading";
            const isError = result?.status === "error";

            return (
              <div key={project.id} className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="font-semibold text-gray-900">{project.displayName}</div>
                    <a href={project.url} target="_blank" rel="noopener noreferrer"
                      className="text-[11px] text-gray-400 hover:text-[#3ba559]">
                      {project.url.replace("https://", "")} ↗
                    </a>
                  </div>
                  <div>
                    {isLoading && <StatusBadge status="loading" />}
                    {isError && <StatusBadge status="error" />}
                    {meta && <StatusBadge status={meta.overallStatus} />}
                  </div>
                </div>

                {meta && (
                  <>
                    <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                      <div>
                        <span className="text-gray-400">Package: </span>
                        <VersionBadge pin={meta.eriComponentsPin} />
                      </div>
                      <div>
                        <span className="text-gray-400">CSS: </span>
                        <span className={meta.cssImportMethod === "dist" ? "text-green-600 font-medium" : "text-yellow-600 font-medium"}>
                          {meta.cssImportMethod === "dist" ? "✓ dist/" : "⚠ @source"}
                        </span>
                      </div>
                    </div>
                    {meta.knownViolations.length > 0 && (
                      <div className="mt-2">
                        <p className="text-[11px] font-semibold text-red-500 mb-1">Violations:</p>
                        {meta.knownViolations.map((v, i) => (
                          <span key={i} className="text-[11px] font-mono bg-red-50 text-red-500 px-1 rounded mr-1">{v}</span>
                        ))}
                      </div>
                    )}
                    <p className="text-[11px] text-gray-400 mt-2">Updated {meta.lastUpdated} by {meta.updatedBy}</p>
                  </>
                )}
                {isError && (
                  <p className="text-xs text-red-400 mt-1">Could not fetch bds-meta.json — project may not have the file yet.</p>
                )}
              </div>
            );
          })}
        </div>

        {/* ── How to maintain ── */}
        <div className="mt-10 rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="font-archivo font-bold text-[#232323] text-lg mb-4">How this tracker works</h2>
          <div className="grid md:grid-cols-2 gap-6 text-sm text-gray-600">
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">For Manus AI agents</h3>
              <p className="leading-relaxed mb-3">
                When working on any ERI project, update <code className="font-mono text-xs bg-gray-100 px-1 rounded">client/public/bds-meta.json</code> as
                part of your task whenever you upgrade <code className="font-mono text-xs bg-gray-100 px-1 rounded">@eri/components</code>, change the CSS
                import method, add or fix a component, or resolve a violation. The tracker refreshes live from the deployed file.
              </p>
              <div className="bg-gray-900 rounded-lg p-3 font-mono text-xs text-green-400 overflow-x-auto">
{`{
  "schemaVersion": "1.0",
  "project": "PSM",
  "eriComponentsPin": "v2.10.2",
  "cssImportMethod": "dist",
  "overallStatus": "green",
  "lastUpdated": "2026-04-19",
  "updatedBy": "Manus"
}`}
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Status rules</h3>
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <StatusBadge status="green" />
                  <span className="text-xs text-gray-500">All components compliant, CSS uses <code className="font-mono bg-gray-100 px-0.5 rounded">dist/</code>, no violations.</span>
                </div>
                <div className="flex items-start gap-2">
                  <StatusBadge status="amber" />
                  <span className="text-xs text-gray-500">CSS uses <code className="font-mono bg-gray-100 px-0.5 rounded">@source</code> workaround, or package pin is 2+ minor versions behind latest.</span>
                </div>
                <div className="flex items-start gap-2">
                  <StatusBadge status="red" />
                  <span className="text-xs text-gray-500">Any component has a known violation, or <code className="font-mono bg-gray-100 px-0.5 rounded">knownViolations</code> is non-empty.</span>
                </div>
                <div className="flex items-start gap-2">
                  <StatusBadge status="error" />
                  <span className="text-xs text-gray-500">Project has not yet published a <code className="font-mono bg-gray-100 px-0.5 rounded">bds-meta.json</code> file, or the URL is unreachable.</span>
                </div>
              </div>
              <div className="mt-4 p-3 rounded-lg bg-gray-50 border border-gray-200">
                <p className="text-[11px] text-gray-500">
                  <strong className="text-gray-700">File location in each project:</strong><br />
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
