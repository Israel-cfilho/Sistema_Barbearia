import { useEffect, useState } from "react";
import {
  ChartNoAxesColumnIncreasing,
  CircleDollarSign,
  Scissors,
  WalletCards,
} from "lucide-react";
import { toast } from "react-toastify";

import BarbeiroSidebar from "../../components/BarbeiroSidebar/BarbeiroSidebar";

import "./barbeiroDesempenho.css";

function BarbeiroDesempenho() {
  const [barbeiro, setBarbeiro] = useState(null);

  const [desempenho, setDesempenho] = useState({
    renda: 0,
    quantidadeAgendamento: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function carregarDados() {
      try {
        setLoading(true);

        const [responseBarbeiro, responseDesempenho] = await Promise.all([
          fetch("http://localhost:8080/barbeiros/me", {
            method: "GET",
            credentials: "include",
          }),

          fetch("http://localhost:8080/relatorios/meu-desempenho/mes", {
            method: "GET",
            credentials: "include",
          }),
        ]);

        if (!responseBarbeiro.ok) {
          throw new Error("Não foi possível carregar os dados do barbeiro");
        }

        if (!responseDesempenho.ok) {
          throw new Error("Não foi possível carregar o desempenho");
        }

        const dadosBarbeiro = await responseBarbeiro.json();

        const dadosDesempenho = await responseDesempenho.json();

        setBarbeiro(dadosBarbeiro);

        setDesempenho(dadosDesempenho);
      } catch (error) {
        console.error(error);

        toast.error("Erro ao carregar seu desempenho");
      } finally {
        setLoading(false);
      }
    }

    carregarDados();
  }, []);

  const faturamento = Number(desempenho.renda || 0);

  const quantidade = Number(desempenho.quantidadeAgendamento || 0);

  const percentualComissao = Number(barbeiro?.comissaoPercentual || 0);

  const valorComissao = faturamento * (percentualComissao / 100);

  const valorMedio = quantidade > 0 ? faturamento / quantidade : 0;

  function formatarMoeda(valor) {
    return Number(valor || 0).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  }

  if (loading) {
    return (
      <div className="barbeiro-desempenho-page">
        <BarbeiroSidebar />

        <main className="barbeiro-desempenho-main">
          <div className="barbeiro-desempenho-loading">
            Carregando desempenho...
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="barbeiro-desempenho-page">
      <BarbeiroSidebar />

      <main className="barbeiro-desempenho-main">
        <header className="barbeiro-desempenho-header">
          <span className="barbeiro-desempenho-label">MEU DESEMPENHO</span>

          <h1>Seu desempenho no mês</h1>

          <p>Acompanhe seus atendimentos, faturamento e comissão.</p>
        </header>

        <section className="desempenho-grid">
          <article className="desempenho-card">
            <div className="desempenho-card-icon">
              <Scissors size={21} />
            </div>

            <span>Atendimentos concluídos</span>

            <strong>{quantidade}</strong>

            <small>Total concluído no mês atual</small>
          </article>

          <article className="desempenho-card">
            <div className="desempenho-card-icon">
              <CircleDollarSign size={21} />
            </div>

            <span>Faturamento gerado</span>

            <strong className="valor-desempenho">
              {formatarMoeda(faturamento)}
            </strong>

            <small>Valor gerado pelos seus atendimentos</small>
          </article>

          <article className="desempenho-card">
            <div className="desempenho-card-icon">
              <WalletCards size={21} />
            </div>

            <span>Minha comissão</span>

            <strong className="valor-desempenho">
              {formatarMoeda(valorComissao)}
            </strong>

            <small>{percentualComissao}% de comissão</small>
          </article>

          <article className="desempenho-card">
            <div className="desempenho-card-icon">
              <ChartNoAxesColumnIncreasing size={21} />
            </div>

            <span>Valor médio por atendimento</span>

            <strong className="valor-desempenho">
              {formatarMoeda(valorMedio)}
            </strong>

            <small>Média dos atendimentos concluídos</small>
          </article>
        </section>

        <section className="desempenho-resumo-card">
          <div className="desempenho-resumo-header">
            <div className="desempenho-resumo-icon">
              <ChartNoAxesColumnIncreasing size={22} />
            </div>

            <div>
              <h2>Resumo do mês</h2>

              <p>Visão geral do seu desempenho.</p>
            </div>
          </div>

          <div className="desempenho-resumo-lista">
            <div className="desempenho-resumo-item">
              <span>Barbeiro</span>

              <strong>{barbeiro?.nome}</strong>
            </div>

            <div className="desempenho-resumo-item">
              <span>Comissão definida</span>

              <strong>{percentualComissao}%</strong>
            </div>

            <div className="desempenho-resumo-item">
              <span>Atendimentos concluídos</span>

              <strong>{quantidade}</strong>
            </div>

            <div className="desempenho-resumo-item">
              <span>Faturamento</span>

              <strong>{formatarMoeda(faturamento)}</strong>
            </div>

            <div className="desempenho-resumo-item destaque">
              <span>Comissão estimada</span>

              <strong>{formatarMoeda(valorComissao)}</strong>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default BarbeiroDesempenho;
