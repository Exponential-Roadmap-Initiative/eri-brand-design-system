import assert from "node:assert/strict"
import test from "node:test"
// Moved with the table from the ERI Platform (design-system/eriDataTable.test.mjs), unchanged; the last four tests are new in 2.21.0.
// Run: node --test packages/eri-components/test/
import { buildView, filterOptions, nextSort, parseState, serverView, writeState, emptyState, PAGE_SIZE } from "../src/eriDataTableModel.ts"

const columns = [
  { key: "code", label: "Code", value: r => r.code, filter: "search" },
  { key: "grade", label: "Grade", type: "grade", value: r => r.grade, text: r => r.grade ?? "Not known", filter: "select" },
  { key: "n", label: "N", type: "number", value: r => r.n },
  { key: "on", label: "On", value: r => r.on, filter: "toggle", toggleLabel: "On only", hidden: true, sortable: false },
]
const rows = [
  { code: "CO10", grade: "yes", n: 3, on: 1, g: "co" }, { code: "CO2", grade: "no", n: null, on: 0, g: "co" }, { code: "P1:1", grade: "leading", n: 1, on: 1, g: "p1" },
  { code: "P1:2", grade: "cannot_assess", n: 2, on: 0, g: "p1" }, { code: "P1:3", grade: "not_relevant", n: 5, on: 0, g: "p1" }, { code: "P1:4", grade: "not_started", n: 4, on: 0, g: "p1" },
  { code: "P1:5", grade: null, n: 0, on: 0, g: "p1" },
]
const group = { key: r => r.g, order: ["co", "p1"], label: k => k }
const order = (v) => v.groups.flatMap(g => g.rows.map(r => r.code))

test("sorts one column at a time: ascending, descending, then the table's own order; codes in natural order; unknown values last both ways", () => {
  assert.deepEqual(order(buildView(rows, columns, { ...emptyState, sort: { key: "code", dir: "asc" } })), ["CO2", "CO10", "P1:1", "P1:2", "P1:3", "P1:4", "P1:5"])   // CO2 before CO10
  assert.deepEqual(order(buildView(rows, columns, { ...emptyState, sort: { key: "n", dir: "asc" } }, group)), ["CO10", "CO2", "P1:5", "P1:1", "P1:2", "P1:4", "P1:3"])   // inside the groups; CO2's unknown N last
  assert.deepEqual(order(buildView(rows, columns, { ...emptyState, sort: { key: "n", dir: "desc" } }, group)), ["CO10", "CO2", "P1:3", "P1:4", "P1:2", "P1:1", "P1:5"])
  assert.equal(nextSort(undefined, "n").dir, "asc"); assert.equal(nextSort({ key: "n", dir: "asc" }, "n").dir, "desc"); assert.equal(nextSort({ key: "n", dir: "desc" }, "n"), undefined)
  assert.equal(nextSort({ key: "n", dir: "desc" }, "code").dir, "asc")                                                          // another column starts again
  assert.deepEqual(order(buildView(rows, columns, emptyState)), rows.map(r => r.code))                                          // no sort: the given order
})

test("grades sort on the scale: not started to leading, then not relevant, then cannot assess; not known last", () => {
  assert.deepEqual(order(buildView(rows.filter(r => r.g === "p1"), columns, { ...emptyState, sort: { key: "grade", dir: "asc" } })), ["P1:4", "P1:1", "P1:3", "P1:2", "P1:5"])
  assert.deepEqual(order(buildView(rows.filter(r => r.g === "p1"), columns, { ...emptyState, sort: { key: "grade", dir: "desc" } })), ["P1:2", "P1:3", "P1:1", "P1:4", "P1:5"])
})

test("search words all must match the search columns; selects take several values; a toggle keeps rows whose value is set; the counts are of the whole table", () => {
  assert.deepEqual(order(buildView(rows, columns, { ...emptyState, q: "p1 :3" })), ["P1:3"])
  assert.deepEqual(order(buildView(rows, columns, { ...emptyState, filters: { grade: ["yes", "no"] } })), ["CO10", "CO2"])         // the select matches the words the column shows
  const v = buildView(rows, columns, { ...emptyState, filters: { grade: ["yes", "no", "leading"] }, q: "p1" })
  assert.deepEqual([v.shown, v.total], [1, 7])                                                                                   // filters and search together; "of 7" is the whole table
  assert.deepEqual(order(buildView(rows, columns, { ...emptyState, filters: { on: ["1"] } })), ["CO10", "P1:1"])
})

test("the options of a select follow that column's order; groups keep their order and drop when empty", () => {
  const opts = filterOptions(rows, columns[1])
  assert.ok(opts.indexOf("no") < opts.indexOf("leading") && opts.indexOf("leading") < opts.indexOf("not_relevant") && opts.indexOf("not_relevant") < opts.indexOf("cannot_assess"))
  assert.deepEqual(buildView(rows, columns, { ...emptyState, q: "CO" }, group).groups.map(g => g.key), ["co"])
})

