const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:8081";

export function resolveImageUrl(img?: string | null) {
  if (!img) return "";
  if (img.startsWith("http://") || img.startsWith("https://")) return img;
  if (img.startsWith("/")) {
    return API_BASE.replace(/\/$/, "") + img;
  }
  // fallback: assume relative
  return API_BASE.replace(/\/$/, "") + "/" + img;
}