package com.barbearia.sistema.scheduler;

import com.barbearia.sistema.service.AgendamentoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class AgendamentoScheduler {

    @Autowired
    private AgendamentoService agendamentoService;

    @Scheduled(fixedRate = 60000)
    public void verificarConfirmacoes() {

        agendamentoService
                .cancelarAgendamentosSemConfirmacao();
    }
}