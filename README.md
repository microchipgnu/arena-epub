# Are.na → Zine

Transform your [Are.na](https://are.na) channels into beautiful, downloadable zine-style EPUBs.

![Vite](https://img.shields.io/badge/Vite-7.x-646CFF?logo=vite&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)

## ✨ Features

- **Channel Import** — Add one or more public Are.na channels by URL or slug
- **Zine Layouts** — Images and text are transformed into artsy collage-style spreads with random rotations, offsets, and dynamic layouts
- **Multiple Themes** — Choose from Classic, Modern, Zine, and more styling options
- **EPUB Generation** — Creates valid EPUB 3 files with embedded images
- **Live Preview** — Preview your zine directly in the browser before downloading
- **Web Worker Processing** — Heavy lifting happens in a background thread for a smooth UI

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 18+ or [Bun](https://bun.sh/)

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd arena-vite-book

# Install dependencies
bun install
# or
npm install
```

### Development

```bash
bun dev
# or
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) to view the app.

### Build

```bash
bun run build
# or
npm run build
```

The production build will be in the `dist/` folder.

### Preview Production Build

```bash
bun preview
# or
npm run preview
```

## 📖 How It Works

1. **Enter an Are.na channel** — Paste a channel URL like `https://www.are.na/username/channel-slug` or just the slug `channel-slug`
2. **Add multiple channels** — Click "Add" or press Enter to queue up channels; they'll be combined into one zine
3. **Pick a theme** — Select a visual theme from the dropdown
4. **Generate** — Click "Generate Zine" and watch the progress bar
5. **Preview & Download** — Flip through pages in the browser preview, then download your EPUB

## 🎨 Available Themes

| Theme    | Description                                     |
| -------- | ----------------------------------------------- |
| Classic  | Traditional book styling with serif fonts       |
| Modern   | Clean sans-serif with generous whitespace       |
| Zine     | DIY aesthetic with collage effects & bold type  |
| …        | More themes available in the app                |

## 🛠 Tech Stack

- **[Vite](https://vite.dev/)** — Lightning-fast dev server & build tool
- **[TypeScript](https://www.typescriptlang.org/)** — Type-safe JavaScript
- **[Are.na API](https://dev.are.na/)** — Public API for fetching channel content
- **[epub.js](https://github.com/futurepress/epub.js)** — In-browser EPUB rendering
- **[@zip.js/zip.js](https://gildas-lormeau.github.io/zip.js/)** — Pure JS ZIP creation for EPUB packaging
- **[markdown-it](https://github.com/markdown-it/markdown-it)** — Markdown parsing

## 📂 Project Structure

```
src/
├── arena/
│   ├── api.ts        # Are.na API client & helpers
│   ├── transform.ts  # Convert blocks → zine pages
│   └── types.ts      # TypeScript interfaces for API responses
├── epub/
│   ├── buildEpub.ts  # EPUB 3 file generation
│   ├── preview.ts    # In-browser EPUB rendering
│   └── themes.ts     # CSS theme definitions
├── worker/
│   └── zineWorker.ts # Web Worker for background processing
├── main.ts           # App entry point & UI logic
└── style.css         # Application styles
```

## ⚠️ Limitations

- **Public channels only** — Private Are.na channels cannot be accessed
- **Image size** — Very large images may slow down generation or fail to load
- **Block limit** — Defaults to fetching up to 200 blocks per channel for performance

## 📝 License

MIT

---

Made with ✂️ and 📚

