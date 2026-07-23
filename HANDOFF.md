# Yanoch — Handoff Document

## Current Status

**Stable MVP.** Core Notion-like features work end-to-end.

### Working

- User registration, login, logout (cookie auth via `AccountController`)
- Page creation, editing, soft-delete
- Block creation, inline text editing, deletion
- Block types: text, heading 1/2/3, todo, bullet list, numbered list, toggle, code, quote, callout, divider
- Markdown rendering: `**bold**`, `*italic*`, `[[wiki links]]`
- Wiki links auto-generate backlinks (shown at page bottom)
- Full-text search (title + block content, 20-result limit)
- Page tree sidebar with child counts (refreshes on navigation)
- REST API for all CRUD operations
- Responsive UI (sidebar collapses on mobile)
- SQLite by default, PostgreSQL configurable
- Circuit crash isolation (try/catch + disposed guards on all event handlers)

### Not Working / Missing

| Item | Status | Notes |
|------|--------|-------|
| **Image block** | ✅ Working | Upload, rendering, and storage implemented. Users can upload images via the image block editor. |
| **Drag-and-drop reordering** | Not wired | Drag handles render but drop targets and reorder logic are missing. |
| **Nested pages in sidebar** | Flat only | Tree shows root pages with direct-child counts, but no recursive expansion. |
| **Change block type** | Not implemented | No `/command` UI to switch a block between text/heading/todo/etc. |
| **Version history** | Removed | Backend methods exist but auto-versioning was disabled and the UI button was removed. |
| **Dark mode** | Not implemented | |
| **File attachments** | Not implemented | `BlockType.File = 13` exists in enum only. |
| **Database / tables / embeds** | Not implemented | Block types exist in the enum but have no rendering. |

---

## Plan: Image Block Support

### Goal

Allow users to upload, embed, and view images inside the block editor.

### What was implemented

**1. File storage** ✅

- Local file storage service implemented (`LocalFileStorageService`)
- Saves files to `wwwroot/uploads/` with unique filenames
- Validates file types (png, jpg, jpeg, gif, webp, svg) and size (10MB max)

**2. Image block rendering** ✅

- Image case added to `BlockEditor.razor` for both view and edit modes
- View mode: renders `<img src="@Block.Content" />` when image URL is present
- Edit mode: shows upload area with file picker and remove button

**3. Image upload endpoint** ✅

- `POST /api/upload` endpoint implemented in `UploadController`
- Accepts `multipart/form-data` with file upload
- Returns `{ url: "/uploads/..." }` on success
- Authorized access only

**4. Image upload component** ✅

- `ImageUpload.razor` component handles file selection and upload
- **Fixed**: Now uses server-side approach via direct `IFileStorageService` call
- Shows progress and error states
- Avoids HttpClient authentication issues in Blazor Server
- More reliable and maintainable

### Implementation completed

✅ `IFileStorageService` + local implementation
✅ `UploadController` with file validation
✅ Image block rendering in `BlockEditor.razor`
✅ Upload flow wired up in the editor
✅ Image upload component with **server-side approach** (fixed crash issue)

### Files modified

- `ImageUpload.razor`: Updated to call real `/api/upload` endpoint
- `Program.cs`: Added infrastructure dependency injection
- `HANDOFF.md`: Updated status to reflect completed work

### Out of scope for v1 image support

- Drag-drop image upload onto the page (nice-to-have)
- Image resizing / thumbnails
- CDN integration
- EXIF stripping
- Block-level image captions editing (store in `Metadata` as JSON string for now)

---

## Known Issues

- `FindPageByTitle` (backlink extraction) recursively walks the page tree with a DB query per level — slow for many pages. No timeout.
- No loading spinners during block save — page freezes momentarily on slow connections.
- Single-user session: page tree reloads for the same user across tabs (Blazor Server limitation).
- No HTTPS dev cert configured — `UseHttpsRedirection()` is enabled but harmless.

---

## Testing

All CRUD verified via the REST API with curl:

```powershell
curl -c cookies.txt -X POST -d "email=a@a.com&password=Test12" http://localhost:5072/account/register
curl -b cookies.txt -X POST -H "Content-Type: application/json" -d "{\"title\":\"Test\"}" http://localhost:5072/api/pages
curl -b cookies.txt -X PUT -H "Content-Type: application/json" -d "{\"blocks\":[{\"type\":\"text\",\"content\":\"Hello\",\"sortOrder\":0}]}" http://localhost:5072/api/pages/{pageId}
curl -b cookies.txt -X DELETE http://localhost:5072/api/pages/{pageId}
```

---

## Running

```powershell
cd D:\Sourcecodes\Yanoch
dotnet run --project src/Yanoch.Web
# http://localhost:5072
```



---
## Update: .NET 10 Migration & Bug Fixes (July 2026)

### .NET 10 Upgrade

- All projects updated to target **net10.0**
- Package versions bumped:
  - EF Core packages to 10.0.10
  - Npgsql.EntityFrameworkCore.PostgreSQL to 10.0.3
  - Microsoft.Extensions.DependencyInjection.Abstractions to 10.0.10
- Cleaned stale obj/bin folders from previous builds
- SDK 10.0.302 installed locally at ~/.dotnet10

### Bug Fixes

**Bug 1 - Image doesn't display after upload (requires manual refresh)**

Root cause: HandleImageUpload set Block.Content but never set isEditing = false.
Since MergePageInPlace mutates the same object reference, Blazor's OnParametersSet
never fires on the child component. The block stays in edit mode.

Fix: Added isEditing = false; StateHasChanged(); after the upload save.

**Bug 2 - Text edits lost when another block triggers a save**

Root cause: editContent held the latest typed text, but Block.Content synced only on
Enter. When another block triggered a save, HandleBlockUpdate read stale Content values.

Fix: Removed editContent indirection. Inputs bind to Block.Content directly.
Added _contentBeforeEdit backup field for Escape revert.

### Running

```powershell
$env:PATH = "$env:USERPROFILE\.dotnet10;$env:PATH"
cd D:\Sourcecodes\Yanoch
dotnet run --project src/Yanoch.Web
```

### Infrastructure

- Regenerated EF Core migration for v10 model (removed old v8 migration, created fresh)

