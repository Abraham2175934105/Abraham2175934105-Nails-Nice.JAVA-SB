import React, { useEffect, useState } from "react";
import CrudPage from "@/components/crud/CrudPage";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import * as apiProductos from "@/lib/apiProductos";
import * as apiInv from "@/lib/apiInventario";

type ProductoBackend = {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number | string;
  estadoProducto?: string;
  imagen?: string | null;
  idColor?: number | null;
  colorNombre?: string | null;
  idMarca?: number | null;
  marcaNombre?: string | null;
  idUnidadMedida?: number | null;
  unidadMedidaNombre?: string | null;
  idCategoria?: number | null;
  categoriaNombre?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  color?: any;
  marca?: any;
  unidadMedida?: any;
  categoria?: any;
};

type EntityOption = { id: number | null; label: string };

type ProductoUI = {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  estado_producto: string;
  categoria: string;
  marca: string;
  color: string;
  unidad_medida: string;
  created_at: string;
  _raw?: ProductoBackend;
};

export default function ProductosAdmin() {
  const [productos, setProductos] = useState<ProductoUI[]>([]);
  const [loading, setLoading] = useState(false);

  // selects data
  const [categorias, setCategorias] = useState<EntityOption[]>([]);
  const [marcas, setMarcas] = useState<EntityOption[]>([]);
  const [colores, setColores] = useState<EntityOption[]>([]);
  const [unidades, setUnidades] = useState<EntityOption[]>([]);
  // para crear inventario opcional al crear producto
  const [ubicaciones, setUbicaciones] = useState<EntityOption[]>([]);
  const [proveedores, setProveedores] = useState<EntityOption[]>([]);
  // **NUEVO**: Estado para guardar el archivo de la imagen seleccionada
  const [imagenFile, setImagenFile] = useState<File | null>(null);
  const [imagenPreview, setImagenPreview] = useState<string | null>(null);

  // Mapa productId -> inventario (para pre-llenar form al editar)
  const [productInventoryMap, setProductInventoryMap] = useState<Record<number, any>>({});

  // Dialog / form
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState<ProductoUI | null>(null);

  // Form state (producto)
  const [form, setForm] = useState({
    nombre: "",
    descripcion: "",
    precio: "",
    estadoProducto: "activo",
    imagen: "",
    idColor: "",
    idMarca: "",
    idUnidadMedida: "",
    idCategoria: "",
    // inventario opcional
    createInventory: false,
    invCantidad: "",
    invStock: "",
    invIdUbicacion: "",
    invIdProveedor: "",
    invFechaIngreso: "",
    invEstado: "Disponible",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const toast = useToast?.().toast ?? ((opts: any) => alert(opts.title + (opts.description ? " - " + opts.description : "")));

  // Field labels (used in toasts)
  const fieldLabels: Record<string, string> = {
    nombre: "Nombre",
    descripcion: "Descripción",
    precio: "Precio",
    estadoProducto: "Estado",
    imagen: "Imagen",
    idCategoria: "Categoría",
    idMarca: "Marca",
    idColor: "Color",
    idUnidadMedida: "Unidad",
    createInventory: "Crear inventario",
    invCantidad: "Cantidad (inventario)",
    invStock: "Stock (inventario)",
    invIdUbicacion: "Ubicación (inventario)",
    invIdProveedor: "Proveedor (inventario)",
    invFechaIngreso: "Fecha de ingreso (inventario)",
  };

  // Helper functions
  const getLabelFromEntity = (e: any): string => {
    if (!e) return "";
    return (
      e.nombre_categoria ??
      e.nombreCategoria ??
      e.nombre_color ??
      e.nombreColor ??
      e.nombre_marca ??
      e.nombreMarca ??
      e.nombre_medida ??
      e.nombreMedida ??
      e.nombre ??
      e.label ??
      ""
    );
  };

  const getIdFromEntity = (e: any): number | null => {
    if (!e) return null;
    return (
      e.id_categoria ??
      e.idCategoria ??
      e.id_marca ??
      e.idMarca ??
      e.id_color ??
      e.idColor ??
      e.id_unidad_medida ??
      e.id_unidad ??
      e.id_unidad ??
      e.id ??
      null
    );
  };

  const resolveEntityLabelFromProduct = (
    p: ProductoBackend,
    directField: string,
    nestedKey: string,
    idField: string,
    lookupMap: Record<string, string | undefined>
  ) => {
    const idVal = (p as any)[idField];
    if (idVal != null && lookupMap && lookupMap[String(idVal)]) return lookupMap[String(idVal)] as string;

    const direct = (p as any)[directField];
    if (direct) return String(direct);

    const nested = (p as any)[nestedKey];
    if (nested) {
      if (typeof nested === "string" || typeof nested === "number") return String(nested);
      const label = getLabelFromEntity(nested);
      if (label) return label;
      return nested.nombre ?? nested.name ?? nested.nombre_categoria ?? nested.nombre_marca ?? "";
    }

    return (
      (p as any)[`${nestedKey}Nombre`] ??
      (p as any)[`${nestedKey}_nombre`] ??
      (p as any)[`${nestedKey}Name`] ??
      ""
    );
  };

  const columns = [
    { key: "nombre", label: "Nombre" },
    { key: "categoria", label: "Categoría" },
    { key: "marca", label: "Marca" },
    {
      key: "precio",
      label: "Precio",
      render: (value: number) => `$${Number(value).toLocaleString()}`,
    },
    {
      key: "estado_producto",
      label: "Estado",
      render: (value: string) => (
        <Badge
          className={`font-semibold transition-all duration-300 cursor-pointer ${
            value.toLowerCase() === "activo"
              ? "bg-green-500/10 text-green-600 border-green-200 hover:bg-green-500 hover:text-white hover:border-green-500"
              : "bg-red-500/10 text-red-600 border-red-200 hover:bg-red-500 hover:text-white hover:border-red-500"
          }`}
        >
          {value[0].toUpperCase() + value.slice(1)}
        </Badge>
      ),
    },
    { key: "created_at", label: "Fecha" },
  ];

  const mapBackendToUI = (
    p: ProductoBackend,
    maps: { catMap: Record<string, string | undefined>; marcaMap: Record<string, string | undefined>; colorMap: Record<string, string | undefined>; unidadMap: Record<string, string | undefined> }
  ): ProductoUI => {
    const precio = typeof p.precio === "string" ? parseFloat(p.precio) || 0 : Number(p.precio || 0);
    const estado = (p.estadoProducto || "activo").toLowerCase();
    const created = p.createdAt ? new Date(p.createdAt).toLocaleDateString() : (p.updatedAt ? new Date(p.updatedAt).toLocaleDateString() : "");

    const categoriaLabel = resolveEntityLabelFromProduct(p, "categoriaNombre", "categoria", "idCategoria", maps.catMap);
    const marcaLabel = resolveEntityLabelFromProduct(p, "marcaNombre", "marca", "idMarca", maps.marcaMap);
    const colorLabel = resolveEntityLabelFromProduct(p, "colorNombre", "color", "idColor", maps.colorMap);
    const unidadLabel = resolveEntityLabelFromProduct(p, "unidadMedidaNombre", "unidadMedida", "idUnidadMedida", maps.unidadMap);

    return {
      id: p.id,
      nombre: p.nombre,
      descripcion: p.descripcion,
      precio,
      estado_producto: estado === "activo" ? "activo" : "inactivo",
      categoria: categoriaLabel || "",
      marca: marcaLabel || "",
      color: colorLabel || "",
      unidad_medida: unidadLabel || "",
      created_at: created,
      _raw: p,
    };
  };

  // Construye maps desde los estados de selects
  const buildLookupMapsFromState = () => {
    const catMap: Record<string, string | undefined> = {};
    categorias.forEach((c) => { if (c.id != null) catMap[String(c.id)] = c.label ?? ""; });
    const marcaMap: Record<string, string | undefined> = {};
    marcas.forEach((m) => { if (m.id != null) marcaMap[String(m.id)] = m.label ?? ""; });
    const colorMap: Record<string, string | undefined> = {};
    colores.forEach((c) => { if (c.id != null) colorMap[String(c.id)] = c.label ?? ""; });
    const unidadMap: Record<string, string | undefined> = {};
    unidades.forEach((u) => { if (u.id != null) unidadMap[String(u.id)] = u.label ?? ""; });
    return { catMap, marcaMap, colorMap, unidadMap };
  };

  // Cargar productos y listas para selects (incluye ubicaciones/proveedores y tambien inventarios para prellenado)
  const fetchProductos = async () => {
    setLoading(true);
    try {
      const [data, cat, mar, col, uni, ubis, provs, invs] = await Promise.all([
        apiProductos.getProductos(),
        apiProductos.getCategorias(),
        apiProductos.getMarcas(),
        apiProductos.getColores(),
        apiProductos.getUnidades(),
        apiInv.getUbicaciones().catch(() => []),
        apiInv.getProveedores().catch(() => []),
        apiInv.getInventarios().catch(() => []), // <-- nueva llamada
      ]);

      const cats = cat.map((c: any) => ({ id: getIdFromEntity(c), label: getLabelFromEntity(c) }));
      const mars = mar.map((m: any) => ({ id: getIdFromEntity(m), label: getLabelFromEntity(m) }));
      const cols = col.map((c: any) => ({ id: getIdFromEntity(c), label: getLabelFromEntity(c) }));
      const unis = uni.map((u: any) => ({ id: getIdFromEntity(u), label: getLabelFromEntity(u) }));

      setCategorias(cats);
      setMarcas(mars);
      setColores(cols);
      setUnidades(unis);

      // ubicaciones/proveedores
      setUbicaciones((ubis || []).map((u: any) => ({ id: u.id ?? u.id_ubicacion ?? null, label: u.descripcion ?? u.descripcion ?? "" })));
      setProveedores((provs || []).map((p: any) => ({ id: p.id ?? p.id_proveedor ?? null, label: p.nombre ?? p.nombre ?? "" })));

      // --- procesar inventarios para crear el mapa productId -> inventario
      const invArray = Array.isArray(invs) ? invs : [];
      const invMap: Record<number, any> = {};
      invArray.forEach((iv: any) => {
        const pid = iv.idProducto ?? iv.productoId ?? iv.producto?.id ?? null;
        if (pid != null) {
          if (!invMap[Number(pid)]) invMap[Number(pid)] = iv;
        }
      });
      setProductInventoryMap(invMap);

      const maps = { catMap: {}, marcaMap: {}, colorMap: {}, unidadMap: {} };
      cats.forEach((c) => { if (c.id != null) maps.catMap[String(c.id)] = c.label; });
      mars.forEach((m) => { if (m.id != null) maps.marcaMap[String(m.id)] = m.label; });
      cols.forEach((c) => { if (c.id != null) maps.colorMap[String(c.id)] = c.label; });
      unis.forEach((u) => { if (u.id != null) maps.unidadMap[String(u.id)] = u.label; });

      const uiProducts = Array.isArray(data) ? data.map((p: ProductoBackend) => mapBackendToUI(p, maps)) : [];
      setProductos(uiProducts);
    } catch (err) {
      console.error("Error cargando productos/listas", err);
      toast({ title: "Error", description: "No se pudieron cargar datos", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchProductos();
  }, []);

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

  // Handlers to ensure numeric-only input
  const handlePrecioChange = (v: string) => {
    // allow digits and one dot
    let cleaned = v.replace(/[^0-9.]/g, "");
    const parts = cleaned.split(".");
    if (parts.length > 2) {
      cleaned = parts.shift() + "." + parts.join("");
    }
    updateField("precio", cleaned);
  };
  const handleIntegerFieldChange = (field: string, v: string) => {
    const cleaned = v.replace(/\D/g, "");
    updateField(field, cleaned);
  };

  const validateForm = () => {
    const e: Record<string, string> = {};
    // producto: todos obligatorios
    if (!form.nombre.trim()) e.nombre = "Nombre requerido";
    if (!form.descripcion.trim()) e.descripcion = "Descripción requerida";
    if (!form.precio || Number.isNaN(Number(form.precio)) || Number(form.precio) <= 0) e.precio = "Precio debe ser un número mayor a cero";
    if (!form.estadoProducto.trim()) e.estadoProducto = "Estado requerido";
    if (!form.imagen || !form.imagen.trim()) e.imagen = "Imagen obligatoria";
    if (!form.idCategoria) e.idCategoria = "Categoría obligatoria";
    if (!form.idMarca) e.idMarca = "Marca obligatoria";
    if (!form.idColor) e.idColor = "Color obligatorio";
    if (!form.idUnidadMedida) e.idUnidadMedida = "Unidad obligatoria";

    // inventario opcional: si marcado, campos obligatorios
    if (form.createInventory) {
      if (!form.invCantidad || Number.isNaN(Number(form.invCantidad)) || Number(form.invCantidad) < 0) e.invCantidad = "Cantidad debe ser un entero >= 0";
      if (!form.invStock || Number.isNaN(Number(form.invStock)) || Number(form.invStock) < 0) e.invStock = "Stock debe ser un entero >= 0";
      if (!form.invIdUbicacion) e.invIdUbicacion = "Ubicación obligatoria";
      if (!form.invIdProveedor) e.invIdProveedor = "Proveedor obligatorio";
      if (!form.invFechaIngreso) e.invFechaIngreso = "Fecha ingreso obligatoria";
      // Validar fecha no mayor a hoy
      if (form.invFechaIngreso) {
        const fecha = new Date(form.invFechaIngreso);
        const hoy = new Date();
        hoy.setHours(0,0,0,0);
        fecha.setHours(0,0,0,0);
        if (fecha > hoy) e.invFechaIngreso = "Fecha no puede ser mayor a hoy";
      }
    }

    setErrors(e);
    return e;
  };

  const showValidationToasts = (errObj: Record<string, string>) => {
    const keys = Object.keys(errObj);
    if (keys.length === 0) return;
    // Toast resumen
    toast({
      title: "Corrige los campos obligatorios",
      description: `Revisa: ${keys.map(k => fieldLabels[k] ?? k).join(", ")}`,
      variant: "destructive",
    });

    // Toasts individuales por campo
    keys.forEach((k) => {
      toast({
        title: `${fieldLabels[k] ?? k}`,
        description: errObj[k],
        variant: "destructive",
      });
    });

    // Focus primer campo con error
    const first = keys[0];
    setTimeout(() => {
      const el = document.querySelector<HTMLElement>(`[data-field="${first}"]`);
      if (el) el.focus();
    }, 50);
  };

  const handleDelete = async (id?: number) => {
    if (!id) return;
    try {
      await apiProductos.deleteProducto(id);
      setProductos((prev) => prev.filter((p) => p.id !== id));
      toast({ title: "Eliminado", description: "Producto eliminado correctamente." });
    } catch (err) {
      console.error("Error eliminando", err);
      toast({ title: "Error", description: "No se pudo eliminar el producto", variant: "destructive" });
    }
  };

  const handleAdd = () => {
    setCurrentItem(null);
    setForm({
      nombre: "",
      descripcion: "",
      precio: "",
      estadoProducto: "activo",
      imagen: "",
      idColor: "",
      idMarca: "",
      idUnidadMedida: "",
      idCategoria: "",
      createInventory: false,
      invCantidad: "",
      invStock: "",
      invIdUbicacion: "",
      invIdProveedor: "",
      invFechaIngreso: "",
      invEstado: "Disponible",
    });
    setErrors({});
    setImagenFile(null);
    setImagenPreview(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (row: ProductoUI) => {
    setCurrentItem(row);
    const raw = row._raw;
    setForm({
      nombre: raw?.nombre ?? row.nombre ?? "",
      descripcion: raw?.descripcion ?? row.descripcion ?? "",
      precio: String(raw?.precio ?? row.precio ?? 0),
      estadoProducto: raw?.estadoProducto ?? row.estado_producto ?? "activo",
      imagen: raw?.imagen ?? "",
      idColor: raw?.idColor ? String(raw.idColor) : (raw?.color ? String(getIdFromEntity(raw.color)) : ""),
      idMarca: raw?.idMarca ? String(raw.idMarca) : (raw?.marca ? String(getIdFromEntity(raw.marca)) : ""),
      idUnidadMedida: raw?.idUnidadMedida ? String(raw.idUnidadMedida) : (raw?.unidadMedida ? String(getIdFromEntity(raw.unidadMedida)) : ""),
      idCategoria: raw?.idCategoria ? String(raw.idCategoria) : (raw?.categoria ? String(getIdFromEntity(raw.categoria)) : ""),
      createInventory: false,
      invCantidad: "",
      invStock: "",
      invIdUbicacion: "",
      invIdProveedor: "",
      invFechaIngreso: "",
      invEstado: "Disponible",
    });

    // --- rellenar con inventario existente si hay ---
    const existingInv = productInventoryMap[row.id];
    if (existingInv) {
      setForm((prev) => ({
        ...prev,
        createInventory: true,
        invCantidad: existingInv.cantidad != null ? String(existingInv.cantidad) : "",
        invStock: existingInv.stock != null ? String(existingInv.stock) : "",
        invIdUbicacion: existingInv.idUbicacion != null ? String(existingInv.idUbicacion) : (existingInv.ubicacion?.id ? String(existingInv.ubicacion.id) : ""),
        invIdProveedor: existingInv.idProveedor != null ? String(existingInv.idProveedor) : (existingInv.proveedor?.id ? String(existingInv.proveedor.id) : ""),
        invFechaIngreso: existingInv.fechaIngreso ? String(existingInv.fechaIngreso) : "",
        invEstado: existingInv.estado ?? "Disponible",
      }));
    }

    setErrors({});
    setIsDialogOpen(true);
  };

  const handleFileChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
    const file = ev.target.files?.[0];
    if (!file) return;
    // **MODIFICADO**: Ya no subimos la imagen inmediatamente.
    // Solo la guardamos en el estado para enviarla junto con el formulario.
    setImagenFile(file);
    // Creamos una URL local para la vista previa.
    const previewUrl = URL.createObjectURL(file);
    setImagenPreview(previewUrl);
    // Actualizamos el campo 'imagen' en el formulario para la vista previa.
    // El backend usará el archivo, no esta URL.
    setForm((f) => ({ ...f, imagen: previewUrl }));
  };

  const handleSave = async () => {
    const validationErrors = validateForm();
    const keys = Object.keys(validationErrors);
    if (keys.length > 0) {
      showValidationToasts(validationErrors);
      return;
    }

    const productoJson = {
      nombre: form.nombre,
      descripcion: form.descripcion,
      precio: Number(form.precio),
      estadoProducto: form.estadoProducto.toLowerCase(),
      imagen: form.imagen || null,
      idColor: form.idColor ? Number(form.idColor) : null,
      idMarca: form.idMarca ? Number(form.idMarca) : null,
      idUnidadMedida: form.idUnidadMedida ? Number(form.idUnidadMedida) : null,
      idCategoria: form.idCategoria ? Number(form.idCategoria) : null,
    };

    // **NUEVO**: Construimos un FormData para enviar todo junto.
    const formData = new FormData();
    formData.append("producto", JSON.stringify(productoJson));
    if (imagenFile) {
      formData.append("imagenFile", imagenFile);
    }

    try {
      if (currentItem) {
        // **MODIFICADO**: Enviamos FormData en lugar de JSON
        const updated = await apiProductos.updateProducto(currentItem.id, formData);
        const maps = buildLookupMapsFromState();
        setProductos((prev) => prev.map((p) => (p.id === updated.id ? mapBackendToUI(updated, maps) : p)));
        toast({ title: "Actualizado", description: "Producto actualizado correctamente." });
      } else {
        // **MODIFICADO**: Enviamos FormData en lugar de JSON
        const created = await apiProductos.createProducto(formData);
        const maps = buildLookupMapsFromState();
        setProductos((prev) => [mapBackendToUI(created, maps), ...prev]);
        toast({ title: "Creado", description: "Producto creado correctamente." });

        // si el usuario marcó "Crear inventario", hacemos la llamada a inventario
        if (form.createInventory) {
          try {
            // validación de fecha en frontend: no permitir > hoy
            if (form.invFechaIngreso) {
              const fecha = new Date(form.invFechaIngreso);
              const hoy = new Date();
              hoy.setHours(0,0,0,0);
              fecha.setHours(0,0,0,0);
              if (fecha > hoy) {
                throw new Error("Fecha de ingreso no puede ser mayor a hoy");
              }
            }

            const invPayload = {
              idProducto: created.id,
              idUbicacion: Number(form.invIdUbicacion),
              idProveedor: Number(form.invIdProveedor),
              cantidad: Number(form.invCantidad),
              stock: Number(form.invStock),
              estado: form.invEstado,
              fechaIngreso: form.invFechaIngreso,
              createdWithProduct: true, // indicamos que fue creado junto al producto
            };
            await apiInv.createInventario(invPayload);
            toast({ title: "Inventario", description: "Registro de inventario creado." });
          } catch (err) {
            console.error("Error creando inventario tras crear producto", err);
            toast({ title: "Advertencia", description: "Producto creado pero no se pudo crear inventario.", variant: "destructive" });
          }
        }
      }
      setIsDialogOpen(false);
    } catch (err: any) {
      console.error("Error guardando producto", err);
      const msg = err?.message || "Error en servidor";
      toast({ title: "Error", description: msg, variant: "destructive" });
    }
  };

  // Form JSX
  const formContent = (
    <div className="space-y-4">
      <div>
        <label className="block mb-1 font-medium">Nombre</label>
        <input
          data-field="nombre"
          type="text"
          value={form.nombre}
          onChange={(e) => updateField("nombre", e.target.value)}
          className={`w-full p-2 border rounded ${errors.nombre ? "border-destructive" : ""}`}
          aria-invalid={!!errors.nombre}
        />
        {errors.nombre && <p className="text-sm text-destructive mt-1">{errors.nombre}</p>}
      </div>

      <div>
        <label className="block mb-1 font-medium">Descripción</label>
        <textarea
          data-field="descripcion"
          value={form.descripcion}
          onChange={(e) => updateField("descripcion", e.target.value)}
          className={`w-full p-2 border rounded ${errors.descripcion ? "border-destructive" : ""}`}
          rows={4}
          aria-invalid={!!errors.descripcion}
        />
        {errors.descripcion && <p className="text-sm text-destructive mt-1">{errors.descripcion}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block mb-1 font-medium">Precio</label>
          <input
            data-field="precio"
            type="text"
            value={form.precio}
            onChange={(e) => handlePrecioChange(e.target.value)}
            className={`w-full p-2 border rounded ${errors.precio ? "border-destructive" : ""}`}
            aria-invalid={!!errors.precio}
          />
          {errors.precio && <p className="text-sm text-destructive mt-1">{errors.precio}</p>}
        </div>

        <div>
          <label className="block mb-1 font-medium">Estado</label>
          <select
            data-field="estadoProducto"
            value={form.estadoProducto}
            onChange={(e) => updateField("estadoProducto", e.target.value)}
            className={`w-full p-2 border rounded ${errors.estadoProducto ? "border-destructive" : ""}`}
            aria-invalid={!!errors.estadoProducto}
          >
            <option value="activo">Activo</option>
            <option value="inactivo">Inactivo</option>
          </select>
          {errors.estadoProducto && <p className="text-sm text-destructive mt-1">{errors.estadoProducto}</p>}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block mb-1 font-medium">Imagen (subir)</label>
          <input data-field="imagen" type="file" accept="image/*" onChange={handleFileChange} className="w-full" />
          {form.imagen && (
            <div className="mt-2">
              <img src={imagenPreview || form.imagen} alt="preview" style={{ maxWidth: 160, maxHeight: 100, objectFit: "cover" }} />
            </div>
          )}
          {errors.imagen && <p className="text-sm text-destructive mt-1">{errors.imagen}</p>}
        </div>

        <div>
          <label className="block mb-1 font-medium">Categoría</label>
          <select
            data-field="idCategoria"
            value={form.idCategoria}
            onChange={(e) => updateField("idCategoria", e.target.value)}
            className={`w-full p-2 border rounded ${errors.idCategoria ? "border-destructive" : ""}`}
            aria-invalid={!!errors.idCategoria}
          >
            <option value="">-- Selecciona --</option>
            {categorias.map((c) => <option key={String(c.id)} value={String(c.id)}>{c.label}</option>)}
          </select>
          {errors.idCategoria && <p className="text-sm text-destructive mt-1">{errors.idCategoria}</p>}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block mb-1 font-medium">Marca</label>
          <select
            data-field="idMarca"
            value={form.idMarca}
            onChange={(e) => updateField("idMarca", e.target.value)}
            className={`w-full p-2 border rounded ${errors.idMarca ? "border-destructive" : ""}`}
            aria-invalid={!!errors.idMarca}
          >
            <option value="">-- Selecciona --</option>
            {marcas.map((m) => <option key={String(m.id)} value={String(m.id)}>{m.label}</option>)}
          </select>
          {errors.idMarca && <p className="text-sm text-destructive mt-1">{errors.idMarca}</p>}
        </div>
        <div>
          <label className="block mb-1 font-medium">Color</label>
          <select
            data-field="idColor"
            value={form.idColor}
            onChange={(e) => updateField("idColor", e.target.value)}
            className={`w-full p-2 border rounded ${errors.idColor ? "border-destructive" : ""}`}
            aria-invalid={!!errors.idColor}
          >
            <option value="">-- Selecciona --</option>
            {colores.map((c) => <option key={String(c.id)} value={String(c.id)}>{c.label}</option>)}
          </select>
          {errors.idColor && <p className="text-sm text-destructive mt-1">{errors.idColor}</p>}
        </div>
        <div>
          <label className="block mb-1 font-medium">Unidad</label>
          <select
            data-field="idUnidadMedida"
            value={form.idUnidadMedida}
            onChange={(e) => updateField("idUnidadMedida", e.target.value)}
            className={`w-full p-2 border rounded ${errors.idUnidadMedida ? "border-destructive" : ""}`}
            aria-invalid={!!errors.idUnidadMedida}
          >
            <option value="">-- Selecciona --</option>
            {unidades.map((u) => <option key={String(u.id)} value={String(u.id)}>{u.label}</option>)}
          </select>
          {errors.idUnidadMedida && <p className="text-sm text-destructive mt-1">{errors.idUnidadMedida}</p>}
        </div>
      </div>

      {/* Sección opcional: crear inventario al crear producto */}
      <div className="pt-4 border-t">
        <label className="inline-flex items-center gap-2">
          <input
            data-field="createInventory"
            type="checkbox"
            checked={form.createInventory}
            onChange={(e) => updateField("createInventory", String(e.target.checked))}
          />
          <span className="font-medium">Crear registro de inventario para este producto</span>
        </label>

        {form.createInventory && (
          <div className="mt-4 space-y-3">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block mb-1 font-medium">Cantidad</label>
                <input
                  data-field="invCantidad"
                  type="text"
                  value={form.invCantidad}
                  onChange={(e) => handleIntegerFieldChange("invCantidad", e.target.value)}
                  className={`w-full p-2 border rounded ${errors.invCantidad ? "border-destructive" : ""}`}
                  aria-invalid={!!errors.invCantidad}
                />
                {errors.invCantidad && <p className="text-sm text-destructive mt-1">{errors.invCantidad}</p>}
              </div>
              <div>
                <label className="block mb-1 font-medium">Stock</label>
                <input
                  data-field="invStock"
                  type="text"
                  value={form.invStock}
                  onChange={(e) => handleIntegerFieldChange("invStock", e.target.value)}
                  className={`w-full p-2 border rounded ${errors.invStock ? "border-destructive" : ""}`}
                  aria-invalid={!!errors.invStock}
                />
                {errors.invStock && <p className="text-sm text-destructive mt-1">{errors.invStock}</p>}
              </div>
              <div>
                <label className="block mb-1 font-medium">Estado inventario</label>
                <select
                  data-field="invEstado"
                  value={form.invEstado}
                  onChange={(e) => updateField("invEstado", e.target.value)}
                  className="w-full p-2 border rounded"
                >
                  <option value="Disponible">Disponible</option>
                  <option value="Bajo Stock">Bajo Stock</option>
                  <option value="Agotado">Agotado</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 font-medium">Ubicación</label>
                <select
                  data-field="invIdUbicacion"
                  value={form.invIdUbicacion}
                  onChange={(e) => updateField("invIdUbicacion", e.target.value)}
                  className={`w-full p-2 border rounded ${errors.invIdUbicacion ? "border-destructive" : ""}`}
                  aria-invalid={!!errors.invIdUbicacion}
                >
                  <option value="">-- Selecciona --</option>
                  {ubicaciones.map((u) => <option key={String(u.id)} value={String(u.id)}>{u.label}</option>)}
                </select>
                {errors.invIdUbicacion && <p className="text-sm text-destructive mt-1">{errors.invIdUbicacion}</p>}
              </div>
              <div>
                <label className="block mb-1 font-medium">Proveedor</label>
                <select
                  data-field="invIdProveedor"
                  value={form.invIdProveedor}
                  onChange={(e) => updateField("invIdProveedor", e.target.value)}
                  className={`w-full p-2 border rounded ${errors.invIdProveedor ? "border-destructive" : ""}`}
                  aria-invalid={!!errors.invIdProveedor}
                >
                  <option value="">-- Selecciona --</option>
                  {proveedores.map((p) => <option key={String(p.id)} value={String(p.id)}>{p.label}</option>)}
                </select>
                {errors.invIdProveedor && <p className="text-sm text-destructive mt-1">{errors.invIdProveedor}</p>}
              </div>
            </div>

            <div>
              <label className="block mb-1 font-medium">Fecha de ingreso</label>
              <input
                data-field="invFechaIngreso"
                type="date"
                value={form.invFechaIngreso}
                onChange={(e) => updateField("invFechaIngreso", e.target.value)}
                className={`w-full p-2 border rounded ${errors.invFechaIngreso ? "border-destructive" : ""}`}
                aria-invalid={!!errors.invFechaIngreso}
              />
              {errors.invFechaIngreso && <p className="text-sm text-destructive mt-1">{errors.invFechaIngreso}</p>}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <CrudPage
      title="Productos"
      description="Gestiona el catálogo de productos"
      columns={columns}
      data={productos}
      onDelete={handleDelete}
      onAdd={handleAdd}
      onEdit={handleEdit}
      onSave={handleSave}
      formContent={formContent}
      searchPlaceholder="Buscar por nombre, categoría o marca..."
      isDialogOpen={isDialogOpen}
      onDialogOpenChange={setIsDialogOpen}
      currentItem={currentItem}
    />
  );
}
