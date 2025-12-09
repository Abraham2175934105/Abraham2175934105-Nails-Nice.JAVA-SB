package com.backend.backend.servicio;

import com.backend.backend.Entity.Rol;
import com.backend.backend.repositorio.RolRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class RolService {

    private final RolRepository rolRepository;

    public RolService(RolRepository rolRepository) {
        this.rolRepository = rolRepository;
    }

    // CREATE & UPDATE
    public Rol guardarRol(Rol rol) {
        if (rol.getCreatedAt() == null) {
            rol.setCreatedAt(LocalDateTime.now());
        }
        rol.setUpdatedAt(LocalDateTime.now());
        return rolRepository.save(rol);
    }

    // READ all
    public List<Rol> listarRoles() {
        return rolRepository.findAll();
    }

    // READ one
    public Optional<Rol> obtenerRolPorId(Integer id) {
        return rolRepository.findById(id);
    }

    // DELETE
    public void eliminarRol(Integer id) {
        rolRepository.deleteById(id);
    }

    public boolean existeRol(Integer id) {
        return rolRepository.existsById(id);
    }
}