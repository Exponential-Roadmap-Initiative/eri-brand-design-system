/**
 * PageGuide — shared callout component used at the top of every page hero.
 *
 * Canonical reference: /new-project hero section.
 * Always sits inside the dark hero section (bg-[#232323]), immediately below
 * the page title, before any other page content.
 */

interface PageGuideProps {
  /** One or two sentences explaining what this page is for and how to use it. */
  text: string;
}

export function PageGuide({ text }: PageGuideProps) {
  return (
    <div className="mt-4 rounded-lg border border-white/20 bg-white/5 px-5 py-4 max-w-2xl">
      <p className="text-xs font-bold text-[#93E07D] uppercase tracking-widest mb-1">
        Page Guide
      </p>
      <p className="text-sm text-white/80 leading-relaxed">{text}</p>
    </div>
  );
}
