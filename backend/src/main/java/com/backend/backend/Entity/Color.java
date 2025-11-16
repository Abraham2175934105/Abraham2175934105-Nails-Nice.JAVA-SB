package com.backend.backend.Entity;

import jakarta.persistence.*;
import java.util.Set;

@Entity
@Table(name = "color")
public class Color {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_color")
    private Integer id;

    @Column(name = "nombre_color", nullable = false, length = 50)
    private String nombreColor;

    // Relación con productos
    @OneToMany(mappedBy = "color")
    private Set<Producto> productos;

    // Getters y Setters
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public String getNombreColor() { return nombreColor; }
    public void setNombreColor(String nombreColor) { this.nombreColor = nombreColor; }

    public Set<Producto> getProductos() { return productos; }
    public void setProductos(Set<Producto> productos) { this.productos = productos; }
}
