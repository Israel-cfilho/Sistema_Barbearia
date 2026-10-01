package com.barbearia.sistema.service;

import com.barbearia.sistema.dto.AtualizarPerfilClienteRequest;
import com.barbearia.sistema.dto.PerfilClienteResponse;

import com.barbearia.sistema.model.Cliente;
import com.barbearia.sistema.model.Usuario;

import com.barbearia.sistema.repository.AgendamentoRepository;
import com.barbearia.sistema.repository.ClienteRepository;
import com.barbearia.sistema.repository.UsuarioRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class ClienteService {

    @Autowired
    private ClienteRepository clienteRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private AgendamentoRepository agendamentoRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;


    // ============================================================
    // DONO - LISTAR TODOS
    // ============================================================

    public List<Cliente> listarTodos() {

        return clienteRepository.findAll();
    }


    // ============================================================
    // SALVAR
    // ============================================================

    public Cliente salvar(
            Cliente cliente
    ) {

        return clienteRepository.save(
                cliente
        );
    }


    // ============================================================
    // DONO - EXCLUIR
    // ============================================================

    public void excluir(
            Long id
    ) {

        clienteRepository.deleteById(
                id
        );
    }


    // ============================================================
    // DONO - ATUALIZAR
    // ============================================================

    public Cliente atualizar(
            Long id,
            Cliente clienteAtualizado
    ) {

        Cliente cliente =
                clienteRepository
                        .findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Cliente não encontrado"
                                )
                        );


        cliente.setNome(
                clienteAtualizado.getNome()
        );


        cliente.setTelefone(
                clienteAtualizado.getTelefone()
        );


        return clienteRepository.save(
                cliente
        );
    }


    // ============================================================
    // CLIENTE - BUSCAR PRÓPRIO PERFIL
    // ============================================================

    public PerfilClienteResponse buscarMeuPerfil(
            String email
    ) {

        Cliente cliente =
                clienteRepository
                        .findByUsuarioEmail(email)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Cliente não encontrado"
                                )
                        );


        return converterParaResponse(
                cliente
        );
    }


    // ============================================================
    // CLIENTE - ATUALIZAR PRÓPRIO PERFIL
    // ============================================================

    @Transactional
    public PerfilClienteResponse atualizarMeuPerfil(
            String emailUsuarioLogado,
            AtualizarPerfilClienteRequest request
    ) {

        Cliente cliente =
                clienteRepository
                        .findByUsuarioEmail(
                                emailUsuarioLogado
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Cliente não encontrado"
                                )
                        );


        Usuario usuario =
                cliente.getUsuario();


        // ========================================================
        // NOME
        // ========================================================

        if (
                request.getNome() == null ||
                        request.getNome().isBlank()
        ) {

            throw new RuntimeException(
                    "O nome é obrigatório"
            );
        }


        // ========================================================
        // TELEFONE
        // ========================================================

        if (
                request.getTelefone() == null ||
                        request.getTelefone().isBlank()
        ) {

            throw new RuntimeException(
                    "O telefone é obrigatório"
            );
        }


        // ========================================================
        // EMAIL
        // ========================================================

        if (
                request.getEmail() == null ||
                        request.getEmail().isBlank()
        ) {

            throw new RuntimeException(
                    "O e-mail é obrigatório"
            );
        }


        String novoEmail =
                request.getEmail()
                        .trim()
                        .toLowerCase();


        // Se o e-mail mudou, verifica se já existe
        if (
                !usuario
                        .getEmail()
                        .equalsIgnoreCase(
                                novoEmail
                        )
        ) {

            Optional<Usuario> usuarioExistente =
                    usuarioRepository.findByEmail(
                            novoEmail
                    );


            if (
                    usuarioExistente.isPresent()
            ) {

                throw new RuntimeException(
                        "Este e-mail já está cadastrado"
                );
            }


            usuario.setEmail(
                    novoEmail
            );

        }


        // ========================================================
        // DADOS DO CLIENTE
        // ========================================================

        cliente.setNome(
                request.getNome().trim()
        );


        cliente.setTelefone(
                request.getTelefone().trim()
        );


        // ========================================================
        // ALTERAÇÃO DE SENHA
        // ========================================================

        boolean querAlterarSenha =
                request.getNovaSenha() != null &&
                        !request.getNovaSenha().isBlank();


        if (querAlterarSenha) {

            if (
                    request.getSenhaAtual() == null ||
                            request.getSenhaAtual().isBlank()
            ) {

                throw new RuntimeException(
                        "Informe sua senha atual"
                );
            }


            boolean senhaCorreta =
                    passwordEncoder.matches(
                            request.getSenhaAtual(),
                            usuario.getSenha()
                    );


            if (!senhaCorreta) {

                throw new RuntimeException(
                        "Senha atual incorreta"
                );
            }


            if (
                    request.getNovaSenha()
                            .length() < 8
            ) {

                throw new RuntimeException(
                        "A nova senha deve ter pelo menos 8 caracteres"
                );
            }


            usuario.setSenha(
                    passwordEncoder.encode(
                            request.getNovaSenha()
                    )
            );

        }


        // ========================================================
        // SALVAR
        // ========================================================

        usuarioRepository.save(
                usuario
        );


        clienteRepository.save(
                cliente
        );


        return converterParaResponse(
                cliente
        );
    }


    // ============================================================
    // CLIENTE - EXCLUIR PRÓPRIA CONTA
    // ============================================================

    @Transactional
    public void excluirMinhaConta(
            String emailUsuarioLogado
    ) {

        Cliente cliente =
                clienteRepository
                        .findByUsuarioEmail(
                                emailUsuarioLogado
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Cliente não encontrado"
                                )
                        );


        Usuario usuario =
                cliente.getUsuario();


        // Primeiro remove os agendamentos,
        // pois eles possuem referência para o cliente.
        agendamentoRepository
                .deleteByCliente_Id(
                        cliente.getId()
                );


        // Depois remove o cliente.
        clienteRepository.delete(
                cliente
        );


        // Por último remove o usuário/login.
        usuarioRepository.delete(
                usuario
        );
    }


    // ============================================================
    // CONVERTER CLIENTE PARA DTO
    // ============================================================

    private PerfilClienteResponse converterParaResponse(
            Cliente cliente
    ) {

        return new PerfilClienteResponse(
                cliente.getId(),
                cliente.getNome(),
                cliente.getUsuario().getEmail(),
                cliente.getTelefone()
        );
    }
}