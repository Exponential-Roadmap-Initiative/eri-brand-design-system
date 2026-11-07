import { Fragment, type ReactNode, useEffect, useMemo, useRef, useState } from 'react';
import EriStateMessage from './EriStateMessage';
import { buildView, type ColumnSpec, emptyState, filterOptions, type GroupSpec, nextSort, parseState, PAGE_SIZE, serverView, type ViewState, withFilter, writeState } from './eriDataTableModel';

export type { ColumnSpec, GroupSpec, ViewState } from './eriDataTableModel';

/**
 * EriDataTable: the one table of ERI's applications. A toolbar (search, Columns, Export), quick filters per column, chips, sortable headings,
 * row groups, a row that opens, an edge shadow when it scrolls, and paging. The view lives in the page's address under `urlKey`, so it can be shared.
 *
 * Moved from the ERI Platform (eri-api/frontend/src/design-system/EriDataTable.tsx) with every behaviour kept; its markup now uses the package's
 * own `eri-dt` classes and tokens. Added in 2.21.0:
 * - server paging: pass `total` (rows matching the view on the server) and `onViewChange`; `rows` is then the one page the server sent;
 * - a filter slot (`toolbar`) for page-level filters beside the column filters, kept in the address with `useEriTableParam`/`setEriTableParam`;
 * - loading and error states inside the table (`loading`, `error`, `onRetry`);
 * - the phone layout: a column with `priority: "low"` folds into one line under the first cell at 40rem and narrower.
 */
const CHANGED = 'eri-data-table:state';
const NARROW = '(max-width: 40rem)';

const notify = () => window.dispatchEvent(new Event(CHANGED));
const push = (search: string) => window.history.pushState(window.history.state, '', `${window.location.pathname}${search}${window.location.hash}`);

/** Set one filter of the table `urlKey` from outside it (a chart that filters its table). The address is the one state; the table follows it. Each change is a history entry, so Back undoes it. */
export function setEriTableFilter(urlKey: string, column: string, values: string[]) {
  // Only this column's filter and the page change: the reader's search, other filters, sort and columns stay as they are.
  push(withFilter(window.location.search, urlKey, column, values));
  notify();
}
/** The values chosen for one filter of the table `urlKey`, read from the address and kept current. */
export function useEriTableFilter(urlKey: string, column: string): string[] {
  const read = () => new URLSearchParams(window.location.search).getAll(`${urlKey}.f.${column}`).filter(Boolean);
  return useAddress(read, [urlKey, column]);
}
/** Set a page-level filter that belongs beside the table `urlKey` (a portfolio select in its `toolbar`): kept in the address as `<urlKey>.p.<name>`,
 *  and the table goes back to its first page. An empty value removes it. */
export function setEriTableParam(urlKey: string, name: string, value: string) {
  const p = new URLSearchParams(window.location.search);
  if (value) p.set(`${urlKey}.p.${name}`, value); else p.delete(`${urlKey}.p.${name}`);
  p.delete(`${urlKey}.page`);
  const s = p.toString();
  push(s ? `?${s}` : '');
  notify();
}
/** The value of a page-level filter of the table `urlKey` ("" when not set), read from the address and kept current. */
export function useEriTableParam(urlKey: string, name: string): string {
  const read = () => new URLSearchParams(window.location.search).get(`${urlKey}.p.${name}`) ?? '';
  return useAddress(read, [urlKey, name]);
}
function useAddress<T>(read: () => T, deps: string[]): T {
  const [value, setValue] = useState(read);
  useEffect(() => {
    const sync = () => setValue(read());
    window.addEventListener(CHANGED, sync); window.addEventListener('popstate', sync);
    return () => { window.removeEventListener(CHANGED, sync); window.removeEventListener('popstate', sync); };
  }, deps);
  return value;
}
function useNarrow(enabled: boolean): boolean {
  const query = () => enabled && typeof window !== 'undefined' && typeof window.matchMedia === 'function' && window.matchMedia(NARROW).matches;
  const [narrow, setNarrow] = useState(query);
  useEffect(() => {
    if (!enabled || typeof window.matchMedia !== 'function') { setNarrow(false); return; }
    const list = window.matchMedia(NARROW);
    const sync = () => setNarrow(list.matches);
    sync(); list.addEventListener('change', sync);
    return () => list.removeEventListener('change', sync);
  }, [enabled]);
  return narrow;
}

