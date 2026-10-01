package com.barbearia.sistema.repository;

import com.barbearia.sistema.model.Barbeiro;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface BarbeiroRepository extends JpaRepository<Barbeiro, Long> {
    Optional<Barbeiro> findByUsuario_Id(Long usuarioId);
    Optional<Barbeiro> findByUsuarioEmail(String email);
}
