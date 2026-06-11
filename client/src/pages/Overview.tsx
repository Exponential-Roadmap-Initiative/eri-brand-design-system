/**
 * ERI Design and Development Hub — Overview (Landing Page)
 *
 * The front door for external visitors: partners, collaborators, and member
 * companies who have been sent a link to this hub. Tells the full story of
 * what this hub is, why it exists, and what each section contains — in plain
 * language, without assuming any technical background.
 *
 * BDS compliance:
 * - PublicLayout wrapper (correct header clearance, semantic bg/text tokens, ERI footer)
 * - EriHeroSection with ERI_HERO_IMAGE_DEFAULT and showScrollIndicator
 * - Section eyebrow labels: #93E07D (Accent Lime)
 * - Card accents: left border + tint (≤8% opacity)
 * - No emoji — Lucide icons only
 * - Semantic tokens for structural surfaces
 * - British English throughout
 */

import { Link } from "wouter";
import {
  ArrowRight,
  BookOpen,
  Settings,
  ClipboardList,
  Brain,
  Globe,
  Users,
  Zap,
  RefreshCw,
  BarChart2,
  FileText,
  Layers,
  ExternalLink,
} from "lucide-react";
import { EriHeroSection, ERI_HERO_IMAGE_DEFAULT } from "@eri/components";
import PublicLayout from "@/components/PublicLayout";

// ── Hub section map ────────────────────────────────────────────────────────────

interface HubSection {
  href: string;
  Icon: typeof BookOpen;
  label: string;
  eyebrow: string;
  description: string;
  audience: string;
  accentColor: string;
  accentTint: string;
}

const HUB_SECTIONS: HubSection[] = [
  {
    href: "/governance",
    Icon: Brain,
    label: "Governance",
    eyebrow: "HOW WE WORK",
    description:
      "The operating model for human–AI collaboration at ERI. Explains the four-layer knowledge architecture, the self-improving skills system, and the 8-step task lifecycle that governs every piece of work — from a data pipeline to a member report.",
    audience: "Start here if you want to understand the system as a whole.",
    accentColor: "#3ba559",
    accentTint: "rgba(59,165,89,0.08)",
  },
  {
    href: "/skills",
    Icon: Layers,
    label: "Skills",
    eyebrow: "INSTITUTIONAL KNOWLEDGE",
    description:
      "25 living knowledge modules that encode how ERI work is done well. Each skill is built from real decisions and real deliverables — and improves automatically after every task. The registry shows which skills are active, which tier they belong to, and how often they are used.",
    audience: "Relevant for partners evaluating ERI's AI governance maturity.",
    accentColor: "#17b7dd",
    accentTint: "rgba(23,183,221,0.08)",
  },
  {
    href: "/project-instructions",
    Icon: ClipboardList,
    label: "Project Instructions",
    eyebrow: "STANDING BRIEF",
    description:
      "The standing brief that every Manus AI agent reads before starting any ERI task. It encodes the team's operating principles, quality standards, and governance rules — ensuring consistent execution across a platform serving more than 52,000 companies.",
    audience: "Relevant for technical partners and integration teams.",
    accentColor: "#ff8b00",
    accentTint: "rgba(255,139,0,0.08)",
  },
  {
    href: "/brand-design-system",
    Icon: BookOpen,
    label: "Brand Design System",
    eyebrow: "VISUAL & VERBAL IDENTITY",
    description:
      "The single source of truth for all visual, verbal, and component decisions across ERI digital products. Covers colour tokens, typography, logo usage, layout patterns, and canonical UI components — used by every ERI web application.",
    audience: "For designers, developers, and anyone building ERI products.",
    accentColor: "#9aa08c",
    accentTint: "rgba(154,160,140,0.08)",
  },
  {
    href: "/tracker",
    Icon: BarChart2,
    label: "Project Alignment Tracker",
    eyebrow: "COMPLIANCE DASHBOARD",
    description:
      "A live dashboard showing how well each ERI web project conforms to the Brand Design System. Tracks component usage, schema compliance, and self-reported checklist scores across all active projects.",
    audience: "For teams managing multiple ERI products.",
    accentColor: "#00ac58",
    accentTint: "rgba(0,172,88,0.08)",
  },
  {
    href: "/new-webproject",
    Icon: Settings,
    label: "New Web Project",
    eyebrow: "ONBOARDING",
    description:
      "Step-by-step guidance for bootstrapping a new ERI web application — from installing the component library to publishing a compliant project manifest. Covers two implementation tracks: full-stack and static.",
    audience: "For developers starting a new ERI product.",
    accentColor: "#ff5133",
    accentTint: "rgba(255,81,51,0.08)",
  },
  {
    href: "/team-guide",
    Icon: Users,
    label: "Team Guide",
    eyebrow: "WORKING TOGETHER",
    description:
      "Practical guidance for the ERI team on how to work with Manus effectively — how to frame tasks, how to review outputs, and how to contribute to the self-improving skills system.",
    audience: "For ERI team members and close collaborators.",
    accentColor: "#17b7dd",
    accentTint: "rgba(23,183,221,0.08)",
  },
];

