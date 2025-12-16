import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Productos from "./pages/Productos";
import Cart from "./pages/Cart";
import Direccion from "./pages/Direccion";
import Pago from "./pages/Pago";
import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import ProductoDetalle from "./pages/ProductoDetalle";
import PerfilAdmin from "./pages/PerfilAdmin";
import NotFound from "./pages/NotFound";
import RecuperarContrasena from "./pages/RecuperarContrasena";

// Module imports
import Usuarios from "./pages/modules/Usuarios";
import ProductosAdmin from "./pages/modules/ProductosAdmin";
import Inventario from "./pages/modules/Inventario";
import Ventas from "./pages/modules/Ventas";
import Pedidos from "./pages/modules/Pedidos";
import Servicios from "./pages/modules/Servicios";
import Promociones from "./pages/modules/Promociones";
import Tickets from "./pages/modules/Tickets";

import { AuthProvider } from "./contexts/AuthContext";
import { CartProvider } from "./contexts/CartContext";
import ProtectedRoute from "@/components/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      {/* NO hay BrowserRouter aquí — solo rutas */}
      <AuthProvider>
        <CartProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/recuperar-contrasena" element={<RecuperarContrasena />} />
            <Route path="/register" element={<Register />} />
            <Route path="/productos" element={<Productos />} />
            <Route path="/productos/:id" element={<ProductoDetalle />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/direccion" element={<Direccion />} />
            <Route path="/pago" element={<Pago />} />

            {/* Rutas protegidas: envueltas en ProtectedRoute */}
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/perfil-admin" element={<ProtectedRoute><PerfilAdmin /></ProtectedRoute>} />
            <Route path="/users" element={<ProtectedRoute><Users /></ProtectedRoute>} />

            {/* Main Modules (protegidos) */}
            <Route path="/usuarios" element={<ProtectedRoute><Usuarios /></ProtectedRoute>} />
            <Route path="/productos-admin" element={<ProtectedRoute><ProductosAdmin /></ProtectedRoute>} />
            <Route path="/inventario" element={<ProtectedRoute><Inventario /></ProtectedRoute>} />
            <Route path="/ventas" element={<ProtectedRoute><Ventas /></ProtectedRoute>} />
            <Route path="/pedidos" element={<ProtectedRoute><Pedidos /></ProtectedRoute>} />
            <Route path="/servicios" element={<ProtectedRoute><Servicios /></ProtectedRoute>} />
            <Route path="/promociones" element={<ProtectedRoute><Promociones /></ProtectedRoute>} />
            <Route path="/tickets" element={<ProtectedRoute><Tickets /></ProtectedRoute>} />

            {/* catch-all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </CartProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;