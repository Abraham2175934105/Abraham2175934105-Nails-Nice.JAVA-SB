package com.backend.backend.servicio.impl;

import com.backend.backend.Dto.DetalleVentaRequest;
import com.backend.backend.Dto.VentaRequest;
import com.backend.backend.Dto.VentaResponse;
import com.backend.backend.Entity.*;
import com.backend.backend.Exception.ResourceNotFoundException;
import com.backend.backend.repositorio.*;
import com.backend.backend.servicio.VentaService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;
import java.math.BigDecimal;

@Service
@Transactional
public class VentaServiceImpl implements VentaService {

    private final VentasRepository ventasRepository;
    private final DetalleVentaRepository detalleVentaRepository;
    private final ClienteRepository clienteRepository;
    private final MetodoPagoRepository metodoPagoRepository;
    private final ProductoRepository productoRepository;
    private final InventarioRepository inventarioRepository;
    private final MovimientosRepository movimientosRepository;
    private final PedidoRepository pedidoRepository;

    public VentaServiceImpl(VentasRepository ventasRepository,
                            DetalleVentaRepository detalleVentaRepository,
                            ClienteRepository clienteRepository,
                            MetodoPagoRepository metodoPagoRepository,
                            ProductoRepository productoRepository,
                            InventarioRepository inventarioRepository,
                            MovimientosRepository movimientosRepository,
                            PedidoRepository pedidoRepository) {
        this.ventasRepository = ventasRepository;
        this.detalleVentaRepository = detalleVentaRepository;
        this.clienteRepository = clienteRepository;
        this.metodoPagoRepository = metodoPagoRepository;
        this.productoRepository = productoRepository;
        this.inventarioRepository = inventarioRepository;
        this.movimientosRepository = movimientosRepository;
        this.pedidoRepository = pedidoRepository;
    }

    @Override
    public java.util.List<VentaResponse> findAll() {
        return ventasRepository.findAll().stream().map(v -> {
            VentaResponse vr = new VentaResponse();
            vr.setId(v.getId());
            if (v.getCliente() != null) vr.setIdCliente(v.getCliente().getId());
            if (v.getMetodoPago() != null) vr.setIdMetodo(v.getMetodoPago().getId());
            vr.setNumeroRecibo(v.getNumeroRecibo());
            vr.setEstadoVenta(v.getEstadoVenta());
            vr.setFechaVenta(v.getFechaVenta());
            vr.setMontoVenta(v.getMontoVenta() != null ? v.getMontoVenta() : 0.0);
            List<DetalleVentaRequest> detalles = new ArrayList<>();
            if (v.getDetalles() != null) {
                for (DetalleVenta dv : v.getDetalles()) {
                    DetalleVentaRequest dr = new DetalleVentaRequest();
                    if (dv.getProducto() != null) dr.setIdProducto(dv.getProducto().getId());
                    dr.setCantidad(dv.getCantidad());
                    dr.setPrecioUnitario(dv.getPrecioUnitario() != null ? BigDecimal.valueOf(dv.getPrecioUnitario()) : BigDecimal.ZERO);
                    detalles.add(dr);
                }
            }
            vr.setDetalles(detalles);
            return vr;
        }).collect(Collectors.toList());
    }

    @Override
    public VentaResponse findById(Integer id) {
        var v = ventasRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Venta no encontrada " + id));
        VentaResponse vr = new VentaResponse();
        vr.setId(v.getId());
        if (v.getCliente() != null) vr.setIdCliente(v.getCliente().getId());
        if (v.getMetodoPago() != null) vr.setIdMetodo(v.getMetodoPago().getId());
        vr.setNumeroRecibo(v.getNumeroRecibo());
        vr.setFechaVenta(v.getFechaVenta());
        vr.setMontoVenta(v.getMontoVenta() != null ? v.getMontoVenta() : 0.0);
        vr.setEstadoVenta(v.getEstadoVenta());
        List<DetalleVentaRequest> detalles = new ArrayList<>();
        if (v.getDetalles() != null) {
            for (DetalleVenta dv : v.getDetalles()) {
                DetalleVentaRequest dr = new DetalleVentaRequest();
                if (dv.getProducto() != null) dr.setIdProducto(dv.getProducto().getId());
                dr.setCantidad(dv.getCantidad());
                dr.setPrecioUnitario(dv.getPrecioUnitario() != null ? BigDecimal.valueOf(dv.getPrecioUnitario()) : BigDecimal.ZERO);
                detalles.add(dr);
            }
        }
        vr.setDetalles(detalles);
        return vr;
    }

