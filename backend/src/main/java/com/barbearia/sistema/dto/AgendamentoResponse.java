package com.barbearia.sistema.dto;

import com.barbearia.sistema.model.Agendamento;
import com.barbearia.sistema.model.FormaPagamento;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;


@Data
@AllArgsConstructor
public class AgendamentoResponse {

    private Long id;

    private ClienteResumo cliente;

    private BarbeiroResumo barbeiro;

    private ServicoResumo servico;

    private LocalDate data;

    private LocalTime horaInicio;

    private String status;

    private Boolean confirmadoCliente;

    private LocalDateTime confirmadoClienteEm;

    private String motivoCancelamento;

    private FormaPagamento formaPagamento;
    private LocalDateTime pagamentoRegistradoEm;


    // ============================================================
    // CONVERTE AGENDAMENTO -> DTO
    // ============================================================

    public static AgendamentoResponse from(
            Agendamento agendamento
    ) {

        ClienteResumo clienteResumo =
                new ClienteResumo(
                        agendamento
                                .getCliente()
                                .getId(),

                        agendamento
                                .getCliente()
                                .getNome(),

                        agendamento
                                .getCliente()
                                .getTelefone()
                );


        BarbeiroResumo barbeiroResumo =
                new BarbeiroResumo(
                        agendamento
                                .getBarbeiro()
                                .getId(),

                        agendamento
                                .getBarbeiro()
                                .getNome(),

                        agendamento
                                .getBarbeiro()
                                .getTelefone(),

                        agendamento
                                .getBarbeiro()
                                .getComissaoPercentual()
                );


        ServicoResumo servicoResumo =
                new ServicoResumo(
                        agendamento
                                .getServico()
                                .getId(),

                        agendamento
                                .getServico()
                                .getNome(),

                        agendamento
                                .getServico()
                                .getPreco(),

                        agendamento
                                .getServico()
                                .getDuracaoMinutos()
                );


        return new AgendamentoResponse(
                agendamento.getId(),

                clienteResumo,

                barbeiroResumo,

                servicoResumo,

                agendamento.getData(),

                agendamento.getHoraInicio(),

                agendamento.getStatus(),

                agendamento.getConfirmadoCliente(),

                agendamento.getConfirmadoClienteEm(),

                agendamento.getMotivoCancelamento(),

                agendamento.getFormaPagamento(),

                agendamento.getPagamentoRegistradoEm()
        );
    }


    // ============================================================
    // CLIENTE RESUMIDO
    // ============================================================

    @Data
    @AllArgsConstructor
    public static class ClienteResumo {

        private Long id;

        private String nome;

        private String telefone;
    }


    // ============================================================
    // BARBEIRO RESUMIDO
    // ============================================================

    @Data
    @AllArgsConstructor
    public static class BarbeiroResumo {

        private Long id;

        private String nome;

        private String telefone;

        private Double comissaoPercentual;
    }


    // ============================================================
    // SERVIÇO RESUMIDO
    // ============================================================

    @Data
    @AllArgsConstructor
    public static class ServicoResumo {

        private Long id;

        private String nome;

        private Double preco;

        private Integer duracaoMinutos;
    }
}