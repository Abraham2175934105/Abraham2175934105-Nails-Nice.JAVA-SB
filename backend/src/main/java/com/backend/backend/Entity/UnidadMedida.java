package com.backend.backend.Entity;

import jakarta.persistence.*;
import java.util.Set;

@Entity
@Table(name = "unidad_medida")
public class UnidadMedida {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_unidad")
    private Integer id;

    @Column(name = "nombre_medida", nullable = false, length = 50)
    private String nombreMedida;

    // Relación con productos
    @OneToMany(mappedBy = "unidadMedida")
    private Set<Producto> productos;

    // Getters y Setters
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public String getNombreMedida() { return nombreMedida; }
    public void setNombreMedida(String nombreMedida) { this.nombreMedida = nombreMedida; }

    public Set<Producto> getProductos() { return productos; }
    public void setProductos(Set<Producto> productos) { this.productos = productos; }
}
