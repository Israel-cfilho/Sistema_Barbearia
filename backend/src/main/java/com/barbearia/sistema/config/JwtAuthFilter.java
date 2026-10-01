package com.barbearia.sistema.config;

import com.barbearia.sistema.service.JwtService;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import lombok.NonNull;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;

import org.springframework.security.core.authority.SimpleGrantedAuthority;

import org.springframework.security.core.context.SecurityContextHolder;

import org.springframework.stereotype.Component;

import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
public class JwtAuthFilter extends OncePerRequestFilter {

    @Autowired
    private JwtService jwtService;

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain
    ) throws ServletException, IOException {

        // ============================================================
        // PROCURA O JWT NO COOKIE
        // ============================================================

        String token = null;

        Cookie[] cookies = request.getCookies();

        if (cookies != null) {

            for (Cookie cookie : cookies) {

                if ("jwt".equals(cookie.getName())) {

                    token = cookie.getValue();

                    break;
                }
            }
        }

        // ============================================================
        // NÃO TEM TOKEN
        // ============================================================

        if (token == null || token.isBlank()) {

            filterChain.doFilter(
                    request,
                    response
            );

            return;
        }

        // ============================================================
        // VALIDA TOKEN
        // ============================================================

        if (jwtService.tokenValido(token)) {

            String email =
                    jwtService.extrairEmail(token);

            // ========================================================
            // PEGA TODAS AS ROLES
            // ========================================================

            List<String> roles =
                    jwtService.extrairRoles(token);

            // ========================================================
            // TRANSFORMA:
            //
            // DONO      -> ROLE_DONO
            // BARBEIRO  -> ROLE_BARBEIRO
            // CLIENTE   -> ROLE_CLIENTE
            // ========================================================

            var authorities =
                    roles
                            .stream()
                            .map(role ->
                                    new SimpleGrantedAuthority(
                                            "ROLE_" + role
                                    )
                            )
                            .toList();

            // ========================================================
            // CRIA AUTENTICAÇÃO
            // ========================================================

            var authentication =
                    new UsernamePasswordAuthenticationToken(
                            email,
                            null,
                            authorities
                    );

            // ========================================================
            // COLOCA NO SPRING SECURITY
            // ========================================================

            SecurityContextHolder
                    .getContext()
                    .setAuthentication(
                            authentication
                    );
        }

        // ============================================================
        // CONTINUA A REQUISIÇÃO
        // ============================================================

        filterChain.doFilter(
                request,
                response
        );
    }
}