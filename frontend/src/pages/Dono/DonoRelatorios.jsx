import {
  CalendarDays,
  Crown,
  DollarSign,
  Medal,
  RefreshCw,
  Scissors,
  TrendingUp,
  Trophy,
  Users,
} from "lucide-react";

import { useEffect, useState } from "react";

import DonoSidebar from "../../Components/DonoSidebar/DonoSidebar";

import "./donoRelatorios.css";

function DonoRelatorios() {
  const [rendaDia, setRendaDia] = useState(0);
  const [rendaMes, setRendaMes] = useState(0);
  const [rendaAno, setRendaAno] = useState(0);

  const [ranking, setRanking] = useState([]);
  const [servicos, setServicos] = useState([]);
  const [barbeiros, setBarbeiros] = useState([]);

  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");

  const hoje = new Date();

  const primeiroDiaMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1);

  const ultimoDiaMes = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0);

  const [inicio, setInicio] = useState(formatarDataLocal(primeiroDiaMes));

  const [fim, setFim] = useState(formatarDataLocal(ultimoDiaMes));

  // ============================================================
  // FORMATAR DATA LOCAL
  // ============================================================

  function formatarDataLocal(data) {
    const ano = data.getFullYear();

    const mes = String(data.getMonth() + 1).padStart(2, "0");

    const dia = String(data.getDate()).padStart(2, "0");

    return `${ano}-${mes}-${dia}`;
  }

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
  // EXTRAIR VALOR DA RENDA
  // ============================================================

  function extrairValorRenda(data) {
    if (typeof data === "number") {
      return data;
    }

    if (data == null) {
      return 0;
    }

    return data.renda ?? data.faturamento ?? data.total ?? data.valor ?? 0;
  }

  // ============================================================
  // CARREGAR RESUMO
  // ============================================================

  async function carregarResumo() {
    const [responseDia, responseMes, responseAno] = await Promise.all([
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
    ]);

    if (!responseDia.ok || !responseMes.ok || !responseAno.ok) {
      throw new Error("Não foi possível carregar o faturamento.");
    }

    const [dia, mes, ano] = await Promise.all([
      responseDia.json(),
      responseMes.json(),
      responseAno.json(),
    ]);

    setRendaDia(extrairValorRenda(dia));

    setRendaMes(extrairValorRenda(mes));

    setRendaAno(extrairValorRenda(ano));
  }

  // ============================================================
  // CARREGAR BARBEIROS
  // ============================================================

  async function carregarBarbeiros() {
    const response = await fetch("http://localhost:8080/barbeiros", {
      method: "GET",
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Não foi possível carregar os barbeiros.");
    }

    const data = await response.json();

    setBarbeiros(data || []);
  }

  // ============================================================
  // CARREGAR RELATÓRIOS DO PERÍODO
  // ============================================================

  async function carregarRelatoriosPeriodo() {
    if (!inicio || !fim) {
      return;
    }

    if (inicio > fim) {
      setErro("A data inicial não pode ser maior que a data final.");

      return;
    }

    try {
      setLoading(true);
      setErro("");

      const [responseRanking, responseServicos] = await Promise.all([
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

      if (!responseRanking.ok) {
        throw new Error("Não foi possível carregar o ranking dos barbeiros.");
      }

      if (!responseServicos.ok) {
        throw new Error("Não foi possível carregar os serviços mais vendidos.");
      }

      const [dataRanking, dataServicos] = await Promise.all([
        responseRanking.json(),
        responseServicos.json(),
      ]);

      setRanking(dataRanking || []);

      setServicos(dataServicos || []);
    } catch (error) {
      console.error(error);

      setErro(error.message);
    } finally {
      setLoading(false);
    }
  }

  // ============================================================
  // CARREGAR TUDO
  // ============================================================

  async function carregarTudo() {
    try {
      setLoading(true);
      setErro("");

      await Promise.all([carregarResumo(), carregarBarbeiros()]);

      await carregarRelatoriosPeriodo();
    } catch (error) {
      console.error(error);

      setErro(error.message);

      setLoading(false);
    }
  }

  useEffect(() => {
    carregarTudo();
  }, []);

  // ============================================================
  // NOME DO BARBEIRO
  // ============================================================

  function nomeBarbeiro(id) {
    const barbeiro = barbeiros.find((item) => Number(item.id) === Number(id));

    return barbeiro?.nome || `Barbeiro #${id}`;
  }

  // ============================================================
  // TOTAL DE ATENDIMENTOS
  // ============================================================

  function totalAtendimentos() {
    return ranking.reduce(
      (total, item) => total + Number(item.quantidadeAtendimentos || 0),
      0,
    );
  }

  // ============================================================
  // FATURAMENTO DO PERÍODO
  // ============================================================

  function faturamentoPeriodo() {
    return ranking.reduce((total, item) => total + Number(item.renda || 0), 0);
  }

  // ============================================================
  // ÍCONE DA POSIÇÃO
  // ============================================================

  function iconePosicao(posicao) {
    if (posicao === 1) {
      return <Crown size={17} />;
    }

    if (posicao === 2) {
      return <Medal size={17} />;
    }

    if (posicao === 3) {
      return <Medal size={17} />;
    }

    return <span className="dono-rel-numero">{posicao}</span>;
  }

  // ============================================================
  // JSX
  // ============================================================

  return (
    <div className="dono-rel-page">
      <DonoSidebar />

      <main className="dono-rel-main">
        {/* HEADER */}

        <header className="dono-rel-header">
          <div>
            <span>DESEMPENHO VILA BRANCA</span>

            <h1>Relatórios</h1>

            <p>Acompanhe o faturamento e o desempenho da barbearia.</p>
          </div>

          <button
            className="dono-rel-atualizar"
            onClick={carregarTudo}
            disabled={loading}
          >
            <RefreshCw size={16} className={loading ? "girando" : ""} />
            Atualizar
          </button>
        </header>

        {/* ERRO */}

        {erro && <div className="dono-rel-alert">{erro}</div>}

        {/* RESUMO */}

        <section className="dono-rel-resumo">
          <article className="dono-rel-resumo-card">
            <div className="dono-rel-resumo-icon">
              <DollarSign size={19} />
            </div>

            <div>
              <span>FATURAMENTO HOJE</span>

              <strong>{formatarDinheiro(rendaDia)}</strong>
            </div>
          </article>

          <article className="dono-rel-resumo-card">
            <div className="dono-rel-resumo-icon">
              <TrendingUp size={19} />
            </div>

            <div>
              <span>FATURAMENTO NO MÊS</span>

              <strong>{formatarDinheiro(rendaMes)}</strong>
            </div>
          </article>

          <article className="dono-rel-resumo-card">
            <div className="dono-rel-resumo-icon">
              <CalendarDays size={19} />
            </div>

            <div>
              <span>FATURAMENTO NO ANO</span>

              <strong>{formatarDinheiro(rendaAno)}</strong>
            </div>
          </article>
        </section>

        {/* PERÍODO */}

        <section className="dono-rel-periodo">
          <div className="dono-rel-periodo-titulo">
            <div>
              <CalendarDays size={18} />

              <div>
                <h2>Período de análise</h2>

                <p>Escolha as datas para os relatórios abaixo.</p>
              </div>
            </div>
          </div>

          <div className="dono-rel-filtros">
            <div className="dono-rel-campo">
              <label>DATA INICIAL</label>

              <input
                type="date"
                value={inicio}
                onChange={(event) => setInicio(event.target.value)}
              />
            </div>

            <div className="dono-rel-campo">
              <label>DATA FINAL</label>

              <input
                type="date"
                value={fim}
                onChange={(event) => setFim(event.target.value)}
              />
            </div>

            <button
              onClick={carregarRelatoriosPeriodo}
              disabled={loading}
              className="dono-rel-aplicar"
            >
              Gerar relatório
            </button>
          </div>
        </section>

        {/* RESUMO DO PERÍODO */}

        <section className="dono-rel-periodo-resumo">
          <article>
            <Users size={18} />

            <div>
              <span>ATENDIMENTOS NO PERÍODO</span>

              <strong>{totalAtendimentos()}</strong>
            </div>
          </article>

          <article>
            <DollarSign size={18} />

            <div>
              <span>FATURAMENTO NO PERÍODO</span>

              <strong>{formatarDinheiro(faturamentoPeriodo())}</strong>
            </div>
          </article>

          <article>
            <Trophy size={18} />

            <div>
              <span>MELHOR BARBEIRO</span>

              <strong>
                {ranking.length > 0 ? nomeBarbeiro(ranking[0].barbeiroId) : "-"}
              </strong>
            </div>
          </article>
        </section>

        {/* CONTEÚDO */}

        {loading ? (
          <div className="dono-rel-loading">Carregando relatórios...</div>
        ) : (
          <div className="dono-rel-conteudo">
            {/* RANKING */}

            <section className="dono-rel-bloco">
              <div className="dono-rel-bloco-header">
                <div>
                  <Trophy size={18} />

                  <div>
                    <h2>Ranking de barbeiros</h2>

                    <p>Desempenho no período selecionado</p>
                  </div>
                </div>
              </div>

              {ranking.length === 0 ? (
                <div className="dono-rel-vazio">
                  Nenhum atendimento encontrado nesse período.
                </div>
              ) : (
                <div className="dono-rel-tabela-wrapper">
                  <table className="dono-rel-tabela">
                    <thead>
                      <tr>
                        <th>POSIÇÃO</th>

                        <th>BARBEIRO</th>

                        <th>ATENDIMENTOS</th>

                        <th>FATURAMENTO</th>
                      </tr>
                    </thead>

                    <tbody>
                      {ranking.map((item) => (
                        <tr key={item.barbeiroId}>
                          <td>
                            <div
                              className={`dono-rel-posicao posicao-${item.posicao}`}
                            >
                              {iconePosicao(item.posicao)}
                            </div>
                          </td>

                          <td>
                            <strong>{nomeBarbeiro(item.barbeiroId)}</strong>
                          </td>

                          <td>{item.quantidadeAtendimentos}</td>

                          <td>
                            <strong className="dono-rel-dinheiro">
                              {formatarDinheiro(item.renda)}
                            </strong>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>

            {/* SERVIÇOS */}

            <section className="dono-rel-bloco">
              <div className="dono-rel-bloco-header">
                <div>
                  <Scissors size={18} />

                  <div>
                    <h2>Serviços mais vendidos</h2>

                    <p>Serviços com maior saída no período</p>
                  </div>
                </div>
              </div>

              {servicos.length === 0 ? (
                <div className="dono-rel-vazio">
                  Nenhum serviço vendido nesse período.
                </div>
              ) : (
                <div className="dono-rel-servicos">
                  {servicos.map((servico) => (
                    <article
                      className="dono-rel-servico"
                      key={`${servico.posicao}-${servico.servico}`}
                    >
                      <div className="dono-rel-servico-posicao">
                        {servico.posicao}
                      </div>

                      <div className="dono-rel-servico-info">
                        <strong>{servico.servico}</strong>

                        <span>
                          {servico.quantidadeVendida}{" "}
                          {servico.quantidadeVendida === 1 ? "venda" : "vendas"}
                        </span>
                      </div>

                      <div className="dono-rel-servico-valor">
                        <span>FATURAMENTO</span>

                        <strong>{formatarDinheiro(servico.faturamento)}</strong>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </section>
          </div>
        )}
      </main>
    </div>
  );
}

export default DonoRelatorios;
