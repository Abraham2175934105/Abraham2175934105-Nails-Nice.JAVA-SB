import { useState } from "react";
import { Search, Edit, Trash2, Plus, FileText, FileSpreadsheet, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import DashboardLayout from "@/components/layouts/DashboardLayout";

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
  status: string;
  registeredDate: string;
}

const Users = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [users, setUsers] = useState<User[]>([
    { id: 1, firstName: "María", lastName: "García", email: "maria.garcia@example.com", phone: "+57 300 1234567", role: "Cliente", status: "Activo", registeredDate: "2024-01-15" },
    { id: 2, firstName: "Juan", lastName: "Pérez", email: "juan.perez@example.com", phone: "+57 301 7654321", role: "Admin", status: "Activo", registeredDate: "2023-12-10" },
    { id: 3, firstName: "Ana", lastName: "López", email: "ana.lopez@example.com", phone: "+57 302 9876543", role: "Cliente", status: "Inactivo", registeredDate: "2024-02-20" },
    { id: 4, firstName: "Carlos", lastName: "Ruiz", email: "carlos.ruiz@example.com", phone: "+57 303 5551234", role: "Moderador", status: "Activo", registeredDate: "2024-01-05" }
  ]);

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) || user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) || user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    const matchesStatus = statusFilter === "all" || user.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + itemsPerPage);

  const exportToPDF = () => alert("Exportando a PDF...");
  const exportToExcel = () => {
    const csvContent = [["ID", "Nombre", "Apellido", "Email", "Teléfono", "Rol", "Estado", "Fecha"], ...filteredUsers.map(u => [u.id, u.firstName, u.lastName, u.email, u.phone, u.role, u.status, u.registeredDate])].map(r => r.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "usuarios.csv";
    a.click();
  };

  const deleteUser = (id: number) => {
    if (confirm("¿Eliminar usuario?")) setUsers(users.filter(u => u.id !== id));
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="border-l-4 border-primary pl-4">
          <h1 className="text-4xl font-black tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">GESTIÓN DE USUARIOS</h1>
          <p className="text-muted-foreground mt-2 font-medium">Administra los usuarios del sistema</p>
        </div>
        <Card className="shadow-elegant">
          <CardHeader><CardTitle>Lista de Usuarios</CardTitle></CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <Input type="search" placeholder="Buscar por nombre, apellido o email..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="bg-muted border-border" />
              </div>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-full md:w-[180px] bg-muted"><SelectValue placeholder="Rol" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="Admin">Admin</SelectItem>
                  <SelectItem value="Moderador">Moderador</SelectItem>
                  <SelectItem value="Cliente">Cliente</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-[180px] bg-muted"><SelectValue placeholder="Estado" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="Activo">Activo</SelectItem>
                  <SelectItem value="Inactivo">Inactivo</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={exportToPDF} className="bg-red-500/10 text-red-600 border-red-200 hover:bg-red-500/20 hover:text-red-700"><FileText className="h-4 w-4 mr-2" />PDF</Button>
                <Button variant="outline" size="sm" onClick={exportToExcel} className="bg-green-500/10 text-green-600 border-green-200 hover:bg-green-500/20 hover:text-green-700"><FileSpreadsheet className="h-4 w-4 mr-2" />Excel</Button>
              </div>
              <Dialog>
                <DialogTrigger asChild><Button><Plus className="h-4 w-4 mr-2" />Agregar</Button></DialogTrigger>
                <DialogContent><DialogHeader><DialogTitle>Nuevo Usuario</DialogTitle></DialogHeader><DialogFooter><Button>Guardar</Button></DialogFooter></DialogContent>
              </Dialog>
            </div>
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50 hover:bg-muted/50">
                    <TableHead>Nombre</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Teléfono</TableHead>
                    <TableHead>Rol</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedUsers.map((user) => (
                    <TableRow key={user.id} className="hover:bg-accent/50 hover:-translate-y-1 hover:shadow-lg transition-all duration-200 cursor-pointer">
                      <TableCell className="font-medium">{user.firstName} {user.lastName}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.phone}</TableCell>
                      <TableCell><span className={`px-3 py-1 text-xs rounded-full font-semibold ${user.role === "Admin" ? "bg-purple-500/10 text-purple-600 border border-purple-200" : user.role === "Moderador" ? "bg-blue-500/10 text-blue-600 border border-blue-200" : "bg-green-500/10 text-green-600 border border-green-200"}`}>{user.role}</span></TableCell>
                      <TableCell><span className={`px-3 py-1 text-xs rounded-full font-semibold ${user.status === "Activo" ? "bg-green-500/10 text-green-600 border border-green-200" : "bg-red-500/10 text-red-600 border border-red-200"}`}>{user.status}</span></TableCell>
                      <TableCell>{user.registeredDate}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <div className="group/edit relative">
                            <Button variant="ghost" size="sm" className="hover:bg-blue-500/10 hover:text-blue-600"><Edit className="h-4 w-4" /></Button>
                            <span className="absolute right-full mr-2 top-1/2 -translate-y-1/2 px-2 py-1 bg-foreground text-background text-xs rounded opacity-0 group-hover/edit:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">Editar</span>
                          </div>
                          <div className="group/delete relative">
                            <Button variant="ghost" size="sm" onClick={() => deleteUser(user.id)} className="text-destructive hover:bg-destructive/10"><Trash2 className="h-4 w-4" /></Button>
                            <span className="absolute right-full mr-2 top-1/2 -translate-y-1/2 px-2 py-1 bg-foreground text-background text-xs rounded opacity-0 group-hover/delete:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">Eliminar</span>
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <div className="flex items-center justify-between mt-6">
              <p className="text-sm text-muted-foreground">Mostrando {startIndex + 1} a {Math.min(startIndex + itemsPerPage, filteredUsers.length)} de {filteredUsers.length}</p>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="bg-muted"><ChevronLeft className="h-4 w-4" />Anterior</Button>
                <div className="flex gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const page = i + 1;
                    return <Button key={page} variant={currentPage === page ? "default" : "outline"} size="sm" onClick={() => setCurrentPage(page)} className={`w-10 ${currentPage !== page ? 'bg-muted' : ''}`}>{page}</Button>;
                  })}
                </div>
                <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="bg-muted">Siguiente<ChevronRight className="h-4 w-4" /></Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Users;
