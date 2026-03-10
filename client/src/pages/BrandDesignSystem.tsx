/**
 * ERI Brand Design System — Main Page
 * Design: Faithful Documentation Mirror
 * Mirrors the existing page at eri-expframework-beta-platform.manus.space/brand-design-system
 *
 * Sections:
 * 1. Brand Proposition
 * 2. Visual Identity (Colours)
 * 3. Logo Usage
 * 4. Spacing & Layout Tokens
 * 5. Typography
 * 6. Verbal Identity
 * 7. Page Layout Shells
 * 8. Badge Reference
 * 9. Interactive States
 * 10. UI Components
 * 11. Pillar Icon Assets
 * 12. Resources
 */

import { useState } from "react";
import { Copy, Check, ExternalLink, FileText, Plug, Layers, BookOpen, BarChart3 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import PublicLayout from "@/components/PublicLayout";
import { logos, pillarBottomIcons, pillarMarks, frameworkImages, dataSourceLogos } from "@/lib/assets";

// ============================================================================
// BRAND PROPOSITION DATA
// ============================================================================
const brandProposition = {
  mission: "To accelerate the transition to a regenerative economy by providing organizations with a clear, actionable framework for exponential climate impact.",
  vision: "A world where every organization understands and maximizes its potential for positive climate impact across operations, value chains, solutions, finance, and policy.",
  values: [
    { name: "Clarity", description: "Complex climate science made accessible and actionable" },
    { name: "Integrity", description: "Evidence-based, transparent, and honest assessment" },
    { name: "Ambition", description: "Pushing beyond incremental change to exponential impact" },
    { name: "Collaboration", description: "Collective action across industries and value chains" },
  ],
  personality: "Expert yet approachable. Urgent but not alarmist. Ambitious and pragmatic. Scientific rigor with human warmth.",
};

// ============================================================================
// COLOUR SYSTEM DATA
// ============================================================================
const colorSystem = {
  pillar: [
    { id: "p1", name: "Pillar 1 - Operations", hex: "#8a9a87", rgb: "138, 154, 135", context: "Operational emissions, Scope 1 & 2, internal processes" },
    { id: "p2", name: "Pillar 2 - Value Chain", hex: "#2999c5", rgb: "41, 153, 197", context: "Supply chain, Scope 3, procurement, supplier engagement" },
    { id: "p3", name: "Pillar 3 - Solutions", hex: "#22803a", rgb: "34, 128, 58", context: "Climate solutions, products, services, avoided emissions" },
    { id: "p4", name: "Pillar 4 - Finance", hex: "#f97316", rgb: "249, 115, 22", context: "Climate finance, green bonds, sustainable investment" },
    { id: "p5", name: "Pillar 5 - Policy", hex: "#f74145", rgb: "247, 65, 69", context: "Policy advocacy, regulatory engagement, trade associations" },
  ],
  brand: [
    { id: "primary", name: "Primary Green", hex: "#3ba559", rgb: "59, 165, 89", context: "Primary buttons, CTAs, links, success states" },
    { id: "dark", name: "Dark Text", hex: "#232323", rgb: "35, 35, 35", context: "Headings, primary body text, high-contrast elements" },
    { id: "neutral", name: "Neutral Gray", hex: "#6b7280", rgb: "107, 114, 128", context: "Secondary text, borders, disabled states" },
    { id: "background", name: "Background", hex: "#F9FAFB", rgb: "249, 250, 251", context: "Page backgrounds, card backgrounds" },
  ],
};

// ============================================================================
// VERBAL IDENTITY DATA
// ============================================================================
const verbalIdentity = {
  toneOfVoice: [
    { trait: "Expert", description: "We speak with authority grounded in science and data, not opinion" },
    { trait: "Accessible", description: "We translate complex concepts without dumbing them down" },
    { trait: "Urgent", description: "We convey the importance of action without inducing paralysis" },
    { trait: "Optimistic", description: "We focus on solutions and possibilities, not doom" },
  ],
  writingPrinciples: [
    { principle: "Lead with impact", example: "Start with the outcome, not the process" },
    { principle: "Be specific", example: "Use numbers, percentages, and concrete examples" },
    { principle: "Active voice", example: "'Apple reduced emissions by 60%' not 'Emissions were reduced'" },
    { principle: "No jargon without context", example: "Define terms like 'Scope 3' on first use" },
  ],
  terminology: [
    { term: "Climate solutions", avoid: "Green products" },
    { term: "Avoided emissions", avoid: "Carbon offsets" },
    { term: "Value chain", avoid: "Supply chain" },
    { term: "Exponential impact", avoid: "Incremental improvement" },
  ],
};

// ============================================================================
// LOGO VARIANTS DATA
// ============================================================================
const logoVariants = [
  {
    id: "full-color",
    name: "Full Colour Wordmark",
    file: logos.eriLogoFullColor,
    filePath: "eri-logo-full-color.svg",
    bg: "bg-white",
    border: "border border-gray-200",
    usage: "Primary logo for all light-background contexts: website headers, footers, documents, presentations.",
    when: "Default choice. Use whenever background is white or light grey.",
    minWidth: "160px",
    clearSpace: "Equal to the height of the 'E' letterform on all four sides.",
  },
  {
    id: "dark-bg",
    name: "Wordmark on Dark Background",
    file: logos.eriLogoFullColor,
    filePath: "eri-logo-full-color.svg",
    bg: "bg-[#232323]",
    border: "",
    usage: "Use on dark hero sections, dark sidebars, or dark-mode interfaces. Apply CSS filter: brightness(0) invert(1) to convert the SVG to white.",
    when: "When background is #232323 or any dark colour with insufficient contrast for the colour version.",
    minWidth: "160px",
    clearSpace: "Equal to the height of the 'E' letterform on all four sides.",
    filter: "brightness(0) invert(1)",
  },
  {
    id: "icon",
    name: "Icon Mark (Exponential Swirl)",
    file: logos.exponentialLogo,
    filePath: "exponential-logo.webp",
    bg: "bg-white",
    border: "border border-gray-200",
    usage: "The single icon asset used across all compact contexts: browser tab favicon, sidebar nav items, data source badges, app icons, and pillar navigation.",
    when: "Space-constrained UI elements where the full wordmark would be illegible (< 40px height), and as the browser tab favicon.",
    minWidth: "32px",
    clearSpace: "4px on all sides minimum.",
    faviconVariant: {
      file: logos.faviconIco,
      filePath: "favicon.ico",
      label: "Favicon (.ico)",
      sizes: "16×16, 32×32, 48×48, 64×64",
      note: "Multi-size .ico bundle. Referenced in index.html as the browser tab icon.",
    },
  },
  {
    id: "eri-icon",
    name: "ERI Icon Mark",
    file: logos.eriIconMark,
    filePath: "eri-icon-mark.webp",
    bg: "bg-white",
    border: "border border-gray-200",
    usage: "Compact ERI mark for use in navigation menus, compact UI elements, and alongside pillar icons.",
    when: "When a compact ERI identifier is needed without the full wordmark.",
    minWidth: "32px",
    clearSpace: "4px on all sides minimum.",
  },
];

const logoDonts = [
  "Do not stretch, skew, or distort the logo in any dimension.",
  "Do not recolour the wordmark — use the full-colour version or the CSS-inverted white version only.",
  "Do not place the colour wordmark on dark or busy photographic backgrounds without a white backing.",
  "Do not add drop shadows, outlines, or decorative effects to the logo.",
  "Do not use the icon mark as the sole brand identifier on external-facing pages.",
  "Do not place the logo below minimum size (160px wide for wordmark, 32px for icon).",
];

// ============================================================================
// SPACING & LAYOUT DATA
// ============================================================================
const spacingScale = [
  { token: "4px  (1)",  tailwind: "p-1 / m-1 / gap-1",   usage: "Icon internal padding, tight badge gaps" },
  { token: "8px  (2)",  tailwind: "p-2 / m-2 / gap-2",   usage: "Button icon gap, compact list item spacing" },
  { token: "12px (3)",  tailwind: "p-3 / m-3 / gap-3",   usage: "Card inner padding (compact), chip padding" },
  { token: "16px (4)",  tailwind: "p-4 / m-4 / gap-4",   usage: "Default card padding, section column gap" },
  { token: "20px (5)",  tailwind: "p-5 / m-5 / gap-5",   usage: "Card content padding (standard)" },
  { token: "24px (6)",  tailwind: "p-6 / m-6 / gap-6",   usage: "Card content padding (generous), section sub-gap" },
  { token: "32px (8)",  tailwind: "p-8 / m-8 / gap-8",   usage: "Grid column gap (desktop), section vertical rhythm" },
  { token: "48px (12)", tailwind: "p-12 / m-12",          usage: "Section top/bottom padding (compact pages)" },
  { token: "64px (16)", tailwind: "p-16 / m-16",          usage: "Hero section vertical padding" },
  { token: "96px (24)", tailwind: "pb-24",                 usage: "Hero section bottom padding (desktop)" },
];

const containerTokens = [
  { name: "Page Container",      class: ".container",             maxWidth: "1280px",  padding: "1rem → 1.5rem → 2rem", notes: "Auto-centered. Responsive padding: mobile 1rem, sm 1.5rem, lg+ 2rem." },
  { name: "Narrow Content",      class: "max-w-3xl mx-auto",      maxWidth: "768px",   padding: "inherited",             notes: "Long-form prose, descriptions, intro paragraphs." },
  { name: "Wide Content",        class: "max-w-6xl mx-auto px-4", maxWidth: "1152px",  padding: "1rem",                  notes: "Used in Brand Design System and most public pages." },
  { name: "Full-bleed Section",  class: "w-full",                 maxWidth: "none",    padding: "0",                     notes: "Hero sections, coloured bands. Inner content uses container or max-w-6xl." },
];

const gridPatterns = [
  { name: "2-column split",   class: "grid md:grid-cols-2 gap-8",                    usage: "Mission/Vision cards, two-option comparisons, side-by-side content" },
  { name: "3-column grid",    class: "grid md:grid-cols-3 gap-4",                    usage: "Resource cards, feature tiles, data source cards" },
  { name: "4-column grid",    class: "grid md:grid-cols-4 gap-6",                    usage: "Core values, tone-of-voice traits, pillar quick stats" },
  { name: "5-column grid",    class: "grid md:grid-cols-5 gap-4",                    usage: "Pillar colour swatches (one per pillar)" },
  { name: "Responsive list",  class: "grid sm:grid-cols-2 lg:grid-cols-3 gap-4",     usage: "Company cards, member lists, search results" },
  { name: "Dashboard sidebar", class: "flex gap-0 (sidebar 240px + flex-1 main)",    usage: "Admin/workspace pages using DashboardLayout or AdminLayout" },
];

// ============================================================================
// COLOUR SWATCH COMPONENT
// ============================================================================
function ColorSwatch({ name, hex, rgb, context }: { name: string; hex: string; rgb: string; context: string }) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(hex);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="h-24 w-full" style={{ backgroundColor: hex }} />
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="font-bold text-[#232323]">{name}</span>
          <button
            onClick={copyToClipboard}
            className="p-1.5 hover:bg-gray-100 rounded transition-colors"
            title="Copy hex code"
          >
            {copied ? <Check className="w-4 h-4 text-[#3ba559]" /> : <Copy className="w-4 h-4 text-gray-400" />}
          </button>
        </div>
        <div className="space-y-1 text-sm">
          <div className="flex gap-2">
            <span className="text-gray-500 w-10">HEX</span>
            <code className="text-gray-700 font-mono">{hex}</code>
          </div>
          <div className="flex gap-2">
            <span className="text-gray-500 w-10">RGB</span>
            <code className="text-gray-700 font-mono">{rgb}</code>
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-3 border-t pt-3">{context}</p>
      </div>
    </div>
  );
}

