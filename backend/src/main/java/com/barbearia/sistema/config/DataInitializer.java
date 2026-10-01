package com.barbearia.sistema.config;

import com.barbearia.sistema.model.Barbeiro;
import com.barbearia.sistema.model.Dono;
import com.barbearia.sistema.model.Role;
import com.barbearia.sistema.model.Usuario;
import com.barbearia.sistema.repository.BarbeiroRepository;
import com.barbearia.sistema.repository.DonoRepository;
import com.barbearia.sistema.repository.UsuarioRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.HashSet;
import java.util.Set;

@Configuration
public class DataInitializer {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private DonoRepository donoRepository;

    @Autowired
    private BarbeiroRepository barbeiroRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Bean
    public CommandLineRunner criarDonoInicial() {

        return args -> {

            Usuario usuario =
                    usuarioRepository
                            .findByEmail("jefferson@barbearia.com")
                            .orElse(null);


            // =====================================================
            // SE O USUÁRIO DONO AINDA NÃO EXISTIR
            // =====================================================

            if (usuario == null) {

                usuario = new Usuario();

                usuario.setEmail(
                        "jefferson@barbearia.com"
                );

                usuario.setSenha(
                        passwordEncoder.encode(
                                "jefferson@2026"
                        )
                );

                usuario.getRoles().add(
                        Role.DONO
                );

                usuario.getRoles().add(
                        Role.BARBEIRO
                );

                usuarioRepository.save(
                        usuario
                );

                System.out.println(
                        "Usuário DONO criado"
                );
            }

            // =====================================================
            // GARANTE QUE TENHA AS DUAS ROLES
            // =====================================================

            boolean alterouRoles = false;

            if (
                    !usuario
                            .getRoles()
                            .contains(Role.DONO)
            ) {

                usuario.getRoles().add(
                        Role.DONO
                );

                alterouRoles = true;
            }

            if (
                    !usuario
                            .getRoles()
                            .contains(Role.BARBEIRO)
            ) {

                usuario.getRoles().add(
                        Role.BARBEIRO
                );

                alterouRoles = true;
            }

            if (alterouRoles) {
                usuarioRepository.save(
                        usuario
                );
            }

            // =====================================================
            // GARANTE REGISTRO NA TABELA DONOS
            // =====================================================

            Usuario usuarioFinal = usuario;

            boolean donoExiste =
                    donoRepository
                            .findAll()
                            .stream()
                            .anyMatch(dono ->
                                    dono
                                            .getUsuario()
                                            .getId()
                                            .equals(
                                                    usuarioFinal.getId()
                                            )
                            );

            if (!donoExiste) {

                Dono dono = new Dono();

                dono.setNome(
                        "Administrador"
                );

                dono.setUsuario(
                        usuario
                );

                donoRepository.save(
                        dono
                );

                System.out.println(
                        "Registro de DONO criado"
                );
            }

            // =====================================================
            // GARANTE REGISTRO NA TABELA BARBEIROS
            // =====================================================

            boolean barbeiroExiste =
                    barbeiroRepository
                            .findByUsuario_Id(
                                    usuario.getId()
                            )
                            .isPresent();

            if (!barbeiroExiste) {

                Barbeiro barbeiro =
                        new Barbeiro();

                barbeiro.setNome(
                        "Administrador"
                );

                barbeiro.setTelefone(
                        ""
                );

                barbeiro.setComissaoPercentual(
                        0.0
                );

                barbeiro.setUsuario(
                        usuario
                );

                barbeiroRepository.save(
                        barbeiro
                );

                System.out.println(
                        "Registro de BARBEIRO do dono criado"
                );
            }

            System.out.println(
                    "Dono configurado como DONO + BARBEIRO"
            );
        };
    }
}