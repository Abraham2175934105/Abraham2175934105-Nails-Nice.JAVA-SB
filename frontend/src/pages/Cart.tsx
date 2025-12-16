import { useEffect } from "react";
import { Trash2, Plus, Minus, ArrowRight, Package, CreditCard, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Link, useNavigate } from "react-router-dom";
import CartHeader from "@/components/CartHeader";
import Footer from "@/components/Footer";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";

const Cart = () => {
  // renombramos el total del contexto para evitar colisiones con el total del pedido
  const { items, remove, updateQty, count, total: ctxTotal, sync } = useCart();
  const navigate = useNavigate();
  const toast = useToast().toast;

  useEffect(() => {
    void sync();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const steps = [
    { number: 1, title: "Carrito", icon: Package },
    { number: 2, title: "Dirección", icon: MapPin },
    { number: 3, title: "Pago", icon: CreditCard }
  ];
  const currentStep = 1;

  // normalizamos items a la forma que usa la UI
  const cartItems = (items || []).map((it) => {
    const anyIt = it as any;
    return {
      id: it.id ?? it.idProducto,
      name: it.nombre ?? anyIt.name ?? "",
      price: Number(anyIt.precio ?? anyIt.precioUnitario ?? it.precio ?? 0),
      oldPrice: undefined as number | undefined,
      quantity: Number(anyIt.cantidad ?? anyIt.cantidad_producto ?? it.cantidad ?? 1),
      image: it.imagen ?? anyIt.image ?? "",
      category: anyIt.categoria ?? anyIt.category ?? ""
    };
  });

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 50000 ? 0 : 5.99;
  const orderTotal = subtotal + shipping;

  const hasItems = cartItems.length > 0;

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
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center transition-smooth ${
                        isCompleted || isActive
                          ? "bg-green-500 text-white shadow-glow"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      <Icon className="h-6 w-6" />
                    </div>
                    <span className={`text-sm mt-2 font-medium ${isActive ? "text-foreground" : "text-muted-foreground"}`}>
                      {step.title}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`h-1 flex-1 mx-4 rounded-full transition-smooth ${
                      isCompleted ? "bg-green-500" : "bg-muted"
                    }`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <Card className="p-6 shadow-elegant">
              <h2 className="text-2xl font-bold mb-6 text-foreground">Tu Carrito</h2>

              {cartItems.length === 0 ? (
                <div className="text-center py-12">
                  <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground mb-4">Tu carrito está vacío</p>
                  <Link to="/productos">
                    <Button variant="default" className="shadow-medium">
                      Explorar Productos
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex gap-4 p-4 rounded-lg border border-border hover:shadow-medium transition-smooth">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-24 h-24 object-cover rounded-lg"
                      />

                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="font-semibold text-foreground">{item.name}</h3>
                            <p className="text-sm text-muted-foreground">{item.category}</p>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => void remove(item.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>

                        <div className="flex justify-between items-center mt-4">
                          <div className="flex items-center gap-3">
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => void updateQty(item.id, Math.max(1, item.quantity - 1))}
                              className="h-8 w-8"
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <span className="font-medium w-8 text-center">{item.quantity}</span>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => void updateQty(item.id, item.quantity + 1)}
                              className="h-8 w-8"
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>

                          <div className="text-right">
                            {item.oldPrice && (
                              <p className="text-sm text-muted-foreground line-through">
                                ${item.oldPrice!.toFixed(2)}
                              </p>
                            )}
                            <p className="text-lg font-bold text-primary">
                              ${(item.price * item.quantity).toFixed(2)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="p-6 shadow-elegant sticky top-24">
              <h3 className="text-xl font-bold mb-6 text-foreground">Resumen del Pedido</h3>

              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Envío</span>
                  <span className={shipping === 0 ? "text-green-600 font-semibold" : ""}>
                    {shipping === 0 ? "Gratis" : `$${shipping.toFixed(2)}`}
                  </span>
                </div>
                {subtotal > 50000 && (
                  <p className="text-sm text-green-600 font-semibold">¡Envío gratis aplicado! 🎉</p>
                )}
              </div>

              <Separator className="my-4" />

              <div className="flex justify-between text-lg font-bold mb-6">
                <span>Total</span>
                <span className="text-green-600 text-2xl">${orderTotal.toFixed(2)}</span>
              </div>

              <div className="space-y-3">
                {/* Botón Continuar ahora usa navigate en onClick para evitar que Link navegue aun si está deshabilitado */}
                <Button 
                  className="w-full shadow-medium hover:shadow-glow flex items-center justify-center"
                  disabled={!hasItems}
                  onClick={() => {
                    if (hasItems) {
                      navigate("/direccion");
                    } else {
                      toast({
                        title: "Carrito vacío",
                        description: "Agrega productos al carrito antes de continuar.",
                        variant: "default",
                      });
                    }
                  }}
                >
                  Continuar
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>

                <Link to="/productos" className="block">
                  <Button variant="outline" className="w-full">
                    Seguir Comprando
                  </Button>
                </Link>
              </div>

              <div className="mt-6 p-6 bg-green-50 dark:bg-green-900/20 border-2 border-green-500 rounded-lg shadow-medium">
                <div className="flex items-center justify-center gap-3">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-2xl">🔒</span>
                  </div>
                  <div>
                    <p className="text-green-700 dark:text-green-400 font-bold text-lg">
                      Pago 100% Seguro
                    </p>
                    <p className="text-green-600 dark:text-green-500 text-sm">
                      Tus datos están protegidos
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Cart;