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
];

export function getThemeById(id: string): Theme | undefined {
  return themes.find((theme) => theme.id === id);
}

export function getDefaultTheme(): Theme {
  return themes[0];
}

