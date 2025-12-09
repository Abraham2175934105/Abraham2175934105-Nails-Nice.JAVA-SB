import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  Phone,
  Sparkles,
  Facebook,
  Home,
  MapPin,
  HelpCircle,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import authBackground from "@/assets/auth-background.jpg";
import { registerApi } from "@/lib/apiAuth";

const Register: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);

  const [formData, setFormData] = useState({
    primerNombre: "",
    segundoNombre: "",
    primerApellido: "",
    segundoApellido: "",
    email: "",
    phone: "",
    direccion: "",
    password: "",
    confirmPassword: "",
  });

  // Regexes / validations
  const nameRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ]+$/; // letras (incluye tildes) sin espacios
  const emailFullRegex = /^[A-Za-z0-9.,]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
  const phoneRegex = /^[0-9]{10,16}$/;
  const addressRegex = /(?:\b(?:Calle|Carrera|Cra|Cl|Transversal|Diagonal|Diag)\b.*\d)|(?:\bBogot[áa]\b)/i;
  const passwordRegex = /^(?=.{8,25}$)(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+\[\]{};:'",.<>\/?\\|`~]).+$/;

  // Helper validators used en la guía y en submit
  const isValidFirstName = () => !!formData.primerNombre && nameRegex.test(formData.primerNombre.trim());
  const isValidSecondName = () => !formData.segundoNombre || nameRegex.test(formData.segundoNombre.trim());
  const isValidFirstLast = () => !!formData.primerApellido && nameRegex.test(formData.primerApellido.trim());
  const isValidSecondLast = () => !formData.segundoApellido || nameRegex.test(formData.segundoApellido.trim());
  const isValidEmail = () => {
    if (!formData.email || formData.email.trim().length === 0) return false;
    if (!emailFullRegex.test(formData.email.trim())) return false;
    const localPart = (formData.email.split("@")[0] || "").trim();
    const localPartNoCommas = localPart.replace(/,/g, "");
    if (localPartNoCommas.length < 6) return false;
    if (/^[0-9.]+$/.test(localPartNoCommas)) return false;
    return true;
  };
  const isValidPhone = () => !!formData.phone && phoneRegex.test(formData.phone.trim());
  const isValidAddress = () => !!formData.direccion && addressRegex.test(formData.direccion.trim());
  const isValidPassword = () => !!formData.password && passwordRegex.test(formData.password);
  const passwordsMatch = () => formData.password === formData.confirmPassword && !!formData.confirmPassword;

  const validateAll = (): string | null => {
    if (!formData.primerNombre || formData.primerNombre.trim().length === 0) {
      return "El primer nombre es obligatorio.";
    }
    if (!nameRegex.test(formData.primerNombre.trim())) {
      return "Primer nombre: solo letras (sin espacios ni números).";
    }
    if (formData.segundoNombre && !nameRegex.test(formData.segundoNombre.trim())) {
      return "Segundo nombre: solo letras (sin espacios ni números).";
    }
    if (!formData.primerApellido || formData.primerApellido.trim().length === 0) {
      return "El primer apellido es obligatorio.";
    }
    if (!nameRegex.test(formData.primerApellido.trim())) {
      return "Primer apellido: solo letras (sin espacios ni números).";
    }
    if (formData.segundoApellido && !nameRegex.test(formData.segundoApellido.trim())) {
      return "Segundo apellido: solo letras (sin espacios ni números).";
    }
    if (!formData.email || formData.email.trim().length === 0) {
      return "El correo electrónico es obligatorio.";
    }
    if (!emailFullRegex.test(formData.email.trim())) {
      return "Formato de correo inválido. Solo letras, números, puntos y comas permitidos en la parte local.";
    }
    const localPart = (formData.email.split("@")[0] || "").trim();
    const localPartNoCommas = localPart.replace(/,/g, "");
    if (localPartNoCommas.length < 6) {
      return "La parte antes del @ debe tener al menos 6 caracteres (sin contar comas).";
    }
    if (/^[0-9.]+$/.test(localPartNoCommas)) {
      return "La parte antes del @ no puede ser solo números; debe incluir letras.";
    }
    if (!formData.phone || formData.phone.trim().length === 0) {
      return "El teléfono es obligatorio.";
    }
    if (!phoneRegex.test(formData.phone.trim())) {
      return "Teléfono inválido. Debe contener solo números y tener entre 10 y 16 dígitos, sin espacios ni símbolos.";
    }
    if (!formData.direccion || formData.direccion.trim().length === 0) {
      return "La dirección de casa es obligatoria.";
    }
    if (!addressRegex.test(formData.direccion.trim())) {
      return "Dirección inválida para Bogotá. Debe contener 'Bogotá' o comenzar con Calle/Carrera/Cl/Cra/Transversal/Diagonal y un número.";
    }
    if (!formData.password || !formData.confirmPassword) {
      return "Las contraseñas son obligatorias.";
    }
    if (formData.password !== formData.confirmPassword) {
      return "Las contraseñas no coinciden.";
    }
    if (!passwordRegex.test(formData.password)) {
      return "Contraseña inválida. Debe tener entre 8 y 25 caracteres, al menos una mayúscula, una minúscula, un número y un carácter especial.";
    }
    if (!acceptTerms) {
      return "Debes aceptar los términos y condiciones.";
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationError = validateAll();
    if (validationError) {
      toast({
        title: "Error de validación",
        description: validationError,
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    // Payload ajustado a RegisterRequest.java del backend
    const payload = {
      primerNombre: formData.primerNombre.trim(),
      segundoNombre: formData.segundoNombre?.trim() || null,
      primerApellido: formData.primerApellido.trim(),
      segundoApellido: formData.segundoApellido?.trim() || null,
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      direccion: formData.direccion.trim(),
      password: formData.password,
    };

    try {
      const resp: any = await registerApi(payload);

      toast({
        title: "¡Registro exitoso! 🎉",
        description: "Tu cuenta se creó correctamente.",
      });

      toast({
        title: `Bienvenida ${resp?.nombre || ""}`,
        description: "Serás redirigido al inicio de sesión en breve.",
      });

      setTimeout(() => {
        navigate("/login");
      }, 1400);
    } catch (err: any) {
      console.error("Register error:", err);
      toast({
        title: "Error al registrar",
        description: err?.message || "Ocurrió un error al registrar. Revisa los datos e intenta de nuevo.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Small UI helper to show a row with icon + text
  const GuideRow: React.FC<{ ok: boolean; title: string; hint?: string }> = ({ ok, title, hint }) => (
    <div className="flex items-start gap-3">
      <div className="mt-0.5">
        {ok ? <CheckCircle2 className="h-5 w-5 text-green-600" /> : <XCircle className="h-5 w-5 text-red-600" />}
      </div>
      <div>
        <div className="font-medium text-sm">{title}</div>
        {hint && <div className="text-xs text-muted-foreground mt-0.5">{hint}</div>}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 py-12 overflow-hidden">
      {/* Background Image with Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${authBackground})` }}
      >
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
      </div>

      <div className="w-full max-w-5xl relative z-10">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full gradient-primary shadow-glow mb-4">
            <Sparkles className="w-10 h-10 text-primary-foreground" />
          </div>
          <h1 className="text-4xl font-heading font-bold text-foreground mb-2">Nails Nice</h1>
          <p className="text-muted-foreground">Crea tu cuenta y comienza</p>

          <div className="flex gap-3 justify-center mt-6 flex-wrap">
            <Link to="/">
              <Button
                variant="secondary"
                size="lg"
                className="shadow-medium hover:shadow-elegant transition-smooth"
              >
                <Home className="h-5 w-5 mr-2" />
                Volver al Inicio
              </Button>
            </Link>

            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="default"
                  size="lg"
                  className="bg-help hover:bg-help/90 text-help-foreground shadow-medium hover:shadow-elegant animate-pulse"
                >
                  <HelpCircle className="h-5 w-5 mr-2" />
                  ¿Necesitas Ayuda?
                </Button>
              </DialogTrigger>

              <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="text-2xl flex items-center gap-2">
                    <HelpCircle className="h-6 w-6 text-help" />
                    Guía de Registro
                  </DialogTitle>
                  <DialogDescription>Consejos y validaciones en tiempo real para completar tu registro correctamente</DialogDescription>
                </DialogHeader>

                <div className="space-y-4 mt-4">
                  {/* Nombres */}
                  <div className="p-4 bg-gradient-to-r from-primary/10 to-transparent rounded-lg border-l-4 border-primary">
                    <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                      <User className="h-5 w-5 text-primary" />
                      Nombres y Apellidos
                    </h4>
                    <div className="grid gap-2">
                      <GuideRow ok={isValidFirstName()} title="Primer nombre: obligatorio" hint="Solo letras, sin espacios ni números. Ej: 'Ana'." />
                      <GuideRow ok={isValidSecondName()} title="Segundo nombre: opcional" hint="Si lo pones, solo letras. Ej: 'María'." />
                      <GuideRow ok={isValidFirstLast()} title="Primer apellido: obligatorio" hint="Solo letras. Ej: 'Rojas'." />
                      <GuideRow ok={isValidSecondLast()} title="Segundo apellido: opcional" hint="Si lo pones, solo letras. Ej: 'Gómez'." />
                    </div>
                  </div>

                  {/* Email */}
                  <div className="p-4 bg-gradient-to-r from-blue-500/10 to-transparent rounded-lg border-l-4 border-blue-500">
                    <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                      <Mail className="h-5 w-5 text-blue-600" />
                      Correo Electrónico
                    </h4>
                    <div className="grid gap-2 text-sm">
                      <GuideRow ok={!!formData.email} title="Campo requerido" hint="Formato: usuario@dominio.com" />
                      <GuideRow ok={emailFullRegex.test(formData.email || "")} title="Formato válido" hint="Ls. permitidos: letras, números, puntos y comas en la parte local" />
                      <GuideRow ok={(() => {
                        const local = (formData.email || "").split("@")[0] || "";
                        return local.replace(/,/g, "").length >= 6;
                      })()} title="Parte local >= 6 caracteres" hint="La parte antes del @ debe tener al menos 6 caracteres (sin contar comas)." />
                      <GuideRow ok={!/^[0-9.]+$/.test(((formData.email || "").split("@")[0] || "").replace(/,/g, ""))} title="No puede ser solo números" hint="La parte antes del @ debe incluir letras." />
                    </div>
                  </div>

                  {/* Teléfono */}
                  <div className="p-4 bg-gradient-to-r from-green-500/10 to-transparent rounded-lg border-l-4 border-green-500">
                    <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                      <Phone className="h-5 w-5 text-green-600" />
                      Teléfono
                    </h4>
                    <div className="grid gap-2 text-sm">
                      <GuideRow ok={!!formData.phone} title="Campo requerido" hint="Incluye código si deseas. Solo números." />
                      <GuideRow ok={phoneRegex.test(formData.phone || "")} title="Formato válido" hint="Entre 10 y 16 dígitos, sin espacios ni símbolos." />
                      <div className="text-xs text-muted-foreground italic">Ejemplo: 3001234567 o 573001234567</div>
                    </div>
                  </div>

                  {/* Dirección */}
                  <div className="p-4 bg-gradient-to-r from-purple-500/10 to-transparent rounded-lg border-l-4 border-purple-500">
                    <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-purple-600" />
                      Dirección
                    </h4>
                    <div className="grid gap-2 text-sm">
                      <GuideRow ok={!!formData.direccion} title="Campo requerido" hint="Calle/Carrera, número y ciudad (o incluye 'Bogotá')" />
                      <GuideRow ok={addressRegex.test(formData.direccion || "")} title="Formato recomendado" hint="Ej: Calle 123 #45-67, Bogotá" />
                    </div>
                  </div>

                  {/* Contraseña */}
                  <div className="p-4 bg-gradient-to-r from-red-500/10 to-transparent rounded-lg border-l-4 border-red-500">
                    <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                      <Lock className="h-5 w-5 text-red-600" />
                      Contraseña Segura
                    </h4>
                    <div className="grid gap-2 text-sm">
                      <GuideRow ok={formData.password.length >= 8} title="Mínimo 8 caracteres" />
                      <GuideRow ok={formData.password.length <= 25} title="Máximo 25 caracteres" />
                      <GuideRow ok={/[A-Z]/.test(formData.password)} title="Al menos una mayúscula (A-Z)" />
                      <GuideRow ok={/[a-z]/.test(formData.password)} title="Al menos una minúscula (a-z)" />
                      <GuideRow ok={/\d/.test(formData.password)} title="Al menos un número (0-9)" />
                      <GuideRow ok={/[!@#$%^&*()_\-+\[\]{};:'",.<>\/?\\|`~]/.test(formData.password)} title="Al menos un carácter especial" />
                      <GuideRow ok={passwordsMatch()} title="Las contraseñas deben coincidir" />
                      <div className="text-xs text-muted-foreground italic">Ejemplo válido: Abcd1234!</div>
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Formulario (completo) */}
        <div className="bg-card rounded-2xl shadow-elegant p-8 animate-scale-in border-2 border-border hover-elevate">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Primer Nombre */}
              <div className="relative">
                <label className="block text-sm font-medium text-foreground mb-2">
                  Primer Nombre <span className="text-required">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Primer Nombre"
                    className="pl-10 h-12 border-2 focus:border-primary transition-smooth"
                    value={formData.primerNombre}
                    onChange={(e) => setFormData({ ...formData, primerNombre: e.target.value })}
                    required
                  />
                </div>
              </div>

              {/* Segundo Nombre */}
              <div className="relative">
                <label className="block text-sm font-medium text-foreground mb-2">Segundo Nombre (opcional)</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Segundo Nombre"
                    className="pl-10 h-12 border-2 focus:border-primary transition-smooth"
                    value={formData.segundoNombre}
                    onChange={(e) => setFormData({ ...formData, segundoNombre: e.target.value })}
                  />
                </div>
              </div>

              {/* Primer Apellido */}
              <div className="relative">
                <label className="block text-sm font-medium text-foreground mb-2">
                  Primer Apellido <span className="text-required">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Primer Apellido"
                    className="pl-10 h-12 border-2 focus:border-primary transition-smooth"
                    value={formData.primerApellido}
                    onChange={(e) => setFormData({ ...formData, primerApellido: e.target.value })}
                    required
                  />
                </div>
              </div>

              {/* Segundo Apellido */}
              <div className="relative">
                <label className="block text-sm font-medium text-foreground mb-2">Segundo Apellido (opcional)</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Segundo Apellido"
                    className="pl-10 h-12 border-2 focus:border-primary transition-smooth"
                    value={formData.segundoApellido}
                    onChange={(e) => setFormData({ ...formData, segundoApellido: e.target.value })}
                  />
                </div>
              </div>

              {/* Email */}
              <div className="relative">
                <label className="block text-sm font-medium text-foreground mb-2">
                  Correo Electrónico <span className="text-required">*</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    type="email"
                    placeholder="Correo Electrónico"
                    className="pl-10 h-12 border-2 focus:border-primary transition-smooth"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
              </div>

              {/* Teléfono */}
              <div className="relative">
                <label className="block text-sm font-medium text-foreground mb-2">
                  Teléfono <span className="text-required">*</span>
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    type="tel"
                    placeholder="Teléfono"
                    className="pl-10 h-12 border-2 focus:border-primary transition-smooth"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="relative">
              <label className="block text-sm font-medium text-foreground mb-2">
                Dirección de Casa <span className="text-required">*</span>
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="text"
                    placeholder="Dirección Completa"
                    className="pl-10 h-12 border-2 focus:border-primary transition-smooth"
                    value={formData.direccion}
                    onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
                    required
                  />
                </div>
              </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="relative">
                <label className="block text-sm font-medium text-foreground mb-2">
                  Contraseña <span className="text-required">*</span>
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Contraseña"
                    className="pl-10 pr-10 h-12 border-2 focus:border-primary transition-smooth"
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
              </div>

              <div className="relative">
                <label className="block text-sm font-medium text-foreground mb-2">
                  Confirmar Contraseña <span className="text-required">*</span>
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirmar Contraseña"
                    className="pl-10 pr-10 h-12 border-2 focus:border-primary transition-smooth"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    required
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
            </div>

            <div className="flex items-start gap-3 p-4 bg-accent/20 rounded-lg">
              <Checkbox id="terms" checked={acceptTerms} onCheckedChange={(c) => setAcceptTerms(c as boolean)} className="mt-1" />
              <label htmlFor="terms" className="text-sm text-foreground leading-relaxed cursor-pointer">
                Acepto los{" "}
                <a href="#" className="text-primary hover:underline font-semibold">
                  Términos y Condiciones
                </a>{" "}
                y la{" "}
                <a href="#" className="text-primary hover:underline font-semibold">
                  Política de Privacidad
                </a>
              </label>
            </div>

            <Button type="submit" disabled={isLoading} className="w-full h-12 gradient-primary shadow-soft hover:shadow-glow text-lg font-semibold transition-bounce">
              {isLoading ? "Creando cuenta..." : "Crear Cuenta"}
            </Button>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-card text-muted-foreground">o regístrate con</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Button type="button" variant="outline" className="h-12 border-2 hover:bg-accent transition-smooth">
                <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Google
              </Button>

              <Button type="button" variant="outline" className="h-12 border-2 hover:bg-accent transition-smooth">
                <Facebook className="h-5 w-5 mr-2 text-blue-600" />
                Facebook
              </Button>
            </div>

            <p className="text-center text-sm text-muted-foreground mt-6">
              ¿Ya tienes cuenta?{" "}
              <Link to="/login" className="text-primary hover:text-primary-hover font-semibold transition-smooth">
                Inicia sesión aquí
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;