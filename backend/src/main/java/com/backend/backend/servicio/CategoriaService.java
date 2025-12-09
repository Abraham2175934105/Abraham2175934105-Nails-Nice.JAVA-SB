package com.backend.backend.servicio;

import com.backend.backend.Entity.Categoria;
import com.backend.backend.repositorio.CategoriaRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CategoriaService {

    private final CategoriaRepository categoriaRepository;

    public CategoriaService(CategoriaRepository categoriaRepository) {
        this.categoriaRepository = categoriaRepository;
    }

    public List<Categoria> getAll() {
        return categoriaRepository.findAll();
    }

    public Optional<Categoria> getById(Integer id) {
        return categoriaRepository.findById(id);
    }

    public Categoria create(Categoria categoria) {
        return categoriaRepository.save(categoria);
    }

    public Categoria update(Integer id, Categoria categoria) {
        Categoria existing = categoriaRepository.findById(id).orElseThrow();
        existing.setNombreCategoria(categoria.getNombreCategoria());
        return categoriaRepository.save(existing);
    }

    public void delete(Integer id) {
        categoriaRepository.deleteById(id);
    }
}