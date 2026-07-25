# Yanoch — Handoff Document

## Current State (March 2025)

Editor engine swapped from `<div contenteditable>` + block CRUD → **TipTap** (ProseMirror) via JS interop. **Blazor Server stays** as the host. Content model changed from per-block DB rows to **markdown string** in `Page.Content`.

### What Changed

| Aspect | Before | After |
|--------|--------|-------|
| **Editor engine** | `<div contenteditable>` + custom JS interop | **TipTap** (markdown-based, ProseMirror) |
| **Content model** | `Block` table (one row per block, sort order) | `Page.Content` — single markdown `TEXT` column |
| **Editor component** | `BlockEditor.razor` (10+ block types, edit/view modes) | `<div id="tiptap-editor">` — TipTap mounts here |
| **Save path** | `MergePageInPlace` + block CRUD per keystroke | Debounced `PUT /api/pages/{id}/content` |
| **Backlinks** | Extracted from block content | Extracted from markdown content |
| **Search** | `Blocks.Content` LIKE query | `Page.Content` LIKE query |
| **New page creation** | Created with one empty `Block` row | Created with empty `Content` string |
| **JS interop** | `interop.js` (block DnD, context menu, slash commands) | `tiptap-editor.js` (bundled TipTap, markdown API) |

### Files Modified

| File | Change |
|------|--------|
| `src/Yanoch.Domain/Models/Page.cs` | Added `Content` property |
| `src/Yanoch.Infrastructure/Data/AppDbContext.cs` | Added `Content` column config (TEXT) |
| `src/Yanoch.Infrastructure/Migrations/…_AddPageContent.cs` | New migration for `Content` column |
| `src/Yanoch.Infrastructure/Data/Repositories/PageRepository.cs` | Added `GetContentAsync`, `SetContentAsync`; search now queries `Content` |
| `src/Yanoch.Domain/Interfaces/IPageRepository.cs` | Added content interfaces |
| `src/Yanoch.Application/Interfaces/IPageService.cs` | Added content interfaces |
| `src/Yanoch.Application/Services/PageService.cs` | Added `GetContentAsync`, `SetContentAsync` with backlink extraction; `CreateAsync` sets `Content`; search uses `Content` for snippet |
| `src/Yanoch.Application/DTOs/PageDto.cs` | Added `Content` property |
| `src/Yanoch.Application/DTOs/CreatePageDto.cs` | Replaced `Blocks` with `Content` |
| `src/Yanoch.Application/DTOs/SetContentDto.cs` | **New** — DTO for content save |
| `src/Yanoch.Web/Controllers/Api/PagesController.cs` | Added `GET/PUT /{id}/content` endpoints |
| `src/Yanoch.Web/Components/Pages/Editor.razor` | **Rewritten** — removed `BlockEditor`, added TipTap JS interop (`initTipTap`/`destroyTipTap`/`OnMarkdownChanged`) |
| `src/Yanoch.Web/Components/App.razor` | Added `<script type="module" src="js/tiptap-editor.js">` |
| `src/Yanoch.Web/wwwroot/app.css` | Added `.editor-tiptap` and `.tiptap-editor` styles |

### Files Preserved (Unchanged)

- `AccountController.cs`, `SearchController.cs`, `TagsController.cs`, `UploadController.cs`
- `MainLayout.razor`, `PageTree.razor`, `PageTreeNode.razor`
- `Home.razor`, `Login.razor`, `Register.razor`, `Search.razor`
- `AppDbContext.cs` (blocks config preserved; new migration additive)
- `Program.cs`
- All domain models, enums, interfaces, DI registrations

### Files No Longer Used (Editor.razor no longer references)

- `BlockEditor.razor` — code exists but no longer rendered by Editor
- `ImageUpload.razor` — images handled by TipTalk extension

### Files Pending Cleanup

- `BlockService` / `block CRUD methods` in `PageService` and `IPageService`
- `Block` table migration — not dropped yet for rollback

---

## Running

```powershell
cd D:\Sourcecodes\Yanoch
dotnet run --project src/Yanoch.Web
# http://localhost:5072
# Applies pending migration on first run (AddPageContent adds Content column)
```

---

## Features Retained (All Working)

- Blazor Server host, auth, sidebar, page tree, wiki links, backlinks, search, image upload, dark mode, responsive layout, soft delete, SQLite

---

## Regression Checklist

- [ ] Register → login → home page shows recent pages
- [ ] Create new page → appears in sidebar
- [ ] Type in TipTap editor → debounced auto-saves
- [ ] Slash commands (`/menu`) insert blocks
- [ ] TipTap markdown shortcuts (`#` → heading, `*` → list)
- [ ] `[[wiki-link]]` → backlinks shown on linked page
- [ ] Navigate between pages → editor loads correct content
- [ ] Search finds content
- [ ] Dark mode toggle persists
- [ ] Page deletion and recovery
- [ ] Mobile responsive

---

## Migration (Pending)

Existing `Block` data is not yet migrated to `Page.Content`. The old `BlockEditor.razor` still renders blocks for existing pages. Until migration runs, old pages show their blocks via the legacy renderer; new pages use TipTap.

### To Migrate

Run `src/Yanoch.Application/Services/BlockMigrationService.cs` (not yet created) to read each page's blocks ordered by `SortOrder`, convert to markdown, and write to `Page.Content`.

### Rollback

`Content` column is additive. Reverting means removing the column and migration. `Block` table and `BlockEditor.razor` are still intact.
