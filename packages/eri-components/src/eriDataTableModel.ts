/**
 * What a sortable, filterable table does, apart from how it looks: one pure model, so a node test runs it and EriDataTable only draws it.
 * Nothing here knows about a product screen. A table declares its columns; the model sorts, filters, groups and pages the rows and reads and writes
 * its state in the page's query string, so a filtered view can be shared as a link. Moved from the ERI Platform (eri-api/frontend/src/design-system)
 * into @eri/components unchanged; added: page-level parameters (`params`), a column's `priority` and `options`, and `serverView` for server paging.
 */
import type { ReactNode } from "react"

/** A cell's sortable value. null, undefined and "" are "not known": they sort last in both directions. */
export type Cell = string | number | null | undefined
/** text: natural order (CO2 before CO10); number; date: an ISO date or time; grade: the scale in GRADE_RANK. */
export type ColumnType = "text" | "number" | "date" | "grade"
/** search: this column's text is searched by the table's search box; select: pick values (several allowed); toggle: show only the rows whose value is set. */
export type FilterKind = "search" | "select" | "toggle" | "none"

export type ColumnSpec<R> = {
  key: string
  label: string
  value: (row: R) => Cell
  /** The words of the cell for the search box and the select's options; defaults to the value as text. */
  text?: (row: R) => string
  type?: ColumnType
  /** Default true. */
  sortable?: boolean
  /** Default none. */
  filter?: FilterKind
  /** The toggle's label ("Changed by a reviewer only"). */
  toggleLabel?: string
  /** A column that is only sorted or filtered, never drawn (the block of an action, say). */
  hidden?: boolean
  /** Shown unless the reader turns it off under Columns. Default true. */
  defaultVisible?: boolean
  /** Width in pixels of the drawn column. */
  width?: number
  render?: (row: R) => ReactNode
  /** At phone width (40rem and narrower) a "low" column is not drawn as a column: its label and value fold into one line under the first cell.
   *  Default "high". A table with no low column looks the same at every width. */
  priority?: "high" | "low"
  /** The values a select offers. Default: the distinct values of the rows. Give them when the rows are one page of a server's list. */
  options?: string[]
}

export type GroupSpec<R> = { key: (row: R) => string; order?: string[]; label: (key: string, shown: number) => ReactNode }

export type Sort = { key: string; dir: "asc" | "desc" }
/** `cols` is the columns the reader chose under Columns (absent: the table's own default). `params` is the page's own filters beside the
 *  table (a portfolio, say), kept in the address under the table's prefix as `<urlKey>.p.<name>` (absent: none set). */
export type ViewState = { q: string; filters: Record<string, string[]>; sort?: Sort; page: number; cols?: string[]; params?: Record<string, string> }
export const emptyState: ViewState = { q: "", filters: {}, page: 1 }

/** Rows to a page unless a table says otherwise. A table of no more rows than this shows no paging. */
export const PAGE_SIZE = 25

/** The grade scale: not started to leading, then not relevant, then missing data, then not decided, then read again. A yes/no result sits at the ends (no lowest, yes highest). */
export const GRADE_RANK: Record<string, number> = {
  no: 0, not_started: 0, started_planning: 1, taking_action: 2, advancing: 3, leading: 4, yes: 4, not_relevant: 5, missing_data: 6, cannot_assess: 7, read_failed: 8,
}

const unknown = (v: Cell) => v === null || v === undefined || v === ""
const collator = new Intl.Collator("en", { numeric: true, sensitivity: "base" })

/** Two cells in ascending order; the caller flips it for descending and puts the unknown ones last. */
export function compareCells(type: ColumnType, a: Cell, b: Cell): number {
  if (type === "number") return Number(a) - Number(b)
  if (type === "date") return String(a).localeCompare(String(b))
  if (type === "grade") return (GRADE_RANK[String(a)] ?? 99) - (GRADE_RANK[String(b)] ?? 99)
  return collator.compare(String(a), String(b))
}

const textOf = <R,>(c: ColumnSpec<R>, row: R) => c.text ? c.text(row) : (unknown(c.value(row)) ? "" : String(c.value(row)))

