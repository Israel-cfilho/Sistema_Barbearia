package com.barbearia.sistema.repository;

import com.barbearia.sistema.model.Servico;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ServicoRepository extends JpaRepository<Servico, Long> {
    List<Servico> findByAtivoTrue();
}
