# Yanoch Codebase Documentation

Updated 2026-07-26 (commit `19d64fe` — Tables + DB schema changes).

## Architecture Overview

- **Backend:** .NET 10 Blazor Server (Interactive Server rendering)
- **Frontend:** TipTap (ProseMirror) rich text editor via JS interop
- **Database:** SQLite via Entity Framework Core
- **Auth:** ASP.NET Core Identity
- **Build:** Vite (frontend JS) + dotnet build (backend)

## Reality: Markdown Source of Truth

`Page.Content` stores raw markdown. TipTalk with `@tiptap/markdown` parses/serializes markdown. The JS editor mounts via `initTipTap()`, pushes changes back via `OnMarkdownChanged` → debounced `PUT /api/pages/{id}/content`.

Dead-code removed: `BlockEditor.razor`, `Block` domain model/table. Blocks DB table retained (rollback safety) but unused.

## Project Structure

```
src/
├── Yanoch.Application/
│   ├── DTOs/
│   │   ├── PageDto.cs, CreatePageDto.cs, SetContentDto.cs
│   │   ├── DatabaseDto.cs, CreateDatabaseDto.cs, DatabaseItemDto.cs
│   │   ├── PageVersionDto.cs, TagDto.cs, BacklinkDto.cs, SearchResultDto.cs
│   ├── Interfaces/
│   │   ├── IPageService.cs, ITagService.cs, IFileStorageService.cs
│   │   └── IDatabaseService.cs
│   └── Services/
│       ├── PageService.cs       # Page CRUD, content, backlinks
│       ├── TagService.cs
│       └── DatabaseService.cs   # Database CRUD + items
├── Yanoch.Domain/
│   ├── Models/
│   │   ├── Page.cs                  # Title, Icon, Content (markdown), ParentPageId
│   │   ├── PageVersion.cs           # Historical snapshots
│   │   ├── Backlink.cs              # [[wiki link]] references
│   │   ├── PageTag.cs / Tag.cs      # Many-to-many
│   │   ├── Database.cs              # Title, Type, SoftDelete
│   │   ├── DatabaseProperty.cs      # Name, Type, Options (select choices)
│   │   └── DatabaseItem.cs          # Values (JSON), SoftDelete
│   └── Interfaces/ (IPageRepository, IVersionRepo, IBacklinkRepo, ITagRepo, IDatabaseRepo)
├── Yanoch.Infrastructure/
│   ├── Data/
│   │   ├── AppDbContext.cs           # EF Core: Pages, Tags, PageVersions, Backlinks,
│   │   │                              Databases, DatabaseProperties, DatabaseItems
│   │   └── Repositories/ (PageRepo, PageVersionRepo, BacklinkRepo, TagRepo, DatabaseRepo)
│   ├── Migrations/ (InitialCreate, AddPageContent, DatabaseTables)
│   ├── Services/LocalFileStorageService.cs
│   └── DependencyInjection.cs  # Scoped service registrations
└── Yanoch.Web/
    ├── Components/
    │   ├── App.razor, Routes.razor
    │   ├── Layout/MainLayout.razor, AuthLayout.razor, PageTree.razor, PageTreeNode.razor
    │   ├── Pages/Editor.razor, Home.razor, Search.razor, Login/Register/Logout, Error
    │   └── Shared/ImageUpload.razor
    ├── Controllers/Api/
    │   ├── PagesController.cs     # Page CRUD + content
    │   ├── DatabasesController.cs # DB CRUD + items (+ /todo preset)
    │   ├── UploadController.cs    # Image upload
    │   ├── SearchController.cs
    │   └── TagsController.cs
    ├── wwwroot/
    │   ├── js/
    │   │   ├── tiptap-editor.src.js  # Source (Vite entry)
    │   │   └── tiptap-editor.js      # Built output (committed)
    │   └── app.css                   # All styles
    └── Program.cs
```

## Editor Architecture

### JS (tiptap-editor.src.js)

Single Vite bundle. Exports Blazor-interop functions:

| Function | Purpose |
|---|---|
| `initTipTap(elementId, content, dotNetRef, pageId)` | Create editor |
| `destroyTipTap(elementId)` | Cleanup |

### Extensions

