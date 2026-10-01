package com.barbearia.sistema.model;


import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "barbeiros")
@Data
public class Barbeiro {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nome;
    private String telefone;
    private Double comissaoPercentual;

    @OneToOne
    @JoinColumn(name = "usuario_id")
    private Usuario usuario;
}
