package com.backend.backend.Entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "usuarios")
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_usuario")
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "id_rol", nullable = false)
    private Rol rol;

    @Column(name = "nombre1", length = 50)
    private String nombre1;

    @Column(name = "nombre2", length = 50)
    private String nombre2;

    @Column(name = "apellido1", length = 50)
    private String apellido1;

    @Column(name = "apellido2", length = 50)
    private String apellido2;

    @Column(name = "contrasena", nullable = false, length = 255)
    private String contrasena;

    @Column(name = "correo", nullable = false, length = 50)
    private String correo;

    @Column(name = "telefono", length = 25)
    private String telefono;

    @Column(name = "estado_usuario", length = 25)
    private String estadoUsuario;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // Getters y Setters
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public Rol getRol() { return rol; }
    public void setRol(Rol rol) { this.rol = rol; }

    public String getNombre1() { return nombre1; }
    public void setNombre1(String nombre1) { this.nombre1 = nombre1; }

    public String getNombre2() { return nombre2; }
    public void setNombre2(String nombre2) { this.nombre2 = nombre2; }

    public String getApellido1() { return apellido1; }
    public void setApellido1(String apellido1) { this.apellido1 = apellido1; }

    public String getApellido2() { return apellido2; }
    public void setApellido2(String apellido2) { this.apellido2 = apellido2; }

    public String getContrasena() { return contrasena; }
    public void setContrasena(String contrasena) { this.contrasena = contrasena; }

    public String getCorreo() { return correo; }
    public void setCorreo(String correo) { this.correo = correo; }

    public String getTelefono() { return telefono; }
    public void setTelefono(String telefono) { this.telefono = telefono; }

    public String getEstadoUsuario() { return estadoUsuario; }
    public void setEstadoUsuario(String estadoUsuario) { this.estadoUsuario = estadoUsuario; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}

