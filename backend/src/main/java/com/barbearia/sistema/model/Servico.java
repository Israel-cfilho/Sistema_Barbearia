package com.barbearia.sistema.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "servicos")
@Data
public class Servico {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nome;
    private Double preco;
    private Integer duracaoMinutos;
    private String categoria;

    @Column(nullable = false)
    private Boolean ativo = true;
}