| Extension | Source | Purpose |
|---|---|---|
| StarterKit | `@tiptap/starter-kit` | Base (headings, lists, bold/italic, blockquote, code) |
| Underline | `@tiptap/extension-underline` | Underline |
| Link | `@tiptap/extension-link` | Hyperlinks |
| Image | `@tiptap/extension-image` | Inline images |
| TaskList + TaskItem | `@tiptap/extension-task-list` + `-item` | Checklists |
| Placeholder | `@tiptap/extension-placeholder` | `Start writing...` |
| Markdown | `@tiptap/markdown` | Markdown parse/serialize (contentType: 'markdown') |
| GapCursor | Built-in StarterKit | Click-between-blocks insertion |
| DragHandle | `@tiptap/extension-drag-handle` | Block reorder handle (nested: false) |
| Toggle | Custom `Node.create()` | `/toggle` → collapsible block |
| Callout | Custom `Node.create()` | `/callout` → colored callout box |
| Table (+row/cell/header) | `@tiptap/extension-table` family | Markdown tables |
| DatabaseView | Custom `Node.create()` | Embedded database view (mini table) |

### Custom Nodes

**Toggle:**
- Collapsible block with ▶ toggle handle
- Slash menu inserts via `setToggle()`: inside container → `insertContent` as child, at top-level → `wrapIn`
- `clearNodes()` skipped inside defining containers (toggle/callout/nested) to avoid breaking structure

**Callout:**
- 13 colors: info/warning/success/error/gray/brown/orange/yellow/green/blue/purple/pink/red
- Emoji icon picker (emoji grid context menu, 50 emojis)
- Color picker: Notion-style colored dot circles
- Persistence: `state.tr.setNodeMarkup(pos, null, { ...node.attrs, type })` — survives TipTap re-render
- Markdown round-trip via `html: true`: `<div data-callout data-type="info" data-icon="🔥">...</div>`

**DatabaseView:**
- `/database` slash menu → picker popup (lists DBs, "+ New Database" button)
- Non-atom node (`content: 'paragraph'`) — ProseMirror required content type for proper insertion
- Hydration via `hydrateDatabaseViews()` on every transaction — fetches items separately, renders mini table
- Markdown bridge: `<div data-database-view ...>` via `html: true`

**Table:**
- Inserted via slash menu or `/table`
- Table corner buttons: top-right `th` (add column), bottom-left last-row `td` (add row)
- Memory leak fix: `addTableButtons()` only on `firstUpdate` + after click mutations, not every `onUpdate`
- Scrollable via `overflow: auto; display: block`

### Slash Command Menu

Custom implementation (not `@tiptap/suggestion`). Module-level singleton:
- `onUpdate` → `checkSlash(editor)` — cursor at start of line with `/` → opens menu
- `handleKeyDown` intercepts navigation keys when active
- `runSlashItem`: saves ref, closes menu, deletes `/`, runs command
- Timing guard: `closeSlash()` before `view.dispatch()` to prevent re-entrant race
- Not triggered inside `codeBlock` nodes

### Context Menus (Callout)

Pure DOM overlays (not TipTap):

- **Icon button** → 7×N emoji grid (50 emojis). Click same to close, click outside to close.
- **Color button** → 13-dot color picker with labels.
- Both use global click-outside listener, tracked per-instance for cleanup.

### Image Upload

- Hidden `<input type="file">` (created once via `ensureImageInput()`)
- Triggers: slash menu "Image", paste image, drag-drop, `#btn-upload-image`
- Uploads to `POST /api/upload` → `wwwroot/uploads/` via `LocalFileStorageService`

### Auto-Save

- Debounced 800ms `OnMarkdownChanged` → `PUT /api/pages/{id}/content`
- **New page**: First content change + navigation triggers `PageService.CreateAsync` → redirect to `/page/{newId}` (prevents data loss on refresh)

### State Management

Per-instance: `Map<elementId, { editor, dotNetRef, pageId, firstUpdate, listeners }>`.
- `firstUpdate` flag skips initial `onUpdate` (fires during editor construction — not a user edit)
- All `invokeMethodAsync` calls wrapped in `invokeCb` (silently swallows circuit-gone errors)

### Drag Handle

- `@tiptap/extension-drag-handle` with `nested: false` (upstream `nested: true` unreliable — repositioned on every rAF)
- Top-level handles only
- CSS: `.drag-handle` gutter, hover reveal

## Backend

### PageService

- `GetContentAsync` / `SetContentAsync` — direct read/write via repository
- `SetContentAsync` triggers `UpdateBacklinksFromContent` — regex `[[wiki links]]` → `Backlink` records
- All DB reads use `AsNoTracking()`
- Raw SQL for content updates (bypasses EF change tracker conflicts)

### DatabaseService

- CRUD for `Database`, `DatabaseProperty`, `DatabaseItem`
- Todo preset: `POST /api/databases/todo` — Title(text), Done(checkbox), Due Date(date), Priority(select: low/medium/high/critical)

### API Endpoints

