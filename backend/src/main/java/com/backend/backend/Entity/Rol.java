package com.backend.backend.Entity;

import jakarta.persistence.*;
import java.util.Set;

@Entity
@Table(name = "rol")
public class Rol {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_rol")
    private Integer id;

    @Column(name = "descripcion", nullable = false, length = 50)
    private String descripcion;

    @Column(name = "estado", length = 20)
    private String estado;

    // Relación con usuarios
    @OneToMany(mappedBy = "rol", cascade = CascadeType.ALL)
    private Set<Usuario> usuarios;

    // Getters y Setters
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }

    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }

    public Set<Usuario> getUsuarios() { return usuarios; }
    public void setUsuarios(Set<Usuario> usuarios) { this.usuarios = usuarios; }
}
