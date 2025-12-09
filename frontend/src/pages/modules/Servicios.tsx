import { useEffect, useState } from "react";
import CrudPage from "@/components/crud/CrudPage";
import {
  getServicios,
  createServicio,
  updateServicio,
  deleteServicio,
} from "@/lib/apiServicios";

import { getTipoServicios } from "@/lib/apiTipoServicio";
import { getCategorias } from "@/lib/apiCategoria";
import { useToast } from "@/hooks/use-toast";

export default function ServiciosPage() {
  const [servicios, setServicios] = useState<any[]>([]);
  const [currentItem, setCurrentItem] = useState<any>(null);
  const [tipos, setTipos] = useState<any[]>([]);
  const [categorias, setCategorias] = useState<any[]>([]);
  const toast = useToast().toast;

  // Traer servicios
  const fetchData = async () => {
    try {
      const data = await getServicios();

      const normalized = data.map((s: any) => ({
        id: s.id ?? s.id_servicio ?? null,
        nombre_servicio: s.nombreServicio ?? s.nombre_servicio ?? s.nombre ?? "",
        descripcion_servicio: s.descripcionServicio ?? s.descripcion_servicio ?? s.descripcion ?? "",
        precio_servicio: s.precioServicio ?? s.precio_servicio ?? s.precio ?? 0,
        duracion_servicio: s.duracionServicio ?? s.duracion_servicio ?? s.duracion_estimada ?? "",
        estado_servicio: s.estadoServicio ?? s.estado_servicio ?? "Activo",
        // intentamos leer la id del tipo desde varias propiedades posibles
        id_tipo_servicio:
          s.tipoServicio?.id ??
          s.tipoServicio?.id_tipo_servicio ??
          s.tipoServicio?.idTipoServicio ??
          "",
        categoria_servicio: s.categoriaServicio ?? s.categoria_servicio ?? "",
      }));

      setServicios(normalized);
    } catch (error) {
      console.error("Error cargando servicios:", error);
      toast({ title: "Error", description: "No se pudieron cargar los servicios.", variant: "destructive", duration: 3000 } as any);
    }
  };

  // Traer tipos y categorias
  const fetchTiposCategorias = async () => {
    try {
      const tiposData = await getTipoServicios();
      const categoriasData = await getCategorias();
      setTipos(tiposData);
      setCategorias(categoriasData);
    } catch (error) {
      console.error("Error cargando tipos/categorias:", error);
      toast({ title: "Error", description: "No se pudieron cargar tipos o categorías.", variant: "destructive", duration: 3000 } as any);
    }
  };

  useEffect(() => {
    fetchData();
    fetchTiposCategorias();
  }, []);

  // Cuando currentItem cambia, normalizamos id_tipo_servicio a string para garantizar match con option values
  useEffect(() => {
    if (!currentItem) return;
    const val = currentItem.id_tipo_servicio;
    if (val !== undefined && val !== null && typeof val !== "string") {
      setCurrentItem((prev: any) => ({ ...prev, id_tipo_servicio: String(val) }));
    }
  }, [currentItem]);

  const handleAdd = () =>
    setCurrentItem({
      id: undefined, // importante para que se cree nuevo
      id_tipo_servicio: "",
      categoria_servicio: "",
      nombre_servicio: "",
      descripcion_servicio: "",
      precio_servicio: "",
      duracion_servicio: "",
      estado_servicio: "Activo",
    });

  const handleEdit = (id: number) => {
    const item = servicios.find((s) => s.id === id);
    if (!item) return;
    // aseguramos que id_tipo_servicio sea string para que el select lo seleccione correctamente
    setCurrentItem({
      ...item,
      id_tipo_servicio: item.id_tipo_servicio !== undefined && item.id_tipo_servicio !== null ? String(item.id_tipo_servicio) : "",
      categoria_servicio: item.categoria_servicio ?? "",
    });
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteServicio(id);
      toast({ title: "Eliminado", description: "Servicio eliminado correctamente.", duration: 3000 });
      fetchData();
    } catch (error) {
      console.error("Error eliminando servicio:", error);
      toast({ title: "Error", description: "No se pudo eliminar el servicio.", variant: "destructive", duration: 3000 } as any);
    }
  };

  // handleSave usa el estado controlado currentItem
  const handleSave = async () => {
    if (!currentItem) return;

    // Validación de campos obligatorios
    if (!currentItem.id_tipo_servicio) {
      toast({ title: "Atención", description: "Selecciona un tipo de servicio.", duration: 3000 } as any);
      return;
    }

    if (!currentItem.categoria_servicio) {
      toast({ title: "Atención", description: "Selecciona una categoría.", duration: 3000 } as any);
      return;
    }

    // Construimos el objeto listo para enviar al backend
    const servicioData = {
      id: currentItem.id,
      nombreServicio: currentItem.nombre_servicio,
      descripcionServicio: currentItem.descripcion_servicio,
      precioServicio: Number(currentItem.precio_servicio || 0),
      duracionServicio: currentItem.duracion_servicio,
      estadoServicio: currentItem.estado_servicio,
      tipoServicio: { id: Number(currentItem.id_tipo_servicio) },
      categoriaServicio: currentItem.categoria_servicio,
    };

    try {
      if (currentItem.id) {
        await updateServicio(currentItem.id, servicioData);
        toast({ title: "Actualizado", description: "Servicio actualizado correctamente.", duration: 3000 });
      } else {
        await createServicio(servicioData);
        toast({ title: "Agregado", description: "Servicio creado correctamente.", duration: 3000 });
      }
      setCurrentItem(null);
      fetchData();
    } catch (error) {
      console.error("Error guardando servicio:", error);
      toast({ title: "Error", description: "No se pudo guardar el servicio.", variant: "destructive", duration: 3000 } as any);
    }
  };

  // Opciones de duración
  const durationOptions = [];
  for (let min = 30; min <= 120; min += 15) {
    const h = Math.floor(min / 60);
    const m = min % 60;
    durationOptions.push(
      <option key={`dur-${min}`} value={`${h > 0 ? h + "h " : ""}${m}m`}>
        {h > 0 ? `${h}h ${m}m` : `${m}m`}
      </option>
    );
  }

  const form = (
    <form id="form-servicios" className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
      {/* Tipo de Servicio */}
      <label className="space-y-1">
        <div className="text-sm font-medium text-gray-700">Tipo de servicio</div>
        <select
          name="id_tipo_servicio"
          value={String(currentItem?.id_tipo_servicio ?? "")}
          onChange={(e) =>
            setCurrentItem({
              ...currentItem,
              id_tipo_servicio: e.target.value === "" ? "" : String(e.target.value),
            })
          }
          className="w-full border border-gray-300 bg-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        >
          <option value="">Selecciona un tipo</option>
          {tipos.map((t) => {
            const optVal = String(t?.id ?? t?.id_tipo_servicio ?? t?.idTipoServicio ?? "");
            const label = t?.nombreTipo ?? t?.nombre_tipo ?? String(t);
            return (
              <option key={`tipo-${optVal}`} value={optVal}>
                {label}
              </option>
            );
          })}
        </select>
      </label>

      {/* Categoría */}
      <label className="space-y-1">
        <div className="text-sm font-medium text-gray-700">Categoría</div>
        <select
          name="categoria_servicio"
          value={currentItem?.categoria_servicio ?? ""}
          onChange={(e) =>
            setCurrentItem({ ...currentItem, categoria_servicio: e.target.value })
          }
          className="w-full border border-gray-300 bg-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        >
          <option value="">Selecciona una categoría</option>
          {categorias.map((c) => {
            const optVal = c?.nombreCategoria ?? c?.nombre_categoria ?? String(c);
            return (
              <option key={`cat-${optVal}`} value={optVal}>
                {optVal}
              </option>
            );
          })}
        </select>
      </label>

      {/* Nombre */}
      <label className="space-y-1">
        <div className="text-sm font-medium text-gray-700">Nombre</div>
        <input
          name="nombre_servicio"
          type="text"
          value={currentItem?.nombre_servicio ?? ""}
          onChange={(e) =>
            setCurrentItem({ ...currentItem, nombre_servicio: e.target.value })
          }
          placeholder="Nombre del servicio"
          className="w-full border border-gray-300 bg-white rounded-md px-3 py-2 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
      </label>

      {/* Descripción */}
      <label className="space-y-1">
        <div className="text-sm font-medium text-gray-700">Descripción</div>
        <textarea
          name="descripcion_servicio"
          value={currentItem?.descripcion_servicio ?? ""}
          onChange={(e) =>
            setCurrentItem({ ...currentItem, descripcion_servicio: e.target.value })
          }
          placeholder="Descripción corta"
          className="w-full border border-gray-300 bg-white rounded-md px-3 py-2 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
      </label>

      {/* Precio */}
      <label className="space-y-1">
        <div className="text-sm font-medium text-gray-700">Precio</div>
        <input
          name="precio_servicio"
          type="number"
          value={currentItem?.precio_servicio ?? ""}
          onChange={(e) =>
            setCurrentItem({ ...currentItem, precio_servicio: e.target.value })
          }
          placeholder="0.00"
          className="w-full border border-gray-300 bg-white rounded-md px-3 py-2 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
      </label>

      {/* Duración */}
      <label className="space-y-1">
        <div className="text-sm font-medium text-gray-700">Duración</div>
        <select
          name="duracion_servicio"
          value={currentItem?.duracion_servicio ?? ""}
          onChange={(e) =>
            setCurrentItem({ ...currentItem, duracion_servicio: e.target.value })
          }
          className="w-full border border-gray-300 bg-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        >
          <option value="">Selecciona duración</option>
          {durationOptions}
        </select>
      </label>

      {/* Estado */}
      <label className="space-y-1">
        <div className="text-sm font-medium text-gray-700">Estado</div>
        <select
          name="estado_servicio"
          value={currentItem?.estado_servicio ?? "Activo"}
          onChange={(e) =>
            setCurrentItem({ ...currentItem, estado_servicio: e.target.value })
          }
          className="w-full border border-gray-300 bg-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        >
          <option value="Activo">Activo</option>
          <option value="Inactivo">Inactivo</option>
        </select>
      </label>
    </form>
  );

  return (
    <CrudPage
      title="Servicios"
      description="Gestión de servicios del sistema"
      data={servicios}
      columns={[
        { key: "nombre_servicio", label: "Nombre" },
        { key: "categoria_servicio", label: "Categoría" },
        { key: "precio_servicio", label: "Precio" },
        { key: "duracion_servicio", label: "Duración" },
        { key: "estado_servicio", label: "Estado" },
      ]}
      onAdd={handleAdd}
      onEdit={handleEdit}
      onDelete={handleDelete}
      onSave={handleSave}
      formContent={form}
    />
  );
}