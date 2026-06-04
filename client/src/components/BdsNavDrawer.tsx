/**
 * BdsNavDrawer — mobile section navigation drawer for the BDS site.
 *
 * Triggered by the hamburger button in EriAppHeader (via onMenuClick).
 * Renders a full-height overlay with all BDS section links.
 * Managed by the parent (App.tsx Router) which owns menuOpen state.
 */

interface BdsNavDrawerProps {
  open: boolean;
  onClose: () => void;
}

export default function BdsNavDrawer({ open, onClose }: BdsNavDrawerProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex"
      role="dialog"
      aria-modal="true"
      aria-label="Navigation menu"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60"
        onClick={onClose}
        aria-hidden="true"
      />
      {/* Drawer panel */}
      <div className="relative flex flex-col w-72 max-w-full bg-background shadow-xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <div className="flex flex-col">
            <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">
              Exponential Roadmap Initiative
            </span>
            <span className="text-base font-semibold text-foreground">Brand Design System</span>
          </div>
          <button
            onClick={onClose}
            className="inline-flex items-center justify-center size-9 rounded-md text-foreground hover:bg-muted transition-colors"
            aria-label="Close menu"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        {/* Section links */}
        <nav className="flex flex-col gap-0.5 p-4 overflow-y-auto flex-1">
          <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest mb-3 px-3">
            On this page
          </p>
          {[
            { href: "#introduction", label: "Introduction" },
          ].map(({ href, label }) => (
            <a
              key={href}
              href={href}
              onClick={onClose}
              className="px-3 py-2 text-sm font-medium text-foreground hover:text-[#3ba559] hover:bg-muted rounded-md transition-colors"
            >
              {label}
            </a>
          ))}

          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-3 pt-4 pb-1 mt-2 border-t border-border">
            Communications &amp; Brand
          </p>
          {[
            { href: "#brand-proposition",    label: "Brand Proposition" },
            { href: "#visual-identity",      label: "Visual Identity" },
            { href: "#logo-usage",           label: "Logo Usage" },
            { href: "#typography",           label: "Typography" },
            { href: "#verbal-identity",      label: "Verbal Identity" },
            { href: "#photography",          label: "Photography" },
            { href: "#brand-graphics",       label: "Brand Graphics" },
            { href: "#testimonials",         label: "Testimonials" },
            { href: "#exponential-framework",label: "Exponential Framework" },
            { href: "#charts",               label: "Charts" },
            { href: "#member-logos",         label: "Member Logotypes" },
            { href: "#data-source-logos",    label: "Data Source Logos" },
          ].map(({ href, label }) => (
            <a
              key={href}
              href={href}
              onClick={onClose}
              className="px-3 py-2 text-sm font-medium text-foreground hover:text-[#3ba559] hover:bg-muted rounded-md transition-colors"
            >
              {label}
            </a>
          ))}

          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-3 pt-4 pb-1 mt-2 border-t border-border">
            Web &amp; Development
          </p>
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
              onClick={onClose}
              className="px-3 py-2 text-sm font-medium text-foreground hover:text-[#3ba559] hover:bg-muted rounded-md transition-colors"
            >
              {label}
            </a>
          ))}

          {/* Page links */}
          <div className="mt-4 pt-4 border-t border-border flex flex-col gap-0.5">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-3 pb-1">
              Other pages
            </p>
            <a
              href="/new-project"
              onClick={onClose}
              className="px-3 py-2 text-sm font-medium text-foreground hover:text-[#3ba559] hover:bg-muted rounded-md transition-colors"
            >
              Start a Project
            </a>
            <a
              href="/team-guide"
              onClick={onClose}
              className="px-3 py-2 text-sm font-medium text-foreground hover:text-[#3ba559] hover:bg-muted rounded-md transition-colors"
            >
              Team Guide
            </a>
            <a
              href="/tracker"
              onClick={onClose}
              className="px-3 py-2 text-sm font-medium text-foreground hover:text-[#3ba559] hover:bg-muted rounded-md transition-colors"
            >
              Project Alignment Tracker
            </a>
          </div>
          {/* External links */}
          <div className="mt-2 pt-2 border-t border-border">
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
    </div>
  );
}
