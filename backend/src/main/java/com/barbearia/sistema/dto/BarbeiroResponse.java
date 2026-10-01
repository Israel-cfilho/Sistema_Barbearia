package com.barbearia.sistema.dto;

import com.barbearia.sistema.model.Barbeiro;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class BarbeiroResponse {

    private Long id;
    private String nome;
    private String telefone;
    private Double comissaoPercentual;

    public static BarbeiroResponse from(Barbeiro barbeiro) {

        return new BarbeiroResponse(
                barbeiro.getId(),
                barbeiro.getNome(),
                barbeiro.getTelefone(),
                barbeiro.getComissaoPercentual()
        );
    }
}