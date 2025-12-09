const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:8081";

/**
 * Sube un archivo al backend (/api/uploads).
 * Devuelve la URL pública absoluta (p.e. http://localhost:8081/uploads/xxx.png)
 */
export async function uploadFile(file: File): Promise<string> {
  const fd = new FormData();
  fd.append("file", file);
  const res = await fetch(`${API_BASE}/api/uploads`, {
    method: "POST",
    body: fd
  });
  const body = await res.json().catch(() => null);
  if (!res.ok) {
    const msg = body?.message || body || `Error ${res.status}`;
    throw new Error(msg);
  }
  let url = body?.url ?? body?.data?.url ?? "";

  // Si backend devolviera ruta relativa, prefijamos API_BASE
  if (url && url.startsWith("/")) {
    url = API_BASE.replace(/\/$/, "") + url;
  }
  return url;
}

export default { uploadFile };