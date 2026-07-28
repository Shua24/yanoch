# Yanoch Developer Guide

Quick-start reference for contributors. Architecture, conventions, common tasks, and debugging.

---

## Quick Start

```bash
# First time / after pulling
npm install
npx vite build
dotnet run --project src/Yanoch.Web

# Or one-liner
./run.sh
```

- App runs at **http://localhost:5072**
- Frontend bundle: `src/Yanoch.Web/wwwroot/js/tiptap-editor.js` (committed, rebuilt via Vite)
- DB: SQLite at `src/Yanoch.Web/yanoch.db` (auto-migrated on startup)

---

## Architecture (4-Layer Clean)

```
src/
├── Yanoch.Web/           # Blazor Server (UI, controllers, DI, JS interop)
├── Yanoch.Application/   # Services, DTOs, interfaces (use cases)
├── Yanoch.Domain/        # Entities, value objects, repository interfaces
└── Yanoch.Infrastructure/# EF Core, repositories, file storage, migrations
tests/
└── Yanoch.Tests/         # xUnit + Moq (Domain + Application layers)
```

**Dependency rule:** Web → Application → Domain ← Infrastructure
- Web references Application + Infrastructure (DI wiring only)
- Application references Domain only
- Domain has zero external dependencies
- Infrastructure implements Domain interfaces

---

## Key Conventions

### C# / .NET
- **Nullable enabled**, `ImplicitUsings` on
- **Interfaces** in `Domain/Interfaces`, **implementations** in `Infrastructure`
- **DTOs** in `Application/DTOs` — plain POCOs, no behavior, one per API shape
- **Services** in `Application/Services` implement `Application/Interfaces`
- **Repositories** use raw SQL for content updates (avoids EF change-tracker conflicts)
- **Async suffix** on all async methods (`GetByIdAsync`, not `GetById`)
- **PKs:** `Guid` (not `int`), `Guid.Empty` = invalid
- **Soft delete:** `IsDeleted`, `DeletedAt` — repositories filter by default
- **UTC everywhere:** `DateTime.UtcNow`, never `DateTime.Now`

### JavaScript / TipTap
- **Single entry:** `wwwroot/js/tiptap-editor.src.js` → Vite → `wwwroot/js/tiptap-editor.js`
- **ES modules** (`"type": "module"` in package.json)
- **Blazor interop:** `window.initTipTap(elementId, content, dotNetRef, blockId)`
- **Instance map:** `Map<elementId, { editor, dotNetRef, blockId, listeners }>`
- **Per-instance cleanup** in `destroyTipTap()` — removes DOM listeners, kills editor, nulls Blazor ref

### CSS
- Single file: `wwwroot/app.css` (no CSS isolation, no frameworks)
- Variables in `:root` for theming (dark/light via `[data-theme]`)
- BEM-ish: `.callout`, `.callout--warning`, `.callout__icon-btn`

---

## Common Tasks

### Add a New API Endpoint
1. **DTO** in `Application/DTOs/` (request/response)
2. **Interface** in `Application/Interfaces/I*Service.cs`
3. **Implementation** in `Application/Services/*Service.cs`
4. **Controller** in `Web/Controllers/Api/*Controller.cs` (`[ApiController]`, attribute routing)
5. Register service in `Web/Program.cs` (already scoped)

### Add a New Editor Block (TipTap Node)
1. **Create node** in `tiptap-editor.src.js` (extend `Node.create({...})`)
   - Add `parseHTML`, `renderHTML`, `addAttributes`, `addCommands`
   - Add Markdown spec via `createBlockMarkdownSpec({...})` for round-trip
2. **Add to editor extensions** in `createEditor()` → `extensions: [...]`
3. **Add slash menu item** in `slashItems[]` with `run: e => e.chain().focus().setYourNode().run()`
4. **Rebuild:** `npx vite build`
5. **Test** in editor via `/` slash menu

### Add a New Domain Entity
1. **Model** in `Domain/Models/*.cs` (props, navigation, `Guid` PK, `CreatedAt`/`UpdatedAt`)
2. **Interface** in `Domain/Interfaces/I*Repository.cs`
3. **Repository** in `Infrastructure/Data/Repositories/*Repository.cs`
4. **EF Config** in `AppDbContext.OnModelCreating` (or entity config class)
5. **Migration:** `dotnet ef migrations add Name -p src/Yanoch.Infrastructure -s src/Yanoch.Web`
6. **Service/DTO/Controller** as above

### Add a Tag / Color / Enum
- Tags: `Tag` model + `TagDto` + `ITagService` + `TagController`
- Callout types: edit `calloutTypes[]` in `tiptap-editor.src.js` + CSS variables in `app.css`

---

## Data Flow (Editor → DB)

