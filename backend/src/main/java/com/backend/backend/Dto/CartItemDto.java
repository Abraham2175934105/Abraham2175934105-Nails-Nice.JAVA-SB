package com.backend.backend.Dto;

public class CartItemDto {
    private Integer id;
    private Integer productoId;
    private String nombre;
    private Double precio;
    private Integer cantidad;
    private String imagen;

    public CartItemDto() {}

    public CartItemDto(Integer id, Integer productoId, String nombre, Double precio, Integer cantidad, String imagen) {
        this.id = id;
        this.productoId = productoId;
        this.nombre = nombre;
        this.precio = precio;
        this.cantidad = cantidad;
        this.imagen = imagen;
    }

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public Integer getProductoId() { return productoId; }
    public void setProductoId(Integer productoId) { this.productoId = productoId; }

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public Double getPrecio() { return precio; }
    public void setPrecio(Double precio) { this.precio = precio; }

    public Integer getCantidad() { return cantidad; }
    public void setCantidad(Integer cantidad) { this.cantidad = cantidad; }

    public String getImagen() { return imagen; }
    public void setImagen(String imagen) { this.imagen = imagen; }
}