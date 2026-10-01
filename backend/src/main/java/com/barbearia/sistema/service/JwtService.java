package com.barbearia.sistema.service;

import com.barbearia.sistema.model.Role;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.List;
import java.util.Set;
import java.util.function.Function;

@Service
public class JwtService {

    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.expiration}")
    private long expiration;

    private SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(secret.getBytes());
    }

    public String gerarToken(
            String email,
            Set<Role> roles
    ) {

        List<String> rolesString = roles
                .stream()
                .map(Role::name)
                .toList();

        String rolePrincipal =
                descobrirRolePrincipal(roles);

        return Jwts.builder()
                .setSubject(email)

                // Mantemos por enquanto para não quebrar
                // partes antigas do sistema.
                .claim(
                        "role",
                        rolePrincipal
                )

                // Novo campo que aceita várias funções.
                .claim(
                        "roles",
                        rolesString
                )

                .setIssuedAt(new Date())

                .setExpiration(
                        new Date(
                                System.currentTimeMillis()
                                        + expiration
                        )
                )

                .signWith(
                        getSigningKey(),
                        SignatureAlgorithm.HS256
                )

                .compact();
    }

    public String extrairEmail(String token) {
        return extrairClaim(
                token,
                Claims::getSubject
        );
    }

    /*
     * Mantido temporariamente porque provavelmente
     * seu filtro JWT ainda usa extrairRole().
     */
    public String extrairRole(String token) {

        return extrairClaim(
                token,
                claims ->
                        claims.get(
                                "role",
                                String.class
                        )
        );
    }

    /*
     * Método novo.
     */
    public List<String> extrairRoles(
            String token
    ) {

        return extrairClaim(
                token,
                claims -> {

                    Object roles =
                            claims.get("roles");

                    if (roles instanceof List<?>) {

                        return ((List<?>) roles)
                                .stream()
                                .map(Object::toString)
                                .toList();
                    }

                    /*
                     * Compatibilidade com tokens antigos.
                     */
                    String role =
                            claims.get(
                                    "role",
                                    String.class
                            );

                    if (role != null) {
                        return List.of(role);
                    }

                    return List.of();
                }
        );
    }

    private String descobrirRolePrincipal(
            Set<Role> roles
    ) {

        if (roles.contains(Role.DONO)) {
            return Role.DONO.name();
        }

        if (roles.contains(Role.BARBEIRO)) {
            return Role.BARBEIRO.name();
        }

        if (roles.contains(Role.CLIENTE)) {
            return Role.CLIENTE.name();
        }

        throw new RuntimeException(
                "Usuário não possui função cadastrada"
        );
    }

    private <T> T extrairClaim(
            String token,
            Function<Claims, T> resolver
    ) {

        Claims claims =
                Jwts.parserBuilder()
                        .setSigningKey(
                                getSigningKey()
                        )
                        .build()
                        .parseClaimsJws(token)
                        .getBody();

        return resolver.apply(claims);
    }

    public boolean tokenValido(String token) {

        try {

            Jwts.parserBuilder()
                    .setSigningKey(
                            getSigningKey()
                    )
                    .build()
                    .parseClaimsJws(token);

            return true;

        } catch (Exception e) {

            return false;
        }
    }
}