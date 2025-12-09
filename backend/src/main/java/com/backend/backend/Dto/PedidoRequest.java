package com.backend.backend.Dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public class PedidoRequest {
    private Integer idCliente;
    private String detallePedido;
    private String estadoPedido;
    private BigDecimal totalPedido;
    private LocalDate fechaPedido;
    private Integer cantidadPedido;
    private List<PedidoProductoRequest> productos;

    // Nuevo campo: cliente (payload con nombre/email/direccion/telefono)
    private ClienteRequest cliente;

    public Integer getIdCliente() { return idCliente; }
    public void setIdCliente(Integer idCliente) { this.idCliente = idCliente; }

    public String getDetallePedido() { return detallePedido; }
    public void setDetallePedido(String detallePedido) { this.detallePedido = detallePedido; }

    public String getEstadoPedido() { return estadoPedido; }
    public void setEstadoPedido(String estadoPedido) { this.estadoPedido = estadoPedido; }

    public BigDecimal getTotalPedido() { return totalPedido; }
    public void setTotalPedido(BigDecimal totalPedido) { this.totalPedido = totalPedido; }

    public LocalDate getFechaPedido() { return fechaPedido; }
    public void setFechaPedido(LocalDate fechaPedido) { this.fechaPedido = fechaPedido; }

    public Integer getCantidadPedido() { return cantidadPedido; }
    public void setCantidadPedido(Integer cantidadPedido) { this.cantidadPedido = cantidadPedido; }

    public List<PedidoProductoRequest> getProductos() { return productos; }
    public void setProductos(List<PedidoProductoRequest> productos) { this.productos = productos; }

    public ClienteRequest getCliente() { return cliente; }
    public void setCliente(ClienteRequest cliente) { this.cliente = cliente; }
}