import { useState, useMemo, useEffect } from "react";
import { MapPin, Package, CreditCard, Banknote, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Link, useNavigate } from "react-router-dom";
import CartHeader from "@/components/CartHeader";
import Footer from "@/components/Footer";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { createPedido } from "@/lib/apiPedido";
import apiClientes from "@/lib/apiClientes";
import apiUsuarios from "@/lib/apiUsuarios";

const Pago = () => {
  const { items, clear } = useCart();
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();

  const [metodoPago, setMetodoPago] = useState<"contraentrega" | "pse">("contraentrega");

  const [contacto, setContacto] = useState({
    nombre: "",
    email: "",
    direccion: "",
    telefono: ""
  });

  const [errors, setErrors] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [orderDate, setOrderDate] = useState<string | null>(null);

  // Snapshot states (solo para la factura modal)
  const [orderSnapshot, setOrderSnapshot] = useState<any[]>([]);
  const [orderContactoSnapshot, setOrderContactoSnapshot] = useState<any | null>(null);
  const [orderSubtotal, setOrderSubtotal] = useState<number>(0);
  const [orderShipping, setOrderShipping] = useState<number>(0);
  const [orderTotal, setOrderTotal] = useState<number>(0);

  const [pseInfo, setPseInfo] = useState({ banco: "", referencia: "" });

  const userId = (user as any)?.id;

  const fmt = new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", minimumFractionDigits: 2 });

  // cargar valores iniciales desde user o cliente
  useEffect(() => {
    const load = async () => {
      try {
        if (userId) {
          const cliente: any = await apiClientes.getClienteByUserId(userId).catch(() => null);
          if (cliente) {
            setContacto(prev => ({
              ...prev,
              nombre: [(user as any)?.nombre1, (user as any)?.apellido1].filter(Boolean).join(" ").trim() || prev.nombre,
              email: (user as any)?.correo ?? prev.email,
              direccion: cliente.direccion ?? (user as any)?.direccion ?? prev.direccion,
              telefono: cliente.telefono ?? (user as any)?.telefono ?? prev.telefono
            }));
            return;
          }
          const u: any = await apiUsuarios.getUsuario(userId).catch(() => null);
          if (u) {
            setContacto(prev => ({
              ...prev,
              nombre: [u.nombre1, u.apellido1].filter(Boolean).join(" ").trim() || prev.nombre,
              email: u.correo ?? prev.email,
              direccion: u.direccion ?? prev.direccion,
              telefono: u.telefono ?? prev.telefono
            }));
          }
        } else {
          if (user) {
            setContacto(prev => ({
              ...prev,
              nombre: [(user as any)?.nombre1, (user as any)?.apellido1].filter(Boolean).join(" ").trim() || prev.nombre,
              email: (user as any)?.correo ?? prev.email,
              direccion: (user as any)?.direccion ?? prev.direccion,
              telefono: (user as any)?.telefono ?? prev.telefono
            }));
          }
        }
      } catch (err) {
        // ignore
      }
    };
    void load();
  }, [userId, user]);

  // items normalizados para UI
  const cartItems = useMemo(
    () =>
      items.map(it => {
        const anyIt = it as any;
        return {
          id: it.id ?? it.idProducto,
          nombre: it.nombre ?? anyIt.name ?? "",
          precio: Number(anyIt.precio ?? anyIt.precioUnitario ?? anyIt.precio_unitario ?? 0),
          cantidad: Number(anyIt.cantidad ?? anyIt.cantidad_producto ?? anyIt.cantidadProducto ?? 1)
        };
      }),
    [items]
  );

  // subtotal en tiempo real (para la vista antes de pagar)
  const subtotal = cartItems.reduce((s, it) => s + it.precio * it.cantidad, 0);

  // envío forzado gratis
  const shipping = 0;
  const total = subtotal + shipping;

  const validate = (): boolean => {
    if (!contacto.direccion || contacto.direccion.trim().length < 3) {
      setErrors("La dirección es obligatoria.");
      return false;
    }
    const tel = (contacto.telefono || "").replace(/[^\d+]/g, "");
    if (!tel || tel.length < 7) {
      setErrors("Teléfono inválido.");
      return false;
    }
    if (!contacto.email || !contacto.email.includes("@")) {
      setErrors("Email inválido.");
      return false;
    }
    if (metodoPago === "pse") {
      if (!pseInfo.banco || !pseInfo.referencia) {
        setErrors("Completa los datos de PSE (banco y referencia) para simular el pago.");
        return false;
      }
    }
    setErrors(null);
    return true;
  };

  const handleProcesarPago = async () => {
    if (!validate()) return;
    setIsProcessing(true);

    // Capturamos snapshot inmutable del carrito y del contacto
    const snapshot = cartItems.map(it => ({ ...it }));
    const subtotalLocal = snapshot.reduce((s, it) => s + it.precio * it.cantidad, 0);
    const shippingLocal = 0;
    const totalLocal = subtotalLocal + shippingLocal;

    try {
      // --- Garantizar existencia de cliente en el servidor antes de crear el pedido ---
      let resolvedClienteId: number | null = userId || null;

      if (userId) {
        try {
          const existing: any = await apiClientes.getClienteByUserId(userId).catch(() => null);
          if (existing) {
            resolvedClienteId = existing.idCliente ?? existing.id_cliente ?? existing.id ?? resolvedClienteId;
          } else {
            const created: any = await apiClientes.upsertClienteByUserId(userId, { direccion: contacto.direccion, telefono: contacto.telefono }).catch(() => null);
            if (created) {
              resolvedClienteId = created.idCliente ?? created.id_cliente ?? created.id ?? resolvedClienteId;
            } else {
              const again: any = await apiClientes.getClienteByUserId(userId).catch(() => null);
              if (again) {
                resolvedClienteId = again.idCliente ?? again.id_cliente ?? again.id ?? resolvedClienteId;
              }
            }
          }
        } catch (e) {
          console.warn("No se pudo resolver/crear cliente previamente:", e);
        }
      }

      const pedidoPayload: any = {
        idCliente: resolvedClienteId,
        detallePedido: `Pedido de ${(contacto.nombre)} - ${metodoPago.toUpperCase()}`,
        estadoPedido: "PENDIENTE",
        totalPedido: totalLocal,
        fechaPedido: new Date().toISOString().split("T")[0],
        cantidadPedido: snapshot.reduce((acc, it) => acc + it.cantidad, 0),
        productos: snapshot.map(it => ({
          idProducto: it.id,
          cantidad: it.cantidad,
          precioUnitario: it.precio
        })),
        cliente: {
          nombre: contacto.nombre,
          email: contacto.email,
          direccion: contacto.direccion,
          telefono: contacto.telefono
        },
        metodoPago,
        subtotal: subtotalLocal,
        envio: shippingLocal,
        pse: metodoPago === "pse" ? { banco: pseInfo.banco, referencia: pseInfo.referencia } : undefined
      };

      const response = await createPedido(pedidoPayload);

      // Guardamos snapshot exclusivamente para la factura/modal
      setOrderSnapshot(snapshot);
      setOrderContactoSnapshot({ ...contacto });
      setOrderSubtotal(subtotalLocal);
      setOrderShipping(shippingLocal);
      setOrderTotal(totalLocal);

      setOrderId(response.id || response.idPedido || `PED-${Date.now().toString().slice(-8)}`);
      setOrderDate(response.fechaPedido ? new Date(response.fechaPedido).toISOString() : new Date().toISOString());

      // limpiar carrito (esto NO afectará al orderSnapshot porque ya lo guardamos)
      await clear();

      // Guardar cliente info para futuras sesiones
      if (userId) {
        try {
          await apiClientes.upsertClienteByUserId(userId, { direccion: contacto.direccion, telefono: contacto.telefono });
          const mergedUser = { ...(user as any), direccion: contacto.direccion, telefono: contacto.telefono };
          updateUser(mergedUser);
          try { await apiUsuarios.updateUsuario(userId, mergedUser); } catch {}
        } catch (e) { /* ignore */ }
      }

      setShowModal(true);
    } catch (err: any) {
      console.error("Error procesando pago:", err);
      const errorMsg = (err as any)?.body?.message || (err as any)?.message || "Ocurrió un error al procesar el pago. Intenta nuevamente.";
      setErrors(errorMsg);
    } finally {
      setIsProcessing(false);
    }
  };

  // decide qué datos mostrar en la columna resumen (antes del pago usamos cartItems; después, la factura usa orderSnapshot)
  const displayItems = showModal ? orderSnapshot : cartItems;
  const displaySubtotal = showModal ? orderSubtotal : subtotal;
  const displayTotal = showModal ? orderTotal : total;

  return (
    <div className="min-h-screen bg-background">
      <CartHeader />
      <main className="container mx-auto px-6 py-10">
        {/* Progress Bar */}
        <div className="mb-10">
          <div className="flex items-center justify-between max-w-4xl mx-auto">
            {[{ number: 1, title: "Carrito", icon: Package }, { number: 2, title: "Dirección", icon: MapPin }, { number: 3, title: "Pago", icon: CreditCard }].map((step, index) => {
              const Icon = step.icon as any;
              const isActive = 3 >= step.number;
              const isCompleted = 3 > step.number;
              return (
                <div key={step.number} className="flex items-center flex-1">
                  <div className="flex flex-col items-center flex-1">
                    <div className={`w-14 h-14 rounded-full flex items-center justify-center transition-smooth ${isCompleted || isActive ? "bg-green-600 text-white shadow-lg" : "bg-muted text-muted-foreground"}`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <span className={`text-base mt-2 font-medium ${isActive ? "text-foreground" : "text-muted-foreground"}`}>{step.title}</span>
                  </div>
                  {index < 2 && <div className={`h-1 flex-1 mx-4 rounded-full transition-smooth ${isCompleted ? "bg-green-600" : "bg-muted"}`} />}
                </div>
              );
            })}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Payment form */}
          <div className="lg:col-span-2">
            <Card className="p-8 shadow-elegant">
              <h2 className="text-4xl font-extrabold mb-6 text-foreground">Método de Pago</h2>

              <RadioGroup value={metodoPago} onValueChange={(v: any) => setMetodoPago(v)} className="space-y-4 mb-6">
                <div className={`flex items-center space-x-4 p-4 border-2 rounded-lg ${metodoPago === "contraentrega" ? "border-green-500 bg-green-50" : "border-border"}`}>
                  <RadioGroupItem value="contraentrega" id="contraentrega" />
                  <Label htmlFor="contraentrega" className="flex items-center gap-3 cursor-pointer flex-1">
                    <CheckCircle2 className="h-6 w-6 text-foreground" />
                    <div>
                      <p className="font-semibold text-lg text-foreground">Contraentrega</p>
                      <p className="text-sm text-muted-foreground">Paga en efectivo al recibir tu pedido</p>
                    </div>
                  </Label>
                </div>

                <div className={`flex items-center space-x-4 p-4 border-2 rounded-lg ${metodoPago === "pse" ? "border-green-500 bg-green-50" : "border-border"}`}>
                  <RadioGroupItem value="pse" id="pse" />
                  <Label htmlFor="pse" className="flex items-center gap-3 cursor-pointer flex-1">
                    <Banknote className="h-6 w-6 text-foreground" />
                    <div>
                      <p className="font-semibold text-lg text-foreground">PSE (simulado)</p>
                      <p className="text-sm text-muted-foreground">Pago online simulado — el envío será gratis</p>
                    </div>
                  </Label>
                </div>
              </RadioGroup>

              {metodoPago === "pse" && (
                <div className="mb-6 p-4 border rounded-lg">
                  <Label className="font-medium">Banco</Label>
                  <Input value={pseInfo.banco} onChange={(e) => setPseInfo(prev => ({ ...prev, banco: e.target.value }))} placeholder="Banco de prueba" className="mb-3" />
                  <Label className="font-medium">Referencia</Label>
                  <Input value={pseInfo.referencia} onChange={(e) => setPseInfo(prev => ({ ...prev, referencia: e.target.value }))} placeholder="Ref12345" />
                  <p className="text-xs text-muted-foreground mt-2">Simulación: completa datos para proceder. El envío será descontado automáticamente.</p>
                </div>
              )}

              <h3 className="text-2xl font-semibold mb-3">Datos de entrega / contacto</h3>
              <div className="grid grid-cols-1 gap-3">
                <div>
                  <Label className="font-medium">Nombre</Label>
                  <Input value={contacto.nombre} onChange={(e) => setContacto(prev => ({ ...prev, nombre: e.target.value }))} />
                </div>
                <div>
                  <Label className="font-medium">Email</Label>
                  <Input value={contacto.email} onChange={(e) => setContacto(prev => ({ ...prev, email: e.target.value }))} />
                </div>
                <div>
                  <Label className="font-medium">Dirección (calle)</Label>
                  <Input value={contacto.direccion} onChange={(e) => setContacto(prev => ({ ...prev, direccion: e.target.value }))} />
                </div>
                <div>
                  <Label className="font-medium">Teléfono</Label>
                  <Input value={contacto.telefono} onChange={(e) => setContacto(prev => ({ ...prev, telefono: e.target.value }))} />
                </div>
              </div>

              {errors && <div className="mt-4 text-destructive">{errors}</div>}
            </Card>
          </div>

          {/* Order summary */}
          <div className="lg:col-span-1">
            <Card className="p-6 shadow-elegant sticky top-24 border-l-4 border-green-500">
              <h3 className="text-2xl font-bold mb-4 text-foreground">Resumen del Pedido</h3>

              <div className="space-y-4 mb-6">
                <div className="flex flex-col gap-3 max-h-56 overflow-auto mb-2">
                  {displayItems.length === 0 ? (
                    <div className="text-sm text-muted-foreground">No hay productos en el carrito</div>
                  ) : (
                    displayItems.map(ci => (
                      <div key={ci.id} className="flex justify-between items-center">
                        <div className="flex-1">
                          <div className="font-medium text-base">{ci.nombre}</div>
                          <div className="text-sm text-muted-foreground">x{ci.cantidad}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-mono font-semibold text-lg">{fmt.format(ci.precio * ci.cantidad)}</div>
                          <div className="text-xs text-muted-foreground">{fmt.format(ci.precio)} c/u</div>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <div className="flex justify-between text-lg">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-mono font-semibold">{fmt.format(displaySubtotal)}</span>
                </div>

                <div className="flex justify-between text-lg">
                  <span className="text-muted-foreground">Envío</span>
                  <span className="text-green-600 font-semibold">Gratis</span>
                </div>

                <div className="h-px bg-border my-4"></div>

                <div className="flex justify-between text-2xl font-extrabold">
                  <span>Total</span>
                  <span className="text-green-600 font-mono">{fmt.format(displayTotal)}</span>
                </div>
              </div>

              <Button disabled={isProcessing} className="w-full bg-green-600 hover:bg-green-700 text-white shadow-medium mb-3" onClick={handleProcesarPago}>
                {isProcessing ? "Procesando..." : `Pagar ${fmt.format(displayTotal)}`}
              </Button>

              <Link to="/direccion"><Button variant="outline" className="w-full">Editar Dirección</Button></Link>

              <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 rounded-lg">
                <p className="text-green-700 text-sm text-center">Tu pedido será entregado entre 2 horas y 2 días hábiles. Mantente pendiente del número de contacto proporcionado.</p>
              </div>
            </Card>
          </div>
        </div>
      </main>

      <Footer />

      {/* Modal / Factura — usa orderSnapshot (inmutable) */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="sm:max-w-[560px] p-0 overflow-hidden border-0">
          <div className="relative bg-white dark:bg-card rounded-lg overflow-hidden">
            <div className="bg-gradient-to-br from-green-600 to-green-700 p-8 text-center">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-white rounded-full mb-4 shadow-elegant">
                <CheckCircle2 className="h-14 w-14 text-green-600" />
              </div>
              <h2 className="text-4xl font-extrabold text-white mb-2">¡Gracias por comprar!</h2>
              <p className="text-green-100">Tu pedido se ha registrado con éxito.</p>
            </div>

            <div className="p-6">
              <p className="font-medium mb-1">Número de pedido: <span className="font-mono font-semibold">{orderId}</span></p>
              <p className="text-sm text-muted-foreground mb-4">Fecha de pedido: <span className="font-mono">{orderDate ? new Date(orderDate).toLocaleString() : "-"}</span></p>

              <div className="mt-2 mb-4">
                <p className="font-semibold mb-1">Detalles de entrega</p>
                <p className="text-lg">{orderContactoSnapshot?.nombre ?? contacto.nombre}</p>
                <p className="text-sm text-muted-foreground">{orderContactoSnapshot?.email ?? contacto.email}</p>
                <p className="text-sm">{orderContactoSnapshot?.direccion ?? contacto.direccion}</p>
                <p className="text-sm">{orderContactoSnapshot?.telefono ?? contacto.telefono}</p>
              </div>

              <div className="mt-2">
                <p className="font-semibold mb-2">Resumen</p>
                {(orderSnapshot || []).map(ci => (
                  <div key={ci.id} className="flex justify-between text-base">
                    <span>{ci.nombre} x{ci.cantidad}</span>
                    <span className="font-mono">{fmt.format(ci.precio * ci.cantidad)}</span>
                  </div>
                ))}
                <div className="flex justify-between font-bold mt-3 text-lg"><span>Subtotal</span><span className="font-mono">{fmt.format(orderSubtotal)}</span></div>
                <div className="flex justify-between font-bold mt-1 text-lg"><span>Envío</span><span className="font-mono">Gratis</span></div>
                <div className="flex justify-between font-bold mt-3 text-xl"><span>Total</span><span className="font-mono">{fmt.format(orderTotal)}</span></div>
              </div>

              <div className="mt-6">
                <Button className="w-full bg-green-600 text-white" onClick={() => { setShowModal(false); navigate("/"); }}>
                  Aceptar
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Pago;