// ── Three distinguishing principles ───────────────────────────────────────────

const PRINCIPLES = [
  {
    Icon: Globe,
    stat: "52,000+",
    label: "Companies in scope",
    body: "The Exponential Platform data lake already covers more than 52,000 companies. The infrastructure exists to hold every major corporate emitter on the planet accountable — and the systems built here are designed to operate at that scale.",
  },
  {
    Icon: RefreshCw,
    stat: "Self-improving",
    label: "After every task",
    body: "Every completed task is an opportunity to improve the system. When something works better than expected — or fails — that insight flows back into the skills layer. The same mistake cannot recur once it has been encoded. The system compounds.",
  },
  {
    Icon: Zap,
    stat: "5×",
    label: "Advantage for AI-native teams",
    body: "The Human-AI Lab's research shows that organisations pairing human judgement with AI-powered execution capture a 5× productivity advantage over those that do not. This hub is how ERI demonstrates that premise through its own work.",
  },
];

// ── Component ─────────────────────────────────────────────────────────────────

export default function Overview() {
  return (
    <PublicLayout hideFooter={false}>
      {/* Hero */}
      <EriHeroSection
        eyebrow="ERI DESIGN AND DEVELOPMENT HUB"
        titleLine1="Where ERI builds"
        titleLine2="for climate accountability"
        body="This hub is the operational centre of ERI's AI-native working model. It is where the team's institutional knowledge lives, where every product is built to the same standard, and where the system that makes that possible is documented and maintained."
        primaryCTA={{ label: "Understand the governance model", href: "/governance" }}
        secondaryCTA={{ label: "Browse the skills registry", href: "/skills" }}
        backgroundImage={ERI_HERO_IMAGE_DEFAULT}
        showScrollIndicator
      />

      {/* What this hub is */}
      <section className="bg-background py-16">
        <div className="max-w-4xl mx-auto px-4">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#93E07D] mb-3">
            WHAT THIS HUB IS
          </p>
          <h2 className="text-2xl font-extrabold font-archivo text-foreground mb-6 leading-tight">
            A platform built for the scale of the climate challenge
          </h2>
          <div className="grid gap-6 md:grid-cols-3">
            {PRINCIPLES.map(({ Icon, stat, label, body }) => (
              <div
                key={label}
                className="bg-card rounded-lg border border-border border-l-4 p-5"
                style={{ borderLeftColor: "#3ba559", backgroundColor: "rgba(59,165,89,0.05)" }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <Icon className="w-4 h-4 shrink-0" style={{ color: "#93E07D" }} />
                  <span className="text-xl font-extrabold font-archivo text-foreground">{stat}</span>
                </div>
                <p className="text-xs font-semibold uppercase tracking-widest text-[#93E07D] mb-2">{label}</p>
                <p className="text-sm text-muted-foreground leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The story */}
      <section className="bg-muted/30 py-16 border-y border-border">
        <div className="max-w-4xl mx-auto px-4">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#93E07D] mb-3">
            THE STORY
          </p>
          <h2 className="text-2xl font-extrabold font-archivo text-foreground mb-6 leading-tight">
            AI that gets better with every task
          </h2>
          <div className="grid gap-8 md:grid-cols-2">
            <div>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                ERI uses Manus — an AI agent — to accelerate its mission: halving global emissions by 2030. The work spans climate data infrastructure, corporate accountability tools, member engagement, and strategic communications.
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                What makes ERI's approach distinctive is not the use of AI — it is the governance model around it. Every task Manus performs is guided by a layered knowledge system: the team's operating principles, domain expertise built up over years, and the memory of every decision made on every codebase before.
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                When a task is done, what was learned raises the baseline for the next one. The system compounds — and that compounding is the point.
              </p>
            </div>
            <div className="space-y-4">
              {[
                { step: "1", title: "Task begins", desc: "Manus reads the relevant skills and project context before writing a single line of code or drafting a single sentence." },
                { step: "2", title: "Work is done", desc: "The task is executed with the full benefit of accumulated institutional knowledge — consistent, informed, and efficient." },
                { step: "3", title: "System improves", desc: "At the end of every task, what worked and what did not flows back into the skills layer. The version is bumped. Every future task benefits." },
                { step: "4", title: "Baseline rises", desc: "The same mistake cannot recur once encoded. The system gets measurably better with every piece of work completed." },
              ].map(({ step, title, desc }) => (
                <div key={step} className="flex gap-3">
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5"
                    style={{ backgroundColor: "rgba(59,165,89,0.15)", color: "#93E07D" }}
                  >
                    {step}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground mb-0.5">{title}</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Hub map */}
      <section className="bg-background py-16">
        <div className="max-w-4xl mx-auto px-4">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#93E07D] mb-3">
            WHAT IS IN THIS HUB
          </p>
          <h2 className="text-2xl font-extrabold font-archivo text-foreground mb-2 leading-tight">
            Seven sections — one coherent system
          </h2>
          <p className="text-sm text-muted-foreground mb-8 max-w-2xl">
            Each section of this hub serves a different purpose, but they are all part of the same operating model. Use the map below to find what you are looking for.
          </p>
          <div className="grid gap-4 md:grid-cols-2">
            {HUB_SECTIONS.map(({ href, Icon, label, eyebrow, description, audience, accentColor, accentTint }) => (
              <Link key={href} href={href} className="block group">
                <div
                  className="bg-card rounded-lg border border-border border-l-4 p-5 h-full transition-shadow hover:shadow-md"
                  style={{ borderLeftColor: accentColor, backgroundColor: accentTint }}
                >
                  <div className="flex items-start gap-3 mb-3">
                    <Icon className="w-4 h-4 shrink-0 mt-0.5" style={{ color: accentColor }} />
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-widest mb-0.5" style={{ color: "#93E07D" }}>
                        {eyebrow}
                      </p>
                      <h3 className="text-sm font-bold text-foreground group-hover:text-[#3ba559] transition-colors">
                        {label} <ArrowRight className="inline w-3 h-3 ml-0.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </h3>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed mb-3">{description}</p>
                  <p className="text-xs font-medium" style={{ color: accentColor }}>{audience}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* About ERI */}
      <section className="bg-[#232323] py-16">
        <div className="max-w-4xl mx-auto px-4">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#93E07D] mb-3">
            ABOUT ERI
          </p>
          <h2 className="text-2xl font-extrabold font-archivo text-white mb-6 leading-tight">
            The Exponential Roadmap Initiative
          </h2>
          <div className="grid gap-8 md:grid-cols-2">
            <div>
              <p className="text-sm text-white/70 leading-relaxed mb-4">
                The Exponential Roadmap Initiative (ERI) is a science-based organisation working to halve global greenhouse gas emissions by 2030. ERI works with businesses, cities, and regions to scale climate solutions exponentially — using the Exponential Business Playbook as the framework for corporate action.
              </p>
              <p className="text-sm text-white/70 leading-relaxed">
                The Exponential Platform is ERI's digital infrastructure for climate accountability — a data lake covering more than 52,000 companies, with tools for corporate performance review, member engagement, and strategic communications.
              </p>
            </div>
            <div className="space-y-3">
              {[
                { label: "Mission", value: "Halve global emissions by 2030" },
                { label: "Approach", value: "Science-based, exponential scaling" },
                { label: "Platform scope", value: "52,000+ companies in data lake" },
                { label: "Framework", value: "Exponential Business Playbook v5.0" },
                { label: "Human-AI model", value: "5× advantage through AI-native operations" },
              ].map(({ label, value }) => (
                <div key={label} className="flex gap-3 text-sm">
                  <span className="text-white/40 w-32 shrink-0">{label}</span>
                  <span className="text-white/80 font-medium">{value}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-8 flex flex-wrap gap-4">
            <a
              href="https://exponentialroadmap.org"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#93E07D] hover:text-white transition-colors"
            >
              Visit exponentialroadmap.org <ExternalLink className="w-3 h-3" />
            </a>
            <Link
              href="/governance"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-white/50 hover:text-white transition-colors"
            >
              Understand the AI governance model <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-background py-12 border-t border-border">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#93E07D] mb-3">
            GET STARTED
          </p>
          <h2 className="text-xl font-extrabold font-archivo text-foreground mb-3">
            Ready to explore?
          </h2>
          <p className="text-sm text-muted-foreground mb-6 max-w-lg mx-auto">
            If you are new here, the Governance page is the best place to start. It explains the whole system in plain language — no technical background required.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link
              href="/governance"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold text-[#232323] transition-opacity hover:opacity-90"
              style={{ backgroundColor: "#93E07D" }}
            >
              Read the Governance page <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/skills"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold border border-border text-foreground hover:bg-muted transition-colors"
            >
              Browse the skills registry
            </Link>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
