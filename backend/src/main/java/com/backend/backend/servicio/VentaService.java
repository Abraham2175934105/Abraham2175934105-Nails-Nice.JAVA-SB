package com.backend.backend.servicio;

import com.backend.backend.Dto.VentaRequest;
import com.backend.backend.Dto.VentaResponse;

import java.util.List;

public interface VentaService {
    List<VentaResponse> findAll();
    VentaResponse findById(Integer id);
    VentaResponse createVenta(VentaRequest req);
    // Nueva firma para actualizar
    VentaResponse updateVenta(Integer id, VentaRequest req);
    void delete(Integer id);
}