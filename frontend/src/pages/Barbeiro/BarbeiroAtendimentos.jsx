import { useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  Phone,
  Scissors,
  XCircle,
} from "lucide-react";
import { toast } from "react-toastify";

import BarbeiroSidebar from "../../components/BarbeiroSidebar/BarbeiroSidebar";

import "./barbeiroAtendimento.css";

function BarbeiroAtendimentos() {
  const [agendamentos, setAgendamentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alterandoId, setAlterandoId] = useState(null);

  const [filtroStatus, setFiltroStatus] = useState("TODOS");

  useEffect(() => {
    buscarAgendamentos();
  }, []);

  async function buscarAgendamentos() {
    try {
      setLoading(true);

      const response = await fetch("http://localhost:8080/agendamentos/meus", {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Não foi possível buscar os atendimentos");
      }

      const dados = await response.json();

      setAgendamentos(dados);
    } catch (error) {
      console.error(error);

      toast.error("Erro ao carregar atendimentos");

      setAgendamentos([]);
    } finally {
      setLoading(false);
    }
  }

  async function atualizarStatus(id, novoStatus) {
    try {
      setAlterandoId(id);

      const response = await fetch(
        `http://localhost:8080/agendamentos/${id}/status`,
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",
          },

          credentials: "include",

          body: JSON.stringify({
            status: novoStatus,
          }),
        },
      );

      if (!response.ok) {
        const mensagem = await response.text();

        throw new Error(mensagem || "Não foi possível atualizar o atendimento");
      }

      const atualizado = await response.json();

      setAgendamentos((anteriores) =>
        anteriores.map((agendamento) =>
          agendamento.id === id ? atualizado : agendamento,
        ),
      );

      if (novoStatus === "CONFIRMADO") {
        toast.success("Atendimento confirmado");
      }

      if (novoStatus === "CONCLUÍDO") {
        toast.success("Atendimento concluído");
      }
    } catch (error) {
      console.error(error);

      toast.error(error.message || "Erro ao atualizar atendimento");
    } finally {
      setAlterandoId(null);
    }
  }

  async function cancelarAgendamento(id) {
    const confirmar = window.confirm(
      "Tem certeza que deseja cancelar este agendamento?",
    );

    if (!confirmar) {
      return;
    }

    try {
      setAlterandoId(id);

      const response = await fetch(
        `http://localhost:8080/agendamentos/${id}/cancelar-administrativo`,
        {
          method: "PUT",
          credentials: "include",
        },
      );

      if (!response.ok) {
        const mensagem = await response.text();

        throw new Error(mensagem || "Não foi possível cancelar o agendamento");
      }

      const atualizado = await response.json();

      setAgendamentos((anteriores) =>
        anteriores.map((agendamento) =>
          agendamento.id === id ? atualizado : agendamento,
        ),
      );

      toast.success("Agendamento cancelado com sucesso");
    } catch (error) {
      console.error(error);

      toast.error(error.message || "Erro ao cancelar agendamento");
    } finally {
      setAlterandoId(null);
    }
  }

  const atendimentosFiltrados = useMemo(() => {
    return [...agendamentos]
      .filter((agendamento) => {
        if (filtroStatus === "TODOS") {
          return true;
        }

        if (filtroStatus === "CONCLUIDO") {
          return (
            agendamento.status === "CONCLUÍDO" ||
            agendamento.status === "CONCLUIDO"
          );
        }

        if (filtroStatus === "CANCELADO") {
          return agendamento.status === "CANCELADO";
        }

        return agendamento.status === filtroStatus;
      })
      .sort((a, b) => {
        const dataA = `${a.data} ${a.horaInicio}`;

        const dataB = `${b.data} ${b.horaInicio}`;

        return dataB.localeCompare(dataA);
      });
  }, [agendamentos, filtroStatus]);

  function formatarData(data) {
    if (!data) {
      return "";
    }

    const [ano, mes, dia] = data.split("-");

    return `${dia}/${mes}/${ano}`;
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
    <div className="barbeiro-atendimentos-page">
      <BarbeiroSidebar />

      <main className="barbeiro-atendimentos-main">
        <header className="barbeiro-atendimentos-header">
          <div>
            <span className="barbeiro-atendimentos-label">ATENDIMENTOS</span>

            <h1>Seus atendimentos</h1>

            <p>Acompanhe e atualize o andamento dos seus clientes.</p>
          </div>
        </header>

        <section className="atendimentos-filtros">
          <button
            type="button"
            className={
              filtroStatus === "TODOS"
                ? "atendimento-filtro active"
                : "atendimento-filtro"
            }
            onClick={() => setFiltroStatus("TODOS")}
          >
            Todos
          </button>

          <button
            type="button"
            className={
              filtroStatus === "PENDENTE"
                ? "atendimento-filtro active"
                : "atendimento-filtro"
            }
            onClick={() => setFiltroStatus("PENDENTE")}
          >
            Pendentes
          </button>

          <button
            type="button"
            className={
              filtroStatus === "CONFIRMADO"
                ? "atendimento-filtro active"
                : "atendimento-filtro"
            }
            onClick={() => setFiltroStatus("CONFIRMADO")}
          >
            Confirmados
          </button>

          <button
            type="button"
            className={
              filtroStatus === "CONCLUIDO"
                ? "atendimento-filtro active"
                : "atendimento-filtro"
            }
            onClick={() => setFiltroStatus("CONCLUIDO")}
          >
            Concluídos
          </button>

          <button
            type="button"
            className={
              filtroStatus === "CANCELADO"
                ? "atendimento-filtro active"
                : "atendimento-filtro"
            }
            onClick={() => setFiltroStatus("CANCELADO")}
          >
            Cancelados
          </button>
        </section>

        <section className="atendimentos-card">
          <div className="atendimentos-card-header">
            <div>
              <Scissors size={20} />

              <div>
                <h2>Lista de atendimentos</h2>

                <p>{atendimentosFiltrados.length} atendimento(s)</p>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="atendimentos-loading">
              Carregando atendimentos...
            </div>
          ) : atendimentosFiltrados.length === 0 ? (
            <div className="atendimentos-vazio">
              <Scissors size={38} />

              <strong>Nenhum atendimento</strong>

              <p>Não existem atendimentos para este filtro.</p>
            </div>
          ) : (
            <div className="atendimentos-lista">
              {atendimentosFiltrados.map((agendamento) => {
                const pendente = agendamento.status === "PENDENTE";

                const confirmado = agendamento.status === "CONFIRMADO";

                const concluido =
                  agendamento.status === "CONCLUÍDO" ||
                  agendamento.status === "CONCLUIDO";

                const cancelado = agendamento.status === "CANCELADO";

                return (
                  <article
                    key={agendamento.id}
                    className="atendimento-card-item"
                  >
                    <div className="atendimento-topo">
                      <div className="atendimento-data-hora">
                        <div>
                          <CalendarDays size={16} />

                          <span>{formatarData(agendamento.data)}</span>
                        </div>

                        <div>
                          <Clock3 size={16} />

                          <strong>
                            {formatarHorario(agendamento.horaInicio)}
                          </strong>
                        </div>
                      </div>

                      <span
                        className={`atendimento-status ${agendamento.status?.toLowerCase()}`}
                      >
                        {agendamento.status}
                      </span>
                    </div>

                    <div className="atendimento-conteudo">
                      <div className="atendimento-cliente-area">
                        <div className="atendimento-avatar">
                          {obterInicial(agendamento.cliente?.nome)}
                        </div>

                        <div>
                          <span className="atendimento-mini-label">
                            CLIENTE
                          </span>

                          <strong>{agendamento.cliente?.nome}</strong>

                          <span className="atendimento-info-secundaria">
                            <Phone size={12} />

                            {agendamento.cliente?.telefone}
                          </span>
                        </div>
                      </div>

                      <div className="atendimento-servico-area">
                        <div className="atendimento-servico-icon">
                          <Scissors size={18} />
                        </div>

                        <div>
                          <span className="atendimento-mini-label">
                            SERVIÇO
                          </span>

                          <strong>{agendamento.servico?.nome}</strong>

                          <span className="atendimento-info-secundaria">
                            <Clock3 size={12} />
                            {agendamento.servico?.duracaoMinutos} min
                          </span>
                        </div>
                      </div>
                    </div>

                    {!cancelado && !concluido && (
                      <div className="atendimento-acoes">
                        {pendente && (
                          <button
                            type="button"
                            className="confirmar-atendimento-button"
                            disabled={alterandoId === agendamento.id}
                            onClick={() =>
                              atualizarStatus(agendamento.id, "CONFIRMADO")
                            }
                          >
                            <CheckCircle2 size={16} />

                            {alterandoId === agendamento.id
                              ? "Confirmando..."
                              : "Confirmar atendimento"}
                          </button>
                        )}

                        {confirmado && (
                          <button
                            type="button"
                            className="concluir-atendimento-button"
                            disabled={alterandoId === agendamento.id}
                            onClick={() =>
                              atualizarStatus(agendamento.id, "CONCLUÍDO")
                            }
                          >
                            <CheckCircle2 size={16} />

                            {alterandoId === agendamento.id
                              ? "Concluindo..."
                              : "Concluir atendimento"}
                          </button>
                        )}

                        <button
                          type="button"
                          className="cancelar-atendimento-button"
                          disabled={alterandoId === agendamento.id}
                          onClick={() => cancelarAgendamento(agendamento.id)}
                        >
                          <XCircle size={16} />

                          {alterandoId === agendamento.id
                            ? "Aguarde..."
                            : "Cancelar agendamento"}
                        </button>
                      </div>
                    )}
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default BarbeiroAtendimentos;
