package com.backend.backend.Entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.util.Set;

@Entity
@Table(name = "ventas")
public class Ventas {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_ventas")
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "id_cliente", nullable = false)
    private Cliente cliente;

    @ManyToOne
    @JoinColumn(name = "id_metodo", nullable = false)
    private MetodoPago metodoPago;

    @Column(name = "numero_recibo", length = 50)
    private String numeroRecibo;

    @Column(name = "estado_venta", nullable = false, length = 20)
    private String estadoVenta;

    @Column(name = "fecha_de_venta", nullable = false)
    private LocalDate fechaVenta;

    @Column(name = "monto_venta", nullable = false)
    private Double montoVenta;

    @OneToMany(mappedBy = "ventas")
    private Set<DetalleVenta> detalles;

    // Getters y Setters
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Cliente getCliente() {
        return cliente;
    }

    public void setCliente(Cliente cliente) {
        this.cliente = cliente;
    }

    public MetodoPago getMetodoPago() {
        return metodoPago;
    }

    public void setMetodoPago(MetodoPago metodoPago) {
        this.metodoPago = metodoPago;
    }

    public String getNumeroRecibo() {
        return numeroRecibo;
    }

    public void setNumeroRecibo(String numeroRecibo) {
        this.numeroRecibo = numeroRecibo;
    }

    public String getEstadoVenta() {
        return estadoVenta;
    }

    public void setEstadoVenta(String estadoVenta) {
        this.estadoVenta = estadoVenta;
    }

    public LocalDate getFechaVenta() {
        return fechaVenta;
    }

    public void setFechaVenta(LocalDate fechaVenta) {
        this.fechaVenta = fechaVenta;
    }

    public Double getMontoVenta() {
        return montoVenta;
    }

    public void setMontoVenta(Double montoVenta) {
        this.montoVenta = montoVenta;
    }

    public Set<DetalleVenta> getDetalles() {
        return detalles;
    }

    public void setDetalles(Set<DetalleVenta> detalles) {
        this.detalles = detalles;
    }

}
