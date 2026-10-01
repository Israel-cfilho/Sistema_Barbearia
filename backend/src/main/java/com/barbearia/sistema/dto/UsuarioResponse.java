package com.barbearia.sistema.dto;

import com.barbearia.sistema.model.Usuario;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.Set;
import java.util.stream.Collectors;

@Data
@AllArgsConstructor
public class UsuarioResponse {

    private Long id;
    private String email;
    private Set<String> roles;


    // ============================================================
    // CONVERTE USUARIO -> DTO
    // ============================================================

    public static UsuarioResponse from(Usuario usuario) {

        Set<String> roles =
                usuario.getRoles()
                        .stream()
                        .map(Enum::name)
                        .collect(Collectors.toSet());

        return new UsuarioResponse(
                usuario.getId(),
                usuario.getEmail(),
                roles
        );
    }
}