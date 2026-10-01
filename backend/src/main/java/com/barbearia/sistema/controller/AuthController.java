package com.barbearia.sistema.controller;

import com.barbearia.sistema.dto.BarbeiroResponse;
import com.barbearia.sistema.dto.ClienteResponse;
import com.barbearia.sistema.dto.EsqueciSenhaRequest;
import com.barbearia.sistema.dto.LoginRequest;
import com.barbearia.sistema.dto.LoginResponse;
import com.barbearia.sistema.dto.RedefinirSenhaRequest;
import com.barbearia.sistema.dto.RegistroBarbeiroRequest;
import com.barbearia.sistema.dto.RegistroClienteRequest;
import com.barbearia.sistema.dto.UsuarioResponse;

import com.barbearia.sistema.model.Barbeiro;
import com.barbearia.sistema.model.Cliente;

import com.barbearia.sistema.repository.UsuarioRepository;

import com.barbearia.sistema.service.AuthService;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.security.access.prepost.PreAuthorize;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @Autowired
    private UsuarioRepository usuarioRepository;


    // ============================================================
    // DONO - LISTAR USUÁRIOS
    // ============================================================

    @PreAuthorize("hasRole('DONO')")
    @GetMapping("/usuarios")
    public List<UsuarioResponse> listarUsuarios() {

        return usuarioRepository
                .findAll()
                .stream()
                .map(UsuarioResponse::from)
                .toList();
    }


    // ============================================================
    // CADASTRO PÚBLICO DE CLIENTE
    // ============================================================

    @PostMapping("/registro-cliente")
    public ClienteResponse registrarCliente(
            @RequestBody RegistroClienteRequest request
    ) {

        Cliente cliente =
                authService.registrarCliente(request);

        return ClienteResponse.from(cliente);
    }


    // ============================================================
    // DONO CADASTRA BARBEIRO
    // ============================================================

    @PreAuthorize("hasRole('DONO')")
    @PostMapping("/registro-barbeiro")
    public BarbeiroResponse registrarBarbeiro(
            @RequestBody RegistroBarbeiroRequest request
    ) {

        Barbeiro barbeiro =
                authService.registrarBarbeiro(request);

        return BarbeiroResponse.from(barbeiro);
    }


    // ============================================================
    // LOGIN
    // ============================================================

    @PostMapping("/login")
    public LoginResponse login(
            @RequestBody LoginRequest request,
            HttpServletResponse response
    ) {

        LoginResponse loginResponse =
                authService.login(request);

        // ========================================================
        // CRIA COOKIE COM O JWT
        // ========================================================

        Cookie cookie =
                new Cookie(
                        "jwt",
                        loginResponse.getToken()
                );

        cookie.setPath("/");

        cookie.setHttpOnly(true);

        cookie.setSecure(false);

        cookie.setMaxAge(24 * 60 * 60);

        response.addCookie(cookie);

        return loginResponse;
    }


    // ============================================================
    // LOGOUT
    // ============================================================

    @PostMapping("/logout")
    public String logout(
            HttpServletResponse response
    ) {

        Cookie cookie =
                new Cookie(
                        "jwt",
                        null
                );

        cookie.setPath("/");

        cookie.setHttpOnly(true);

        cookie.setSecure(false);

        cookie.setMaxAge(0);

        response.addCookie(cookie);

        return "Logout realizado com sucesso.";
    }


    // ============================================================
    // ESQUECI MINHA SENHA
    // ============================================================

    @PostMapping("/esqueci-senha")
    public String esqueciSenha(
            @RequestBody EsqueciSenhaRequest request
    ) {

        authService.solicitarRedefinicaoSenha(
                request.getEmail()
        );

        /*
         * Não informamos se o e-mail existe
         * ou não no sistema.
         *
         * Isso evita que alguém use essa rota
         * para descobrir quais e-mails possuem
         * cadastro.
         */

        return "Se o e-mail estiver cadastrado, " +
                "você receberá as instruções para " +
                "redefinir sua senha.";
    }


    // ============================================================
    // REDEFINIR SENHA
    // ============================================================

    @PostMapping("/redefinir-senha")
    public String redefinirSenha(
            @RequestBody RedefinirSenhaRequest request
    ) {

        authService.redefinirSenha(
                request.getToken(),
                request.getNovaSenha()
        );

        return "Senha redefinida com sucesso.";
    }
}