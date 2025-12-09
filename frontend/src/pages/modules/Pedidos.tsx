import React, { useEffect, useState } from "react";
import CrudPage from "@/components/crud/CrudPage";
import { Badge } from "@/components/ui/badge";
import * as apiPedido from "@/lib/apiPedido";
import * as apiVentas from "@/lib/apiVentas";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

type AnyObj = Record<string, any>;

export default function Pedidos() {
  const toast = useToast().toast;
  const [pedidos, setPedidos] = useState<AnyObj[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [clients, setClients] = useState<AnyObj[]>([]);
  const [products, setProducts] = useState<AnyObj[]>([]);
  const [loading, setLoading] = useState(false);

  // form state + currentItem for edit mode
  const [form, setForm] = useState<any>({
    id: undefined,
    idCliente: undefined,
    detallePedido: "",
    estadoPedido: "pendiente",
    totalPedido: "",
    fechaPedido: "",
    cantidadPedido: 0,
    productos: [] as Array<{ idProducto?: number; cantidad?: number; precioUnitario?: number }>,
  });
  const [currentItem, setCurrentItem] = useState<any | null>(null);

  const resetForm = () => {
    setForm({
      id: undefined,
      idCliente: undefined,
      detallePedido: "",
      estadoPedido: "pendiente",
      totalPedido: "",
      fechaPedido: "",
      cantidadPedido: 0,
      productos: [],
    });
    setCurrentItem(null);
  };

  // pick helper: busca propiedades alternativas (incluye soporte para "cliente.usuario.nombre1")
  const pick = (obj: AnyObj, candidates: string[]) => {
    for (const k of candidates) {
      if (obj == null) break;
      if (k.includes(".")) {
        const parts = k.split(".");
        let cur: any = obj;
        let ok = true;
        for (const p of parts) {
          if (cur == null || typeof cur === "undefined") { ok = false; break; }
          cur = cur[p];
        }
        if (ok && typeof cur !== "undefined") return cur;
      } else {
        if (typeof obj[k] !== "undefined" && obj[k] !== null) return obj[k];
      }
    }
    return null;
  };

  // Formatea un cliente/usuario a string legible (maneja estructuras: cliente, cliente.usuario, usuario)
  const formatPerson = (o: any) => {
    if (!o) return "";
    if (typeof o === "string" || typeof o === "number") return String(o);

    const candUser = o.usuario ?? o.user ?? null;
    const target = candUser ?? o;

    const n1 = target.nombre1 ?? target.nombre ?? "";
    const n2 = target.nombre2 ?? "";
    const a1 = target.apellido1 ?? target.apellido ?? "";
    const a2 = target.apellido2 ?? "";
    const email = target.correo ?? target.email ?? "";
    const tel = target.telefono ?? target.phone ?? "";

    const fullName = `${n1} ${n2} ${a1} ${a2}`.replace(/\s+/g, " ").trim();
    if (fullName) return fullName + (email ? ` (${email})` : "");
    if (email) return email;
    if (tel) return tel;
    try {
      const s = JSON.stringify(o);
      return s.length > 60 ? s.slice(0, 57) + "..." : s;
    } catch {
      return "[obj]";
    }
  };

  const normalize = (r: AnyObj) => {
    const clienteRaw = pick(r, [
      "cliente",
      "cliente.usuario",
      "cliente.usuario.nombre1",
      "cliente.nombre1",
      "clienteNombre",
      "usuario",
      "usuario.nombre1",
      "cliente_nombre"
    ]);

    const detalle = pick(r, ["detalle_pedido", "detallePedido", "detalle", "descripcion"]);
    const estado = pick(r, ["estado_pedido", "estadoPedido", "estado"]);
    const total = pick(r, ["total_pedido", "totalPedido", "total", "monto"]);
    const cantidad = pick(r, ["cantidad_pedido", "cantidadPedido", "cantidad"]);
    const fecha = pick(r, ["fecha_pedido", "fechaPedido", "fecha", "createdAt", "created_at"]);

    const clienteStr = (clienteRaw && typeof clienteRaw === "object") ? formatPerson(clienteRaw) : (clienteRaw ?? "");

    let fechaStr = "";
    if (fecha) {
      if (typeof fecha === "string") fechaStr = fecha.slice(0, 10);
      else if (fecha instanceof Date) fechaStr = fecha.toISOString().slice(0, 10);
      else fechaStr = String(fecha);
    }

    return {
      id: pick(r, ["id", "id_pedido", "idPedido"]),
      cliente: clienteStr,
      detalle_pedido: detalle ?? "",
      estado_pedido: estado ?? "",
      total_pedido: total ?? null,
      cantidad_pedido: cantidad ?? null,
      fecha_pedido: fechaStr,
      raw: r
    };
  };

  const fetchAuxData = async () => {
    try {
      const [cli, prods] = await Promise.all([apiVentas.getClientes(), apiVentas.getProductos()]);
      setClients(Array.isArray(cli) ? cli : []);
      setProducts(Array.isArray(prods) ? prods : []);
    } catch (err) {
      console.warn("No se pudieron cargar clientes/productos:", err);
    }
  };

  const fetchPedidos = async () => {
    setLoading(true);
    try {
      const data = await apiPedido.getPedidos();
      setPedidos(Array.isArray(data) ? data.map(normalize) : []);
    } catch (err: any) {
      console.error("Error fetching pedidos:", err);
      toast({ title: "Error", description: "No se pudieron cargar los pedidos", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void fetchAuxData(); void fetchPedidos(); }, []);

  // --- Handlers usados por CrudPage built-in dialog/buttons ---

  // llamado cuando el usuario pulsa el botón "Agregar" superior (CrudPage llamará onAdd)
  const handleAdd = () => {
    resetForm();
    setIsDialogOpen(true); // open CrudPage dialog
  };

  // llamado cuando el usuario pulsa "Editar" en una fila (CrudPage llamará onEdit(row))
  const handleEdit = (row: any) => {
    const raw = row.raw ?? row;
    const clienteId = pick(raw, ["cliente.id", "cliente.id_cliente", "clienteId", "idCliente", "id_cliente"]);
    const detalle = pick(raw, ["detalle_pedido", "detallePedido", "detalle"]);
    const estado = pick(raw, ["estado_pedido", "estadoPedido", "estado"]);
    const total = pick(raw, ["total_pedido", "totalPedido", "total", "monto"]);
    const cantidad = pick(raw, ["cantidad_pedido", "cantidadPedido", "cantidad"]);
    const fecha = pick(raw, ["fecha_pedido", "fechaPedido", "fecha", "createdAt"]);
    const prods = pick(raw, ["productos", "productosPedido", "detalles"]) ?? [];

    setForm({
      id: pick(raw, ["id", "id_pedido", "idPedido"]),
      idCliente: clienteId,
      detallePedido: detalle ?? "",
      estadoPedido: estado ?? "pendiente",
      totalPedido: total ?? "",
      fechaPedido: fecha ? (typeof fecha === "string" ? fecha.slice(0, 10) : String(fecha)) : "",
      cantidadPedido: cantidad ?? 0,
      productos: Array.isArray(prods) ? prods.map((p: any) => ({
        idProducto: p.idProducto ?? p.producto?.id ?? p.productoId ?? p.id,
        cantidad: p.cantidad ?? p.cantidadPedido ?? p.cantidad_producto ?? 1,
        precioUnitario: p.precioUnitario ?? p.precio_unitario ?? p.precio ?? 0
      })) : []
    });
    setCurrentItem(raw);
    setIsDialogOpen(true); // open dialog for editing
  };

  // onSave called by CrudPage when "Agregar/Actualizar" is clicked in its DialogFooter
  const handleSave = async () => {
    try {
      // Validaciones simples
      if (!form.idCliente) { toast({ title: "Error", description: "Selecciona un cliente", variant: "destructive" }); return; }
      if (!form.detallePedido) { toast({ title: "Error", description: "Completa el detalle", variant: "destructive" }); return; }

      const payload: any = {
        idCliente: Number(form.idCliente),
        detallePedido: String(form.detallePedido),
        estadoPedido: String(form.estadoPedido),
        totalPedido: form.totalPedido === "" ? 0 : Number(form.totalPedido),
        fechaPedido: form.fechaPedido || undefined,
        cantidadPedido: Number(form.cantidadPedido),
        productos: Array.isArray(form.productos) ? form.productos.map((p: any) => ({
          idProducto: Number(p.idProducto),
          cantidad: Number(p.cantidad),
          precioUnitario: p.precioUnitario === "" ? 0 : Number(p.precioUnitario)
        })) : []
      };

      if (currentItem) {
        const id = form.id ?? pick(currentItem, ["id", "id_pedido", "idPedido"]);
        if (!id) {
          toast({ title: "Error", description: "ID del pedido no disponible para editar", variant: "destructive" });
          return;
        }
        const updated = await apiPedido.updatePedido(Number(id), payload);
        setPedidos(prev => prev.map(p => p.id === Number(id) ? normalize(updated) : p));
        toast({ title: "Pedido actualizado", description: "Los cambios se guardaron correctamente." });
      } else {
        const created = await apiPedido.createPedido(payload);
        setPedidos(prev => [normalize(created), ...prev]);
        toast({ title: "Pedido creado", description: "Pedido creado correctamente." });
      }

      setIsDialogOpen(false);
      resetForm();
    } catch (err: any) {
      console.error("Error creando/actualizando pedido:", err);
      toast({ title: "Error", description: err?.message || "Error en la operación", variant: "destructive" });
    }
  };

  // --- product row helpers (used inside formContent) ---
  const addProductRow = () => {
    setForm((s: any) => ({ ...s, productos: [...(s.productos || []), { idProducto: undefined, cantidad: 1, precioUnitario: 0 }] }));
  };
  const updateProductRow = (index: number, changes: Partial<any>) => {
    setForm((s: any) => {
      const arr = [...(s.productos || [])];
      arr[index] = { ...(arr[index] || {}), ...changes };
      return { ...s, productos: arr };
    });
  };
  const removeProductRow = (index: number) => {
    setForm((s: any) => {
      const arr = [...(s.productos || [])];
      arr.splice(index, 1);
      return { ...s, productos: arr };
    });
  };

  // formContent: passed to CrudPage so it renders inside its DialogContent.
  const formContent = (
    <div className="py-2">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-muted-foreground">Cliente</label>
          <select className="mt-1 w-full border p-2 rounded" value={form.idCliente ?? ""} onChange={(e) => setForm({ ...form, idCliente: e.target.value ? Number(e.target.value) : undefined })}>
            <option value="">-- Selecciona cliente --</option>
            {clients.map(c => {
              const label = formatPerson(c.usuario ?? c);
              return <option key={c.id ?? c.id_cliente ?? Math.random()} value={c.id ?? c.id_cliente ?? ""}>{label}</option>;
            })}
          </select>
        </div>

        <div>
          <label className="block text-sm text-muted-foreground">Estado</label>
          <select className="mt-1 w-full border p-2 rounded" value={form.estadoPedido} onChange={(e) => setForm({ ...form, estadoPedido: e.target.value })}>
            <option value="pendiente">Pendiente</option>
            <option value="En proceso">En proceso</option>
            <option value="Entregado">Entregado</option>
            <option value="Cancelado">Cancelado</option>
          </select>
        </div>

        <div className="col-span-2">
          <label className="block text-sm text-muted-foreground">Detalle</label>
          <textarea className="mt-1 w-full border p-2 rounded" rows={3} value={form.detallePedido} onChange={(e) => setForm({ ...form, detallePedido: e.target.value })} />
        </div>

        <div>
          <label className="block text-sm text-muted-foreground">Total</label>
          <input type="number" step="0.01" className="mt-1 w-full border p-2 rounded" value={form.totalPedido} onChange={(e) => setForm({ ...form, totalPedido: e.target.value })} />
        </div>

        <div>
          <label className="block text-sm text-muted-foreground">Cantidad</label>
          <input type="number" className="mt-1 w-full border p-2 rounded" value={form.cantidadPedido} onChange={(e) => setForm({ ...form, cantidadPedido: Number(e.target.value) })} />
        </div>

        <div>
          <label className="block text-sm text-muted-foreground">Fecha</label>
          <input type="date" className="mt-1 w-full border p-2 rounded" value={form.fechaPedido} onChange={(e) => setForm({ ...form, fechaPedido: e.target.value })} />
        </div>
      </div>

      <hr className="my-4" />

      <div>
        <div className="flex items-center justify-between">
          <h4 className="font-semibold">Productos (opcional)</h4>
          <div className="flex gap-2">
            <Button size="sm" onClick={addProductRow}>Añadir producto</Button>
          </div>
        </div>

        <div className="mt-3 space-y-2">
          {(form.productos || []).map((p: any, idx: number) => (
            <div key={idx} className="grid grid-cols-12 gap-2 items-center border rounded p-2">
              <div className="col-span-5">
                <select className="w-full p-2 border rounded" value={p.idProducto ?? ""} onChange={(e) => updateProductRow(idx, { idProducto: Number(e.target.value) })}>
                  <option value="">-- Selecciona producto --</option>
                  {products.map(prod => <option key={prod.id} value={prod.id}>{prod.nombre ?? prod.nombre_producto ?? `#${prod.id}`}</option>)}
                </select>
              </div>
              <div className="col-span-3">
                <input type="number" min={1} className="w-full p-2 border rounded" value={p.cantidad ?? 1} onChange={(e) => updateProductRow(idx, { cantidad: Number(e.target.value) })} />
              </div>
              <div className="col-span-3">
                <input type="number" step="0.01" className="w-full p-2 border rounded" value={p.precioUnitario ?? 0} onChange={(e) => updateProductRow(idx, { precioUnitario: Number(e.target.value) })} />
              </div>
              <div className="col-span-1">
                <Button variant="destructive" size="sm" onClick={() => removeProductRow(idx)}>X</Button>
              </div>
            </div>
          ))}
          {(!form.productos || form.productos.length === 0) && <p className="text-sm text-muted-foreground">No hay productos agregados.</p>}
        </div>
      </div>
    </div>
  );

  const columns = [
    { key: "id", label: "ID Pedido", render: (v: number) => `#${v}` },
    { key: "cliente", label: "Cliente" },
    { key: "detalle_pedido", label: "Detalle" },
    { key: "cantidad_pedido", label: "Cantidad" },
    { key: "total_pedido", label: "Total", render: (v: number) => (v == null ? "" : `$${Number(v).toLocaleString()}`) },
    { key: "estado_pedido", label: "Estado", render: (value: string) => (
      <Badge className={`font-semibold ${value === "Entregado" ? "bg-green-100 text-green-700" : value === "En proceso" ? "bg-blue-100 text-blue-700" : "bg-yellow-100 text-yellow-700"}`}>{value}</Badge>
    ) },
    { key: "fecha_pedido", label: "Fecha" },
  ];

  return (
    <CrudPage
      title="Pedidos"
      description="Gestiona todos los pedidos de clientes"
      columns={columns}
      data={pedidos}
      onDelete={(id) => void (async () => {
        if (!id) return;
        try {
          await apiPedido.deletePedido(id);
          setPedidos(prev => prev.filter(p => p.id !== id));
          toast({ title: "Eliminado", description: "Pedido eliminado correctamente." });
        } catch (err: any) {
          console.error("Error deleting pedido:", err);
          toast({ title: "Error", description: err?.message || "No se pudo eliminar el pedido", variant: "destructive" });
        }
      })()}
      onAdd={handleAdd}
      onEdit={handleEdit}
      onSave={handleSave}
      formContent={formContent}
      isDialogOpen={isDialogOpen}
      onDialogOpenChange={(open) => { setIsDialogOpen(open); if (!open) { resetForm(); } }}
      currentItem={currentItem}
      // not passing renderActions -> CrudPage will render default Edit/Delete per row
    />
  );
}