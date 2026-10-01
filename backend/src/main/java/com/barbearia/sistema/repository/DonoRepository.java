package com.barbearia.sistema.repository;

import com.barbearia.sistema.model.Dono;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DonoRepository extends JpaRepository<Dono, Long> {
}
