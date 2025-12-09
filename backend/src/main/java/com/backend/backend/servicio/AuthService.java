package com.backend.backend.servicio;

import com.backend.backend.Entity.Usuario;
import com.backend.backend.repositorio.UsuarioRepository;
import com.backend.backend.auth.ResetPasswordRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
public class AuthService {

    private final UsuarioRepository usuarioRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    public AuthService(UsuarioRepository usuarioRepository,
                       BCryptPasswordEncoder passwordEncoder) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
    }

    /* =====================================================
       VALIDAR LOGIN
    ===================================================== */
    public Usuario authenticate(String correo, String password) {

        Usuario usuario = usuarioRepository.findByCorreo(correo)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        if (!passwordEncoder.matches(password, usuario.getContrasena())) {
            throw new RuntimeException("Contraseña incorrecta");
        }

        return usuario;
    }

    /* =====================================================
       BUSCAR USUARIO POR CORREO (FUNCIONA)
    ===================================================== */
    public Usuario findByCorreo(String correo) {
        return usuarioRepository.findByCorreo(correo).orElse(null);
    }

    /* =====================================================
       GUARDAR USUARIO
    ===================================================== */
    public void save(Usuario usuario) {
        usuario.setUpdatedAt(LocalDateTime.now());
        usuarioRepository.save(usuario);
    }

    /* =====================================================
       ENVÍO DE TOKEN (OPCIONAL)
    ===================================================== */
    public void forgotPassword(String correo) {
        Optional<Usuario> userOpt = usuarioRepository.findByCorreo(correo);

        if (userOpt.isEmpty()) {
            return; // No revela si existe o no
        }

        Usuario u = userOpt.get();
        String token = UUID.randomUUID().toString();

        u.setResetToken(token);
        usuarioRepository.save(u);

        // Aquí enviarías el correo real...
    }

    /* =====================================================
       RESET PASSWORD POR TOKEN
    ===================================================== */
    public ResponseEntity<String> resetPassword(ResetPasswordRequest req) {

        Optional<Usuario> userOpt = usuarioRepository.findByResetToken(req.getToken());

        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Token inválido o expirado");
        }

        Usuario u = userOpt.get();
        u.setContrasena(passwordEncoder.encode(req.getPassword()));
        u.setResetToken(null);

        usuarioRepository.save(u);

        return ResponseEntity.ok("Contraseña actualizada");
    }

    /* =====================================================
       ENCRIPTAR (UTILIZADO EN resetPasswordPregunta)
    ===================================================== */
    public String encrypt(String password) {
        return passwordEncoder.encode(password);
    }
}
