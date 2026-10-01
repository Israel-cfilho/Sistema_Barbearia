import {
  CalendarCheck,
  DollarSign,
  Scissors,
  Trophy,
  TrendingUp,
} from "lucide-react";

import DonoSidebar from "../../Components/DonoSidebar/DonoSidebar";

import { useEffect, useMemo, useState } from "react";

import "./donoDashboard.css";

function DonoDashboard() {
  const [rendaDia, setRendaDia] = useState(0);

  const [rendaMes, setRendaMes] = useState(0);

  const [rendaAno, setRendaAno] = useState(0);

  const [agendamentos, setAgendamentos] = useState([]);

  const [barbeiros, setBarbeiros] = useState([]);

  const [ranking, setRanking] = useState([]);

  const [servicosMaisVendidos, setServicosMaisVendidos] = useState([]);

  const [loading, setLoading] = useState(true);

  const [erro, setErro] = useState("");

  // ============================================================
  // FORMATAR DATA PARA A API
  // ============================================================

  function formatarDataApi(data) {
    return data.toISOString().split("T")[0];
  }

  // ============================================================
  // FORMATAR MOEDA
  // ============================================================

  function moeda(valor) {
    return Number(valor || 0).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  }

  // ============================================================
  // CARREGAR DASHBOARD
  // ============================================================

  useEffect(() => {
    async function carregarDashboard() {
      try {
        setLoading(true);
        setErro("");

        const hoje = new Date();

        const inicioMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1);

        const fimMes = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0);

        const inicio = formatarDataApi(inicioMes);

        const fim = formatarDataApi(fimMes);

        const [
          responseDia,
          responseMes,
          responseAno,
          responseAgendamentos,
          responseBarbeiros,
          responseRanking,
          responseServicos,
        ] = await Promise.all([
          fetch("http://localhost:8080/relatorios/renda/dia", {
            method: "GET",
            credentials: "include",
          }),

          fetch("http://localhost:8080/relatorios/renda/mes", {
            method: "GET",
            credentials: "include",
          }),

          fetch("http://localhost:8080/relatorios/renda/ano", {
            method: "GET",
            credentials: "include",
          }),

          fetch("http://localhost:8080/agendamentos", {
            method: "GET",
            credentials: "include",
          }),

          fetch("http://localhost:8080/barbeiros", {
            method: "GET",
            credentials: "include",
          }),

          fetch(
            `http://localhost:8080/relatorios/ranking-barbeiros?inicio=${inicio}&fim=${fim}`,
            {
              method: "GET",
              credentials: "include",
            },
          ),

          fetch(
            `http://localhost:8080/relatorios/servicos-mais-vendidos?inicio=${inicio}&fim=${fim}`,
            {
              method: "GET",
              credentials: "include",
            },
          ),
        ]);

        if (
          !responseDia.ok ||
          !responseMes.ok ||
          !responseAno.ok ||
          !responseAgendamentos.ok ||
          !responseBarbeiros.ok ||
          !responseRanking.ok ||
          !responseServicos.ok
        ) {
          throw new Error("Não foi possível carregar o dashboard");
        }

        const [
          dia,
          mes,
          ano,
          listaAgendamentos,
          listaBarbeiros,
          listaRanking,
          listaServicos,
        ] = await Promise.all([
          responseDia.json(),
          responseMes.json(),
          responseAno.json(),
          responseAgendamentos.json(),
          responseBarbeiros.json(),
          responseRanking.json(),
          responseServicos.json(),
        ]);

        setRendaDia(dia || 0);

        setRendaMes(mes || 0);

        setRendaAno(ano || 0);

        setAgendamentos(listaAgendamentos || []);

        setBarbeiros(listaBarbeiros || []);

        setRanking(listaRanking || []);

        setServicosMaisVendidos(listaServicos || []);
      } catch (error) {
        console.error(error);

        setErro(error.message || "Erro ao carregar dashboard");
      } finally {
        setLoading(false);
      }
    }

    carregarDashboard();
  }, []);

  // ============================================================
  // DATA DE HOJE
  // ============================================================

  const hojeString = new Date().toISOString().split("T")[0];

  // ============================================================
  // AGENDAMENTOS DE HOJE
  // ============================================================

  const agendamentosHoje = useMemo(() => {
    return agendamentos.filter(
      (agendamento) => agendamento.data === hojeString,
    );
  }, [agendamentos, hojeString]);

  // ============================================================
  // BARBEIRO DESTAQUE
  // ============================================================

  const barbeiroDestaque = ranking.length > 0 ? ranking[0] : null;

  const nomeBarbeiroDestaque = barbeiroDestaque
    ? barbeiros.find((barbeiro) => barbeiro.id === barbeiroDestaque.barbeiroId)
        ?.nome || "Barbeiro"
    : "Nenhum";

  // ============================================================
  // SERVIÇO DESTAQUE
  // ============================================================

  const servicoDestaque =
    servicosMaisVendidos.length > 0 ? servicosMaisVendidos[0] : null;

  // ============================================================
  // PRÓXIMOS AGENDAMENTOS
  // ============================================================

  const proximosAgendamentos = [...agendamentosHoje]
    .sort((a, b) => (a.horaInicio || "").localeCompare(b.horaInicio || ""))
    .slice(0, 5);

  // ============================================================
  // JSX
  // ============================================================

  return (
    <div className="dono-dashboard">
      <DonoSidebar />

      <main className="dono-dashboard-main">
        {/* HEADER */}

        <header className="dono-dashboard-header">
          <div>
            <span>PAINEL ADMINISTRATIVO</span>

            <h1>Dashboard</h1>

            <p>Visão geral da Barbearia Vila Branca.</p>
          </div>
        </header>

        {/* ERRO */}

        {erro && <div className="dono-dashboard-erro">{erro}</div>}

        {/* LOADING */}

        {loading ? (
          <div className="dono-loading">Carregando informações...</div>
        ) : (
          <>
            {/* CARDS */}

            <section className="dono-cards">
              {/* FATURAMENTO DO DIA */}

              <article className="dono-card">
                <div className="dono-card-icon">
                  <DollarSign size={20} />
                </div>

                <span>Faturamento hoje</span>

                <strong>{moeda(rendaDia)}</strong>
              </article>

              {/* FATURAMENTO DO MÊS */}

              <article className="dono-card">
                <div className="dono-card-icon">
                  <TrendingUp size={20} />
                </div>

                <span>Faturamento no mês</span>

                <strong>{moeda(rendaMes)}</strong>
              </article>

              {/* AGENDAMENTOS DE HOJE */}

              <article className="dono-card">
                <div className="dono-card-icon">
                  <CalendarCheck size={20} />
                </div>

                <span>Agendamentos hoje</span>

                <strong>{agendamentosHoje.length}</strong>
              </article>

              {/* FATURAMENTO DO ANO */}

              <article className="dono-card">
                <div className="dono-card-icon">
                  <DollarSign size={20} />
                </div>

                <span>Faturamento no ano</span>

                <strong>{moeda(rendaAno)}</strong>
              </article>
            </section>

            {/* DESTAQUES */}

            <section className="dono-destaques">
              {/* MELHOR BARBEIRO */}

              <article className="dono-destaque-card">
                <div className="dono-destaque-topo">
                  <div>
                    <span>DESTAQUE DO MÊS</span>

                    <h2>Melhor barbeiro</h2>
                  </div>

                  <Trophy size={23} />
                </div>

                <strong className="dono-destaque-nome">
                  {nomeBarbeiroDestaque}
                </strong>

                {barbeiroDestaque ? (
                  <div className="dono-destaque-info">
                    <p>
                      {barbeiroDestaque.quantidadeAtendimentos} atendimentos
                    </p>

                    <p>{moeda(barbeiroDestaque.renda)}</p>
                  </div>
                ) : (
                  <p className="dono-sem-dados">
                    Nenhum atendimento concluído neste mês.
                  </p>
                )}
              </article>

              {/* SERVIÇO MAIS VENDIDO */}

              <article className="dono-destaque-card">
                <div className="dono-destaque-topo">
                  <div>
                    <span>MAIS VENDIDO</span>

                    <h2>Serviço destaque</h2>
                  </div>

                  <Scissors size={23} />
                </div>

                <strong className="dono-destaque-nome">
                  {servicoDestaque ? servicoDestaque.servico : "Nenhum"}
                </strong>

                {servicoDestaque ? (
                  <div className="dono-destaque-info">
                    <p>{servicoDestaque.quantidadeVendida} vendas</p>

                    <p>{moeda(servicoDestaque.faturamento)}</p>
                  </div>
                ) : (
                  <p className="dono-sem-dados">
                    Nenhum serviço concluído neste mês.
                  </p>
                )}
              </article>
            </section>

            {/* AGENDAMENTOS DE HOJE */}

            <section className="dono-agendamentos-section">
              <div className="dono-section-header">
                <div>
                  <span>AGENDA</span>

                  <h2>Agendamentos de hoje</h2>
                </div>

                <button
                  onClick={() => (window.location.href = "/admin/agendamentos")}
                >
                  Ver todos
                </button>
              </div>

              {proximosAgendamentos.length === 0 ? (
                <div className="dono-vazio">Nenhum agendamento para hoje.</div>
              ) : (
                <div className="dono-agendamentos-lista">
                  {proximosAgendamentos.map((agendamento) => (
                    <article
                      key={agendamento.id}
                      className="dono-agendamento-item"
                    >
                      <div className="dono-agendamento-hora">
                        {agendamento.horaInicio?.slice(0, 5)}
                      </div>

                      <div className="dono-agendamento-info">
                        <strong>{agendamento.cliente?.nome}</strong>

                        <span>{agendamento.servico?.nome}</span>
                      </div>

                      <div className="dono-agendamento-barbeiro">
                        {agendamento.barbeiro?.nome}
                      </div>

                      <span
                        className={`dono-status status-${agendamento.status?.toLowerCase()}`}
                      >
                        {agendamento.status}
                      </span>
                    </article>
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </main>
    </div>
  );
}

export default DonoDashboard;
