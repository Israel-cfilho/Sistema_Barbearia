import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import "./agendamentos.css";

import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock3,
  User,
  Check,
} from "lucide-react";

import ClienteHeader from "../../Components/ClienteHeader/ClienteHeader";

function Agendamento() {
  const navigate = useNavigate();

  // ============================================================
  // ESTADOS
  // ============================================================

  const [barbeiros, setBarbeiros] = useState([]);
  const [loadingBarbeiros, setLoadingBarbeiros] = useState(false);

  const [barbeiroSelecionado, setBarbeiroSelecionado] = useState(null);

  const [dataSelecionada, setDataSelecionada] = useState("");

  const [mesCalendario, setMesCalendario] = useState(() => {
    const hoje = new Date();

    return new Date(hoje.getFullYear(), hoje.getMonth(), 1);
  });

  const [horarioSelecionado, setHorarioSelecionado] = useState("");

  const [servicoSelecionado, setServicoSelecionado] = useState(null);

  const [periodoSelecionado, setPeriodoSelecionado] = useState("MANHA");

  const [horariosDisponiveis, setHorariosDisponiveis] = useState([]);
  const [loadingHorarios, setLoadingHorarios] = useState(false);

  // ============================================================
  // MESES
  // ============================================================

  const nomesMeses = [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
  ];

  const diasSemana = ["DOM", "SEG", "TER", "QUA", "QUI", "SEX", "SÁB"];

  // ============================================================
  // RECUPERA SERVIÇO SELECIONADO
  // ============================================================

  useEffect(() => {
    const servicoSalvo = localStorage.getItem("servicoSelecionado");

    if (servicoSalvo) {
      setServicoSelecionado(JSON.parse(servicoSalvo));
    }
  }, []);

  // ============================================================
  // BUSCA BARBEIROS
  // ============================================================

  useEffect(() => {
    async function buscarBarbeiros() {
      setLoadingBarbeiros(true);

      try {
        const response = await fetch("http://localhost:8080/barbeiros", {
          method: "GET",
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Não foi possível buscar os barbeiros");
        }

        const dados = await response.json();

        console.log("Barbeiros encontrados:", dados);

        setBarbeiros(dados);
      } catch (error) {
        console.error("Erro ao buscar barbeiros:", error);

        setBarbeiros([]);
      } finally {
        setLoadingBarbeiros(false);
      }
    }

    buscarBarbeiros();
  }, []);

  // ============================================================
  // BUSCA HORÁRIOS DISPONÍVEIS
  // ============================================================

  useEffect(() => {
    async function buscarHorariosDisponiveis() {
      if (!barbeiroSelecionado || !dataSelecionada || !servicoSelecionado) {
        setHorariosDisponiveis([]);
        return;
      }

      setLoadingHorarios(true);

      try {
        const url =
          `http://localhost:8080/agendamentos/horarios-disponiveis` +
          `?barbeiroId=${barbeiroSelecionado.id}` +
          `&servicoId=${servicoSelecionado.id}` +
          `&data=${dataSelecionada}`;

        const response = await fetch(url, {
          method: "GET",
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Erro ao buscar horários disponíveis");
        }

        const dados = await response.json();

        console.log("HORÁRIOS LIVRES:", dados);

        setHorariosDisponiveis(dados);
      } catch (error) {
        console.error("Erro ao buscar horários:", error);

        setHorariosDisponiveis([]);
      } finally {
        setLoadingHorarios(false);
      }
    }

    buscarHorariosDisponiveis();
  }, [barbeiroSelecionado, dataSelecionada, servicoSelecionado]);

  // ============================================================
  // SELECIONAR BARBEIRO
  // ============================================================

  function selecionarBarbeiro(barbeiro) {
    setBarbeiroSelecionado(barbeiro);

    setHorarioSelecionado("");

    setPeriodoSelecionado("MANHA");
  }

  // ============================================================
  // SELECIONAR HORÁRIO
  // ============================================================

  function selecionarHorario(horario) {
    setHorarioSelecionado(horario);
  }

  // ============================================================
  // CALENDÁRIO - OBTER DIAS DO MÊS
  // ============================================================

  function obterDiasCalendario() {
    const ano = mesCalendario.getFullYear();

    const mes = mesCalendario.getMonth();

    const primeiroDia = new Date(ano, mes, 1);

    const quantidadeDias = new Date(ano, mes + 1, 0).getDate();

    const dias = [];

    // espaços antes do primeiro dia
    for (let i = 0; i < primeiroDia.getDay(); i++) {
      dias.push(null);
    }

    // dias do mês
    for (let dia = 1; dia <= quantidadeDias; dia++) {
      dias.push(new Date(ano, mes, dia));
    }

    return dias;
  }

  // ============================================================
  // FORMATA DATA PARA O BACKEND
  // yyyy-MM-dd
  // ============================================================

  function formatarDataParaBackend(data) {
    const ano = data.getFullYear();

    const mes = String(data.getMonth() + 1).padStart(2, "0");

    const dia = String(data.getDate()).padStart(2, "0");

    return `${ano}-${mes}-${dia}`;
  }

  // ============================================================
  // SELECIONAR DATA
  // ============================================================

  function selecionarData(data) {
    if (!data) {
      return;
    }

    if (dataJaPassou(data)) {
      return;
    }

    const dataFormatada = formatarDataParaBackend(data);

    setDataSelecionada(dataFormatada);

    // troca de data limpa horário antigo
    setHorarioSelecionado("");

    // volta para manhã
    setPeriodoSelecionado("MANHA");
  }

  // ============================================================
  // VERIFICA SE A DATA JÁ PASSOU
  // ============================================================

  function dataJaPassou(data) {
    const hoje = new Date();

    hoje.setHours(0, 0, 0, 0);

    const dataComparacao = new Date(data);

    dataComparacao.setHours(0, 0, 0, 0);

    return dataComparacao < hoje;
  }

  // ============================================================
  // VERIFICA SE É HOJE
  // ============================================================

  function dataEhHoje(data) {
    const hoje = new Date();

    return (
      data.getDate() === hoje.getDate() &&
      data.getMonth() === hoje.getMonth() &&
      data.getFullYear() === hoje.getFullYear()
    );
  }

  // ============================================================
  // MÊS ANTERIOR
  // ============================================================

  function mesAnterior() {
    const hoje = new Date();

    const mesAtual = new Date(hoje.getFullYear(), hoje.getMonth(), 1);

    const anterior = new Date(
      mesCalendario.getFullYear(),
      mesCalendario.getMonth() - 1,
      1,
    );

    if (anterior < mesAtual) {
      return;
    }

    setMesCalendario(anterior);
  }

  // ============================================================
  // PRÓXIMO MÊS
  // ============================================================

  function proximoMes() {
    setMesCalendario(
      new Date(mesCalendario.getFullYear(), mesCalendario.getMonth() + 1, 1),
    );
  }

  // ============================================================
  // PODE VOLTAR PARA O MÊS ANTERIOR?
  // ============================================================

  function podeVoltarMes() {
    const hoje = new Date();

    const mesAtual = new Date(hoje.getFullYear(), hoje.getMonth(), 1);

    return mesCalendario > mesAtual;
  }

  const diasCalendario = obterDiasCalendario();

  // ============================================================
  // CONTINUAR PARA CONFIRMAÇÃO
  // ============================================================

  function continuar() {
    if (!servicoSelecionado) {
      alert("Selecione um serviço.");
      return;
    }

    if (!barbeiroSelecionado) {
      alert("Selecione um barbeiro.");
      return;
    }

    if (!dataSelecionada) {
      alert("Selecione uma data.");
      return;
    }

    if (!horarioSelecionado) {
      alert("Selecione um horário.");
      return;
    }

    const dadosAgendamento = {
      servico: servicoSelecionado,
      barbeiro: barbeiroSelecionado,
      data: dataSelecionada,
      horario: horarioSelecionado,
    };

    localStorage.setItem("dadosAgendamento", JSON.stringify(dadosAgendamento));

    navigate("/confirmar-agendamento");
  }

  // ============================================================
  // CONVERTE HORÁRIO EM MINUTOS
  // ============================================================

  function obterMinutos(horario) {
    if (!horario) {
      return 0;
    }

    const [hora, minuto] = horario.split(":").map(Number);

    return hora * 60 + minuto;
  }

  // ============================================================
  // FILTRO MANHÃ / TARDE / NOITE
  // ============================================================

  function filtrarHorariosPorPeriodo(listaHorarios, periodo) {
    return listaHorarios.filter((horario) => {
      const minutos = obterMinutos(horario);

      // MANHÃ
      if (periodo === "MANHA") {
        return minutos >= 8 * 60 && minutos <= 11 * 60 + 30;
      }

      // TARDE
      if (periodo === "TARDE") {
        return minutos >= 14 * 60 && minutos <= 17 * 60 + 30;
      }

      // NOITE
      if (periodo === "NOITE") {
        return minutos >= 18 * 60 && minutos <= 20 * 60;
      }

      return false;
    });
  }

  // ============================================================
  // HORÁRIOS FINAIS
  // ============================================================

  const horariosFiltrados = filtrarHorariosPorPeriodo(
    horariosDisponiveis,
    periodoSelecionado,
  );

  // ============================================================
  // JSX
  // ============================================================

  return (
    <main className="agendamento-page">
      {/* ======================================================
          HEADER
      ====================================================== */}

      <ClienteHeader />

      {/* ======================================================
          HERO
      ====================================================== */}

      <section className="agendamento-hero">
        <span className="agendamento-label">AGENDAMENTO</span>

        <h1>
          Escolha seu barbeiro,
          <br />
          <strong>data e horário.</strong>
        </h1>

        <p>
          Reserve seu horário de forma rápida e prática e garanta sua
          experiência na Vila Branca.
        </p>
      </section>

      {/* ======================================================
          SERVIÇO SELECIONADO
      ====================================================== */}

      {servicoSelecionado && (
        <section className="servico-escolhido">
          <div>
            <span>Serviço selecionado</span>

            <h3>{servicoSelecionado.nome}</h3>
          </div>

          <div className="servico-escolhido-info">
            <span>
              <Clock3 size={15} />
              {servicoSelecionado.duracaoMinutos} min
            </span>

            <strong>
              R$ {Number(servicoSelecionado.preco).toFixed(2).replace(".", ",")}
            </strong>
          </div>

          <button onClick={() => navigate("/servicos")}>Alterar</button>
        </section>
      )}

      {/* ======================================================
          CONTEÚDO
      ====================================================== */}

      <section className="agendamento-container">
        {/* ====================================================
            1 - BARBEIRO
        ==================================================== */}

        <div className="agendamento-bloco">
          <div className="bloco-titulo">
            <span className="numero-etapa">1</span>

            <div>
              <h2>Escolha seu barbeiro</h2>

              <p>Selecione o profissional que irá realizar seu atendimento.</p>
            </div>
          </div>

          {loadingBarbeiros && (
            <p className="loading-agendamento">Carregando barbeiros...</p>
          )}

          <div className="barbeiros-grid">
            {barbeiros.map((barbeiro) => {
              const selecionado = barbeiroSelecionado?.id === barbeiro.id;

              return (
                <button
                  key={barbeiro.id}
                  type="button"
                  className={
                    selecionado ? "barbeiro-card selecionado" : "barbeiro-card"
                  }
                  onClick={() => selecionarBarbeiro(barbeiro)}
                >
                  {selecionado && (
                    <span className="check-barbeiro">
                      <Check size={15} />
                    </span>
                  )}

                  <div className="barbeiro-avatar">
                    <User size={31} />
                  </div>

                  <h3>{barbeiro.nome}</h3>

                  <span>Barbeiro</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ====================================================
            DATA + HORÁRIO
        ==================================================== */}

        <div className="data-horario-grid">
          {/* ==================================================
              2 - DATA
          ================================================== */}

          <div className="agendamento-bloco">
            <div className="bloco-titulo">
              <span className="numero-etapa">2</span>

              <div>
                <h2>Escolha a data</h2>

                <p>Selecione o dia desejado.</p>
              </div>
            </div>

            {/* CALENDÁRIO */}

            <div className="calendario-agendamento">
              {/* CABEÇALHO DO CALENDÁRIO */}

              <div className="calendario-header">
                <button
                  type="button"
                  className="calendario-seta"
                  onClick={mesAnterior}
                  disabled={!podeVoltarMes()}
                  aria-label="Mês anterior"
                >
                  <ChevronLeft size={20} />
                </button>

                <h3>
                  {nomesMeses[mesCalendario.getMonth()]}{" "}
                  {mesCalendario.getFullYear()}
                </h3>

                <button
                  type="button"
                  className="calendario-seta"
                  onClick={proximoMes}
                  aria-label="Próximo mês"
                >
                  <ChevronRight size={20} />
                </button>
              </div>

              {/* DIAS DA SEMANA */}

              <div className="calendario-semana">
                {diasSemana.map((dia) => (
                  <span key={dia}>{dia}</span>
                ))}
              </div>

              {/* DIAS DO MÊS */}

              <div className="calendario-dias">
                {diasCalendario.map((data, index) => {
                  if (!data) {
                    return (
                      <div
                        key={`vazio-${index}`}
                        className="calendario-vazio"
                      />
                    );
                  }

                  const dataFormatada = formatarDataParaBackend(data);

                  const selecionada = dataSelecionada === dataFormatada;

                  const passou = dataJaPassou(data);

                  const hoje = dataEhHoje(data);

                  let classe = "calendario-dia";

                  if (passou) {
                    classe += " desabilitado";
                  }

                  if (hoje) {
                    classe += " hoje";
                  }

                  if (selecionada) {
                    classe += " selecionado";
                  }

                  return (
                    <button
                      key={dataFormatada}
                      type="button"
                      disabled={passou}
                      className={classe}
                      onClick={() => selecionarData(data)}
                    >
                      {data.getDate()}
                    </button>
                  );
                })}
              </div>

              {/* DATA SELECIONADA */}

              {dataSelecionada && (
                <div className="calendario-data-selecionada">
                  <CalendarDays size={17} />

                  <span>Data selecionada:</span>

                  <strong>
                    {dataSelecionada.split("-").reverse().join("/")}
                  </strong>
                </div>
              )}
            </div>
          </div>

          {/* ==================================================
              3 - HORÁRIO
          ================================================== */}

          <div className="agendamento-bloco">
            <div className="bloco-titulo">
              <span className="numero-etapa">3</span>

              <div>
                <h2>Escolha o horário</h2>

                <p>Selecione um horário disponível.</p>
              </div>
            </div>

            {/* NÃO ESCOLHEU BARBEIRO */}

            {!barbeiroSelecionado && (
              <p className="horario-aviso">Escolha primeiro um barbeiro.</p>
            )}

            {/* ESCOLHEU BARBEIRO MAS NÃO DATA */}

            {barbeiroSelecionado && !dataSelecionada && (
              <p className="horario-aviso">Agora escolha uma data.</p>
            )}

            {/* TEM BARBEIRO + DATA */}

            {barbeiroSelecionado && dataSelecionada && (
              <>
                {/* PERÍODO */}

                <div className="periodo-filter">
                  <button
                    type="button"
                    className={
                      periodoSelecionado === "MANHA"
                        ? "periodo-button active"
                        : "periodo-button"
                    }
                    onClick={() => {
                      setPeriodoSelecionado("MANHA");

                      setHorarioSelecionado("");
                    }}
                  >
                    Manhã
                  </button>

                  <button
                    type="button"
                    className={
                      periodoSelecionado === "TARDE"
                        ? "periodo-button active"
                        : "periodo-button"
                    }
                    onClick={() => {
                      setPeriodoSelecionado("TARDE");

                      setHorarioSelecionado("");
                    }}
                  >
                    Tarde
                  </button>

                  <button
                    type="button"
                    className={
                      periodoSelecionado === "NOITE"
                        ? "periodo-button active"
                        : "periodo-button"
                    }
                    onClick={() => {
                      setPeriodoSelecionado("NOITE");

                      setHorarioSelecionado("");
                    }}
                  >
                    Noite
                  </button>
                </div>

                {/* HORÁRIOS */}

                {loadingHorarios ? (
                  <p className="horario-aviso">
                    Buscando horários disponíveis...
                  </p>
                ) : horariosFiltrados.length > 0 ? (
                  <div className="horarios-grid">
                    {horariosFiltrados.map((horario) => (
                      <button
                        key={horario}
                        type="button"
                        className={
                          horarioSelecionado === horario
                            ? "horario-button selecionado"
                            : "horario-button"
                        }
                        onClick={() => selecionarHorario(horario)}
                      >
                        {horario}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="sem-horarios">
                    <p>Nenhum horário disponível neste período.</p>

                    <span>Escolha outro período ou outra data.</span>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* ====================================================
            AVISOS
        ==================================================== */}

        <div className="agendamento-alertas">
          <div>
            <Clock3 size={25} />

            <p>
              <strong>Chegue com 10 minutos de antecedência.</strong>
              Em caso de atraso, seu horário poderá ser reagendado.
            </p>
          </div>

          <div>
            <CalendarDays size={25} />

            <p>
              <strong>Não poderá comparecer?</strong>
              Cancele seu horário com antecedência.
            </p>
          </div>
        </div>

        {/* ====================================================
            BOTÕES
        ==================================================== */}

        <div className="agendamento-actions">
          <button
            className="voltar-button"
            onClick={() => navigate("/servicos")}
          >
            <ChevronLeft size={18} />
            Voltar para serviços
          </button>

          <button className="continuar-button" onClick={continuar}>
            Continuar
            <ChevronRight size={18} />
          </button>
        </div>
      </section>
    </main>
  );
}

export default Agendamento;
