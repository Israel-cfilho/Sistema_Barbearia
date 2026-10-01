package com.barbearia.sistema.service;

import com.barbearia.sistema.dto.LoginRequest;
import com.barbearia.sistema.dto.LoginResponse;
import com.barbearia.sistema.dto.RegistroBarbeiroRequest;
import com.barbearia.sistema.dto.RegistroClienteRequest;
import com.barbearia.sistema.model.Barbeiro;
import com.barbearia.sistema.model.Cliente;
import com.barbearia.sistema.model.PasswordResetToken;
import com.barbearia.sistema.model.Role;
import com.barbearia.sistema.model.Usuario;
import com.barbearia.sistema.repository.BarbeiroRepository;
import com.barbearia.sistema.repository.ClienteRepository;
import com.barbearia.sistema.repository.PasswordResetTokenRepository;
import com.barbearia.sistema.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class AuthService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private ClienteRepository clienteRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private BarbeiroRepository barbeiroRepository;

    @Autowired
    private PasswordResetTokenRepository passwordResetTokenRepository;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private EmailService emailService;

    // =========================================================
    // REGISTRAR CLIENTE
    // =========================================================

    public Cliente registrarCliente(
            RegistroClienteRequest request
    ) {

        if (
                usuarioRepository
                        .findByEmail(
                                request.getEmail()
                        )
                        .isPresent()
        ) {

            throw new RuntimeException(
                    "Email já cadastrado!"
            );
        }

        Usuario usuario = new Usuario();

        usuario.setEmail(
                request.getEmail()
        );

        usuario.setSenha(
                passwordEncoder.encode(
                        request.getSenha()
                )
        );

        usuario.getRoles().add(
                Role.CLIENTE
        );

        usuarioRepository.save(usuario);

        Cliente cliente = new Cliente();

        cliente.setNome(
                request.getNome()
        );

        cliente.setTelefone(
                request.getTelefone()
        );

        cliente.setUsuario(usuario);

        return clienteRepository.save(
                cliente
        );
    }

    // =========================================================
    // REGISTRAR BARBEIRO
    // =========================================================

    public Barbeiro registrarBarbeiro(
            RegistroBarbeiroRequest request
    ) {

        if (
                usuarioRepository
                        .findByEmail(
                                request.getEmail()
                        )
                        .isPresent()
        ) {

            throw new RuntimeException(
                    "Email já cadastrado!"
            );
        }

        Usuario usuario = new Usuario();

        usuario.setEmail(
                request.getEmail()
        );

        usuario.setSenha(
                passwordEncoder.encode(
                        request.getSenha()
                )
        );

        usuario.getRoles().add(
                Role.BARBEIRO
        );

        usuarioRepository.save(usuario);

        Barbeiro barbeiro = new Barbeiro();

        barbeiro.setNome(
                request.getNome()
        );

        barbeiro.setTelefone(
                request.getTelefone()
        );

        barbeiro.setComissaoPercentual(
                request.getComissaoPercentual()
        );

        barbeiro.setUsuario(usuario);

        return barbeiroRepository.save(
                barbeiro
        );
    }

    // =========================================================
    // LOGIN
    // =========================================================

    public LoginResponse login(
            LoginRequest request
    ) {

        Usuario usuario =
                usuarioRepository
                        .findByEmail(
                                request.getEmail()
                        )
                        .orElseThrow(
                                () ->
                                        new RuntimeException(
                                                "Email ou senha inválidos"
                                        )
                        );

        if (
                !passwordEncoder.matches(
                        request.getSenha(),
                        usuario.getSenha()
                )
        ) {

            throw new RuntimeException(
                    "Email ou senha inválidos"
            );
        }

        if (
                usuario.getRoles() == null
                        ||
                        usuario.getRoles().isEmpty()
        ) {

            throw new RuntimeException(
                    "Usuário não possui função cadastrada"
            );
        }

        String token =
                jwtService.gerarToken(
                        usuario.getEmail(),
                        usuario.getRoles()
                );

        String rolePrincipal =
                descobrirRolePrincipal(
                        usuario.getRoles()
                );

        Set<String> roles =
                usuario.getRoles()
                        .stream()
                        .map(Role::name)
                        .collect(
                                Collectors.toSet()
                        );

        return new LoginResponse(
                token,
                rolePrincipal,
                roles
        );
    }

    // =========================================================
    // ESQUECI MINHA SENHA
    // =========================================================

    @Transactional
    public void solicitarRedefinicaoSenha(
            String email
    ) {

        usuarioRepository
                .findByEmail(email)
                .ifPresent(usuario -> {

                    /*
                     * Remove qualquer token anterior
                     * desse usuário.
                     */
                    passwordResetTokenRepository
                            .deleteByUsuario(usuario);

                    SecureRandom secureRandom =
                            new SecureRandom();

                    byte[] bytes =
                            new byte[32];

                    secureRandom.nextBytes(bytes);

                    String token =
                            Base64
                                    .getUrlEncoder()
                                    .withoutPadding()
                                    .encodeToString(bytes);

                    LocalDateTime agora =
                            LocalDateTime.now();

                    PasswordResetToken passwordResetToken =
                            new PasswordResetToken();

                    passwordResetToken.setToken(
                            token
                    );

                    passwordResetToken.setUsuario(
                            usuario
                    );

                    passwordResetToken.setCriadoEm(
                            agora
                    );

                    passwordResetToken.setExpiraEm(
                            agora.plusMinutes(15)
                    );

                    passwordResetTokenRepository.save(
                            passwordResetToken
                    );

                    emailService.enviarEmailRecuperacao(
                            usuario.getEmail(),
                            token
                    );

                });
    }

    // =========================================================
    // REDEFINIR SENHA
    // =========================================================

    @Transactional
    public void redefinirSenha(
            String token,
            String novaSenha
    ) {

        if (
                token == null ||
                        token.isBlank()
        ) {

            throw new RuntimeException(
                    "Token de recuperação inválido."
            );
        }

        validarNovaSenha(
                novaSenha
        );

        PasswordResetToken passwordResetToken =
                passwordResetTokenRepository
                        .findByToken(token)
                        .orElseThrow(
                                () ->
                                        new RuntimeException(
                                                "Token de recuperação inválido."
                                        )
                        );

        if (
                passwordResetToken
                        .getExpiraEm()
                        .isBefore(
                                LocalDateTime.now()
                        )
        ) {

            passwordResetTokenRepository.delete(
                    passwordResetToken
            );

            throw new RuntimeException(
                    "Token de recuperação expirado."
            );
        }

        Usuario usuario =
                passwordResetToken.getUsuario();

        usuario.setSenha(
                passwordEncoder.encode(
                        novaSenha
                )
        );

        usuarioRepository.save(
                usuario
        );

        /*
         * O token só pode ser utilizado uma vez.
         */
        passwordResetTokenRepository.delete(
                passwordResetToken
        );
    }

    // =========================================================
    // VALIDAR NOVA SENHA
    // =========================================================

    private void validarNovaSenha(
            String senha
    ) {

        if (
                senha == null ||
                        senha.length() < 8
        ) {

            throw new RuntimeException(
                    "A senha deve possuir pelo menos 8 caracteres."
            );
        }

        if (!senha.matches(".*[A-Z].*")) {

            throw new RuntimeException(
                    "A senha deve possuir pelo menos uma letra maiúscula."
            );
        }

        if (!senha.matches(".*[a-z].*")) {

            throw new RuntimeException(
                    "A senha deve possuir pelo menos uma letra minúscula."
            );
        }

        if (!senha.matches(".*\\d.*")) {

            throw new RuntimeException(
                    "A senha deve possuir pelo menos um número."
            );
        }

        if (!senha.matches(".*[^a-zA-Z0-9].*")) {

            throw new RuntimeException(
                    "A senha deve possuir pelo menos um caractere especial."
            );
        }
    }

    // =========================================================
    // DESCOBRIR ROLE PRINCIPAL
    // =========================================================

    private String descobrirRolePrincipal(
            Set<Role> roles
    ) {

        /*
         * Prioridade:
         *
         * DONO
         * BARBEIRO
         * CLIENTE
         */

        if (roles.contains(Role.DONO)) {
            return Role.DONO.name();
        }

        if (roles.contains(Role.BARBEIRO)) {
            return Role.BARBEIRO.name();
        }

        if (roles.contains(Role.CLIENTE)) {
            return Role.CLIENTE.name();
        }

        throw new RuntimeException(
                "Usuário não possui função cadastrada"
        );
    }
}