package com.backend.backend.Dto;

import java.util.List;

public class CartResponseDto {

    private List<CartItemDto> items;
    private String direccion;

    public CartResponseDto() {
    }

    public CartResponseDto(List<CartItemDto> items, String direccion) {
        this.items = items;
        this.direccion = direccion;
    }

    public List<CartItemDto> getItems() {
        return items;
    }

    public void setItems(List<CartItemDto> items) {
        this.items = items;
    }

    public String getDireccion() {
        return direccion;
    }

    public void setDireccion(String direccion) {
        this.direccion = direccion;
    }
}