const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:8081";

export type DetalleVentaReq = {
  idProducto: number;
  cantidad: number;
  precioUnitario: number;
};

export type VentaRequest = {
  idCliente: number;
  idMetodo: number;
  numeroRecibo?: string;
  estadoVenta: string;
  fechaVenta: string; // yyyy-mm-dd
  montoVenta: number;
  detalles: DetalleVentaReq[];
  idPedido?: number | null;
};

async function parseBody(res: Response) {
  const text = await res.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

export async function getVentas(): Promise<any[]> {
  const res = await fetch(`${API_BASE}/api/ventas`);
  if (!res.ok) throw new Error(`Error ${res.status}`);
  return await res.json();
}

export async function createVenta(payload: VentaRequest): Promise<any> {
  const res = await fetch(`${API_BASE}/api/ventas`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const body = await parseBody(res);
  if (!res.ok) {
    // Devuelve mensaje del backend si existe
    throw new Error(body?.message || `Error ${res.status}`);
  }
  return body;
}

export async function updateVenta(id: number, payload: VentaRequest): Promise<any> {
  const res = await fetch(`${API_BASE}/api/ventas/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const body = await parseBody(res);
  if (!res.ok) {
    throw new Error(body?.message || `Error ${res.status}`);
  }
  return body;
}

export async function deleteVenta(id: number): Promise<void> {
  const res = await fetch(`${API_BASE}/api/ventas/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error(`Error ${res.status}`);
}

// Nuevas funciones para obtener clientes, metodos y productos desde el mismo backend
export async function getClientes(): Promise<any[]> {
  const res = await fetch(`${API_BASE}/api/clientes`);
  if (!res.ok) throw new Error(`Error ${res.status}`);
  return await res.json();
}

export async function getMetodos(): Promise<any[]> {
  const res = await fetch(`${API_BASE}/api/metodo_pago`);
  if (!res.ok) throw new Error(`Error ${res.status}`);
  return await res.json();
}

export async function getProductos(): Promise<any[]> {
  const res = await fetch(`${API_BASE}/api/productos`);
  if (!res.ok) throw new Error(`Error ${res.status}`);
  return await res.json();
}

export async function getPedidos(): Promise<any[]> {
  const res = await fetch(`${API_BASE}/api/pedido`);
  if (!res.ok) throw new Error(`Error ${res.status}`);
  return await res.json();
}

export async function createPedido(payload: any): Promise<any> {
  const res = await fetch(`${API_BASE}/api/pedido`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`Error ${res.status}`);
  return await res.json();
}

export default { getVentas, createVenta, updateVenta, deleteVenta, getPedidos, createPedido, getClientes, getMetodos, getProductos };