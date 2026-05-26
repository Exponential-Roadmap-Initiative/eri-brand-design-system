/**
 * ERI Brand Design System — PublicLayout
 *
 * Pure content wrapper. The header is provided by EriAppHeader in App.tsx,
 * and the footer by EriAppFooter from @eri/components. This component only
 * handles the content area padding and the optional footer rendering.
 *
 * Top padding:
 *   Desktop (sm+): 64px (EriAppHeader single-row) + 40px (TabNav) = 104px
 *   Mobile (< sm): 80px (EriAppHeader two-row: 48px row1 + 32px row2) + 40px (TabNav) = 120px
 * The footer is always dark (#232323) per the ERI brand standard.
 */
import { EriAppFooter } from "@eri/components";

interface PublicLayoutProps {
  children: React.ReactNode;
  hideFooter?: boolean;
}

export default function PublicLayout({ children, hideFooter = false }: PublicLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {/* Content area — padded below EriAppHeader + TabNav */}
      <main className="flex-1 pt-[120px] sm:pt-[104px]">
        {children}
      </main>

      {/* Standard ERI footer — always dark (#232323), never themed */}
      {!hideFooter && (
        <EriAppFooter
          appName="Brand Design System"
          tagline="The official brand design system for all ERI digital products."
          attribution="Based on Exponential Business Playbook v5.0"
          appLink={{ label: "Project Alignment Tracker", href: "https://bds.exponentialroadmap.org/tracker" }}
        />
      )}
    </div>
  );
}
