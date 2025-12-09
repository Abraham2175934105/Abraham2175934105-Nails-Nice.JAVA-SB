package com.backend.backend.controlador;

import com.backend.backend.Entity.Marca;
import com.backend.backend.repositorio.MarcaRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/marca") // ruta singular que usa el frontend
@CrossOrigin(origins = "*")
public class MarcaController {

    private final MarcaRepository marcaRepository;

    public MarcaController(MarcaRepository marcaRepository) {
        this.marcaRepository = marcaRepository;
    }

    @GetMapping
    public List<Marca> getAllMarcas() {
        return marcaRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Marca> getMarcaById(@PathVariable Integer id) {
        return marcaRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Marca createMarca(@RequestBody Marca marca) {
        return marcaRepository.save(marca);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Marca> updateMarca(@PathVariable Integer id, @RequestBody Marca marca) {
        return marcaRepository.findById(id)
                .map(existing -> {
                    marca.setId(existing.getId());
                    return ResponseEntity.ok(marcaRepository.save(marca));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMarca(@PathVariable Integer id) {
        marcaRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}