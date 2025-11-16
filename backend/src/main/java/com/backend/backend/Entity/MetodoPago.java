package com.backend.backend.Entity;

import jakarta.persistence.*;
import java.util.Set;

@Entity
@Table(name = "metodo_pago")
public class MetodoPago {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_metodo")
    private Integer id;

    @Column(name = "nombre_metodo", nullable = false, length = 50)
    private String nombreMetodo;

    @Column(name = "tipo_metodo", nullable = false, length = 50)
    private String tipoMetodo;

    @OneToMany(mappedBy = "metodoPago")
    private Set<Ventas> ventas;

    // Getters y Setters
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public String getNombreMetodo() { return nombreMetodo; }
    public void setNombreMetodo(String nombreMetodo) { this.nombreMetodo = nombreMetodo; }

    public String getTipoMetodo() { return tipoMetodo; }
    public void setTipoMetodo(String tipoMetodo) { this.tipoMetodo = tipoMetodo; }

    public Set<Ventas> getVentas() { return ventas; }
    public void setVentas(Set<Ventas> ventas) { this.ventas = ventas; }

}

