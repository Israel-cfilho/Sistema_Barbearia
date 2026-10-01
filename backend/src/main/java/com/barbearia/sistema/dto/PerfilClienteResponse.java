package com.barbearia.sistema.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class PerfilClienteResponse {

    private Long id;

    private String nome;

    private String email;

    private String telefone;
}