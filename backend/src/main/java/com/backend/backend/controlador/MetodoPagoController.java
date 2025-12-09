package com.backend.backend.controlador;

import com.backend.backend.Entity.MetodoPago;
import com.backend.backend.Dto.MetodoPagoResponse;
import com.backend.backend.repositorio.MetodoPagoRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/metodo_pago")
@CrossOrigin(origins = "*")
public class MetodoPagoController {

    private final MetodoPagoRepository metodoPagoRepository;

    public MetodoPagoController(MetodoPagoRepository metodoPagoRepository) {
        this.metodoPagoRepository = metodoPagoRepository;
    }

    @GetMapping
    public List<MetodoPagoResponse> all() {
        return metodoPagoRepository.findAll()
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    private MetodoPagoResponse toDto(MetodoPago m) {
        return new MetodoPagoResponse(m.getId(), m.getNombreMetodo());
    }
}