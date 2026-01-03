export type Theme = {
  id: string;
  name: string;
  css: string;
};

export const themes: Theme[] = [
  {
    id: "classic",
    name: "Classic",
    css: `
body {
  font-family: Georgia, "Times New Roman", serif;
  font-size: 1.1rem;
  line-height: 1.8;
  color: #2c2c2c;
  background: #fdfcf9;
  padding: 1.5em 2em;
  max-width: 38em;
  margin: 0 auto;
}

h1, h2, h3, h4, h5, h6 {
  font-family: Georgia, "Times New Roman", serif;
  line-height: 1.3;
  margin-top: 1.5em;
  margin-bottom: 0.5em;
  color: #1a1a1a;
}

h1 {
  font-size: 2em;
  border-bottom: 1px solid #ccc;
  padding-bottom: 0.3em;
}

h2 { font-size: 1.5em; }
h3 { font-size: 1.25em; }

p {
  margin-bottom: 1em;
  text-align: justify;
  text-indent: 1.5em;
}

p:first-of-type {
  text-indent: 0;
}

blockquote {
  margin: 1.5em 0;
  padding-left: 1.5em;
  border-left: 3px solid #8b7355;
  font-style: italic;
  color: #555;
}

code {
  font-family: "Courier New", Courier, monospace;
  background: #f0ede6;
  padding: 0.15em 0.4em;
  border-radius: 3px;
  font-size: 0.9em;
}

pre {
  background: #f0ede6;
  padding: 1em;
  overflow-x: auto;
  border-radius: 4px;
  margin: 1em 0;
}

pre code {
  background: none;
  padding: 0;
}

a {
  color: #6b4423;
  text-decoration: underline;
}

ul, ol {
  margin: 1em 0;
  padding-left: 2em;
}

li {
  margin-bottom: 0.5em;
}
`,
  },
  {
    id: "modern",
    name: "Modern",
    css: `
body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
  font-size: 1rem;
  line-height: 1.7;
  color: #24292f;
  background: #ffffff;
  padding: 2em;
  max-width: 42em;
  margin: 0 auto;
}

h1, h2, h3, h4, h5, h6 {
  font-weight: 600;
  line-height: 1.25;
  margin-top: 1.5em;
  margin-bottom: 0.75em;
  color: #1f2328;
}

h1 {
  font-size: 2.25em;
  font-weight: 700;
  padding-bottom: 0.3em;
  border-bottom: 1px solid #d0d7de;
}

h2 {
  font-size: 1.5em;
  padding-bottom: 0.25em;
  border-bottom: 1px solid #d0d7de;
}

h3 { font-size: 1.25em; }

p {
  margin-bottom: 1em;
}

blockquote {
  margin: 1em 0;
  padding: 0 1em;
  border-left: 4px solid #3b82f6;
  color: #57606a;
}

code {
  font-family: ui-monospace, SFMono-Regular, "SF Mono", Menlo, monospace;
  background: #f6f8fa;
  padding: 0.2em 0.4em;
  border-radius: 6px;
  font-size: 0.875em;
}

pre {
  background: #f6f8fa;
  padding: 1em;
  overflow-x: auto;
  border-radius: 8px;
  margin: 1em 0;
  border: 1px solid #d0d7de;
}

pre code {
  background: none;
  padding: 0;
}

a {
  color: #0969da;
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}

ul, ol {
  margin: 1em 0;
  padding-left: 2em;
}

li {
  margin-bottom: 0.4em;
}

hr {
  border: none;
  border-top: 1px solid #d0d7de;
  margin: 2em 0;
}
`,
  },
  {
    id: "minimalist",
    name: "Minimalist",
    css: `
body {
  font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 1.05rem;
  line-height: 2;
  color: #333;
  background: #fff;
  padding: 3em 2em;
  max-width: 32em;
  margin: 0 auto;
  font-weight: 300;
}

h1, h2, h3, h4, h5, h6 {
  font-weight: 400;
  line-height: 1.4;
  margin-top: 2.5em;
  margin-bottom: 1em;
  letter-spacing: -0.01em;
}

h1 {
  font-size: 1.75em;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-weight: 300;
}

h2 {
  font-size: 1.25em;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

h3 {
  font-size: 1.1em;
  font-weight: 500;
}

p {
  margin-bottom: 1.5em;
}

blockquote {
  margin: 2em 0;
  padding: 0 0 0 2em;
  border-left: 1px solid #ccc;
  font-style: italic;
  color: #666;
}

code {
  font-family: Menlo, Monaco, monospace;
  font-size: 0.85em;
  background: #f9f9f9;
  padding: 0.1em 0.3em;
}

pre {
  background: #f9f9f9;
  padding: 1.5em;
  overflow-x: auto;
  margin: 2em 0;
  font-size: 0.85em;
}

pre code {
  background: none;
  padding: 0;
}

a {
  color: #333;
  border-bottom: 1px solid #999;
  text-decoration: none;
}

ul, ol {
  margin: 1.5em 0;
  padding-left: 1.5em;
}

li {
  margin-bottom: 0.75em;
}

hr {
  border: none;
  text-align: center;
  margin: 3em 0;
}

hr::before {
  content: "· · ·";
  color: #ccc;
  letter-spacing: 1em;
}
`,
  },
  {
    id: "dark",
    name: "Dark",
    css: `
body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  font-size: 1rem;
  line-height: 1.75;
  color: #e6edf3;
  background: #0d1117;
  padding: 2em;
  max-width: 40em;
  margin: 0 auto;
}

h1, h2, h3, h4, h5, h6 {
  font-weight: 600;
  line-height: 1.3;
  margin-top: 1.5em;
  margin-bottom: 0.75em;
  color: #f0f6fc;
}

h1 {
  font-size: 2em;
  border-bottom: 1px solid #30363d;
  padding-bottom: 0.3em;
}

h2 {
  font-size: 1.5em;
  border-bottom: 1px solid #30363d;
  padding-bottom: 0.2em;
}

h3 { font-size: 1.25em; }

p {
  margin-bottom: 1em;
}

blockquote {
  margin: 1em 0;
  padding: 0.5em 1em;
  border-left: 4px solid #58a6ff;
  background: #161b22;
  color: #8b949e;
}

code {
  font-family: ui-monospace, SFMono-Regular, "SF Mono", Menlo, monospace;
  background: #161b22;
  padding: 0.2em 0.4em;
  border-radius: 6px;
  font-size: 0.875em;
  color: #ff7b72;
}

pre {
  background: #161b22;
  padding: 1em;
  overflow-x: auto;
  border-radius: 8px;
  margin: 1em 0;
  border: 1px solid #30363d;
}

pre code {
  background: none;
  padding: 0;
  color: #e6edf3;
}

a {
  color: #58a6ff;
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}

ul, ol {
  margin: 1em 0;
  padding-left: 2em;
}

li {
  margin-bottom: 0.4em;
}

hr {
  border: none;
  border-top: 1px solid #30363d;
  margin: 2em 0;
}

strong {
  color: #f0f6fc;
}
`,
  },
  {
    id: "warm",
    name: "Warm",
    css: `
body {
  font-family: Palatino, "Palatino Linotype", "Book Antiqua", Georgia, serif;
  font-size: 1.1rem;
  line-height: 1.85;
  color: #433422;
  background: #f5efe6;
  padding: 2em;
  max-width: 36em;
  margin: 0 auto;
}

h1, h2, h3, h4, h5, h6 {
  font-family: Palatino, "Palatino Linotype", "Book Antiqua", Georgia, serif;
  font-weight: normal;
  line-height: 1.3;
  margin-top: 1.5em;
  margin-bottom: 0.5em;
  color: #2d1f10;
}

h1 {
  font-size: 2em;
  text-align: center;
  margin-bottom: 1em;
}

h2 {
  font-size: 1.4em;
  border-bottom: 2px solid #d4c4a8;
  padding-bottom: 0.3em;
}

h3 {
  font-size: 1.2em;
  font-style: italic;
}

p {
  margin-bottom: 1em;
  text-align: justify;
  hyphens: auto;
}

blockquote {
  margin: 1.5em 0;
  padding: 1em 1.5em;
  background: #ebe3d6;
  border-left: 4px solid #b8a07a;
  font-style: italic;
  color: #5c4a32;
}

code {
  font-family: "Courier New", Courier, monospace;
  background: #ebe3d6;
  padding: 0.15em 0.35em;
  border-radius: 3px;
  font-size: 0.9em;
  color: #6b4423;
}

pre {
  background: #ebe3d6;
  padding: 1em;
  overflow-x: auto;
  border-radius: 4px;
  margin: 1.5em 0;
  border: 1px solid #d4c4a8;
}

pre code {
  background: none;
  padding: 0;
  color: #433422;
}

a {
  color: #8b5a2b;
  text-decoration: none;
  border-bottom: 1px dotted #8b5a2b;
}

a:hover {
  color: #6b4423;
  border-bottom-style: solid;
}

ul, ol {
  margin: 1em 0;
  padding-left: 2em;
}

li {
  margin-bottom: 0.5em;
}

hr {
  border: none;
  border-top: 1px solid #d4c4a8;
  margin: 2em 4em;
}

strong {
  color: #2d1f10;
}

em {
  color: #5c4a32;
}
`,
  },
  {
    id: "zine",
    name: "Zine",
    css: `
/* ========================================
   ZINE THEME - Raw, punk, collage aesthetic
   ======================================== */

@page {
  margin: 0;
  padding: 0;
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  padding: 0;
  background: #f8f6f1;
  font-family: "Courier New", Courier, monospace;
  color: #1a1a1a;
  overflow-x: hidden;
}

/* ---- Base zine page ---- */
.zine-page {
  width: 100%;
  min-height: 100vh;
  position: relative;
  overflow: hidden;
  page-break-after: always;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* ---- Cover page ---- */
.zine-page.cover {
  background: #0a0a0a;
  color: #f8f6f1;
  flex-direction: column;
  text-align: center;
  padding: 2rem;
}

.cover-image {
  position: absolute;
  inset: 0;
  opacity: 0.3;
  overflow: hidden;
}

.cover-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: grayscale(100%) contrast(1.2);
}

.cover-content {
  position: relative;
  z-index: 1;
  padding: 2rem;
}

.cover-title {
  font-family: Impact, "Arial Black", sans-serif;
  font-size: 4rem;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: -0.03em;
  line-height: 0.9;
  margin: 0 0 1rem;
  text-shadow: 4px 4px 0 #ff3366;
}

.cover-author {
  font-size: 1rem;
  text-transform: uppercase;
  letter-spacing: 0.3em;
  opacity: 0.7;
  margin: 0;
}

/* ---- Full-bleed image page ---- */
.zine-page.full-bleed {
  padding: 0;
  background: #0a0a0a;
}

.zine-page.full-bleed .image-container {
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.zine-page.full-bleed .full-image {
  max-width: 100%;
  max-height: 100vh;
  object-fit: contain;
}

.zine-page.full-bleed .image-title {
  position: absolute;
  bottom: 1.5rem;
  left: 1.5rem;
  right: 1.5rem;
  font-family: "Courier New", monospace;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  color: #f8f6f1;
  background: rgba(0,0,0,0.8);
  padding: 0.5rem 0.75rem;
  display: inline-block;
  width: fit-content;
}

/* Full-bleed variants */
.zine-page.full-bleed.variant-0 { background: #0a0a0a; }
.zine-page.full-bleed.variant-1 { 
  background: #f8f6f1;
}
.zine-page.full-bleed.variant-1 .full-image {
  border: 8px solid #0a0a0a;
  box-shadow: 12px 12px 0 rgba(0,0,0,0.2);
  max-width: 85%;
  max-height: 85vh;
}
.zine-page.full-bleed.variant-2 .full-image {
  filter: grayscale(100%);
}
.zine-page.full-bleed.variant-3 .full-image {
  filter: contrast(1.3) saturate(0.8);
}

/* ---- Text spread page ---- */
.zine-page.text-spread {
  background: #f8f6f1;
  padding: 3rem 2rem;
  flex-direction: column;
}

.zine-page.text-spread .text-container {
  max-width: 85%;
  padding: 2rem;
}

.zine-page.text-spread .spread-text {
  font-size: 1.6rem;
  line-height: 1.5;
  font-weight: 400;
  margin: 0;
}

/* Text spread variants */
.zine-page.text-spread.variant-0 {
  background: #0a0a0a;
  color: #f8f6f1;
}
.zine-page.text-spread.variant-0 .spread-text {
  font-family: Impact, "Arial Black", sans-serif;
  font-size: 2.5rem;
  text-transform: uppercase;
  line-height: 1.1;
}

.zine-page.text-spread.variant-1 {
  background: #ff3366;
  color: #0a0a0a;
}
.zine-page.text-spread.variant-1 .spread-text {
  font-family: Georgia, serif;
  font-style: italic;
  font-size: 1.8rem;
}

.zine-page.text-spread.variant-2 {
  background: repeating-linear-gradient(
    45deg,
    #f8f6f1,
    #f8f6f1 10px,
    #e8e6e1 10px,
    #e8e6e1 20px
  );
}
.zine-page.text-spread.variant-2 .text-container {
  background: #f8f6f1;
  border: 3px solid #0a0a0a;
}

.zine-page.text-spread.variant-3 {
  background: #1a1a2e;
  color: #eee;
}
.zine-page.text-spread.variant-3 .spread-text {
  font-family: "Courier New", monospace;
  font-size: 1.2rem;
  letter-spacing: 0.05em;
}

.zine-page.text-spread.variant-4 {
  background: #f0e68c;
  color: #0a0a0a;
}
.zine-page.text-spread.variant-4 .text-container {
  border-left: 8px solid #0a0a0a;
  padding-left: 1.5rem;
}

/* ---- Collage pages ---- */
.zine-page.collage {
  background: #f8f6f1;
  padding: 2rem;
}

.zine-page.collage .collage-container {
  position: relative;
  width: 100%;
  height: 80vh;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 0;
}

.zine-page.collage .collage-item {
  position: absolute;
  transition: transform 0.3s ease;
}

.zine-page.collage .collage-image {
  max-width: 45vw;
  max-height: 40vh;
  object-fit: cover;
  border: 4px solid #0a0a0a;
  box-shadow: 8px 8px 0 rgba(0,0,0,0.15);
}

/* Collage-2 positions */
.zine-page.collage-2 .item-0 {
  top: 10%;
  left: 5%;
}
.zine-page.collage-2 .item-1 {
  bottom: 10%;
  right: 5%;
}

/* Collage-3 positions */
.zine-page.collage-3 .item-0 {
  top: 5%;
  left: 10%;
}
.zine-page.collage-3 .item-1 {
  top: 30%;
  right: 5%;
}
.zine-page.collage-3 .item-2 {
  bottom: 5%;
  left: 25%;
}
.zine-page.collage-3 .collage-image {
  max-width: 35vw;
  max-height: 30vh;
}

/* Collage variants */
.zine-page.collage.variant-0 {
  background: #0a0a0a;
}
.zine-page.collage.variant-0 .collage-image {
  border-color: #f8f6f1;
}

.zine-page.collage.variant-1 {
  background: #ff3366;
}
.zine-page.collage.variant-1 .collage-image {
  border-color: #0a0a0a;
  filter: grayscale(100%);
}

.zine-page.collage.variant-2 {
  background: repeating-linear-gradient(
    -45deg,
    #f8f6f1,
    #f8f6f1 20px,
    #0a0a0a 20px,
    #0a0a0a 22px
  );
}

.zine-page.collage.variant-3 {
  background: #264653;
}
.zine-page.collage.variant-3 .collage-image {
  border-color: #e9c46a;
}

/* ---- Mixed page (image + text) ---- */
.zine-page.mixed {
  background: #f8f6f1;
  padding: 2rem;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  align-items: center;
}

.zine-page.mixed.image-right {
  grid-template-columns: 1fr 1fr;
}

.zine-page.mixed.image-left .mixed-image {
  order: -1;
}

.zine-page.mixed .mixed-image img {
  width: 100%;
  height: auto;
  object-fit: cover;
  border: 4px solid #0a0a0a;
  box-shadow: 8px 8px 0 rgba(0,0,0,0.15);
}

.zine-page.mixed .mixed-text {
  padding: 1rem;
}

.zine-page.mixed .mixed-text p {
  font-size: 1.1rem;
  line-height: 1.6;
  margin: 0;
}

/* Mixed variants */
.zine-page.mixed.variant-0 {
  background: #0a0a0a;
  color: #f8f6f1;
}
.zine-page.mixed.variant-0 .mixed-image img {
  border-color: #f8f6f1;
}

.zine-page.mixed.variant-1 {
  background: #2a9d8f;
  color: #0a0a0a;
}
.zine-page.mixed.variant-1 .mixed-text p {
  font-family: Georgia, serif;
  font-style: italic;
  font-size: 1.3rem;
}

.zine-page.mixed.variant-2 .mixed-image img {
  filter: grayscale(100%) contrast(1.2);
}
.zine-page.mixed.variant-2 .mixed-text {
  background: #0a0a0a;
  color: #f8f6f1;
  padding: 1.5rem;
}

.zine-page.mixed.variant-3 {
  background: #e9c46a;
}
.zine-page.mixed.variant-3 .mixed-text p {
  font-family: Impact, "Arial Black", sans-serif;
  text-transform: uppercase;
  font-size: 1.5rem;
  line-height: 1.2;
}

/* ---- Divider page ---- */
.zine-page.divider {
  background: #0a0a0a;
  color: #f8f6f1;
}

.zine-page.divider .divider-content {
  text-align: center;
  padding: 2rem;
}

.zine-page.divider .divider-title {
  font-family: "Courier New", monospace;
  font-size: 5rem;
  font-weight: normal;
  margin: 0 0 1rem;
  letter-spacing: 0.2em;
}

.zine-page.divider .divider-line {
  width: 100px;
  height: 4px;
  background: #ff3366;
  margin: 0 auto;
}

/* Divider variants */
.zine-page.divider.variant-1 {
  background: #ff3366;
  color: #0a0a0a;
}
.zine-page.divider.variant-1 .divider-line {
  background: #0a0a0a;
}

.zine-page.divider.variant-2 {
  background: repeating-linear-gradient(
    90deg,
    #0a0a0a,
    #0a0a0a 50%,
    #f8f6f1 50%,
    #f8f6f1 100%
  );
}
.zine-page.divider.variant-2 .divider-title {
  background: #0a0a0a;
  color: #f8f6f1;
  padding: 1rem 2rem;
  display: inline-block;
}

.zine-page.divider.variant-3 {
  background: #264653;
}
.zine-page.divider.variant-3 .divider-line {
  background: #e9c46a;
}

/* ---- Utility overrides ---- */
img {
  max-width: 100%;
  height: auto;
}

/* Print optimizations */
@media print {
  .zine-page {
    page-break-after: always;
    page-break-inside: avoid;
  }
}
`,
  },
];

export function getThemeById(id: string): Theme | undefined {
  return themes.find((theme) => theme.id === id);
}

export function getDefaultTheme(): Theme {
  return themes[0];
}

