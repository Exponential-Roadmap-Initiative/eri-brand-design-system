/**
 * ERI Brand Design System — PublicLayout
 * Design: Faithful Documentation Mirror
 *
 * Dark/light mode: all structural colours use Tailwind semantic tokens
 * (bg-background, text-foreground, border-border, etc.) so the entire
 * page adapts when the html.dark class is toggled.
 *
 * What stays hardcoded (intentionally):
 *   - ERI footer (#232323) — always dark, this is the brand
 *   - 4px top strip (#2c3f43) — always dark, this is the brand
 *   - ERI green accents (#3ba559, #93cda3) — brand colours, not theme colours
 *
 * hideHeader prop: when true, the fixed header is suppressed so the shared
 * SiteHeader in App.tsx renders instead (used by AlignmentTracker tab).
 */

import { useState, useEffect } from "react";
import { logos } from "@/lib/assets";
import { ThemeToggleButton } from "@/components/ThemeToggleButton";

interface PublicLayoutProps {
  children: React.ReactNode;
  transparentHeader?: boolean;
  hideFooter?: boolean;
  hideHeader?: boolean;
}

// Current version — matches the V.YYYY.MM.DD convention used across ERI apps
const APP_VERSION = "V.2026.04.18";

function LayoutHeader({ transparentHeader, scrolled, menuOpen, setMenuOpen }: {
  transparentHeader: boolean;
  scrolled: boolean;
  menuOpen: boolean;
  setMenuOpen: (v: boolean) => void;
}) {
  const headerBg = transparentHeader && !scrolled
    ? "bg-transparent border-transparent"
    : "bg-background border-b border-border";

  return (
    <>
      {/* Dark teal top strip — 4px, colour #2c3f43, always visible regardless of theme */}
      <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-[#2c3f43]" />

      <header className={`fixed top-1 left-0 right-0 z-50 h-16 transition-all duration-200 ${headerBg}`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between gap-4">

          {/* LEFT: Logo + divider + title block */}
          <div className="flex items-center gap-3 min-w-0">
            <a href="/" aria-label="Go to homepage" className="shrink-0">
              <img
                src={logos.eriLogoFullColor}
                alt="Exponential Roadmap Initiative logo"
                className="h-8 w-auto dark:brightness-0 dark:invert"
              />
            </a>

            {/* Vertical divider — hidden on mobile */}
            <div className="hidden sm:block h-6 w-px bg-border shrink-0" />

            {/* App title — single line, 18px / 600 */}
            <span className="hidden sm:inline text-[18px] font-semibold text-foreground truncate">
              Brand Design System
            </span>
          </div>

          {/* RIGHT: BETA badge + version + theme toggle + hamburger */}
          <div className="flex items-center gap-2 shrink-0">

            {/* BETA badge — outlined pill */}
            <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full border border-border text-[11px] font-medium text-muted-foreground tracking-wide">
              BETA
            </span>

            {/* Version string — V.YYYY.MM.DD convention */}
            <span className="hidden sm:inline text-[11px] font-medium text-muted-foreground tracking-wide">
              {APP_VERSION}
            </span>

            {/* Theme toggle */}
            <ThemeToggleButton size="sm" />

            {/* Hamburger menu — visible on mobile only (lg+ uses the left panel) */}
            <button
              onClick={() => setMenuOpen(true)}
              className="lg:hidden inline-flex items-center justify-center size-9 rounded-md text-foreground hover:bg-muted transition-colors"
              aria-label="Open navigation menu"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <line x1="4" y1="6" x2="20" y2="6" />
                <line x1="4" y1="12" x2="20" y2="12" />
                <line x1="4" y1="18" x2="20" y2="18" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* ── MOBILE NAVIGATION OVERLAY ── */}
      {menuOpen && (
        <div className="fixed inset-0 z-[60] bg-background flex flex-col">
          {/* Overlay header */}
          <div className="flex items-center justify-between px-4 h-16 border-b border-border">
            <div className="flex items-center gap-3">
              <img src={logos.eriLogoFullColor} alt="ERI" className="h-8 w-auto dark:brightness-0 dark:invert" />
              <div className="hidden sm:block h-6 w-px bg-border" />
              <div className="hidden sm:flex flex-col leading-tight">
                <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-widest">Exponential Roadmap Initiative</span>
                <span className="text-base font-semibold text-foreground">Brand Design System</span>
              </div>
            </div>
            <button
              onClick={() => setMenuOpen(false)}
              className="inline-flex items-center justify-center size-9 rounded-md text-foreground hover:bg-muted transition-colors"
              aria-label="Close menu"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Section links — mobile only (lg+ uses the left panel instead) */}
          <nav className="flex flex-col gap-0.5 p-4 overflow-y-auto flex-1">
            <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest mb-3 px-3">On this page</p>
            {[
              { href: "#introduction",          label: "Introduction" },
            ].map(({ href, label }) => (
              <a
                key={href}
                href={href}
                onClick={() => setMenuOpen(false)}
                className="px-3 py-2 text-sm font-medium text-foreground hover:text-[#3ba559] hover:bg-muted rounded-md transition-colors"
              >
                {label}
              </a>
            ))}
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-3 pt-4 pb-1 mt-2 border-t border-border">Communications &amp; Brand</p>
            {[
              { href: "#brand-proposition",     label: "Brand Proposition" },
              { href: "#visual-identity",        label: "Visual Identity" },
              { href: "#logo-usage",             label: "Logo Usage" },
              { href: "#typography",             label: "Typography" },
              { href: "#verbal-identity",        label: "Verbal Identity" },
              { href: "#photography",            label: "Photography" },
              { href: "#brand-graphics",         label: "Brand Graphics" },
              { href: "#testimonials",           label: "Testimonials" },
              { href: "#exponential-framework",  label: "Exponential Framework" },
              { href: "#charts",                 label: "Charts" },
              { href: "#member-logos",           label: "Member Logotypes" },
              { href: "#data-source-logos",      label: "Data Source Logos" },
            ].map(({ href, label }) => (
              <a
                key={href}
                href={href}
                onClick={() => setMenuOpen(false)}
                className="px-3 py-2 text-sm font-medium text-foreground hover:text-[#3ba559] hover:bg-muted rounded-md transition-colors"
              >
                {label}
              </a>
            ))}
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-3 pt-4 pb-1 mt-2 border-t border-border">Web &amp; Development</p>
            {[
              { href: "#navigation",         label: "Navigation & Layout" },
              { href: "#spacing",            label: "Spacing & Layout" },
              { href: "#page-layout",        label: "Page Layout Shells" },
              { href: "#component-library",  label: "Component Library" },
              { href: "#badges",             label: "Badge Reference" },
              { href: "#interactive-states", label: "Interactive States" },
              { href: "#components",         label: "UI Components" },
              { href: "#resources",          label: "Resources" },
              { href: "#ai-instructions",    label: "Machine Instructions" },
            ].map(({ href, label }) => (
              <a
                key={href}
                href={href}
                onClick={() => setMenuOpen(false)}
                className="px-3 py-2 text-sm font-medium text-foreground hover:text-[#3ba559] hover:bg-muted rounded-md transition-colors"
              >
                {label}
              </a>
            ))}
            {/* External links */}
            <div className="mt-4 pt-4 border-t border-border">
              <a
                href="https://exponentialroadmap.org"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-2 text-sm font-medium text-[#3ba559] hover:text-[#2d8a47] flex items-center gap-2 transition-colors rounded-md hover:bg-muted"
              >
                ERI Website <span aria-hidden>→</span>
              </a>
            </div>
          </nav>
        </div>
      )}
    </>
  );
}

export default function PublicLayout({ children, transparentHeader = false, hideFooter = false, hideHeader = false }: PublicLayoutProps) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">

      {/* ── FIXED HEADER — suppressed when hideHeader=true ── */}
      {!hideHeader && (
        <LayoutHeader
          transparentHeader={transparentHeader}
          scrolled={scrolled}
          menuOpen={menuOpen}
          setMenuOpen={setMenuOpen}
        />
      )}

      {/* ── MAIN CONTENT ── */}
      {/* pt-[108px] = 4px strip + 64px header + 40px tab bar */}
      <main className="flex-1 pt-[108px]">
        {children}
      </main>

      {/* ── FOOTER — always dark, this is the ERI brand ── */}
      {!hideFooter && (
        <footer className="bg-[#232323] text-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid md:grid-cols-3 gap-8">

              {/* Col 1: Brand */}
              <div>
                <img
                  src={logos.eriLogoFullColor}
                  alt="Exponential Roadmap Initiative"
                  className="h-8 mb-4"
                  style={{ filter: "brightness(0) invert(1)" }}
                />
                <p className="text-sm text-gray-400 leading-relaxed">
                  The official brand design system for all Exponential Roadmap Initiative digital products.
                </p>
              </div>

              {/* Col 2: Resources */}
              <div>
                <h3 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">Resources</h3>
                <ul className="space-y-2">
                  {[
                    { label: "Component Library", href: "#components" },
                    { label: "Colour Tokens", href: "#visual-identity" },
                    { label: "Typography", href: "#typography" },
                    { label: "Badge Reference", href: "#badges" },
                  ].map(({ label, href }) => (
                    <li key={label}>
                      <a href={href} className="text-sm text-gray-400 hover:text-[#93cda3] transition-colors">
                        {label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Col 3: Contact */}
              <div>
                <h3 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">Contact</h3>
                <ul className="space-y-2">
                  {[
                    { label: "exponentialroadmap.org", href: "https://exponentialroadmap.org" },
                    { label: "Exponential Roadmap Initiative", href: "https://exponentialroadmap.org" },
                    { label: "Business Playbook", href: "https://exponentialroadmap.org/playbook" },
                  ].map(({ label, href }) => (
                    <li key={label}>
                      <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-gray-400 hover:text-[#93cda3] transition-colors"
                      >
                        {label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* ── ENERGY STATEMENT ── */}
            {/* Placeholder copy — will be updated with specific figures from updated research report */}
            <div className="mt-10 pt-6 border-t border-gray-700">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3 max-w-2xl">
                  {/* Leaf icon */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-4 h-4 text-[#3ba559] shrink-0 mt-0.5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z" />
                    <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
                  </svg>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    <span className="text-gray-300 font-medium">Dark by default.</span>{" "}
                    OLED screens consume near-zero power for dark pixels — switching to dark mode
                    saves meaningful display energy at scale.{" "}
                    {/* Specific global figures will be added once updated research is confirmed */}
                    Light mode is available for those who need it.
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs text-gray-500">Theme:</span>
                  <ThemeToggleButton size="sm" />
                </div>
              </div>
              <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-2">
                <p className="text-sm text-gray-500">
                  © {new Date().getFullYear()} Exponential Roadmap Initiative. All rights reserved.
                </p>
                <p className="text-sm text-gray-500">
                  Based on Exponential Business Playbook v5.0
                </p>
              </div>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}
