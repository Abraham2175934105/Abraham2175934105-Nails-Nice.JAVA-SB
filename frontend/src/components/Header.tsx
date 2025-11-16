import { Search, ShoppingCart, Menu, Sparkles, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Link } from "react-router-dom";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border shadow-soft">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary animate-pulse" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Nails Nice
            </h1>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <a href="#" className="text-foreground hover:text-primary transition-smooth font-medium">
              Inicio
            </a>
            <a href="#productos" className="text-foreground hover:text-primary transition-smooth font-medium">
              Productos
            </a>
            <a href="#promociones" className="text-foreground hover:text-primary transition-smooth font-medium">
              Promociones
            </a>
            <a href="#servicios" className="text-foreground hover:text-primary transition-smooth font-medium">
              Servicios
            </a>
            <a href="#contacto" className="text-foreground hover:text-primary transition-smooth font-medium">
              Contacto
            </a>
          </nav>

          {/* Search Bar */}
          <div className="hidden md:flex items-center gap-3 flex-1 max-w-md mx-6">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar productos..."
                className="pl-10 bg-secondary/50 border-border focus:border-primary transition-smooth"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Link to="/login" className="hidden sm:inline-block">
              <Button variant="outline" className="hover:bg-accent hover:border-primary transition-smooth">
                Iniciar Sesión
              </Button>
            </Link>
            
            <Link to="/register" className="hidden sm:inline-block">
              <Button className="gradient-primary hover:shadow-glow transition-smooth">
                Registrarse
              </Button>
            </Link>

            <Link to="/login" className="sm:hidden">
              <Button variant="ghost" size="icon" className="hover-glow">
                <User className="h-5 w-5" />
              </Button>
            </Link>
            
            <Button variant="ghost" size="icon" className="relative hover-glow">
              <ShoppingCart className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center shadow-medium">
                0
              </span>
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border animate-fade-in">
            <div className="flex flex-col gap-3">
              <Input
                type="search"
                placeholder="Buscar productos..."
                className="mb-2"
              />
              <a href="#" className="px-4 py-2 hover:bg-accent rounded-md transition-smooth">
                Inicio
              </a>
              <a href="#productos" className="px-4 py-2 hover:bg-accent rounded-md transition-smooth">
                Productos
              </a>
              <a href="#promociones" className="px-4 py-2 hover:bg-accent rounded-md transition-smooth">
                Promociones
              </a>
              <a href="#servicios" className="px-4 py-2 hover:bg-accent rounded-md transition-smooth">
                Servicios
              </a>
              <a href="#contacto" className="px-4 py-2 hover:bg-accent rounded-md transition-smooth">
                Contacto
              </a>
              <div className="flex gap-2 mt-2 px-4">
                <Link to="/login" className="flex-1">
                  <Button variant="outline" className="w-full hover:bg-accent transition-smooth">
                    Iniciar Sesión
                  </Button>
                </Link>
                <Link to="/register" className="flex-1">
                  <Button className="w-full gradient-primary hover:shadow-glow transition-smooth">
                    Registrarse
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;