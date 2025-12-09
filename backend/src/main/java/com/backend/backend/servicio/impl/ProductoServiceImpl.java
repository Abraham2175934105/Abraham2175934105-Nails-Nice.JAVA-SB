package com.backend.backend.servicio.impl;

import com.backend.backend.Dto.ProductoRequest;
import com.backend.backend.Dto.ProductoResponse;
import com.backend.backend.Entity.Producto;
import com.backend.backend.Exception.ResourceNotFoundException;
import com.backend.backend.repositorio.CategoriaRepository;
import com.backend.backend.repositorio.ColorRepository;
import com.backend.backend.repositorio.MarcaRepository;
import com.backend.backend.repositorio.ProductoRepository;
import com.backend.backend.repositorio.UnidadMedidaRepository;
import com.backend.backend.repositorio.InventarioRepository; // <-- import añadido
import com.backend.backend.servicio.ProductoService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;
import java.util.Optional;

@Service
@Transactional
@SuppressWarnings("unused")
public class ProductoServiceImpl implements ProductoService {

    private final ProductoRepository productoRepository;
    private final ColorRepository colorRepository;
    private final MarcaRepository marcaRepository;
    private final UnidadMedidaRepository unidadMedidaRepository;
    private final CategoriaRepository categoriaRepository;
    private final InventarioRepository inventarioRepository; // <-- campo añadido

    public ProductoServiceImpl(ProductoRepository productoRepository,
                               ColorRepository colorRepository,
                               MarcaRepository marcaRepository,
                               UnidadMedidaRepository unidadMedidaRepository,
                               CategoriaRepository categoriaRepository,
                               InventarioRepository inventarioRepository) { // <-- constructor actualizado
        this.productoRepository = productoRepository;
        this.colorRepository = colorRepository;
        this.marcaRepository = marcaRepository;
        this.unidadMedidaRepository = unidadMedidaRepository;
        this.categoriaRepository = categoriaRepository;
        this.inventarioRepository = inventarioRepository;
    }

