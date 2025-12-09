package com.backend.backend.Entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;

@Entity
@Table(name = "servicios")
// Evita que Jackson intente serializar los proxies de Hibernate (ByteBuddyInterceptor)
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Servicios {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_servicio")
    private Integer idServicio;

    // relacion a TipoServicio (según DDL: id_tipo_servicio)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_tipo_servicio", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"}) // adicional sobre la propiedad
    private TipoServicio tipoServicio;

    @Column(name = "nombre_servicio", nullable = false)
    private String nombreServicio;

    @Column(name = "categoria_servicio", nullable = false)
    private String categoriaServicio;

    @Column(name = "precio_servicio", nullable = false)
    private Double precioServicio;

    @Column(name = "duracion_servicio", nullable = false)
    private String duracionServicio;

    @Column(name = "descripcion_servicio", columnDefinition = "TEXT")
    private String descripcionServicio;

    @Column(name = "estado_servicio", nullable = false)
    private String estadoServicio;

    // getters / setters "canonicos"
    public Integer getIdServicio() {
        return idServicio;
    }

    public void setIdServicio(Integer idServicio) {
        this.idServicio = idServicio;
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

    // Métodos adaptadores para compatibilidad con controladores/servicios existentes
    public Integer getId() {
        return this.idServicio;
    }

    public void setId(Integer id) {
        this.idServicio = id;
    }
}