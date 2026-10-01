import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./confirmarAgendamento.css";

import {
  CalendarDays,
  ChevronLeft,
  Clock3,
  Scissors,
  User,
  CheckCircle2,
} from "lucide-react";

import { toast } from "react-toastify";

function ConfirmarAgendamento() {
  const navigate = useNavigate();

  const [agendamento, setAgendamento] = useState(null);
  const [confirmando, setConfirmando] = useState(false);

  useEffect(() => {
    const dadosSalvos = localStorage.getItem("dadosAgendamento");

    if (!dadosSalvos) {
      navigate("/agendamentos");
      return;
    }

    try {
      setAgendamento(JSON.parse(dadosSalvos));
    } catch (error) {
      console.error("Erro ao carregar agendamento:", error);
      localStorage.removeItem("dadosAgendamento");
      navigate("/agendamentos");
    }
  }, [navigate]);

  function formatarData(data) {
    if (!data) return "";

    const [ano, mes, dia] = data.split("-");

    return `${dia}/${mes}/${ano}`;
  }

  async function confirmarAgendamento() {
    if (!agendamento) {
      return;
    }

    setConfirmando(true);

    try {
      const response = await fetch("http://localhost:8080/agendamentos", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        // O JWT agora está no cookie httpOnly
        credentials: "include",

        body: JSON.stringify({
          barbeiroId: agendamento.barbeiro.id,
          servicoId: agendamento.servico.id,
          data: agendamento.data,
          horaInicio: `${agendamento.horario}:00`,
        }),
      });

      if (!response.ok) {
        const erro = await response.text();

        throw new Error(erro || "Não foi possível realizar o agendamento.");
      }

      const data = await response.json();

      console.log("Agendamento criado:", data);

      // Limpa os dados temporários
      localStorage.removeItem("dadosAgendamento");
      localStorage.removeItem("servicoSelecionado");

      toast.success("Agendamento confirmado com sucesso!");

      setTimeout(() => {
        navigate("/meus-agendamentos");
      }, 1200);
    } catch (error) {
      console.error("Erro ao confirmar agendamento:", error);

      toast.error(error.message || "Erro ao confirmar agendamento.");
    } finally {
      setConfirmando(false);
    }
  }

  if (!agendamento) {
    return null;
  }

  return (
    <main className="confirmacao-page">
      <section className="confirmacao-container">
        {/* TÍTULO */}
        <div className="confirmacao-header">
          <span>CONFIRMAÇÃO</span>

          <h1>
            Confira seu
            <strong> agendamento.</strong>
          </h1>

          <p>Verifique as informações antes de confirmar seu horário.</p>
        </div>

        {/* CARD PRINCIPAL */}
        <section className="resumo-agendamento">
          <div className="resumo-topo">
            <div className="resumo-icon-principal">
              <CalendarDays size={28} />
            </div>

            <div>
              <span>SEU AGENDAMENTO</span>

              <h2>Vila Branca</h2>
            </div>
          </div>

          <div className="resumo-grid">
            {/* SERVIÇO */}
            <div className="resumo-item">
              <div className="resumo-item-icon">
                <Scissors size={20} />
              </div>

              <div>
                <span>SERVIÇO</span>

                <strong>{agendamento.servico.nome}</strong>

                <p>{agendamento.servico.duracaoMinutos} minutos</p>
              </div>
            </div>

            {/* BARBEIRO */}
            <div className="resumo-item">
              <div className="resumo-item-icon">
                <User size={20} />
              </div>

              <div>
                <span>BARBEIRO</span>

                <strong>{agendamento.barbeiro.nome}</strong>

                <p>Profissional selecionado</p>
              </div>
            </div>

            {/* DATA */}
            <div className="resumo-item">
              <div className="resumo-item-icon">
                <CalendarDays size={20} />
              </div>

              <div>
                <span>DATA</span>

                <strong>{formatarData(agendamento.data)}</strong>
              </div>
            </div>

            {/* HORÁRIO */}
            <div className="resumo-item">
              <div className="resumo-item-icon">
                <Clock3 size={20} />
              </div>

              <div>
                <span>HORÁRIO</span>

                <strong>{agendamento.horario}</strong>
              </div>
            </div>
          </div>

          {/* PREÇO */}
          <div className="resumo-total">
            <span>Valor do serviço</span>

            <strong>
              R${" "}
              {Number(agendamento.servico.preco).toFixed(2).replace(".", ",")}
            </strong>
          </div>
        </section>

        {/* AVISO */}
        <div className="confirmacao-aviso">
          <CheckCircle2 size={22} />

          <p>
            <strong>Tudo certo?</strong>
            Ao confirmar, seu horário ficará reservado com o barbeiro
            selecionado.
          </p>
        </div>

        {/* BOTÕES */}
        <div className="confirmacao-actions">
          <button
            className="confirmacao-voltar"
            onClick={() => navigate("/agendamentos")}
            disabled={confirmando}
          >
            <ChevronLeft size={18} />
            Alterar dados
          </button>

          <button
            className="confirmacao-confirmar"
            onClick={confirmarAgendamento}
            disabled={confirmando}
          >
            <CheckCircle2 size={19} />

            {confirmando ? "Confirmando..." : "Confirmar agendamento"}
          </button>
        </div>
      </section>
    </main>
  );
}

export default ConfirmarAgendamento;
