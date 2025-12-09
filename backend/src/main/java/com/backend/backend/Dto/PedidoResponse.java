package com.backend.backend.Dto;

import java.util.List;

public class PedidoResponse {
    private Integer id;
    private Integer idCliente;
    private String clienteNombre;
    private String detallePedido;
    private String estadoPedido;
    private Double totalPedido;
    private String fechaPedido;
    private Integer cantidadPedido;
    private List<PedidoProductoResponse> productos;

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public Integer getIdCliente() { return idCliente; }
    public void setIdCliente(Integer idCliente) { this.idCliente = idCliente; }

    public String getClienteNombre() { return clienteNombre; }
    public void setClienteNombre(String clienteNombre) { this.clienteNombre = clienteNombre; }

    public String getDetallePedido() { return detallePedido; }
    public void setDetallePedido(String detallePedido) { this.detallePedido = detallePedido; }

    public String getEstadoPedido() { return estadoPedido; }
    public void setEstadoPedido(String estadoPedido) { this.estadoPedido = estadoPedido; }

    public Double getTotalPedido() { return totalPedido; }
    public void setTotalPedido(Double totalPedido) { this.totalPedido = totalPedido; }

    public String getFechaPedido() { return fechaPedido; }
    public void setFechaPedido(String fechaPedido) { this.fechaPedido = fechaPedido; }

    public Integer getCantidadPedido() { return cantidadPedido; }
    public void setCantidadPedido(Integer cantidadPedido) { this.cantidadPedido = cantidadPedido; }

    public List<PedidoProductoResponse> getProductos() { return productos; }
    public void setProductos(List<PedidoProductoResponse> productos) { this.productos = productos; }
}