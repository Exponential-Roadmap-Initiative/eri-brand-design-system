/*
 * ERI Brand Design System — Security & Integrity Page
 *
 * Makes the eri-security skill visible to human operators in the same way
 * the Governance page makes the task lifecycle visible.
 *
 * Eight sections mirror the eight control domains in the eri-security skill:
 *  1. Why security is a governance domain (plain-language frame)
 *  2. The eight control domains (Trust page architecture)
 *  3. Authentication & session security
 *  4. Workspace data isolation (multi-tenancy)
 *  5. API security hardening
 *  6. Audit logging
 *  7. The eri-security skill (how to invoke it, Tier 3 placement)
 *  8. The Trust site (how /trust relates to each ERI product)
 *
 * BDS compliance:
 * - PublicLayout wrapper (correct header clearance, semantic bg/text tokens, ERI footer)
 * - Hero: bg-[#232323], font-extrabold font-archivo, eyebrow #93E07D, --eri-content-inset
 * - Section eyebrow labels: #93E07D (Accent Lime) — never #3ba559 (Primary Green)
 * - Card accents: left border + tint (≤8% opacity), no full four-side coloured outline
 * - Security accent colour: #ef4444 (canonical for security category in Skills page)
 * - No emoji — Lucide icons only
 * - Semantic tokens for structural surfaces (bg-card, bg-muted, border-border, text-foreground)
 */

import { useState, useEffect } from "react";
import { Link } from "wouter";
import {
  Shield, Lock, Key, Users, Server, Database, Activity, FileText,
  ChevronDown, ChevronUp, ArrowRight, ExternalLink, AlertTriangle,
  CheckCircle, Clock, Circle, Minus, Eye, Globe, Code2, BookOpen,
  ShieldCheck, ShieldAlert, Layers, RefreshCw, Terminal,
} from "lucide-react";
import PublicLayout from "@/components/PublicLayout";
import { PageGuide } from "@/components/PageGuide";

// ── Accent colour — canonical for security category ───────────────────────────
const SEC = "#ef4444";
const SEC_TINT = "rgba(239,68,68,0.06)";
const SEC_BORDER = "rgba(239,68,68,0.25)";

// ── Status model (mirrors eri-security skill Section 1) ───────────────────────

interface StatusDef {
  key: string;
  label: string;
  Icon: typeof CheckCircle;
  color: string;
  desc: string;
}

const STATUS_DEFS: StatusDef[] = [
  { key: "met",              label: "Implemented",            Icon: CheckCircle, color: "#22c55e", desc: "Fully in place and verified" },
  { key: "partial",          label: "Partial",                Icon: Minus,       color: "#f59e0b", desc: "Partially implemented; gaps documented" },
  { key: "partial-planned",  label: "Partial – Being Planned",Icon: Clock,       color: "#a78bfa", desc: "Partial now; active steps under way" },
  { key: "pending",          label: "In Progress",            Icon: RefreshCw,   color: "#3b82f6", desc: "Being actively worked on" },
  { key: "future",           label: "Future Release",         Icon: Circle,      color: "#8b5cf6", desc: "Deliberately deferred; not a current gap" },
  { key: "gap",              label: "Gap",                    Icon: AlertTriangle, color: "#ef4444", desc: "Known gap with no current mitigation" },
];

function StatusBadge({ status }: { status: string }) {
  const def = STATUS_DEFS.find(s => s.key === status) ?? STATUS_DEFS[0];
  const { Icon, color, label } = def;
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold tracking-wide border"
      style={{ color, borderColor: `${color}50`, backgroundColor: `${color}18` }}
    >
      <Icon className="w-3 h-3" />
      {label}
    </span>
  );
}

// ── Eight control domains ─────────────────────────────────────────────────────

interface ControlDomain {
  Icon: typeof Shield;
  title: string;
  desc: string;
  items: string[];
}

