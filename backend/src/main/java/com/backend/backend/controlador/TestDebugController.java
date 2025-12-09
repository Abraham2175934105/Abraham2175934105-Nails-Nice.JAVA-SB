package com.backend.backend.controlador;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.HashMap;
import java.util.Map;

import com.backend.backend.repositorio.ProductoRepository;
import com.backend.backend.repositorio.ColorRepository;
import com.backend.backend.repositorio.MarcaRepository;
import com.backend.backend.repositorio.UnidadMedidaRepository;
import com.backend.backend.repositorio.CategoriaRepository;

@RestController
@RequestMapping("/api/debug")
@CrossOrigin(origins = "*")
public class TestDebugController {

    @Autowired(required = false)
    private ProductoRepository productoRepository;

    @Autowired(required = false)
    private ColorRepository colorRepository;

    @Autowired(required = false)
    private MarcaRepository marcaRepository;

    @Autowired(required = false)
    private UnidadMedidaRepository unidadRepository;

    @Autowired(required = false)
    private CategoriaRepository categoriaRepository;

    @GetMapping("/ping")
    public ResponseEntity<?> ping() {
        return ResponseEntity.ok(Map.of("status", "ok", "msg", "debug pong"));
    }

    @GetMapping("/repos-counts")
    public ResponseEntity<?> counts() {
        Map<String, Object> res = new HashMap<>();
        try {
            res.put("productoRepository", productoRepository != null ? productoRepository.count() : "NO_BEAN");
        } catch (Exception ex) {
            res.put("productoRepository_error", ex.toString());
        }
        try {
            res.put("colorRepository", colorRepository != null ? colorRepository.count() : "NO_BEAN");
        } catch (Exception ex) {
            res.put("colorRepository_error", ex.toString());
        }
        try {
            res.put("marcaRepository", marcaRepository != null ? marcaRepository.count() : "NO_BEAN");
        } catch (Exception ex) {
            res.put("marcaRepository_error", ex.toString());
        }
        try {
            res.put("unidadRepository", unidadRepository != null ? unidadRepository.count() : "NO_BEAN");
        } catch (Exception ex) {
            res.put("unidadRepository_error", ex.toString());
        }
        try {
            res.put("categoriaRepository", categoriaRepository != null ? categoriaRepository.count() : "NO_BEAN");
        } catch (Exception ex) {
            res.put("categoriaRepository_error", ex.toString());
        }
        return ResponseEntity.ok(res);
    }

    @GetMapping("/colors-sample")
    public ResponseEntity<?> colorsSample() {
        try {
            if (colorRepository == null) return ResponseEntity.ok(Map.of("error", "colorRepository bean not found"));
            var list = colorRepository.findAll();
            // return small sample and class name of entity
            return ResponseEntity.ok(Map.of("size", list.size(), "first", list.isEmpty() ? null : list.get(0)));
        } catch (Exception ex) {
            ex.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("error", ex.toString(), "message", ex.getMessage()));
        }
    }
    // Agrega dentro de la clase TestDebugController existente:
    @GetMapping("/marcas-sample")
    public ResponseEntity<?> marcasSample() {
        try {
            if (marcaRepository == null) return ResponseEntity.ok(Map.of("error", "marcaRepository bean not found"));
            var list = marcaRepository.findAll();
            return ResponseEntity.ok(Map.of("size", list.size(), "first", list.isEmpty() ? null : Map.of("id", list.get(0).getId(), "nombre", list.get(0).getNombreMarca())));
        } catch (Exception ex) {
            ex.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("error", ex.toString(), "message", ex.getMessage()));
        }
    }

    @GetMapping("/unidades-sample")
    public ResponseEntity<?> unidadesSample() {
        try {
            if (unidadRepository == null) return ResponseEntity.ok(Map.of("error", "unidadRepository bean not found"));
            var list = unidadRepository.findAll();
            return ResponseEntity.ok(Map.of("size", list.size(), "first", list.isEmpty() ? null : Map.of("id", list.get(0).getId(), "nombre", list.get(0).getNombreMedida())));
        } catch (Exception ex) {
            ex.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("error", ex.toString(), "message", ex.getMessage()));
        }
    }
}