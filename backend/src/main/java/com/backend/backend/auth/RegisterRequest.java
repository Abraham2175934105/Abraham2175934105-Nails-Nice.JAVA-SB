package com.backend.backend.auth;

import com.fasterxml.jackson.annotation.JsonAlias;

public class RegisterRequest {
    private String primerNombre;
    private String segundoNombre;
    private String primerApellido;
    private String segundoApellido;
    private String email;

    // Aceptar ambos alias "phone" y "telefono" en el JSON entrante
    @JsonAlias({ "phone", "telefono" })
    private String phone;

    private String direccion;
    private String password;

    // NUEVOS campos para pregunta de seguridad
    private String preguntaSeguridad;
    private String respuestaSeguridad;

    public RegisterRequest() {}

    public String getPrimerNombre() { return primerNombre; }
    public void setPrimerNombre(String primerNombre) { this.primerNombre = primerNombre; }

    public String getSegundoNombre() { return segundoNombre; }
    public void setSegundoNombre(String segundoNombre) { this.segundoNombre = segundoNombre; }

    public String getPrimerApellido() { return primerApellido; }
    public void setPrimerApellido(String primerApellido) { this.primerApellido = primerApellido; }

    public String getSegundoApellido() { return segundoApellido; }
    public void setSegundoApellido(String segundoApellido) { this.segundoApellido = segundoApellido; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getDireccion() { return direccion; }
    public void setDireccion(String direccion) { this.direccion = direccion; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getPreguntaSeguridad() { return preguntaSeguridad; }
    public void setPreguntaSeguridad(String preguntaSeguridad) { this.preguntaSeguridad = preguntaSeguridad; }

    public String getRespuestaSeguridad() { return respuestaSeguridad; }
    public void setRespuestaSeguridad(String respuestaSeguridad) { this.respuestaSeguridad = respuestaSeguridad; }
}