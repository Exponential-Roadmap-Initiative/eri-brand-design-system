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

import { useState, useEffect } from "react";
import { Copy, Check, ExternalLink, FileText, Plug, Layers, BookOpen, BarChart3 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import PublicLayout from "@/components/PublicLayout";
import SectionNavigator from "@/components/SectionNavigator";
import { PhotoGallery } from "@/components/PhotoGallery";
import { logos, pillarBottomIcons, pillarMarks, frameworkImages, dataSourceLogos, frameworkV5, pillarsLong, pillarsRegular, pillarsExtended, pillarsShort, memberLogos } from "@/lib/assets";

// ============================================================================
// BRAND PROPOSITION DATA
// ============================================================================
const brandProposition = {
  mission: "To accelerate the transition to a regenerative economy by providing organisations with a clear, actionable framework for exponential climate impact.",
  vision: "A world where every organisation understands and maximises its potential for positive climate impact across operations, value chains, solutions, finance, and policy.",
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
type TonalStop = { hex: string; rgb: string };
type ColorEntry = { id: string; name: string; hex: string; rgb: string; context: string; tones: Record<number, TonalStop> };

const colorSystem: { pillar: ColorEntry[]; brand: ColorEntry[] } = {
  pillar: [
    { id: "p1", name: "Pillar 1 - Operations", hex: "#8a9a87", rgb: "138, 154, 135", context: "Operational emissions, Scope 1 & 2, internal processes",
      tones: { 100: { hex: "#e9ece9", rgb: "233, 236, 233" }, 300: { hex: "#bec7bd", rgb: "190, 199, 189" }, 500: { hex: "#8a9a87", rgb: "138, 154, 135" }, 700: { hex: "#5d675b", rgb: "93, 103, 91" }, 900: { hex: "#393e38", rgb: "57, 62, 56" } } },
    { id: "p2", name: "Pillar 2 - Value Chain", hex: "#2999c5", rgb: "41, 153, 197", context: "Supply chain, Scope 3, procurement, supplier engagement",
      tones: { 100: { hex: "#d8ecf4", rgb: "216, 236, 244" }, 300: { hex: "#89c6df", rgb: "137, 198, 223" }, 500: { hex: "#2999c5", rgb: "41, 153, 197" }, 700: { hex: "#216681", rgb: "33, 102, 129" }, 900: { hex: "#1a3e4c", rgb: "26, 62, 76" } } },
    { id: "p3", name: "Pillar 3 - Solutions", hex: "#22803a", rgb: "34, 128, 58", context: "Climate solutions, products, services, avoided emissions",
      tones: { 100: { hex: "#d7e8db", rgb: "215, 232, 219" }, 300: { hex: "#85b992", rgb: "133, 185, 146" }, 500: { hex: "#22803a", rgb: "34, 128, 58" }, 700: { hex: "#1c562b", rgb: "28, 86, 43" }, 900: { hex: "#183620", rgb: "24, 54, 32" } } },
    { id: "p4", name: "Pillar 4 - Finance", hex: "#f97316", rgb: "249, 115, 22", context: "Climate finance, green bonds, sustainable investment",
      tones: { 100: { hex: "#fde5d5", rgb: "253, 229, 213" }, 300: { hex: "#fbb27e", rgb: "251, 178, 126" }, 500: { hex: "#f97316", rgb: "249, 115, 22" }, 700: { hex: "#a14e15", rgb: "161, 78, 21" }, 900: { hex: "#5d3214", rgb: "93, 50, 20" } } },
    { id: "p5", name: "Pillar 5 - Policy", hex: "#f74145", rgb: "247, 65, 69", context: "Policy advocacy, regulatory engagement, trade associations",
      tones: { 100: { hex: "#fddcdd", rgb: "253, 220, 221" }, 300: { hex: "#fa9698", rgb: "250, 150, 152" }, 500: { hex: "#f74145", rgb: "247, 65, 69" }, 700: { hex: "#a02f32", rgb: "160, 47, 50" }, 900: { hex: "#5c2223", rgb: "92, 34, 35" } } },
  ],
  brand: [
    { id: "primary", name: "Primary Green", hex: "#3ba559", rgb: "59, 165, 89", context: "Primary buttons, CTAs, links, success states",
      tones: { 100: { hex: "#dbeee1", rgb: "219, 238, 225" }, 300: { hex: "#93cda3", rgb: "147, 205, 163" }, 500: { hex: "#3ba559", rgb: "59, 165, 89" }, 700: { hex: "#2c6d3e", rgb: "44, 109, 62" }, 900: { hex: "#20422a", rgb: "32, 66, 42" } } },
    { id: "dark", name: "Dark Text", hex: "#232323", rgb: "35, 35, 35", context: "Headings, primary body text, high-contrast elements",
      tones: { 100: { hex: "#d7d7d7", rgb: "215, 215, 215" }, 300: { hex: "#868686", rgb: "134, 134, 134" }, 500: { hex: "#232323", rgb: "35, 35, 35" }, 700: { hex: "#1d1d1d", rgb: "29, 29, 29" }, 900: { hex: "#181818", rgb: "24, 24, 24" } } },
    { id: "neutral", name: "Neutral Gray", hex: "#6b7280", rgb: "107, 114, 128", context: "Secondary text, borders, disabled states",
      tones: { 100: { hex: "#e4e5e8", rgb: "228, 229, 232" }, 300: { hex: "#adb1b9", rgb: "173, 177, 185" }, 500: { hex: "#6b7280", rgb: "107, 114, 128" }, 700: { hex: "#494e56", rgb: "73, 78, 86" }, 900: { hex: "#2f3236", rgb: "47, 50, 54" } } },
    { id: "background", name: "Background", hex: "#F9FAFB", rgb: "249, 250, 251", context: "Page backgrounds, card backgrounds",
      tones: { 100: { hex: "#fdfefe", rgb: "253, 254, 254" }, 300: { hex: "#fbfcfc", rgb: "251, 252, 252" }, 500: { hex: "#f9fafb", rgb: "249, 250, 251" }, 700: { hex: "#a1a2a3", rgb: "161, 162, 163" }, 900: { hex: "#5d5d5d", rgb: "93, 93, 93" } } },
    { id: "yellow", name: "Highlight Yellow", hex: "#F5C842", rgb: "245, 200, 66", context: "Data highlights, chart callouts, goal indicators, emphasis accents — introduced in Playbook v5",
      tones: { 100: { hex: "#f2e4bd", rgb: "242, 228, 189" }, 300: { hex: "#bfaa6b", rgb: "191, 170, 107" }, 500: { hex: "#f5c842", rgb: "245, 200, 66" }, 700: { hex: "#725f27", rgb: "114, 95, 39" }, 900: { hex: "#332b15", rgb: "51, 43, 21" } } },
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
  languageRules: {
    standard: "British English",
    rationale: "ERI is a Swedish-founded initiative operating globally, but headquartered and primarily published in a European context. British English is the standard for all external communications, publications, and digital products.",
    spellingRules: [
      { rule: "-ise not -ize", british: "organise, maximise, recognise, prioritise, emphasise, customise", avoid: "organize, maximize, recognize, prioritize, emphasize, customize" },
      { rule: "-our not -or", british: "colour, behaviour, honour, favour, neighbour", avoid: "color, behavior, honor, favor, neighbor" },
      { rule: "-re not -er", british: "centre, theatre, fibre, metre, litre", avoid: "center, theater, fiber, meter, liter" },
      { rule: "-ence not -ense", british: "licence (noun), defence, offence, pretence", avoid: "license (noun), defense, offense, pretense" },
      { rule: "-ogue not -og", british: "catalogue, dialogue, analogue", avoid: "catalog, dialog, analog" },
      { rule: "Double consonants", british: "travelling, modelling, cancelled, labelling", avoid: "traveling, modeling, canceled, labeling" },
    ],
    punctuationRules: [
      { rule: "Single quotation marks", detail: "Use single quotes for primary quotations: 'climate action'. Use double quotes for quotes within quotes: 'He said \"net zero\" is achievable.'" },
      { rule: "Oxford comma", detail: "Optional but consistent within a document. ERI preference: omit unless ambiguity arises." },
      { rule: "Date format", detail: "Day Month Year — no ordinal suffixes: 18 March 2026, not March 18th, 2026." },
      { rule: "Numbers", detail: "Spell out one to nine; use numerals for 10 and above. Use commas as thousands separators: 1,000 not 1.000." },
      { rule: "Per cent", detail: "Write 'per cent' as two words in running text; use the % symbol in tables, charts, and data labels." },
    ],
    commonPitfalls: [
      { pitfall: "'Program' vs 'Programme'", correct: "Use 'programme' for schedules, events, and initiatives. Use 'program' only for computer software.", example: "The ERI accelerator programme; a software program" },
      { pitfall: "'Practice' vs 'Practise'", correct: "'Practice' is the noun; 'practise' is the verb.", example: "Best practice (noun); to practise consistently (verb)" },
      { pitfall: "'Licence' vs 'License'", correct: "'Licence' is the noun; 'license' is the verb.", example: "A Creative Commons licence (noun); licensed under CC BY (verb)" },
      { pitfall: "'Enquire' vs 'Inquire'", correct: "Use 'enquire' for general questions; 'inquire' for formal investigations.", example: "Enquire about membership; a formal inquiry" },
    ],
  },
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
function ToneStop({ stop, tone }: { stop: number; tone: { hex: string; rgb: string } }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(tone.hex);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  const [r, g, b] = tone.rgb.split(",").map(Number);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  const labelColor = luminance > 0.55 ? "#374151" : "#ffffff";
  return (
    <button
      onClick={copy}
      title={`Copy ${tone.hex}`}
      className="group relative flex-1 flex flex-col items-center justify-between py-2 px-0.5 transition-all hover:brightness-95 focus:outline-none"
      style={{ backgroundColor: tone.hex }}
    >
      <span className="text-[8px] font-mono font-bold leading-none" style={{ color: labelColor }}>{stop}</span>
      <span className="text-[7.5px] font-mono leading-none break-all text-center" style={{ color: labelColor }}>
        {copied ? "✓ copied" : tone.hex}
      </span>
    </button>
  );
}

function ColorSwatch({ name, hex, rgb, context, tones }: { name: string; hex: string; rgb: string; context: string; tones: Record<number, { hex: string; rgb: string }> }) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(hex);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      {/* Base colour block */}
      <div className="h-20 w-full" style={{ backgroundColor: hex }} />
      {/* Tonal scale strip */}
      <div className="flex h-20 overflow-hidden">
        {[100, 300, 500, 700, 900].map((stop) => (
          <ToneStop key={stop} stop={stop} tone={tones[stop]} />
        ))}
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="font-bold text-[#232323] text-sm">{name}</span>
          <button
            onClick={copyToClipboard}
            className="p-1.5 hover:bg-gray-100 rounded transition-colors"
            title="Copy hex code"
          >
            {copied ? <Check className="w-4 h-4 text-[#3ba559]" /> : <Copy className="w-4 h-4 text-gray-400" />}
          </button>
        </div>
        <div className="space-y-1 text-xs">
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

      {/* ── TWO-COLUMN LAYOUT: sticky nav + scrollable content ── */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="flex gap-10 items-start">

          {/* ── STICKY SECTION NAVIGATOR (desktop only) ── */}
          <div className="hidden lg:block w-52 shrink-0">
            <div className="sticky top-20">
              <SectionNavigator />
            </div>
          </div>

          {/* ── MAIN CONTENT ── */}
          <div className="flex-1 min-w-0">

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
            Our colour system is built around the Five Pillars framework. Each pillar has a dedicated colour
            that creates instant recognition and helps users navigate complex climate information.
          </p>

          <h3 className="font-bold text-[#232323] mb-4 text-lg">Brand Colours</h3>
          <p className="text-gray-600 mb-6 text-sm">
            Core brand colours for UI elements, text, and backgrounds. These provide the foundation for all interfaces.
          </p>
          <div className="grid md:grid-cols-4 gap-4 mb-12">
            {colorSystem.brand.map((color) => (
              <ColorSwatch key={color.id} name={color.name} hex={color.hex} rgb={color.rgb} context={color.context} tones={color.tones} />
            ))}
          </div>

          <h3 className="font-bold text-[#232323] mb-4 text-lg">Pillar Colours</h3>
          <p className="text-gray-600 mb-6 text-sm">
            These colours represent the five dimensions of organisational climate impact. Use them consistently
            to reinforce the framework structure.
          </p>
          <div className="grid md:grid-cols-5 gap-4">
            {colorSystem.pillar.map((color) => (
              <ColorSwatch key={color.id} name={color.name} hex={color.hex} rgb={color.rgb} context={color.context} tones={color.tones} />
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
          <Card className="shadow-sm mb-12">
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

          {/* ── LANGUAGE RULES ── */}
          <h3 className="font-bold text-[#232323] mb-2 text-lg">Language</h3>
          <div className="flex items-center gap-3 mb-4">
            <span className="inline-flex items-center gap-1.5 bg-[#3ba559] text-white text-xs font-bold px-3 py-1 rounded-full">
              {verbalIdentity.languageRules.standard}
            </span>
          </div>
          <p className="text-gray-600 mb-8 max-w-3xl text-sm">{verbalIdentity.languageRules.rationale}</p>

          <h4 className="font-bold text-[#232323] mb-4">Spelling Rules</h4>
          <Card className="shadow-sm mb-8">
            <CardContent className="p-0">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left p-4 font-bold text-[#232323] w-40">Rule</th>
                    <th className="text-left p-4 font-bold text-[#232323]">British English ✓</th>
                    <th className="text-left p-4 font-bold text-[#232323]">Avoid ✗</th>
                  </tr>
                </thead>
                <tbody>
                  {verbalIdentity.languageRules.spellingRules.map((row, i) => (
                    <tr key={row.rule} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                      <td className="p-4 font-mono font-bold text-[#232323] text-xs">{row.rule}</td>
                      <td className="p-4 text-[#3ba559] font-medium">{row.british}</td>
                      <td className="p-4 text-gray-400 line-through">{row.avoid}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>

          <h4 className="font-bold text-[#232323] mb-4">Punctuation &amp; Formatting</h4>
          <div className="grid md:grid-cols-2 gap-4 mb-8">
            {verbalIdentity.languageRules.punctuationRules.map((item) => (
              <Card key={item.rule} className="shadow-sm">
                <CardContent className="p-5">
                  <h5 className="font-bold text-[#232323] mb-2 text-sm">{item.rule}</h5>
                  <p className="text-sm text-gray-600">{item.detail}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <h4 className="font-bold text-[#232323] mb-4">Common Pitfalls</h4>
          <Card className="shadow-sm">
            <CardContent className="p-0">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left p-4 font-bold text-[#232323] w-48">Word Pair</th>
                    <th className="text-left p-4 font-bold text-[#232323]">Rule</th>
                    <th className="text-left p-4 font-bold text-[#232323]">Example</th>
                  </tr>
                </thead>
                <tbody>
                  {verbalIdentity.languageRules.commonPitfalls.map((item, i) => (
                    <tr key={item.pitfall} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                      <td className="p-4 font-mono font-bold text-[#232323] text-xs">{item.pitfall}</td>
                      <td className="p-4 text-gray-700 text-xs">{item.correct}</td>
                      <td className="p-4 text-gray-500 italic text-xs">{item.example}</td>
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
            Use for any section requiring a coloured header. The component restricts colours to the approved palette.
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
        {/* SECTION 8: EXPONENTIAL FRAMEWORK (unified) */}
        {/* ================================================================ */}
        <section className="mb-16" id="exponential-framework">
          <h2 className="font-archivo text-2xl md:text-3xl font-extrabold text-[#232323] mb-2">
            Exponential Framework
          </h2>
          <p className="text-gray-600 mb-8 max-w-3xl">
            All visual assets for the Exponential Roadmap framework — pillar icons, framework diagrams, and pillar elements — are documented here.
            Always use the provided assets; never recreate or approximate them.
          </p>

          {/* ── SUB-SECTION: PILLAR ICON ASSETS ── */}
          <h3 className="font-archivo font-bold text-[#232323] text-xl mb-3 mt-2 border-b border-gray-200 pb-2">Pillar Icon Assets</h3>
          <p className="text-gray-600 mb-6 max-w-3xl text-sm">
            Five WebP images represent the Exponential Framework pillars. They appear in the full-screen navigation overlay, pillar detail pages, and framework diagrams. Import from{" "}
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

          {/* ── SUB-SECTION: FRAMEWORK DIAGRAMS ── */}
          <div id="framework-diagrams" className="pt-4">
          <div className="flex items-center gap-3 mb-3 border-b border-gray-200 pb-2">
            <h3 className="font-archivo font-bold text-[#232323] text-xl">Framework Diagrams</h3>
            <Badge className="bg-[#3ba559] text-white text-[10px] tracking-widest uppercase hover:bg-[#3ba559]">v5 New</Badge>
          </div>
          <p className="text-gray-600 mb-2 max-w-3xl text-sm">
            The Five Pillars radial diagram is the central visual identity of the Exponential Roadmap framework.
            Eight approved variants exist for different placement contexts. Always use the provided assets — never recreate the diagram.
          </p>
          <p className="text-gray-500 text-sm mb-8 max-w-3xl">
            Source: <em>ERI Styleguide 1.0 — Framework (pp. 5–8) and Framework Integration (pp. 9–12)</em>.
          </p>

          {/* Five Pillars Diagram Variants */}
          <h3 className="font-bold text-[#232323] mb-4 text-lg">Five Pillars Diagram — 8 Variants</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { key: "fivePillarsBg",          label: "BG",                   desc: "Background only (no logo/text)" },
              { key: "fivePillarsBgLogo",       label: "BG + Logo",             desc: "With ERI wordmark" },
              { key: "fivePillarsBgLogoTitle",  label: "BG + Logo + Title",     desc: "With wordmark and title text" },
              { key: "fivePillarsExtended",     label: "Extended",              desc: "With action blocks around pillars" },
              { key: "fivePillarsTransparent",  label: "Transparent",           desc: "No background — for dark slides" },
              { key: "fivePillarsShortText",    label: "Short Text (Transp)",   desc: "Pillar names only, transparent" },
              { key: "fivePillarsSymbols",      label: "Symbols (Transp)",      desc: "Icons only, transparent" },
              { key: "fivePillarsText",         label: "Text (Transp)",         desc: "Full text labels, transparent" },
            ].map(({ key, label, desc }) => (
              <div key={key} className="flex flex-col gap-2">
                <div className="bg-gray-50 rounded-lg p-3 flex items-center justify-center" style={{minHeight: 160}}>
                  <img src={frameworkV5[key as keyof typeof frameworkV5]} alt={label} className="max-h-36 w-auto object-contain" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-[#232323]">{label}</p>
                  <p className="text-[11px] text-gray-500">{desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Placement Rules */}
          <h3 className="font-bold text-[#232323] mb-4 text-lg">Placement Rules</h3>
          <div className="grid md:grid-cols-3 gap-4 mb-8">
            <Card className="shadow-sm">
              <CardContent className="p-5">
                <h4 className="font-bold text-[#232323] mb-2 text-sm">Clear Space</h4>
                <p className="text-sm text-gray-600">Minimum clear space around the diagram equals <strong>x</strong> — one unit defined as the width of the “E” in EXPONENTIAL. Never crowd the diagram with other elements.</p>
              </CardContent>
            </Card>
            <Card className="shadow-sm">
              <CardContent className="p-5">
                <h4 className="font-bold text-[#232323] mb-2 text-sm">Background Combinations</h4>
                <p className="text-sm text-gray-600">Use the <strong>solid BG variant</strong> on white/light backgrounds. Use the <strong>Transparent variant</strong> on dark or coloured backgrounds. Never place the solid variant on a dark background.</p>
              </CardContent>
            </Card>
            <Card className="shadow-sm">
              <CardContent className="p-5">
                <h4 className="font-bold text-[#232323] mb-2 text-sm">Never Do</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Do not distort, rotate, or recolour the diagram</li>
                  <li>• Do not add extra elements inside the diagram</li>
                  <li>• Do not use unofficial variants or recreations</li>
                  <li>• Do not place the diagram on a clashing background colour</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Supporting Diagrams */}
          <h3 className="font-bold text-[#232323] mb-4 text-lg">Supporting Diagrams</h3>
          <p className="text-gray-600 mb-4 text-sm max-w-3xl">Four additional diagrams support the framework narrative. Use these in context — do not mix them with the Five Pillars radial diagram on the same slide.</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { key: "leadershipA",     label: "Leadership A",         desc: "Leadership categories diagram (variant A)" },
              { key: "leadershipB",     label: "Leadership B",         desc: "Leadership categories diagram (variant B)" },
              { key: "pillarsLinear",   label: "Pillars Linear",       desc: "Five pillars in horizontal linear layout" },
              { key: "reducingEnabling",label: "Reducing / Enabling",  desc: "Reducing vs. enabling emissions framework" },
            ].map(({ key, label, desc }) => (
              <div key={key} className="flex flex-col gap-2">
                <div className="bg-gray-50 rounded-lg p-3 flex items-center justify-center" style={{minHeight: 140}}>
                  <img src={frameworkV5[key as keyof typeof frameworkV5]} alt={label} className="max-h-32 w-auto object-contain" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-[#232323]">{label}</p>
                  <p className="text-[11px] text-gray-500">{desc}</p>
                </div>
              </div>
            ))}
          </div>
          </div>{/* end framework-diagrams sub-div */}
        </section>{/* end exponential-framework section */}

        {/* ================================================================ */}
        {/* SECTION 10: PAGE LAYOUT SHELLS */}
        {/* ================================================================ */}
        <section className="mb-16" id="page-layout">
          <h2 className="font-archivo text-2xl md:text-3xl font-extrabold text-[#232323] mb-4">
            Page Layout Shells
          </h2>
          <p className="text-gray-600 mb-8 max-w-3xl">
            Every public-facing ERI page uses{" "}
            <code className="text-sm font-mono bg-gray-100 px-1.5 py-0.5 rounded">PublicLayout</code> which composes the persistent Header and Footer around a flexible content area. Use these shells — never build a custom header or footer from scratch.
          </p>

          {/* Two header patterns callout */}
          <div className="grid md:grid-cols-2 gap-4 mb-8">
            <Card className="shadow-sm border-l-4 border-l-[#3ba559]">
              <CardContent className="p-5">
                <span className="text-[10px] font-semibold uppercase tracking-widest text-[#3ba559] mb-1 block">Pattern A</span>
                <h4 className="font-bold text-[#232323] mb-2">Web App Header</h4>
                <p className="text-sm text-gray-600">Used by all ERI web applications (PSM, Exponential Playbook, etc.). Sticky, 64px tall, white background with bottom border. Left: logo + divider + title block. Right: BETA badge + version + status dot + hamburger.</p>
              </CardContent>
            </Card>
            <Card className="shadow-sm border-l-4 border-l-[#2999c5]">
              <CardContent className="p-5">
                <span className="text-[10px] font-semibold uppercase tracking-widest text-[#2999c5] mb-1 block">Pattern B</span>
                <h4 className="font-bold text-[#232323] mb-2">Public Website Header</h4>
                <p className="text-sm text-gray-600">Used by exponentialroadmap.org. 52px tall, white background, no bottom border. Left: ERI wordmark. Right: horizontal nav links (Resources, Events, News, About) with dropdown menus.</p>
              </CardContent>
            </Card>
          </div>

          <h3 className="font-bold text-[#232323] mb-4 text-lg">PublicLayout Props</h3>
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

          {/* Header Anatomy — Web App Pattern */}
          <h3 className="font-bold text-[#232323] mb-2 text-lg">Web App Header Anatomy</h3>
          <p className="text-gray-600 mb-4 text-sm">Fixed (<code className="font-mono text-xs bg-gray-100 px-1 rounded">sticky top-0 z-50</code>), 64px tall (<code className="font-mono text-xs bg-gray-100 px-1 rounded">h-16</code>), white background with bottom border. Used across all ERI web applications.</p>
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <Card className="shadow-sm">
              <CardContent className="p-5">
                <h4 className="font-bold text-[#232323] mb-3">Left Zone — Logo + Divider + Title Block</h4>
                <div className="space-y-3 text-sm text-gray-600">
                  <div className="flex gap-2"><span className="text-[#3ba559] font-bold shrink-0">1.</span><span>ERI full-colour wordmark PNG/SVG — <code className="font-mono text-xs bg-gray-100 px-1 rounded">h-8 w-auto shrink-0</code>, links to <code className="font-mono text-xs">/</code></span></div>
                  <div className="flex gap-2"><span className="text-[#3ba559] font-bold shrink-0">2.</span><span>Vertical divider — <code className="font-mono text-xs bg-gray-100 px-1 rounded">h-6 w-px bg-gray-300 shrink-0</code> (hidden on mobile)</span></div>
                  <div className="flex gap-2"><span className="text-[#3ba559] font-bold shrink-0">3.</span><span>Supertitle (product family) — <code className="font-mono text-xs bg-gray-100 px-1 rounded">text-[11px] font-medium text-gray-400 uppercase tracking-widest truncate</code><br/><em className="text-gray-400">e.g. "EXPONENTIAL PLAYBOOK NEXT GEN"</em></span></div>
                  <div className="flex gap-2"><span className="text-[#3ba559] font-bold shrink-0">4.</span><span>App title — <code className="font-mono text-xs bg-gray-100 px-1 rounded">text-base font-semibold text-gray-700 truncate</code><br/><em className="text-gray-400">e.g. "Professional Services Matrix"</em></span></div>
                </div>
              </CardContent>
            </Card>
            <Card className="shadow-sm">
              <CardContent className="p-5">
                <h4 className="font-bold text-[#232323] mb-3">Right Zone — Status + Menu</h4>
                <div className="space-y-3 text-sm text-gray-600">
                  <div className="flex gap-2"><span className="text-[#3ba559] font-bold shrink-0">1.</span><span>BETA badge — outlined pill: <code className="font-mono text-xs bg-gray-100 px-1 rounded">border border-gray-400 text-[11px] font-medium text-gray-600 rounded-full px-2 py-0.5 tracking-wide</code></span></div>
                  <div className="flex gap-2"><span className="text-[#3ba559] font-bold shrink-0">2.</span><span>Version string — <code className="font-mono text-xs bg-gray-100 px-1 rounded">text-[11px] font-medium text-gray-500 tracking-wide</code><br/><em className="text-gray-400">Format: V.YYYY.MM.DD — e.g. "V.2026.03.18"</em></span></div>
                  <div className="flex gap-2"><span className="text-[#3ba559] font-bold shrink-0">3.</span><span>Live status dot — <code className="font-mono text-xs bg-gray-100 px-1 rounded">w-2 h-2 rounded-full bg-[#3ba559]</code> (green = live)</span></div>
                  <div className="flex gap-2"><span className="text-[#3ba559] font-bold shrink-0">4.</span><span>Hamburger menu button — <code className="font-mono text-xs bg-gray-100 px-1 rounded">size-9 rounded-md hover:bg-gray-100</code> with lucide <code className="font-mono text-xs">Menu</code> icon (always visible, opens full-screen overlay)</span></div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Header visual mockup — Web App Pattern */}
          <h3 className="font-bold text-[#232323] mb-4 text-lg">Web App Header — Visual Examples</h3>
          <div className="space-y-4 mb-10">
            {/* State 1: Default white */}
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">State 1 — Default (white background, scrolled)</p>
              <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                <div className="bg-white border-b border-gray-200">
                  <div className="px-6">
                    <div className="flex items-center justify-between h-16 gap-4">
                      {/* Left */}
                      <div className="flex items-center gap-3 min-w-0">
                        <img src={logos.eriLogoFullColor} alt="ERI" className="h-8 w-auto shrink-0" />
                        <div className="h-6 w-px bg-gray-300 shrink-0" />
                        <div className="flex flex-col leading-tight min-w-0">
                          <span className="text-[11px] font-medium text-gray-400 uppercase tracking-widest truncate">Exponential Roadmap Initiative</span>
                          <span className="text-base font-semibold text-gray-700 truncate">Brand Design System</span>
                        </div>
                      </div>
                      {/* Right */}
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full border border-gray-400 text-[11px] font-medium text-gray-600 tracking-wide">BETA</span>
                        <span className="text-[11px] font-medium text-gray-500 tracking-wide">V.2026.03.18</span>
                        <span className="w-2 h-2 rounded-full bg-[#3ba559] shrink-0" />
                        <div className="inline-flex items-center justify-center size-9 rounded-md text-gray-700 hover:bg-gray-100">
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <line x1="4" y1="6" x2="20" y2="6" /><line x1="4" y1="12" x2="20" y2="12" /><line x1="4" y1="18" x2="20" y2="18" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-2 text-xs text-gray-500 font-mono">sticky top-0 z-50 · bg-white · h-16 · border-b border-gray-200 · left: logo + divider + title block · right: BETA + version + dot + hamburger</div>
              </div>
            </div>

            {/* State 2: Transparent on dark hero */}
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">State 2 — Transparent header (on dark hero, not yet scrolled)</p>
              <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                <div className="bg-[#232323]">
                  <div className="px-6">
                    <div className="flex items-center justify-between h-16 gap-4">
                      <div className="flex items-center gap-3 min-w-0">
                        <img src={logos.eriLogoFullColor} alt="ERI" className="h-8 w-auto shrink-0" style={{ filter: "brightness(0) invert(1)" }} />
                        <div className="h-6 w-px bg-gray-600 shrink-0" />
                        <div className="flex flex-col leading-tight min-w-0">
                          <span className="text-[11px] font-medium text-gray-400 uppercase tracking-widest truncate">Exponential Roadmap Initiative</span>
                          <span className="text-base font-semibold text-gray-300 truncate">Brand Design System</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full border border-gray-500 text-[11px] font-medium text-gray-400 tracking-wide">BETA</span>
                        <span className="text-[11px] font-medium text-gray-400 tracking-wide">V.2026.03.18</span>
                        <span className="w-2 h-2 rounded-full bg-[#3ba559] shrink-0" />
                        <div className="inline-flex items-center justify-center size-9 rounded-md text-gray-400">
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <line x1="4" y1="6" x2="20" y2="6" /><line x1="4" y1="12" x2="20" y2="12" /><line x1="4" y1="18" x2="20" y2="18" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-2 text-xs text-gray-500 font-mono">transparentHeader=true · bg-transparent · logo: filter brightness(0) invert(1) · text colours inverted for dark bg</div>
              </div>
            </div>
          </div>

          {/* Footer anatomy */}
          <h3 className="font-bold text-[#232323] mb-4 text-lg">Footer Anatomy</h3>
          <p className="text-gray-600 mb-4 text-sm">Dark charcoal background (<code className="font-mono text-xs bg-gray-100 px-1 rounded">bg-[#232323]</code>) — matching the public website exponentialroadmap.org. <code className="font-mono text-xs bg-gray-100 px-1 rounded">py-12</code> padding. Three-column grid on desktop. Accent link colour: brand green-300 (<code className="font-mono text-xs bg-gray-100 px-1 rounded">#93cda3</code>).</p>
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
                    { col: "Resources (col 2)", content: "Links: Brand Guidelines, Component Library, Colour Tokens, Typography, Badge Reference", notes: "Internal anchor links. text-gray-400 hover:text-[#93cda3] (brand green-300)." },
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
            <footer className="bg-[#232323] text-white">
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
                        <li key={l}><span className="text-sm text-gray-400 hover:text-[#93cda3] transition-colors cursor-pointer">{l}</span></li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold text-white mb-4">Contact</h3>
                    <ul className="space-y-2">
                      {["exponentialroadmap.org", "Exponential Roadmap Initiative", "Business Playbook"].map(l => (
                        <li key={l}><span className="text-sm text-gray-400 hover:text-[#93cda3] transition-colors cursor-pointer">{l}</span></li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="mt-10 pt-6 border-t border-gray-700">
                  <p className="text-sm text-gray-500 text-center">© {new Date().getFullYear()} Exponential Roadmap Initiative. All rights reserved. | Based on Exponential Business Playbook v5.0</p>
                </div>
              </div>
            </footer>
                <div className="bg-gray-50 px-4 py-2 text-xs text-gray-500 font-mono">bg-[#232323] · text-white · grid md:grid-cols-3 · py-12 · border-t border-gray-700 · accent links: #93cda3 (brand green-300)</div>
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
        {/* SECTION 12: PILLAR ELEMENTS (v5) */}
        {/* ================================================================ */}
        <section id="pillar-elements">
          <div className="flex items-center gap-3 mb-2">
            <h2 className="font-archivo text-2xl md:text-3xl font-extrabold text-[#232323]">
              Pillar Elements
            </h2>
            <Badge className="bg-[#3ba559] text-white text-[10px] tracking-widest uppercase hover:bg-[#3ba559]">v5 New</Badge>
          </div>
          <p className="text-gray-600 mb-2 max-w-3xl">
            The Exponential Roadmap pillar element is a vertical graphic unit that anchors each pillar in presentations, reports, and digital interfaces.
            It always appears on the <strong>left side</strong> of a slide or frame. Four variants exist — choose based on available space and content depth.
          </p>
          <p className="text-gray-500 text-sm mb-8 max-w-3xl">
            Source: <em>ERI Styleguide 1.0 — Framework Integration (pp. 13–18)</em>. All assets are available in solid (white background) and transparent versions.
          </p>

          <Tabs defaultValue="long">
            <TabsList className="mb-6">
              <TabsTrigger value="long">Long (Primary)</TabsTrigger>
              <TabsTrigger value="regular">Regular</TabsTrigger>
              <TabsTrigger value="extended">Extended</TabsTrigger>
              <TabsTrigger value="short">Short</TabsTrigger>
            </TabsList>

            {/* ── LONG PILLAR ── */}
            <TabsContent value="long">
              <Card className="shadow-sm mb-4">
                <CardContent className="p-6">
                  <h3 className="font-bold text-[#232323] mb-1">Long Pillar</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    The primary integration element for company presentations. Placed on the left side of the frame.
                    Use <code className="bg-gray-100 px-1 rounded text-xs">x</code> (one unit = width of the "E" in EXPONENTIAL) as the minimum clear space from pillar to frame edge.
                    Use <code className="bg-gray-100 px-1 rounded text-xs">3x</code> for the alternate scaled-down version.
                  </p>
                  <div className="grid grid-cols-5 gap-4">
                    {([1,2,3,4,5] as const).map(n => (
                      <div key={n} className="flex flex-col items-center gap-2">
                        <div className="bg-gray-50 rounded-lg p-2 w-full flex items-center justify-center" style={{minHeight: 200}}>
                          <img src={pillarsLong[n].solid} alt={`Pillar ${n} Long`} className="max-h-48 w-auto object-contain" />
                        </div>
                        <span className="text-xs text-gray-500 font-medium">Pillar {n}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 flex gap-2 flex-wrap">
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded font-mono">Solid (white bg)</span>
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded font-mono">Transparent version available</span>
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded font-mono">PNG + SVG</span>
                  </div>
                </CardContent>
              </Card>
              <Card className="shadow-sm bg-[#232323]">
                <CardContent className="p-6">
                  <h4 className="font-bold text-white mb-3 text-sm">Dark Background Variant</h4>
                  <p className="text-xs text-gray-400 mb-4">On dark backgrounds, use the transparent version — a white border is added automatically by the element.</p>
                  <div className="grid grid-cols-5 gap-4">
                    {([1,2,3,4,5] as const).map(n => (
                      <div key={n} className="flex flex-col items-center gap-2">
                        <div className="rounded-lg p-2 w-full flex items-center justify-center" style={{minHeight: 160}}>
                          <img src={pillarsLong[n].transparent} alt={`Pillar ${n} Long Transparent`} className="max-h-40 w-auto object-contain" />
                        </div>
                        <span className="text-xs text-gray-400 font-medium">Pillar {n}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* ── REGULAR PILLAR ── */}
            <TabsContent value="regular">
              <Card className="shadow-sm mb-4">
                <CardContent className="p-6">
                  <h3 className="font-bold text-[#232323] mb-1">Regular Pillar</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    A scaled-down version of the Long Pillar for integration into data slides where more horizontal space is needed.
                    Can be placed over images. Use <code className="bg-gray-100 px-1 rounded text-xs">3x</code> as the distance from pillar to frame edge.
                  </p>
                  <div className="grid grid-cols-5 gap-4">
                    {([1,2,3,4,5] as const).map(n => (
                      <div key={n} className="flex flex-col items-center gap-2">
                        <div className="bg-gray-50 rounded-lg p-2 w-full flex items-center justify-center" style={{minHeight: 160}}>
                          <img src={pillarsRegular[n].solid} alt={`Pillar ${n} Regular`} className="max-h-40 w-auto object-contain" />
                        </div>
                        <span className="text-xs text-gray-500 font-medium">Pillar {n}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* ── EXTENDED PILLAR ── */}
            <TabsContent value="extended">
              <Card className="shadow-sm mb-4">
                <CardContent className="p-6">
                  <h3 className="font-bold text-[#232323] mb-1">Extended Pillar (with Action Blocks)</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    The most detailed variant. The pillar element is extended downward with labelled Action Blocks — one per sub-action within the pillar
                    (e.g. "Supplier Engagement", "Supplier Energy"). The pillar icon appears at the bottom of the extended stack.
                    Use <code className="bg-gray-100 px-1 rounded text-xs">3x</code> as the distance from pillar to frame edge.
                  </p>
                  <div className="grid grid-cols-5 gap-4">
                    {([1,2,3,4,5] as const).map(n => (
                      <div key={n} className="flex flex-col items-center gap-2">
                        <div className="bg-gray-50 rounded-lg p-2 w-full flex items-center justify-center" style={{minHeight: 240}}>
                          <img src={pillarsExtended[n].solid} alt={`Pillar ${n} Extended`} className="max-h-56 w-auto object-contain" />
                        </div>
                        <span className="text-xs text-gray-500 font-medium">Pillar {n}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 bg-gray-50 rounded-lg p-4">
                    <h4 className="font-bold text-[#232323] text-sm mb-2">Action Block Specification</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                      <div><span className="text-gray-500">Background</span><br/><span className="font-mono font-bold">Pillar colour</span></div>
                      <div><span className="text-gray-500">Text</span><br/><span className="font-mono font-bold">White, Archivo Bold</span></div>
                      <div><span className="text-gray-500">Size</span><br/><span className="font-mono font-bold">~8pt / 11px</span></div>
                      <div><span className="text-gray-500">Gap between blocks</span><br/><span className="font-mono font-bold">1px white</span></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* ── SHORT PILLAR ── */}
            <TabsContent value="short">
              <Card className="shadow-sm mb-4">
                <CardContent className="p-6">
                  <h3 className="font-bold text-[#232323] mb-1">Short Pillar</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    The minimal variant — symbol only (icon mark) or text only (pillar number + name). Used where space is very limited
                    or as a compact reference marker. Four sub-variants: Symbol (solid), Symbol (transparent), Text (solid), Text (transparent).
                  </p>
                  <div className="grid grid-cols-5 gap-6">
                    {([1,2,3,4,5] as const).map(n => (
                      <div key={n} className="flex flex-col gap-3">
                        <div className="bg-gray-50 rounded-lg p-2 flex items-center justify-center" style={{minHeight: 80}}>
                          <img src={pillarsShort[n].symbol} alt={`Pillar ${n} Symbol`} className="max-h-16 w-auto object-contain" />
                        </div>
                        <div className="bg-gray-50 rounded-lg p-2 flex items-center justify-center" style={{minHeight: 80}}>
                          <img src={pillarsShort[n].text} alt={`Pillar ${n} Text`} className="max-h-16 w-auto object-contain" />
                        </div>
                        <span className="text-xs text-gray-500 font-medium text-center">Pillar {n}</span>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-gray-400 mt-3">Top row: Symbol variant. Bottom row: Text variant. Transparent versions also available.</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Usage Rules */}
          <div className="mt-6 grid md:grid-cols-2 gap-4">
            <Card className="shadow-sm border-l-4 border-l-[#3ba559]">
              <CardContent className="p-5">
                <h4 className="font-bold text-[#232323] mb-3 text-sm">✓ Correct Usage</h4>
                <ul className="text-sm text-gray-600 space-y-1.5">
                  <li>Always place on the <strong>left side</strong> of the slide or frame</li>
                  <li>Maintain minimum clear space: <strong>x</strong> from pillar to frame edge (basic), <strong>3x</strong> for alternate</li>
                  <li>Use solid version on light backgrounds; transparent on dark</li>
                  <li>Use Long Pillar as the default; scale down only when content requires it</li>
                  <li>Keep pillar colours exactly as specified — never approximate</li>
                </ul>
              </CardContent>
            </Card>
            <Card className="shadow-sm border-l-4 border-l-[#f74145]">
              <CardContent className="p-5">
                <h4 className="font-bold text-[#232323] mb-3 text-sm">✗ Never Do</h4>
                <ul className="text-sm text-gray-600 space-y-1.5">
                  <li>Do not place the pillar on the right, centre, or bottom of the frame</li>
                  <li>Do not distort, stretch, or rotate the pillar element</li>
                  <li>Do not change pillar colours or mix pillar colours across elements</li>
                  <li>Do not use the pillar element without the correct pillar number</li>
                  <li>Do not use the Extended variant without all action blocks present</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* ================================================================ */}
        {/* SECTION 13: PHOTOGRAPHY */}
        {/* ================================================================ */}
        <section id="photography" className="mb-16">
          <h2 className="font-archivo text-2xl md:text-3xl font-extrabold text-[#232323] mb-4">
            Photography
          </h2>
          <p className="text-gray-600 mb-8 max-w-3xl">
            ERI photography is documentary and systemic — it shows the infrastructure, industries, and cities that need to transform, not aspirational outcomes. These principles are derived from the Exponential Roadmap 1.5.1 report and apply across all ERI publications and digital products.
          </p>

          {/* Philosophy */}
          <div className="mb-10">
            <h3 className="font-archivo text-lg font-bold text-[#232323] mb-4">Photography Philosophy</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { title: "Systemic, not aspirational", desc: "Show the systems that need to change — factories, ports, cities, energy grids — not idealised green futures. The scale of transformation must be visible." },
                { title: "Documentary, not decorative", desc: "Photography carries editorial weight. Every image should communicate something specific about climate action, not simply illustrate a mood or fill space." },
                { title: "Human scale within systems", desc: "Where people appear, they are interacting with infrastructure or technology — engineers, workers, cyclists. People ground the systemic narrative in lived experience." },
              ].map((item) => (
                <div key={item.title} className="bg-white border border-gray-200 rounded-lg p-5">
                  <div className="w-2 h-2 rounded-full bg-[#3ba559] mb-3" />
                  <h4 className="font-archivo font-bold text-[#232323] text-sm mb-2">{item.title}</h4>
                  <p className="text-gray-600 text-sm leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Subject Matter by Pillar */}
          <div className="mb-10">
            <h3 className="font-archivo text-lg font-bold text-[#232323] mb-4">Subject Matter by Pillar</h3>
            <p className="text-gray-500 text-sm mb-4">Photography subject matter maps directly to the five pillars. Use these categories when sourcing images for pillar-specific content.</p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="text-left px-4 py-3 font-archivo font-bold text-[#232323]">Pillar</th>
                    <th className="text-left px-4 py-3 font-archivo font-bold text-[#232323]">Subject Category</th>
                    <th className="text-left px-4 py-3 font-archivo font-bold text-[#232323]">Example Subjects</th>
                    <th className="text-left px-4 py-3 font-archivo font-bold text-[#232323]">Search Terms</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { pillar: "1 — Operations", color: "#8a9a87", category: "Industrial transformation", examples: "Factories, data centres, manufacturing lines, solar farms", terms: "aerial solar farm, industrial manufacturing overhead, data centre" },
                    { pillar: "2 — Value Chain", color: "#2999c5", category: "Supply chain & logistics", examples: "Ports, shipping containers, warehouses, agricultural fields", terms: "aerial shipping port, cargo containers, supply chain logistics" },
                    { pillar: "3 — Solutions", color: "#22803a", category: "Technology & innovation", examples: "Wind turbine engineers, EV charging, solar installation", terms: "wind turbine engineer, electric vehicle charging, clean technology worker" },
                    { pillar: "4 — Finance", color: "#f97316", category: "Urban infrastructure & capital", examples: "City skylines, financial districts, construction sites", terms: "aerial city financial district, urban construction aerial, smart city" },
                    { pillar: "5 — Policy", color: "#f74145", category: "People & governance", examples: "Cyclists, public transport, civic infrastructure", terms: "cyclists city commuting, public transport tram, urban planning aerial" },
                  ].map((row) => (
                    <tr key={row.pillar} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center gap-2">
                          <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: row.color }} />
                          <span className="font-medium text-[#232323]">{row.pillar}</span>
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-700">{row.category}</td>
                      <td className="px-4 py-3 text-gray-600">{row.examples}</td>
                      <td className="px-4 py-3">
                        <code className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-700">{row.terms}</code>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Composition Principles */}
          <div className="mb-10">
            <h3 className="font-archivo text-lg font-bold text-[#232323] mb-4">Composition Principles</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                {
                  type: "Aerial / Overhead",
                  usage: "Chapter openers, hero images, high-impact moments",
                  desc: "Communicates scale, systemic thinking, and the roadmap metaphor. Looking down at the terrain signals strategic perspective. Used for the most important moments in a publication.",
                  example: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=800&q=80",
                  alt: "Aerial city view — Finance pillar example",
                },
                {
                  type: "Wide Establishing Shot",
                  usage: "Section dividers, context-setting imagery",
                  desc: "Shows the full context of a system or place, not a detail. Provides orientation and communicates the scope of the challenge or opportunity being discussed.",
                  example: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&q=80",
                  alt: "Wide shipping port — Value Chain pillar example",
                },
                {
                  type: "Human-Scale Detail",
                  usage: "Case studies, inline illustrations, pull quotes",
                  desc: "Shows people interacting with technology or infrastructure. Engineers, workers, and citizens ground the systemic narrative in human experience and make abstract change tangible.",
                  example: "https://images.unsplash.com/photo-1508193638397-1c4234db14d8?w=800&q=80",
                  alt: "Wind turbine engineer — Solutions pillar example",
                },
              ].map((comp) => (
                <div key={comp.type} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                  <div className="aspect-video overflow-hidden bg-gray-100">
                    <img src={comp.example} alt={comp.alt} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-4">
                    <h4 className="font-archivo font-bold text-[#232323] text-sm mb-1.5">{comp.type}</h4>
                    <span className="inline-block text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded mb-3">{comp.usage}</span>
                    <p className="text-gray-600 text-sm leading-relaxed">{comp.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Colour Treatment */}
          <div className="mb-10">
            <h3 className="font-archivo text-lg font-bold text-[#232323] mb-4">Colour Treatment Rules</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-archivo font-semibold text-[#232323] text-sm mb-3 flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full bg-[#3ba559] flex items-center justify-center text-white text-xs">✓</span>
                  Do
                </h4>
                <ul className="space-y-2">
                  {[
                    "Use photography at full colour with no filters or overlays applied",
                    "Place the green brand colour (#3ba559) as a separate graphic element beside or on top of the photo — never blended into it",
                    "Use the green underline bar or swirl shape as the brand accent on chapter openers",
                    "Credit all photography sources — Unsplash, Alamy, Shutterstock, or company-provided",
                  ].map((rule) => (
                    <li key={rule} className="flex items-start gap-2 text-sm text-gray-700">
                      <span className="text-[#3ba559] mt-0.5 flex-shrink-0">✓</span>
                      {rule}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-archivo font-semibold text-[#232323] text-sm mb-3 flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full bg-red-500 flex items-center justify-center text-white text-xs">✗</span>
                  Don't
                </h4>
                <ul className="space-y-2">
                  {[
                    "Apply colour tints, green overlays, or duotone effects to photographs",
                    "Use heavily processed photography: HDR, heavy vignettes, or dramatic colour grading",
                    "Use stock photo clichés: handshakes, lightbulbs, people pointing at whiteboards",
                    "Use nature/landscape photography decoratively — forests, mountains, or oceans without systemic context",
                    "Use close-up portrait photography as a primary image (only for case study headshots)",
                  ].map((rule) => (
                    <li key={rule} className="flex items-start gap-2 text-sm text-gray-700">
                      <span className="text-red-500 mt-0.5 flex-shrink-0">✗</span>
                      {rule}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Approved Sources */}
          <div className="mb-10">
            <h3 className="font-archivo text-lg font-bold text-[#232323] mb-4">Approved Sources</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[
                { name: "Unsplash", url: "https://unsplash.com", type: "Free", note: "Best for aerial, urban, and technology subjects. Search by subject + 'aerial' for overhead shots." },
                { name: "Alamy", url: "https://alamy.com", type: "Licensed", note: "Primary source used in ERI 1.5.1 report. Extensive editorial and documentary photography library." },
                { name: "Shutterstock", url: "https://shutterstock.com", type: "Licensed", note: "Used for supplementary imagery. Prefer editorial collections over generic stock." },
                { name: "Company-provided", url: "", type: "Case studies", note: "Partner organisations (Ericsson, Skanska, Telia, etc.) can provide images for case studies with attribution." },
              ].map((src) => (
                <div key={src.name} className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-archivo font-bold text-[#232323] text-sm">{src.name}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      src.type === 'Free' ? 'bg-green-100 text-green-700' :
                      src.type === 'Licensed' ? 'bg-blue-100 text-blue-700' :
                      'bg-gray-100 text-gray-600'
                    }`}>{src.type}</span>
                  </div>
                  <p className="text-gray-600 text-xs leading-relaxed">{src.note}</p>
                  {src.url && (
                    <a href={src.url} target="_blank" rel="noopener noreferrer"
                      className="text-[#3ba559] text-xs font-medium mt-2 inline-flex items-center gap-1 hover:underline">
                      Visit ↗
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Curated Photo Library */}
          <div>
            <h3 className="font-archivo text-lg font-bold text-[#232323] mb-2">Curated Photo Library</h3>
            <p className="text-gray-500 text-sm mb-4">
              29 curated images across all five pillars and brand. Each image has a stable reference ID
              (e.g. <code className="bg-gray-100 px-1 py-0.5 rounded text-xs font-mono">ERI-OPS-001</code>) that
              can be used in Manus AI task prompts or shared with colleagues. Filter by pillar, copy the
              reference ID, or download directly.
            </p>
            <PhotoGallery />
          </div>
        </section>

        {/* ================================================================ */}
        {/* ================================================================ */}
        {/* SECTION 14: MEMBER COMPANY LOGOTYPES */}
        {/* ================================================================ */}
        <section id="member-logos" className="mb-16">
          <h2 className="font-archivo text-2xl md:text-3xl font-extrabold text-[#232323] mb-2">
            Member Company Logotypes
          </h2>
          <p className="text-gray-600 mb-2 max-w-3xl">
            Official logotypes for ERI member companies. Use these assets when referencing member organisations
            in ERI publications, case studies, and digital products. Each logo has a stable CDN URL for use in
            Manus AI task prompts.
          </p>
          <p className="text-xs text-gray-400 mb-8 max-w-3xl">
            Note: All logos are the property of their respective companies and are provided here solely for use
            within authorised ERI communications.
          </p>

          {/* Usage note card */}
          <Card className="shadow-sm mb-6 border-l-4 border-l-[#F5C842]">
            <CardContent className="p-4">
              <p className="text-sm text-gray-700">
                <strong>Using member logos in AI tasks:</strong> Reference a logo by its token name, e.g.
                <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs font-mono mx-1">memberLogos.scania.url</code>
                from <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs font-mono">assets.ts</code>,
                or use the direct CDN URL shown on hover. Always display logos on a white or light background.
                Do not apply colour filters, crop, or recolour any member logo.
              </p>
            </CardContent>
          </Card>

          {/* Logo grid */}
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4">
            {Object.entries(memberLogos).map(([key, { name, url, sector }]) => (
              <div
                key={key}
                className="group relative bg-white border border-gray-200 rounded-lg p-4 flex flex-col items-center justify-center gap-2 hover:shadow-md transition-shadow min-h-[100px]"
              >
                <img
                  src={url}
                  alt={`${name} logo`}
                  className="max-h-12 max-w-full w-auto object-contain"
                />
                <span className="text-[11px] text-gray-500 text-center leading-tight">{name}</span>
                {sector && (
                  <span className="text-[10px] text-gray-400 text-center leading-tight">{sector}</span>
                )}
                {/* Hover overlay with CDN URL copy */}
                <div className="absolute inset-0 bg-white/95 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-2">
                  <span className="text-[10px] font-mono text-gray-500 text-center break-all leading-tight">{key}</span>
                  <a
                    href={url}
                    download
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] text-[#3ba559] font-medium hover:underline flex items-center gap-1"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Download
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ================================================================ */}
        {/* SECTION 15: RESOURCES */}
        {/* ================================================================ */}
        <section id="resources" className="mb-16">
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

        {/* ================================================================ */}
        {/* SECTION 14: MACHINE INSTRUCTIONS */}
        {/* ================================================================ */}
        <section id="ai-instructions" className="mb-16 mt-4">
          <div className="flex items-center gap-3 mb-2">
            <h2 className="font-archivo text-2xl md:text-3xl font-extrabold text-[#232323]">
              Machine Instructions
            </h2>
            <Badge className="bg-[#232323] text-white text-[10px] tracking-widest uppercase hover:bg-[#232323]">For AI Tasks</Badge>
          </div>
          <p className="text-gray-600 mb-8 max-w-3xl">
            This section is the canonical reference for Manus AI tasks building ERI products.
            When instructed to follow the ERI brand, read this section first. All values are
            authoritative — do not infer, approximate, or substitute.
          </p>

          {/* ── HOW TO USE ── */}
          <Card className="shadow-sm mb-6 border-l-4 border-l-[#3ba559]">
            <CardContent className="p-6">
              <h3 className="font-bold text-[#232323] mb-3">How to reference this page in a Manus task prompt</h3>
              <p className="text-sm text-gray-700 mb-3">
                Add the following instruction to any task prompt that requires ERI brand compliance:
              </p>
              <pre className="bg-gray-900 text-green-400 text-xs rounded-md p-4 overflow-x-auto leading-relaxed">{`Before building, read the ERI Brand Design System at:
https://eri-brand-design-system.manus.space/#ai-instructions

Follow all rules in the Machine Instructions section exactly.
Do not use any colours, fonts, or patterns not listed there.`}</pre>
            </CardContent>
          </Card>

          {/* ── COLOUR TOKENS ── */}
          <Card className="shadow-sm mb-6">
            <CardContent className="p-6">
              <h3 className="font-bold text-[#232323] mb-1">Colour Tokens</h3>
              <p className="text-xs text-gray-500 mb-4">Use these exact hex values. Never approximate with Tailwind colour names.</p>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Brand Colours</p>
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-1 font-semibold text-gray-600">Token</th>
                        <th className="text-left py-1 font-semibold text-gray-600">Hex</th>
                        <th className="text-left py-1 font-semibold text-gray-600">Usage</th>
                      </tr>
                    </thead>
                    <tbody className="font-mono">
                      {[
                        ["primary-green",  "#3ba559", "Buttons, CTAs, links, success"],
                        ["dark-text",       "#232323", "Headings, body text, footer bg"],
                        ["neutral-gray",    "#6b7280", "Secondary text, borders"],
                        ["background",      "#F9FAFB", "Page bg, card bg"],
                        ["green-300",       "#93cda3", "Accent links in footer"],
                      ].map(([token, hex, usage]) => (
                        <tr key={token} className="border-b border-gray-100">
                          <td className="py-1.5 pr-3 text-[#3ba559]">{token}</td>
                          <td className="py-1.5 pr-3">
                            <span className="inline-flex items-center gap-1.5">
                              <span className="w-3 h-3 rounded-sm inline-block border border-gray-200" style={{ background: hex }} />
                              {hex}
                            </span>
                          </td>
                          <td className="py-1.5 text-gray-500 font-sans">{usage}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Pillar Colours</p>
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-1 font-semibold text-gray-600">Pillar</th>
                        <th className="text-left py-1 font-semibold text-gray-600">Hex (500)</th>
                        <th className="text-left py-1 font-semibold text-gray-600">Name</th>
                      </tr>
                    </thead>
                    <tbody className="font-mono">
                      {[
                        ["P1 Operations",   "#8a9a87"],
                        ["P2 Value Chain",  "#2999c5"],
                        ["P3 Solutions",    "#22803a"],
                        ["P4 Finance",      "#f97316"],
                        ["P5 Policy",       "#f74145"],
                      ].map(([name, hex]) => (
                        <tr key={name} className="border-b border-gray-100">
                          <td className="py-1.5 pr-3 font-sans text-gray-700">{name}</td>
                          <td className="py-1.5">
                            <span className="inline-flex items-center gap-1.5">
                              <span className="w-3 h-3 rounded-sm inline-block border border-gray-200" style={{ background: hex }} />
                              {hex}
                            </span>
                          </td>
                          <td className="py-1.5 font-sans text-gray-400 text-[11px]">See tonal scales in Visual Identity</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* ── TYPOGRAPHY RULES ── */}
          <Card className="shadow-sm mb-6">
            <CardContent className="p-6">
              <h3 className="font-bold text-[#232323] mb-1">Typography Rules</h3>
              <p className="text-xs text-gray-500 mb-4">Mandatory. Do not substitute Inter, Roboto, or any other font.</p>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div className="space-y-2">
                  <div className="flex gap-2"><span className="text-[#3ba559] font-bold shrink-0">✓</span><span><strong>Font:</strong> Archivo — load via Google Fonts CDN. Map to <code className="bg-gray-100 px-1 rounded text-xs">font-sans</code> and <code className="bg-gray-100 px-1 rounded text-xs">font-archivo</code>.</span></div>
                  <div className="flex gap-2"><span className="text-[#3ba559] font-bold shrink-0">✓</span><span><strong>Weights:</strong> 400 (body), 700 (semibold), 800 (headings/extrabold).</span></div>
                  <div className="flex gap-2"><span className="text-[#3ba559] font-bold shrink-0">✓</span><span><strong>Headings:</strong> <code className="bg-gray-100 px-1 rounded text-xs">font-extrabold</code> (800) for all h1–h3.</span></div>
                  <div className="flex gap-2"><span className="text-[#3ba559] font-bold shrink-0">✓</span><span><strong>Body:</strong> 16px/400, line-height 1.6, colour <code className="bg-gray-100 px-1 rounded text-xs">#232323</code>.</span></div>
                </div>
                <div className="space-y-2">
                  <div className="flex gap-2"><span className="text-red-500 font-bold shrink-0">✗</span><span>Do not use Inter as the primary font.</span></div>
                  <div className="flex gap-2"><span className="text-red-500 font-bold shrink-0">✗</span><span>Do not use font-weight 600 for headings — use 800.</span></div>
                  <div className="flex gap-2"><span className="text-red-500 font-bold shrink-0">✗</span><span>Do not use <code className="bg-gray-100 px-1 rounded text-xs">text-gray-900</code> for body text — use <code className="bg-gray-100 px-1 rounded text-xs">#232323</code>.</span></div>
                  <div className="flex gap-2"><span className="text-red-500 font-bold shrink-0">✗</span><span>Do not load Archivo from local files — use Google Fonts CDN only.</span></div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* ── HEADER ANATOMY ── */}
          <Card className="shadow-sm mb-6">
            <CardContent className="p-6">
              <h3 className="font-bold text-[#232323] mb-1">Header Anatomy — Web App Pattern</h3>
              <p className="text-xs text-gray-500 mb-4">All ERI web applications use this exact header structure. Implement it using <code className="bg-gray-100 px-1 rounded text-xs">PublicLayout</code>.</p>
              <div className="bg-white border border-gray-200 rounded-md p-3 mb-4 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <span className="font-bold text-[#232323] text-sm">EXPONENTIAL<br/>ROADMAP <span className="font-normal text-[10px]">INITIATIVE</span></span>
                  <span className="w-px h-8 bg-gray-300" />
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase tracking-widest font-medium">EXPONENTIAL ROADMAP INITIATIVE</p>
                    <p className="text-sm font-semibold text-gray-700">[App Title]</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="border border-gray-400 text-gray-600 rounded-full px-2 py-0.5 text-[10px]">BETA</span>
                  <span className="text-gray-500 text-[11px]">V.YYYY.MM.DD</span>
                  <span className="w-2 h-2 rounded-full bg-[#3ba559]" />
                  <span className="text-gray-500 text-lg">≡</span>
                </div>
              </div>
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-1 font-semibold text-gray-600">Element</th>
                    <th className="text-left py-1 font-semibold text-gray-600">Tailwind Classes</th>
                    <th className="text-left py-1 font-semibold text-gray-600">Notes</th>
                  </tr>
                </thead>
                <tbody className="font-mono text-[11px]">
                  {[
                    ["ERI logo (PNG)",        "h-8 w-auto",                              "Link to /. PNG not SVG."],
                    ["Vertical divider",       "w-px h-8 bg-gray-300 shrink-0",           "Hidden on mobile."],
                    ["Supertitle",             "text-[11px] font-medium text-gray-400 uppercase tracking-widest", "Product family name."],
                    ["App title",              "text-base font-semibold text-gray-700",   "Current app/page name."],
                    ["BETA badge",             "border border-gray-400 text-gray-600 rounded-full px-2 py-0.5 text-[11px]", "Outlined pill."],
                    ["Version string",         "text-[11px] font-medium text-gray-500 tracking-wide", "Format: V.YYYY.MM.DD"],
                    ["Live status dot",        "w-2 h-2 rounded-full bg-[#3ba559]",       "Green = live."],
                    ["Hamburger menu",         "size-9 rounded-md",                       "Lucide Menu icon. Opens full-screen overlay."],
                  ].map(([el, classes, notes]) => (
                    <tr key={el} className="border-b border-gray-100">
                      <td className="py-1.5 pr-3 font-sans text-gray-700">{el}</td>
                      <td className="py-1.5 pr-3 text-[#3ba559]">{classes}</td>
                      <td className="py-1.5 font-sans text-gray-500">{notes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>

          {/* ── LANGUAGE RULES ── */}
          <Card className="shadow-sm mb-6">
            <CardContent className="p-6">
              <h3 className="font-bold text-[#232323] mb-1">Language Rules</h3>
              <p className="text-xs text-gray-500 mb-4">All copy generated for ERI products must follow these rules without exception.</p>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div className="space-y-2">
                  <div className="flex gap-2"><span className="text-[#3ba559] font-bold shrink-0">✓</span><span><strong>British English</strong> spelling throughout — -ise not -ize, -our not -or, -re not -er.</span></div>
                  <div className="flex gap-2"><span className="text-[#3ba559] font-bold shrink-0">✓</span><span>Use <strong>organisations</strong>, <strong>maximises</strong>, <strong>colour</strong>, <strong>programme</strong>, <strong>licence</strong> (noun).</span></div>
                  <div className="flex gap-2"><span className="text-[#3ba559] font-bold shrink-0">✓</span><span>Dates: <strong>DD Month YYYY</strong> (e.g. 18 March 2026).</span></div>
                  <div className="flex gap-2"><span className="text-[#3ba559] font-bold shrink-0">✓</span><span>Single quotation marks for quotes; double for quotes within quotes.</span></div>
                  <div className="flex gap-2"><span className="text-[#3ba559] font-bold shrink-0">✓</span><span>Oxford comma: use in lists of three or more items.</span></div>
                </div>
                <div className="space-y-2">
                  <div className="flex gap-2"><span className="text-red-500 font-bold shrink-0">✗</span><span>Do not write <strong>organizations</strong>, <strong>maximizes</strong>, <strong>color</strong>, <strong>program</strong> (for a programme).</span></div>
                  <div className="flex gap-2"><span className="text-red-500 font-bold shrink-0">✗</span><span>Do not write dates as MM/DD/YYYY or YYYY-MM-DD in visible copy.</span></div>
                  <div className="flex gap-2"><span className="text-red-500 font-bold shrink-0">✗</span><span>Do not use double quotation marks as the primary quote style.</span></div>
                  <div className="flex gap-2"><span className="text-red-500 font-bold shrink-0">✗</span><span>Do not write <strong>per cent</strong> as % in formal prose — spell it out.</span></div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* ── COMPONENT RULES ── */}
          <Card className="shadow-sm mb-6">
            <CardContent className="p-6">
              <h3 className="font-bold text-[#232323] mb-1">Component & Layout Rules</h3>
              <p className="text-xs text-gray-500 mb-4">Follow these rules when building any ERI UI component or page.</p>
              <div className="space-y-2 text-sm">
                <div className="flex gap-2"><span className="text-[#3ba559] font-bold shrink-0">✓</span><span>Use <code className="bg-gray-100 px-1 rounded text-xs">PublicLayout</code> as the wrapper for all public-facing pages — never build a custom header or footer.</span></div>
                <div className="flex gap-2"><span className="text-[#3ba559] font-bold shrink-0">✓</span><span>Page background: <code className="bg-gray-100 px-1 rounded text-xs">bg-[#F9FAFB]</code>. Card background: white. Footer background: <code className="bg-gray-100 px-1 rounded text-xs">bg-[#232323]</code>.</span></div>
                <div className="flex gap-2"><span className="text-[#3ba559] font-bold shrink-0">✓</span><span>Primary CTA buttons: <code className="bg-gray-100 px-1 rounded text-xs">bg-[#3ba559] text-white hover:bg-[#2c6d3e]</code>.</span></div>
                <div className="flex gap-2"><span className="text-[#3ba559] font-bold shrink-0">✓</span><span>Cards: <code className="bg-gray-100 px-1 rounded text-xs">shadow-sm</code>, white background, <code className="bg-gray-100 px-1 rounded text-xs">rounded-lg</code>. Use <code className="bg-gray-100 px-1 rounded text-xs">hover:shadow-md transition-shadow</code> for interactive cards.</span></div>
                <div className="flex gap-2"><span className="text-[#3ba559] font-bold shrink-0">✓</span><span>Max content width: <code className="bg-gray-100 px-1 rounded text-xs">max-w-6xl mx-auto px-4</code>. Never exceed 1152px for content.</span></div>
                <div className="flex gap-2"><span className="text-[#3ba559] font-bold shrink-0">✓</span><span>Pillar colours must always be used in their correct pillar context — do not reassign P1 colour to P3 content.</span></div>
                <div className="flex gap-2"><span className="text-red-500 font-bold shrink-0">✗</span><span>Do not use purple, teal, or pink as accent colours — they are not part of the ERI brand.</span></div>
                <div className="flex gap-2"><span className="text-red-500 font-bold shrink-0">✗</span><span>Do not use <code className="bg-gray-100 px-1 rounded text-xs">rounded-full</code> on cards or large containers — only on badges, pills, and avatars.</span></div>
                <div className="flex gap-2"><span className="text-red-500 font-bold shrink-0">✗</span><span>Do not use gradient backgrounds on hero sections — use solid <code className="bg-gray-100 px-1 rounded text-xs">#232323</code> or white.</span></div>
              </div>
            </CardContent>
          </Card>

          {/* ── ASSET URL REFERENCE ── */}
          <Card className="shadow-sm mb-6">
            <CardContent className="p-6">
              <h3 className="font-bold text-[#232323] mb-1">Asset URL Reference</h3>
              <p className="text-xs text-gray-500 mb-4">
                All brand assets are hosted on the same CloudFront CDN. Use these direct URLs in AI task prompts
                or code. The base CDN path is{" "}
                <code className="bg-gray-100 px-1 rounded text-xs font-mono">https://d2xsxph8kpxj0f.cloudfront.net/310519663319595517/5mtZtU66sMbsnmPoVbf6UJ/</code>.
              </p>

              {/* Logos */}
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 mt-4">Logos</p>
              <table className="w-full text-xs mb-4">
                <thead><tr className="border-b border-gray-200">
                  <th className="text-left py-1 font-semibold text-gray-600">Token</th>
                  <th className="text-left py-1 font-semibold text-gray-600">File</th>
                  <th className="text-left py-1 font-semibold text-gray-600">Usage</th>
                </tr></thead>
                <tbody className="font-mono text-[11px]">
                  {([
                    ["logos.eriLogoFullColor",    "eri-logo-full-color_f5763508.png",     "Primary wordmark (PNG) — use in <img> tags"],
                    ["logos.eriLogoFullColorSvg", "eri-logo-full-color_775a0122.svg",     "SVG wordmark — use for download links only"],
                    ["logos.eriIconMark",         "eri-icon-mark_08cd328f.webp",          "Compact ERI mark"],
                    ["logos.exponentialLogo",     "exponential-logo_0cda439e.webp",       "Exponential swirl icon / favicon source"],
                    ["logos.faviconIco",          "favicon_46e834ad.ico",                 "Multi-size .ico for browser tab"],
                  ] as [string, string, string][]).map(([token, file, usage]) => (
                    <tr key={token} className="border-b border-gray-100">
                      <td className="py-1.5 pr-3 text-[#3ba559]">{token}</td>
                      <td className="py-1.5 pr-3 text-gray-600">{file}</td>
                      <td className="py-1.5 font-sans text-gray-500">{usage}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Pillar icons */}
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 mt-4">Pillar Icons (WebP)</p>
              <table className="w-full text-xs mb-4">
                <thead><tr className="border-b border-gray-200">
                  <th className="text-left py-1 font-semibold text-gray-600">Token</th>
                  <th className="text-left py-1 font-semibold text-gray-600">Pillar</th>
                </tr></thead>
                <tbody className="font-mono text-[11px]">
                  {([1,2,3,4,5] as const).map((n) => (
                    <tr key={n} className="border-b border-gray-100">
                      <td className="py-1.5 pr-3 text-[#3ba559]">pillarBottomIcons.pillar{n}</td>
                      <td className="py-1.5 font-sans text-gray-500">P{n} bottom icon (navigation overlay)</td>
                    </tr>
                  ))}
                  {([1,2,3,4,5] as const).map((n) => (
                    <tr key={`mark${n}`} className="border-b border-gray-100">
                      <td className="py-1.5 pr-3 text-[#3ba559]">pillarMarks.pillar{n}</td>
                      <td className="py-1.5 font-sans text-gray-500">P{n} pillar mark (compact identifier)</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Framework diagrams */}
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 mt-4">Framework Diagrams (PNG) — v5</p>
              <table className="w-full text-xs mb-4">
                <thead><tr className="border-b border-gray-200">
                  <th className="text-left py-1 font-semibold text-gray-600">Token</th>
                  <th className="text-left py-1 font-semibold text-gray-600">Description</th>
                </tr></thead>
                <tbody className="font-mono text-[11px]">
                  {([
                    ["frameworkV5.fivePillarsBg",          "5 Pillars radial — coloured background"],
                    ["frameworkV5.fivePillarsBgLogo",      "5 Pillars radial — bg + ERI logo"],
                    ["frameworkV5.fivePillarsBgLogoTitle", "5 Pillars radial — bg + logo + title"],
                    ["frameworkV5.fivePillarsExtended",    "5 Pillars extended (with action blocks)"],
                    ["frameworkV5.fivePillarsTransparent", "5 Pillars radial — transparent bg"],
                    ["frameworkV5.fivePillarsShortText",   "5 Pillars short text — transparent"],
                    ["frameworkV5.fivePillarsSymbols",     "5 Pillars symbols only — transparent"],
                    ["frameworkV5.fivePillarsText",        "5 Pillars text only — transparent"],
                    ["frameworkV5.leadershipA",            "Leadership diagram A"],
                    ["frameworkV5.leadershipB",            "Leadership diagram B"],
                    ["frameworkV5.pillarsLinear",          "Pillars linear layout"],
                    ["frameworkV5.reducingEnabling",       "Reducing & enabling diagram"],
                  ] as [string, string][]).map(([token, desc]) => (
                    <tr key={token} className="border-b border-gray-100">
                      <td className="py-1.5 pr-3 text-[#3ba559]">{token}</td>
                      <td className="py-1.5 font-sans text-gray-500">{desc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Pillar elements */}
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 mt-4">Pillar Elements (PNG) — v5</p>
              <p className="text-xs text-gray-400 mb-2">Pattern: <code className="bg-gray-100 px-1 rounded">pillarsLong[1].solid</code> / <code className="bg-gray-100 px-1 rounded">pillarsLong[1].transparent</code> — same pattern for pillarsRegular, pillarsExtended. For pillarsShort: .symbol / .symbolTransp / .text / .textTransp</p>
              <table className="w-full text-xs mb-4">
                <thead><tr className="border-b border-gray-200">
                  <th className="text-left py-1 font-semibold text-gray-600">Namespace</th>
                  <th className="text-left py-1 font-semibold text-gray-600">Pillars</th>
                  <th className="text-left py-1 font-semibold text-gray-600">Variants</th>
                </tr></thead>
                <tbody className="font-mono text-[11px]">
                  {([
                    ["pillarsLong",     "1–5", "solid, transparent"],
                    ["pillarsRegular",  "1–5", "solid, transparent"],
                    ["pillarsExtended", "1–5", "solid, transparent"],
                    ["pillarsShort",    "1–5", "symbol, symbolTransp, text, textTransp"],
                  ] as [string, string, string][]).map(([ns, pillars, variants]) => (
                    <tr key={ns} className="border-b border-gray-100">
                      <td className="py-1.5 pr-3 text-[#3ba559]">{ns}</td>
                      <td className="py-1.5 pr-3 font-sans text-gray-600">{pillars}</td>
                      <td className="py-1.5 font-sans text-gray-500">{variants}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Member logos */}
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 mt-4">Member Company Logotypes</p>
              <p className="text-xs text-gray-400 mb-2">Pattern: <code className="bg-gray-100 px-1 rounded">memberLogos.scania.url</code> — 29 companies. See the Member Logotypes section for the full grid.</p>
              <table className="w-full text-xs mb-2">
                <thead><tr className="border-b border-gray-200">
                  <th className="text-left py-1 font-semibold text-gray-600">Token key</th>
                  <th className="text-left py-1 font-semibold text-gray-600">Company</th>
                  <th className="text-left py-1 font-semibold text-gray-600">Sector</th>
                </tr></thead>
                <tbody className="font-mono text-[11px]">
                  {Object.entries(memberLogos).map(([key, { name, sector }]) => (
                    <tr key={key} className="border-b border-gray-100">
                      <td className="py-1.5 pr-3 text-[#3ba559]">memberLogos.{key}</td>
                      <td className="py-1.5 pr-3 font-sans text-gray-700">{name}</td>
                      <td className="py-1.5 font-sans text-gray-500">{sector}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>

          {/* ── SECTION INDEX ── */}
          <Card className="shadow-sm">
            <CardContent className="p-6">
              <h3 className="font-bold text-[#232323] mb-1">Section Index</h3>
              <p className="text-xs text-gray-500 mb-4">Canonical section IDs and their anchor URLs for programmatic reference.</p>
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-1 font-semibold text-gray-600">#</th>
                    <th className="text-left py-1 font-semibold text-gray-600">Section</th>
                    <th className="text-left py-1 font-semibold text-gray-600 font-mono">Anchor ID</th>
                  </tr>
                </thead>
                <tbody className="font-mono text-[11px]">
                  {[
                    ["1",  "Brand Proposition",       "brand-proposition"],
                    ["2",  "Visual Identity",          "visual-identity"],
                    ["3",  "Logo Usage",               "logo-usage"],
                    ["4",  "Spacing & Layout",         "spacing"],
                    ["5",  "Typography",               "typography"],
                    ["6",  "Verbal Identity",          "verbal-identity"],
                    ["7",  "Component Library",        "component-library"],
                    ["8",  "Exponential Framework",    "exponential-framework"],
                    ["9",  "Page Layout Shells",       "page-layout"],
                    ["10", "Badge Reference",          "badges"],
                    ["11", "Interactive States",       "interactive-states"],
                    ["12", "UI Components",            "components"],
                    ["13", "Photography",              "photography"],
                    ["14", "Member Logotypes",         "member-logos"],
                    ["15", "Resources",                "resources"],
                    ["16", "Machine Instructions",     "ai-instructions"],
                  ].map(([num, label, id]) => (
                    <tr key={id} className="border-b border-gray-100">
                      <td className="py-1.5 pr-3 text-gray-400 font-sans">{num}</td>
                      <td className="py-1.5 pr-3 font-sans text-gray-700">{label}</td>
                      <td className="py-1.5 text-[#3ba559]">#{id}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>

        </section>

          </div>{/* end main content */}
        </div>{/* end two-column layout */}
      </div>
    </PublicLayout>
  );
}
