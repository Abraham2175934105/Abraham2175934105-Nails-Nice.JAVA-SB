package com.backend.backend.Entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Set;

@Entity
@Table(name = "inventario")
public class Inventario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_inventario")
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "id_producto", nullable = false)
    private Producto producto;

    @ManyToOne
    @JoinColumn(name = "id_ubicacion", nullable = false)
    private Ubicacion ubicacion;

    @ManyToOne
    @JoinColumn(name = "id_proveedor", nullable = false)
    private Proveedor proveedor;

    @Column(name = "cantidad", nullable = false)
    private Integer cantidad;

    @Column(name = "stock", nullable = false)
    private Integer stock;

    @Column(name = "estado", nullable = false, length = 20)
    private String estado;

    @Column(name = "fecha_ingreso", nullable = false)
    private LocalDate fechaIngreso;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "inventario")
    private Set<Movimientos> movimientos;

    // Getters y Setters
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public Producto getProducto() { return producto; }
    public void setProducto(Producto producto) { this.producto = producto; }

    public Ubicacion getUbicacion() { return ubicacion; }
    public void setUbicacion(Ubicacion ubicacion) { this.ubicacion = ubicacion; }

    public Proveedor getProveedor() { return proveedor; }
    public void setProveedor(Proveedor proveedor) { this.proveedor = proveedor; }

    public Integer getCantidad() { return cantidad; }
    public void setCantidad(Integer cantidad) { this.cantidad = cantidad; }

    public Integer getStock() { return stock; }
    public void setStock(Integer stock) { this.stock = stock; }

    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }

    public LocalDate getFechaIngreso() { return fechaIngreso; }
    public void setFechaIngreso(LocalDate fechaIngreso) { this.fechaIngreso = fechaIngreso; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public Set<Movimientos> getMovimientos() { return movimientos; }
    public void setMovimientos(Set<Movimientos> movimientos) { this.movimientos = movimientos; }
}

