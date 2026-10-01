package com.barbearia.sistema.controller;

import com.barbearia.sistema.dto.AtualizarPerfilBarbeiroRequest;
import com.barbearia.sistema.dto.BarbeiroResponse;

import com.barbearia.sistema.model.Barbeiro;

import com.barbearia.sistema.service.BarbeiroService;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/barbeiros")
public class BarbeiroController {

    @Autowired
    private BarbeiroService barbeiroService;


    // ============================================================
    // LISTAR BARBEIROS
    // CLIENTE USA PARA ESCOLHER NO AGENDAMENTO
    // ============================================================

    @GetMapping
    public List<BarbeiroResponse> listarBarbeiros() {

        return barbeiroService
                .listarTodos()
                .stream()
                .map(BarbeiroResponse::from)
                .toList();
    }


    // ============================================================
    // BARBEIRO LOGADO
    // ============================================================

    @PreAuthorize("hasRole('BARBEIRO')")
    @GetMapping("/me")
    public BarbeiroResponse meuPerfil(
            Authentication authentication
    ) {

        Barbeiro barbeiro =
                barbeiroService.buscarBarbeiroLogado(
                        authentication.getName()
                );

        return BarbeiroResponse.from(
                barbeiro
        );
    }


    // ============================================================
    // BARBEIRO ATUALIZA O PRÓPRIO PERFIL
    // ============================================================

    @PreAuthorize("hasRole('BARBEIRO')")
    @PutMapping("/me")
    public BarbeiroResponse atualizarMeuPerfil(
            @RequestBody AtualizarPerfilBarbeiroRequest request,
            Authentication authentication
    ) {

        Barbeiro barbeiro =
                barbeiroService.atualizarMeuPerfil(
                        authentication.getName(),
                        request
                );

        return BarbeiroResponse.from(
                barbeiro
        );
    }


    // ============================================================
    // DONO DELETA BARBEIRO
    // ============================================================

    @PreAuthorize("hasRole('DONO')")
    @DeleteMapping("/{id}")
    public void deletarBarbeiro(
            @PathVariable Long id
    ) {

        barbeiroService.deletar(
                id
        );
    }


    // ============================================================
    // DONO ATUALIZA BARBEIRO
    // ============================================================

    @PreAuthorize("hasRole('DONO')")
    @PutMapping("/{id}")
    public BarbeiroResponse atualizar(
            @PathVariable Long id,
            @RequestBody Barbeiro barbeiro
    ) {

        Barbeiro atualizado =
                barbeiroService.atualizar(
                        id,
                        barbeiro
                );

        return BarbeiroResponse.from(
                atualizado
        );
    }
}