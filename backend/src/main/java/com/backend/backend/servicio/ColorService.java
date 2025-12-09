package com.backend.backend.servicio;

import com.backend.backend.Entity.Color;
import com.backend.backend.repositorio.ColorRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ColorService {

    private final ColorRepository colorRepository;

    public ColorService(ColorRepository colorRepository) {
        this.colorRepository = colorRepository;
    }

    public List<Color> getAllColors() {
        return colorRepository.findAll();
    }

    public Optional<Color> getColorById(Integer id) {
        return colorRepository.findById(id);
    }

    public Color saveColor(Color color) {
        return colorRepository.save(color);
    }

    public void deleteColor(Integer id) {
        colorRepository.deleteById(id);
    }
}
