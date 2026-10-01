package com.barbearia.sistema.service;

import com.barbearia.sistema.dto.AtualizarPerfilBarbeiroRequest;
import com.barbearia.sistema.model.Barbeiro;
import com.barbearia.sistema.model.Role;
import com.barbearia.sistema.model.Usuario;
import com.barbearia.sistema.repository.BarbeiroRepository;
import com.barbearia.sistema.repository.UsuarioRepository;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BarbeiroService {

    @Autowired
    private BarbeiroRepository barbeiroRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;


    // ============================================================
    // LISTAR TODOS
    // ============================================================

    public List<Barbeiro> listarTodos() {
        return barbeiroRepository.findAll();
    }


    // ============================================================
    // SALVAR
    // ============================================================

    public Barbeiro salvar(Barbeiro barbeiro) {
        return barbeiroRepository.save(barbeiro);
    }


    // ============================================================
    // DELETAR
    // ============================================================

    @Transactional
    public void deletar(Long id) {

        Barbeiro barbeiro = barbeiroRepository
                .findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Barbeiro não encontrado"
                        )
                );

        Usuario usuario = barbeiro.getUsuario();

        if (
                usuario != null &&
                        usuario.getRoles().contains(Role.DONO)
        ) {
            throw new RuntimeException(
                    "Não é possível excluir um barbeiro que também é dono."
            );
        }

        barbeiroRepository.delete(barbeiro);

        if (usuario != null) {
            usuarioRepository.delete(usuario);
        }
    }


    // ============================================================
    // ATUALIZAR
    // ============================================================

    public Barbeiro atualizar(
            Long id,
            Barbeiro atualizarBarbeiro
    ) {

        Barbeiro barbeiro =
                barbeiroRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Barbeiro não encontrado"
                                )
                        );

        barbeiro.setNome(
                atualizarBarbeiro.getNome()
        );

        barbeiro.setTelefone(
                atualizarBarbeiro.getTelefone()
        );

        barbeiro.setComissaoPercentual(
                atualizarBarbeiro.getComissaoPercentual()
        );

        return barbeiroRepository.save(
                barbeiro
        );
    }

    @Transactional
    public Barbeiro atualizarMeuPerfil(
            String emailLogado,
            AtualizarPerfilBarbeiroRequest request
    ) {

        Barbeiro barbeiro =
                barbeiroRepository
                        .findByUsuarioEmail(emailLogado)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Barbeiro não encontrado"
                                )
                        );

        Usuario usuario =
                barbeiro.getUsuario();


        // ============================================================
        // NOME
        // ============================================================

        if (
                request.getNome() != null &&
                        !request.getNome().isBlank()
        ) {

            barbeiro.setNome(
                    request.getNome().trim()
            );
        }


        // ============================================================
        // TELEFONE
        // ============================================================

        if (
                request.getTelefone() != null &&
                        !request.getTelefone().isBlank()
        ) {

            barbeiro.setTelefone(
                    request.getTelefone().trim()
            );
        }


        // ============================================================
        // EMAIL
        // ============================================================

        if (
                request.getEmail() != null &&
                        !request.getEmail().isBlank()
        ) {

            String novoEmail =
                    request
                            .getEmail()
                            .trim()
                            .toLowerCase();


            if (!novoEmail.equalsIgnoreCase(
                    usuario.getEmail()
            )) {

                usuarioRepository
                        .findByEmail(novoEmail)
                        .ifPresent(usuarioExistente -> {

                            throw new RuntimeException(
                                    "Este e-mail já está cadastrado"
                            );
                        });


                usuario.setEmail(
                        novoEmail
                );
            }
        }


        // ============================================================
        // ALTERAÇÃO DE SENHA
        // ============================================================

        if (
                request.getNovaSenha() != null &&
                        !request.getNovaSenha().isBlank()
        ) {

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
                    request.getNovaSenha().length() < 8
            ) {

                throw new RuntimeException(
                        "A nova senha deve possuir pelo menos 8 caracteres"
                );
            }


            usuario.setSenha(
                    passwordEncoder.encode(
                            request.getNovaSenha()
                    )
            );
        }


        usuarioRepository.save(
                usuario
        );


        return barbeiroRepository.save(
                barbeiro
        );
    }


    // ============================================================
    // BUSCAR BARBEIRO LOGADO
    // ============================================================

    public Barbeiro buscarBarbeiroLogado(
            String email
    ) {

        return barbeiroRepository
                .findByUsuarioEmail(email)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Barbeiro não encontrado"
                        )
                );
    }
}