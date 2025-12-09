import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Mail, KeyRound, Sparkles, Eye, EyeOff } from "lucide-react";
import authBackground from "@/assets/auth-background.jpg";

import { getPregunta, resetPasswordConPregunta } from "@/lib/apiAuth";

/**
 * Página: RecuperarContraseña
 *
 * Flujo:
 *  - solicitar: validar que el correo existe (getPregunta)
 *  - restablecer: validar nueva contraseña localmente y llamar API para restablecer
 *
 * Requisitos de contraseña:
 *  - longitud: mínimo 8, máximo 25
 *  - al menos 1 número
 *  - al menos 1 letra mayúscula
 *  - al menos 1 letra minúscula
 *  - al menos 1 carácter especial
 *
 * Además permite ver/ocultar la contraseña y muestra errores explícitos por campo.
 */

const MIN_PASSWORD = 8;
const MAX_PASSWORD = 25;

function validatePasswordRules(pwd: string) {
  const errors: string[] = [];
  if (pwd.length < MIN_PASSWORD) errors.push(`La contraseña debe tener al menos ${MIN_PASSWORD} caracteres.`);
  if (pwd.length > MAX_PASSWORD) errors.push(`La contraseña no puede tener más de ${MAX_PASSWORD} caracteres.`);
  if (!/[0-9]/.test(pwd)) errors.push("Debe contener al menos 1 número.");
  if (!/[A-Z]/.test(pwd)) errors.push("Debe contener al menos 1 letra mayúscula.");
  if (!/[a-z]/.test(pwd)) errors.push("Debe contener al menos 1 letra minúscula.");
  if (!/[!@#$%^&*(),.?":{}|<>_\-\\\/\[\];'`~+=]/.test(pwd)) errors.push("Debe contener al menos 1 carácter especial (ej: !@#$%).");
  return errors;
}

const RecuperarContrasena: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  // Etapas del flujo: 'solicitar' (buscar correo) y 'restablecer' (nueva contraseña)
  const [step, setStep] = useState<"solicitar" | "restablecer">("solicitar");
  const [isLoading, setIsLoading] = useState(false);

  // Formulario
  const [formData, setFormData] = useState({
    correo: "",
    nuevaContrasena: "",
    confirmarContrasena: "",
  });

  // Errores por campo para mostrar mensajes explícitos en la UI
  const [fieldErrors, setFieldErrors] = useState<{ correo?: string; nuevaContrasena?: string; confirmarContrasena?: string }>({});

  // Toggle visibilidad de contraseñas
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    // limpiar error de ese campo al escribir
    setFieldErrors(prev => ({ ...prev, [e.target.name]: undefined }));
  };

  /* ===========================
     PASO 1: Solicitar (verificar correo)
     =========================== */
  const handleSolicitar = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setFieldErrors({});
    try {
      if (!formData.correo || !/\S+@\S+\.\S+/.test(formData.correo)) {
        setFieldErrors({ correo: "Ingresa un correo válido." });
        setIsLoading(false);
        return;
      }

      const data: any = await getPregunta(formData.correo);

      // Manejo de respuestas esperadas del backend
      // Si el backend devuelve { exists: false } lo informamos explícitamente.
      if (data?.exists === false) {
        setFieldErrors({ correo: "Correo no encontrado." });
        toast({
          title: "Error",
          description: "El correo no está registrado en el sistema.",
          variant: "destructive",
        });
        return;
      }

      // Si backend devuelve un mensaje de error
      if (data?.message) {
        setFieldErrors({ correo: data.message });
        toast({
          title: "Error",
          description: data.message,
          variant: "destructive",
        });
        return;
      }

      // Si todo ok, avanzamos al paso de restablecer
      toast({
        title: "Correo encontrado",
        description: "Puedes introducir tu nueva contraseña ahora.",
      });
      setStep("restablecer");
    } catch (err: any) {
      console.error("Error en handleSolicitar:", err);
      toast({
        title: "Error",
        description: err?.message || "No se pudo verificar el correo.",
        variant: "destructive",
      });
      setFieldErrors({ correo: "Error verificando correo. Intenta nuevamente." });
    } finally {
      setIsLoading(false);
    }
  };

  /* ===========================
     PASO 2: Restablecer contraseña
     =========================== */
  const handleRestablecerContrasena = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});

    // Validaciones locales antes de llamar al backend
    const pwd = formData.nuevaContrasena ?? "";
    const confirmPwd = formData.confirmarContrasena ?? "";

    // Comparar contraseñas
    if (pwd !== confirmPwd) {
      setFieldErrors({ confirmarContrasena: "Las contraseñas no coinciden." });
      toast({
        title: "Error",
        description: "Las contraseñas no coinciden.",
        variant: "destructive",
      });
      return;
    }

    // Reglas de seguridad
    const pwdErrors = validatePasswordRules(pwd);
    if (pwdErrors.length > 0) {
      // Mostrar el primer error en toast y todos en el campo
      setFieldErrors({ nuevaContrasena: pwdErrors.join(" ") });
      toast({
        title: "Contraseña inválida",
        description: pwdErrors[0],
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Llamada al backend que realiza el restablecimiento (usa correo+nuevaContrasena)
      await resetPasswordConPregunta({
        correo: formData.correo,
        nuevaContrasena: pwd,
      });

      toast({
        title: "¡Éxito!",
        description: "Tu contraseña ha sido restablecida correctamente.",
      });

      // Redirigir al login
      navigate("/login");
    } catch (err: any) {
      console.error("Error restableciendo contraseña:", err);
      const msg = err?.message || "No se pudo restablecer la contraseña.";
      toast({
        title: "Error",
        description: msg,
        variant: "destructive",
      });
      // Si el backend responde que el usuario no existe (por cualquier motivo), mostrar explícitamente
      if (msg.toLowerCase().includes("no encontrado") || msg.toLowerCase().includes("no existe")) {
        setFieldErrors({ correo: "Usuario no encontrado." });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden">
      {/* Fondo con blur */}
      <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${authBackground})` }}>
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-foreground shadow-glow mb-4">
            <Sparkles className="w-10 h-10 text-background" />
          </div>
          <h1 className="text-4xl font-heading font-black text-foreground mb-2 tracking-tight">Recuperar Contraseña</h1>
        </div>

        <div className="bg-card rounded-2xl shadow-elegant p-8 animate-scale-in border-2 border-border">
          {step === "solicitar" && (
            <form onSubmit={handleSolicitar} className="space-y-6" noValidate>
              <div>
                <label className="block text-sm mb-2">Correo Electrónico</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 text-muted-foreground" />
                  <Input
                    name="correo"
                    type="email"
                    placeholder="Ingresa tu correo"
                    className="pl-10"
                    value={formData.correo}
                    onChange={handleChange}
                    aria-invalid={!!fieldErrors.correo}
                    aria-describedby={fieldErrors.correo ? "correo-error" : undefined}
                    required
                  />
                </div>
                {fieldErrors.correo && <p id="correo-error" className="text-sm text-destructive mt-2">{fieldErrors.correo}</p>}
              </div>

              <Button type="submit" className="w-full h-12" disabled={isLoading}>
                {isLoading ? "Buscando..." : "Siguiente"}
              </Button>
            </form>
          )}

          {step === "restablecer" && (
            <form onSubmit={handleRestablecerContrasena} className="space-y-6" noValidate>
              <div>
                <label className="block text-sm mb-2">Nueva Contraseña</label>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-5 text-muted-foreground" />
                  <Input
                    name="nuevaContrasena"
                    type={showPassword ? "text" : "password"}
                    className="pl-10 pr-10"
                    value={formData.nuevaContrasena}
                    onChange={handleChange}
                    aria-invalid={!!fieldErrors.nuevaContrasena}
                    aria-describedby={fieldErrors.nuevaContrasena ? "nueva-error" : undefined}
                    required
                  />
                  <button
                    type="button"
                    aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                    onClick={() => setShowPassword(s => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {fieldErrors.nuevaContrasena && <p id="nueva-error" className="text-sm text-destructive mt-2">{fieldErrors.nuevaContrasena}</p>}
                {!fieldErrors.nuevaContrasena && (
                  <p className="text-sm text-muted-foreground mt-2">
                    Requisitos: {MIN_PASSWORD}-{MAX_PASSWORD} caracteres, mayúscula, minúscula, número y carácter especial.
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm mb-2">Confirmar Contraseña</label>
                <div className="relative">
                  <Input
                    name="confirmarContrasena"
                    type={showConfirmPassword ? "text" : "password"}
                    className="pr-10"
                    value={formData.confirmarContrasena}
                    onChange={handleChange}
                    aria-invalid={!!fieldErrors.confirmarContrasena}
                    aria-describedby={fieldErrors.confirmarContrasena ? "confirmar-error" : undefined}
                    required
                  />
                  <button
                    type="button"
                    aria-label={showConfirmPassword ? "Ocultar confirmar contraseña" : "Mostrar confirmar contraseña"}
                    onClick={() => setShowConfirmPassword(s => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  >
                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {fieldErrors.confirmarContrasena && <p id="confirmar-error" className="text-sm text-destructive mt-2">{fieldErrors.confirmarContrasena}</p>}
              </div>

              <Button type="submit" className="w-full h-12" disabled={isLoading}>
                {isLoading ? "Restableciendo..." : "Restablecer Contraseña"}
              </Button>
            </form>
          )}

          <div className="mt-6 text-center">
            <Link to="/login">
              <Button variant="link">Volver al Inicio de Sesión</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecuperarContrasena;