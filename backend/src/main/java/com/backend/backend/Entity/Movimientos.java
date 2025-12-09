package com.backend.backend.Entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "movimientos")
public class Movimientos {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_movimientos")
    private Integer idMovimientos;

    @ManyToOne
    @JoinColumn(name = "id_producto", nullable = false)
    private Producto producto;

    @ManyToOne
    @JoinColumn(name = "id_inventario", nullable = false)
    private Inventario inventario;

    @Column(name = "tipo_movimiento", nullable = false)
    private String tipoMovimiento;

    @Column(name = "cantidad_movimiento", nullable = false)
    private Integer cantidadMovimiento;

    @Column(name = "fecha_movimiento", nullable = false)
    private LocalDate fechaMovimiento;

    @Column(name = "descripcion_movimiento", nullable = false)
    private String descripcionMovimiento;

    public Integer getIdMovimientos() { return idMovimientos; }
    public void setIdMovimientos(Integer idMovimientos) { this.idMovimientos = idMovimientos; }

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
}