package com.backend.backend.Entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.util.Set;

@Entity
@Table(name = "promociones")
public class Promociones {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_promocion")
    private Integer id;

    @Column(name = "nombre", nullable = false, length = 150)
    private String nombre;

    @Column(name = "descripcion")
    private String descripcion;

    @Column(name = "fecha_inicio", nullable = false)
    private LocalDate fechaInicio;

    @Column(name = "fecha_fin", nullable = false)
    private LocalDate fechaFin;

    @Enumerated(EnumType.STRING)
    @Column(name = "estado", nullable = false)
    private EstadoPromocion estado;

    @OneToMany(mappedBy = "promocion")
    private Set<ProductoPromocion> productos;

    public enum EstadoPromocion {
        activa, inactiva
    }

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

    public LocalDate getFechaInicio() {
        return fechaInicio;
    }

    public void setFechaInicio(LocalDate fechaInicio) {
        this.fechaInicio = fechaInicio;
    }

    public LocalDate getFechaFin() {
        return fechaFin;
    }

    public void setFechaFin(LocalDate fechaFin) {
        this.fechaFin = fechaFin;
    }

    public EstadoPromocion getEstado() {
        return estado;
    }

    public void setEstado(EstadoPromocion estado) {
        this.estado = estado;
    }

    public Set<ProductoPromocion> getProductos() {
        return productos;
    }

    public void setProductos(Set<ProductoPromocion> productos) {
        this.productos = productos;
    }

}
