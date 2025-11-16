package com.backend.backend.Entity;

import jakarta.persistence.*;
import java.util.Set;

@Entity
@Table(name = "tipo_servicio")
public class TipoServicio {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_tipo_servicio")
    private Integer id;

    @Column(name = "nombre_tipo", nullable = false, length = 50)
    private String nombreTipo;

    @OneToMany(mappedBy = "tipoServicio")
    private Set<Servicios> servicios;

    // Getters y Setters
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getNombreTipo() {
        return nombreTipo;
    }

    public void setNombreTipo(String nombreTipo) {
        this.nombreTipo = nombreTipo;
    }

    public Set<Servicios> getServicios() {
        return servicios;
    }

    public void setServicios(Set<Servicios> servicios) {
        this.servicios = servicios;
    }

}
