package com.barbearia.sistema.service;

import com.barbearia.sistema.dto.AgendamentoRequest;

import com.barbearia.sistema.dto.RegistrarPagamentoRequest;
import com.barbearia.sistema.model.Agendamento;
import com.barbearia.sistema.model.Barbeiro;
import com.barbearia.sistema.model.Cliente;
import com.barbearia.sistema.model.Role;
import com.barbearia.sistema.model.Servico;
import com.barbearia.sistema.model.Usuario;

import com.barbearia.sistema.repository.AgendamentoRepository;
import com.barbearia.sistema.repository.BarbeiroRepository;
import com.barbearia.sistema.repository.ClienteRepository;
import com.barbearia.sistema.repository.ServicoRepository;
import com.barbearia.sistema.repository.UsuarioRepository;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

import java.util.List;

@Service
public class AgendamentoService {

    @Autowired
    private AgendamentoRepository agendamentoRepository;

    @Autowired
    private ClienteRepository clienteRepository;

    @Autowired
    private BarbeiroRepository barbeiroRepository;

    @Autowired
    private ServicoRepository servicoRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;


    // ============================================================
    // CRIAR AGENDAMENTO
    // ============================================================

    public Agendamento criar(
            AgendamentoRequest request,
            String emailCliente
    ) {

        Cliente cliente =
                clienteRepository
                        .findByUsuarioEmail(emailCliente)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Cliente não encontrado"
                                )
                        );


        Barbeiro barbeiro =
                barbeiroRepository
                        .findById(request.getBarbeiroId())
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Barbeiro não encontrado"
                                )
                        );


        Servico servico =
                servicoRepository
                        .findById(request.getServicoId())
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Serviço não encontrado"
                                )
                        );


        // ========================================================
        // NÃO PERMITE DATA PASSADA
        // ========================================================

        if (
                request.getData()
                        .isBefore(LocalDate.now())
        ) {

            throw new RuntimeException(
                    "Não é possível agendar em uma data passada"
            );
        }


        LocalTime inicioNovo =
                request.getHoraInicio();


        LocalTime fimNovo =
                inicioNovo.plusMinutes(
                        servico.getDuracaoMinutos()
                );


        // ========================================================
        // BUSCA AGENDAMENTOS DO BARBEIRO NO DIA
        // ========================================================

        List<Agendamento> agendamentosDoDia =
                agendamentoRepository
                        .findByBarbeiro_IdAndData(
                                barbeiro.getId(),
                                request.getData()
                        );


        // ========================================================
        // VERIFICA CONFLITOS
        // ========================================================

        for (
                Agendamento existente :
                agendamentosDoDia
        ) {

            // CANCELADO não ocupa horário
            if (
                    "CANCELADO".equalsIgnoreCase(
                            existente.getStatus()
                    )
            ) {
                continue;
            }


            LocalTime inicioExistente =
                    existente.getHoraInicio();


            LocalTime fimExistente =
                    inicioExistente.plusMinutes(
                            existente
                                    .getServico()
                                    .getDuracaoMinutos()
                    );


            boolean conflito =
                    inicioNovo.isBefore(
                            fimExistente
                    )
                            &&
                            fimNovo.isAfter(
                                    inicioExistente
                            );


            if (conflito) {

                throw new RuntimeException(
                        "Este horário não está disponível para este barbeiro"
                );
            }
        }


        // ========================================================
        // CRIA AGENDAMENTO
        // ========================================================

        Agendamento agendamento =
                new Agendamento();


        agendamento.setCliente(
                cliente
        );

        agendamento.setBarbeiro(
                barbeiro
        );

        agendamento.setServico(
                servico
        );

        agendamento.setData(
                request.getData()
        );

        agendamento.setHoraInicio(
                request.getHoraInicio()
        );

        agendamento.setStatus(
                "PENDENTE"
        );


        // ========================================================
        // CONFIRMAÇÃO DO CLIENTE
        // ========================================================

        agendamento.setConfirmadoCliente(
                false
        );

        agendamento.setConfirmadoClienteEm(
                null
        );

        agendamento.setMotivoCancelamento(
                null
        );


        return agendamentoRepository.save(
                agendamento
        );
    }


    // ============================================================
    // CLIENTE CONFIRMA PRESENÇA
    // ============================================================

    public Agendamento confirmarPresencaCliente(
            Long agendamentoId,
            String emailCliente
    ) {

        // ========================================================
        // BUSCA CLIENTE LOGADO
        // ========================================================

        Cliente cliente =
                clienteRepository
                        .findByUsuarioEmail(
                                emailCliente
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Cliente não encontrado"
                                )
                        );


        // ========================================================
        // BUSCA AGENDAMENTO
        // ========================================================

        Agendamento agendamento =
                agendamentoRepository
                        .findById(
                                agendamentoId
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Agendamento não encontrado"
                                )
                        );


        // ========================================================
        // VERIFICA SE O AGENDAMENTO É DO CLIENTE
        // ========================================================

        if (
                !agendamento
                        .getCliente()
                        .getId()
                        .equals(
                                cliente.getId()
                        )
        ) {

            throw new RuntimeException(
                    "Você não pode confirmar o agendamento de outro cliente"
            );
        }


        // ========================================================
        // NÃO PERMITE CONFIRMAR CANCELADO
        // ========================================================

        if (
                "CANCELADO".equalsIgnoreCase(
                        agendamento.getStatus()
                )
        ) {

            throw new RuntimeException(
                    "Este agendamento está cancelado"
            );
        }


        // ========================================================
        // NÃO PERMITE CONFIRMAR CONCLUÍDO
        // ========================================================

        if (
                "CONCLUÍDO".equalsIgnoreCase(
                        agendamento.getStatus()
                )
                        ||
                        "CONCLUIDO".equalsIgnoreCase(
                                agendamento.getStatus()
                        )
        ) {

            throw new RuntimeException(
                    "Este agendamento já foi concluído"
            );
        }


        // ========================================================
        // CLIENTE JÁ CONFIRMOU
        // ========================================================

        if (
                Boolean.TRUE.equals(
                        agendamento.getConfirmadoCliente()
                )
        ) {

            throw new RuntimeException(
                    "Sua presença já foi confirmada"
            );
        }


        // ========================================================
        // DATA E HORA DO ATENDIMENTO
        // ========================================================

        LocalDateTime dataHoraAgendamento =
                LocalDateTime.of(
                        agendamento.getData(),
                        agendamento.getHoraInicio()
                );


        // ========================================================
        // LIMITE DE CONFIRMAÇÃO
        //
        // Exemplo:
        //
        // atendimento = 10:00
        // limite = 09:30
        // ========================================================

        LocalDateTime limiteConfirmacao =
                dataHoraAgendamento
                        .minusMinutes(30);


        LocalDateTime agora =
                LocalDateTime.now();


        // ========================================================
        // PASSOU DO LIMITE?
        // ========================================================

        if (
                agora.isAfter(limiteConfirmacao)
                        ||
                        agora.isEqual(limiteConfirmacao)
        ) {

            throw new RuntimeException(
                    "O prazo para confirmar sua presença encerrou 30 minutos antes do atendimento"
            );
        }


        // ========================================================
        // CONFIRMA PRESENÇA
        // ========================================================

        agendamento.setConfirmadoCliente(
                true
        );

        agendamento.setConfirmadoClienteEm(
                agora
        );


        return agendamentoRepository.save(
                agendamento
        );
    }


    // ============================================================
    // CANCELAR AUTOMATICAMENTE AGENDAMENTOS SEM CONFIRMAÇÃO
    // ============================================================

    public void cancelarAgendamentosSemConfirmacao() {

        LocalDateTime agora =
                LocalDateTime.now();


        List<Agendamento> agendamentos =
                agendamentoRepository
                        .findByConfirmadoClienteFalseAndStatusNot(
                                "CANCELADO"
                        );


        for (
                Agendamento agendamento :
                agendamentos
        ) {

            // ====================================================
            // IGNORA CONCLUÍDOS
            // ====================================================

            if (
                    "CONCLUÍDO".equalsIgnoreCase(
                            agendamento.getStatus()
                    )
                            ||
                            "CONCLUIDO".equalsIgnoreCase(
                                    agendamento.getStatus()
                            )
            ) {

                continue;
            }


            // ====================================================
            // HORÁRIO DO AGENDAMENTO
            // ====================================================

            LocalDateTime dataHoraAgendamento =
                    LocalDateTime.of(
                            agendamento.getData(),
                            agendamento.getHoraInicio()
                    );


            // ====================================================
            // LIMITE DE CONFIRMAÇÃO
            // ====================================================

            LocalDateTime limiteConfirmacao =
                    dataHoraAgendamento
                            .minusMinutes(30);


            // ====================================================
            // CHEGOU OU PASSOU DO LIMITE SEM CONFIRMAR
            // ====================================================

            if (
                    (
                            agora.isAfter(
                                    limiteConfirmacao
                            )
                                    ||
                                    agora.isEqual(
                                            limiteConfirmacao
                                    )
                    )
                            &&
                            !Boolean.TRUE.equals(
                                    agendamento
                                            .getConfirmadoCliente()
                            )
            ) {

                agendamento.setStatus(
                        "CANCELADO"
                );

                agendamento.setMotivoCancelamento(
                        "FALTA_DE_CONFIRMACAO"
                );


                agendamentoRepository.save(
                        agendamento
                );


                System.out.println(
                        "Agendamento "
                                + agendamento.getId()
                                + " cancelado automaticamente por falta de confirmação."
                );
            }
        }
    }


    // ============================================================
    // CANCELAR AGENDAMENTO PELO CLIENTE
    // ============================================================

    public Agendamento cancelarAgendamentoCliente(
            Long agendamentoId,
            String emailCliente
    ) {

        // ========================================================
        // BUSCA CLIENTE LOGADO
        // ========================================================

        Cliente cliente =
                clienteRepository
                        .findByUsuarioEmail(
                                emailCliente
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Cliente não encontrado"
                                )
                        );


        // ========================================================
        // BUSCA AGENDAMENTO
        // ========================================================

        Agendamento agendamento =
                agendamentoRepository
                        .findById(
                                agendamentoId
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Agendamento não encontrado"
                                )
                        );


        // ========================================================
        // VERIFICA SE O AGENDAMENTO É DESSE CLIENTE
        // ========================================================

        if (
                !agendamento
                        .getCliente()
                        .getId()
                        .equals(
                                cliente.getId()
                        )
        ) {

            throw new RuntimeException(
                    "Você não pode cancelar o agendamento de outro cliente"
            );
        }


        // ========================================================
        // VERIFICA SE JÁ ESTÁ CANCELADO
        // ========================================================

        if (
                "CANCELADO".equalsIgnoreCase(
                        agendamento.getStatus()
                )
        ) {

            throw new RuntimeException(
                    "Este agendamento já está cancelado"
            );
        }


        // ========================================================
        // NÃO PERMITE CANCELAR SERVIÇO CONCLUÍDO
        // ========================================================

        if (
                "CONCLUÍDO".equalsIgnoreCase(
                        agendamento.getStatus()
                )
                        ||
                        "CONCLUIDO".equalsIgnoreCase(
                                agendamento.getStatus()
                        )
        ) {

            throw new RuntimeException(
                    "Não é possível cancelar um agendamento concluído"
            );
        }


        // ========================================================
        // NÃO PERMITE CANCELAR DEPOIS QUE O ATENDIMENTO COMEÇOU
        // ========================================================

        LocalDateTime dataHoraAgendamento =
                LocalDateTime.of(
                        agendamento.getData(),
                        agendamento.getHoraInicio()
                );


        LocalDateTime agora =
                LocalDateTime.now();


        if (
                agora.isAfter(
                        dataHoraAgendamento
                )
                        ||
                        agora.isEqual(
                                dataHoraAgendamento
                        )
        ) {

            throw new RuntimeException(
                    "Não é possível cancelar um atendimento que já iniciou"
            );
        }


        // ========================================================
        // CANCELA
        // ========================================================

        agendamento.setStatus(
                "CANCELADO"
        );

        agendamento.setMotivoCancelamento(
                "CANCELADO_PELO_CLIENTE"
        );


        return agendamentoRepository.save(
                agendamento
        );
    }


    // ============================================================
    // CANCELAR AGENDAMENTO POR BARBEIRO OU DONO
    // ============================================================

    public Agendamento cancelarAgendamentoAdministrativo(
            Long agendamentoId
    ) {

        Agendamento agendamento =
                agendamentoRepository
                        .findById(agendamentoId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Agendamento não encontrado"
                                )
                        );


        Authentication authentication =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();


        boolean ehDono =
                authentication
                        .getAuthorities()
                        .stream()
                        .anyMatch(authority ->
                                authority
                                        .getAuthority()
                                        .equals("ROLE_DONO")
                        );


        boolean ehBarbeiro =
                authentication
                        .getAuthorities()
                        .stream()
                        .anyMatch(authority ->
                                authority
                                        .getAuthority()
                                        .equals("ROLE_BARBEIRO")
                        );


        // ========================================================
        // BARBEIRO SÓ PODE CANCELAR OS PRÓPRIOS AGENDAMENTOS
        // ========================================================

        if (
                ehBarbeiro
                        &&
                        !ehDono
        ) {

            Long barbeiroLogadoId =
                    descobrirIdDoBarbeiroLogado();


            if (
                    !agendamento
                            .getBarbeiro()
                            .getId()
                            .equals(
                                    barbeiroLogadoId
                            )
            ) {

                throw new RuntimeException(
                        "Você não pode cancelar o agendamento de outro barbeiro"
                );
            }
        }


        // ========================================================
        // GARANTIA DE PERMISSÃO
        // ========================================================

        if (
                !ehDono
                        &&
                        !ehBarbeiro
        ) {

            throw new RuntimeException(
                    "Você não possui permissão para cancelar este agendamento"
            );
        }


        // ========================================================
        // JÁ CANCELADO
        // ========================================================

        if (
                "CANCELADO".equalsIgnoreCase(
                        agendamento.getStatus()
                )
        ) {

            throw new RuntimeException(
                    "Este agendamento já está cancelado"
            );
        }


        // ========================================================
        // CONCLUÍDO NÃO PODE SER CANCELADO
        // ========================================================

        if (
                "CONCLUÍDO".equalsIgnoreCase(
                        agendamento.getStatus()
                )
                        ||
                        "CONCLUIDO".equalsIgnoreCase(
                                agendamento.getStatus()
                        )
        ) {

            throw new RuntimeException(
                    "Não é possível cancelar um agendamento concluído"
            );
        }


        // ========================================================
        // CANCELA
        // ========================================================

        agendamento.setStatus(
                "CANCELADO"
        );


        if (ehDono) {

            agendamento.setMotivoCancelamento(
                    "CANCELADO_PELO_DONO"
            );

        } else {

            agendamento.setMotivoCancelamento(
                    "CANCELADO_PELO_BARBEIRO"
            );
        }


        return agendamentoRepository.save(
                agendamento
        );
    }


    // ============================================================
    // BUSCAR POR BARBEIRO E DATA
    // ============================================================

    public List<Agendamento> buscarPorBarbeiroEData(
            Long barbeiroId,
            LocalDate data
    ) {

        return agendamentoRepository
                .findByBarbeiro_IdAndData(
                        barbeiroId,
                        data
                );
    }


    // ============================================================
    // LISTAR TODOS
    // ============================================================

    public List<Agendamento> listarTodos() {

        return agendamentoRepository
                .findAll();
    }


    // ============================================================
    // LISTAR AGENDAMENTOS DO USUÁRIO LOGADO
    // ============================================================

    public List<Agendamento> listarMeusAgendamentos() {

        String email =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication()
                        .getName();


        Usuario usuario =
                usuarioRepository
                        .findByEmail(email)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Usuário não encontrado"
                                )
                        );


        // ========================================================
        // CLIENTE
        // ========================================================

        if (
                usuario.getRoles()
                        .contains(Role.CLIENTE)
        ) {

            Cliente cliente =
                    clienteRepository
                            .findByUsuario_Id(
                                    usuario.getId()
                            )
                            .orElseThrow(() ->
                                    new RuntimeException(
                                            "Cliente não encontrado"
                                    )
                            );


            return agendamentoRepository
                    .findByCliente_Id(
                            cliente.getId()
                    );
        }


        // ========================================================
        // BARBEIRO
        // ========================================================

        if (
                usuario.getRoles()
                        .contains(Role.BARBEIRO)
        ) {

            Barbeiro barbeiro =
                    barbeiroRepository
                            .findByUsuario_Id(
                                    usuario.getId()
                            )
                            .orElseThrow(() ->
                                    new RuntimeException(
                                            "Barbeiro não encontrado"
                                    )
                            );


            return agendamentoRepository
                    .findByBarbeiro_Id(
                            barbeiro.getId()
                    );
        }


        throw new RuntimeException(
                "Role não suportada para essa operação"
        );
    }


    // ============================================================
    // ATUALIZAR STATUS
    // ============================================================

    public Agendamento atualizarStatus(
            Long id,
            String novoStatus
    ) {

        // ========================================================
        // BUSCA AGENDAMENTO
        // ========================================================

        Agendamento agendamento =
                agendamentoRepository
                        .findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Agendamento não encontrado"
                                )
                        );


        // ========================================================
        // DESCOBRE QUEM ESTÁ LOGADO
        // ========================================================

        Authentication authentication =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();


        // ========================================================
        // VERIFICA ROLE
        // ========================================================

        boolean ehDono =
                authentication
                        .getAuthorities()
                        .stream()
                        .anyMatch(authority ->
                                authority
                                        .getAuthority()
                                        .equals("ROLE_DONO")
                        );


        boolean ehBarbeiro =
                authentication
                        .getAuthorities()
                        .stream()
                        .anyMatch(authority ->
                                authority
                                        .getAuthority()
                                        .equals("ROLE_BARBEIRO")
                        );


        // ========================================================
        // BARBEIRO SÓ ALTERA O PRÓPRIO AGENDAMENTO
        // ========================================================

        if (
                ehBarbeiro
                        &&
                        !ehDono
        ) {

            Long barbeiroLogadoId =
                    descobrirIdDoBarbeiroLogado();


            if (
                    !agendamento
                            .getBarbeiro()
                            .getId()
                            .equals(
                                    barbeiroLogadoId
                            )
            ) {

                throw new RuntimeException(
                        "Você não pode alterar o agendamento de outro barbeiro"
                );
            }
        }


        // ========================================================
        // GARANTIA EXTRA DE PERMISSÃO
        // ========================================================

        if (
                !ehDono
                        &&
                        !ehBarbeiro
        ) {

            throw new RuntimeException(
                    "Você não possui permissão para alterar este agendamento"
            );
        }


        // ========================================================
        // VALIDA STATUS
        // ========================================================

        if (novoStatus == null) {

            throw new RuntimeException(
                    "Status inválido"
            );
        }


        String status =
                novoStatus
                        .trim()
                        .toUpperCase();


        if (
                !status.equals("PENDENTE")
                        &&
                        !status.equals("CONFIRMADO")
                        &&
                        !status.equals("CONCLUÍDO")
        ) {

            throw new RuntimeException(
                    "Status inválido"
            );
        }


        // ========================================================
        // NÃO ALTERA AGENDAMENTO CANCELADO
        // ========================================================

        if (
                "CANCELADO".equalsIgnoreCase(
                        agendamento.getStatus()
                )
        ) {

            throw new RuntimeException(
                    "Não é possível alterar um agendamento cancelado"
            );
        }


        // ========================================================
        // NÃO ALTERA AGENDAMENTO JÁ CONCLUÍDO
        // ========================================================

        if (
                "CONCLUÍDO".equalsIgnoreCase(
                        agendamento.getStatus()
                )
                        ||
                        "CONCLUIDO".equalsIgnoreCase(
                                agendamento.getStatus()
                        )
        ) {

            throw new RuntimeException(
                    "Este agendamento já foi concluído"
            );
        }


        // ========================================================
        // ATUALIZA STATUS
        // ========================================================

        agendamento.setStatus(
                status
        );


        return agendamentoRepository.save(
                agendamento
        );
    }


    // ============================================================
    // RENDA TOTAL
    // ============================================================

    public Double calcularRendaTotal(
            LocalDate inicio,
            LocalDate fim
    ) {

        return agendamentoRepository
                .somarRendaTotal(
                        inicio,
                        fim
                );
    }


    // ============================================================
    // RENDA POR BARBEIRO
    // ============================================================

    public Double calcularRendaPorBarbeiro(
            Long barbeiroId,
            LocalDate inicio,
            LocalDate fim
    ) {

        return agendamentoRepository
                .somarRendaPorBarbeiro(
                        barbeiroId,
                        inicio,
                        fim
                );
    }


    // ============================================================
    // QUANTIDADE DE AGENDAMENTOS POR BARBEIRO
    // ============================================================

    public Long contarAgendamentosPorBarbeiro(
            Long barbeiroId,
            LocalDate inicio,
            LocalDate fim
    ) {

        return agendamentoRepository
                .contarAgendamentosPorBarbeiro(
                        barbeiroId,
                        inicio,
                        fim
                );
    }


    // ============================================================
    // DESCOBRIR ID DO BARBEIRO LOGADO
    // ============================================================

    public Long descobrirIdDoBarbeiroLogado() {

        String email =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication()
                        .getName();


        Usuario usuario =
                usuarioRepository
                        .findByEmail(email)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Usuário não encontrado"
                                )
                        );


        Barbeiro barbeiro =
                barbeiroRepository
                        .findByUsuario_Id(
                                usuario.getId()
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Barbeiro não encontrado"
                                )
                        );


        return barbeiro.getId();
    }


    // ============================================================
    // RANKING DOS BARBEIROS
    // ============================================================

    public List<Object[]> buscarRankingBarbeiros(
            LocalDate inicio,
            LocalDate fim
    ) {

        return agendamentoRepository
                .rankingBarbeiros(
                        inicio,
                        fim
                );
    }


    // ============================================================
    // SERVIÇOS MAIS VENDIDOS
    // ============================================================

    public List<Object[]> buscarServicoMaisVendido(
            LocalDate inicio,
            LocalDate fim
    ) {

        return agendamentoRepository
                .servicosMaisVendidos(
                        inicio,
                        fim
                );
    }


    // ============================================================
    // BUSCAR HORÁRIOS DISPONÍVEIS
    // ============================================================

    public List<String> buscarHorariosDisponiveis(
            Long barbeiroId,
            Long servicoId,
            LocalDate data
    ) {

        Servico servico =
                servicoRepository
                        .findById(servicoId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Serviço não encontrado"
                                )
                        );


        Barbeiro barbeiro =
                barbeiroRepository
                        .findById(barbeiroId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Barbeiro não encontrado"
                                )
                        );


        List<String> horarios =
                List.of(
                        "08:00",
                        "08:30",
                        "09:00",
                        "09:30",
                        "10:00",
                        "10:30",
                        "11:00",
                        "11:30",

                        "14:00",
                        "14:30",
                        "15:00",
                        "15:30",
                        "16:00",
                        "16:30",
                        "17:00",
                        "17:30",

                        "18:00",
                        "18:30",
                        "19:00",
                        "19:30",
                        "20:00"
                );


        List<Agendamento> agendamentosDoDia =
                agendamentoRepository
                        .findByBarbeiro_IdAndData(
                                barbeiro.getId(),
                                data
                        );


        return horarios
                .stream()
                .filter(horario -> {

                    LocalTime inicioNovo =
                            LocalTime.parse(
                                    horario
                            );


                    LocalTime fimNovo =
                            inicioNovo.plusMinutes(
                                    servico
                                            .getDuracaoMinutos()
                            );


                    for (
                            Agendamento existente :
                            agendamentosDoDia
                    ) {

                        // CANCELADO libera horário
                        if (
                                "CANCELADO"
                                        .equalsIgnoreCase(
                                                existente.getStatus()
                                        )
                        ) {
                            continue;
                        }


                        LocalTime inicioExistente =
                                existente
                                        .getHoraInicio();


                        LocalTime fimExistente =
                                inicioExistente
                                        .plusMinutes(
                                                existente
                                                        .getServico()
                                                        .getDuracaoMinutos()
                                        );


                        boolean conflito =
                                inicioNovo.isBefore(
                                        fimExistente
                                )
                                        &&
                                        fimNovo.isAfter(
                                                inicioExistente
                                        );


                        if (conflito) {
                            return false;
                        }
                    }


                    return true;
                })
                .toList();


    }

    public Agendamento registrarPagamento(
            Long agendamentoId,
            RegistrarPagamentoRequest request
    ) {

        Agendamento agendamento =
                agendamentoRepository
                        .findById(agendamentoId)
                        .orElseThrow(
                                () -> new RuntimeException(
                                        "Agendamento não encontrado."
                                )
                        );


        if (request.getFormaPagamento() == null) {

            throw new RuntimeException(
                    "Informe a forma de pagamento."
            );
        }


        if (!"CONCLUÍDO".equalsIgnoreCase(
                agendamento.getStatus()
        )) {

            throw new RuntimeException(
                    "A forma de pagamento só pode ser registrada após a conclusão do atendimento."
            );
        }


        agendamento.setFormaPagamento(
                request.getFormaPagamento()
        );

        agendamento.setPagamentoRegistradoEm(
                LocalDateTime.now()
        );


        return agendamentoRepository.save(
                agendamento
        );
    }
}