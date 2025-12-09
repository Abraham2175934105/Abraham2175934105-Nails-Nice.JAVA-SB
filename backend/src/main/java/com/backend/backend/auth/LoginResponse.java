package com.backend.backend.auth;

public class LoginResponse {
    private Integer id;
    private String correo;
    private RolDto rol;
    private String nombre1;
    private String nombre2;     // agregado
    private String apellido1;   // agregado
    private String apellido2;   // agregado
    private String telefono;    // agregado
    private String token; // nuevo campo para JWT

    public static class RolDto {
        private Integer id;
        private String descripcion;

        public RolDto() {}
        public RolDto(Integer id, String descripcion) {
            this.id = id;
            this.descripcion = descripcion;
        }
        public Integer getId() { return id; }
        public void setId(Integer id) { this.id = id; }
        public String getDescripcion() { return descripcion; }
        public void setDescripcion(String descripcion) { this.descripcion = descripcion; }
    }

    public LoginResponse() {}

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public String getCorreo() { return correo; }
    public void setCorreo(String correo) { this.correo = correo; }

    public RolDto getRol() { return rol; }
    public void setRol(RolDto rol) { this.rol = rol; }

    public String getNombre1() { return nombre1; }
    public void setNombre1(String nombre1) { this.nombre1 = nombre1; }

    public String getNombre2() { return nombre2; }
    public void setNombre2(String nombre2) { this.nombre2 = nombre2; }

    public String getApellido1() { return apellido1; }
    public void setApellido1(String apellido1) { this.apellido1 = apellido1; }

    public String getApellido2() { return apellido2; }
    public void setApellido2(String apellido2) { this.apellido2 = apellido2; }

    public String getTelefono() { return telefono; }
    public void setTelefono(String telefono) { this.telefono = telefono; }

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }
}