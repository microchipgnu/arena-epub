/**
 * Web Worker for heavy zine generation tasks
 * Handles: fetching channel, downloading images, creating page layouts
 * Returns data to main thread for EPUB building (zip.js works better there)
 */

// Message types
export type WorkerMessage = 
  | { type: "generate"; channelSlug: string }
  | { type: "cancel" };

export interface WorkerImageData {
  id: string;
  filename: string;
  data: ArrayBuffer;
  mediaType: string;
}

export interface WorkerChapter {
  title: string;
  html: string;
  images: string[];
}

export type WorkerResponse =
  | { type: "progress"; percent: number; message: string }
  | { type: "complete"; chapters: WorkerChapter[]; images: WorkerImageData[]; title: string; author: string }
  | { type: "error"; message: string };

// Types we need
interface ArenaImage {
  content_type: string;
  display?: { url: string };
  large?: { url: string };
  square?: { url: string };
}

interface ArenaBlock {
  id: number;
  title: string | null;
  generated_title: string;
  class: string;
  content: string | null;
  content_html: string | null;
  image: ArenaImage | null;
}

interface ArenaChannel {
  title: string;
  contents: ArenaBlock[] | null;
  user: { full_name: string };
}

// Utility functions
function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function randomRotation(maxDeg: number = 5): number {
  return Math.random() * maxDeg * 2 - maxDeg;
}

function randomOffset(maxPx: number = 20): number {
  return Math.random() * maxPx * 2 - maxPx;
}

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function shuffleArray<T>(arr: T[]): T[] {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function getExtension(contentType: string): string {
  const map: Record<string, string> = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/gif": "gif",
    "image/webp": "webp",
  };
  return map[contentType] || "jpg";
}

function getBestImageUrl(block: ArenaBlock): string | null {
  if (!block.image) return null;
  // Use square (300px) or display for smaller file sizes
  // Prefer smaller images to keep EPUB size reasonable
  return block.image.square?.url || block.image.display?.url || block.image.large?.url || null;
}

// Page generators
function generateCoverPage(title: string, author: string, imageFilename?: string): string {
  const titleRotation = randomRotation(2);
  return `
<div class="zine-page cover">
  ${imageFilename ? `<div class="cover-image"><img src="images/${imageFilename}" alt="" /></div>` : ""}
  <div class="cover-content" style="transform: rotate(${titleRotation}deg);">
    <h1 class="cover-title">${escapeHtml(title)}</h1>
    <p class="cover-author">${escapeHtml(author)}</p>
  </div>
</div>`;
}

function generateFullBleedPage(imageFilename: string, title: string | null, variant: number): string {
  const rotation = randomRotation(2);
  return `
<div class="zine-page full-bleed variant-${variant % 4}">
  <div class="image-container" style="transform: rotate(${rotation}deg);">
    <img src="images/${imageFilename}" alt="${escapeHtml(title || "")}" class="full-image" />
  </div>
  ${title ? `<div class="image-title">${escapeHtml(title)}</div>` : ""}
</div>`;
}

function generateTextSpreadPage(text: string, variant: number): string {
  const rotation = randomRotation(1);
  const cleanText = text.replace(/<[^>]*>/g, "").trim();
  const words = cleanText.split(/\s+/);
  const displayText = words.length > 50 
    ? (cleanText.match(/^[^.!?]+[.!?]/)?.[0] || words.slice(0, 30).join(" ") + "...")
    : cleanText;
  return `
<div class="zine-page text-spread variant-${variant % 5}">
  <div class="text-container" style="transform: rotate(${rotation}deg);">
    <p class="spread-text">${escapeHtml(displayText)}</p>
  </div>
</div>`;
}

function generateCollagePage(imageFilenames: string[], variant: number): string {
  const images = imageFilenames.map((filename, i) => {
    const rotation = randomRotation(8);
    const offsetX = randomOffset(15);
    const offsetY = randomOffset(15);
    return `<div class="collage-item item-${i}" style="transform: rotate(${rotation}deg) translate(${offsetX}px, ${offsetY}px); z-index: ${Math.floor(Math.random() * 10)};"><img src="images/${filename}" alt="" class="collage-image" /></div>`;
  }).join("\n");
  return `
<div class="zine-page collage collage-${imageFilenames.length} variant-${variant % 4}">
  <div class="collage-container">${images}</div>
</div>`;
}

function generateMixedPage(imageFilename: string, text: string, isImageLeft: boolean, variant: number): string {
  const cleanText = text.replace(/<[^>]*>/g, "").trim();
  const words = cleanText.split(/\s+/);
  const displayText = words.length > 40 ? words.slice(0, 35).join(" ") + "..." : cleanText;
  return `
<div class="zine-page mixed ${isImageLeft ? "image-left" : "image-right"} variant-${variant % 4}">
  <div class="mixed-image" style="transform: rotate(${randomRotation(4)}deg);"><img src="images/${imageFilename}" alt="" /></div>
  <div class="mixed-text" style="transform: rotate(${randomRotation(2)}deg);"><p>${escapeHtml(displayText)}</p></div>
</div>`;
}

