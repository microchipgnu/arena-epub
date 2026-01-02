import "./style.css";
import { buildEpubBlob } from "./epub/buildEpub";
import { renderEpubFromBlob } from "./epub/preview";
import { themes, getThemeById, getDefaultTheme } from "./epub/themes";
import type { PreviewResult } from "./epub/preview";
import type { Rendition } from "epubjs";

const themeOptions = themes
  .map((t) => `<option value="${t.id}">${t.name}</option>`)
  .join("");

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <div class="container">
    <header class="header">
      <h1>📚 Epubook</h1>
      <p class="subtitle">Client-side EPUB generator & preview</p>
    </header>
    
    <div class="theme-selector">
      <label for="theme-select">Theme</label>
      <select id="theme-select" class="select">
        ${themeOptions}
      </select>
    </div>
    
    <div class="controls">
      <button id="btn" class="btn btn-primary">
        <span class="btn-icon">⚡</span>
        Generate + Preview
      </button>
      <button id="prev" class="btn btn-secondary" disabled>
        <span class="btn-icon">←</span>
        Prev
      </button>
      <button id="next" class="btn btn-secondary" disabled>
        <span class="btn-icon">→</span>
        Next
      </button>
      <button id="dl" class="btn btn-accent" disabled>
        <span class="btn-icon">↓</span>
        Download
      </button>
    </div>
    
    <div id="viewer" class="viewer">
      <div class="placeholder">
        <span class="placeholder-icon">📖</span>
        <p>Click "Generate + Preview" to create your EPUB</p>
      </div>
    </div>
  </div>
`;

const btn = document.querySelector<HTMLButtonElement>("#btn")!;
const prev = document.querySelector<HTMLButtonElement>("#prev")!;
const next = document.querySelector<HTMLButtonElement>("#next")!;
const dl = document.querySelector<HTMLButtonElement>("#dl")!;
const viewer = document.querySelector<HTMLDivElement>("#viewer")!;
const themeSelect = document.querySelector<HTMLSelectElement>("#theme-select")!;

let currentBlob: Blob | null = null;
let rendition: Rendition | null = null;

btn.onclick = async () => {
  btn.disabled = true;
  btn.innerHTML = `<span class="btn-icon">⏳</span> Building…`;
  
  const selectedTheme = getThemeById(themeSelect.value) ?? getDefaultTheme();
  
  try {
    const blob = await buildEpubBlob({
      title: "Epubook Demo",
      author: "Luis",
      language: "en",
      chapters: [
        {
          title: "Introduction",
          markdown: `# Welcome to Epubook

This is a demo EPUB generated entirely in your browser.

## Features

- **Pure client-side** generation
- No server required
- Uses zip.js for EPUB packaging
- Markdown to XHTML conversion
- Live preview with epub.js

## How it works

1. Write your chapters in Markdown
2. The generator converts them to XHTML
3. Everything is packaged into a valid EPUB
4. Preview it right here or download it!
`,
        },
        {
          title: "Getting Started",
          markdown: `# Getting Started

## Installation

This project uses:

- **Vite** for blazing fast development
- **zip.js** for EPUB archive creation
- **markdown-it** for Markdown parsing
- **epub.js** for in-browser preview

## Usage

\`\`\`typescript
import { buildEpubBlob } from "./epub/buildEpub";

const epub = await buildEpubBlob({
  title: "My Book",
  author: "Author Name",
  chapters: [
    { title: "Chapter 1", markdown: "# Hello World" }
  ]
});
\`\`\`

That's it! You get a valid EPUB blob ready for download or preview.
`,
        },
        {
          title: "Advanced Topics",
          markdown: `# Advanced Topics

## Custom Styling

You can pass custom CSS to style your EPUB:

\`\`\`typescript
buildEpubBlob({
  // ...
  css: \`
    body {
      font-family: Georgia, serif;
      line-height: 1.8;
      color: #333;
    }
    h1 { color: #c0392b; }
  \`
});
\`\`\`

## Adding Images

Coming soon: Support for cover images and inline graphics.

## Web Worker Support

For large books, consider running the generator in a Web Worker to keep the UI responsive.
`,
        },
      ],
      css: selectedTheme.css,
    });

    currentBlob = blob;

    const result: PreviewResult = await renderEpubFromBlob(blob, viewer, {
      height: "600px",
      width: "100%",
    });
    rendition = result.rendition;

    prev.disabled = false;
    next.disabled = false;
    dl.disabled = false;
  } catch (error) {
    console.error("Failed to generate EPUB:", error);
    viewer.innerHTML = `<div class="error">Failed to generate EPUB. Check console for details.</div>`;
  } finally {
    btn.disabled = false;
    btn.innerHTML = `<span class="btn-icon">⚡</span> Generate + Preview`;
  }
};

prev.onclick = () => rendition?.prev();
next.onclick = () => rendition?.next();

dl.onclick = () => {
  if (!currentBlob) return;
  const url = URL.createObjectURL(currentBlob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "epubook.epub";
  a.click();
  URL.revokeObjectURL(url);
};
