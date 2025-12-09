import { useState } from "react";
import CrudPage from "@/components/crud/CrudPage";
import { Badge } from "@/components/ui/badge";

interface Promocion {
  id: number;
  nombre: string;
  descripcion: string;
  fecha_inicio: string;
  fecha_fin: string;
  estado: string;
}

export default function Promociones() {
  const [promociones, setPromociones] = useState<Promocion[]>([
    {
      id: 1,
      nombre: "Black Friday 2024",
      descripcion: "50% de descuento en productos seleccionados",
      fecha_inicio: "2024-11-24",
      fecha_fin: "2024-11-30",
      estado: "Activo",
    },
    {
      id: 2,
      nombre: "Promo San Valentín",
      descripcion: "Combo especial 2x1 en maquillaje",
      fecha_inicio: "2024-02-01",
      fecha_fin: "2024-02-14",
      estado: "Finalizado",
    },
  ]);

  const columns = [
    { key: "nombre", label: "Promoción" },
    { key: "descripcion", label: "Descripción" },
    { key: "fecha_inicio", label: "Fecha Inicio" },
    { key: "fecha_fin", label: "Fecha Fin" },
    {
      key: "estado",
      label: "Estado",
      render: (value: string) => (
        <Badge
          className={`font-semibold transition-all duration-300 cursor-pointer ${
            value === "Activo"
              ? "bg-green-500/10 text-green-600 border-green-200 hover:bg-green-500 hover:text-white hover:border-green-500"
              : value === "Programado"
              ? "bg-blue-500/10 text-blue-600 border-blue-200 hover:bg-blue-500 hover:text-white hover:border-blue-500"
              : "bg-gray-500/10 text-gray-600 border-gray-200 hover:bg-gray-500 hover:text-white hover:border-gray-500"
          }`}
        >
          {value}
        </Badge>
      ),
    },
  ];

  const handleDelete = (id: number) => {
    if (confirm("¿Eliminar promoción?")) {
      setPromociones(promociones.filter((p) => p.id !== id));
    }
  };

  return (
    <CrudPage
      title="Promociones"
      description="Gestiona campañas promocionales"
      columns={columns}
      data={promociones}
      onDelete={handleDelete}
      searchPlaceholder="Buscar por nombre o descripción..."
    />
  );
}
