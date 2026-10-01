package com.barbearia.sistema.controller;




import com.barbearia.sistema.service.AgendamentoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.ArrayList;


@RestController
@RequestMapping("/relatorios")
public class RelatorioController {

    @Autowired
    private AgendamentoService agendamentoService;

    @PreAuthorize("hasRole('DONO')")
    @GetMapping("/renda/dia")
    public double rendaDoDia() {
        LocalDate hoje = LocalDate.now();
        return agendamentoService.calcularRendaTotal(hoje, hoje);
    }

    @PreAuthorize("hasRole('DONO')")
    @GetMapping("/renda/mes")
    public double rendaDoMes() {
        LocalDate hoje = LocalDate.now();
        LocalDate inicio = hoje.withDayOfMonth(1);
        LocalDate fim = hoje.withDayOfMonth(hoje.lengthOfMonth());
        return agendamentoService.calcularRendaTotal(inicio, fim);
    }

    @PreAuthorize("hasRole('DONO')")
    @GetMapping("/renda/ano")
    public double rendaDoAno() {
        LocalDate hoje = LocalDate.now();
        LocalDate inicio = hoje.withDayOfYear(1);
        LocalDate fim = hoje.withDayOfYear(hoje.lengthOfYear());
        return agendamentoService.calcularRendaTotal(inicio, fim);
    }

    @PreAuthorize("hasRole('BARBEIRO')")
    @GetMapping("/meu-desempenho/mes")
    public Object meuDesempenhoMes(){
        Long barbeiroId = agendamentoService.descobrirIdDoBarbeiroLogado();

        LocalDate hoje = LocalDate.now();
        LocalDate inicio = hoje.withDayOfMonth(1);
        LocalDate fim = hoje.withDayOfMonth(hoje.lengthOfMonth());

        Double renda = agendamentoService.calcularRendaPorBarbeiro(barbeiroId, inicio, fim);
        Long quantidade = agendamentoService.contarAgendamentosPorBarbeiro(barbeiroId, inicio, fim);

        Map<String, Object> resultado = new HashMap<>();
        resultado.put("renda", renda);
        resultado.put("quantidadeAgendamento", quantidade);

        return resultado;
    }

    @PreAuthorize("hasRole('DONO')")
    @GetMapping("/barbeiro/{id}")
    public Object desempenhoDoBarbeiro(@PathVariable Long id, @RequestParam LocalDate inicio, @RequestParam LocalDate fim){

        Double renda = agendamentoService.calcularRendaPorBarbeiro(id,inicio,fim);

        Long quantidadeAtendimentos = agendamentoService.contarAgendamentosPorBarbeiro(id,inicio,fim);

        Map<String, Object> resultado = new HashMap<>();
        resultado.put("barbeiroId", id);
        resultado.put("renda", renda);
        resultado.put("quantidadeAtendimentos", quantidadeAtendimentos);

        return resultado;
    }

    @PreAuthorize("hasRole('DONO')")
    @GetMapping("/ranking-barbeiros")
    public List<Map<String, Object>> rankingBarbeiros(@RequestParam LocalDate inicio, @RequestParam LocalDate fim) {
        List<Object[]> ranking = agendamentoService.buscarRankingBarbeiros(inicio, fim);

        List<Map<String, Object>> resultado = new ArrayList<>();

        int posicao = 1;

        for(Object[] item : ranking){
            Map<String, Object> barbeiro = new HashMap<>();

            barbeiro.put("posicao", posicao);
            barbeiro.put("barbeiroId", item[0]);
            barbeiro.put("quantidadeAtendimentos", item[1]);
            barbeiro.put("renda", item[2]);

            resultado.add(barbeiro);

            posicao++;
        }

        return resultado;
    }

    @PreAuthorize("hasRole('DONO')")
    @GetMapping("/servicos-mais-vendidos")
    public List<Map<String, Object>> servicosMaisVendidos(@RequestParam LocalDate inicio, @RequestParam LocalDate fim) {

        List<Object[]> servicos = agendamentoService.buscarServicoMaisVendido(inicio, fim);

        List<Map<String, Object>> resultado = new ArrayList<>();

        int posicao = 1;

        for(Object[] item : servicos){
            Map<String, Object> servico = new HashMap<>();
            servico.put("posicao", posicao);
            servico.put("servico", item[0]);
            servico.put("quantidadeVendida",  item[1]);
            servico.put("faturamento",  item[2]);

            resultado.add(servico);
            posicao++;
        }
        return resultado;
    }
}
