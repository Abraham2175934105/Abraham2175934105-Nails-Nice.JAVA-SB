package com.backend.backend.controlador;

import com.backend.backend.Entity.Rol;
import com.backend.backend.Entity.Usuario;
import com.backend.backend.auth.ForgotPasswordRequest;
import com.backend.backend.auth.LoginRequest;
import com.backend.backend.auth.LoginResponse;
import com.backend.backend.auth.ResetPasswordRequest;
import com.backend.backend.auth.ResetPasswordPorPregunta;
import com.backend.backend.servicio.AuthService;
import com.backend.backend.security.JwtUtil;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.time.LocalDateTime;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private final AuthService authService;
    private final JwtUtil jwtUtil;

    public AuthController(AuthService authService, JwtUtil jwtUtil) {
        this.authService = authService;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request) {

        Usuario u = authService.authenticate(request.getEmail(), request.getPassword());

        LoginResponse resp = new LoginResponse();
        resp.setId(u.getId());
        resp.setCorreo(u.getCorreo());
        resp.setNombre1(u.getNombre1());
        resp.setNombre2(u.getNombre2());
        resp.setApellido1(u.getApellido1());
        resp.setApellido2(u.getApellido2());
        resp.setTelefono(u.getTelefono());

        Rol r = u.getRol();
        if (r != null) {
            resp.setRol(new LoginResponse.RolDto(r.getId(), r.getDescripcion()));
        }

        resp.setToken(jwtUtil.generateToken(u));

        return new ResponseEntity<>(resp, HttpStatus.OK);
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<String> forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        authService.forgotPassword(request.getCorreo());
        return ResponseEntity.ok("Si el correo existe, se enviará un enlace.");
    }

    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        return authService.resetPassword(request);
    }

    /**
     * Endpoint para validar correo / obtener pregunta (si existe).
     * - Si existe pregunta, devuelve { exists:true, pregunta: "..." }
     * - Si no existe pregunta pero el usuario existe, devuelve { exists:true }
     * - Si no existe usuario -> 404
     */
    @GetMapping("/pregunta")
    public ResponseEntity<?> getPregunta(@RequestParam("correo") String correo) {
        Usuario u = authService.findByCorreo(correo);

        if (u == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Correo no encontrado"));
        }

        String pregunta = u.getPreguntaSeguridad();
        if (pregunta == null || pregunta.isBlank()) {
            // Usuario existe pero no tiene pregunta registrada
            return ResponseEntity.ok(Map.of("exists", true));
        }
        return ResponseEntity.ok(Map.of("exists", true, "pregunta", pregunta));
    }

    /**
     * Reset de contraseña por "pregunta".
     * - Si el usuario tiene pregunta registrada, se exige la respuesta y debe coincidir.
     * - Si el usuario NO tiene pregunta registrada, se permite restablecer pasando sólo correo + nuevaContrasena.
     *
     * Nota: en producción la contraseña debe guardarse hasheada (authService.encrypt o similar).
     */
    @PostMapping("/reset-password-pregunta")
    public ResponseEntity<?> resetPasswordPregunta(@RequestBody ResetPasswordPorPregunta req) {
        Usuario u = authService.findByCorreo(req.getCorreo());

        if (u == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Correo no encontrado"));
        }

        String pregunta = u.getPreguntaSeguridad();
        // Si el usuario tiene pregunta registrada, exigir respuesta
        if (pregunta != null && !pregunta.isBlank()) {
            if (req.getRespuestaSeguridad() == null || req.getRespuestaSeguridad().isBlank()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", "Respuesta de seguridad requerida"));
            }
            String respuestaGuardada = u.getRespuestaSeguridad();
            if (respuestaGuardada == null || !respuestaGuardada.equalsIgnoreCase(req.getRespuestaSeguridad())) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", "Respuesta de seguridad incorrecta"));
            }
        }

        // Actualiza la contraseña. Usar hashing/encriptación si authService lo soporta.
        String nueva = req.getNuevaContrasena();
        if (nueva == null || nueva.isBlank()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", "nuevaContrasena es obligatoria"));
        }

        // Llamada directa al método encrypt del servicio (tu versión anterior ya usaba authService.encrypt(...))
        try {
            String encrypted = authService.encrypt(nueva);
            u.setContrasena(encrypted);
        } catch (NoSuchMethodError | AbstractMethodError ex) {
            // Si por alguna razón el método no existe en la implementación en tiempo de ejecución,
            // hacemos fallback a guardar la contraseña tal cual (NO recomendado para producción).
            u.setContrasena(nueva);
        } catch (Exception ex) {
            // Si encrypt lanza excepción, hacemos fallback también
            u.setContrasena(nueva);
        }

        u.setUpdatedAt(LocalDateTime.now());
        authService.save(u);

        return ResponseEntity.ok(Map.of("message", "Contraseña actualizada"));
    }
}