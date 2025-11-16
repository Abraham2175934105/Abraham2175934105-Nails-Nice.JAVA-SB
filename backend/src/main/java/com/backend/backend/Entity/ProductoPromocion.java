package com.backend.backend.Entity;

import jakarta.persistence.*;

@Entity
@Table(name = "producto_promocion")
public class ProductoPromocion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "producto_id", nullable = false)
    private Producto producto;

    @ManyToOne
    @JoinColumn(name = "promocion_id", nullable = false)
    private Promociones promocion;

    @ManyToOne
    @JoinColumn(name = "tipo_promocion_id", nullable = false)
    private TipoPromocion tipoPromocion;

    @Column(name = "valor")
    private Double valor;

    // Getters y Setters
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Producto getProducto() {
        return producto;
    }

    public void setProducto(Producto producto) {
        this.producto = producto;
    }

    public Promociones getPromocion() {
        return promocion;
    }

    public void setPromocion(Promociones promocion) {
        this.promocion = promocion;
    }

    public TipoPromocion getTipoPromocion() {
        return tipoPromocion;
    }

    public void setTipoPromocion(TipoPromocion tipoPromocion) {
        this.tipoPromocion = tipoPromocion;
    }

    public Double getValor() {
        return valor;
    }

    public void setValor(Double valor) {
        this.valor = valor;
    }

}
