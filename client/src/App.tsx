import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch, Link, useLocation } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import BrandDesignSystem from "./pages/BrandDesignSystem";
import AlignmentTracker from "./pages/AlignmentTracker";

// ── Tab navigation bar ────────────────────────────────────────────────────────
// Fixed below the PublicLayout header (68px: 4px strip + 64px header).
// Height: 40px. Total header+tab height: 108px.
//
// The BDS page uses PublicLayout which already adds pt-[68px] on <main>.
// We add an additional pt-10 (40px) to PublicLayout's <main> via a prop
// so the tab bar does not overlap content.
//
// The AlignmentTracker page does NOT use PublicLayout — it manages its own
// top padding directly (pt-[108px] on its outermost div).

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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center gap-0 h-10">
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
  return (
    <>
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
