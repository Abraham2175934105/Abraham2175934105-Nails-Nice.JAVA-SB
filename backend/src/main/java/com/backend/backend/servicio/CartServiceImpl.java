package com.backend.backend.servicio;

import com.backend.backend.Dto.CartResponseDto;
import com.backend.backend.Dto.CartItemDto;
import com.backend.backend.Entity.Cliente;
import com.backend.backend.repositorio.ClienteRepository;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

/**
 * Implementación mínima que evita errores 500 devolviendo lista vacía.
 * Reemplaza la lógica con acceso a BD / repositorios cuando ya tengas el modelo de carrito.
 */
@Service
public class CartServiceImpl implements CartService {

    private final ClienteRepository clienteRepository;

    public CartServiceImpl(ClienteRepository clienteRepository) {
        this.clienteRepository = clienteRepository;
    }

    @Override
    public List<CartItemDto> getCartByUser(Integer userId) {
        return Collections.emptyList();
    }

    @Override
    public CartResponseDto getCartWithAddress(Integer userId) {
        List<CartItemDto> items = getCartByUser(userId);
        Optional<Cliente> clienteOpt = clienteRepository.findByUsuario_Id(userId);
        String direccion = clienteOpt.map(Cliente::getDireccion).orElse(null);
        return new CartResponseDto(items, direccion);
    }
}