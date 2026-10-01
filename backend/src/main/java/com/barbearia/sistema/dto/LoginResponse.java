package com.barbearia.sistema.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.Set;

@Data
@AllArgsConstructor
public class LoginResponse {

    private String token;

    /*
     * Mantido temporariamente para o frontend atual.
     */
    private String role;

    /*
     * Novo campo para usuários com mais de uma função.
     */
    private Set<String> roles;
}