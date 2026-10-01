package com.barbearia.sistema.dto;


import lombok.Data;

@Data
public class RegistroClienteRequest {

    private String nome;
    private String telefone;
    private String email;
    private String senha;
}
