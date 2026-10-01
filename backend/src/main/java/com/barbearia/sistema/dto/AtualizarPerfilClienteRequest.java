package com.barbearia.sistema.dto;

import lombok.Data;

@Data
public class AtualizarPerfilClienteRequest {

    private String nome;

    private String email;

    private String telefone;

    private String senhaAtual;

    private String novaSenha;
}