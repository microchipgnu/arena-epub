import MarkdownIt from "markdown-it";
import { BlobWriter, TextReader, Uint8ArrayReader, ZipWriter } from "@zip.js/zip.js";

export type Chapter = { title: string; markdown: string };

export interface ImageAsset {
  id: string;           // Unique identifier for the image
  filename: string;     // Filename with extension (e.g., "image-1.jpg")
  data: ArrayBuffer;    // Raw image data
  mediaType: string;    // MIME type (e.g., "image/jpeg")
}

export interface ZineChapter {
  title: string;
  html: string;         // Pre-rendered HTML (not markdown)
  images?: string[];    // Image IDs referenced in this chapter
}

export type BookInput = {
  title: string;
  author: string;
  language?: string;
  chapters: Chapter[];
  css?: string;
};

export type ZineBookInput = {
  title: string;
  author: string;
  language?: string;
  zineChapters: ZineChapter[];
  images: ImageAsset[];
  css?: string;
};

const md = new MarkdownIt({ html: true, linkify: true, typographer: true });

function escapeXml(s: string): string {
  return s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function xhtmlDoc(title: string, bodyHtml: string, lang: string): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="${lang}">
<head>
  <meta charset="utf-8" />
  <title>${escapeXml(title)}</title>
  <link rel="stylesheet" type="text/css" href="styles.css" />
</head>
<body>
${bodyHtml}
</body>
</html>`;
}

function containerXml(): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<container version="1.0"
  xmlns="urn:oasis:names:tc:opendocument:xmlns:container">
  <rootfiles>
    <rootfile full-path="OEBPS/content.opf"
      media-type="application/oebps-package+xml"/>
  </rootfiles>
</container>`;
}

