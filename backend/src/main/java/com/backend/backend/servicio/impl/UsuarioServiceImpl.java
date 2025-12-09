package com.backend.backend.servicio.impl;

import com.backend.backend.Entity.Rol;
import com.backend.backend.Entity.Usuario;
import com.backend.backend.repositorio.RolRepository;
import com.backend.backend.repositorio.UsuarioRepository;
import com.backend.backend.servicio.UsuarioService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * Implementación del servicio de Usuario.
 * Contiene la lógica para crear/actualizar/leer/eliminar usuarios.
 */
@Service
@Transactional
public class UsuarioServiceImpl implements UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final RolRepository rolRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    public UsuarioServiceImpl(UsuarioRepository usuarioRepository, RolRepository rolRepository, BCryptPasswordEncoder passwordEncoder) {
        this.usuarioRepository = usuarioRepository;
        this.rolRepository = rolRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // Helper: capitaliza la primera letra y deja el resto en minúsculas (siempre que haya texto)
    private String capitalizarEstado(String estado) {
        if (estado == null) return null;
        String s = estado.trim();
        if (s.isEmpty()) return s;
        return s.substring(0,1).toUpperCase() + s.substring(1).toLowerCase();
    }

    @Override
    public Usuario guardarUsuario(Usuario usuario) {
        // Si es actualización y no se envió la contraseña, conservamos la existente
        if (usuario.getId() != null) {
            Optional<Usuario> existenteOpt = usuarioRepository.findById(usuario.getId());
            if (existenteOpt.isPresent()) {
                Usuario existente = existenteOpt.get();
                if (usuario.getContrasena() == null || usuario.getContrasena().isBlank()) {
                    // conservar la contraseña que ya estaba en la BD
                    usuario.setContrasena(existente.getContrasena());
                }
                // si no se envía estado, conservar el existente
                if (usuario.getEstadoUsuario() == null || usuario.getEstadoUsuario().isBlank()) {
                    usuario.setEstadoUsuario(existente.getEstadoUsuario());
                }
            }
        }

        // Resolver rol si se envía { "rol": { "id": X } }
        if (usuario.getRol() != null && usuario.getRol().getId() != null) {
            Optional<Rol> r = rolRepository.findById(usuario.getRol().getId());
            if (r.isPresent()) {
                usuario.setRol(r.get());
            } else {
                throw new IllegalArgumentException("Rol con ID " + usuario.getRol().getId() + " no encontrado");
            }
        } else {
            throw new IllegalArgumentException("El rol es obligatorio");
        }

        // Normalizar estado_usuario (primera letra mayúscula)
        if (usuario.getEstadoUsuario() != null) {
            usuario.setEstadoUsuario(capitalizarEstado(usuario.getEstadoUsuario()));
        }

        // Manejo simple de timestamps
        if (usuario.getCreatedAt() == null) {
            usuario.setCreatedAt(LocalDateTime.now());
        }
        usuario.setUpdatedAt(LocalDateTime.now());

        // Codificar contraseña si se envió en texto plano (o si no parece bcrypt)
        String pass = usuario.getContrasena();
        if (pass != null && !pass.startsWith("$2")) {
            usuario.setContrasena(passwordEncoder.encode(pass));
        }

        // IMPORTANTE: si ya has hecho normalización del teléfono en el controller (req.getPhone -> trim)
        // aquí simplemente guardamos el valor que trae la entidad Usuario.
        // Asegúrate que Usuario.getTelefono()/setTelefono() existe en la entidad Usuario y mapea a la columna correcta.
        return usuarioRepository.save(usuario);
    }

    @Override
    public List<Usuario> listarUsuarios() {
        return usuarioRepository.findAll();
    }

    @Override
    public Optional<Usuario> obtenerUsuarioPorId(Integer id) {
        return usuarioRepository.findById(id);
    }

    @Override
    public void eliminarUsuario(Integer id) {
        usuarioRepository.deleteById(id);
    }

    @Override
    public boolean existeUsuario(Integer id) {
        return usuarioRepository.existsById(id);
    }
}