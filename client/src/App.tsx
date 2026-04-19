import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch, Link, useLocation } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import BrandDesignSystem from "./pages/BrandDesignSystem";
import AlignmentTracker from "./pages/AlignmentTracker";
import { logos } from "@/lib/assets";

const APP_VERSION = "V.2026.04.18";

/// ── Shared fixed header ──────────────────────────────────────────────────────
// Renders on every tab. Mirrors the PublicLayout header exactly so the
// AlignmentTracker page (which does not use PublicLayout) also gets the header.
// PublicLayout suppresses its own header when this is present via the
// hideHeader prop.
function SiteHeader() {
  return (
    <>
      {/* 4px dark teal top strip */}
      <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-[#2c3f43]" />
      {/* Main header bar */}
      <header className="fixed top-1 left-0 right-0 z-50 h-16 bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <a href="/" aria-label="Go to homepage" className="shrink-0">
              <img src={logos.eriLogoFullColor} alt="Exponential Roadmap Initiative logo" className="h-8 w-auto" />
            </a>
            <div className="hidden sm:block h-6 w-px bg-gray-300 shrink-0" />
            <span className="hidden sm:inline text-[18px] font-semibold text-[#384151] truncate">
              Brand Design System
            </span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full border border-gray-400 text-[11px] font-medium text-gray-600 tracking-wide">
              BETA
            </span>
            <span className="hidden sm:inline text-[11px] font-medium text-gray-500 tracking-wide">
              {APP_VERSION}
            </span>
          </div>
        </div>
      </header>
    </>
  );
}

// ── Tab navigation bar ────────────────────────────────────────────────────────
function TabNav() {
  const [location] = useLocation();
  const tabs = [
    { href: "/",        label: "Brand Design System" },
    { href: "/tracker", label: "Project Alignment Tracker" },
  ];

  return (
    <div
      className="fixed left-0 right-0 z-40 bg-white border-b border-gray-200"
      style={{ top: "68px" }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-0 h-10">
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
                  : "border-transparent text-gray-500 hover:text-gray-800 hover:border-gray-300",
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
  // make sure to consider if you need authentication for certain routes
  return (
    <>
      <SiteHeader />
      <TabNav />
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
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
