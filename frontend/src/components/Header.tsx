import { Search, ShoppingCart, Menu, Sparkles, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [q, setQ] = useState("");
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const cart = useCart();

  const onSearch = (e?: any) => {
    if (e) e.preventDefault();
    navigate(`/productos?q=${encodeURIComponent(q)}`);
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border shadow-soft">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-3 mr-8">
            <Sparkles className="h-8 w-8 text-foreground" />
            <h1 className="text-3xl md:text-4xl font-black tracking-tight text-foreground">
              NAILS NICE
            </h1>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-foreground hover:text-secondary transition-smooth font-medium">
              Inicio
            </Link>
            <a href="/#contacto" className="text-foreground hover:text-secondary transition-smooth font-medium">
              Contacto
            </a>
          </nav>

          <div className="hidden md:flex items-center gap-3 flex-1 max-w-md mx-6">
            <form onSubmit={onSearch} className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar productos..."
                value={q}
                onChange={(e) => setQ(e.target.value)}
                className="pl-10 bg-muted border-border focus:border-foreground transition-smooth"
              />
            </form>
          </div>

          <div className="flex items-center gap-2">
            {!user ? (
              <>
                <Link to="/login" className="hidden sm:inline-block">
                  <Button variant="outline" className="hover:bg-accent hover:border-foreground transition-smooth">
                    Iniciar Sesión
                  </Button>
                </Link>
                <Link to="/register" className="hidden sm:inline-block">
                  <Button className="bg-foreground text-background hover:bg-foreground/90 transition-smooth">
                    Registrarse
                  </Button>
                </Link>
                <Link to="/login" className="sm:hidden">
                  <Button variant="ghost" size="icon" className="hover-glow">
                    <User className="h-5 w-5" />
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <div className="hidden sm:flex items-center gap-3">
                  <span className="text-sm font-medium">Hola, {user?.nombre1 ?? user?.nombre ?? user?.correo}</span>
                  <Button variant="ghost" onClick={() => logout()}>Cerrar sesión</Button>
                </div>
                <div className="sm:hidden">
                  <Button variant="ghost" size="icon" className="hover-glow">
                    <User className="h-5 w-5" />
                  </Button>
                </div>
              </>
            )}

            <Link to="/cart">
              <Button variant="ghost" size="icon" className="relative hover-glow">
                <ShoppingCart className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-foreground text-background text-xs flex items-center justify-center shadow-medium">
                  {cart.count}
                </span>
              </Button>
            </Link>
            
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

        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border animate-fade-in">
            <div className="flex flex-col gap-3">
              <Input
                type="search"
                placeholder="Buscar productos..."
                className="mb-2"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") { navigate(`/productos?q=${encodeURIComponent(q)}`); setIsMenuOpen(false); } }}
              />
              <Link to="/" className="px-4 py-2 hover:bg-accent rounded-md transition-smooth">
                Inicio
              </Link>
              <a href="/#contacto" className="px-4 py-2 hover:bg-accent rounded-md transition-smooth">
                Contacto
              </a>
              <div className="flex gap-2 mt-2 px-4">
                {!user ? (
                  <>
                    <Link to="/login" className="flex-1">
                      <Button variant="outline" className="w-full hover:bg-accent transition-smooth">
                        Iniciar Sesión
                      </Button>
                    </Link>
                    <Link to="/register" className="flex-1">
                      <Button className="w-full bg-foreground text-background hover:bg-foreground/90 transition-smooth">
                        Registrarse
                      </Button>
                    </Link>
                  </>
                ) : (
                  <Button className="w-full" onClick={() => { logout(); setIsMenuOpen(false); }}>
                    Cerrar sesión
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;