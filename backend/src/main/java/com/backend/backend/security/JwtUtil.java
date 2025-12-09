package com.backend.backend.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import com.backend.backend.Entity.Usuario;
import org.springframework.stereotype.Component;

import java.util.Date;
import java.security.Key;

@Component
public class JwtUtil {
    // En producción, mueve esto a application.properties y usa @Value para inyectarlo
    private final Key key = Keys.hmacShaKeyFor("cambia_esta_clave_por_una_muy_larga_y_secreta_123456789012345".getBytes());
    private final long expirationMs = 1000L * 60 * 60 * 24; // 24h

    public String generateToken(Usuario user) {
        Date now = new Date();
        Date expiry = new Date(now.getTime() + expirationMs);

        return Jwts.builder()
                .setSubject(String.valueOf(user.getId()))
                .claim("correo", user.getCorreo())
                .claim("rol", user.getRol() != null ? user.getRol().getDescripcion() : null)
                .setIssuedAt(now)
                .setExpiration(expiry)
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    public Integer extractUserId(String token) {
        try {
            Claims claims = Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token).getBody();
            String sub = claims.getSubject();
            return (sub != null && !sub.isEmpty()) ? Integer.valueOf(sub) : null;
        } catch (Exception e) {
            return null;
        }
    }

    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }
}