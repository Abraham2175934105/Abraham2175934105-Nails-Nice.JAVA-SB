package com.backend.backend.controlador;

import com.backend.backend.Dto.ProductoRequest;
import com.backend.backend.Dto.ProductoResponse;
import com.backend.backend.servicio.ProductoService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.stream.Collectors;

@CrossOrigin(origins = "http://localhost:8080")
@RestController
@RequestMapping("/api/productos")
public class ProductoController {

    private final ProductoService productoService;

    public ProductoController(ProductoService productoService) {
        this.productoService = productoService;
    }

    @GetMapping
    public ResponseEntity<List<ProductoResponse>> all() {
        return ResponseEntity.ok(productoService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductoResponse> getById(@PathVariable Integer id) {
        return ResponseEntity.ok(productoService.findById(id));
    }

    private String capitalizeFirst(String s) {
        if (s == null || s.isBlank()) return s;
        s = s.trim();
        return s.substring(0,1).toUpperCase() + s.substring(1).toLowerCase();
    }

    @PostMapping
    public ResponseEntity<?> create(@Valid @RequestBody ProductoRequest request, BindingResult br) {
        if (br.hasErrors()) {
            var errors = br.getFieldErrors().stream()
                    .collect(Collectors.toMap(e -> e.getField(), e -> e.getDefaultMessage()));
            return ResponseEntity.badRequest().body(errors);
        }
        request.setEstadoProducto(capitalizeFirst(request.getEstadoProducto()));
        ProductoResponse created = productoService.create(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Integer id, @Valid @RequestBody ProductoRequest request, BindingResult br) {
        if (br.hasErrors()) {
            var errors = br.getFieldErrors().stream()
                    .collect(Collectors.toMap(e -> e.getField(), e -> e.getDefaultMessage()));
            return ResponseEntity.badRequest().body(errors);
        }
        request.setEstadoProducto(capitalizeFirst(request.getEstadoProducto()));
        ProductoResponse updated = productoService.update(id, request);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Integer id) {
        productoService.delete(id);
        return ResponseEntity.noContent().build();
    }
}