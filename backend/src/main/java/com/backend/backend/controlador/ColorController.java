package com.backend.backend.controlador;

import com.backend.backend.Entity.Color;
import com.backend.backend.repositorio.ColorRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping({"/api/colors", "/api/color"}) // admite ambas rutas
@CrossOrigin(origins = "*")
public class ColorController {

    private final ColorRepository colorRepository;

    public ColorController(ColorRepository colorRepository) {
        this.colorRepository = colorRepository;
    }

    @GetMapping
    public List<Color> getAllColors() {
        return colorRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Color> getColorById(@PathVariable Integer id) {
        return colorRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Color createColor(@RequestBody Color color) {
        return colorRepository.save(color);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Color> updateColor(@PathVariable Integer id, @RequestBody Color color) {
        return colorRepository.findById(id)
                .map(existing -> {
                    color.setId(existing.getId());
                    return ResponseEntity.ok(colorRepository.save(color));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteColor(@PathVariable Integer id) {
        colorRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}