/** The distinct words a select column offers, in that column's own order; a column's own `options` when it gives them. */
export function filterOptions<R>(rows: R[], c: ColumnSpec<R>): string[] {
  if (c.options) return c.options
  const seen = new Map<string, Cell>()
  for (const r of rows) { const t = textOf(c, r); if (t && !seen.has(t)) seen.set(t, c.value(r)) }
  return [...seen.entries()].sort(([ta, a], [tb, b]) => unknown(a) !== unknown(b) ? (unknown(a) ? 1 : -1) : unknown(a) ? collator.compare(ta, tb) : compareCells(c.type ?? "text", a, b) || collator.compare(ta, tb)).map(([t]) => t)
}

/** A row passes when it holds every search word in the columns marked for search, and each active select or toggle. */
export function matches<R>(row: R, columns: ColumnSpec<R>[], state: ViewState): boolean {
  const words = state.q.toLowerCase().split(/\s+/).filter(Boolean)
  if (words.length) {
    const hay = columns.filter(c => c.filter === "search").map(c => textOf(c, row)).join(" ").toLowerCase()
    if (!words.every(w => hay.includes(w))) return false
  }
  return columns.every(c => {
    const chosen = state.filters[c.key]
    if (!chosen?.length) return true
    if (c.filter === "toggle") return !unknown(c.value(row)) && c.value(row) !== 0 && c.value(row) !== "0"
    return chosen.includes(textOf(c, row))
  })
}

/** The rows in the order of the state's sort (one column; the unknown last either way), or the given order with no sort. Groups keep their order. */
export function sortRows<R>(rows: R[], columns: ColumnSpec<R>[], sort?: Sort): R[] {
  const c = sort && columns.find(x => x.key === sort.key)
  if (!c || !sort) return rows
  const sign = sort.dir === "asc" ? 1 : -1
  return rows.map((row, i) => ({ row, i, v: c.value(row) })).sort((x, y) =>
    unknown(x.v) !== unknown(y.v) ? (unknown(x.v) ? 1 : -1) : unknown(x.v) ? x.i - y.i : sign * compareCells(c.type ?? "text", x.v, y.v) || x.i - y.i).map(x => x.row)
}

export type View<R> = { groups: { key: string; rows: R[] }[]; shown: number; total: number; page: number; pages: number; paged: boolean; first: number; last: number }

/** The rows to draw: filtered, grouped (the group order given, others after in first-seen order), sorted inside each group, and cut to the page. */
export function buildView<R>(rows: R[], columns: ColumnSpec<R>[], state: ViewState, group?: GroupSpec<R>, pageSize = PAGE_SIZE): View<R> {
  const kept = rows.filter(r => matches(r, columns, state))
  const keys: string[] = [...(group?.order ?? [])]
  const byKey = new Map<string, R[]>()
  for (const r of kept) {
    const k = group ? group.key(r) : ""
    if (!byKey.has(k)) byKey.set(k, [])
    byKey.get(k)!.push(r)
    if (!keys.includes(k)) keys.push(k)
  }
  const ordered = keys.filter(k => byKey.has(k)).map(k => ({ key: k, rows: sortRows(byKey.get(k)!, columns, state.sort) }))
  const flat = ordered.flatMap(g => g.rows.map(row => ({ k: g.key, row })))
  const paged = flat.length > pageSize
  const pages = paged ? Math.ceil(flat.length / pageSize) : 1
  const page = Math.min(Math.max(1, state.page), pages)
  const slice = paged ? flat.slice((page - 1) * pageSize, page * pageSize) : flat
  const groups: { key: string; rows: R[] }[] = []
  for (const { k, row } of slice) { const last = groups[groups.length - 1]; if (last && last.key === k) last.rows.push(row); else groups.push({ key: k, rows: [row] }) }
  return { groups, shown: kept.length, total: rows.length, page, pages, paged, first: slice.length ? (paged ? (page - 1) * pageSize : 0) + 1 : 0, last: (paged ? (page - 1) * pageSize : 0) + slice.length }
}

/**
 * Server paging: `rows` is the one page the server sent, already filtered, sorted and cut by it; `total` is how many rows match the view in all.
 * The rows are drawn in the order given (grouped as they come); the paging line counts `total`.
 */