// ============================================================================
// CHART CONTAINER (simplified inline version for the design system page)
// ============================================================================
const chartHeaderColors: Record<string, string> = {
  green:  "#3ba559",
  cyan:   "#00B8D4",
  orange: "#F97316",
  red:    "#EF4444",
  gray:   "#6B7280",
};

function ChartContainer({ title, subtitle, headerColor = "green", children }: {
  title: string; subtitle?: string; headerColor?: string; children: React.ReactNode;
}) {
  const bg = chartHeaderColors[headerColor] || chartHeaderColors.green;
  return (
    <div className="rounded-lg border border-gray-200 overflow-hidden shadow-sm">
      <div className="px-4 py-3 text-white" style={{ backgroundColor: bg }}>
        <p className="font-bold text-sm">{title}</p>
        {subtitle && <p className="text-xs opacity-80 mt-0.5">{subtitle}</p>}
      </div>
      <div className="bg-white">{children}</div>
    </div>
  );
}

// ============================================================================
// MAIN PAGE COMPONENT
// ============================================================================
export default function BrandDesignSystem() {
  return (
    <PublicLayout>
      {/* ── HERO ── */}
      <section className="bg-[#232323] text-white pt-28 pb-16 md:pb-24" id="top">
        <div className="max-w-6xl mx-auto px-4">
          <Badge className="bg-[#3ba559] text-white mb-4 hover:bg-[#3ba559]">Brand Reference</Badge>
          <h1 className="font-archivo text-4xl md:text-5xl font-extrabold mb-6">
            Brand Design System
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl">
            The definitive guide to the Exponential Roadmap Initiative visual and verbal identity.
            This system ensures consistency, quality, and integrity across all touchpoints.
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 py-12">

        {/* ================================================================ */}
        {/* SECTION 1: BRAND PROPOSITION */}
        {/* ================================================================ */}
        <section className="mb-16" id="brand-proposition">
          <h2 className="font-archivo text-2xl md:text-3xl font-extrabold text-[#232323] mb-8">
            Brand Proposition
          </h2>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <Card className="shadow-sm">
              <CardContent className="p-6">
                <h3 className="font-bold text-[#232323] mb-3 text-lg">Mission</h3>
                <p className="text-gray-700 leading-relaxed">{brandProposition.mission}</p>
              </CardContent>
            </Card>
            <Card className="shadow-sm">
              <CardContent className="p-6">
                <h3 className="font-bold text-[#232323] mb-3 text-lg">Vision</h3>
                <p className="text-gray-700 leading-relaxed">{brandProposition.vision}</p>
              </CardContent>
            </Card>
          </div>

          <Card className="shadow-sm mb-8">
            <CardContent className="p-6">
              <h3 className="font-bold text-[#232323] mb-4 text-lg">Core Values</h3>
              <div className="grid md:grid-cols-4 gap-6">
                {brandProposition.values.map((value) => (
                  <div key={value.name}>
                    <h4 className="font-bold text-[#3ba559] mb-2">{value.name}</h4>
                    <p className="text-sm text-gray-600">{value.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm bg-gray-50 border-gray-200">
            <CardContent className="p-6">
              <h3 className="font-bold text-[#232323] mb-3 text-lg">Brand Personality</h3>
              <p className="text-gray-700 italic text-lg">"{brandProposition.personality}"</p>
            </CardContent>
          </Card>
        </section>

        {/* ================================================================ */}
        {/* SECTION 2: VISUAL IDENTITY — COLOURS */}
        {/* ================================================================ */}
        <section className="mb-16" id="visual-identity">
          <h2 className="font-archivo text-2xl md:text-3xl font-extrabold text-[#232323] mb-4">
            Visual Identity
          </h2>
          <p className="text-gray-600 mb-8 max-w-3xl">
            Our color system is built around the Five Pillars framework. Each pillar has a dedicated color
            that creates instant recognition and helps users navigate complex climate information.
          </p>

          <h3 className="font-bold text-[#232323] mb-4 text-lg">Brand Colors</h3>
          <p className="text-gray-600 mb-6 text-sm">
            Core brand colors for UI elements, text, and backgrounds. These provide the foundation for all interfaces.
          </p>
          <div className="grid md:grid-cols-4 gap-4 mb-12">
            {colorSystem.brand.map((color) => (
              <ColorSwatch key={color.id} name={color.name} hex={color.hex} rgb={color.rgb} context={color.context} />
            ))}
          </div>

          <h3 className="font-bold text-[#232323] mb-4 text-lg">Pillar Colors</h3>
          <p className="text-gray-600 mb-6 text-sm">
            These colors represent the five dimensions of organizational climate impact. Use them consistently
            to reinforce the framework structure.
          </p>
          <div className="grid md:grid-cols-5 gap-4">
            {colorSystem.pillar.map((color) => (
              <ColorSwatch key={color.id} name={color.name} hex={color.hex} rgb={color.rgb} context={color.context} />
            ))}
          </div>
        </section>

        {/* ================================================================ */}
        {/* SECTION 3: LOGO USAGE */}
        {/* ================================================================ */}
        <section className="mb-16" id="logo-usage">
          <h2 className="font-archivo text-2xl md:text-3xl font-extrabold text-[#232323] mb-4">
            Logo Usage
          </h2>
          <p className="text-gray-600 mb-8 max-w-3xl">
            Four logo assets are available. Choose based on context and background colour. Always respect
            minimum sizes and clear-space rules to maintain legibility and brand integrity.
          </p>

          <div className="grid md:grid-cols-2 gap-6 mb-10">
            {logoVariants.map((v) => (
              <Card key={v.id} className="shadow-sm overflow-hidden">
                {(v as { faviconVariant?: { file: string; filePath: string; label: string; sizes: string; note: string } }).faviconVariant ? (
                  <div className={`flex items-stretch h-32 ${v.bg} ${v.border} rounded-t-lg divide-x divide-gray-200`}>
                    <div className="flex-1 flex flex-col items-center justify-center gap-1 px-4">
                      <img src={v.file} alt={v.name} className="max-h-12 max-w-[80px] object-contain" />
                      <span className="text-[10px] text-gray-400 font-medium tracking-wide uppercase">Icon Mark</span>
                    </div>
                    <div className="flex-1 flex flex-col items-center justify-center gap-1 px-4 bg-gray-50">
                      <img
                        src={(v as { faviconVariant?: { file: string } }).faviconVariant!.file}
                        alt="Favicon"
                        className="w-8 h-8 object-contain"
                        style={{ imageRendering: "pixelated" }}
                      />
                      <span className="text-[10px] text-gray-400 font-medium tracking-wide uppercase">Favicon .ico</span>
                    </div>
                  </div>
                ) : (
                  <div className={`flex items-center justify-center h-32 ${v.bg} ${v.border} rounded-t-lg`}>
                    <img
                      src={v.file}
                      alt={v.name}
                      className="max-h-16 max-w-[200px] object-contain"
                      style={v.filter ? { filter: v.filter } : undefined}
                    />
                  </div>
                )}
                <CardContent className="p-5 space-y-3">
                  <h3 className="font-bold text-[#232323] text-base">{v.name}</h3>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                    <div>
                      <span className="text-gray-400 text-xs uppercase tracking-wide block mb-0.5">File</span>
                      <code className="text-gray-700 font-mono text-xs break-all">{v.filePath}</code>
                    </div>
                    <div>
                      <span className="text-gray-400 text-xs uppercase tracking-wide block mb-0.5">Min Width</span>
                      <span className="text-gray-700 font-mono text-xs">{v.minWidth}</span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-gray-400 text-xs uppercase tracking-wide block mb-0.5">Clear Space</span>
                      <span className="text-gray-600 text-xs">{v.clearSpace}</span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-gray-400 text-xs uppercase tracking-wide block mb-0.5">When to use</span>
                      <span className="text-gray-600 text-xs">{v.when}</span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 border-t pt-3">{v.usage}</p>
                  {v.filter && (
                    <div className="bg-gray-900 rounded p-2">
                      <code className="text-xs text-gray-300 font-mono">filter: {v.filter}</code>
                    </div>
                  )}
                  {(v as { faviconVariant?: { file: string; filePath: string; label: string; sizes: string; note: string } }).faviconVariant && (
                    <div className="border border-gray-200 rounded overflow-hidden">
                      <div className="bg-gray-50 px-3 py-1.5 border-b border-gray-200">
                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Favicon Variant</span>
                      </div>
                      <div className="px-3 py-2 grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs">
                        <div>
                          <span className="text-gray-400 text-[10px] uppercase tracking-wide block mb-0.5">File</span>
                          <code className="text-gray-700 font-mono">{(v as { faviconVariant?: { filePath: string } }).faviconVariant!.filePath}</code>
                        </div>
                        <div>
                          <span className="text-gray-400 text-[10px] uppercase tracking-wide block mb-0.5">Sizes</span>
                          <code className="text-gray-700 font-mono">{(v as { faviconVariant?: { sizes: string } }).faviconVariant!.sizes}</code>
                        </div>
                        <div className="col-span-2">
                          <span className="text-gray-400 text-[10px] uppercase tracking-wide block mb-0.5">Note</span>
                          <span className="text-gray-600">{(v as { faviconVariant?: { note: string } }).faviconVariant!.note}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="shadow-sm border-red-100 bg-red-50">
            <CardContent className="p-6">
              <h3 className="font-bold text-[#232323] mb-4 text-base flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center font-bold">!</span>
                Logo Don'ts
              </h3>
              <ul className="space-y-2">
                {logoDonts.map((dont, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-red-800">
                    <span className="text-red-400 mt-0.5 flex-shrink-0">✕</span>
                    {dont}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </section>

        {/* ================================================================ */}
        {/* SECTION 4: SPACING & LAYOUT TOKENS */}
        {/* ================================================================ */}
        <section className="mb-16" id="spacing">
          <h2 className="font-archivo text-2xl md:text-3xl font-extrabold text-[#232323] mb-4">
            Spacing &amp; Layout Tokens
          </h2>
          <p className="text-gray-600 mb-8 max-w-3xl">
            All spacing uses the standard Tailwind 4px base scale. Container widths and grid patterns
            are defined here so every page shares the same spatial rhythm.
          </p>

          <h3 className="font-bold text-[#232323] mb-4 text-lg">Container Widths</h3>
          <Card className="shadow-sm mb-10">
            <CardContent className="p-0">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left p-4 font-bold text-[#232323]">Name</th>
                    <th className="text-left p-4 font-bold text-[#232323]">Class</th>
                    <th className="text-left p-4 font-bold text-[#232323]">Max Width</th>
                    <th className="text-left p-4 font-bold text-[#232323]">Padding</th>
                    <th className="text-left p-4 font-bold text-[#232323]">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {containerTokens.map((row, i) => (
                    <tr key={row.name} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                      <td className="p-4 font-medium text-[#232323]">{row.name}</td>
                      <td className="p-4"><code className="text-xs font-mono text-[#3ba559] bg-green-50 px-1.5 py-0.5 rounded">{row.class}</code></td>
                      <td className="p-4 font-mono text-gray-700">{row.maxWidth}</td>
                      <td className="p-4 font-mono text-gray-700 text-xs">{row.padding}</td>
                      <td className="p-4 text-gray-500 text-xs">{row.notes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>

          <h3 className="font-bold text-[#232323] mb-4 text-lg">Standard Grid Patterns</h3>
          <Card className="shadow-sm mb-10">
            <CardContent className="p-0">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left p-4 font-bold text-[#232323]">Pattern</th>
                    <th className="text-left p-4 font-bold text-[#232323]">Tailwind Classes</th>
                    <th className="text-left p-4 font-bold text-[#232323]">Typical Usage</th>
                  </tr>
                </thead>
                <tbody>
                  {gridPatterns.map((row, i) => (
                    <tr key={row.name} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                      <td className="p-4 font-medium text-[#232323]">{row.name}</td>
                      <td className="p-4"><code className="text-xs font-mono text-[#3ba559] bg-green-50 px-1.5 py-0.5 rounded">{row.class}</code></td>
                      <td className="p-4 text-gray-600 text-xs">{row.usage}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>

          <h3 className="font-bold text-[#232323] mb-4 text-lg">Spacing Scale</h3>
          <div className="grid md:grid-cols-2 gap-4">
            {spacingScale.map((row) => {
              const pxVal = parseInt(row.token);
              const barW = Math.min(pxVal, 48);
              return (
                <div key={row.token} className="flex items-center gap-4 bg-white border border-gray-200 rounded-lg p-4">
                  <div className="flex-shrink-0 bg-[#3ba559] rounded" style={{ width: barW, height: 20 }} />
                  <div className="min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="font-mono text-sm font-bold text-[#232323]">{row.token}</span>
                      <code className="text-xs font-mono text-[#3ba559] bg-green-50 px-1.5 py-0.5 rounded">{row.tailwind}</code>
                    </div>
                    <p className="text-xs text-gray-500">{row.usage}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ================================================================ */}
        {/* SECTION 5: TYPOGRAPHY */}
        {/* ================================================================ */}
        <section className="mb-16" id="typography">
          <h2 className="font-archivo text-2xl md:text-3xl font-extrabold text-[#232323] mb-4">
            Typography
          </h2>
          <p className="text-gray-600 mb-8 max-w-3xl">
            The ERI platform uses a single typeface system: <strong>Archivo</strong> loaded via{" "}
            <code className="font-mono text-xs bg-gray-100 px-1 rounded">@font-face</code> in{" "}
            <code className="font-mono text-xs bg-gray-100 px-1 rounded">index.css</code>. It is mapped to both{" "}
            <code className="font-mono text-xs bg-gray-100 px-1 rounded">font-sans</code> (the Tailwind default) and the explicit{" "}
            <code className="font-mono text-xs bg-gray-100 px-1 rounded">font-archivo</code> utility. All headings default to Archivo 800 (Extra Bold) via a global{" "}
            <code className="font-mono text-xs bg-gray-100 px-1 rounded">h1–h6</code> base rule.
          </p>

          <div className="grid md:grid-cols-2 gap-6 mb-10">
            <Card className="shadow-sm">
              <CardContent className="p-6">
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">Primary &amp; Default Font</p>
                <p className="font-archivo font-extrabold text-3xl text-[#232323] mb-3">Archivo</p>
                <p className="text-sm text-gray-600 mb-3">
                  Loaded via <code className="font-mono text-xs bg-gray-100 px-1 rounded">@font-face</code> in{" "}
                  <code className="font-mono text-xs bg-gray-100 px-1 rounded">index.css</code>. Weights available: 400, 700, 800.
                </p>
                <div className="space-y-1">
                  <code className="block text-xs font-mono text-[#3ba559] bg-green-50 px-2 py-1 rounded">font-sans → Archivo (default for all text)</code>
                  <code className="block text-xs font-mono text-[#3ba559] bg-green-50 px-2 py-1 rounded">font-archivo → Archivo (explicit alias)</code>
                </div>
              </CardContent>
            </Card>
            <Card className="shadow-sm bg-amber-50 border-amber-200">
              <CardContent className="p-6">
                <p className="text-xs text-amber-600 uppercase tracking-wider mb-2 font-semibold">⚠ Note on Inter</p>
                <p className="text-sm text-amber-800 mb-3">
                  Inter is referenced in some older code as{" "}
                  <code className="font-mono text-xs bg-amber-100 px-1 rounded">font-sans</code> or{" "}
                  <code className="font-mono text-xs bg-amber-100 px-1 rounded">font-inter</code>, but it is <strong>not loaded</strong> in the current build.
                </p>
                <p className="text-sm text-amber-700">
                  Do not add Inter references. Use{" "}
                  <code className="font-mono text-xs bg-amber-100 px-1 rounded">font-sans</code> or{" "}
                  <code className="font-mono text-xs bg-amber-100 px-1 rounded">font-archivo</code> — both resolve to Archivo.
                </p>
              </CardContent>
            </Card>
          </div>

          <h3 className="font-bold text-[#232323] mb-4 text-lg">Type Scale Specimen</h3>
          <p className="text-gray-600 mb-6 text-sm">Each row shows the rendered text, the exact Tailwind classes used on live pages, and the intended context.</p>
          <Card className="shadow-sm mb-10">
            <CardContent className="p-0">
              <div className="divide-y divide-gray-100">
                {[
                  { label: "Hero H1",        classes: "font-archivo text-4xl md:text-5xl font-extrabold text-[#232323]", previewClass: "font-archivo text-4xl font-extrabold text-[#232323]",     text: "Capture Exponential Opportunities",                                  context: "Page hero headline. Used on Home, Framework, ClimateSolutions, Contact pages." },
                  { label: "Section H2",     classes: "font-archivo text-3xl md:text-4xl font-extrabold text-[#232323]", previewClass: "font-archivo text-3xl font-extrabold text-[#232323]",     text: "The Five Pillars of Climate Action",                                  context: "Major section headings within a page. Responsive: 3xl mobile → 4xl desktop." },
                  { label: "Sub-section H2", classes: "font-archivo text-2xl md:text-3xl font-extrabold text-[#232323]", previewClass: "font-archivo text-2xl font-extrabold text-[#232323]",     text: "Brand Design System",                                                context: "Used in the design system itself and for secondary section headings." },
                  { label: "Card H3",        classes: "font-bold text-[#232323] text-lg",                                previewClass: "font-bold text-[#232323] text-lg",                         text: "Cut Operational Emissions",                                          context: "Card headings, widget titles, sidebar section labels." },
                  { label: "Accent H4",      classes: "font-bold text-[#3ba559]",                                        previewClass: "font-bold text-[#3ba559]",                                 text: "Core Values · Tone of Voice",                                        context: "Small card sub-headings, feature labels, pillar accent headings." },
                  { label: "Body",           classes: "text-base text-gray-600",                                         previewClass: "text-base text-gray-600",                                  text: "The fastest economic transition in history is underway.",             context: "Standard paragraph text. 16px (1rem). Archivo 400 weight." },
                  { label: "Small / UI",     classes: "text-sm text-gray-600",                                           previewClass: "text-sm text-gray-600",                                    text: "Interactive assessment tool based on the Exponential Business Playbook v5.0", context: "Card descriptions, nav item descriptions, footer text, form labels. 14px." },
                  { label: "Caption / Meta", classes: "text-xs text-gray-500",                                           previewClass: "text-xs text-gray-500",                                    text: "Last updated · March 2026 · Exponential Roadmap Initiative",         context: "Timestamps, data source labels, badge text, table meta. 12px." },
                  { label: "Overline",       classes: "text-xs font-semibold text-gray-400 uppercase tracking-wider",    previewClass: "text-xs font-semibold text-gray-400 uppercase tracking-wider", text: "Five Pillars · Navigation · Resources",                            context: "Section category labels above headings or nav groups." },
                  { label: "Code / Mono",    classes: "text-xs font-mono text-gray-700 bg-gray-100 px-1.5 py-0.5 rounded", previewClass: "text-xs font-mono text-gray-700 bg-gray-100 px-1.5 py-0.5 rounded", text: "font-archivo text-4xl font-extrabold",                         context: "Inline code, Tailwind class references, API keys, identifiers." },
                ].map((row, i) => (
                  <div key={row.label} className={`grid md:grid-cols-[140px_1fr_1fr] gap-4 p-5 items-start ${i % 2 === 0 ? "bg-white" : "bg-gray-50"}`}>
                    <div className="flex-shrink-0">
                      <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1">{row.label}</span>
                      <code className="text-[10px] font-mono text-gray-400 break-all leading-relaxed">{row.classes}</code>
                    </div>
                    <div className="min-w-0">
                      <p className={row.previewClass}>{row.text}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">{row.context}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm bg-gray-50 border-gray-200">
            <CardContent className="p-5">
              <h4 className="font-bold text-[#232323] mb-2 text-sm">Italic Variant</h4>
              <p className="text-sm text-gray-600 mb-3">Archivo supports italic. Used sparingly for hero accent phrases and pull quotes.</p>
              <p className="font-archivo font-extrabold text-2xl text-[#232323] italic">"The fastest economic transition in history"</p>
              <code className="text-xs font-mono text-gray-500 mt-2 block">font-archivo font-extrabold italic text-2xl text-[#232323]</code>
            </CardContent>
          </Card>
        </section>

        {/* ================================================================ */}
        {/* SECTION 6: VERBAL IDENTITY */}
        {/* ================================================================ */}
        <section className="mb-16" id="verbal-identity">
          <h2 className="font-archivo text-2xl md:text-3xl font-extrabold text-[#232323] mb-4">
            Verbal Identity
          </h2>
          <p className="text-gray-600 mb-8 max-w-3xl">
            How we communicate is as important as what we communicate. Our voice reflects our values
            and builds trust with our audience.
          </p>

          <h3 className="font-bold text-[#232323] mb-4 text-lg">Tone of Voice</h3>
          <div className="grid md:grid-cols-4 gap-4 mb-12">
            {verbalIdentity.toneOfVoice.map((item) => (
              <Card key={item.trait} className="shadow-sm">
                <CardContent className="p-5">
                  <h4 className="font-bold text-[#3ba559] mb-2">{item.trait}</h4>
                  <p className="text-sm text-gray-600">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <h3 className="font-bold text-[#232323] mb-4 text-lg">Writing Principles</h3>
          <div className="grid md:grid-cols-2 gap-4 mb-12">
            {verbalIdentity.writingPrinciples.map((item) => (
              <Card key={item.principle} className="shadow-sm">
                <CardContent className="p-5">
                  <h4 className="font-bold text-[#232323] mb-2">{item.principle}</h4>
                  <p className="text-sm text-gray-500 italic">{item.example}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <h3 className="font-bold text-[#232323] mb-4 text-lg">Preferred Terminology</h3>
          <Card className="shadow-sm">
            <CardContent className="p-0">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left p-4 font-bold text-[#232323]">Use This</th>
                    <th className="text-left p-4 font-bold text-[#232323]">Instead Of</th>
                  </tr>
                </thead>
                <tbody>
                  {verbalIdentity.terminology.map((item, index) => (
                    <tr key={item.term} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                      <td className="p-4 text-[#3ba559] font-medium">{item.term}</td>
                      <td className="p-4 text-gray-500 line-through">{item.avoid}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </section>

        {/* ================================================================ */}
        {/* SECTION 7: COMPONENT LIBRARY (ChartContainer) */}
        {/* ================================================================ */}
        <section className="mb-16" id="component-library">
          <h2 className="font-archivo text-2xl md:text-3xl font-extrabold text-[#232323] mb-4">
            Component Library
          </h2>
          <p className="text-gray-600 mb-8 max-w-3xl">
            Reusable components that enforce brand standards through their API. These components ensure
            consistency and prevent styling violations.
          </p>

          <h3 className="font-bold text-[#232323] mb-4 text-lg">ChartContainer</h3>
          <p className="text-gray-600 mb-6 text-sm">
            Use for any section requiring a colored header. The component restricts colors to the approved palette.
          </p>

          <div className="grid md:grid-cols-3 gap-4 mb-8">
            <ChartContainer title="P1/P3 Content" subtitle="Operations or Solutions" headerColor="green">
              <p className="text-gray-600 text-sm p-4">Green header for Pillar 1 (Operations) or Pillar 3 (Solutions) content.</p>
            </ChartContainer>
            <ChartContainer title="P2 Content" subtitle="Value Chain" headerColor="cyan">
              <p className="text-gray-600 text-sm p-4">Cyan header for Pillar 2 (Value Chain) content.</p>
            </ChartContainer>
            <ChartContainer title="P4 Content" subtitle="Finance" headerColor="orange">
              <p className="text-gray-600 text-sm p-4">Orange header for Pillar 4 (Finance) content.</p>
            </ChartContainer>
          </div>

          <Card className="shadow-sm bg-gray-900">
            <CardContent className="p-6">
              <h4 className="font-bold text-white mb-3">Usage</h4>
              <pre className="text-sm text-gray-300 overflow-x-auto">{`import { ChartContainer } from "@/components/ui/chart-container";

<ChartContainer
  title="Section Title"
  subtitle="Optional subtitle"
  headerColor="green" // green | cyan | orange | red | gray
>
  {/* Your content */}
</ChartContainer>`}</pre>
            </CardContent>
          </Card>
        </section>

        {/* ================================================================ */}
        {/* SECTION 8: PILLAR ICON ASSETS */}
        {/* ================================================================ */}
        <section className="mb-16" id="pillar-icons">
          <h2 className="font-archivo text-2xl md:text-3xl font-extrabold text-[#232323] mb-4">
            Pillar Icon Assets
          </h2>
          <p className="text-gray-600 mb-8 max-w-3xl">
            Five webp images represent the Exponential Framework pillars. They appear in the full-screen navigation overlay, pillar detail pages, and framework diagrams. Import from{" "}
            <code className="text-sm font-mono bg-gray-100 px-1.5 py-0.5 rounded">client/src/lib/pillarColors.ts</code> for the canonical hex colours — never hard-code pillar colours inline.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
            {[
              { num: 1, name: "Cut Operational Emissions",     shortName: "Operations", color: "#6B8068", colorName: "Gray-Green", img: pillarBottomIcons.pillar1 },
              { num: 2, name: "Decarbonize Value Chain",       shortName: "Value Chain", color: "#00B8D4", colorName: "Cyan",       img: pillarBottomIcons.pillar2 },
              { num: 3, name: "Build & Scale Solutions",       shortName: "Solutions",   color: "#3ba559", colorName: "ERI Green",  img: pillarBottomIcons.pillar3 },
              { num: 4, name: "Mobilize Finance & Investment", shortName: "Finance",     color: "#F97316", colorName: "Orange",     img: pillarBottomIcons.pillar4 },
              { num: 5, name: "Shape Policy & Narrative",      shortName: "Policy",      color: "#EF4444", colorName: "Red",        img: pillarBottomIcons.pillar5 },
            ].map((p) => (
              <Card key={p.num} className="shadow-sm overflow-hidden">
                <div className="flex items-center justify-center p-4" style={{ backgroundColor: `${p.color}20` }}>
                  <img src={p.img} alt={`Pillar ${p.num} icon`} className="w-20 h-20 object-contain" />
                </div>
                <CardContent className="p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="inline-block w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: p.color }} />
                    <span className="text-xs font-semibold text-gray-700">Pillar {p.num}</span>
                  </div>
                  <p className="text-xs text-gray-600 leading-snug mb-2">{p.name}</p>
                  <code className="text-[10px] font-mono text-gray-400 block">pillar{p.num}-bottom.webp</code>
                  <div className="mt-2 flex items-center gap-1.5">
                    <span className="inline-block w-4 h-4 rounded border border-gray-200 flex-shrink-0" style={{ backgroundColor: p.color }} />
                    <code className="text-[10px] font-mono text-gray-500">{p.color}</code>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* ERI Pillar Marks */}
          <h3 className="font-bold text-[#232323] mb-4 text-lg">ERI Pillar Marks</h3>
          <p className="text-gray-600 mb-4 text-sm">Compact square marks used in navigation menus and compact UI contexts.</p>
          <div className="grid grid-cols-5 gap-4 mb-8">
            {[
              { num: 1, color: "#6B8068", img: pillarMarks.pillar1 },
              { num: 2, color: "#00B8D4", img: pillarMarks.pillar2 },
              { num: 3, color: "#3ba559", img: pillarMarks.pillar3 },
              { num: 4, color: "#F97316", img: pillarMarks.pillar4 },
              { num: 5, color: "#EF4444", img: pillarMarks.pillar5 },
            ].map((p) => (
              <div key={p.num} className="flex flex-col items-center gap-2">
                <div className="w-16 h-16 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${p.color}20` }}>
                  <img src={p.img} alt={`ERI Pillar ${p.num} mark`} className="w-12 h-12 object-contain" />
                </div>
                <code className="text-[10px] font-mono text-gray-400">ERI_Pillar{p.num}.webp</code>
              </div>
            ))}
          </div>

          <Card className="shadow-sm">
            <CardContent className="p-5">
              <h4 className="font-bold text-[#232323] mb-3 text-sm">Usage Pattern</h4>
              <pre className="text-xs font-mono bg-gray-50 p-4 rounded overflow-x-auto text-gray-700 leading-relaxed">{`// Always import canonical colours from pillarColors.ts
import { pillarColors, pillarMeta } from "@/lib/pillarColors";
import { pillarBottomIcons } from "@/lib/assets";

// Render pillar icon with correct background tint
<div style={{ backgroundColor: pillarColors.pillar3 + "20" }}>
  <img src={pillarBottomIcons.pillar3} alt="Build & Scale Solutions" className="w-16 h-16" />
</div>

// Or iterate all five pillars
{pillarMeta.map((p) => (
  <img key={p.id} src={pillarBottomIcons[\`pillar\${p.id}\`]} alt={p.name} />
))}`}</pre>
            </CardContent>
          </Card>
        </section>

        {/* ================================================================ */}
        {/* SECTION 9: PAGE LAYOUT SHELLS */}
        {/* ================================================================ */}
        <section className="mb-16" id="page-layout">
          <h2 className="font-archivo text-2xl md:text-3xl font-extrabold text-[#232323] mb-4">
            Page Layout Shells
          </h2>
          <p className="text-gray-600 mb-8 max-w-3xl">
            Every public-facing ERI page uses{" "}
            <code className="text-sm font-mono bg-gray-100 px-1.5 py-0.5 rounded">PublicLayout</code> which composes the persistent Header and Footer around a flexible content area. Use these shells — never build a custom header or footer from scratch.
          </p>

          <h3 className="font-bold text-[#232323] mb-4 text-lg">PublicLayout</h3>
          <Card className="shadow-sm mb-6">
            <CardContent className="p-0">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left p-4 font-bold text-[#232323]">Prop</th>
                    <th className="text-left p-4 font-bold text-[#232323]">Type</th>
                    <th className="text-left p-4 font-bold text-[#232323]">Default</th>
                    <th className="text-left p-4 font-bold text-[#232323]">Description</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { prop: "children", type: "ReactNode", def: "—", desc: "Page content. Rendered inside <main> between header and footer." },
                    { prop: "hideFooter", type: "boolean", def: "false", desc: "Set true on pages where the footer would be redundant (e.g. full-screen app views)." },
                    { prop: "transparentHeader", type: "boolean", def: "false", desc: "Makes the header background transparent until scrolled. Use on hero pages with a dark/image background." },
                  ].map((row, i) => (
                    <tr key={row.prop} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                      <td className="p-4"><code className="text-xs font-mono text-[#3ba559] bg-green-50 px-1.5 py-0.5 rounded">{row.prop}</code></td>
                      <td className="p-4 font-mono text-gray-600 text-xs">{row.type}</td>
                      <td className="p-4 font-mono text-gray-600 text-xs">{row.def}</td>
                      <td className="p-4 text-gray-600 text-xs">{row.desc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
          <Card className="shadow-sm bg-gray-900 mb-10">
            <CardContent className="p-6">
              <pre className="text-sm text-gray-300 overflow-x-auto">{`import PublicLayout from "@/components/PublicLayout";

// Standard public page
export default function MyPage() {
  return (
    <PublicLayout>
      {/* First child should be a hero section with pt-16 to clear the fixed header */}
      <section className="pt-16 bg-[#232323] text-white">
        ...
      </section>
    </PublicLayout>
  );
}

// Hero page with transparent header
export default function HeroPage() {
  return (
    <PublicLayout transparentHeader>
      <section className="min-h-screen bg-cover bg-center">...</section>
    </PublicLayout>
  );
}`}</pre>
            </CardContent>
          </Card>

          {/* Header Anatomy */}
          <h3 className="font-bold text-[#232323] mb-4 text-lg">Header Anatomy</h3>
          <p className="text-gray-600 mb-4 text-sm">The header is fixed (<code className="font-mono text-xs bg-gray-100 px-1 rounded">position: fixed; top: 0; z-50</code>), 64px tall, white with shadow. It has two zones:</p>
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <Card className="shadow-sm">
              <CardContent className="p-5">
                <h4 className="font-bold text-[#232323] mb-3">Left Zone — Logo &amp; Context</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex gap-2"><span className="text-[#3ba559] font-bold">1.</span> ERI full-colour wordmark SVG (<code className="font-mono text-xs">h-8</code>), links to <code className="font-mono text-xs">/</code></li>
                  <li className="flex gap-2"><span className="text-[#3ba559] font-bold">2.</span> Platform super-title: <em>"Brand Design System"</em> — <code className="font-mono text-xs">text-xs uppercase tracking-widest text-gray-500</code></li>
                  <li className="flex gap-2"><span className="text-[#3ba559] font-bold">3.</span> Context sub-title: <em>"Exponential Roadmap Initiative"</em> — <code className="font-mono text-xs">text-[11px] text-gray-400</code></li>
                </ul>
              </CardContent>
            </Card>
            <Card className="shadow-sm">
              <CardContent className="p-5">
                <h4 className="font-bold text-[#232323] mb-3">Right Zone — Nav &amp; Menu</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex gap-2"><span className="text-[#3ba559] font-bold">1.</span> Desktop nav links: Brand, Colours, Typography, Components, ERI Website</li>
                  <li className="flex gap-2"><span className="text-[#3ba559] font-bold">2.</span> Mobile: hamburger button opens full-screen overlay menu</li>
                </ul>
                <div className="mt-4 pt-4 border-t">
                  <h5 className="font-bold text-[#232323] mb-2 text-sm">Background States</h5>
                  <div className="space-y-1 text-xs text-gray-600">
                    <div><code className="font-mono bg-gray-100 px-1 rounded">default</code> — bg-white border-b border-gray-200 shadow-sm</div>
                    <div><code className="font-mono bg-gray-100 px-1 rounded">transparentHeader</code> — bg-transparent, transitions to white on scroll</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Header visual mockup */}
          <h3 className="font-bold text-[#232323] mb-4 text-lg">Header — Visual Example</h3>
          <div className="space-y-4 mb-10">
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">State 1 — Default (white background)</p>
              <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                <div className="bg-white border-b border-gray-200">
                  <div className="px-4">
                    <div className="flex items-center justify-between h-16">
                      <div className="flex items-center gap-3">
                        <img src={logos.eriLogoFullColor} alt="ERI" className="h-8" />
                        <div className="flex flex-col leading-tight">
                          <span className="text-xs font-semibold tracking-widest text-gray-500 uppercase">Brand Design System</span>
                          <span className="text-[11px] text-gray-400">Exponential Roadmap Initiative</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-sm text-gray-600">Brand</span>
                        <span className="text-sm text-gray-600">Colours</span>
                        <span className="text-sm text-[#3ba559] font-medium">ERI Website →</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-2 text-xs text-gray-500 font-mono">bg-white · h-16 · fixed top-0 z-50 · border-b border-gray-200 shadow-sm</div>
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">State 2 — Transparent header (on dark hero section)</p>
              <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                <div className="bg-[#1a2e1a]">
                  <div className="px-4">
                    <div className="flex items-center justify-between h-16">
                      <div className="flex items-center gap-3">
                        <img src={logos.eriLogoFullColor} alt="ERI" className="h-8" style={{ filter: "brightness(0) invert(1)" }} />
                        <div className="flex flex-col leading-tight">
                          <span className="text-xs font-semibold tracking-widest text-gray-400 uppercase">Brand Design System</span>
                          <span className="text-[11px] text-gray-500">Exponential Roadmap Initiative</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-sm text-gray-400">Brand</span>
                        <span className="text-sm text-[#3ba559] font-medium">ERI Website →</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-2 text-xs text-gray-500 font-mono">transparentHeader=true · bg-transparent · logo filter: brightness(0) invert(1)</div>
              </div>
            </div>
          </div>

          {/* Footer anatomy */}
          <h3 className="font-bold text-[#232323] mb-4 text-lg">Footer Anatomy</h3>
          <p className="text-gray-600 mb-4 text-sm">Dark green background (<code className="font-mono text-xs bg-gray-100 px-1 rounded">bg-[#1a2e1a]</code>), <code className="font-mono text-xs bg-gray-100 px-1 rounded">py-12</code> padding. Three-column grid on desktop.</p>
          <Card className="shadow-sm mb-6">
            <CardContent className="p-0">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left p-4 font-bold text-[#232323]">Column</th>
                    <th className="text-left p-4 font-bold text-[#232323]">Content</th>
                    <th className="text-left p-4 font-bold text-[#232323]">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { col: "Brand (col 1)", content: "ERI full-colour wordmark (h-8, inverted to white) + one-line description", notes: "Logo inverted with filter: brightness(0) invert(1). Links to homepage." },
                    { col: "Resources (col 2)", content: "Links: Brand Guidelines, Component Library, Colour Tokens, Typography, Badge Reference", notes: "Internal anchor links. text-gray-400 hover:text-[#3ba559]." },
                    { col: "Contact (col 3)", content: "exponentialroadmap.org, Exponential Roadmap Initiative, Business Playbook", notes: "All open in new tab. Same link style as Resources." },
                  ].map((row, i) => (
                    <tr key={row.col} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                      <td className="p-4 font-medium text-[#232323]">{row.col}</td>
                      <td className="p-4 text-gray-600 text-xs">{row.content}</td>
                      <td className="p-4 text-gray-500 text-xs">{row.notes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>

          {/* Footer visual mockup */}
          <h3 className="font-bold text-[#232323] mb-4 text-lg">Footer — Visual Example</h3>
          <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm mb-2">
            <footer className="bg-[#1a2e1a] text-white">
              <div className="px-6 py-10">
                <div className="grid md:grid-cols-3 gap-8">
                  <div>
                    <img src={logos.eriLogoFullColor} alt="ERI" className="h-8 mb-4" style={{ filter: "brightness(0) invert(1)" }} />
                    <p className="text-sm text-gray-400">The official brand design system for all ERI digital products.</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-white mb-4">Resources</h3>
                    <ul className="space-y-2">
                      {["Brand Guidelines", "Component Library", "Colour Tokens"].map(l => (
                        <li key={l}><span className="text-sm text-gray-400 hover:text-[#3ba559] transition-colors cursor-pointer">{l}</span></li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold text-white mb-4">Contact</h3>
                    <ul className="space-y-2">
                      {["exponentialroadmap.org", "Exponential Roadmap Initiative", "Business Playbook"].map(l => (
                        <li key={l}><span className="text-sm text-gray-400 hover:text-[#3ba559] transition-colors cursor-pointer">{l}</span></li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="mt-10 pt-6 border-t border-gray-700">
                  <p className="text-sm text-gray-500 text-center">© {new Date().getFullYear()} Exponential Roadmap Initiative. All rights reserved. | Based on Exponential Business Playbook v5.0</p>
                </div>
              </div>
            </footer>
            <div className="bg-gray-50 px-4 py-2 text-xs text-gray-500 font-mono">bg-[#1a2e1a] · text-white · grid md:grid-cols-3 · py-12 · border-t border-gray-700</div>
          </div>
        </section>

        {/* ================================================================ */}
        {/* SECTION 10: BADGE REFERENCE */}
        {/* ================================================================ */}
        <section className="mb-16" id="badges">
          <h2 className="font-archivo text-2xl md:text-3xl font-extrabold text-[#232323] mb-4">
            Badge Reference
          </h2>
          <p className="text-gray-600 mb-8 max-w-3xl">
            Badges are used throughout the platform to communicate status, tier, priority, data type, and qualification. Always use the canonical classes below — never invent new badge colours.
          </p>

          {/* 1. Tier Badges */}
          <h3 className="font-bold text-[#232323] mb-3 text-lg">1. Tier Badges</h3>
          <p className="text-gray-600 mb-4 text-sm">Used in the header, workspace hub, and assessment pages to indicate a company's transformation tier.</p>
          <Card className="shadow-sm mb-8">
            <CardContent className="p-5">
              <div className="flex flex-wrap gap-4 mb-4">
                <div className="flex flex-col items-start gap-1.5">
                  <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-gray-200 text-gray-700">Silver</span>
                  <code className="text-[10px] font-mono text-gray-400">bg-gray-200 text-gray-700</code>
                </div>
                <div className="flex flex-col items-start gap-1.5">
                  <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-yellow-100 text-yellow-800">Gold</span>
                  <code className="text-[10px] font-mono text-gray-400">bg-yellow-100 text-yellow-800</code>
                </div>
                <div className="flex flex-col items-start gap-1.5">
                  <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-purple-100 text-purple-800">Platinum</span>
                  <code className="text-[10px] font-mono text-gray-400">bg-purple-100 text-purple-800</code>
                </div>
              </div>
              <p className="text-xs text-gray-500">Shape: <code className="font-mono">rounded</code> (not rounded-full) · Size: <code className="font-mono">text-[10px] px-1.5 py-0.5</code> · Weight: <code className="font-mono">font-medium capitalize</code></p>
            </CardContent>
          </Card>

          {/* 2. System & Experimental Badges */}
          <h3 className="font-bold text-[#232323] mb-3 text-lg">2. System &amp; Experimental Badges</h3>
          <p className="text-gray-600 mb-4 text-sm">Used in the header and on feature flags to signal development status.</p>
          <Card className="shadow-sm mb-8">
            <CardContent className="p-5">
              <div className="flex flex-wrap gap-4 mb-4">
                <div className="flex flex-col items-start gap-1.5">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-medium bg-red-50 text-red-600 border border-red-100">Experimental Development for early feedback</span>
                  <code className="text-[10px] font-mono text-gray-400">bg-red-50 text-red-600 border-red-100 rounded-full</code>
                </div>
                <div className="flex flex-col items-start gap-1.5">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-[#3ba559]/15 text-[#3ba559] border border-[#3ba559]/30">Active</span>
                  <code className="text-[10px] font-mono text-gray-400">bg-[#3ba559]/15 text-[#3ba559] border-[#3ba559]/30</code>
                </div>
                <div className="flex flex-col items-start gap-1.5">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">Inactive</span>
                  <code className="text-[10px] font-mono text-gray-400">bg-gray-100 text-gray-600</code>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 3. Priority Badges */}
          <h3 className="font-bold text-[#232323] mb-3 text-lg">3. Priority Badges</h3>
          <p className="text-gray-600 mb-4 text-sm">Used in CPR Recommendations and action lists to indicate urgency level.</p>
          <Card className="shadow-sm mb-8">
            <CardContent className="p-5">
              <div className="flex flex-wrap gap-4 mb-4">
                {[
                  { label: "Critical", cls: "bg-red-100 text-red-700 border-red-200" },
                  { label: "High",     cls: "bg-amber-100 text-amber-700 border-amber-200" },
                  { label: "Medium",   cls: "bg-[#00B8D4]/10 text-[#00B8D4] border-[#00B8D4]/30" },
                  { label: "Low",      cls: "bg-gray-100 text-gray-600 border-gray-200" },
                ].map(({ label, cls }) => (
                  <div key={label} className="flex flex-col items-start gap-1.5">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${cls}`}>{label}</span>
                    <code className="text-[10px] font-mono text-gray-400">{cls}</code>
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-500">Shape: <code className="font-mono">rounded-full</code> · Size: <code className="font-mono">text-xs px-2 py-0.5</code> · Always include <code className="font-mono">border</code></p>
            </CardContent>
          </Card>

          {/* 4. KPI & Framework Badges */}
          <h3 className="font-bold text-[#232323] mb-3 text-lg">4. KPI &amp; Framework Badges</h3>
          <p className="text-gray-600 mb-4 text-sm">Used in KPI sections and action themes to classify framework items.</p>
          <Card className="shadow-sm mb-8">
            <CardContent className="p-5">
              <div className="flex flex-wrap gap-4 mb-4">
                {[
                  { label: "SOLVED",    cls: "bg-[#3ba559]/15 text-[#3ba559]" },
                  { label: "PRIMARY",   cls: "bg-cyan-100 text-cyan-700" },
                  { label: "SECONDARY", cls: "bg-orange-100 text-orange-700" },
                  { label: "DEFAULT",   cls: "bg-gray-100 text-gray-700" },
                ].map(({ label, cls }) => (
                  <div key={label} className="flex flex-col items-start gap-1.5">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${cls}`}>{label}</span>
                    <code className="text-[10px] font-mono text-gray-400">{cls}</code>
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-500">Shape: <code className="font-mono">rounded</code> (square corners) · Size: <code className="font-mono">text-xs px-2 py-0.5</code> · Text UPPERCASE in display</p>
            </CardContent>
          </Card>

          {/* 5. Qualification & Status Badges */}
          <h3 className="font-bold text-[#232323] mb-3 text-lg">5. Qualification &amp; Status Badges</h3>
          <p className="text-gray-600 mb-4 text-sm">Used in Climate Solutions qualification, case study cards, and pillar content.</p>
          <Card className="shadow-sm mb-8">
            <CardContent className="p-5">
              <div className="flex flex-wrap gap-4 mb-4">
                {[
                  { label: "Qualified",     cls: "bg-[#3ba559]/15 text-[#3ba559] border-[#3ba559]/40" },
                  { label: "Partial",       cls: "bg-amber-100 text-amber-800 border-amber-300" },
                  { label: "Not Qualified", cls: "bg-red-100 text-red-800 border-red-300" },
                  { label: "Unknown",       cls: "bg-gray-100 text-gray-600 border-gray-200" },
                ].map(({ label, cls }) => (
                  <div key={label} className="flex flex-col items-start gap-1.5">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${cls}`}>{label}</span>
                    <code className="text-[10px] font-mono text-gray-400">{cls}</code>
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-500">Shape: <code className="font-mono">rounded-full</code> · Size: <code className="font-mono">text-xs px-3 py-1</code> · Always include <code className="font-mono">border</code></p>
            </CardContent>
          </Card>

          {/* 6. Data Source Badges */}
          <h3 className="font-bold text-[#232323] mb-3 text-lg">6. Data Source &amp; API Badges</h3>
          <p className="text-gray-600 mb-4 text-sm">Used in DataSourceCard, DataSourcesTable, and widget headers to show data freshness and source type.</p>
          <Card className="shadow-sm mb-8">
            <CardContent className="p-5">
              <div className="flex flex-wrap gap-4 mb-4">
                {[
                  { label: "Healthy",  cls: "bg-[#3ba559] text-white" },
                  { label: "Stale",    cls: "bg-yellow-500 text-white" },
                  { label: "Error",    cls: "bg-red-600 text-white" },
                  { label: "Unknown",  cls: "border border-gray-200 text-gray-600" },
                  { label: "Live API", cls: "bg-[#3ba559]/10 text-[#3ba559] border border-[#3ba559]/30" },
                  { label: "REST",     cls: "border border-gray-200 text-gray-600 font-mono" },
                ].map(({ label, cls }) => (
                  <div key={label} className="flex flex-col items-start gap-1.5">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${cls}`}>{label}</span>
                    <code className="text-[10px] font-mono text-gray-400">{cls}</code>
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-500">Use shadcn <code className="font-mono">&lt;Badge&gt;</code> component from <code className="font-mono">@/components/ui/badge</code> for these.</p>
            </CardContent>
          </Card>

          {/* 7. Opportunity Badges */}
          <h3 className="font-bold text-[#232323] mb-3 text-lg">7. Opportunity &amp; Category Badges</h3>
          <p className="text-gray-600 mb-4 text-sm">Used in CPR Opportunities and impact portfolio to categorise opportunity types.</p>
          <Card className="shadow-sm mb-8">
            <CardContent className="p-5">
              <div className="flex flex-wrap gap-4 mb-4">
                {[
                  { label: "Revenue",    cls: "bg-[#3ba559]/15 text-[#3ba559]" },
                  { label: "Efficiency", cls: "bg-[#00B8D4]/10 text-[#00B8D4]" },
                  { label: "Risk",       cls: "bg-purple-100 text-purple-700" },
                ].map(({ label, cls }) => (
                  <div key={label} className="flex flex-col items-start gap-1.5">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${cls}`}>{label}</span>
                    <code className="text-[10px] font-mono text-gray-400">{cls}</code>
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-500">Shape: <code className="font-mono">rounded-full</code> · Size: <code className="font-mono">text-xs px-2 py-0.5</code> · No border on these</p>
            </CardContent>
          </Card>

          {/* Badge Anatomy Quick Reference */}
          <h3 className="font-bold text-[#232323] mb-3 text-lg">Badge Anatomy Quick Reference</h3>
          <Card className="shadow-sm">
            <CardContent className="p-0">
              <table className="w-full text-xs">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left p-3 font-bold text-[#232323]">Family</th>
                    <th className="text-left p-3 font-bold text-[#232323]">Shape</th>
                    <th className="text-left p-3 font-bold text-[#232323]">Size</th>
                    <th className="text-left p-3 font-bold text-[#232323]">Border</th>
                    <th className="text-left p-3 font-bold text-[#232323]">Where used</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { family: "Tier",          shape: "rounded",      size: "text-[10px] px-1.5 py-0.5", border: "No",     where: "Header, WorkspaceHub, assessment pages" },
                    { family: "Experimental",  shape: "rounded-full", size: "text-[11px] px-2.5 py-1",   border: "Yes",    where: "Header right zone" },
                    { family: "Priority",      shape: "rounded-full", size: "text-xs px-2 py-0.5",        border: "Yes",    where: "CPR Recommendations, action lists" },
                    { family: "KPI / Framework", shape: "rounded",    size: "text-xs px-2 py-0.5",        border: "No",     where: "KPI sections, action themes" },
                    { family: "Qualification", shape: "rounded-full", size: "text-xs px-3 py-1",          border: "Yes",    where: "Climate Solutions, case study cards" },
                    { family: "Data Source",   shape: "rounded",      size: "text-xs px-2 py-0.5",        border: "Varies", where: "DataSourceCard, widget headers, data lake" },
                    { family: "Opportunity",   shape: "rounded-full", size: "text-xs px-2 py-0.5",        border: "No",     where: "CPR Opportunities, impact portfolio" },
                  ].map((row, i) => (
                    <tr key={row.family} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                      <td className="p-3 font-medium text-[#232323]">{row.family}</td>
                      <td className="p-3 font-mono text-gray-600">{row.shape}</td>
                      <td className="p-3 font-mono text-gray-600">{row.size}</td>
                      <td className="p-3 text-gray-600">{row.border}</td>
                      <td className="p-3 text-gray-500">{row.where}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </section>

        {/* ================================================================ */}
        {/* SECTION 11: INTERACTIVE STATES */}
        {/* ================================================================ */}
        <section className="mb-16" id="interactive-states">
          <h2 className="font-archivo text-2xl md:text-3xl font-extrabold text-[#232323] mb-4">
            Interactive States
          </h2>
          <p className="text-gray-600 mb-8 max-w-3xl">
            Consistent hover, active, and focus states reinforce the brand colour system and improve usability.
          </p>

          <div className="grid md:grid-cols-2 gap-8 mb-10">
            {/* Link & Text Colours */}
            <Card className="shadow-sm">
              <CardContent className="p-6">
                <h3 className="font-bold text-[#232323] mb-4">Link &amp; Text Colours</h3>
                <div className="space-y-3">
                  {[
                    { label: "Primary link",  cls: "text-[#3ba559]",  preview: "text-[#3ba559]",  desc: "Default interactive colour for links, active nav items, icons" },
                    { label: "Link hover",    cls: "hover:text-[#2d8a47]", preview: "text-[#2d8a47]", desc: "Darker green on hover — use with transition-colors" },
                    { label: "Body text",     cls: "text-gray-600",   preview: "text-gray-600",   desc: "Standard body copy, descriptions, secondary labels" },
                    { label: "Muted text",    cls: "text-gray-500",   preview: "text-gray-500",   desc: "Captions, timestamps, placeholder text" },
                    { label: "Heading text",  cls: "text-[#232323]",  preview: "text-[#232323]",  desc: "All headings and primary labels" },
                    { label: "Destructive",   cls: "text-red-600",    preview: "text-red-600",    desc: "Logout, delete, error states" },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center gap-3">
                      <span className={`text-sm font-medium w-36 flex-shrink-0 ${item.preview}`}>{item.label}</span>
                      <code className="text-xs font-mono text-gray-500 bg-gray-50 px-1.5 py-0.5 rounded flex-shrink-0">{item.cls}</code>
                      <span className="text-xs text-gray-400">{item.desc}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Background & Border States */}
            <Card className="shadow-sm">
              <CardContent className="p-6">
                <h3 className="font-bold text-[#232323] mb-4">Background &amp; Border States</h3>
                <div className="space-y-3">
                  {[
                    { label: "Page background", cls: "bg-[#F9FAFB]",       preview: "bg-[#F9FAFB] border border-gray-200",   desc: "Default page background" },
                    { label: "Card background",  cls: "bg-white",           preview: "bg-white border border-gray-200",       desc: "All Card components" },
                    { label: "Hover row/item",   cls: "hover:bg-gray-100",  preview: "bg-gray-100",                           desc: "Table rows, list items, nav items on hover" },
                    { label: "Subtle fill",      cls: "bg-gray-50",         preview: "bg-gray-50 border border-gray-200",     desc: "Table header rows, alternating rows" },
                    { label: "Dark section",     cls: "bg-[#232323]",       preview: "bg-[#232323]",                          desc: "Hero sections, dark cards, code blocks" },
                    { label: "Active border",    cls: "border-[#3ba559]",   preview: "border-[#3ba559] border-2",             desc: "Active nav item bottom border, focus ring" },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center gap-3">
                      <div className={`w-8 h-5 rounded flex-shrink-0 ${item.preview}`} />
                      <code className="text-xs font-mono text-gray-500 bg-gray-50 px-1.5 py-0.5 rounded flex-shrink-0">{item.cls}</code>
                      <span className="text-xs text-gray-400">{item.desc}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Transition utilities */}
          <Card className="shadow-sm bg-gray-900">
            <CardContent className="p-6">
              <h4 className="font-bold text-white mb-3">Standard Transition Utilities</h4>
              <pre className="text-sm text-gray-300 overflow-x-auto">{`// Colour transitions (links, buttons, icons)
className="transition-colors"

// All property transitions (cards, shadows, transforms)
className="transition-all"

// Translate on hover (arrow icons in nav)
className="group-hover:translate-x-1"

// Shadow elevation on hover (cards)
className="shadow-sm hover:shadow-md transition-shadow"

// Always pair with a duration class if non-default speed is needed:
className="transition-all duration-300 ease-in-out"`}</pre>
            </CardContent>
          </Card>
        </section>

        {/* ================================================================ */}
        {/* SECTION 12: UI COMPONENTS */}
        {/* ================================================================ */}
        <section className="mb-16" id="components">
          <h2 className="font-archivo text-2xl md:text-3xl font-extrabold text-[#232323] mb-4">
            UI Components
          </h2>
          <p className="text-gray-600 mb-8 max-w-3xl">
            All interactive components use <strong>shadcn/ui</strong> as the base. Two tab patterns exist — use the right one for the right context. Always import from{" "}
            <code className="font-mono text-xs bg-gray-100 px-1 rounded">@/components/ui/*</code> or{" "}
            <code className="font-mono text-xs bg-gray-100 px-1 rounded">@/components/SimpleTabNav</code>.
          </p>

          {/* 1. Page Navigation Tabs */}
          <h3 className="font-bold text-[#232323] mb-3 text-lg">1. Page Navigation Tabs — <code className="font-mono text-base font-normal">SimpleTabNav</code></h3>
          <p className="text-gray-600 mb-4 text-sm">Used for <strong>page-level navigation</strong> where each tab changes the URL. Features: URL-driven active state, icon + label + count, green underline indicator, no background fill.</p>
          <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm mb-3">
            <div className="flex items-center gap-1 border-b border-gray-200 bg-white overflow-x-auto">
              {[
                { id: "file",      label: "File",      count: 7,  icon: <FileText className="w-4 h-4" /> },
                { id: "api",       label: "API",       count: 5,  icon: <Plug className="w-4 h-4" /> },
                { id: "eri",       label: "ERI",       count: 5,  icon: <Layers className="w-4 h-4" /> },
                { id: "reference", label: "Reference", count: 2,  icon: <BookOpen className="w-4 h-4" /> },
                { id: "overview",  label: "Overview",  count: 19, icon: <BarChart3 className="w-4 h-4" /> },
              ].map((tab, i) => (
                <div
                  key={tab.id}
                  className={`relative px-4 py-2.5 text-sm font-medium transition-colors cursor-pointer flex-shrink-0 ${
                    i === 0 ? "text-[#232323]" : "text-gray-500 hover:text-[#232323]"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4">{tab.icon}</span>
                    <span>{tab.label}</span>
                    <span className="text-xs text-gray-400">({tab.count})</span>
                  </div>
                  {i === 0 && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#3ba559]" />}
                </div>
              ))}
            </div>
            <div className="bg-gray-50 px-4 py-2 text-xs text-gray-500 font-mono">SimpleTabNav · URL-driven · bg-[#3ba559] bottom border · icon + label + count</div>
          </div>
          <Card className="shadow-sm bg-gray-900 mb-10">
            <CardContent className="p-5">
              <pre className="text-sm text-gray-300 overflow-x-auto">{`import { SimpleTabNav, TabConfig } from "@/components/SimpleTabNav";

const tabs: TabConfig[] = [
  { id: "file",  label: "File",  path: "/admin/data-lake/file",  count: 7,  icon: <FileText /> },
  { id: "api",   label: "API",   path: "/admin/data-lake/api",   count: 5,  icon: <Plug /> },
];

<SimpleTabNav tabs={tabs} basePath="/admin/data-lake" />`}</pre>
            </CardContent>
          </Card>

          {/* 2. In-Page Content Tabs */}
          <h3 className="font-bold text-[#232323] mb-3 text-lg">2. In-Page Content Tabs — <code className="font-mono text-base font-normal">&lt;Tabs&gt;</code></h3>
          <p className="text-gray-600 mb-4 text-sm">Used for <strong>in-page content switching</strong> where the URL does not change. Uses shadcn pill/background style.</p>
          <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm mb-3">
            <div className="p-5 bg-white">
              <Tabs defaultValue="silver">
                <TabsList>
                  <TabsTrigger value="silver" className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-gray-400 inline-block" /> Silver
                  </TabsTrigger>
                  <TabsTrigger value="gold" className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-yellow-400 inline-block" /> Gold
                  </TabsTrigger>
                  <TabsTrigger value="platinum" className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-purple-400 inline-block" /> Platinum
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="silver" className="mt-4 text-sm text-gray-600">Silver tier content renders here.</TabsContent>
                <TabsContent value="gold" className="mt-4 text-sm text-gray-600">Gold tier content renders here.</TabsContent>
                <TabsContent value="platinum" className="mt-4 text-sm text-gray-600">Platinum tier content renders here.</TabsContent>
              </Tabs>
            </div>
            <div className="bg-gray-50 px-4 py-2 text-xs text-gray-500 font-mono">shadcn Tabs · state-driven · pill background active state · no URL change</div>
          </div>
          <Card className="shadow-sm bg-amber-50 border-amber-200 mb-10">
            <CardContent className="p-4">
              <p className="text-sm text-amber-800"><strong>Rule:</strong> Use <code className="font-mono text-xs">SimpleTabNav</code> when tabs change the page/URL. Use shadcn <code className="font-mono text-xs">&lt;Tabs&gt;</code> for in-page content switching only. Never mix the two patterns on the same page.</p>
            </CardContent>
          </Card>

          {/* 3. Buttons */}
          <h3 className="font-bold text-[#232323] mb-3 text-lg">3. Buttons</h3>
          <p className="text-gray-600 mb-4 text-sm">Import from <code className="font-mono text-xs bg-gray-100 px-1 rounded">@/components/ui/button</code>. The <code className="font-mono text-xs">outline</code> variant uses a transparent background — add a bg class manually if needed.</p>
          <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm mb-3">
            <div className="p-6 bg-white flex flex-wrap gap-3 items-center">
              <Button variant="default">Default (Primary)</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="destructive">Destructive</Button>
              <Button variant="link">Link</Button>
              <Button variant="default" size="sm">Small</Button>
              <Button variant="default" size="lg">Large</Button>
              <Button variant="default" disabled>Disabled</Button>
            </div>
            <div className="bg-gray-50 px-4 py-2 text-xs text-gray-500 font-mono">variant: default | outline | secondary | ghost | destructive | link · size: sm | default | lg</div>
          </div>
          <Card className="shadow-sm bg-gray-900 mb-10">
            <CardContent className="p-5">
              <pre className="text-sm text-gray-300 overflow-x-auto">{`import { Button } from "@/components/ui/button";

// Primary CTA
<Button variant="default">Try Assessment</Button>

// Secondary action (note: transparent bg — add bg-white if on coloured surface)
<Button variant="outline">View Details</Button>

// Danger action
<Button variant="destructive">Delete</Button>`}</pre>
            </CardContent>
          </Card>

          {/* 4. Inputs & Selects */}
          <h3 className="font-bold text-[#232323] mb-3 text-lg">4. Inputs &amp; Selects</h3>
          <p className="text-gray-600 mb-4 text-sm">Always pair with a <code className="font-mono text-xs bg-gray-100 px-1 rounded">&lt;label&gt;</code>. Use <code className="font-mono text-xs bg-gray-100 px-1 rounded">placeholder</code> as a hint, not as a label substitute.</p>
          <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm mb-3">
            <div className="p-6 bg-white grid md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-[#232323]">Text Input</label>
                <Input placeholder="e.g. Volvo Cars" />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-[#232323]">Select</label>
                <Select>
                  <SelectTrigger><SelectValue placeholder="Choose a tier" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="silver">Silver</SelectItem>
                    <SelectItem value="gold">Gold</SelectItem>
                    <SelectItem value="platinum">Platinum</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-[#232323]">Input with error state</label>
                <Input placeholder="Company name" className="border-red-400 focus-visible:ring-red-400" />
                <p className="text-xs text-red-600">This field is required.</p>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-[#232323]">Disabled input</label>
                <Input placeholder="Read only" disabled />
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-2 text-xs text-gray-500 font-mono">Input · Select · always label · error: border-red-400 + text-xs text-red-600 below</div>
          </div>

          {/* 5. Cards */}
          <h3 className="font-bold text-[#232323] mb-3 text-lg">5. Cards</h3>
          <p className="text-gray-600 mb-4 text-sm">Use <code className="font-mono text-xs bg-gray-100 px-1 rounded">shadow-sm</code> as the default elevation. Add <code className="font-mono text-xs bg-gray-100 px-1 rounded">hover:shadow-md transition-shadow</code> for interactive cards. Never use <code className="font-mono text-xs bg-gray-100 px-1 rounded">shadow-lg</code> or <code className="font-mono text-xs bg-gray-100 px-1 rounded">shadow-xl</code>.</p>
          <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm mb-3">
            <div className="p-6 bg-[#F9FAFB] grid md:grid-cols-3 gap-4">
              <Card className="shadow-sm">
                <CardContent className="p-5">
                  <h4 className="font-bold text-[#232323] mb-1">Static Card</h4>
                  <p className="text-sm text-gray-600">shadow-sm · no hover · use for data display</p>
                </CardContent>
              </Card>
              <Card className="shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-5">
                  <h4 className="font-bold text-[#232323] mb-1">Interactive Card</h4>
                  <p className="text-sm text-gray-600">shadow-sm hover:shadow-md · use for clickable items</p>
                </CardContent>
              </Card>
              <Card className="shadow-sm bg-gray-50 border-gray-200">
                <CardContent className="p-5">
                  <h4 className="font-bold text-[#232323] mb-1">Subtle Card</h4>
                  <p className="text-sm text-gray-600">bg-gray-50 · use for secondary info, notes, callouts</p>
                </CardContent>
              </Card>
            </div>
            <div className="bg-gray-50 px-4 py-2 text-xs text-gray-500 font-mono">Card · CardContent · shadow-sm (default) · hover:shadow-md (interactive) · bg-gray-50 (subtle)</div>
          </div>
          <Card className="shadow-sm bg-gray-900 mb-10">
            <CardContent className="p-5">
              <pre className="text-sm text-gray-300 overflow-x-auto">{`import { Card, CardContent } from "@/components/ui/card";

// Static data card
<Card className="shadow-sm"><CardContent className="p-5">...</CardContent></Card>

// Interactive/clickable card
<Card className="shadow-sm hover:shadow-md transition-shadow cursor-pointer">...</Card>

// Subtle callout card
<Card className="shadow-sm bg-gray-50 border-gray-200">...</Card>`}</pre>
            </CardContent>
          </Card>

          {/* 6. Data Tables */}
          <h3 className="font-bold text-[#232323] mb-3 text-lg">6. Data Tables</h3>
          <p className="text-gray-600 mb-4 text-sm">Use plain HTML tables inside a <code className="font-mono text-xs bg-gray-100 px-1 rounded">Card</code> with <code className="font-mono text-xs bg-gray-100 px-1 rounded">p-0</code> padding. Alternate row colours with <code className="font-mono text-xs bg-gray-100 px-1 rounded">bg-white / bg-gray-50</code>.</p>
          <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm mb-3">
            <Card className="shadow-sm">
              <CardContent className="p-0">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left p-4 font-bold text-[#232323]">Company</th>
                      <th className="text-left p-4 font-bold text-[#232323]">Tier</th>
                      <th className="text-left p-4 font-bold text-[#232323]">Status</th>
                      <th className="text-left p-4 font-bold text-[#232323]">Score</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { name: "Volvo Cars", tier: "Gold",     status: "Active",  score: 87 },
                      { name: "IKEA",       tier: "Platinum", status: "Active",  score: 94 },
                      { name: "H&M Group",  tier: "Silver",   status: "Pending", score: 61 },
                    ].map((row, i) => (
                      <tr key={row.name} className={`${i % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-gray-100 transition-colors cursor-pointer`}>
                        <td className="p-4 font-medium text-[#232323]">{row.name}</td>
                        <td className="p-4">
                          <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${
                            row.tier === "Gold" ? "bg-yellow-100 text-yellow-800" :
                            row.tier === "Platinum" ? "bg-purple-100 text-purple-800" :
                            "bg-gray-200 text-gray-700"
                          }`}>{row.tier}</span>
                        </td>
                        <td className="p-4">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                            row.status === "Active" ? "bg-[#3ba559]/15 text-[#3ba559]" : "bg-amber-100 text-amber-700"
                          }`}>{row.status}</span>
                        </td>
                        <td className="p-4 text-gray-600">{row.score}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>
            <div className="bg-gray-50 px-4 py-2 text-xs text-gray-500 font-mono">Card p-0 · thead bg-gray-50 · tr alternating bg-white/bg-gray-50 · hover:bg-gray-100 · th font-bold text-[#232323]</div>
          </div>
        </section>

        {/* ================================================================ */}
        {/* SECTION 13: RESOURCES */}
        {/* ================================================================ */}
        <section id="resources">
          <h2 className="font-archivo text-2xl md:text-3xl font-extrabold text-[#232323] mb-4">
            Resources
          </h2>
          <p className="text-gray-600 mb-8 max-w-3xl">
            Additional materials and tools to support brand-consistent design and development.
          </p>

          <div className="grid md:grid-cols-3 gap-4">
            <Card className="shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <h3 className="font-bold text-[#232323] mb-2">Exponential Framework</h3>
                <p className="text-sm text-gray-600 mb-4">Deep dive into the Five Pillars framework and methodology.</p>
                <a
                  href="https://exponentialroadmap.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#3ba559] text-sm font-medium flex items-center gap-1 hover:underline"
                >
                  Visit ERI Website <ExternalLink className="w-3 h-3" />
                </a>
              </CardContent>
            </Card>
            <Card className="shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <h3 className="font-bold text-[#232323] mb-2">Business Playbook</h3>
                <p className="text-sm text-gray-600 mb-4">The Exponential Business Playbook v5.0 — the foundation for all ERI products.</p>
                <a
                  href="https://exponentialroadmap.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#3ba559] text-sm font-medium flex items-center gap-1 hover:underline"
                >
                  View Playbook <ExternalLink className="w-3 h-3" />
                </a>
              </CardContent>
            </Card>
            <Card className="shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <h3 className="font-bold text-[#232323] mb-2">Contact</h3>
                <p className="text-sm text-gray-600 mb-4">Questions about brand usage or need custom assets? Get in touch with the ERI team.</p>
                <a
                  href="https://exponentialroadmap.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#3ba559] text-sm font-medium flex items-center gap-1 hover:underline"
                >
                  Get in Touch <ExternalLink className="w-3 h-3" />
                </a>
              </CardContent>
            </Card>
          </div>
        </section>

      </div>
    </PublicLayout>
  );
}
