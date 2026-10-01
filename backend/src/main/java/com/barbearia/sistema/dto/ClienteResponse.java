package com.barbearia.sistema.dto;

import com.barbearia.sistema.model.Cliente;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ClienteResponse {

    private Long id;
    private String nome;
    private String telefone;
    private String email;


    // ============================================================
    // CONVERTE CLIENTE -> DTO
    // ============================================================

    public static ClienteResponse from(Cliente cliente) {

        String email = null;

        if (cliente.getUsuario() != null) {
            email = cliente
                    .getUsuario()
                    .getEmail();
        }

        return new ClienteResponse(
                cliente.getId(),
                cliente.getNome(),
                cliente.getTelefone(),
                email
        );
    }
}