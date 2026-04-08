/**
 * NavigationPatterns.tsx
 * ERI Brand Design System — Navigation & Layout Standards section
 *
 * Three navigation tiers:
 *   - Tier B (Marketing): dark header + two-column hamburger overlay
 *   - Tier A Simple (Application): white header + tab bar
 *   - Tier A Workflow (Application): white header + context bar + workflow stepper + tab bar
 *
 * Colours: Primary Green #3ba559, Primary Dark #232323, Off White #F9FAFB, Dark Gray #383838
 */

import { useState } from "react";
import {
  Menu, X, Home, BarChart2, FileText, Settings,
  ChevronRight, Users, Upload, RefreshCw, List, TrendingUp
} from "lucide-react";

// ── Tier B: Marketing header mock ──────────────────────────────────────────
function TierBHeaderMock() {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <div className="rounded-lg overflow-hidden border border-gray-200 shadow-sm">
      <div className="h-1 bg-[#2C3F43] w-full" />
      <div className="bg-[#232323] h-16 flex items-center px-6 justify-between">
        <div className="flex items-center gap-3">
          <div className="flex flex-col leading-none">
            <span className="font-archivo font-black text-white text-[10px] tracking-widest uppercase">EXPONENTIAL</span>
            <span className="font-archivo font-black text-white text-[10px] tracking-widest uppercase">ROADMAP <span className="font-normal text-[9px]">INITIATIVE</span></span>
          </div>
          <div className="w-px h-8 bg-white/30 mx-2" />
          <span className="font-archivo font-bold text-white text-sm">Human-AI Lab</span>
        </div>
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="text-white p-2 hover:bg-white/10 rounded transition-colors"
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>
      {menuOpen && (
        <div className="bg-[#1a1a1a] text-white grid grid-cols-2">
          <div className="p-5 border-r border-white/10">
            <p className="text-[10px] font-archivo font-bold uppercase tracking-widest text-white/40 mb-3">This Site</p>
            {["Introduction", "Tools & Applications", "Research", "About ERI"].map(item => (
              <div key={item} className="py-1.5 text-sm font-open-sans text-white/70 hover:text-white cursor-pointer flex items-center gap-2 transition-colors">
                <ChevronRight size={11} className="text-[#93E07D]" />
                {item}
              </div>
            ))}
          </div>
          <div className="p-5">
            <p className="text-[10px] font-archivo font-bold uppercase tracking-widest text-white/40 mb-3">External Resources</p>
            {["ERI Website", "Publications", "Partner Portal"].map(item => (
              <div key={item} className="py-1.5 text-sm font-open-sans text-white/70 hover:text-white cursor-pointer flex items-center gap-2 transition-colors">
                <ChevronRight size={11} className="text-[#3ba559]" />
                {item}
              </div>
            ))}
            <div className="mt-4 pt-4 border-t border-white/10">
              <div className="bg-[#3ba559] text-white text-sm font-archivo font-bold px-4 py-2 rounded text-center cursor-pointer hover:bg-[#2d8045] transition-colors">
                Launch Application
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="bg-[#2a2a2a] px-6 py-2 text-[11px] text-white/40 font-open-sans">
        {menuOpen ? "Overlay open — two columns: site sections left, external links + CTA right" : "Click ☰ to open the two-column overlay"}
      </div>
    </div>
  );
}

// ── Tier A Simple: white header + tab bar ──────────────────────────────────
function TierASimpleHeaderMock() {
  const [activeTab, setActiveTab] = useState("overview");
  const tabs = [
    { id: "overview", label: "Overview", icon: <BarChart2 size={13} /> },
    { id: "companies", label: "Companies", icon: <Users size={13} /> },
    { id: "nations", label: "Nations / EU", icon: <FileText size={13} /> },
    { id: "methodology", label: "Methodology", icon: <Settings size={13} /> },
  ];
  return (
    <div className="rounded-lg overflow-hidden border border-gray-200 shadow-sm">
      <div className="h-1 bg-[#2C3F43] w-full" />
      <div className="bg-white h-16 flex items-center px-6 justify-between border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="flex flex-col leading-none">
            <span className="font-archivo font-black text-[#232323] text-[10px] tracking-widest uppercase">EXPONENTIAL</span>
            <span className="font-archivo font-black text-[#232323] text-[10px] tracking-widest uppercase">ROADMAP <span className="font-normal text-[9px]">INITIATIVE</span></span>
          </div>
          <div className="w-px h-8 bg-gray-300 mx-2" />
          <span className="font-archivo font-bold text-[#383838] text-sm">Crocodile Economy</span>
        </div>
        <button className="text-gray-500 p-2 hover:bg-gray-100 rounded transition-colors">
          <Menu size={20} />
        </button>
      </div>
      <div className="bg-white border-b border-gray-200 px-6 flex">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-1.5 px-4 py-3 text-xs font-open-sans font-medium border-b-2 transition-colors ${
              activeTab === tab.id
                ? "border-[#3ba559] text-[#3ba559]"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>
      <div className="bg-[#F9FAFB] px-6 py-2.5 text-[11px] text-gray-400 font-open-sans">
        Active: <span className="text-[#3ba559] font-medium">{tabs.find(t => t.id === activeTab)?.label}</span> — click tabs to switch
      </div>
    </div>
  );
}

// ── Tier A Workflow: header + context bar + stepper + tab bar ──────────────
function TierAWorkflowHeaderMock() {
  const [activeStep, setActiveStep] = useState(1);
  const [activeTab, setActiveTab] = useState("portfolio");

  const steps = [
    { id: 0, label: "Workspace\nHome", isHome: true },
    { id: 1, label: "Client\nAssessment", num: "1a" },
    { id: 2, label: "Project\nAssessment", num: "1b" },
    { id: 3, label: "Portfolio\nMapping", num: "1c" },
    { id: 4, label: "Desired\nState", num: "2" },
    { id: 5, label: "Identify Gaps\n& Opps", num: "3" },
    { id: 6, label: "Build\nRoadmap", num: "4" },
    { id: 7, label: "Implement\n& Report", num: "5" },
  ];

  const tabSets: Record<number, { id: string; label: string; icon: React.ReactNode }[]> = {
    0: [{ id: "home", label: "Workspace Home", icon: <Home size={13} /> }],
    1: [
      { id: "portfolio", label: "Client Portfolio", icon: <BarChart2 size={13} /> },
      { id: "assess", label: "Assess Client", icon: <Users size={13} /> },
      { id: "upload", label: "Upload File", icon: <Upload size={13} /> },
      { id: "sync", label: "Sync CRM / ERP", icon: <RefreshCw size={13} /> },
    ],
    2: [
      { id: "projects", label: "Project List", icon: <List size={13} /> },
      { id: "assess", label: "Assess Project", icon: <TrendingUp size={13} /> },
    ],
    3: [{ id: "mapping", label: "Portfolio Map", icon: <BarChart2 size={13} /> }],
    4: [{ id: "state", label: "Desired State", icon: <TrendingUp size={13} /> }],
    5: [{ id: "gaps", label: "Gap Analysis", icon: <BarChart2 size={13} /> }],
    6: [{ id: "roadmap", label: "Roadmap", icon: <FileText size={13} /> }],
    7: [{ id: "monitor", label: "Progress", icon: <TrendingUp size={13} /> }],
  };

  const currentTabs = tabSets[activeStep] ?? tabSets[1];

  return (
    <div className="rounded-lg overflow-hidden border border-gray-200 shadow-sm">
      <div className="h-1 bg-[#2C3F43] w-full" />
      {/* Header */}
      <div className="bg-white h-16 flex items-center px-6 justify-between border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="flex flex-col leading-none">
            <span className="font-archivo font-black text-[#232323] text-[10px] tracking-widest uppercase">EXPONENTIAL</span>
            <span className="font-archivo font-black text-[#232323] text-[10px] tracking-widest uppercase">ROADMAP <span className="font-normal text-[9px]">INITIATIVE</span></span>
          </div>
          <div className="w-px h-8 bg-gray-300 mx-2" />
          <span className="font-archivo font-bold text-[#383838] text-sm">Professional Services Matrix</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] border border-gray-300 rounded-full px-2 py-0.5 font-open-sans text-gray-500">BETA</span>
          <span className="text-[10px] text-gray-400 font-open-sans">V.2026.04.08</span>
          <div className="w-2 h-2 rounded-full bg-red-500" />
          <button className="text-gray-500 p-2 hover:bg-gray-100 rounded transition-colors ml-1">
            <Menu size={18} />
          </button>
        </div>
      </div>
      {/* Context bar */}
      <div className="bg-white border-b border-gray-100 px-6 py-1.5 flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-[11px] text-gray-500 font-open-sans">
          <span className="text-[#3ba559] font-medium">Exponential Roadmap</span>
          <ChevronRight size={9} />
          <span>Administrator</span>
          <ChevronRight size={9} />
          <span className="text-gray-400">1000 cr</span>
        </div>
        <div className="flex items-center gap-3 text-[11px] text-gray-500 font-open-sans">
          {["Extend Portfolio", "My Account", "Guide", "Configure"].map(item => (
            <span key={item} className="hover:text-[#3ba559] cursor-pointer transition-colors">{item}</span>
          ))}
        </div>
      </div>
      {/* Workflow stepper */}
      <div className="bg-white border-b border-gray-100 px-6 py-3 overflow-x-auto">
        <div className="flex items-start min-w-max">
          {steps.map((step, i) => (
            <div key={step.id} className="flex items-start">
              <button
                onClick={() => { setActiveStep(step.id); setActiveTab("portfolio"); }}
                className="flex flex-col items-center gap-1 group"
              >
                <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-[11px] font-archivo font-bold transition-all ${
                  step.id === activeStep
                    ? "border-[#3ba559] bg-[#3ba559] text-white"
                    : step.id < activeStep
                    ? "border-[#3ba559] bg-white text-[#3ba559]"
                    : "border-gray-300 bg-white text-gray-400 group-hover:border-gray-400"
                }`}>
                  {step.isHome ? <Home size={13} /> : step.num}
                </div>
                <span className={`text-[9px] font-open-sans text-center leading-tight whitespace-pre-line max-w-[56px] ${
                  step.id === activeStep ? "text-[#3ba559] font-semibold" : "text-gray-400"
                }`}>
                  {step.label}
                </span>
              </button>
              {i < steps.length - 1 && (
                <div className={`w-6 h-px mt-4 mx-0.5 flex-shrink-0 ${step.id < activeStep ? "bg-[#3ba559]" : "bg-gray-200"}`} />
              )}
            </div>
          ))}
        </div>
      </div>
      {/* Tab bar */}
      <div className="bg-white border-b border-gray-200 px-6 flex">
        {currentTabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-open-sans font-medium border-b-2 transition-colors ${
              activeTab === tab.id
                ? "border-[#3ba559] text-[#3ba559]"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>
      <div className="bg-[#F9FAFB] px-6 py-2.5 text-[11px] text-gray-400 font-open-sans">
        Click any step to change stage — tabs update per stage. Active: <span className="text-[#3ba559] font-medium">{steps[activeStep]?.label.replace("\n", " ")}</span>
      </div>
    </div>
  );
}

// ── Anatomy label helper ───────────────────────────────────────────────────
function AnatomyRow({ label, height, colour, description }: { label: string; height: string; colour: string; description: string }) {
  return (
    <div className="flex items-center gap-4 py-2 border-b border-gray-100 last:border-0">
      <div className={`w-3 h-3 rounded-sm flex-shrink-0`} style={{ backgroundColor: colour }} />
      <div className="w-24 flex-shrink-0">
        <span className="text-xs font-archivo font-bold text-[#232323]">{label}</span>
      </div>
      <div className="w-14 flex-shrink-0 text-xs text-gray-400 font-open-sans">{height}</div>
      <div className="text-xs text-gray-600 font-open-sans">{description}</div>
    </div>
  );
}

// ── Main export ────────────────────────────────────────────────────────────
export function NavigationPatterns() {
  return (
    <div className="space-y-16">

      {/* ── Intro ── */}
      <div>
        <p className="text-gray-600 font-open-sans max-w-3xl leading-relaxed">
          All ERI web applications follow one of two navigation tiers. The tier is determined by the
          application type — not by personal preference. Consistency across all apps reduces the
          learning curve for users who move between tools.
        </p>
      </div>

      {/* ── Tier overview table ── */}
      <div>
        <h3 className="font-archivo font-extrabold text-lg text-[#232323] mb-4">Layout & Navigation Tiers</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm font-open-sans border-collapse">
            <thead>
              <tr className="border-b-2 border-[#232323]">
                <th className="text-left py-3 pr-6 font-archivo font-bold text-[#232323] w-32">Tier</th>
                <th className="text-left py-3 pr-6 font-archivo font-bold text-[#232323]">Application type</th>
                <th className="text-left py-3 pr-6 font-archivo font-bold text-[#232323]">Max content width</th>
                <th className="text-left py-3 pr-6 font-archivo font-bold text-[#232323]">Header background</th>
                <th className="text-left py-3 font-archivo font-bold text-[#232323]">Navigation layers</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-100">
                <td className="py-3 pr-6 font-bold text-[#232323]">Tier B<br /><span className="text-xs font-normal text-gray-500">Marketing</span></td>
                <td className="py-3 pr-6 text-gray-700">Content-led, editorial, marketing sites<br /><span className="text-xs text-gray-400">Human-AI Lab, Carbon Removals, Human-AI Impact</span></td>
                <td className="py-3 pr-6 font-mono text-xs text-[#3ba559]">max-w-5xl (1024px)</td>
                <td className="py-3 pr-6 text-gray-700">Dark <span className="font-mono text-xs">#232323</span> with image overlay</td>
                <td className="py-3 text-gray-700">Header + two-column hamburger overlay</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-3 pr-6 font-bold text-[#232323]">Tier A Simple<br /><span className="text-xs font-normal text-gray-500">Application</span></td>
                <td className="py-3 pr-6 text-gray-700">Data tools, reference apps, single-workflow<br /><span className="text-xs text-gray-400">Crocodile Economy, Exponential Taxonomy</span></td>
                <td className="py-3 pr-6 font-mono text-xs text-[#3ba559]">max-w-screen-xl (1280px)</td>
                <td className="py-3 pr-6 text-gray-700">White, always solid</td>
                <td className="py-3 text-gray-700">Header + tab bar</td>
              </tr>
              <tr>
                <td className="py-3 pr-6 font-bold text-[#232323]">Tier A Workflow<br /><span className="text-xs font-normal text-gray-500">Application</span></td>
                <td className="py-3 pr-6 text-gray-700">Multi-step workflow tools, enterprise apps<br /><span className="text-xs text-gray-400">PSM, future workflow tools</span></td>
                <td className="py-3 pr-6 font-mono text-xs text-[#3ba559]">max-w-screen-xl (1280px)</td>
                <td className="py-3 pr-6 text-gray-700">White, always solid</td>
                <td className="py-3 text-gray-700">Header + context bar + workflow stepper + tab bar</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Shared header spec ── */}
      <div>
        <h3 className="font-archivo font-extrabold text-lg text-[#232323] mb-2">Shared Header Specification</h3>
        <p className="text-gray-600 font-open-sans text-sm mb-6">These rules apply to <strong>all</strong> ERI web applications regardless of tier.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-[#F9FAFB] rounded-lg p-5 border border-gray-200">
            <h4 className="font-archivo font-bold text-sm text-[#232323] mb-3">Header Anatomy</h4>
            <AnatomyRow label="Top strip" height="4px" colour="#2C3F43" description="Dark teal (#2C3F43) — always present, full width" />
            <AnatomyRow label="Header" height="64px" colour="#232323" description="Dark (#232323) for Tier B, white for Tier A" />
            <AnatomyRow label="Logo" height="—" colour="#3ba559" description="ERI logo left, vertical divider, app title right — single line, no supertitle" />
            <AnatomyRow label="Hamburger" height="—" colour="#6b7280" description="Top right — always present, even when tabs exist" />
          </div>
          <div className="bg-[#F9FAFB] rounded-lg p-5 border border-gray-200">
            <h4 className="font-archivo font-bold text-sm text-[#232323] mb-3">Header Rules</h4>
            <div className="space-y-2 text-xs font-open-sans text-gray-700">
              <div className="flex gap-2"><span className="text-[#3ba559] font-bold mt-0.5">✓</span><span>Logo is always the ERI wordmark — never replaced with an app-specific logo</span></div>
              <div className="flex gap-2"><span className="text-[#3ba559] font-bold mt-0.5">✓</span><span>App title uses Archivo Bold, single line — no supertitle above it</span></div>
              <div className="flex gap-2"><span className="text-[#3ba559] font-bold mt-0.5">✓</span><span>Header height is always 64px — never taller or shorter</span></div>
              <div className="flex gap-2"><span className="text-[#3ba559] font-bold mt-0.5">✓</span><span>4px dark teal top strip is always present — it is the first visual element</span></div>
              <div className="flex gap-2"><span className="text-red-500 font-bold mt-0.5">✗</span><span>Do not add inline nav links inside the header bar — use the tab bar below instead</span></div>
              <div className="flex gap-2"><span className="text-red-500 font-bold mt-0.5">✗</span><span>Do not make the header transparent on scroll for Tier A applications</span></div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Tier B live example ── */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <span className="bg-[#232323] text-white text-xs font-archivo font-bold px-2 py-0.5 rounded">TIER B</span>
          <h3 className="font-archivo font-extrabold text-lg text-[#232323]">Marketing — Two-Column Hamburger Overlay</h3>
        </div>
        <p className="text-gray-600 font-open-sans text-sm mb-5">
          Used for content-led sites. The dark header extends into the hero section. The hamburger opens a
          full-width two-column overlay: internal page sections on the left, external resources and a launch
          CTA on the right.
        </p>
        <TierBHeaderMock />
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-[#F9FAFB] rounded-lg p-4 border border-gray-200">
            <p className="text-[11px] font-archivo font-bold uppercase tracking-wider text-gray-400 mb-1">Left column</p>
            <p className="text-xs font-open-sans text-gray-700">Internal page sections — scroll anchors within this document</p>
          </div>
          <div className="bg-[#F9FAFB] rounded-lg p-4 border border-gray-200">
            <p className="text-[11px] font-archivo font-bold uppercase tracking-wider text-gray-400 mb-1">Right column</p>
            <p className="text-xs font-open-sans text-gray-700">External resources (ERI website, publications) + Launch CTA button</p>
          </div>
          <div className="bg-[#F9FAFB] rounded-lg p-4 border border-gray-200">
            <p className="text-[11px] font-archivo font-bold uppercase tracking-wider text-gray-400 mb-1">Mobile</p>
            <p className="text-xs font-open-sans text-gray-700">Same overlay collapses to single column — sections stack vertically</p>
          </div>
        </div>
      </div>

      {/* ── Tier A Simple live example ── */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <span className="bg-[#3ba559] text-white text-xs font-archivo font-bold px-2 py-0.5 rounded">TIER A SIMPLE</span>
          <h3 className="font-archivo font-extrabold text-lg text-[#232323]">Application — Header + Tab Bar</h3>
        </div>
        <p className="text-gray-600 font-open-sans text-sm mb-5">
          Used for data tools and single-workflow apps. White header with the tab bar directly below.
          Active tab is underlined in Primary Green. The hamburger opens a single-column slide-in panel
          with app sections only — no marketing links.
        </p>
        <TierASimpleHeaderMock />
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-[#F9FAFB] rounded-lg p-4 border border-gray-200">
            <p className="text-[11px] font-archivo font-bold uppercase tracking-wider text-gray-400 mb-1">Tab active state</p>
            <p className="text-xs font-open-sans text-gray-700">2px bottom border in Primary Green #3ba559, text colour #3ba559</p>
          </div>
          <div className="bg-[#F9FAFB] rounded-lg p-4 border border-gray-200">
            <p className="text-[11px] font-archivo font-bold uppercase tracking-wider text-gray-400 mb-1">Tab inactive state</p>
            <p className="text-xs font-open-sans text-gray-700">No border, text Neutral Gray #6b7280 — hover shows grey underline</p>
          </div>
          <div className="bg-[#F9FAFB] rounded-lg p-4 border border-gray-200">
            <p className="text-[11px] font-archivo font-bold uppercase tracking-wider text-gray-400 mb-1">Mobile</p>
            <p className="text-xs font-open-sans text-gray-700">Tabs scroll horizontally — do not wrap or collapse to a dropdown</p>
          </div>
        </div>
      </div>

      {/* ── Tier A Workflow live example ── */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <span className="bg-[#3ba559] text-white text-xs font-archivo font-bold px-2 py-0.5 rounded">TIER A WORKFLOW</span>
          <h3 className="font-archivo font-extrabold text-lg text-[#232323]">Application — Header + Context Bar + Stepper + Tabs</h3>
        </div>
        <p className="text-gray-600 font-open-sans text-sm mb-5">
          Used for multi-step workflow tools. Four navigation layers sit between the top strip and the page
          content. Click any step in the stepper to see how the tab bar updates per stage.
        </p>
        <TierAWorkflowHeaderMock />
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-[#F9FAFB] rounded-lg p-4 border border-gray-200">
            <h4 className="font-archivo font-bold text-sm text-[#232323] mb-3">Four Navigation Layers</h4>
            <AnatomyRow label="Header" height="64px" colour="#ffffff" description="Logo + app title + Beta badge + version + hamburger" />
            <AnatomyRow label="Context bar" height="36px" colour="#f3f4f6" description="Breadcrumb (workspace / user / credits) + utility links" />
            <AnatomyRow label="Stepper" height="80px" colour="#f9fafb" description="Numbered stage circles with connecting lines — sequential" />
            <AnatomyRow label="Tab bar" height="44px" colour="#ffffff" description="Tabs for the selected stage — updates when stage changes" />
          </div>
          <div className="bg-[#F9FAFB] rounded-lg p-4 border border-gray-200">
            <h4 className="font-archivo font-bold text-sm text-[#232323] mb-3">Stepper Rules</h4>
            <div className="space-y-2 text-xs font-open-sans text-gray-700">
              <div className="flex gap-2"><span className="text-[#3ba559] font-bold mt-0.5">✓</span><span>Active step: filled green circle (#3ba559), white icon/number</span></div>
              <div className="flex gap-2"><span className="text-[#3ba559] font-bold mt-0.5">✓</span><span>Completed steps: green outline circle, green number — user can navigate back</span></div>
              <div className="flex gap-2"><span className="text-[#3ba559] font-bold mt-0.5">✓</span><span>Future steps: grey outline circle, grey number — may be locked</span></div>
              <div className="flex gap-2"><span className="text-[#3ba559] font-bold mt-0.5">✓</span><span>Connecting lines turn green as steps are completed</span></div>
              <div className="flex gap-2"><span className="text-[#3ba559] font-bold mt-0.5">✓</span><span>Step labels use Open Sans, 10px, centred below circle</span></div>
              <div className="flex gap-2"><span className="text-red-500 font-bold mt-0.5">✗</span><span>Do not use the stepper for non-sequential navigation — use tabs instead</span></div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Mobile behaviour ── */}
      <div>
        <h3 className="font-archivo font-extrabold text-lg text-[#232323] mb-4">Mobile Behaviour</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-[#F9FAFB] rounded-lg p-5 border border-gray-200">
            <div className="flex items-center gap-2 mb-3">
              <span className="bg-[#232323] text-white text-[10px] font-archivo font-bold px-1.5 py-0.5 rounded">TIER B</span>
              <span className="text-xs font-archivo font-bold text-[#232323]">Marketing</span>
            </div>
            <div className="space-y-1.5 text-xs font-open-sans text-gray-700">
              <div className="flex gap-2"><span className="text-[#3ba559]">→</span><span>Logo + hamburger only in header</span></div>
              <div className="flex gap-2"><span className="text-[#3ba559]">→</span><span>Overlay collapses to single column</span></div>
              <div className="flex gap-2"><span className="text-[#3ba559]">→</span><span>Hero image scales to full viewport width</span></div>
            </div>
          </div>
          <div className="bg-[#F9FAFB] rounded-lg p-5 border border-gray-200">
            <div className="flex items-center gap-2 mb-3">
              <span className="bg-[#3ba559] text-white text-[10px] font-archivo font-bold px-1.5 py-0.5 rounded">TIER A</span>
              <span className="text-xs font-archivo font-bold text-[#232323]">Simple</span>
            </div>
            <div className="space-y-1.5 text-xs font-open-sans text-gray-700">
              <div className="flex gap-2"><span className="text-[#3ba559]">→</span><span>Logo + hamburger only in header</span></div>
              <div className="flex gap-2"><span className="text-[#3ba559]">→</span><span>Tab bar scrolls horizontally — do not wrap</span></div>
              <div className="flex gap-2"><span className="text-[#3ba559]">→</span><span>Tables use horizontal scroll within a container</span></div>
            </div>
          </div>
          <div className="bg-[#F9FAFB] rounded-lg p-5 border border-gray-200">
            <div className="flex items-center gap-2 mb-3">
              <span className="bg-[#3ba559] text-white text-[10px] font-archivo font-bold px-1.5 py-0.5 rounded">TIER A</span>
              <span className="text-xs font-archivo font-bold text-[#232323]">Workflow</span>
            </div>
            <div className="space-y-1.5 text-xs font-open-sans text-gray-700">
              <div className="flex gap-2"><span className="text-[#3ba559]">→</span><span>Context bar hides on mobile</span></div>
              <div className="flex gap-2"><span className="text-[#3ba559]">→</span><span>Stepper scrolls horizontally — shows active step label only</span></div>
              <div className="flex gap-2"><span className="text-[#3ba559]">→</span><span>Tab bar scrolls horizontally</span></div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
