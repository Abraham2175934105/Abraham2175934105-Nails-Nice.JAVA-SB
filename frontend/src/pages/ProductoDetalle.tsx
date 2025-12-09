import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ShoppingCart, ArrowLeft, CheckCircle2, Package, TruckIcon } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import apiProductos from "@/lib/apiProductos";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";

const ProductoDetalle = () => {
  const { id } = useParams();
  const [cantidad, setCantidad] = useState(1);
  const [producto, setProducto] = useState<any | null>(null);
  const navigate = useNavigate();
  const cart = useCart();
  const { token } = useAuth();

  useEffect(() => {
    void (async () => {
      try {
        if (id) {
          const p = await apiProductos.fetchProductoById(Number(id));
          // normalizar campos que pueden venir con nombres distintos desde backend
          const normalized = {
            id_producto: p.id_producto ?? p.id ?? p.productoId ?? p.producto?.id,
            nombre: p.nombre ?? p.nombre_producto ?? p.producto?.nombre ?? "Producto",
            precio: Number(p.precio ?? p.precio_unitario ?? p.precioUnitario ?? p.price ?? 0),
            precioAnterior: p.precioAnterior ?? p.precio_anterior ?? p.precio_ant ?? null,
            descripcion: p.descripcion ?? p.descripcion_larga ?? p.producto?.descripcion ?? "",
            imagen: p.imagen ?? p.url ?? p.producto?.imagen ?? "",
            stock: Number(p.stock ?? p.cantidad ?? p.stock_producto ?? 0),
            nombre_categoria: p.nombre_categoria ?? p.categoria ?? p.producto?.categoria ?? "General",
            marca: p.marca ?? p.marca_producto ?? p.producto?.marca ?? "No especificado",
            color: p.color ?? p.color_producto ?? p.producto?.color ?? "No especificado",
            nuevo: p.nuevo ?? p.esNuevo ?? false,
            // mantener el objeto original para cualquier otro uso
            raw: p
          };
          setProducto(normalized);
        }
      } catch (err) {
        console.error("Error cargando producto", err);
      }
    })();
  }, [id]);

  if (!producto) return <div className="min-h-screen"><Header /><main className="container mx-auto px-4 py-8">Cargando...</main><Footer /></div>;

  const addToCart = async () => {
    if (!token) return navigate("/login");
    await cart.add({
      idProducto: Number(producto.id_producto ?? producto.id),
      nombre: producto.nombre,
      precio: Number(producto.precio ?? 0),
      cantidad,
      imagen: producto.imagen
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
          <Link to="/" className="hover:text-foreground">Inicio</Link><span>/</span>
          <Link to="/productos" className="hover:text-foreground">Productos</Link><span>/</span>
          <span className="text-foreground">{producto.nombre}</span>
        </div>

        <Link to="/productos" className="inline-flex items-center gap-2 text-foreground hover:text-secondary mb-6">
          <ArrowLeft className="h-4 w-4" /><span className="font-medium">Volver a Productos</span>
        </Link>

        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          <div className="relative rounded-2xl overflow-hidden shadow-elegant hover:shadow-glow transition-smooth">
            <img src={producto.imagen} alt={producto.nombre} className="w-full h-auto max-h-[500px] object-contain" />
            {producto.nuevo && <Badge className="absolute top-4 left-4 gradient-accent shadow-medium font-bold px-4 py-2">Nuevo</Badge>}
          </div>

          <div className="space-y-6">
            <div>
              <Badge className="mb-3">{producto.nombre_categoria}</Badge>
              <h1 className="text-4xl font-bold text-foreground mb-4">{producto.nombre}</h1>

              <div className="flex items-baseline gap-3 mb-6">
                <span className="text-4xl font-bold text-green-600">${Number(producto.precio).toLocaleString()}</span>
                {producto.precioAnterior && <span className="text-xl text-muted-foreground line-through">${Number(producto.precioAnterior).toLocaleString()}</span>}
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="text-xl font-semibold mb-3 text-foreground">Descripción</h3>
              <p className="text-foreground/80 leading-relaxed">{producto.descripcion}</p>
            </div>

            <Separator />

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-accent/30 rounded-lg"><p className="text-sm text-muted-foreground mb-1">Marca</p><p className="font-semibold text-foreground">{producto.marca}</p></div>
              <div className="p-4 bg-accent/30 rounded-lg"><p className="text-sm text-muted-foreground mb-1">Color</p><p className="font-semibold text-foreground">{producto.color}</p></div>
            </div>

            <Separator />

            <div className="flex items-center gap-2">
              {producto.stock > 0 ? (
                <>
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  <span className="text-green-600 font-semibold">Cantidad disponible: {producto.stock}</span>
                </>
              ) : (
                <><Package className="h-5 w-5 text-destructive" /><span className="text-destructive font-semibold">Agotado</span></>
              )}
            </div>

            <Card className="p-6 shadow-medium">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Cantidad</label>
                  <div className="flex items-center gap-3">
                    <Button variant="outline" size="icon" onClick={() => setCantidad(Math.max(1, cantidad - 1))} disabled={cantidad <= 1}>-</Button>
                    <span className="text-lg font-semibold w-12 text-center">{cantidad}</span>
                    <Button variant="outline" size="icon" onClick={() => setCantidad(Math.min(producto.stock, cantidad + 1))} disabled={cantidad >= producto.stock}>+</Button>
                  </div>
                </div>

                <Button className="w-full bg-green-600 hover:bg-green-700 text-white shadow-medium py-6 text-lg" disabled={producto.stock === 0} onClick={addToCart}>
                  <ShoppingCart className="h-5 w-5 mr-2" />Agregar al Carrito
                </Button>

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <TruckIcon className="h-4 w-4" />
                  <span>Envío gratis en compras superiores a $50.000</span>
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

export default ProductoDetalle;