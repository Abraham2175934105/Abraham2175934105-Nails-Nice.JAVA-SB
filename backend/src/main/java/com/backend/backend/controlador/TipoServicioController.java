package com.backend.backend.controlador;

import com.backend.backend.Entity.TipoServicio;
import com.backend.backend.servicio.TipoServicioService;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tipo_servicio")
@CrossOrigin(origins = "*")
public class TipoServicioController {

    private final TipoServicioService tipoServicioService;

    public TipoServicioController(TipoServicioService tipoServicioService) {
        this.tipoServicioService = tipoServicioService;
    }

    @GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)
    public List<TipoServicio> getAll() {
        return tipoServicioService.getAll();
    }

    @GetMapping(value = "/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    public TipoServicio getById(@PathVariable Integer id) {
        return tipoServicioService.getById(id).orElseThrow();
    }

    @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public TipoServicio create(@RequestBody TipoServicio tipoServicio) {
        return tipoServicioService.create(tipoServicio);
    }

    @PutMapping(value = "/{id}", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public TipoServicio update(@PathVariable Integer id, @RequestBody TipoServicio tipoServicio) {
        return tipoServicioService.update(id, tipoServicio);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Integer id) {
        tipoServicioService.delete(id);
    }
}