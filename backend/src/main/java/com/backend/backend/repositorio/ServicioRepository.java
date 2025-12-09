package com.backend.backend.repositorio;

import com.backend.backend.Entity.Servicios;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ServicioRepository extends JpaRepository<Servicios, Integer> {}