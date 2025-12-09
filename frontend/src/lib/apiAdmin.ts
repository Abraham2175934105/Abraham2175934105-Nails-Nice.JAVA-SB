const BASE_ADMIN = "http://localhost:8081/api/admin";
const BASE_USUARIOS = "http://localhost:8081/api/usuarios";

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

export async function getAdminStats() {
  const res = await fetch(`${BASE_ADMIN}/stats`, {
    headers: { "Accept": "application/json" }
  });
  return handleResponse(res);
}

export async function getUsuarioById(id: number) {
  const res = await fetch(`${BASE_USUARIOS}/${id}`, {
    headers: { "Accept": "application/json" }
  });
  return handleResponse(res);
}

export async function updateUsuario(id: number, usuario: any) {
  const res = await fetch(`${BASE_USUARIOS}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", "Accept": "application/json" },
    body: JSON.stringify(usuario)
  });
  return handleResponse(res);
}