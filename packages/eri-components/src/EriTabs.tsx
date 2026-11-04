/**
 * EriTabs — ERI Brand Design System (proposed for @eri/components 2.19.0)
 *
 * The small pill switch: a choice inside a page tab ("Day by day / Month by month",
 * "Board by module / List by priority"). Page-level tabs stay bds-tabnav.
 * Markup and class are the BDS's own `bds-tabs` (BDS bundle.css); this ships them in the package.
 *
 * USAGE:
 *   <EriTabs label="Costs view" value={view} onChange={setView}
 *     options={[{ value: 'day', label: 'Day by day, last 30 days' }, { value: 'month', label: 'Month by month' }]} />
 */
export interface EriTabsProps<T extends string> {
  label: string;
  value: T;
  options: { value: T; label: string }[];
  onChange: (value: T) => void;
}

export function EriTabs<T extends string>({ label, value, options, onChange }: EriTabsProps<T>) {
  return (
    <div className="bds-tabs" role="tablist" aria-label={label}>
      {options.map(o => (
        <button key={o.value} type="button" role="tab" aria-selected={o.value === value} onClick={() => onChange(o.value)}>{o.label}</button>
      ))}
    </div>
  );
}

export default EriTabs;
