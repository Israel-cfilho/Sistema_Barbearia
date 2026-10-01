package com.barbearia.sistema.model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;


@Entity
@Table(name = "password_reset_tokens")
@Data
public class PasswordResetToken {

        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Long id;

        @Column(nullable = false, unique = true, length = 100)
        private String token;

        @ManyToOne(fetch = FetchType.LAZY, optional = false)
        @JoinColumn(name = "usuario_id", nullable = false)
        private Usuario usuario;

        @Column(nullable = false)
        private LocalDateTime expiraEm;

        @Column(nullable = false)
        private LocalDateTime criadoEm;

}
