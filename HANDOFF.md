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
| **Table status columns** | Inline status badge (Todo/In Progress/Done) with dropdown selector | 📋 Planned — see feature #7 below |

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
| `src/Yanoch.Web/wwwroot/js/tiptap/tiptap-status-column.js` | **New** — Task status inline node + dropdown menu (see feature #7) |

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

### 1. Movable Blocks (Drag Handle + GapCursor)

**Status:** ✅ Done

Top-level drag handle (⣿) on left gutter. GapCursor for clicking between blocks.

---

### 2. Callout Block

**Status:** ✅ Done

Custom `callout` node with `:::callout {type="warning" icon="🔥"}` markdown. Color picker (13 colors) + emoji icon grid (50 emojis) via context menus. Button toggle to close/re-open.

---

### 3. Table Block

**Status:** ✅ Done (basic)

Via `@tiptap/extension-table`. 3×3 with header on `/table` slash. Resizable columns. Floating bubble menu for add/delete row/col + delete table.

**Planned enhancement:** Task Status Columns (see #7 below)

---

### 4. Toggle Block (Collapsible)

**Status:** ✅ Done

Custom `toggle` node with `:::toggle {collapsed:true}` markdown. Arrow click collapss/expands. Insert as child inside containers (toggle/callout) or sibling at top-level.

---

### Implementation Order & Dependencies

| Step | Feature | Depends on | Effort | Status |
|------|---------|-----------|--------|--------|
| 1 | GapCursor | Nothing | Low | ✅ Done |
| 2 | Drag Handle | Nothing | Low | ✅ Done (was already) |
| 3 | Callout (markdown round-trip) | Nothing | Medium | ✅ Done — `:::` fenced syntax via `createBlockMarkdownSpec` |
| 4 | Wiki-link `[[` autocomplete | Nothing | Medium | ✅ Done — pure DOM popup, fetches /api/search |
| 5 | Table block | Package install | Low | ✅ Done — `@tiptap/extension-table` + `/table` slash command (3×3 default, resizable) |
| 6 | Toggle block | Callout patterns | Low/med | ✅ Done |
| 7 | Task Status Columns in Tables | Table (5) | Medium | 📋 Planned — inline status badge node + dropdown menu, see feature #7 above |
| 8 | Migration (Block → Content) | Nothing | Medium | ⬜ Future (rollback safety) |

Steps 1-6 are complete. Step 7 is planned.

---

## Known Issues / Edge Cases

1. **Migration pending**: Existing `Block` data not yet migrated to `Page.Content`. Old `Block` table still exists in initial migration; legacy `BlockEditor.razor` removed.
2. **Old pages** show legacy block renderer; new pages use TipTap. Migration service not yet written.
3. **Toggle block** — was previously marked as "not yet implemented"; now ✅ Done (2026-07-26).
4. **Vite build required** after any change to `tiptap-editor.src.js` — not automatic with `dotnet run`.
5. **SQLite vulnerability warning** — `SQLitePCLRaw.lib.e_sqlite3` 2.1.11 CVE; update package when available.

---

## Known Issues & Debugging (Moved from CODE.md)

### Subtle Bugs Fixed (2026-07-29)

| Bug | Root Cause | Fix |
|-----|------------|-----|
| `flushTimer is not defined` | `destroyEditor()` referenced `flushTimer` but variable was module-scoped in `tiptap-save-manager.js` as `_flushTimer` | Import `clearFlushTimer()` from save-manager and call it instead |
| `checkSlash is not defined` | `handleUpdate()` and `handleSelectionUpdate()` called `checkSlash(ed)` but it wasn't imported from `tiptap-slash-menu.js` | Add `checkSlash` to import list from `./tiptap-slash-menu.js` |
| `checkWiki is not defined` | Same pattern as `checkSlash` — called but not imported | Add `checkWiki` to import list from `./tiptap-wiki-autocomplete.js` |

### Patterns to Avoid

1. **Module-scoped variables** → Always import/export; never assume global scope across modules
2. **Stale Vite builds** → Run `npx vite build` after ANY JS source change; committed `tiptap-editor.js` may be stale
3. **Silent JS interop failures** → `invokeCb` wrapper in `tiptap-editor.js` swallows errors when circuit dies; check browser console for `blazor.server.js` reconnection logs

### Debugging Playbook

| Symptom | Check | Fix |
|---------|-------|-----|
| Circuit lost | Browser console for `blazor.server.js` reconnection logs | Wait for auto-reconnect or refresh |
| JS interop fails silently | Browser console (F12) → errors from `invokeMethodAsync` | Wrap calls in try/catch; `invokeCb` already handles circuit-gone |
| Editor not destroying | `OnBeforeUnmountAsync` calls `destroyTipTap(elementId)` | Verify `Editor.razor:DestroyEditor()` runs |
| `initTipTap is not a function` | Stale Vite build | Run `npx vite build` |
| Editor not loading | Network tab: `/js/tiptap-editor.js` loads (not 404) | Check `vite.config.js` output path |
| Migration pending | App auto-migrates on startup (`Program.cs:24-36`) | Delete `yanoch.db` → restart to reset |
| Images not loading | `wwwroot/uploads/` permissions + static file middleware | Ensure `app.UseStaticFiles()` in `Program.cs` |

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
- [ ] Insert table via `/table` → 3×3 with header row renders correctly
- [ ] Resize table columns (drag handles)
- [ ] Table bubble menu: add/delete row/col, delete table
- [ ] Table status column: insert status badge, click to change status (once implemented)
