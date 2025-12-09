const BASE = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api` : "http://localhost:8081/api";

/**
 * Manejo centralizado de respuestas
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

export default {
  // obtener carrito del servidor; token es opcional (si no lo pasas, backend puede devolver 401/403 o el carrito público)
  async fetchCartServer(token?: string) {
    const headers: any = { Accept: "application/json" };
    if (token) headers.Authorization = `Bearer ${token}`;
    const res = await fetch(`${BASE}/carrito`, { headers });
    return await handleResponse(res);
  },

  async addToCartServer(payload: any, token?: string) {
    const headers: any = { "Content-Type": "application/json", Accept: "application/json" };
    if (token) headers.Authorization = `Bearer ${token}`;
    const res = await fetch(`${BASE}/carrito`, { method: "POST", headers, body: JSON.stringify(payload) });
    return await handleResponse(res);
  },

  async updateCartItemServer(id: number, payload: any, token?: string) {
    const headers: any = { "Content-Type": "application/json", Accept: "application/json" };
    if (token) headers.Authorization = `Bearer ${token}`;
    const res = await fetch(`${BASE}/carrito/${id}`, { method: "PUT", headers, body: JSON.stringify(payload) });
    return await handleResponse(res);
  },

  async deleteCartItemServer(id: number, token?: string) {
    const headers: any = {};
    if (token) headers.Authorization = `Bearer ${token}`;
    const res = await fetch(`${BASE}/carrito/${id}`, { method: "DELETE", headers });
    return await handleResponse(res);
  }
};