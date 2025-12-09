import { useEffect, useState } from "react";
import CrudPage from "@/components/crud/CrudPage";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button"; // Agrega esta importación para los botones personalizados
import { Edit, Trash2, RotateCcw } from "lucide-react"; // Agrega RotateCcw para el icono de reactivar
import {
  getUsuarios,
  createUsuario,
  updateUsuario,
  deleteUsuario,
  getRoles,
} from "@/lib/apiUsuarios";

export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [roles, setRoles] = useState<any[]>([]);
  const [currentItem, setCurrentItem] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false); // Nuevo estado para controlar el diálogo
  const [errors, setErrors] = useState<{ [key: string]: string }>({}); // Estado para errores por campo
  const toast = useToast().toast;

  // Funciones de validación
  const validateNombre = (value: string, field: string) => {
    if (!value.trim()) return field === 'nombre1' || field === 'apellido1' ? `${field === 'nombre1' ? 'Nombre' : 'Apellido'} es obligatorio.` : '';
    const regex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ]+$/;
    if (!regex.test(value)) return 'Solo se permiten letras y tildes, sin espacios, números ni caracteres especiales.';
    return '';
  };

  const validateEmail = (value: string) => {
    if (!value.trim()) return 'Email es obligatorio.';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) return 'Formato de email inválido.';
    const localPart = value.split('@')[0];
    if (localPart.length < 6) return 'La parte antes del @ debe tener al menos 6 caracteres.';
    if (/^\d+$/.test(localPart)) return 'La parte antes del @ no puede ser solo números; debe incluir letras.';
    return '';
  };

  const validateTelefono = (value: string) => {
    if (!value.trim()) return 'Teléfono es obligatorio.';
    const regex = /^\d{10,16}$/;
    if (!regex.test(value)) return 'Solo números, mínimo 10 y máximo 16 dígitos.';
    return '';
  };

  const validateRol = (value: string) => {
    if (!value.trim()) return 'Rol es obligatorio.';
    return '';
  };

  const validateEstado = (value: string) => {
    if (!value.trim()) return 'Estado es obligatorio.';
    return '';
  };

  // Función para manejar cambios en inputs con validación en tiempo real
  const handleInputChange = (field: string, value: string) => {
    setCurrentItem({ ...currentItem, [field]: value });
    let error = '';
    if (field === 'nombre1' || field === 'nombre2' || field === 'apellido1' || field === 'apellido2') {
      error = validateNombre(value, field);
    } else if (field === 'correo') {
      error = validateEmail(value);
    } else if (field === 'telefono') {
      error = validateTelefono(value);
    } else if (field === 'rol_id') {
      error = validateRol(value);
    } else if (field === 'estado_usuario') {
      error = validateEstado(value);
    }
    setErrors({ ...errors, [field]: error });
  };

  const fetchData = async () => {
    try {
      const data = await getUsuarios();
      // Normalizamos la respuesta para el frontend
      const normalized = (data || []).map((u: any) => ({
        id: u.id ?? u.id_usuario ?? null,
        nombre1: u.nombre1 ?? "",
        nombre2: u.nombre2 ?? "",
        apellido1: u.apellido1 ?? "",
        apellido2: u.apellido2 ?? "",
        correo: u.correo ?? "",
        telefono: u.telefono ?? "",
        rol_id: u.rol?.id ?? (u.rol ? u.rol : ""),
        rol_label: u.rol?.descripcion ?? (u.rol?.nombre ?? ""),
        estado_usuario: u.estadoUsuario ?? u.estado_usuario ?? "Activo",
        created_at: u.createdAt ?? u.created_at ?? "",
      }));
      setUsuarios(normalized);
    } catch (error) {
      console.error(error);
      toast({ title: "Error", description: "No se pudieron cargar los usuarios.", duration: 3000, variant: "destructive" } as any);
    }
  };

  const fetchRoles = async () => {
    try {
      const r = await getRoles();
      setRoles(r || []);
    } catch (error) {
      console.error(error);
      toast({ title: "Error", description: "No se pudieron cargar los roles.", duration: 3000, variant: "destructive" } as any);
    }
  };

  useEffect(() => {
    fetchData();
    fetchRoles();
  }, []);

  useEffect(() => {
    if (!currentItem) return;
    // Aseguramos que rol_id sea string para el select
    const v = currentItem.rol_id;
    if (v !== "" && v !== null && typeof v !== "string") {
      setCurrentItem((prev: any) => ({ ...prev, rol_id: String(v) }));
    }
  }, [currentItem]);

  const handleAdd = () => {
    setCurrentItem({
      id: null, // Corregido
      nombre1: "",
      nombre2: "",
      apellido1: "",
      apellido2: "",
      correo: "",
      telefono: "",
      rol_id: "",
      estado_usuario: "Activo",
    });
    setErrors({}); // Limpiar errores al abrir
    setIsDialogOpen(true); // Agregado para abrir el diálogo
  };

  const handleEdit = (id: number) => {
    const it = usuarios.find((u) => u.id === id);
    if (!it) return;
    setCurrentItem({
      ...it,
      rol_id: it.rol_id !== undefined && it.rol_id !== null ? String(it.rol_id) : "", // Corregido: agregado "undefined"
    });
    setErrors({}); // Limpiar errores al abrir
    setIsDialogOpen(true); // Agregado para abrir el diálogo
  };

  // Cambiado: En lugar de eliminar, cambia el estado a "Inactivo"
  const handleDelete = async (id: number) => {
    try {
      const usuario = usuarios.find((u) => u.id === id);
      if (!usuario) return;
      // Payload mínimo para cambiar solo el estado, incluyendo contrasena para evitar el error
      const payload = {
        ...usuario,
        estadoUsuario: "Inactivo",
        rol: { id: usuario.rol_id },
        contrasena: "defaultpassword", // Agregado para evitar null en backend
      };
      await updateUsuario(id, payload);
      toast({ title: "Inactivado", description: "Usuario inactivado correctamente.", duration: 3000 });
      fetchData();
    } catch (error) {
      console.error(error);
      toast({ title: "Error", description: "No se pudo inactivar el usuario.", duration: 3000, variant: "destructive" } as any);
    }
  };

  // Nueva función: Reactivar usuario (cambiar estado a "Activo")
  const handleReactivar = async (id: number) => {
    try {
      const usuario = usuarios.find((u) => u.id === id);
      if (!usuario) return;
      const payload = {
        ...usuario,
        estadoUsuario: "Activo",
        rol: { id: usuario.rol_id },
        contrasena: "defaultpassword", // Agregado para evitar null en backend
      };
      await updateUsuario(id, payload);
      toast({ title: "Reactivado", description: "Usuario reactivado correctamente.", duration: 3000 });
      fetchData();
    } catch (error) {
      console.error(error);
      toast({ title: "Error", description: "No se pudo reactivar el usuario.", duration: 3000, variant: "destructive" } as any);
    }
  };

  const handleSave = async () => {
    if (!currentItem) return;

    // Validar todos los campos obligatorios
    const newErrors: { [key: string]: string } = {};
    newErrors.nombre1 = validateNombre(currentItem.nombre1, 'nombre1');
    newErrors.apellido1 = validateNombre(currentItem.apellido1, 'apellido1');
    newErrors.nombre2 = validateNombre(currentItem.nombre2, 'nombre2'); // Opcional, pero validar si tiene contenido
    newErrors.apellido2 = validateNombre(currentItem.apellido2, 'apellido2'); // Opcional, pero validar si tiene contenido
    newErrors.correo = validateEmail(currentItem.correo);
    newErrors.telefono = validateTelefono(currentItem.telefono);
    newErrors.rol_id = validateRol(currentItem.rol_id);
    newErrors.estado_usuario = validateEstado(currentItem.estado_usuario);

    // Filtrar errores vacíos
    const filteredErrors = Object.fromEntries(Object.entries(newErrors).filter(([_, v]) => v !== ''));
    if (Object.keys(filteredErrors).length > 0) {
      setErrors(filteredErrors);
      toast({ title: "Errores en el formulario", description: "Corrige los campos marcados antes de guardar.", duration: 5000, variant: "destructive" } as any);
      return;
    }

    // Construir payload conforme a la entidad Usuario (incluye rol { id })
    const payload: any = {
      nombre1: currentItem.nombre1,
      nombre2: currentItem.nombre2,
      apellido1: currentItem.apellido1,
      apellido2: currentItem.apellido2,
      correo: currentItem.correo,
      telefono: currentItem.telefono,
      estadoUsuario: currentItem.estado_usuario,
      rol: { id: Number(currentItem.rol_id) },
      contrasena: "defaultpassword", // Ajusta según tu lógica (ej. hash)
    };

    try {
      if (currentItem.id) {
        await updateUsuario(currentItem.id, payload);
        toast({ title: "Actualizado", description: "Usuario actualizado correctamente.", duration: 3000 });
      } else {
        await createUsuario(payload);
        toast({ title: "Agregado", description: "Usuario creado correctamente.", duration: 3000 });
      }
      setCurrentItem(null);
      setIsDialogOpen(false); // Agregado para cerrar el diálogo
      fetchData();
    } catch (error) {
      console.error(error);
      toast({ title: "Error", description: "No se pudo guardar el usuario.", duration: 3000, variant: "destructive" } as any);
    }
  };

  const columns = [
    {
      key: "nombre_completo",
      label: "Nombre Completo",
      render: (_: any, row: any) =>
        `${row.nombre1} ${row.nombre2 || ""} ${row.apellido1} ${row.apellido2 || ""}`.replace(/\s+/g, " ").trim(),
    },
    { key: "correo", label: "Email" },
    { key: "telefono", label: "Teléfono" },
    {
      key: "rol_label",
      label: "Rol",
      render: (value: string) => (
        <Badge
          className={`font-semibold transition-all duration-300 cursor-pointer ${
            value === "Administrador"
              ? "bg-purple-500/10 text-purple-600 border-purple-200 hover:bg-purple-500 hover:text-white hover:border-purple-500"
              : value === "Cliente"
              ? "bg-blue-500/10 text-blue-600 border-blue-200 hover:bg-blue-500 hover:text-white hover:border-blue-500"
              : value === "Empleado"
              ? "bg-orange-500/10 text-orange-600 border-orange-200 hover:bg-orange-500 hover:text-white hover:border-orange-500"
              : "bg-green-500/10 text-green-600 border-green-200 hover:bg-green-500 hover:text-white hover:border-green-500"
          }`}
        >
          {value}
        </Badge>
      ),
    },
    {
      key: "estado_usuario",
      label: "Estado",
      render: (value: string) => (
        <Badge
          className={`font-semibold transition-all duration-300 cursor-pointer ${
            value === "Activo"
              ? "bg-green-500/10 text-green-600 border-green-200 hover:bg-green-500 hover:text-white hover:border-green-500"
              : "bg-red-500/10 text-red-600 border-red-200 hover:bg-red-500 hover:text-white hover:border-red-500"
          }`}
        >
          {value}
        </Badge>
      ),
    },
    { key: "created_at", label: "Fecha Registro" },
  ];

  // Función para renderizar acciones personalizadas por fila
  const renderActions = (row: any, actions: { onEdit: (row: any) => void }) => ( // Cambiado: recibe actions con onEdit
    <div className="flex justify-end gap-2">
      <div className="group/edit relative">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => actions.onEdit(row)} // Cambiado: usa actions.onEdit(row)
          className="hover:bg-blue-500/10 hover:text-blue-600"
        >
          <Edit className="h-4 w-4" />
        </Button>
        <span className="absolute right-full mr-2 top-1/2 -translate-y-1/2 px-2 py-1 bg-foreground text-background text-xs rounded opacity-0 group-hover/edit:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          Editar
        </span>
      </div>
      {row.estado_usuario === "Activo" ? (
        <div className="group/delete relative">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDelete(row.id)}
            className="text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
          <span className="absolute right-full mr-2 top-1/2 -translate-y-1/2 px-2 py-1 bg-foreground text-background text-xs rounded opacity-0 group-hover/delete:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
            Inactivar
          </span>
        </div>
      ) : (
        <div className="group/reactivate relative">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleReactivar(row.id)}
            className="text-green-600 hover:bg-green-500/10"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
          <span className="absolute right-full mr-2 top-1/2 -translate-y-1/2 px-2 py-1 bg-foreground text-background text-xs rounded opacity-0 group-hover/reactivate:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
            Reactivar
          </span>
        </div>
      )}
    </div>
  );

  const form = (
    <form id="form-usuarios" className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
      <label className="space-y-1">
        <div className="text-sm font-medium text-gray-700">Nombre *</div>
        <input
          value={currentItem?.nombre1 ?? ""}
          onChange={(e) => handleInputChange('nombre1', e.target.value)}
          placeholder="Nombre"
          required
          className={`w-full border ${errors.nombre1 ? 'border-red-500' : 'border-gray-300'} bg-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400`}
        />
        {errors.nombre1 && <p className="text-red-500 text-xs">{errors.nombre1}</p>}
      </label>

      <label className="space-y-1">
        <div className="text-sm font-medium text-gray-700">Segundo nombre</div>
        <input
          value={currentItem?.nombre2 ?? ""}
          onChange={(e) => handleInputChange('nombre2', e.target.value)}
          placeholder="Segundo nombre (opcional)"
          className={`w-full border ${errors.nombre2 ? 'border-red-500' : 'border-gray-300'} bg-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400`}
        />
        {errors.nombre2 && <p className="text-red-500 text-xs">{errors.nombre2}</p>}
      </label>

      <label className="space-y-1">
        <div className="text-sm font-medium text-gray-700">Apellido *</div>
        <input
          value={currentItem?.apellido1 ?? ""}
          onChange={(e) => handleInputChange('apellido1', e.target.value)}
          placeholder="Apellido"
          required
          className={`w-full border ${errors.apellido1 ? 'border-red-500' : 'border-gray-300'} bg-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400`}
        />
        {errors.apellido1 && <p className="text-red-500 text-xs">{errors.apellido1}</p>}
      </label>

      <label className="space-y-1">
        <div className="text-sm font-medium text-gray-700">Segundo apellido</div>
        <input
          value={currentItem?.apellido2 ?? ""}
          onChange={(e) => handleInputChange('apellido2', e.target.value)}
          placeholder="Segundo apellido (opcional)"
          className={`w-full border ${errors.apellido2 ? 'border-red-500' : 'border-gray-300'} bg-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400`}
        />
        {errors.apellido2 && <p className="text-red-500 text-xs">{errors.apellido2}</p>}
      </label>

      <label className="space-y-1">
        <div className="text-sm font-medium text-gray-700">Email *</div>
        <input
          type="email"
          value={currentItem?.correo ?? ""}
          onChange={(e) => handleInputChange('correo', e.target.value)}
          placeholder="correo@ejemplo.com"
          required
          className={`w-full border ${errors.correo ? 'border-red-500' : 'border-gray-300'} bg-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400`}
        />
        {errors.correo && <p className="text-red-500 text-xs">{errors.correo}</p>}
      </label>

      <label className="space-y-1">
        <div className="text-sm font-medium text-gray-700">Teléfono *</div>
        <input
          value={currentItem?.telefono ?? ""}
          onChange={(e) => handleInputChange('telefono', e.target.value)}
          placeholder="+57 300 0000000"
          required
          className={`w-full border ${errors.telefono ? 'border-red-500' : 'border-gray-300'} bg-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400`}
        />
        {errors.telefono && <p className="text-red-500 text-xs">{errors.telefono}</p>}
      </label>

      <label className="space-y-1">
        <div className="text-sm font-medium text-gray-700">Rol *</div>
        <select
          value={String(currentItem?.rol_id ?? "")}
          onChange={(e) => handleInputChange('rol_id', e.target.value)}
          required
          className={`w-full border ${errors.rol_id ? 'border-red-500' : 'border-gray-300'} bg-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400`}
        >
          <option value="">Selecciona un rol</option>
          {roles.map((r: any) => (
            <option key={`rol-${r.id}`} value={String(r.id)}>
              {r.descripcion}
            </option>
          ))}
        </select>
        {errors.rol_id && <p className="text-red-500 text-xs">{errors.rol_id}</p>}
      </label>

      <label className="space-y-1">
        <div className="text-sm font-medium text-gray-700">Estado *</div>
        <select
          value={currentItem?.estado_usuario ?? "Activo"}
          onChange={(e) => handleInputChange('estado_usuario', e.target.value)}
          required
          className={`w-full border ${errors.estado_usuario ? 'border-red-500' : 'border-gray-300'} bg-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400`}
        >
          <option value="Activo">Activo</option>
          <option value="Inactivo">Inactivo</option>
        </select>
        {errors.estado_usuario && <p className="text-red-500 text-xs">{errors.estado_usuario}</p>}
      </label>
    </form>
  );

  return (
    <CrudPage
      title="Usuarios"
      description="Gestiona los usuarios del sistema"
      data={usuarios}
      columns={columns}
      onAdd={handleAdd}
      onEdit={(row) => handleEdit(row.id)} // Cambiado para recibir row
      onSave={handleSave}
      formContent={form}
      searchPlaceholder="Buscar por nombre o email..."
      renderActions={renderActions} // Nueva prop para acciones personalizadas
      isDialogOpen={isDialogOpen} // Nueva prop
      onDialogOpenChange={setIsDialogOpen} // Nueva prop
      currentItem={currentItem} // Nueva prop
    />
  );
}
