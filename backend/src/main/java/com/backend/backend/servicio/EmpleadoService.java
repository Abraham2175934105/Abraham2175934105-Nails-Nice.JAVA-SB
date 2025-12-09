package com.backend.backend.servicio;

import com.backend.backend.Entity.Empleado;
import com.backend.backend.repositorio.EmpleadoRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class EmpleadoService {

    private final EmpleadoRepository empleadoRepository;

    public EmpleadoService(EmpleadoRepository empleadoRepository) {
        this.empleadoRepository = empleadoRepository;
    }

    public List<Empleado> getAllEmpleados() {
        return empleadoRepository.findAll();
    }

    public Optional<Empleado> getEmpleadoById(Integer id) {
        return empleadoRepository.findById(id);
    }

    public Empleado saveEmpleado(Empleado empleado) {
        return empleadoRepository.save(empleado);
    }

    public void deleteEmpleado(Integer id) {
        empleadoRepository.deleteById(id);
    }
}
