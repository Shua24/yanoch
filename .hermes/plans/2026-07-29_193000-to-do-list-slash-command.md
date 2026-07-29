# To Do List Slash Command Implementation Plan

> **For Hermes:** Use subagent-driven-development skill to implement this plan task-by-task.

**Goal:** Add a "To Do List" slash command (`/todo`) that inserts an interactive borderless table widget with columns for "Thing to do", "Deadline", and "Checklist", plus an "Add" button at the bottom.

**Architecture:** A custom TipTap atom node (`todoList`) that stores rows as a JSON attribute array. The node renders as a styled borderless table managed by JS event handlers. Row data (task text, deadline, checkbox state) is stored in the node's `rows` attribute and round-trips through markdown via `createBlockMarkdownSpec`.

**Tech Stack:** TipTap (ProseMirror), vanilla JS, CSS custom properties

---

## Files changed

| File | Action |
|------|--------|
| `src/Yanoch.Web/wwwroot/js/tiptap/todo-list-node.js` | **Create** — custom TipTap node + event setup |
| `src/dist/wwwroot/js/tiptap/todo-list-node.js` | **Create** — dist mirror (identical content) |
| `src/Yanoch.Web/wwwroot/js/tiptap/slash-menu.js` | **Modify** — add `To Do List` slash item at end of `slashItems` array |
| `src/dist/wwwroot/js/tiptap/slash-menu.js` | **Modify** — identical change |
| `src/Yanoch.Web/wwwroot/js/tiptap/editor.js` | **Modify** — import `todoList-node`, register extension, call setup |
| `src/dist/wwwroot/js/tiptap/editor.js` | **Modify** — identical imports and calls |
| `src/Yanoch.Web/wwwroot/app.css` | **Modify** — add `todo-list` CSS after the `/* Toggle */` block (~line 1273) |
| `src/dist/wwwroot/app.css` | **Modify** — identical addition |
| `src/Yanoch.Web/wwwroot/js/tiptap-editor.js` | **Rebuild** — `npx vite build` regenerates this bundle automatically |

---

## Task 1: Create todo-list-node.js (custom TipTap node)

**Objective:** Define a TipTap atom node that stores a to-do list's rows as JSON and renders a borderless table.

**File:** Create `src/Yanoch.Web/wwwroot/js/tiptap/todo-list-node.js`

**Node definition (`TodoList`):**
- `name`: `'todoList'`
- `group`: `'block'`
- `atom`: `true` (void node — no ProseMirror content inside)
- `draggable`: `true`
- `attributes`: `{ rows: { default: [] } }` — array of `{checked, task, deadline}` objects
- `parseHTML`: matches `<div[data-todo-list]>`
- `renderHTML`: renders a container `<div data-todo-list="" class="todo-list">` with a nested `<div class="todo-list-inner">` as a render slot (but since it's an atom, we don't use ProseMirror content inside — the table is rendered via JS)

**Markdown serialization:** Use `createBlockMarkdownSpec` with:
- `nodeName`: `'todoList'`
- `name`: `'todoList'`
- `content`: `''` (void)
- `defaultAttributes`: `{ rows: [] }`
- `allowedAttributes`: `['rows']`
- Format: `::todo-list {rows:[...]} ::` (block-level fenced syntax)
- `toMarkdown`: serialise `rows` attribute into the fenced block
- `fromMarkdown`: parse the fenced block and reconstruct the `rows` attribute

**Interactive rendering function (`renderTodoList`):**
- Called when a todo-list node appears in the DOM (on each update)
- Finds all `[data-todo-list]` elements that haven't been initialised (`data-todo-initialised`)
- Renders a borderless table:
  - `<table class="todo-table">`
    - `<thead>`: `<tr><th>Thing to do</th><th>Deadline</th><th>Checklist</th></tr>`
    - `<tbody>`: rows from the node's `rows` attribute
      - Each row: `<tr>` with `<td><input class="todo-task" /></td><td><input class="todo-deadline" /></td><td><input type="checkbox" /></td>`
    - `<tfoot>` or after the table: `<button class="todo-add-btn">+ Add item</button>`
  - Uses `contenteditable="false"` on the container to prevent ProseMirror from interfering
  - But task/deadline cells use `<input>` elements (not contenteditable) so user can type

