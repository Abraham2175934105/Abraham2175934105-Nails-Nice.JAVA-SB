import { Sparkles, Facebook, Instagram, Twitter, Mail, Phone, MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const Footer = () => {
  return (
    <footer id="contacto" className="bg-foreground/5 border-t border-border">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="animate-fade-in">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="h-6 w-6 text-primary" />
              <h3 className="text-xl font-bold">Nails Nice</h3>
            </div>
            <p className="text-muted-foreground text-sm mb-4">
              Tu destino para productos de belleza premium. Calidad, estilo y confianza en cada compra.
            </p>
            <div className="flex gap-3">
              <a 
                href="#" 
                className="h-10 w-10 rounded-full bg-primary/10 hover:bg-primary flex items-center justify-center transition-smooth hover:shadow-glow group"
              >
                <Facebook className="h-4 w-4 text-primary group-hover:text-white transition-smooth" />
              </a>
              <a 
                href="#" 
                className="h-10 w-10 rounded-full bg-primary/10 hover:bg-primary flex items-center justify-center transition-smooth hover:shadow-glow group"
              >
                <Instagram className="h-4 w-4 text-primary group-hover:text-white transition-smooth" />
              </a>
              <a 
                href="#" 
                className="h-10 w-10 rounded-full bg-primary/10 hover:bg-primary flex items-center justify-center transition-smooth hover:shadow-glow group"
              >
                <Twitter className="h-4 w-4 text-primary group-hover:text-white transition-smooth" />
              </a>
            </div>
          </div>

          {/* Enlaces Rápidos */}
          <div className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <h4 className="font-bold mb-4">Enlaces Rápidos</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-smooth">
                  Sobre Nosotros
                </a>
              </li>
              <li>
                <a href="#productos" className="text-muted-foreground hover:text-primary transition-smooth">
                  Productos
                </a>
              </li>
              <li>
                <a href="#promociones" className="text-muted-foreground hover:text-primary transition-smooth">
                  Promociones
                </a>
              </li>
              <li>
                <a href="#servicios" className="text-muted-foreground hover:text-primary transition-smooth">
                  Servicios
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-smooth">
                  Blog
                </a>
              </li>
            </ul>
          </div>

          {/* Atención al Cliente */}
          <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <h4 className="font-bold mb-4">Atención al Cliente</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-smooth">
                  Centro de Ayuda
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-smooth">
                  Política de Devoluciones
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-smooth">
                  Envíos y Entregas
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-smooth">
                  Métodos de Pago
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-smooth">
                  Términos y Condiciones
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter & Contacto */}
          <div className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <h4 className="font-bold mb-4">Mantente Informada</h4>
            <p className="text-sm text-muted-foreground mb-3">
              Recibe ofertas exclusivas y novedades
            </p>
            <div className="flex gap-2 mb-4">
              <Input 
                type="email" 
                placeholder="tu@email.com" 
                className="text-sm"
              />
              <Button variant="default" size="sm" className="shadow-soft">
                Enviar
              </Button>
            </div>
            
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Mail className="h-4 w-4 text-primary" />
                <span>info@nailsnice.com</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Phone className="h-4 w-4 text-primary" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4 text-primary" />
                <span>Múltiples ubicaciones</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-border text-center text-sm text-muted-foreground">
          <p>&copy; 2025 Nails Nice. Todos los derechos reservados. Diseñado con amor para ti ✨</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
