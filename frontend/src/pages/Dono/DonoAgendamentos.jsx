import {
  CalendarDays,
  Search,
  UserRound,
  XCircle,
  CheckCircle2,
  WalletCards,
} from "lucide-react";

import { useEffect, useMemo, useState } from "react";

import DonoSidebar from "../../Components/DonoSidebar/DonoSidebar";

import "./DonoAgendamento.css";

function DonoAgendamentos() {
  const [agendamentos, setAgendamentos] = useState([]);
  const [barbeiros, setBarbeiros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");

  const [busca, setBusca] = useState("");
  const [dataFiltro, setDataFiltro] = useState("");
  const [barbeiroFiltro, setBarbeiroFiltro] = useState("");
  const [statusFiltro, setStatusFiltro] = useState("");

  // ============================================================
  // PAGAMENTO
  // ============================================================

  const [formasPagamento, setFormasPagamento] = useState({});

  const [salvandoPagamento, setSalvandoPagamento] = useState(null);

  // ============================================================
  // CARREGAR DADOS
  // ============================================================

  async function carregarDados() {
    try {
      setLoading(true);
      setErro("");

      const [responseAgendamentos, responseBarbeiros] = await Promise.all([
        fetch("http://localhost:8080/agendamentos", {
          method: "GET",
          credentials: "include",
        }),

        fetch("http://localhost:8080/barbeiros", {
          method: "GET",
          credentials: "include",
        }),
      ]);

      if (!responseAgendamentos.ok) {
        throw new Error("Erro ao carregar agendamentos");
      }

      if (!responseBarbeiros.ok) {
        throw new Error("Erro ao carregar barbeiros");
      }

      const dadosAgendamentos = await responseAgendamentos.json();

      const dadosBarbeiros = await responseBarbeiros.json();

      setAgendamentos(dadosAgendamentos || []);

      setBarbeiros(dadosBarbeiros || []);
    } catch (error) {
      console.error(error);

      setErro(error.message || "Erro ao carregar dados");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    carregarDados();
  }, []);

  // ============================================================
  // FORMATAR DATA
  // ============================================================

  function formatarData(data) {
    if (!data) {
      return "-";
    }

    const [ano, mes, dia] = data.split("-");

    return `${dia}/${mes}/${ano}`;
  }

  // ============================================================
  // FORMATAR HORA
  // ============================================================

  function formatarHora(hora) {
    if (!hora) {
      return "-";
    }

    return hora.slice(0, 5);
  }

  // ============================================================
  // FORMATAR FORMA DE PAGAMENTO
  // ============================================================

  function formatarFormaPagamento(forma) {
    if (!forma) {
      return "-";
    }

    switch (forma) {
      case "DEBITO":
        return "Débito";

      case "CREDITO":
        return "Crédito";

      case "PIX":
        return "PIX";

      case "DINHEIRO":
        return "Dinheiro";

      default:
        return forma;
    }
  }

  // ============================================================
  // ATUALIZAR STATUS
  // ============================================================

  async function atualizarStatus(agendamento, novoStatus) {
    try {
      const response = await fetch(
        `http://localhost:8080/agendamentos/${agendamento.id}/status`,
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

        throw new Error(mensagem || "Não foi possível atualizar o status");
      }

      await carregarDados();
    } catch (error) {
      console.error(error);

      alert(error.message || "Erro ao atualizar status");
    }
  }

  // ============================================================
  // CANCELAR AGENDAMENTO
  // ============================================================

  async function cancelarAgendamento(agendamento) {
    const confirmar = window.confirm(
      `Deseja realmente cancelar o agendamento de ${agendamento.cliente?.nome}?`,
    );

    if (!confirmar) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8080/agendamentos/${agendamento.id}/cancelar-administrativo`,
        {
          method: "PUT",
          credentials: "include",
        },
      );

      if (!response.ok) {
        const mensagem = await response.text();

        throw new Error(mensagem || "Não foi possível cancelar o agendamento");
      }

      await carregarDados();
    } catch (error) {
      console.error(error);

      alert(error.message || "Erro ao cancelar agendamento");
    }
  }

  // ============================================================
  // REGISTRAR PAGAMENTO
  // ============================================================

  async function registrarPagamento(agendamento) {
    const formaPagamento = formasPagamento[agendamento.id];

    if (!formaPagamento) {
      alert("Selecione uma forma de pagamento.");

      return;
    }

    try {
      setSalvandoPagamento(agendamento.id);

      const response = await fetch(
        `http://localhost:8080/agendamentos/${agendamento.id}/pagamento`,
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",
          },

          credentials: "include",

          body: JSON.stringify({
            formaPagamento: formaPagamento,
          }),
        },
      );

      if (!response.ok) {
        const mensagem = await response.text();

        throw new Error(mensagem || "Não foi possível registrar o pagamento");
      }

      // Limpa o select daquele agendamento
      setFormasPagamento((estadoAtual) => {
        const novoEstado = {
          ...estadoAtual,
        };

        delete novoEstado[agendamento.id];

        return novoEstado;
      });

      // Atualiza os dados da tela
      await carregarDados();
    } catch (error) {
      console.error(error);

      alert(error.message || "Erro ao registrar pagamento");
    } finally {
      setSalvandoPagamento(null);
    }
  }

  // ============================================================
  // FILTROS
  // ============================================================

  const agendamentosFiltrados = useMemo(() => {
    return agendamentos.filter((agendamento) => {
      const nomeCliente = agendamento.cliente?.nome?.toLowerCase() || "";

      const telefoneCliente =
        agendamento.cliente?.telefone?.toLowerCase() || "";

      const textoBusca = busca.trim().toLowerCase();

      const correspondeBusca =
        !textoBusca ||
        nomeCliente.includes(textoBusca) ||
        telefoneCliente.includes(textoBusca);

      const correspondeData = !dataFiltro || agendamento.data === dataFiltro;

      const correspondeBarbeiro =
        !barbeiroFiltro || String(agendamento.barbeiro?.id) === barbeiroFiltro;

      const correspondeStatus =
        !statusFiltro || agendamento.status === statusFiltro;

      return (
        correspondeBusca &&
        correspondeData &&
        correspondeBarbeiro &&
        correspondeStatus
      );
    });
  }, [agendamentos, busca, dataFiltro, barbeiroFiltro, statusFiltro]);

  // ============================================================
  // ORDENAÇÃO
  // ============================================================

  const agendamentosOrdenados = [...agendamentosFiltrados].sort((a, b) => {
    if (a.data !== b.data) {
      return a.data.localeCompare(b.data);
    }

    return (a.horaInicio || "").localeCompare(b.horaInicio || "");
  });

  // ============================================================
  // LIMPAR FILTROS
  // ============================================================

  function limparFiltros() {
    setBusca("");
    setDataFiltro("");
    setBarbeiroFiltro("");
    setStatusFiltro("");
  }

  // ============================================================
  // JSX
  // ============================================================

  return (
    <div className="dono-ag-page">
      <DonoSidebar />

      <main className="dono-ag-main">
        {/* HEADER */}

        <header className="dono-ag-header">
          <div>
            <span>GESTÃO DE AGENDAMENTOS</span>

            <h1>Agendamentos</h1>

            <p>Visualize e gerencie todos os atendimentos da barbearia.</p>
          </div>

          <div className="dono-ag-total">
            <CalendarDays size={18} />

            <div>
              <span>Total encontrado</span>

              <strong>{agendamentosFiltrados.length}</strong>
            </div>
          </div>
        </header>

        {/* ERRO */}

        {erro && <div className="dono-ag-erro">{erro}</div>}

        {/* FILTROS */}

        <section className="dono-ag-filtros">
          <div className="dono-ag-busca">
            <Search size={17} />

            <input
              type="text"
              placeholder="Buscar cliente..."
              value={busca}
              onChange={(event) => setBusca(event.target.value)}
            />
          </div>

          <input
            className="dono-ag-input"
            type="date"
            value={dataFiltro}
            onChange={(event) => setDataFiltro(event.target.value)}
          />

          <select
            className="dono-ag-input"
            value={barbeiroFiltro}
            onChange={(event) => setBarbeiroFiltro(event.target.value)}
          >
            <option value="">Todos os barbeiros</option>

            {barbeiros.map((barbeiro) => (
              <option key={barbeiro.id} value={barbeiro.id}>
                {barbeiro.nome}
              </option>
            ))}
          </select>

          <select
            className="dono-ag-input"
            value={statusFiltro}
            onChange={(event) => setStatusFiltro(event.target.value)}
          >
            <option value="">Todos os status</option>

            <option value="PENDENTE">Pendente</option>

            <option value="CONFIRMADO">Confirmado</option>

            <option value="CONCLUÍDO">Concluído</option>

            <option value="CANCELADO">Cancelado</option>
          </select>

          <button className="dono-ag-limpar" onClick={limparFiltros}>
            Limpar
          </button>
        </section>

        {/* CONTEÚDO */}

        {loading ? (
          <div className="dono-ag-loading">Carregando agendamentos...</div>
        ) : agendamentosOrdenados.length === 0 ? (
          <div className="dono-ag-vazio">
            <CalendarDays size={35} />

            <h2>Nenhum agendamento encontrado</h2>

            <p>Altere os filtros para visualizar outros agendamentos.</p>
          </div>
        ) : (
          <section className="dono-ag-lista">
            {agendamentosOrdenados.map((agendamento) => (
              <article key={agendamento.id} className="dono-ag-card">
                {/* DATA */}

                <div className="dono-ag-data">
                  <strong>{formatarHora(agendamento.horaInicio)}</strong>

                  <span>{formatarData(agendamento.data)}</span>
                </div>

                {/* DADOS */}

                <div className="dono-ag-dados">
                  <div className="dono-ag-cliente">
                    <div className="dono-ag-icon">
                      <UserRound size={17} />
                    </div>

                    <div>
                      <span>CLIENTE</span>

                      <strong>{agendamento.cliente?.nome}</strong>
                    </div>
                  </div>

                  <div className="dono-ag-info-item">
                    <span>SERVIÇO</span>

                    <strong>{agendamento.servico?.nome}</strong>
                  </div>

                  <div className="dono-ag-info-item">
                    <span>BARBEIRO</span>

                    <strong>{agendamento.barbeiro?.nome}</strong>
                  </div>
                </div>

                {/* AÇÕES */}

                <div className="dono-ag-acoes">
                  {/* STATUS */}

                  <span
                    className={`dono-ag-status dono-ag-status-${agendamento.status
                      ?.normalize("NFD")
                      .replace(/[\u0300-\u036f]/g, "")
                      .toLowerCase()}`}
                  >
                    {agendamento.status}
                  </span>

                  {/* CONFIRMAR */}

                  {agendamento.status === "PENDENTE" && (
                    <button
                      className="dono-ag-btn dono-ag-confirmar"
                      onClick={() => atualizarStatus(agendamento, "CONFIRMADO")}
                    >
                      <CheckCircle2 size={15} />
                      Confirmar
                    </button>
                  )}

                  {/* CONCLUIR */}

                  {agendamento.status === "CONFIRMADO" && (
                    <button
                      className="dono-ag-btn dono-ag-concluir"
                      onClick={() => atualizarStatus(agendamento, "CONCLUÍDO")}
                    >
                      <CheckCircle2 size={15} />
                      Concluir
                    </button>
                  )}

                  {/* CANCELAR */}

                  {agendamento.status !== "CANCELADO" &&
                    agendamento.status !== "CONCLUÍDO" && (
                      <button
                        className="dono-ag-btn dono-ag-cancelar"
                        onClick={() => cancelarAgendamento(agendamento)}
                      >
                        <XCircle size={15} />
                        Cancelar
                      </button>
                    )}

                  {/* PAGAMENTO AINDA NÃO REGISTRADO */}

                  {agendamento.status === "CONCLUÍDO" &&
                    !agendamento.formaPagamento && (
                      <div className="dono-ag-pagamento">
                        <WalletCards size={15} />

                        <select
                          value={formasPagamento[agendamento.id] || ""}
                          onChange={(event) =>
                            setFormasPagamento((estadoAtual) => ({
                              ...estadoAtual,

                              [agendamento.id]: event.target.value,
                            }))
                          }
                        >
                          <option value="">Forma de pagamento</option>

                          <option value="PIX">PIX</option>

                          <option value="DEBITO">Débito</option>

                          <option value="CREDITO">Crédito</option>

                          <option value="DINHEIRO">Dinheiro</option>
                        </select>

                        <button
                          type="button"
                          className="dono-ag-btn dono-ag-pagar"
                          disabled={salvandoPagamento === agendamento.id}
                          onClick={() => registrarPagamento(agendamento)}
                        >
                          {salvandoPagamento === agendamento.id
                            ? "Salvando..."
                            : "Registrar"}
                        </button>
                      </div>
                    )}

                  {/* PAGAMENTO REGISTRADO */}

                  {agendamento.status === "CONCLUÍDO" &&
                    agendamento.formaPagamento && (
                      <div className="dono-ag-pagamento-ok">
                        <WalletCards size={14} />

                        <div>
                          <span>PAGAMENTO</span>

                          <strong>
                            {formatarFormaPagamento(agendamento.formaPagamento)}
                          </strong>
                        </div>
                      </div>
                    )}
                </div>
              </article>
            ))}
          </section>
        )}
      </main>
    </div>
  );
}

export default DonoAgendamentos;
