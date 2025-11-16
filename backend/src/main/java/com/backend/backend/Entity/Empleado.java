package com.backend.backend.Entity;

import jakarta.persistence.*;

@Entity
@Table(name = "empleado")
public class Empleado {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_empleado")
    private Integer id;

    @OneToOne
    @JoinColumn(name = "id_usuario", nullable = false, unique = true)
    private Usuario usuario;

    // Getters y Setters
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public Usuario getUsuario() { return usuario; }
    public void setUsuario(Usuario usuario) { this.usuario = usuario; }
}

