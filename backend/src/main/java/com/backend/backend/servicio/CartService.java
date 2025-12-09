package com.backend.backend.servicio;

import com.backend.backend.Dto.CartResponseDto;
import com.backend.backend.Dto.CartItemDto;

import java.util.List;

public interface CartService {
    /**
     * Devuelve los items del carrito para el usuario dado.
     * Implementación actual devuelve lista vacía (placeholder).
     * Implementa la lógica con BD según tu modelo cuando quieras.
     */
    List<CartItemDto> getCartByUser(Integer userId);

    CartResponseDto getCartWithAddress(Integer userId);
}