package com.barbearia.sistema.dto;


import lombok.Data;

@Data
public class RegistroBarbeiroRequest {

    private String nome;
    private String telefone;
    private String email;
    private String senha;
    private Double comissaoPercentual;
}
