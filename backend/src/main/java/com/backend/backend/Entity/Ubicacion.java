package com.backend.backend.Entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.util.Set;

@Entity
@Table(name = "ubicacion")
@JsonIgnoreProperties({"inventarios"}) // evita serializar la colección inventarios y rompe la recursión
public class Ubicacion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_ubicacion")
    private Integer id;

    @Column(name = "descripcion", nullable = false, length = 100)
    private String descripcion;

    @OneToMany(mappedBy = "ubicacion")
    private Set<Inventario> inventarios;

    // Getters y Setters
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }

    public Set<Inventario> getInventarios() { return inventarios; }
    public void setInventarios(Set<Inventario> inventarios) { this.inventarios = inventarios; }
}