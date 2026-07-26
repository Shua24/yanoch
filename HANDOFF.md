# Yanoch — Handoff Document (Updated 2026-07-26)

## Current State

Editor engine swapped from `<div contenteditable>` + block CRUD → **TipTap** (ProseMirror) via JS interop. **Blazor Server stays** as the host. Content model changed from per-block DB rows to **markdown string** in `Page.Content`.

---

## The Three Requirements

| # | Requirement | Implementation |
|---|-------------|---------------|
| 1 | **Markdown as source of truth** | `Page.Content` — single `TEXT` column replaces `Block` table per-block rows |
| 2 | **TipTap as editor engine** | `tiptap-editor.js` (Vite bundle from `tiptap-editor.src.js`) mounts on `<div id="tiptap-editor">` |
| 3 | **Keep Blazor Server + .NET stack** | TipTap via JS interop (`initTipTap`/`destroyTipTap`/`OnMarkdownChanged`), backend, auth, sidebar, page tree — unchanged |

---

## Architecture

```
Blazor Server page (Editor.razor)
  │
  ├── .NET initialization → IJSRuntime.InvokeAsync("initTipTap", pageId)
  │
  ├── TipTap Editor (ProseMirror) in browser
  │     ├── markdown shortcuts (# → H1, * → list, etc.)
  │     ├── slash command menu (pure DOM plugin, not @tiptap/suggestion)
  │     ├── wiki link [[ autocomplete (pure DOM plugin)
  │     ├── image upload / paste / drag-drop
  │     └── auto-save (debounced, calls DotNet.invokeMethodAsync)
  │
  ├── OnMarkdownChanged → C# receives markdown string
  │     └── debounced PUT /api/pages/{id}/content
  │
  └── Rest of page (sidebar, search, account) — unchanged Blazor Server
```

---

## What Changed

| Aspect | Before | After |
|--------|--------|-------|
| **Editor engine** | `<div contenteditable>` + custom JS interop | **TipTap** (markdown-based, ProseMirror) |
| **Content model** | `Block` table (one row per block, sort order) | `Page.Content` — single markdown `TEXT` column |
| **Editor component** | `BlockEditor.razor` (10+ block types, edit/view modes) | `<div id="tiptap-editor">` — TipTap mounts here |
| **Save path** | `MergePageInPlace` + block CRUD per keystroke | Debounced `PUT /api/pages/{id}/content` |
| **Slash menu** | Custom JS interop context menu | TipTap plugin — pure DOM, no `@tiptap/suggestion` |
| **Wiki links** | Custom regex in view render | TipTap plugin — pure DOM, scans `[[` on input |
| **JS interop** | `interop.js` (block DnD, context menu, slash) | `tiptap-editor.js` (bundled TipTap + custom plugins) |

---

## Features Retained (All Working)

- Blazor Server host, auth, sidebar, page tree, wiki links, backlinks, search, image upload, dark mode, responsive layout, soft delete, SQLite, REST API endpoints

## Notion-Like Features in TipTap

| Feature | How | Status |
|---------|-----|--------|
| **Slash command menu** | Type `/` → popup — pure DOM plugin, no `@tiptap/suggestion` | ✅ Fixed |
| **Wiki link `[[`** | Typing `[[` → suggestion popup — pure DOM plugin | ✅ Fixed |
| **Image upload** | 🖼️ button → file picker → `/api/upload` → inserts `![](url)` | ✅ |
| **Paste/drop image** | Paste or drag image file → auto-upload + insert | ✅ |
| **Image URL paste** | Paste image URL → inline embed | ✅ |
| **Task lists** | `/task` or markdown `[ ]` / `[x]` | ✅ |
| **Markdown shortcuts** | `#`/`##`/`###` → H1-3, `*`/`-` → list, `>` → quote, `` ``` `` → code | ✅ |
| **Code block** | `` ``` `` or slash command → fenced code block | ✅ |
| **Auto-save** | Debounced 800ms → `PUT /api/pages/{id}/content` | ✅ |
| **Dark mode** | Inherits existing CSS variables | ✅ |
| **Wiki link backlinks** | Extracted from markdown on save | ✅ |
| **Placeholder** | `Start writing...` when empty | ✅ |

---

## Files Modified

