# Yanoch — Yet Another Notion Clone

Notion, without the ADHD (WIP).

Yanoch is a personal knowledge workspace — a wiki-style notebook where you organize ideas, notes, and projects in interconnected pages. Think of it as your second brain, built for writing, linking, and finding things fast.

## Features

- **Pages & Subpages** — Create pages and nest them into a hierarchical tree. Each page has a title, an icon, and an optional cover image.
- **Rich Markdown Editor** — TipTap-powered editor with slash commands (`/`), wiki-link autocomplete (`[[`), and real-time preview. Supports headings, lists, tables, code blocks, callouts, task lists, toggles, images, and links.
- **Wiki Links** — Type `[[` inside any page to link to another page. Links are auto-detected and backlinks are tracked — see which pages reference the current one.
- **Tags** — Tag any page with a name and color. Filter and discover pages by tag.
- **Search** — Full-text search across all pages and content.
- **Image Upload** — Paste, drag-drop, or use the image button to embed images. Images are uploaded and stored inline.
- **Trash** — Accidentally deleted pages go to Trash. Restore them or permanently delete them.
- **Version History** — Significant edits are saved as versions, so you can review or revert changes.
- **Dark Mode** — Responsive layout that works on any screen size.
- **Authentication (WIP)** — Register, sign in, and your pages are private to your account.

## Getting Started

### Prerequisites

- [.NET 10 SDK](https://dotnet.microsoft.com/download)
- [Node.js](https://nodejs.org/) (for building the editor bundle)
- [SQLite](https://www.sqlite.org/) (used for data storage)

### Run Locally

```bash
# Install JS dependencies and build the TipTap editor bundle
npm install
npx vite build

# Start the application
dotnet run --project src/Yanoch.Web
```

The app runs at **http://localhost:5072**.

After a fresh clone or pull, always rebuild the JS bundle:

```bash
npx vite build
dotnet run --project src/Yanoch.Web
```

Or use the convenience script:

```bash
./run.sh
```

### Quick Setup

1. Open http://localhost:5072
2. Register a new account
3. Click **+ New Page** from the sidebar
4. Start writing — use `#` for headings, `[[` for links, `/` for block commands
5. Your pages appear in the sidebar and on the Home dashboard

## Usage Guide

### Creating Pages

- Click **+ New Page** in the sidebar or navigate to `/new`
- Enter a title and choose an icon from the emoji picker
- Write content in the editor — it auto-saves as you type
- New pages are created when you enter content or press Enter in the title field

### Editing Pages

- Navigate to any page via the sidebar or search bar
- The editor loads the page's Markdown content
- Changes are saved automatically (debounced 800ms)
- Delete a page from the sidebar or the editor header

### Linking Pages

- Type `[[` to open a search popup and link to another page
- Wiki links appear as inline references in the rendered content
- Each page shows a **Backlinks** section listing pages that reference it

### Tags

- Assign tags to pages for categorization
- Tags have a name and a color badge
- Use the search bar to find pages by tag

### Subpages

- Pages can be nested under parent pages
- The sidebar shows the page tree
- Insert page references into content using `[[`

### Tables

- Type `/table` or use the slash menu to insert a 3×3 table with a header row
- Resize columns by dragging column edges
- Use the floating bubble menu to add or remove rows and columns

### Callouts

- Type `/callout` to insert a highlighted block
- Choose from: Info, Warning, Success, Error, and 9 other types
- Pick an icon from the emoji grid and a color from the color picker

### Toggle Blocks

- Insert collapsible sections to hide/show content
- Click the arrow to expand or collapse

### Images

- Click the image button in the toolbar
- Paste an image file directly into the editor
- Drag and drop image files onto the page
- Supported formats: PNG, JPEG, GIF, WebP

### Keyboard Shortcuts

| Shortcut | Action |
|---|---|
| `#` → Enter | Convert line to heading 1 |
| `##` → Enter | Convert line to heading 2 |
| `###` → Enter | Convert line to heading 3 |
| `-` or `*` → Enter | Create a bullet list |
| `1.` → Enter | Create a numbered list |
| `>` → Enter | Create a blockquote |
| `` ``` `` → Enter | Create a code block |
| `/` | Open slash command menu |
| `[[` | Open wiki link popup |

## Project Structure

```
Yanoch/
├── src/
│   ├── Yanoch.Web/          # Blazor Server frontend
│   ├── Yanoch.Application/  # Page/tag services, DTOs
│   ├── Yanoch.Domain/       # Models (Page, Tag, Backlink, etc.)
│   └── Yanoch.Infrastructure/ # SQLite data access, file storage
├── tests/                   # Unit tests
├── build.sh                 # JS build script
├── run.sh                   # Build + run script
├── package.json             # Frontend dependencies
├── vite.config.js           # Vite bundler config
└── Yanoch.sln              # .NET solution file
```

## Tech Stack

- **Backend:** .NET 10 Blazor Server (C#)
- **Editor:** TipTap (ProseMirror) via JavaScript interop
- **Database:** SQLite with Entity Framework Core
- **Auth:** ASP.NET Core Identity
- **Styling:** Custom CSS with Bootstrap base
- **Build:** Vite for JS bundling, `dotnet` for backend
