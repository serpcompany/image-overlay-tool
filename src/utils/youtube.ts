const YOUTUBE_URL_PATTERNS = [
  /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([^&]+)/,
  /(?:https?:\/\/)?(?:www\.)?youtu\.be\/([^?]+)/,
  /(?:https?:\/\/)?(?:www\.)?youtube\.com\/embed\/([^?]+)/
];

export function extractVideoId(url: string): string | null {
  for (const pattern of YOUTUBE_URL_PATTERNS) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }
  return null;
}

async function checkImageExists(url: string): Promise<boolean> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = url;
  });
}

export async function getBestThumbnail(videoId: string): Promise<string> {
  const maxResUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
  const exists = await checkImageExists(maxResUrl);
  
  if (exists) {
    return maxResUrl;
  }
  
  return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
}