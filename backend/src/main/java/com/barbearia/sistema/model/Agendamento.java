package com.barbearia.sistema.model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Entity
@Table(name = "agendamentos")
@Data
public class Agendamento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "cliente_id")
    private Cliente cliente;

    @ManyToOne
    @JoinColumn(name = "barbeiro_id")
    private Barbeiro barbeiro;

    @ManyToOne
    @JoinColumn(name = "servico_id")
    private Servico servico;

    private LocalDate data;

    private LocalTime horaInicio;

    private String status;

    // ============================================================
    // CONFIRMAÇÃO DO CLIENTE
    // ============================================================

    @Column(nullable = false)
    private Boolean confirmadoCliente = false;

    private LocalDateTime confirmadoClienteEm;

    // ============================================================
    // MOTIVO DO CANCELAMENTO
    // ============================================================

    private String motivoCancelamento;

    @Enumerated(EnumType.STRING)
    @Column(name = "forma_pagamento")
    private FormaPagamento formaPagamento;

    @Column(name = "pagamento_registrado_em")
    private LocalDateTime pagamentoRegistradoEm;
}