package com.backend.backend.servicio;

import com.backend.backend.Dto.ProductoRequest;
import com.backend.backend.Dto.ProductoResponse;

import java.util.List;

public interface ProductoService {
    List<ProductoResponse> findAll();
    ProductoResponse findById(Integer id);
    ProductoResponse create(ProductoRequest request);
    ProductoResponse update(Integer id, ProductoRequest request);
    void delete(Integer id);
}
