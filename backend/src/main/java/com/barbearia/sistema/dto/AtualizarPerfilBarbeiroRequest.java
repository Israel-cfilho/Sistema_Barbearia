package com.barbearia.sistema.dto;

import lombok.Data;

@Data
public class AtualizarPerfilBarbeiroRequest {

    private String nome;
    private String telefone;
    private String email;

    private String senhaAtual;
    private String novaSenha;
}