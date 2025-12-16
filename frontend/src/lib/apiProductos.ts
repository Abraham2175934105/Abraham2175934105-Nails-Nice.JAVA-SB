// (modificado para añadir createProductoJSON; mantengo createProducto que acepta FormData por compatibilidad)
const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:8081";

type ProductoRequest = {
  nombre: string;
  descripcion: string;
  precio: number;
  estadoProducto: string;
  imagen?: string | null;
  idColor?: number | null;
  idMarca?: number | null;
  idUnidadMedida?: number | null;
  idCategoria?: number | null;
};

/* ---------- funciones existentes (CRUD) ---------- */
export async function getProductos(): Promise<any[]> {
  const res = await fetch(`${API_BASE}/api/productos`);
  if (!res.ok) throw new Error(`Error ${res.status}`);
  return await res.json();
}

export async function getProducto(id: number): Promise<any> {
  const res = await fetch(`${API_BASE}/api/productos/${id}`);
  if (!res.ok) throw new Error(`Error ${res.status}`);
  return await res.json();
}

// CREATE que acepta FormData (mantengo por compatibilidad con backends que soporten multipart)
export async function createProducto(formData: FormData): Promise<any> {
  const res = await fetch(`${API_BASE}/api/productos`, {
    method: "POST",
    body: formData,
  });
  if (res.status !== 201 && !res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.message || `Error ${res.status}`);
  }
  return await res.json();
}

// NUEVA: crear producto enviando JSON (application/json)
export async function createProductoJSON(payload: ProductoRequest): Promise<any> {
  const res = await fetch(`${API_BASE}/api/productos`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  if (res.status !== 201 && !res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.message || `Error ${res.status}`);
  }
  return await res.json();
}

// Se añadio este nuevo metodo el cual procesa el cargue del producto 
export async function updateProductoJSON(id: number, payload: ProductoRequest): Promise<any> {
  const res = await fetch(`${API_BASE}/api/productos/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.message || `Error ${res.status}`);
  }
  return await res.json();
}

export async function updateProducto(id: number, formData: FormData): Promise<any> {
  const res = await fetch(`${API_BASE}/api/productos/${id}`, {
    method: "PUT",
    body: formData,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.message || `Error ${res.status}`);
  }
  return await res.json();
}

export async function deleteProducto(id: number): Promise<void> {
  const res = await fetch(`${API_BASE}/api/productos/${id}`, { method: "DELETE" });
  if (!res.ok && res.status !== 204) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `Error ${res.status}`);
  }
  return;
}

/* ---------- listas para selects ---------- */
export async function getCategorias(): Promise<any[]> {
  const res = await fetch(`${API_BASE}/api/categoria`);
  if (!res.ok) throw new Error(`Error ${res.status}`);
  return await res.json();
}

export async function getMarcas(): Promise<any[]> {
  const res = await fetch(`${API_BASE}/api/marca`);
  if (!res.ok) throw new Error(`Error ${res.status}`);
  return await res.json();
}

export async function getColores(): Promise<any[]> {
  const res = await fetch(`${API_BASE}/api/color`);
  if (!res.ok) throw new Error(`Error ${res.status}`);
  return await res.json();
}

export async function getUnidades(): Promise<any[]> {
  const res = await fetch(`${API_BASE}/api/unidad_medida`);
  if (!res.ok) throw new Error(`Error ${res.status}`);
  return await res.json();
}

/* ---------- upload de imagen (multipart/form-data) ---------- */
export async function uploadImage(file: File): Promise<{ url: string }> {
  const form = new FormData();
  // ojo: si el backend espera 'file' este nombre debe coincidir
  form.append("file", file);
  const res = await fetch(`${API_BASE}/api/uploads`, {
    method: "POST",
    body: form,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.message || `Error ${res.status}`);
  }
  return await res.json();
}

/* ---------- nuevas funciones: búsqueda/filtrado ---------- */
// params: { q, categoryId, color, minPrice, maxPrice, page, size }
export async function fetchProductos(params: Record<string, any> = {}) {
  const qp = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => { if (v != null && v !== "") qp.set(k, String(v)); });
  const res = await fetch(`${API_BASE}/api/productos?${qp.toString()}`);
  if (!res.ok) throw new Error(`Error ${res.status}`);
  return res.json();
}

export async function fetchCategorias() {
  const res = await fetch(`${API_BASE}/api/categoria`);
  if (!res.ok) throw new Error(`Error ${res.status}`);
  return res.json();
}

export async function fetchProductoById(id: number) {
  const res = await fetch(`${API_BASE}/api/productos/${id}`);
  if (!res.ok) throw new Error(`Error ${res.status}`);
  return res.json();
}

export default {
  getProductos,
  getProducto,
  createProducto,
  createProductoJSON,
  updateProducto,
  deleteProducto,
  getCategorias,
  getMarcas,
  getColores,
  getUnidades,
  uploadImage,
  fetchProductos,
  fetchCategorias,
  fetchProductoById,
};