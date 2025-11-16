import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import heroBanner from "@/assets/hero-banner.jpg";

const HeroSection = () => {
  return (
    <section className="relative w-full h-[600px] overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroBanner})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/70 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative container mx-auto px-4 h-full flex items-center">
        <div className="max-w-2xl animate-fade-in">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="h-5 w-5 text-primary animate-pulse" />
            <span className="text-sm font-medium text-primary uppercase tracking-wide">
              Belleza Premium
            </span>
          </div>
          
          <h2 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            Descubre tu
            <span className="block text-foreground">
              Belleza Natural
            </span>
          </h2>
          
          <p className="text-lg text-muted-foreground mb-8 max-w-xl">
            Los mejores productos de maquillaje, cuidado facial y belleza. Calidad premium, resultados profesionales.
          </p>
          
          <div className="flex flex-wrap gap-4">
            <Button variant="hero" size="lg" className="group">
              Explorar Productos
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-smooth" />
            </Button>
            <Button variant="accent" size="lg">
              Ver Promociones
            </Button>
          </div>

          {/* Stats */}
          <div className="flex gap-8 mt-12">
            <div className="animate-scale-in">
              <div className="text-3xl font-bold text-primary">500+</div>
              <div className="text-sm text-muted-foreground">Productos</div>
            </div>
            <div className="animate-scale-in" style={{ animationDelay: '0.1s' }}>
              <div className="text-3xl font-bold text-primary">100%</div>
              <div className="text-sm text-muted-foreground">Garantía</div>
            </div>
            <div className="animate-scale-in" style={{ animationDelay: '0.2s' }}>
              <div className="text-3xl font-bold text-primary">24h</div>
              <div className="text-sm text-muted-foreground">Envío Rápido</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
