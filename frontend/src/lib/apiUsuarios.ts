const BASE_URL = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api/usuarios` : "http://localhost:8081/api/usuarios";
const BASE_ROLES = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api/rol` : "http://localhost:8081/api/rol";

async function handleResponse(res: Response) {
  const text = await res.text();
  if (!res.ok) {
    throw new Error(`${res.status} ${res.statusText} - ${text}`);
  }
  const contentType = res.headers.get("content-type") || "";
  if (contentType.includes("application/json") && text) {
    try {
      return JSON.parse(text);
    } catch (e) {
      throw new Error(`Respuesta no es JSON válido: ${text}`);
    }
  }
  return text;
}

export async function getUsuarios() {
  const res = await fetch(BASE_URL, { headers: { "Accept": "application/json" } });
  return handleResponse(res);
}

export async function getUsuario(id: number) {
  const res = await fetch(`${BASE_URL}/${id}`, { headers: { "Accept": "application/json" } });
  return handleResponse(res);
}

export async function createUsuario(usuario: any) {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json", "Accept": "application/json" },
    body: JSON.stringify(usuario),
  });
  return handleResponse(res);
}

export async function updateUsuario(id: number, usuario: any) {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", "Accept": "application/json" },
    body: JSON.stringify(usuario),
  });
  return handleResponse(res);
}

export async function deleteUsuario(id: number) {
  const res = await fetch(`${BASE_URL}/${id}`, { method: "DELETE" });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`${res.status} ${res.statusText} - ${text}`);
  }
}

export async function getRoles() {
  const res = await fetch(BASE_ROLES, { headers: { "Accept": "application/json" } });
  return handleResponse(res);
}

export default { getUsuarios, getUsuario, createUsuario, updateUsuario, deleteUsuario, getRoles };