| File | Change |
|------|--------|
| `src/Yanoch.Domain/Models/Page.cs` | Added `Content` property |
| `src/Yanoch.Infrastructure/Data/AppDbContext.cs` | Added `Content` column config |
| `src/Yanoch.Infrastructure/Migrations/*_AddPageContent.cs` | Migration for `Content` column |
| `src/Yanoch.Infrastructure/Data/Repositories/PageRepository.cs` | `GetContentAsync`, `SetContentAsync`; search queries `Content` |
| `src/Yanoch.Domain/Interfaces/IPageRepository.cs` | Added content interfaces |
| `src/Yanoch.Application/Interfaces/IPageService.cs` | Added content interfaces |
| `src/Yanoch.Application/Services/PageService.cs` | `GetContentAsync`, `SetContentAsync` with backlink extraction; `CreateAsync` sets `Content`; search uses `Content` |
| `src/Yanoch.Application/DTOs/PageDto.cs` | Added `Content` property |
| `src/Yanoch.Application/DTOs/CreatePageDto.cs` | Replaced `Blocks` with `Content` |
| `src/Yanoch.Application/DTOs/SetContentDto.cs` | **New** — DTO for content save |
| `src/Yanoch.Web/Controllers/Api/PagesController.cs` | Added `GET/PUT /{id}/content` endpoints |
| `src/Yanoch.Web/Components/Pages/Editor.razor` | Rewritten — TipTap JS interop |
| `src/Yanoch.Web/Components/App.razor` | Added `<script>` for tiptap-editor.js |
| `src/Yanoch.Web/wwwroot/js/tiptap-editor.src.js` | **New** — TipTap source (npm imports, custom plugins) |
| `src/Yanoch.Web/wwwroot/js/tiptap-editor.js` | **New** — Vite bundle output |
| `vite.config.js` | **New** — Vite build config |
| `package.json` | **New** — npm deps (TipTap packages, Vite) |
| `.gitignore` | Added `node_modules/` and `src/dist/` |
| `src/Yanoch.Web/wwwroot/app.css` | Added `.editor-tiptap` and `.tiptap-editor` styles |

---

## Build & Run

### Required steps (always — unless `tiptap-editor.js` is already built):

```bash
cd D:\Sourcecodes\Yanoch
npm install              # install TipTalk deps (node_modules/)
npx vite build           # build tiptap-editor.src.js → tiptap-editor.js
dotnet run --project src/Yanoch.Web
# http://localhost:5072
```

**Important**: `npm install` and `npx vite build` are **required** after fresh clone or pull — the editor bundle is built from source. `tiptap-editor.js` is the Vite bundle (~560KB); it's tracked in git but the **compiled output** may be stale after source changes.

### After pull (if only source changed, deps already installed):

```bash
npx vite build
dotnet run
```

### Cache-busting

If `tiptap-editor.src.js` is updated, rebuild with `npx vite build` — no manual version bump needed for the JS file (Vite outputs stable hash). If the API endpoints or DTOs change, rebuild normally with `dotnet build`.

---

## Upcoming Features — Implementation Plan

### 1. Movable Blocks (Drag Handle + Gap Cursor)

**Status:** ⬜ Not started

**Goal:** Drag handle on left gutter of each block → drag to reorder. ProseMirror-native (no DOM reordering).

**Approach:** `@tiptap/extension-drag-handle` + `@tiptap/extension-gapcursor`.

**Install:**
```bash
npm install @tiptap/extension-drag-handle @tiptap/extension-gapcursor
```

**Changes:**
- Add `DragHandle` to extensions array (basic: no custom render, locked=false, nested=true)
- Add `GapCursor` to extensions array (enables clicking between blocks to insert)
- CSS: `.drag-handle` styles, gutters, hover reveal
- Slash menu's insert-at-cursor logic remains unchanged; drag handle is purely visual DnD
- `nested: true` enables dragging list items inside lists

**Markdown impact:** None. Drag handle is a UI-only ProseMirror feature; the document structure stays the same.

**Risk:** Low. Well-documented official TipTap extension. Unlikely to conflict with markdown extension.

---

### 2. Callout Block

**Status:** ⬜ Not started

**Goal:** Notion-style callout — box with colored background + icon selector. Serializes to markdown blockquote with a special marker.

**Approach:** Custom TipTap node extension.

**Options considered:**
| Approach | Pros | Cons |
|----------|------|------|
| Markdown blockquote `<aside>` variant | Simple, markdown-native | No icon/color picker |
| Custom `callout` node | Full Notion parity | Needs custom markdown serialize/parse |
| Div using `div` extension + data attributes | No new node type | Clunky, markdown serialization complicated |

**Recommended:** Custom `callout` TipTap node with:
- Markdown serialization: `> [!info]` / `> [!warning]` / `> [!success]` / `> [!error]` (GitHub-style alert syntax)
- Custom `render` with icon selector + color theme
- Slash menu entry: `/callout`
- Color presets: info (blue), warning (orange), success (green), error (red) — same palette as Notion

**Install:** None. Write in `tiptap-editor.src.js` using `Node.create()`.

**Files changed:**
- `tiptap-editor.src.js` — add `Callout` node extension + slash entry
- `app.css` — `.callout` block styles (colored left border, background, icon)
- `HANDOFF.md` → mark as done

**Markdown impact:** Add `> [!type]` parse/serialize to `Markdown.configure({ html: false })`. If Markdown extension doesn't support custom tokens, fall back to `html: true` and serialize as `<div class="callout callout--info">...</div>`.

