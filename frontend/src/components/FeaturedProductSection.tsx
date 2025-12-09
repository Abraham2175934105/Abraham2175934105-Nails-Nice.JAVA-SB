import categoryMakeup from "@/assets/category-makeup.jpg";

const FeaturedProductSection = () => {
  return (
    <section className="py-16 bg-gradient-soft">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center animate-fade-in">
          {/* Texto a la Izquierda */}
          <div className="space-y-6">
            <h3 className="text-4xl md:text-5xl font-bold text-foreground leading-tight">
              Descubre Nuestra Línea Premium de Maquillaje
            </h3>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Experimenta la calidad profesional con nuestra exclusiva colección de maquillaje. 
              Productos formulados con ingredientes de la más alta calidad que cuidan tu piel 
              mientras realzan tu belleza natural.
            </p>
            <div className="space-y-3">
              <p className="flex items-center gap-2 text-foreground">
                <span className="text-primary text-xl">✓</span>
                <span>Textura sedosa y larga duración</span>
              </p>
              <p className="flex items-center gap-2 text-foreground">
                <span className="text-primary text-xl">✓</span>
                <span>Dermatológicamente probado</span>
              </p>
              <p className="flex items-center gap-2 text-foreground">
                <span className="text-primary text-xl">✓</span>
                <span>Colores vibrantes y pigmentados</span>
              </p>
            </div>
          </div>

          {/* Imagen Flotante a la Derecha */}
          <div className="relative">
            <div className="relative animate-float-up">
              <img
                src={categoryMakeup}
                alt="Producto Premium de Maquillaje"
                className="w-full h-auto rounded-2xl shadow-elegant hover:shadow-glow transition-smooth hover:-translate-y-2"
              />
              {/* Decoración */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary/10 rounded-full blur-2xl"></div>
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-secondary/10 rounded-full blur-2xl"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProductSection;
