import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRef } from "react";
import categoryMakeup from "@/assets/category-makeup.jpg";
import categorySkincare from "@/assets/category-skincare.jpg";
import categoryNails from "@/assets/category-nails.jpg";
import categoryAccessories from "@/assets/category-accessories.jpg";

const categories = [
  {
    id: 1,
    name: "Maquillaje",
    image: categoryMakeup,
    description: "Productos premium para tu look perfecto",
    itemCount: "150+ productos"
  },
  {
    id: 2,
    name: "Cuidado Facial",
    image: categorySkincare,
    description: "Tratamientos para una piel radiante",
    itemCount: "80+ productos"
  },
  {
    id: 3,
    name: "Uñas",
    image: categoryNails,
    description: "Todo para unas uñas perfectas",
    itemCount: "120+ productos"
  },
  {
    id: 4,
    name: "Accesorios",
    image: categoryAccessories,
    description: "Herramientas profesionales de belleza",
    itemCount: "90+ productos"
  }
];

const CategoryCarousel = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 320;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
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
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => scroll('left')}
              className="shadow-soft hover:shadow-medium transition-smooth"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => scroll('right')}
              className="shadow-soft hover:shadow-medium transition-smooth"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <div 
          ref={scrollContainerRef}
          className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth pb-4"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {categories.map((category, index) => (
            <div
              key={category.id}
              className="min-w-[280px] group cursor-pointer animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="relative overflow-hidden rounded-xl shadow-medium hover:shadow-deep transition-smooth hover:-translate-y-2">
                <div className="aspect-square relative">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-smooth duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent opacity-60 group-hover:opacity-80 transition-smooth" />
                </div>
                
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <h4 className="text-2xl font-bold mb-2">{category.name}</h4>
                  <p className="text-sm opacity-90 mb-1">{category.description}</p>
                  <p className="text-xs text-primary-glow font-medium">{category.itemCount}</p>
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
