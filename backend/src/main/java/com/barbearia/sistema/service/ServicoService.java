package com.barbearia.sistema.service;

import com.barbearia.sistema.model.Servico;
import com.barbearia.sistema.repository.ServicoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ServicoService {

    @Autowired
    private ServicoRepository servicoRepository;

    public List<Servico> listarTodos() {
        return servicoRepository.findByAtivoTrue();
    }

    public Servico salvar(Servico servico) {
        return servicoRepository.save(servico);
    }

    public void deletar(Long id) {

        Servico servico = servicoRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Serviço não encontrado")
                );

        servico.setAtivo(false);

        servicoRepository.save(servico);
    }

    public Servico atualizar(Long id, Servico servicoAtualizado) {

        Servico servico = servicoRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Serviço não encontrado")
                );

        servico.setNome(servicoAtualizado.getNome());
        servico.setPreco(servicoAtualizado.getPreco());
        servico.setDuracaoMinutos(servicoAtualizado.getDuracaoMinutos());
        servico.setCategoria(servicoAtualizado.getCategoria());

        return servicoRepository.save(servico);
    }
}