test("the state lives in the address under the table's prefix, leaves other parameters alone, and ignores what the table does not have", () => {
  const state = { q: "board", filters: { grade: ["yes", "no"], on: ["1"] }, sort: { key: "n", dir: "desc" }, page: 3 }
  const search = writeState("?tab=grades&other=1", "actions", state)
  assert.match(search, /^\?tab=grades&other=1&/)
  assert.deepEqual(parseState(search, "actions", columns), state)
  assert.equal(writeState(search, "actions", emptyState), "?tab=grades&other=1")                                                  // clearing removes only this table's parameters
  assert.equal(writeState("", "actions", emptyState), "")
  assert.deepEqual(parseState("?actions.sort=on:asc&actions.f.nope=x&actions.page=abc", "actions", columns), emptyState)         // an unsortable column, an unknown filter, a bad page
  assert.deepEqual(parseState("?b.q=x", "a", columns), emptyState)                                                              // another table's parameters
})

test("pages of 25 (or the table's own size); a table no longer than a page shows no paging; the page line counts the rows that match", () => {
  const many = Array.from({ length: 2 * PAGE_SIZE + 10 }, (_, i) => ({ code: `X${i}`, grade: "yes", n: i, on: 0, g: "p1" }))
  const v = buildView(many, columns, { ...emptyState, page: 3 })
  assert.deepEqual([v.paged, v.pages, v.page, order(v).length, v.first, v.last, v.shown], [true, 3, 3, 10, 51, 60, 60])
  assert.equal(buildView(rows, columns, emptyState).paged, false)
  assert.equal(buildView(many, columns, { ...emptyState, page: 99 }).page, 3)                                                    // a page past the end is the last
  assert.deepEqual([buildView(many, columns, emptyState, undefined, 100).paged, buildView([], columns, emptyState).first], [false, 0])
})

test("the columns the reader chose are in the address, and only real, drawn columns count", () => {
  assert.deepEqual(parseState("?t.cols=code,n,nope,on", "t", columns).cols, ["code", "n"])
  assert.equal(parseState("?t.cols=nope", "t", columns).cols, undefined)
  assert.match(writeState("", "t", { ...emptyState, cols: ["code", "n"] }), /t\.cols=code%2Cn/)
})

test("server paging: the rows are one page, drawn in the order given; the paging line counts the total", () => {
  const page2 = Array.from({ length: PAGE_SIZE }, (_, i) => ({ code: `X${PAGE_SIZE + i}`, g: i < 3 ? "co" : "p1" }))
  const v = serverView(page2, 60, { ...emptyState, page: 2 }, group)
  assert.deepEqual([v.paged, v.pages, v.page, v.first, v.last, v.shown, v.total], [true, 3, 2, 26, 50, 60, 60])
  assert.deepEqual(v.groups.map(g => [g.key, g.rows.length]), [["co", 3], ["p1", 22]])                                         // grouped as they come, never re-sorted
  assert.deepEqual(order(serverView(page2, 60, { ...emptyState, sort: { key: "code", dir: "desc" }, page: 2 })), page2.map(r => r.code))
  assert.equal(serverView([], 0, { ...emptyState, page: 4 }).page, 1)                                                           // no rows: page 1, "0 results"
  assert.deepEqual([serverView([], 0, emptyState).first, serverView([], 0, emptyState).last], [0, 0])
  assert.equal(serverView(rows, 7, { ...emptyState, page: 9 }).page, 1)                                                       // a page past the end is the last
})

test("page-level filters live in the address as <urlKey>.p.<name>, beside the table's own state, and clear with it", () => {
  const state = { ...emptyState, params: { portfolio: "members-2026" }, page: 2 }
  const search = writeState("?tab=1", "t", state)
  assert.match(search, /t\.p\.portfolio=members-2026/)
  assert.deepEqual(parseState(search, "t", columns), state)
  assert.equal(writeState(search, "t", emptyState), "?tab=1")                                                                   // the table's parameters only
  assert.deepEqual(parseState("?t.p.=x&t.p.a=&u.p.b=1", "t", columns), emptyState)                                            // no name, no value, another table
})

test("a column's own options are what its select offers (rows that are one page cannot list them)", () => {
  assert.deepEqual(filterOptions(rows.slice(0, 1), { ...columns[1], options: ["Yes", "No", "Not known"] }), ["Yes", "No", "Not known"])
})

test("the 2.21.0 additions leave the old state unchanged: no params, no priority, the same address", () => {
  const old = { q: "board", filters: { grade: ["yes"] }, sort: { key: "n", dir: "asc" }, page: 2, cols: ["code"] }
  assert.deepEqual(parseState(writeState("", "actions", old), "actions", columns), old)
  assert.equal(writeState("", "actions", old), "?actions.q=board&actions.f.grade=yes&actions.sort=n%3Aasc&actions.page=2&actions.cols=code")
})
