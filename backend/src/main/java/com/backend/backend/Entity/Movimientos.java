package com.backend.backend.Entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "movimientos")
public class Movimientos {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_movimientos")
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "id_producto", nullable = false)
    private Producto producto;

    @ManyToOne
    @JoinColumn(name = "id_inventario", nullable = false)
    private Inventario inventario;

    @Column(name = "tipo_movimiento", nullable = false, length = 20)
    private String tipoMovimiento;

    @Column(name = "cantidad_movimiento", nullable = false)
    private Integer cantidadMovimiento;

    @Column(name = "fecha_movimiento", nullable = false)
    private LocalDate fechaMovimiento;

    @Column(name = "descripcion_movimiento", nullable = false, length = 255)
    private String descripcionMovimiento;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // Getters y Setters
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public Producto getProducto() { return producto; }
    public void setProducto(Producto producto) { this.producto = producto; }

    public Inventario getInventario() { return inventario; }
    public void setInventario(Inventario inventario) { this.inventario = inventario; }

    public String getTipoMovimiento() { return tipoMovimiento; }
    public void setTipoMovimiento(String tipoMovimiento) { this.tipoMovimiento = tipoMovimiento; }

    public Integer getCantidadMovimiento() { return cantidadMovimiento; }
    public void setCantidadMovimiento(Integer cantidadMovimiento) { this.cantidadMovimiento = cantidadMovimiento; }

    public LocalDate getFechaMovimiento() { return fechaMovimiento; }
    public void setFechaMovimiento(LocalDate fechaMovimiento) { this.fechaMovimiento = fechaMovimiento; }

    public String getDescripcionMovimiento() { return descripcionMovimiento; }
    public void setDescripcionMovimiento(String descripcionMovimiento) { this.descripcionMovimiento = descripcionMovimiento; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}

