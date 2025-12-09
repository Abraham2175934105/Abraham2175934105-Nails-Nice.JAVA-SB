import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Grid, List, LayoutGrid, ShoppingCart, Eye, X } from "lucide-react";
import apiProductos from "@/lib/apiProductos";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const Productos = () => {
  const [vistaActual, setVistaActual] = useState<"grid" | "list" | "mosaic">("grid");
  const [mostrarFiltros, setMostrarFiltros] = useState(true);
  const [productos, setProductos] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const query = useQuery();
  const navigate = useNavigate();
  const { token } = useAuth();
  const cart = useCart();

  const q = query.get("q") ?? "";
  const categoryIdParam = query.get("categoryId") ?? "";
  const categoryNameParam = query.get("category") ?? "";
  const colorParam = query.get("color") ?? "";
  const min = query.get("min") ?? "";
  const max = query.get("max") ?? "";

  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<string>(categoryNameParam || "Todas");
  const [colorSeleccionado, setColorSeleccionado] = useState<string>(colorParam || "Todos");
  const [marcaSeleccionada, setMarcaSeleccionada] = useState<string>("Todas");
  const [unidadSeleccionada, setUnidadSeleccionada] = useState<string>("Todas");
  const [ordenPrecio, setOrdenPrecio] = useState("relevancia");
  const [rangoPrecio, setRangoPrecio] = useState<number[]>([Number(min) || 0, Number(max) || 120000]);

  const [categoriasBackend, setCategoriasBackend] = useState<any[]>([]);
  const [coloresBackend, setColoresBackend] = useState<any[]>([]);
  const [marcasBackend, setMarcasBackend] = useState<any[]>([]);
  const [unidadesBackend, setUnidadesBackend] = useState<any[]>([]);

  useEffect(() => {
    void (async () => {
      try {
        const [cats, cols, marcas, unidades] = await Promise.all([
          apiProductos.fetchCategorias().catch(() => []),
          apiProductos.getColores().catch(() => []),
          apiProductos.getMarcas().catch(() => []),
          apiProductos.getUnidades().catch(() => []),
        ]);
        const mappedCats = Array.isArray(cats) ? cats.map((c:any) => ({
          id: c.id_categoria ?? c.id ?? c.idCategoria ?? c.id,
          name: c.nombreCategoria ?? c.nombre_categoria ?? c.nombre ?? c.name
        })) : [];
        setCategoriasBackend(mappedCats);

        const mappedCols = Array.isArray(cols) ? cols.map((c:any) => ({
          id: c.id_color ?? c.id ?? c.idColor ?? c.id,
          name: c.nombre_color ?? c.nombreColor ?? c.nombre ?? c.name
        })) : [];
        setColoresBackend(mappedCols);

        const mappedMarcas = Array.isArray(marcas) ? marcas.map((m:any) => ({
          id: m.id_marca ?? m.id ?? m.idMarca ?? m.id,
          name: m.nombre_marca ?? m.nombreMarca ?? m.nombre ?? m.name
        })) : [];
        setMarcasBackend(mappedMarcas);

        const mappedUnidades = Array.isArray(unidades) ? unidades.map((u:any) => ({
          id: u.id_unidad ?? u.id ?? u.idUnidad ?? u.id,
          name: u.nombre_medida ?? u.nombreMedida ?? u.nombre ?? u.name
        })) : [];
        setUnidadesBackend(mappedUnidades);

        if (categoryIdParam && (!categoryNameParam || categoryNameParam === "")) {
          const asNum = Number(categoryIdParam);
          if (!Number.isNaN(asNum)) {
            const found = mappedCats.find(m => Number(m.id) === asNum);
            if (found) setCategoriaSeleccionada(found.name);
          }
        }
      } catch (err) {
        console.warn("Error cargando listas para filtros", err);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetch = async () => {
    setLoading(true);
    try {
      const params: any = {};
      if (q) params.q = q;
      if (categoryIdParam) {
        const asNumber = Number(categoryIdParam);
        if (!Number.isNaN(asNumber)) params.categoryId = asNumber;
      } else if (categoryNameParam) {
        params.categoryName = categoryNameParam;
      }
      if (colorParam && colorParam !== "Todos") params.color = colorParam;
      if (rangoPrecio) { params.minPrice = rangoPrecio[0]; params.maxPrice = rangoPrecio[1]; }

      const data = await apiProductos.fetchProductos(params);
      setProductos(Array.isArray(data) ? data : []);

      console.debug("Productos (muestra):", Array.isArray(data) ? data.slice(0,5) : data);
      if (Array.isArray(data)) {
        const cats = Array.from(new Set(data.map((p:any) => (p.categoriaNombre ?? p.categoria ?? p.nombre_categoria ?? "").toString()).filter(Boolean)));
        const cols = Array.from(new Set(data.map((p:any) => (p.colorNombre ?? p.color ?? p.nombre_color ?? "").toString()).filter(Boolean)));
        const marcas = Array.from(new Set(data.map((p:any) => (p.marcaNombre ?? p.marca ?? "").toString()).filter(Boolean)));
        console.debug("Categorias en productos:", cats);
        console.debug("Colores en productos:", cols);
        console.debug("Marcas en productos:", marcas);
      }
    } catch (err) {
      console.error("Error al obtener productos", err);
      setProductos([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void fetch(); }, [q, categoryIdParam, categoryNameParam, colorParam, rangoPrecio]);

  const categorias = useMemo(() => ["Todas", ...categoriasBackend.map(c => c.name).filter(Boolean)], [categoriasBackend]);
  const colores = useMemo(() => ["Todos", ...coloresBackend.map(c => c.name).filter(Boolean)], [coloresBackend]);
  const marcas = useMemo(() => ["Todas", ...marcasBackend.map(m => m.name).filter(Boolean)], [marcasBackend]);
  const unidades = useMemo(() => ["Todas", ...unidadesBackend.map(u => u.name).filter(Boolean)], [unidadesBackend]);

  const productosFiltrados = productos
    .filter(p => {
      if (!p) return false;
      const name = (p.nombre ?? p.name ?? "").toString().toLowerCase();
      if (q && !name.includes(q.toLowerCase())) return false;

      if (categoriaSeleccionada && categoriaSeleccionada !== "Todas") {
        const catName = (p.categoriaNombre ?? p.categoria ?? p.nombre_categoria ?? "").toString().toLowerCase();
        if (!catName.includes(categoriaSeleccionada.toLowerCase())) return false;
      }
      if (colorSeleccionado && colorSeleccionado !== "Todos") {
        const colorName = (p.colorNombre ?? p.color ?? p.nombre_color ?? "").toString().toLowerCase();
        if (!colorName.includes(colorSeleccionado.toLowerCase())) return false;
      }
      if (marcaSeleccionada && marcaSeleccionada !== "Todas") {
        const marcaName = (p.marcaNombre ?? p.marca ?? "").toString().toLowerCase();
        if (!marcaName.includes(marcaSeleccionada.toLowerCase())) return false;
      }
      if (unidadSeleccionada && unidadSeleccionada !== "Todas") {
        const unidadName = (p.unidadMedidaNombre ?? p.unidad_medida ?? "").toString().toLowerCase();
        if (!unidadName.includes(unidadSeleccionada.toLowerCase())) return false;
      }

      const price = Number(p.precio ?? p.price ?? p.precio_venta ?? (p.precio?.toString && Number(p.precio.toString())) ?? 0);
      if (price < rangoPrecio[0] || price > rangoPrecio[1]) return false;
      return true;
    })
    .sort((a,b) => {
      if (ordenPrecio === "menor") return (Number(a.precio ?? a.price) - Number(b.precio ?? b.price));
      if (ordenPrecio === "mayor") return (Number(b.precio ?? b.price) - Number(a.precio ?? a.price));
      return 0;
    });

  const handleAdd = async (producto: any) => {
    if (!token) return navigate("/login");
    try {
      await cart.add({
        idProducto: Number(producto.id_producto ?? producto.id ?? producto.idProducto ?? producto.id),
        nombre: producto.nombre ?? producto.name,
        precio: Number(producto.precio ?? producto.price ?? 0),
        cantidad: 1,
        imagen: producto.imagen ?? producto.imagen_url ?? producto.image
      });
    } catch (err) {
      console.error("No se pudo agregar al carrito", err);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-heading font-bold text-foreground mb-2">Nuestros Productos</h1>
          <p className="text-muted-foreground">Descubre nuestra colección de productos premium</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          <aside className={`lg:w-64 ${mostrarFiltros ? 'block' : 'hidden lg:block'}`}>
            <Card className="sticky top-24 shadow-medium">
              <CardContent className="p-6 space-y-6">
                <div className="flex items-center justify-between lg:hidden mb-4">
                  <h3 className="font-heading font-semibold text-lg">Filtros</h3>
                  <Button variant="ghost" size="icon" onClick={() => setMostrarFiltros(false)}>
                    <X className="h-5 w-5" />
                  </Button>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Categoría</label>
                  <Select value={categoriaSeleccionada} onValueChange={(v:any) => {
                    setCategoriaSeleccionada(v);
                    const found = categoriasBackend.find(c => String(c.name) === String(v));
                    if (found) navigate(`/productos?categoryId=${found.id}`);
                    else navigate(`/productos?category=${encodeURIComponent(v)}`);
                  }}>
                    <SelectTrigger className="w-full"><SelectValue placeholder="Seleccionar" /></SelectTrigger>
                    <SelectContent>
                      {categorias.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Color</label>
                  <Select value={colorSeleccionado} onValueChange={setColorSeleccionado}>
                    <SelectTrigger className="w-full"><SelectValue placeholder="Seleccionar" /></SelectTrigger>
                    <SelectContent>
                      {colores.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Marca</label>
                  <Select value={marcaSeleccionada} onValueChange={setMarcaSeleccionada}>
                    <SelectTrigger className="w-full"><SelectValue placeholder="Seleccionar" /></SelectTrigger>
                    <SelectContent>
                      {marcas.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Unidad</label>
                  <Select value={unidadSeleccionada} onValueChange={setUnidadSeleccionada}>
                    <SelectTrigger className="w-full"><SelectValue placeholder="Seleccionar" /></SelectTrigger>
                    <SelectContent>
                      {unidades.map(u => <SelectItem key={u} value={u}>{u}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Rango de Precio: ${rangoPrecio[0].toLocaleString()} - ${rangoPrecio[1].toLocaleString()}</label>
                  <Slider min={0} max={120000} step={5000} value={rangoPrecio} onValueChange={setRangoPrecio} className="mt-4" />
                </div>

                <Button variant="outline" className="w-full" onClick={() => {
                  setCategoriaSeleccionada("Todas");
                  setColorSeleccionado("Todos");
                  setMarcaSeleccionada("Todas");
                  setUnidadSeleccionada("Todas");
                  setRangoPrecio([0,120000]);
                  setOrdenPrecio("relevancia");
                  navigate("/productos");
                }}>Limpiar Filtros</Button>
              </CardContent>
            </Card>
          </aside>

          <div className="flex-1">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className={`lg:hidden ${vistaActual === 'grid' ? 'bg-accent' : ''}`} onClick={() => setMostrarFiltros(!mostrarFiltros)}>Filtros</Button>
                <span className="text-sm text-muted-foreground">{productosFiltrados.length} productos encontrados</span>
              </div>

              <div className="flex items-center gap-4">
                <Select value={ordenPrecio} onValueChange={setOrdenPrecio}>
                  <SelectTrigger className="w-40"><SelectValue placeholder="Ordenar por" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="relevancia">Relevancia</SelectItem>
                    <SelectItem value="menor">Menor precio</SelectItem>
                    <SelectItem value="mayor">Mayor precio</SelectItem>
                  </SelectContent>
                </Select>

                <div className="flex gap-1 border border-border rounded-md p-1">
                  <Button variant={vistaActual === "grid" ? "secondary" : "ghost"} size="icon" onClick={() => setVistaActual("grid")} className="h-8 w-8"><Grid className="h-4 w-4" /></Button>
                  <Button variant={vistaActual === "list" ? "secondary" : "ghost"} size="icon" onClick={() => setVistaActual("list")} className="h-8 w-8"><List className="h-4 w-4" /></Button>
                  <Button variant={vistaActual === "mosaic" ? "secondary" : "ghost"} size="icon" onClick={() => setVistaActual("mosaic")} className="h-8 w-8"><LayoutGrid className="h-4 w-4" /></Button>
                </div>
              </div>
            </div>

            <div className={`
              ${vistaActual === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" : ""}
              ${vistaActual === "list" ? "flex flex-col gap-4" : ""}
              ${vistaActual === "mosaic" ? "grid grid-cols-2 lg:grid-cols-4 gap-4" : ""}
            `}>
              {productosFiltrados.map((producto:any) => {
                const id = producto.id_producto ?? producto.id ?? producto.idProducto ?? producto.id;
                return (
                <Card key={id} className={`overflow-hidden hover-lift shadow-soft ${vistaActual === "list" ? "flex flex-row" : "flex flex-col"}`}>
                  <div className={`relative ${vistaActual === "list" ? "w-48" : "w-full"}`}>
                    <img src={producto.imagen ?? producto.imagen_url ?? producto.image} alt={producto.nombre} className={`w-full object-cover ${vistaActual === "mosaic" ? "h-40" : "h-56"}`} />
                    {producto.descuento && (<div className="absolute top-0 right-0"><div className="absolute transform rotate-45 bg-destructive text-white text-center font-bold py-1 right-[-35px] top-[18px] w-[120px]">-{producto.descuento}%</div></div>)}
                    {producto.nuevo && (<Badge className="absolute top-2 left-2 gradient-accent shadow-medium">Nuevo</Badge>)}
                  </div>

                  <CardContent className={`p-4 flex-1 ${vistaActual === "list" ? "flex flex-col justify-center" : ""}`}>
                    <h3 className="font-heading font-semibold text-lg mb-2">{producto.nombre}</h3>
                    <p className="text-sm text-muted-foreground mb-3">{producto.categoriaNombre ?? producto.nombre_categoria ?? producto.categoria}</p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-bold text-foreground">${Number(producto.precio).toLocaleString()}</span>
                      {producto.precioAnterior && <span className="text-sm text-muted-foreground line-through">${Number(producto.precioAnterior).toLocaleString()}</span>}
                    </div>
                  </CardContent>

                  <CardFooter className="p-4 pt-0 gap-2 flex-row">
                    <Button className="flex-1 gradient-primary shadow-soft hover:shadow-glow hover-scale transition-smooth" onClick={() => handleAdd(producto)}>
                      <ShoppingCart className="h-4 w-4 mr-1" />Agregar
                    </Button>

                    {/* LINK CORREGIDO: apunta a /productos/:id */}
                    <Link to={`/productos/${id}`} className="flex-1">
                      <Button variant="outline" className="w-full hover-scale border-2 transition-smooth"><Eye className="h-4 w-4 mr-1" />Ver más</Button>
                    </Link>
                  </CardFooter>
                </Card>
              )})}
            </div>

            {productosFiltrados.length === 0 && <div className="text-center py-12">No se encontraron productos con los filtros seleccionados.</div>}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Productos;