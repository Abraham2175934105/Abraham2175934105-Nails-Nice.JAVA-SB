package com.backend.backend.servicio;

import com.backend.backend.Entity.DetalleVenta;
import com.backend.backend.repositorio.DetalleVentaRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class DetalleVentaService {

    private final DetalleVentaRepository detalleVentaRepository;

    public DetalleVentaService(DetalleVentaRepository detalleVentaRepository) {
        this.detalleVentaRepository = detalleVentaRepository;
    }

    public List<DetalleVenta> getAllDetalleVentas() {
        return detalleVentaRepository.findAll();
    }

    public Optional<DetalleVenta> getDetalleVentaById(Integer id) {
        return detalleVentaRepository.findById(id);
    }

    public DetalleVenta saveDetalleVenta(DetalleVenta detalleVenta) {
        return detalleVentaRepository.save(detalleVenta);
    }

    public void deleteDetalleVenta(Integer id) {
        detalleVentaRepository.deleteById(id);
    }
}
