import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

/**
 * Componente que protege rutas. 
 * - Muestra null mientras auth.ready === false (puedes cambiar por un spinner).
 * - Si no hay token/user redirige a /login guardando la ruta origen en state.
 */
const ProtectedRoute: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const { token, user, ready } = useAuth();
  const location = useLocation();

  // Mientras el contexto verifica token / usuario, mostramos nada (o spinner)
  if (!ready) {
    // opcional: mostrar spinner o skeleton
    return null;
  }

  // Si no estamos autenticados, redirigimos a login y guardamos la ruta solicitada
  if (!token || !user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // Autenticado -> renderizar hijo (ruta protegida)
  return children;
};

export default ProtectedRoute;