import React, { useEffect, useState } from "react";
import CrudPage from "@/components/crud/CrudPage";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import * as apiInv from "@/lib/apiInventario";

type InventarioBackend = {
  id: number;
  idProducto?: number;
  productoNombre?: string;
  idUbicacion?: number;
  ubicacionDescripcion?: string;
  idProveedor?: number;
  proveedorNombre?: string;
  cantidad: number;
  stock: number;
  estado: string;
  fechaIngreso: string;
  createdAt?: string;
  updatedAt?: string;
  createdWithProduct?: boolean; // nueva bandera
};

type Option = { id: number | null; label: string };

export default function Inventario() {
  const [data, setData] = useState<InventarioBackend[]>([]);
  const [loading, setLoading] = useState(false);
  const [productos, setProductos] = useState<Option[]>([]);
  const [ubicaciones, setUbicaciones] = useState<Option[]>([]);
  const [proveedores, setProveedores] = useState<Option[]>([]);

  // Dialog/form
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState<InventarioBackend | null>(null);

  const [form, setForm] = useState({
    idProducto: "",
    idUbicacion: "",
    idProveedor: "",
    cantidad: "",
    stock: "",
    estado: "Disponible",
    fechaIngreso: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const toast = useToast().toast;

  const fieldLabels: Record<string, string> = {
    idProducto: "Producto",
    idUbicacion: "Ubicación",
    idProveedor: "Proveedor",
    cantidad: "Cantidad",
    stock: "Stock",
    estado: "Estado",
    fechaIngreso: "Fecha de ingreso",
  };

  const columns = [
    { key: "productoNombre", label: "Producto" },
    { key: "ubicacionDescripcion", label: "Ubicación" },
    { key: "proveedorNombre", label: "Proveedor" },
    { key: "cantidad", label: "Cantidad" },
    { key: "stock", label: "Stock" },
    {
      key: "estado",
      label: "Estado",
      render: (v: string) => (
        <Badge className={`font-semibold ${v === "Disponible" ? "bg-green-100 text-green-700" : v === "Bajo Stock" ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700"}`}>
          {v}
        </Badge>
      ),
    },
    { key: "fechaIngreso", label: "Fecha Ingreso" },
  ];

  // fetchAll con parsing robusto para detectar JSON malformado y loguear selects
  const fetchAll = async () => {
    setLoading(true);
    try {
      // inventarios
      const invResp = await apiInv.getInventarios();
      // selects
      const [prods, ubis, provs] = await Promise.all([
        apiInv.getProductos().catch((err) => { console.error("getProductos error:", err); return []; }),
        apiInv.getUbicaciones().catch((err) => { console.error("getUbicaciones error:", err); return []; }),
        apiInv.getProveedores().catch((err) => { console.error("getProveedores error:", err); return []; }),
      ]);

      console.log("RAW inventarios:", invResp);
      console.log("RAW productos (select):", prods);
      console.log("RAW ubicaciones (select):", ubis);
      console.log("RAW proveedores (select):", provs);

      setData(Array.isArray(invResp) ? invResp : []);
      setProductos(
        (prods || []).map((p: any) => ({
          id: p.id ?? p.id_producto ?? null,
          label: p.nombre ?? p.nombre_producto ?? p.productoNombre ?? p.nombre ?? String(p.id ?? ""),
        }))
      );
      setUbicaciones(
        (ubis || []).map((u: any) => ({
          id: u.id ?? u.id_ubicacion ?? null,
          label: u.descripcion ?? u.descripcion_ubicacion ?? u.descripcion ?? String(u.id ?? ""),
        }))
      );
      setProveedores(
        (provs || []).map((r: any) => ({
          id: r.id ?? r.id_proveedor ?? null,
          label: r.nombre ?? r.nombre_proveedor ?? r.nombre ?? String(r.id ?? ""),
        }))
      );

      // debug: si proveedores viene vacío pero hay filas en BD, necesitamos el body crudo del response (mira Network o pega aquí)
      if ((provs || []).length === 0) {
        console.warn("No se recibieron proveedores. Revisa backend /api/proveedor y los logs del servidor.");
      }
    } catch (err: any) {
      console.error("Error en fetchAll Inventario:", err);
      toast({ title: "Error al cargar datos", description: err?.message || "No se pudieron cargar datos de inventario", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void fetchAll(); }, []);

  // Helper para actualizar campo y limpiar error de ese campo
  const updateField = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => {
      if (!prev[field]) return prev;
      const copy = { ...prev };
      delete copy[field];
      return copy;
    });
  };

  // Validate single field (used onBlur) and optionally show immediate toast for that field
  const getFieldErrorMessage = (field: string, value: string): string | null => {
    switch (field) {
      case "idProducto":
        if (!value) return "Selecciona un producto";
        return null;
      case "idUbicacion":
        if (!value) return "Selecciona una ubicación";
        return null;
      case "idProveedor":
        if (!value) return "Selecciona un proveedor";
        return null;
      case "cantidad":
        if (value === "" || Number.isNaN(Number(value)) || Number(value) < 0) return "Cantidad debe ser un número entero >= 0";
        return null;
      case "stock":
        if (value === "" || Number.isNaN(Number(value)) || Number(value) < 0) return "Stock debe ser un número entero >= 0";
        return null;
      case "fechaIngreso":
        if (!value) return "Fecha de ingreso obligatoria";
        {
          const fecha = new Date(value);
          const hoy = new Date();
          hoy.setHours(0,0,0,0);
          fecha.setHours(0,0,0,0);
          if (fecha > hoy) return "La fecha no puede ser mayor a hoy";
        }
        return null;
      default:
        return null;
    }
  };

  const validateForm = (): Record<string, string> => {
    const e: Record<string, string> = {};
    const fields = Object.keys(form) as (keyof typeof form)[];
    fields.forEach((f) => {
      const val = String((form as any)[f]);
      const err = getFieldErrorMessage(f, val);
      if (err) e[f] = err;
    });
    setErrors(e);
    return e;
  };

  const showValidationToasts = (errObj: Record<string, string>) => {
    const keys = Object.keys(errObj);
    if (keys.length === 0) return;
    // Mostrar toast principal con resumen
    toast({
      title: "Corrige los campos",
      description: `Revisa: ${keys.map(k => fieldLabels[k] ?? k).join(", ")}`,
      variant: "destructive",
    });

    // Mostrar toasts individuales (uno por campo)
    keys.forEach((k) => {
      toast({
        title: fieldLabels[k] ?? k,
        description: errObj[k],
        variant: "destructive",
      });
    });

    // Focar primer campo con error
    const first = keys[0];
    setTimeout(() => {
      const el = document.querySelector<HTMLElement>(`[data-field="${first}"]`);
      if (el) el.focus();
    }, 50);
  };

  // called onBlur for fields to validate single field and show immediate toast + set error
  const handleFieldBlur = (field: string) => {
    const val = String((form as any)[field]);
    const msg = getFieldErrorMessage(field, val);
    setErrors((prev) => {
      const copy = { ...prev };
      if (msg) copy[field] = msg;
      else delete copy[field];
      return copy;
    });
    if (msg) {
      toast({
        title: fieldLabels[field] ?? field,
        description: msg,
        variant: "destructive",
      });
    }
  };

  const handleAdd = () => {
    setCurrentItem(null);
    setForm({ idProducto: "", idUbicacion: "", idProveedor: "", cantidad: "", stock: "", estado: "Disponible", fechaIngreso: "" });
    setErrors({});
    setIsDialogOpen(true);
  };

  const handleEdit = (row: InventarioBackend) => {
    setCurrentItem(row);
    setForm({
      idProducto: row.idProducto ? String(row.idProducto) : "",
      idUbicacion: row.idUbicacion ? String(row.idUbicacion) : "",
      idProveedor: row.idProveedor ? String(row.idProveedor) : "",
      cantidad: String(row.cantidad ?? 0),
      stock: String(row.stock ?? 0),
      estado: row.estado ?? "Disponible",
      fechaIngreso: row.fechaIngreso ? String(row.fechaIngreso) : "",
    });
    setErrors({});
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    const validationErrors = validateForm();
    const keys = Object.keys(validationErrors);
    if (keys.length > 0) {
      showValidationToasts(validationErrors);
      return;
    }

    const payload = {
      idProducto: Number(form.idProducto),
      idUbicacion: Number(form.idUbicacion),
      idProveedor: Number(form.idProveedor),
      cantidad: Number(form.cantidad),
      stock: Number(form.stock),
      estado: form.estado,
      fechaIngreso: form.fechaIngreso,
    };
    try {
      if (currentItem) {
        const updated = await apiInv.updateInventario(currentItem.id, payload);
        setData((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
        toast({ title: "Registro actualizado", description: "El inventario se actualizó correctamente", variant: "default" });
      } else {
        const created = await apiInv.createInventario(payload);
        setData((prev) => [created, ...prev]);
        toast({ title: "Registro creado", description: "Inventario creado correctamente", variant: "default" });
      }
      setIsDialogOpen(false);
    } catch (err: any) {
      console.error("Error guardar inventario:", err);
      const msg = err?.message || "Error servidor";
      toast({ title: "Error al guardar", description: msg, variant: "destructive" });
    }
  };

  const handleDelete = async (id?: number) => {
    if (!id) return;
    const item = data.find(d => d.id === id);
    const confirmMsg = item?.createdWithProduct
      ? "¿Estás seguro? Este inventario fue creado junto al producto. Si continúas también se eliminará el producto asociado. Esto puede afectar la base de datos."
      : "¿Estás seguro de querer eliminar este inventario?";
    if (!window.confirm(confirmMsg)) return;

    try {
      await apiInv.deleteInventario(id);
      setData((prev) => prev.filter((r) => r.id !== id));
      toast({ title: "Eliminado", description: "Registro eliminado", variant: "default" });
    } catch (err) {
      console.error("Error eliminando inventario:", err);
      toast({ title: "Error", description: "No se pudo eliminar", variant: "destructive" });
    }
  };

  const formContent = (
    <div className="space-y-4">
      <div>
        <label className="block mb-1 font-medium">Producto</label>
        <select
          data-field="idProducto"
          name="idProducto"
          value={form.idProducto}
          onChange={(e) => updateField("idProducto", e.target.value)}
          onBlur={() => handleFieldBlur("idProducto")}
          className={`w-full p-2 border rounded ${errors.idProducto ? "border-destructive" : ""}`}
          aria-invalid={!!errors.idProducto}
        >
          <option value="">-- Selecciona --</option>
          {productos.map(p => <option key={String(p.id)} value={String(p.id)}>{p.label}</option>)}
        </select>
        {errors.idProducto && <p className="text-sm text-destructive mt-1">{errors.idProducto}</p>}
      </div>
      <div>
        <label className="block mb-1 font-medium">Ubicación</label>
        <select
          data-field="idUbicacion"
          name="idUbicacion"
          value={form.idUbicacion}
          onChange={(e) => updateField("idUbicacion", e.target.value)}
          onBlur={() => handleFieldBlur("idUbicacion")}
          className={`w-full p-2 border rounded ${errors.idUbicacion ? "border-destructive" : ""}`}
          aria-invalid={!!errors.idUbicacion}
        >
          <option value="">-- Selecciona --</option>
          {ubicaciones.map(u => <option key={String(u.id)} value={String(u.id)}>{u.label}</option>)}
        </select>
        {errors.idUbicacion && <p className="text-sm text-destructive mt-1">{errors.idUbicacion}</p>}
      </div>

      <div>
        <label className="block mb-1 font-medium">Proveedor</label>
        <select
          data-field="idProveedor"
          name="idProveedor"
          value={form.idProveedor}
          onChange={(e) => updateField("idProveedor", e.target.value)}
          onBlur={() => handleFieldBlur("idProveedor")}
          className={`w-full p-2 border rounded ${errors.idProveedor ? "border-destructive" : ""}`}
          aria-invalid={!!errors.idProveedor}
        >
          <option value="">-- Selecciona --</option>
          {proveedores.map(p => <option key={String(p.id)} value={String(p.id)}>{p.label}</option>)}
        </select>
        {errors.idProveedor && <p className="text-sm text-destructive mt-1">{errors.idProveedor}</p>}
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block mb-1 font-medium">Cantidad</label>
          <input
            data-field="cantidad"
            name="cantidad"
            type="number"
            value={form.cantidad}
            onChange={(e) => updateField("cantidad", e.target.value)}
            onBlur={() => handleFieldBlur("cantidad")}
            className={`w-full p-2 border rounded ${errors.cantidad ? "border-destructive" : ""}`}
            aria-invalid={!!errors.cantidad}
          />
          {errors.cantidad && <p className="text-sm text-destructive mt-1">{errors.cantidad}</p>}
        </div>
        <div>
          <label className="block mb-1 font-medium">Stock</label>
          <input
            data-field="stock"
            name="stock"
            type="number"
            value={form.stock}
            onChange={(e) => updateField("stock", e.target.value)}
            onBlur={() => handleFieldBlur("stock")}
            className={`w-full p-2 border rounded ${errors.stock ? "border-destructive" : ""}`}
            aria-invalid={!!errors.stock}
          />
          {errors.stock && <p className="text-sm text-destructive mt-1">{errors.stock}</p>}
        </div>
        <div>
          <label className="block mb-1 font-medium">Estado</label>
          <select
            data-field="estado"
            name="estado"
            value={form.estado}
            onChange={(e) => updateField("estado", e.target.value)}
            className={`w-full p-2 border rounded ${errors.estado ? "border-destructive" : ""}`}
            aria-invalid={!!errors.estado}
          >
            <option value="Disponible">Disponible</option>
            <option value="Bajo Stock">Bajo Stock</option>
            <option value="Agotado">Agotado</option>
          </select>
          {errors.estado && <p className="text-sm text-destructive mt-1">{errors.estado}</p>}
        </div>
      </div>

      <div>
        <label className="block mb-1 font-medium">Fecha de ingreso</label>
        <input
          data-field="fechaIngreso"
          name="fechaIngreso"
          type="date"
          value={form.fechaIngreso}
          onChange={(e) => updateField("fechaIngreso", e.target.value)}
          onBlur={() => handleFieldBlur("fechaIngreso")}
          className={`w-full p-2 border rounded ${errors.fechaIngreso ? "border-destructive" : ""}`}
          aria-invalid={!!errors.fechaIngreso}
        />
        {errors.fechaIngreso && <p className="text-sm text-destructive mt-1">{errors.fechaIngreso}</p>}
      </div>
    </div>
  );

  return (
    <CrudPage
      title="Inventario"
      description="Control de stock y ubicaciones"
      columns={columns}
      data={data}
      onDelete={handleDelete}
      onAdd={handleAdd}
      onEdit={handleEdit}
      onSave={handleSave}
      formContent={formContent}
      searchPlaceholder="Buscar por producto, ubicación o proveedor..."
      isDialogOpen={isDialogOpen}
      onDialogOpenChange={setIsDialogOpen}
      currentItem={currentItem}
    />
  );
}