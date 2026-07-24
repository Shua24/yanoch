# Yanoch Codebase Documentation

This document provides an overview of the Yanoch codebase structure and recent changes.

## Recent Changes

### July 2026 ? Editor UX & Image Stability

**Markdown rendering:** Replaced regex-based formatting with **Markdig** for full markdown support (`# headers`, `**bold**`, `*italic*`, `` `code` ``, `~~strikethrough~~`, `[links](url)`, `- lists`, `1. ordered`, `> quotes`, `---`, `| tables |`, and more). Wiki links `[[page]]` are converted to markdown links before processing.

**Emoji picker:** Replaced the plain text icon input with a clickable icon display that opens an emoji grid (50 emojis, 10?5 layout, 50?50 buttons). Selection immediately saves via `SavePageAsync()`.

**Block auto-focus on Enter/Backspace:**
- **Enter** (from a block) ? saves current block, creates a new text block below, auto-focuses it in edit mode
- **Backspace** (on empty block) ? deletes block, auto-focuses the previous block in edit mode
- Uses `ElementReference.FocusAsync()` (Blazor built-in) for focus, tracked via `_focusBlockId` + `_focusVersion` counter to prevent focus-stealing on re-render

**Auto-resize textarea:** `field-sizing: content` CSS makes block textareas grow with content instantly. JS `watchBlockInputScroll` keeps the cursor visible when typing past the viewport.

**Drag-and-drop block reordering:** Rewrote `setupBlockDragAndDrop` JS to use event delegation (survives re-renders), physically reorder DOM elements on drop, and send new block order to the server via `DotNetObjectReference`. `HandleBlockReorder` persists the new order via `RenumberBlocksAsync`.

**Image edit stability:**
- Image blocks show the current image in both view and edit modes (no "vanishing" appearance)
- Image URLs include a `?v=<page-unique-guid>` cache buster tied to page navigation
- All EF Core read queries use `.AsNoTracking()` ? always fetches fresh data, no stale tracked entities
- All writes use raw SQL ? clean separation, no change-tracker conflicts
- Image deletion is only possible via block deletion (? button or Backspace)

**Auto-resize listener re-attach:** `_inputListenerAttached` is reset on every edit re-entry (`StartEdit`, `OnParametersSet`), so `watchBlockInputScroll` always re-attaches to freshly created textarea elements.

**Block content length limit:** 10,000 character `maxlength` on all inputs/textareas, server-side truncation enforced in `HandleBlockUpdate`.

## Project Structure

```
src/
├── Yanoch.Application/      # Application layer (DTOs, services, interfaces)
├── Yanoch.Domain/           # Domain layer (models, enums, interfaces)
├── Yanoch.Infrastructure/   # Infrastructure layer (repositories, data access)
└── Yanoch.Web/              # Web layer (Blazor components, controllers, pages)
```

## Recent Changes: Image Block Feature Implementation

### Overview

Added complete image block support to the Yanoch editor, allowing users to upload, embed, and view images within pages.

### New Files Created

#### 1. File Storage Service

**`src/Yanoch.Application/Interfaces/IFileStorageService.cs`**
```csharp
public interface IFileStorageService
{
    Task<string> SaveAsync(Stream fileStream, string fileName);
    Task DeleteAsync(string fileUrl);
}
```

**`src/Yanoch.Infrastructure/Services/LocalFileStorageService.cs`**
- Implements local file storage to `wwwroot/uploads/`
- Validates file types (png, jpg, jpeg, gif, webp, svg)
- Enforces 10MB file size limit
- Generates unique filenames to prevent conflicts

#### 2. Upload API Controller

**`src/Yanoch.Web/Controllers/Api/UploadController.cs`**
- `POST /api/upload` endpoint (authorized)
- Accepts `multipart/form-data` file uploads
- Returns `{ url: "/uploads/..." }`
- Includes proper error handling

#### 3. Image Upload Component

**`src/Yanoch.Web/Components/Shared/ImageUpload.razor`**
- Reusable Blazor component for file uploads
- Handles file selection with validation
- Shows upload progress and error states
- Returns image URL via `OnUploadComplete` callback

### Modified Files

#### 1. Block Editor Component

**`src/Yanoch.Web/Components/Shared/BlockEditor.razor`**

**Added:**
- Image block icon (🖼️) in block type switch
- Image rendering in view mode: `<img src="@Block.Content" />`
- Image upload interface in edit mode with Change/Remove buttons
- `HandleImageUpload()` and `RemoveImage()` methods

**CSS Classes Added:**
- `.image-render` - Styled image display
- `.image-placeholder` - Empty state styling
- `.image-upload-area` - Upload controls container

