package com.backend.backend.controlador;

import com.backend.backend.Dto.InventarioRequest;
import com.backend.backend.Dto.InventarioResponse;
import com.backend.backend.Entity.Inventario;
import com.backend.backend.Entity.Producto;
import com.backend.backend.Entity.Ubicacion;
import com.backend.backend.Entity.Proveedor;
import com.backend.backend.Exception.ResourceNotFoundException;
import com.backend.backend.repositorio.InventarioRepository;
import com.backend.backend.repositorio.ProductoRepository;
import com.backend.backend.repositorio.UbicacionRepository;
import com.backend.backend.repositorio.ProveedorRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/inventario")
@CrossOrigin(origins = "*")
public class InventarioController {

    private final InventarioRepository inventarioRepository;
    private final ProductoRepository productoRepository;
    private final UbicacionRepository ubicacionRepository;
    private final ProveedorRepository proveedorRepository;

    private final DateTimeFormatter fmt = DateTimeFormatter.ISO_LOCAL_DATE;

    public InventarioController(InventarioRepository inventarioRepository,
                                ProductoRepository productoRepository,
                                UbicacionRepository ubicacionRepository,
                                ProveedorRepository proveedorRepository) {
        this.inventarioRepository = inventarioRepository;
        this.productoRepository = productoRepository;
        this.ubicacionRepository = ubicacionRepository;
        this.proveedorRepository = proveedorRepository;
    }

    // Helper: transforma entidad a DTO esperado por el frontend
    private InventarioResponse toDto(Inventario inv) {
        InventarioResponse r = new InventarioResponse();
        r.setId(inv.getIdInventario() != null ? inv.getIdInventario() : inv.getId()); // compatibilidad
        if (inv.getProducto() != null) {
            Producto p = inv.getProducto();
            r.setIdProducto(p.getId());
            r.setProductoNombre(p.getNombre());
        } else {
            r.setIdProducto(null);
            r.setProductoNombre(null);
        }
        if (inv.getUbicacion() != null) {
            Ubicacion u = inv.getUbicacion();
            r.setIdUbicacion(u.getId());
            r.setUbicacionDescripcion(u.getDescripcion());
        }
        if (inv.getProveedor() != null) {
            Proveedor prov = inv.getProveedor();
            r.setIdProveedor(prov.getId());
            r.setProveedorNombre(prov.getNombre());
        }
        r.setCantidad(inv.getCantidad());
        r.setStock(inv.getStock());
        r.setEstado(inv.getEstado());
        if (inv.getFechaIngreso() != null) r.setFechaIngreso(inv.getFechaIngreso().format(fmt));
        if (inv.getCreatedAt() != null) r.setCreatedAt(inv.getCreatedAt().toString());
        if (inv.getUpdatedAt() != null) r.setUpdatedAt(inv.getUpdatedAt().toString());
        r.setCreatedWithProduct(inv.getCreatedWithProduct() != null ? inv.getCreatedWithProduct() : false);
        return r;
    }

    @GetMapping
    public ResponseEntity<List<InventarioResponse>> all() {
        List<Inventario> items = inventarioRepository.findAll();
        List<InventarioResponse> dtos = items.stream().map(this::toDto).collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/{id}")
    public ResponseEntity<InventarioResponse> get(@PathVariable Integer id) {
        Inventario inv = inventarioRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Inventario no encontrado " + id));
        return ResponseEntity.ok(toDto(inv));
    }

    @PostMapping
    public ResponseEntity<InventarioResponse> create(@RequestBody InventarioRequest req) {
        // buscar relaciones
        Producto producto = productoRepository.findById(req.getIdProducto()).orElseThrow(() -> new ResourceNotFoundException("Producto no encontrado"));
        Ubicacion ubicacion = ubicacionRepository.findById(req.getIdUbicacion()).orElseThrow(() -> new ResourceNotFoundException("Ubicacion no encontrada"));
        Proveedor proveedor = proveedorRepository.findById(req.getIdProveedor()).orElseThrow(() -> new ResourceNotFoundException("Proveedor no encontrado"));

        Inventario inv = new Inventario();
        inv.setProducto(producto);
        inv.setUbicacion(ubicacion);
        inv.setProveedor(proveedor);
        inv.setCantidad(req.getCantidad() != null ? req.getCantidad() : 0);
        inv.setStock(req.getStock() != null ? req.getStock() : 0);
        inv.setEstado(req.getEstado());
        if (req.getFechaIngreso() != null && !req.getFechaIngreso().isBlank()) inv.setFechaIngreso(LocalDate.parse(req.getFechaIngreso(), fmt));
        inv.setCreatedWithProduct(false);
        inv = inventarioRepository.save(inv);
        return ResponseEntity.status(201).body(toDto(inv));
    }

    @PutMapping("/{id}")
    public ResponseEntity<InventarioResponse> update(@PathVariable Integer id, @RequestBody InventarioRequest req) {
        Inventario inv = inventarioRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Inventario no encontrado " + id));
        if (req.getIdProducto() != null) {
            Producto p = productoRepository.findById(req.getIdProducto()).orElseThrow(() -> new ResourceNotFoundException("Producto no encontrado"));
            inv.setProducto(p);
        }
        if (req.getIdUbicacion() != null) {
            Ubicacion u = ubicacionRepository.findById(req.getIdUbicacion()).orElseThrow(() -> new ResourceNotFoundException("Ubicacion no encontrada"));
            inv.setUbicacion(u);
        }
        if (req.getIdProveedor() != null) {
            Proveedor prov = proveedorRepository.findById(req.getIdProveedor()).orElseThrow(() -> new ResourceNotFoundException("Proveedor no encontrado"));
            inv.setProveedor(prov);
        }
        inv.setCantidad(req.getCantidad() != null ? req.getCantidad() : inv.getCantidad());
        inv.setStock(req.getStock() != null ? req.getStock() : inv.getStock());
        inv.setEstado(req.getEstado() != null ? req.getEstado() : inv.getEstado());
        if (req.getFechaIngreso() != null && !req.getFechaIngreso().isBlank()) inv.setFechaIngreso(LocalDate.parse(req.getFechaIngreso(), fmt));
        inv = inventarioRepository.save(inv);
        return ResponseEntity.ok(toDto(inv));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        inventarioRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}