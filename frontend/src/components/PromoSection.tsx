import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Percent, Gift, Sparkles } from "lucide-react";

const PromoSection = () => {
  return (
    <section id="promociones" className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 animate-fade-in">
          <Badge className="mb-4 bg-primary/10 text-primary border-primary/20 shadow-soft">
            <Percent className="h-3 w-3 mr-1" />
            Ofertas Especiales
          </Badge>
          <h3 className="text-4xl font-bold mb-4">Promociones Exclusivas</h3>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Aprovecha nuestras ofertas limitadas en productos seleccionados
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Promo Card 1 */}
          <div className="relative overflow-hidden rounded-2xl shadow-deep hover:shadow-glow transition-smooth hover:-translate-y-1 group animate-scale-in">
            <div className="gradient-primary p-8 h-full">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <Badge className="mb-3 bg-white/20 text-white border-white/30">
                    Hasta 50% OFF
                  </Badge>
                  <h4 className="text-3xl font-bold text-white mb-2">
                    Kits de Maquillaje
                  </h4>
                  <p className="text-white/90">
                    Paletas completas con todo lo que necesitas
                  </p>
                </div>
                <Gift className="h-12 w-12 text-white/30 group-hover:text-white/50 transition-smooth" />
              </div>
              
              <div className="space-y-2 mb-6 text-white/80 text-sm">
                <p>✓ Paletas de sombras profesionales</p>
                <p>✓ Pinceles de alta calidad incluidos</p>
                <p>✓ Envío gratis en compras superiores a $50</p>
              </div>

              <Button 
                variant="outline" 
                className="w-full shadow-medium hover:shadow-elegant bg-white text-primary border-white hover:bg-primary/10 hover:scale-105 transition-all duration-300 font-semibold"
              >
                Ver Ofertas
              </Button>
            </div>
          </div>

          {/* Promo Card 2 */}
          <div className="relative overflow-hidden rounded-2xl shadow-deep hover:shadow-glow transition-smooth hover:-translate-y-1 group animate-scale-in" style={{ animationDelay: '0.1s' }}>
            <div className="gradient-accent p-8 h-full">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <Badge className="mb-3 bg-white/20 text-foreground border-white/30">
                    Nuevo
                  </Badge>
                  <h4 className="text-3xl font-bold text-foreground mb-2">
                    Línea Skincare
                  </h4>
                  <p className="text-foreground/80">
                    Descubre nuestra nueva colección facial
                  </p>
                </div>
                <Sparkles className="h-12 w-12 text-foreground/30 group-hover:text-foreground/50 transition-smooth" />
              </div>
              
              <div className="space-y-2 mb-6 text-foreground/70 text-sm">
                <p>✓ Productos con ingredientes naturales</p>
                <p>✓ Dermatológicamente probados</p>
                <p>✓ 3x2 en productos seleccionados</p>
              </div>

              <Button 
                variant="default" 
                className="w-full shadow-medium hover:shadow-elegant bg-foreground text-background hover:bg-foreground/90 hover:scale-105 transition-all duration-300 font-semibold"
              >
                Comprar Ahora
              </Button>
            </div>
          </div>
        </div>

        {/* Banner Adicional */}
        <div className="mt-6 rounded-2xl bg-accent p-8 text-center shadow-soft hover:shadow-medium transition-smooth animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <div className="max-w-3xl mx-auto">
            <h5 className="text-2xl font-bold mb-3 text-foreground">
              🎁 Regalo Especial en tu Primera Compra
            </h5>
            <p className="text-muted-foreground mb-4">
              Recibe un kit de muestras premium totalmente gratis en tu primer pedido superior a $30
            </p>
            <Button 
              variant="hero" 
              size="lg"
              className="hover:scale-105 hover:shadow-elegant transition-all duration-300"
            >
              Comenzar a Comprar
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PromoSection;