function generateDividerPage(title: string, variant: number): string {
  return `
<div class="zine-page divider variant-${variant % 4}">
  <div class="divider-content" style="transform: rotate(${randomRotation(3)}deg);">
    <h1 class="divider-title">${escapeHtml(title)}</h1>
    <div class="divider-line"></div>
  </div>
</div>`;
}

// Fetch with timeout
async function fetchWithTimeout(url: string, timeoutMs: number = 10000): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, { signal: controller.signal });
    return response;
  } finally {
    clearTimeout(timeoutId);
  }
}

// Main generation function
async function generateZine(channelSlug: string): Promise<{ chapters: WorkerChapter[]; images: WorkerImageData[]; title: string; author: string }> {
  const postProgress = (percent: number, message: string) => {
    self.postMessage({ type: "progress", percent, message } as WorkerResponse);
  };

  // Fetch channel
  postProgress(5, "Fetching channel...");
  const channelRes = await fetchWithTimeout(`https://api.are.na/v2/channels/${channelSlug}?per=50`);
  if (!channelRes.ok) throw new Error(`Channel not found or private`);
  const channel: ArenaChannel = await channelRes.json();
  
  // Filter blocks
  const allBlocks = channel.contents || [];
  const imageBlocks = allBlocks.filter(b => b.class === "Image" && b.image).slice(0, 15);
  const textBlocks = allBlocks.filter(b => b.class === "Text" && (b.content || b.content_html));
  
  postProgress(10, `Found ${imageBlocks.length} images, ${textBlocks.length} texts`);
  
  // Fetch images
  const images: WorkerImageData[] = [];
  const imageBlockToFilename = new Map<number, string>();
  
  for (let i = 0; i < imageBlocks.length; i++) {
    const block = imageBlocks[i];
    const url = getBestImageUrl(block);
    if (!url) continue;
    
    postProgress(10 + (i / imageBlocks.length) * 45, `Fetching image ${i + 1}/${imageBlocks.length}...`);
    
    try {
      const res = await fetchWithTimeout(url);
      if (!res.ok) continue;
      const data = await res.arrayBuffer();
      const contentType = block.image?.content_type || "image/jpeg";
      const filename = `img-${block.id}.${getExtension(contentType)}`;
      
      images.push({ id: `img${block.id}`, filename, data, mediaType: contentType });
      imageBlockToFilename.set(block.id, filename);
    } catch {
      console.warn(`Failed to fetch image ${block.id}`);
    }
  }
  
  // Create pages
  console.log("[Worker] Creating pages...");
  postProgress(60, "Creating pages...");
  
  const chapters: WorkerChapter[] = [];
  
  // Cover
  const coverImage = imageBlocks.length > 0 ? imageBlockToFilename.get(imageBlocks[0].id) : undefined;
  console.log("[Worker] Cover image:", coverImage);
  chapters.push({
    title: channel.title,
    html: generateCoverPage(channel.title, channel.user.full_name || "Are.na", coverImage),
    images: coverImage ? [coverImage] : [],
  });
  
  // Shuffle content
  const shuffledImages = shuffleArray(imageBlocks.filter((_, i) => i > 0));
  const shuffledTexts = shuffleArray(textBlocks);
  
  let imageIdx = 0, textIdx = 0, layoutVariant = 0, pageIndex = 1;
  
  const layouts = ["full-bleed", "text-spread", "collage-2", "image-left", "full-bleed", "centered-text", "collage-3", "image-right", "divider", "full-bleed", "text-spread", "collage-2"];
  
  console.log("[Worker] Starting page loop:", shuffledImages.length, "images,", shuffledTexts.length, "texts");
  let loopCount = 0;
  
  while ((imageIdx < shuffledImages.length || textIdx < shuffledTexts.length) && pageIndex < 40) {
    loopCount++;
    if (loopCount > 100) {
      console.log("[Worker] Safety break after 100 loops");
      break;
    }
    
    const layout = layouts[pageIndex % layouts.length];
    let html = "";
    const usedImages: string[] = [];
    
    console.log(`[Worker] Loop ${loopCount}: layout=${layout}, imgIdx=${imageIdx}, txtIdx=${textIdx}`);
    
    switch (layout) {
      case "full-bleed":
        if (imageIdx < shuffledImages.length) {
          const block = shuffledImages[imageIdx++];
          const filename = imageBlockToFilename.get(block.id);
          if (filename) { 
            html = generateFullBleedPage(filename, block.title || block.generated_title, layoutVariant); 
            usedImages.push(filename); 
          }
        } else if (textIdx < shuffledTexts.length) {
          // Fallback to text if no more images
          const block = shuffledTexts[textIdx++];
          const text = block.content || block.content_html || "";
          if (text.trim()) html = generateTextSpreadPage(text, layoutVariant);
        }
        break;
      case "text-spread":
      case "centered-text":
        if (textIdx < shuffledTexts.length) {
          const block = shuffledTexts[textIdx++];
          const text = block.content || block.content_html || "";
          if (text.trim()) html = generateTextSpreadPage(text, layoutVariant);
        } else if (imageIdx < shuffledImages.length) {
          // Fallback to full-bleed if no more texts
          const block = shuffledImages[imageIdx++];
          const filename = imageBlockToFilename.get(block.id);
          if (filename) { 
            html = generateFullBleedPage(filename, block.title || block.generated_title, layoutVariant); 
            usedImages.push(filename); 
          }
        }
        break;
      case "collage-2":
      case "collage-3": {
        if (imageIdx < shuffledImages.length) {
          const count = layout === "collage-2" ? 2 : 3;
          const collageImages: string[] = [];
          for (let i = 0; i < count && imageIdx < shuffledImages.length; i++) {
            const block = shuffledImages[imageIdx++];
            const filename = imageBlockToFilename.get(block.id);
            if (filename) collageImages.push(filename);
          }
          if (collageImages.length > 0) { 
            html = generateCollagePage(collageImages, layoutVariant); 
            usedImages.push(...collageImages); 
          }
        } else if (textIdx < shuffledTexts.length) {
          // Fallback to text if no more images
          const block = shuffledTexts[textIdx++];
          const text = block.content || block.content_html || "";
          if (text.trim()) html = generateTextSpreadPage(text, layoutVariant);
        }
        break;
      }
      case "image-left":
      case "image-right":
        if (imageIdx < shuffledImages.length && textIdx < shuffledTexts.length) {
          const imgBlock = shuffledImages[imageIdx++];
          const txtBlock = shuffledTexts[textIdx++];
          const filename = imageBlockToFilename.get(imgBlock.id);
          const text = txtBlock.content || txtBlock.content_html || "";
          if (filename && text.trim()) { 
            html = generateMixedPage(filename, text, layout === "image-left", layoutVariant); 
            usedImages.push(filename); 
          }
        } else if (imageIdx < shuffledImages.length) {
          // Fallback to full-bleed if no more texts
          const block = shuffledImages[imageIdx++];
          const filename = imageBlockToFilename.get(block.id);
          if (filename) { 
            html = generateFullBleedPage(filename, block.title || block.generated_title, layoutVariant); 
            usedImages.push(filename); 
          }
        }
        break;
      case "divider":
        // Only add divider every 6 pages, otherwise consume remaining images
        if (pageIndex > 0 && pageIndex % 6 === 0) {
          html = generateDividerPage(pickRandom(["· · ·", "※", "—", "◆", channel.title.charAt(0).toUpperCase()]), layoutVariant);
        } else if (imageIdx < shuffledImages.length) {
          // Fallback to full-bleed if we have remaining images
          const block = shuffledImages[imageIdx++];
          const filename = imageBlockToFilename.get(block.id);
          if (filename) { 
            html = generateFullBleedPage(filename, block.title || block.generated_title, layoutVariant); 
            usedImages.push(filename); 
          }
        } else if (textIdx < shuffledTexts.length) {
          // Fallback to text spread if we have remaining texts
          const block = shuffledTexts[textIdx++];
          const text = block.content || block.content_html || "";
          if (text.trim()) html = generateTextSpreadPage(text, layoutVariant);
        }
        break;
    }
    
    if (html) {
      chapters.push({ title: `Page ${pageIndex + 1}`, html, images: usedImages });
      pageIndex++;
      layoutVariant++;
    }
  }
  
  console.log("[Worker] Created", chapters.length, "chapters");
  postProgress(90, "Preparing data...");
  
  console.log("[Worker] Returning result...");
  return { chapters, images, title: channel.title, author: channel.user.full_name || "Are.na" };
}

// Declare worker scope
declare const self: Worker;

// Worker message handler
self.onmessage = async (e: MessageEvent<WorkerMessage>) => {
  const msg = e.data;
  
  if (msg.type === "generate") {
    try {
      console.log("[Worker] Starting generation for:", msg.channelSlug);
      const result = await generateZine(msg.channelSlug);
      console.log("[Worker] Generation complete:", result.chapters.length, "chapters,", result.images.length, "images");
      
      // Don't use transferables - they can cause issues
      const response: WorkerResponse = { 
        type: "complete", 
        chapters: result.chapters,
        images: result.images,
        title: result.title,
        author: result.author
      };
      
      console.log("[Worker] Posting response...");
      self.postMessage(response);
      console.log("[Worker] Response posted");
    } catch (err) {
      console.error("[Worker] Error:", err);
      const message = err instanceof Error ? err.message : "Unknown error";
      self.postMessage({ type: "error", message });
    }
  }
};
