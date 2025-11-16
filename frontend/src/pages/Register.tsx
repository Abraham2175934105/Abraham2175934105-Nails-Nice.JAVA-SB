import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Sparkles, Eye, EyeOff, Mail, Lock, User, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";

const Register = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!acceptTerms) {
      toast({
        title: "Términos requeridos",
        description: "Debes aceptar los términos y condiciones para continuar.",
        variant: "destructive",
      });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Error en contraseña",
        description: "Las contraseñas no coinciden.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    // Simulación de registro - aquí integrarás tu backend
    setTimeout(() => {
      toast({
        title: "¡Cuenta creada!",
        description: "Tu cuenta ha sido creada exitosamente. Bienvenida a Nails Nice.",
      });
      setIsLoading(false);
      navigate("/");
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center gradient-soft px-4 py-12">
      <div className="w-full max-w-md animate-scale-in">
        {/* Logo y título */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-4 group">
            <Sparkles className="h-8 w-8 text-primary animate-pulse" />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Nails Nice
            </h1>
          </Link>
          <h2 className="text-2xl font-heading font-semibold text-foreground mt-4">
            Crea tu cuenta
          </h2>
          <p className="text-muted-foreground mt-2">
            Únete y descubre tu mejor versión
          </p>
        </div>

        {/* Formulario */}
        <div className="bg-card rounded-2xl shadow-deep border border-border p-8 hover-glow">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Nombre completo */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-foreground font-medium">
                Nombre completo
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  id="name"
                  type="text"
                  placeholder="Tu nombre"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="pl-11 h-12 bg-secondary/50 border-border focus:border-primary transition-smooth"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground font-medium">
                Correo electrónico
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="tu@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="pl-11 h-12 bg-secondary/50 border-border focus:border-primary transition-smooth"
                  required
                />
              </div>
            </div>

            {/* Teléfono */}
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-foreground font-medium">
                Teléfono <span className="text-muted-foreground text-sm">(opcional)</span>
              </Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+52 123 456 7890"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="pl-11 h-12 bg-secondary/50 border-border focus:border-primary transition-smooth"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-foreground font-medium">
                Contraseña
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Mínimo 8 caracteres"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="pl-11 pr-11 h-12 bg-secondary/50 border-border focus:border-primary transition-smooth"
                  required
                  minLength={8}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-smooth"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-foreground font-medium">
                Confirmar contraseña
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Repite tu contraseña"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="pl-11 pr-11 h-12 bg-secondary/50 border-border focus:border-primary transition-smooth"
                  required
                  minLength={8}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-smooth"
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Términos y condiciones */}
            <div className="flex items-start space-x-3 pt-2">
              <Checkbox
                id="terms"
                checked={acceptTerms}
                onCheckedChange={(checked) => setAcceptTerms(checked as boolean)}
                className="mt-1 border-border data-[state=checked]:bg-primary data-[state=checked]:border-primary"
              />
              <Label htmlFor="terms" className="text-sm text-muted-foreground leading-relaxed cursor-pointer">
                Acepto los{" "}
                <Link to="/terms" className="text-primary hover:text-primary-hover transition-smooth font-medium">
                  términos y condiciones
                </Link>{" "}
                y la{" "}
                <Link to="/privacy" className="text-primary hover:text-primary-hover transition-smooth font-medium">
                  política de privacidad
                </Link>
              </Label>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 gradient-primary text-primary-foreground font-semibold hover:shadow-glow hover:scale-[1.02] transition-bounce text-base mt-6"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <div className="h-5 w-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  Creando cuenta...
                </span>
              ) : (
                "Crear Cuenta"
              )}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">O regístrate con</span>
            </div>
          </div>

          {/* Social Login */}
          <div className="grid grid-cols-2 gap-3">
            <Button
              type="button"
              variant="outline"
              className="h-11 hover:bg-accent hover:border-primary transition-smooth"
            >
              <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Google
            </Button>
            <Button
              type="button"
              variant="outline"
              className="h-11 hover:bg-accent hover:border-primary transition-smooth"
            >
              <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              Facebook
            </Button>
          </div>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-muted-foreground">
              ¿Ya tienes una cuenta?{" "}
              <Link
                to="/login"
                className="text-primary hover:text-primary-hover font-semibold transition-smooth"
              >
                Inicia sesión
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;