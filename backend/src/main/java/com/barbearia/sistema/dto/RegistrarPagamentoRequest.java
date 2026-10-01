package com.barbearia.sistema.dto;

import com.barbearia.sistema.model.FormaPagamento;
import lombok.Data;

@Data
public class RegistrarPagamentoRequest {
    private FormaPagamento formaPagamento;
}