    @Override
    public List<ProductoResponse> findAll() {
        return productoRepository.findAll()
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public ProductoResponse findById(Integer id) {
        Producto p = productoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Producto no encontrado con id " + id));
        return toResponse(p);
    }

    @Override
    public ProductoResponse create(ProductoRequest request) {
        Producto p = new Producto();
        applyRequestToEntity(request, p);
        p.setCreatedAt(LocalDateTime.now());
        p = productoRepository.save(p);
        return toResponse(p);
    }

    @Override
    public ProductoResponse update(Integer id, ProductoRequest request) {
        Producto p = productoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Producto no encontrado con id " + id));
        applyRequestToEntity(request, p);
        p.setUpdatedAt(LocalDateTime.now());
        p = productoRepository.save(p);
        return toResponse(p);
    }

    @Override
    public void delete(Integer id) {
        Producto p = productoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Producto no encontrado con id " + id));
        productoRepository.delete(p);
    }

    // --- Mapeo a DTO ---
    private ProductoResponse toResponse(Producto p) {
        ProductoResponse r = new ProductoResponse();
        r.setId(p.getId());
        r.setNombre(p.getNombre());
        r.setDescripcion(p.getDescripcion());
        r.setPrecio(p.getPrecio());
        r.setEstadoProducto(p.getEstadoProducto());
        r.setImagen(p.getImagen());

        if (p.getColor() != null) {
            r.setIdColor(tryGetIntFromRelated(p.getColor()));
            r.setColorNombre(tryGetStringFromRelated(p.getColor()));
        }
        if (p.getMarca() != null) {
            r.setIdMarca(tryGetIntFromRelated(p.getMarca()));
            r.setMarcaNombre(tryGetStringFromRelated(p.getMarca()));
        }
        if (p.getUnidadMedida() != null) {
            r.setIdUnidadMedida(tryGetIntFromRelated(p.getUnidadMedida()));
            r.setUnidadMedidaNombre(tryGetStringFromRelated(p.getUnidadMedida()));
        }
        if (p.getCategoria() != null) {
            r.setIdCategoria(tryGetIntFromRelated(p.getCategoria()));
            r.setCategoriaNombre(tryGetStringFromRelated(p.getCategoria()));
        }

        // --- NUEVO: obtener stock/cantidad desde InventarioRepository ---
        try {
            Optional<com.backend.backend.Entity.Inventario> optInv = inventarioRepository.findFirstByProducto_IdOrderByIdAsc(p.getId());
            if (optInv.isPresent()) {
                // preferimos cantidad (campo que usas en Inventario)
                Integer cantidad = optInv.get().getCantidad();
                if (cantidad != null) {
                    r.setStock(cantidad);
                } else {
                    // fallback a stock si cantidad es null
                    Integer stock = optInv.get().getStock();
                    r.setStock(stock != null ? stock : 0);
                }
            } else {
                r.setStock(0);
            }
        } catch (Exception ex) {
            // Si algo falla, devolvemos 0 (no queremos romper la API)
            r.setStock(0);
        }

        r.setCreatedAt(p.getCreatedAt());
        r.setUpdatedAt(p.getUpdatedAt());
        return r;
    }

    // ... applyRequestToEntity, tryGetIntFromRelated, tryGetStringFromRelated (modificados abajo) ...
    private void applyRequestToEntity(ProductoRequest req, Producto p) {
        p.setNombre(req.getNombre());
        p.setDescripcion(req.getDescripcion());
        p.setPrecio(req.getPrecio() != null ? req.getPrecio() : BigDecimal.ZERO);
        p.setEstadoProducto(req.getEstadoProducto());
        p.setImagen(req.getImagen());

        if (req.getIdColor() != null) {
            var c = colorRepository.findById(req.getIdColor())
                    .orElseThrow(() -> new ResourceNotFoundException("Color no encontrado con id " + req.getIdColor()));
            p.setColor(c);
        } else {
            p.setColor(null);
        }

        if (req.getIdMarca() != null) {
            var m = marcaRepository.findById(req.getIdMarca())
                    .orElseThrow(() -> new ResourceNotFoundException("Marca no encontrada con id " + req.getIdMarca()));
            p.setMarca(m);
        } else {
            p.setMarca(null);
        }

        if (req.getIdUnidadMedida() != null) {
            var u = unidadMedidaRepository.findById(req.getIdUnidadMedida())
                    .orElseThrow(() -> new ResourceNotFoundException("Unidad no encontrada con id " + req.getIdUnidadMedida()));
            p.setUnidadMedida(u);
        } else {
            p.setUnidadMedida(null);
        }

        if (req.getIdCategoria() != null) {
            var cat = categoriaRepository.findById(req.getIdCategoria())
                    .orElseThrow(() -> new ResourceNotFoundException("Categoría no encontrada con id " + req.getIdCategoria()));
            p.setCategoria(cat);
        } else {
            p.setCategoria(null);
        }
    }

    private Integer tryGetIntFromRelated(Object related) {
        if (related == null) return null;
        // Agrego más variantes de nombres de getters esperados
        String[] candidates = {
                "getId",
                "getId_categoria",
                "getIdCategoria",
                "getId_categoria", "getId_color", "getIdColor",
                "getId_marca", "getIdMarca",
                "getId_unidad", "getId_unidad_medida", "getIdUnidadMedida",
                "getId_unidadMedida"
        };
        for (String mName : candidates) {
            try {
                java.lang.reflect.Method m = related.getClass().getMethod(mName);
                Object v = m.invoke(related);
                if (v instanceof Number) return ((Number) v).intValue();
                if (v instanceof String) {
                    try { return Integer.valueOf((String) v); } catch (NumberFormatException ignored) {}
                }
            } catch (NoSuchMethodException ignored) {
            } catch (Exception e) {
            }
        }
        return null;
    }

    private String tryGetStringFromRelated(Object related) {
        if (related == null) return null;
        // Agrego una lista amplia de getters posibles usados en tus entidades
        String[] candidates = {
                "getNombre",
                "getNombreCategoria", "getNombre_categoria", "getNombre_categoria",
                "getNombreColor", "getNombre_color",
                "getNombreMarca", "getNombre_marca",
                "getNombreUnidadMedida", "getUnidadMedidaNombre", "getNombre_medida",
                "getNombre_medida", "getNombre_marca", "getName", "getNombreCategoria"
        };
        for (String mName : candidates) {
            try {
                java.lang.reflect.Method m = related.getClass().getMethod(mName);
                Object v = m.invoke(related);
                if (v != null) return String.valueOf(v);
            } catch (NoSuchMethodException ignored) {
            } catch (Exception e) {
            }
        }
        // as a last resort, try toString()
        try {
            Object v = related.toString();
            if (v != null) return String.valueOf(v);
        } catch (Exception ignored) {}
        return null;
    }
}