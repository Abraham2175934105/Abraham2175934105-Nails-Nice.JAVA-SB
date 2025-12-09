import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { Save, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { getUsuarioById, updateUsuario } from "@/lib/apiAdmin";
import { useAuth } from "@/contexts/AuthContext";

const PerfilAdmin: React.FC = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user: authUser, updateUser } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);

  // User id detection (varios nombres posibles)
  const detectedId = Number((authUser as any)?.id ?? (authUser as any)?.id_usuario ?? (authUser as any)?.idUsuario ?? 0) || null;
  const [userId, setUserId] = useState<number | null>(detectedId);
  const [roleId, setRoleId] = useState<number | null>((authUser as any)?.rol?.id ?? (authUser as any)?.id_rol ?? null);

  const [formData, setFormData] = useState<any>({
    nombre1: "",
    nombre2: "",
    apellido1: "",
    apellido2: "",
    correo: "",
    telefono: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  useEffect(() => {
    // Prefill from authUser if available (use many fallbacks)
    if (authUser) {
      setUserId(Number((authUser as any)?.id ?? (authUser as any)?.id_usuario ?? (authUser as any)?.idUsuario) || userId);
      setRoleId((authUser as any)?.rol?.id ?? (authUser as any)?.id_rol ?? roleId);
      setFormData(prev => ({
        ...prev,
        nombre1: (authUser as any)?.nombre1 ?? (authUser as any)?.nombre ?? prev.nombre1,
        nombre2: (authUser as any)?.nombre2 ?? prev.nombre2,
        apellido1: (authUser as any)?.apellido1 ?? (authUser as any)?.apellido ?? prev.apellido1,
        apellido2: (authUser as any)?.apellido2 ?? prev.apellido2,
        correo: (authUser as any)?.correo ?? (authUser as any)?.email ?? prev.correo,
        telefono: (authUser as any)?.telefono ?? (authUser as any)?.telefono_usuario ?? prev.telefono
      }));
      return;
    }

    // otherwise try to load from API if userId exists
    const loadApi = async () => {
      if (!userId) return;
      setLoading(true);
      try {
        const data = await getUsuarioById(userId);
        setFormData({
          nombre1: data.nombre1 ?? data.nombre ?? "",
          nombre2: data.nombre2 ?? "",
          apellido1: data.apellido1 ?? data.apellido ?? "",
          apellido2: data.apellido2 ?? "",
          correo: data.correo ?? data.email ?? "",
          telefono: data.telefono ?? data.telefono_usuario ?? ""
        });
      } catch (e) {
        console.error("Error cargando usuario:", e);
        toast({ title: "Error", description: "No se pudo cargar el perfil", variant: "destructive" });
      } finally {
        setLoading(false);
      }
    };
    void loadApi();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authUser, userId]);

  // Validations (same as before but allowing names with spaces now if desired)
  const nameRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/;
  const emailRegex = /^[A-Za-z0-9.]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
  const phoneRegex = /^[0-9]{7,16}$/;
  const passwordRegex = /^(?=.{8,25}$)(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*\W).+$/;

  const validateAll = (): string | null => {
    if (!formData.nombre1 || formData.nombre1.trim().length === 0) return "El primer nombre es obligatorio.";
    if (!nameRegex.test(formData.nombre1.trim())) return "Primer nombre: solo letras y espacios.";
    if (formData.nombre2 && !nameRegex.test(formData.nombre2.trim())) return "Segundo nombre: solo letras y espacios.";
    if (!formData.apellido1 || formData.apellido1.trim().length === 0) return "El primer apellido es obligatorio.";
    if (!nameRegex.test(formData.apellido1.trim())) return "Primer apellido: solo letras y espacios.";
    if (formData.apellido2 && !nameRegex.test(formData.apellido2.trim())) return "Segundo apellido: solo letras y espacios.";
    if (!formData.correo || !emailRegex.test(formData.correo.trim())) return "Correo inválido.";
    if (!formData.telefono || !phoneRegex.test(formData.telefono.trim())) return "Teléfono inválido.";
    if (formData.newPassword || formData.confirmPassword) {
      if (formData.newPassword !== formData.confirmPassword) return "Las contraseñas no coinciden.";
      if (!passwordRegex.test(formData.newPassword)) return "Contraseña inválida (8-25, con mayúscula, minúscula, número y carácter especial).";
    }
    return null;
  };

  const handleSave = async () => {
    const err = validateAll();
    if (err) {
      toast({ title: "Error de validación", description: err, variant: "destructive" });
      return;
    }
    if (!userId) {
      toast({ title: "Error", description: "Usuario no identificado", variant: "destructive" });
      return;
    }
    setSaving(true);

    const payload: any = {
      nombre1: formData.nombre1.trim(),
      nombre2: formData.nombre2?.trim() || null,
      apellido1: formData.apellido1.trim(),
      apellido2: formData.apellido2?.trim() || null,
      correo: formData.correo.trim(),
      telefono: formData.telefono.trim(),
      estado_usuario: "Activo",
      rol: { id: roleId ?? 1 }
    };
    if (formData.newPassword && formData.newPassword.length > 0) payload.contrasena = formData.newPassword;

    try {
      const updated = await updateUsuario(Number(userId), payload);

      // Normalizar user para AuthContext
      const normalized = {
        id: updated.id ?? updated.id_usuario ?? userId,
        nombre1: updated.nombre1 ?? updated.nombre ?? payload.nombre1,
        nombre2: updated.nombre2 ?? payload.nombre2,
        apellido1: updated.apellido1 ?? updated.apellido ?? payload.apellido1,
        apellido2: updated.apellido2 ?? payload.apellido2,
        correo: updated.correo ?? updated.email ?? payload.correo,
        telefono: updated.telefono ?? updated.telefono_usuario ?? payload.telefono,
        rol: updated.rol ?? payload.rol
      };

      // actualizar AuthContext (sin recargar)
      updateUser(normalized);

      toast({ title: "Perfil actualizado", description: "Tus datos se guardaron correctamente." });
    } catch (e: any) {
      console.error("Error actualizando usuario:", e);
      toast({ title: "Error", description: e?.message || "No se pudo actualizar el perfil", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (window.history.length > 1) navigate(-1);
    else navigate("/dashboard");
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="border-l-4 border-primary pl-4">
          <h1 className="text-5xl font-black tracking-tight text-foreground">MI PERFIL</h1>
          <p className="text-muted-foreground mt-2 font-medium text-lg">Administra tu información personal</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-1 shadow-elegant">
            <CardContent className="p-6">
              <div className="flex flex-col items-center">
                <div className="relative mb-6">
                  <Avatar className="h-32 w-32 border-4 border-primary/20">
                    <AvatarImage src={""} />
                    <AvatarFallback className="bg-primary text-primary-foreground text-4xl">
                      {(formData.nombre1 || "A").charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <h3 className="text-xl font-bold text-foreground">{`${formData.nombre1 || ""} ${formData.apellido1 || ""}`.trim()}</h3>
                <p className="text-2xl font-extrabold bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">Administrador</p>
              </div>
            </CardContent>
          </Card>

          <Card className="lg:col-span-2 shadow-elegant">
            <CardHeader>
              <CardTitle>Información Personal</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="nombre1">Nombre 1</Label>
                  <Input id="nombre1" value={formData.nombre1 || ""} onChange={(e) => setFormData({ ...formData, nombre1: e.target.value })} className="mt-2" />
                </div>
                <div>
                  <Label htmlFor="nombre2">Nombre 2</Label>
                  <Input id="nombre2" value={formData.nombre2 || ""} onChange={(e) => setFormData({ ...formData, nombre2: e.target.value })} className="mt-2" />
                </div>
                <div>
                  <Label htmlFor="apellido1">Apellido 1</Label>
                  <Input id="apellido1" value={formData.apellido1 || ""} onChange={(e) => setFormData({ ...formData, apellido1: e.target.value })} className="mt-2" />
                </div>
                <div>
                  <Label htmlFor="apellido2">Apellido 2</Label>
                  <Input id="apellido2" value={formData.apellido2 || ""} onChange={(e) => setFormData({ ...formData, apellido2: e.target.value })} className="mt-2" />
                </div>
                <div>
                  <Label htmlFor="email">Correo Electrónico</Label>
                  <Input id="email" type="email" value={formData.correo || ""} onChange={(e) => setFormData({ ...formData, correo: e.target.value })} className="mt-2" />
                </div>
                <div>
                  <Label htmlFor="telefono">Teléfono</Label>
                  <Input id="telefono" value={formData.telefono || ""} onChange={(e) => setFormData({ ...formData, telefono: e.target.value })} className="mt-2" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="shadow-elegant">
          <CardHeader>
            <CardTitle>Cambiar Contraseña (opcional)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="relative">
                <Label htmlFor="currentPassword">Contraseña Actual</Label>
                <div className="relative mt-2">
                  <Input id="currentPassword" type={showPassword ? "text" : "password"} value={formData.currentPassword || ""} onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })} className="pr-10" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <div className="relative">
                <Label htmlFor="newPassword">Nueva Contraseña</Label>
                <div className="relative mt-2">
                  <Input id="newPassword" type={showNewPassword ? "text" : "password"} value={formData.newPassword || ""} onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })} className="pr-10" />
                  <button type="button" onClick={() => setShowNewPassword(!showNewPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                    {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <div>
                <Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
                <Input id="confirmPassword" type="password" value={formData.confirmPassword || ""} onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })} className="mt-2" />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Button variant="outline" size="lg" onClick={() => { if (window.history.length>1) navigate(-1); else navigate("/dashboard"); }}>Cancelar</Button>
          <Button onClick={handleSave} size="lg" className="shadow-medium" disabled={saving}><Save className="h-4 w-4 mr-2" />{saving ? "Guardando..." : "Guardar Cambios"}</Button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default PerfilAdmin;