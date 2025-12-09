import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

/**
 * CartHeader: versión sencilla del header usada en flujo de compra.
 * - Si hay usuario logueado: oculta botones 'Iniciar sesión' / 'Registrarse'
 *   y muestra un mensaje de agradecimiento.
 * - Si no hay usuario: muestra los botones normales.
 */
const CartHeader: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="bg-card border-b border-border">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="font-bold text-lg">
          Nails Nice
        </Link>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <div className="text-sm text-foreground mr-4">
                <div className="font-medium">Hola, {(user as any)?.nombre1 ?? "cliente"}</div>
                <div className="text-xs text-muted-foreground">Gracias por comprar y confiar en nosotros</div>
              </div>
              <Button variant="outline" onClick={() => { logout(); navigate("/"); }}>
                Cerrar sesión
              </Button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost">Iniciar sesión</Button>
              </Link>
              <Link to="/register">
                <Button>Registrarse</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default CartHeader;