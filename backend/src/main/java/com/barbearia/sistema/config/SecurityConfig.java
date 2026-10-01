package com.barbearia.sistema.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import org.springframework.http.HttpMethod;

import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableMethodSecurity
public class SecurityConfig {

    @Autowired
    private JwtAuthFilter jwtAuthFilter;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        http
                // =========================================
                // CSRF
                // =========================================
                .csrf(csrf -> csrf.disable())

                // =========================================
                // CORS
                // =========================================
                .cors(cors ->
                        cors.configurationSource(
                                corsConfigurationSource()
                        )
                )

                // =========================================
                // JWT = STATELESS
                // =========================================
                .sessionManagement(session ->
                        session.sessionCreationPolicy(
                                SessionCreationPolicy.STATELESS
                        )
                )

                // =========================================
                // AUTORIZAÇÕES
                // =========================================
                .authorizeHttpRequests(auth -> auth

                        // =========================================
                        // ROTAS PÚBLICAS DE AUTENTICAÇÃO
                        // =========================================
                        .requestMatchers(
                                "/auth/login",
                                "/auth/registro-cliente",
                                "/auth/logout",
                                "/auth/esqueci-senha",
                                "/auth/redefinir-senha"
                        ).permitAll()

                        // =========================================
                        // SERVIÇOS
                        // Qualquer pessoa pode visualizar
                        // =========================================
                        .requestMatchers(
                                HttpMethod.GET,
                                "/servicos",
                                "/servicos/**"
                        ).permitAll()

                        // =========================================
                        // CADASTRO DE BARBEIRO
                        // Somente DONO
                        // =========================================
                        .requestMatchers(
                                "/auth/registro-barbeiro"
                        ).hasRole("DONO")

                        // =========================================
                        // TODO O RESTO PRECISA ESTAR LOGADO
                        // =========================================
                        .anyRequest().authenticated()
                )

                // =========================================
                // JWT FILTER
                // =========================================
                .addFilterBefore(
                        jwtAuthFilter,
                        UsernamePasswordAuthenticationFilter.class
                );

        return http.build();
    }


    // ============================================================
    // CORS
    // ============================================================

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {

        CorsConfiguration configuration =
                new CorsConfiguration();

        configuration.setAllowedOrigins(
                List.of(
                        "http://localhost:5173"
                )
        );

        configuration.setAllowedMethods(
                List.of(
                        "GET",
                        "POST",
                        "PUT",
                        "DELETE",
                        "OPTIONS"
                )
        );

        configuration.setAllowedHeaders(
                List.of("*")
        );

        // IMPORTANTE PARA COOKIE
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source =
                new UrlBasedCorsConfigurationSource();

        source.registerCorsConfiguration(
                "/**",
                configuration
        );

        return source;
    }


    // ============================================================
    // PASSWORD ENCODER
    // ============================================================

    @Bean
    public PasswordEncoder passwordEncoder() {

        return new BCryptPasswordEncoder();
    }
}