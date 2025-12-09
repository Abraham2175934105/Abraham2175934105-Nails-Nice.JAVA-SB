import { useState } from "react";
import CrudPage from "@/components/crud/CrudPage";
import { Badge } from "@/components/ui/badge";

interface Ticket {
  id: number;
  cliente: string;
  canal_comunicacion: string;
  promociones: string;
  cupones: string;
  fecha_contacto: string;
  estado_ticket: string;
  control_agendamiento: string;
}

export default function Tickets() {
  const [tickets, setTickets] = useState<Ticket[]>([
    {
      id: 1,
      cliente: "María García",
      canal_comunicacion: "WhatsApp",
      promociones: "Black Friday",
      cupones: "BF2024",
      fecha_contacto: "2024-03-15 10:30",
      estado_ticket: "Abierto",
      control_agendamiento: "Pendiente",
    },
    {
      id: 2,
      cliente: "Juan Pérez",
      canal_comunicacion: "Email",
      promociones: "Ninguna",
      cupones: "N/A",
      fecha_contacto: "2024-03-14 15:20",
      estado_ticket: "Cerrado",
      control_agendamiento: "Completado",
    },
  ]);

  const columns = [
    {
      key: "id",
      label: "Ticket #",
      render: (value: number) => `#${String(value).padStart(5, "0")}`,
    },
    { key: "cliente", label: "Cliente" },
    { key: "canal_comunicacion", label: "Canal" },
    { key: "promociones", label: "Promociones" },
    { key: "cupones", label: "Cupones" },
    {
      key: "estado_ticket",
      label: "Estado",
      render: (value: string) => (
        <Badge
          className={`font-semibold transition-all duration-300 cursor-pointer ${
            value === "Abierto"
              ? "bg-yellow-500/10 text-yellow-600 border-yellow-200 hover:bg-yellow-500 hover:text-white hover:border-yellow-500"
              : value === "En proceso"
              ? "bg-blue-500/10 text-blue-600 border-blue-200 hover:bg-blue-500 hover:text-white hover:border-blue-500"
              : "bg-green-500/10 text-green-600 border-green-200 hover:bg-green-500 hover:text-white hover:border-green-500"
          }`}
        >
          {value}
        </Badge>
      ),
    },
    { key: "fecha_contacto", label: "Fecha Contacto" },
  ];

  const handleDelete = (id: number) => {
    if (confirm("¿Eliminar ticket?")) {
      setTickets(tickets.filter((t) => t.id !== id));
    }
  };

  return (
    <CrudPage
      title="Servicio al Cliente"
      description="Tickets de atención al cliente"
      columns={columns}
      data={tickets}
      onDelete={handleDelete}
      searchPlaceholder="Buscar por cliente, canal o promoción..."
    />
  );
}
