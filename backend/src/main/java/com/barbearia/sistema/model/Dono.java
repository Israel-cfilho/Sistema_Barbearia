package com.barbearia.sistema.model;


import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "donos")
@Data
public class Dono {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nome;

    @OneToOne
    @JoinColumn(name = "usuario_id")
    private Usuario usuario;
}
