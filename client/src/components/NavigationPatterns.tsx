/**
 * NavigationPatterns.tsx
 * ERI Brand Design System — Navigation & Layout Standards section
 *
 * Navigation tiers documented:
 *   - Tier B (Marketing): dark header + two-column hamburger overlay (Hub pattern)
 *   - Tier B (Application): white header + single-column hamburger overlay (PSM pattern)
 *   - Tier A Simple (Application): white header + tab bar
 *   - Tier A Simple + Landing Hero: transparent header over dark hero → white header in app interior
 *   - Tier A Workflow (Application): white header + context bar + workflow stepper + tab bar
 *   - Tier C (Admin/Tool): persistent left sidebar + white header with hamburger
 *
 * Colours: Primary Green #3ba559, Primary Dark #232323, Off White #F9FAFB, Dark Gray #383838
 */

import { useState } from "react";
import {
  Menu, X, Home, BarChart2, FileText, Settings,
  ChevronRight, Users, Upload, RefreshCw, List, TrendingUp,
  ExternalLink, Database, Shield, Copy, LogOut, Activity,
  LayoutDashboard, UserCog
} from "lucide-react";

// ── Tier C: Mobile drawer mock ───────────────────────────────────────────
function TierCMobileDrawerMock() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activePage, setActivePage] = useState("admin-dashboard");

  const navGroups = [
    {
      label: null,
      items: [
        { id: "admin-dashboard", label: "Admin Dashboard", icon: <LayoutDashboard size={15} /> },
        { id: "system-health", label: "System Health", icon: <Activity size={15} /> },
        { id: "data-lake", label: "ERI Data Lake", icon: <Database size={15} /> },
        { id: "data-hub", label: "Data Hub", icon: <BarChart2 size={15} /> },
        { id: "architecture", label: "Data Lake Architecture", icon: <Database size={15} /> },
        { id: "criteria", label: "Assessment Criteria", icon: <FileText size={15} /> },
        { id: "templates", label: "Copy Templates", icon: <Copy size={15} /> },
      ],
    },
    {
      label: "PSM APPLICATION",
      items: [
        { id: "members", label: "ERI Members (Public)", icon: <Users size={15} /> },
        { id: "psm", label: "PSM Application", icon: <BarChart2 size={15} /> },
      ],
    },
    {
      label: null,
      items: [
        { id: "user-mgmt", label: "ERI User Management", icon: <UserCog size={15} /> },
        { id: "workspace-members", label: "Workspace Members", icon: <Users size={15} /> },
        { id: "audit", label: "Security Audit Log", icon: <FileText size={15} /> },
        { id: "trust", label: "Trust & Security", icon: <Shield size={15} /> },
      ],
    },
  ];

  const handleSelect = (id: string) => {
    setActivePage(id);
    setDrawerOpen(false);
  };

  return (
    <div className="flex gap-8 items-start flex-wrap">
      {/* Phone frame */}
      <div className="flex-shrink-0">
        <p className="text-[11px] font-archivo font-bold uppercase tracking-wider text-gray-400 mb-3">Mobile — drawer closed</p>
        <div
          className="relative rounded-[28px] overflow-hidden border-4 border-[#232323] shadow-xl bg-[#F9FAFB]"
          style={{ width: 220, height: 400 }}
        >
          {/* Status bar */}
          <div className="h-6 bg-white flex items-center justify-between px-4">
            <span className="text-[8px] font-bold text-[#232323]">9:41</span>
            <div className="flex gap-1">
              <div className="w-3 h-1.5 rounded-sm bg-[#232323] opacity-60" />
              <div className="w-1.5 h-1.5 rounded-full bg-[#232323] opacity-60" />
            </div>
          </div>
          {/* Header */}
          <div className="h-1 bg-[#2C3F43]" />
          <div className="bg-white border-b border-gray-200 px-3 py-2 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <div className="w-5 h-5 rounded bg-gray-100 flex items-center justify-center">
                <span className="text-[7px] font-archivo font-black text-[#232323]">App</span>
              </div>
              <span className="text-[10px] font-archivo font-bold text-[#232323] truncate max-w-[100px]">ERI Professional Serv…</span>
            </div>
            <button
              onClick={() => setDrawerOpen(true)}
              className="w-7 h-7 flex items-center justify-center rounded hover:bg-gray-100 transition-colors"
            >
              <Menu size={14} className="text-[#232323]" />
            </button>
          </div>
          {/* Page content */}
          <div className="p-3">
            <p className="font-archivo font-extrabold text-[11px] text-[#232323] mb-1">
              {navGroups.flatMap(g => g.items).find(i => i.id === activePage)?.label ?? "Dashboard"}
            </p>
            <div className="grid grid-cols-2 gap-1.5 mt-2">
              {["Workspaces", "Active", "Credits", "Members"].map(l => (
                <div key={l} className="bg-white rounded border border-gray-200 p-1.5">
                  <p className="text-[7px] font-open-sans text-gray-400">{l}</p>
                  <p className="font-archivo font-bold text-[10px] text-[#232323] mt-0.5">—</p>
                </div>
              ))}
            </div>
            <p className="text-[9px] font-open-sans text-gray-400 mt-3 text-center">Tap ☰ to open drawer</p>
          </div>

          {/* Drawer overlay backdrop */}
          <div
            onClick={() => setDrawerOpen(false)}
            style={{
              position: "absolute", inset: 0,
              background: "rgba(0,0,0,0.45)",
              opacity: drawerOpen ? 1 : 0,
              pointerEvents: drawerOpen ? "auto" : "none",
              transition: "opacity 280ms ease",
              zIndex: 10,
            }}
          />

          {/* Slide-in drawer */}
          <div
            style={{
              position: "absolute", top: 0, left: 0, bottom: 0,
              width: "82%",
              background: "#ffffff",
              boxShadow: "4px 0 24px rgba(0,0,0,0.18)",
              transform: drawerOpen ? "translateX(0)" : "translateX(-100%)",
              transition: "transform 280ms cubic-bezier(0.4,0,0.2,1)",
              zIndex: 20,
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* Drawer header */}
            <div className="h-1 bg-[#2C3F43]" />
            <div className="flex items-center justify-between px-3 py-2 border-b border-gray-100">
              <div className="flex items-center gap-1.5">
                <div className="w-5 h-5 rounded bg-gray-100 flex items-center justify-center">
                  <span className="text-[7px] font-archivo font-black text-[#232323]">App</span>
                </div>
                <span className="text-[10px] font-archivo font-bold text-[#232323]">ERI PSM</span>
              </div>
              <button
                onClick={() => setDrawerOpen(false)}
                className="w-6 h-6 flex items-center justify-center rounded hover:bg-gray-100"
              >
                <X size={12} className="text-gray-500" />
              </button>
            </div>

            {/* Nav groups */}
            <div className="flex-1 overflow-y-auto py-1">
              {navGroups.map((group, gi) => (
                <div key={gi} className={gi > 0 ? "mt-1" : ""}>
                  {group.label && (
                    <p className="px-3 pt-2 pb-0.5 text-[8px] font-archivo font-bold uppercase tracking-widest text-gray-400">{group.label}</p>
                  )}
                  {group.items.map(item => (
                    <button
                      key={item.id}
                      onClick={() => handleSelect(item.id)}
                      className={`w-full flex items-center gap-2 px-3 py-1.5 text-left transition-colors text-[10px] font-open-sans ${
                        activePage === item.id
                          ? "bg-green-50 text-[#3ba559] font-semibold border-l-2 border-[#3ba559]"
                          : "text-gray-600 hover:bg-gray-50 border-l-2 border-transparent"
                      }`}
                    >
                      <span className={activePage === item.id ? "text-[#3ba559]" : "text-gray-400"}>{item.icon}</span>
                      {item.label}
                    </button>
                  ))}
                </div>
              ))}
            </div>

            {/* User footer */}
            <div className="border-t border-gray-100 px-3 py-2 flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-[#232323] flex items-center justify-center flex-shrink-0">
                <span className="text-white text-[8px] font-archivo font-bold">N</span>
              </div>
              <div className="min-w-0">
                <p className="text-[9px] font-open-sans font-semibold text-[#232323] truncate">nicklas.lemon</p>
                <p className="text-[8px] font-open-sans text-gray-400 truncate">ERI Admin</p>
              </div>
              <button className="ml-auto flex-shrink-0">
                <LogOut size={11} className="text-gray-400" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Open state phone frame */}
      <div className="flex-shrink-0">
        <p className="text-[11px] font-archivo font-bold uppercase tracking-wider text-gray-400 mb-3">Mobile — drawer open</p>
        <div
          className="relative rounded-[28px] overflow-hidden border-4 border-[#232323] shadow-xl bg-[#F9FAFB]"
          style={{ width: 220, height: 400 }}
        >
          {/* Status bar */}
          <div className="h-6 bg-white flex items-center justify-between px-4">
            <span className="text-[8px] font-bold text-[#232323]">9:41</span>
            <div className="flex gap-1">
              <div className="w-3 h-1.5 rounded-sm bg-[#232323] opacity-60" />
              <div className="w-1.5 h-1.5 rounded-full bg-[#232323] opacity-60" />
            </div>
          </div>
          {/* Header (dimmed) */}
          <div className="h-1 bg-[#2C3F43]" />
          <div className="bg-white border-b border-gray-200 px-3 py-2 flex items-center justify-between opacity-40">
            <span className="text-[10px] font-archivo font-bold text-[#232323]">ERI Professional Serv…</span>
            <Menu size={14} className="text-[#232323]" />
          </div>
          {/* Dimmed content */}
          <div className="absolute inset-0 bg-black/45" style={{ top: 33 }} />
          {/* Static drawer preview */}
          <div
            className="absolute top-0 bottom-0 left-0 bg-white flex flex-col"
            style={{ width: "82%", boxShadow: "4px 0 24px rgba(0,0,0,0.18)", zIndex: 20 }}
          >
            <div className="h-1 bg-[#2C3F43]" />
            <div className="flex items-center justify-between px-3 py-2 border-b border-gray-100">
              <div className="flex items-center gap-1.5">
                <div className="w-5 h-5 rounded bg-gray-100 flex items-center justify-center">
                  <span className="text-[7px] font-archivo font-black text-[#232323]">App</span>
                </div>
                <span className="text-[10px] font-archivo font-bold text-[#232323]">ERI PSM</span>
              </div>
              <X size={12} className="text-gray-500" />
            </div>
            <div className="flex-1 overflow-hidden py-1">
              {navGroups.map((group, gi) => (
                <div key={gi} className={gi > 0 ? "mt-1" : ""}>
                  {group.label && (
                    <p className="px-3 pt-2 pb-0.5 text-[8px] font-archivo font-bold uppercase tracking-widest text-gray-400">{group.label}</p>
                  )}
                  {group.items.map(item => (
                    <div
                      key={item.id}
                      className={`flex items-center gap-2 px-3 py-1.5 text-[10px] font-open-sans border-l-2 ${
                        item.id === "admin-dashboard"
                          ? "bg-green-50 text-[#3ba559] font-semibold border-[#3ba559]"
                          : "text-gray-600 border-transparent"
                      }`}
                    >
                      <span className={item.id === "admin-dashboard" ? "text-[#3ba559]" : "text-gray-400"}>{item.icon}</span>
                      {item.label}
                    </div>
                  ))}
                </div>
              ))}
            </div>
            <div className="border-t border-gray-100 px-3 py-2 flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-[#232323] flex items-center justify-center flex-shrink-0">
                <span className="text-white text-[8px] font-archivo font-bold">N</span>
              </div>
              <div className="min-w-0">
                <p className="text-[9px] font-open-sans font-semibold text-[#232323] truncate">nicklas.lemon</p>
                <p className="text-[8px] font-open-sans text-gray-400 truncate">ERI Admin</p>
              </div>
              <LogOut size={11} className="text-gray-400 ml-auto flex-shrink-0" />
            </div>
          </div>
        </div>
      </div>

      {/* Spec callouts */}
      <div className="flex-1 min-w-[220px] space-y-3">
        <div className="bg-[#F9FAFB] rounded-lg p-4 border border-gray-200">
          <p className="text-[11px] font-archivo font-bold uppercase tracking-wider text-gray-400 mb-2">Drawer dimensions</p>
          <p className="text-xs font-open-sans text-gray-700">Width: 82% of viewport — leaves a visible backdrop strip on the right so users can tap to close. Max-width: 320px on large phones.</p>
        </div>
        <div className="bg-[#F9FAFB] rounded-lg p-4 border border-gray-200">
          <p className="text-[11px] font-archivo font-bold uppercase tracking-wider text-gray-400 mb-2">Animation</p>
          <p className="text-xs font-open-sans text-gray-700">Slide in from left: <code className="bg-gray-100 px-1 rounded text-[10px]">transform: translateX(-100%) → translateX(0)</code>, 280ms, <code className="bg-gray-100 px-1 rounded text-[10px]">cubic-bezier(0.4,0,0.2,1)</code>. Backdrop fades in simultaneously: opacity 0 → 0.45, same duration.</p>
        </div>
        <div className="bg-[#F9FAFB] rounded-lg p-4 border border-gray-200">
          <p className="text-[11px] font-archivo font-bold uppercase tracking-wider text-gray-400 mb-2">Close triggers</p>
          <div className="space-y-1 text-xs font-open-sans text-gray-700">
            <div className="flex gap-2"><span className="text-[#3ba559]">→</span><span>Tap the × button in the drawer header</span></div>
            <div className="flex gap-2"><span className="text-[#3ba559]">→</span><span>Tap the backdrop overlay</span></div>
            <div className="flex gap-2"><span className="text-[#3ba559]">→</span><span>Select any navigation item (drawer closes after navigation)</span></div>
            <div className="flex gap-2"><span className="text-[#3ba559]">→</span><span>Press Escape on keyboard (accessibility)</span></div>
          </div>
        </div>
        <div className="bg-[#F9FAFB] rounded-lg p-4 border border-gray-200">
          <p className="text-[11px] font-archivo font-bold uppercase tracking-wider text-gray-400 mb-2">Breakpoint</p>
          <p className="text-xs font-open-sans text-gray-700">Sidebar hidden below <code className="bg-gray-100 px-1 rounded text-[10px]">lg</code> (1024px). Hamburger always visible in header on mobile. Drawer replaces sidebar entirely — do not show both simultaneously.</p>
        </div>
      </div>
    </div>
  );
}

