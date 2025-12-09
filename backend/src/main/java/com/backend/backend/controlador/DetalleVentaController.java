package com.backend.backend.controlador;

import com.backend.backend.Entity.DetalleVenta;
import com.backend.backend.servicio.DetalleVentaService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/detalleventas")
public class DetalleVentaController {

    private final DetalleVentaService detalleVentaService;

    public DetalleVentaController(DetalleVentaService detalleVentaService) {
        this.detalleVentaService = detalleVentaService;
    }

    @GetMapping
    public List<DetalleVenta> getAllDetalleVentas() {
        return detalleVentaService.getAllDetalleVentas();
    }

    @GetMapping("/{id}")
    public ResponseEntity<DetalleVenta> getDetalleVentaById(@PathVariable Integer id) {
        return detalleVentaService.getDetalleVentaById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public DetalleVenta createDetalleVenta(@RequestBody DetalleVenta detalleVenta) {
        return detalleVentaService.saveDetalleVenta(detalleVenta);
    }

    @PutMapping("/{id}")
    public ResponseEntity<DetalleVenta> updateDetalleVenta(@PathVariable Integer id, @RequestBody DetalleVenta detalleVenta) {
        return detalleVentaService.getDetalleVentaById(id)
                .map(existing -> {
                    detalleVenta.setId(existing.getId());
                    return ResponseEntity.ok(detalleVentaService.saveDetalleVenta(detalleVenta));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDetalleVenta(@PathVariable Integer id) {
        detalleVentaService.deleteDetalleVenta(id);
        return ResponseEntity.noContent().build();
    }
}
