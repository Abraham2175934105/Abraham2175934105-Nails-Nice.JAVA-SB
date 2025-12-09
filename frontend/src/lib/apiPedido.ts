const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:8081";

async function parseBody(res: Response) {
  const text = await res.text();
  if (!text) return null;
  try { return JSON.parse(text); } catch { return text; }
}

export async function getPedidos(): Promise<any[]> {
  const res = await fetch(`${API_BASE}/api/pedido`);
  if (!res.ok) throw new Error(`Error ${res.status}`);
  return await res.json();
}

export async function getPedido(id: number): Promise<any> {
  const res = await fetch(`${API_BASE}/api/pedido/${id}`);
  if (!res.ok) throw new Error(`Error ${res.status}`);
  return await res.json();
}

export async function createPedido(payload: any): Promise<any> {
  const res = await fetch(`${API_BASE}/api/pedido`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  const body = await parseBody(res);
  if (!res.ok) throw new Error(body?.message || `Error ${res.status}`);
  return body;
}

export async function updatePedido(id: number, payload: any): Promise<any> {
  const res = await fetch(`${API_BASE}/api/pedido/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  const body = await parseBody(res);
  if (!res.ok) throw new Error(body?.message || `Error ${res.status}`);
  return body;
}

export async function deletePedido(id: number): Promise<void> {
  const res = await fetch(`${API_BASE}/api/pedido/${id}`, { method: "DELETE" });
  if (!res.ok) {
    const body = await parseBody(res);
    throw new Error(body?.message || `Error ${res.status}`);
  }
}

export default { getPedidos, getPedido, createPedido, updatePedido, deletePedido };