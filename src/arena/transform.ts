/**
 * Transform Are.na blocks into zine-style book chapters
 */

import type { ArenaChannelResponse } from "./types";
import type { ImageAsset, ZineChapter } from "../epub/buildEpub";
import { getBestImageUrl, filterImageBlocks, filterTextBlocks, fetchImageData } from "./api";

// Layout types for variety
type LayoutType = 
  | "full-bleed"
  | "text-spread"
  | "collage-2"
  | "collage-3"
  | "image-left"
  | "image-right"
  | "centered-text"
  | "divider";

interface TransformResult {
  chapters: ZineChapter[];
  images: ImageAsset[];
}

// Random utilities for zine aesthetic
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

// Get file extension from content type
function getExtension(contentType: string): string {
  const map: Record<string, string> = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/gif": "gif",
    "image/webp": "webp",
  };
  return map[contentType] || "jpg";
}

// Escape HTML content
function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// Generate full-bleed image page
function generateFullBleedPage(
  imageFilename: string,
  title: string | null,
  variant: number
): string {
  const rotation = randomRotation(2);
  const variantClass = `variant-${variant % 4}`;
  
  return `
<div class="zine-page full-bleed ${variantClass}">
  <div class="image-container" style="transform: rotate(${rotation}deg);">
    <img src="images/${imageFilename}" alt="${escapeHtml(title || "")}" class="full-image" />
  </div>
  ${title ? `<div class="image-title">${escapeHtml(title)}</div>` : ""}
</div>`;
}

// Generate text spread page
function generateTextSpreadPage(
  text: string,
  variant: number
): string {
  const rotation = randomRotation(1);
  const variantClass = `variant-${variant % 5}`;
  
  // Clean up HTML or use plain text
  const cleanText = text.replace(/<[^>]*>/g, "").trim();
  
  // Split into lines for dramatic effect if text is long
  const words = cleanText.split(/\s+/);
  let displayText: string;
  
  if (words.length > 50) {
    // Use first sentence or truncate
    const firstSentence = cleanText.match(/^[^.!?]+[.!?]/);
    displayText = firstSentence ? firstSentence[0] : words.slice(0, 30).join(" ") + "...";
  } else {
    displayText = cleanText;
  }
  
  return `
<div class="zine-page text-spread ${variantClass}">
  <div class="text-container" style="transform: rotate(${rotation}deg);">
    <p class="spread-text">${escapeHtml(displayText)}</p>
  </div>
</div>`;
}

// Generate collage page with multiple images
function generateCollagePage(
  imageFilenames: string[],
  variant: number
): string {
  const variantClass = `variant-${variant % 4}`;
  const imageCount = imageFilenames.length;
  
  const images = imageFilenames.map((filename, i) => {
    const rotation = randomRotation(8);
    const offsetX = randomOffset(15);
    const offsetY = randomOffset(15);
    const zIndex = Math.floor(Math.random() * 10);
    
    return `
    <div class="collage-item item-${i}" 
         style="transform: rotate(${rotation}deg) translate(${offsetX}px, ${offsetY}px); z-index: ${zIndex};">
      <img src="images/${filename}" alt="" class="collage-image" />
    </div>`;
  }).join("\n");
  
  return `
<div class="zine-page collage collage-${imageCount} ${variantClass}">
  <div class="collage-container">
    ${images}
  </div>
</div>`;
}

// Generate mixed page with image and text
function generateMixedPage(
  imageFilename: string,
  text: string,
  isImageLeft: boolean,
  variant: number
): string {
  const variantClass = `variant-${variant % 4}`;
  const layoutClass = isImageLeft ? "image-left" : "image-right";
  const imageRotation = randomRotation(4);
  const textRotation = randomRotation(2);
  
  const cleanText = text.replace(/<[^>]*>/g, "").trim();
  const words = cleanText.split(/\s+/);
  const displayText = words.length > 40 
    ? words.slice(0, 35).join(" ") + "..."
    : cleanText;
  
  return `
<div class="zine-page mixed ${layoutClass} ${variantClass}">
  <div class="mixed-image" style="transform: rotate(${imageRotation}deg);">
    <img src="images/${imageFilename}" alt="" />
  </div>
  <div class="mixed-text" style="transform: rotate(${textRotation}deg);">
    <p>${escapeHtml(displayText)}</p>
  </div>
</div>`;
}

