package com.backend.backend.repositorio;

import com.backend.backend.Entity.Inventario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.stereotype.Repository;
import jakarta.persistence.LockModeType;

import java.util.Optional;

@Repository
public interface InventarioRepository extends JpaRepository<Inventario, Integer> {

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    Optional<Inventario> findFirstByProducto_IdOrderByIdAsc(Integer productoId);
}