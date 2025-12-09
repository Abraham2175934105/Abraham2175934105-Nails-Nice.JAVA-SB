package com.backend.backend.Dto;

import java.time.LocalDate;
import java.util.List;

public class VentaResponse {
    private Integer id;
    private Integer idCliente;
    private Integer idMetodo;
    private String numeroRecibo;
    private String estadoVenta;
    private LocalDate fechaVenta;
    private Double montoVenta;
    private List<DetalleVentaRequest> detalles;

    // getters / setters
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }
    public Integer getIdCliente() { return idCliente; }
    public void setIdCliente(Integer idCliente) { this.idCliente = idCliente; }
    public Integer getIdMetodo() { return idMetodo; }
    public void setIdMetodo(Integer idMetodo) { this.idMetodo = idMetodo; }
    public String getNumeroRecibo() { return numeroRecibo; }
    public void setNumeroRecibo(String numeroRecibo) { this.numeroRecibo = numeroRecibo; }
    public String getEstadoVenta() { return estadoVenta; }
    public void setEstadoVenta(String estadoVenta) { this.estadoVenta = estadoVenta; }
    public LocalDate getFechaVenta() { return fechaVenta; }
    public void setFechaVenta(LocalDate fechaVenta) { this.fechaVenta = fechaVenta; }
    public Double getMontoVenta() { return montoVenta; }
    public void setMontoVenta(Double montoVenta) { this.montoVenta = montoVenta; }
    public List<DetalleVentaRequest> getDetalles() { return detalles; }
    public void setDetalles(List<DetalleVentaRequest> detalles) { this.detalles = detalles; }
}