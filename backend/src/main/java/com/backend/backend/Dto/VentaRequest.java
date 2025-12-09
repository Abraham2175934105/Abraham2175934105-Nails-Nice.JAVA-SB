package com.backend.backend.Dto;

import java.math.BigDecimal;
import java.util.List;

public class VentaRequest {
    private Integer idCliente;
    private Integer idMetodo;
    private String numeroRecibo;
    private String estadoVenta;
    private String fechaVenta; // frontend envía yyyy-MM-dd
    private BigDecimal montoVenta;
    private List<DetalleVentaRequest> detalles;
    private Integer idPedido;

    public Integer getIdCliente() { return idCliente; }
    public void setIdCliente(Integer idCliente) { this.idCliente = idCliente; }

    public Integer getIdMetodo() { return idMetodo; }
    public void setIdMetodo(Integer idMetodo) { this.idMetodo = idMetodo; }

    public String getNumeroRecibo() { return numeroRecibo; }
    public void setNumeroRecibo(String numeroRecibo) { this.numeroRecibo = numeroRecibo; }

    public String getEstadoVenta() { return estadoVenta; }
    public void setEstadoVenta(String estadoVenta) { this.estadoVenta = estadoVenta; }

    public String getFechaVenta() { return fechaVenta; }
    public void setFechaVenta(String fechaVenta) { this.fechaVenta = fechaVenta; }

    public BigDecimal getMontoVenta() { return montoVenta; }
    public void setMontoVenta(BigDecimal montoVenta) { this.montoVenta = montoVenta; }

    public List<DetalleVentaRequest> getDetalles() { return detalles; }
    public void setDetalles(List<DetalleVentaRequest> detalles) { this.detalles = detalles; }

    public Integer getIdPedido() { return idPedido; }
    public void setIdPedido(Integer idPedido) { this.idPedido = idPedido; }
}