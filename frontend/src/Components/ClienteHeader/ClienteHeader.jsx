import { useEffect, useState } from "react";

import {
  useLocation,
  useNavigate,
} from "react-router-dom";

import {
  CalendarDays,
  CircleUserRound,
  Home,
  LogIn,
  LogOut,
  Menu,
  Scissors,
  UserPlus,
} from "lucide-react";

import "./clienteHeader.css";

function verificarClienteLogado() {
  let roles = [];

  try {
    roles = JSON.parse(
      localStorage.getItem("roles") || "[]"
    );
  } catch {
    roles = [];
  }

  const role = localStorage.getItem("role");
  const roleAtiva = localStorage.getItem("roleAtiva");

  return (
    roles.includes("CLIENTE") ||
    role === "CLIENTE" ||
    roleAtiva === "CLIENTE"
  );
}

function ClienteHeader() {
  const navigate = useNavigate();
  const location = useLocation();

  /*
   * IMPORTANTE:
   * O estado já começa verificando o localStorage.
   * Assim o header não começa como visitante.
   */
  const [clienteLogado, setClienteLogado] = useState(
    verificarClienteLogado()
  );

  const [menuAberto, setMenuAberto] = useState(false);

  /*
   * Atualiza o estado quando a rota muda
   * ou quando o login/logout dispara authChange.
   */
  useEffect(() => {
    function atualizarLogin() {
      setClienteLogado(verificarClienteLogado());
    }

    atualizarLogin();

    window.addEventListener(
      "authChange",
      atualizarLogin
    );

    return () => {
      window.removeEventListener(
        "authChange",
        atualizarLogin
      );
    };
  }, [location.pathname]);

  /*
   * Também verifica quando a página volta a ficar visível.
   */
  useEffect(() => {
    function verificarAoVoltar() {
      setClienteLogado(verificarClienteLogado());
    }

    window.addEventListener(
      "focus",
      verificarAoVoltar
    );

    return () => {
      window.removeEventListener(
        "focus",
        verificarAoVoltar
      );
    };
  }, []);

  function navAtivo() {
    const rotaAtual = location.pathname;

    if (
      rotaAtual === "/" ||
      rotaAtual === "/servicos"
    ) {
      return "inicio";
    }

    if (
      rotaAtual === "/agendamentos" ||
      rotaAtual === "/confirmar-agendamento" ||
      rotaAtual === "/meus-agendamentos"
    ) {
      return "agendamentos";
    }

    if (
      rotaAtual === "/perfil" ||
      rotaAtual === "/perfil-cliente"
    ) {
      return "perfil";
    }

    return "";
  }

  const ativo = navAtivo();

  function irParaInicio() {
    navigate("/");
    setMenuAberto(false);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function irParaServicos() {
    setMenuAberto(false);

    if (
      location.pathname === "/" ||
      location.pathname === "/servicos"
    ) {
      document
        .getElementById("lista-servicos")
        ?.scrollIntoView({
          behavior: "smooth",
        });

      return;
    }

    navigate("/");

    setTimeout(() => {
      document
        .getElementById("lista-servicos")
        ?.scrollIntoView({
          behavior: "smooth",
        });
    }, 100);
  }

  function irParaAgendamentos() {
    if (!clienteLogado) {
      navigate("/login");
      setMenuAberto(false);
      return;
    }

    navigate("/meus-agendamentos");
    setMenuAberto(false);
  }

  function irParaPerfil() {
    if (!clienteLogado) {
      navigate("/login");
      setMenuAberto(false);
      return;
    }

    navigate("/perfil-cliente");
    setMenuAberto(false);
  }

  function irParaLogin() {
    navigate("/login");
    setMenuAberto(false);
  }

  function irParaCadastro() {
    navigate("/cadastro");
    setMenuAberto(false);
  }

  async function sair() {
    try {
      await fetch(
        "http://localhost:8080/auth/logout",
        {
          method: "POST",
          credentials: "include",
        }
      );
    } catch (error) {
      console.error(
        "Erro ao realizar logout:",
        error
      );
    } finally {
      localStorage.removeItem("role");
      localStorage.removeItem("roles");
      localStorage.removeItem("roleAtiva");

      localStorage.removeItem(
        "servicoSelecionado"
      );

      localStorage.removeItem(
        "redirecionarAposLogin"
      );

      localStorage.removeItem(
        "dadosAgendamento"
      );

      setClienteLogado(false);
      setMenuAberto(false);

      window.dispatchEvent(
        new Event("authChange")
      );

      navigate("/");
    }
  }

  return (
    <>
      <header className="cliente-header">

        {/* LOGO */}
        <div
          className="cliente-logo"
          onClick={irParaInicio}
        >
          <span>
            BARBEARIA
          </span>

          <strong>
            Vila Branca
          </strong>
        </div>

        {/* MENU DESKTOP */}
        <nav className="desktop-menu">

          {/* INÍCIO */}
          <button
            className={
              ativo === "inicio"
                ? "active"
                : ""
            }
            onClick={irParaInicio}
          >
            <Home size={16} />
            Início
          </button>

          {/* SERVIÇOS */}
          <button
            onClick={irParaServicos}
          >
            <Scissors size={16} />
            Serviços
          </button>

          {/* CLIENTE LOGADO */}
          {clienteLogado && (
            <>
              <button
                className={
                  ativo === "agendamentos"
                    ? "active"
                    : ""
                }
                onClick={
                  irParaAgendamentos
                }
              >
                <CalendarDays size={16} />
                Agendamentos
              </button>

              <button
                className={
                  ativo === "perfil"
                    ? "active"
                    : ""
                }
                onClick={irParaPerfil}
              >
                <CircleUserRound size={16} />
                Perfil
              </button>

              <button onClick={sair}>
                <LogOut size={16} />
                Sair
              </button>
            </>
          )}

          {/* VISITANTE */}
          {!clienteLogado && (
            <>
              <button
                onClick={irParaLogin}
              >
                <LogIn size={16} />
                Entrar
              </button>

              <button
                onClick={irParaCadastro}
              >
                <UserPlus size={16} />
                Cadastre-se
              </button>
            </>
          )}

        </nav>

        {/* BOTÃO MOBILE */}
        <button
          type="button"
          className="menu-mobile-button"
          onClick={() =>
            setMenuAberto(!menuAberto)
          }
          aria-label="Abrir menu"
        >
          <Menu size={23} />
        </button>

      </header>

      {/* MENU MOBILE */}
      {menuAberto && (
        <nav className="mobile-menu">

          <button
            className={
              ativo === "inicio"
                ? "active"
                : ""
            }
            onClick={irParaInicio}
          >
            <Home size={18} />
            Início
          </button>

          <button
            onClick={irParaServicos}
          >
            <Scissors size={18} />
            Serviços
          </button>

          {clienteLogado && (
            <>
              <button
                className={
                  ativo === "agendamentos"
                    ? "active"
                    : ""
                }
                onClick={
                  irParaAgendamentos
                }
              >
                <CalendarDays size={18} />
                Agendamentos
              </button>

              <button
                className={
                  ativo === "perfil"
                    ? "active"
                    : ""
                }
                onClick={irParaPerfil}
              >
                <CircleUserRound size={18} />
                Perfil
              </button>

              <button onClick={sair}>
                <LogOut size={18} />
                Sair
              </button>
            </>
          )}

          {!clienteLogado && (
            <>
              <button
                onClick={irParaLogin}
              >
                <LogIn size={18} />
                Entrar
              </button>

              <button
                onClick={irParaCadastro}
              >
                <UserPlus size={18} />
                Cadastre-se
              </button>
            </>
          )}

        </nav>
      )}
    </>
  );
}

export default ClienteHeader;