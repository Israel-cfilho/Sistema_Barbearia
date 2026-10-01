import { useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Phone,
  Scissors,
} from "lucide-react";

import BarbeiroSidebar from "../../components/BarbeiroSidebar/BarbeiroSidebar";

import "./barbeiroAgenda.css";

function BarbeiroAgenda() {
  const [agendamentos, setAgendamentos] = useState([]);
  const [loading, setLoading] = useState(true);

  const [dataSelecionada, setDataSelecionada] = useState(() => {
    const hoje = new Date();

    const ano = hoje.getFullYear();
    const mes = String(hoje.getMonth() + 1).padStart(2, "0");
    const dia = String(hoje.getDate()).padStart(2, "0");

    return `${ano}-${mes}-${dia}`;
  });

  useEffect(() => {
    async function buscarAgendamentos() {
      try {
        setLoading(true);

        const response = await fetch(
          "http://localhost:8080/agendamentos/meus",
          {
            method: "GET",
            credentials: "include",
          },
        );

        if (!response.ok) {
          throw new Error("Não foi possível buscar os agendamentos");
        }

        const dados = await response.json();

        setAgendamentos(dados);
      } catch (error) {
        console.error("Erro ao buscar agendamentos:", error);

        setAgendamentos([]);
      } finally {
        setLoading(false);
      }
    }

    buscarAgendamentos();
  }, []);

  const agendamentosDoDia = useMemo(() => {
    return agendamentos
      .filter((agendamento) => agendamento.data === dataSelecionada)
      .sort((a, b) => a.horaInicio.localeCompare(b.horaInicio));
  }, [agendamentos, dataSelecionada]);

  function alterarDia(quantidade) {
    const [ano, mes, dia] = dataSelecionada.split("-").map(Number);

    const novaData = new Date(ano, mes - 1, dia + quantidade);

    const novoAno = novaData.getFullYear();

    const novoMes = String(novaData.getMonth() + 1).padStart(2, "0");

    const novoDia = String(novaData.getDate()).padStart(2, "0");

    setDataSelecionada(`${novoAno}-${novoMes}-${novoDia}`);
  }

  function voltarParaHoje() {
    const hoje = new Date();

    const ano = hoje.getFullYear();

    const mes = String(hoje.getMonth() + 1).padStart(2, "0");

    const dia = String(hoje.getDate()).padStart(2, "0");

    setDataSelecionada(`${ano}-${mes}-${dia}`);
  }

  function formatarData(data) {
    const [ano, mes, dia] = data.split("-");

    return `${dia}/${mes}/${ano}`;
  }

  function obterDiaSemana(data) {
    const [ano, mes, dia] = data.split("-").map(Number);

    const dataObjeto = new Date(ano, mes - 1, dia);

    const diasSemana = [
      "Domingo",
      "Segunda-feira",
      "Terça-feira",
      "Quarta-feira",
      "Quinta-feira",
      "Sexta-feira",
      "Sábado",
    ];

    return diasSemana[dataObjeto.getDay()];
  }

  function formatarHorario(horario) {
    if (!horario) {
      return "--:--";
    }

    return horario.substring(0, 5);
  }

  function obterInicial(nome) {
    if (!nome) {
      return "?";
    }

    return nome.trim().charAt(0).toUpperCase();
  }

  return (
    <div className="barbeiro-agenda-page">
      <BarbeiroSidebar />

      <main className="barbeiro-agenda-main">
        <header className="barbeiro-agenda-header">
          <div>
            <span className="barbeiro-agenda-label">MINHA AGENDA</span>

            <h1>Seus horários</h1>

            <p>Consulte seus atendimentos organizados por dia.</p>
          </div>
        </header>

        <section className="agenda-controle-data">
          <button
            type="button"
            className="agenda-seta"
            onClick={() => alterarDia(-1)}
          >
            <ChevronLeft size={20} />
          </button>

          <div className="agenda-data-centro">
            <CalendarDays size={20} />

            <div>
              <strong>{obterDiaSemana(dataSelecionada)}</strong>

              <span>{formatarData(dataSelecionada)}</span>
            </div>
          </div>

          <button
            type="button"
            className="agenda-seta"
            onClick={() => alterarDia(1)}
          >
            <ChevronRight size={20} />
          </button>

          <button
            type="button"
            className="agenda-hoje-button"
            onClick={voltarParaHoje}
          >
            Hoje
          </button>
        </section>

        <section className="agenda-resumo">
          <div>
            <span>Atendimentos</span>

            <strong>{agendamentosDoDia.length}</strong>
          </div>

          <div>
            <span>Pendentes</span>

            <strong>
              {
                agendamentosDoDia.filter(
                  (agendamento) => agendamento.status === "PENDENTE",
                ).length
              }
            </strong>
          </div>

          <div>
            <span>Confirmados</span>

            <strong>
              {
                agendamentosDoDia.filter(
                  (agendamento) => agendamento.status === "CONFIRMADO",
                ).length
              }
            </strong>
          </div>

          <div>
            <span>Concluídos</span>

            <strong>
              {
                agendamentosDoDia.filter(
                  (agendamento) =>
                    agendamento.status === "CONCLUÍDO" ||
                    agendamento.status === "CONCLUIDO",
                ).length
              }
            </strong>
          </div>
        </section>

        <section className="agenda-lista-card">
          <div className="agenda-lista-header">
            <div>
              <Clock3 size={19} />

              <div>
                <h2>Agenda do dia</h2>

                <p>{formatarData(dataSelecionada)}</p>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="agenda-loading">Carregando agenda...</div>
          ) : agendamentosDoDia.length === 0 ? (
            <div className="agenda-vazia">
              <CalendarDays size={38} />

              <strong>Nenhum atendimento</strong>

              <p>Você não possui agendamentos para esta data.</p>
            </div>
          ) : (
            <div className="agenda-lista">
              {agendamentosDoDia.map((agendamento) => (
                <article key={agendamento.id} className="agenda-item">
                  <div className="agenda-item-horario">
                    <strong>{formatarHorario(agendamento.horaInicio)}</strong>

                    <span>{agendamento.servico?.duracaoMinutos} min</span>
                  </div>

                  <div className="agenda-item-cliente">
                    <div className="agenda-cliente-avatar">
                      {obterInicial(agendamento.cliente?.nome)}
                    </div>

                    <div>
                      <span className="agenda-item-label">CLIENTE</span>

                      <strong>{agendamento.cliente?.nome}</strong>

                      <span className="agenda-item-info">
                        <Phone size={12} />

                        {agendamento.cliente?.telefone}
                      </span>
                    </div>
                  </div>

                  <div className="agenda-item-servico">
                    <div className="agenda-servico-icon">
                      <Scissors size={17} />
                    </div>

                    <div>
                      <span className="agenda-item-label">SERVIÇO</span>

                      <strong>{agendamento.servico?.nome}</strong>
                    </div>
                  </div>

                  <span
                    className={`agenda-status ${agendamento.status?.toLowerCase()}`}
                  >
                    {agendamento.status}
                  </span>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default BarbeiroAgenda;
