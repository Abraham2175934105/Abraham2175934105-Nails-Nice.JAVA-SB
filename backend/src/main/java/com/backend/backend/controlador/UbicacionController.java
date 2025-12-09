package com.backend.backend.controlador;

import com.backend.backend.Entity.Ubicacion;
import com.backend.backend.repositorio.UbicacionRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping({"/api/ubicacion", "/api/ubicaciones"})
@CrossOrigin(origins = "*")
public class UbicacionController {

    private final UbicacionRepository ubicacionRepository;

    public UbicacionController(UbicacionRepository ubicacionRepository) {
        this.ubicacionRepository = ubicacionRepository;
    }

    @GetMapping
    public List<Ubicacion> getAll() {
        return ubicacionRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Ubicacion> getById(@PathVariable Integer id) {
        return ubicacionRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Ubicacion create(@RequestBody Ubicacion u) {
        return ubicacionRepository.save(u);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Ubicacion> update(@PathVariable Integer id, @RequestBody Ubicacion u) {
        return ubicacionRepository.findById(id)
                .map(existing -> {
                    existing.setDescripcion(u.getDescripcion());
                    return ResponseEntity.ok(ubicacionRepository.save(existing));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        ubicacionRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}