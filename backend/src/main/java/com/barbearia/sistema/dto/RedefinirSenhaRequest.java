package com.barbearia.sistema.dto;

import lombok.Data;

@Data
public class RedefinirSenhaRequest {
    private String token;
    private String novaSenha;
}
