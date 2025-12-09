package com.backend.backend.controlador;

import com.backend.backend.Entity.Servicios;
import com.backend.backend.servicio.ServicioService;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/servicios")
@CrossOrigin(origins = "*")
public class ServicioController {

    private final ServicioService servicioService;

    public ServicioController(ServicioService servicioService) {
        this.servicioService = servicioService;
    }

    // CREATE
    @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Servicios> crearServicio(@RequestBody Servicios servicio) {
        Servicios nuevoServicio = servicioService.guardarServicio(servicio);
        return new ResponseEntity<>(nuevoServicio, HttpStatus.CREATED);
    }

    // READ (all)
    @GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<Servicios>> obtenerTodosLosServicios() {
        List<Servicios> servicios = servicioService.listarTodosLosServicios();
        return new ResponseEntity<>(servicios, HttpStatus.OK);
    }

    // READ (one)
    @GetMapping(value = "/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Servicios> obtenerServicioPorId(@PathVariable Integer id) {
        return servicioService.obtenerServicioPorId(id)
                .map(servicio -> new ResponseEntity<>(servicio, HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    // UPDATE
    @PutMapping(value = "/{id}", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Servicios> actualizarServicio(@PathVariable Integer id, @RequestBody Servicios detallesServicio) {
        if (!servicioService.existeServicio(id)) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        detallesServicio.setId(id);
        Servicios servicioActualizado = servicioService.guardarServicio(detallesServicio);
        return new ResponseEntity<>(servicioActualizado, HttpStatus.OK);
    }

    // DELETE
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarServicio(@PathVariable Integer id) {
        if (!servicioService.existeServicio(id)) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        servicioService.eliminarServicio(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}