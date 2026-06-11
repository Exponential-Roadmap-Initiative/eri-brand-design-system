import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch, Link, useLocation } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import BrandDesignSystem from "./pages/BrandDesignSystem";
import Overview from "./pages/Overview";
import AlignmentTracker from "./pages/AlignmentTracker";
import NewProject from "./pages/NewProject";
import TeamGuide from "./pages/TeamGuide";
import Skills from "./pages/Skills";
import Governance from "./pages/Governance";
import SecurityIntegrity from "./pages/SecurityIntegrity";
import ProjectInstructions from "./pages/ProjectInstructions";
import BdsNavDrawer from "./components/BdsNavDrawer";
import { EriAppHeader } from "@eri/components";
import { useState } from "react";

const APP_VERSION = "V.2026.06.08";

// ── Tab navigation bar ────────────────────────────────────────────────────────
// Positioned directly below the standard 64px EriAppHeader.
// This is a BDS-specific feature — not part of the standard EriAppHeader spec,
// so it lives here as a separate component.
function TabNav() {
  const [location] = useLocation();
  const tabs = [
    { href: "/",                      label: "Overview" },
    { href: "/governance",            label: "Governance" },
    { href: "/skills",                label: "Skills" },
    { href: "/project-instructions",  label: "Project Instructions" },
    { href: "/brand-design-system",   label: "Brand Design System" },
    { href: "/tracker",               label: "Project Alignment Tracker" },
    { href: "/new-webproject",        label: "New Web Project" },
    { href: "/team-guide",            label: "Team Guide" },
    { href: "/security",               label: "Security & Integrity" },
  ];
  return (
    <div
      className="fixed left-0 right-0 z-40 bg-background border-b border-border transition-colors duration-200 top-[80px] sm:top-[64px]"
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
                  : "border-transparent text-muted-foreground hover:text-foreground hover:border-border",
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
      {/* Standard ERI header — #232323 background, dark-mode SVG logo, no status badge (live) */}
      <EriAppHeader
        appName="Design and Development Hub"
        version={APP_VERSION}
        showThemeToggle={true}
        headerTheme="auto"
        showCTA={true}
        source="bds"
        sourceLabel="Design and Development Hub"
        returnUrl="https://bds.exponentialroadmap.org"
        onMenuClick={() => setMenuOpen(true)}
        logoHref="/"
      />

      {/* BDS-specific tab navigation — sits below the standard 64px header */}
      <TabNav />

      {/* Mobile navigation drawer — triggered by EriAppHeader hamburger */}
      <BdsNavDrawer open={menuOpen} onClose={() => setMenuOpen(false)} />

      <Switch>
        <Route path={"/"} component={Overview} />
        <Route path={"/brand-design-system"} component={BrandDesignSystem} />
        <Route path={"/tracker"} component={AlignmentTracker} />
        <Route path={"/new-webproject"} component={NewProject} />
        <Route path={"/governance"} component={Governance} />
        <Route path={"/skills"} component={Skills} />
        <Route path={"/project-instructions"} component={ProjectInstructions} />
        <Route path={"/team-guide"} component={TeamGuide} />
        <Route path={"/security"} component={SecurityIntegrity} />
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
