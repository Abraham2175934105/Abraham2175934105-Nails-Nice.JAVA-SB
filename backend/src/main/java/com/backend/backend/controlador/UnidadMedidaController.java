package com.backend.backend.controlador;

import com.backend.backend.Entity.UnidadMedida;
import com.backend.backend.repositorio.UnidadMedidaRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping({"/api/unidad_medida", "/api/unidad_medidas"}) // atiende ambas variantes
@CrossOrigin(origins = "*")
public class UnidadMedidaController {

    private final UnidadMedidaRepository unidadRepo;

    public UnidadMedidaController(UnidadMedidaRepository unidadRepo) {
        this.unidadRepo = unidadRepo;
    }

    @GetMapping
    public List<UnidadMedida> getAllUnidades() {
        return unidadRepo.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<UnidadMedida> getUnidadById(@PathVariable Integer id) {
        return unidadRepo.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public UnidadMedida createUnidad(@RequestBody UnidadMedida u) {
        return unidadRepo.save(u);
    }

    @PutMapping("/{id}")
    public ResponseEntity<UnidadMedida> updateUnidad(@PathVariable Integer id, @RequestBody UnidadMedida u) {
        return unidadRepo.findById(id)
                .map(existing -> {
                    u.setId(existing.getId());
                    return ResponseEntity.ok(unidadRepo.save(u));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUnidad(@PathVariable Integer id) {
        unidadRepo.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}