const BASE_AUTH = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api/auth` : "http://localhost:8081/api/auth";

/**
 * Helper privado para parsear respuestas del servidor (mantiene comportamiento previo)
 */
async function handleResponse(res: Response) {
  const text = await res.text();
  const contentType = res.headers.get("content-type") || "";
  if (!res.ok) {
    // intenta parsear JSON para extraer message si existe
    try {
      if (contentType.includes("application/json") && text) {
        const json = JSON.parse(text);
        throw new Error(json?.message || `${res.status} ${res.statusText}`);
      }
    } catch {
      // fallthrough
    }
    throw new Error(`${res.status} ${res.statusText} - ${text}`);
  }
  if (contentType.includes("application/json") && text) {
    try {
      return JSON.parse(text);
    } catch (e) {
      throw new Error(`Respuesta no es JSON válido: ${text}`);
    }
  }
  return text;
}

export async function loginApi(email: string, password: string) {
  try {
    const res = await fetch(`${BASE_AUTH}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Accept": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    return await handleResponse(res);
  } catch (err: any) {
    if (err instanceof TypeError) {
      throw new Error("No se pudo conectar con el servidor. ¿El backend está en http://localhost:8081 y corriendo?");
    }
    throw err;
  }
}

export async function registerApi(payload: any) {
  try {
    const res = await fetch(`${BASE_AUTH}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Accept": "application/json" },
      body: JSON.stringify(payload),
    });
    return await handleResponse(res);
  } catch (err: any) {
    if (err instanceof TypeError) {
      throw new Error("No se pudo conectar con el servidor. ¿El backend está en http://localhost:8081 y corriendo?");
    }
    throw err;
  }
}

export type LoginResp = { token?: string; user?: any; accessToken?: string; data?: any };

export async function login(email: string, password: string): Promise<LoginResp> {
  const resp = await loginApi(email, password);
  const token = resp?.token ?? resp?.accessToken ?? resp?.data?.token ?? resp?.data?.accessToken;
  const user = resp?.user ?? resp?.data?.user ?? resp?.data ?? resp;
  return { token, user, accessToken: resp?.accessToken, data: resp };
}

export async function me(token: string): Promise<any> {
  const res = await fetch(`${BASE_AUTH}/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("No autorizado");
  return await res.json();
}

/* ===========================================================
   VALIDAR CORREO Y RECUPERAR CONTRASEÑA (nuevo flujo sin pregunta)
   =========================================================== */

export async function getPregunta(correo: string) {
  // Reutilizo el nombre getPregunta en frontend, pero ahora llama al endpoint check-email
  const res = await fetch(`${BASE_AUTH}/check-email?correo=${encodeURIComponent(correo)}`, {
    method: "GET",
    headers: { "Accept": "application/json" },
  });
  return await handleResponse(res);
}

export async function resetPasswordConPregunta(payload: {
  correo: string;
  respuestaSeguridad?: string; // ya no se usa, lo dejamos opcional
  nuevaContrasena: string;
}) {
  // Ahora llama al endpoint reset-password-email (sin pregunta)
  const res = await fetch(`${BASE_AUTH}/reset-password-email`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
    },
    body: JSON.stringify({
      correo: payload.correo,
      nuevaContrasena: payload.nuevaContrasena,
    }),
  });
  return await handleResponse(res);
}

export default { loginApi, registerApi, login, me };