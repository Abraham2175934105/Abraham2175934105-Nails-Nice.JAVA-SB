package com.backend.backend.Entity;

import jakarta.persistence.*;

@Entity
@Table(name = "tipo_servicio")
public class TipoServicio {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_tipo_servicio")
    private Integer idTipoServicio;

    @Column(name = "nombre_tipo", nullable = false)
    private String nombreTipo;

    // getters / setters
    public Integer getIdTipoServicio() {
        return idTipoServicio;
    }

    public void setIdTipoServicio(Integer idTipoServicio) {
        this.idTipoServicio = idTipoServicio;
    }

    // adaptadores para compatibilidad
    public Integer getId() {
        return idTipoServicio;
    }

    public void setId(Integer id) {
        this.idTipoServicio = id;
    }

    public String getNombreTipo() {
        return nombreTipo;
    }

    public void setNombreTipo(String nombreTipo) {
        this.nombreTipo = nombreTipo;
    }
}