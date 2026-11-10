/**
 * EriBreadcrumbBar — ERI Brand Design System v2.20.0
 *
 * One breadcrumb position for every page: the first line of the page, 16px under the header, at the content inset
 * (var(--eri-content-inset)), so every page starts at the same height and the title below it sits at the same place.
 *
 * USAGE:
 *   <EriBreadcrumbBar items={[{ label: 'ERI Platform', href: '/' }, { label: 'Data Lake', href: '/data-sources' }, { label: 'SBTi' }]} />
 *
 * The last item is the current page: it is not a link and carries aria-current="page". Put the bar first inside the page
 * content (under the header the layout already clears), then the page title. Pages with tabs put them under the title.
 */

import React from 'react';
import { EriLinkProps } from './EriNav';

export interface EriBreadcrumbItem {
  label: string;
  /** Omit on the last item (the current page). */
  href?: string;
  /** Optional in-app navigation for this crumb (called on a plain left click; the href stays for open-in-new-tab). */
  onClick?: () => void;
}

interface EriBreadcrumbBarProps {
  items: EriBreadcrumbItem[];
  linkComponent?: React.ComponentType<EriLinkProps>;
}

/** A plain left click runs the crumb's own handler; modified clicks keep the browser's open-in-new-tab behaviour. */
function plainClick(handler?: () => void) {
  if (!handler) return undefined;
  return (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey) {
      event.preventDefault();
      handler();
    }
  };
}

export function EriBreadcrumbBar({ items, linkComponent: LinkComponent }: EriBreadcrumbBarProps) {
  return (
    <nav className="eri-breadcrumb-bar" aria-label="Breadcrumb">
      <ol>
        {items.map((item, index) => {
          const current = index === items.length - 1;
          return (
            <li key={`${item.label}-${index}`}>
              {item.href && !current ? (
                LinkComponent ? (
                  <LinkComponent href={item.href} onClick={plainClick(item.onClick)}>{item.label}</LinkComponent>
                ) : (
                  <a href={item.href} onClick={plainClick(item.onClick)}>
                    {item.label}
                  </a>
                )
              ) : (
                <span aria-current={current ? 'page' : undefined}>{item.label}</span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export default EriBreadcrumbBar;
