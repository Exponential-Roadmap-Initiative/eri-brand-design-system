/**
 * ERI Brand Design System — ThemeToggleButton
 *
 * A small icon button that toggles between dark (default) and light mode.
 * Follows the ERI convention:
 *   - In dark mode: shows a sun icon (action = switch to light)
 *   - In light mode: shows a moon icon (action = switch to dark)
 *
 * The icon represents the destination mode, not the current mode.
 * This matches the action-affordance convention used by Docusaurus and
 * most developer-facing design systems.
 *
 * The tooltip surfaces the energy-efficiency rationale — the invisible cost
 * that users are never normally shown. Copy is intentionally brief and
 * non-preachy. The specific energy figure will be updated once the
 * updated research report is available.
 *
 * aria-label is dynamic and describes the action, not the current state,
 * which is the WCAG-compliant approach.
 */

import { useTheme } from "@/contexts/ThemeContext";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ThemeToggleButtonProps {
  /** Additional CSS classes — use for positioning overrides */
  className?: string;
  /** Size variant: "sm" (32px) | "md" (36px, default) */
  size?: "sm" | "md";
}

export function ThemeToggleButton({ className = "", size = "md" }: ThemeToggleButtonProps) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  const sizeClass = size === "sm" ? "size-8" : "size-9";
  const iconSize = size === "sm" ? "w-4 h-4" : "w-[18px] h-[18px]";

  const ariaLabel = isDark ? "Switch to light mode" : "Switch to dark mode";

  const tooltipText = isDark
    ? "Dark mode is on — saves up to 47% display energy on OLED screens. Switch to light if you need it."
    : "Light mode is on. Switch back to dark mode to save display energy on OLED screens.";

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          onClick={toggleTheme}
          aria-label={ariaLabel}
          className={[
            "inline-flex items-center justify-center rounded-md transition-colors",
            sizeClass,
            isDark
              ? "text-gray-400 hover:text-yellow-300 hover:bg-white/10"
              : "text-gray-500 hover:text-[#232323] hover:bg-gray-100",
            className,
          ].join(" ")}
        >
          {isDark ? (
            /* Sun icon — shown in dark mode (action: switch to light) */
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={iconSize}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="4" />
              <line x1="12" y1="2" x2="12" y2="4" />
              <line x1="12" y1="20" x2="12" y2="22" />
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
              <line x1="2" y1="12" x2="4" y2="12" />
              <line x1="20" y1="12" x2="22" y2="12" />
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
            </svg>
          ) : (
            /* Moon icon — shown in light mode (action: switch to dark) */
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={iconSize}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          )}
        </button>
      </TooltipTrigger>
      <TooltipContent
        side="bottom"
        className="max-w-[220px] text-center text-xs leading-relaxed"
      >
        {tooltipText}
      </TooltipContent>
    </Tooltip>
  );
}
