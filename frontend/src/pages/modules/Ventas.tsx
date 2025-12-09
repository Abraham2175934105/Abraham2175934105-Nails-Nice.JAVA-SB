import React, { useEffect, useState } from "react";
import CrudPage from "@/components/crud/CrudPage";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import * as apiVentas from "@/lib/apiVentas";

type VentaRaw = Record<string, any>;

type VentaRow = {
  id: number;
  cliente: string;
  numero_recibo: string;
  metodo_pago: string;
  estado_venta: string;
  monto_venta: number;
  fecha_de_venta: string;
  raw?: VentaRaw;
};

type ClienteOption = { id: number; label: string };
type MetodoOption = { id: number; label: string };
type ProductoOption = { id: number; label: string; precio?: number; stock?: number };

export default function Ventas() {
  const toast = useToast().toast;
  const [ventas, setVentas] = useState<VentaRow[]>([]);
  const [loading, setLoading] = useState(false);

  // selects
  const [clientes, setClientes] = useState<ClienteOption[]>([]);
  const [metodos, setMetodos] = useState<MetodoOption[]>([]);
  const [productos, setProductos] = useState<ProductoOption[]>([]);

  // dialog / form state
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState<VentaRow | null>(null);
  const emptyForm = {
    idCliente: "",
    idMetodo: "",
    numeroRecibo: "",
    estadoVenta: "Completado",
    fechaVenta: new Date().toISOString().slice(0, 10),
    montoVenta: "",
    detalles: [] as { idProducto: string; cantidad: string; precioUnitario: string }[],
  };
  const [form, setForm] = useState(() => ({ ...emptyForm }));

  // Helpers para leer diversos formatos desde el backend y normalizar
  const getStringFrom = (obj: any, candidates: string[]) => {
    if (!obj) return null;
    for (const k of candidates) {
      if (k.includes(".")) {
        const parts = k.split(".");
        let cur = obj;
        let ok = true;
        for (const p of parts) {
          if (cur == null) { ok = false; break; }
          cur = cur[p];
        }
        if (ok && cur != null) return String(cur);
        continue;
      }
      if (typeof obj[k] !== "undefined" && obj[k] !== null) return String(obj[k]);
    }
    return null;
  };

  const getNumberFrom = (obj: any, candidates: string[]) => {
    const s = getStringFrom(obj, candidates);
    if (s == null) return null;
    const n = Number(s);
    return Number.isFinite(n) ? n : null;
  };

  const normalizeVenta = (r: VentaRaw): VentaRow => {
    return {
      id: Number(getNumberFrom(r, ["id", "id_ventas", "idVenta", "venta.id"]) ?? 0),
      cliente:
        getStringFrom(r, [
          "cliente.usuario.nombre",
          "cliente.usuario.nombre1",
          "cliente.nombre1",
          "cliente.nombre",
          "clienteNombre",
          "cliente",
          "cliente_nombre",
        ]) ?? "-",
      numero_recibo: getStringFrom(r, ["numero_recibo", "numeroRecibo"]) ?? (r?.numeroRecibo ?? ""),
      metodo_pago:
        getStringFrom(r, [
          "metodoPago.nombreMetodo",
          "metodoPago.nombre_metodo",
          "metodoPago.nombre",
          "metodo_pago",
          "metodo",
          "metodoNombre",
        ]) ?? "-",
      estado_venta: getStringFrom(r, ["estado_venta", "estadoVenta", "estado"]) ?? "-",
      monto_venta: Number(getNumberFrom(r, ["monto_venta", "montoVenta", "monto"]) ?? (r?.montoVenta ?? 0)),
      fecha_de_venta: getStringFrom(r, ["fecha_de_venta", "fechaVenta", "fecha"]) ?? "",
      raw: r,
    };
  };

  // Robust product stock extractor: checks many possible shapes returned by backend
  const extractStock = (p: any): number => {
    if (!p) return 0;
    const candidates = [
      "stock",
      "cantidad",
      "cantidad_inventario",
      "cantidadInventario",
      "cantidadDisponible",
      "disponible",
      "available",
      "cantidad_total",
      "cantidadTotal",
    ];
    for (const k of candidates) {
      const v = p[k];
      if (typeof v !== "undefined" && v != null) {
        const n = Number(v);
        if (!Number.isNaN(n)) return Math.max(0, Math.floor(n));
      }
    }
    // check nested inventory arrays/objects
    if (Array.isArray(p.inventario) && p.inventario.length > 0) {
      const v = p.inventario[0].cantidad ?? p.inventario[0].stock ?? p.inventario[0].available;
      if (typeof v !== "undefined" && v != null) {
        const n = Number(v);
        if (!Number.isNaN(n)) return Math.max(0, Math.floor(n));
      }
    }
    if (p.inventario && typeof p.inventario === "object") {
      const v = p.inventario.cantidad ?? p.inventario.stock ?? p.inventario.available;
      if (typeof v !== "undefined" && v != null) {
        const n = Number(v);
        if (!Number.isNaN(n)) return Math.max(0, Math.floor(n));
      }
    }
    return 0;
  };

  // Unwrap respuesta del backend que puede venir envuelta (data, venta, array, etc.)
  const unwrapVenta = (resp: any) => {
    if (!resp) return resp;
    if (Array.isArray(resp)) return resp[0] ?? resp;
    if (typeof resp === "object") {
      if (resp.venta) return resp.venta;
      if (resp.data) {
        if (Array.isArray(resp.data)) return resp.data[0] ?? resp.data;
        if (resp.data.venta) return resp.data.venta;
        return resp.data;
      }
      if (resp.result) return resp.result;
    }
    return resp;
  };

  // Fetch initial data (USANDO apiVentas helper functions)
  const fetchAll = async () => {
    setLoading(true);
    try {
      const [ventasResp, clientesResp, metodosResp, productosResp] = await Promise.all([
        apiVentas.getVentas().catch((e) => { console.error("getVentas err", e); return []; }),
        (apiVentas as any).getClientes ? (apiVentas as any).getClientes().catch((e:any)=>{ console.error("getClientes err", e); return []; }) : fetch("/api/clientes").then(r => r.ok ? r.json() : []).catch(()=>[]),
        (apiVentas as any).getMetodos ? (apiVentas as any).getMetodos().catch((e:any)=>{ console.error("getMetodos err", e); return []; }) : fetch("/api/metodo_pago").then(r => r.ok ? r.json() : []).catch(()=>[]),
        (apiVentas as any).getProductos ? (apiVentas as any).getProductos().catch((e:any)=>{ console.error("getProductos err", e); return []; }) : fetch("/api/productos").then(r => r.ok ? r.json() : []).catch(()=>[]),
      ]);

      // map clientes
      const mapCliente = (c: any) => {
        const nombreUsuario = c?.usuario?.nombre ?? c?.usuario?.nombre1 ?? null;
        const apellidoUsuario = c?.usuario?.apellido ?? "";
        const correo = c?.usuario?.correo ?? c?.usuario?.email ?? null;
        const nombreDirect = c?.nombre ?? c?.nombre1 ?? null;
        const label = nombreUsuario ? `${nombreUsuario} ${apellidoUsuario}` : (nombreDirect ?? correo ?? String(c?.id ?? ""));
        return { id: c.id ?? c.id_cliente ?? 0, label };
      };
      const clientesArr = Array.isArray(clientesResp) ? clientesResp.map(mapCliente) : [];

      // map metodos
      const mapMetodo = (m: any) => ({ id: m.id ?? m.id_metodo ?? 0, label: m.nombreMetodo ?? m.nombre_metodo ?? m.nombre ?? String(m.id) });
      const metodosArr = Array.isArray(metodosResp) ? metodosResp.map(mapMetodo) : [];

      // map productos, now robustly extracting stock
      const mapProducto = (p: any) => ({
        id: p.id ?? p.id_producto ?? 0,
        label: p.nombre ?? p.nombre_producto ?? String(p.id),
        precio: Number(p.precio ?? p.precio_unitario ?? (p.precio ? Number(p.precio) : 0)) || 0,
        stock: extractStock(p),
      });
      const productosArr = Array.isArray(productosResp) ? productosResp.map(mapProducto) : [];

      // Normalize ventas and try to resolve cliente/metodo names using resolved arrays
      const ventasNormalized: VentaRow[] = Array.isArray(ventasResp) ? ventasResp.map((r: any) => {
        const v = normalizeVenta(r);
        const idClienteCandidate = r?.idCliente ?? r?.id_cliente ?? r?.cliente?.id ?? null;
        if ((!v.cliente || v.cliente === "-" || v.cliente === "") && idClienteCandidate != null) {
          const found = clientesArr.find(c => Number(c.id) === Number(idClienteCandidate));
          if (found) v.cliente = found.label;
        }
        const idMetodoCandidate = r?.idMetodo ?? r?.id_metodo ?? r?.metodoPago?.id ?? null;
        if ((!v.metodo_pago || v.metodo_pago === "-" || v.metodo_pago === "") && idMetodoCandidate != null) {
          const found = metodosArr.find(m => Number(m.id) === Number(idMetodoCandidate));
          if (found) v.metodo_pago = found.label;
        }
        v.raw = r;
        return v;
      }) : [];

      setClientes(clientesArr);
      setMetodos(metodosArr);
      setProductos(productosArr);
      setVentas(ventasNormalized);
    } catch (err: any) {
      console.error("Error fetchAll ventas:", err);
      toast({ title: "Error", description: "No se pudieron cargar datos de ventas", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void fetchAll(); }, []);

  // Evita que un producto seleccionado en una línea aparezca en otras líneas
  const getAvailableProductsForLine = (lineIdx: number) => {
    const selectedIds = new Set(form.detalles.map((d, i) => (i === lineIdx ? null : d.idProducto)).filter(Boolean));
    return productos.filter(p => !selectedIds.has(String(p.id)));
  };

  // Recalcula monto total cuando cambian detalles
  useEffect(() => {
    const total = form.detalles.reduce((acc, d) => {
      const q = Number(d.cantidad) || 0;
      const p = Number(d.precioUnitario) || 0;
      return acc + q * p;
    }, 0);
    setForm((s) => ({ ...s, montoVenta: String(Number(total.toFixed(2))) }));
  }, [form.detalles]);

  // Form helpers
  const updateField = (key: string, value: any) => {
    setForm((s) => ({ ...s, [key]: value }));
  };

  const addDetailLine = () => {
    // prevent adding a line if there are no remaining products
    const remaining = productos.filter(p => !form.detalles.some(d => String(d.idProducto) === String(p.id)));
    if (remaining.length === 0) {
      toast({ title: "No hay productos disponibles", description: "Ya seleccionaste todos los productos.", variant: "destructive" });
      return;
    }
    setForm((s) => ({ ...s, detalles: [...s.detalles, { idProducto: "", cantidad: "1", precioUnitario: "0" }] }));
  };
  const updateDetail = (idx: number, key: string, value: any) => {
    setForm((s) => {
      const d = [...s.detalles];
      // @ts-ignore
      d[idx] = { ...d[idx], [key]: value };
      return { ...s, detalles: d };
    });
  };
  const removeDetail = (idx: number) => {
    setForm((s) => ({ ...s, detalles: s.detalles.filter((_, i) => i !== idx) }));
  };

  // Cuando se selecciona un producto en la línea, autocompletar precioUnitario y cantidad limitada por stock
  const onSelectProducto = (idx: number, productId: string) => {
    const prod = productos.find(p => String(p.id) === String(productId));
    updateDetail(idx, "idProducto", productId);
    if (prod) {
      updateDetail(idx, "precioUnitario", prod.precio != null ? String(prod.precio) : "0");
      // default quantity 1 or max available if zero
      const defaultQty = prod.stock && prod.stock > 0 ? "1" : "0";
      updateDetail(idx, "cantidad", defaultQty);
    } else {
      updateDetail(idx, "precioUnitario", "0");
      updateDetail(idx, "cantidad", "0");
    }
  };

  // Dialog actions
  const handleAdd = () => { setCurrentItem(null); setForm({ ...emptyForm }); setIsDialogOpen(true); };

  const handleEdit = (row: VentaRow) => {
    const r = row.raw ?? {};
    const idCliente = String(r?.idCliente ?? r?.id_cliente ?? r?.cliente?.id ?? "");
    const idMetodo = String(r?.idMetodo ?? r?.id_metodo ?? r?.metodoPago?.id ?? "");
    const numeroRecibo = r?.numero_recibo ?? r?.numeroRecibo ?? "";
    const estadoVenta = r?.estado_venta ?? r?.estadoVenta ?? r?.estado ?? "Completado";
    const fechaVenta = r?.fecha_de_venta ?? r?.fechaVenta ?? r?.fecha ?? new Date().toISOString().slice(0,10);
    const montoVenta = String(r?.monto_venta ?? r?.montoVenta ?? r?.monto ?? "");
    const detallesRaw = r?.detalles ?? r?.detalle_venta ?? r?.detalleVenta ?? [];
    const detalles = Array.isArray(detallesRaw) ? detallesRaw.map((d: any) => ({
      idProducto: String(d?.idProducto ?? d?.id_producto ?? d?.producto?.id ?? ""),
      cantidad: String(d?.cantidad ?? "1"),
      precioUnitario: String(d?.precioUnitario ?? d?.precio_unitario ?? d?.precio ?? "0"),
    })) : [];

    setForm({
      idCliente: idCliente ?? "",
      idMetodo: idMetodo ?? "",
      numeroRecibo: numeroRecibo ?? "",
      estadoVenta: estadoVenta ?? "Completado",
      fechaVenta: fechaVenta ?? new Date().toISOString().slice(0,10),
      montoVenta: montoVenta ?? "",
      detalles,
    });
    setCurrentItem(row);
    setIsDialogOpen(true);
  };

  // DELETE: ahora llamamos fetchAll() después de eliminar para asegurar sincronía
  const handleDelete = async (id?: number) => {
    if (!id) return;
    if (!confirm("¿Eliminar venta?")) return;
    try {
      await apiVentas.deleteVenta(id);
      // refrescar la lista completa desde el backend para evitar inconsistencias
      await fetchAll();
      toast({ title: "Eliminada", description: "Venta eliminada correctamente." });
    } catch (err: any) {
      console.error("Error deleting venta:", err);
      toast({ title: "Error", description: "No se pudo eliminar la venta", variant: "destructive" });
    }
  };

  // SAVE (create/update): después de la operación refrescamos la lista siempre
  const handleSave = async () => {
    // basic validation
    if (!form.idCliente) { toast({ title: "Falta cliente", description: "Selecciona un cliente", variant: "destructive" }); return; }
    if (!form.idMetodo) { toast({ title: "Falta metodo", description: "Selecciona un método de pago", variant: "destructive" }); return; }

    // Validar detalles: al menos uno y campos obligatorios
    if (!form.detalles || form.detalles.length === 0) {
      toast({ title: "Falta productos", description: "Agrega al menos un producto para generar la venta", variant: "destructive" });
      return;
    }

    // Validar duplicados: no permitir mismo producto repetido
    const ids = form.detalles.map(d => d.idProducto).filter(Boolean);
    const dup = ids.find((v, i) => ids.indexOf(v) !== i);
    if (dup) {
      toast({ title: "Producto duplicado", description: "No puedes agregar el mismo producto en más de una línea", variant: "destructive" });
      return;
    }

    for (const det of form.detalles) {
      if (!det.idProducto) { toast({ title: "Producto inválido", description: "Selecciona un producto en cada línea", variant: "destructive" }); return; }
      const stock = productos.find(p => String(p.id) === String(det.idProducto))?.stock ?? 0;
      const qty = Number(det.cantidad);
      if (!qty || qty <= 0) { toast({ title: "Cantidad inválida", description: "Ingresa una cantidad válida", variant: "destructive" }); return; }
      if (stock != null && qty > stock) { toast({ title: "Stock insuficiente", description: `La cantidad (${qty}) supera el stock disponible (${stock})`, variant: "destructive" }); return; }
      if (!det.precioUnitario || Number.isNaN(Number(det.precioUnitario))) { toast({ title: "Precio inválido", description: "El precio unitario debe ser válido", variant: "destructive" }); return; }
    }

    const payload: any = {
      idCliente: Number(form.idCliente),
      idMetodo: Number(form.idMetodo),
      numeroRecibo: form.numeroRecibo || null,
      estadoVenta: form.estadoVenta,
      fechaVenta: form.fechaVenta,
      montoVenta: Number(form.montoVenta) || 0,
      detalles: form.detalles.map(d => ({ idProducto: Number(d.idProducto), cantidad: Number(d.cantidad), precioUnitario: Number(d.precioUnitario) }))
    };

    try {
      if (currentItem == null) {
        await apiVentas.createVenta(payload);
        // refrescar la lista completa
        await fetchAll();
        toast({ title: "Creada", description: "Venta creada correctamente." });
      } else {
        await apiVentas.updateVenta(currentItem.id, payload);
        // refrescar la lista completa
        await fetchAll();
        toast({ title: "Actualizada", description: "Venta actualizada correctamente." });
      }
      setIsDialogOpen(false);
      setCurrentItem(null);
      setForm({ ...emptyForm });
    } catch (err: any) {
      console.error("Error saving venta:", err);
      toast({ title: "Error", description: err?.message || "Error al guardar venta", variant: "destructive" });
    }
  };

  const columns = [
    { key: "numero_recibo", label: "Recibo" },
    { key: "cliente", label: "Cliente" },
    { key: "monto_venta", label: "Monto", render: (v: number) => (v == null ? "" : `$${Number(v).toLocaleString()}`) },
    { key: "metodo_pago", label: "Método Pago" },
    {
      key: "estado_venta",
      label: "Estado",
      render: (value: string) => (
        <Badge className={`font-semibold ${value === "Completado" ? "bg-green-100 text-green-700" : value === "Pendiente" ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700"}`}>{value}</Badge>
      )
    },
    { key: "fecha_de_venta", label: "Fecha" },
  ];

  // form content JSX (mejor estilo y espaciado)
  // He QUITADO el botón "Cancelar" dentro del formContent para evitar duplicados con CrudPage
  const formContent = (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block mb-1 font-medium">Cliente</label>
          <select value={form.idCliente} onChange={(e) => updateField("idCliente", e.target.value)} className="w-full p-3 border rounded-lg shadow-sm">
            <option value="">-- Selecciona cliente --</option>
            {clientes.map(c => <option key={c.id} value={String(c.id)}>{c.label}</option>)}
          </select>
        </div>
        <div>
          <label className="block mb-1 font-medium">Método pago</label>
          <select value={form.idMetodo} onChange={(e) => updateField("idMetodo", e.target.value)} className="w-full p-3 border rounded-lg shadow-sm">
            <option value="">-- Selecciona método --</option>
            {metodos.map(m => <option key={m.id} value={String(m.id)}>{m.label}</option>)}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block mb-1 font-medium">Número recibo</label>
          <input value={form.numeroRecibo} onChange={(e) => updateField("numeroRecibo", e.target.value)} className="w-full p-3 border rounded-lg" placeholder={currentItem ? "" : "Se generará automáticamente"} readOnly={!!currentItem} disabled={!currentItem} />
        </div>

        <div>
          <label className="block mb-1 font-medium">Estado</label>
          <select value={form.estadoVenta} onChange={(e) => updateField("estadoVenta", e.target.value)} className="w-full p-3 border rounded-lg">
            <option>Completado</option>
            <option>Pendiente</option>
            <option>Cancelado</option>
          </select>
        </div>

        <div>
          <label className="block mb-1 font-medium">Fecha</label>
          <input type="date" value={form.fechaVenta} onChange={(e) => updateField("fechaVenta", e.target.value)} className="w-full p-3 border rounded-lg" />
        </div>
      </div>

      <div className="flex items-center justify-between gap-4">
        <div className="w-1/2">
          <label className="block mb-1 font-medium">Monto total</label>
          <input type="number" step="0.01" value={form.montoVenta} readOnly className="w-full p-3 border rounded-lg bg-gray-50 text-lg font-semibold" />
        </div>
        <div>
          <Button onClick={addDetailLine} className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-3 rounded-lg shadow">
            Agregar productos
          </Button>
        </div>
      </div>

      <div className="space-y-3">
        {form.detalles.map((d, idx) => {
          const prod = productos.find(p => String(p.id) === String(d.idProducto));
          const stock = prod?.stock ?? 0;
          const available = getAvailableProductsForLine(idx);
          return (
            <div key={idx} className="grid grid-cols-1 md:grid-cols-5 gap-3 items-end p-4 border rounded-lg bg-white shadow-sm">
              <div className="md:col-span-2">
                <label className="block mb-1 font-medium">Producto</label>
                <select value={d.idProducto} onChange={(e) => onSelectProducto(idx, e.target.value)} className="w-full p-3 border rounded-md">
                  <option value="">-- Producto --</option>
                  {available.map(p => <option key={p.id} value={String(p.id)}>{p.label}{p.stock ? ` (${p.stock})` : ""}</option>)}
                  {prod && !available.find(a => String(a.id) === String(prod.id)) ? <option key={prod.id} value={String(prod.id)}>{prod.label}{prod.stock ? ` (${prod.stock})` : ""}</option> : null}
                </select>
              </div>

              <div>
                <label className="block mb-1 font-medium">Cantidad</label>
                {stock > 0 ? (
                  <select value={d.cantidad} onChange={(e) => updateDetail(idx, "cantidad", e.target.value)} className="w-full p-3 border rounded-md">
                    {Array.from({ length: Math.min(stock, 100) }, (_, i) => i + 1).map(n => <option key={n} value={String(n)}>{n}</option>)}
                  </select>
                ) : (
                  <div className="text-sm text-red-600 font-medium">Sin stock</div>
                )}
              </div>

              <div>
                <label className="block mb-1 font-medium">Precio unit.</label>
                <input type="number" step="0.01" value={d.precioUnitario} onChange={(e) => updateDetail(idx, "precioUnitario", e.target.value)} className="w-full p-3 border rounded-md" />
              </div>

              <div>
                <label className="block mb-1 font-medium">Subtotal</label>
                <div className="p-3 border rounded-md bg-gray-50 font-medium">${(Number(d.cantidad) * Number(d.precioUnitario) || 0).toFixed(2)}</div>
              </div>

              <div className="flex items-center justify-end gap-2">
                <Button variant="destructive" onClick={() => removeDetail(idx)} className="px-4 py-2 rounded-md">
                  Eliminar
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <CrudPage
      title="Ventas"
      description="Gestiona todas las ventas realizadas"
      columns={columns}
      data={ventas}
      onDelete={(id) => void handleDelete(id)}
      onAdd={handleAdd}
      onEdit={handleEdit}
      onSave={handleSave}
      formContent={formContent}
      isDialogOpen={isDialogOpen}
      onDialogOpenChange={setIsDialogOpen}
      currentItem={currentItem}
      searchPlaceholder="Buscar por recibo, cliente o método de pago..."
    />
  );
}