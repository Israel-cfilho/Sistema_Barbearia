package com.barbearia.sistema.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void enviarEmailRecuperacao(
            String emailDestino,
            String token
    ) {

        String link =
                "http://localhost:5173/redefinir-senha?token="
                        + token;

        SimpleMailMessage mensagem =
                new SimpleMailMessage();

        mensagem.setTo(emailDestino);

        mensagem.setSubject(
                "Recuperação de senha - Barbearia Vila Branca"
        );

        mensagem.setText(
                "Olá!\n\n" +
                        "Recebemos uma solicitação para redefinir " +
                        "a senha da sua conta.\n\n" +
                        "Clique no link abaixo para criar uma nova senha:\n\n" +
                        link +
                        "\n\n" +
                        "Esse link é válido por 15 minutos.\n\n" +
                        "Se você não solicitou a recuperação de senha, " +
                        "ignore este e-mail.\n\n" +
                        "Barbearia Vila Branca"
        );

        mailSender.send(mensagem);
    }
}