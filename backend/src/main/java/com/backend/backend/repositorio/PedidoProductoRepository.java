package com.backend.backend.repositorio;

import com.backend.backend.Entity.PedidoProducto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PedidoProductoRepository extends JpaRepository<PedidoProducto, Integer> {}