package com.barbearia.sistema.controller;

import com.barbearia.sistema.dto.AtualizarPerfilClienteRequest;
import com.barbearia.sistema.dto.ClienteResponse;
import com.barbearia.sistema.dto.PerfilClienteResponse;

import com.barbearia.sistema.model.Cliente;

import com.barbearia.sistema.service.ClienteService;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.http.ResponseEntity;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/clientes")
public class ClienteController {

    @Autowired
    private ClienteService clienteService;


    // ============================================================
    // DONO - LISTAR CLIENTES
    // ============================================================

    @PreAuthorize("hasRole('DONO')")
    @GetMapping
    public List<ClienteResponse> listarClientes() {

        return clienteService
                .listarTodos()
                .stream()
                .map(ClienteResponse::from)
                .toList();
    }


    // ============================================================
    // DONO - CADASTRAR CLIENTE
    // ============================================================

    @PreAuthorize("hasRole('DONO')")
    @PostMapping
    public ClienteResponse salvarClientes(
            @RequestBody Cliente cliente
    ) {

        Cliente clienteSalvo =
                clienteService.salvar(
                        cliente
                );

        return ClienteResponse.from(
                clienteSalvo
        );
    }


    // ============================================================
    // DONO - EXCLUIR CLIENTE
    // ============================================================

    @PreAuthorize("hasRole('DONO')")
    @DeleteMapping("/{id}")
    public void deletarClientes(
            @PathVariable Long id
    ) {

        clienteService.excluir(
                id
        );
    }


    // ============================================================
    // DONO - ATUALIZAR CLIENTE
    // ============================================================

    @PreAuthorize("hasRole('DONO')")
    @PutMapping("/{id}")
    public ClienteResponse atualizarCliente(
            @PathVariable Long id,
            @RequestBody Cliente cliente
    ) {

        Cliente clienteAtualizado =
                clienteService.atualizar(
                        id,
                        cliente
                );

        return ClienteResponse.from(
                clienteAtualizado
        );
    }


    // ============================================================
    // CLIENTE - BUSCAR PRÓPRIO PERFIL
    // ============================================================

    @PreAuthorize("hasRole('CLIENTE')")
    @GetMapping("/me")
    public PerfilClienteResponse buscarMeuPerfil(
            Authentication authentication
    ) {

        return clienteService
                .buscarMeuPerfil(
                        authentication.getName()
                );
    }


    // ============================================================
    // CLIENTE - ATUALIZAR PRÓPRIO PERFIL
    // ============================================================

    @PreAuthorize("hasRole('CLIENTE')")
    @PutMapping("/me")
    public PerfilClienteResponse atualizarMeuPerfil(
            @RequestBody AtualizarPerfilClienteRequest request,
            Authentication authentication
    ) {

        return clienteService
                .atualizarMeuPerfil(
                        authentication.getName(),
                        request
                );
    }


    // ============================================================
    // CLIENTE - EXCLUIR PRÓPRIA CONTA
    // ============================================================

    @PreAuthorize("hasRole('CLIENTE')")
    @DeleteMapping("/me")
    public ResponseEntity<Void> excluirMinhaConta(
            Authentication authentication
    ) {

        clienteService.excluirMinhaConta(
                authentication.getName()
        );

        return ResponseEntity
                .noContent()
                .build();
    }
}