export function serverView<R>(rows: R[], total: number, state: ViewState, group?: GroupSpec<R>, pageSize = PAGE_SIZE): View<R> {
  const count = Math.max(0, total)
  const paged = count > pageSize
  const pages = paged ? Math.ceil(count / pageSize) : 1
  const page = Math.min(Math.max(1, state.page), pages)
  const groups: { key: string; rows: R[] }[] = []
  for (const row of rows) { const k = group ? group.key(row) : ""; const last = groups[groups.length - 1]; if (last && last.key === k) last.rows.push(row); else groups.push({ key: k, rows: [row] }) }
  const first = rows.length ? (page - 1) * pageSize + 1 : 0
  return { groups, shown: count, total: count, page, pages, paged, first, last: rows.length ? first + rows.length - 1 : 0 }
}

/** Ascending, then descending, then back to the table's own order. */
export function nextSort(current: Sort | undefined, key: string): Sort | undefined {
  if (!current || current.key !== key) return { key, dir: "asc" }
  return current.dir === "asc" ? { key, dir: "desc" } : undefined
}

// ---- the page's query string -----------------------------------------------------------------------------------------------------------------
// With urlKey "t": t.q=…, t.f.<column>=value (repeated for several), t.sort=<column>:asc|desc, t.page=2, t.cols=a,b, and the page's own filters
// t.p.<name>=value. Other parameters are left alone.

const own = (urlKey: string, name: string) => name === `${urlKey}.q` || name === `${urlKey}.sort` || name === `${urlKey}.page` || name === `${urlKey}.cols` || name.startsWith(`${urlKey}.f.`) || name.startsWith(`${urlKey}.p.`)

export function parseState<R>(search: string, urlKey: string, columns: ColumnSpec<R>[]): ViewState {
  const p = new URLSearchParams(search)
  const filters: Record<string, string[]> = {}
  for (const c of columns) {
    if (c.filter !== "select" && c.filter !== "toggle") continue
    const values = p.getAll(`${urlKey}.f.${c.key}`).filter(Boolean)
    if (values.length) filters[c.key] = c.filter === "toggle" ? ["1"] : values
  }
  const [key, dir] = (p.get(`${urlKey}.sort`) ?? "").split(":")
  const sortable = columns.find(c => c.key === key && c.sortable !== false)
  const page = Number(p.get(`${urlKey}.page`))
  const cols = (p.get(`${urlKey}.cols`) ?? "").split(",").filter(k => columns.some(c => c.key === k && !c.hidden))
  const params: Record<string, string> = {}
  for (const [name, value] of p) if (name.startsWith(`${urlKey}.p.`) && value && name.length > urlKey.length + 3) params[name.slice(urlKey.length + 3)] = value
  return { q: p.get(`${urlKey}.q`) ?? "", filters, ...(cols.length ? { cols } : {}), ...(Object.keys(params).length ? { params } : {}), ...(sortable && (dir === "asc" || dir === "desc") ? { sort: { key, dir } } : {}), page: Number.isInteger(page) && page > 1 ? page : 1 }
}

/** The query string (with its "?", or "" when empty) for `state`, keeping every parameter that is not this table's. */
export function writeState(search: string, urlKey: string, state: ViewState): string {
  const p = new URLSearchParams(search)
  for (const name of [...new Set([...p.keys()])]) if (own(urlKey, name)) p.delete(name)
  if (state.q) p.set(`${urlKey}.q`, state.q)
  for (const [key, values] of Object.entries(state.filters)) for (const v of values) p.append(`${urlKey}.f.${key}`, v)
  if (state.sort) p.set(`${urlKey}.sort`, `${state.sort.key}:${state.sort.dir}`)
  if (state.page > 1) p.set(`${urlKey}.page`, String(state.page))
  if (state.cols) p.set(`${urlKey}.cols`, state.cols.join(","))
  for (const [name, value] of Object.entries(state.params ?? {})) if (value) p.set(`${urlKey}.p.${name}`, value)
  const s = p.toString()
  return s ? `?${s}` : ""
}

export const isFiltered = (s: ViewState) => !!s.q || Object.values(s.filters).some(v => v.length > 0)
