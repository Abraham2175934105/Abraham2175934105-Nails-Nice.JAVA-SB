package com.backend.backend.servicio.impl;

import com.backend.backend.Dto.PedidoProductoRequest;
import com.backend.backend.Dto.PedidoRequest;
import com.backend.backend.Entity.*;
import com.backend.backend.Exception.ResourceNotFoundException;
import com.backend.backend.repositorio.*;
import com.backend.backend.servicio.PedidoService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class PedidoServiceImpl implements PedidoService {

    private final PedidoRepository pedidoRepository;
    private final PedidoProductoRepository pedidoProductoRepository;
    private final ClienteRepository clienteRepository;
    private final ProductoRepository productoRepository;
    private final InventarioRepository inventarioRepository;
    private final MovimientosRepository movimientosRepository;

    public PedidoServiceImpl(PedidoRepository pedidoRepository,
                             PedidoProductoRepository pedidoProductoRepository,
                             ClienteRepository clienteRepository,
                             ProductoRepository productoRepository,
                             InventarioRepository inventarioRepository,
                             MovimientosRepository movimientosRepository) {
        this.pedidoRepository = pedidoRepository;
        this.pedidoProductoRepository = pedidoProductoRepository;
        this.clienteRepository = clienteRepository;
        this.productoRepository = productoRepository;
        this.inventarioRepository = inventarioRepository;
        this.movimientosRepository = movimientosRepository;
    }

    @Override
    public Pedido createPedido(PedidoRequest req) {
        var cliente = clienteRepository.findById(req.getIdCliente())
                .orElseThrow(() -> new ResourceNotFoundException("Cliente no encontrado: " + req.getIdCliente()));

        Pedido ped = new Pedido();
        ped.setCliente(cliente);
        ped.setDetallePedido(req.getDetallePedido());
        ped.setEstadoPedido(req.getEstadoPedido() != null ? req.getEstadoPedido() : "pendiente");
        ped.setTotalPedido(req.getTotalPedido() != null ? req.getTotalPedido().doubleValue() : 0.0);
        ped.setFechaPedido(req.getFechaPedido() != null ? req.getFechaPedido() : LocalDate.now());
        ped.setCantidadPedido(req.getCantidadPedido() != null ? req.getCantidadPedido() : 0);

        ped = pedidoRepository.save(ped);

        if (req.getProductos() != null) {
            for (PedidoProductoRequest pr : req.getProductos()) {
                var producto = productoRepository.findById(pr.getIdProducto())
                        .orElseThrow(() -> new ResourceNotFoundException("Producto no encontrado: " + pr.getIdProducto()));

                var optInv = inventarioRepository.findFirstByProducto_IdOrderByIdAsc(producto.getId());
                if (optInv.isEmpty()) {
                    throw new ResourceNotFoundException("Inventario no encontrado para producto id " + producto.getId());
                }
                Inventario inv = optInv.get();

                if (inv.getStock() < pr.getCantidad()) {
                    throw new IllegalStateException("Stock insuficiente para producto " + producto.getNombre());
                }

                inv.setStock(inv.getStock() - pr.getCantidad());
                inventarioRepository.save(inv);

                PedidoProducto pp = new PedidoProducto();
                pp.setPedido(ped);
                pp.setProducto(producto);
                pp.setCantidad(pr.getCantidad());
                pp.setPrecioUnitario(pr.getPrecioUnitario() != null ? pr.getPrecioUnitario().doubleValue() : 0.0);
                pedidoProductoRepository.save(pp);

                Movimientos mov = new Movimientos();
                mov.setProducto(producto);
                mov.setInventario(inv);
                mov.setTipoMovimiento("PEDIDO_ONLINE");
                mov.setCantidadMovimiento(pr.getCantidad());
                mov.setFechaMovimiento(LocalDate.now());
                mov.setDescripcionMovimiento("Reserva por pedido id " + ped.getId());
                movimientosRepository.save(mov);
            }
        }

        return ped;
    }

    @Override
    public List<Pedido> findAll() {
        return pedidoRepository.findAll();
    }

    @Override
    public Optional<Pedido> findById(Integer id) {
        return pedidoRepository.findById(id);
    }

    @Override
    public Pedido updatePedido(Integer id, PedidoRequest req) {
        Pedido existing = pedidoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Pedido no encontrado: " + id));

        if (req.getIdCliente() != null) {
            var cliente = clienteRepository.findById(req.getIdCliente())
                    .orElseThrow(() -> new ResourceNotFoundException("Cliente no encontrado: " + req.getIdCliente()));
            existing.setCliente(cliente);
        }

        if (req.getDetallePedido() != null) existing.setDetallePedido(req.getDetallePedido());
        if (req.getEstadoPedido() != null) existing.setEstadoPedido(req.getEstadoPedido());
        if (req.getTotalPedido() != null) existing.setTotalPedido(req.getTotalPedido().doubleValue());
        if (req.getFechaPedido() != null) existing.setFechaPedido(req.getFechaPedido());
        if (req.getCantidadPedido() != null) existing.setCantidadPedido(req.getCantidadPedido());

        // NOTA: actualizar la colección 'productos' es complejo (stock/movimientos/reversion).
        // Esta implementación NO modifica los productos del pedido. Si necesitas editar productos
        // (añadir/quitar/cambiar cantidad), hay que implementar la lógica para revertir/ajustar stock y movimientos.
        return pedidoRepository.save(existing);
    }

    @Override
    public void deleteById(Integer id) {
        if (!pedidoRepository.existsById(id)) {
            throw new ResourceNotFoundException("Pedido no encontrado: " + id);
        }
        // Nota: si al eliminar se requiere revertir stock, implementar la lógica aquí.
        pedidoRepository.deleteById(id);
    }
}