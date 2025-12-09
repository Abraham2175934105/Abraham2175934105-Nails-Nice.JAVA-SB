package com.backend.backend.servicio;

import com.backend.backend.Entity.TipoServicio;
import com.backend.backend.repositorio.TipoServicioRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TipoServicioService {

    private final TipoServicioRepository tipoServicioRepository;

    public TipoServicioService(TipoServicioRepository tipoServicioRepository) {
        this.tipoServicioRepository = tipoServicioRepository;
    }

    public List<TipoServicio> getAll() {
        return tipoServicioRepository.findAll();
    }

    public Optional<TipoServicio> getById(Integer id) {
        return tipoServicioRepository.findById(id);
    }

    public TipoServicio create(TipoServicio tipoServicio) {
        return tipoServicioRepository.save(tipoServicio);
    }

    public TipoServicio update(Integer id, TipoServicio tipoServicio) {
        TipoServicio existing = tipoServicioRepository.findById(id).orElseThrow();
        existing.setNombreTipo(tipoServicio.getNombreTipo());
        return tipoServicioRepository.save(existing);
    }

    public void delete(Integer id) {
        tipoServicioRepository.deleteById(id);
    }
}