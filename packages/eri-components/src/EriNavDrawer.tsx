/**
 * EriNavDrawer — ERI Brand Design System v2.20.0
 *
 * The one menu panel. The hamburger at the far right of EriAppHeader opens it from the right, on every page of every ERI app.
 * EriPageLayout renders it when you pass the `menu` prop; you rarely use it on its own.
 *
 * WHAT IT HOLDS (top to bottom):
 *   1. On narrow screens (800px and below) the app's own sections (`menu.appSections`), because EriAppSidebar is hidden there.
 *   2. The platform areas (`menu.platformLinks`) under `menu.platformTitle`.
 *   3. The account slot (`menu.account`): the app's own sign-in / "Your access" control. The package has no sign-in of its own.
 *   4. On phones (below 640px, where the header carries no badge, version or Contact Us) the status badge, the version and, if
 *      the app shows it, the Contact Us button.
 *
 * BEHAVIOUR: a native <dialog> opened with showModal(), so Escape closes it, focus stays inside it, and focus returns to the
 * hamburger when it closes. A click on the dim area, on the close button or on any link closes it.
 *
 * RESPONSIVE: the panel is min(360px, 100vw) wide; below 640px it fills the screen. Its CSS is in dist/eri-components.css
 * (the .eri-nav-* classes), because a consuming app's Tailwind never scans this package.
 */

import React, { useEffect, useRef } from 'react';
import { EriNavAnchor, EriMenu } from './EriNav';
import { EriStatusBadge, EriStatusValue } from './EriStatusBadge';

interface EriNavDrawerProps {
  open: boolean;
  onClose: () => void;
  menu: EriMenu;
  /** Shown in the panel on phones only (the phone header leaves them out). */
  status?: EriStatusValue;
  version?: string;
  /** The Contact Us button, if the app shows it. Shown in the panel on phones only. */
  cta?: React.ReactNode;
}

export function EriNavDrawer({ open, onClose, menu, status, version, cta }: EriNavDrawerProps) {
  const dialog = useRef<HTMLDialogElement>(null);

  // Keep the native dialog in step with `open`.
  useEffect(() => {
    const element = dialog.current;
    if (!element) return;
    if (open && !element.open) element.showModal();
    if (!open && element.open) element.close();
  }, [open]);

  const platformTitle = menu.platformTitle ?? 'ERI Platform';
  const hasApp = !!menu.appSections && menu.appSections.length > 0;

  return (
    <dialog
      ref={dialog}
      className="eri-nav-drawer"
      aria-label="Menu"
      onClose={onClose}
      onClick={(event) => { if (event.target === dialog.current) onClose(); }}
    >
      <div className="eri-nav-drawer__head">
        <span className="eri-nav-drawer__title">Menu</span>
        <button type="button" className="eri-nav-drawer__close" aria-label="Close menu" onClick={onClose}>
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>
      </div>

      {/* A click on a link closes the panel; the link's own handler (a router's) has already run when the click reaches here. */}
      <div
        className="eri-nav-drawer__body"
        onClick={(event) => { if ((event.target as HTMLElement).closest('a[href]')) onClose(); }}
      >
        {hasApp && (
          <nav className="eri-nav-app" aria-label={menu.appTitle ?? 'Application sections'}>
            {menu.appTitle && <p className="eri-nav-heading">{menu.appTitle}</p>}
            {menu.appSections!.map((section, index) => (
              <div key={`${section.title ?? 'section'}-${index}`}>
                {section.title && <p className="eri-nav-group">{section.title}</p>}
                {section.links.map((link) => (
                  <EriNavAnchor key={link.href} link={link} className="eri-nav-link" linkComponent={menu.linkComponent} />
                ))}
              </div>
            ))}
          </nav>
        )}

        <nav className="eri-nav-platform" aria-label={platformTitle}>
          <p className="eri-nav-heading">{platformTitle}</p>
          {menu.platformLinks.map((link) => (
            <EriNavAnchor key={link.href} link={link} className="eri-nav-link" linkComponent={menu.linkComponent} />
          ))}
        </nav>

        {menu.account && <div className="eri-nav-account">{menu.account}</div>}

        {(status || version || cta) && (
          <div className="eri-nav-meta">
            <div className="eri-nav-meta__row">
              {status && <EriStatusBadge status={status} theme="light" />}
              {version && <span className="eri-nav-meta__version">{version}</span>}
            </div>
            {cta}
          </div>
        )}
      </div>
    </dialog>
  );
}

export default EriNavDrawer;
