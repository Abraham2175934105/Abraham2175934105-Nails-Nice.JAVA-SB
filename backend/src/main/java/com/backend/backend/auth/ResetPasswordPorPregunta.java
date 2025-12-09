package com.backend.backend.auth;

public class ResetPasswordPorPregunta {

    private String correo;
    private String respuestaSeguridad;
    private String nuevaContrasena;

    public String getCorreo() { return correo; }
    public void setCorreo(String correo) { this.correo = correo; }

    public String getRespuestaSeguridad() { return respuestaSeguridad; }
    public void setRespuestaSeguridad(String respuestaSeguridad) { this.respuestaSeguridad = respuestaSeguridad; }

    public String getNuevaContrasena() { return nuevaContrasena; }
    public void setNuevaContrasena(String nuevaContrasena) { this.nuevaContrasena = nuevaContrasena; }
}
