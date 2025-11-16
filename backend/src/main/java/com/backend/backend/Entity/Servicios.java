package com.backend.backend.Entity;

import jakarta.persistence.*;

@Entity
@Table(name = "servicios")
public class Servicios {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_servicio")
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "id_tipo_servicio", nullable = false)
    private TipoServicio tipoServicio;

    @Column(name = "nombre_servicio", nullable = false, length = 100)
    private String nombreServicio;

    @Column(name = "categoria_servicio", nullable = false, length = 50)
    private String categoriaServicio;

    @Column(name = "precio_servicio", nullable = false)
    private Double precioServicio;

    @Column(name = "duracion_servicio", nullable = false, length = 50)
    private String duracionServicio;

    @Column(name = "descripcion_servicio", nullable = false)
    private String descripcionServicio;

    @Column(name = "estado_servicio", nullable = false, length = 20)
    private String estadoServicio;

    // Getters y Setters
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public TipoServicio getTipoServicio() {
        return tipoServicio;
    }

    public void setTipoServicio(TipoServicio tipoServicio) {
        this.tipoServicio = tipoServicio;
    }

    public String getNombreServicio() {
        return nombreServicio;
    }

    public void setNombreServicio(String nombreServicio) {
        this.nombreServicio = nombreServicio;
    }

    public String getCategoriaServicio() {
        return categoriaServicio;
    }

    public void setCategoriaServicio(String categoriaServicio) {
        this.categoriaServicio = categoriaServicio;
    }

    public Double getPrecioServicio() {
        return precioServicio;
    }

    public void setPrecioServicio(Double precioServicio) {
        this.precioServicio = precioServicio;
    }

    public String getDuracionServicio() {
        return duracionServicio;
    }

    public void setDuracionServicio(String duracionServicio) {
        this.duracionServicio = duracionServicio;
    }

    public String getDescripcionServicio() {
        return descripcionServicio;
    }

    public void setDescripcionServicio(String descripcionServicio) {
        this.descripcionServicio = descripcionServicio;
    }

    public String getEstadoServicio() {
        return estadoServicio;
    }

    public void setEstadoServicio(String estadoServicio) {
        this.estadoServicio = estadoServicio;
    }

}
