package com.barbearia.sistema.model;


import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "clientes")
@Data
public class Cliente {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nome;
    private String telefone;

    @OneToOne
    @JoinColumn(name = "usuario_id")
    private Usuario usuario;

}
