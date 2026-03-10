/**
 * ERI Brand Design System — PublicLayout
 * Design: Faithful Documentation Mirror
 * Provides the persistent fixed header (64px) and footer for all pages.
 * Header: ERI logo + "Brand Design System" title (no workspace context, no experimental badge)
 * Footer: Dark green bg, 3-column grid
 */

import { useState, useEffect } from "react";
import { logos } from "@/lib/assets";

interface PublicLayoutProps {
  children: React.ReactNode;
  transparentHeader?: boolean;
  hideFooter?: boolean;
}

export default function PublicLayout({ children, transparentHeader = false, hideFooter = false }: PublicLayoutProps) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Prevent body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const headerBg = transparentHeader && !scrolled
    ? "bg-transparent border-transparent"
    : "bg-white border-b border-gray-200 shadow-sm";

  return (
    <div className="min-h-screen flex flex-col bg-[#F9FAFB]">
      {/* ── FIXED HEADER ── */}
      <header className={`fixed top-0 left-0 right-0 z-50 h-16 transition-all duration-200 ${headerBg}`}>
        <div className="max-w-6xl mx-auto px-4 h-full flex items-center justify-between">
          {/* Left: Logo + title */}
          <div className="flex items-center gap-3">
            <a href="/" className="flex items-center gap-3 group">
              <img
                src={logos.eriLogoFullColor}
                alt="Exponential Roadmap Initiative"
                className="h-8 w-auto flex-shrink-0"
              />
            </a>
            <div className="hidden sm:flex flex-col leading-tight">
              <span className="text-xs font-semibold tracking-widest text-gray-500 uppercase">
                Brand Design System
              </span>
              <span className="text-[11px] text-gray-400">
                Exponential Roadmap Initiative
              </span>
            </div>
          </div>

          {/* Right: nav links + hamburger */}
          <div className="flex items-center gap-4">
            <nav className="hidden md:flex items-center gap-6">
              <a href="#brand-proposition" className="text-sm text-gray-600 hover:text-[#3ba559] transition-colors">Brand</a>
              <a href="#visual-identity" className="text-sm text-gray-600 hover:text-[#3ba559] transition-colors">Colours</a>
              <a href="#typography" className="text-sm text-gray-600 hover:text-[#3ba559] transition-colors">Typography</a>
              <a href="#components" className="text-sm text-gray-600 hover:text-[#3ba559] transition-colors">Components</a>
              <a
                href="https://exponentialroadmap.org"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-[#3ba559] hover:text-[#2d8a47] font-medium transition-colors"
              >
                ERI Website →
              </a>
            </nav>
            <button
              onClick={() => setMenuOpen(true)}
              className="md:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
              aria-label="Open navigation menu"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* ── MOBILE OVERLAY MENU ── */}
      {menuOpen && (
        <div className="fixed inset-0 z-[60] bg-white flex flex-col">
          <div className="flex items-center justify-between px-4 h-16 border-b border-gray-200">
            <img src={logos.eriLogoFullColor} alt="ERI" className="h-8 w-auto" />
            <button
              onClick={() => setMenuOpen(false)}
              className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
              aria-label="Close menu"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <nav className="flex flex-col gap-1 p-4">
            {[
              { href: "#brand-proposition", label: "Brand Proposition" },
              { href: "#visual-identity", label: "Visual Identity" },
              { href: "#logo-usage", label: "Logo Usage" },
              { href: "#spacing", label: "Spacing & Layout" },
              { href: "#typography", label: "Typography" },
              { href: "#verbal-identity", label: "Verbal Identity" },
              { href: "#page-layout", label: "Page Layout Shells" },
              { href: "#badges", label: "Badge Reference" },
              { href: "#components", label: "UI Components" },
              { href: "#resources", label: "Resources" },
            ].map(({ href, label }) => (
              <a
                key={href}
                href={href}
                onClick={() => setMenuOpen(false)}
                className="px-4 py-3 text-sm font-medium text-gray-700 hover:text-[#3ba559] hover:bg-gray-50 rounded-md transition-colors"
              >
                {label}
              </a>
            ))}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <a
                href="https://exponentialroadmap.org"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-3 text-sm font-medium text-[#3ba559] hover:text-[#2d8a47] flex items-center gap-2 transition-colors"
              >
                ERI Website <span>→</span>
              </a>
            </div>
          </nav>
        </div>
      )}

      {/* ── MAIN CONTENT ── */}
      <main className="flex-1 pt-16">
        {children}
      </main>

      {/* ── FOOTER ── */}
      {!hideFooter && (
        <footer className="bg-[#1a2e1a] text-white">
          <div className="max-w-6xl mx-auto px-4 py-12">
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
                    { label: "Brand Guidelines", href: "#brand-proposition" },
                    { label: "Component Library", href: "#components" },
                    { label: "Colour Tokens", href: "#visual-identity" },
                    { label: "Typography", href: "#typography" },
                    { label: "Badge Reference", href: "#badges" },
                  ].map(({ label, href }) => (
                    <li key={label}>
                      <a href={href} className="text-sm text-gray-400 hover:text-[#3ba559] transition-colors">
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
                    { label: "Business Playbook", href: "https://exponentialroadmap.org" },
                  ].map(({ label, href }) => (
                    <li key={label}>
                      <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-gray-400 hover:text-[#3ba559] transition-colors"
                      >
                        {label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="mt-10 pt-6 border-t border-gray-700">
              <p className="text-sm text-gray-500 text-center">
                © {new Date().getFullYear()} Exponential Roadmap Initiative. All rights reserved. | Based on Exponential Business Playbook v5.0
              </p>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}
