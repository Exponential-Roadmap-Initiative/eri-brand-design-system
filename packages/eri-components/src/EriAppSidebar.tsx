/**
 * EriAppSidebar — ERI Brand Design System v2.20.0
 *
 * An application's own sections, as a 224px sidebar on the left of the page. It stays under the fixed header while the page
 * scrolls. At 800px and below it is hidden, and the same sections appear at the top of EriNavDrawer instead of stacking above
 * the page. Pass them once, as `menu.appSections` on EriPageLayout; the layout draws both.
 *
 * Use it on its own only when you lay out the page yourself: put it first in a flex row (class `eri-app-body`) beside a
 * `eri-app-main` column.
 *
 * It holds navigation only. Sign-in and the theme toggle are not here: the toggle is in the header, and the account is at the
 * foot of EriNavDrawer.
 */

import React from 'react';
import { EriNavAnchor, EriNavSection, EriLinkProps } from './EriNav';

interface EriAppSidebarProps {
  /** The app's sections. */
  sections: EriNavSection[];
  /** Accessible name of the landmark, e.g. "CPR sections". */
  label: string;
  linkComponent?: React.ComponentType<EriLinkProps>;
}

export function EriAppSidebar({ sections, label, linkComponent }: EriAppSidebarProps) {
  return (
    <nav className="eri-app-sidebar" aria-label={label}>
      {sections.map((section, index) => (
        <div className="eri-app-sidebar__group" key={`${section.title ?? 'section'}-${index}`}>
          {section.title && <p className="eri-app-sidebar__title">{section.title}</p>}
          {section.links.map((link) => (
            <EriNavAnchor key={link.href} link={link} className="eri-app-sidebar__link" linkComponent={linkComponent} />
          ))}
        </div>
      ))}
    </nav>
  );
}

export default EriAppSidebar;
