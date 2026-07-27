# Yanoch Codebase Documentation

This document provides an overview of the Yanoch codebase structure, architecture, and current state.

## Architecture Overview

- **Backend:** .NET 10 Blazor Server (Interactive Server rendering)
- **Frontend:** TipTap (ProseMirror) rich text editor via JS interop
- **Database:** SQLite via Entity Framework Core
- **Auth:** ASP.NET Core Identity
- **Build:** Vite (frontend) + dotnet build (backend)

## Reality: Markdown Source of Truth

The editor uses **TipTap** with the `@tiptap/markdown` extension. `Page.Content` stores raw markdown. The editor mounts via JS interop and pushes changes back to the Blazor circuit as the user types.

Dead-code removal history:
- Removed: `BlockEditor.razor`, `BlockDto.cs`, `BlockType.cs`, `Block.cs`, `CreateBlockDto`/`MoveBlockDto`, `interop.js`
- Removed: `Block` domain model, `BlockRepository`, block-related EF config
- The `Blocks` DB table still exists (rollback safety) but is unused.

## Project Structure

```
src/
├── Yanoch.Application/          # Application layer
│   ├── DTOs/
│   │   ├── PageDto.cs           # Page read model
│   │   ├── CreatePageDto.cs     # Page creation DTO
│   │   ├── SetContentDto.cs     # Content update DTO
│   │   ├── PageVersionDto.cs    # Version history model
│   │   ├── TagDto.cs            # Tag model
│   │   ├── BacklinkDto.cs       # Backlink model
│   │   └── SearchResultDto.cs   # Search result model
│   ├── Interfaces/
│   │   ├── IPageService.cs      # Page CRUD + content + search + versions
│   │   ├── ITagService.cs       # Tag management
│   │   └── IFileStorageService.cs
│   └── Services/
│       ├── PageService.cs       # Core page orchestration + backlink extraction
│       └── TagService.cs
├── Yanoch.Domain/               # Domain layer
│   ├── Models/
│   │   ├── Page.cs              # Title, Icon, Content (markdown), ParentPageId, tags, backlinks
│   │   ├── PageVersion.cs       # Historical versions (snapshot on significant edits)
│   │   ├── Backlink.cs          # Source→Target page references (parsed from [[wiki links]])
│   │   ├── PageTag.cs           # Many-to-many Page↔Tag
│   │   └── Tag.cs               # Name + color
│   └── Interfaces/
│       ├── IPageRepository.cs
│       ├── IPageVersionRepository.cs
│       ├── IBacklinkRepository.cs
│       └── ITagRepository.cs
├── Yanoch.Infrastructure/        # Data access
│   ├── Data/
│   │   ├── AppDbContext.cs       # EF Core context (Pages, Tags, PageVersions, Backlinks)
│   │   └── Repositories/
│   │       ├── PageRepository.cs     # Content queries via raw SQL (no tracking)
│   │       ├── PageVersionRepository.cs
│   │       ├── BacklinkRepository.cs
│   │       └── TagRepository.cs
│   ├── Migrations/
│   │   ├── 20260722235320_InitialCreate.cs
│   │   └── 20260725094535_AddPageContent.cs   # Adds Page.Content column
│   └── Services/
│       └── LocalFileStorageService.cs
└── Yanoch.Web/                  # Web layer
    ├── Components/
    │   ├── App.razor            # Root layout, loads tiptap-editor.js?v=2
    │   ├── Routes.razor
    │   ├── Layout/
    │   │   ├── MainLayout.razor # Sidebar + page tree
    │   │   ├── AuthLayout.razor
    │   │   ├── PageTree.razor   # Hierarchical page navigation
    │   │   └── PageTreeNode.razor
    │   ├── Pages/
    │   │   ├── Editor.razor     # Page editor with TipTap mount
    │   │   ├── Home.razor       # Landing page
    │   │   ├── Search.razor
    │   │   ├── Login.razor / Register.razor / Logout.razor
    │   │   └── Error.razor
    │   └── Shared/
    │       └── ImageUpload.razor
    ├── Controllers/
    │   └── Api/
    │       ├── PagesController.cs    # REST API for pages
    │       ├── UploadController.cs   # Image file upload
    │       ├── SearchController.cs
    │       └── TagsController.cs
    ├── wwwroot/
    │   ├── js/
    │   │   ├── tiptap-editor.src.js  # Source (Vite entry point)
    │   │   └── tiptap-editor.js      # Built output (committed)
    │   └── app.css                   # All styles
    └── Program.cs                    # Entry: DI, migrations, middleware
```

