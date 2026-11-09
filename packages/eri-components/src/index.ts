// ERI Standard Components — canonical package
// Do not reconstruct these from BDS rules — use this package directly.
// Source of truth: https://github.com/Exponential-Roadmap-Initiative/eri-brand-design-system/tree/main/packages/eri-components

export { default as EriStatusBadge } from './EriStatusBadge';
export { default as EriContactUsButton } from './EriContactUsButton';
export { default as EriAppHeader } from './EriAppHeader';
export { default as EriAppFooter } from './EriAppFooter';
export { default as EriHeroSection, ERI_HERO_IMAGE_HANDS, ERI_HERO_IMAGE_DEFAULT, ERI_HERO_IMAGE_TRUST } from './EriHeroSection';
export { default as EriPageLayout } from './EriPageLayout';

export { default as EriCrocodileChart } from './EriCrocodileChart';
export type { EriCrocodileChartProps, CrocodileDataPoint } from './EriCrocodileChart';

export { default as EriBarChart } from './EriBarChart';
export type { EriBar, EriBarChartProps } from './EriBarChart';
export { default as EriFigureList } from './EriFigureList';
export type { EriFigureRow, EriFigureListProps } from './EriFigureList';
export { default as EriTabs } from './EriTabs';
export type { EriTabsProps } from './EriTabs';

export { ERI_THEME_DEFAULT, ERI_THEME_EVENT, ERI_THEME_KEY, ERI_THEME_PREFERENCE_KEY, ERI_THEME_SCRIPT, currentEriTheme, parseThemePreference, readEriThemePreference, setEriThemePreference, themeFor, useEriTheme } from './eriTheme';
export type { EriTheme, EriThemePreference } from './eriTheme';

// Also export the status type
export type { EriStatusValue } from './EriStatusBadge';
