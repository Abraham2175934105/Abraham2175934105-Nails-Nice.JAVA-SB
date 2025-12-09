package com.backend.backend.repositorio;

import com.backend.backend.Entity.Ventas;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface VentasRepository extends JpaRepository<Ventas, Integer> {
    Optional<Ventas> findTopByOrderByIdDesc();
}