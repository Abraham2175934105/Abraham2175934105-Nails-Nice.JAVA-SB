package com.backend.backend.controlador;

import com.backend.backend.Entity.Rol;
import com.backend.backend.servicio.RolService;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/rol")
@CrossOrigin(origins = "*")
public class RolController {

    private final RolService rolService;

    public RolController(RolService rolService) {
        this.rolService = rolService;
    }

    @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Rol> crearRol(@RequestBody Rol rol) {
        Rol nuevo = rolService.guardarRol(rol);
        return new ResponseEntity<>(nuevo, HttpStatus.CREATED);
    }

    @GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<Rol>> listarRoles() {
        return new ResponseEntity<>(rolService.listarRoles(), HttpStatus.OK);
    }

    @GetMapping(value = "/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Rol> obtenerRol(@PathVariable Integer id) {
        return rolService.obtenerRolPorId(id)
                .map(r -> new ResponseEntity<>(r, HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PutMapping(value = "/{id}", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Rol> actualizarRol(@PathVariable Integer id, @RequestBody Rol rol) {
        if (!rolService.existeRol(id)) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        rol.setId(id);
        Rol actualizado = rolService.guardarRol(rol);
        return new ResponseEntity<>(actualizado, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarRol(@PathVariable Integer id) {
        if (!rolService.existeRol(id)) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        rolService.eliminarRol(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}