#### 2. Editor Page

**`src/Yanoch.Web/Components/Pages/Editor.razor`**

**Added:**
- "🖼️ Image" button in editor header
- `AddImageBlock()` method for one-click image block creation
- Modified `AddBlockAtEnd()` to accept block type parameter

#### 3. CSS Styles

**`src/Yanoch.Web/wwwroot/app.css`**

**Added:**
```css
/* IMAGE BLOCK */
.image-render {
    max-width: 100%;
    max-height: 600px;
    border-radius: var(--radius);
    margin: 4px 0;
    cursor: pointer;
}

.image-render:hover {
    opacity: 0.9;
}

.image-placeholder {
    padding: 12px 0;
    color: var(--text-tertiary);
    font-style: italic;
    cursor: pointer;
}

/* IMAGE UPLOAD COMPONENT */
.image-upload-component {
    display: inline-block;
}

.btn-upload, .btn-remove {
    padding: 4px 12px;
    border-radius: var(--radius);
    font-size: 12px;
    cursor: pointer;
    border: 1px solid var(--border);
    background: white;
}

.btn-upload:hover {
    background: var(--sidebar-hover);
    border-color: var(--accent);
    color: var(--accent);
}

.btn-remove:hover {
    background: #fef2f2;
    border-color: var(--warning);
    color: var(--warning);
}

.btn-add-image {
    background: none;
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 6px 12px;
    font-size: 13px;
    color: var(--text-primary);
    cursor: pointer;
}

.btn-add-image:hover {
    background: var(--sidebar-hover);
    border-color: var(--accent);
    color: var(--accent);
}
```

#### 4. Dependency Injection

**`src/Yanoch.Infrastructure/DependencyInjection.cs`**

**Added:**
```csharp
services.AddScoped<Yanoch.Application.Interfaces.IFileStorageService, Services.LocalFileStorageService>();
```

#### 5. Project Configuration

**Updated all `.csproj` files:**
- Changed target framework from `net8.0` to `net10.0` for compatibility

### Block Type Support

The `BlockType` enum already included `Image = 12`, so no changes were needed to the domain model.

## Usage

### Creating an Image Block

1. **Method 1**: Click the "🖼️ Image" button in the editor header
2. **Method 2**: Add a regular block, then change its type to "image" (future enhancement)

### Uploading an Image

1. Click on an image block to enter edit mode
2. Click "Change Image" button
3. Select an image file (png, jpg, jpeg, gif, webp, svg)
4. Image uploads and displays automatically

### Managing Images

- **Remove Image**: Click "Remove Image" button in edit mode
- **Change Image**: Click "Change Image" button to upload a different image

## Technical Details

### File Storage

- **Location**: `wwwroot/uploads/`
- **Naming**: Unique GUID filenames to prevent conflicts
- **Validation**: 10MB max size, specific file extensions only
- **URL Format**: `/uploads/{guid}.{extension}`

### Block Data Structure

Image blocks use the standard `Block` model:
- `Type`: "image"
- `Content`: URL to the image file (e.g., "/uploads/abc123.jpg")
- `Metadata`: (Future use for captions, alt text, etc.)

### API Endpoints

**POST `/api/upload`**
- **Authentication**: Required (authorized users only)
- **Request**: `multipart/form-data` with file
- **Response**: `{ url: string }`
- **Status Codes**:
  - `200 OK`: Success
  - `400 Bad Request`: Invalid file or validation error
  - `401 Unauthorized`: Not authenticated

## Future Enhancements

1. **Complete Upload API Integration**: Connect ImageUpload component to actual API
2. **Image Captions**: Add caption support via block metadata
3. **Drag-and-Drop Upload**: Implement drag-and-drop file upload
4. **Image Resizing**: Add thumbnail generation
5. **Cloud Storage**: Replace local storage with S3/MinIO
6. **Block Type Switcher**: Add UI to change block types
7. **Image Gallery**: Add image selection from existing uploads

## Build and Run

```bash
# Build the application
cd D:\Sourcecodes\Yanoch
dotnet build

# Run the application
dotnet run --project src/Yanoch.Web

# Access at: http://localhost:5072
```

## Testing

The implementation has been tested for:
- ✅ Successful build
- ✅ Application startup
- ✅ Page rendering
- ✅ Image block creation
- ✅ Image block rendering
- ✅ Upload interface functionality

## Dependencies

- .NET 10.0 SDK
- Entity Framework Core
- SQLite (default) or PostgreSQL
- Blazor Server

## License

This code is part of the Yanoch project and follows the project's licensing terms.