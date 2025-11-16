package com.backend.backend.Entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.util.Set;

@Entity
@Table(name = "pedido")
public class Pedido {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_pedido")
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "id_cliente", nullable = false)
    private Cliente cliente;

    @Column(name = "detalle_pedido", nullable = false)
    private String detallePedido;

    @Column(name = "estado_pedido", nullable = false, length = 20)
    private String estadoPedido;

    @Column(name = "total_pedido", nullable = false)
    private Double totalPedido;

    @Column(name = "fecha_pedido", nullable = false)
    private LocalDate fechaPedido;

    @Column(name = "cantidad_pedido", nullable = false)
    private Integer cantidadPedido;

    @OneToMany(mappedBy = "pedido")
    private Set<PedidoProducto> productos;

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

    public String getDetallePedido() {
        return detallePedido;
    }

    public void setDetallePedido(String detallePedido) {
        this.detallePedido = detallePedido;
    }

    public String getEstadoPedido() {
        return estadoPedido;
    }

    public void setEstadoPedido(String estadoPedido) {
        this.estadoPedido = estadoPedido;
    }

    public Double getTotalPedido() {
        return totalPedido;
    }

    public void setTotalPedido(Double totalPedido) {
        this.totalPedido = totalPedido;
    }

    public LocalDate getFechaPedido() {
        return fechaPedido;
    }

    public void setFechaPedido(LocalDate fechaPedido) {
        this.fechaPedido = fechaPedido;
    }

    public Integer getCantidadPedido() {
        return cantidadPedido;
    }

    public void setCantidadPedido(Integer cantidadPedido) {
        this.cantidadPedido = cantidadPedido;
    }

    public Set<PedidoProducto> getProductos() {
        return productos;
    }

    public void setProductos(Set<PedidoProducto> productos) {
        this.productos = productos;
    }

}
