import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import productLipstick from "@/assets/product-lipstick.png";
import productCream from "@/assets/product-cream.png";
import productNailPolish from "@/assets/product-nailpolish.png";

const products = [
  {
    id: 1,
    image: productLipstick,
    category: "Maquillaje Premium",
    title: "Labiales de Alta Pigmentación",
    description: "Descubre nuestra colección exclusiva de labiales con pigmentos ultra intensos y acabado sedoso. Fórmulas de larga duración que cuidan tus labios mientras realzan tu belleza natural con colores vibrantes.",
    features: ["Larga duración", "Hidratación profunda", "Colores intensos"],
  },
  {
    id: 2,
    image: productCream,
    category: "Cuidado Facial",
    title: "Cremas Nutritivas y Rejuvenecedoras",
    description: "Tratamientos faciales premium con ingredientes naturales que transforman tu piel. Hidratación profunda, anti-edad y restauración celular para una piel radiante y saludable.",
    features: ["Anti-edad", "Hidratación 24h", "Ingredientes naturales"],
  },
  {
    id: 3,
    image: productNailPolish,
    category: "Esmaltes Profesionales",
    title: "Esmaltes de Uñas de Salón",
    description: "Acabados profesionales desde casa con nuestra línea de esmaltes premium. Secado rápido, brillo intenso y durabilidad excepcional en una amplia gama de colores modernos.",
    features: ["Secado rápido", "Acabado brillante", "Ultra resistente"],
  },
];

const FeaturedProducts = () => {
  return (
    <section className="py-20 bg-gradient-soft">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Productos Destacados
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Explora nuestras categorías premium con productos cuidadosamente seleccionados
          </p>
        </div>

        <div className="space-y-32">
          {products.map((product, index) => (
            <div
              key={product.id}
              className={`flex flex-col ${
                index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
              } gap-12 items-center animate-fade-in`}
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              {/* Producto flotante */}
              <div className="w-full md:w-1/2 flex justify-center">
                <div className="relative group">
                  <div className="absolute inset-0 bg-primary/20 rounded-full blur-3xl group-hover:blur-4xl transition-all duration-500 animate-pulse" />
                  <img
                    src={product.image}
                    alt={product.title}
                    className="relative w-80 h-80 object-contain hover-lift animate-scale-in drop-shadow-2xl"
                  />
                </div>
              </div>

              {/* Contenido */}
              <div className="w-full md:w-1/2 space-y-6">
                <div>
                  <span className="text-sm font-medium text-primary uppercase tracking-wide">
                    {product.category}
                  </span>
                  <h3 className="text-3xl md:text-4xl font-bold mt-2 mb-4">
                    {product.title}
                  </h3>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    {product.description}
                  </p>
                </div>

                <div className="flex flex-wrap gap-3">
                  {product.features.map((feature, idx) => (
                    <span
                      key={idx}
                      className="px-4 py-2 bg-primary/10 text-foreground rounded-full text-sm font-medium border border-primary/20"
                    >
                      {feature}
                    </span>
                  ))}
                </div>

                <Button variant="hero" size="lg" className="group mt-4">
                  Ver Colección
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-smooth" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;