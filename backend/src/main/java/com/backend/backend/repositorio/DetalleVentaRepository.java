package com.backend.backend.repositorio;

import com.backend.backend.Entity.DetalleVenta;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DetalleVentaRepository extends JpaRepository<DetalleVenta, Integer> {
    // Buscar todos los detalles asociados a una venta por id de la venta
    List<DetalleVenta> findByVentas_Id(Integer ventasId);

    // Eliminar todos los detalles asociados a una venta por id de la venta
    void deleteByVentas_Id(Integer ventasId);
}