## DTOs (Data Transfer Objects)

DTOs are plain serializable containers — properties only, no behavior — that carry data across layer boundaries. The DTOs in `Yanoch.Application/DTOs/` define the wire shape that flows between the controllers, services, and the Blazor UI; the domain models in `Yanoch.Domain/Models/` stay internal to the backend.

The current DTOs are split by use case rather than mirroring the domain one-to-one:

- `PageDto` — read model returned by GET responses (page + display fields)
- `CreatePageDto` — input for `POST /api/pages`
- `SetContentDto` — input for `PUT /api/pages/{id}/content`
- `PageVersionDto` — version-history row shape
- `TagDto` / `BacklinkDto` / `SearchResultDto` — specialized read models

Why DTOs instead of returning `Page` (or other domain entities) directly:

1. **Decouple wire format from domain.** `Page` carries EF navigation properties, soft-delete flags, and other internal state. DTOs expose only what the API contract should.
2. **Shape per operation.** `CreatePageDto` accepts only the fields needed to create a page; `PageDto` is the read shape. Splitting them prevents over-posting and documents what each endpoint actually takes.
3. **Stable API surface.** Renaming a column or adding an internal field on `Page` doesn't break clients as long as the DTO shape is preserved.
4. **No EF baggage.** DTOs are plain POCOs, so they pass safely through controllers, `PageService`, and the JS interop boundary without dragging in `IQueryable`, change tracking, or lazy loading.

The mapping between DTOs and domain entities happens in `PageService` (and the controllers, where appropriate).

## Editor Architecture

### JS (tiptap-editor.src.js)

Entry point built by Vite. Exports Blazor-interop functions:

| Function | Called from C# | Purpose |
|---|---|---|
| `initTipTap(elementId, content, dotNetRef, blockId)` | `OnAfterRenderAsync` | Create editor instance |
| `destroyTipTap(elementId)` | `OnBeforeUnmount` / route change | Destroy + cleanup |

Editor config:
- **Extensions:** StarterKit, Underline, Link, Image, TaskList, TaskItem, Placeholder, GapCursor, DragHandle, Markdown, Table, TableRow, TableCell, TableHeader, Callout, Toggle
- **contentType:** `'markdown'` (TipTap parses initial content as markdown)
- **Markdown API:** `editor.getMarkdown()` (the `@tiptap/markdown` extension exposes this on the editor object directly, not via `editor.storage`)

### Per-instance State

Instances tracked in a `Map<elementId, { editor, dotNetRef, blockId, firstUpdate, listeners }>`. The `firstUpdate` flag skips the initial `onUpdate` that fires during editor construction (initial content parse — not a user edit). All Blazor `invokeMethodAsync` calls use an `invokeCb` wrapper that silently swallows errors when the circuit is gone.

### Callout Context Menus

- **Icon button** (left side): click opens a 7×N emoji grid context menu (50 emojis). Click same button again to close. Click outside to close.
- **Color button** (below icon): click opens a labeled color picker context menu (13 colors). Click same button again to close. Click outside to close.
- Both attributes persist in markdown: `:::callout {type="warning" icon="🔥"} ... :::` — clean round-trip via `createBlockMarkdownSpec`.

### Slash Command Menu

Custom implementation (not `@tiptap/suggestion`). Module-level singleton:

- **Detection:** `onUpdate` callback calls `checkSlash(editor)` — checks if cursor is at start of line with `/`, opens menu.
- **Navigation:** `handleKeyDown` in `editorProps` intercepts ArrowUp/Down/Enter/Tab/Escape when `slashActive` is true.
- **Execution:** `runSlashItem` — saves editor ref, closes menu, deletes the `/` text, runs the command.
- **Timing fix:** `closeSlash()` called *before* `view.dispatch()` to prevent re-entrant `onUpdate` → `checkSlash` → `closeSlash` race.
- **Code block guard:** Slash menu not triggered inside `codeBlock` nodes.
- **Items:** Text, Heading 1-3, Bullet/Numbered/Task List, Quote, Code Block, Divider, Image, Table, Callout, Toggle

### Image Upload

- Hidden `<input type="file">` created once (`ensureImageInput()`)
- Triggered by: slash menu "Image" command, paste image, drag-drop
- Uploads to `POST /api/upload` → stored in `wwwroot/uploads/` by `LocalFileStorageService`

### Callout Block

Custom TipTap node (`callout`). Renders `div[data-callout]` with side icon + color controls.
- **Icon button:** opens emoji grid (50 emojis)
- **Color button:** opens color picker (13 colors)
- Markdown round-trip via `createBlockMarkdownSpec` as `:::callout {type="warning" icon="🔥"}`

### Toggle Block

Custom TipTap node (`toggle`). Renders `div[data-toggle]` with arrow + collapsible inner.
- Markdown round-trip via `createBlockMarkdownSpec`
- Arrow click toggles collapsed state

### Table

Via `@tiptap/extension-table` (resizable). Floating bubble menu appears on cell selection:
- ➕ Row, ❌ Row, ➕ Col, ❌ Col, 🗑️ Table
- Slash menu entry inserts 3×3 table with header row

### Known Issues / Edge Cases

- `onUpdate` first-fire skipped via `firstUpdate` flag to prevent spurious content saves on page load
- Blazor circuit disconnect handled gracefully by `invokeCb`
- Outside-click listener tracked per-instance for proper cleanup

## Backend

### PageService

- `GetContentAsync` / `SetContentAsync` — direct content read/write via repository
- `SetContentAsync` triggers `UpdateBacklinksFromContent` — regex-extracts `[[wiki links]]` from markdown, creates/updates `Backlink` records
- All DB reads use `AsNoTracking()` for freshness

### PageRepository (content operations)

```csharp
// Raw SQL to avoid EF Core change tracker conflicts
await _db.Database.ExecuteSqlRawAsync(
    "UPDATE \"Pages\" SET \"Content\" = {0}, \"UpdatedAt\" = {1} WHERE \"Id\" = {2}",
    content, DateTime.UtcNow, pageId);
```

### API Endpoints

| Method | Route | Auth | Purpose |
|---|---|---|---|
| GET | `/api/pages/tree` | Yes | Root page tree |
| GET | `/api/pages/{id}` | Yes | Page detail |
| GET | `/api/pages/{id}/content` | Yes | Raw markdown content |
| PUT | `/api/pages/{id}/content` | Yes | Save markdown |
| POST | `/api/pages` | Yes | Create page |
| PUT | `/api/pages/{id}` | Yes | Update metadata |
| DELETE | `/api/pages/{id}` | Yes | Soft-delete |
| GET | `/api/tags` | Yes | List tags |
| POST | `/api/upload` | Yes | Image file upload |

## DB Schema

```sql
Pages: Id, Title, Icon, CoverUrl, UserId, ParentPageId, SortOrder,
       IsDeleted, CreatedAt, UpdatedAt, DeletedAt, Content (TEXT)

Blocks: (table retained but unused — rollback safety)
```

## Build & Run

```bash
# Frontend
npm install
npx vite build       # outputs directly to src/Yanoch.Web/wwwroot/js/tiptap-editor.js

# Backend
dotnet run --project src/Yanoch.Web

# Or use the convenience wrapper:
./build.sh    # JS build
./run.sh      # JS build + dotnet run
```

The app runs at `http://localhost:5072`.