    @Override
    public VentaResponse createVenta(VentaRequest req) {
        var cliente = clienteRepository.findById(req.getIdCliente())
                .orElseThrow(() -> new ResourceNotFoundException("Cliente no encontrado: " + req.getIdCliente()));
        var metodo = metodoPagoRepository.findById(req.getIdMetodo())
                .orElseThrow(() -> new ResourceNotFoundException("Metodo pago no encontrado: " + req.getIdMetodo()));

        Ventas ven = new Ventas();
        ven.setCliente(cliente);
        ven.setMetodoPago(metodo);
        ven.setNumeroRecibo(req.getNumeroRecibo());
        ven.setEstadoVenta(req.getEstadoVenta());
        if (req.getFechaVenta() != null && !req.getFechaVenta().isBlank()) {
            ven.setFechaVenta(LocalDate.parse(req.getFechaVenta()));
        } else {
            ven.setFechaVenta(LocalDate.now());
        }
        ven.setMontoVenta(req.getMontoVenta() != null ? req.getMontoVenta().doubleValue() : 0.0);
        ven = ventasRepository.save(ven);

        if (ven.getNumeroRecibo() == null || ven.getNumeroRecibo().isBlank()) {
            String nextRec = "REC-1001";
            try {
                var lastOpt = ventasRepository.findTopByOrderByIdDesc();
                if (lastOpt.isPresent()) {
                    var last = lastOpt.get();
                    String lastNum = last.getNumeroRecibo();
                    if (lastNum != null && lastNum.startsWith("REC-")) {
                        String digits = lastNum.substring(4);
                        try {
                            int val = Integer.parseInt(digits);
                            nextRec = "REC-" + (val + 1);
                        } catch (NumberFormatException ex) {
                            nextRec = "REC-" + (1000 + ven.getId());
                        }
                    } else {
                        nextRec = "REC-" + (1000 + ven.getId());
                    }
                } else {
                    nextRec = "REC-1001";
                }
            } catch (Exception ex) {
                nextRec = "REC-" + (1000 + ven.getId());
            }
            ven.setNumeroRecibo(nextRec);
            ven = ventasRepository.save(ven);
        }

        if (req.getDetalles() != null) {
            for (DetalleVentaRequest dr : req.getDetalles()) {
                var producto = productoRepository.findById(dr.getIdProducto())
                        .orElseThrow(() -> new ResourceNotFoundException("Producto no encontrado: " + dr.getIdProducto()));

                var optInv = inventarioRepository.findFirstByProducto_IdOrderByIdAsc(producto.getId());
                if (optInv.isEmpty()) {
                    throw new ResourceNotFoundException("Inventario no encontrado para producto " + producto.getId());
                }
                Inventario inv = optInv.get();

                if (inv.getCantidad() < dr.getCantidad()) {
                    throw new IllegalStateException("Cantidad en tienda insuficiente para producto " + producto.getNombre());
                }
                inv.setCantidad(inv.getCantidad() - dr.getCantidad());
                inventarioRepository.save(inv);

                DetalleVenta dv = new DetalleVenta();
                dv.setVentas(ven);
                dv.setProducto(producto);
                dv.setCantidad(dr.getCantidad());
                dv.setPrecioUnitario(dr.getPrecioUnitario() != null ? dr.getPrecioUnitario().doubleValue() : 0.0);
                dv.setSubtotal((dr.getPrecioUnitario() != null ? dr.getPrecioUnitario().doubleValue() : 0.0) * dr.getCantidad());
                detalleVentaRepository.save(dv);

                Movimientos mov = new Movimientos();
                mov.setProducto(producto);
                mov.setInventario(inv);
                mov.setTipoMovimiento("VENTA_FISICA");
                mov.setCantidadMovimiento(dr.getCantidad());
                mov.setFechaMovimiento(LocalDate.now());
                mov.setDescripcionMovimiento("Venta fisica id " + ven.getId());
                movimientosRepository.save(mov);
            }
        }

        if (req.getIdPedido() != null) {
            pedidoRepository.findById(req.getIdPedido()).ifPresent(p -> {
                p.setEstadoPedido("completado");
                pedidoRepository.save(p);
            });
        }

        VentaResponse vr = new VentaResponse();
        vr.setId(ven.getId());
        if (ven.getCliente() != null) vr.setIdCliente(ven.getCliente().getId());
        if (ven.getMetodoPago() != null) vr.setIdMetodo(ven.getMetodoPago().getId());
        vr.setNumeroRecibo(ven.getNumeroRecibo());
        vr.setEstadoVenta(ven.getEstadoVenta());
        vr.setFechaVenta(ven.getFechaVenta());
        vr.setMontoVenta(ven.getMontoVenta() != null ? ven.getMontoVenta() : 0.0);

        List<DetalleVentaRequest> respDetalles = new ArrayList<>();
        if (ven.getDetalles() != null) {
            for (DetalleVenta dv : ven.getDetalles()) {
                DetalleVentaRequest dr = new DetalleVentaRequest();
                if (dv.getProducto() != null) dr.setIdProducto(dv.getProducto().getId());
                dr.setCantidad(dv.getCantidad());
                dr.setPrecioUnitario(dv.getPrecioUnitario() != null ? BigDecimal.valueOf(dv.getPrecioUnitario()) : BigDecimal.ZERO);
                respDetalles.add(dr);
            }
        }
        vr.setDetalles(respDetalles);

        return vr;
    }

