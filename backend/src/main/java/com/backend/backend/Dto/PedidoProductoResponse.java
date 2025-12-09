package com.backend.backend.Dto;

import java.math.BigDecimal;

public class PedidoProductoResponse {
    private Integer id;
    private Integer idProducto;
    private String productoNombre;
    private Integer cantidad;
    private BigDecimal precioUnitario;

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public Integer getIdProducto() { return idProducto; }
    public void setIdProducto(Integer idProducto) { this.idProducto = idProducto; }

    public String getProductoNombre() { return productoNombre; }
    public void setProductoNombre(String productoNombre) { this.productoNombre = productoNombre; }

    public Integer getCantidad() { return cantidad; }
    public void setCantidad(Integer cantidad) { this.cantidad = cantidad; }

    public BigDecimal getPrecioUnitario() { return precioUnitario; }
    public void setPrecioUnitario(BigDecimal precioUnitario) { this.precioUnitario = precioUnitario; }
}