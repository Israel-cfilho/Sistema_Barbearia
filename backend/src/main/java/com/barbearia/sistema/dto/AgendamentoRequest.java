package com.barbearia.sistema.dto;


import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
public class AgendamentoRequest {

    private Long barbeiroId;
    private Long servicoId;
    private LocalDate data;
    private LocalTime horaInicio;
}
