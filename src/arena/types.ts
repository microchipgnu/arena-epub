/**
 * Are.na API Types
 * Based on https://dev.are.na/documentation
 */

export interface ArenaUser {
  id: number;
  slug: string;
  username: string;
  first_name: string;
  last_name: string;
  full_name: string;
  avatar: string;
  avatar_image: {
    thumb: string;
    display: string;
  } | null;
}

export interface ArenaSource {
  url: string;
  title: string | null;
  provider: {
    name: string;
    url: string;
  } | null;
}

export interface ArenaImage {
  filename: string;
  content_type: string;
  updated_at: string;
  thumb: {
    url: string;
  };
  square: {
    url: string;
  };
  display: {
    url: string;
  };
  large: {
    url: string;
  };
  original: {
    url: string;
    file_size: number;
    file_size_display: string;
  };
}

export type ArenaBlockClass = "Image" | "Text" | "Link" | "Media" | "Attachment" | "Channel";

export interface ArenaBlock {
  id: number;
  title: string | null;
  updated_at: string;
  created_at: string;
  state: string;
  comment_count: number;
  generated_title: string;
  class: ArenaBlockClass;
  base_class: string;
  content: string | null;
  content_html: string | null;
  description: string | null;
  description_html: string | null;
  source: ArenaSource | null;
  image: ArenaImage | null;
  user: ArenaUser;
  connections?: ArenaChannel[];
}

export interface ArenaChannel {
  id: number;
  title: string;
  created_at: string;
  updated_at: string;
  added_to_at: string;
  published: boolean;
  open: boolean;
  collaboration: boolean;
  collaborator_count: number;
  slug: string;
  length: number;
  kind: string;
  status: string;
  user_id: number;
  class: string;
  base_class: string;
  user: ArenaUser;
  total_pages: number;
  current_page: number;
  per: number;
  follower_count: number;
  contents: ArenaBlock[] | null;
  collaborators: ArenaUser[];
}

export interface ArenaChannelResponse extends ArenaChannel {
  contents: ArenaBlock[];
}

// Types for our transformed content
export type ZineLayoutType = 
  | "full-bleed"      // Image fills entire page
  | "text-spread"     // Large quote/text with dramatic typography
  | "collage"         // 2-4 images at odd angles
  | "mixed"           // Image with text overlay
  | "divider";        // Bold typography page break

export interface ZinePage {
  type: ZineLayoutType;
  images: ZineImage[];
  text: string | null;
  title: string | null;
  rotation: number;      // CSS rotation in degrees
  variant: number;       // Layout variant for CSS classes
}

export interface ZineImage {
  url: string;
  filename: string;
  contentType: string;
  data?: ArrayBuffer;    // Fetched image data for embedding
  rotation: number;
  scale: number;
  position: "left" | "right" | "center" | "top" | "bottom";
}

