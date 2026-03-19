/**
 * SectionNavigator — Sticky left-hand section navigator
 * Design: ERI Brand Design System — Faithful Documentation Mirror
 *
 * Dual-audience: visible to human colleagues for quick navigation;
 * also listed in the Machine Instructions section so AI tasks know
 * the canonical section IDs and their order.
 *
 * Uses IntersectionObserver to highlight the active section as the
 * user scrolls. Hidden on mobile (< lg), shown as a fixed sidebar
 * on desktop alongside the main content column.
 */

import { useEffect, useState } from "react";

export type NavSection = {
  id: string;
  label: string;
  /** Optional sub-label shown in smaller text below the main label */
  sublabel?: string;
};

export const SECTIONS: NavSection[] = [
  { id: "brand-proposition",  label: "Brand Proposition" },
  { id: "visual-identity",    label: "Visual Identity",       sublabel: "Colours" },
  { id: "logo-usage",         label: "Logo Usage" },
  { id: "spacing",            label: "Spacing & Layout" },
  { id: "typography",         label: "Typography" },
  { id: "verbal-identity",    label: "Verbal Identity",       sublabel: "Language" },
  { id: "component-library",     label: "Component Library" },
  { id: "exponential-framework",  label: "Exponential Framework",  sublabel: "Icons · Diagrams · Elements" },
  { id: "page-layout",            label: "Page Layout Shells" },
  { id: "badges",                 label: "Badge Reference" },
  { id: "interactive-states",     label: "Interactive States" },
  { id: "components",             label: "UI Components" },
  { id: "photography",            label: "Photography",             sublabel: "Image guidelines" },
  { id: "resources",              label: "Resources" },
  { id: "ai-instructions",        label: "Machine Instructions",   sublabel: "For AI tasks" },
];

interface SectionNavigatorProps {
  className?: string;
}

export default function SectionNavigator({ className = "" }: SectionNavigatorProps) {
  const [activeId, setActiveId] = useState<string>(SECTIONS[0].id);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    // Track which sections are currently intersecting
    const intersecting = new Map<string, boolean>();

    SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (!el) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          intersecting.set(id, entry.isIntersecting);

          // Find the first section (in document order) that is currently visible
          const firstVisible = SECTIONS.find((s) => intersecting.get(s.id));
          if (firstVisible) setActiveId(firstVisible.id);
        },
        {
          // Trigger when the top 20% of the section enters the viewport
          rootMargin: "-64px 0px -70% 0px",
          threshold: 0,
        }
      );

      observer.observe(el);
      observers.push(observer);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - 80; // 64px header + 16px breathing room
    window.scrollTo({ top, behavior: "smooth" });
  };

  return (
    <nav
      aria-label="Page sections"
      className={`hidden lg:flex flex-col gap-0.5 ${className}`}
    >
      {/* "On this page" header */}
      <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-3 px-3">
        On this page
      </p>

      {SECTIONS.map(({ id, label, sublabel }) => {
        const isActive = activeId === id;
        const isAI = id === "ai-instructions";

        return (
          <button
            key={id}
            onClick={() => scrollTo(id)}
            className={[
              "group text-left px-3 py-2 rounded-md transition-all duration-150 cursor-pointer",
              isActive
                ? "bg-[#3ba559]/10 border-l-2 border-[#3ba559]"
                : "border-l-2 border-transparent hover:bg-gray-100 hover:border-gray-300",
              isAI && !isActive ? "mt-3 border-t border-gray-200 pt-4 rounded-none" : "",
            ].join(" ")}
            aria-current={isActive ? "location" : undefined}
          >
            <span
              className={[
                "block text-[13px] leading-tight font-medium transition-colors",
                isActive ? "text-[#3ba559]" : "text-gray-600 group-hover:text-gray-900",
              ].join(" ")}
            >
              {label}
            </span>
            {sublabel && (
              <span className="block text-[11px] text-gray-400 mt-0.5 leading-tight">
                {sublabel}
              </span>
            )}
          </button>
        );
      })}
    </nav>
  );
}
