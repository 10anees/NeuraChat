/**
 * Media content structure from backend
 */
export interface MediaContent {
  fileName: string;
  fileType: string;
  fileUrl: string;
  thumbnailUrl?: string;
  fileSize: number;
  mimeType: string;
  storagePath?: string;
  customMessage?: string;
}

/**
 * Parse media message content (which is JSON)
 */
export const parseMediaContent = (content: string): MediaContent | null => {
  try {
    const parsed = JSON.parse(content);
    if (parsed.fileUrl) {
      return parsed as MediaContent;
    }
    return null;
  } catch {
    // If it's not JSON, it might be a direct URL (legacy format)
    return null;
  }
};

/**
 * Get the URL from media content (handles both JSON and legacy URL format)
 */
export const getMediaUrl = (content: string): string => {
  const parsed = parseMediaContent(content);
  return parsed?.fileUrl || content;
};

/**
 * Get filename from media content
 */
export const getMediaFilename = (content: string): string => {
  const parsed = parseMediaContent(content);
  if (parsed?.fileName) {
    return parsed.fileName;
  }
  // Fallback to extracting from URL
  try {
    const url = getMediaUrl(content);
    const urlObj = new URL(url);
    const pathname = urlObj.pathname;
    const lastSegment = pathname.split('/').pop() || '';
    // Remove timestamp prefix if present (format: {timestamp}_{filename})
    const decoded = decodeURIComponent(lastSegment);
    const match = decoded.match(/^\d+_(.+)$/);
    return match ? match[1] : decoded || 'file';
  } catch {
    return 'file';
  }
};

/**
 * Check file type from media content
 */
export const getMediaFileType = (content: string): string => {
  const parsed = parseMediaContent(content);
  if (parsed?.mimeType) {
    if (parsed.mimeType.startsWith('image/')) return 'image';
    if (parsed.mimeType.startsWith('video/')) return 'video';
    if (parsed.mimeType.startsWith('audio/')) return 'audio';
    return parsed.fileType || 'file';
  }
  // Fallback to checking URL extension
  const url = getMediaUrl(content);
  if (url.match(/\.(jpg|jpeg|png|gif|webp)$/i)) return 'image';
  if (url.match(/\.(mp4|webm|ogg)$/i)) return 'video';
  if (url.match(/\.(mp3|wav|m4a)$/i)) return 'audio';
  return 'file';
};
