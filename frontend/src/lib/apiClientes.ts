const BASE = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api/clientes` : "http://localhost:8081/api/clientes";

/**
 * Helper simple para parsear respuestas JSON y lanzar errores si no ok.
 */
async function handleResponse(res: Response) {
  const text = await res.text();
  const contentType = res.headers.get("content-type") || "";
  if (!res.ok) {
    let body = text;
    try {
      if (contentType.includes("application/json") && text) body = JSON.parse(text);
    } catch {}
    const err: any = new Error(`HTTP ${res.status} ${res.statusText}`);
    err.status = res.status;
    err.body = body;
    throw err;
  }
  if (contentType.includes("application/json") && text) {
    return JSON.parse(text);
  }
  return text;
}

export async function getClienteByUserId(userId: number) {
  const res = await fetch(`${BASE}/user/${userId}`, {
    headers: { "Accept": "application/json" },
  });
  return handleResponse(res);
}

export async function upsertClienteByUserId(userId: number, payload: { direccion?: string; telefono?: string }) {
  const res = await fetch(`${BASE}/user/${userId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", "Accept": "application/json" },
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
}

export default { getClienteByUserId, upsertClienteByUserId };