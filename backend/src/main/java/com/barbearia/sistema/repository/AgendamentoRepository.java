package com.barbearia.sistema.repository;

import com.barbearia.sistema.model.Agendamento;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface AgendamentoRepository extends JpaRepository<Agendamento, Long> {

    // CLIENTE
    List<Agendamento> findByCliente_Id(Long clienteId);


    // EXCLUIR AGENDAMENTOS DO CLIENTE
    void deleteByCliente_Id(Long clienteId);


    // BARBEIRO
    List<Agendamento> findByBarbeiro_Id(Long barbeiroId);


    // AGENDAMENTOS DO BARBEIRO POR DATA
    List<Agendamento> findByBarbeiro_IdAndData(
            Long barbeiroId,
            LocalDate data
    );

    List<Agendamento> findByConfirmadoClienteFalseAndStatusNot(
            String status
    );


    // RENDA TOTAL
    @Query("""
            SELECT COALESCE(SUM(a.servico.preco), 0)
            FROM Agendamento a
            WHERE a.status = 'CONCLUÍDO'
            AND a.data BETWEEN :inicio AND :fim
            """)
    Double somarRendaTotal(
            @Param("inicio") LocalDate inicio,
            @Param("fim") LocalDate fim
    );


    // RENDA POR BARBEIRO
    @Query("""
            SELECT COALESCE(SUM(a.servico.preco), 0)
            FROM Agendamento a
            WHERE a.status = 'CONCLUÍDO'
            AND a.barbeiro.id = :barbeiroId
            AND a.data BETWEEN :inicio AND :fim
            """)
    Double somarRendaPorBarbeiro(
            @Param("barbeiroId") Long barbeiroId,
            @Param("inicio") LocalDate inicio,
            @Param("fim") LocalDate fim
    );


    // QUANTIDADE DE AGENDAMENTOS POR BARBEIRO
    @Query("""
            SELECT COUNT(a)
            FROM Agendamento a
            WHERE a.barbeiro.id = :barbeiroId
            AND a.status = 'CONCLUÍDO'
            AND a.data BETWEEN :inicio AND :fim
            """)
    Long contarAgendamentosPorBarbeiro(
            @Param("barbeiroId") Long barbeiroId,
            @Param("inicio") LocalDate inicio,
            @Param("fim") LocalDate fim
    );


    // RANKING DE BARBEIROS
    @Query("""
            SELECT
                a.barbeiro.id,
                COUNT(a),
                COALESCE(SUM(a.servico.preco), 0)
            FROM Agendamento a
            WHERE a.status = 'CONCLUÍDO'
            AND a.data BETWEEN :inicio AND :fim
            GROUP BY a.barbeiro.id
            ORDER BY SUM(a.servico.preco) DESC
            """)
    List<Object[]> rankingBarbeiros(
            @Param("inicio") LocalDate inicio,
            @Param("fim") LocalDate fim
    );


    // SERVIÇOS MAIS VENDIDOS
    @Query("""
            SELECT
                a.servico.nome,
                COUNT(a),
                COALESCE(SUM(a.servico.preco), 0)
            FROM Agendamento a
            WHERE a.status = 'CONCLUÍDO'
            AND a.data BETWEEN :inicio AND :fim
            GROUP BY a.servico.id, a.servico.nome
            ORDER BY COUNT(a) DESC
            """)
    List<Object[]> servicosMaisVendidos(
            @Param("inicio") LocalDate inicio,
            @Param("fim") LocalDate fim
    );
}