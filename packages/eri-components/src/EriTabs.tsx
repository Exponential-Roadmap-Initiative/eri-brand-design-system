/**
 * EriTabs — ERI Brand Design System
 *
 * The small pill switch: a choice inside a page tab ("Day by day / Month by month",
 * "Board by module / List by priority"). Page-level tabs stay bds-tabnav.
 * Markup and class are the BDS's own `bds-tabs`; this ships them in the package.
 *
 * Keyboard (ARIA tabs): the selected tab is the one tab stop; Left/Right (and Up/Down) move
 * to the neighbour and select it, Home/End go to the first/last. `controls` is the id of the
 * region the tabs switch, set on the selected tab as aria-controls.
 *
 * USAGE:
 *   <EriTabs label="Costs view" value={view} onChange={setView}
 *     options={[{ value: 'day', label: 'Day by day, last 30 days' }, { value: 'month', label: 'Month by month' }]} />
 */
import { type KeyboardEvent, useRef } from 'react';

export interface EriTabsProps<T extends string> {
  label: string;
  value: T;
  options: { value: T; label: string }[];
  onChange: (value: T) => void;
  /** Id of the region these tabs switch. */
  controls?: string;
}

export function EriTabs<T extends string>({ label, value, options, onChange, controls }: EriTabsProps<T>) {
  const list = useRef<HTMLDivElement>(null);
  const move = (event: KeyboardEvent<HTMLButtonElement>) => {
    const at = options.findIndex(o => o.value === value);
    const to = event.key === 'ArrowRight' || event.key === 'ArrowDown' ? (at + 1) % options.length
      : event.key === 'ArrowLeft' || event.key === 'ArrowUp' ? (at - 1 + options.length) % options.length
      : event.key === 'Home' ? 0 : event.key === 'End' ? options.length - 1 : -1;
    if (to < 0) return;
    event.preventDefault();
    onChange(options[to]!.value);
    list.current?.querySelectorAll<HTMLButtonElement>('[role="tab"]')[to]?.focus();
  };
  return (
    <div className="bds-tabs" role="tablist" aria-label={label} ref={list}>
      {options.map(o => {
        const selected = o.value === value;
        return (
          <button key={o.value} type="button" role="tab" aria-selected={selected} aria-controls={selected ? controls : undefined}
            tabIndex={selected ? 0 : -1} onKeyDown={move} onClick={() => onChange(o.value)}>{o.label}</button>
        );
      })}
    </div>
  );
}

export default EriTabs;