// Generate divider/title page
function generateDividerPage(
  title: string,
  variant: number
): string {
  const variantClass = `variant-${variant % 4}`;
  const rotation = randomRotation(3);
  
  return `
<div class="zine-page divider ${variantClass}">
  <div class="divider-content" style="transform: rotate(${rotation}deg);">
    <h1 class="divider-title">${escapeHtml(title)}</h1>
    <div class="divider-line"></div>
  </div>
</div>`;
}

// Generate cover page
function generateCoverPage(
  title: string,
  author: string,
  imageFilename?: string
): string {
  const titleRotation = randomRotation(2);
  
  return `
<div class="zine-page cover">
  ${imageFilename ? `
  <div class="cover-image">
    <img src="images/${imageFilename}" alt="" />
  </div>` : ""}
  <div class="cover-content" style="transform: rotate(${titleRotation}deg);">
    <h1 class="cover-title">${escapeHtml(title)}</h1>
    <p class="cover-author">${escapeHtml(author)}</p>
  </div>
</div>`;
}

/**
 * Main transform function
 * Converts Are.na channel content into zine-style chapters
 */
export async function transformChannelToZine(
  channel: ArenaChannelResponse,
  options?: {
    onProgress?: (progress: number, message: string) => void;
  }
): Promise<TransformResult> {
  // Limit images to prevent slow loading
  const allImageBlocks = filterImageBlocks(channel.contents || []);
  const imageBlocks = allImageBlocks.slice(0, 15); // Max 15 images for performance
  const textBlocks = filterTextBlocks(channel.contents || []);
  
  const onProgress = options?.onProgress ?? (() => {});
  
  onProgress(0, "Processing blocks...");
  
  // Fetch all images
  const images: ImageAsset[] = [];
  const imageBlockToFilename = new Map<number, string>();
  
  let fetchedCount = 0;
  const totalImages = imageBlocks.length;
  
  for (const block of imageBlocks) {
    const url = getBestImageUrl(block);
    if (!url) {
      console.log(`Skipping block ${block.id} - no URL`);
      continue;
    }
    
    try {
      onProgress(
        (fetchedCount / totalImages) * 50,
        `Fetching image ${fetchedCount + 1}/${totalImages}...`
      );
      
      console.log(`Fetching image ${fetchedCount + 1}/${totalImages}: ${url.substring(0, 50)}...`);
      const data = await fetchImageData(url);
      console.log(`Fetched image ${fetchedCount + 1}, size: ${data.byteLength} bytes`);
      
      const contentType = block.image?.content_type || "image/jpeg";
      const ext = getExtension(contentType);
      const filename = `img-${block.id}.${ext}`;
      const id = `img${block.id}`;
      
      images.push({
        id,
        filename,
        data,
        mediaType: contentType,
      });
      
      imageBlockToFilename.set(block.id, filename);
      fetchedCount++;
    } catch (err) {
      console.warn(`Failed to fetch image for block ${block.id}:`, err);
      fetchedCount++; // Still advance to prevent getting stuck
    }
  }
  
  console.log(`Finished fetching ${images.length} images, creating pages...`);
  onProgress(50, "Creating pages...");
  
  // Build chapters with varied layouts
  const chapters: ZineChapter[] = [];
  let pageIndex = 0;
  
  // Cover page
  const coverImage = imageBlocks.length > 0 
    ? imageBlockToFilename.get(imageBlocks[0].id) 
    : undefined;
  
  console.log("Creating cover page...");
  chapters.push({
    title: channel.title,
    html: generateCoverPage(channel.title, channel.user.full_name || "Are.na", coverImage),
    images: coverImage ? [coverImage] : [],
  });
  pageIndex++;
  
  // Mix and match blocks for zine feel
  const shuffledImages = shuffleArray(
    imageBlocks.filter((_, i) => i > 0) // Skip first (used for cover)
  );
  const shuffledTexts = shuffleArray(textBlocks);
  
  console.log(`Creating pages from ${shuffledImages.length} images and ${shuffledTexts.length} text blocks...`);
  
  let imageIdx = 0;
  let textIdx = 0;
  let layoutVariant = 0;
  let loopCount = 0;
  
  // Layout sequence for rhythm
  const layoutSequence: LayoutType[] = [
    "full-bleed",
    "text-spread",
    "collage-2",
    "image-left",
    "full-bleed",
    "centered-text",
    "collage-3",
    "image-right",
    "divider",
    "full-bleed",
    "text-spread",
    "collage-2",
  ];
  
  while (imageIdx < shuffledImages.length || textIdx < shuffledTexts.length) {
    loopCount++;
    if (loopCount > 50) {
      console.log("Safety break: too many loop iterations");
      break;
    }
    
    const layout = layoutSequence[pageIndex % layoutSequence.length];
    let html = "";
    const usedImages: string[] = [];
    
    console.log(`Loop ${loopCount}: layout=${layout}, imageIdx=${imageIdx}/${shuffledImages.length}, textIdx=${textIdx}/${shuffledTexts.length}`);
    
    switch (layout) {
      case "full-bleed":
        if (imageIdx < shuffledImages.length) {
          const block = shuffledImages[imageIdx];
          const filename = imageBlockToFilename.get(block.id);
          imageIdx++; // Always advance to prevent infinite loop
          if (filename) {
            html = generateFullBleedPage(filename, block.title || block.generated_title, layoutVariant);
            usedImages.push(filename);
          }
        }
        break;
        
      case "text-spread":
      case "centered-text":
        if (textIdx < shuffledTexts.length) {
          const block = shuffledTexts[textIdx];
          const text = block.content || block.content_html || "";
          textIdx++; // Always advance to prevent infinite loop
          if (text.trim()) {
            html = generateTextSpreadPage(text, layoutVariant);
          }
        }
        break;
        
      case "collage-2":
      case "collage-3":
        const collageCount = layout === "collage-2" ? 2 : 3;
        const collageImages: string[] = [];
        
        for (let i = 0; i < collageCount && imageIdx < shuffledImages.length; i++) {
          const block = shuffledImages[imageIdx];
          const filename = imageBlockToFilename.get(block.id);
          imageIdx++; // Always advance to prevent infinite loop
          if (filename) {
            collageImages.push(filename);
          }
        }
        
        if (collageImages.length > 0) {
          html = generateCollagePage(collageImages, layoutVariant);
          usedImages.push(...collageImages);
        }
        break;
        
      case "image-left":
      case "image-right":
        if (imageIdx < shuffledImages.length && textIdx < shuffledTexts.length) {
          const imgBlock = shuffledImages[imageIdx];
          const txtBlock = shuffledTexts[textIdx];
          const filename = imageBlockToFilename.get(imgBlock.id);
          const text = txtBlock.content || txtBlock.content_html || "";
          imageIdx++; // Always advance to prevent infinite loop
          textIdx++;
          
          if (filename && text.trim()) {
            html = generateMixedPage(filename, text, layout === "image-left", layoutVariant);
            usedImages.push(filename);
          }
        }
        break;
        
      case "divider":
        // Create a divider every few pages
        if (pageIndex > 0 && pageIndex % 6 === 0) {
          const dividerTitles = [
            "· · ·",
            "※",
            "—",
            "◆",
            channel.title.charAt(0).toUpperCase(),
          ];
          html = generateDividerPage(pickRandom(dividerTitles), layoutVariant);
        }
        break;
    }
    
    // Only add if we generated content
    if (html) {
      chapters.push({
        title: `Page ${pageIndex + 1}`,
        html,
        images: usedImages,
      });
      pageIndex++;
      layoutVariant++;
    }
    
    // Safety valve to prevent infinite loops
    if (pageIndex > 100) break;
    
    // If we couldn't generate content for this layout, try next
    if (!html && imageIdx >= shuffledImages.length && textIdx >= shuffledTexts.length) {
      break;
    }
  }
  
  console.log(`Finished creating ${chapters.length} pages`);
  onProgress(100, "Complete!");
  
  console.log("Returning result...");
  return { chapters, images };
}

/**
 * Create demo/test content without Are.na
 */
export function createDemoZineContent(): TransformResult {
  const chapters: ZineChapter[] = [
    {
      title: "Demo Zine",
      html: `
<div class="zine-page cover">
  <div class="cover-content">
    <h1 class="cover-title">DEMO ZINE</h1>
    <p class="cover-author">Connect to Are.na to create your own</p>
  </div>
</div>`,
      images: [],
    },
    {
      title: "Page 1",
      html: `
<div class="zine-page text-spread variant-0">
  <div class="text-container">
    <p class="spread-text">Enter an Are.na channel URL above to pull in your collected images and text.</p>
  </div>
</div>`,
      images: [],
    },
    {
      title: "Page 2",
      html: `
<div class="zine-page text-spread variant-2">
  <div class="text-container" style="transform: rotate(-1deg);">
    <p class="spread-text">Your zine will be automatically generated with collages, full-bleed images, and text spreads.</p>
  </div>
</div>`,
      images: [],
    },
  ];
  
  return { chapters, images: [] };
}

