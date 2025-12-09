package com.backend.backend.servicio;

import com.backend.backend.Dto.PedidoRequest;
import com.backend.backend.Entity.Pedido;

import java.util.List;
import java.util.Optional;

public interface PedidoService {
    Pedido createPedido(PedidoRequest req);
    List<Pedido> findAll();
    Optional<Pedido> findById(Integer id);
    Pedido updatePedido(Integer id, PedidoRequest req);
    void deleteById(Integer id);
}