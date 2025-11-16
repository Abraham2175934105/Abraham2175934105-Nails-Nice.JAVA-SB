package com.backend.backend.Entity;

import jakarta.persistence.*;
import java.util.Set;

@Entity
@Table(name = "tipo_promocion")
public class TipoPromocion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_tipo_promocion")
    private Integer id;

    @Column(name = "nombre", nullable = false, length = 100)
    private String nombre;

    @Column(name = "descripcion")
    private String descripcion;

    @OneToMany(mappedBy = "tipoPromocion")
    private Set<ProductoPromocion> promociones;

    // Getters y Setters
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public Set<ProductoPromocion> getPromociones() {
        return promociones;
    }

    public void setPromociones(Set<ProductoPromocion> promociones) {
        this.promociones = promociones;
    }

}
