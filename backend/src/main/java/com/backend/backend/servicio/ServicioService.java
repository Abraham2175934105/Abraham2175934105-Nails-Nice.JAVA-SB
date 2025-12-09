package com.backend.backend.servicio;

import com.backend.backend.Entity.Servicios;
import com.backend.backend.Entity.TipoServicio;
import com.backend.backend.repositorio.ServicioRepository;
import com.backend.backend.repositorio.TipoServicioRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ServicioService {

    private final ServicioRepository servicioRepository;
    private final TipoServicioRepository tipoServicioRepository;

    public ServicioService(ServicioRepository servicioRepository, TipoServicioRepository tipoServicioRepository) {
        this.servicioRepository = servicioRepository;
        this.tipoServicioRepository = tipoServicioRepository;
    }

    // CREATE & UPDATE
    public Servicios guardarServicio(Servicios servicio) {
        // Resolver TipoServicio por id si viene en el JSON como { tipoServicio: { id: X } }
        if (servicio.getTipoServicio() != null && servicio.getTipoServicio().getId() != null) {
            Optional<TipoServicio> tipoOpt = tipoServicioRepository.findById(servicio.getTipoServicio().getId());
            tipoOpt.ifPresentOrElse(servicio::setTipoServicio, () -> servicio.setTipoServicio(null));
        } else {
            servicio.setTipoServicio(null);
        }
        return servicioRepository.save(servicio);
    }

    // READ (all)
    public List<Servicios> listarTodosLosServicios() {
        return servicioRepository.findAll();
    }

    // READ (one)
    public Optional<Servicios> obtenerServicioPorId(Integer id) {
        return servicioRepository.findById(id);
    }

    // DELETE
    public void eliminarServicio(Integer id) {
        servicioRepository.deleteById(id);
    }

    public boolean existeServicio(Integer id) {
        return servicioRepository.existsById(id);
    }
}