**Risk:** Medium. Custom node extensions need correct `addInputRules`, `addCommands`, and Markdown tokenization. The GitHub-flavored markdown callout syntax (`> [!NOTE]`) is now standard and testable.

---

### 3. Table Block

**Status:** ✅ Done

**Goal:** Insert and edit tables (Notion-style). Markdown tables as source of truth.

**Approach:** `@tiptap/extension-table` + `@tiptap/extension-table-row` + `@tiptap/extension-table-cell` + `@tiptap/extension-table-header`.

**Install:**
```bash
npm install @tiptap/extension-table @tiptap/extension-table-row @tiptap/extension-table-cell @tiptap/extension-table-header
```

**Changes:**
- Add Table extension bundle to extensions array
- Slash menu entry: `/table` (inserts 3×3 by default? or prompts for size)
- Bubble menu: add/remove column/row buttons (optional, v2)
- Markdown serialization: `@tiptap/markdown` has Table → Markdown render built-in (per July 2025 docs); verify it round-trips

**Markdown impact:** Table extension produces markdown `| col1 | col2 |` syntax natively through `@tiptap/markdown`. The render handler is already registered. Parse is built-in via MarkedJS tokenizer. Round-trip fidelity needs testing.

**Risk:** Low-medium. The table extension is well-maintained. The main question is whether markdown tables round-trip correctly (header detection, alignment, cell content with inline formatting).

---

### 4. Toggle Block (Collapsible)

**Status:** ⬜ Not started (future)

**Goal:** `<details><summary>` collapsible sections.

**Approach:** Custom `details` + `summary` node, or HTML passthrough.

**Markdown impact:** Markdown has no native collapsible syntax. Options: use raw HTML `<details>`, or custom fenced syntax `:::details` / `:::`. Not prioritized.

---

### Implementation Order & Dependencies

| Step | Feature | Depends on | Effort | Status |
|------|---------|-----------|--------|--------|
| 1 | GapCursor | Nothing | Low | ✅ Done |
| 2 | Drag Handle | Nothing | Low | ✅ Done (was already) |
| 3 | Callout (markdown round-trip) | Nothing | Medium | ✅ Done — `:::` fenced syntax via `createBlockMarkdownSpec` |
| 4 | Wiki-link `[[` autocomplete | Nothing | Medium | ✅ Done — pure DOM popup, fetches /api/search |
| 5 | Table block | Package install | Low | ✅ Done — `@tiptap/extension-table` + `/table` slash command (3×3 default, resizable) |
| 6 | Toggle block | Callout patterns | Low/med | ⬜ Future |
| 7 | Databases | Schema design | High | ⬜ Future (Notion core feature) |
| 8 | Views (table, Kanban, timeline, calendar, gallery, list, chart, dashboard) | Databases | High | ⬜ Future |
| 9 | Relations (link databases) | Databases | High | ⬜ Future |
| 10 | Migration (Block → Content) | Nothing | Medium | ⬜ Future (rollback safety)

Steps 1-5 are complete. Steps 3-5 were missing from the initial implementation.

---

## Known Issues / Edge Cases

1. **Migration pending**: Existing `Block` data not yet migrated to `Page.Content`. Old `Block` table still exists in initial migration; legacy `BlockEditor.razor` removed.
2. **Old pages** show legacy block renderer; new pages use TipTap. Migration service not yet written.
3. **Toggle block** not yet implemented — future work.
5. **Databases** not implemented — Notion's core feature (tables, boards, calendars, galleries, lists, charts, dashboards).
6. **Views** not implemented — switching between table, Kanban, timeline, calendar, gallery, list, chart, dashboard views.
7. **Relations** not implemented — linking databases (e.g., Tasks → Projects).
8. **Vite build required** after any change to `tiptap-editor.src.js` — not automatic with `dotnet run`.
9. **SQLite vulnerability warning** — `SQLitePCLRaw.lib.e_sqlite3` 2.1.11 CVE; update package when available.

---

## Regression Checklist

- [ ] Register → login → home page shows recent pages
- [ ] Create new page → appears in sidebar
- [ ] Type in TipTap editor → debounced auto-saves (check network tab for PUT)
- [ ] Slash `/` → command popup works
- [ ] `[[` → wiki link suggestion works
- [ ] 🖼️ Image button → file upload succeeds
- [ ] Paste image file → auto-upload + embed
- [ ] Task list check/toggle
- [ ] Navigate between pages → editor loads correct content
- [ ] `npx vite build` succeeds (0 errors)
- [ ] `dotnet build` succeeds (0 errors, pre-existing warning OK)
- [ ] Search finds content
- [ ] Dark mode toggle persists
- [ ] Page deletion and recovery
- [ ] Mobile responsive
