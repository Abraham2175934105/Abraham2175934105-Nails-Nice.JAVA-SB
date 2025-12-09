import { User, LogOut } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useAuth } from "@/contexts/AuthContext";

export default function DashboardHeader() {
  const navigate = useNavigate();
  const { user: authUser } = useAuth();

  // Normalizar user desde AuthContext (muchos backends usan nombres distintos)
  const u: any = authUser ?? (() => {
    try {
      const s = localStorage.getItem("nn_user") ?? localStorage.getItem("user");
      return s ? JSON.parse(s) : null;
    } catch (e) {
      return null;
    }
  })();

  const name = (u?.nombre ?? u?.nombre1 ?? (u?.correo ? u.correo.split("@")[0] : "Admin")) || "Admin Usuario";
  const email = u?.correo ?? u?.email ?? "";
  const initials = (name || "AU").split(" ").map((s: string) => s.charAt(0)).slice(0,2).join("").toUpperCase();
  const avatar = u?.avatar ?? u?.imagen ?? "";

  const admin = { name, email, initials, avatar };

  const handleLogout = () => {
    // Limpiar storage y redirigir a login
    localStorage.removeItem("user");
    localStorage.removeItem("nn_user");
    localStorage.removeItem("nn_token");
    // Si guardas otros keys, remuévelos también
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60 h-20">
      <div className="flex h-full items-center gap-4 px-6">
        <SidebarTrigger className="hover:bg-accent transition-smooth" />
        
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-black tracking-tight text-foreground">NAILS NICE</h1>
        </div>
        
        <div className="flex-1" />

        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2 hover:bg-accent">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={admin.avatar} />
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {admin.initials}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden md:flex flex-col items-start">
                  <span className="text-sm font-medium">{admin.name}</span>
                  <span className="text-xs text-muted-foreground">{admin.email}</span>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Mi Cuenta</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <Link to="/perfil-admin">
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>Perfil</span>
                </DropdownMenuItem>
              </Link>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Cerrar Sesión</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}