export type EriDataTableProps<R> = {
  columns: ColumnSpec<R>[];
  /** Every row (browser paging), or, with `total`, the one page the server sent for the view. */
  rows: R[];
  rowKey: (row: R) => string;
  /** Where a row leads: the first cell is a real link to it and the whole row opens it. */
  rowHref?: (row: R) => string;
  /** How the app moves to a link (its router); a link with a modifier key is left to the browser. */
  onNavigate?: (href: string) => void;
  groupBy?: GroupSpec<R>;
  /** Prefix of every query parameter of this table, so a page can hold more than one. */
  urlKey: string;
  /** What the rows are, plural ("actions"): the search label and "N actions matching this view". */
  noun: string;
  /** The same, for one row ("action"); defaults to the noun. */
  singular?: string;
  /** Rows to a page (default 25). */
  pageSize?: number;
  /** The table's label for screen readers. */
  label: string;
  /** Offer "Export results": the rows of the view as a CSV file made in the browser. With server paging, the button calls `onExport` (and is not shown without it). */
  exportable?: boolean;
  exportName?: string;
  /** Server paging only: export the whole view (the server makes the file). */
  onExport?: (state: ViewState) => void;
  /** A row whose cells after the first are replaced by this text (a hidden row). */
  maskedRow?: (row: R) => ReactNode | undefined;
  emptyText?: string;
  /** Server paging: how many rows match the view in all. The table then neither filters, sorts nor cuts `rows`: the server does, from `onViewChange`. */
  total?: number;
  /** Called with the view (search, filters, sort, page, page-level params) when the table first shows and whenever it changes: fetch that page. */
  onViewChange?: (state: ViewState) => void;
  /** Page-level filters, drawn first in the filter row (an EriSelect, a portfolio picker). Keep their value with `useEriTableParam`. */
  toolbar?: ReactNode;
  /** The rows are being fetched. With no rows yet, the table shows a loading message; with rows, it keeps them and marks them as updating. */
  loading?: boolean;
  /** The rows could not be fetched: shown in place of the rows, with a "Try again" button when `onRetry` is given. */
  error?: ReactNode;
  onRetry?: () => void;
};

const csv = (cell: string) => `"${cell.replace(/"/g, '""')}"`;

