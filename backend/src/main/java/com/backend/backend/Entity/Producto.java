package com.backend.backend.Entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "productos")
public class Producto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_producto")
    private Integer id;

    @Column(name = "nombre", nullable = false, length = 100)
    private String nombre;

    @Column(name = "descripcion", nullable = false, columnDefinition = "TEXT")
    private String descripcion;

    @Column(name = "precio", nullable = false, precision = 10, scale = 2)
    private BigDecimal precio;

    @Column(name = "estado_producto", nullable = false, length = 20)
    private String estadoProducto;

    @Column(name = "imagen", length = 255)
    private String imagen;

    @ManyToOne
    @JoinColumn(name = "id_color")
    private Color color;

    @ManyToOne
    @JoinColumn(name = "id_marca")
    private Marca marca;

    @ManyToOne
    @JoinColumn(name = "id_unidad_medida")
    private UnidadMedida unidadMedida;

    @ManyToOne
    @JoinColumn(name = "id_categoria")
    private Categoria categoria;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // Getters y Setters
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }

    public BigDecimal getPrecio() { return precio; }
    public void setPrecio(BigDecimal precio) { this.precio = precio; }

    public String getEstadoProducto() { return estadoProducto; }
    public void setEstadoProducto(String estadoProducto) { this.estadoProducto = estadoProducto; }

    public String getImagen() { return imagen; }
    public void setImagen(String imagen) { this.imagen = imagen; }

    public Color getColor() { return color; }
    public void setColor(Color color) { this.color = color; }

    public Marca getMarca() { return marca; }
    public void setMarca(Marca marca) { this.marca = marca; }

    public UnidadMedida getUnidadMedida() { return unidadMedida; }
    public void setUnidadMedida(UnidadMedida unidadMedida) { this.unidadMedida = unidadMedida; }

    public Categoria getCategoria() { return categoria; }
    public void setCategoria(Categoria categoria) { this.categoria = categoria; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}

