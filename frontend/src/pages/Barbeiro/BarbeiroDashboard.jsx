import {
  CalendarDays,
  Clock3,
  DollarSign,
  Scissors,
  TrendingUp,
  WalletCards,
  ChevronRight,
} from "lucide-react";

import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import BarbeiroSidebar from "../../components/BarbeiroSidebar/BarbeiroSidebar";

import "./barbeiroDashboard.css";

function BarbeiroDashboard() {
  console.log("🔥 ENTROU NO BARBEIRO DASHBOARD");
  const navigate = useNavigate();

  // ============================================================
  // ESTADOS
  // ============================================================

  const [barbeiro, setBarbeiro] = useState(null);

  const [desempenho, setDesempenho] = useState({
    renda: 0,
    quantidadeAgendamento: 0,
  });

  const [agendamentos, setAgendamentos] = useState([]);

  const [loading, setLoading] = useState(true);

  // ============================================================
  // BUSCAR DADOS DO DASHBOARD
  // ============================================================

  useEffect(() => {
    async function carregarDashboard() {
      try {
        setLoading(true);

        // ========================================================
        // BARBEIRO LOGADO
        // ========================================================

        const responseBarbeiro = await fetch(
          "http://localhost:8080/barbeiros/me",
          {
            credentials: "include",
          },
        );

        if (!responseBarbeiro.ok) {
          throw new Error("Erro ao buscar barbeiro");
        }

        const dadosBarbeiro = await responseBarbeiro.json();

        setBarbeiro(dadosBarbeiro);

        // ========================================================
        // DESEMPENHO DO MÊS
        // ========================================================

        const responseDesempenho = await fetch(
          "http://localhost:8080/relatorios/meu-desempenho/mes",
          {
            credentials: "include",
          },
        );

        if (!responseDesempenho.ok) {
          throw new Error("Erro ao buscar desempenho");
        }

        const dadosDesempenho = await responseDesempenho.json();

        setDesempenho(dadosDesempenho);

        // ========================================================
        // AGENDAMENTOS DO BARBEIRO
        // ========================================================

        const responseAgendamentos = await fetch(
          "http://localhost:8080/agendamentos/meus",
          {
            credentials: "include",
          },
        );

        if (!responseAgendamentos.ok) {
          throw new Error("Erro ao buscar agendamentos");
        }

        const dadosAgendamentos = await responseAgendamentos.json();

        setAgendamentos(dadosAgendamentos);
      } catch (error) {
        console.error("Erro ao carregar dashboard:", error);
      } finally {
        setLoading(false);
      }
    }

    carregarDashboard();
  }, [navigate]);

  // ============================================================
  // DATA DE HOJE
  // ============================================================

  function obterDataHoje() {
    const hoje = new Date();

    const ano = hoje.getFullYear();

    const mes = String(hoje.getMonth() + 1).padStart(2, "0");

    const dia = String(hoje.getDate()).padStart(2, "0");

    return `${ano}-${mes}-${dia}`;
  }

  const hoje = obterDataHoje();

  // ============================================================
  // AGENDAMENTOS DE HOJE
  // ============================================================

  const agendamentosHoje = agendamentos.filter((agendamento) => {
    return agendamento.data === hoje && agendamento.status !== "CANCELADO";
  });

  // ============================================================
  // PRÓXIMOS ATENDIMENTOS
  // ============================================================

  const proximosAtendimentos = [...agendamentosHoje]

    .filter((agendamento) => agendamento.status !== "CONCLUÍDO")

    .sort((a, b) => a.horaInicio.localeCompare(b.horaInicio))

    .slice(0, 5);

  // ============================================================
  // COMISSÃO
  // ============================================================

  const percentualComissao = Number(barbeiro?.comissaoPercentual || 0);

  const faturamentoMes = Number(desempenho.renda || 0);

  const comissaoMes = faturamentoMes * (percentualComissao / 100);

  // ============================================================
  // FORMATAR DINHEIRO
  // ============================================================

  function formatarDinheiro(valor) {
    return Number(valor || 0).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  }

  // ============================================================
  // FORMATAR HORÁRIO
  // ============================================================

  function formatarHorario(horario) {
    if (!horario) {
      return "--:--";
    }

    return horario.substring(0, 5);
  }

  // ============================================================
  // LOADING
  // ============================================================

  if (loading) {
    return (
      <div className="barbeiro-dashboard-page">
        <BarbeiroSidebar />

        <main className="barbeiro-dashboard-main">
          <div className="barbeiro-dashboard-loading">
            Carregando dashboard...
          </div>
        </main>
      </div>
    );
  }

  // ============================================================
  // JSX
  // ============================================================

  return (
    <div className="barbeiro-dashboard-page">
      <BarbeiroSidebar />

      <main className="barbeiro-dashboard-main">
        {/* ======================================================
            HEADER
        ====================================================== */}

        <header className="barbeiro-dashboard-header">
          <div>
            <span className="barbeiro-dashboard-label">PAINEL DO BARBEIRO</span>

            <h1>Olá, {barbeiro?.nome}</h1>

            <p>
              Aqui está o resumo do seu desempenho e dos seus próximos
              atendimentos.
            </p>
          </div>

          <div className="barbeiro-dashboard-perfil">
            <div>
              <strong>{barbeiro?.nome}</strong>

              <span>Barbeiro</span>
            </div>

            <div className="barbeiro-dashboard-avatar">
              {barbeiro?.nome?.charAt(0)?.toUpperCase()}
            </div>
          </div>
        </header>

        {/* ======================================================
            RESUMO
        ====================================================== */}

        <section className="barbeiro-resumo-grid">
          {/* ATENDIMENTOS HOJE */}

          <article className="barbeiro-resumo-card">
            <div className="barbeiro-resumo-icon">
              <CalendarDays size={21} />
            </div>

            <span>Atendimentos hoje</span>

            <strong>{agendamentosHoje.length}</strong>

            <small>Sua agenda de hoje</small>
          </article>

          {/* ATENDIMENTOS MÊS */}

          <article className="barbeiro-resumo-card">
            <div className="barbeiro-resumo-icon">
              <TrendingUp size={21} />
            </div>

            <span>Atendimentos no mês</span>

            <strong>{desempenho.quantidadeAgendamento || 0}</strong>

            <small>Atendimentos concluídos</small>
          </article>

          {/* FATURAMENTO */}

          <article className="barbeiro-resumo-card">
            <div className="barbeiro-resumo-icon">
              <DollarSign size={21} />
            </div>

            <span>Faturamento no mês</span>

            <strong className="valor-card">
              {formatarDinheiro(faturamentoMes)}
            </strong>

            <small>Valor gerado pelos seus atendimentos</small>
          </article>

          {/* COMISSÃO */}

          <article className="barbeiro-resumo-card">
            <div className="barbeiro-resumo-icon">
              <WalletCards size={21} />
            </div>

            <span>Minha comissão</span>

            <strong className="valor-card">
              {formatarDinheiro(comissaoMes)}
            </strong>

            <small>{percentualComissao}% de comissão</small>
          </article>
        </section>

        {/* ======================================================
            PRÓXIMOS ATENDIMENTOS
        ====================================================== */}

        <section className="proximos-atendimentos-card">
          <div className="proximos-atendimentos-header">
            <div>
              <CalendarDays size={21} />

              <div>
                <h2>Próximos atendimentos</h2>

                <p>Seus próximos clientes de hoje.</p>
              </div>
            </div>

            <button type="button" onClick={() => navigate("/barbeiro/agenda")}>
              Ver agenda completa
              <ChevronRight size={17} />
            </button>
          </div>

          <div className="proximos-atendimentos-lista">
            {proximosAtendimentos.length === 0 ? (
              <div className="sem-atendimentos-dashboard">
                <CalendarDays size={28} />

                <p>Nenhum atendimento pendente para hoje.</p>
              </div>
            ) : (
              proximosAtendimentos.map((atendimento) => (
                <article
                  key={atendimento.id}
                  className="atendimento-dashboard-item"
                >
                  {/* HORÁRIO */}

                  <div className="atendimento-horario">
                    <strong>{formatarHorario(atendimento.horaInicio)}</strong>

                    <span>Hoje</span>
                  </div>

                  {/* CLIENTE */}

                  <div className="atendimento-cliente">
                    <div className="cliente-avatar-dashboard">
                      {atendimento.cliente?.nome?.charAt(0)?.toUpperCase()}
                    </div>

                    <div>
                      <strong>{atendimento.cliente?.nome || "Cliente"}</strong>

                      <span>
                        {atendimento.cliente?.telefone || "Sem telefone"}
                      </span>
                    </div>
                  </div>

                  {/* SERVIÇO */}

                  <div className="atendimento-servico">
                    <div className="servico-icon-dashboard">
                      <Scissors size={17} />
                    </div>

                    <div>
                      <strong>{atendimento.servico?.nome || "Serviço"}</strong>

                      <span>
                        <Clock3 size={13} />
                        {atendimento.servico?.duracaoMinutos || 0} min
                      </span>
                    </div>
                  </div>

                  {/* STATUS */}

                  <span
                    className={`atendimento-status ${atendimento.status?.toLowerCase()}`}
                  >
                    {atendimento.status}
                  </span>

                  {/* DETALHES */}

                  <button
                    className="atendimento-detalhes-button"
                    type="button"
                    onClick={() => navigate("/barbeiro/atendimentos")}
                  >
                    <ChevronRight size={20} />
                  </button>
                </article>
              ))
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

export default BarbeiroDashboard;