export function EriDataTable<R>({ columns, rows, rowKey, rowHref, onNavigate, groupBy, urlKey, noun, singular, pageSize = PAGE_SIZE, label, exportable, exportName, onExport, maskedRow, emptyText, total, onViewChange, toolbar, loading, error, onRetry }: EriDataTableProps<R>) {
  const server = total !== undefined;
  const [state, setState] = useState<ViewState>(() => typeof window === 'undefined' ? emptyState : parseState(window.location.search, urlKey, columns));
  const [draft, setDraft] = useState(state.q);
  const [panel, setPanel] = useState(false);
  const [edge, setEdge] = useState(false);
  const scroller = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const sync = () => { const next = parseState(window.location.search, urlKey, columns); setState(next); setDraft(next.q); };
    window.addEventListener(CHANGED, sync); window.addEventListener('popstate', sync);
    return () => { window.removeEventListener(CHANGED, sync); window.removeEventListener('popstate', sync); };
  }, [urlKey]);
  const changed = useRef(onViewChange);
  changed.current = onViewChange;
  // The view the server serves: everything but the chosen columns, which only change what is drawn and need no new fetch.
  const { cols: _cols, ...served } = state;
  const servedKey = JSON.stringify(served);
  useEffect(() => { changed.current?.(served); }, [servedKey]);
  const update = (patch: Partial<ViewState>) => {
    const next = { ...state, page: 1, ...patch };
    setState(next);
    push(writeState(window.location.search, urlKey, next));
    notify();
  };
  const view = useMemo(() => server ? serverView(rows, total, state, groupBy, pageSize) : buildView(rows, columns, state, groupBy, pageSize), [rows, columns, state, groupBy, pageSize, server, total]);
  const choosable = columns.filter(c => !c.hidden);
  const visible = choosable.filter((c, i) => i === 0 || (state.cols ? state.cols.includes(c.key) : c.defaultVisible !== false));
  const narrow = useNarrow(columns.some(c => c.priority === 'low'));
  const drawn = narrow ? visible.filter((c, i) => i === 0 || c.priority !== 'low') : visible;
  const folded = narrow ? visible.filter((c, i) => i > 0 && c.priority === 'low') : [];
  const filters = columns.filter(c => c.filter === 'select' || c.filter === 'toggle');
  const readEdge = () => { const el = scroller.current; if (el) setEdge(el.scrollWidth > el.clientWidth + 1 && el.scrollLeft + el.clientWidth < el.scrollWidth - 1); };
  useEffect(() => {
    const el = scroller.current;
    if (!el) return;
    const observer = new ResizeObserver(readEdge);
    observer.observe(el); if (el.firstElementChild) observer.observe(el.firstElementChild);
    readEdge();
    return () => observer.disconnect();
  }, [view.shown, drawn.map(c => c.key).join(','), !!error, loading && rows.length === 0]);
  const go = (href: string, event: { metaKey: boolean; ctrlKey: boolean; shiftKey: boolean; altKey: boolean; button?: number; preventDefault: () => void }) => {
    if (event.button !== undefined && event.button !== 0) return;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    if (onNavigate) onNavigate(href); else window.location.assign(href);
  };
  const filtered = !!state.q || Object.values(state.filters).some(v => v.length > 0);
  const clearAll = () => { setDraft(''); update({ q: '', filters: {} }); };
  const chips = [
    ...(state.q ? [{ id: 'q', name: 'Search', value: state.q, remove: () => { setDraft(''); update({ q: '' }); } }] : []),
    ...filters.flatMap(c => (state.filters[c.key] ?? []).map(v => c.filter === 'toggle'
      ? { id: c.key, name: c.toggleLabel ?? c.label, value: '', remove: () => update({ filters: { ...state.filters, [c.key]: [] } }) }
      : { id: `${c.key}:${v}`, name: c.label, value: v, remove: () => update({ filters: { ...state.filters, [c.key]: state.filters[c.key].filter(x => x !== v) } }) })),
  ];
  const exportRows = () => {
    if (server) { onExport?.(state); return; }
    const all = buildView(rows, columns, state, groupBy, Math.max(rows.length, 1)).groups.flatMap(g => g.rows);
    const text = [visible.map(c => csv(c.label)).join(','), ...all.map(r => visible.map(c => csv(c.text ? c.text(r) : String(c.value(r) ?? ''))).join(','))].join('\n');
    const url = URL.createObjectURL(new Blob([text], { type: 'text/csv;charset=utf-8' }));
    const a = document.createElement('a'); a.href = url; a.download = `${exportName ?? urlKey}.csv`; a.click(); URL.revokeObjectURL(url);
  };
  const head = (c: ColumnSpec<R>) => c.sortable === false ? <span className="eri-dt__head">{c.label}</span> : <button type="button" className="eri-dt__sort" title={`Sort by ${c.label.toLowerCase()}`}
    onClick={() => update({ sort: nextSort(state.sort, c.key), page: state.page })}>{c.label}{state.sort?.key === c.key ? (state.sort.dir === 'asc' ? ' ↑' : ' ↓') : ' ↕'}</button>;
  const cell = (c: ColumnSpec<R>, row: R) => c.render ? c.render(row) : (c.text ? c.text(row) : String(c.value(row) ?? ''));
  const name = (n: number) => n === 1 ? (singular ?? noun) : noun;
  const waiting = loading && rows.length === 0 && !error;
  const count = error || waiting ? '' : `${filtered ? `${view.shown} ${name(view.shown)} matching this view` : `${view.total} ${name(view.total)}`}${loading ? ' · updating' : ''}`;
  const showExport = exportable && (!server || !!onExport);
  return (
    <div className="eri-dt eri-data-table">
      <div className="eri-dt__toolbar">
        <form className="eri-dt__search" onSubmit={e => { e.preventDefault(); update({ q: draft.trim() }); }}>
          <label className="eri-dt__sr" htmlFor={`${urlKey}-search`}>Search {noun}</label>
          <input id={`${urlKey}-search`} value={draft} placeholder={`Search ${noun}`} onChange={e => setDraft(e.target.value)} />
          <button className="eri-dt__button eri-dt__button--primary" type="submit">Search</button>
        </form>
        <button type="button" className="eri-dt__button" aria-expanded={panel} onClick={() => setPanel(!panel)}>Columns ({visible.length})</button>
        {showExport && <button type="button" className="eri-dt__button" disabled={view.shown === 0 || !!error} onClick={exportRows}>Export results</button>}
      </div>
      <div className="eri-dt__filters">
        {toolbar}
        {filters.map(c => c.filter === 'toggle'
          ? <label key={c.key} className="eri-dt__toggle"><input type="checkbox" checked={(state.filters[c.key] ?? []).length > 0}
              onChange={e => update({ filters: { ...state.filters, [c.key]: e.target.checked ? ['1'] : [] } })} /> {c.toggleLabel ?? c.label}</label>
          : <QuickFilter key={c.key} id={`${urlKey}-${c.key}`} name={c.label} options={filterOptions(rows, c)} values={state.filters[c.key] ?? []} onChange={values => update({ filters: { ...state.filters, [c.key]: values } })} />)}
      </div>
      {panel && <fieldset className="eri-dt__columns"><legend>Columns shown</legend>
        {choosable.map((c, i) => <label key={c.key}><input type="checkbox" checked={visible.includes(c)} disabled={i === 0}
          onChange={e => update({ cols: e.target.checked ? [...visible.map(v => v.key), c.key] : visible.map(v => v.key).filter(k => k !== c.key), page: state.page })} /> {c.label}</label>)}
        {state.cols && <button type="button" className="eri-dt__button" onClick={() => update({ cols: undefined, page: state.page })}>Reset columns</button>}
      </fieldset>}
      {chips.length > 0 && <div className="eri-dt__chips">
        {chips.map(ch => <button key={ch.id} type="button" aria-label={`Remove ${ch.name}${ch.value ? `: ${ch.value}` : ''}`} onClick={ch.remove}>{ch.name}{ch.value ? `: ${ch.value}` : ''} ×</button>)}
        <button type="button" onClick={clearAll}>Clear all</button></div>}
      <div className="eri-dt__count"><span role="status" aria-live="polite">{count}</span></div>
      {error
        ? <EriStateMessage kind="error" title={`The ${noun} could not be loaded`} action={onRetry && <button type="button" className="eri-dt__button" onClick={onRetry}>Try again</button>}>{error}</EriStateMessage>
        : waiting
        ? <EriStateMessage kind="loading" title={`Loading ${noun}…`} />
        : view.shown === 0 || (server && rows.length === 0)
        ? <div className="eri-dt__empty"><p>{emptyText ?? 'No row matches these filters'}</p>{(state.q || chips.length > 0) && <button type="button" className="eri-dt__button" onClick={clearAll}>Clear all</button>}</div>
        : <div className="eri-dt__area" data-scroll-right={edge} aria-busy={loading || undefined}>
          <div className="eri-dt__scroll" ref={scroller} role="region" aria-label={label} aria-description="Scroll horizontally to see more columns. Select a column heading to sort." tabIndex={0} onScroll={readEdge}>
            <table className={`eri-dt__table${folded.length ? ' eri-dt__table--fold' : ''}`} style={folded.length ? undefined : { width: drawn.reduce((sum, c) => sum + (c.width ?? 160), 0) }}>
              {!folded.length && <colgroup>{drawn.map(c => <col key={c.key} style={{ width: c.width ?? 160 }} />)}</colgroup>}
              <thead><tr>{drawn.map(c => <th key={c.key} scope="col" aria-sort={state.sort?.key === c.key ? (state.sort.dir === 'asc' ? 'ascending' : 'descending') : undefined}>{head(c)}</th>)}</tr></thead>
              <tbody>
                {view.groups.map((g, gi) => <Fragment key={`${g.key}:${gi}`}>
                  {groupBy && <tr className="eri-dt__group"><th scope="rowgroup" colSpan={drawn.length}>{groupBy.label(g.key, g.rows.length)}</th></tr>}
                  {g.rows.map(row => {
                    const href = rowHref?.(row), masked = maskedRow?.(row);
                    return <tr key={rowKey(row)} className={`eri-dt__row${href ? ' eri-dt__row--link' : ''}`}
                      onClick={href ? e => { if (!(e.target as HTMLElement).closest('a,button,input,select,summary,details') && !window.getSelection()?.toString()) go(href, e); } : undefined}>
                      {drawn.map((c, i) => {
                        const content = cell(c, row);
                        if (i === 0) return <td key={c.key} className="eri-dt__first">{href ? <a href={href} onClick={e => go(href, e)}>{content}</a> : content}
                          {masked !== undefined && drawn.length === 1 && <p className="eri-dt__fold eri-dt__masked">{masked}</p>}
                          {masked === undefined && folded.length > 0 && <dl className="eri-dt__fold">{folded.map(f => <div key={f.key}><dt>{f.label}</dt><dd>{cell(f, row)}</dd></div>)}</dl>}</td>;
                        if (masked !== undefined) return i === 1 ? <td key={c.key} colSpan={drawn.length - 1} className="eri-dt__masked">{masked}</td> : null;
                        return <td key={c.key}>{content}</td>;
                      })}
                    </tr>;
                  })}
                </Fragment>)}
              </tbody>
            </table>
          </div>
        </div>}
      {!error && !waiting && <div className="eri-dt__paging">
        <span>{view.shown ? `${view.first}–${view.last} of ${view.shown}` : '0 results'}</span>
        <button type="button" className="eri-dt__button" disabled={view.page <= 1 || loading} onClick={() => update({ page: view.page - 1 })}>Previous</button>
        <span>Page {view.page}</span>
        <button type="button" className="eri-dt__button" disabled={view.page >= view.pages || loading} onClick={() => update({ page: view.page + 1 })}>Next</button>
      </div>}
    </div>
  );
}

