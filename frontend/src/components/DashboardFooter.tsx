import { Shield, Clock, HelpCircle } from "lucide-react";

export default function DashboardFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-card mt-auto">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              <span>Sistema Seguro</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>Última actualización: Hoy</span>
            </div>
          </div>

          <div className="flex items-center gap-6 text-sm">
            <a href="#" className="text-muted-foreground hover:text-primary transition-smooth flex items-center gap-1">
              <HelpCircle className="h-4 w-4" />
              <span>Ayuda</span>
            </a>
            <span className="text-muted-foreground">
              © {currentYear} Nails Nice. Panel de Administración
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
