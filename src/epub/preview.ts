import ePub, { Book, Rendition } from "epubjs";

export interface PreviewResult {
  book: Book;
  rendition: Rendition;
}

export interface PreviewOptions {
  width?: string | number;
  height?: string | number;
}

// epub.js supports opening as "binary" and has a .open method.
export async function renderEpubFromBlob(
  blob: Blob,
  el: HTMLElement,
  opts: PreviewOptions = {}
): Promise<PreviewResult> {
  // Clear previous render
  el.innerHTML = "";

  // IMPORTANT: Use ArrayBuffer, not blob URL, to avoid epub.js trying to fetch files over HTTP
  const buf = await blob.arrayBuffer();

  const book = ePub();
  await book.open(buf, "binary");

  const rendition = book.renderTo(el, {
    width: opts.width ?? "100%",
    height: opts.height ?? "100%",
  });

  await rendition.display();

  return { book, rendition };
}

