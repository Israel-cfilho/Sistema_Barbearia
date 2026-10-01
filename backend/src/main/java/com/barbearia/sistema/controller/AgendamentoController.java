package com.barbearia.sistema.controller;

import com.barbearia.sistema.dto.AgendamentoRequest;
import com.barbearia.sistema.dto.AgendamentoResponse;
import com.barbearia.sistema.dto.AtualizarStatusRequest;

import com.barbearia.sistema.dto.RegistrarPagamentoRequest;
import com.barbearia.sistema.model.Agendamento;

import com.barbearia.sistema.service.AgendamentoService;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;

import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

import java.util.List;


@RestController
@RequestMapping("/agendamentos")
public class AgendamentoController {

    @Autowired
    private AgendamentoService agendamentoService;


    // ============================================================
    // DONO VÊ TODOS OS AGENDAMENTOS
    // ============================================================

    @PreAuthorize("hasRole('DONO')")
    @GetMapping
    public List<AgendamentoResponse> listarAgendamentos() {

        return agendamentoService
                .listarTodos()
                .stream()
                .map(AgendamentoResponse::from)
                .toList();
    }


    // ============================================================
    // DISPONIBILIDADE
    // ============================================================

    @GetMapping("/disponibilidade")
    public List<AgendamentoResponse> buscarDisponibilidade(
            @RequestParam Long barbeiroId,
            @RequestParam LocalDate data
    ) {

        return agendamentoService
                .buscarPorBarbeiroEData(
                        barbeiroId,
                        data
                )
                .stream()
                .map(AgendamentoResponse::from)
                .toList();
    }


    // ============================================================
    // HORÁRIOS DISPONÍVEIS
    // ============================================================

    @PreAuthorize("hasRole('CLIENTE')")
    @GetMapping("/horarios-disponiveis")
    public List<String> horariosDisponiveis(
            @RequestParam Long barbeiroId,
            @RequestParam Long servicoId,
            @RequestParam LocalDate data
    ) {

        return agendamentoService
                .buscarHorariosDisponiveis(
                        barbeiroId,
                        servicoId,
                        data
                );
    }


    // ============================================================
    // CLIENTE CRIA AGENDAMENTO
    // ============================================================

    @PreAuthorize("hasRole('CLIENTE')")
    @PostMapping
    public AgendamentoResponse salvarAgendamento(
            @RequestBody AgendamentoRequest agendamentoRequest,
            Authentication authentication
    ) {

        Agendamento agendamento =
                agendamentoService.criar(
                        agendamentoRequest,
                        authentication.getName()
                );


        return AgendamentoResponse.from(
                agendamento
        );
    }


    // ============================================================
    // BARBEIRO OU DONO CANCELA AGENDAMENTO
    // ============================================================

    @PreAuthorize("hasAnyRole('BARBEIRO', 'DONO')")
    @PutMapping("/{id}/cancelar-administrativo")
    public AgendamentoResponse cancelarAgendamentoAdministrativo(
            @PathVariable Long id
    ) {

        Agendamento agendamento =
                agendamentoService
                        .cancelarAgendamentoAdministrativo(
                                id
                        );


        return AgendamentoResponse.from(
                agendamento
        );
    }


    // ============================================================
    // CLIENTE CONFIRMA PRESENÇA
    // ============================================================

    @PreAuthorize("hasRole('CLIENTE')")
    @PutMapping("/{id}/confirmar-presenca")
    public AgendamentoResponse confirmarPresenca(
            @PathVariable Long id,
            Authentication authentication
    ) {

        Agendamento agendamento =
                agendamentoService
                        .confirmarPresencaCliente(
                                id,
                                authentication.getName()
                        );


        return AgendamentoResponse.from(
                agendamento
        );
    }


    // ============================================================
    // CLIENTE OU BARBEIRO VÊ OS PRÓPRIOS AGENDAMENTOS
    // ============================================================

    @PreAuthorize("hasAnyRole('CLIENTE', 'BARBEIRO')")
    @GetMapping("/meus")
    public List<AgendamentoResponse> listarMeusAgendamentos() {

        return agendamentoService
                .listarMeusAgendamentos()
                .stream()
                .map(AgendamentoResponse::from)
                .toList();
    }


    // ============================================================
    // CLIENTE CANCELA O PRÓPRIO AGENDAMENTO
    // ============================================================

    @PreAuthorize("hasRole('CLIENTE')")
    @PutMapping("/{id}/cancelar")
    public AgendamentoResponse cancelarAgendamento(
            @PathVariable Long id,
            Authentication authentication
    ) {

        Agendamento agendamento =
                agendamentoService
                        .cancelarAgendamentoCliente(
                                id,
                                authentication.getName()
                        );


        return AgendamentoResponse.from(
                agendamento
        );
    }


    // ============================================================
    // BARBEIRO OU DONO ATUALIZA STATUS
    // ============================================================

    @PreAuthorize("hasAnyRole('BARBEIRO', 'DONO')")
    @PutMapping("/{id}/status")
    public AgendamentoResponse atualizarStatus(
            @PathVariable Long id,
            @RequestBody AtualizarStatusRequest request
    ) {

        Agendamento agendamento =
                agendamentoService
                        .atualizarStatus(
                                id,
                                request.getStatus()
                        );


        return AgendamentoResponse.from(
                agendamento
        );
    }

    @PreAuthorize("hasRole('DONO')")
    @PutMapping("/{id}/pagamento")
    public AgendamentoResponse registrarPagamento(
            @PathVariable Long id,
            @RequestBody RegistrarPagamentoRequest request
    ) {

        Agendamento agendamento =
                agendamentoService.registrarPagamento(
                        id,
                        request
                );

        return AgendamentoResponse.from(
                agendamento
        );
    }
}