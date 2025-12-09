import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff, Mail, Lock, Sparkles, Home } from "lucide-react";
import authBackground from "@/assets/auth-background.jpg";
import apiAuth from "@/lib/apiAuth";
import { useAuth } from "@/contexts/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // llamamos al login del contexto, que guardará nn_token y nn_user
      const resp = await login(formData.email, formData.password);
      // resp puede venir en distintas formas, normalizamos para obtener rol
      const user = resp.user ?? resp.data?.user ?? resp.data ?? resp;
      const roleId = user?.rol?.id ?? user?.role?.id ?? user?.roleId ?? null;

      toast({
        title: "¡Bienvenida!",
        description: "Has iniciado sesión correctamente.",
      });

      // Navegar según rol (ajusta ids si cambian)
      if (roleId === 1) {
        navigate("/dashboard");
      } else if (roleId === 2) {
        navigate("/");
      } else if (roleId === 3) {
        toast({
          title: "Empleado",
          description: "Panel de empleado aún no implementado. Redirigiendo a inicio.",
        });
        navigate("/");
      } else {
        navigate("/");
      }
    } catch (error: any) {
      console.error("Login error:", error);
      toast({
        title: "Error al iniciar sesión",
        description: error?.message || "Correo o contraseña incorrectos",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${authBackground})` }}
      >
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
      </div>
      <div className="w-full max-w-2xl relative z-10">
        {/* Logo y Título */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-foreground shadow-glow mb-4">
            <Sparkles className="w-10 h-10 text-background" />
          </div>
          <h1 className="text-5xl font-heading font-black text-foreground mb-2 tracking-tight">
            NAILS NICE
          </h1>
          <p className="text-muted-foreground">Bienvenida de nuevo</p>
          
          {/* Botón Volver al Inicio */}
          <Link to="/">
            <Button variant="secondary" size="lg" className="mt-6 shadow-medium hover:shadow-elegant transition-smooth">
              <Home className="h-5 w-5 mr-2" />
              Volver al Inicio
            </Button>
          </Link>
        </div>

        {/* Formulario */}
        <div className="bg-card rounded-2xl shadow-elegant p-8 animate-scale-in border-2 border-border hover-elevate">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div className="relative">
              <label className="block text-sm font-medium text-foreground mb-2">
                Correo Electrónico
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="email"
                  placeholder="Correo Electrónico"
                  className="pl-10 h-12 border-2 focus:border-foreground transition-smooth"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
            </div>

            {/* Contraseña */}
            <div className="relative">
              <label className="block text-sm font-medium text-foreground mb-2">
                Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Contraseña"
                  className="pl-10 pr-10 h-12 border-2 focus:border-foreground transition-smooth"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-smooth"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              <div className="text-right">
                <Link to="/recuperar-contrasena" className="text-sm text-muted-foreground hover:text-primary transition-smooth">
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
            </div>

            {/* Botón de Submit */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-foreground text-background hover:bg-foreground/90 shadow-soft hover:shadow-medium text-lg font-semibold transition-smooth"
            >
              {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
            </Button>

            {/* Resto del formulario (social, links, etc.) permanece igual */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-card text-muted-foreground">o continúa con</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Button
                type="button"
                variant="outline"
                className="h-12 border-2 hover:bg-accent transition-smooth"
                onClick={() => { /* implementar OAuth si quieres */ }}
              >
                Google
              </Button>
              <Button
                type="button"
                variant="outline"
                className="h-12 border-2 hover:bg-accent transition-smooth"
              >
                Facebook
              </Button>
            </div>

            <p className="text-center text-sm text-muted-foreground mt-6">
              ¿No tienes cuenta?{" "}
              <Link to="/register" className="text-foreground hover:text-foreground/80 font-semibold transition-smooth">
                Regístrate aquí
              </Link>
            </p>

            <p className="text-center text-xs text-muted-foreground mt-4 italic font-light">
              Al continuar, aceptas nuestros{" "}
              <a href="#" className="text-foreground hover:underline">
                Términos de Servicio
              </a>{" "}
              y{" "}
              <a href="#" className="text-foreground hover:underline">
                Política de Privacidad
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;