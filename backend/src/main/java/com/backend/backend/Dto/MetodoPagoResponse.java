package com.backend.backend.Dto;

public class MetodoPagoResponse {
    private Integer id;
    private String nombreMetodo;

    public MetodoPagoResponse() {}

    public MetodoPagoResponse(Integer id, String nombreMetodo) {
        this.id = id;
        this.nombreMetodo = nombreMetodo;
    }

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public String getNombreMetodo() { return nombreMetodo; }
    public void setNombreMetodo(String nombreMetodo) { this.nombreMetodo = nombreMetodo; }
}