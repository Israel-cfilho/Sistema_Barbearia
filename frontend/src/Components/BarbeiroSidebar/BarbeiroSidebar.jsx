import { useState } from "react";

import {
  CalendarDays,
  ChartNoAxesColumnIncreasing,
  CircleUserRound,
  LayoutDashboard,
  LogOut,
  Menu,
  Scissors,
  Shield,
  X,
} from "lucide-react";

import { useLocation, useNavigate } from "react-router-dom";

import "./barbeiroSidebar.css";

function BarbeiroSidebar() {
  console.log(">>> BARBEIRO SIDEBAR ALTERADA CARREGOU <<<");
  const navigate = useNavigate();
  const location = useLocation();

  const [menuAberto, setMenuAberto] = useState(false);

  const roles = JSON.parse(localStorage.getItem("roles") || "[]");

  const ehDono = roles.includes("DONO");

  function navegar(rota) {
    navigate(rota);
    setMenuAberto(false);
  }

  function irParaAdmin() {
    localStorage.setItem("roleAtiva", "DONO");

    navigate("/admin");
    setMenuAberto(false);
  }

  async function sair() {
    try {
      await fetch("http://localhost:8080/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    } finally {
      localStorage.removeItem("role");
      localStorage.removeItem("roles");
      localStorage.removeItem("roleAtiva");

      navigate("/");
    }
  }

  function estaAtivo(rota) {
    if (rota === "/barbeiro") {
      return location.pathname === "/barbeiro";
    }

    return location.pathname.startsWith(rota);
  }

  return (
    <>
      {/* HEADER MOBILE */}
      <header className="barbeiro-mobile-header">
        <div className="barbeiro-mobile-logo">
          <span>VILA</span>
          <strong>BRANCA</strong>
        </div>

        <button
          type="button"
          className="barbeiro-mobile-menu-button"
          onClick={() => setMenuAberto(true)}
          aria-label="Abrir menu"
        >
          <Menu size={24} />
        </button>
      </header>

      {/* OVERLAY */}
      {menuAberto && (
        <div
          className="barbeiro-sidebar-overlay"
          onClick={() => setMenuAberto(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside className={`barbeiro-sidebar ${menuAberto ? "aberta" : ""}`}>
        <div className="barbeiro-sidebar-topo">
          <div className="barbeiro-sidebar-logo">
            <span>VILA</span>
            <strong>BRANCA</strong>
          </div>

          <button
            type="button"
            className="barbeiro-sidebar-close"
            onClick={() => setMenuAberto(false)}
            aria-label="Fechar menu"
          >
            <X size={22} />
          </button>
        </div>

        <nav className="barbeiro-sidebar-menu">
          <button
            type="button"
            className={
              estaAtivo("/barbeiro")
                ? "barbeiro-sidebar-item active"
                : "barbeiro-sidebar-item"
            }
            onClick={() => navegar("/barbeiro")}
          >
            <LayoutDashboard size={18} />
            <span>Dashboard</span>
          </button>

          <button
            type="button"
            className={
              estaAtivo("/barbeiro/agenda")
                ? "barbeiro-sidebar-item active"
                : "barbeiro-sidebar-item"
            }
            onClick={() => navegar("/barbeiro/agenda")}
          >
            <CalendarDays size={18} />
            <span>Minha Agenda</span>
          </button>

          <button
            type="button"
            className={
              estaAtivo("/barbeiro/atendimentos")
                ? "barbeiro-sidebar-item active"
                : "barbeiro-sidebar-item"
            }
            onClick={() => navegar("/barbeiro/atendimentos")}
          >
            <Scissors size={18} />
            <span>Atendimentos</span>
          </button>

          <button
            type="button"
            className={
              estaAtivo("/barbeiro/desempenho")
                ? "barbeiro-sidebar-item active"
                : "barbeiro-sidebar-item"
            }
            onClick={() => navegar("/barbeiro/desempenho")}
          >
            <ChartNoAxesColumnIncreasing size={18} />

            <span>Meu Desempenho</span>
          </button>

          <button
            type="button"
            className={
              estaAtivo("/barbeiro/perfil")
                ? "barbeiro-sidebar-item active"
                : "barbeiro-sidebar-item"
            }
            onClick={() => navegar("/barbeiro/perfil")}
          >
            <CircleUserRound size={18} />
            <span>Meu Perfil</span>
          </button>
        </nav>

        <div className="barbeiro-sidebar-bottom">
          {ehDono && (
            <button
              type="button"
              className="barbeiro-sidebar-item barbeiro-admin"
              onClick={irParaAdmin}
            >
              <Shield size={18} />
              <span>Painel do Admin</span>
            </button>
          )}

          <button
            type="button"
            className="barbeiro-sidebar-item barbeiro-sair"
            onClick={sair}
          >
            <LogOut size={18} />
            <span>Sair</span>
          </button>
        </div>
      </aside>
    </>
  );
}

export default BarbeiroSidebar;
