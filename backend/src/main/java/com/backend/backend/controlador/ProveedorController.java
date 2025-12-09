package com.backend.backend.controlador;

import com.backend.backend.Entity.Proveedor;
import com.backend.backend.repositorio.ProveedorRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping({"/api/proveedor", "/api/proveedores"})
@CrossOrigin(origins = "*")
public class ProveedorController {

    private final ProveedorRepository proveedorRepository;

    public ProveedorController(ProveedorRepository proveedorRepository) {
        this.proveedorRepository = proveedorRepository;
    }

    @GetMapping
    public List<Proveedor> getAll() {
        return proveedorRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Proveedor> getById(@PathVariable Integer id) {
        return proveedorRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Proveedor create(@RequestBody Proveedor p) {
        return proveedorRepository.save(p);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Proveedor> update(@PathVariable Integer id, @RequestBody Proveedor p) {
        return proveedorRepository.findById(id)
                .map(existing -> {
                    existing.setNombre(p.getNombre());
                    existing.setCorreo(p.getCorreo());
                    existing.setTelefono(p.getTelefono());
                    existing.setDireccion(p.getDireccion());
                    return ResponseEntity.ok(proveedorRepository.save(existing));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        proveedorRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}