function navXhtml(
  bookTitle: string,
  lang: string,
  items: { title: string; href: string }[]
): string {
  const lis = items
    .map((c) => `<li><a href="${c.href}">${escapeXml(c.title)}</a></li>`)
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml"
      xmlns:epub="http://www.idpf.org/2007/ops"
      xml:lang="${lang}">
<head>
  <meta charset="utf-8" />
  <title>Table of Contents</title>
</head>
<body>
  <nav epub:type="toc" id="toc">
    <h1>${escapeXml(bookTitle)}</h1>
    <ol>
      ${lis}
    </ol>
  </nav>
</body>
</html>`;
}

function contentOpf(
  title: string,
  author: string,
  bookId: string,
  lang: string,
  manifestItems: string,
  spineItems: string
): string {
  const modified = new Date().toISOString().replace(/\.\d{3}Z$/, "Z");
  return `<?xml version="1.0" encoding="UTF-8"?>
<package xmlns="http://www.idpf.org/2007/opf"
         version="3.0"
         unique-identifier="bookid"
         xml:lang="${lang}">
  <metadata xmlns:dc="http://purl.org/dc/elements/1.1/">
    <dc:identifier id="bookid">urn:uuid:${bookId}</dc:identifier>
    <dc:title>${escapeXml(title)}</dc:title>
    <dc:creator>${escapeXml(author)}</dc:creator>
    <dc:language>${lang}</dc:language>
    <meta property="dcterms:modified">${modified}</meta>
  </metadata>

  <manifest>
    <item id="nav" href="nav.xhtml" media-type="application/xhtml+xml" properties="nav"/>
    <item id="css" href="styles.css" media-type="text/css"/>
    ${manifestItems}
  </manifest>

  <spine>
    ${spineItems}
  </spine>
</package>`;
}

export async function buildEpubBlob(input: BookInput): Promise<Blob> {
  const lang = input.language ?? "en";
  const bookId = crypto.randomUUID();

  const chapters = input.chapters.map((c, idx) => {
    const filename = `chapter-${idx + 1}.xhtml`;
    const html = md.render(c.markdown);
    return {
      title: c.title,
      filename,
      xhtml: xhtmlDoc(c.title, html, lang),
      id: `chap${idx + 1}`,
    };
  });

  const manifestItems = chapters
    .map(
      (c) =>
        `<item id="${c.id}" href="${c.filename}" media-type="application/xhtml+xml"/>`
    )
    .join("\n");

  const spineItems = chapters
    .map((c) => `<itemref idref="${c.id}"/>`)
    .join("\n");

  const nav = navXhtml(
    input.title,
    lang,
    chapters.map((c) => ({ title: c.title, href: c.filename }))
  );
  const opf = contentOpf(input.title, input.author, bookId, lang, manifestItems, spineItems);

  const writer = new BlobWriter("application/epub+zip");
  const zip = new ZipWriter(writer);

  await zip.add("mimetype", new TextReader("application/epub+zip"), {
    level: 0,
  });

  await zip.add("META-INF/container.xml", new TextReader(containerXml()));

  const css =
    input.css ??
    `body { font-family: serif; line-height: 1.5; } h1,h2,h3 { line-height: 1.2; }`;
  await zip.add("OEBPS/styles.css", new TextReader(css));
  await zip.add("OEBPS/nav.xhtml", new TextReader(nav));
  await zip.add("OEBPS/content.opf", new TextReader(opf));

  for (const c of chapters) {
    await zip.add(`OEBPS/${c.filename}`, new TextReader(c.xhtml));
  }

  return await zip.close();
}

/**
 * Build an EPUB with zine-style chapters and embedded images
 */
export async function buildZineEpubBlob(input: ZineBookInput): Promise<Blob> {
  const lang = input.language ?? "en";
  const bookId = crypto.randomUUID();

  // Process zine chapters (they have pre-rendered HTML)
  const chapters = input.zineChapters.map((c, idx) => {
    const filename = `page-${idx + 1}.xhtml`;
    return {
      title: c.title,
      filename,
      xhtml: xhtmlDoc(c.title, c.html, lang),
      id: `page${idx + 1}`,
    };
  });

  // Build manifest items for chapters
  const chapterManifestItems = chapters
    .map(
      (c) =>
        `<item id="${c.id}" href="${c.filename}" media-type="application/xhtml+xml"/>`
    )
    .join("\n    ");

  // Build manifest items for images
  const imageManifestItems = input.images
    .map(
      (img) =>
        `<item id="${img.id}" href="images/${img.filename}" media-type="${img.mediaType}"/>`
    )
    .join("\n    ");

  const manifestItems = `${chapterManifestItems}\n    ${imageManifestItems}`;

  const spineItems = chapters
    .map((c) => `<itemref idref="${c.id}"/>`)
    .join("\n    ");

  const nav = navXhtml(
    input.title,
    lang,
    chapters.map((c) => ({ title: c.title, href: c.filename }))
  );
  const opf = contentOpf(input.title, input.author, bookId, lang, manifestItems, spineItems);

  const writer = new BlobWriter("application/epub+zip");
  const zip = new ZipWriter(writer);

  // Mimetype must be first and uncompressed
  await zip.add("mimetype", new TextReader("application/epub+zip"), {
    level: 0,
  });

  await zip.add("META-INF/container.xml", new TextReader(containerXml()));

  const css =
    input.css ??
    `body { font-family: serif; line-height: 1.5; } h1,h2,h3 { line-height: 1.2; }`;
  await zip.add("OEBPS/styles.css", new TextReader(css));
  await zip.add("OEBPS/nav.xhtml", new TextReader(nav));
  await zip.add("OEBPS/content.opf", new TextReader(opf));

  // Add chapters
  for (const c of chapters) {
    await zip.add(`OEBPS/${c.filename}`, new TextReader(c.xhtml));
  }

  // Add images
  for (const img of input.images) {
    const uint8Array = new Uint8Array(img.data);
    await zip.add(
      `OEBPS/images/${img.filename}`,
      new Uint8ArrayReader(uint8Array)
    );
  }

  return await zip.close();
}
