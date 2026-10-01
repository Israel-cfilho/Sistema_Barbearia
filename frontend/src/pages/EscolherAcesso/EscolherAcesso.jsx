import { ArrowRight, LayoutDashboard, Scissors } from "lucide-react";

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import logo from "../../assets/logo.png";

import "./escolherAcesso.css";

function EscolherAcesso() {
  const navigate = useNavigate();

  const roles = JSON.parse(localStorage.getItem("roles") || "[]");

  const ehDono = roles.includes("DONO");
  const ehBarbeiro = roles.includes("BARBEIRO");

  useEffect(() => {
    if (!ehDono || !ehBarbeiro) {
      navigate("/");
    }
  }, [ehDono, ehBarbeiro, navigate]);
  // ============================================
  // PAINEL DO DONO
  // ============================================

  function entrarComoDono() {
    localStorage.setItem("roleAtiva", "DONO");

    navigate("/admin");
  }

  // ============================================
  // ÁREA DO BARBEIRO
  // ============================================

  function entrarComoBarbeiro() {
    localStorage.setItem("roleAtiva", "BARBEIRO");

    navigate("/barbeiro");
  }

  return (
    <main className="acesso-page">
      <section className="acesso-container">
        <img src={logo} alt="Barbearia Vila Branca" className="acesso-logo" />

        <div className="acesso-cabecalho">
          <span className="acesso-label">ACESSO AO SISTEMA</span>

          <h1>
            Como deseja
            <strong> acessar?</strong>
          </h1>

          <p>
            Sua conta possui acesso administrativo e também à área do barbeiro.
          </p>
        </div>

        <div className="acesso-opcoes">
          {/* DONO */}
          <button
            type="button"
            className="acesso-card"
            onClick={entrarComoDono}
          >
            <div className="acesso-icon">
              <LayoutDashboard size={27} />
            </div>

            <div className="acesso-card-texto">
              <span>ADMINISTRAÇÃO</span>

              <h2>Painel da barbearia</h2>

              <p>
                Gerencie barbeiros, serviços, agendamentos, faturamento e
                relatórios.
              </p>
            </div>

            <ArrowRight className="acesso-arrow" size={22} />
          </button>

          {/* BARBEIRO */}
          <button
            type="button"
            className="acesso-card"
            onClick={entrarComoBarbeiro}
          >
            <div className="acesso-icon">
              <Scissors size={27} />
            </div>

            <div className="acesso-card-texto">
              <span>ATENDIMENTOS</span>

              <h2>Painel do Barbeiro</h2>

              <p>Acesse sua agenda, atendimentos e acompanhe seu desempenho.</p>
            </div>

            <ArrowRight className="acesso-arrow" size={22} />
          </button>
        </div>

        <button
          type="button"
          className="acesso-sair"
          onClick={() => {
            localStorage.clear();
            navigate("/");
          }}
        >
          Sair da conta
        </button>
      </section>
    </main>
  );
}

export default EscolherAcesso;
