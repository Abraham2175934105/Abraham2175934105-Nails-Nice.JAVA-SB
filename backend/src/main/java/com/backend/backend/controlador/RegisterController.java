package com.backend.backend.controlador;

import com.backend.backend.Entity.Cliente;
import com.backend.backend.Entity.Rol;
import com.backend.backend.Entity.Usuario;
import com.backend.backend.auth.RegisterRequest;
import com.backend.backend.auth.RegisterResponse;
import com.backend.backend.repositorio.ClienteRepository;
import com.backend.backend.repositorio.RolRepository;
import com.backend.backend.repositorio.UsuarioRepository;
import com.backend.backend.servicio.AuthService;
import com.backend.backend.servicio.UsuarioService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class RegisterController {

    private static final Logger logger = LoggerFactory.getLogger(RegisterController.class);

    private final UsuarioService usuarioService;
    private final UsuarioRepository usuarioRepository;
    private final RolRepository rolRepository;
    private final ClienteRepository clienteRepository;
    private final AuthService authService; //Servicio para hashing y operaciones auth

    public RegisterController(UsuarioService usuarioService,
                              UsuarioRepository usuarioRepository,
                              RolRepository rolRepository,
                              ClienteRepository clienteRepository,
                              AuthService authService) {
        this.usuarioService = usuarioService;
        this.usuarioRepository = usuarioRepository;
        this.rolRepository = rolRepository;
        this.clienteRepository = clienteRepository;
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest req) {
        // Validaciones básicas en backend (duplicado de las del front)
        if (req.getEmail() == null || req.getEmail().isBlank()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("El correo es obligatorio");
        }
        // Verificar si correo existe
        if (usuarioRepository.findByCorreo(req.getEmail()).isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("El correo ya está registrado");
        }

        // Crear Usuario
        Usuario u = new Usuario();
        u.setNombre1(req.getPrimerNombre());
        u.setNombre2(req.getSegundoNombre());
        u.setApellido1(req.getPrimerApellido());
        u.setApellido2(req.getSegundoApellido());

        // Hashear la contraseña antes de guardar (usa el método de AuthService)
        String rawPass = req.getPassword();
        String hashed;
        try {
            hashed = authService.encrypt(rawPass);
        } catch (Exception ex) {
            logger.error("Error al hashear la contraseña", ex);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error al procesar la contraseña");
        }
        u.setContrasena(hashed);

        u.setCorreo(req.getEmail());

        // Normalizar teléfono: trim y eliminar espacios invisibles
        String phone = req.getPhone();
        if (phone != null) {
            phone = phone.trim().replaceAll("\\s+", "");
            // opcional: si llegara con prefijo +, lo dejamos o lo limpiamos según política
        }
        logger.info("Register request - correo: {}, phone (raw): {}, phone (normalized): {}", req.getEmail(), req.getPhone(), phone);
        u.setTelefono(phone);

        u.setEstadoUsuario("activo");
        u.setCreatedAt(LocalDateTime.now());
        u.setUpdatedAt(LocalDateTime.now());

        // Si el DTO trae pregunta/respuesta de seguridad, las guardamos (opcional)
        if (req.getPreguntaSeguridad() != null && !req.getPreguntaSeguridad().isBlank()) {
            u.setPreguntaSeguridad(req.getPreguntaSeguridad());
        }
        if (req.getRespuestaSeguridad() != null && !req.getRespuestaSeguridad().isBlank()) {
            u.setRespuestaSeguridad(req.getRespuestaSeguridad());
        }

        // Asignar rol por defecto = 2 (Cliente)
        Optional<Rol> rolOpt = rolRepository.findById(2);
        if (rolOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Rol cliente no existe en la base de datos");
        }
        u.setRol(rolOpt.get());

        Usuario saved;
        try {
            saved = usuarioService.guardarUsuario(u);
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ex.getMessage());
        } catch (Exception ex) {
            logger.error("Error al guardar usuario", ex);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error al crear usuario: " + ex.getMessage());
        }

        // Crear Cliente asociado con la dirección
        Cliente c = new Cliente();
        c.setUsuario(saved);
        c.setDireccion(req.getDireccion());
        c.setPuntosFidelidad(0);
        c.setCreatedAt(LocalDateTime.now());
        c.setUpdatedAt(LocalDateTime.now());
        clienteRepository.save(c);

        // Retornar respuesta (sin contraseña) usando DTO
        RegisterResponse resp = new RegisterResponse(saved.getId(), saved.getCorreo(), saved.getNombre1(), saved.getRol());
        return ResponseEntity.status(HttpStatus.CREATED).body(resp);
    }

    @GetMapping("/check-email")
    public ResponseEntity<?> checkEmail(@RequestParam("correo") String correo) {
        Optional<Usuario> userOpt = usuarioRepository.findByCorreo(correo);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("exists", false));
        }
        return ResponseEntity.ok(Map.of("exists", true));
    }

    @PostMapping("/reset-password-email")
    public ResponseEntity<?> resetPasswordByEmail(@RequestBody Map<String, String> payload) {
        String correo = payload.get("correo");
        String nuevaContrasena = payload.get("nuevaContrasena");
        if (correo == null || correo.isBlank() || nuevaContrasena == null || nuevaContrasena.isBlank()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("correo y nuevaContrasena son obligatorios");
        }

        Optional<Usuario> userOpt = usuarioRepository.findByCorreo(correo);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Correo no encontrado");
        }
        Usuario u = userOpt.get();

        // Hash antes de guardar
        try {
            String hashedNew = authService.encrypt(nuevaContrasena);
            u.setContrasena(hashedNew);
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error al procesar la contraseña");
        }

        u.setUpdatedAt(LocalDateTime.now());
        usuarioRepository.save(u);
        return ResponseEntity.ok(Map.of("message", "Contraseña actualizada"));
    }
}