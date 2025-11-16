package com.backend.backend.Entity;

import jakarta.persistence.*;
import java.util.Set;

@Entity
@Table(name = "marca")
public class Marca {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_marca")
    private Integer id;

    @Column(name = "nombre_marca", nullable = false, length = 50)
    private String nombreMarca;

    // Relación con productos
    @OneToMany(mappedBy = "marca")
    private Set<Producto> productos;

    // Getters y Setters
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public String getNombreMarca() { return nombreMarca; }
    public void setNombreMarca(String nombreMarca) { this.nombreMarca = nombreMarca; }

    public Set<Producto> getProductos() { return productos; }
    public void setProductos(Set<Producto> productos) { this.productos = productos; }
}

