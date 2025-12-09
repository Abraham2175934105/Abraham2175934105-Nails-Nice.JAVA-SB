import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import heroBanner from "@/assets/hero-banner.jpg";

const HeroSection = () => {
  return (
    <section className="relative w-full h-screen overflow-hidden">{/* Ahora ocupa toda la pantalla */}
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroBanner})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-background/85 via-background/50 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative container mx-auto px-4 h-full flex items-center justify-center">
        <div className="max-w-2xl animate-fade-in text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="h-5 w-5 text-foreground animate-pulse" />
            <span className="text-sm font-medium text-foreground uppercase tracking-wide">
              Belleza Premium
            </span>
          </div>
          
          <h2 className="text-5xl md:text-7xl font-black mb-6 leading-tight text-foreground drop-shadow-lg">
            Descubre tu
            <span className="block text-foreground drop-shadow-lg">
              Belleza Natural
            </span>
          </h2>
          
          <p className="text-lg mb-8 max-w-2xl mx-auto text-foreground drop-shadow-md font-medium">
            Los mejores productos de maquillaje, cuidado facial y belleza. Calidad premium, resultados profesionales.
          </p>
          
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/productos">
              <Button variant="hero" size="lg" className="group shadow-elegant hover-elevate">
                Explorar Productos
                <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-smooth" />
              </Button>
            </Link>
            <Button variant="accent" size="lg" className="shadow-medium hover-elevate">
              Ver Promociones
            </Button>
          </div>

          {/* Stats */}
          <div className="flex gap-8 mt-12 justify-center">
            <div className="animate-scale-in">
              <div className="text-3xl font-bold text-primary">500+</div>
              <div className="text-sm text-foreground drop-shadow-md">Productos</div>
            </div>
            <div className="animate-scale-in" style={{ animationDelay: '0.1s' }}>
              <div className="text-3xl font-bold text-primary">100%</div>
              <div className="text-sm text-foreground drop-shadow-md">Garantía</div>
            </div>
            <div className="animate-scale-in" style={{ animationDelay: '0.2s' }}>
              <div className="text-3xl font-bold text-primary">24h</div>
              <div className="text-sm text-foreground drop-shadow-md">Envío Rápido</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
