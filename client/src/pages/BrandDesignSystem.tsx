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
import { Copy, Check, ExternalLink, FileText, Plug, Layers, BookOpen, BarChart3, Download } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import PublicLayout from "@/components/PublicLayout";
import SectionNavigator from "@/components/SectionNavigator";
import { PhotoGallery } from "@/components/PhotoGallery";
import { DataSourceLogoGrid } from "@/components/DataSourceLogoGrid";
import CrocodileChartExamples from "@/components/CrocodileChartExamples";
import { NavigationPatterns } from "@/components/NavigationPatterns";
import { logos, pillarBottomIcons, pillarMarks, frameworkImages, dataSourceLogos, frameworkV5, pillarsLong, pillarsRegular, pillarsExtended, pillarsShort, memberLogos, heroImages } from "@/lib/assets";
import { pillarTints } from "@/lib/pillarColors";

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
    { id: "p1", name: "Pillar 1 — Cut Operational Emissions", hex: "#9aa08c", rgb: "154, 160, 140", context: "Operational emissions, Scope 1 & 2, internal processes",
      tones: { 100: { hex: "#e9ece9", rgb: "233, 236, 233" }, 300: { hex: "#bec7bd", rgb: "190, 199, 189" }, 500: { hex: "#9aa08c", rgb: "154, 160, 140" }, 700: { hex: "#5d675b", rgb: "93, 103, 91" }, 900: { hex: "#393e38", rgb: "57, 62, 56" } } },
    { id: "p2", name: "Pillar 2 — Decarbonize Value Chain", hex: "#17b7dd", rgb: "23, 183, 221", context: "Supply chain, Scope 3, procurement, supplier engagement",
      tones: { 100: { hex: "#d8ecf4", rgb: "216, 236, 244" }, 300: { hex: "#89c6df", rgb: "137, 198, 223" }, 500: { hex: "#17b7dd", rgb: "23, 183, 221" }, 700: { hex: "#216681", rgb: "33, 102, 129" }, 900: { hex: "#1a3e4c", rgb: "26, 62, 76" } } },
    { id: "p3", name: "Pillar 3 — Build & Scale Solutions", hex: "#00ac58", rgb: "0, 172, 88", context: "Climate solutions, products, services, avoided emissions",
      tones: { 100: { hex: "#d7e8db", rgb: "215, 232, 219" }, 300: { hex: "#85b992", rgb: "133, 185, 146" }, 500: { hex: "#00ac58", rgb: "0, 172, 88" }, 700: { hex: "#1c562b", rgb: "28, 86, 43" }, 900: { hex: "#183620", rgb: "24, 54, 32" } } },
    { id: "p4", name: "Pillar 4 — Mobilize Finance & Investment", hex: "#ff8b00", rgb: "255, 139, 0", context: "Climate finance, green bonds, sustainable investment",
      tones: { 100: { hex: "#fde5d5", rgb: "253, 229, 213" }, 300: { hex: "#fbb27e", rgb: "251, 178, 126" }, 500: { hex: "#ff8b00", rgb: "255, 139, 0" }, 700: { hex: "#a14e15", rgb: "161, 78, 21" }, 900: { hex: "#5d3214", rgb: "93, 50, 20" } } },
    { id: "p5", name: "Pillar 5 — Shape Policy & Narrative", hex: "#ff5133", rgb: "255, 81, 51", context: "Policy advocacy, regulatory engagement, trade associations",
      tones: { 100: { hex: "#fddcdd", rgb: "253, 220, 221" }, 300: { hex: "#fa9698", rgb: "250, 150, 152" }, 500: { hex: "#ff5133", rgb: "255, 81, 51" }, 700: { hex: "#a02f32", rgb: "160, 47, 50" }, 900: { hex: "#5c2223", rgb: "92, 34, 35" } } },
  ],
  brand: [
    { id: "primary", name: "Primary Green", hex: "#3ba559", rgb: "59, 165, 89", context: "Primary buttons, CTAs, links, success states",
      tones: { 100: { hex: "#dbeee1", rgb: "219, 238, 225" }, 300: { hex: "#93cda3", rgb: "147, 205, 163" }, 500: { hex: "#3ba559", rgb: "59, 165, 89" }, 700: { hex: "#2c6d3e", rgb: "44, 109, 62" }, 900: { hex: "#20422a", rgb: "32, 66, 42" } } },
    { id: "dark", name: "Primary Dark", hex: "#232323", rgb: "35, 35, 35", context: "Headings, footer background, and high-contrast UI elements. Use #232323 for H1–H4 headings and the footer background. Also used as the primary dark section background on marketing sites (alternating with #F9FAFB light sections), and as the semi-transparent overlay (#232323 at 80–85% opacity) on top of hero background images to create a consistent dark tone. For body paragraph text on white backgrounds, use Dark Gray #383838 (slightly lighter).",
      tones: { 100: { hex: "#d7d7d7", rgb: "215, 215, 215" }, 300: { hex: "#868686", rgb: "134, 134, 134" }, 500: { hex: "#232323", rgb: "35, 35, 35" }, 700: { hex: "#1d1d1d", rgb: "29, 29, 29" }, 900: { hex: "#181818", rgb: "24, 24, 24" } } },
    { id: "neutral", name: "Neutral Gray", hex: "#6b7280", rgb: "107, 114, 128", context: "Secondary text, borders, disabled states",
      tones: { 100: { hex: "#e4e5e8", rgb: "228, 229, 232" }, 300: { hex: "#adb1b9", rgb: "173, 177, 185" }, 500: { hex: "#6b7280", rgb: "107, 114, 128" }, 700: { hex: "#494e56", rgb: "73, 78, 86" }, 900: { hex: "#2f3236", rgb: "47, 50, 54" } } },
    { id: "off-white", name: "Off White", hex: "#F9FAFB", rgb: "249, 250, 251", context: "Page backgrounds, card backgrounds, and light section backgrounds. The standard light surface colour for all ERI web applications and the alternating light sections on marketing sites",
      tones: { 100: { hex: "#fdfefe", rgb: "253, 254, 254" }, 300: { hex: "#fbfcfc", rgb: "251, 252, 252" }, 500: { hex: "#f9fafb", rgb: "249, 250, 251" }, 700: { hex: "#a1a2a3", rgb: "161, 162, 163" }, 900: { hex: "#5d5d5d", rgb: "93, 93, 93" } } },
    { id: "yellow", name: "Highlight Yellow", hex: "#F5C842", rgb: "245, 200, 66", context: "Data highlights, chart callouts, goal indicators, emphasis accents — introduced in Playbook v5",
      tones: { 100: { hex: "#f2e4bd", rgb: "242, 228, 189" }, 300: { hex: "#bfaa6b", rgb: "191, 170, 107" }, 500: { hex: "#f5c842", rgb: "245, 200, 66" }, 700: { hex: "#725f27", rgb: "114, 95, 39" }, 900: { hex: "#332b15", rgb: "51, 43, 21" } } },
    { id: "accent-lime", name: "Accent Lime", hex: "#93E07D", rgb: "147, 224, 125", context: "Typographic heading accent colour for use on dark or green backgrounds (e.g. hero sections, dark cards). Use lime #93E07D for accent words when the background is dark green or black. On white or light backgrounds, use Primary Green #3ba559 instead. NOT for UI components, buttons, or data visualisation.",
      tones: { 100: { hex: "#edf9e9", rgb: "237, 249, 233" }, 300: { hex: "#c4edba", rgb: "196, 237, 186" }, 500: { hex: "#93e07d", rgb: "147, 224, 125" }, 700: { hex: "#4a9e38", rgb: "74, 158, 56" }, 900: { hex: "#2a5a21", rgb: "42, 90, 33" } } },

    { id: "dark-gray", name: "Dark Gray", hex: "#383838", rgb: "56, 56, 56", context: "Standard body paragraph text colour for all ERI surfaces. Use #383838 for all body copy on white or light backgrounds. Pair with Archivo headings (Primary Dark #232323) and Open Sans body text.",
      tones: { 100: { hex: "#d8d8d8", rgb: "216, 216, 216" }, 300: { hex: "#8a8a8a", rgb: "138, 138, 138" }, 500: { hex: "#383838", rgb: "56, 56, 56" }, 700: { hex: "#262626", rgb: "38, 38, 38" }, 900: { hex: "#181818", rgb: "24, 24, 24" } } },
    { id: "linkedin", name: "LinkedIn Blue", hex: "#007BB6", rgb: "0, 123, 182", context: "LinkedIn social media icon background. Used in the ERI footer social links row. Do not use for any other purpose.",
      tones: { 100: { hex: "#cce5f3", rgb: "204, 229, 243" }, 300: { hex: "#66b3d9", rgb: "102, 179, 217" }, 500: { hex: "#007bb6", rgb: "0, 123, 182" }, 700: { hex: "#005a87", rgb: "0, 90, 135" }, 900: { hex: "#003a58", rgb: "0, 58, 88" } } },
    { id: "youtube", name: "YouTube Red", hex: "#A82400", rgb: "168, 36, 0", context: "YouTube social media icon background. Used in the ERI footer social links row. Do not use for any other purpose.",
      tones: { 100: { hex: "#f3d5cc", rgb: "243, 213, 204" }, 300: { hex: "#d47a66", rgb: "212, 122, 102" }, 500: { hex: "#a82400", rgb: "168, 36, 0" }, 700: { hex: "#7a1a00", rgb: "122, 26, 0" }, 900: { hex: "#4a1000", rgb: "74, 16, 0" } } },
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
    filePath: "eri-logo-full-color.webp",
    fileId: "eri-logo-full-color_64e5c7db",
    cdnUrl: logos.eriLogoFullColor,
    downloadName: "eri-logo-full-color.webp",
    svgUrl: logos.eriLogoFullColorSvg,
    svgFileId: "eri-logo-full-color_775a0122",
    darkBg: "#232323",
    darkFilter: "brightness(0) invert(1)",
    usage: "Primary logo for all light-background contexts: website headers, footers, documents, presentations. On dark backgrounds, apply CSS filter: brightness(0) invert(1) to render the logo in white.",
    when: "Default choice. Use whenever background is white or light grey. Use the inverted (white) version on dark backgrounds.",
    minWidth: "160px",
    clearSpace: "Equal to the height of the 'E' letterform on all four sides.",
  },
  {
    id: "eri-icon",
    name: "ERI Icon Mark",
    file: logos.eriIconMark,
    filePath: "eri-icon-mark.webp",
    fileId: "eri-icon-mark_6c872e6b",
    cdnUrl: logos.eriIconMark,
    downloadName: "eri-icon-mark.webp",
    darkBg: "#2c3f43",
    usage: "Compact ERI mark for use in navigation menus, compact UI elements, and alongside pillar icons. The mark uses original green and black colours — do not recolour.",
    when: "When a compact ERI identifier is needed without the full wordmark.",
    minWidth: "32px",
    clearSpace: "4px on all sides minimum.",
  },
  {
    id: "favicon-white",
    name: "Favicon — White Rounded (Canonical)",
    file: logos.faviconWhiteRounded32,
    filePath: "favicon-white-rounded-32.png",
    fileId: "favicon-white-rounded-32_05ba5ceb",
    cdnUrl: logos.faviconWhiteRounded32,
    downloadName: "favicon-white-rounded-32.png",
    darkBg: "#232323",
    darkFile: logos.faviconWhiteRounded32,
    darkLabel: "White bg — visible on dark",
    usage: "The canonical browser tab favicon for all ERI Manus-hosted projects. White background with 12% corner radius. Use the CDN URL directly in client/index.html — do not copy to client/public/. See the Favicon Implementation card below for the exact head code.",
    when: "Always. This is the only approved favicon format for Manus-hosted ERI projects. Do not use .ico.",
    minWidth: "32px",
    clearSpace: "N/A — favicon is always displayed at system-determined size.",
    faviconSizes: [
      { label: "32px (browser tab)", fileId: "favicon-white-rounded-32_05ba5ceb", cdnUrl: logos.faviconWhiteRounded32, downloadName: "favicon-white-rounded-32.png", note: "Use CDN URL directly — do not copy to /public/" },
      { label: "180px (Apple Touch)", fileId: "favicon-white-rounded-180_2daaa7d4", cdnUrl: logos.faviconWhiteRounded180, downloadName: "favicon-white-rounded-180.png", note: "Apple Touch Icon" },
      { label: "192px (Android/PWA)", fileId: "favicon-white-rounded-192_54fb4338", cdnUrl: logos.faviconWhiteRounded192, downloadName: "favicon-white-rounded-192.png", note: "PWA manifest" },
    ],
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
      {/* Tint background block — full-saturation colour dot + tint bg */}
      <div
        className="h-20 w-full flex items-center justify-center"
        style={{ backgroundColor: hex + "18" }}
      >
        <span
          className="w-10 h-10 rounded-full shadow-sm"
          style={{ backgroundColor: hex }}
        />
      </div>
      {/* Tonal scale strip */}
      <div className="flex h-8 overflow-hidden">
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
            <code className="font-mono" style={{ color: hex }}>{hex}</code>
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
  cyan:   "#17b7dd",
  orange: "#ff8b00",
  accentLime: "#93E07D",
  red:    "#ff5133",
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
            The purpose of the system is to enable consistency, quality, and integrity across all touch points.
          </p>
        </div>
      </section>

      {/* ── TWO-COLUMN LAYOUT: sticky nav + scrollable content ── */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* IMPORTANT: do NOT use items-start or items-stretch on this flex container.
             The sticky nav requires its parent to have full height (default stretch behaviour).
             The global .flex { min-height: 0 } override is intentional for other contexts
             but here we need the default flex-start alignment on the cross-axis so that
             the sticky child can use position:sticky correctly. */}
        <div style={{ display: "flex", gap: "2.5rem", alignItems: "flex-start" }}>

          {/* ── STICKY SECTION NAVIGATOR (desktop only) ── */}
          {/* top: 68px = 4px top strip + 64px header.
               The outer div uses position:sticky directly (no wrapper needed).
               max-height + overflow-y-auto lets the nav scroll independently
               on very long pages so it never disappears. */}
          <div
            className="hidden lg:block overflow-y-auto"
            style={{
              position: "sticky",
              top: "68px",
              width: "13rem",
              flexShrink: 0,
              maxHeight: "calc(100vh - 68px - 2rem)",
              alignSelf: "flex-start",
              paddingBottom: "2rem",
            }}
          >
            <SectionNavigator />
          </div>

          {/* ── MAIN CONTENT ── */}
          <div className="flex-1 min-w-0">

        {/* ================================================================ */}
        {/* ================================================================ */}
        {/* ── ZONE 1: COMMUNICATIONS & BRAND ─────────────────────────────── */}
        {/* ================================================================ */}

        {/* SECTION 1: BRAND PROPOSITION */}
        {/* ================================================================ */}
        <section className="mb-16" id="brand-proposition">
          <h2 className="font-archivo text-2xl md:text-3xl font-extrabold text-[#232323] mb-8">
            Brand Proposition
          </h2>

          {/* Mission + Vision — prominent green/dark cards */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* Mission — Primary Green */}
            <div className="rounded-lg p-8" style={{ background: "linear-gradient(135deg, #3ba559 0%, #2c7a42 100%)" }}>
              <h3 className="font-archivo font-extrabold text-white text-2xl mb-4">Mission</h3>
              <p className="text-white text-lg leading-relaxed">{brandProposition.mission}</p>
            </div>
            {/* Vision — Primary Dark */}
            <div className="rounded-lg p-8" style={{ background: "linear-gradient(135deg, #2c2c2c 0%, #1a1a1a 100%)" }}>
              <h3 className="font-archivo font-extrabold text-[#93E07D] text-2xl mb-4">Vision</h3>
              <p className="text-white text-lg leading-relaxed">{brandProposition.vision}</p>
            </div>
          </div>

          {/* Core Values */}
          <Card className="shadow-sm mb-8">
            <CardContent className="p-6">
              <h3 className="font-bold text-[#232323] mb-6 text-lg">Core Values</h3>
              <div className="grid md:grid-cols-4 gap-6">
                {brandProposition.values.map((value) => (
                  <div key={value.name} className="border-t-4 border-[#3ba559] pt-4">
                    <h4 className="font-archivo font-extrabold text-[#232323] text-base mb-2">{value.name}</h4>
                    <p className="text-sm text-gray-600 leading-relaxed">{value.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Brand Personality */}
          <div className="rounded-lg p-8 bg-[#F9FAFB] border border-gray-200">
            <h3 className="font-bold text-[#232323] mb-3 text-lg">Brand Personality</h3>
            <p className="font-archivo font-bold text-[#232323] text-xl italic leading-relaxed">"{brandProposition.personality}"</p>
          </div>
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

          {/* Dark Image Hero */}
          <h3 className="font-bold text-[#232323] mb-4 text-lg mt-12">Dark Image Hero — Standard</h3>
          <p className="text-gray-600 mb-6 text-sm max-w-3xl">
            The standard hero pattern for all ERI web applications and marketing sites. A full-bleed background image
            is overlaid with a semi-transparent <code className="font-mono bg-gray-100 px-1 rounded">#232323</code> at 80–85% opacity,
            creating a consistent dark tone while allowing the image to show through. White Archivo heading with one or two
            accent words in Accent Lime <code className="font-mono bg-gray-100 px-1 rounded">#93E07D</code>. Primary Green
            <code className="font-mono bg-gray-100 px-1 rounded">#3ba559</code> CTA button.
          </p>
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <Card className="shadow-sm overflow-hidden">
              <div
                className="h-40 w-full relative flex items-center justify-center"
                style={{ backgroundColor: "#232323" }}
              >
                {/* Simulated dark overlay pattern */}
                <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(circle at 70% 50%, #3ba559 0%, transparent 60%)" }} />
                <div className="relative z-10 px-6 text-center">
                  <p className="font-archivo font-extrabold text-2xl text-white leading-tight">
                    <span className="text-[#93E07D]">Exponential</span><br />Human-AI Lab
                  </p>
                  <button className="mt-3 px-4 py-1.5 bg-[#3ba559] text-white text-xs font-semibold rounded">Explore the Application Suite →</button>
                </div>
              </div>
              <CardContent className="p-4">
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Dark Image Hero</p>
                <p className="text-xs text-gray-500">Background image + <code className="bg-gray-100 px-1 rounded">#232323/85</code> overlay. White Archivo 800 heading. Accent Lime for one or two accent words. Primary Green CTA button.</p>
              </CardContent>
            </Card>
            <Card className="shadow-sm">
              <CardContent className="p-5">
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-3">Hero Anatomy</p>
                <table className="w-full text-xs">
                  <tbody>
                    <tr className="border-b border-gray-100"><td className="py-1.5 pr-3 text-gray-500">Background</td><td className="py-1.5 font-mono text-[#232323]">Full-bleed image + <span className="text-[#232323] font-bold">#232323</span> at 80–85% opacity</td></tr>
                    <tr className="border-b border-gray-100"><td className="py-1.5 pr-3 text-gray-500">Heading</td><td className="py-1.5 font-mono text-[#232323]">Archivo 800 · white · 4xl–6xl</td></tr>
                    <tr className="border-b border-gray-100"><td className="py-1.5 pr-3 text-gray-500">Accent word</td><td className="py-1.5 font-mono"><span className="text-[#93E07D] font-bold">#93E07D</span> Accent Lime</td></tr>
                    <tr className="border-b border-gray-100"><td className="py-1.5 pr-3 text-gray-500">Body text</td><td className="py-1.5 font-mono text-[#232323]">Open Sans 400 · white/80 · 16–18px</td></tr>
                    <tr><td className="py-1.5 pr-3 text-gray-500">CTA button</td><td className="py-1.5 font-mono"><span className="text-[#3ba559] font-bold">#3ba559</span> Primary Green · white text</td></tr>
                  </tbody>
                </table>
              </CardContent>
            </Card>
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
            Three logo assets are available. Each card shows the asset on both a light and dark background so you can verify contrast before use. Each card includes a file identifier and a direct download button. Always respect minimum sizes and clear-space rules to maintain legibility and brand integrity.
          </p>

          <div className="grid md:grid-cols-2 gap-6 mb-10">
            {logoVariants.map((v) => {
              const vx = v as {
                darkBg?: string; darkFilter?: string; darkFile?: string; darkLabel?: string;
                cdnUrl?: string; fileId?: string; downloadName?: string;
                svgUrl?: string; svgFileId?: string;
                appIcon?: {
                  dark: string; darkFileId?: string; darkDownloadName?: string;
                  light: string; lightFileId?: string; lightDownloadName?: string; lightCdnUrl?: string;
                  sizes: string; note: string;
                };
                faviconSizes?: { label: string; fileId: string; cdnUrl: string; downloadName: string; note: string }[];
              };
              return (
                <Card key={v.id} className="shadow-sm overflow-hidden">
                  {/* Dual background preview: white left / dark right */}
                  <div className="flex items-stretch h-36 rounded-t-lg overflow-hidden divide-x divide-gray-200">
                    {/* Light side */}
                    <div className="flex-1 flex flex-col items-center justify-center gap-1.5 bg-white px-4">
                      <img
                        src={v.file}
                        alt={v.name}
                        className="max-h-14 max-w-[160px] object-contain"
                      />
                      <span className="text-[10px] text-gray-400 font-medium tracking-wide uppercase">Light background</span>
                    </div>
                    {/* Dark side */}
                    <div
                      className="flex-1 flex flex-col items-center justify-center gap-1.5 px-4"
                      style={{ backgroundColor: vx.darkBg || "#232323" }}
                    >
                      <img
                        src={vx.darkFile || v.file}
                        alt={vx.darkLabel || v.name}
                        className="max-h-14 max-w-[160px] object-contain"
                        style={vx.darkFilter ? { filter: vx.darkFilter } : undefined}
                      />
                      <span className="text-[10px] text-gray-500 font-medium tracking-wide uppercase">
                        {vx.darkLabel || "Dark background"}
                      </span>
                    </div>
                  </div>
                  <CardContent className="p-5 space-y-3">
                    {/* Name + download button row */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-[#232323] text-base mb-1">{v.name}</h3>
                        {/* File identifier chip */}
                        {vx.fileId && (
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="inline-flex items-center gap-1 text-[10px] font-mono bg-gray-100 text-gray-500 px-2 py-0.5 rounded border border-gray-200">
                              <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5l5 5v11a2 2 0 01-2 2H7a2 2 0 01-2-2V5a2 2 0 012-2z" /></svg>
                              {vx.fileId}
                            </span>
                            {vx.svgFileId && (
                              <span className="inline-flex items-center gap-1 text-[10px] font-mono bg-gray-100 text-gray-500 px-2 py-0.5 rounded border border-gray-200">
                                <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5l5 5v11a2 2 0 01-2 2H7a2 2 0 01-2-2V5a2 2 0 012-2z" /></svg>
                              {vx.svgFileId}
                            </span>
                            )}
                          </div>
                        )}
                      </div>
                      {/* Download buttons */}
                      <div className="flex flex-col gap-1.5 shrink-0">
                        {vx.cdnUrl && vx.downloadName && (
                          <a
                            href={vx.cdnUrl}
                            download={vx.downloadName}
                            className="inline-flex items-center gap-1.5 bg-[#3ba559] text-white text-[11px] font-semibold px-3 py-1.5 rounded-md hover:bg-[#2c6d3e] transition-colors whitespace-nowrap"
                          >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                            Download
                          </a>
                        )}
                        {vx.svgUrl && (
                          <a
                            href={vx.svgUrl}
                            download="eri-logo-full-color.svg"
                            className="inline-flex items-center gap-1.5 border border-gray-300 text-gray-600 text-[11px] font-medium px-3 py-1.5 rounded-md hover:bg-gray-50 transition-colors whitespace-nowrap"
                          >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                            SVG
                          </a>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                      <div>
                        <span className="text-gray-400 text-xs uppercase tracking-wide block mb-0.5">Min Width</span>
                        <span className="text-gray-700 font-mono text-xs">{v.minWidth}</span>
                      </div>
                      <div>
                        <span className="text-gray-400 text-xs uppercase tracking-wide block mb-0.5">Clear Space</span>
                        <span className="text-gray-600 text-xs">{v.clearSpace}</span>
                      </div>
                      <div className="col-span-2">
                        <span className="text-gray-400 text-xs uppercase tracking-wide block mb-0.5">When to use</span>
                        <span className="text-gray-600 text-xs">{v.when}</span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 border-t pt-3">{v.usage}</p>
                    {vx.darkFilter && (
                      <div className="bg-gray-900 rounded p-2">
                        <code className="text-xs text-gray-300 font-mono">filter: {vx.darkFilter}</code>
                      </div>
                    )}
                    {/* App icon sub-section for icon mark */}
                    {vx.appIcon && (
                      <div className="border border-gray-200 rounded overflow-hidden">
                        <div className="bg-gray-50 px-3 py-1.5 border-b border-gray-200 flex items-center justify-between">
                          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">App Icon Variants</span>
                          <span className="text-[10px] text-gray-400">{vx.appIcon.sizes}</span>
                        </div>
                        <div className="px-3 py-3 flex items-start gap-4">
                          <div className="flex flex-col items-center gap-1">
                            <img src={vx.appIcon.light} alt="White rounded app icon" className="w-12 h-12 object-contain rounded-lg border border-gray-200" />
                            <span className="text-[10px] text-gray-400 text-center">White bg</span>
                            <span className="text-[9px] text-[#3ba559] font-semibold">Canonical</span>
                            {vx.appIcon.lightCdnUrl && vx.appIcon.lightDownloadName && (
                              <a href={vx.appIcon.lightCdnUrl} download={vx.appIcon.lightDownloadName}
                                className="text-[9px] text-[#3ba559] underline hover:text-[#2c6d3e]">↓ PNG</a>
                            )}
                          </div>
                          <div className="flex flex-col items-center gap-1">
                            <img src={vx.appIcon.dark} alt="Dark app icon" className="w-12 h-12 object-contain rounded-lg" />
                            <span className="text-[10px] text-gray-400 text-center">Dark bg</span>
                            <span className="text-[9px] text-gray-400">Dark contexts</span>
                            {vx.appIcon.darkDownloadName && (
                              <a href={vx.appIcon.dark} download={vx.appIcon.darkDownloadName}
                                className="text-[9px] text-gray-400 underline hover:text-gray-600">↓ PNG</a>
                            )}
                          </div>
                          <p className="text-xs text-gray-500 flex-1">{vx.appIcon.note}</p>
                        </div>
                        {/* File IDs for app icon variants */}
                        {(vx.appIcon.lightFileId || vx.appIcon.darkFileId) && (
                          <div className="px-3 pb-3 flex flex-wrap gap-1.5">
                            {vx.appIcon.lightFileId && (
                              <span className="inline-flex items-center gap-1 text-[9px] font-mono bg-[#f0faf3] text-[#3ba559] px-2 py-0.5 rounded border border-[#c6e8d0]">
                                {vx.appIcon.lightFileId}
                              </span>
                            )}
                            {vx.appIcon.darkFileId && (
                              <span className="inline-flex items-center gap-1 text-[9px] font-mono bg-gray-100 text-gray-500 px-2 py-0.5 rounded border border-gray-200">
                                {vx.appIcon.darkFileId}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                    {/* Favicon sizes sub-section */}
                    {vx.faviconSizes && (
                      <div className="border border-gray-200 rounded overflow-hidden">
                        <div className="bg-gray-50 px-3 py-1.5 border-b border-gray-200">
                          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Available Sizes</span>
                        </div>
                        <div className="divide-y divide-gray-100">
                          {vx.faviconSizes.map((fs) => (
                            <div key={fs.label} className="px-3 py-2 flex items-center justify-between gap-3">
                              <div className="flex-1 min-w-0">
                                <span className="text-xs font-medium text-gray-700">{fs.label}</span>
                                <span className="text-[10px] text-gray-400 ml-2">{fs.note}</span>
                                <div className="mt-0.5">
                                  <span className="text-[9px] font-mono bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded border border-gray-200">{fs.fileId}</span>
                                </div>
                              </div>
                              <a
                                href={fs.cdnUrl}
                                download={fs.downloadName}
                                className="inline-flex items-center gap-1 bg-[#3ba559] text-white text-[10px] font-semibold px-2.5 py-1 rounded hover:bg-[#2c6d3e] transition-colors whitespace-nowrap shrink-0"
                              >
                                <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                                Download
                              </a>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Favicon head code snippet */}
          <Card className="shadow-sm mb-4 border-2 border-[#3ba559]">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-3">
                <span className="inline-flex items-center gap-1.5 bg-[#3ba559] text-white text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wide">Mandatory</span>
                <h3 className="font-bold text-[#232323] text-base">Favicon — Correct <code className="font-mono text-sm">&lt;head&gt;</code> Implementation</h3>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                Copy these exact three lines into <code className="bg-gray-100 px-1 rounded text-xs">client/index.html</code> inside <code className="bg-gray-100 px-1 rounded text-xs">&lt;head&gt;</code>.
                Remove any existing <code className="bg-gray-100 px-1 rounded text-xs">&lt;link rel="icon"&gt;</code> or <code className="bg-gray-100 px-1 rounded text-xs">&lt;link rel="shortcut icon"&gt;</code> tags first.
                Do <strong>not</strong> copy any file into <code className="bg-gray-100 px-1 rounded text-xs">client/public/</code> — use the CDN URLs directly.
              </p>
              <pre className="bg-gray-900 text-green-400 text-xs rounded-md p-4 overflow-x-auto leading-relaxed mb-4">{`<!-- ERI Favicon — white rounded PNG (32px, white bg, 12% corner radius) -->
<!-- PNG only — Manus hosting does not serve .ico correctly -->
<link rel="icon" type="image/png" sizes="32x32"
  href="https://d2xsxph8kpxj0f.cloudfront.net/310519663319595517/5mtZtU66sMbsnmPoVbf6UJ/favicon-white-rounded-32_05ba5ceb.png" />
<link rel="apple-touch-icon" sizes="180x180"
  href="https://d2xsxph8kpxj0f.cloudfront.net/310519663319595517/5mtZtU66sMbsnmPoVbf6UJ/favicon-white-rounded-180_2daaa7d4.png" />
<link rel="icon" type="image/png" sizes="192x192"
  href="https://d2xsxph8kpxj0f.cloudfront.net/310519663319595517/5mtZtU66sMbsnmPoVbf6UJ/favicon-white-rounded-192_54fb4338.png" />`}</pre>
              <p className="text-xs text-gray-500 mb-1 font-semibold">Why 32px? That is the correct and intentional size for a browser tab favicon. Do not search for a larger file to use as the tab icon.</p>
            </CardContent>
          </Card>

          {/* What NOT to use warning */}
          <Card className="shadow-sm mb-6 border border-red-200 bg-red-50">
            <CardContent className="p-5">
              <h4 className="font-bold text-red-800 mb-3 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center font-bold flex-shrink-0">!</span>
                Favicon — What NOT to use
              </h4>
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-red-200">
                    <th className="text-left py-1.5 pr-4 text-red-700 font-semibold">File / variant</th>
                    <th className="text-left py-1.5 text-red-700 font-semibold">Why it is wrong</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-red-100">
                  {[
                    ["exponential-logo.webp", "Raw swirl with no rounded corners — source file only, not a favicon"],
                    ["Any .ico file", "Manus hosting does not serve .ico correctly — PNG only"],
                    ["Any local /favicon.png file", "Local files cause deployment timeouts on Manus — use CDN URLs above"],
                  ].map(([file, reason]) => (
                    <tr key={file}>
                      <td className="py-1.5 pr-4 font-mono text-red-700">{file}</td>
                      <td className="py-1.5 text-red-800">{reason}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>

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
        {/* SECTION 5: TYPOGRAPHY */}
        {/* ================================================================ */}
        <section className="mb-16" id="typography">
          <h2 className="font-archivo text-2xl md:text-3xl font-extrabold text-[#232323] mb-4">
            Typography
          </h2>
          <p className="text-gray-600 mb-8 max-w-3xl">
            ERI uses a two-font system. <strong>Archivo</strong> is the heading and display typeface — used at weight 700–800 for all H1–H3 and marketing hero text.{" "}
            <strong>Open Sans</strong> is the body typeface — used for all paragraph text, UI labels, navigation, and captions. Both are loaded via Google Fonts CDN.
            The web applications map <code className="font-mono text-xs bg-gray-100 px-1 rounded">font-sans</code> to Archivo for consistency with the design system.
          </p>

          <div className="grid md:grid-cols-2 gap-6 mb-10">
            <Card className="shadow-sm">
              <CardContent className="p-6">
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">Heading &amp; Display Font</p>
                <p className="font-archivo font-extrabold text-3xl text-[#232323] mb-3">Archivo</p>
                <p className="text-sm text-gray-600 mb-3">
                  Used for all H1–H3, hero text, section titles, and card headings. Weights: 400, 500, 600, 700, 800, 900.
                  Loaded via Google Fonts CDN.
                </p>
                <div className="space-y-1">
                  <code className="block text-xs font-mono text-[#3ba559] bg-green-50 px-2 py-1 rounded">font-archivo → headings, display, hero text</code>
                  <code className="block text-xs font-mono text-[#3ba559] bg-green-50 px-2 py-1 rounded">font-sans → Archivo (Tailwind default alias)</code>
                </div>
              </CardContent>
            </Card>
            <Card className="shadow-sm">
              <CardContent className="p-6">
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">Body &amp; UI Font</p>
                <p style={{ fontFamily: "'Open Sans', sans-serif" }} className="font-semibold text-3xl text-[#232323] mb-3">Open Sans</p>
                <p className="text-sm text-gray-600 mb-3">
                  Used for all body text, paragraphs, UI labels, navigation items, captions, and form fields.
                  Weights: 400, 500, 600, 700. Loaded via Google Fonts CDN.
                </p>
                <div className="space-y-1">
                  <code className="block text-xs font-mono text-[#3ba559] bg-green-50 px-2 py-1 rounded">font-['Open_Sans'] → body, UI, captions</code>
                  <code className="block text-xs font-mono text-[#3ba559] bg-green-50 px-2 py-1 rounded">Standard body font for all ERI web applications</code>
                </div>
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
                  { label: "Body",           classes: "text-base text-gray-600",                                         previewClass: "text-base text-gray-600",                                  text: "The fastest economic transition in history is underway.",             context: "Standard paragraph text. 16px (1rem). Open Sans 400 across all ERI surfaces — both marketing and web applications. Colour: #383838 on white backgrounds." },
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
          {/* Accent Word Heading Pattern */}
          <Card className="shadow-sm mt-6">
            <CardContent className="p-5">
              <h4 className="font-bold text-[#232323] mb-2 text-sm">Heading Accent Word Pattern</h4>
              <p className="text-sm text-gray-600 mb-4">
                Accent Lime <code className="bg-gray-100 px-1 rounded text-xs">#93E07D</code> is used for one or two accent words in a heading, <strong>exclusively on dark or green backgrounds</strong> — hero sections, dark cards, and dark section backgrounds. On white or light backgrounds, use Primary Green <code className="bg-gray-100 px-1 rounded text-xs">#3ba559</code> instead. Accent Lime has insufficient contrast on light surfaces.
              </p>
              {/* Correct usage — on dark background */}
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">✅ Correct — on dark background</p>
              <div className="rounded-lg p-5 mb-4" style={{ background: "linear-gradient(135deg, #2c2c2c 0%, #1a1a1a 100%)" }}>
                <p className="font-archivo font-extrabold text-2xl text-white">
                  About the Exponential Roadmap <span className="text-[#93E07D]">Initiative</span>
                </p>
                <p className="font-archivo font-extrabold text-2xl text-white mt-2">
                  Exponential Roadmap Initiative <span className="text-[#93E07D]">Members</span>
                </p>
              </div>
              {/* Incorrect usage — on white background */}
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">❌ Do not use — on white/light background</p>
              <div className="rounded-lg p-5 mb-4 bg-white border border-gray-200">
                <p className="font-archivo font-extrabold text-2xl text-[#232323]">
                  About the Exponential Roadmap <span className="text-[#93E07D] opacity-80">Initiative</span>
                </p>
                <p className="text-xs text-red-500 mt-2">Accent Lime on white has insufficient contrast. Use <span className="font-mono">#3ba559</span> Primary Green on light backgrounds instead.</p>
              </div>
              <code className="text-xs font-mono text-gray-600 block bg-gray-50 border border-gray-200 rounded p-2">
                {`<h1 className="font-archivo font-extrabold text-white">
  About the Exponential Roadmap{" "}
  <span className="text-[#93E07D]">Initiative</span>  {/* dark bg only */}
</h1>`}
              </code>
              <p className="text-xs text-gray-500 mt-2">Use sparingly — one or two accent words per heading maximum. Never apply to body text or on light backgrounds.</p>
            </CardContent>
          </Card>
          {/* Marketing vs. Application note */}
          <Card className="shadow-sm border-gray-200 bg-gray-50 mt-6">
            <CardContent className="p-5">
              <h4 className="font-bold text-[#232323] mb-3 text-sm">Typography on Light vs. Dark Backgrounds</h4>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Dark Background (hero sections, dark cards)</p>
                  <table className="w-full text-xs">
                    <tbody>
                      <tr className="border-b border-gray-100"><td className="py-1.5 pr-3 text-gray-500">H1 hero</td><td className="py-1.5 font-mono text-[#232323]">Archivo 800 · 4xl–6xl · white</td></tr>
                      <tr className="border-b border-gray-100"><td className="py-1.5 pr-3 text-gray-500">H2 section</td><td className="py-1.5 font-mono text-[#232323]">Archivo 700 · ~36px · #232323</td></tr>
                      <tr className="border-b border-gray-100"><td className="py-1.5 pr-3 text-gray-500">Heading accent</td><td className="py-1.5 font-mono text-[#232323]">Archivo 700 · <span className="text-[#93E07D] font-bold">#93E07D</span> lime highlight</td></tr>
                      <tr className="border-b border-gray-100"><td className="py-1.5 pr-3 text-gray-500">Body text</td><td className="py-1.5 font-mono text-[#232323]">Open Sans 400 · 16px · #383838</td></tr>
                      <tr><td className="py-1.5 pr-3 text-gray-500">Links</td><td className="py-1.5 font-mono text-[#232323]">Open Sans · <span className="text-[#93E07D]">#93E07D</span> Accent Lime</td></tr>
                    </tbody>
                  </table>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Light Background (white / #F9FAFB sections)</p>
                  <table className="w-full text-xs">
                    <tbody>
                      <tr className="border-b border-gray-100"><td className="py-1.5 pr-3 text-gray-500">H1 hero</td><td className="py-1.5 font-mono text-[#232323]">Archivo 800 · 4xl–5xl · #232323</td></tr>
                      <tr className="border-b border-gray-100"><td className="py-1.5 pr-3 text-gray-500">H2 section</td><td className="py-1.5 font-mono text-[#232323]">Archivo 800 · 3xl–4xl · #232323</td></tr>
                      <tr className="border-b border-gray-100"><td className="py-1.5 pr-3 text-gray-500">Heading accent</td><td className="py-1.5 font-mono text-[#232323]">Archivo 700 · <span className="text-[#3ba559]">#3ba559</span> on white bg</td></tr>
                      <tr className="border-b border-gray-100"><td className="py-1.5 pr-3 text-gray-500">Body text</td><td className="py-1.5 font-mono text-[#232323]">Open Sans 400 · 16px · #383838</td></tr>
                      <tr><td className="py-1.5 pr-3 text-gray-500">Links</td><td className="py-1.5 font-mono text-[#232323]">Open Sans · <span className="text-[#3ba559]">#3ba559</span> primary green</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <p className="text-xs text-gray-700 mt-3"><strong>Unified standard (all ERI surfaces):</strong> Archivo for headings · Open Sans for body text · #383838 for body copy · #3ba559 for links. Use lime <code className="bg-gray-100 px-1 rounded">#93E07D</code> for heading accents on dark/green backgrounds only; use <code className="bg-gray-100 px-1 rounded">#3ba559</code> on white backgrounds.</p>
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
            {verbalIdentity.toneOfVoice.map((item, i) => {
              const styles = [
                { bg: "linear-gradient(135deg, #3ba559 0%, #2c7a42 100%)", titleColor: "text-white", textColor: "text-white/90" },
                { bg: "linear-gradient(135deg, #2c2c2c 0%, #1a1a1a 100%)", titleColor: "text-[#93E07D]", textColor: "text-white/90" },
                { bg: "linear-gradient(135deg, #3ba559 0%, #2c7a42 100%)", titleColor: "text-white", textColor: "text-white/90" },
                { bg: "linear-gradient(135deg, #2c2c2c 0%, #1a1a1a 100%)", titleColor: "text-[#93E07D]", textColor: "text-white/90" },
              ];
              const s = styles[i % 4];
              return (
                <div key={item.trait} className="rounded-lg p-6" style={{ background: s.bg }}>
                  <h4 className={`font-archivo font-extrabold text-xl mb-3 ${s.titleColor}`}>{item.trait}</h4>
                  <p className={`text-sm leading-relaxed ${s.textColor}`}>{item.description}</p>
                </div>
              );
            })}
          </div>

          <h3 className="font-bold text-[#232323] mb-4 text-lg">Writing Principles</h3>
          <div className="grid md:grid-cols-2 gap-4 mb-12">
            {verbalIdentity.writingPrinciples.map((item) => (
              <Card key={item.principle} className="shadow-sm overflow-hidden">
                <div className="px-5 py-3 bg-[#3ba559]">
                  <h4 className="font-archivo font-extrabold text-white text-base">{item.principle}</h4>
                </div>
                <CardContent className="p-5">
                  <p className="text-sm text-gray-600 italic">{item.example}</p>
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
        {/* SECTION 14: PHOTOGRAPHY */}
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
                <div key={item.title} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                  <div className="px-5 py-3 bg-[#3ba559]">
                    <h4 className="font-archivo font-extrabold text-white text-base">{item.title}</h4>
                  </div>
                  <div className="p-5">
                    <p className="text-gray-600 text-sm leading-relaxed">{item.desc}</p>
                  </div>
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
                    { pillar: "1 — Cut Operational Emissions", color: "#9aa08c", tint: pillarTints.pillar1, category: "Industrial transformation", examples: "Factories, data centres, manufacturing lines, solar farms", terms: "aerial solar farm, industrial manufacturing overhead, data centre" },
                    { pillar: "2 — Decarbonize Value Chain", color: "#17b7dd", tint: pillarTints.pillar2, category: "Supply chain & logistics", examples: "Ports, shipping containers, warehouses, agricultural fields", terms: "aerial shipping port, cargo containers, supply chain logistics" },
                    { pillar: "3 — Build & Scale Solutions", color: "#00ac58", tint: pillarTints.pillar3, category: "Technology & innovation", examples: "Wind turbine engineers, EV charging, solar installation", terms: "wind turbine engineer, electric vehicle charging, clean technology worker" },
                    { pillar: "4 — Mobilize Finance & Investment", color: "#ff8b00", tint: pillarTints.pillar4, category: "Urban infrastructure & capital", examples: "City skylines, financial districts, construction sites", terms: "aerial city financial district, urban construction aerial, smart city" },
                    { pillar: "5 — Shape Policy & Narrative", color: "#ff5133", tint: pillarTints.pillar5, category: "People & governance", examples: "Cyclists, public transport, civic infrastructure", terms: "cyclists city commuting, public transport tram, urban planning aerial" },
                  ].map((row) => (
                    <tr key={row.pillar} className="border-b border-gray-100">
                      <td className="px-4 py-3">
                        <span
                          className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md text-xs font-semibold"
                          style={{ backgroundColor: row.tint, color: row.color }}
                        >
                          <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: row.color }} />
                          {row.pillar}
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
                  example: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=800&q=80",
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
                      src.type === 'Licensed' ? 'bg-blue-100 text-gray-700' :
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
        {/* SECTION: BRAND GRAPHICS & ILLUSTRATIONS */}
        {/* ================================================================ */}
        <section id="brand-graphics" className="mb-16">
          <h2 className="font-archivo text-2xl md:text-3xl font-extrabold text-[#232323] mb-4">
            Brand Graphics &amp; Illustrations
          </h2>
          <p className="text-gray-600 mb-8 max-w-3xl">
            Designed visual assets that represent ERI concepts and are approved for use across web applications,
            reports, presentations, and social media. These are distinct from photography — they are purpose-built
            illustrations and graphic compositions that carry specific conceptual meaning.
          </p>

          {/* Hands Touching Hero — PRIMARY */}
          <div className="mb-12">
            <h3 className="font-archivo text-lg font-bold text-[#232323] mb-2">Human-AI Lab Hero — Hands Touching (Primary)</h3>
            <p className="text-gray-600 mb-6 max-w-3xl text-sm">
              The primary hero background for the Human-AI Lab and any human + AI collaboration narrative. Two translucent
              wireframe hands reach toward each other across the S-curve crossing point, fingertips meeting in a golden
              burst of light — a Michelangelo-inspired composition set against a deep teal grid. The crossing point of
              the S-curves is the visual focal point: the moment of connection between human and AI.
            </p>

            {/* Live preview */}
            <div className="rounded-xl overflow-hidden mb-6 border border-gray-200" style={{maxWidth: 900}}>
              <div
                className="relative w-full"
                style={{
                  backgroundImage: `url(${heroImages.halHandsTouching})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  aspectRatio: '16/9',
                }}
              >
                <div className="absolute inset-0" style={{background: 'rgba(35,35,35,0.82)'}} />
                <div className="absolute inset-0 flex flex-col justify-center px-12 py-10">
                  <p className="text-xs font-semibold tracking-widest text-gray-400 uppercase mb-3">EXPONENTIAL ROADMAP INITIATIVE — EXAMPLE</p>
                  <h1 className="font-archivo font-extrabold text-white text-4xl md:text-5xl leading-tight mb-4">
                    <span className="text-[#93E07D]">Exponential</span><br />Human-AI Lab
                  </h1>
                  <p className="text-gray-300 text-base max-w-md mb-6">
                    One place for everything ERI builds at the intersection of human expertise and AI.
                  </p>
                  <div>
                    <button className="bg-[#3ba559] text-white font-semibold px-6 py-2.5 rounded text-sm">Explore the Application Suite →</button>
                  </div>
                </div>
              </div>
            </div>

            {/* Asset details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-white border border-gray-200 rounded-xl p-5">
                <h4 className="font-archivo font-bold text-[#232323] text-sm mb-3">Asset Details</h4>
                <table className="w-full text-sm">
                  <tbody>
                    <tr className="border-b border-gray-100"><td className="py-1.5 text-gray-500 pr-4">File name</td><td className="py-1.5 font-mono text-[#232323] text-xs">hal-hero-human-v2-hands.png</td></tr>
                    <tr className="border-b border-gray-100"><td className="py-1.5 text-gray-500 pr-4">Dimensions</td><td className="py-1.5 text-[#232323]">1456 × 816 px</td></tr>
                    <tr className="border-b border-gray-100"><td className="py-1.5 text-gray-500 pr-4">Format</td><td className="py-1.5 text-[#232323]">PNG</td></tr>
                    <tr className="border-b border-gray-100"><td className="py-1.5 text-gray-500 pr-4">Aspect ratio</td><td className="py-1.5 text-[#232323]">16:9</td></tr>
                    <tr className="border-b border-gray-100"><td className="py-1.5 text-gray-500 pr-4">Colours</td><td className="py-1.5 text-[#232323]">Amber curve · Accent Lime curve · Dark teal grid · Wireframe hands</td></tr>
                    <tr><td className="py-1.5 text-gray-500 pr-4">CDN token</td><td className="py-1.5 font-mono text-[#3ba559] text-xs break-all">heroImages.halHandsTouching</td></tr>
                  </tbody>
                </table>
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <a
                    href={heroImages.halHandsTouching}
                    download="hal-hero-human-v2-hands.png"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-[#3ba559] hover:bg-[#2e8a47] text-white text-sm font-semibold px-4 py-2 rounded transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                    Download PNG (1456 × 816)
                  </a>
                </div>
              </div>
              <div className="bg-white border border-gray-200 rounded-xl p-5">
                <h4 className="font-archivo font-bold text-[#232323] text-sm mb-3">Usage Rules</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex gap-2"><span className="text-[#3ba559] font-bold shrink-0">✓</span><span>Always use full-bleed — the image must fill the entire hero section width.</span></li>
                  <li className="flex gap-2"><span className="text-[#3ba559] font-bold shrink-0">✓</span><span>Always apply a <code className="bg-gray-100 px-1 rounded text-xs">#232323</code> overlay at 80–85% opacity over the image before placing text.</span></li>
                  <li className="flex gap-2"><span className="text-[#3ba559] font-bold shrink-0">✓</span><span>Use white Archivo for the main heading; Accent Lime <code className="bg-gray-100 px-1 rounded text-xs">#93E07D</code> for the accent word.</span></li>
                  <li className="flex gap-2"><span className="text-red-500 font-bold shrink-0">✗</span><span>Do not crop, rotate, or alter the image in any way.</span></li>
                  <li className="flex gap-2"><span className="text-red-500 font-bold shrink-0">✗</span><span>Do not use on light backgrounds without the dark overlay.</span></li>
                  <li className="flex gap-2"><span className="text-red-500 font-bold shrink-0">✗</span><span>Do not use as a decorative element in body content — hero sections only.</span></li>
                </ul>
              </div>
            </div>

            {/* Conceptual meaning */}
            <div className="bg-[#f0f7f2] border border-[#c8e6d0] rounded-xl p-5 max-w-3xl mb-6">
              <h4 className="font-archivo font-bold text-[#232323] text-sm mb-2">Conceptual Meaning</h4>
              <p className="text-sm text-gray-700">
                The two S-curves crossing represent the central ERI insight: legacy fossil-fuel systems are on a
                declining S-curve while clean-technology systems are on a rising S-curve. The crossing point is
                the transition moment — the moment of connection between human and AI. The amber curve represents
                the old economy; the lime curve represents the new. The wireframe hands reaching toward each other
                evoke the Michelangelo “Creation of Adam” — a universal symbol of the spark of intelligence passing
                between two entities. This image should only be used in contexts where this meaning is relevant —
                it is not a generic technology background.
              </p>
            </div>

            {/* Alternate versions */}
            <div className="max-w-3xl">
              <h4 className="font-archivo font-bold text-[#232323] text-sm mb-3">Alternate Versions</h4>
              <p className="text-xs text-gray-500 mb-4">Three alternate hero compositions share the same S-curve structure and are documented in full in the <a href="#surface-modes" className="text-[#3ba559] underline hover:text-[#2e8a47]">Surface Modes</a> section.</p>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { url: heroImages.halHumanNetwork, label: "Human Network",     badge: "Alternate", anchor: "#halHumanNetwork" },
                  { url: heroImages.halMFReaching,    label: "Reaching Duo",      badge: "Alternate", anchor: "#halMFReaching" },
                  { url: heroImages.halSCurveDual,    label: "Dual S-Curve",      badge: "Minimal",   anchor: "#halSCurveDual" },
                ].map((alt) => (
                  <a
                    key={alt.anchor}
                    href={alt.anchor}
                    className="group block rounded-lg overflow-hidden border border-gray-200 hover:border-[#3ba559] transition-colors"
                    onClick={(e) => {
                      e.preventDefault();
                      document.querySelector('#surface-modes')?.scrollIntoView({ behavior: 'smooth' });
                      setTimeout(() => document.querySelector(`[data-hero-id="${alt.anchor.slice(1)}"]`)?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 400);
                    }}
                  >
                    <div className="relative">
                      <img src={alt.url} alt={alt.label} className="w-full h-20 object-cover" />
                      <span className="absolute top-1.5 left-1.5 bg-black/60 text-white text-[10px] font-semibold px-1.5 py-0.5 rounded">{alt.badge}</span>
                    </div>
                    <div className="px-2.5 py-2 bg-white">
                      <p className="text-xs font-semibold text-[#232323] group-hover:text-[#3ba559] transition-colors">{alt.label} →</p>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </section>
        {/* ================================================================ */}
        {/* SECTION 15: TESTIMONIALS */}
        {/* ================================================================ */}
        <section id="testimonials" className="mb-16">
          <h2 className="font-archivo text-2xl md:text-3xl font-extrabold text-[#232323] mb-4">
            Testimonials &amp; Pull-Quotes
          </h2>
          <p className="text-gray-600 mb-8 max-w-3xl">
            Testimonials appear on ERI web applications and in reports to convey third-party credibility. The layout
            pairs a rounded-rectangle portrait with a left-aligned block-quote and a bold attribution line. Heading copy uses the
            standard ERI accent-word treatment: one or two key words set in Primary Green on a light background.
          </p>

          {/* Anatomy overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Card className="shadow-sm">
              <CardContent className="p-6">
                <h3 className="font-archivo font-bold text-sm uppercase tracking-wider text-[#232323] mb-4">Layout Anatomy</h3>
                <ul className="space-y-3 text-sm text-gray-600">
                  <li className="flex gap-3">
                    <span className="w-5 h-5 rounded-full bg-[#3ba559] text-white text-xs flex items-center justify-center flex-shrink-0 mt-0.5">1</span>
                    <span><strong>Section heading</strong> — Archivo 700–800, left-aligned. One or two key words use Primary Green <code className="text-xs bg-gray-100 px-1 rounded">#3ba559</code> (or Accent Lime <code className="text-xs bg-gray-100 px-1 rounded">#93E07D</code> on dark backgrounds). Use either black or green — do not mix both in the same heading.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="w-5 h-5 rounded-full bg-[#3ba559] text-white text-xs flex items-center justify-center flex-shrink-0 mt-0.5">2</span>
                    <span><strong>Portrait</strong> — rounded-rectangle crop (<code className="text-xs bg-gray-100 px-1 rounded">border-radius: 8px</code>), 120–160 px wide. No border or drop-shadow. Sits to the left of the quote block. The ERI brand does not use circular elements.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="w-5 h-5 rounded-full bg-[#3ba559] text-white text-xs flex items-center justify-center flex-shrink-0 mt-0.5">3</span>
                    <span><strong>Quote body</strong> — Open Sans 400, 15–17 px, <code className="text-xs bg-gray-100 px-1 rounded">text-align: left</code>. No typeset quotation marks. Colour: Dark Gray <code className="text-xs bg-gray-100 px-1 rounded">#383838</code>. Justified alignment creates uneven spacing — left-align is the ERI standard.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="w-5 h-5 rounded-full bg-[#3ba559] text-white text-xs flex items-center justify-center flex-shrink-0 mt-0.5">4</span>
                    <span><strong>Attribution line</strong> — <strong>Bold name</strong> in Open Sans 700, comma, then role and organisation in Open Sans 400. Colour: <code className="text-xs bg-gray-100 px-1 rounded">#232323</code>.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="w-5 h-5 rounded-full bg-[#3ba559] text-white text-xs flex items-center justify-center flex-shrink-0 mt-0.5">5</span>
                    <span><strong>Background</strong> — light grey <code className="text-xs bg-gray-100 px-1 rounded">#F9FAFB</code> or white. Never a coloured or gradient background behind testimonials.</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="shadow-sm">
              <CardContent className="p-6">
                <h3 className="font-archivo font-bold text-sm uppercase tracking-wider text-[#232323] mb-4">Typography &amp; Spacing</h3>
                <div className="font-mono text-xs space-y-2 text-gray-600">
                  <div className="grid grid-cols-2 gap-x-4 border-b border-gray-100 pb-2">
                    <span className="text-gray-400">Section heading</span>
                    <span>Archivo 700–800 · left-aligned</span>
                  </div>
                  <div className="grid grid-cols-2 gap-x-4 border-b border-gray-100 pb-2">
                    <span className="text-gray-400">Accent word(s)</span>
                    <span>#3ba559 (light bg) / #93E07D (dark bg)</span>
                  </div>
                  <div className="grid grid-cols-2 gap-x-4 border-b border-gray-100 pb-2">
                    <span className="text-gray-400">Portrait size</span>
                    <span>120–160 px · rounded-rect (border-radius: 8px)</span>
                  </div>
                  <div className="grid grid-cols-2 gap-x-4 border-b border-gray-100 pb-2">
                    <span className="text-gray-400">Quote body</span>
                    <span>Open Sans 400 · 15–17 px · left-aligned</span>
                  </div>
                  <div className="grid grid-cols-2 gap-x-4 border-b border-gray-100 pb-2">
                    <span className="text-gray-400">Attribution name</span>
                    <span>Open Sans 700 · #232323</span>
                  </div>
                  <div className="grid grid-cols-2 gap-x-4 border-b border-gray-100 pb-2">
                    <span className="text-gray-400">Attribution role</span>
                    <span>Open Sans 400 · #232323</span>
                  </div>
                  <div className="grid grid-cols-2 gap-x-4">
                    <span className="text-gray-400">Background</span>
                    <span>#F9FAFB or #FFFFFF</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Live example */}
          <h3 className="font-archivo font-bold text-base text-[#232323] mb-4">Live Example</h3>
          <div className="bg-[#F9FAFB] rounded-xl p-8 md:p-12 mb-6">
            <h2
              className="font-archivo text-2xl md:text-3xl font-extrabold text-[#3ba559] mb-10"
              style={{ letterSpacing: "-0.01em" }}
            >
              What others say about us
            </h2>

            <div className="flex flex-col sm:flex-row items-start gap-8 max-w-3xl">
              <div className="flex-shrink-0">
                <div
                  className="overflow-hidden bg-gray-200"
                  style={{ width: 140, height: 160, borderRadius: 8 }}
                >
                  <img
                    src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=280&h=320&fit=crop&crop=face"
                    alt="Portrait placeholder"
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                </div>
              </div>

              <div className="flex-1">
                <p
                  style={{
                    fontFamily: "'Open Sans', sans-serif",
                    fontSize: 15,
                    lineHeight: 1.75,
                    textAlign: "left",
                    color: "#383838",
                    marginBottom: 16,
                  }}
                >
                  No company can achieve net zero alone. Accelerating decarbonisation requires collaboration and
                  Exponential Roadmap Initiative has been a great partner and thought leader — helping us to think
                  through our strategies and co-hosted Solutions House with Futerra at Climate Week NYC, facilitating
                  great conversations around climate solutions, the challenges of Scope 3, advanced clean energy
                  technologies and more.
                </p>
                <p style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 15, color: "#232323" }}>
                  <strong>Kate Brandt</strong>, Chief Sustainability Officer, Google
                </p>
              </div>
            </div>
          </div>

          {/* Do / Don't */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <Card className="shadow-sm border-l-4 border-[#3ba559]">
              <CardContent className="p-5">
                <p className="font-archivo font-bold text-xs uppercase tracking-wider text-[#3ba559] mb-3">&#10003; Do</p>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>Use a rounded-rectangle portrait crop (border-radius: 8px) — the ERI brand does not use circular elements.</li>
                  <li>Left-align the quote body text.</li>
                  <li>Bold the speaker's name; use regular weight for role and organisation.</li>
                  <li>Use Primary Green for the accent word(s) in the heading on light backgrounds.</li>
                  <li>Keep the background white or light grey — no coloured panels.</li>
                  <li>Use real photography — no illustrations or icons as the portrait.</li>
                </ul>
              </CardContent>
            </Card>
            <Card className="shadow-sm border-l-4 border-red-400">
              <CardContent className="p-5">
                <p className="font-archivo font-bold text-xs uppercase tracking-wider text-red-500 mb-3">&#10007; Don't</p>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>Don't add decorative quotation mark glyphs (" ") — the layout implies the quote.</li>
                  <li>Don't use a coloured or gradient background behind the testimonial block.</li>
                  <li>Don't justify the quote body text — justified alignment creates uneven word spacing. Left-align is the ERI standard.</li>
                  <li>Don't omit the attribution — an unattributed quote cannot be published.</li>
                  <li>Don't use Accent Lime on a white background for body text — only for heading accent words on dark backgrounds.</li>
                  <li>Don't place the portrait below or to the right of the quote.</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Multiple testimonials note */}
          <Card className="shadow-sm bg-gray-50 border-gray-200">
            <CardContent className="p-4">
              <p className="text-sm text-gray-700">
                <strong>Multiple testimonials:</strong> When displaying more than one testimonial, stack them vertically
                with 40–48 px gap between entries. Do not use a carousel or slider — all testimonials should be
                visible without interaction. Each entry follows the same portrait-left / quote-right layout.
              </p>
            </CardContent>
          </Card>
        </section>
        {/* ================================================================ */}
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
              { num: 1, name: "Cut Operational Emissions",     shortName: "Operations", color: "#9aa08c", tint: pillarTints.pillar1, colorName: "Gray-Green", img: pillarBottomIcons.pillar1 },
              { num: 2, name: "Decarbonize Value Chain",       shortName: "Value Chain", color: "#17b7dd", tint: pillarTints.pillar2, colorName: "Cyan",       img: pillarBottomIcons.pillar2 },
              { num: 3, name: "Build & Scale Solutions",       shortName: "Solutions",   color: "#00ac58", tint: pillarTints.pillar3, colorName: "ERI Green",  img: pillarBottomIcons.pillar3 },
              { num: 4, name: "Mobilize Finance & Investment", shortName: "Finance",     color: "#ff8b00", tint: pillarTints.pillar4, colorName: "Orange",     img: pillarBottomIcons.pillar4 },
              { num: 5, name: "Shape Policy & Narrative",      shortName: "Policy",      color: "#ff5133", tint: pillarTints.pillar5, colorName: "Red",        img: pillarBottomIcons.pillar5 },
            ].map((p) => (
              <Card key={p.num} className="shadow-sm overflow-hidden">
                {/* Tint background — icon sits on light tint, matching the icon treatment in the screenshot */}
                <div className="flex items-center justify-center p-4" style={{ backgroundColor: p.tint }}>
                  <img src={p.img} alt={`Pillar ${p.num} icon`} className="w-20 h-20 object-contain" />
                </div>
                <CardContent className="p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="inline-block w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: p.color }} />
                    <span className="text-xs font-semibold" style={{ color: p.color }}>Pillar {p.num}</span>
                  </div>
                  <p className="text-xs text-gray-600 leading-snug mb-2">{p.name}</p>
                  <code className="text-[10px] font-mono text-gray-400 block">pillar-{p.num}-icon.webp</code>
                  <div className="mt-2 flex items-center gap-1.5">
                    <span className="inline-block w-4 h-4 rounded flex-shrink-0" style={{ backgroundColor: p.tint, border: `2px solid ${p.color}` }} />
                    <code className="text-[10px] font-mono" style={{ color: p.color }}>{p.color}</code>
                  </div>
                </CardContent>
              </Card>
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
              { key: "fivePillarsBg",          label: "BG",                   desc: "Background only (no logo/text)",         file: "framework-5pillars-bg.webp" },
              { key: "fivePillarsBgLogo",       label: "BG + Logo",             desc: "With ERI wordmark",                      file: "framework-5pillars-bg-logo.webp" },
              { key: "fivePillarsBgLogoTitle",  label: "BG + Logo + Title",     desc: "With wordmark and title text",           file: "framework-5pillars-bg-logo-title.webp" },
              { key: "fivePillarsExtended",     label: "Extended",              desc: "With action blocks around pillars",      file: "framework-5pillars-extended.webp" },
              { key: "fivePillarsTransparent",  label: "Transparent",           desc: "No background — for dark slides",        file: "framework-5pillars-transparent.webp" },
              { key: "fivePillarsShortText",    label: "Short Text (Transp)",   desc: "Pillar names only, transparent",         file: "framework-5pillars-short-text.webp" },
              { key: "fivePillarsSymbols",      label: "Symbols (Transp)",      desc: "Icons only, transparent",                file: "framework-5pillars-symbols-transparent.webp" },
              { key: "fivePillarsText",         label: "Text (Transp)",         desc: "Full text labels, transparent",          file: "framework-5pillars-text-transparent.webp" },
            ].map(({ key, label, desc, file }) => (
              <div key={key} className="flex flex-col gap-2">
                <div className="bg-gray-50 rounded-lg p-3 flex items-center justify-center" style={{minHeight: 160}}>
                  <img src={frameworkV5[key as keyof typeof frameworkV5]} alt={label} className="max-h-36 w-auto object-contain" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-[#232323]">{label}</p>
                  <p className="text-[11px] text-gray-500">{desc}</p>
                  <code className="text-[10px] font-mono text-gray-400 block mt-1">{file}</code>
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
              { key: "leadershipA",     label: "Leadership A",         desc: "Leadership categories diagram (variant A)", file: "framework-leadership-a.webp" },
              { key: "leadershipB",     label: "Leadership B",         desc: "Leadership categories diagram (variant B)", file: "framework-leadership-b.webp" },
              { key: "pillarsLinear",   label: "Pillars Linear",       desc: "Five pillars in horizontal linear layout",  file: "framework-pillars-linear.webp" },
              { key: "reducingEnabling",label: "Reducing / Enabling",  desc: "Reducing vs. enabling emissions framework",  file: "framework-reducing-enabling.webp" },
            ].map(({ key, label, desc, file }) => (
              <div key={key} className="flex flex-col gap-2">
                <div className="bg-gray-50 rounded-lg p-3 flex items-center justify-center" style={{minHeight: 140}}>
                  <img src={frameworkV5[key as keyof typeof frameworkV5]} alt={label} className="max-h-32 w-auto object-contain" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-[#232323]">{label}</p>
                  <p className="text-[11px] text-gray-500">{desc}</p>
                  <code className="text-[10px] font-mono text-gray-400 block mt-1">{file}</code>
                </div>
              </div>
            ))}
          </div>
          </div>{/* end framework-diagrams sub-div */}

          {/* ── SUB-SECTION: PILLAR ELEMENTS ── */}
          <div id="pillar-elements" className="pt-4">
          <div className="flex items-center gap-3 mb-3 border-b border-gray-200 pb-2 mt-6">
            <h3 className="font-archivo font-bold text-[#232323] text-xl">Pillar Elements</h3>
            <Badge className="bg-[#3ba559] text-white text-[10px] tracking-widest uppercase hover:bg-[#3ba559]">v5 New</Badge>
          </div>
          <p className="text-gray-600 mb-2 max-w-3xl text-sm">
            The pillar element is a vertical graphic unit that anchors each pillar in presentations, reports, and digital interfaces.
            It always appears on the <strong>left side</strong> of a slide or frame. Four variants exist — choose based on available space and content depth.
            All assets are available in solid (white background) and transparent versions.
          </p>
          <p className="text-gray-500 text-sm mb-8 max-w-3xl">
            Source: <em>ERI Styleguide 1.0 — Framework Integration (pp. 13–18)</em>.
          </p>

          {/* Long */}
          <h4 className="font-bold text-[#232323] text-base mb-1 mt-6">Long Pillar <span className="text-xs font-normal text-gray-500 ml-2">(Primary)</span></h4>
          <p className="text-sm text-gray-600 mb-4 max-w-3xl">The primary integration element for company presentations. Placed on the left side of the frame. Use <code className="bg-gray-100 px-1 rounded text-xs">x</code> (width of the "E" in EXPONENTIAL) as minimum clear space from pillar to frame edge.</p>
          <div className="grid grid-cols-5 gap-4 mb-3">
            {([1,2,3,4,5] as const).map(n => {
              const tintKey = `pillar${n}` as keyof typeof pillarTints;
              return (
              <div key={n} className="flex flex-col items-center gap-2">
                <div className="rounded-lg p-2 w-full flex items-center justify-center" style={{minHeight: 200, backgroundColor: pillarTints[tintKey]}}>
                  <img src={pillarsLong[n].solid} alt={`Pillar ${n} Long`} className="max-h-48 w-auto object-contain" />
                </div>
                <span className="text-xs font-semibold text-gray-600">Pillar {n}</span>
                <code className="text-[10px] font-mono text-gray-400 text-center leading-tight">pillar-{n}-long-solid.webp</code>
              </div>
            )})}
          </div>
          <div className="grid grid-cols-5 gap-4 mb-10 bg-[#232323] rounded-xl p-4">
            {([1,2,3,4,5] as const).map(n => (
              <div key={n} className="flex flex-col items-center gap-2">
                <div className="rounded-lg p-2 w-full flex items-center justify-center" style={{minHeight: 160}}>
                          <img src={pillarsLong[n].transparent} alt={`Pillar ${n} Long Transparent`} className="max-h-48 w-auto object-contain" />
                </div>
                <span className="text-xs text-gray-400 font-medium">Pillar {n}</span>
                <code className="text-[10px] font-mono text-gray-500 text-center leading-tight">pillar-{n}-long-transparent.webp</code>
              </div>
            ))}
          </div>

          {/* Regular */}
          <h4 className="font-bold text-[#232323] text-base mb-1 mt-2">Regular Pillar</h4>
          <p className="text-sm text-gray-600 mb-4 max-w-3xl">Scaled-down version for data slides where more horizontal space is needed. Can be placed over images. Use <code className="bg-gray-100 px-1 rounded text-xs">3x</code> as the distance from pillar to frame edge.</p>
          <div className="grid grid-cols-5 gap-4 mb-10">
            {([1,2,3,4,5] as const).map(n => {
              const tintKey = `pillar${n}` as keyof typeof pillarTints;
              return (
              <div key={n} className="flex flex-col items-center gap-2">
                <div className="rounded-lg p-2 w-full flex items-center justify-center" style={{minHeight: 160, backgroundColor: pillarTints[tintKey]}}>
                  <img src={pillarsRegular[n].solid} alt={`Pillar ${n} Regular`} className="max-h-40 w-auto object-contain" />
                </div>
                <span className="text-xs text-gray-500 font-medium">Pillar {n}</span>
                <code className="text-[10px] font-mono text-gray-400 text-center leading-tight">pillar-{n}-regular-solid.webp</code>
              </div>
            )})}
          </div>

          {/* Extended */}
          <h4 className="font-bold text-[#232323] text-base mb-1 mt-2">Extended Pillar <span className="text-xs font-normal text-gray-500 ml-2">(with Action Blocks)</span></h4>
          <p className="text-sm text-gray-600 mb-4 max-w-3xl">The most detailed variant — pillar extended downward with labelled Action Blocks (e.g. "Supplier Engagement"). The pillar icon appears at the bottom of the stack. Use <code className="bg-gray-100 px-1 rounded text-xs">3x</code> as the distance from pillar to frame edge.</p>
          <div className="grid grid-cols-5 gap-4 mb-4">
            {([1,2,3,4,5] as const).map(n => {
              const tintKey = `pillar${n}` as keyof typeof pillarTints;
              return (
              <div key={n} className="flex flex-col items-center gap-2">
                <div className="rounded-lg p-2 w-full flex items-center justify-center" style={{minHeight: 240, backgroundColor: pillarTints[tintKey]}}>
                  <img src={pillarsExtended[n].solid} alt={`Pillar ${n} Extended`} className="max-h-56 w-auto object-contain" />
                </div>
                <span className="text-xs text-gray-500 font-medium">Pillar {n}</span>
                <code className="text-[10px] font-mono text-gray-400 text-center leading-tight">pillar-{n}-extended-solid.webp</code>
              </div>
            )})}
          </div>
          <div className="mb-10 bg-gray-50 rounded-lg p-4">
            <h5 className="font-bold text-[#232323] text-sm mb-2">Action Block Specification</h5>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
              <div><span className="text-gray-500">Background</span><br/><span className="font-mono font-bold">Pillar colour</span></div>
              <div><span className="text-gray-500">Text</span><br/><span className="font-mono font-bold">White, Archivo Bold</span></div>
              <div><span className="text-gray-500">Size</span><br/><span className="font-mono font-bold">~8pt / 11px</span></div>
              <div><span className="text-gray-500">Gap between blocks</span><br/><span className="font-mono font-bold">1px white</span></div>
            </div>
          </div>

          {/* Short */}
          <h4 className="font-bold text-[#232323] text-base mb-1 mt-2">Short Pillar <span className="text-xs font-normal text-gray-500 ml-2">(Symbol &amp; Text variants)</span></h4>
          <p className="text-sm text-gray-600 mb-4 max-w-3xl">Minimal variant — symbol only (icon mark) or text only (pillar number + name). Used where space is very limited or as a compact reference marker.</p>
          <div className="grid grid-cols-5 gap-6 mb-3">
            {([1,2,3,4,5] as const).map(n => {
              const tintKey = `pillar${n}` as keyof typeof pillarTints;
              return (
              <div key={n} className="flex flex-col gap-3">
                <div className="rounded-lg p-2 flex items-center justify-center" style={{minHeight: 80, backgroundColor: pillarTints[tintKey]}}>
                  <img src={pillarsShort[n].symbol} alt={`Pillar ${n} Symbol`} className="max-h-16 w-auto object-contain" />
                </div>
                <code className="text-[10px] font-mono text-gray-400 text-center leading-tight">pillar-{n}-symbol-solid.webp</code>
                <div className="rounded-lg p-2 flex items-center justify-center" style={{minHeight: 80, backgroundColor: pillarTints[tintKey]}}>
                  <img src={pillarsShort[n].text} alt={`Pillar ${n} Text`} className="max-h-16 w-auto object-contain" />
                </div>
                <code className="text-[10px] font-mono text-gray-400 text-center leading-tight">pillar-{n}-text-solid.webp</code>
                <span className="text-xs text-gray-500 font-medium text-center">Pillar {n}</span>
              </div>
            )})}
          </div>
          <p className="text-xs text-gray-400 mb-8">Top row: Symbol variant. Bottom row: Text variant. Transparent versions also available.</p>

          {/* Usage Rules */}
          <div className="grid md:grid-cols-2 gap-4">
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
            <Card className="shadow-sm border-l-4 border-l-[#ff5133]">
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
          </div>{/* end pillar-elements sub-div */}

        </section>{/* end exponential-framework section */}

        {/* ================================================================ */}
        {/* SECTION 13: CHARTS & DATA VISUALISATION */}
        {/* ================================================================ */}
        <section id="charts" className="mb-16">
          <h2 className="font-archivo text-2xl md:text-3xl font-extrabold text-[#232323] mb-4">
            Charts &amp; Data Visualisation
          </h2>
          <p className="text-gray-600 mb-8 max-w-3xl">
            ERI data visualisation follows a consistent visual language across publications, the Crocodile Economy whitepaper, and digital products.
            The chart style is minimal, editorial, and high-contrast — designed for print and screen alike.
          </p>

          {/* ── Crocodile Economy Chart Style ── */}
          <h3 className="font-bold text-[#232323] mb-3 text-lg">The Crocodile Economy Chart Style</h3>
          <p className="text-gray-600 mb-6 text-sm max-w-3xl">
            The Crocodile Economy charts show the decoupling of emissions from economic growth over time.
            Two lines form the "crocodile jaw" — the upper line (GDP or revenue growth) diverges upward from the lower line (CO₂ emissions).
            The fill colour between the lines encodes the <strong>entity type</strong>: green for companies, salmon for nations/regions.
            This is a semantic encoding — not a stylistic choice.
          </p>

          {/* Colour semantics */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <Card className="shadow-sm overflow-hidden">
              <CardContent className="p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded" style={{ backgroundColor: "#7DD87A" }} />
                  <div>
                    <p className="font-archivo font-bold text-[#232323] text-sm">Company / Corporate</p>
                    <code className="text-xs font-mono text-gray-500">#7DD87A</code>
                  </div>
                </div>
                <p className="text-xs text-gray-600">
                  Green fill between the GDP/revenue line and the CO₂ line. Used for all corporate entities (e.g. Astra Zeneca, Scania, Volvo).
                  Signals that the entity is a private-sector actor.
                </p>
              </CardContent>
            </Card>
            <Card className="shadow-sm overflow-hidden">
              <CardContent className="p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded" style={{ backgroundColor: "#F08070" }} />
                  <div>
                    <p className="font-archivo font-bold text-[#232323] text-sm">Nation / Region</p>
                    <code className="text-xs font-mono text-gray-500">#F08070</code>
                  </div>
                </div>
                <p className="text-xs text-gray-600">
                  Salmon/coral fill between the GDP line and the CO₂ line. Used for all national and supranational entities (e.g. European Union, Sweden, Australia).
                  Signals that the entity is a public-sector actor.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Line colours */}
          <h4 className="font-bold text-[#232323] mb-3 text-sm uppercase tracking-wider">Line Colours</h4>
          <div className="grid md:grid-cols-3 gap-4 mb-8">
            <Card className="shadow-sm">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="w-8 h-2 rounded-full" style={{ backgroundColor: "#00B4D8" }} />
                <div>
                  <p className="font-archivo font-semibold text-[#232323] text-sm">GDP / Revenue line</p>
                  <code className="text-xs font-mono text-gray-500">#00B4D8 — Cyan</code>
                  <p className="text-xs text-gray-500 mt-1">Upper trajectory. Represents economic growth (GDP for nations, revenue for companies).</p>
                </div>
              </CardContent>
            </Card>
            <Card className="shadow-sm">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="w-8 h-2 rounded-full bg-[#1A1A1A]" />
                <div>
                  <p className="font-archivo font-semibold text-[#232323] text-sm">CO₂ Emissions line</p>
                  <code className="text-xs font-mono text-gray-500">#1A1A1A — Near-black</code>
                  <p className="text-xs text-gray-500 mt-1">Lower trajectory. Represents territorial or Scope 1+2 CO₂ emissions over time.</p>
                </div>
              </CardContent>
            </Card>
            <Card className="shadow-sm">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="w-8 h-2 rounded-full bg-[#CCCCCC]" />
                <div>
                  <p className="font-archivo font-semibold text-[#232323] text-sm">Grid lines / Axes</p>
                  <code className="text-xs font-mono text-gray-500">#CCCCCC — Light grey</code>
                  <p className="text-xs text-gray-500 mt-1">Horizontal gridlines and axis ticks. Minimal — no border box around the chart.</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Live chart example */}
          <h4 className="font-bold text-[#232323] mb-3 text-sm uppercase tracking-wider">Live Examples</h4>
          <p className="text-gray-600 mb-4 text-sm">Interactive recreations of the Crocodile Economy chart style using ERI brand colours.</p>
          <CrocodileChartExamples />

          {/* Typography in charts */}
          <h4 className="font-bold text-[#232323] mb-3 text-sm uppercase tracking-wider mt-8">Chart Typography</h4>
          <div className="grid md:grid-cols-2 gap-4 mb-8">
            <Card className="shadow-sm">
              <CardContent className="p-4">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="text-left py-1 text-gray-400 font-normal">Element</th>
                      <th className="text-left py-1 text-gray-400 font-normal">Style</th>
                    </tr>
                  </thead>
                  <tbody className="font-mono text-gray-600">
                    <tr className="border-b border-gray-50"><td className="py-1.5">Chart title</td><td>Archivo 700 uppercase · #232323</td></tr>
                    <tr className="border-b border-gray-50"><td className="py-1.5">Axis labels</td><td>Open Sans 400 · #666666 · 11–12px</td></tr>
                    <tr className="border-b border-gray-50"><td className="py-1.5">Tick values</td><td>Open Sans 400 · #888888 · 10–11px</td></tr>
                    <tr className="border-b border-gray-50"><td className="py-1.5">Legend labels</td><td>Open Sans 400 · #444444 · 11px</td></tr>
                    <tr><td className="py-1.5">Data callouts</td><td>Archivo 600 · #232323 · 11px</td></tr>
                  </tbody>
                </table>
              </CardContent>
            </Card>
            <Card className="shadow-sm">
              <CardContent className="p-4">
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-3">Chart Anatomy Rules</p>
                <ul className="text-xs text-gray-600 space-y-2">
                  <li>• No border box around the chart area — only horizontal gridlines</li>
                  <li>• Y-axis on the left only; no right-side axis</li>
                  <li>• Zero line is slightly thicker (1.5px) than other gridlines (0.5px)</li>
                  <li>• X-axis shows year labels only — no tick marks</li>
                  <li>• Fill opacity: 0.7 (allows gridlines to show through)</li>
                  <li>• Line stroke width: 2px for both GDP and CO₂ lines</li>
                  <li>• Background: white #FFFFFF — no chart background colour</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Data sources note */}
          <Card className="shadow-sm border-l-4 border-[#3ba559]">
            <CardContent className="p-4">
              <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">Data Sources</p>
              <p className="text-sm text-gray-600">
                Country charts use <strong>World Bank GDP data</strong> and <strong>Global Carbon Budget CO₂ data</strong>.
                Company charts use <strong>Klimatkollen</strong> and <strong>ERI-compiled Scope 1+2 emissions</strong> with publicly reported revenue.
                Always cite the data source beneath the chart.
              </p>
            </CardContent>
          </Card>
        </section>
        {/* ================================================================ */}
        {/* SECTION 16: MEMBER COMPANY LOGOTYPES */}
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
        {/* SECTION 18: DATA SOURCE LOGOS */}
        {/* ================================================================ */}
        <section id="data-source-logos" className="mb-16">
          <h2 className="font-archivo text-2xl md:text-3xl font-extrabold text-[#232323] mb-2">
            Data Source &amp; Partner Logos
          </h2>
          <p className="text-gray-600 mb-2 max-w-3xl">
            Logos for data providers, research institutions, standards bodies, and partner organisations
            used across ERI products and publications. Use these when citing data sources or acknowledging
            partners in reports, dashboards, and presentations.
          </p>
          <p className="text-xs text-gray-400 mb-8 max-w-3xl">
            All logos remain the property of their respective organisations and are provided here for use
            within authorised ERI communications only.
          </p>

          {/* Category filter */}
          {(() => {
            const allCategories = Array.from(new Set(Object.values(dataSourceLogos).map(l => l.category))).sort();
            return (
              <DataSourceLogoGrid logos={dataSourceLogos} categories={allCategories} />
            );
          })()}
        </section>

        {/* ================================================================ */}
        {/* SECTION: NAVIGATION & LAYOUT STANDARDS */}
        {/* ================================================================ */}
        <section className="mb-16" id="navigation">
          <h2 className="font-archivo text-2xl md:text-3xl font-extrabold text-[#232323] mb-4">
            Navigation &amp; Layout Standards
          </h2>
          <p className="text-gray-600 mb-8 max-w-3xl font-open-sans">
            All ERI web applications follow one of two layout tiers. Choose the correct tier based on
            application type — not personal preference. Live interactive examples below demonstrate
            each pattern.
          </p>
          <NavigationPatterns />
        </section>
        {/* ================================================================ */}
        {/* ================================================================ */}
        {/* ── ZONE 2: WEB & APPLICATION DEVELOPMENT ─────────────────────── */}
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

          {/* Two header patterns callout */}
          <div className="grid md:grid-cols-2 gap-4 mb-8">
            <Card className="shadow-sm border-l-4 border-l-[#3ba559]">
              <CardContent className="p-5">
                <span className="text-[10px] font-semibold uppercase tracking-widest text-[#3ba559] mb-1 block">Pattern A</span>
                <h4 className="font-bold text-[#232323] mb-2">Web App Header</h4>
                <p className="text-sm text-gray-600">Used by all ERI web applications (PSM, Exponential Playbook, etc.). Sticky, 64px tall, white background with bottom border. Left: logo + divider + title block. Right: BETA badge + version + status dot + hamburger.</p>
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
                  <div className="flex gap-2"><span className="text-[#3ba559] font-bold shrink-0">3.</span><span>App title — <code className="font-mono text-xs bg-gray-100 px-1 rounded">text-[18px] font-semibold text-[#384151] truncate</code><br/><em className="text-gray-400">e.g. "Professional Services Matrix"</em></span></div>
                </div>
              </CardContent>
            </Card>
            <Card className="shadow-sm">
              <CardContent className="p-5">
                <h4 className="font-bold text-[#232323] mb-3">Right Zone — Status + Menu</h4>
                <div className="space-y-3 text-sm text-gray-600">
                  <div className="flex gap-2"><span className="text-[#3ba559] font-bold shrink-0">1.</span><span>BETA badge — outlined pill: <code className="font-mono text-xs bg-gray-100 px-1 rounded">border border-gray-400 text-[11px] font-medium text-gray-600 rounded-full px-2 py-0.5 tracking-wide</code></span></div>
                  <div className="flex gap-2"><span className="text-[#3ba559] font-bold shrink-0">2.</span><span>Version string — <code className="font-mono text-xs bg-gray-100 px-1 rounded">text-[11px] font-medium text-gray-500 tracking-wide</code><br/><em className="text-gray-400">Format: V.YYYY.MM.DD — e.g. "V.2026.04.12"</em></span></div>
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
                        <span className="text-[18px] font-semibold text-[#384151] truncate">Brand Design System</span>
                      </div>
                      {/* Right */}
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full border border-gray-400 text-[11px] font-medium text-gray-600 tracking-wide">BETA</span>
                        <span className="text-[11px] font-medium text-gray-500 tracking-wide">V.2026.04.12</span>
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
                        <span className="text-[18px] font-semibold text-gray-300 truncate">Brand Design System</span>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full border border-gray-500 text-[11px] font-medium text-gray-400 tracking-wide">BETA</span>
                        <span className="text-[11px] font-medium text-gray-400 tracking-wide">V.2026.04.12</span>
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
          <p className="text-gray-600 mb-4 text-sm">Dark charcoal background (<code className="font-mono text-xs bg-gray-100 px-1 rounded">bg-[#232323]</code>). <code className="font-mono text-xs bg-gray-100 px-1 rounded">py-12</code> padding. Three-column grid on desktop. Accent link colour: brand green-300 (<code className="font-mono text-xs bg-gray-100 px-1 rounded">#93cda3</code>).</p>
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
                  { label: "Medium",   cls: "bg-[#17b7dd]/10 text-[#17b7dd] border-[#17b7dd]/30" },
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
                  { label: "Efficiency", cls: "bg-[#17b7dd]/10 text-[#17b7dd]" },
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

          {/* ── Marketing CTA Button ── */}
          <h3 className="font-bold text-[#232323] mb-3 text-lg mt-10">3. Marketing CTA Button</h3>
          <p className="text-gray-600 mb-4 text-sm">
            The canonical call-to-action button for <strong>marketing surfaces and landing pages</strong>. Pill-shaped, Accent Lime background, dark text. Use this style for prominent standalone CTAs on content-rich pages. For web application UI (inline actions, form submissions, data operations), use the standard rounded button with Primary Green.
          </p>
          <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm mb-3">
            <div className="p-6 bg-white flex flex-wrap gap-4 items-center">
              {["Our members and partners", "Read more about our impact", "Sign up to our newsletter"].map(label => (
                <a
                  key={label}
                  href="#"
                  className="inline-block px-6 py-3 rounded-full font-archivo font-semibold text-base text-[#242424] no-underline transition-opacity hover:opacity-90"
                  style={{ backgroundColor: "#93E07D" }}
                  onClick={e => e.preventDefault()}
                >
                  {label}
                </a>
              ))}
            </div>
            <div className="bg-gray-50 px-4 py-2 text-xs text-gray-500 font-mono">bg-[#93E07D] · text-[#242424] · rounded-full · font-archivo font-semibold · text-base · px-6 py-3</div>
          </div>
          <Card className="shadow-sm bg-gray-900 mb-10">
            <CardContent className="p-5">
              <pre className="text-sm text-gray-300 overflow-x-auto whitespace-pre-wrap">{`<a
  href="/members"
  className="inline-block px-6 py-3 rounded-full font-archivo font-semibold text-base text-[#242424]"
  style={{ backgroundColor: "#93E07D" }}
>
  Our members and partners
</a>`}</pre>
            </CardContent>
          </Card>



          {/* ── Footer ── */}
          <h3 className="font-bold text-[#232323] mb-3 text-lg mt-10">5. Footer</h3>
          <p className="text-gray-600 mb-4 text-sm">
            The standard ERI dark footer. Four columns: <strong>About</strong> (nav links), <strong>Newsletter</strong> (subscribe CTA), <strong>Follow us</strong> (social links as text), <strong>Contact us</strong> (email). Column headings: Archivo weight 500, 18px, white. All links in Accent Lime <code className="font-mono text-xs bg-gray-100 px-1 rounded">#93E07D</code>, Open Sans 14px. Bottom bar: Open Sans 16px, white/40.
          </p>
          <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm mb-6">
            <div className="bg-[#232323] px-6 py-8">
              <div className="grid grid-cols-4 gap-6 mb-6">
                {/* Column 1: About */}
                <div>
                  <h4 className="font-archivo text-white mb-4" style={{ fontWeight: 500, fontSize: '18px' }}>About</h4>
                  <div className="flex flex-col gap-2">
                    {["Members and partners", "Privacy policy"].map(link => (
                      <a key={link} href="#" className="text-[#93E07D] hover:underline" onClick={e => e.preventDefault()} style={{ fontFamily: "'Open Sans', sans-serif", fontSize: '14px', fontWeight: 400 }}>{link}</a>
                    ))}
                  </div>
                </div>
                {/* Column 2: Newsletter */}
                <div>
                  <h4 className="font-archivo text-white mb-4" style={{ fontWeight: 500, fontSize: '18px' }}>Newsletter</h4>
                  <p className="text-white/70 mb-4" style={{ fontFamily: "'Open Sans', sans-serif", fontSize: '14px' }}>Stay up to date with our latest news and resources.</p>
                  <a href="#" className="inline-block px-4 py-2 font-semibold text-white border border-white rounded-full hover:bg-white hover:text-[#232323] transition-colors" onClick={e => e.preventDefault()} style={{ fontFamily: "'Open Sans', sans-serif", fontSize: '15px', fontWeight: 500 }}>Subscribe now</a>
                </div>
                {/* Column 3: Follow us — text links, not icon squares */}
                <div>
                  <h4 className="font-archivo text-white mb-4" style={{ fontWeight: 500, fontSize: '18px' }}>Follow us</h4>
                  <div className="flex flex-col gap-2">
                    {["Follow on LinkedIn", "Follow on X", "Follow on YouTube"].map(link => (
                      <a key={link} href="#" className="text-[#93E07D] hover:underline" onClick={e => e.preventDefault()} style={{ fontFamily: "'Open Sans', sans-serif", fontSize: '14px', fontWeight: 500 }}>{link}</a>
                    ))}
                  </div>
                </div>
                {/* Column 4: Contact us */}
                <div>
                  <h4 className="font-archivo text-white mb-4" style={{ fontWeight: 500, fontSize: '18px' }}>Contact us</h4>
                  <a href="mailto:hello@exponentialroadmap.org" className="text-[#93E07D]" style={{ fontFamily: "'Open Sans', sans-serif", fontSize: '14.4px', fontWeight: 400 }}>hello@exponentialroadmap.org</a>
                </div>
              </div>
              <div className="border-t border-white/10 pt-4 flex items-center justify-between">
                <span className="text-white/40" style={{ fontFamily: "'Open Sans', sans-serif", fontSize: '16px' }}>© Exponential Roadmap Initiative</span>
                <a href="#" className="text-white/40 hover:text-[#93E07D]" style={{ fontFamily: "'Open Sans', sans-serif", fontSize: '16px' }} onClick={e => e.preventDefault()}>Privacy policy</a>
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-2 text-xs text-gray-500 font-mono">bg-[#232323] · 4 cols: About · Newsletter · Follow us · Contact us · headings: Archivo weight-500 18px white · body/links: Open Sans 14px text-[#93E07D] · newsletter btn: Open Sans 15px weight-500 white ghost rounded-full · social: text links not icon squares · bottom bar: Open Sans 16px text-white/40</div>
          </div>
        </section>



        {/* ================================================================ */}
        {/* SECTION 18: SURFACE MODES */}
        {/* ================================================================ */}
        <section id="surface-modes" className="mb-16">
          <h2 className="font-archivo text-2xl md:text-3xl font-extrabold text-[#232323] mb-4">
            Surface Modes
          </h2>
          <p className="text-gray-600 mb-8 max-w-3xl">
            ERI products use two named surface modes — <strong>Light</strong> and <strong>Dark</strong>. These are not competing themes; they are two contexts within the same brand. Light mode is the default for application interiors. Dark mode is used for marketing landing pages and hero sections.
          </p>

          {/* Mode comparison table */}
          <div className="grid md:grid-cols-2 gap-6 mb-10">
            {[
              {
                mode: "Light Mode",
                badge: "Default",
                badgeColor: "bg-[#3ba559] text-white",
                bg: "bg-white border border-gray-200",
                tokens: [
                  { name: "Page background", value: "#F9FAFB", swatch: "#F9FAFB", border: true },
                  { name: "Card / panel",    value: "#FFFFFF",  swatch: "#FFFFFF",  border: true },
                  { name: "Primary text",    value: "#232323",  swatch: "#232323" },
                  { name: "Secondary text",  value: "#6B7280",  swatch: "#6B7280" },
                  { name: "Border",          value: "#E5E7EB",  swatch: "#E5E7EB",  border: true },
                  { name: "CTA button",      value: "#3ba559",  swatch: "#3ba559" },
                ],
                use: "Application interiors — PSM, Crocodile data views, user management, dashboards",
              },
              {
                mode: "Dark Mode",
                badge: "Marketing",
                badgeColor: "bg-[#232323] text-[#93E07D]",
                bg: "bg-[#0d2828] border border-[#1a3a3a]",
                tokens: [
                  { name: "Page background", value: "#0d2828",  swatch: "#0d2828" },
                  { name: "Card / panel",    value: "#1a3a3a",  swatch: "#1a3a3a" },
                  { name: "Primary text",    value: "#FFFFFF",  swatch: "#FFFFFF",  border: true },
                  { name: "Secondary text",  value: "#9CA3AF",  swatch: "#9CA3AF" },
                  { name: "Accent text",     value: "#93E07D",  swatch: "#93E07D" },
                  { name: "CTA button",      value: "#93E07D",  swatch: "#93E07D" },
                ],
                use: "Marketing landing pages, hero sections, Human-AI Lab, public-facing app entry points",
              },
            ].map((m) => (
              <div key={m.mode} className={`rounded-xl p-6 ${m.bg}`}>
                <div className="flex items-center gap-3 mb-4">
                  <h3 className={`font-archivo font-bold text-lg ${m.mode === 'Dark Mode' ? 'text-white' : 'text-[#232323]'}`}>{m.mode}</h3>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${m.badgeColor}`}>{m.badge}</span>
                </div>
                <div className="space-y-2 mb-4">
                  {m.tokens.map((t) => (
                    <div key={t.name} className="flex items-center gap-3">
                      <div
                        className="w-6 h-6 rounded flex-shrink-0"
                        style={{ backgroundColor: t.swatch, border: t.border ? '1px solid #D1D5DB' : 'none' }}
                      />
                      <span className={`text-sm font-medium w-36 flex-shrink-0 ${m.mode === 'Dark Mode' ? 'text-gray-300' : 'text-gray-700'}`}>{t.name}</span>
                      <code className={`text-xs font-mono ${m.mode === 'Dark Mode' ? 'text-gray-400' : 'text-gray-500'}`}>{t.value}</code>
                    </div>
                  ))}
                </div>
                <p className={`text-xs mt-4 pt-4 border-t ${m.mode === 'Dark Mode' ? 'border-[#1a4a4a] text-gray-400' : 'border-gray-100 text-gray-500'}`}>
                  <strong className={m.mode === 'Dark Mode' ? 'text-gray-300' : 'text-gray-600'}>Use for:</strong> {m.use}
                </p>
              </div>
            ))}
          </div>

          {/* Decision rule */}
          <div className="bg-[#f0faf4] border border-[#b7e4c7] rounded-xl p-5 mb-10">
            <h3 className="font-semibold text-[#232323] mb-3">When to use which mode</h3>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              {[
                { q: "Public marketing / landing page?", a: "Dark mode" },
                { q: "Authenticated app interior?",       a: "Light mode" },
                { q: "App with both landing + interior?", a: "Dark hero → Light app (switch at login)" },
              ].map((r) => (
                <div key={r.q} className="bg-white rounded-lg p-4 border border-[#d1fae5]">
                  <p className="text-gray-600 mb-2">{r.q}</p>
                  <p className="font-semibold text-[#3ba559]">{r.a}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Hero image gallery */}
          <h3 className="font-archivo font-bold text-lg text-[#232323] mb-2">Dark Hero Background Images</h3>
          <p className="text-gray-600 text-sm mb-6 max-w-2xl">
            Pre-approved hero backgrounds for dark-mode landing pages. Always overlay with white or Accent Lime <code className="bg-gray-100 px-1 rounded text-xs">#93E07D</code> text. The left quarter of each image is kept dark for text placement.
          </p>

          <div className="grid md:grid-cols-1 gap-6">
            {[
              {
                id: "halHandsTouching",
                label: "Human-AI Lab — Hands Touching (Primary)",
                badge: "Primary",
                badgeColor: "bg-[#3ba559] text-white",
                url: heroImages.halHandsTouching,
                token: "heroImages.halHandsTouching",
                use: "Human-AI Lab landing page, any human + AI collaboration narrative. Two translucent wireframe hands reaching toward each other, fingertips meeting at the S-curve crossing point with a golden burst of light. Michelangelo-inspired composition. Currently live on human-ai-lab.exponentialroadmap.org.",
              },
              {
                id: "halHumanNetwork",
                label: "Human-AI Lab — Human Network",
                badge: "Alternate",
                badgeColor: "bg-[#2C3F43] text-white",
                url: heroImages.halHumanNetwork,
                token: "heroImages.halHumanNetwork",
                use: "Human-AI Lab, any human + AI collaboration narrative. Features the dual S-curves with a distributed network of connected person icons representing global human collaboration.",
              },
              {
                id: "halSCurveDual",
                label: "Human-AI Lab — Dual S-Curve (Minimal)",
                badge: "Minimal",
                badgeColor: "bg-gray-500 text-white",
                url: heroImages.halSCurveDual,
                token: "heroImages.halSCurveDual",
                use: "Generic ERI dark hero, any dual-transition narrative without an explicit human network element.",
              },
              {
                id: "halMFReaching",
                label: "Human-AI Lab — Reaching (Duo Figures)",
                badge: "Alternate",
                badgeColor: "bg-[#2C3F43] text-white",
                url: heroImages.halMFReaching,
                token: "heroImages.halMFReaching",
                use: "Human-AI Lab, human collaboration with AI, gender-balanced team narratives. Two constellation figures (male left, female right) reaching toward each other across the S-curve crossing point — emphasising the human-to-human connection enabled by AI.",
              },
              {
                id: "crocodileDecoupling",
                label: "Crocodile Economics — Decoupling",
                badge: "App-specific",
                badgeColor: "bg-[#00B4D8] text-white",
                url: heroImages.crocodileDecoupling,
                token: "heroImages.crocodileDecoupling",
                use: "Crocodile Economics app, any absolute decoupling / emissions-reduction narrative. Features diverging jaw curves: cyan (#00B4D8) GDP line rising, amber emissions line falling.",
              },
            ].map((img) => (
              <div key={img.id} data-hero-id={img.id} className="rounded-xl overflow-hidden border border-gray-200 shadow-sm">
                <div className="relative">
                  <img src={img.url} alt={img.label} className="w-full h-56 object-cover" />
                  <div className="absolute top-3 left-3 flex gap-2">
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${img.badgeColor}`}>{img.badge}</span>
                  </div>
                  <a
                    href={img.url}
                    download
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute top-3 right-3 bg-black/60 hover:bg-black/80 text-white text-xs font-medium px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors"
                  >
                    <Download className="w-3 h-3" /> Download
                  </a>
                </div>
                <div className="p-4 bg-white">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <h4 className="font-semibold text-[#232323] text-sm">{img.label}</h4>
                    <code className="text-xs font-mono bg-gray-100 px-2 py-0.5 rounded text-gray-600 flex-shrink-0">{img.token}</code>
                  </div>
                  <p className="text-xs text-gray-500">{img.use}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ================================================================ */}
        {/* SECTION 19: RESOURCES */}
        {/* ================================================================ */}
        <section id="resources" className="mb-16">
          <h2 className="font-archivo text-2xl md:text-3xl font-extrabold text-[#232323] mb-4">
            Resources
          </h2>
          <p className="text-gray-600 mb-8 max-w-3xl">
            Additional materials and tools to support brand-consistent design and development.
          </p>

          <div className="grid md:grid-cols-3 gap-4">
            {[
              { title: "Exponential Framework", desc: "Deep dive into the Five Pillars framework and methodology.", link: "Visit ERI Website", href: "https://exponentialroadmap.org" },
              { title: "Business Playbook", desc: "The Exponential Business Playbook v5.0 — the foundation for all ERI products.", link: "View Playbook", href: "https://exponentialroadmap.org" },
              { title: "Contact", desc: "Questions about brand usage or need custom assets? Get in touch with the ERI team.", link: "Get in Touch", href: "https://exponentialroadmap.org" },
            ].map((r) => (
              <Card key={r.title} className="shadow-sm hover:shadow-md transition-shadow flex flex-col">
                <CardContent className="p-6 flex flex-col flex-1">
                  <h3 className="font-bold text-[#232323] mb-2">{r.title}</h3>
                  <p className="text-sm text-gray-600 mb-4 flex-1">{r.desc}</p>
                  <a
                    href={r.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#3ba559] text-sm font-medium flex items-center gap-1 hover:underline mt-auto"
                  >
                    {r.link} <ExternalLink className="w-3 h-3" />
                  </a>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* ================================================================ */}
        {/* SECTION 18: MACHINE INSTRUCTIONS */}
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

          {/* ── PORTABLE SKILL CARD ── */}
          <Card className="shadow-sm mb-6 border border-gray-200">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">🧩</span>
                    <h3 className="font-bold text-[#232323] text-base">ERI BDS Reference Skill</h3>
                    <span className="text-[10px] font-mono bg-gray-100 text-gray-500 px-2 py-0.5 rounded border border-gray-200">v1.1.0</span>
                    <span className="text-[10px] text-gray-400">Updated 12 Apr 2026</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3 max-w-2xl">
                    A portable Manus skill that embeds the ERI brand reference directly into any AI project.
                    Once installed, the agent automatically consults the correct colour tokens, typography rules,
                    navigation tiers, and CDN asset URLs before acting — without needing a manual prompt.
                  </p>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {["Pre-action checklist", "Colour tokens", "Typography rules", "Navigation tiers", "Favicon spec", "CDN asset URLs", "Language rules", "Section index"].map((tag) => (
                      <span key={tag} className="text-[11px] bg-[#f0faf3] text-[#3ba559] border border-[#c6e8d0] px-2 py-0.5 rounded font-medium">{tag}</span>
                    ))}
                  </div>
                  <p className="text-xs text-gray-400">
                    <strong className="text-gray-500">For AI agents:</strong> Download and install via Manus Skills UI, or add the CDN URL to your project instructions.
                    The skill auto-triggers for any task tagged as an ERI product build.
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    <strong className="text-gray-500">For project leads:</strong> Share the download link with your team or add it to your project onboarding docs.
                    When a new AI task is started, instruct it to install this skill before proceeding.
                  </p>
                </div>
                <div className="flex flex-col gap-2 shrink-0">
                  <a
                    href="https://d2xsxph8kpxj0f.cloudfront.net/310519663319595517/5mtZtU66sMbsnmPoVbf6UJ/eri-bds-reference-v1.2.0_dc90d54c.skill"
                    download="eri-bds-reference-v1.2.0.skill"
                    className="inline-flex items-center gap-2 bg-[#3ba559] text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-[#2c6d3e] transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                    Download Skill
                  </a>
                  <a
                    href="https://d2xsxph8kpxj0f.cloudfront.net/310519663319595517/5mtZtU66sMbsnmPoVbf6UJ/eri-bds-reference-v1.2.0_dc90d54c.skill"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 border border-gray-300 text-gray-600 text-sm font-medium px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    CDN URL
                  </a>
                  <p className="text-[10px] text-gray-400 text-center font-mono break-all max-w-[200px]">eri-bds-reference-v1.2.0</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* ── BEFORE YOU ACT ── */}
          <Card className="shadow-sm mb-6 border-2 border-[#3ba559] bg-[#f0faf3]">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-[#3ba559] text-xl">⚑</span>
                <h3 className="font-bold text-[#232323] text-base">Before You Act — Pre-Action Checklist</h3>
              </div>
              <p className="text-sm text-gray-700 mb-4">
                Before generating any asset, writing any colour value, or building any UI component for an ERI product,
                you <strong>must</strong> consult the relevant section of this Brand Design System. Do not rely on memory,
                approximation, or inference — always look up the authoritative value.
              </p>
              <div className="grid md:grid-cols-2 gap-3">
                {[
                  {
                    trigger: "Touching any logo or favicon",
                    action: "Check Logo Usage section",
                    anchor: "logo-usage",
                    rule: "Never recolour the S-curve mark. Favicon = white-bg rounded PNG only. Use CDN URL favicon-white-rounded-32_05ba5ceb.png. 32px is correct — do not use the dark variant.",
                  },
                  {
                    trigger: "Writing any colour value",
                    action: "Check Visual Identity section",
                    anchor: "visual-identity",
                    rule: "Use exact hex values from the Colour Tokens table. Never approximate with Tailwind colour names.",
                  },
                  {
                    trigger: "Building any navigation component",
                    action: "Check Navigation & Layout section",
                    anchor: "navigation",
                    rule: "Match the correct tier (B, A, or C) to the app type. Left panel is sole desktop nav for Tier C.",
                  },
                  {
                    trigger: "Using any brand asset (logo, icon, image)",
                    action: "Check Asset URL Reference below",
                    anchor: "ai-instructions",
                    rule: "Use the CDN URLs listed here. Do not regenerate assets that already exist on the CDN.",
                  },
                  {
                    trigger: "Writing any copy or UI text",
                    action: "Check Language Rules below",
                    anchor: "ai-instructions",
                    rule: "British English throughout. -ise not -ize, -our not -or. Dates as DD Month YYYY.",
                  },
                  {
                    trigger: "Choosing a font",
                    action: "Check Typography Rules below",
                    anchor: "ai-instructions",
                    rule: "Archivo only. Load from Google Fonts CDN. font-extrabold (800) for all headings.",
                  },
                ].map(({ trigger, action, anchor, rule }) => (
                  <div key={trigger} className="bg-white rounded-lg border border-[#c6e8d0] p-3">
                    <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide mb-1">When you are…</p>
                    <p className="text-sm font-medium text-[#232323] mb-1">{trigger}</p>
                    <p className="text-xs text-[#3ba559] font-semibold mb-1">
                      → <a href={`#${anchor}`} className="underline underline-offset-2 hover:text-[#2c6d3e]">{action}</a>
                    </p>
                    <p className="text-xs text-gray-500 leading-relaxed">{rule}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

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
                        ["primary-dark",    "#232323", "Headings, footer bg, dark section backgrounds, hero overlay"],
                        ["neutral-gray",    "#6b7280", "Secondary text, borders"],
                        ["off-white",       "#F9FAFB", "Page bg, card bg, light section bg"],
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
                        ["P1 Operations",   "#9aa08c", pillarTints.pillar1],
                        ["P2 Value Chain",  "#17b7dd", pillarTints.pillar2],
                        ["P3 Solutions",    "#00ac58", pillarTints.pillar3],
                        ["P4 Finance",      "#ff8b00", pillarTints.pillar4],
                        ["P5 Policy",       "#ff5133", pillarTints.pillar5],
                      ].map(([name, hex, tint]) => (
                        <tr key={name} className="border-b border-gray-100">
                          <td className="py-1.5 pr-3">
                            <span
                              className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-semibold"
                              style={{ backgroundColor: tint as string, color: hex as string }}
                            >
                              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: hex as string }} />
                              {name}
                            </span>
                          </td>
                          <td className="py-1.5">
                            <code className="font-mono text-[11px]" style={{ color: hex as string }}>{hex}</code>
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
                    ["App title",              "text-[18px] font-semibold text-[#384151]",   "Current app/page name."],
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
                    ["logos.exponentialRoadmapLogo",     "exponential-logo_0cda439e.webp",       "Exponential swirl icon — raw source file (no rounded corners). Use favicon variants for production."],
                    ["logos.faviconWhiteRounded32",  "favicon-white-rounded-32_05ba5ceb.png",  "✅ CORRECT browser tab favicon — 32px white-bg rounded PNG (PNG only on Manus)"],
                    ["logos.faviconWhiteRounded180", "favicon-white-rounded-180_2daaa7d4.png", "180px Apple Touch Icon (iOS home screen)"],
                    ["logos.faviconWhiteRounded192", "favicon-white-rounded-192_54fb4338.png", "192px Android / PWA manifest icon"],
                  ] as [string, string, string][]).map(([token, file, usage]) => (
                    <tr key={token} className="border-b border-gray-100">
                      <td className="py-1.5 pr-3 text-[#3ba559]">{token}</td>
                      <td className="py-1.5 pr-3 text-gray-600">{file}</td>
                      <td className="py-1.5 font-sans text-gray-500">{usage}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Skills */}
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 mt-4">Manus Skills</p>
              <table className="w-full text-xs mb-4">
                <thead><tr className="border-b border-gray-200">
                  <th className="text-left py-1 font-semibold text-gray-600">Skill</th>
                  <th className="text-left py-1 font-semibold text-gray-600">Version</th>
                  <th className="text-left py-1 font-semibold text-gray-600">CDN URL</th>
                </tr></thead>
                <tbody className="font-mono text-[11px]">
                  <tr className="border-b border-gray-100">
                    <td className="py-1.5 pr-3 font-sans font-medium text-gray-700">eri-bds-reference</td>
                    <td className="py-1.5 pr-3 text-gray-500">v1.0.0</td>
                    <td className="py-1.5 text-[#3ba559] break-all">
                      <a
                        href="https://d2xsxph8kpxj0f.cloudfront.net/310519663319595517/5mtZtU66sMbsnmPoVbf6UJ/eri-bds-reference-v1.2.0_dc90d54c.skill"
                        download="eri-bds-reference-v1.2.0.skill"
                        className="underline underline-offset-2 hover:text-[#2c6d3e]"
                      >
                        eri-bds-reference-v1.2.0_dc90d54c.skill
                      </a>
                    </td>
                  </tr>
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
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 mt-4">Pillar Elements (WebP) — v5</p>
              <p className="text-xs text-gray-400 mb-2">Pattern: <code className="bg-gray-100 px-1 rounded">pillarsLong[1].solid</code> → filename <code className="bg-gray-100 px-1 rounded">pillar-1-long-solid.webp</code>. Same for pillarsRegular, pillarsExtended. For pillarsShort: .symbol → <code className="bg-gray-100 px-1 rounded">pillar-N-symbol-solid.webp</code> / .text → <code className="bg-gray-100 px-1 rounded">pillar-N-text-solid.webp</code></p>
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

              {/* Data source logos */}
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 mt-4">Data Source &amp; Partner Logos — Direct CDN URLs</p>
              <p className="text-xs text-gray-400 mb-2">Use the CDN URL directly in <code className="bg-gray-100 px-1 rounded">&lt;img src&gt;</code>. Token pattern: <code className="bg-gray-100 px-1 rounded">dataSourceLogos.cdp.url</code></p>
              <table className="w-full text-xs mb-4">
                <thead><tr className="border-b border-gray-200">
                  <th className="text-left py-1 font-semibold text-gray-600">Name</th>
                  <th className="text-left py-1 font-semibold text-gray-600">Category</th>
                  <th className="text-left py-1 font-semibold text-gray-600">CDN URL</th>
                </tr></thead>
                <tbody className="font-mono text-[11px]">
                  {Object.entries(dataSourceLogos).map(([key, { name, category, url }]) => (
                    <tr key={key} className="border-b border-gray-100">
                      <td className="py-1.5 pr-3 font-sans font-medium text-gray-700 whitespace-nowrap">{name}</td>
                      <td className="py-1.5 pr-3 font-sans text-gray-500 whitespace-nowrap">{category}</td>
                      <td className="py-1.5 text-[#3ba559] break-all">{url}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Member logos */}
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 mt-4">Member Company Logotypes — Direct CDN URLs</p>
              <p className="text-xs text-gray-400 mb-2">Use the CDN URL directly in <code className="bg-gray-100 px-1 rounded">&lt;img src&gt;</code>. Token pattern: <code className="bg-gray-100 px-1 rounded">memberLogos.scania.url</code></p>
              <table className="w-full text-xs mb-2">
                <thead><tr className="border-b border-gray-200">
                  <th className="text-left py-1 font-semibold text-gray-600">Company</th>
                  <th className="text-left py-1 font-semibold text-gray-600">Sector</th>
                  <th className="text-left py-1 font-semibold text-gray-600">CDN URL</th>
                </tr></thead>
                <tbody className="font-mono text-[11px]">
                  {Object.entries(memberLogos).map(([key, { name, sector, url }]) => (
                    <tr key={key} className="border-b border-gray-100">
                      <td className="py-1.5 pr-3 font-sans font-medium text-gray-700 whitespace-nowrap">{name}</td>
                      <td className="py-1.5 pr-3 font-sans text-gray-500 whitespace-nowrap">{sector}</td>
                      <td className="py-1.5 text-[#3ba559] break-all">{url}</td>
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
                    ["13", "Charts & Data Visualisation", "charts"],
                    ["14", "Photography",              "photography"],
                    ["15", "Member Logotypes",         "member-logos"],
                    ["16", "Data Source Logos",        "data-source-logos"],
                    ["17", "Resources",                "resources"],
                    ["18", "Surface Modes",             "surface-modes"],
                    ["19", "Navigation & Layout",      "navigation"],
                    ["20", "Machine Instructions",     "ai-instructions"],
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
