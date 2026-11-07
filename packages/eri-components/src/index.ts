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

export { default as EriDataTable, setEriTableFilter, useEriTableFilter, setEriTableParam, useEriTableParam } from './EriDataTable';
export type { EriDataTableProps } from './EriDataTable';
export { buildView, emptyState, filterOptions, GRADE_RANK, isFiltered, nextSort, PAGE_SIZE, parseState, serverView, withFilter, writeState } from './eriDataTableModel';
export type { Cell, ColumnSpec, ColumnType, FilterKind, GroupSpec, Sort, View, ViewState } from './eriDataTableModel';
export { default as EriStateMessage, StateMessage } from './EriStateMessage';
export type { EriStateKind, EriStateMessageProps } from './EriStateMessage';

// Also export the status type
export type { EriStatusValue } from './EriStatusBadge';
