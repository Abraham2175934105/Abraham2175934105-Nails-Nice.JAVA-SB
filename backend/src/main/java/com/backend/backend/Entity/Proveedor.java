package com.backend.backend.Entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.util.Set;

@Entity
@Table(name = "proveedor")
@JsonIgnoreProperties({"inventarios"}) // evita serializar la colección inventarios y rompe la recursión
public class Proveedor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_proveedor")
    private Integer id;

    @Column(name = "nombre", nullable = false, length = 100)
    private String nombre;

    @Column(name = "correo", nullable = false, length = 100)
    private String correo;

    @Column(name = "telefono", nullable = false, length = 25)
    private String telefono;

    @Column(name = "direccion", nullable = false, length = 255)
    private String direccion;

    @OneToMany(mappedBy = "proveedor")
    private Set<Inventario> inventarios;

    // Getters y Setters
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public String getCorreo() { return correo; }
    public void setCorreo(String correo) { this.correo = correo; }

    public String getTelefono() { return telefono; }
    public void setTelefono(String telefono) { this.telefono = telefono; }

    public String getDireccion() { return direccion; }
    public void setDireccion(String direccion) { this.direccion = direccion; }

    public Set<Inventario> getInventarios() { return inventarios; }
    public void setInventarios(Set<Inventario> inventarios) { this.inventarios = inventarios; }
}