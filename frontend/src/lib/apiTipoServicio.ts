const BASE_URL = "http://localhost:8081/api/tipo_servicio";

export async function getTipoServicios() {
  const res = await fetch(BASE_URL);
  return res.json();
}

export async function createTipoServicio(tipoServicio: any) {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(tipoServicio),
  });
  return res.json();
}

export async function updateTipoServicio(id: number, tipoServicio: any) {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(tipoServicio),
  });
  return res.json();
}

export async function deleteTipoServicio(id: number) {
  await fetch(`${BASE_URL}/${id}`, { method: "DELETE" });
}
