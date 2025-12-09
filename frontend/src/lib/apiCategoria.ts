const BASE_URL = "http://localhost:8081/api/categoria";

export async function getCategorias() {
  const res = await fetch(BASE_URL);
  return res.json();
}

export async function createCategoria(categoria: any) {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(categoria),
  });
  return res.json();
}

export async function updateCategoria(id: number, categoria: any) {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(categoria),
  });
  return res.json();
}

export async function deleteCategoria(id: number) {
  await fetch(`${BASE_URL}/${id}`, { method: "DELETE" });
}
