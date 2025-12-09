package com.backend.backend.controlador;

import com.backend.backend.Entity.Cliente;
import com.backend.backend.Entity.Usuario;
import com.backend.backend.repositorio.ClienteRepository;
import com.backend.backend.repositorio.UsuarioRepository;
import com.backend.backend.servicio.ClienteService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

/**
 * Controller existente para /api/clientes (mantengo todos los endpoints CRUD originales)
 * y además añado dos endpoints convenientes para trabajar con la entidad Cliente
 * asociada a un Usuario:
 *
 *   GET  /api/clientes/user/{userId}   -> Obtener cliente por userId (dirección/telefono)
 *   PUT  /api/clientes/user/{userId}   -> Crear o actualizar cliente por userId (upsert)
 *
 * Uso: estos endpoints son útiles para el flujo de checkout (Dirección / Pago).
 */
@RestController
@RequestMapping("/api/clientes")
@CrossOrigin(origins = "*")
public class ClienteController {

    private final ClienteService clienteService;
    private final ClienteRepository clienteRepository;
    private final UsuarioRepository usuarioRepository;

    public ClienteController(ClienteService clienteService,
                             ClienteRepository clienteRepository,
                             UsuarioRepository usuarioRepository) {
        this.clienteService = clienteService;
        this.clienteRepository = clienteRepository;
        this.usuarioRepository = usuarioRepository;
    }

    /* ----------------------------
       Endpoints existentes (CRUD)
       ---------------------------- */

    @GetMapping
    public List<Cliente> getAllClientes() {
        return clienteService.getAllClientes();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Cliente> getClienteById(@PathVariable Integer id) {
        return clienteService.getClienteById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Cliente createCliente(@RequestBody Cliente cliente) {
        return clienteService.saveCliente(cliente);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Cliente> updateCliente(@PathVariable Integer id, @RequestBody Cliente cliente) {
        return clienteService.getClienteById(id)
                .map(existing -> {
                    cliente.setId(existing.getId());
                    return ResponseEntity.ok(clienteService.saveCliente(cliente));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCliente(@PathVariable Integer id) {
        clienteService.deleteCliente(id);
        return ResponseEntity.noContent().build();
    }

    /* -------------------------------------------
       Nuevos endpoints útiles para el checkout
       ------------------------------------------- */

    /**
     * GET /api/clientes/user/{userId}
     * Devuelve el cliente (con dirección/telefono) asociado a un usuario si existe.
     * Respuestas:
     *  - 200 + Cliente JSON si existe
     *  - 404 si no existe
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getClienteByUser(@PathVariable Integer userId) {
        Optional<Cliente> cOpt = clienteRepository.findByUsuario_Id(userId);
        if (cOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Cliente no encontrado"));
        }
        return ResponseEntity.ok(cOpt.get());
    }

    /**
     * PUT /api/clientes/user/{userId}
     * Upsert: si existe Cliente para ese usuario lo actualiza, si no lo crea.
     * Body (JSON) aceptado (opcionalmente más campos):
     *  { "direccion": "...", "telefono": "..." }
     *
     * Respuestas:
     *  - 200 + Cliente actualizado/creado
     *  - 404 si el usuario no existe
     */
    @PutMapping("/user/{userId}")
    public ResponseEntity<?> upsertClienteByUser(@PathVariable Integer userId, @RequestBody Map<String, Object> payload) {
        Optional<Usuario> uOpt = usuarioRepository.findById(userId);
        if (uOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Usuario no encontrado"));
        }

        Usuario u = uOpt.get();
        Optional<Cliente> cOpt = clienteRepository.findByUsuario_Id(userId);

        Cliente cliente;
        if (cOpt.isPresent()) {
            cliente = cOpt.get();
        } else {
            cliente = new Cliente();
            cliente.setUsuario(u);
            cliente.setPuntosFidelidad(0);
            cliente.setCreatedAt(LocalDateTime.now());
        }

        if (payload.containsKey("direccion")) {
            cliente.setDireccion((String) payload.get("direccion"));
        }
        if (payload.containsKey("telefono")) {
            cliente.setTelefono((String) payload.get("telefono"));
        }
        cliente.setUpdatedAt(LocalDateTime.now());
        clienteRepository.save(cliente);

        return ResponseEntity.ok(cliente);
    }
}