| Method | Route | Purpose |
|---|---|---|
| GET/PUT | `/api/pages/{id}/content` | Markdown content |
| GET/POST/PUT/DELETE | `/api/pages[/{id}]` | Page CRUD |
| GET | `/api/pages/tree` | Page tree |
| GET/POST/PUT/DELETE | `/api/databases[/{id}]` | Database CRUD |
| POST | `/api/databases/todo` | Create todo DB preset |
| GET/POST/PUT/DELETE | `/api/databases/{id}/items[/{itemId}]` | Database items |
| GET/POST | `/api/tags` | Tag management |
| POST | `/api/upload` | Image file upload |
| GET | `/api/search?q=` | Full-text search |

## DB Schema

```sql
Pages: Id, Title, Icon, CoverUrl, UserId, ParentPageId, SortOrder,
       IsDeleted, CreatedAt, UpdatedAt, DeletedAt, Content (TEXT)

Blocks: (table retained — unused, rollback safety)

PageVersions: Id, PageId, Content, CreatedAt  (snapshots on edit)

Backlinks: Id, SourcePageId, TargetPageId

Tags: Id, Name, Color
PageTags: PageId, TagId  (many-to-many)

Databases: Id, Title, Type, IsDeleted, CreatedAt, UpdatedAt, DeletedAt
DatabaseProperties: Id, DatabaseId, Name, Type, Options (JSON for select choices), SortOrder
DatabaseItems: Id, DatabaseId, Values (JSON), SortOrder, IsDeleted
```

### SQLite CVE Fix

Added `<PackageReference Include="SQLitePCLRaw.lib.e_sqlite3" Version="3.53.3" />` to `Yanoch.Infrastructure.csproj` to override vulnerable transitive 2.1.11.

## CSS Architecture

- Single `app.css` with CSS custom properties (theme variables)
- Dark mode support via variable overrides
- Block management menus (context, slash, turn-into) use theme variables (not hardcoded) — fixed 2026-07-25

### Text Wrapping Fixes (2026-07-25)

- View mode: `white-space: pre-wrap`, `overflow-wrap: break-word`, `word-break: break-word`
- Edit mode (`<div contenteditable>`): same CSS + JS `autoResizeTextarea` (scrollHeight)
- Removed `field-sizing: content` (caused unresolvable width > 100% → no wrapping)
- Cache-bust version `v=17` for `<div contenteditable>` final fix

## Build & Run

```bash
# Fresh setup
npm install
npx vite build
dotnet run --project src/Yanoch.Web

# After source-only changes
npx vite build && dotnet run

# Convenience scripts
./build.sh   # JS build only
./run.sh     # JS build + dotnet run
```

## Commit History (latest → oldest)

```
19d64fe Feat: Tables; db schema changes; dependency injection
53e952b Binaries
ad88d49 [CRIT] fix SQLite CVEs
88d1082 feat: toggle/callout improvements, auto-save for new pages
fb4496e Feat: toggle lists
137675b Update Handoff to include other features
df78d7a feat: callout with separate emoji and color context menus
8b9184e fix: add getAttrs in parseHTML to extract data-type for round-trip
9fd7f63 fix: restore defining:true on callout to prevent Enter from lifting content out
6d5adbb fix: save new pages, color picker uses posAtDOM + depth walk for setNodeMarkup
d04c86d fix: callout colors persist via ProseMirror node attributes; replace dropdown with color dot picker
97ec0cc feat: complete callout with 13 colors, markdown round-trip (html:true), type picker dropdown
d1cdcb7 fix: expose changeCalloutType globally to avoid ReferenceError
a4313a3 feat: add callout type picker dropdown (info/warning/success/error)
b08cc50 fix: callout command now uses wrapIn to insert node
b6d69dc feat: add callout block with color types (info/warning/success/error)
813e158 feat: add drag handle and gap cursor for block reordering
f492bd7 Update code docs
ab2a95a Rewrite context menu around TipTap
69ec639 Backend rebuild: Change to TipTap for editing
05a9652 Fix text scrollbar wrapping issue
b631bf7 Update gitignore
59c0db7 Remove uploads from commit
358fc00 Fix wrapping issues in edit mode
16ae0fd Remove dead code
6cbc8e2 Pre-pushing commits
3f9be5d Refine documentation to suit updates
2611b85 Add more ignored files
923fe36 Overhaul: Improve overall block management; add temporary favicon; remove unnecessary files
3e0dfb0 Overhaul: Improve image and general block management
166ab0c Add emoji picker for icons; sidebar to subscribe to icons
f90b0f6 Add gitignore
6b762ef Clean up
3c0d850 Add block move support
d8698fd Delete unnecessary README
4d4c6a2 Initial commit
```
