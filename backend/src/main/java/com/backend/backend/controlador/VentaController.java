package com.backend.backend.controlador;

import com.backend.backend.Dto.VentaRequest;
import com.backend.backend.Dto.VentaResponse;
import com.backend.backend.servicio.VentaService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ventas")
@CrossOrigin(origins = "*")
public class VentaController {

    private final VentaService ventaService;

    public VentaController(VentaService ventaService) {
        this.ventaService = ventaService;
    }

    @GetMapping
    public ResponseEntity<List<VentaResponse>> getAllVentas() {
        return ResponseEntity.ok(ventaService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<VentaResponse> getVentaById(@PathVariable Integer id) {
        return ResponseEntity.ok(ventaService.findById(id));
    }

    @PostMapping
    public ResponseEntity<VentaResponse> createVenta(@RequestBody VentaRequest ventaRequest) {
        VentaResponse ventaCreada = ventaService.createVenta(ventaRequest);
        return new ResponseEntity<>(ventaCreada, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<VentaResponse> updateVenta(@PathVariable Integer id, @RequestBody VentaRequest ventaRequest) {
        VentaResponse ventaActualizada = ventaService.updateVenta(id, ventaRequest);
        return ResponseEntity.ok(ventaActualizada);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteVenta(@PathVariable Integer id) {
        ventaService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
