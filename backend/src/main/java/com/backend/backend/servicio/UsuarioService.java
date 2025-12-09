package com.backend.backend.servicio;

import com.backend.backend.Entity.Usuario;

import java.util.List;
import java.util.Optional;

/**
 * Interfaz del servicio de Usuario. Define las operaciones disponibles
 * para la gestión de usuarios en el sistema.
 */
public interface UsuarioService {
    Usuario guardarUsuario(Usuario usuario);
    List<Usuario> listarUsuarios();
    Optional<Usuario> obtenerUsuarioPorId(Integer id);
    void eliminarUsuario(Integer id);
    boolean existeUsuario(Integer id);
}