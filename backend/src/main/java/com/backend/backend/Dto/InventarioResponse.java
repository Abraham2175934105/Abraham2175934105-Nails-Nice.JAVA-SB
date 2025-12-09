package com.backend.backend.Dto;

public class InventarioResponse {
    private Integer id;
    private Integer idProducto;
    private String productoNombre;
    private Integer idUbicacion;
    private String ubicacionDescripcion;
    private Integer idProveedor;
    private String proveedorNombre;
    private Integer cantidad;
    private Integer stock;
    private String estado;
    private String fechaIngreso; // yyyy-MM-dd
    private String createdAt;
    private String updatedAt;
    private Boolean createdWithProduct;

    // getters / setters
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public Integer getIdProducto() { return idProducto; }
    public void setIdProducto(Integer idProducto) { this.idProducto = idProducto; }

    public String getProductoNombre() { return productoNombre; }
    public void setProductoNombre(String productoNombre) { this.productoNombre = productoNombre; }

    public Integer getIdUbicacion() { return idUbicacion; }
    public void setIdUbicacion(Integer idUbicacion) { this.idUbicacion = idUbicacion; }

    public String getUbicacionDescripcion() { return ubicacionDescripcion; }
    public void setUbicacionDescripcion(String ubicacionDescripcion) { this.ubicacionDescripcion = ubicacionDescripcion; }

    public Integer getIdProveedor() { return idProveedor; }
    public void setIdProveedor(Integer idProveedor) { this.idProveedor = idProveedor; }

    public String getProveedorNombre() { return proveedorNombre; }
    public void setProveedorNombre(String proveedorNombre) { this.proveedorNombre = proveedorNombre; }

    public Integer getCantidad() { return cantidad; }
    public void setCantidad(Integer cantidad) { this.cantidad = cantidad; }

    public Integer getStock() { return stock; }
    public void setStock(Integer stock) { this.stock = stock; }

    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }

    public String getFechaIngreso() { return fechaIngreso; }
    public void setFechaIngreso(String fechaIngreso) { this.fechaIngreso = fechaIngreso; }

    public String getCreatedAt() { return createdAt; }
    public void setCreatedAt(String createdAt) { this.createdAt = createdAt; }

    public String getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(String updatedAt) { this.updatedAt = updatedAt; }

    public Boolean getCreatedWithProduct() { return createdWithProduct; }
    public void setCreatedWithProduct(Boolean createdWithProduct) { this.createdWithProduct = createdWithProduct; }
}