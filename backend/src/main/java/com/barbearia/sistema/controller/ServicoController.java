package com.barbearia.sistema.controller;


import com.barbearia.sistema.model.Servico;
import com.barbearia.sistema.repository.ServicoRepository;
import com.barbearia.sistema.service.ServicoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/servicos")
public class ServicoController {

    @Autowired
    private ServicoService servicoService;

    @GetMapping
    public List<Servico> listar() {
        return servicoService.listarTodos();
    }

    @PreAuthorize("hasRole('DONO')")
    @PostMapping
    public Servico salvar(@RequestBody Servico servico) {
        return servicoService.salvar(servico);
    }

    @PreAuthorize("hasRole('DONO')")
    @DeleteMapping("/{id}")
    public void deletar(@PathVariable Long id) {
        servicoService.deletar(id);
    }

    @PreAuthorize("hasRole('DONO')")
    @PutMapping("/{id}")
    public Servico atualizar(@PathVariable Long id, @RequestBody Servico servico){
        return servicoService.atualizar(id, servico);
    }
}
