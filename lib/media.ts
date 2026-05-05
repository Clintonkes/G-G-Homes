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
  if (normalizedPath.startsWith("/uploads/")) {
    return normalizedPath;
  }

  const backendOrigin = getBackendOrigin();
  return backendOrigin ? `${backendOrigin}${normalizedPath}` : normalizedPath;
}

export function isVideoUrl(url: string) {
  return /\.(mp4|mov|webm|m4v)(\?.*)?$/i.test(url);
}
