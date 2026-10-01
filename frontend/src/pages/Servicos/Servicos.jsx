import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import "./servicos.css";

import fotoBarbearia from "../../assets/barbeariaVilaBranca.png";

import ClienteHeader from "../../Components/ClienteHeader/ClienteHeader";

import {
  CalendarDays,
  ChevronDown,
  ChevronRight,
  Clock3,
  MapPin,
  Star,
  Users,
  Armchair,
} from "lucide-react";

function Servico() {
  // ============================================================
  // ESTADOS
  // ============================================================

  const [servicos, setServicos] = useState([]);

  const [loading, setLoading] = useState(false);

  const [categoriaAtiva, setCategoriaAtiva] = useState("TODOS");

  const [mostrarTodos, setMostrarTodos] = useState(false);

  const navigate = useNavigate();

  // ============================================================
  // CATEGORIAS
  // ============================================================

  const categorias = [
    {
      nome: "Todos",
      valor: "TODOS",
    },

    {
      nome: "Cortes",
      valor: "CORTE",
    },

    {
      nome: "Barba",
      valor: "BARBA",
    },

    {
      nome: "Química",
      valor: "QUIMICA",
    },

    {
      nome: "Mais serviços",
      valor: "MAIS_SERVICOS",
    },

    {
      nome: "Serviços Premium",
      valor: "PREMIUM",
    },

    {
      nome: "Visagismo",
      valor: "VISAGISMO",
    },
  ];

  // ============================================================
  // BUSCAR SERVIÇOS
  // ============================================================

  useEffect(() => {
    async function buscarServicos() {
      setLoading(true);

      try {
        const response = await fetch("http://localhost:8080/servicos", {
          method: "GET",
        });

        if (!response.ok) {
          throw new Error("Erro ao buscar serviços");
        }

        const data = await response.json();

        // Mostra apenas serviços ativos para o cliente
        const servicosAtivos = data.filter(
          (servico) => servico.ativo !== false,
        );

        setServicos(servicosAtivos);
      } catch (error) {
        console.error("Erro ao buscar serviços:", error);
      } finally {
        setLoading(false);
      }
    }

    buscarServicos();
  }, []);

  // ============================================================
  // FILTRAR SERVIÇOS
  // ============================================================

  const servicosFiltrados =
    categoriaAtiva === "TODOS"
      ? servicos
      : servicos.filter((servico) => servico.categoria === categoriaAtiva);

  // ============================================================
  // MOSTRAR 6 OU TODOS
  // ============================================================

  const servicosExibidos = mostrarTodos
    ? servicosFiltrados
    : servicosFiltrados.slice(0, 6);

  // ============================================================
  // SELECIONAR SERVIÇO
  // ============================================================

  function selecionarServico(servico) {
    // ============================================================
    // SALVA O SERVIÇO ESCOLHIDO
    // ============================================================

    localStorage.setItem("servicoSelecionado", JSON.stringify(servico));

    // ============================================================
    // VERIFICAR ROLES
    // ============================================================

    let roles = [];

    try {
      roles = JSON.parse(localStorage.getItem("roles") || "[]");
    } catch {
      roles = [];
    }

    const ehCliente = roles.includes("CLIENTE");

    // ============================================================
    // CLIENTE LOGADO
    // ============================================================

    if (ehCliente) {
      navigate("/agendamentos");

      return;
    }

    // ============================================================
    // NÃO ESTÁ LOGADO COMO CLIENTE
    // ============================================================

    localStorage.setItem("redirecionarAposLogin", "/agendamentos");

    navigate("/login");
  }

  // ============================================================
  // SCROLL PARA SERVIÇOS
  // ============================================================

  function irParaServicos() {
    document.getElementById("lista-servicos")?.scrollIntoView({
      behavior: "smooth",
    });
  }

  // ============================================================
  // SCROLL PARA O INÍCIO
  // ============================================================

  function irParaInicio() {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  // ============================================================
  // JSX
  // ============================================================

  return (
    <main className="cliente-page">
      {/* ======================================================
          HEADER
      ====================================================== */}

      <ClienteHeader onInicio={irParaInicio} onServicos={irParaServicos} />

      {/* ======================================================
          HERO
      ====================================================== */}

      <section
        className="hero-servicos"
        style={{
          backgroundImage: `url(${fotoBarbearia})`,
        }}
      >
        <div className="hero-overlay" />

        <div className="hero-content">
          <h1>
            Seu estilo,
            <strong> nossa arte.</strong>
          </h1>

          <div className="hero-line" />

          <p>
            Cuidar de você vai além do corte. Cada detalhe, feito com precisão e
            paixão.
          </p>

          <div className="hero-actions">
            <button
              type="button"
              className="hero-primary"
              onClick={irParaServicos}
            >
              <CalendarDays size={18} />
              Agendar agora
            </button>

            <button
              type="button"
              className="hero-secondary"
              onClick={irParaServicos}
            >
              Ver todos os serviços
              <ChevronDown size={18} />
            </button>
          </div>
        </div>
      </section>

      {/* ======================================================
          DIFERENCIAIS
      ====================================================== */}

      <section className="beneficios">
        <article className="beneficio">
          <div className="beneficio-icon">
            <Users size={29} />
          </div>

          <div>
            <h3>
              Profissionais
              <br />
              Especializados
            </h3>

            <p>Experiência e técnica para o melhor resultado.</p>
          </div>
        </article>

        <article className="beneficio">
          <div className="beneficio-icon">
            <Clock3 size={29} />
          </div>

          <div>
            <h3>
              Agendamento
              <br />
              Rápido
            </h3>

            <p>Marque seu horário de forma simples e prática.</p>
          </div>
        </article>

        <article className="beneficio">
          <div className="beneficio-icon">
            <Armchair size={29} />
          </div>

          <div>
            <h3>
              Ambiente
              <br />
              Premium
            </h3>

            <p>Conforto, higiene e atendimento de alto nível.</p>
          </div>
        </article>

        <article className="beneficio">
          <div className="beneficio-icon">
            <Star size={29} />
          </div>

          <div>
            <h3>
              Seu Estilo
              <br />
              Único
            </h3>

            <p>Cada cliente, um estilo. Cada detalhe, especial.</p>
          </div>
        </article>
      </section>

      {/* ======================================================
          SERVIÇOS
      ====================================================== */}

      <section id="lista-servicos" className="servicos-section">
        {/* CATEGORIAS */}

        <div className="servicos-filter">
          {categorias.map((categoria) => (
            <span
              key={categoria.valor}
              className={
                categoriaAtiva === categoria.valor
                  ? "categoria-item active"
                  : "categoria-item"
              }
              onClick={() => {
                setCategoriaAtiva(categoria.valor);

                setMostrarTodos(false);
              }}
            >
              {categoria.nome}
            </span>
          ))}
        </div>

        {/* LOADING */}

        {loading && <p className="servicos-loading">Carregando serviços...</p>}

        {/* NENHUM SERVIÇO */}

        {!loading && servicosFiltrados.length === 0 && (
          <p className="nenhum-servico">Nenhum serviço encontrado.</p>
        )}

        {/* ====================================================
            CARDS
        ==================================================== */}

        <div className="servicos-grid">
          {servicosExibidos.map((servico) => (
            <article className="servico-card" key={servico.id}>
              <div className="servico-card-top">
                <h2>{servico.nome}</h2>

                <span className="servico-preco">
                  R$ {Number(servico.preco).toFixed(2).replace(".", ",")}
                </span>
              </div>

              <div className="servico-divider" />

              <div className="servico-card-bottom">
                <div className="servico-tempo">
                  <Clock3 size={16} />

                  <span>{servico.duracaoMinutos} MIN</span>
                </div>

                <button
                  type="button"
                  className="selecionar-servico"
                  onClick={() => selecionarServico(servico)}
                >
                  Selecionar
                  <ChevronRight size={16} />
                </button>
              </div>
            </article>
          ))}
        </div>

        {/* ====================================================
            VER TODOS
        ==================================================== */}

        {servicosFiltrados.length > 6 && (
          <button
            type="button"
            className="mostrar-servicos-button"
            onClick={() => setMostrarTodos(!mostrarTodos)}
          >
            {mostrarTodos ? "Mostrar menos" : "Ver todos os serviços"}

            <ChevronDown
              size={19}
              className={mostrarTodos ? "seta-aberta" : ""}
            />
          </button>
        )}
      </section>

      {/* ======================================================
          CTA
      ====================================================== */}

      <section className="cta-agendamento">
        <div className="cta-icon">
          <CalendarDays size={27} />
        </div>

        <div className="cta-text">
          <h2>Pronto para transformar seu visual?</h2>

          <p>Agende seu horário e viva a experiência Vila Branca.</p>
        </div>

        <button type="button" onClick={irParaServicos}>
          <CalendarDays size={18} />
          Agendar agora
        </button>
      </section>

      {/* ======================================================
          FOOTER
      ====================================================== */}

      <footer className="cliente-footer">
        {/* MARCA */}

        <div className="footer-brand">
          <span>BARBEARIA</span>

          <strong>Vila Branca</strong>
        </div>

        {/* CONTATO */}

        <div className="footer-info">
          <h4>Contato</h4>

          <p>(83) 99180-3325</p>

          <p>
            <MapPin size={14} />
            Dionizio Rodrigues, 99 - 58255-000 Centro, Solânea - PB
          </p>
        </div>

        {/* HORÁRIO */}

        <div className="footer-info">
          <h4>Horário de funcionamento</h4>

          <p>Segunda a Sexta</p>

          <p>08:00 - 20:00</p>

          <p>Sábado</p>

          <p>08:00 - 18:00</p>
        </div>

        {/* REDES */}

        <div className="footer-info">
          <h4>Siga-nos</h4>

          <div className="social-icons">
            <p>@barbeariavilabranca</p>
          </div>
        </div>

        {/* PAGAMENTO */}

        <div className="footer-info">
          <h4>Formas de pagamento</h4>

          <div className="formas-pagamento">
            <p>Pix</p>

            <p>Débito</p>

            <p>Crédito</p>

            <p>Dinheiro</p>
          </div>
        </div>
      </footer>
    </main>
  );
}

export default Servico;
