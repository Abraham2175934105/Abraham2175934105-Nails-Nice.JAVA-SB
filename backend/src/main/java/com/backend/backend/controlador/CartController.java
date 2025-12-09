package com.backend.backend.controlador;

import com.backend.backend.Dto.CartResponseDto;
import com.backend.backend.security.JwtUtil;
import com.backend.backend.servicio.CartService;
import com.backend.backend.servicio.UsuarioService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class CartController {

    private final CartService cartService;
    private final UsuarioService usuarioService;
    private final JwtUtil jwtUtil;

    public CartController(CartService cartService, UsuarioService usuarioService, JwtUtil jwtUtil) {
        this.cartService = cartService;
        this.usuarioService = usuarioService;
        this.jwtUtil = jwtUtil;
    }

    // GET /api/carrito  -> devuelve el carrito del usuario autenticado
    @GetMapping("/carrito")
    public ResponseEntity<?> getCart(@RequestHeader(value = "Authorization", required = false) String authHeader) {
        try {
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return ResponseEntity.status(401).body("No autorizado: faltó Authorization Bearer token");
            }
            String token = authHeader.substring(7);
            if (!jwtUtil.validateToken(token)) {
                return ResponseEntity.status(401).body("Token inválido");
            }
            Integer userId = jwtUtil.extractUserId(token);
            if (userId == null) return ResponseEntity.status(401).body("Token no contiene userId válido");

            Optional<?> usuarioOpt = usuarioService.obtenerUsuarioPorId(userId);
            if (usuarioOpt.isEmpty()) {
                return ResponseEntity.status(404).body("Usuario no encontrado");
            }

            CartResponseDto cartResponse = cartService.getCartWithAddress(userId);
            return ResponseEntity.ok(cartResponse);
        } catch (Exception e) {
            // log completo en consola para debugging
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error interno: " + e.getMessage());
        }
    }
}