const CONTROL_DOMAINS: ControlDomain[] = [
  {
    Icon: Server,
    title: "Platform & Infrastructure",
    desc: "Hosting certifications, redundancy, data residency",
    items: ["Hosting SLA and uptime commitments", "Data residency and jurisdiction", "Infrastructure redundancy", "Disaster recovery"],
  },
  {
    Icon: Lock,
    title: "Encryption & Data Protection",
    desc: "TLS, at-rest encryption, session tokens, file uploads",
    items: ["TLS 1.2+ in transit", "At-rest encryption for sensitive fields", "JWT session tokens (HS256, httpOnly cookies)", "TOTP secrets encrypted with AES-256-GCM"],
  },
  {
    Icon: Key,
    title: "Authentication & Identity",
    desc: "OAuth, MFA, access whitelist, SSO",
    items: ["Managed OAuth 2.0 / OIDC (no credential storage)", "TOTP multi-factor authentication", "Domain-based MFA enforcement", "Session invalidation mechanism"],
  },
  {
    Icon: Users,
    title: "Access Control & Workspace Isolation",
    desc: "Multi-tenancy model, RBAC, onboarding, cross-workspace prevention",
    items: ["workspace_id scoping on every query", "Server-side membership guard on every request", "Ownership check on deletes and updates", "Invitation-only workspace onboarding"],
  },
  {
    Icon: ShieldCheck,
    title: "API Security & Input Validation",
    desc: "Protected procedures, input validation, rate limiting, CSP, SSRF prevention",
    items: ["All data procedures wrapped in protectedProcedure", "Zod input validation on all procedures", "Rate limiting (OAuth: 10/15min, tRPC: 200/min)", "Helmet CSP with dev/prod split", "SSRF domain allowlist"],
  },
  {
    Icon: Database,
    title: "Data Handling & Retention",
    desc: "Persistence model, import controls, backup, deletion",
    items: ["Logical isolation (shared DB, workspace_id scoping)", "Hard delete with cascade on workspace deletion", "Data export before deletion", "No file bytes stored in database columns"],
  },
  {
    Icon: Activity,
    title: "Monitoring, Logging & Incident Response",
    desc: "Audit logs, vulnerability scanning, pen testing, dependency management",
    items: ["Append-only audit_logs table (never UPDATE/DELETE)", "Minimum event set: auth.login, workspace.created, member changes", "Dependabot for dependency vulnerability scanning", "Monthly Trust page review schedule"],
  },
  {
    Icon: FileText,
    title: "Organisational & Compliance",
    desc: "GDPR, data ownership, SLA, employee controls",
    items: ["GDPR data processing transparency", "Data ownership remains with the workspace", "Employee access controls", "Security roadmap as living document on /trust"],
  },
];

// ── Four enforcement layers ───────────────────────────────────────────────────

const ISOLATION_LAYERS = [
  {
    n: "1",
    title: "Database-level scoping",
    desc: "Every SELECT, INSERT, UPDATE, and DELETE on workspace-owned tables includes WHERE workspace_id = ?. Never query without a workspace scope.",
    color: SEC,
  },
  {
    n: "2",
    title: "Server-side membership guard",
    desc: "Before any workspace data operation, verify the requesting user is a member of the target workspace. Throw FORBIDDEN immediately if not.",
    color: "#f59e0b",
  },
  {
    n: "3",
    title: "Ownership check on writes",
    desc: "Before executing a destructive operation, fetch the target record and verify its workspaceId matches the declared workspaceId. Prevents cross-workspace record manipulation by integer ID enumeration.",
    color: "#3b82f6",
  },
  {
    n: "4",
    title: "Admin-only shared reference data",
    desc: "Any data shared across workspaces must be read-only for regular users. Restrict all write mutations to adminProcedure.",
    color: "#8b5cf6",
  },
];

// ── The three stakeholder questions ──────────────────────────────────────────

const STAKEHOLDER_QUESTIONS = [
  {
    q: "Can someone from another company see our data?",
    a: "No. Every piece of data you create in the platform is tagged with your workspace identifier at the moment it is created. Every query the system runs — for reading, writing, or deleting — is filtered to your workspace only. A user from another company receives a 403 Forbidden error if they attempt to access your workspace, even if they know the internal ID of one of your records.",
  },
  {
    q: "Do you share a database with other companies?",
    a: "Yes — and so does Salesforce, Microsoft 365, and Google Workspace. This is the industry-standard approach for multi-tenant SaaS. The alternative (a separate database per customer) is significantly more expensive and does not provide meaningfully stronger security if the application layer is correctly implemented. We enforce isolation at the application layer on every single request, not just at the database level.",
  },
  {
    q: "What happens to our data if we leave?",
    a: "Workspace deletion performs a complete hard delete of all associated data — clients, projects, assessments, roadmaps, members, and uploaded files. A confirmation step is required. You can also export all your data at any time from the workspace settings page before deletion.",
  },
];

// ── Audit event table ─────────────────────────────────────────────────────────

const AUDIT_EVENTS = [
  { action: "auth.login",              trigger: "Successful OAuth callback" },
  { action: "auth.login_denied",       trigger: "Whitelist rejection or account disabled" },
  { action: "auth.login_error",        trigger: "OAuth callback error" },
  { action: "auth.logout",             trigger: "User-initiated sign-out" },
  { action: "auth.mfa_enrolled",       trigger: "TOTP setup confirmed" },
  { action: "auth.mfa_disabled",       trigger: "MFA turned off by user" },
  { action: "auth.session_invalidated",trigger: "Admin forces re-authentication" },
  { action: "workspace.created",       trigger: "New workspace created" },
  { action: "workspace.deleted",       trigger: "Workspace hard-deleted" },
  { action: "workspace.member_added",  trigger: "User invited to workspace" },
  { action: "workspace.member_removed",trigger: "User removed from workspace" },
];

