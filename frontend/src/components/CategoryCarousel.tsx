import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import apiProductos from "@/lib/apiProductos";

// importa tus imágenes desde assets
import catEsmaltes1 from "@/assets/category-esmaltes-1.jpg";
import catEsmaltes2 from "@/assets/category-esmaltes-2.jpg";
import catDecor1 from "@/assets/category-decoraciones-1.jpg";
import catDecor2 from "@/assets/category-decoraciones-2.jpg";
import catHerr1 from "@/assets/category-herramientas-1.jpg";
import catHerr2 from "@/assets/category-herramientas-2.jpg";
import catTrat1 from "@/assets/category-tratamientos-1.jpg";
import catTrat2 from "@/assets/category-tratamientos-2.jpg";
import catAcc1 from "@/assets/category-accesorios-1.jpg";
import catAcc2 from "@/assets/category-accesorios-2.jpg";

const fallbackCategories = [
  { id: "esmaltes", name: "Esmaltes", images: [catEsmaltes1, catEsmaltes2] },
  { id: "decoraciones", name: "Decoraciones", images: [catDecor1, catDecor2] },
  { id: "herramientas", name: "Herramientas", images: [catHerr1, catHerr2] },
  { id: "tratamientos", name: "Tratamientos", images: [catTrat1, catTrat2] },
  { id: "accesorios", name: "Accesorios", images: [catAcc1, catAcc2] },
];

const CategoryCarousel = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    void (async () => {
      try {
        const data = await apiProductos.fetchCategorias();
        const mapped = Array.isArray(data)
          ? data.map((c: any, i: number) => ({
              id: c.id_categoria ?? c.id ?? c.idCategoria ?? c.id,
              name: c.nombreCategoria ?? c.nombre_categoria ?? c.nombre ?? c.name ?? String(c.id ?? `cat-${i}`),
              image:
                // intenta escoger imagen según nombre de categoría si coincide con fallback
                (fallbackCategories.find(fc => fc.name.toLowerCase() === (c.nombreCategoria ?? c.nombre ?? "").toLowerCase())?.images[0])
                || fallbackCategories[i % fallbackCategories.length].images[0],
            }))
          : [];
        if (mapped.length === 0) throw new Error("No categories");
        setCategories(mapped);
      } catch (err) {
        // fallback estético con imágenes locales si backend falla o no hay categorías
        setCategories(fallbackCategories.map((c) => ({ id: c.id, name: c.name, image: c.images[0] })));
      }
    })();
  }, []);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 320;
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  // Al hacer click enviamos el id de la categoría (más fiable): /productos?categoryId=123
  const goToCategory = (cat: any) => {
    navigate(`/productos?categoryId=${encodeURIComponent(String(cat.id))}`);
  };

  return (
    <section id="productos" className="py-16 gradient-soft">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-3xl font-bold mb-2">Explora por Categoría</h3>
            <p className="text-muted-foreground">Encuentra exactamente lo que buscas</p>
          </div>

          <div className="hidden md:flex gap-2">
            <Button variant="outline" size="icon" onClick={() => scroll("left")}>
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button variant="outline" size="icon" onClick={() => scroll("right")}>
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <div ref={scrollContainerRef} className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth pb-4">
          {categories.map((category, index) => (
            <div
              key={category.id ?? index}
              className="min-w-[280px] group cursor-pointer animate-fade-in"
              onClick={() => goToCategory(category)}
              style={{ animationDelay: `${index * 0.06}s` }}
            >
              <div className="relative overflow-hidden rounded-xl shadow-medium hover:shadow-deep transition-smooth hover:-translate-y-2">
                <div className="aspect-[16/12] relative">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-smooth duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent opacity-60 group-hover:opacity-70 transition-smooth" />
                </div>

                <div className="absolute bottom-4 left-4 right-4 p-4 text-white">
                  <h4 className="text-2xl font-bold mb-1">{category.name}</h4>
                </div>

                <div className="absolute top-4 right-4 bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-semibold shadow-glow opacity-0 group-hover:opacity-100 transition-smooth">
                  Ver Todo
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryCarousel;