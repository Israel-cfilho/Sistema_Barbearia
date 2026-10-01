import {
  BarChart3,
  CalendarDays,
  LayoutDashboard,
  LogOut,
  Scissors,
  Settings2,
  Users,
} from "lucide-react";

import { useLocation, useNavigate } from "react-router-dom";

import "./donoSidebar.css";

function DonoSidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  function navegar(rota) {
    navigate(rota);
  }

  function ativo(rota) {
    if (rota === "/admin") {
      return location.pathname === "/admin";
    }

    return location.pathname.startsWith(rota);
  }

  function irParaBarbeiro() {
    localStorage.setItem("roleAtiva", "BARBEIRO");

    navigate("/barbeiro");
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

  return (
    <aside className="dono-sidebar">
      <div className="dono-sidebar-logo">
        <span>VILA</span>
        <strong>BRANCA</strong>
      </div>

      <nav className="dono-sidebar-menu">
        <button
          className={
            ativo("/admin") ? "dono-menu-item active" : "dono-menu-item"
          }
          onClick={() => navegar("/admin")}
        >
          <LayoutDashboard size={18} />
          <span>Dashboard</span>
        </button>

        <button
          className={
            ativo("/admin/agendamentos")
              ? "dono-menu-item active"
              : "dono-menu-item"
          }
          onClick={() => navegar("/admin/agendamentos")}
        >
          <CalendarDays size={18} />
          <span>Agendamentos</span>
        </button>

        <button
          className={
            ativo("/admin/barbeiros")
              ? "dono-menu-item active"
              : "dono-menu-item"
          }
          onClick={() => navegar("/admin/barbeiros")}
        >
          <Users size={18} />
          <span>Barbeiros</span>
        </button>

        <button
          className={
            ativo("/admin/servicos")
              ? "dono-menu-item active"
              : "dono-menu-item"
          }
          onClick={() => navegar("/admin/servicos")}
        >
          <Scissors size={18} />
          <span>Serviços</span>
        </button>

        <button
          className={
            ativo("/admin/relatorios")
              ? "dono-menu-item active"
              : "dono-menu-item"
          }
          onClick={() => navegar("/admin/relatorios")}
        >
          <BarChart3 size={18} />
          <span>Relatórios</span>
        </button>
      </nav>

      <div className="dono-sidebar-bottom">
        <button className="dono-menu-item" onClick={irParaBarbeiro}>
          <Settings2 size={18} />
          <span>Área do Barbeiro</span>
        </button>

        <button className="dono-menu-item dono-logout" onClick={sair}>
          <LogOut size={18} />
          <span>Sair</span>
        </button>
      </div>
    </aside>
  );
}

export default DonoSidebar;