**Data update flow:**
- On checkbox toggle: serialise all current input values back to node attributes via a ProseMirror transaction
- On "Add" button click: append a new empty row to the rows array, re-render
- Use `updateBlockAttr`-style helper: find the editor instance containing the element, get the node position, dispatch `tr.setNodeMarkup(pos, null, { rows: newRows })`

**Global setup function (`setupTodoList`):**
- `document.addEventListener('change', handler)` — captures checkbox toggles, input changes
- `document.addEventListener('click', handler)` — captures "Add" button clicks
- Both handlers check `e.target.closest('[data-todo-list]')` first
- Debounce input changes (300ms) to avoid excessive ProseMirror transactions on every keystroke

**Exports:**
- `export const TodoList = Node.create({...})`
- `export function setupTodoList() { ... }`

---

## Task 2: Add slash command item

**Objective:** Register the "To Do List" entry in the slash command menu.

**File:** Modify `src/Yanoch.Web/wwwroot/js/tiptap/slash-menu.js`

**Change:** Add a new item at the end of the `slashItems` array (before the closing `]`):

```js
{ title: 'To Do List', desc: 'Interactive checklist table', icon: '☑', md: '', run: (e) => {
  e.chain().focus().insertContent({
    type: 'todoList',
    attrs: {
      rows: [
        { checked: false, task: '', deadline: '' },
        { checked: false, task: '', deadline: '' },
        { checked: false, task: '', deadline: '' },
      ]
    }
  }).run()
} },
```

This inserts a new todoList node with 3 empty starter rows.

**Apply identical change in:** `src/dist/wwwroot/js/tiptap/slash-menu.js`

---

## Task 3: Register node in editor.js

**Objective:** Import and register the new custom node extension, call setup function.

**File:** Modify `src/Yanoch.Web/wwwroot/js/tiptap/editor.js`

**Changes:**
1. Add import (after the page-ref-node import on line 29):
   ```js
   import { TodoList, setupTodoList } from './todo-list-node.js'
   ```

2. Register the extension (add to the extensions array, after `PageReference` on line 87):
   ```js
   TodoList,
   ```

3. Add setup call at module init (after `setupPageReferenceClicks()` on line 246):
   ```js
   setupTodoList()
   ```

**Apply identical changes in:** `src/dist/wwwroot/js/tiptap/editor.js`

---

## Task 4: Add CSS styling

**Objective:** Style the to-do list widget with borderless table, header row, inputs, checkbox, add button, and dark mode support.

**File:** Modify `src/Yanoch.Web/wwwroot/app.css`

**Insert point:** After the `/* Toggle (collapsible section) */` block (~line 1273), before the next section.

```css
/* ─── To Do List (interactive table) ────────────────────────── */
.todo-list {
    margin: 8px 0;
    padding: 8px;
    border-radius: var(--radius, 6px);
    background: var(--hover-bg, rgba(0,0,0,0.02));
    user-select: none;
}
.todo-table {
    width: 100%;
    border-collapse: collapse;
    border: none;
}
.todo-table th,
.todo-table td {
    border: none;
    padding: 6px 8px;
    text-align: left;
    font-size: 14px;
}
.todo-table thead th {
    font-weight: 600;
    color: var(--text-secondary, #888);
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    padding-bottom: 8px;
    border-bottom: 1px solid var(--border, #e0e0e0);
}
.todo-table tbody tr {
    border-bottom: 1px solid var(--border, #e0e0e0);
}
.todo-table tbody tr:last-child {
    border-bottom: none;
}
.todo-table tbody tr:hover {
    background: var(--sidebar-hover, rgba(0,0,0,0.03));
}
.todo-table input[type="text"],
.todo-table input[type="date"] {
    width: 100%;
    border: none;
    background: transparent;
    color: var(--text-primary, #1d1d1f);
    font-size: 14px;
    padding: 4px 0;
    outline: none;
    font-family: inherit;
}
.todo-table input[type="text"]::placeholder,
.todo-table input[type="date"]::placeholder {
    color: var(--text-tertiary, #bbb);
}
.todo-table input[type="checkbox"] {
    width: 18px;
    height: 18px;
    cursor: pointer;
    accent-color: var(--accent, #2383e2);
}
.todo-table td:last-child {
    width: 40px;
    text-align: center;
}
.todo-add-btn {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    margin-top: 8px;
    padding: 4px 12px;
    border: 1px dashed var(--border, #e0e0e0);
    border-radius: var(--radius, 6px);
    background: transparent;
    color: var(--text-secondary, #888);
    font-size: 13px;
    cursor: pointer;
    transition: all 0.12s;
    font-family: inherit;
}
.todo-add-btn:hover {
    border-color: var(--accent, #2383e2);
    color: var(--accent, #2383e2);
    background: rgba(35, 131, 226, 0.06);
}
```

