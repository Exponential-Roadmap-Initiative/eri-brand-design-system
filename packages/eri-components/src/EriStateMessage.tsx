import type { ReactNode } from 'react';

export type EriStateKind = 'loading' | 'empty' | 'error' | 'restricted';
export type EriStateMessageProps = { kind: EriStateKind; title: string; children?: ReactNode; action?: ReactNode };

/**
 * EriStateMessage: what a page or a table shows instead of its content while it loads, when there is nothing, when it failed,
 * or when the reader may not see it. An error is announced at once (role "alert"); the others politely (role "status").
 * Moved from the ERI Platform's StateMessage (design-system/ResearchPatterns.tsx), same markup and classes; `StateMessage` is kept as its name too.
 */
export default function EriStateMessage({ kind, title, children, action }: EriStateMessageProps) {
  return (
    <div className={`eri-state eri-state--${kind}`} role={kind === 'error' ? 'alert' : 'status'}>
      <strong>{title}</strong>
      {children && <p>{children}</p>}
      {action}
    </div>
  );
}

export { EriStateMessage as StateMessage };