// ── Tier B: Marketing Hub overlay (two-column, full anatomy) ──────────────
function TierBHubOverlayMock() {
  const [menuOpen, setMenuOpen] = useState(false);

  const navItems = [
    { label: "Human-AI Playbook", desc: "ERI's strategic perspective on the Human-AI landscape — why, what and how" },
    { label: "Platform Overview", desc: "The Exponential Data Lake, Entity Master, and Five Pillars framework" },
    { label: "Applications", desc: "Launch the suite of ERI digital tools and services" },
    { label: "Data Lake", desc: "48,973 unified entities across 12 authoritative climate sources" },
    { label: "Who It's For", desc: "Member companies, professional services, investors, and policy teams" },
    { label: "Five Pillars", desc: "The Exponential Business Playbook framework" },
  ];

  const apps = [
    { num: "01", label: "Exponential Platform", desc: "One workspace for ERI member companies — integrated business & climate data, peer benchmarking, analytics and transition planning", colour: "#3ba559" },
    { num: "02", label: "Professional Services Matrix", desc: "Measure and grow Pillar 3 climate impact — track serviced emissions, assess client portfolio, build an AI-powered roadmap", colour: "#3ba559" },
    { num: "03", label: "Exponential Taxonomy", desc: "Climate Solutions, Transition Support Activities & Fossil Fuel Activities — sourced from Climate Champions, Drawdown, UNFCCC & IPCC", colour: "#17b7dd" },
    { num: "04", label: "Crocodile Economics", desc: "Visualise revenue vs. emissions decoupling across hundreds of companies — filter by sector, industry & country", colour: "#ff8b00" },
    { num: "05", label: "Carbon Removals Action Guide", desc: "A structured, AI-assisted guide to building a corporate carbon removal strategy — six actions from residual emissions to disclosure-ready plan", colour: "#9aa08c" },
    { num: "06", label: "Exponential Framework", desc: "The public home of the Exponential Framework — Five Pillars guide, company transformation stories, and downloadable framework assets", colour: "#ff5133" },
  ];

  const externalLinks = ["Business Playbook", "Exponential Roadmap", "Crocodile Economy"];

  return (
    <div className="rounded-lg overflow-hidden border border-gray-200 shadow-sm">
      {/* Top strip */}
      <div className="h-1 bg-[#2C3F43] w-full" />
      {/* Header */}
      <div className="bg-[#232323] h-16 flex items-center px-6 justify-between">
        <div className="flex items-center gap-3">
          <div className="flex flex-col leading-none">
            <span className="font-archivo font-black text-white text-[10px] tracking-widest uppercase">EXPONENTIAL</span>
            <span className="font-archivo font-black text-white text-[10px] tracking-widest uppercase">ROADMAP <span className="font-normal text-[9px]">INITIATIVE</span></span>
          </div>
          <div className="w-px h-8 bg-white/30 mx-2" />
          <span className="font-archivo font-bold text-white text-sm">The Hub</span>
        </div>
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="text-white p-2 hover:bg-white/10 rounded transition-colors"
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Full overlay */}
      {menuOpen && (
        <div className="bg-white border-t border-gray-100">
          {/* Header row inside overlay */}
          <div className="flex items-center justify-between px-8 py-5 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="flex flex-col leading-none">
                <span className="font-archivo font-black text-[#232323] text-[10px] tracking-widest uppercase">EXPONENTIAL</span>
                <span className="font-archivo font-black text-[#232323] text-[10px] tracking-widest uppercase">ROADMAP <span className="font-normal text-[9px]">INITIATIVE</span></span>
              </div>
              <div className="w-px h-6 bg-gray-300 mx-2" />
              <div>
                <p className="text-[9px] font-archivo font-bold uppercase tracking-widest text-gray-400">EXPONENTIAL PLATFORM</p>
                <p className="font-archivo font-bold text-[#232323] text-sm">The Hub</p>
              </div>
            </div>
            <button onClick={() => setMenuOpen(false)} className="text-gray-400 hover:text-gray-700 transition-colors">
              <X size={20} />
            </button>
          </div>

          {/* Two-column body */}
          <div className="grid grid-cols-2 divide-x divide-gray-100">
            {/* Left: Navigation */}
            <div className="px-8 py-6">
              <p className="text-[10px] font-archivo font-bold uppercase tracking-widest text-gray-400 mb-5">NAVIGATION</p>
              <div className="space-y-1">
                {navItems.map(item => (
                  <div key={item.label} className="group flex items-start justify-between py-2.5 cursor-pointer hover:bg-gray-50 rounded px-2 -mx-2 transition-colors">
                    <div>
                      <p className="font-archivo font-extrabold text-[#232323] text-sm group-hover:text-[#3ba559] transition-colors">{item.label}</p>
                      <p className="text-xs font-open-sans text-gray-500 mt-0.5 leading-snug max-w-xs">{item.desc}</p>
                    </div>
                    <ChevronRight size={14} className="text-gray-300 group-hover:text-[#3ba559] mt-1 flex-shrink-0 transition-colors" />
                  </div>
                ))}
              </div>
              {/* External resources below nav */}
              <div className="mt-6 pt-5 border-t border-gray-100">
                <p className="text-[10px] font-archivo font-bold uppercase tracking-widest text-gray-400 mb-3">EXTERNAL RESOURCES</p>
                <div className="space-y-1">
                  {externalLinks.map(link => (
                    <div key={link} className="flex items-center gap-2 py-1.5 text-sm font-open-sans text-gray-600 hover:text-[#3ba559] cursor-pointer transition-colors">
                      <ExternalLink size={12} className="text-gray-400" />
                      {link}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Applications */}
            <div className="px-8 py-6">
              <p className="text-[10px] font-archivo font-bold uppercase tracking-widest text-gray-400 mb-5">APPLICATIONS</p>
              <div className="space-y-0">
                {apps.map(app => (
                  <div key={app.num} className="group flex items-start gap-3 py-2.5 cursor-pointer hover:bg-gray-50 rounded px-2 -mx-2 transition-colors">
                    <div className="w-0.5 self-stretch rounded-full flex-shrink-0" style={{ backgroundColor: app.colour }} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-archivo font-bold text-gray-400">{app.num}</span>
                        <span className="font-archivo font-bold text-[#232323] text-sm group-hover:text-[#3ba559] transition-colors">{app.label}</span>
                      </div>
                      <p className="text-xs font-open-sans text-gray-500 mt-0.5 leading-snug">{app.desc}</p>
                    </div>
                    <ExternalLink size={12} className="text-gray-300 group-hover:text-[#3ba559] mt-1 flex-shrink-0 transition-colors" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-[#F9FAFB] px-6 py-2 text-[11px] text-gray-400 font-open-sans">
        {menuOpen ? "Overlay open — left: page navigation + external resources · right: numbered application cards with pillar-colour borders" : "Click ☰ to open the full Hub overlay"}
      </div>
    </div>
  );
}

// ── Tier B: Application hamburger overlay (PSM single-column pattern) ──────
function TierBAppOverlayMock() {
  const [menuOpen, setMenuOpen] = useState(false);

  const navItems = [
    { label: "Home", highlight: false },
    { label: "My Workspace", highlight: false },
    { label: "Assess a Client", highlight: false },
    { label: "My Account", highlight: false },
    { label: "About the PSM", highlight: false },
    { label: "Trust & Security", highlight: false },
    { label: "Exponential Taxonomy", highlight: false, external: true },
    { label: "Admin Panel", highlight: true },
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
          <span className="font-archivo font-bold text-[#383838] text-sm">Professional Services Matrix</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] border border-gray-300 rounded-full px-2 py-0.5 font-open-sans text-gray-500">BETA</span>
          <span className="text-[10px] text-gray-400 font-open-sans">V.2026.04.08</span>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-gray-500 p-2 hover:bg-gray-100 rounded transition-colors ml-1"
          >
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="bg-white border border-gray-200 rounded-lg shadow-xl mx-4 my-2 overflow-hidden" style={{ maxWidth: 320 }}>
          {/* Close button */}
          <div className="flex justify-end px-4 pt-4 pb-1">
            <button onClick={() => setMenuOpen(false)} className="text-gray-400 hover:text-gray-700 transition-colors">
              <X size={18} />
            </button>
          </div>
          {/* Nav items */}
          <div className="px-4 pb-2">
            {navItems.map(item => (
              <div
                key={item.label}
                className={`flex items-center justify-between py-2.5 px-2 -mx-2 rounded cursor-pointer transition-colors ${
                  item.highlight ? "text-[#3ba559] hover:bg-green-50" : "text-[#232323] hover:bg-gray-50"
                }`}
              >
                <span className="font-open-sans text-sm">{item.label}</span>
                {item.external && <ExternalLink size={12} className="text-gray-400" />}
              </div>
            ))}
          </div>
          {/* User identity footer */}
          <div className="border-t border-gray-100 px-6 py-4 mt-2">
            <p className="font-open-sans font-semibold text-sm text-[#232323]">nicklas.lemon</p>
            <p className="font-open-sans text-xs text-gray-500">nicklas.lemon@exponentialroad…</p>
            <p className="font-open-sans text-xs text-[#3ba559] font-medium mt-0.5">ERI Admin</p>
          </div>
          <div className="px-4 pb-4">
            <button className="w-full flex items-center justify-center gap-2 border border-[#232323] rounded px-4 py-2 text-sm font-open-sans text-[#232323] hover:bg-gray-50 transition-colors">
              <LogOut size={14} />
              Logout
            </button>
          </div>
        </div>
      )}

      <div className="bg-[#F9FAFB] px-6 py-2 text-[11px] text-gray-400 font-open-sans">
        {menuOpen ? "Single-column overlay — nav items + role-based highlight + user identity footer + logout CTA" : "Click ☰ to open the application overlay"}
      </div>
    </div>
  );
}

// ── Tier C: Persistent left sidebar ───────────────────────────────────────
function TierCSidebarMock() {
  const [activePage, setActivePage] = useState("admin-dashboard");

  const navGroups = [
    {
      label: null,
      items: [
        { id: "admin-dashboard", label: "Admin Dashboard", icon: <LayoutDashboard size={15} /> },
        { id: "system-health", label: "System Health", icon: <Activity size={15} /> },
        { id: "data-lake", label: "ERI Data Lake", icon: <Database size={15} /> },
        { id: "data-hub", label: "Data Hub", icon: <BarChart2 size={15} /> },
        { id: "architecture", label: "Data Lake Architecture", icon: <Database size={15} /> },
        { id: "criteria", label: "Assessment Criteria", icon: <FileText size={15} /> },
        { id: "templates", label: "Copy Templates", icon: <Copy size={15} /> },
      ],
    },
    {
      label: "PSM APPLICATION",
      items: [
        { id: "members", label: "ERI Members (Public)", icon: <Users size={15} /> },
        { id: "psm", label: "PSM Application", icon: <BarChart2 size={15} /> },
      ],
    },
    {
      label: null,
      items: [
        { id: "user-mgmt", label: "ERI User Management", icon: <UserCog size={15} /> },
        { id: "workspace-members", label: "Workspace Members", icon: <Users size={15} /> },
        { id: "audit", label: "Security Audit Log", icon: <FileText size={15} /> },
        { id: "trust", label: "Trust & Security", icon: <Shield size={15} /> },
      ],
    },
  ];

  return (
    <div className="rounded-lg overflow-hidden border border-gray-200 shadow-sm">
      <div className="h-1 bg-[#2C3F43] w-full" />
      <div className="flex" style={{ height: 380 }}>
        {/* Sidebar */}
        <div className="w-56 flex-shrink-0 bg-white border-r border-gray-200 flex flex-col overflow-y-auto">
          {/* App identity */}
          <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-2">
            <div className="w-7 h-7 rounded bg-gray-100 flex items-center justify-center">
              <span className="text-[9px] font-archivo font-black text-[#232323]">App</span>
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-archivo font-bold text-[#232323] truncate">ERI Professional Serv…</p>
            </div>
          </div>

          {/* Nav groups */}
          <div className="flex-1 py-2 overflow-y-auto">
            {navGroups.map((group, gi) => (
              <div key={gi} className={gi > 0 ? "mt-1" : ""}>
                {group.label && (
                  <p className="px-4 pt-3 pb-1 text-[9px] font-archivo font-bold uppercase tracking-widest text-gray-400">{group.label}</p>
                )}
                {group.items.map(item => (
                  <button
                    key={item.id}
                    onClick={() => setActivePage(item.id)}
                    className={`w-full flex items-center gap-2.5 px-4 py-2 text-left transition-colors text-[12px] font-open-sans ${
                      activePage === item.id
                        ? "bg-green-50 text-[#3ba559] font-semibold border-l-2 border-[#3ba559]"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 border-l-2 border-transparent"
                    }`}
                  >
                    <span className={activePage === item.id ? "text-[#3ba559]" : "text-gray-400"}>{item.icon}</span>
                    {item.label}
                  </button>
                ))}
              </div>
            ))}
          </div>

          {/* User identity footer */}
          <div className="border-t border-gray-100 px-4 py-3 flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-[#232323] flex items-center justify-center flex-shrink-0">
              <span className="text-white text-[10px] font-archivo font-bold">N</span>
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-open-sans font-semibold text-[#232323] truncate">nicklas.lemon</p>
              <p className="text-[9px] font-open-sans text-gray-400 truncate">nicklas.lemon@exponentialroad…</p>
            </div>
          </div>
        </div>

        {/* Main content area */}
        <div className="flex-1 bg-[#F9FAFB] p-5 overflow-hidden">
          <div className="mb-1">
            <h2 className="font-archivo font-extrabold text-base text-[#232323]">
              {navGroups.flatMap(g => g.items).find(i => i.id === activePage)?.label ?? "Dashboard"}
            </h2>
            <p className="text-xs font-open-sans text-gray-500 mt-0.5">Click any sidebar item to navigate</p>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-3">
            {["Total Workspaces", "Active Workspaces", "Credits Allocated"].map((label, i) => (
              <div key={label} className="bg-white rounded-lg border border-gray-200 p-3">
                <p className="text-[10px] font-open-sans text-gray-500">{label}</p>
                <p className="font-archivo font-extrabold text-lg text-[#232323] mt-1">{[3, 3, "11,999"][i]}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="bg-[#F9FAFB] px-6 py-2 text-[11px] text-gray-400 font-open-sans border-t border-gray-200">
        Active: <span className="text-[#3ba559] font-medium">{navGroups.flatMap(g => g.items).find(i => i.id === activePage)?.label}</span> — green left border + green text + light green bg
      </div>
    </div>
  );
}

// ── Tier A + Landing Hero: transparent header over dark hero → white on interior ──
function TierALandingHeroMock() {
  const [view, setView] = useState<"landing" | "interior">("landing");
  const [activeTab, setActiveTab] = useState("solutions");
  const HANDS_URL = "https://d2xsxph8kpxj0f.cloudfront.net/310519663319595517/5mtZtU66sMbsnmPoVbf6UJ/hal-hero-human-v2-hands_75d155b6.png";
  const tabs = [
    { id: "solutions",  label: "Climate Solutions" },
    { id: "fossil",     label: "Fossil Fuel Activities" },
    { id: "transition", label: "Transition Support" },
    { id: "sources",    label: "Trusted Sources" },
    { id: "api",        label: "API Docs" },
  ];
  return (
    <div className="rounded-lg overflow-hidden border border-gray-200 shadow-sm">
      {/* Toggle */}
      <div className="bg-gray-50 border-b border-gray-200 px-4 py-2 flex items-center gap-3">
        <span className="text-[11px] font-archivo font-bold uppercase tracking-wider text-gray-400">View:</span>
        <button
          onClick={() => setView("landing")}
          className={`text-xs px-3 py-1 rounded font-open-sans font-medium transition-colors ${
            view === "landing" ? "bg-[#232323] text-white" : "bg-white border border-gray-300 text-gray-600 hover:bg-gray-100"
          }`}
        >
          Landing page (<code className="font-mono">/</code>)
        </button>
        <button
          onClick={() => setView("interior")}
          className={`text-xs px-3 py-1 rounded font-open-sans font-medium transition-colors ${
            view === "interior" ? "bg-[#3ba559] text-white" : "bg-white border border-gray-300 text-gray-600 hover:bg-gray-100"
          }`}
        >
          Interior page (/solutions)
        </button>
      </div>

      {view === "landing" ? (
        /* ── Landing page: dark hero with transparent header ── */
        <div
          className="relative"
          style={{
            backgroundImage: `url(${HANDS_URL})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            minHeight: 260,
          }}
        >
          {/* Dark overlay */}
          <div className="absolute inset-0" style={{ background: "rgba(35,35,35,0.83)" }} />
          {/* Transparent header */}
          <div className="relative z-10">
            <div className="h-1 bg-[#2C3F43] w-full" />
            <div className="h-16 flex items-center px-6 justify-between" style={{ background: "transparent" }}>
              <div className="flex items-center gap-3">
                <div className="flex flex-col leading-none">
                  <span className="font-archivo font-black text-white text-[10px] tracking-widest uppercase">EXPONENTIAL</span>
                  <span className="font-archivo font-black text-white text-[10px] tracking-widest uppercase">ROADMAP <span className="font-normal text-[9px]">INITIATIVE</span></span>
                </div>
                <div className="w-px h-8 bg-white/30 mx-2" />
                <span className="font-archivo font-bold text-white text-sm">Exponential Taxonomy</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] border border-white/40 rounded-full px-2 py-0.5 font-open-sans text-white/80">BETA</span>
                <span className="text-[10px] text-white/60 font-open-sans">V.2026.04</span>
                <button className="text-white/80 p-2 hover:bg-white/10 rounded transition-colors">
                  <Menu size={18} />
                </button>
              </div>
            </div>
            {/* Hero content */}
            <div className="px-8 pb-10 pt-4 text-center">
              <p className="text-[10px] font-archivo font-bold uppercase tracking-[0.2em] text-[#93E07D] mb-3">Exponential Roadmap Initiative</p>
              <h1 className="font-archivo font-extrabold text-2xl text-white leading-tight mb-3">
                <span className="text-[#93E07D]">Science-Backed</span><br />Climate Solutions
              </h1>
              <p className="text-white/70 text-xs font-open-sans mb-5 max-w-xs mx-auto">114 Climate Solutions · 31 Fossil Fuel Activities · 17 Transition Support Activities</p>
              <button className="bg-[#93E07D] text-[#232323] font-archivo font-bold text-xs px-5 py-2 rounded-full hover:bg-[#7ecf68] transition-colors">
                Explore Climate Solutions
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* ── Interior page: white header + tab bar ── */
        <div>
          <div className="h-1 bg-[#2C3F43] w-full" />
          <div className="bg-white h-16 flex items-center px-6 justify-between border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="flex flex-col leading-none">
                <span className="font-archivo font-black text-[#232323] text-[10px] tracking-widest uppercase">EXPONENTIAL</span>
                <span className="font-archivo font-black text-[#232323] text-[10px] tracking-widest uppercase">ROADMAP <span className="font-normal text-[9px]">INITIATIVE</span></span>
              </div>
              <div className="w-px h-8 bg-gray-300 mx-2" />
              <span className="font-archivo font-bold text-[#383838] text-sm">Exponential Taxonomy</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] border border-gray-300 rounded-full px-2 py-0.5 font-open-sans text-gray-500">BETA</span>
              <span className="text-[10px] text-gray-400 font-open-sans">V.2026.04</span>
              <button className="text-gray-500 p-2 hover:bg-gray-100 rounded transition-colors">
                <Menu size={18} />
              </button>
            </div>
          </div>
          <div className="bg-white border-b border-gray-200 px-6 flex overflow-x-auto">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-shrink-0 px-4 py-3 text-xs font-open-sans font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? "border-[#3ba559] text-[#3ba559]"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <div className="bg-[#F9FAFB] px-6 py-8 text-center">
            <p className="font-archivo font-extrabold text-base text-[#232323] mb-1">{tabs.find(t => t.id === activeTab)?.label}</p>
            <p className="text-xs font-open-sans text-gray-400">White header · solid · tab bar below · #F9FAFB page background</p>
          </div>
        </div>
      )}

      <div className="bg-[#F9FAFB] px-4 py-2 text-[11px] text-gray-400 font-open-sans border-t border-gray-200">
        {view === "landing"
          ? "Landing page — transparent header over dark hero · Accent Lime accent word · pill CTA"
          : `Interior page — white solid header · tab bar · active: ${tabs.find(t => t.id === activeTab)?.label}`}
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
      <div className="w-3 h-3 rounded-sm flex-shrink-0" style={{ backgroundColor: colour }} />
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
          All ERI web applications follow one of three navigation tiers. The tier is determined by the
          application type — not by personal preference. Consistency across all apps reduces the
          learning curve for users who move between tools.
        </p>
      </div>

      {/* ── Tier overview table ── */}
      <div>
        <h3 className="font-archivo font-extrabold text-lg text-foreground mb-4">Layout & Navigation Tiers</h3>
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
                <td className="py-3 pr-6 text-gray-700">Data tools, reference apps, single-workflow — no public landing page<br /><span className="text-xs text-gray-400">Crocodile Economy</span></td>
                <td className="py-3 pr-6 font-mono text-xs text-[#3ba559]">max-w-screen-xl (1280px)</td>
                <td className="py-3 pr-6 text-gray-700">White, always solid</td>
                <td className="py-3 text-gray-700">Header + tab bar</td>
              </tr>
              <tr className="border-b border-gray-100 bg-green-50/40">
                <td className="py-3 pr-6 font-bold text-[#232323]">Tier A + Landing Hero<br /><span className="text-xs font-normal text-gray-500">Application</span></td>
                <td className="py-3 pr-6 text-gray-700">Data / reference apps with a public-facing landing page that benefits from a visual hero<br /><span className="text-xs text-gray-400">Exponential Taxonomy</span></td>
                <td className="py-3 pr-6 font-mono text-xs text-[#3ba559]">max-w-screen-xl (1280px)</td>
                <td className="py-3 pr-6 text-gray-700">Transparent over dark hero on <code className="font-mono text-xs">/</code> → white solid on interior pages</td>
                <td className="py-3 text-gray-700">Dark hero (landing) → Header + tab bar (interior)</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-3 pr-6 font-bold text-[#232323]">Tier A Workflow<br /><span className="text-xs font-normal text-gray-500">Application</span></td>
                <td className="py-3 pr-6 text-gray-700">Multi-step workflow tools, enterprise apps<br /><span className="text-xs text-gray-400">PSM, future workflow tools</span></td>
                <td className="py-3 pr-6 font-mono text-xs text-[#3ba559]">max-w-screen-xl (1280px)</td>
                <td className="py-3 pr-6 text-gray-700">White, always solid</td>
                <td className="py-3 text-gray-700">Header + context bar + workflow stepper + tab bar</td>
              </tr>
              <tr>
                <td className="py-3 pr-6 font-bold text-[#232323]">Tier C<br /><span className="text-xs font-normal text-gray-500">Admin / Tool</span></td>
                <td className="py-3 pr-6 text-gray-700">Admin dashboards, multi-section tools<br /><span className="text-xs text-gray-400">PSM Admin, ERI Data Lake, future admin panels</span></td>
                <td className="py-3 pr-6 font-mono text-xs text-[#3ba559]">full width</td>
                <td className="py-3 pr-6 text-gray-700">White, always solid</td>
                <td className="py-3 text-gray-700">Persistent left sidebar + header with hamburger</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Shared header spec ── */}
      <div>
        <h3 className="font-archivo font-extrabold text-lg text-foreground mb-2">Shared Header Specification</h3>
        <p className="text-gray-600 font-open-sans text-sm mb-6">These rules apply to <strong>all</strong> ERI web applications regardless of tier.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-[#F9FAFB] rounded-lg p-5 border border-gray-200">
            <h4 className="font-archivo font-bold text-sm text-foreground mb-3">Header Anatomy</h4>
            <AnatomyRow label="Top strip" height="4px" colour="#2C3F43" description="Dark teal (#2C3F43) — always present, full width" />
            <AnatomyRow label="Header" height="64px" colour="#232323" description="Dark (#232323) for Tier B; white for Tier A & C; transparent over hero for Tier A + Landing Hero (landing page only)" />
            <AnatomyRow label="Logo" height="—" colour="#3ba559" description="ERI logo left, vertical divider, app title right — single line, no supertitle" />
            <AnatomyRow label="Hamburger" height="—" colour="#6b7280" description="Top right — always present, even when tabs or sidebar exist" />
          </div>
          <div className="bg-[#F9FAFB] rounded-lg p-5 border border-gray-200">
            <h4 className="font-archivo font-bold text-sm text-foreground mb-3">Header Rules</h4>
            <div className="space-y-2 text-xs font-open-sans text-gray-700">
              <div className="flex gap-2"><span className="text-[#3ba559] font-bold mt-0.5">✓</span><span>Logo is always the ERI wordmark — never replaced with an app-specific logo</span></div>
              <div className="flex gap-2"><span className="text-[#3ba559] font-bold mt-0.5">✓</span><span>App title uses Archivo Bold, single line — no supertitle above it</span></div>
              <div className="flex gap-2"><span className="text-[#3ba559] font-bold mt-0.5">✓</span><span>Header height is always 64px — never taller or shorter</span></div>
              <div className="flex gap-2"><span className="text-[#3ba559] font-bold mt-0.5">✓</span><span>4px dark teal top strip is always present — it is the first visual element</span></div>
              <div className="flex gap-2"><span className="text-[#3ba559] font-bold mt-0.5">✓</span><span>Status badge (right zone): transparent outlined pill — <code className="font-mono bg-gray-100 px-1 rounded">rounded-full border border-current text-[11px] font-semibold tracking-widest uppercase px-2.5 py-0.5</code>. Values: ALPHA / BETA / PREVIEW / LIVE. On dark: <code className="font-mono bg-gray-100 px-1 rounded">text-white border-white/60</code>. On white: <code className="font-mono bg-gray-100 px-1 rounded">text-gray-500 border-gray-400</code>.</span></div>
              <div className="flex gap-2"><span className="text-[#3ba559] font-bold mt-0.5">✓</span><span><strong>Tier B only</strong> — one optional CTA button in header right zone (between version and hamburger): <code className="font-mono bg-gray-100 px-1 rounded">bg-[#93E07D] text-[#1a1a1a] rounded-lg px-4 py-2 text-sm font-semibold</code>. Tier A apps: no CTA in header.</span></div>
              <div className="flex gap-2"><span className="text-red-500 font-bold mt-0.5">✗</span><span>Do not add inline nav links inside the header bar — use the tab bar or sidebar instead</span></div>
              <div className="flex gap-2"><span className="text-red-500 font-bold mt-0.5">✗</span><span>Do not make the header transparent on scroll for Tier A or Tier C <em>interior</em> pages — only on the public landing page of a Tier A + Landing Hero app</span></div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Tier B: Hub overlay ── */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <span className="bg-[#232323] text-white text-xs font-archivo font-bold px-2 py-0.5 rounded">TIER B — HUB OVERLAY</span>
          <h3 className="font-archivo font-extrabold text-lg text-foreground">Marketing — Full Two-Column Overlay</h3>
        </div>
        <p className="text-gray-600 font-open-sans text-sm mb-5 max-w-3xl">
          Used for content-led sites and the ERI Hub. The hamburger opens a full-screen overlay with two
          columns: <strong>Navigation</strong> on the left (large bold section titles with descriptions and a
          right-arrow) and <strong>Applications</strong> on the right (numbered cards with a pillar-colour left
          border and an external-link icon). External Resources appear below the navigation column as a
          compact link list.
        </p>
        <TierBHubOverlayMock />
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-[#F9FAFB] rounded-lg p-4 border border-gray-200">
            <p className="text-[11px] font-archivo font-bold uppercase tracking-wider text-gray-400 mb-2">Left column — Navigation</p>
            <p className="text-xs font-open-sans text-gray-700">Bold section titles (Archivo ExtraBold) + one-line description (Open Sans) + right-arrow chevron. Hover turns title and arrow green.</p>
          </div>
          <div className="bg-[#F9FAFB] rounded-lg p-4 border border-gray-200">
            <p className="text-[11px] font-archivo font-bold uppercase tracking-wider text-gray-400 mb-2">Right column — Applications</p>
            <p className="text-xs font-open-sans text-gray-700">Numbered application cards (01–06). Each has a 2px left border in the relevant pillar colour, a bold title, a description, and an external-link icon.</p>
          </div>
          <div className="bg-[#F9FAFB] rounded-lg p-4 border border-gray-200">
            <p className="text-[11px] font-archivo font-bold uppercase tracking-wider text-gray-400 mb-2">External Resources</p>
            <p className="text-xs font-open-sans text-gray-700">Below the navigation column, separated by a rule. Small caps label "EXTERNAL RESOURCES", then compact link list with external-link icons.</p>
          </div>
        </div>

        {/* Live example */}
        <div className="mt-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="bg-[#3ba559] text-white text-[10px] font-archivo font-bold px-2 py-0.5 rounded uppercase tracking-wider">Live Example</span>
            <span className="text-xs font-archivo font-bold text-[#232323]">Human-AI Lab — Hub Overlay open</span>
          </div>
          <div className="rounded-xl overflow-hidden border border-gray-200 shadow-sm">
            <img
              src="https://d2xsxph8kpxj0f.cloudfront.net/310519663319595517/5mtZtU66sMbsnmPoVbf6UJ/hal-hub-overlay-new_1d389fa7.png"
              alt="Human-AI Lab Hub Overlay — full-screen dark #232323 background, two-column layout with Navigation on the left and numbered Application cards on the right, Contact Us in Primary Green, External Resources section at the bottom left"
              className="w-full block"
            />
          </div>
          <div className="mt-3 grid grid-cols-1 md:grid-cols-4 gap-3">
            <div className="bg-[#F9FAFB] rounded-lg p-3 border border-gray-200">
              <p className="text-[10px] font-archivo font-bold uppercase tracking-wider text-[#3ba559] mb-1">✓ Background #232323</p>
              <p className="text-[11px] font-open-sans text-gray-600">Dark neutral surface — not green-tinted. Applies to both columns and the header bar.</p>
            </div>
            <div className="bg-[#F9FAFB] rounded-lg p-3 border border-gray-200">
              <p className="text-[10px] font-archivo font-bold uppercase tracking-wider text-[#3ba559] mb-1">✓ Two-column layout</p>
              <p className="text-[11px] font-open-sans text-gray-600">Navigation left, Applications right. Divider line separates the columns.</p>
            </div>
            <div className="bg-[#F9FAFB] rounded-lg p-3 border border-gray-200">
              <p className="text-[10px] font-archivo font-bold uppercase tracking-wider text-[#3ba559] mb-1">✓ Pillar-colour borders</p>
              <p className="text-[11px] font-open-sans text-gray-600">Each application card has a 2px left border in its pillar colour — green, teal, orange, purple.</p>
            </div>
            <div className="bg-[#F9FAFB] rounded-lg p-3 border border-gray-200">
              <p className="text-[10px] font-archivo font-bold uppercase tracking-wider text-[#3ba559] mb-1">✓ Contact Us green</p>
              <p className="text-[11px] font-open-sans text-gray-600">"Contact Us" link in Primary Green <code className="bg-gray-100 px-1 rounded">#3ba559</code> — the only coloured nav item.</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Tier B: Application overlay ── */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <span className="bg-[#232323] text-white text-xs font-archivo font-bold px-2 py-0.5 rounded">TIER B — APP OVERLAY</span>
          <h3 className="font-archivo font-extrabold text-lg text-foreground">Application — Single-Column Hamburger Overlay</h3>
        </div>
        <p className="text-gray-600 font-open-sans text-sm mb-5 max-w-3xl">
          Used for authenticated application pages (e.g. PSM). The hamburger opens a compact floating panel
          anchored to the top-right corner. It contains a single-column nav list, role-based highlighted
          items (e.g. Admin Panel in green), and a user identity footer with name, email, role, and a
          Logout CTA.
        </p>
        <TierBAppOverlayMock />
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-[#F9FAFB] rounded-lg p-4 border border-gray-200">
            <p className="text-[11px] font-archivo font-bold uppercase tracking-wider text-gray-400 mb-2">Nav items</p>
            <p className="text-xs font-open-sans text-gray-700">Single column, Open Sans Regular 14px. Role-based items (e.g. Admin Panel) are highlighted in Primary Green. External links show an external-link icon.</p>
          </div>
          <div className="bg-[#F9FAFB] rounded-lg p-4 border border-gray-200">
            <p className="text-[11px] font-archivo font-bold uppercase tracking-wider text-gray-400 mb-2">User identity footer</p>
            <p className="text-xs font-open-sans text-gray-700">Always at the bottom: display name (semibold), email (truncated, grey), role label (green). Separated from nav by a rule.</p>
          </div>
          <div className="bg-[#F9FAFB] rounded-lg p-4 border border-gray-200">
            <p className="text-[11px] font-archivo font-bold uppercase tracking-wider text-gray-400 mb-2">Logout CTA</p>
            <p className="text-xs font-open-sans text-gray-700">Full-width outlined button below the user footer. Uses the dark border (#232323) with a logout icon. Never use a destructive red colour here.</p>
          </div>
        </div>

        {/* Live example */}
        <div className="mt-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="bg-[#3ba559] text-white text-[10px] font-archivo font-bold px-2 py-0.5 rounded uppercase tracking-wider">Live Example</span>
            <span className="text-xs font-archivo font-bold text-[#232323]">Exponential Taxonomy — App Overlay open on landing page</span>
          </div>
          <div className="rounded-xl overflow-hidden border border-gray-200 shadow-sm">
            <img
              src="https://d2xsxph8kpxj0f.cloudfront.net/310519663319595517/5mtZtU66sMbsnmPoVbf6UJ/taxonomy-app-overlay-new_e543abd3.png"
              alt="Exponential Taxonomy app overlay open — dark floating panel anchored top-right, showing nav items, Admin Workspace in green, user identity footer, and Log Out button, with the hero image and content visible behind it"
              className="w-full block"
            />
          </div>
          <div className="mt-3 grid grid-cols-1 md:grid-cols-4 gap-3">
            <div className="bg-[#F9FAFB] rounded-lg p-3 border border-gray-200">
              <p className="text-[10px] font-archivo font-bold uppercase tracking-wider text-[#3ba559] mb-1">✓ Dark panel bg</p>
              <p className="text-[11px] font-open-sans text-gray-600"><code className="bg-gray-100 px-1 rounded">#232323</code> surface — not white or grey</p>
            </div>
            <div className="bg-[#F9FAFB] rounded-lg p-3 border border-gray-200">
              <p className="text-[10px] font-archivo font-bold uppercase tracking-wider text-[#3ba559] mb-1">✓ Active item</p>
              <p className="text-[11px] font-open-sans text-gray-600">"Home" in Primary Green — inactive items in white/light text</p>
            </div>
            <div className="bg-[#F9FAFB] rounded-lg p-3 border border-gray-200">
              <p className="text-[10px] font-archivo font-bold uppercase tracking-wider text-[#3ba559] mb-1">✓ Admin link</p>
              <p className="text-[11px] font-open-sans text-gray-600">"Admin Workspace" in Primary Green with external-link icon</p>
            </div>
            <div className="bg-[#F9FAFB] rounded-lg p-3 border border-gray-200">
              <p className="text-[10px] font-archivo font-bold uppercase tracking-wider text-[#3ba559] mb-1">✓ Content behind</p>
              <p className="text-[11px] font-open-sans text-gray-600">Hero image and page content remain visible — panel overlays right side only</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Tier C: Persistent sidebar ── */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <span className="bg-[#3ba559] text-white text-xs font-archivo font-bold px-2 py-0.5 rounded">TIER C</span>
          <h3 className="font-archivo font-extrabold text-lg text-foreground">Admin / Tool — Persistent Left Sidebar</h3>
        </div>
        <p className="text-gray-600 font-open-sans text-sm mb-5 max-w-3xl">
          Used for admin dashboards and multi-section tools where the user needs persistent access to all
          sections without losing their place. The sidebar is always visible on desktop — it does not collapse
          unless the viewport is below the mobile breakpoint. The hamburger in the header is retained for
          mobile and for the user overlay.
        </p>
        <TierCSidebarMock />
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-[#F9FAFB] rounded-lg p-5 border border-gray-200">
            <h4 className="font-archivo font-bold text-sm text-foreground mb-3">Sidebar Anatomy</h4>
            <AnatomyRow label="App identity" height="48px" colour="#f3f4f6" description="App icon + truncated app name — top of sidebar" />
            <AnatomyRow label="Nav item" height="36px" colour="#ffffff" description="Icon + label, Open Sans 12px — inactive state" />
            <AnatomyRow label="Active item" height="36px" colour="#f0fdf4" description="Green-50 bg + 2px left border (#3ba559) + green text + green icon" />
            <AnatomyRow label="Section label" height="24px" colour="#f9fafb" description="Small caps, 9px, grey — groups related items" />
            <AnatomyRow label="User footer" height="52px" colour="#f9fafb" description="Avatar initial + display name + truncated email — always at bottom" />
          </div>
          <div className="bg-[#F9FAFB] rounded-lg p-5 border border-gray-200">
            <h4 className="font-archivo font-bold text-sm text-foreground mb-3">Sidebar Rules</h4>
            <div className="space-y-2 text-xs font-open-sans text-gray-700">
              <div className="flex gap-2"><span className="text-[#3ba559] font-bold mt-0.5">✓</span><span>Sidebar width: 224px (14rem / w-56) — fixed, never resizable</span></div>
              <div className="flex gap-2"><span className="text-[#3ba559] font-bold mt-0.5">✓</span><span>Active item: green-50 background + 2px left border in #3ba559 + green text + green icon</span></div>
              <div className="flex gap-2"><span className="text-[#3ba559] font-bold mt-0.5">✓</span><span>Inactive item: transparent bg + grey icon + grey text — hover shows grey-50 bg</span></div>
              <div className="flex gap-2"><span className="text-[#3ba559] font-bold mt-0.5">✓</span><span>Section labels use 9px Archivo Bold, uppercase, tracked — never use a divider line alone</span></div>
              <div className="flex gap-2"><span className="text-[#3ba559] font-bold mt-0.5">✓</span><span>User identity footer is always present — shows name, email, and role</span></div>
              <div className="flex gap-2"><span className="text-red-500 font-bold mt-0.5">✗</span><span>Do not use icons without labels in the sidebar — always pair icon with text</span></div>
              <div className="flex gap-2"><span className="text-red-500 font-bold mt-0.5">✗</span><span>Do not collapse the sidebar to an icon-only rail — use the hamburger for mobile instead</span></div>
              <div className="flex gap-2"><span className="text-red-500 font-bold mt-0.5">✗</span><span>Do not use the sidebar pattern for apps with fewer than 6 distinct sections — use tabs instead</span></div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Tier C: Mobile drawer ── */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <span className="bg-[#3ba559] text-white text-xs font-archivo font-bold px-2 py-0.5 rounded">TIER C</span>
          <h3 className="font-archivo font-extrabold text-lg text-foreground">Mobile — Hamburger-Triggered Slide-In Drawer</h3>
        </div>
        <p className="text-gray-600 font-open-sans text-sm mb-5 max-w-3xl">
          Below the <code className="bg-gray-100 px-1 rounded text-xs">lg</code> breakpoint (1024px) the persistent sidebar is hidden entirely.
          A hamburger button in the header triggers a full-height drawer that slides in from the left over a semi-transparent backdrop.
          The drawer contains the same navigation groups, active states, and user footer as the desktop sidebar.
          Tap the interactive mock on the left to see the animation.
        </p>
        <TierCMobileDrawerMock />
      </div>

      {/* ── Tier A Simple live example ── */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <span className="bg-[#3ba559] text-white text-xs font-archivo font-bold px-2 py-0.5 rounded">TIER A SIMPLE</span>
          <h3 className="font-archivo font-extrabold text-lg text-foreground">Application — Header + Tab Bar</h3>
        </div>
        <p className="text-gray-600 font-open-sans text-sm mb-5">
          Used for data tools and single-workflow apps with no public landing page. White header with the tab bar directly below.
          Active tab is underlined in Primary Green. The hamburger opens the single-column application
          overlay (see above).
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

      {/* ── Tier A + Landing Hero ── */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <span className="bg-[#3ba559] text-white text-xs font-archivo font-bold px-2 py-0.5 rounded">TIER A + LANDING HERO</span>
          <h3 className="font-archivo font-extrabold text-lg text-foreground">Application with Public Landing Page — Dark Hero → White App Interior</h3>
        </div>
        <p className="text-gray-600 font-open-sans text-sm mb-3 max-w-3xl">
          Used when a Tier A data application has a public-facing landing page that benefits from a visual hero.
          The landing page (<code className="bg-gray-100 px-1 rounded text-xs">/</code>) uses the standard dark image hero pattern with a transparent header.
          Once the user navigates into the application interior (tab bar pages), the header becomes white and solid.
          The app is still classified as <strong>Tier A</strong> — the tier does not change.
        </p>
        <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 mb-5 flex gap-3">
          <span className="text-amber-600 font-bold text-sm shrink-0">!</span>
          <p className="text-xs font-open-sans text-amber-800">
            <strong>When to use this pattern vs Tier B:</strong> If the app has a data/tool interior with tabs, use Tier A + Landing Hero.
            If the entire site is editorial or marketing content (no tab-bar app interior), use Tier B.
            The Exponential Taxonomy is Tier A + Landing Hero. Human-AI Lab is Tier B.
          </p>
        </div>
        <TierALandingHeroMock />
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-[#F9FAFB] rounded-lg p-5 border border-gray-200">
            <h4 className="font-archivo font-bold text-sm text-foreground mb-3">Landing Page Rules</h4>
            <div className="space-y-2 text-xs font-open-sans text-gray-700">
              <div className="flex gap-2"><span className="text-[#3ba559] font-bold mt-0.5">✓</span><span>Use <code className="bg-gray-100 px-1 rounded">transparentHeader</code> prop on the landing page only — header becomes transparent until scrolled</span></div>
              <div className="flex gap-2"><span className="text-[#3ba559] font-bold mt-0.5">✓</span><span>Hero image: <code className="bg-gray-100 px-1 rounded">heroImages.halHandsTouching</code> (primary) — full-bleed, <code className="bg-gray-100 px-1 rounded">#232323</code> overlay at 80–85% opacity</span></div>
              <div className="flex gap-2"><span className="text-[#3ba559] font-bold mt-0.5">✓</span><span>Heading: white Archivo ExtraBold — first word or key phrase in Accent Lime <code className="bg-gray-100 px-1 rounded">#93E07D</code></span></div>
              <div className="flex gap-2"><span className="text-[#3ba559] font-bold mt-0.5">✓</span><span>CTA button: Accent Lime background, dark text — pill-shaped marketing CTA style</span></div>
              <div className="flex gap-2"><span className="text-[#3ba559] font-bold mt-0.5">✓</span><span>Stat counters below hero: white background, large Archivo numbers, Primary Green accent</span></div>
              <div className="flex gap-2"><span className="text-red-500 font-bold mt-0.5">✗</span><span>Do not use a transparent header on interior tab pages — white solid only</span></div>
              <div className="flex gap-2"><span className="text-red-500 font-bold mt-0.5">✗</span><span>Do not add a tab bar to the landing page — tabs appear only in the app interior</span></div>
            </div>
          </div>
          <div className="bg-[#F9FAFB] rounded-lg p-5 border border-gray-200">
            <h4 className="font-archivo font-bold text-sm text-foreground mb-3">Interior Page Rules</h4>
            <div className="space-y-2 text-xs font-open-sans text-gray-700">
              <div className="flex gap-2"><span className="text-[#3ba559] font-bold mt-0.5">✓</span><span>All interior pages use the standard white Tier A Simple header — no transparency</span></div>
              <div className="flex gap-2"><span className="text-[#3ba559] font-bold mt-0.5">✓</span><span>Tab bar appears immediately below the white header — same as Tier A Simple</span></div>
              <div className="flex gap-2"><span className="text-[#3ba559] font-bold mt-0.5">✓</span><span>Page background: <code className="bg-gray-100 px-1 rounded">#F9FAFB</code> — same as all Tier A apps</span></div>
              <div className="flex gap-2"><span className="text-[#3ba559] font-bold mt-0.5">✓</span><span>The landing page CTA buttons navigate to the first tab of the app interior</span></div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Tier A Workflow live example ── */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <span className="bg-[#3ba559] text-white text-xs font-archivo font-bold px-2 py-0.5 rounded">TIER A WORKFLOW</span>
          <h3 className="font-archivo font-extrabold text-lg text-foreground">Application — Header + Context Bar + Stepper + Tab Bar</h3>
        </div>
        <p className="text-gray-600 font-open-sans text-sm mb-5">
          Used for multi-step workflow tools. Four navigation layers sit between the top strip and the page
          content. Click any step in the stepper to see how the tab bar updates per stage.
        </p>
        <TierAWorkflowHeaderMock />
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-[#F9FAFB] rounded-lg p-4 border border-gray-200">
            <h4 className="font-archivo font-bold text-sm text-foreground mb-3">Four Navigation Layers</h4>
            <AnatomyRow label="Header" height="64px" colour="#ffffff" description="Logo + app title + Beta badge + version + hamburger" />
            <AnatomyRow label="Context bar" height="36px" colour="#f3f4f6" description="Breadcrumb (workspace / user / credits) + utility links" />
            <AnatomyRow label="Stepper" height="80px" colour="#f9fafb" description="Numbered stage circles with connecting lines — sequential" />
            <AnatomyRow label="Tab bar" height="44px" colour="#ffffff" description="Tabs for the selected stage — updates when stage changes" />
          </div>
          <div className="bg-[#F9FAFB] rounded-lg p-4 border border-gray-200">
            <h4 className="font-archivo font-bold text-sm text-foreground mb-3">Stepper Rules</h4>
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

      {/* ── Universal Overlay / Nav Drawer Rules ── */}
      <div>
        <div className="flex items-center gap-3 mb-4">
          <span className="bg-red-600 text-white text-xs font-archivo font-bold px-2 py-0.5 rounded">UNIVERSAL RULE</span>
          <h3 className="font-archivo font-extrabold text-lg text-foreground">Overlay &amp; Nav Drawer — Canonical Spec</h3>
        </div>
        <p className="text-gray-600 font-open-sans text-sm mb-5 max-w-3xl">
          These rules apply to <strong>every</strong> overlay and nav drawer across all tiers. There are no exceptions.
          The most common error is using pure black (<code className="bg-gray-100 px-1 rounded text-xs">#000000</code>) or a
          shadcn/ui default near-black instead of <code className="bg-gray-100 px-1 rounded text-xs">#232323</code>.
          Always set the panel background explicitly — never rely on a component library default.
        </p>

        {/* Universal spec table */}
        <div className="overflow-x-auto mb-6">
          <table className="w-full text-sm font-open-sans border-collapse">
            <thead>
              <tr className="border-b-2 border-[#232323]">
                <th className="text-left py-3 pr-6 font-archivo font-bold text-[#232323] w-40">Property</th>
                <th className="text-left py-3 font-archivo font-bold text-[#232323]">Canonical value</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {([
                ["Background", "bg-[#232323] — NEVER pure black (#000000), never dark green, never tinted, never bg-background"],
                ["Panel width", "w-80 (320px)"],
                ["Panel position", "Fixed, full height, slides in from right"],
                ["Transition", "translate-x-full → translate-x-0, duration-300 ease-in-out"],
                ["Backdrop", "bg-black/50 behind the panel — always present, click to close"],
                ["Close button", "Top-right corner: size-9 rounded-md hover:bg-white/10, Lucide X icon in text-white"],
                ["Inactive nav item", "text-white/80 hover:text-white hover:bg-white/5 rounded-md px-3 py-2 text-sm"],
                ["Active nav item", "bg-[#3ba559]/10 text-[#3ba559] font-medium rounded-md px-3 py-2 text-sm"],
                ["Admin / elevated links", "text-[#3ba559] + Lucide ExternalLink icon (size 14) — only shown when user.role === 'admin'"],
                ["Group separator", "border-t border-white/10 my-2 between nav groups"],
                ["User identity footer", "Pinned to bottom: name (text-white text-sm font-medium), email (text-white/60 text-xs), role label (text-[#3ba559] text-xs font-medium), Log Out button (border border-white/20 text-white/80 rounded-md px-3 py-2 text-sm w-full mt-2)"],
              ] as [string, string][]).map(([prop, value]) => (
                <tr key={prop} className="hover:bg-gray-50">
                  <td className="py-2.5 pr-6 font-archivo font-bold text-xs text-[#232323] align-top">{prop}</td>
                  <td className="py-2.5 font-open-sans text-xs text-gray-700 align-top">
                    <code className="bg-gray-100 px-1.5 py-0.5 rounded text-[11px] font-mono">{value}</code>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Error callout */}
        <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 mb-6 flex gap-3">
          <span className="text-red-600 font-bold text-sm shrink-0">✗</span>
          <div>
            <p className="text-xs font-archivo font-bold text-red-800 mb-1">The most common error — pure black panel background</p>
            <p className="text-xs font-open-sans text-red-700">
              shadcn/ui <code className="bg-red-100 px-1 rounded">Sheet</code> and <code className="bg-red-100 px-1 rounded">Dialog</code> default to <code className="bg-red-100 px-1 rounded">bg-background</code>,
              which resolves to <code className="bg-red-100 px-1 rounded">#111111</code> in dark mode — close to black but not the correct ERI surface colour.
              Always override with <code className="bg-red-100 px-1 rounded">bg-[#232323]</code> explicitly.
            </p>
          </div>
        </div>

        {/* Tier A Workflow grouping */}
        <div className="bg-[#F9FAFB] rounded-xl p-6 border border-gray-200 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="bg-[#3ba559] text-white text-[10px] font-archivo font-bold px-2 py-0.5 rounded uppercase tracking-wider">TIER A WORKFLOW</span>
            <h4 className="font-archivo font-bold text-sm text-foreground">Nav Group Structure (PSM pattern)</h4>
          </div>
          <p className="text-xs font-open-sans text-gray-600 mb-4">
            Tier A Workflow apps use the same visual spec as Tier B App overlays. The difference is the
            grouped content structure — four groups separated by <code className="bg-gray-100 px-1 rounded">border-t border-white/10 my-2</code>:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            {([
              ["1 — Primary", "Home, My Workspace, core workflow entry point (e.g. Assess a Client)"],
              ["2 — Account & App info", "My Account, About the [App]"],
              ["3 — External / cross-ERI", "Trust & Security (external), Exponential Taxonomy (external), Contact Us"],
              ["4 — Admin", "Admin Panel (Primary Green, external icon) — only shown if user.role === 'admin'"],
            ] as [string, string][]).map(([group, items]) => (
              <div key={group} className="bg-white rounded-lg p-3 border border-gray-200">
                <p className="text-[10px] font-archivo font-bold uppercase tracking-wider text-[#3ba559] mb-1">{group}</p>
                <p className="text-[11px] font-open-sans text-gray-600">{items}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Code example */}
        <div>
          <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-2">Canonical implementation — NavDrawer.tsx</p>
          <pre className="bg-[#232323] rounded-xl p-5 text-gray-300 font-mono text-xs overflow-x-auto leading-relaxed">{`// NavDrawer.tsx — canonical pattern for all ERI apps
import { X, ExternalLink } from 'lucide-react';

export function NavDrawer({ open, onClose, currentPath, user, onLogout }) {
  return (
    <>
      {/* Backdrop */}
      {open && (
        <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />
      )}
      {/* Panel — bg-[#232323] is mandatory */}
      <div className={\`fixed top-0 right-0 h-full w-80 bg-[#232323] z-50 flex flex-col
        transform transition-transform duration-300 ease-in-out
        \${open ? 'translate-x-0' : 'translate-x-full'}\`}>

        {/* Close button */}
        <div className="flex justify-end p-3">
          <button onClick={onClose}
            className="size-9 rounded-md hover:bg-white/10 flex items-center justify-center text-white">
            <X size={20} />
          </button>
        </div>

        {/* Nav items */}
        <nav className="flex-1 overflow-y-auto px-3 pb-4">
          <NavItem href="/" label="Home" current={currentPath} onClose={onClose} />
          <div className="border-t border-white/10 my-2" />
          <NavItem href="https://trust.exponentialroadmap.org"
            label="Trust & Security" external onClose={onClose} />
          <div className="border-t border-white/10 my-2" />
          {user?.role === 'admin' && (
            <NavItem href="/admin" label="Admin Panel" admin onClose={onClose} />
          )}
        </nav>

        {/* User identity footer */}
        {user && (
          <div className="border-t border-white/10 p-4">
            <p className="text-white text-sm font-medium">{user.name}</p>
            <p className="text-white/60 text-xs mt-0.5">{user.email}</p>
            <p className="text-[#3ba559] text-xs font-medium mt-1">{user.role}</p>
            <button onClick={onLogout}
              className="border border-white/20 text-white/80 rounded-md px-3 py-2 text-sm w-full mt-3 hover:bg-white/5">
              Log Out
            </button>
          </div>
        )}
      </div>
    </>
  );
}`}</pre>
        </div>
      </div>

      {/* ── Mobile behaviour ── */}
      <div>
        <h3 className="font-archivo font-extrabold text-lg text-foreground mb-4">Mobile Behaviour</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-[#F9FAFB] rounded-lg p-5 border border-gray-200">
            <div className="flex items-center gap-2 mb-3">
              <span className="bg-[#232323] text-white text-[10px] font-archivo font-bold px-1.5 py-0.5 rounded">TIER B</span>
              <span className="text-xs font-archivo font-bold text-[#232323]">Hub</span>
            </div>
            <div className="space-y-1.5 text-xs font-open-sans text-gray-700">
              <div className="flex gap-2"><span className="text-[#3ba559]">→</span><span>Logo + hamburger only in header</span></div>
              <div className="flex gap-2"><span className="text-[#3ba559]">→</span><span>Overlay collapses to single column</span></div>
              <div className="flex gap-2"><span className="text-[#3ba559]">→</span><span>Hero image scales to full viewport width</span></div>
            </div>
          </div>
          <div className="bg-[#F9FAFB] rounded-lg p-5 border border-gray-200">
            <div className="flex items-center gap-2 mb-3">
              <span className="bg-[#232323] text-white text-[10px] font-archivo font-bold px-1.5 py-0.5 rounded">TIER B</span>
              <span className="text-xs font-archivo font-bold text-[#232323]">App overlay</span>
            </div>
            <div className="space-y-1.5 text-xs font-open-sans text-gray-700">
              <div className="flex gap-2"><span className="text-[#3ba559]">→</span><span>Panel anchors to full width on mobile</span></div>
              <div className="flex gap-2"><span className="text-[#3ba559]">→</span><span>User footer always visible at bottom</span></div>
              <div className="flex gap-2"><span className="text-[#3ba559]">→</span><span>Logout CTA always visible</span></div>
            </div>
          </div>
          <div className="bg-[#F9FAFB] rounded-lg p-5 border border-gray-200">
            <div className="flex items-center gap-2 mb-3">
              <span className="bg-[#3ba559] text-white text-[10px] font-archivo font-bold px-1.5 py-0.5 rounded">TIER A</span>
              <span className="text-xs font-archivo font-bold text-[#232323]">Simple / Workflow</span>
            </div>
            <div className="space-y-1.5 text-xs font-open-sans text-gray-700">
              <div className="flex gap-2"><span className="text-[#3ba559]">→</span><span>Context bar hides on mobile</span></div>
              <div className="flex gap-2"><span className="text-[#3ba559]">→</span><span>Stepper scrolls horizontally</span></div>
              <div className="flex gap-2"><span className="text-[#3ba559]">→</span><span>Tab bar scrolls horizontally — no wrapping</span></div>
            </div>
          </div>
          <div className="bg-green-50/60 rounded-lg p-5 border border-green-200">
            <div className="flex items-center gap-2 mb-3">
              <span className="bg-[#3ba559] text-white text-[10px] font-archivo font-bold px-1.5 py-0.5 rounded">TIER A + HERO</span>
              <span className="text-xs font-archivo font-bold text-[#232323]">Landing Hero</span>
            </div>
            <div className="space-y-1.5 text-xs font-open-sans text-gray-700">
              <div className="flex gap-2"><span className="text-[#3ba559]">→</span><span>Hero image scales to full viewport width</span></div>
              <div className="flex gap-2"><span className="text-[#3ba559]">→</span><span>Transparent header collapses to logo + hamburger only</span></div>
              <div className="flex gap-2"><span className="text-[#3ba559]">→</span><span>Interior tab bar scrolls horizontally — no wrapping</span></div>
            </div>
          </div>
          <div className="bg-[#F9FAFB] rounded-lg p-5 border border-gray-200">
            <div className="flex items-center gap-2 mb-3">
              <span className="bg-[#3ba559] text-white text-[10px] font-archivo font-bold px-1.5 py-0.5 rounded">TIER C</span>
              <span className="text-xs font-archivo font-bold text-[#232323]">Sidebar</span>
            </div>
            <div className="space-y-1.5 text-xs font-open-sans text-gray-700">
              <div className="flex gap-2"><span className="text-[#3ba559]">→</span><span>Sidebar hidden below lg breakpoint (1024px)</span></div>
              <div className="flex gap-2"><span className="text-[#3ba559]">→</span><span>Hamburger opens full-height slide-in drawer</span></div>
              <div className="flex gap-2"><span className="text-[#3ba559]">→</span><span>User footer visible in drawer on mobile</span></div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