```
User types in TipTap
       │
       ▼
onUpdate callback (debounced 800ms in Blazor)
       │
       ▼
Editor.razor → dotNetRef.InvokeMethodAsync("OnMarkdownChanged", blockId, markdown)
       │
       ▼
PageService.SetContentAsync(pageId, markdown)
       │
       ├─► PageRepository.SetContentAsync (raw SQL UPDATE)
       └─► UpdateBacklinksFromContent (regex [[wiki links]] → Backlink rows)
```

**Key detail:** `PageRepository.SetContentAsync` uses raw SQL to bypass EF change tracker (avoids conflicts with concurrent reads).

---

## Testing

```bash
# Run all tests
dotnet test tests/Yanoch.Tests

# With coverage
dotnet test tests/Yanoch.Tests --collect:"XPlat Code Coverage"
```

- **Project:** `tests/Yanoch.Tests/Yanoch.Tests.csproj`
- **Framework:** xUnit + Moq
- **Scope:** Domain models + Application services (no Web/Infrastructure)
- **Pattern:** `*Tests.cs` classes, `[Fact]` methods, `Assert.*` from xUnit
- **Mock repositories** via `Moq` — see `ModelTests.cs` for domain model tests

---

## Debugging Tips

### Blazor Circuit Issues
- **Circuit lost:** Check browser console for `blazor.server.js` reconnection logs
- **JS interop fails silently:** `invokeCb` wrapper in `tiptap-editor.src.js` swallows errors when circuit dies
- **Editor not destroying:** Ensure `OnBeforeUnmountAsync` calls `destroyTipTap(elementId)`

### Editor Not Loading
1. Check `tiptap-editor.js` exists in `wwwroot/js/` (run `npx vite build`)
2. Browser console: `initTipTap is not a function` → stale Vite build
3. Network tab: verify `/js/tiptap-editor.js` loads (not 404)

### DB Issues
- **Migration pending:** App auto-migrates on startup (`Program.cs:24-36`)
- **Reset DB:** Delete `src/Yanoch.Web/yanoch.db` → restart app
- **SQL logging:** `appsettings.Development.json` → `LogLevel: Microsoft.EntityFrameworkCore.Database.Command: Information`

### Common Gotchas

| Symptom | Cause | Fix |
|---|---|---|
| Editor saves on load | `onUpdate` fires during init | `firstUpdate` flag skips first fire |
| Wiki menu doesn't open | `[[` not detected | Check `checkWiki` in `onUpdate` |
| Subpages don't appear | `/api/pages/children/{id}` 404 | Verify route + controller |
| Drag-handle missing | `DragHandle` extension not loaded | Check `extensions` array in `createEditor` |

---

## Build / CI

```bash
# Frontend only
npx vite build

# Backend only
dotnet build src/Yanoch.Web

# Full (what run.sh does)
./build.sh && dotnet run --project src/Yanoch.Web
```

- **No CI configured** — add GitHub Actions if needed
- **Vite config:** `vite.config.js` outputs single `tiptap-editor.js` to `wwwroot/js/`
- **No minification in dev** — Vite `build: { minify: false }` by default

---

## Project-Specific Notes

- **No blocks table:** `Blocks` table exists in DB (migration history) but is unused — editor uses single `Page.Content` markdown
- **Backlinks:** Extracted from `[[wiki links]]` on every content save via regex
- **Subpages:** Loaded via `/api/pages/children/{id}` → injected as `pageReference` nodes (not in markdown)
- **Images:** Uploaded to `wwwroot/uploads/` via `LocalFileStorageService`, served as static files
- **Auth:** ASP.NET Core Identity, cookie-based, Blazor `CascadingAuthenticationState`
- **Dark mode:** CSS `[data-theme="dark"]` toggle persisted in localStorage

---

## Useful File Map

| Task | File |
|---|---|
| Editor config | `src/Yanoch.Web/wwwroot/js/tiptap-editor.src.js` |
| Editor styles | `src/Yanoch.Web/wwwroot/app.css` |
| Page CRUD API | `src/Yanoch.Web/Controllers/Api/PagesController.cs` |
| Page business logic | `src/Yanoch.Application/Services/PageService.cs` |
| Page DB access | `src/Yanoch.Infrastructure/Data/Repositories/PageRepository.cs` |
| Domain models | `src/Yanoch.Domain/Models/*.cs` |
| DI wiring | `src/Yanoch.Web/Program.cs`, `Application/DependencyInjection.cs`, `Infrastructure/DependencyInjection.cs` |
| DB context | `src/Yanoch.Infrastructure/Data/AppDbContext.cs` |
| Migrations | `src/Yanoch.Infrastructure/Migrations/*.cs` |
| Tests | `tests/Yanoch.Tests/Domain/ModelTests.cs` |