**Dark mode overrides** (add after existing dark section blocks, ~line 1462):
```css
.dark .todo-list { background: rgba(255,255,255,0.04); }
.dark .todo-table thead th { color: var(--text-tertiary); }
.dark .todo-table tbody tr:hover { background: rgba(255,255,255,0.04); }
.dark .todo-table input[type="text"],
.dark .todo-table input[type="date"] { color: var(--text-primary); }
.dark .todo-add-btn { border-color: rgba(255,255,255,0.15); }
.dark .todo-add-btn:hover { border-color: var(--accent); }
```

**Apply identical changes in:** `src/dist/wwwroot/app.css`

---

## Task 5: Rebuild and verify

**Objective:** Regenerate the `tiptap-editor.js` bundle and verify the dist mirror is in sync.

**Step 1: Rebuild the bundle**

```bash
npx vite build
```
Expected: regenerates `src/Yanoch.Web/wwwroot/js/tiptap-editor.js`

**Step 2: Sync dist mirror**

```bash
cp src/Yanoch.Web/wwwroot/js/tiptap-editor.js src/dist/wwwroot/js/tiptap-editor.js
```

**Step 3: Verify all files are consistent**

Manually check:
- `src/Yanoch.Web/wwwroot/js/tiptap/todo-list-node.js` exists
- `src/dist/wwwroot/js/tiptap/todo-list-node.js` exists (identical)
- `src/Yanoch.Web/wwwroot/js/tiptap/slash-menu.js` has the new To Do List item
- `src/dist/wwwroot/js/tiptap/slash-menu.js` — same
- `src/Yanoch.Web/wwwroot/js/tiptap/editor.js` — imports and registers TodoList
- `src/dist/wwwroot/js/tiptap/editor.js` — same
- `src/Yanoch.Web/wwwroot/app.css` — has todo-list styles
- `src/dist/wwwroot/app.css` — same
- `src/Yanoch.Web/wwwroot/js/tiptap-editor.js` — rebuilt and synced

**Step 4: Quick smoke test**
- `diff` between paired files to confirm identity:
  ```bash
  diff src/Yanoch.Web/wwwroot/js/tiptap/slash-menu.js src/dist/wwwroot/js/tiptap/slash-menu.js
  diff src/Yanoch.Web/wwwroot/js/tiptap/editor.js src/dist/wwwroot/js/tiptap/editor.js
  diff src/Yanoch.Web/wwwroot/app.css src/dist/wwwroot/app.css
  ```

---

## Risks and open questions

1. **Input editing & ProseMirror re-rendering:** Every time the node attributes change, ProseMirror re-renders the node, which could destroy and recreate the DOM (and thus lose input focus/selection). **Mitigation:** Debounce input changes, and preserve focus position across re-renders by tracking which input was focused before the transaction and restoring it after.

2. **Markdown serialization round-trip:** The `createBlockMarkdownSpec` fenced-block format stores the entire `rows` JSON in the markdown. This means the markdown for a todo list with many items could be large and unwieldy if someone edits it manually. Acceptable for a first pass.

3. **Paste/copy behaviour:** As an atom node, pasting the todo list won't break it down into table markup — it'll be copied as-is. This is fine for the MVP.

4. **Mobile / small screens:** The three-column layout may be tight. The MVP doesn't address responsive breakpoints; that's a future enhancement.

---

## Verification

After implementation:
1. Start the app (`dotnet run` or equivalent)
2. Open any page with the editor
3. Type `/` to open the slash menu
4. Type "todo" or scroll to find "To Do List" — should appear with `☑` icon
5. Select it — a borderless 3-column table appears with 3 empty starter rows
6. Type a task in "Thing to do" column, enter a deadline, check a checkbox
7. Click "+ Add item" — a new empty row appears
8. Verify the data persists: type something, blur the editor, then re-focus — data should still be there
9. Save the page, reload — the todo list should reappear with its data intact
