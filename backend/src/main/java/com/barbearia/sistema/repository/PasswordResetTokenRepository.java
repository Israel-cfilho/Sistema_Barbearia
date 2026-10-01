package com.barbearia.sistema.repository;

import com.barbearia.sistema.model.PasswordResetToken;
import com.barbearia.sistema.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken, Long> {
    Optional<PasswordResetToken> findByToken(String token);
    void deleteByUsuario(Usuario usuario);
}
