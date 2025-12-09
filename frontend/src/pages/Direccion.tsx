import { useState, useEffect } from "react";
import { Edit, MapPin, Package, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Link, useNavigate } from "react-router-dom";
import CartHeader from "@/components/CartHeader";
import Footer from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import apiClientes from "@/lib/apiClientes";
import apiUsuarios from "@/lib/apiUsuarios";

const Direccion = () => {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();

  const userId = (user as any)?.id;

  const [direccion, setDireccion] = useState({
    nombreCompleto: [ (user as any)?.nombre1, (user as any)?.apellido1 ].filter(Boolean).join(" ").trim(),
    email: (user as any)?.correo ?? (user as any)?.email ?? "",
    calle: "",
    telefono: ""
  });

  // Cargar cliente desde backend (si hay)
  useEffect(() => {
    if (!userId) return;
    (async () => {
      try {
        // Intentamos obtener cliente (donde está guardada la dirección)
        const c: any = await apiClientes.getClienteByUserId(userId);
        if (c) {
          setDireccion(prev => ({
            ...prev,
            calle: c.direccion ?? prev.calle,
            telefono: c.telefono ?? prev.telefono,
            nombreCompleto: prev.nombreCompleto,
            email: prev.email
          }));
        } else {
          // fallback: intentar obtener usuario para campos
          const u: any = await apiUsuarios.getUsuario(userId);
          setDireccion(prev => ({
            ...prev,
            calle: (u as any)?.direccion ?? prev.calle,
            telefono: (u as any)?.telefono ?? prev.telefono
          }));
        }
      } catch (e) {
        // no romper flujo si no existe cliente
        try {
          const u: any = await apiUsuarios.getUsuario(userId);
          setDireccion(prev => ({
            ...prev,
            calle: (u as any)?.direccion ?? prev.calle,
            telefono: (u as any)?.telefono ?? prev.telefono
          }));
        } catch {}
      }
    })();
  }, [userId]);

  const steps = [
    { number: 1, title: "Carrito", icon: Package },
    { number: 2, title: "Dirección", icon: MapPin },
    { number: 3, title: "Pago", icon: CreditCard }
  ];

  const currentStep = 2;

  const handleContinuar = () => {
    if (!direccion.calle || direccion.calle.trim().length < 3) {
      alert("Por favor ingresa la dirección (calle) antes de continuar.");
      return;
    }
    const telClean = (direccion.telefono || "").replace(/[^\d+]/g, "");
    if (!telClean || telClean.length < 7) {
      alert("Por favor ingresa un teléfono válido antes de continuar.");
      return;
    }
    navigate("/pago");
  };

  const handleGuardar = async () => {
    if (!userId) {
      alert("Debes iniciar sesión para guardar la dirección.");
      return;
    }
    try {
      // Upsert cliente por userId
      const payload = { direccion: direccion.calle, telefono: direccion.telefono };
      const updated = await apiClientes.upsertClienteByUserId(userId, payload);
      // Actualizamos también el usuario en el contexto para que otras pantallas tomen el valor
      const mergedUser = { ...(user as any), direccion: direccion.calle, telefono: direccion.telefono };
      updateUser(mergedUser);
      // Intentar también actualizar entidad Usuario si hace falta
      try {
        await apiUsuarios.updateUsuario(userId, { ...mergedUser });
      } catch {
        // si falla no bloqueamos; la fuente principal es cliente
      }
      alert("Dirección guardada correctamente.");
    } catch (err: any) {
      console.error("Error guardando dirección:", err);
      alert(err?.message || "No se pudo guardar la dirección.");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <CartHeader />

      <main className="container mx-auto px-4 py-8">
        {/* Progress Bar */}
        <div className="mb-12">
          <div className="flex items-center justify-between max-w-3xl mx-auto">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = currentStep >= step.number;
              const isCompleted = currentStep > step.number;
              return (
                <div key={step.number} className="flex items-center flex-1">
                  <div className="flex flex-col items-center flex-1">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-smooth ${isCompleted || isActive ? "bg-green-500 text-white shadow-glow" : "bg-muted text-muted-foreground"}`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <span className={`text-sm mt-2 font-medium ${isActive ? "text-foreground" : "text-muted-foreground"}`}>{step.title}</span>
                  </div>
                  {index < steps.length - 1 && <div className={`h-1 flex-1 mx-4 rounded-full transition-smooth ${isCompleted ? "bg-green-500" : "bg-muted"}`} />}
                </div>
              );
            })}
          </div>
        </div>

        <div className="max-w-3xl mx-auto">
          <Card className="p-8 shadow-elegant">
            <h2 className="text-3xl font-bold mb-6 text-foreground">Dirección de Envío</h2>

            <div className="mb-8 p-6 bg-accent/30 rounded-lg">
              <h3 className="text-lg font-semibold mb-4 text-foreground">Información de Contacto</h3>
              <div className="space-y-3">
                <p className="text-foreground"><span className="font-medium">Nombre:</span> {direccion.nombreCompleto || <em>No registrado</em>}</p>
                <p className="text-foreground"><span className="font-medium">Email:</span> {direccion.email || <em>No registrado</em>}</p>
                <p className="text-foreground"><span className="font-medium">Teléfono:</span> {direccion.telefono || <em>No registrado</em>}</p>
              </div>
            </div>

            <div className="mb-6 p-6 border-2 border-border rounded-lg bg-background">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-foreground">Dirección Actual</h3>

                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4 mr-2" />
                      Cambiar Dirección
                    </Button>
                  </DialogTrigger>

                  <DialogContent className="max-w-md" aria-describedby="dialog-desc">
                    <div id="dialog-desc" className="sr-only">Editar dirección (calle) y teléfono</div>

                    <DialogHeader>
                      <DialogTitle>Actualizar Dirección</DialogTitle>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                      <div>
                        <Label htmlFor="calle">Dirección (calle)</Label>
                        <Input
                          id="calle"
                          placeholder="Ej: Calle 10 #20-30"
                          value={direccion.calle}
                          onChange={(e) => setDireccion(prev => ({ ...prev, calle: e.target.value }))}
                          className="mt-2"
                        />
                      </div>

                      <div>
                        <Label htmlFor="telefono">Teléfono</Label>
                        <Input
                          id="telefono"
                          placeholder="+57 300 1234567"
                          value={direccion.telefono}
                          onChange={(e) => setDireccion(prev => ({ ...prev, telefono: e.target.value }))}
                          className="mt-2"
                        />
                      </div>
                    </div>

                    <DialogFooter>
                      <Button className="w-full" onClick={handleGuardar}>
                        Guardar Cambios
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="space-y-2 text-foreground">
                <p>{direccion.calle || <em>No hay dirección registrada</em>}</p>
              </div>
            </div>

            {/* Acciones */}
            <div className="flex gap-4 mt-8">
              <Link to="/cart" className="flex-1">
                <Button variant="outline" className="w-full">Volver al Carrito</Button>
              </Link>

              <Button className="flex-1 bg-green-600 hover:bg-green-700 text-white shadow-medium" onClick={handleContinuar}>
                Continuar al Pago
              </Button>
            </div>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Direccion;