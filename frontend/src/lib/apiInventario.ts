const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:8081";

export type InventarioRequest = {
  idProducto: number;
  idUbicacion: number;
  idProveedor: number;
  cantidad: number;
  stock: number;
  estado: string;
  fechaIngreso: string; // yyyy-mm-dd
  createdWithProduct?: boolean; // nueva bandera opcional
};

export async function getInventarios(): Promise<any[]> {
  const res = await fetch(`${API_BASE}/api/inventario`);
  const text = await res.text();
  if (!res.ok) {
    console.error("GET /api/inventario failed", res.status, text);
    throw new Error(`Error ${res.status}`);
  }
  try {
    return JSON.parse(text);
  } catch (e) {
    console.error("GET /api/inventario returned invalid JSON:", text);
    throw new Error("Invalid JSON from /api/inventario");
  }
}

export async function getInventario(id: number): Promise<any> {
  const res = await fetch(`${API_BASE}/api/inventario/${id}`);
  const text = await res.text();
  if (!res.ok) {
    console.error(`GET /api/inventario/${id} failed`, res.status, text);
    throw new Error(`Error ${res.status}`);
  }
  try {
    return JSON.parse(text);
  } catch (e) {
    console.error(`GET /api/inventario/${id} returned invalid JSON:`, text);
    throw new Error("Invalid JSON from /api/inventario/{id}");
  }
}

export async function createInventario(payload: InventarioRequest): Promise<any> {
  const res = await fetch(`${API_BASE}/api/inventario`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const text = await res.text();
  if (res.status !== 201 && !res.ok) {
    console.error("POST /api/inventario failed", res.status, text);
    const body = (() => { try { return JSON.parse(text); } catch { return text; } })();
    throw new Error(body?.message || `Error ${res.status}`);
  }
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

export async function updateInventario(id: number, payload: InventarioRequest): Promise<any> {
  const res = await fetch(`${API_BASE}/api/inventario/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const text = await res.text();
  if (!res.ok) {
    console.error(`PUT /api/inventario/${id} failed`, res.status, text);
    const body = (() => { try { return JSON.parse(text); } catch { return text; } })();
    throw new Error(body?.message || `Error ${res.status}`);
  }
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

export async function deleteInventario(id: number): Promise<void> {
  const res = await fetch(`${API_BASE}/api/inventario/${id}`, { method: "DELETE" });
  if (!res.ok && res.status !== 204) {
    const text = await res.text().catch(() => "");
    console.error(`DELETE /api/inventario/${id} failed`, res.status, text);
    throw new Error(text || `Error ${res.status}`);
  }
  return;
}

/* helpers para selects: mejora el manejo de errores y loguea la respuesta cruda si hay fallo */
export async function getProductos(): Promise<any[]> {
  const res = await fetch(`${API_BASE}/api/productos`);
  const text = await res.text();
  if (!res.ok) {
    console.error("GET /api/productos failed", res.status, text);
    throw new Error(`Error ${res.status}`);
  }
  try {
    return JSON.parse(text);
  } catch (e) {
    console.error("GET /api/productos returned invalid JSON:", text);
    throw new Error("Invalid JSON from /api/productos");
  }
}
export async function getUbicaciones(): Promise<any[]> {
  const res = await fetch(`${API_BASE}/api/ubicacion`);
  const text = await res.text();
  if (!res.ok) {
    console.error("GET /api/ubicacion failed", res.status, text);
    throw new Error(`Error ${res.status}`);
  }
  try {
    return JSON.parse(text);
  } catch (e) {
    console.error("GET /api/ubicacion returned invalid JSON:", text);
    throw new Error("Invalid JSON from /api/ubicacion");
  }
}
export async function getProveedores(): Promise<any[]> {
  const res = await fetch(`${API_BASE}/api/proveedor`);
  const text = await res.text();
  if (!res.ok) {
    console.error("GET /api/proveedor failed", res.status, text);
    throw new Error(`Error ${res.status}`);
  }
  try {
    return JSON.parse(text);
  } catch (e) {
    console.error("GET /api/proveedor returned invalid JSON:", text);
    throw new Error("Invalid JSON from /api/proveedor");
  }
}

export default {
  getInventarios,
  getInventario,
  createInventario,
  updateInventario,
  deleteInventario,
  getProductos,
  getUbicaciones,
  getProveedores,
};