/**
 * EriNav — shared navigation types and the link renderer for EriNavDrawer and EriAppSidebar.
 * ERI Brand Design System v2.20.0
 *
 * One data shape feeds both parts, so an app lists its own sections once: EriAppSidebar draws them on the left of the page on
 * desktop, and EriNavDrawer draws the same sections at the top of the menu panel when the sidebar is hidden (800px and below).
 */

import React from 'react';

/** A link in the menu or the sidebar. */
export interface EriNavLink {
  label: string;
  href: string;
  /** Marks the page the visitor is on (aria-current="page"). */
  current?: boolean;
  /** Optional icon drawn before the label (decorative; the label names the link). */
  icon?: React.ReactNode;
}

/** A titled group of links. The title is optional. */
export interface EriNavSection {
  title?: string;
  links: EriNavLink[];
}

/** Props the package passes to a custom link component (see `EriMenu.linkComponent`). */
export type EriLinkProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };

/**
 * Everything the menu panel (and the app sidebar) need. Pass it as the `menu` prop of EriPageLayout.
 */
export interface EriMenu {
  /** Heading above the platform links. Defaults to "ERI Platform". */
  platformTitle?: string;
  /** The links to the platform's areas, in the order they appear. */
  platformLinks: EriNavLink[];
  /**
   * Heading above the app's own sections in the menu panel, e.g. "This application · CPR".
   * The panel shows the app's sections only when the sidebar is hidden (800px and below).
   */
  appTitle?: string;
  /** The app's own sections: the left sidebar on desktop, the first block of the menu panel on narrow screens. */
  appSections?: EriNavSection[];
  /** Accessible name of the sidebar landmark. Defaults to `appTitle`, then "Application sections". */
  sidebarLabel?: string;
  /**
   * The sign-in / account slot, drawn at the foot of the menu panel (e.g. "Your access" and "Sign in").
   * The package has no sign-in of its own: the app passes its own control. The panel is a modal <dialog>: an overlay mounted
   * in document.body (dropdown, dialog, popover) would sit under it, so pass a function and call `close` before opening one.
   */
  account?: React.ReactNode | ((close: () => void) => React.ReactNode);
  /**
   * Renders a link. Pass your router's link so a click navigates inside the app; the default is a plain <a>.
   * It receives the props of an <a> (href, className, aria-current, children). The panel closes on any link click by itself.
   */
  linkComponent?: React.ComponentType<EriLinkProps>;
}

/** Renders one navigation link with the package's classes. */
export function EriNavAnchor({
  link, className, linkComponent: LinkComponent,
}: {
  link: EriNavLink;
  className: string;
  linkComponent?: React.ComponentType<EriLinkProps>;
}) {
  const content = (
    <>
      {link.icon ? <span className="eri-nav-icon" aria-hidden="true">{link.icon}</span> : null}
      <span>{link.label}</span>
    </>
  );
  const props: EriLinkProps = {
    href: link.href,
    className,
    'aria-current': link.current ? 'page' : undefined,
    children: content,
  };
  return LinkComponent ? <LinkComponent {...props} /> : <a {...props} />;
}
