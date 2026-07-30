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

---

## To Do: Syntax-Highlighted Code Blocks with Language Labels

### Goal

Fenced markdown code blocks with a language label (e.g. `` ```python ``, `` ```csharp ``) should render with syntax highlighting inside the TipTap editor. The feature already has a partially implemented `code-block.js` that registers highlight.js languages and creates a `codeBlockHighlight` extension — it just needs to be wired in, have its dependency added, and get CSS styles.

### Background

The TipTap `StarterKit` already includes a `codeBlock` node that understands fenced markdown syntax (triple-backtick + optional language label) and stores the language in `node.attrs.language`. The `code-block.js` file under `src/Yanoch.Web/wwwroot/js/tiptap/` registers roughly 20 languages with highlight.js and defines a `CodeBlockHighlight` ProseMirror plugin that applies highlighting to `<pre><code>` elements on every doc/selection/viewport update. What is missing is:

1. `highlight.js` is **not listed in `package.json`** — the import in `code-block.js` will fail at build time
2. `CodeBlockHighlight` is **not imported or added to the extensions array** in `editor.js`
3. **No highlight.js CSS** is loaded — highlighting classes (`.hljs`, `.language-python`, `.token.keyword`, etc.) have no styles
4. `src/dist/` mirrors are not yet updated to include the feature

### Design

- **Language labels** use standard fenced-code-block markdown: triple-backtick + language name (e.g. `` ```python ``) — renders with a `language-python` class on the `<code>` element, set automatically by StarterKit's `codeBlock` node via `languageClassPrefix: 'language-'`
- **Highlighting** is applied by the `CodeBlockHighlight` ViewPlugin, which runs `hljs.highlightElement()` on every visible `<pre><code>` block once, then caches it in a `WeakSet` so the same node is never re-highlighted
- **Lazy approach** (already implemented in `code-block.js`): highlighting triggers only when new nodes enter the viewport, not on every keystroke
- **Round-trip**: the saved markdown preserves the language label (e.g. `` ```csharp ``), so highlight state is not serialized — it's purely a view-layer concern

### Implementation — What to change

#### 1. `package.json`

Add `highlight.js` as a dependency (the project already imports it in `code-block.js` but it's not declared):

```bash
npm install highlight.js
```

This registers it so Vite can resolve the `highlight.js` imports in `code-block.js`.

#### 2. `src/Yanoch.Web/wwwroot/js/tiptap-editor.js` (editor entry point)

Import and add `CodeBlockHighlight` to the extensions array:

```js
import { CodeBlockHighlight } from './tiptap/code-block.js'
```

Place `CodeBlockHighlight` in the `extensions: [...]` array in `createEditor()`, anywhere after the `StarterKit` block:

```js
StarterKit.configure({
  codeBlock: true,
  heading: { levels: [1, 2, 3] },
}),
CodeBlockHighlight,
```

> **Note:** `StarterKit` with `codeBlock: true` already registers the `codeBlock` node with `language` attribute support. `CodeBlockHighlight` is the companion plugin that adds the actual highlighting to the DOM. Both are needed.

#### 3. `src/Yanoch.Web/wwwroot/js/tiptap/code-block.js`

This file is already complete and correct — no changes needed. It:
- Registers 20 languages with highlight.js (`javascript`, `typescript`, `python`, `java`, `csharp`, `cpp`, `css`, `html`, `json`, `bash`, `sql`, `yaml`, `markdown`, `diff`, `go`, `rust`, `ruby`, `php`)
- Exports `CodeBlockHighlight` extension with a `ViewPlugin` that highlights visible blocks once and caches them in a `WeakSet`
- Falls back to auto-detection for languages not explicitly registered

If more languages are needed later, add imports and `hljs.registerLanguage()` calls following the existing pattern.

#### 4. `src/Yanoch.Web/wwwroot/app.css`

Add highlight.js base styles and a dark-mode override. The highlight.js library adds a `.hljs` class to the `<code>` element (and language-specific classes like `.language-python` to the `<code>` as well). Only `.hljs` is needed for a functional baseline:

```css
/* ─── Code Block Highlighting ─────────────── */
.tiptap-editor .hljs {
    display: block;
    padding: 16px;
    overflow-x: auto;
    border-radius: var(--radius);
    font-size: 13px;
    line-height: 1.5;
    background: var(--code-bg);
}
```

**Dark mode:** highlight.js auto-detects dark backgrounds and adjusts token colours. If token contrast is insufficient in dark mode, import a highlight.js theme CSS (e.g. `highlight.js/styles/atom-one-dark.css`) and serve it alongside the library, or add an explicit dark override:

```css
.dark .tiptap-editor .hljs {
    background: var(--code-bg);
}
```

For full accuracy across themes the cleanest route is to import a highlight.js theme CSS in the editor bundle and configure it in `code-block.js` with `hljs.configure({ theme: 'atom-one-dark' })`. That is a follow-up consideration — the minimal CSS above gets the feature working and leaves room to refine theming later.

#### 5. `src/dist/wwwroot/app.css` (mirror file)

Copy the same CSS addition. Keep this file in sync — it is the deployed bundle's CSS.

#### 6. `src/dist/wwwroot/js/tiptap-editor.js` (mirror at `src/dist/`)

This is the built output from Vite. After editing the source files above, run `npx vite build` to regenerate it. The `code-block.js` imports and `CodeBlockHighlight` registration will be bundled into the output. Both the source and dist bundles must have the feature.

### Files to touch (for this feature)

| File | Reason |
|------|--------|
| `package.json` | Add `highlight.js` dependency (and run `npm install`) |
| `src/Yanoch.Web/wwwroot/js/tiptap/editor.js` | Import `CodeBlockHighlight` and add it to the extensions array |
| `src/Yanoch.Web/wwwroot/js/tiptap/code-block.js` | No changes needed — already complete |
| `src/Yanoch.Web/wwwroot/app.css` | Add `.hljs` highlighting styles + dark-mode override |
| `src/dist/wwwroot/app.css` | Mirror the CSS changes |
| `src/dist/wwwroot/js/tiptap-editor.js` | Rebuild via `npx vite build` (mirrors the bundled source) |

### Verification

1. Run `npm install` to pick up the new highlight.js dependency
2. Run `npx vite build` to rebuild the TipTap bundle (this also updates `src/dist/`)
3. Open a page with a fenced code block using a language label (`` ```python ``)
4. The code block should render with coloured tokens inside the editor (highlight.js applies `.hljs` + token classes)
5. Switch to dark mode → code block background should remain readable
6. Edit the code block → highlighting should apply to newly typed content
7. Save the page → reload → language label and highlighting are preserved (language stored in node attrs, highlighting reapplied on load)
8. Try an unregistered language (e.g. `` ```elixir ``) → highlight.js auto-detects the language and still highlights with a reasonable token set

## Notes

- No server-side changes needed; this is entirely client-side
- The `src/dist/` directory is tracked in git (it is the built/deployed output) and must be rebuilt after any source edits
- The `codeBlock` node is already part of StarterKit — the language label in fenced markdown (`` ```python ``) is parsed to `node.attrs.language` automatically; no extra work needed there
- highlight.js auto-detection is the fallback for languages not explicitly registered; auto-registration of common languages is built into the library
- If adding new languages later, follow the same pattern in `code-block.js`: `import x from 'highlight.js/lib/languages/x'` + `hljs.registerLanguage('x', x)`
- The existing `stopEvent` pattern and `.todo-` prefixed styles are unrelated to this feature — no interference expected

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
