package com.backend.backend.auth;

import com.backend.backend.Entity.Rol;

public class RegisterResponse {
    private Integer id;
    private String correo;
    private String nombre;
    private Rol rol;

    public RegisterResponse() {}

    public RegisterResponse(Integer id, String correo, String nombre, Rol rol) {
        this.id = id;
        this.correo = correo;
        this.nombre = nombre;
        this.rol = rol;
    }

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public String getCorreo() { return correo; }
    public void setCorreo(String correo) { this.correo = correo; }

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public Rol getRol() { return rol; }
    public void setRol(Rol rol) { this.rol = rol; }
}