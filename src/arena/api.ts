/**
 * Are.na API Client
 * Fetches channel content from the public Are.na API
 */

import type { ArenaChannelResponse, ArenaBlock } from "./types";

const ARENA_API_BASE = "https://api.are.na/v2";

export class ArenaApiError extends Error {
  status: number;
  channelSlug: string;
  
  constructor(message: string, status: number, channelSlug: string) {
    super(message);
    this.name = "ArenaApiError";
    this.status = status;
    this.channelSlug = channelSlug;
  }
}

/**
 * Extract channel slug from a URL or return as-is if already a slug
 */
export function parseChannelInput(input: string): string {
  const trimmed = input.trim();
  
  // Handle full URLs like https://www.are.na/username/channel-slug
  const urlMatch = trimmed.match(/are\.na\/[^/]+\/([^/?#]+)/);
  if (urlMatch) {
    return urlMatch[1];
  }
  
  // Handle URLs with just channel like https://www.are.na/channel/slug
  const channelMatch = trimmed.match(/are\.na\/channel\/([^/?#]+)/);
  if (channelMatch) {
    return channelMatch[1];
  }
  
  // Otherwise treat as slug directly
  return trimmed;
}

/**
 * Fetch a channel with all its blocks
 * Handles pagination to get all content
 */
export async function fetchChannel(
  slugOrUrl: string,
  options?: { maxBlocks?: number }
): Promise<ArenaChannelResponse> {
  const slug = parseChannelInput(slugOrUrl);
  const maxBlocks = options?.maxBlocks ?? 200;
  const perPage = 50;
  
  // First request to get channel info and first page
  const firstPageUrl = `${ARENA_API_BASE}/channels/${slug}?per=${perPage}&page=1`;
  const firstResponse = await fetch(firstPageUrl);
  
  if (!firstResponse.ok) {
    if (firstResponse.status === 404) {
      throw new ArenaApiError(
        `Channel "${slug}" not found. Make sure it exists and is public.`,
        404,
        slug
      );
    }
    if (firstResponse.status === 401 || firstResponse.status === 403) {
      throw new ArenaApiError(
        `Channel "${slug}" is private and cannot be accessed.`,
        firstResponse.status,
        slug
      );
    }
    throw new ArenaApiError(
      `Failed to fetch channel: ${firstResponse.statusText}`,
      firstResponse.status,
      slug
    );
  }
  
  const channel: ArenaChannelResponse = await firstResponse.json();
  const allBlocks: ArenaBlock[] = [...(channel.contents || [])];
  
  // Fetch additional pages if needed
  const totalPages = channel.total_pages;
  const pagesToFetch = Math.min(
    totalPages,
    Math.ceil(maxBlocks / perPage)
  );
  
  if (pagesToFetch > 1) {
    const additionalPages = Array.from(
      { length: pagesToFetch - 1 },
      (_, i) => i + 2
    );
    
    const pagePromises = additionalPages.map(async (page) => {
      const url = `${ARENA_API_BASE}/channels/${slug}?per=${perPage}&page=${page}`;
      const response = await fetch(url);
      if (response.ok) {
        const data: ArenaChannelResponse = await response.json();
        return data.contents || [];
      }
      return [];
    });
    
    const additionalBlocks = await Promise.all(pagePromises);
    additionalBlocks.forEach((blocks) => {
      allBlocks.push(...blocks);
    });
  }
  
  // Limit to maxBlocks
  channel.contents = allBlocks.slice(0, maxBlocks);
  
  return channel;
}

/**
 * Filter blocks by type
 */
export function filterImageBlocks(blocks: ArenaBlock[]): ArenaBlock[] {
  return blocks.filter((block) => block.class === "Image" && block.image);
}

export function filterTextBlocks(blocks: ArenaBlock[]): ArenaBlock[] {
  return blocks.filter(
    (block) => block.class === "Text" && (block.content || block.content_html)
  );
}

export function filterLinkBlocks(blocks: ArenaBlock[]): ArenaBlock[] {
  return blocks.filter((block) => block.class === "Link");
}

/**
 * Fetch image data as ArrayBuffer for embedding in EPUB
 * Includes timeout to prevent hanging on slow/large images
 */
export async function fetchImageData(imageUrl: string, timeoutMs: number = 10000): Promise<ArrayBuffer> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  
  try {
    const response = await fetch(imageUrl, { signal: controller.signal });
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.statusText}`);
    }
    const buffer = await response.arrayBuffer();
    return buffer;
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * Get the best image URL for EPUB (display size for faster loading)
 */
export function getBestImageUrl(block: ArenaBlock): string | null {
  if (!block.image) return null;
  
  // Prefer display size for faster downloads, then large, then original
  return (
    block.image.display?.url ||
    block.image.large?.url ||
    block.image.square?.url ||
    null
  );
}