    // NUEVO: implementación de actualización
    @Override
    public VentaResponse updateVenta(Integer id, VentaRequest req) {
        // Obtener venta existente
        var ven = ventasRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Venta no encontrada " + id));

        var cliente = clienteRepository.findById(req.getIdCliente())
                .orElseThrow(() -> new ResourceNotFoundException("Cliente no encontrado: " + req.getIdCliente()));
        var metodo = metodoPagoRepository.findById(req.getIdMetodo())
                .orElseThrow(() -> new ResourceNotFoundException("Metodo pago no encontrado: " + req.getIdMetodo()));

        // Actualizar campos básicos
        ven.setCliente(cliente);
        ven.setMetodoPago(metodo);
        // Si frontend envía numeroRecibo null, mantenemos el actual
        if (req.getNumeroRecibo() != null) ven.setNumeroRecibo(req.getNumeroRecibo());
        ven.setEstadoVenta(req.getEstadoVenta());
        if (req.getFechaVenta() != null && !req.getFechaVenta().isBlank()) {
            ven.setFechaVenta(LocalDate.parse(req.getFechaVenta()));
        }
        ven.setMontoVenta(req.getMontoVenta() != null ? req.getMontoVenta().doubleValue() : ven.getMontoVenta());

        // Restaurar inventario por detalles previos y eliminar detalles antiguos
        List<DetalleVenta> prevDetalles = detalleVentaRepository.findByVentas_Id(ven.getId());
        if (prevDetalles != null) {
            for (DetalleVenta dvPrev : prevDetalles) {
                if (dvPrev.getProducto() != null) {
                    var optInv = inventarioRepository.findFirstByProducto_IdOrderByIdAsc(dvPrev.getProducto().getId());
                    if (optInv.isPresent()) {
                        Inventario inv = optInv.get();
                        inv.setCantidad(inv.getCantidad() + dvPrev.getCantidad()); // restaurar stock
                        inventarioRepository.save(inv);
                    }
                }
            }
            // borrar detalles previos
            detalleVentaRepository.deleteByVentas_Id(ven.getId());
        }

        // Guardar nuevos detalles y ajustar inventario
        if (req.getDetalles() != null) {
            for (DetalleVentaRequest dr : req.getDetalles()) {
                var producto = productoRepository.findById(dr.getIdProducto())
                        .orElseThrow(() -> new ResourceNotFoundException("Producto no encontrado: " + dr.getIdProducto()));

                var optInv = inventarioRepository.findFirstByProducto_IdOrderByIdAsc(producto.getId());
                if (optInv.isEmpty()) {
                    throw new ResourceNotFoundException("Inventario no encontrado para producto " + producto.getId());
                }
                Inventario inv = optInv.get();

                if (inv.getCantidad() < dr.getCantidad()) {
                    throw new IllegalStateException("Cantidad en tienda insuficiente para producto " + producto.getNombre());
                }
                inv.setCantidad(inv.getCantidad() - dr.getCantidad());
                inventarioRepository.save(inv);

                DetalleVenta dv = new DetalleVenta();
                dv.setVentas(ven);
                dv.setProducto(producto);
                dv.setCantidad(dr.getCantidad());
                dv.setPrecioUnitario(dr.getPrecioUnitario() != null ? dr.getPrecioUnitario().doubleValue() : 0.0);
                dv.setSubtotal((dr.getPrecioUnitario() != null ? dr.getPrecioUnitario().doubleValue() : 0.0) * dr.getCantidad());
                detalleVentaRepository.save(dv);

                Movimientos mov = new Movimientos();
                mov.setProducto(producto);
                mov.setInventario(inv);
                mov.setTipoMovimiento("VENTA_FISICA");
                mov.setCantidadMovimiento(dr.getCantidad());
                mov.setFechaMovimiento(LocalDate.now());
                mov.setDescripcionMovimiento("Actualización venta id " + ven.getId());
                movimientosRepository.save(mov);
            }
        }

        // Si el request contiene idPedido, marcarlo completado como en create
        if (req.getIdPedido() != null) {
            pedidoRepository.findById(req.getIdPedido()).ifPresent(p -> {
                p.setEstadoPedido("completado");
                pedidoRepository.save(p);
            });
        }

        ven = ventasRepository.save(ven);

        // Construir respuesta similar a create
        VentaResponse vr = new VentaResponse();
        vr.setId(ven.getId());
        if (ven.getCliente() != null) vr.setIdCliente(ven.getCliente().getId());
        if (ven.getMetodoPago() != null) vr.setIdMetodo(ven.getMetodoPago().getId());
        vr.setNumeroRecibo(ven.getNumeroRecibo());
        vr.setEstadoVenta(ven.getEstadoVenta());
        vr.setFechaVenta(ven.getFechaVenta());
        vr.setMontoVenta(ven.getMontoVenta() != null ? ven.getMontoVenta() : 0.0);

        List<DetalleVentaRequest> respDetalles = new ArrayList<>();
        List<DetalleVenta> newDetalles = detalleVentaRepository.findByVentas_Id(ven.getId());
        if (newDetalles != null) {
            for (DetalleVenta dv : newDetalles) {
                DetalleVentaRequest dr = new DetalleVentaRequest();
                if (dv.getProducto() != null) dr.setIdProducto(dv.getProducto().getId());
                dr.setCantidad(dv.getCantidad());
                dr.setPrecioUnitario(dv.getPrecioUnitario() != null ? BigDecimal.valueOf(dv.getPrecioUnitario()) : BigDecimal.ZERO);
                respDetalles.add(dr);
            }
        }
        vr.setDetalles(respDetalles);

        return vr;
    }

    @Override
    public void delete(Integer id) {
        var v = ventasRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Venta no encontrada " + id));
        // Restaurar inventario por detalles antes de borrar para evitar constraints
        List<DetalleVenta> prevDetalles = detalleVentaRepository.findByVentas_Id(v.getId());
        if (prevDetalles != null) {
            for (DetalleVenta dvPrev : prevDetalles) {
                if (dvPrev.getProducto() != null) {
                    var optInv = inventarioRepository.findFirstByProducto_IdOrderByIdAsc(dvPrev.getProducto().getId());
                    if (optInv.isPresent()) {
                        Inventario inv = optInv.get();
                        inv.setCantidad(inv.getCantidad() + dvPrev.getCantidad());
                        inventarioRepository.save(inv);
                    }
                }
            }
            // borrar detalles
            detalleVentaRepository.deleteByVentas_Id(v.getId());
        }
        ventasRepository.delete(v);
    }
}