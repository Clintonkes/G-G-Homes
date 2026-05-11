function getBackendOrigin() {
  const raw = process.env.NEXT_PUBLIC_API_URL?.trim() || process.env.BACKEND_API_URL?.trim() || "";
  if (!raw) return "";
  const normalized = raw.endsWith("/") ? raw.slice(0, -1) : raw;
  return normalized.endsWith("/api") ? normalized.slice(0, -4) : normalized;
}

export function resolveMediaUrl(url?: string | null) {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("data:") || url.startsWith("blob:")) {
    return url;
  }

  const normalizedPath = url.startsWith("/") ? url : `/${url}`;
  const backendOrigin = getBackendOrigin();

  if (normalizedPath.startsWith("/uploads/")) {
    // Without a known backend origin, /uploads/ paths are permanently broken —
    // they lived on Railway's ephemeral disk and were wiped on redeploy.
    // Return "" so SafeImage skips the network request and shows its placeholder.
    return backendOrigin ? `${backendOrigin}${normalizedPath}` : "";
  }

  return backendOrigin ? `${backendOrigin}${normalizedPath}` : normalizedPath;
}

export function isVideoUrl(url: string) {
  return /\.(mp4|mov|webm|m4v)(\?.*)?$/i.test(url);
}
