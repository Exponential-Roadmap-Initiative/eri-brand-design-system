import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch, Link, useLocation } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import BrandDesignSystem from "./pages/BrandDesignSystem";
import AlignmentTracker from "./pages/AlignmentTracker";
import BdsNavDrawer from "./components/BdsNavDrawer";
import { EriAppHeader } from "@eri/components";
import { useState } from "react";

const APP_VERSION = "V.2026.04.21";

// ── Tab navigation bar ────────────────────────────────────────────────────────
// Positioned directly below the standard 64px EriAppHeader.
// This is a BDS-specific feature (two pages: BDS + Tracker) — not part of the
// standard EriAppHeader spec, so it lives here as a separate component.
function TabNav() {
  const [location] = useLocation();
  const tabs = [
    { href: "/",        label: "Brand Design System" },
    { href: "/tracker", label: "Project Alignment Tracker" },
  ];
  return (
    <div
      className="fixed left-0 right-0 z-40 bg-[#232323] border-b border-gray-700 transition-colors duration-200"
      style={{ top: "64px" }}
    >
      <div
        className="flex items-center gap-0 h-10"
        style={{ paddingInline: "var(--eri-content-inset, clamp(1rem, 3vw, 2rem))" }}
      >
        {tabs.map(({ href, label }) => {
          const isActive = href === "/" ? location === "/" : location.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={[
                "px-4 h-full flex items-center text-sm font-medium border-b-2 transition-colors whitespace-nowrap",
                isActive
                  ? "border-[#3ba559] text-[#3ba559]"
                  : "border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-600",
              ].join(" ")}
            >
              {label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}

function Router() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      {/* Standard ERI header — #232323 background, dark-mode SVG logo, BETA badge */}
      <EriAppHeader
        appName="Brand Design System"
        status="BETA"
        version={APP_VERSION}
        showThemeToggle={true}
        showCTA={true}
        source="bds"
        sourceLabel="Brand Design System"
        returnUrl="https://bds.exponentialroadmap.org"
        onMenuClick={() => setMenuOpen(true)}
        logoHref="/"
      />

      {/* BDS-specific tab navigation — sits below the standard 64px header */}
      <TabNav />

      {/* Mobile navigation drawer — triggered by EriAppHeader hamburger */}
      <BdsNavDrawer open={menuOpen} onClose={() => setMenuOpen(false)} />

      <Switch>
        <Route path={"/"} component={BrandDesignSystem} />
        <Route path={"/tracker"} component={AlignmentTracker} />
        <Route path={"/404"} component={NotFound} />
        <Route component={NotFound} />
      </Switch>
    </>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