/** One column's quick filter: a disclosure with a find box and a checkbox per value. Closes on Escape and on a click outside. */
function QuickFilter({ id, name, options, values, onChange }: { id: string; name: string; options: string[]; values: string[]; onChange: (values: string[]) => void }) {
  const [query, setQuery] = useState('');
  const root = useRef<HTMLDetailsElement>(null);
  useEffect(() => {
    const outside = (e: PointerEvent) => { if (!root.current?.contains(e.target as Node)) root.current?.removeAttribute('open'); };
    const escape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && root.current?.open) { root.current.removeAttribute('open'); root.current.querySelector('summary')?.focus(); }
    };
    document.addEventListener('pointerdown', outside); document.addEventListener('keydown', escape);
    return () => { document.removeEventListener('pointerdown', outside); document.removeEventListener('keydown', escape); };
  }, []);
  const shown = options.filter(v => v !== 'NA' && v.toLowerCase().includes(query.toLowerCase()));
  // The pop-up opens to the right of its filter, or to the left when it would run past the screen's right edge and there is more room on that side.
  const [side, setSide] = useState<'start' | 'end'>('start');
  const place = () => {
    const box = root.current; if (!box?.open) return;
    const r = box.getBoundingClientRect(); const pop = box.querySelector<HTMLElement>('.eri-dt__quick-options')?.offsetWidth ?? 0;
    const fits = r.left + pop <= window.innerWidth;
    setSide(!fits && r.right > window.innerWidth - r.left ? 'end' : 'start');
  };
  return (
    <details className="eri-dt__quick" ref={root} data-side={side} onToggle={place}>
      <summary>{name}{values.length ? ` (${values.length})` : ''}</summary>
      <div className="eri-dt__quick-options">
        <label className="eri-dt__sr" htmlFor={`quick-${id}`}>Find {name.toLowerCase()}</label>
        <input id={`quick-${id}`} value={query} onChange={e => setQuery(e.target.value)} placeholder={`Find ${name.toLowerCase()}`} />
        <div className="eri-dt__quick-values">
          {shown.map(v => <label key={v}><input type="checkbox" checked={values.includes(v)} onChange={e => onChange(e.target.checked ? [...values, v] : values.filter(x => x !== v))} />{v}</label>)}
          {!shown.length && <span>No matching options</span>}
        </div>
        {!!values.length && <button type="button" className="eri-dt__button" onClick={() => onChange([])}>Clear {name.toLowerCase()}</button>}
      </div>
    </details>
  );
}

export default EriDataTable;