// ── Anchor nav ────────────────────────────────────────────────────────────────

interface AnchorSection { id: string; label: string; essential?: boolean }

const ANCHOR_SECTIONS: AnchorSection[] = [
  { id: "why-governance",       label: "Why it matters" },
  { id: "control-domains",      label: "Control domains" },
  { id: "authentication",       label: "Authentication" },
  { id: "workspace-isolation",  label: "Workspace isolation", essential: true },
  { id: "api-security",         label: "API security" },
  { id: "audit-logging",        label: "Audit logging" },
  { id: "the-skill",            label: "The skill" },
  { id: "trust-site",           label: "Trust site" },
];

function SecurityAnchorNav() {
  const [active, setActive] = useState<string>("why-governance");

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    const intersecting = new Map<string, boolean>();

    ANCHOR_SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => {
          intersecting.set(id, entry.isIntersecting);
          const first = ANCHOR_SECTIONS.find(s => intersecting.get(s.id));
          if (first) setActive(first.id);
        },
        { rootMargin: "-20% 0px -60% 0px", threshold: 0 }
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach(o => o.disconnect());
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    const offset = 80;
    const top = el.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: "smooth" });
    setActive(id);
  };

  return (
    <div className="sticky top-16 z-30 bg-background/95 backdrop-blur border-b border-border/60 py-2 px-4">
      <div className="max-w-4xl mx-auto overflow-x-auto">
        <div className="flex items-center gap-1.5 min-w-max">
          {ANCHOR_SECTIONS.map(s => (
            <button
              key={s.id}
              onClick={() => scrollTo(s.id)}
              className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap ${
                active === s.id
                  ? "text-white"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
              } ${
                s.essential ? "ring-1 ring-[#93E07D]/60" : ""
              }`}
              style={active === s.id ? { backgroundColor: SEC } : {}}
            >
              {s.essential && <Shield className="w-3 h-3 flex-shrink-0" />}
              {s.label}
              {s.essential && (
                <span className="ml-1 text-[9px] font-bold uppercase tracking-wider text-[#93E07D]">Essential</span>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Collapsible section wrapper ───────────────────────────────────────────────

function Section({ id, title, subtitle, children, defaultOpen = false }: {
  id?: string;
  title: string;
  subtitle: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div id={id} className="border border-border rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-start justify-between px-6 py-5 text-left hover:bg-muted/20 transition-colors gap-4"
      >
        <div>
          <p className="text-base font-semibold text-foreground">{title}</p>
          <p className="text-sm text-muted-foreground mt-0.5">{subtitle}</p>
        </div>
        <span className="flex-shrink-0 mt-0.5 text-muted-foreground">
          {open ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </span>
      </button>
      {open && (
        <div className="border-t border-border px-6 py-6 bg-muted/5">
          {children}
        </div>
      )}
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function SecurityIntegrity() {
  return (
    <PublicLayout>
      {/* Hero — BDS compliant */}
      <section className="bg-[#232323] text-white py-16 px-4">
        <div
          className="max-w-3xl mx-auto"
          style={{ paddingInline: "var(--eri-content-inset, clamp(1rem, 3vw, 2rem))" }}
        >
          <p className="text-xs font-bold text-[#93E07D] uppercase tracking-widest mb-4">
            Exponential Roadmap Initiative ——— Security &amp; Integrity
          </p>
          <h1 className="text-4xl font-extrabold font-archivo mb-4 leading-tight">
            How ERI Builds<br />
            <span style={{ color: SEC }}>Secure Products</span>
          </h1>
          <PageGuide text="Security and data integrity are governance concerns, not just engineering concerns. This page explains the controls that every ERI application must implement — from workspace isolation to audit logging — and how the eri-security skill encodes that knowledge for every future task. No technical background required." />
        </div>
      </section>

      {/* Sticky anchor navigation */}
      <SecurityAnchorNav />

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-10 space-y-4">

        {/* Plain-language frame */}
        <div id="why-governance" className="rounded-xl border border-border bg-muted/10 p-6 space-y-3">
          <p className="text-xs font-semibold text-[#93E07D] uppercase tracking-widest">Why security is a governance domain — not just an engineering task</p>
          <p className="text-sm text-foreground/80 leading-relaxed">
            When ERI builds a product that holds company data — assessments, roadmaps, member information — the people whose data it holds need to trust that it is protected. That trust is not built by a single security review. It is built by consistent, repeatable practices encoded into every task from the start.
          </p>
          <p className="text-sm text-foreground/80 leading-relaxed">
            The <strong className="text-foreground">eri-security skill</strong> is the mechanism that makes this consistent. It encodes the full security model — authentication patterns, workspace isolation rules, API hardening checklists, audit logging schemas — in a form that Manus reads and acts on before writing any code that touches user data. The skill is Tier 3: it is not loaded on every task, but it is loaded automatically whenever the work involves authentication, workspace isolation, the Trust site, or a security review.
          </p>
          <p className="text-sm text-foreground/80 leading-relaxed">
            This page makes that skill visible to the whole team — not just developers. It explains what the controls are, why they exist, and how they relate to the public-facing Trust site at <a href="https://trust.exponentialroadmap.org" target="_blank" rel="noopener noreferrer" className="underline hover:text-white transition-colors" style={{ color: SEC }}>trust.exponentialroadmap.org</a>.
          </p>
        </div>

        {/* The big idea */}
        <div className="rounded-xl border border-l-4 border-border p-6" style={{ borderLeftColor: SEC, backgroundColor: SEC_TINT }}>
          <p className="text-xs font-semibold text-[#93E07D] uppercase tracking-widest mb-3">The core principle</p>
          <p className="text-sm text-foreground/80 leading-relaxed">
            Every ERI application that holds company data must implement the same baseline security controls — regardless of which developer built it, which Manus session is working on it, or how far along the product is. The eri-security skill is the mechanism that enforces this baseline. It cannot be skipped.
          </p>
        </div>

        {/* Section 1 — Eight control domains */}
        <Section
          id="control-domains"
          title="The eight control domains"
          subtitle="The security architecture — what every ERI application must address"
          defaultOpen={true}
        >
          <div className="space-y-5">
            <p className="text-sm text-muted-foreground leading-relaxed">
              The Trust page at <code className="font-mono text-[11px] px-1 rounded bg-muted">/trust</code> is organised into eight sections. These are not arbitrary categories — they are the eight domains that enterprise customers, IT departments, and legal teams examine during due diligence. Every ERI application that holds company data must address all eight.
            </p>
            <div className="grid grid-cols-1 gap-3" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}>
              {CONTROL_DOMAINS.map(domain => {
                const DomainIcon = domain.Icon;
                return (
                  <div
                    key={domain.title}
                    className="rounded-lg border p-4 space-y-2"
                    style={{ borderColor: SEC_BORDER, backgroundColor: SEC_TINT }}
                  >
                    <div className="flex items-center gap-2">
                      <DomainIcon className="w-4 h-4 flex-shrink-0" style={{ color: SEC }} />
                      <p className="text-sm font-semibold text-foreground">{domain.title}</p>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">{domain.desc}</p>
                    <ul className="space-y-1">
                      {domain.items.map(item => (
                        <li key={item} className="flex items-start gap-1.5 text-[11px] text-muted-foreground">
                          <span className="mt-0.5 flex-shrink-0" style={{ color: SEC }}>—</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>

            {/* Status model */}
            <div className="rounded-lg border border-border bg-muted/10 p-4 space-y-3">
              <p className="text-xs font-semibold text-foreground">The status model — how items are tracked on the Trust page</p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                The Trust page is a live data-driven component, not a static document. Each item carries a status that reflects the current state of the codebase. Statuses are never hardcoded as strings — they are derived from the data array so the page always reflects reality.
              </p>
              <div className="grid grid-cols-1 gap-2" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
                {STATUS_DEFS.map(s => {
                  const StatusIcon = s.Icon;
                  return (
                    <div key={s.key} className="flex items-start gap-2 rounded border border-border/50 p-2.5 bg-background/50">
                      <StatusIcon className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" style={{ color: s.color }} />
                      <div>
                        <p className="text-[11px] font-semibold" style={{ color: s.color }}>{s.label}</p>
                        <p className="text-[10px] text-muted-foreground leading-relaxed">{s.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </Section>

        {/* Section 2 — Authentication */}
        <Section
          id="authentication"
          title="Authentication & session security"
          subtitle="OAuth, JWT session tokens, and TOTP multi-factor authentication"
        >
          <div className="space-y-5">
            <p className="text-sm text-muted-foreground leading-relaxed">
              ERI applications use a managed OAuth 2.0 / OIDC provider rather than implementing credential storage. This eliminates the largest class of authentication vulnerabilities — password breaches — by design. The OAuth callback is the only entry point for new sessions.
            </p>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
              {[
                {
                  Icon: Key,
                  title: "OAuth 2.0 / OIDC",
                  color: SEC,
                  points: [
                    "No credential storage — passwords never touch ERI systems",
                    "Clear stale session cookie before issuing MFA gate cookie",
                    "OAuth callback is the sole session entry point",
                  ],
                },
                {
                  Icon: Lock,
                  title: "JWT Session Tokens",
                  color: "#f59e0b",
                  points: [
                    "HS256 signature with strong JWT_SECRET (≥32 bytes)",
                    "httpOnly, secure, sameSite:lax cookie options",
                    "session_invalidated_at for forced re-authentication",
                    "iat in seconds — compare correctly against DB timestamp",
                  ],
                },
                {
                  Icon: ShieldCheck,
                  title: "TOTP Multi-Factor Auth",
                  color: "#3b82f6",
                  points: [
                    "TOTP secrets encrypted at rest (AES-256-GCM)",
                    "Recovery codes stored as bcrypt hashes",
                    "Domain-based MFA enforcement (e.g. @yourcompany.com)",
                    "Pending token passed as URL query param — not httpOnly cookie",
                  ],
                },
              ].map(card => {
                const CardIcon = card.Icon;
                return (
                  <div key={card.title} className="rounded-lg border border-border p-4 bg-muted/10 space-y-2">
                    <div className="flex items-center gap-2 mb-1">
                      <CardIcon className="w-4 h-4 flex-shrink-0" style={{ color: card.color }} />
                      <p className="text-xs font-semibold text-foreground">{card.title}</p>
                    </div>
                    <ul className="space-y-1.5">
                      {card.points.map(p => (
                        <li key={p} className="flex items-start gap-1.5 text-[11px] text-muted-foreground">
                          <span className="mt-0.5 flex-shrink-0" style={{ color: card.color }}>—</span>
                          <span>{p}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>

            <div className="rounded-lg border border-dashed border-muted-foreground/30 p-3 text-xs text-muted-foreground leading-relaxed">
              <span className="font-medium text-foreground">Critical pitfall:</span> The <code className="font-mono text-[10px] px-1 rounded bg-muted">iat</code> claim in a JWT is in <strong className="text-foreground">seconds</strong>; the <code className="font-mono text-[10px] px-1 rounded bg-muted">session_invalidated_at</code> value from the database is a JavaScript <code className="font-mono text-[10px] px-1 rounded bg-muted">Date</code> (milliseconds). Compare correctly: <code className="font-mono text-[10px] px-1 rounded bg-muted">token.iat &lt; Math.floor(user.sessionInvalidatedAt.getTime() / 1000)</code>. Getting this wrong silently breaks forced re-authentication.
            </div>
          </div>
        </Section>

        {/* Section 3 — Workspace isolation */}
        <Section
          id="workspace-isolation"
          title="Workspace data isolation"
          subtitle="The most critical trust concern for enterprise customers — the four enforcement layers"
          defaultOpen={true}
        >
          <div className="space-y-6">
            <div className="rounded-lg bg-muted/20 border border-border p-4 space-y-2">
              <p className="text-xs font-semibold text-[#93E07D] uppercase tracking-widest">The logical isolation model</p>
              <p className="text-sm text-foreground/80 leading-relaxed">
                All workspaces share one database. Every data table carries a <code className="font-mono text-[11px] px-1 rounded bg-muted">workspace_id</code> foreign key. This is the industry-standard approach used by Salesforce, Microsoft 365, and Google Workspace. Be transparent about this on the Trust page — explain it clearly rather than obscuring it. Physical database separation can be offered as a roadmap item for customers with the highest security requirements.
              </p>
            </div>

            <div className="space-y-3">
              <p className="text-xs font-semibold text-foreground">The four enforcement layers — all four must be applied</p>
              <p className="text-xs text-muted-foreground leading-relaxed">Missing any one layer creates an exploitable gap. The layers are independent — passing Layer 1 does not compensate for failing Layer 3.</p>
              {ISOLATION_LAYERS.map(layer => (
                <div key={layer.n} className="flex items-start gap-3 rounded-lg border border-border p-4 bg-muted/10">
                  <span
                    className="flex-shrink-0 w-6 h-6 rounded-full text-[11px] font-bold flex items-center justify-center mt-0.5"
                    style={{ backgroundColor: `${layer.color}18`, border: `1.5px solid ${layer.color}50`, color: layer.color }}
                  >
                    {layer.n}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{layer.title}</p>
                    <p className="text-xs text-muted-foreground leading-relaxed mt-0.5">{layer.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Stakeholder questions */}
            <div className="space-y-3">
              <p className="text-xs font-semibold text-foreground">Communicating isolation to non-technical stakeholders</p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                When presenting to a company's IT department, legal team, or procurement officer, these are the three questions they will ask. The answers below are written for a non-developer audience — use them directly.
              </p>
              {STAKEHOLDER_QUESTIONS.map((item, i) => (
                <div key={i} className="rounded-lg border border-border bg-muted/10 p-4 space-y-2">
                  <p className="text-xs font-semibold text-foreground flex items-start gap-2">
                    <Eye className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" style={{ color: SEC }} />
                    {item.q}
                  </p>
                  <p className="text-xs text-muted-foreground leading-relaxed pl-5">{item.a}</p>
                </div>
              ))}
            </div>
          </div>
        </Section>

        {/* Section 4 — API security */}
        <Section
          id="api-security"
          title="API security hardening"
          subtitle="Rate limiting, security headers, CSP, and the dev/prod split"
        >
          <div className="space-y-5">
            <p className="text-sm text-muted-foreground leading-relaxed">
              Every ERI application exposes a tRPC API surface. That surface must be hardened against the most common attack vectors: API scraping, credential stuffing, cross-site scripting, and server-side request forgery.
            </p>

            <div className="grid grid-cols-1 gap-3" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))" }}>
              {[
                {
                  Icon: ShieldAlert,
                  color: SEC,
                  title: "Rate Limiting",
                  items: [
                    "OAuth callback: ≤10 attempts / 15 min / IP",
                    "All tRPC routes: ≤200 req / min / IP",
                    "Rate limiting skipped in development to avoid blocking local testing",
                  ],
                },
                {
                  Icon: Layers,
                  color: "#f59e0b",
                  title: "Security Headers (Helmet)",
                  items: [
                    "Helmet applied in production only — never in development",
                    "Dev/prod split prevents preview iframe breakage",
                    "CSP frame-ancestors includes all three Manus origins",
                    "X-Frame-Options disabled — CSP frame-ancestors is the sole control",
                  ],
                },
                {
                  Icon: Globe,
                  color: "#3b82f6",
                  title: "SSRF Prevention",
                  items: [
                    "Server-side URL fetches enforce a strict domain allowlist",
                    "403 returned for any domain not on the allowlist",
                    "Applies to logo proxies, report fetchers, and any external URL handler",
                  ],
                },
                {
                  Icon: Code2,
                  color: "#8b5cf6",
                  title: "Input Validation",
                  items: [
                    "All tRPC procedure inputs validated with Zod schemas",
                    "Express body size limit configured (1mb)",
                    "All data procedures wrapped in protectedProcedure",
                    "Admin-only operations use adminProcedure",
                  ],
                },
              ].map(card => {
                const CardIcon = card.Icon;
                return (
                  <div key={card.title} className="rounded-lg border border-border p-4 bg-muted/10 space-y-2">
                    <div className="flex items-center gap-2 mb-1">
                      <CardIcon className="w-4 h-4 flex-shrink-0" style={{ color: card.color }} />
                      <p className="text-xs font-semibold text-foreground">{card.title}</p>
                    </div>
                    <ul className="space-y-1.5">
                      {card.items.map(p => (
                        <li key={p} className="flex items-start gap-1.5 text-[11px] text-muted-foreground">
                          <span className="mt-0.5 flex-shrink-0" style={{ color: card.color }}>—</span>
                          <span>{p}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>

            <div className="rounded-lg border border-dashed border-muted-foreground/30 p-3 text-xs text-muted-foreground leading-relaxed">
              <span className="font-medium text-foreground">The dev/prod split is not optional.</span> Helmet's CORP, COOP, and CSP <code className="font-mono text-[10px] px-1 rounded bg-muted">frame-ancestors</code> headers are enforced by the browser. In development, the Manus Management UI preview panel embeds the app via a <code className="font-mono text-[10px] px-1 rounded bg-muted">*.manus.computer</code> tunnel URL — a different origin from the management UI. Applying Helmet in development breaks the preview with an error that looks identical to a network failure. The rule: wrap the entire <code className="font-mono text-[10px] px-1 rounded bg-muted">helmet()</code> call in <code className="font-mono text-[10px] px-1 rounded bg-muted">if (!isDev)</code>.
            </div>
          </div>
        </Section>

        {/* Section 5 — Audit logging */}
        <Section
          id="audit-logging"
          title="Audit logging"
          subtitle="An append-only record of every security-relevant event — essential for enterprise trust"
        >
          <div className="space-y-5">
            <p className="text-sm text-muted-foreground leading-relaxed">
              An append-only audit log is essential for enterprise trust and compliance. It is also the primary evidence you can show to a customer's IT or legal team during due diligence. The <code className="font-mono text-[11px] px-1 rounded bg-muted">audit_logs</code> table must never have UPDATE or DELETE permissions — it is a write-once record.
            </p>

            <div className="rounded-lg border border-border bg-muted/10 p-4 space-y-3">
              <p className="text-xs font-semibold text-foreground">Minimum event set</p>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-2 pr-4 text-muted-foreground font-semibold">Action</th>
                      <th className="text-left py-2 text-muted-foreground font-semibold">Trigger</th>
                    </tr>
                  </thead>
                  <tbody>
                    {AUDIT_EVENTS.map(ev => (
                      <tr key={ev.action} className="border-b border-border/40">
                        <td className="py-1.5 pr-4">
                          <code className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-muted text-foreground">{ev.action}</code>
                        </td>
                        <td className="py-1.5 text-muted-foreground">{ev.trigger}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <div className="rounded-lg border border-border p-4 bg-muted/10 space-y-2">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" style={{ color: SEC }} />
                  <p className="text-xs font-semibold text-foreground">Alert patterns to watch for</p>
                </div>
                <ul className="space-y-1.5">
                  {[
                    "> 5 auth.login_denied for the same IP within 15 minutes — credential stuffing",
                    "auth.login for a user with mfaEnabled=false in a mandatory-MFA domain — MFA bypass",
                    "workspace.deleted outside business hours — unauthorised deletion",
                    "Rapid auth.login + workspace.member_added for new email domains — account takeover",
                  ].map(item => (
                    <li key={item} className="flex items-start gap-1.5 text-[11px] text-muted-foreground">
                      <span className="mt-0.5 flex-shrink-0" style={{ color: SEC }}>—</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-lg border border-border p-4 bg-muted/10 space-y-2">
                <div className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-[#3b82f6]" />
                  <p className="text-xs font-semibold text-foreground">Admin access</p>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Expose the audit log via an admin-only <code className="font-mono text-[10px] px-1 rounded bg-muted">getAuditLogs</code> procedure with filtering by action, userId, date range, and pagination. Surface it in the admin UI — enterprise customers expect to see the audit trail during due diligence without requiring a database query.
                </p>
              </div>
            </div>
          </div>
        </Section>

        {/* Section 6 — The skill */}
        <Section
          id="the-skill"
          title="The eri-security skill"
          subtitle="How to invoke it, what it covers, and where it sits in the governance model"
        >
          <div className="space-y-5">
            <p className="text-sm text-muted-foreground leading-relaxed">
              The <code className="font-mono text-[11px] px-1 rounded bg-muted">eri-security</code> skill is the machine-readable version of everything on this page. It is a Tier 3 skill — conditional, not always-on — because its full depth is only needed when the work involves authentication, workspace isolation, the Trust site, or a security audit. It is loaded automatically when those conditions apply.
            </p>

            {/* Tier placement */}
            <div className="rounded-lg border p-4" style={{ borderColor: SEC_BORDER, backgroundColor: SEC_TINT }}>
              <div className="flex items-start gap-3">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                  style={{ backgroundColor: `${SEC}18`, border: `1.5px solid ${SEC}50` }}
                >
                  <Shield className="w-4 h-4" style={{ color: SEC }} />
                </div>
                <div>
                  <div className="flex items-baseline gap-2 flex-wrap mb-1">
                    <p className="text-sm font-semibold" style={{ color: SEC }}>Tier 3 — Conditional</p>
                    <p className="text-xs text-foreground/70 font-medium">Read when the security domain applies</p>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    The eri-security skill is loaded automatically when the task involves: building or auditing a Trust & Security page, implementing authentication (OAuth + TOTP MFA + session management), enforcing workspace data isolation (multi-tenancy), hardening API security (rate limiting, CSP, input validation), setting up audit logging, managing vulnerabilities (Dependabot, pen testing), or planning a security roadmap.
                  </p>
                </div>
              </div>
            </div>

            {/* What it covers */}
            <div className="rounded-lg border border-border bg-muted/10 p-4 space-y-3">
              <p className="text-xs font-semibold text-foreground">What the skill covers — nine sections</p>
              <div className="grid grid-cols-1 gap-2" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
                {[
                  { n: "1", title: "Trust page architecture",    desc: "Status model, page structure, summary bar, pending panel" },
                  { n: "2", title: "Authentication",             desc: "OAuth, JWT session tokens, TOTP MFA, domain enforcement" },
                  { n: "3", title: "Workspace isolation",        desc: "Four enforcement layers, audit checklist, onboarding controls" },
                  { n: "4", title: "API security",               desc: "Rate limiting, Helmet CSP, dev/prod split, SSRF prevention" },
                  { n: "5", title: "Audit logging",              desc: "Schema, minimum event set, admin access, alert patterns" },
                  { n: "6", title: "Dependency management",      desc: "Dependabot configuration, activation steps" },
                  { n: "7", title: "Monitoring & incident response", desc: "Ongoing schedule, audit log alert patterns, monthly review" },
                  { n: "8", title: "Stakeholder communication",  desc: "The three questions, Trust page as due diligence document" },
                  { n: "9", title: "Security roadmap management",desc: "Gap lifecycle, status transitions, deliberate deferral" },
                ].map(item => (
                  <div key={item.n} className="rounded border border-border/50 p-2.5 bg-background/50">
                    <p className="text-[11px] font-semibold text-foreground mb-0.5">
                      <span className="text-muted-foreground mr-1">{item.n}.</span>{item.title}
                    </p>
                    <p className="text-[10px] text-muted-foreground leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* How to invoke */}
            <div className="rounded-lg border border-dashed border-muted-foreground/30 p-3 text-xs text-muted-foreground leading-relaxed">
              <span className="font-medium text-foreground">How to invoke it explicitly:</span> In any Manus task, say "read the eri-security skill" or reference one of its trigger conditions (e.g. "implement MFA", "audit workspace isolation", "build the Trust page"). The skill is in the Tier 3 list in the project instructions — it will be loaded automatically when the orchestrator identifies a security-domain task.
            </div>

            <div className="pt-1">
              <Link href="/skills" className="inline-flex items-center gap-1.5 text-sm font-medium hover:underline" style={{ color: SEC }}>
                Browse the full Skills registry <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </Section>

        {/* Section 7 — The Trust site */}
        <Section
          id="trust-site"
          title="The Trust site"
          subtitle="How trust.exponentialroadmap.org relates to every ERI product"
        >
          <div className="space-y-5">
            <p className="text-sm text-muted-foreground leading-relaxed">
              The Trust site is the public-facing security posture statement for ERI. It is the document you share with a customer's IT department, legal team, or procurement officer. It covers the eight control domains above, with live status indicators and a Pending & Planned panel that shows the security roadmap honestly.
            </p>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <div className="rounded-lg border border-border p-4 bg-muted/10 space-y-2">
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4" style={{ color: SEC }} />
                  <p className="text-xs font-semibold text-foreground">What the Trust site is</p>
                </div>
                <ul className="space-y-1.5">
                  {[
                    "A live data-driven React application — not a static document",
                    "Organised into the eight control domains above",
                    "Status indicators reflect the current state of the codebase",
                    "Pending & Planned panel doubles as a living security roadmap",
                    "Designed to be shared directly with enterprise customers",
                  ].map(item => (
                    <li key={item} className="flex items-start gap-1.5 text-[11px] text-muted-foreground">
                      <span className="mt-0.5 flex-shrink-0" style={{ color: SEC }}>—</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-lg border border-border p-4 bg-muted/10 space-y-2">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-[#3b82f6]" />
                  <p className="text-xs font-semibold text-foreground">What the Trust site is not</p>
                </div>
                <ul className="space-y-1.5">
                  {[
                    "Not the implementation guide — the eri-security skill is",
                    "Not the internal instructions for AI agents — those live in the skill",
                    "Not product-specific — it covers ERI's platform-wide security posture",
                    "Not a place to add agent instructions — wrong audience, wrong product",
                  ].map(item => (
                    <li key={item} className="flex items-start gap-1.5 text-[11px] text-muted-foreground">
                      <span className="mt-0.5 flex-shrink-0 text-[#3b82f6]">—</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="rounded-lg border border-border bg-muted/10 p-4 space-y-2">
              <p className="text-xs font-semibold text-foreground">How to use the Trust page in a customer conversation</p>
              <ul className="space-y-1.5">
                {[
                  "Point them to the Access Control & Workspace Isolation section first",
                  "Walk through each item in plain language — the descriptions are written for a non-developer audience",
                  "The Pending & Planned panel shows the security roadmap honestly — this builds more trust than claiming everything is perfect",
                  "For items with partial or pending status, be prepared to explain what is being done and by when",
                ].map(item => (
                  <li key={item} className="flex items-start gap-2 text-xs text-muted-foreground leading-relaxed">
                    <span className="mt-0.5 flex-shrink-0" style={{ color: SEC }}>—</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <a
              href="https://trust.exponentialroadmap.org"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-medium hover:underline"
              style={{ color: SEC }}
            >
              Visit trust.exponentialroadmap.org <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </Section>

        {/* Monthly review callout */}
        <div className="rounded-xl border border-border bg-muted/10 p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-foreground mb-1">Monthly Trust page review</p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              The eri-security skill includes a monthly review checklist: are all gap items still accurately described? Have any pending items been completed? Have new features introduced new security items not yet on the page? This review takes 15 minutes and keeps the Trust page accurate.
            </p>
          </div>
          <a
            href="https://trust.exponentialroadmap.org"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm font-semibold hover:underline shrink-0"
            style={{ color: SEC }}
          >
            Open Trust site <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

      </div>
    </PublicLayout>
  );
}
