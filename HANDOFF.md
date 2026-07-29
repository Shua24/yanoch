# Yanoch — Handoff Document

## Current State

Editor engine is **TipTap** (ProseMirror) via JS interop hosted in Blazor Server. Content model is a single markdown string in `Page.Content`. The to-do list feature exists as a custom `todoList` TipTap node that renders an interactive 3-column table (Task, Deadline, Checklist checkbox). Each row is `{ checked, task, deadline }`. All rows are rendered together — there is **no filtering UI** to separate completed from pending items.

---

## To Do: To-Do List Table Filtering — Done vs Not Done

### Goal

Add a toggle/filter bar above the to-do list table that lets the user filter rows to show **all**, **done only**, or **not done only**. The filter state is local to the node — it does not affect the saved markdown data.

### Design

- **Filter bar** rendered above the `<table>` in `buildTableHTML()`: three pill buttons — `All`, `Done`, `Not done`.
- **Active pill** is visually highlighted (e.g. filled background).
- **Filtering is instant** — no save/debounce needed, purely client-side DOM filtering. Checking/unchecking a checkbox updates the DOM immediately and also keeps filter state consistent (if a row is checked while viewing "Not done", it disappears from view).
- **Hidden rows** stay in the node data (`rows` array) untouched — only the DOM view is filtered. This means the saved markdown is never affected.

### Implementation — What to change

#### 1. `src/Yanoch.Web/wwwroot/js/tiptap/todo-list-node.js`

**`buildTableHTML(rows)`** — add filter bar markup before the table:

```html
<div class="todo-filter">
  <button class="todo-filter-btn active" data-filter="all">All</button>
  <button class="todo-filter-btn" data-filter="done">Done</button>
  <button class="todo-filter-btn" data-filter="open">Not done</button>
</div>
```

**`render()` (inside `addNodeView`)** — after `dom.innerHTML = buildTableHTML(...)`, wire up filter button click handlers that toggle a `data-active-filter` attribute on `dom` and show/hide `<tr>` elements in `<tbody>`:

```js
dom.querySelectorAll('.todo-filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    dom.querySelectorAll('.todo-filter-btn').forEach(b => b.classList.remove('active'))
    btn.classList.add('active')
    const filter = btn.dataset.filter
    dom.querySelectorAll('tbody tr').forEach(tr => {
      const checked = tr.querySelector('input[type="checkbox"]')?.checked
      tr.style.display =
        filter === 'all' ? '' :
        filter === 'done' ? (checked ? '' : 'none') :
        (!checked ? '' : 'none')
    })
  })
})
```

**`stopEvent`** — add `.todo-filter-btn` so click events on filter buttons don't get swallowed (similar to how `.todo-add-btn` and inputs are already excluded).

#### 2. `src/Yanoch.Web/wwwroot/app.css`

Add filter bar styles (light + dark):

```css
/* ─── To Do Filter Bar ─────────────────────────── */
.todo-filter {
    display: flex;
    gap: 4px;
    margin-bottom: 8px;
}
.todo-filter-btn {
    padding: 3px 10px;
    border: 1px solid var(--border, #e0e0e0);
    border-radius: 999px;
    background: transparent;
    color: var(--text-secondary, #888);
    font-size: 12px;
    cursor: pointer;
    font-family: inherit;
    transition: all 0.12s;
}
.todo-filter-btn.active {
    background: var(--accent, #2383e2);
    color: #fff;
    border-color: var(--accent, #2383e2);
}
.todo-filter-btn:hover:not(.active) {
    background: var(--hover-bg, rgba(0,0,0,0.03));
}

/* Dark mode */
.dark .todo-filter-btn {
    border-color: rgba(255,255,255,0.15);
    color: var(--text-tertiary);
}
.dark .todo-filter-btn.active {
    background: var(--accent, #2383e2);
    border-color: var(--accent, #2383e2);
}
```

#### 3. `src/dist/wwwroot/app.css` (mirror file)

Copy the same CSS additions as above. Keep this file in sync — it is the deployed bundle's CSS.

#### 4. `src/Yanoch.Web/wwwroot/js/tiptap/todo-list-node.js` (mirror at `src/dist/`)

The `todo-list-node.js` under `src/dist/wwwroot/js/tiptap/` is a tracked mirror of the source under `src/Yanoch.Web/wwwroot/js/tiptap/`. Both must be edited identically.

---

## Files to touch

| File | Reason |
|------|--------|
| `src/Yanoch.Web/wwwroot/js/tiptap/todo-list-node.js` | Add filter bar UI + filtering logic to the node |
| `src/Yanoch.Web/wwwroot/app.css` | Add `.todo-filter` / `.todo-filter-btn` styles |
| `src/dist/wwwroot/app.css` | Mirror the CSS changes (deployed bundle) |
| `src/dist/wwwroot/js/tiptap/todo-list-node.js` | Mirror the JS changes (deployed bundle) |

## How it fits in the existing todo-list node

The current node data shape is unchanged — `rows: [{ checked, task, deadline }]`. The filter bar is purely a view-layer addition; it reads `checked` from each row's checkbox to decide visibility but never mutates the data array. Markdown export via `createBlockMarkdownSpec` continues to serialize all rows as-is, so saved content is unaffected.

## Verification

1. Create a page with a to-do list containing a mix of checked and unchecked items.
2. Click each filter pill — only matching rows should be visible.
3. Switch filter while a row is visible → row should hide/show instantly.
4. Check/uncheck a row while a filter is active → row should appear/disappear in real time.
5. Save the page → reload → all rows present (no data loss), filter state resets (default "All").
6. Toggle dark mode → filter pill styles should adapt automatically.
7. Confirm `src/dist/` mirrors are synced.

## Notes

- No server-side changes needed; this is entirely client-side.
- The `src/dist/` directory is tracked in git (it is the built/deployed output) and must be kept in sync with `src/Yanoch.Web/wwwroot/` — same as the CSS mirror.
- The existing `stopEvent` pattern (used for `.todo-add-btn`, `input`, `td`) should be extended to `.todo-filter-btn` so clicking filter pills doesn't accidentally trigger editor-level event handlers.
