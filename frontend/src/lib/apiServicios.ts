// frontend/src/lib/apiServicios.ts
const BASE_URL = "http://localhost:8081/api/servicios";
const BASE_TIPOS = "http://localhost:8081/api/tipo_servicio";
const BASE_CATEGORIAS = "http://localhost:8081/api/categoria";

async function handleResponse(res: Response) {
  const text = await res.text();
  const contentType = res.headers.get("content-type") || "";
  const body = contentType.includes("application/json") && text ? JSON.parse(text) : text;
  if (!res.ok) {
    // Lanzamos un error con status y body para poder inspeccionarlo en el frontend
    throw new Error(`${res.status} ${res.statusText} - ${JSON.stringify(body)}`);
  }
  return body;
}

export async function getServicios() {
  const res = await fetch(BASE_URL, {
    headers: { "Accept": "application/json" }
  });
  return handleResponse(res);
}

export async function createServicio(servicio: any) {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json", "Accept": "application/json" },
    body: JSON.stringify(servicio),
  });
  return handleResponse(res);
}

export async function updateServicio(id: number, servicio: any) {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", "Accept": "application/json" },
    body: JSON.stringify(servicio),
  });
  return handleResponse(res);
}

export async function deleteServicio(id: number) {
  const res = await fetch(`${BASE_URL}/${id}`, { method: "DELETE" });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`${res.status} ${res.statusText} - ${text}`);
  }
}

// Nuevas funciones para selects
export async function getTipos() {
  const res = await fetch(BASE_TIPOS, { headers: { "Accept": "application/json" } });
  return handleResponse(res);
}

export async function getCategorias() {
  const res = await fetch(BASE_CATEGORIAS, { headers: { "Accept": "application/json" } });
  return handleResponse(res);
}