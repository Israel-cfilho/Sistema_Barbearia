import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  CalendarDays,
  Clock3,
  Scissors,
  User,
  ChevronRight,
  X,
  CircleCheck,
  CircleAlert,
} from "lucide-react";

import { toast } from "react-toastify";

import "./meusAgendamentos.css";

function MeusAgendamentos() {

  const navigate = useNavigate();

  const [agendamentos, setAgendamentos] = useState([]);

  const [loading, setLoading] = useState(true);

  const [cancelandoId, setCancelandoId] = useState(null);

  const [confirmandoId, setConfirmandoId] = useState(null);


  // ============================================================
  // BUSCAR AGENDAMENTOS
  // ============================================================

  useEffect(() => {

    buscarMeusAgendamentos();

    const intervalo = setInterval(() => {
      buscarMeusAgendamentos();
    }, 30000);

    return () => {
      clearInterval(intervalo);
    };

  }, []);


  async function buscarMeusAgendamentos() {

    try {

      const response = await fetch(
        "http://localhost:8080/agendamentos/meus",
        {
          method: "GET",

          // ======================================================
          // JWT AGORA VAI PELO COOKIE HTTPONLY
          // ======================================================

          credentials: "include",
        }
      );


      if (!response.ok) {

        throw new Error(
          "Erro ao buscar agendamentos"
        );
      }


      const data = await response.json();

      setAgendamentos(data);

    } catch (error) {

      console.error(
        "Erro ao buscar meus agendamentos:",
        error
      );

    } finally {

      setLoading(false);
    }
  }


  // ============================================================
  // FORMATAR DATA
  // ============================================================

  function formatarData(data) {

    if (!data) {
      return "";
    }

    const [ano, mes, dia] = data.split("-");

    return `${dia}/${mes}/${ano}`;
  }


  // ============================================================
  // FORMATAR DATA E HORA
  // ============================================================

  function formatarDataHora(dataHora) {

    if (!dataHora) {
      return "";
    }

    const data = new Date(dataHora);

    return data.toLocaleString(
      "pt-BR",
      {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }
    );
  }


  // ============================================================
  // CALCULAR LIMITE DE CONFIRMAÇÃO
  // ============================================================

  function calcularLimiteConfirmacao(
    agendamento
  ) {

    const dataHora =
      new Date(
        `${agendamento.data}T${agendamento.horaInicio}`
      );

    dataHora.setMinutes(
      dataHora.getMinutes() - 30
    );

    return dataHora;
  }


  // ============================================================
  // FORMATAR LIMITE DE CONFIRMAÇÃO
  // ============================================================

  function formatarLimiteConfirmacao(
    agendamento
  ) {

    const limite =
      calcularLimiteConfirmacao(
        agendamento
      );

    return limite.toLocaleString(
      "pt-BR",
      {
        day: "2-digit",
        month: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      }
    );
  }


  // ============================================================
  // VERIFICAR SE PODE CONFIRMAR
  // ============================================================

  function podeConfirmar(
    agendamento
  ) {

    const status =
      agendamento.status?.toUpperCase();


    if (
      status === "CANCELADO" ||
      status === "CONCLUÍDO" ||
      status === "CONCLUIDO"
    ) {

      return false;
    }


    if (
      agendamento.confirmadoCliente === true
    ) {

      return false;
    }


    const limite =
      calcularLimiteConfirmacao(
        agendamento
      );

    const agora = new Date();

    return agora < limite;
  }


  // ============================================================
  // VERIFICAR SE PODE MOSTRAR CANCELAMENTO
  // ============================================================

  function podeMostrarCancelar(
    agendamento
  ) {

    const status =
      agendamento.status?.toUpperCase();


    if (
      status === "CANCELADO" ||
      status === "CONCLUÍDO" ||
      status === "CONCLUIDO"
    ) {

      return false;
    }


    const dataHoraAgendamento =
      new Date(
        `${agendamento.data}T${agendamento.horaInicio}`
      );


    return new Date() < dataHoraAgendamento;
  }


  // ============================================================
  // CONFIRMAR PRESENÇA
  // ============================================================

  async function confirmarPresenca(
    agendamento
  ) {

    setConfirmandoId(
      agendamento.id
    );


    try {

      const response =
        await fetch(
          `http://localhost:8080/agendamentos/${agendamento.id}/confirmar-presenca`,
          {
            method: "PUT",

            // ==================================================
            // JWT VAI PELO COOKIE
            // ==================================================

            credentials: "include",
          }
        );


      if (!response.ok) {

        let mensagem =
          "Não foi possível confirmar sua presença.";


        try {

          const texto =
            await response.text();


          if (texto) {
            mensagem = texto;
          }

        } catch {

          // mantém mensagem padrão

        }


        throw new Error(
          mensagem
        );
      }


      const agendamentoConfirmado =
        await response.json();


      // ========================================================
      // ATUALIZA SOMENTE O CARD CONFIRMADO
      // ========================================================

      setAgendamentos(
        (agendamentosAtuais) =>
          agendamentosAtuais.map(
            (item) => {

              if (
                item.id ===
                agendamentoConfirmado.id
              ) {

                return agendamentoConfirmado;
              }

              return item;
            }
          )
      );


      toast.success(
        "Presença confirmada com sucesso!"
      );

    } catch (error) {

      console.error(
        "Erro ao confirmar presença:",
        error
      );


      toast.error(
        error.message ||
        "Não foi possível confirmar sua presença."
      );

    } finally {

      setConfirmandoId(null);
    }
  }


  // ============================================================
  // CANCELAR AGENDAMENTO
  // ============================================================

  async function cancelarAgendamento(
    agendamento
  ) {

    const confirmar =
      window.confirm(
        `Deseja realmente cancelar o agendamento de ${agendamento.servico.nome} no dia ${formatarData(agendamento.data)} às ${agendamento.horaInicio.slice(0, 5)}?`
      );


    if (!confirmar) {
      return;
    }


    setCancelandoId(
      agendamento.id
    );


    try {

      const response =
        await fetch(
          `http://localhost:8080/agendamentos/${agendamento.id}/cancelar`,
          {
            method: "PUT",

            // ==================================================
            // JWT VAI PELO COOKIE
            // ==================================================

            credentials: "include",
          }
        );


      if (!response.ok) {

        let mensagem =
          "Não foi possível cancelar o agendamento.";


        try {

          const texto =
            await response.text();


          if (texto) {
            mensagem = texto;
          }

        } catch {

          // mantém mensagem padrão

        }


        throw new Error(
          mensagem
        );
      }


      const agendamentoCancelado =
        await response.json();


      // ========================================================
      // ATUALIZA SOMENTE O CARD CANCELADO
      // ========================================================

      setAgendamentos(
        (agendamentosAtuais) =>
          agendamentosAtuais.map(
            (item) => {

              if (
                item.id ===
                agendamentoCancelado.id
              ) {

                return agendamentoCancelado;
              }

              return item;
            }
          )
      );


      toast.success(
        "Agendamento cancelado com sucesso!"
      );

    } catch (error) {

      console.error(
        "Erro ao cancelar agendamento:",
        error
      );


      toast.error(
        error.message ||
        "Não foi possível cancelar o agendamento."
      );

    } finally {

      setCancelandoId(null);
    }
  }


  // ============================================================
  // JSX
  // ============================================================

  return (

    <main className="meus-agendamentos-page">

      <section className="meus-agendamentos-container">

        {/* =====================================================
            CABEÇALHO
        ===================================================== */}

        <div className="meus-agendamentos-header">

          <span>
            MINHA AGENDA
          </span>

          <h1>
            Meus
            <strong>
              {" "}agendamentos.
            </strong>
          </h1>

          <p>
            Acompanhe seus próximos horários
            e seu histórico.
          </p>

        </div>


        {/* =====================================================
            VOLTAR
        ===================================================== */}

        <div className="meus-agendamentos-actions">

          <button
            onClick={() =>
              navigate("/servicos")
            }
          >

            Voltar ao início

            <ChevronRight
              size={18}
            />

          </button>

        </div>


        {/* =====================================================
            LOADING
        ===================================================== */}

        {loading && (

          <p className="agendamentos-loading">
            Carregando seus agendamentos...
          </p>

        )}


        {/* =====================================================
            VAZIO
        ===================================================== */}

        {!loading &&
          agendamentos.length === 0 && (

            <div className="agendamentos-vazio">

              <CalendarDays
                size={42}
              />

              <h2>
                Nenhum agendamento ainda
              </h2>

              <p>
                Escolha um serviço e reserve
                seu primeiro horário.
              </p>

              <button
                onClick={() =>
                  navigate("/servicos")
                }
              >
                Ver serviços
              </button>

            </div>

          )}


        {/* =====================================================
            LISTA
        ===================================================== */}

        <div className="agendamentos-lista">

          {agendamentos.map(
            (agendamento) => {

              const cancelado =
                agendamento.status
                  ?.toUpperCase() ===
                "CANCELADO";


              const canceladoSemConfirmacao =
                cancelado &&
                agendamento.motivoCancelamento ===
                "FALTA_DE_CONFIRMACAO";


              return (

                <article
                  key={agendamento.id}
                  className={
                    cancelado
                      ? "agendamento-card cancelado"
                      : "agendamento-card"
                  }
                >

                  {/* =================================================
                      TOPO
                  ================================================= */}

                  <div className="agendamento-card-top">

                    <div>

                      <span
                        className={
                          cancelado
                            ? "agendamento-status cancelado"
                            : "agendamento-status"
                        }
                      >
                        {agendamento.status}
                      </span>

                      <h2>
                        {agendamento.servico.nome}
                      </h2>

                    </div>


                    <strong>

                      R${" "}

                      {Number(
                        agendamento.servico.preco
                      )
                        .toFixed(2)
                        .replace(
                          ".",
                          ","
                        )}

                    </strong>

                  </div>


                  {/* =================================================
                      INFORMAÇÕES
                  ================================================= */}

                  <div className="agendamento-card-info">

                    <div>

                      <User size={17} />

                      <span>
                        {agendamento.barbeiro.nome}
                      </span>

                    </div>


                    <div>

                      <CalendarDays
                        size={17}
                      />

                      <span>
                        {formatarData(
                          agendamento.data
                        )}
                      </span>

                    </div>


                    <div>

                      <Clock3
                        size={17}
                      />

                      <span>
                        {agendamento.horaInicio.slice(
                          0,
                          5
                        )}
                      </span>

                    </div>


                    <div>

                      <Scissors
                        size={17}
                      />

                      <span>
                        {
                          agendamento.servico
                            .duracaoMinutos
                        }{" "}
                        min
                      </span>

                    </div>

                  </div>


                  {/* =================================================
                      CONFIRMAÇÃO REALIZADA
                  ================================================= */}

                  {!cancelado &&
                    agendamento.confirmadoCliente ===
                      true && (

                      <div className="confirmacao-presenca confirmada">

                        <CircleCheck
                          size={19}
                        />

                        <div>

                          <strong>
                            Presença confirmada
                          </strong>

                          {agendamento.confirmadoClienteEm && (

                            <span>

                              Confirmado em{" "}

                              {formatarDataHora(
                                agendamento.confirmadoClienteEm
                              )}

                            </span>

                          )}

                        </div>

                      </div>

                    )}


                  {/* =================================================
                      AGUARDANDO CONFIRMAÇÃO
                  ================================================= */}

                  {podeConfirmar(
                    agendamento
                  ) && (

                    <div className="confirmacao-presenca pendente">

                      <div className="confirmacao-aviso">

                        <CircleAlert
                          size={19}
                        />

                        <div>

                          <strong>
                            Confirme sua presença
                          </strong>

                          <span>

                            Confirme até{" "}

                            {formatarLimiteConfirmacao(
                              agendamento
                            )}

                          </span>

                        </div>

                      </div>


                      <button
                        type="button"
                        className="confirmar-presenca-button"
                        disabled={
                          confirmandoId ===
                          agendamento.id
                        }
                        onClick={() =>
                          confirmarPresenca(
                            agendamento
                          )
                        }
                      >

                        <CircleCheck
                          size={17}
                        />

                        {confirmandoId ===
                        agendamento.id
                          ? "Confirmando..."
                          : "Confirmar presença"}

                      </button>

                    </div>

                  )}


                  {/* =================================================
                      CANCELADO POR FALTA DE CONFIRMAÇÃO
                  ================================================= */}

                  {canceladoSemConfirmacao && (

                    <div className="confirmacao-presenca expirado">

                      <CircleAlert
                        size={19}
                      />

                      <div>

                        <strong>
                          Confirmação não realizada
                        </strong>

                        <span>

                          Este agendamento foi
                          cancelado automaticamente
                          porque a presença não foi
                          confirmada dentro do prazo.

                        </span>

                      </div>

                    </div>

                  )}


                  {/* =================================================
                      CANCELAMENTO
                  ================================================= */}

                  {podeMostrarCancelar(
                    agendamento
                  ) && (

                    <div className="agendamento-card-actions">

                      <button
                        type="button"
                        className="cancelar-agendamento-button"
                        disabled={
                          cancelandoId ===
                          agendamento.id
                        }
                        onClick={() =>
                          cancelarAgendamento(
                            agendamento
                          )
                        }
                      >

                        <X size={16} />

                        {cancelandoId ===
                        agendamento.id
                          ? "Cancelando..."
                          : "Cancelar agendamento"}

                      </button>

                    </div>

                  )}

                </article>

              );
            }
          )}

        </div>

      </section>

    </main>
  );
}

export default MeusAgendamentos;